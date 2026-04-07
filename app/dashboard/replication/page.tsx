'use client'

import { useEffect, useState, useCallback } from 'react'
import Link from 'next/link'

interface Sleeve {
  login: string
  name: string
  balance: number
  equity: number
  replicationRatio: number
  riskProfile: 'conservative' | 'moderate' | 'aggressive'
  maxRiskPercent: number
  targetRR: number
  maxDailyLoss: number
  maxOpenPositions: number
  isActive: boolean
  lastSync: string
  positionsReplicated: number
  totalLots: number
  pnlToday: number
  tradesReplicated: number
  successRate: number
  errors: string[]
}

interface Activity {
  id: string
  timestamp: string
  action: string
  symbol: string
  type: string
  volume: string
  price: number
  sleeve: string
  pnl?: number
  message?: string
}

interface MasterAccount {
  login: string
  balance: number
  equity: number
  margin: number
  freeMargin: number
  isConnected: boolean
  lastUpdate: string
  performance: {
    todayPnl: number
    todayPnlPercent: number
    weekPnl: number
    monthPnl: number
    drawdown: number
    maxDrawdown: number
    winRate: number
    profitFactor: number
    totalTrades: number
  }
  positions: {
    total: number
    buy: number
    sell: number
    totalLots: number
  }
  replication: {
    totalSleeves: number
    activeSleeves: number
    totalReplicatedTrades: number
    avgReplicationLag: number
  }
}

