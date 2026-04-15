//+------------------------------------------------------------------+
//|                                           EVReplicador.mq5        |
//|                              EV Trading Labs — evtradelabs.com   |
//|                                                                  |
//|  Replica operaciones de una cuenta master a cuentas follower.   |
//|  Instala en la cuenta MASTER con Role = MASTER.                 |
//|  Instala en cada cuenta FOLLOWER con Role = FOLLOWER.           |
//+------------------------------------------------------------------+
#property copyright "EV Trading Labs"
#property link      "https://evtradelabs.com"
#property version   "1.00"
#property description "EV Replicador — replica operaciones entre cuentas MT5"

#include <Trade/Trade.mqh>

//--- Enums
enum ENUM_REP_ROLE  { ROLE_MASTER = 0, ROLE_FOLLOWER = 1 };
enum ENUM_LOT_MODE  { LOT_PROPORTIONAL = 0, LOT_RATIO = 1, LOT_FIXED = 2 };

//--- Inputs
input ENUM_REP_ROLE  InpRole            = ROLE_MASTER;       // Rol: MASTER o FOLLOWER
input string         InpServerURL       = "https://evtradelabs.com"; // URL servidor
input string         InpAPIKey          = "";                // API Key del Replicador
input int            InpHeartbeatSec    = 30;                // Heartbeat master (seg)
input int            InpPollSec         = 2;                 // Intervalo polling follower (seg)
input ENUM_LOT_MODE  InpLotMode         = LOT_PROPORTIONAL;  // [Follower] Modo de lotes
input double         InpLotValue        = 1.0;               // [Follower] Multiplicador / lotes fijos
input string         InpSymbolSuffix    = "";                // [Follower] Sufijo de símbolo (p.ej. ".ecn")
input bool           InpCopyStopLoss    = true;              // [Follower] Copiar Stop Loss
input bool           InpCopyTakeProfit  = true;              // [Follower] Copiar Take Profit
input int            InpMaxSlippage     = 30;                // [Follower] Slippage máx (puntos)
input bool           InpEnableTrading   = true;              // [Follower] Habilitar trading real

//--- Globals
CTrade  g_Trade;
string  g_ConnectURL;
string  g_SignalURL;
string  g_WaitURL;
string  g_ConfirmURL;
bool    g_Initialized = false;
bool    g_Polling     = false; // evita ejecuciones solapadas del long-poll

// Position map (follower): masterPositionId → local ticket
#define MAX_POS 200
struct PosEntry { string masterPosId; ulong ticket; };
PosEntry g_PosMap[MAX_POS];
int      g_PosCount = 0;

//+------------------------------------------------------------------+
int OnInit()
{
   if(StringLen(InpAPIKey) < 10)
   {
      Alert("EVReplicador: Falta la API Key. Ve a tu dashboard → Replicador.");
      return INIT_FAILED;
   }

   g_ConnectURL = InpServerURL + "/api/replicador/connect";
   g_SignalURL  = InpServerURL + "/api/replicador/signal";
   g_WaitURL    = InpServerURL + "/api/replicador/wait";
   g_ConfirmURL = InpServerURL + "/api/replicador/confirm";

   g_Trade.SetDeviationInPoints(InpMaxSlippage);

   // Registrar con el servidor
   SendConnect();

   // Master: heartbeat periódico. Follower: timer de 1s actúa como watchdog;
   // el long-poll bloquea el hilo, así que la espera real viene de WebRequest.
   int timerSec = (InpRole == ROLE_MASTER) ? InpHeartbeatSec : 1;
   EventSetTimer(timerSec);

   g_Initialized = true;
   string role = (InpRole == ROLE_MASTER) ? "MASTER" : "FOLLOWER";
   Print("EVReplicador: Iniciado como ", role, " | Account ", AccountInfoInteger(ACCOUNT_LOGIN));
   return INIT_SUCCEEDED;
}

//+------------------------------------------------------------------+
void OnDeinit(const int reason)
{
   EventKillTimer();
   g_Initialized = false;
}

//+------------------------------------------------------------------+
void OnTimer()
{
   if(!g_Initialized) return;

   if(InpRole == ROLE_MASTER)
   {
      SendConnect(); // heartbeat con balance actualizado
   }
   else
   {
      // g_Polling evita solapar cuando los eventos de timer se acumulan
      // durante el bloqueo del WebRequest (hasta 25s)
      if(g_Polling) return;
      g_Polling = true;
      PollAndExecute();
      g_Polling = false;
   }
}

