// MT5 Bridge Service Layer
// This connects to your MT5 bridge API

export interface Account {
  login: string
  name: string
  balance: number
  equity: number
  margin: number
  freeMargin: number
  marginLevel: number
  server: string
}

export interface Position {
  ticket: number
  symbol: string
  type: 'BUY' | 'SELL'
  volume: number
  priceOpen: number
  priceCurrent: number
  profit: number
  swap: number
  comment: string
  time: string
}

export interface Trade {
  id: number
  symbol: string
  type: 'BUY' | 'SELL'
  volume: number
  priceOpen: number
  priceClose: number
  profit: number
  timestamp: string
}

export interface PerformanceData {
  date: string
  balance: number
  equity: number
}

// Bridge configuration
// Replace with your actual bridge URL when ready
const BRIDGE_URL = process.env.NEXT_PUBLIC_BRIDGE_URL || 'https://your-bridge.onrender.com'
const BRIDGE_TOKEN = process.env.BRIDGE_TOKEN || ''

// Mock data for development
const MOCK_ACCOUNT: Account = {
  login: '12345678',
  name: 'EV Trading Account',
  balance: 24521.50,
  equity: 24834.20,
  margin: 1240.00,
  freeMargin: 23594.20,
  marginLevel: 2002.76,
  server: 'MetaQuotes-Demo',
}

const MOCK_POSITIONS: Position[] = [
  { ticket: 12345, symbol: 'EURUSD', type: 'BUY', volume: 0.50, priceOpen: 1.0850, priceCurrent: 1.0874, profit: 120.00, swap: -2.50, comment: 'EUR Trend', time: '2026-04-07T10:30:00Z' },
  { ticket: 12346, symbol: 'XAUUSD', type: 'SELL', volume: 0.25, priceOpen: 2050.00, priceCurrent: 2034.50, profit: 387.50, swap: -1.20, comment: 'Gold Squeeze', time: '2026-04-07T11:15:00Z' },
  { ticket: 12347, symbol: 'GBPJPY', type: 'BUY', volume: 0.30, priceOpen: 188.50, priceCurrent: 188.23, profit: -81.00, swap: -0.80, comment: 'JPY Swing', time: '2026-04-07T12:00:00Z' },
  { ticket: 12348, symbol: 'USDCHF', type: 'BUY', volume: 0.40, priceOpen: 0.8820, priceCurrent: 0.8842, profit: 88.00, swap: -1.00, comment: 'CHF Long', time: '2026-04-07T13:30:00Z' },
]

const MOCK_HISTORY: Trade[] = [
  { id: 1, symbol: 'EURUSD', type: 'BUY', volume: 0.50, priceOpen: 1.0820, priceClose: 1.0850, profit: 150.00, timestamp: '2026-04-06T15:00:00Z' },
  { id: 2, symbol: 'XAUUSD', type: 'SELL', volume: 0.20, priceOpen: 2040.00, priceClose: 2035.00, profit: 100.00, timestamp: '2026-04-06T14:30:00Z' },
  { id: 3, symbol: 'GBPUSD', type: 'BUY', volume: 0.30, priceOpen: 1.2650, priceClose: 1.2680, profit: 90.00, timestamp: '2026-04-06T12:00:00Z' },
  { id: 4, symbol: 'USDJPY', type: 'SELL', volume: 0.40, priceOpen: 149.50, priceClose: 149.20, profit: 120.00, timestamp: '2026-04-05T16:00:00Z' },
  { id: 5, symbol: 'EURGBP', type: 'BUY', volume: 0.25, priceOpen: 0.8560, priceClose: 0.8580, profit: 50.00, timestamp: '2026-04-05T14:00:00Z' },
]

const MOCK_PERFORMANCE: PerformanceData[] = [
  { date: '2026-04-01', balance: 23500, equity: 23700 },
  { date: '2026-04-02', balance: 23650, equity: 23900 },
  { date: '2026-04-03', balance: 23800, equity: 24100 },
  { date: '2026-04-04', balance: 23700, equity: 23500 },
  { date: '2026-04-05', balance: 24000, equity: 24300 },
  { date: '2026-04-06', balance: 24200, equity: 24500 },
  { date: '2026-04-07', balance: 24521, equity: 24834 },
]

// API Functions
async function fetchBridge<T>(endpoint: string): Promise<T> {
  const response = await fetch(`${BRIDGE_URL}${endpoint}`, {
    headers: {
      'Authorization': `Bearer ${BRIDGE_TOKEN}`,
      'Content-Type': 'application/json',
    },
    next: { revalidate: 5 }, // Cache for 5 seconds
  })
  
  if (!response.ok) {
    throw new Error(`Bridge API error: ${response.status}`)
  }
  
  return response.json()
}

// Use mock data or real bridge based on environment
export async function getAccount(): Promise<Account> {
  if (!BRIDGE_TOKEN || BRIDGE_URL.includes('your-bridge')) {
    return MOCK_ACCOUNT
  }
  return fetchBridge<Account>('/api/account')
}

export async function getPositions(): Promise<Position[]> {
  if (!BRIDGE_TOKEN || BRIDGE_URL.includes('your-bridge')) {
    return MOCK_POSITIONS
  }
  return fetchBridge<Position[]>('/api/positions')
}

export async function getTradeHistory(): Promise<Trade[]> {
  if (!BRIDGE_TOKEN || BRIDGE_URL.includes('your-bridge')) {
    return MOCK_HISTORY
  }
  return fetchBridge<Trade[]>('/api/history')
}

export async function getPerformance(): Promise<PerformanceData[]> {
  if (!BRIDGE_TOKEN || BRIDGE_URL.includes('your-bridge')) {
    return MOCK_PERFORMANCE
  }
  return fetchBridge<PerformanceData[]>('/api/performance')
}

// Calculate stats from positions
export function calculateStats(account: Account, positions: Position[]) {
  const openPositions = positions.length
  const totalProfit = positions.reduce((sum, p) => sum + p.profit, 0)
  const winningPositions = positions.filter(p => p.profit > 0).length
  const winRate = openPositions > 0 ? (winningPositions / openPositions) * 100 : 0
  
  return {
    openPositions,
    totalProfit,
    winRate: winRate.toFixed(1),
    marginLevel: account.marginLevel.toFixed(2),
    freeMargin: account.freeMargin.toFixed(2),
  }
}
