import { NextResponse } from 'next/server'

// Mock sleeve data - in production this would come from database
const SLEEVES = [
  {
    login: '87654321',
    name: 'Sleeve EUR',
    masterLogin: '12345678',
    balance: 8540.20,
    equity: 8720.50,
    currency: 'EUR',
    replicationRatio: 0.5,
    riskProfile: 'conservative',
    maxRiskPercent: 3,
    targetRR: 2.0,
    maxDailyLoss: 3,
    maxOpenPositions: 10,
    excludeSymbols: [],
    isActive: true,
    lastSync: new Date().toISOString(),
    positionsReplicated: 3,
    totalLots: 0.85,
    pnlToday: 180.30,
    tradesReplicated: 12,
    successRate: 78.5,
    errors: []
  },
  {
    login: '87654322',
    name: 'Sleeve Gold',
    masterLogin: '12345678',
    balance: 12300.00,
    equity: 12450.80,
    currency: 'EUR',
    replicationRatio: 0.75,
    riskProfile: 'aggressive',
    maxRiskPercent: 7,
    targetRR: 2.5,
    maxDailyLoss: 7,
    maxOpenPositions: 15,
    excludeSymbols: [],
    isActive: true,
    lastSync: new Date().toISOString(),
    positionsReplicated: 5,
    totalLots: 1.25,
    pnlToday: -120.50,
    tradesReplicated: 8,
    successRate: 62.5,
    errors: []
  },
  {
    login: '87654323',
    name: 'Sleeve Indices',
    masterLogin: '12345678',
    balance: 5200.00,
    equity: 5180.40,
    currency: 'EUR',
    replicationRatio: 0.3,
    riskProfile: 'moderate',
    maxRiskPercent: 4,
    targetRR: 2.0,
    maxDailyLoss: 4,
    maxOpenPositions: 8,
    excludeSymbols: ['XAUUSD', 'GBPNOK'],
    isActive: false,
    lastSync: new Date(Date.now() - 300000).toISOString(),
    positionsReplicated: 2,
    totalLots: 0.45,
    pnlToday: -19.60,
    tradesReplicated: 5,
    successRate: 80.0,
    errors: ['Daily loss limit exceeded - replication paused']
  }
]

export async function GET() {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 200))
  
  return NextResponse.json({
    success: true,
    data: SLEEVES,
    meta: {
      total: SLEEVES.length,
      active: SLEEVES.filter(s => s.isActive).length,
      totalPnlToday: SLEEVES.reduce((sum, s) => sum + s.pnlToday, 0)
    }
  })
}

export async function PUT(request: Request) {
  try {
    const body = await request.json()
    const { login, ...updates } = body
    
    const sleeveIndex = SLEEVES.findIndex(s => s.login === login)
    if (sleeveIndex === -1) {
      return NextResponse.json(
        { success: false, error: 'Sleeve not found' },
        { status: 404 }
      )
    }
    
    // Update sleeve
    Object.assign(SLEEVES[sleeveIndex], updates, { 
      lastSync: new Date().toISOString() 
    })
    
    return NextResponse.json({
      success: true,
      data: SLEEVES[sleeveIndex]
    })
  } catch {
    return NextResponse.json(
      { success: false, error: 'Invalid request body' },
      { status: 400 }
    )
  }
}