//+------------------------------------------------------------------+
// MASTER: detecta nuevos deals y envía señales
//+------------------------------------------------------------------+
void OnTradeTransaction(const MqlTradeTransaction &trans,
                        const MqlTradeRequest     &request,
                        const MqlTradeResult      &result)
{
   if(InpRole != ROLE_MASTER) return;
   if(trans.type != TRADE_TRANSACTION_DEAL_ADD) return;

   ulong ticket = trans.deal;
   // Asegurar que el deal está en historia antes de seleccionarlo
   HistorySelect(TimeCurrent() - 86400, TimeCurrent() + 60);
   if(!HistoryDealSelect(ticket))
   {
      Print("EVReplicador MASTER: HistoryDealSelect falló para ticket=", ticket);
      return;
   }

   long dealType  = HistoryDealGetInteger(ticket, DEAL_TYPE);
   long dealEntry = HistoryDealGetInteger(ticket, DEAL_ENTRY);
   Print("EVReplicador MASTER: deal=", ticket, " type=", dealType, " entry=", dealEntry);

   // Solo BUY/SELL de mercado
   if(dealType  != DEAL_TYPE_BUY  && dealType  != DEAL_TYPE_SELL) return;
   if(dealEntry != DEAL_ENTRY_IN  && dealEntry != DEAL_ENTRY_OUT) return;

   string symbol     = HistoryDealGetString(ticket, DEAL_SYMBOL);
   double lots       = HistoryDealGetDouble(ticket, DEAL_VOLUME);
   double price      = HistoryDealGetDouble(ticket, DEAL_PRICE);
   double profit     = HistoryDealGetDouble(ticket, DEAL_PROFIT);
   string posId      = IntegerToString(HistoryDealGetInteger(ticket, DEAL_POSITION_ID));
   string ticketStr  = IntegerToString((long)ticket);
   double balance    = AccountInfoDouble(ACCOUNT_BALANCE);
   string typeStr    = (dealType == DEAL_TYPE_BUY) ? "buy" : "sell";

   if(dealEntry == DEAL_ENTRY_IN)
   {
      double sl = 0, tp = 0;
      if(PositionSelectByTicket(trans.position))
      {
         sl = PositionGetDouble(POSITION_SL);
         tp = PositionGetDouble(POSITION_TP);
      }

      string body = StringFormat(
         "{\"action\":\"open\","
         "\"symbol\":\"%s\","
         "\"type\":\"%s\","
         "\"lots\":%.2f,"
         "\"price\":%.5f,"
         "\"sl\":%.5f,"
         "\"tp\":%.5f,"
         "\"masterTicket\":\"%s\","
         "\"masterPositionId\":\"%s\","
         "\"masterBalance\":%.2f}",
         EscapeJson(symbol), typeStr, lots, price, sl, tp,
         ticketStr, posId, balance
      );
      HttpPost(g_SignalURL, body);
      Print("EVReplicador MASTER: señal open enviada — ", symbol, " ", typeStr, " ", lots);
   }
   else // DEAL_ENTRY_OUT
   {
      double closePrice = price;
      double swap       = HistoryDealGetDouble(ticket, DEAL_SWAP);
      double commission = HistoryDealGetDouble(ticket, DEAL_COMMISSION);

      string body = StringFormat(
         "{\"action\":\"close\","
         "\"symbol\":\"%s\","
         "\"type\":\"%s\","
         "\"lots\":%.2f,"
         "\"closePrice\":%.5f,"
         "\"profit\":%.2f,"
         "\"masterTicket\":\"%s\","
         "\"masterPositionId\":\"%s\","
         "\"masterBalance\":%.2f}",
         EscapeJson(symbol), typeStr, lots, closePrice,
         profit + swap + commission,
         ticketStr, posId, balance
      );
      HttpPost(g_SignalURL, body);
      Print("EVReplicador MASTER: señal close enviada — ", symbol, " P&L=", DoubleToString(profit, 2));
   }
}

//+------------------------------------------------------------------+
// FOLLOWER: poll → ejecutar → confirmar
//+------------------------------------------------------------------+
void PollAndExecute()
{
   string respBody;
   int status = HttpGet(g_WaitURL, respBody); // bloquea hasta señal o 25s timeout
   if(status != 200) return;

   // Extraer array de señales
   int sigStart = StringFind(respBody, "\"signals\":[");
   if(sigStart < 0) return;
   sigStart = StringFind(respBody, "[", sigStart);
   int sigEnd = StringFind(respBody, "]", sigStart + 1);
   if(sigEnd < 0) return;
   string arrStr = StringSubstr(respBody, sigStart + 1, sigEnd - sigStart - 1);
   string trimCheck = arrStr;
   StringTrimLeft(trimCheck);
   StringTrimRight(trimCheck);
   if(StringLen(trimCheck) == 0) return;

   // Dividir por objetos individuales (búsqueda de },{)
   string signals[];
   SplitObjects(arrStr, signals);

   for(int i = 0; i < ArraySize(signals); i++)
   {
      ProcessSignal(signals[i]);
   }
}

