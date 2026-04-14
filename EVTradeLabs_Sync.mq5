//+------------------------------------------------------------------+
//| EVTradeLabs_Sync.mq5                                              |
//+------------------------------------------------------------------+
#property copyright "EVTradeLabs"
#property version   "1.3"
#property strict

#define SYNC_URL "https://evtradelabs.com/api/metricas/sync"
#define INTERVAL 60

input string ApiKey = "evm_paNKoHq532Nb01iuNz1yUqp0u8NwAqxR"; // API Key (EVTradeLabs)

datetime g_lastSync  = 0;
bool     g_fullSynced = false; // first sync sends full history, subsequent send recent only

struct PosExtreme { ulong ticket; double mae; double mfe; };
PosExtreme g_extremes[];

//+------------------------------------------------------------------+
int OnInit() {
   if (ApiKey == "") { Alert("EVSync: ApiKey vacío."); return INIT_FAILED; }
   ArrayResize(g_extremes, 0);
   EventSetTimer(1);
   SendSync(true); // full history on attach
   return INIT_SUCCEEDED;
}
void OnDeinit(const int reason) { EventKillTimer(); }

void OnTick() {
   int total = PositionsTotal();
   for (int i = 0; i < total; i++) {
      ulong ticket = PositionGetTicket(i);
      if (ticket == 0) continue;
      double profit = PositionGetDouble(POSITION_PROFIT)
                    + PositionGetDouble(POSITION_COMMISSION)
                    + PositionGetDouble(POSITION_SWAP);
      int idx = FindExtreme(ticket);
      if (idx < 0) {
         int n = ArraySize(g_extremes);
         ArrayResize(g_extremes, n + 1);
         idx = n;
         g_extremes[idx].ticket = ticket;
         g_extremes[idx].mae    = 0;
         g_extremes[idx].mfe    = 0;
      }
      if (profit < g_extremes[idx].mae) g_extremes[idx].mae = profit;
      if (profit > g_extremes[idx].mfe) g_extremes[idx].mfe = profit;
   }
}

void OnTimer() {
   if (TimeCurrent() - g_lastSync >= INTERVAL)
      SendSync(false); // incremental (last 48h)
}

int FindExtreme(ulong ticket) {
   int n = ArraySize(g_extremes);
   for (int i = 0; i < n; i++)
      if (g_extremes[i].ticket == ticket) return i;
   return -1;
}

//+------------------------------------------------------------------+
void SendSync(bool fullHistory) {
   // Full = all history from epoch; incremental = last 48h to catch recent closes
   datetime fromTime = fullHistory ? 0 : TimeCurrent() - 2 * 86400;

   string history    = BuildHistoryJSON(fromTime);
   string open       = BuildOpenJSON();
   string balanceOps = BuildBalanceOpsJSON(fromTime);
   string comma      = (StringLen(history) > 0 && StringLen(open) > 0) ? "," : "";

   string body = StringFormat(
      "{\"event\":\"sync\","
      "\"account\":{"
         "\"login\":%d,\"name\":\"%s\",\"broker\":\"%s\",\"server\":\"%s\","
         "\"currency\":\"%s\",\"balance\":%.2f,\"equity\":%.2f,"
         "\"margin\":%.2f,\"leverage\":%d"
      "},"
      "\"trades\":[%s%s%s],"
      "\"balanceOps\":[%s]}",
      AccountInfoInteger(ACCOUNT_LOGIN),
      EscapeJSON(AccountInfoString(ACCOUNT_NAME)),
      EscapeJSON(AccountInfoString(ACCOUNT_COMPANY)),
      EscapeJSON(AccountInfoString(ACCOUNT_SERVER)),
      AccountInfoString(ACCOUNT_CURRENCY),
      AccountInfoDouble(ACCOUNT_BALANCE),
      AccountInfoDouble(ACCOUNT_EQUITY),
      AccountInfoDouble(ACCOUNT_MARGIN),
      (int)AccountInfoInteger(ACCOUNT_LEVERAGE),
      history, comma, open,
      balanceOps
   );

   string headers = "Content-Type: application/json\r\nX-Api-Key: " + ApiKey;
   char bodyArr[], respArr[];
   string respHeaders;
   StringToCharArray(body, bodyArr, 0, StringLen(body));

   int status = WebRequest("POST", SYNC_URL, headers, 30000, bodyArr, respArr, respHeaders);
   if (status == 200) {
      g_lastSync   = TimeCurrent();
      g_fullSynced = true;
      Print("EVSync OK | ", CharArrayToString(respArr));
   } else {
      Print("EVSync ERR | HTTP ", status, " | ", CharArrayToString(respArr));
   }
}

