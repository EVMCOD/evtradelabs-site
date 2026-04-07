'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'

// Types matching our bridge
interface Account {
  login: string
  name: string
  balance: number
  equity: number
  margin: number
  freeMargin: number
  marginLevel: number
  server: string
}

interface Position {
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

export default function DashboardPage() {
  const [account, setAccount] = useState<Account | null>(null)
  const [positions, setPositions] = useState<Position[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchData() {
      try {
        const [accountRes, positionsRes] = await Promise.all([
          fetch('/api/dashboard/account'),
          fetch('/api/dashboard/positions'),
        ])

        if (!accountRes.ok || !positionsRes.ok) {
          throw new Error('Failed to fetch data')
        }

        const accountData = await accountRes.json()
        const positionsData = await positionsRes.json()

        setAccount(accountData)
        setPositions(positionsData)
      } catch (err) {
        setError('Error loading dashboard data')
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
    
    // Refresh every 30 seconds
    const interval = setInterval(fetchData, 30000)
    return () => clearInterval(interval)
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0a0f1a] flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-[#667eea] border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="mt-4 text-[#8da0c2]">Loading dashboard...</p>
        </div>
      </div>
    )
  }

  if (error || !account) {
    return (
      <div className="min-h-screen bg-[#0a0f1a] flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-400">{error || 'Failed to load'}</p>
          <button onClick={() => window.location.reload()} className="mt-4 px-4 py-2 bg-[#667eea] rounded-lg text-white">
            Retry
          </button>
        </div>
      </div>
    )
  }

  const totalProfit = positions.reduce((sum, p) => sum + p.profit, 0)
  const winningPositions = positions.filter(p => p.profit > 0).length

  return (
    <div className="min-h-screen bg-[#0a0f1a] text-white">
      {/* Header */}
      <header className="border-b border-white/10 bg-[rgba(17,26,45,0.95)] backdrop-blur-xl sticky top-0 z-50">
        <div className="max-w-[1400px] mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[#667eea] to-[#764ba2] flex items-center justify-center font-black">
              EV
            </div>
            <div>
              <div className="font-bold">EV Trading Labs</div>
              <div className="text-[#8da0c2] text-[0.75rem]">{account.server}</div>
            </div>
          </div>
          
          <nav className="flex items-center gap-6">
            <Link href="/" className="text-[#8da0c2] hover:text-white transition-colors">
              Home
            </Link>
            <Link href="/dashboard" className="text-white font-medium">
              Dashboard
            </Link>
          </nav>
          
          <div className="text-right">
            <div className="text-[0.7rem] text-[#8da0c2]">Account</div>
            <div className="font-mono font-bold">{account.login}</div>
          </div>
        </div>
      </header>

      <main className="max-w-[1400px] mx-auto px-6 py-8">
        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <StatCard 
            label="Balance" 
            value={`€${account.balance.toLocaleString('es-ES', { minimumFractionDigits: 2 })}`}
            change="+2.4%"
            positive
          />
          <StatCard 
            label="Equity" 
            value={`€${account.equity.toLocaleString('es-ES', { minimumFractionDigits: 2 })}`}
            change={((account.equity - account.balance) / account.balance * 100).toFixed(1) + '%'}
            positive={account.equity >= account.balance}
          />
          <StatCard 
            label="Open Positions" 
            value={positions.length.toString()}
            change={`${winningPositions} winning`}
            positive
          />
          <StatCard 
            label="Margin Level" 
            value={`${account.marginLevel.toFixed(0)}%`}
            change="Healthy"
            positive={account.marginLevel > 150}
          />
        </div>

        {/* Main Content Grid */}
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Positions Table */}
          <div className="lg:col-span-2 bg-[rgba(17,26,45,0.6)] rounded-2xl border border-white/10 p-6">
            <h2 className="text-lg font-bold mb-4">Open Positions</h2>
            
            {positions.length === 0 ? (
              <div className="text-center py-12 text-[#8da0c2]">
                No open positions
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="text-[#8da0c2] text-[0.75rem] uppercase tracking-wider">
                      <th className="text-left pb-3">Symbol</th>
                      <th className="text-left pb-3">Type</th>
                      <th className="text-right pb-3">Volume</th>
                      <th className="text-right pb-3">Open Price</th>
                      <th className="text-right pb-3">Current</th>
                      <th className="text-right pb-3">Profit</th>
                    </tr>
                  </thead>
                  <tbody>
                    {positions.map((pos) => (
                      <tr key={pos.ticket} className="border-t border-white/5">
                        <td className="py-3 font-medium">{pos.symbol}</td>
                        <td className="py-3">
                          <span className={`px-2 py-1 rounded text-[0.7rem] font-bold ${
                            pos.type === 'BUY' 
                              ? 'bg-green-500/20 text-green-400' 
                              : 'bg-red-500/20 text-red-400'
                          }`}>
                            {pos.type}
                          </span>
                        </td>
                        <td className="py-3 text-right text-[#8da0c2]">{pos.volume.toFixed(2)}</td>
                        <td className="py-3 text-right font-mono">{pos.priceOpen.toFixed(5)}</td>
                        <td className="py-3 text-right font-mono">{pos.priceCurrent.toFixed(5)}</td>
                        <td className={`py-3 text-right font-bold ${pos.profit >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                          {pos.profit >= 0 ? '+' : ''}{pos.profit.toFixed(2)} USD
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* Account Details */}
          <div className="space-y-6">
            {/* Quick Stats */}
            <div className="bg-[rgba(17,26,45,0.6)] rounded-2xl border border-white/10 p-6">
              <h3 className="text-lg font-bold mb-4">Account Details</h3>
              <div className="space-y-3">
                <DetailRow label="Margin" value={`€${account.margin.toFixed(2)}`} />
                <DetailRow label="Free Margin" value={`€${account.freeMargin.toFixed(2)}`} />
                <DetailRow label="Total P/L" value={`${totalProfit >= 0 ? '+' : ''}€${totalProfit.toFixed(2)}`} positive={totalProfit >= 0} />
              </div>
            </div>

            {/* Chart Preview */}
            <div className="bg-[rgba(17,26,45,0.6)] rounded-2xl border border-white/10 p-6">
              <h3 className="text-lg font-bold mb-4">Performance</h3>
              <svg width="100%" height="100" viewBox="0 0 200 100" className="text-[#667eea]">
                <defs>
                  <linearGradient id="perfGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="currentColor" stopOpacity="0.3"/>
                    <stop offset="100%" stopColor="currentColor" stopOpacity="0"/>
                  </linearGradient>
                </defs>
                <path 
                  d="M0,80 Q30,70 50,65 T100,55 T150,45 T200,30 L200,100 L0,100 Z" 
                  fill="url(#perfGrad)"
                />
                <path 
                  d="M0,80 Q30,70 50,65 T100,55 T150,45 T200,30" 
                  fill="none" 
                  stroke="currentColor" 
                  strokeWidth="2"
                />
              </svg>
              <p className="text-center text-[#8da0c2] text-[0.8rem] mt-2">Last 7 days</p>
            </div>

            {/* Actions */}
            <div className="bg-[rgba(17,26,45,0.6)] rounded-2xl border border-white/10 p-6">
              <h3 className="text-lg font-bold mb-4">Quick Actions</h3>
              <div className="space-y-3">
                <button className="w-full py-3 px-4 rounded-xl bg-[#667eea] hover:bg-[#5a6fd6] font-bold transition-colors">
                  New Position
                </button>
                <button className="w-full py-3 px-4 rounded-xl border border-white/20 hover:bg-white/5 font-medium transition-colors">
                  View History
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

function StatCard({ label, value, change, positive }: { label: string; value: string; change: string; positive?: boolean }) {
  return (
    <div className="bg-[rgba(17,26,45,0.6)] rounded-2xl border border-white/10 p-5">
      <div className="text-[#8da0c2] text-[0.75rem] uppercase tracking-wider mb-1">{label}</div>
      <div className="text-2xl font-black">{value}</div>
      <div className={`text-[0.8rem] mt-1 ${positive ? 'text-green-400' : 'text-red-400'}`}>
        {change}
      </div>
    </div>
  )
}

function DetailRow({ label, value, positive }: { label: string; value: string; positive?: boolean }) {
  return (
    <div className="flex justify-between items-center py-2 border-b border-white/5">
      <span className="text-[#8da0c2]">{label}</span>
      <span className={`font-mono font-medium ${positive !== undefined ? (positive ? 'text-green-400' : 'text-red-400') : 'text-white'}`}>
        {value}
      </span>
    </div>
  )
}