void ProcessSignal(const string sig)
{
   string execId     = ExtractStr(sig, "executionId");
   string action     = ExtractStr(sig, "action");
   string symbol     = ExtractStr(sig, "symbol");
   string orderType  = ExtractStr(sig, "type");
   double masterLots = ExtractNum(sig, "masterLots");
   double masterBal  = ExtractNum(sig, "masterBalance");
   double sl         = ExtractNum(sig, "sl");
   double tp         = ExtractNum(sig, "tp");
   string masterPosId = ExtractStr(sig, "masterPositionId");

   if(StringLen(execId) == 0 || StringLen(action) == 0) return;

   // Aplicar sufijo de símbolo
   string localSymbol = symbol;
   if(StringLen(InpSymbolSuffix) > 0)
      localSymbol = symbol + InpSymbolSuffix;

   if(action == "open")
   {
      if(!InpEnableTrading)
      {
         ConfirmExecution(execId, "skipped", 0, "trading deshabilitado");
         return;
      }

      double lots = ComputeLots(masterLots, masterBal, localSymbol);
      if(lots <= 0)
      {
         ConfirmExecution(execId, "failed", 0, "lots=0 tras normalización");
         return;
      }

      bool isBuy = (orderType == "buy");
      double askBid = isBuy ? SymbolInfoDouble(localSymbol, SYMBOL_ASK)
                            : SymbolInfoDouble(localSymbol, SYMBOL_BID);

      double useSL = InpCopyStopLoss  && sl > 0 ? sl : 0;
      double useTP = InpCopyTakeProfit && tp > 0 ? tp : 0;

      g_Trade.SetTypeFilling(GetFilling(localSymbol));

      bool ok = isBuy
         ? g_Trade.Buy (lots, localSymbol, askBid, useSL, useTP, "EVR")
         : g_Trade.Sell(lots, localSymbol, askBid, useSL, useTP, "EVR");

      if(ok && g_Trade.ResultRetcode() == TRADE_RETCODE_DONE)
      {
         ulong newTicket = g_Trade.ResultDeal();
         PosMapAdd(masterPosId, newTicket);
         ConfirmExecution(execId, "done", newTicket, "");
         Print("EVReplicador FOLLOWER: open OK ticket=", newTicket, " symbol=", localSymbol);
      }
      else
      {
         string err = IntegerToString(g_Trade.ResultRetcode()) + " " + g_Trade.ResultRetcodeDescription();
         ConfirmExecution(execId, "failed", 0, err);
         Print("EVReplicador FOLLOWER ERROR open: ", err);
      }
   }
   else if(action == "close")
   {
      // Buscar ticket en mapa local (o usar el que devuelve el servidor tras restart)
      ulong followerTicket = PosMapFind(masterPosId);
      if(followerTicket == 0)
      {
         // Intento con servidor — ExtractNum devuelve 0 si null
         double srvTicket = ExtractNum(sig, "followerTicket");
         if(srvTicket > 0) followerTicket = (ulong)srvTicket;
      }

      if(followerTicket == 0)
      {
         ConfirmExecution(execId, "skipped", 0, "ticket no encontrado");
         return;
      }

      if(!InpEnableTrading)
      {
         ConfirmExecution(execId, "skipped", followerTicket, "trading deshabilitado");
         return;
      }

      if(!PositionSelectByTicket(followerTicket))
      {
         // Posición ya cerrada (p.ej. SL/TP hit antes del poll)
         ConfirmExecution(execId, "done", followerTicket, "pos ya cerrada");
         PosMapRemove(masterPosId);
         return;
      }

      bool ok = g_Trade.PositionClose(followerTicket, InpMaxSlippage);

      if(ok && g_Trade.ResultRetcode() == TRADE_RETCODE_DONE)
      {
         PosMapRemove(masterPosId);
         ConfirmExecution(execId, "done", followerTicket, "");
         Print("EVReplicador FOLLOWER: close OK ticket=", followerTicket);
      }
      else
      {
         string err = IntegerToString(g_Trade.ResultRetcode()) + " " + g_Trade.ResultRetcodeDescription();
         ConfirmExecution(execId, "failed", followerTicket, err);
         Print("EVReplicador FOLLOWER ERROR close: ", err);
      }
   }
   else
   {
      ConfirmExecution(execId, "skipped", 0, "accion desconocida");
   }
}