//+------------------------------------------------------------------+
string BuildHistoryJSON(datetime fromTime) {
   string out = "";
   int count  = 0;
   if (!HistorySelect(fromTime, TimeCurrent())) return out;

   int total = HistoryDealsTotal();
   for (int i = 0; i < total; i++) {
      ulong ticket = HistoryDealGetTicket(i);
      if (ticket == 0) continue;
      string symbol = HistoryDealGetString(ticket, DEAL_SYMBOL);
      if (symbol == "") continue;

      // Skip balance/credit/charge ops — handled separately
      ENUM_DEAL_TYPE dealType = (ENUM_DEAL_TYPE)HistoryDealGetInteger(ticket, DEAL_TYPE);
      if (dealType != DEAL_TYPE_BUY && dealType != DEAL_TYPE_SELL) continue;

      ENUM_DEAL_ENTRY entryType = (ENUM_DEAL_ENTRY)HistoryDealGetInteger(ticket, DEAL_ENTRY);
      ulong posId  = (ulong)HistoryDealGetInteger(ticket, DEAL_POSITION_ID);
      double sl    = HistoryDealGetDouble(ticket, DEAL_SL);
      double tp    = HistoryDealGetDouble(ticket, DEAL_TP);
      int reason   = (int)HistoryDealGetInteger(ticket, DEAL_REASON);

      double mae = 0, mfe = 0;
      int idx = FindExtreme(ticket);
      if (idx < 0) idx = FindExtreme(posId);
      if (idx >= 0) { mae = g_extremes[idx].mae; mfe = g_extremes[idx].mfe; }

      string sep = (count > 0) ? "," : "";
      out += StringFormat(
         "%s{\"ticket\":%llu,\"positionId\":%llu,\"symbol\":\"%s\","
         "\"type\":\"%s\",\"lots\":%.2f,\"price\":%.5f,"
         "\"profit\":%.2f,\"commission\":%.2f,\"swap\":%.2f,"
         "\"entry\":\"%s\",\"time\":%llu,\"comment\":\"%s\","
         "\"mae\":%.2f,\"mfe\":%.2f,\"sl\":%.5f,\"tp\":%.5f,"
         "\"closeReason\":\"%s\"}",
         sep, ticket, posId, symbol,
         DealTypeStr(dealType),
         HistoryDealGetDouble(ticket, DEAL_VOLUME),
         HistoryDealGetDouble(ticket, DEAL_PRICE),
         HistoryDealGetDouble(ticket, DEAL_PROFIT),
         HistoryDealGetDouble(ticket, DEAL_COMMISSION),
         HistoryDealGetDouble(ticket, DEAL_SWAP),
         DealEntryStr(entryType),
         (ulong)HistoryDealGetInteger(ticket, DEAL_TIME),
         EscapeJSON(HistoryDealGetString(ticket, DEAL_COMMENT)),
         mae, mfe, sl, tp,
         DealReasonStr(reason, entryType)
      );
      count++;
   }
   return out;
}

