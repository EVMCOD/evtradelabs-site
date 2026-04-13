//+------------------------------------------------------------------+
//|                                              EVMetricas.mq5      |
//|                              EV Trading Labs — evtradelabs.com   |
//|                                                                  |
//|  Conecta tu cuenta MT5 con EV Métricas.                         |
//|  El EA envía tu historial y balance en tiempo real vía HTTPS.   |
//|  Solo lectura — no puede abrir ni cerrar operaciones.           |
//+------------------------------------------------------------------+
#property copyright "EV Trading Labs"
#property link      "https://evtradelabs.com"
#property version   "1.00"
#property description "EV Métricas — sincroniza tu cuenta con el dashboard"

//--- Inputs
input string InpServerURL    = "https://evtradelabs.com"; // URL del servidor (no modificar)
input string InpAPIKey       = "";                         // API Key (pégala desde tu dashboard)
input int    InpSyncInterval = 60;                         // Intervalo heartbeat en segundos

//--- Globals
string g_SyncEndpoint;
bool   g_Initialized = false;

//+------------------------------------------------------------------+
int OnInit()
{
   if(StringLen(InpAPIKey) < 10)
   {
      Alert("EVMetricas: Introduce tu API Key en los parámetros del EA.\n"
            "La encontrarás en: evtradelabs.com/metricas/dashboard");
      return INIT_FAILED;
   }

   g_SyncEndpoint = InpServerURL + "/api/metricas/sync";
   g_Initialized  = true;

   // Primer sync completo (historial + posiciones abiertas)
   Print("EVMetricas: Iniciando sync completo...");
   SyncFull();

   EventSetTimer(InpSyncInterval);
   Print("EVMetricas: OK — heartbeat cada ", InpSyncInterval, "s → ", g_SyncEndpoint);
   return INIT_SUCCEEDED;
}

//+------------------------------------------------------------------+
void OnDeinit(const int reason)
{
   EventKillTimer();
   if(g_Initialized)
      SendPayload("{\"event\":\"disconnected\",\"account\":" + AccountJSON() + "}");
}

//+------------------------------------------------------------------+
// Timer: heartbeat periódico con balance/equity actualizados
//+------------------------------------------------------------------+
void OnTimer()
{
   SendPayload("{\"event\":\"heartbeat\",\"account\":" + AccountJSON() + "}");
}

//+------------------------------------------------------------------+
// Trade event: sync completo cuando se cierra o abre una operación
//+------------------------------------------------------------------+
void OnTradeTransaction(const MqlTradeTransaction &trans,
                        const MqlTradeRequest    &request,
                        const MqlTradeResult     &result)
{
   if(trans.type == TRADE_TRANSACTION_DEAL_ADD)
   {
      Print("EVMetricas: Nuevo deal detectado — sincronizando...");
      SyncFull();
   }
}

//+------------------------------------------------------------------+
// Sync completo: cuenta + historial de deals + posiciones abiertas
//+------------------------------------------------------------------+
void SyncFull()
{
   string body = "{\"event\":\"sync\","
                 "\"account\":" + AccountJSON() + ","
                 "\"trades\":"  + TradesJSON()  + ","
                 "\"open_positions\":" + PositionsJSON() + "}";
   SendPayload(body);
}

//+------------------------------------------------------------------+
// JSON helpers
//+------------------------------------------------------------------+

string AccountJSON()
{
   return StringFormat(
      "{\"login\":\"%d\","
       "\"name\":\"%s\","
       "\"server\":\"%s\","
       "\"broker\":\"%s\","
       "\"currency\":\"%s\","
       "\"balance\":%.2f,"
       "\"equity\":%.2f,"
       "\"margin\":%.2f,"
       "\"free_margin\":%.2f,"
       "\"leverage\":%d}",
      (int)AccountInfoInteger(ACCOUNT_LOGIN),
      EscapeJson(AccountInfoString(ACCOUNT_NAME)),
      EscapeJson(AccountInfoString(ACCOUNT_SERVER)),
      EscapeJson(AccountInfoString(ACCOUNT_COMPANY)),
      AccountInfoString(ACCOUNT_CURRENCY),
      AccountInfoDouble(ACCOUNT_BALANCE),
      AccountInfoDouble(ACCOUNT_EQUITY),
      AccountInfoDouble(ACCOUNT_MARGIN),
      AccountInfoDouble(ACCOUNT_FREEMARGIN),
      (int)AccountInfoInteger(ACCOUNT_LEVERAGE)
   );
}

