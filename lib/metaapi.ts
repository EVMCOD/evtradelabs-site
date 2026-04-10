import { NextResponse } from "next/server";

const METAAPI_URL = "https://api.metaapi.cloud/v1";

export async function GET(accountId: string, token: string) {
  try {
    // Get account info
    const accRes = await fetch(`${METAAPI_URL}/users/current/accounts/${accountId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    
    if (!accRes.ok) {
      throw new Error("Account not found");
    }
    
    const account = await accRes.json();
    
    // Get current positions
    const posRes = await fetch(`${METAAPI_URL}/users/current/accounts/${accountId}/positions`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    
    const positions = posRes.ok ? await posRes.json() : [];
    
    // Get historical trades
    const histRes = await fetch(
      `${METAAPI_URL}/users/current/accounts/${accountId}/historical-trades?startTime=${new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString()}`,
      { headers: { Authorization: `Bearer ${token}` } }
    );
    
    const history = histRes.ok ? await histRes.json() : [];
    
    return { account, positions, history };
  } catch (error) {
    throw error;
  }
}

export async function getAccounts(token: string) {
  const res = await fetch(`${METAAPI_URL}/users/current/accounts`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  
  if (!res.ok) throw new Error("Failed to fetch accounts");
  return res.json();
}