string BuildBalanceOpsJSON(datetime fromTime) {
   string out = "";
   int count  = 0;
   if (!HistorySelect(fromTime, TimeCurrent())) return out;

   int total = HistoryDealsTotal();
   for (int i = 0; i < total; i++) {
      ulong ticket = HistoryDealGetTicket(i);
      if (ticket == 0) continue;

      ENUM_DEAL_TYPE dealType = (ENUM_DEAL_TYPE)HistoryDealGetInteger(ticket, DEAL_TYPE);
      string opType = "";
      if (dealType == DEAL_TYPE_BALANCE) {
         opType = HistoryDealGetDouble(ticket, DEAL_PROFIT) >= 0 ? "deposit" : "withdrawal";
      } else if (dealType == DEAL_TYPE_CREDIT)     { opType = "credit"; }
      else if (dealType == DEAL_TYPE_CHARGE)        { opType = "charge"; }
      else if (dealType == DEAL_TYPE_CORRECTION)    { opType = "correction"; }
      else continue;

      string sep = (count > 0) ? "," : "";
      out += StringFormat(
         "%s{\"ticket\":%llu,\"amount\":%.2f,\"type\":\"%s\","
         "\"time\":%llu,\"comment\":\"%s\"}",
         sep, ticket,
         HistoryDealGetDouble(ticket, DEAL_PROFIT),
         opType,
         (ulong)HistoryDealGetInteger(ticket, DEAL_TIME),
         EscapeJSON(HistoryDealGetString(ticket, DEAL_COMMENT))
      );
      count++;
   }
   return out;
}

string BuildOpenJSON() {
   string out = "";
   int count  = 0;
   int total  = PositionsTotal();
   for (int i = 0; i < total; i++) {
      ulong ticket = PositionGetTicket(i);
      if (ticket == 0) continue;
      string symbol = PositionGetString(POSITION_SYMBOL);
      if (symbol == "") continue;

      int idx = FindExtreme(ticket);
      double mae = (idx >= 0) ? g_extremes[idx].mae : 0;
      double mfe = (idx >= 0) ? g_extremes[idx].mfe : 0;

      string sep = (count > 0) ? "," : "";
      out += StringFormat(
         "%s{\"ticket\":%llu,\"positionId\":%llu,\"symbol\":\"%s\","
         "\"type\":\"%s\",\"lots\":%.2f,\"price\":%.5f,"
         "\"profit\":%.2f,\"commission\":%.2f,\"swap\":%.2f,"
         "\"entry\":\"in\",\"time\":%llu,\"comment\":\"%s\","
         "\"mae\":%.2f,\"mfe\":%.2f,"
         "\"sl\":%.5f,\"tp\":%.5f,\"closeReason\":null}",
         sep, ticket,
         (ulong)PositionGetInteger(POSITION_IDENTIFIER),
         symbol,
         (PositionGetInteger(POSITION_TYPE) == POSITION_TYPE_BUY) ? "buy" : "sell",
         PositionGetDouble(POSITION_VOLUME),
         PositionGetDouble(POSITION_PRICE_OPEN),
         PositionGetDouble(POSITION_PROFIT),
         PositionGetDouble(POSITION_COMMISSION),
         PositionGetDouble(POSITION_SWAP),
         (ulong)PositionGetInteger(POSITION_TIME),
         EscapeJSON(PositionGetString(POSITION_COMMENT)),
         mae, mfe,
         PositionGetDouble(POSITION_SL),
         PositionGetDouble(POSITION_TP)
      );
      count++;
   }
   return out;
}

//+------------------------------------------------------------------+
string DealTypeStr(ENUM_DEAL_TYPE t) {
   switch (t) { case DEAL_TYPE_BUY: return "buy"; case DEAL_TYPE_SELL: return "sell"; default: return "other"; }
}
string DealEntryStr(ENUM_DEAL_ENTRY e) {
   switch (e) { case DEAL_ENTRY_IN: return "in"; case DEAL_ENTRY_OUT: return "out"; case DEAL_ENTRY_INOUT: return "inout"; default: return "out"; }
}
string DealReasonStr(int reason, ENUM_DEAL_ENTRY entry) {
   if (entry != DEAL_ENTRY_OUT) return "null";
   switch (reason) {
      case DEAL_REASON_SL: return "sl";
      case DEAL_REASON_TP: return "tp";
      case DEAL_REASON_SO: return "so";
      default:             return "manual";
   }
}
string EscapeJSON(string s) {
   StringReplace(s, "\\", "\\\\"); StringReplace(s, "\"", "\\\"");
   StringReplace(s, "\n", "\\n");  StringReplace(s, "\r", "\\r");
   return s;
}
