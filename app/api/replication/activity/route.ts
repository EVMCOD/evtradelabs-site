import { NextResponse } from 'next/server'

interface Activity {
  id: string
  timestamp: string
  action: 'REPLICATED' | 'CLOSED' | 'MODIFIED' | 'PAUSED' | 'RESUMED' | 'ERROR'
  symbol: string
  type: 'BUY' | 'SELL' | '-'
  volume: string
  price: number
  sleeve: string
  masterTicket?: number
  sleeveTicket?: number
  pnl?: number
  message?: string
}

// Generate realistic activity log
function generateActivity(): Activity[] {
  const actions: Activity['action'][] = ['REPLICATED', 'CLOSED', 'MODIFIED', 'PAUSED', 'RESUMED', 'ERROR']
  const symbols = ['EURUSD', 'XAUUSD', 'GBPJPY', 'USDCHF', 'AUDUSD', 'USDCAD', 'NZDUSD', 'EURGBP']
  const types: ('BUY' | 'SELL')[] = ['BUY', 'SELL']
  const sleeves = ['Sleeve EUR', 'Sleeve Gold', 'Sleeve Indices']
  
  const activities: Activity[] = []
  const now = Date.now()
  
  for (let i = 0; i < 20; i++) {
    const action = actions[Math.floor(Math.random() * actions.length)]
    const symbol = symbols[Math.floor(Math.random() * symbols.length)]
    const type = action === 'PAUSED' || action === 'RESUMED' ? '-' : types[Math.floor(Math.random() * types.length)]
    const volume = (Math.random() * 2 + 0.1).toFixed(2)
    const price = Math.random() * 200 + 0.5
    const sleeve = sleeves[Math.floor(Math.random() * sleeves.length)]
    
    activities.push({
      id: `ACT-${now}-${i}`,
      timestamp: new Date(now - i * 60000 * Math.random() * 10).toISOString(),
      action,
      symbol: action === 'PAUSED' || action === 'RESUMED' || action === 'ERROR' ? '-' : symbol,
      type,
      volume: action === 'PAUSED' || action === 'RESUMED' || action === 'ERROR' ? '-' : volume,
      price: action === 'PAUSED' || action === 'RESUMED' || action === 'ERROR' ? 0 : parseFloat(price.toFixed(5)),
      sleeve,
      masterTicket: action === 'REPLICATED' ? Math.floor(Math.random() * 1000000) + 10000000 : undefined,
      sleeveTicket: action === 'REPLICATED' ? Math.floor(Math.random() * 1000000) + 20000000 : undefined,
      pnl: action === 'CLOSED' ? (Math.random() * 200 - 50) : undefined,
      message: action === 'ERROR' ? 'Connection lost to MT5 server' : undefined
    })
  }
  
  return activities.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const limit = parseInt(searchParams.get('limit') || '20')
  const sleeve = searchParams.get('sleeve')
  
  let activities = generateActivity()
  
  if (sleeve) {
    activities = activities.filter(a => a.sleeve === sleeve)
  }
  
  return NextResponse.json({
    success: true,
    data: activities.slice(0, limit),
    meta: {
      total: activities.length,
      filtered: sleeve ? activities.length : undefined
    }
  })
}