export default function ReplicationPage() {
  const [master, setMaster] = useState<MasterAccount | null>(null)
  const [sleeves, setSleeves] = useState<Sleeve[]>([])
  const [activities, setActivities] = useState<Activity[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedSleeve, setSelectedSleeve] = useState<string | null>(null)
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date())

  const fetchData = useCallback(async () => {
    try {
      const [masterRes, sleevesRes, activityRes] = await Promise.all([
        fetch('/api/replication/master'),
        fetch('/api/replication/sleeves'),
        fetch('/api/replication/activity?limit=10')
      ])
      
      const masterData = await masterRes.json()
      const sleevesData = await sleevesRes.json()
      const activityData = await activityRes.json()
      
      setMaster(masterData.data)
      setSleeves(sleevesData.data)
      setActivities(activityData.data)
      setLastUpdate(new Date())
    } catch (error) {
      console.error('Failed to fetch replication data:', error)
    }
  }, [])

  useEffect(() => {
    fetchData()
    const interval = setInterval(fetchData, 5000) // Refresh every 5 seconds
    return () => clearInterval(interval)
  }, [fetchData])

  useEffect(() => {
    if (activities.length > 0) {
      setLoading(false)
    }
  }, [activities])

  const toggleSleeve = async (login: string, currentState: boolean) => {
    try {
      await fetch('/api/replication/sleeves', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ login, isActive: !currentState })
      })
      fetchData()
    } catch (error) {
      console.error('Failed to toggle sleeve:', error)
    }
  }

  const formatTime = (isoString: string) => {
    const date = new Date(isoString)
    return date.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit', second: '2-digit' })
  }

  const getActionColor = (action: string) => {
    switch (action) {
      case 'REPLICATED': return 'bg-green-500/20 text-green-400 border-green-500/30'
      case 'CLOSED': return 'bg-red-500/20 text-red-400 border-red-500/30'
      case 'MODIFIED': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30'
      case 'PAUSED': return 'bg-gray-500/20 text-gray-400 border-gray-500/30'
      case 'RESUMED': return 'bg-blue-500/20 text-blue-400 border-blue-500/30'
      case 'ERROR': return 'bg-red-600/20 text-red-300 border-red-600/30'
      default: return 'bg-white/10 text-white border-white/20'
    }
  }

  if (loading || !master) {
    return (
      <div className="min-h-screen bg-[#0a0f1a] flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-[#667eea] border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="mt-4 text-[#8da0c2]">Loading replication status...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#0a0f1a] text-white">
      {/* Header */}
      <header className="border-b border-white/10 bg-[rgba(17,26,45,0.95)] backdrop-blur-xl sticky top-0 z-50">
        <div className="max-w-[1600px] mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/dashboard" className="text-[#8da0c2] hover:text-white transition-colors flex items-center gap-2">
              <span className="text-lg">←</span>
              <span>Back</span>
            </Link>
            <div className="w-px h-6 bg-white/20" />
            <div>
              <div className="font-bold text-lg">Replication Control</div>
              <div className="text-[#8da0c2] text-xs">MT5 Position Mirroring System</div>
            </div>
          </div>
          
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2 text-xs text-[#8da0c2]">
              <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
              <span>Live</span>
            </div>
            <div className="text-xs text-[#8da0c2]">
              Last update: {lastUpdate.toLocaleTimeString()}
            </div>
            <button 
              onClick={fetchData}
              className="px-3 py-1.5 rounded-lg bg-[#667eea]/20 text-[#667eea] text-xs hover:bg-[#667eea]/30 transition-colors"
            >
              Refresh
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-[1600px] mx-auto px-6 py-8 space-y-8">
        {/* Master Account + Stats */}
        <div className="grid grid-cols-5 gap-6">
          {/* Master Account Card */}
          <div className="col-span-2 bg-gradient-to-br from-[#667eea]/20 to-[#764ba2]/20 rounded-2xl border border-[#667eea]/30 p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <div className="text-xs text-[#8da0c2] uppercase tracking-wider mb-1">Master Account</div>
                <div className="font-bold text-lg">#{master.login}</div>
              </div>
              <div className={`px-3 py-1 rounded-full text-xs font-bold ${
                master.isConnected 
                  ? 'bg-green-500/20 text-green-400' 
                  : 'bg-red-500/20 text-red-400'
              }`}>
                {master.isConnected ? 'CONNECTED' : 'DISCONNECTED'}
              </div>
            </div>
            
            <div className="space-y-4">
              <div>
                <div className="text-3xl font-black">€{master.equity.toLocaleString('es-ES', { minimumFractionDigits: 2 })}</div>
                <div className={`text-sm ${master.performance.todayPnl >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                  {master.performance.todayPnl >= 0 ? '+' : ''}€{master.performance.todayPnl.toFixed(2)} today
                  ({master.performance.todayPnlPercent >= 0 ? '+' : ''}{master.performance.todayPnlPercent.toFixed(2)}%)
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-white/5 rounded-lg p-3">
                  <div className="text-[#8da0c2] text-xs mb-1">Balance</div>
                  <div className="font-bold">€{master.balance.toLocaleString('es-ES', { minimumFractionDigits: 2 })}</div>
                </div>
                <div className="bg-white/5 rounded-lg p-3">
                  <div className="text-[#8da0c2] text-xs mb-1">Margin</div>
                  <div className="font-bold">€{master.margin.toLocaleString('es-ES', { minimumFractionDigits: 2 })}</div>
                </div>
              </div>
            </div>
          </div>

          {/* Performance Stats */}
          <div className="col-span-3 grid grid-cols-4 gap-4">
            <div className="bg-[rgba(17,26,45,0.6)] rounded-2xl border border-white/10 p-4">
              <div className="text-[#8da0c2] text-xs uppercase mb-2">Open Positions</div>
              <div className="text-2xl font-bold">{master.positions.total}</div>
              <div className="text-xs text-[#8da0c2] mt-1">
                {master.positions.buy} BUY / {master.positions.sell} SELL
              </div>
            </div>
            <div className="bg-[rgba(17,26,45,0.6)] rounded-2xl border border-white/10 p-4">
              <div className="text-[#8da0c2] text-xs uppercase mb-2">Active Sleeves</div>
              <div className="text-2xl font-bold">{master.replication.activeSleeves}/{master.replication.totalSleeves}</div>
              <div className="text-xs text-green-400 mt-1">● {master.replication.avgReplicationLag}s avg lag</div>
            </div>
            <div className="bg-[rgba(17,26,45,0.6)] rounded-2xl border border-white/10 p-4">
              <div className="text-[#8da0c2] text-xs uppercase mb-2">Win Rate</div>
              <div className="text-2xl font-bold">{master.performance.winRate}%</div>
              <div className="text-xs text-[#8da0c2] mt-1">Profit Factor: {master.performance.profitFactor}</div>
            </div>
            <div className="bg-[rgba(17,26,45,0.6)] rounded-2xl border border-white/10 p-4">
              <div className="text-[#8da0c2] text-xs uppercase mb-2">Total Trades</div>
              <div className="text-2xl font-bold">{master.performance.totalTrades}</div>
              <div className="text-xs text-[#8da0c2] mt-1">Drawdown: {master.performance.drawdown}%</div>
            </div>
          </div>
        </div>

        {/* Sleeves Grid */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold">Sleeve Replications</h3>
            <div className="flex items-center gap-2">
              <span className="text-xs text-[#8da0c2]">
                Total P/L Today: 
              </span>
              <span className={`text-sm font-bold ${sleeves.reduce((sum, s) => sum + s.pnlToday, 0) >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                €{sleeves.reduce((sum, s) => sum + s.pnlToday, 0).toFixed(2)}
              </span>
            </div>
          </div>
          
          <div className="grid md:grid-cols-3 gap-6">
            {sleeves.map((sleeve) => (
              <div 
                key={sleeve.login}
                className={`bg-[rgba(17,26,45,0.6)] rounded-2xl border p-6 transition-all ${
                  sleeve.isActive 
                    ? 'border-green-500/30 hover:border-green-500/60' 
                    : 'border-red-500/30 hover:border-red-500/60'
                }`}
              >
                {/* Sleeve Header */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center font-bold text-lg ${
                      sleeve.riskProfile === 'aggressive' ? 'bg-red-500/20 text-red-400' :
                      sleeve.riskProfile === 'moderate' ? 'bg-yellow-500/20 text-yellow-400' :
                      'bg-green-500/20 text-green-400'
                    }`}>
                      {sleeve.name.charAt(0)}
                    </div>
                    <div>
                      <div className="font-bold">{sleeve.name}</div>
                      <div className="text-[#8da0c2] text-xs">#{sleeve.login}</div>
                    </div>
                  </div>
                  <div className={`px-3 py-1 rounded-full text-xs font-bold ${
                    sleeve.isActive 
                      ? 'bg-green-500/20 text-green-400' 
                      : 'bg-red-500/20 text-red-400'
                  }`}>
                    {sleeve.isActive ? 'ACTIVE' : 'PAUSED'}
                  </div>
                </div>

                {/* Balance & Equity */}
                <div className="grid grid-cols-2 gap-3 mb-4">
                  <div className="bg-white/5 rounded-lg p-3">
                    <div className="text-[#8da0c2] text-xs mb-1">Balance</div>
                    <div className="font-bold text-sm">€{sleeve.balance.toLocaleString('es-ES', { minimumFractionDigits: 2 })}</div>
                  </div>
                  <div className="bg-white/5 rounded-lg p-3">
                    <div className="text-[#8da0c2] text-xs mb-1">Equity</div>
                    <div className={`font-bold text-sm ${sleeve.equity >= sleeve.balance ? 'text-green-400' : 'text-red-400'}`}>
                      €{sleeve.equity.toLocaleString('es-ES', { minimumFractionDigits: 2 })}
                    </div>
                  </div>
                </div>

                {/* Replication Progress */}
                <div className="mb-4">
                  <div className="flex justify-between text-xs mb-2">
                    <span className="text-[#8da0c2]">Replication Ratio</span>
                    <span className="font-medium">{(sleeve.replicationRatio * 100).toFixed(0)}%</span>
                  </div>
                  <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-[#667eea] to-[#764ba2] rounded-full transition-all"
                      style={{ width: `${sleeve.replicationRatio * 100}%` }}
                    />
                  </div>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-3 gap-2 mb-4">
                  <div className="text-center">
                    <div className="text-[#8da0c2] text-xs">Risk</div>
                    <div className={`text-sm font-bold uppercase ${
                      sleeve.riskProfile === 'aggressive' ? 'text-red-400' :
                      sleeve.riskProfile === 'moderate' ? 'text-yellow-400' :
                      'text-green-400'
                    }`}>
                      {sleeve.riskProfile.slice(0, 4)}.
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="text-[#8da0c2] text-xs">Max Loss</div>
                    <div className="text-sm font-bold text-red-400">{sleeve.maxDailyLoss}%</div>
                  </div>
                  <div className="text-center">
                    <div className="text-[#8da0c2] text-xs">Target RR</div>
                    <div className="text-sm font-bold">{sleeve.targetRR}:1</div>
                  </div>
                </div>

                {/* Mini Stats */}
                <div className="flex justify-between text-xs text-[#8da0c2] mb-4 px-2">
                  <span>{sleeve.positionsReplicated} positions</span>
                  <span>{sleeve.tradesReplicated} trades</span>
                  <span>{sleeve.successRate}% win</span>
                </div>

                {/* P/L Today */}
                <div className="bg-white/5 rounded-lg p-3 mb-4">
                  <div className="flex justify-between items-center">
                    <span className="text-[#8da0c2] text-sm">P/L Today</span>
                    <span className={`text-xl font-bold ${sleeve.pnlToday >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                      {sleeve.pnlToday >= 0 ? '+' : ''}€{sleeve.pnlToday.toFixed(2)}
                    </span>
                  </div>
                </div>

                {/* Errors */}
                {sleeve.errors.length > 0 && (
                  <div className="mb-4 space-y-2">
                    {sleeve.errors.map((error, i) => (
                      <div key={i} className="text-red-400 text-xs bg-red-500/10 rounded-lg px-3 py-2 flex items-center gap-2">
                        <span>⚠️</span>
                        <span>{error}</span>
                      </div>
                    ))}
                  </div>
                )}

                {/* Last Sync */}
                <div className="text-xs text-[#8da0c2] mb-4">
                  Last sync: {formatTime(sleeve.lastSync)}
                </div>

                {/* Actions */}
                <div className="flex gap-3">
                  <button 
                    onClick={() => setSelectedSleeve(sleeve.login)}
                    className="flex-1 py-2 px-4 rounded-xl bg-[#667eea] hover:bg-[#5a6fd6] font-bold text-sm transition-colors"
                  >
                    Configure
                  </button>
                  <button 
                    onClick={() => toggleSleeve(sleeve.login, sleeve.isActive)}
                    className={`py-2 px-4 rounded-xl font-bold text-sm transition-colors ${
                      sleeve.isActive 
                        ? 'bg-red-500/20 text-red-400 hover:bg-red-500/30'
                        : 'bg-green-500/20 text-green-400 hover:bg-green-500/30'
                    }`}
                  >
                    {sleeve.isActive ? 'Pause' : 'Resume'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-[rgba(17,26,45,0.6)] rounded-2xl border border-white/10 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold">Recent Replication Activity</h3>
            <Link 
              href="/dashboard/replication/activity"
              className="text-xs text-[#667eea] hover:text-[#8da0c2] transition-colors"
            >
              View All →
            </Link>
          </div>
          
          <div className="space-y-2">
            {activities.map((activity) => (
              <div 
                key={activity.id}
                className="flex items-center justify-between py-3 border-b border-white/5 last:border-0"
              >
                <div className="flex items-center gap-4">
                  <span className="text-[#8da0c2] text-xs font-mono w-20">{formatTime(activity.timestamp)}</span>
                  <span className={`px-2 py-1 rounded text-xs font-bold border ${getActionColor(activity.action)}`}>
                    {activity.action}
                  </span>
                </div>
                
                <div className="flex items-center gap-6 flex-1 px-4">
                  <span className="font-medium w-20">{activity.symbol}</span>
                  <span className="text-[#8da0c2] text-sm w-24">
                    {activity.type !== '-' ? `${activity.type} ${activity.volume}` : '-'}
                  </span>
                  {activity.pnl !== undefined && (
                    <span className={`text-sm font-medium ${activity.pnl >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                      {activity.pnl >= 0 ? '+' : ''}€{activity.pnl.toFixed(2)}
                    </span>
                  )}
                </div>
                
                <div className="text-[#8da0c2] text-sm">
                  → {activity.sleeve}
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  )
}