//+------------------------------------------------------------------+
// Cálculo de lotes follower
//+------------------------------------------------------------------+
double ComputeLots(double masterLots, double masterBalance, const string symbol)
{
   double lots = masterLots;

   if(InpLotMode == LOT_PROPORTIONAL)
   {
      double followerBal = AccountInfoDouble(ACCOUNT_BALANCE);
      if(masterBalance > 0 && followerBal > 0)
         lots = masterLots * (followerBal / masterBalance);
      else
         lots = masterLots;
   }
   else if(InpLotMode == LOT_RATIO)
   {
      lots = masterLots * InpLotValue;
   }
   else // LOT_FIXED
   {
      lots = InpLotValue;
   }

   // Normalizar al paso mínimo del símbolo
   double step = SymbolInfoDouble(symbol, SYMBOL_VOLUME_STEP);
   double minL = SymbolInfoDouble(symbol, SYMBOL_VOLUME_MIN);
   double maxL = SymbolInfoDouble(symbol, SYMBOL_VOLUME_MAX);
   if(step <= 0) step = 0.01;

   lots = MathFloor(lots / step) * step;
   lots = MathMax(minL, MathMin(maxL, lots));
   lots = NormalizeDouble(lots, 2);
   return lots;
}

//+------------------------------------------------------------------+
// Confirmar ejecución al servidor
//+------------------------------------------------------------------+
void ConfirmExecution(const string execId, const string status,
                      ulong followerTicket, const string errMsg)
{
   string ticketPart = (followerTicket > 0)
      ? StringFormat(",\"followerTicket\":\"%I64u\"", followerTicket)
      : "";
   string errPart = (StringLen(errMsg) > 0)
      ? StringFormat(",\"error\":\"%s\"", EscapeJson(errMsg))
      : "";

   string body = StringFormat(
      "{\"executionId\":\"%s\",\"status\":\"%s\"%s%s}",
      execId, status, ticketPart, errPart
   );
   HttpPost(g_ConfirmURL, body);
}

//+------------------------------------------------------------------+
// Enviar heartbeat / registro al servidor
//+------------------------------------------------------------------+
void SendConnect()
{
   string body = StringFormat(
      "{\"account\":{"
      "\"login\":\"%d\","
      "\"name\":\"%s\","
      "\"broker\":\"%s\","
      "\"server\":\"%s\","
      "\"currency\":\"%s\","
      "\"balance\":%.2f,"
      "\"equity\":%.2f}}",
      (int)AccountInfoInteger(ACCOUNT_LOGIN),
      EscapeJson(AccountInfoString(ACCOUNT_NAME)),
      EscapeJson(AccountInfoString(ACCOUNT_COMPANY)),
      EscapeJson(AccountInfoString(ACCOUNT_SERVER)),
      AccountInfoString(ACCOUNT_CURRENCY),
      AccountInfoDouble(ACCOUNT_BALANCE),
      AccountInfoDouble(ACCOUNT_EQUITY)
   );
   HttpPost(g_ConnectURL, body);
}

//+------------------------------------------------------------------+
// Mapa de posiciones (follower)
//+------------------------------------------------------------------+
void PosMapAdd(const string masterPosId, ulong ticket)
{
   // Actualizar si ya existe
   for(int i = 0; i < g_PosCount; i++)
      if(g_PosMap[i].masterPosId == masterPosId) { g_PosMap[i].ticket = ticket; return; }
   if(g_PosCount < MAX_POS)
   {
      g_PosMap[g_PosCount].masterPosId = masterPosId;
      g_PosMap[g_PosCount].ticket      = ticket;
      g_PosCount++;
   }
}

ulong PosMapFind(const string masterPosId)
{
   for(int i = 0; i < g_PosCount; i++)
      if(g_PosMap[i].masterPosId == masterPosId) return g_PosMap[i].ticket;
   return 0;
}

void PosMapRemove(const string masterPosId)
{
   for(int i = 0; i < g_PosCount; i++)
   {
      if(g_PosMap[i].masterPosId == masterPosId)
      {
         for(int j = i; j < g_PosCount - 1; j++)
            g_PosMap[j] = g_PosMap[j + 1];
         g_PosCount--;
         return;
      }
   }
}