string TradesJSON()
{
   // Selecciona todo el historial desde el inicio
   HistorySelect(0, TimeCurrent());

   string result = "[";
   bool   first  = true;
   int    total  = HistoryDealsTotal();

   for(int i = 0; i < total; i++)
   {
      ulong ticket = HistoryDealGetTicket(i);
      if(ticket == 0) continue;

      long dealType  = HistoryDealGetInteger(ticket, DEAL_TYPE);
      long dealEntry = HistoryDealGetInteger(ticket, DEAL_ENTRY);

      // Solo compras y ventas de mercado
      if(dealType != DEAL_TYPE_BUY && dealType != DEAL_TYPE_SELL) continue;
      // Solo entradas y salidas (no balance/crédito)
      if(dealEntry != DEAL_ENTRY_IN && dealEntry != DEAL_ENTRY_OUT) continue;

      string symbol     = HistoryDealGetString(ticket, DEAL_SYMBOL);
      double lots       = HistoryDealGetDouble(ticket, DEAL_VOLUME);
      double price      = HistoryDealGetDouble(ticket, DEAL_PRICE);
      double profit     = HistoryDealGetDouble(ticket, DEAL_PROFIT);
      double commission = HistoryDealGetDouble(ticket, DEAL_COMMISSION);
      double swap       = HistoryDealGetDouble(ticket, DEAL_SWAP);
      datetime time     = (datetime)HistoryDealGetInteger(ticket, DEAL_TIME);
      long   positionId = HistoryDealGetInteger(ticket, DEAL_POSITION_ID);
      string comment    = EscapeJson(HistoryDealGetString(ticket, DEAL_COMMENT));

      if(!first) result += ",";
      result += StringFormat(
         "{\"ticket\":\"%I64u\","
          "\"positionId\":\"%I64d\","
          "\"symbol\":\"%s\","
          "\"type\":\"%s\","
          "\"lots\":%.2f,"
          "\"price\":%.5f,"
          "\"profit\":%.2f,"
          "\"commission\":%.2f,"
          "\"swap\":%.2f,"
          "\"entry\":\"%s\","
          "\"time\":\"%s\","
          "\"comment\":\"%s\"}",
         ticket,
         positionId,
         symbol,
         (dealType == DEAL_TYPE_BUY) ? "buy" : "sell",
         lots,
         price,
         profit,
         commission,
         swap,
         (dealEntry == DEAL_ENTRY_IN) ? "in" : "out",
         TimeToString(time, TIME_DATE | TIME_SECONDS),
         comment
      );
      first = false;
   }

   result += "]";
   return result;
}

string PositionsJSON()
{
   string result = "[";
   bool   first  = true;
   int    total  = PositionsTotal();

   for(int i = 0; i < total; i++)
   {
      ulong ticket = PositionGetTicket(i);
      if(ticket == 0) continue;

      if(!first) result += ",";
      result += StringFormat(
         "{\"ticket\":\"%I64u\","
          "\"symbol\":\"%s\","
          "\"type\":\"%s\","
          "\"lots\":%.2f,"
          "\"openPrice\":%.5f,"
          "\"currentPrice\":%.5f,"
          "\"profit\":%.2f,"
          "\"swap\":%.2f,"
          "\"openTime\":\"%s\"}",
         ticket,
         PositionGetString(POSITION_SYMBOL),
         (PositionGetInteger(POSITION_TYPE) == POSITION_TYPE_BUY) ? "buy" : "sell",
         PositionGetDouble(POSITION_VOLUME),
         PositionGetDouble(POSITION_PRICE_OPEN),
         PositionGetDouble(POSITION_PRICE_CURRENT),
         PositionGetDouble(POSITION_PROFIT),
         PositionGetDouble(POSITION_SWAP),
         TimeToString((datetime)PositionGetInteger(POSITION_TIME), TIME_DATE | TIME_SECONDS)
      );
      first = false;
   }

   result += "]";
   return result;
}

//+------------------------------------------------------------------+
// HTTP POST al endpoint de sync
//+------------------------------------------------------------------+
void SendPayload(const string body)
{
   char req[];
   char res[];
   string resHeaders;
   string reqHeaders = "Content-Type: application/json\r\nX-API-Key: " + InpAPIKey;

   int bodyLen = StringLen(body);
   ArrayResize(req, bodyLen);
   StringToCharArray(body, req, 0, bodyLen, CP_UTF8);

   int statusCode = WebRequest(
      "POST",
      g_SyncEndpoint,
      reqHeaders,
      5000,   // timeout ms
      req,
      res,
      resHeaders
   );

   if(statusCode == -1)
   {
      int err = GetLastError();
      if(err == 4014)
         Print("EVMetricas ERROR: URL no permitida. "
               "Ve a MT5 → Herramientas → Opciones → Asesores Expertos → "
               "Permitir WebRequest para: ", InpServerURL);
      else
         Print("EVMetricas ERROR: WebRequest falló (código ", err, ")");
   }
   else if(statusCode == 401 || statusCode == 403)
   {
      Print("EVMetricas ERROR: API Key inválida o sin permiso (HTTP ", statusCode, ")");
   }
   else if(statusCode != 200 && statusCode != 201)
   {
      Print("EVMetricas WARN: HTTP ", statusCode, " — ", CharArrayToString(res));
   }
   // 200/201 → no logs para no saturar el diario
}

//+------------------------------------------------------------------+
// Escapa caracteres especiales JSON en strings
//+------------------------------------------------------------------+
string EscapeJson(const string input)
{
   string s = input;
   StringReplace(s, "\\", "\\\\");
   StringReplace(s, "\"", "\\\"");
   StringReplace(s, "\n", "\\n");
   StringReplace(s, "\r", "\\r");
   StringReplace(s, "\t", "\\t");
   return s;
}
