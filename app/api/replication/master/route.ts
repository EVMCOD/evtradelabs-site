import { NextResponse } from 'next/server'

const MASTER_ACCOUNT = {
  login: '12345678',
  name: 'Master Account',
  server: 'ICMarketsSC-Demo',
  balance: 24521.50,
  equity: 25834.20,
  currency: 'EUR',
  margin: 1245.80,
  freeMargin: 24588.40,
  leverage: 100,
  accountType: 'Demo',
  isConnected: true,
  lastUpdate: new Date().toISOString(),
  // Performance metrics
  performance: {
    todayPnl: 1312.70,
    todayPnlPercent: 5.65,
    weekPnl: 3420.30,
    monthPnl: 7840.50,
    drawdown: 3.2,
    maxDrawdown: 8.5,
    sharpeRatio: 1.84,
    winRate: 67.3,
    profitFactor: 2.1,
    totalTrades: 156,
    consecutiveWins: 7,
    consecutiveLosses: 3
  },
  // Open positions summary
  positions: {
    total: 8,
    buy: 5,
    sell: 3,
    totalLots: 4.20,
    Symbols: ['EURUSD', 'XAUUSD', 'GBPJPY', 'USDCHF', 'AUDUSD', 'USDCAD', 'NZDUSD', 'EURGBP']
  },
  // Replication status
  replication: {
    totalSleeves: 3,
    activeSleeves: 2,
    totalReplicatedTrades: 25,
    avgReplicationLag: 0.34, // seconds
    lastReplication: new Date().toISOString()
  }
}

export async function GET() {
  // Simulate real-time update
  await new Promise(resolve => setTimeout(resolve, 100))
  
  // Add slight randomness to simulate live data
  const updated = {
    ...MASTER_ACCOUNT,
    equity: MASTER_ACCOUNT.equity + (Math.random() - 0.5) * 10,
    margin: MASTER_ACCOUNT.margin + (Math.random() - 0.5) * 5,
    freeMargin: MASTER_ACCOUNT.freeMargin + (Math.random() - 0.5) * 10,
    lastUpdate: new Date().toISOString()
  }
  
  return NextResponse.json({
    success: true,
    data: updated
  })
}
