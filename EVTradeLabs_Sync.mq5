//+------------------------------------------------------------------+
//| EVTradeLabs_Sync.mq5                                              |
//+------------------------------------------------------------------+
#property copyright "EVTradeLabs"
#property version   "1.0"
#property strict

#define SYNC_URL "https://evtradelabs.com/api/metricas/sync"
#define INTERVAL 60

input string ApiKey = "evm_paNKoHq532Nb01iuNz1yUqp0u8NwAqxR"; // API Key (EVTradeLabs)

datetime g_lastSync = 0;

int OnInit() {
   if (ApiKey == "") {
      Alert("EVSync: ApiKey vacío. Introduce tu API Key.");
      return INIT_FAILED;
   }
   EventSetTimer(1);
   SendSync();
   return INIT_SUCCEEDED;
}

void OnDeinit(const int reason) {
   EventKillTimer();
}

void OnTimer() {
   if (TimeCurrent() - g_lastSync >= INTERVAL)
      SendSync();
}

void SendSync() {
   string trades = BuildTradesJSON();
   string body   = StringFormat(
      "{\"event\":\"sync\","
      "\"account\":{"
         "\"login\":%d,"
         "\"name\":\"%s\","
         "\"broker\":\"%s\","
         "\"server\":\"%s\","
         "\"currency\":\"%s\","
         "\"balance\":%.2f,"
         "\"equity\":%.2f,"
         "\"margin\":%.2f,"
         "\"leverage\":%d"
      "},"
      "\"trades\":[%s]}",
      AccountInfoInteger(ACCOUNT_LOGIN),
      EscapeJSON(AccountInfoString(ACCOUNT_NAME)),
      EscapeJSON(AccountInfoString(ACCOUNT_COMPANY)),
      EscapeJSON(AccountInfoString(ACCOUNT_SERVER)),
      AccountInfoString(ACCOUNT_CURRENCY),
      AccountInfoDouble(ACCOUNT_BALANCE),
      AccountInfoDouble(ACCOUNT_EQUITY),
      AccountInfoDouble(ACCOUNT_MARGIN),
      (int)AccountInfoInteger(ACCOUNT_LEVERAGE),
      trades
   );

   string headers = "Content-Type: application/json\r\nX-Api-Key: " + ApiKey;
   char   bodyArr[], respArr[];
   string respHeaders;
   StringToCharArray(body, bodyArr, 0, StringLen(body));

   int status = WebRequest("POST", SYNC_URL, headers, 10000, bodyArr, respArr, respHeaders);

   if (status == 200) {
      g_lastSync = TimeCurrent();
      Print("EVSync OK | ", CharArrayToString(respArr));
   } else {
      Print("EVSync ERR | HTTP ", status, " | ", CharArrayToString(respArr));
   }
}

string BuildTradesJSON() {
   string out = "";
   int    count = 0;

   if (!HistorySelect(TimeCurrent() - 7 * 86400, TimeCurrent()))
      return out;

   int total = HistoryDealsTotal();
   for (int i = 0; i < total; i++) {
      ulong ticket = HistoryDealGetTicket(i);
      if (ticket == 0) continue;

      string symbol = HistoryDealGetString(ticket, DEAL_SYMBOL);
      if (symbol == "") continue;

      string sep = (count > 0) ? "," : "";
      out += StringFormat(
         "%s{"
         "\"ticket\":%llu,"
         "\"positionId\":%llu,"
         "\"symbol\":\"%s\","
         "\"type\":\"%s\","
         "\"lots\":%.2f,"
         "\"price\":%.5f,"
         "\"profit\":%.2f,"
         "\"commission\":%.2f,"
         "\"swap\":%.2f,"
         "\"entry\":\"%s\","
         "\"time\":%llu,"
         "\"comment\":\"%s\""
         "}",
         sep,
         ticket,
         (ulong)HistoryDealGetInteger(ticket, DEAL_POSITION_ID),
         symbol,
         DealTypeStr((ENUM_DEAL_TYPE)HistoryDealGetInteger(ticket, DEAL_TYPE)),
         HistoryDealGetDouble(ticket, DEAL_VOLUME),
         HistoryDealGetDouble(ticket, DEAL_PRICE),
         HistoryDealGetDouble(ticket, DEAL_PROFIT),
         HistoryDealGetDouble(ticket, DEAL_COMMISSION),
         HistoryDealGetDouble(ticket, DEAL_SWAP),
         DealEntryStr((ENUM_DEAL_ENTRY)HistoryDealGetInteger(ticket, DEAL_ENTRY)),
         (ulong)HistoryDealGetInteger(ticket, DEAL_TIME),
         EscapeJSON(HistoryDealGetString(ticket, DEAL_COMMENT))
      );
      count++;
   }
   return out;
}

string DealTypeStr(ENUM_DEAL_TYPE t) {
   switch (t) {
      case DEAL_TYPE_BUY:  return "buy";
      case DEAL_TYPE_SELL: return "sell";
      default:             return "other";
   }
}

string DealEntryStr(ENUM_DEAL_ENTRY e) {
   switch (e) {
      case DEAL_ENTRY_IN:    return "in";
      case DEAL_ENTRY_OUT:   return "out";
      case DEAL_ENTRY_INOUT: return "inout";
      default:               return "out";
   }
}

string EscapeJSON(string s) {
   StringReplace(s, "\\", "\\\\");
   StringReplace(s, "\"", "\\\"");
   StringReplace(s, "\n", "\\n");
   StringReplace(s, "\r", "\\r");
   return s;
}