//+------------------------------------------------------------------+
// HTTP helpers
//+------------------------------------------------------------------+
int HttpPost(const string url, const string body)
{
   char  req[], res[];
   string resHeaders;
   string reqHeaders = "Content-Type: application/json\r\nX-Api-Key: " + InpAPIKey;

   // Encoding correcto: uchar→char, sin null terminator
   uchar raw[];
   int byteCount = StringToCharArray(body, raw, 0, WHOLE_ARRAY, CP_UTF8);
   if(byteCount > 1) byteCount--; // quitar null terminator
   else byteCount = 0;
   ArrayResize(req, byteCount);
   for(int k = 0; k < byteCount; k++) req[k] = (char)raw[k];

   int code = WebRequest("POST", url, reqHeaders, 5000, req, res, resHeaders);
   if(code == -1)
   {
      int err = GetLastError();
      if(err == 4014)
         Print("EVReplicador ERROR: URL no permitida. Agrega ", InpServerURL,
               " en MT5 → Opciones → Asesores Expertos → WebRequest");
      else
         Print("EVReplicador ERROR WebRequest: código ", err);
   }
   else if(code == 401 || code == 403)
      Print("EVReplicador ERROR: API Key inválida (HTTP ", code, ")");
   else if(code >= 400)
   {
      string resp = CharArrayToString(res, 0, WHOLE_ARRAY, CP_UTF8);
      Print("EVReplicador WARN: HTTP ", code, " → POST ", url);
      Print("EVReplicador WARN: body enviado: ", body);
      Print("EVReplicador WARN: respuesta: ", resp);
   }
   return code;
}

int HttpGet(const string url, string &respBody)
{
   char  req[], res[];
   string resHeaders;
   string reqHeaders = "X-Api-Key: " + InpAPIKey;
   ArrayResize(req, 0);

   // 25000ms timeout: el servidor retiene la conexión hasta 20s
   int code = WebRequest("GET", url, reqHeaders, 25000, req, res, resHeaders);
   if(code == 200)
      respBody = CharArrayToString(res, 0, ArraySize(res), CP_UTF8);
   else if(code == -1)
   {
      int err = GetLastError();
      if(err == 4014)
         Print("EVReplicador ERROR: URL no permitida → ", url);
      else
         Print("EVReplicador ERROR WebRequest GET: código ", err);
   }
   return code;
}

//+------------------------------------------------------------------+
// JSON parsing helpers (sin librería externa)
//+------------------------------------------------------------------+

// Extrae valor string de "key":"value"
string ExtractStr(const string json, const string key)
{
   string search = "\"" + key + "\":\"";
   int pos = StringFind(json, search);
   if(pos < 0) return "";
   pos += StringLen(search);
   int end = StringFind(json, "\"", pos);
   if(end < 0) return "";
   return StringSubstr(json, pos, end - pos);
}

// Extrae valor numérico de "key":123.45
double ExtractNum(const string json, const string key)
{
   string search = "\"" + key + "\":";
   int pos = StringFind(json, search);
   if(pos < 0) return 0;
   pos += StringLen(search);
   string rest = StringSubstr(json, pos, 20);
   if(StringSubstr(rest, 0, 4) == "null") return 0;
   return StringToDouble(rest);
}

// Divide un JSON array (sin corchetes externos) en objetos individuales
void SplitObjects(const string arr, string &out[])
{
   ArrayResize(out, 0);
   int len   = StringLen(arr);
   int depth = 0;
   int start = -1;

   for(int i = 0; i < len; i++)
   {
      ushort c = StringGetCharacter(arr, i);
      if(c == '{')
      {
         if(depth == 0) start = i;
         depth++;
      }
      else if(c == '}')
      {
         depth--;
         if(depth == 0 && start >= 0)
         {
            int sz = ArraySize(out);
            ArrayResize(out, sz + 1);
            out[sz] = StringSubstr(arr, start, i - start + 1);
            start = -1;
         }
      }
   }
}

//+------------------------------------------------------------------+
// Detecta el modo de filling soportado por el broker para el símbolo
//+------------------------------------------------------------------+
ENUM_ORDER_TYPE_FILLING GetFilling(const string symbol)
{
   int modes = (int)SymbolInfoInteger(symbol, SYMBOL_FILLING_MODE);
   if((modes & SYMBOL_FILLING_IOC) != 0) return ORDER_FILLING_IOC;
   if((modes & SYMBOL_FILLING_FOK) != 0) return ORDER_FILLING_FOK;
   return ORDER_FILLING_RETURN;
}

//+------------------------------------------------------------------+
string EscapeJson(const string src)
{
   string s = src;
   StringReplace(s, "\\", "\\\\");
   StringReplace(s, "\"", "\\\"");
   StringReplace(s, "\n", "\\n");
   StringReplace(s, "\r", "\\r");
   StringReplace(s, "\t", "\\t");
   return s;
}
