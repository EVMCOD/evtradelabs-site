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
  type: 'master' | 'sleeve' | 'signal'
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
  sl: number // Stop Loss
  tp: number // Take Profit
}

export default function DashboardPage() {
  const [accounts, setAccounts] = useState<Account[]>([])
  const [selectedAccount, setSelectedAccount] = useState<string | null>(null)
  const [positions, setPositions] = useState<Position[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchData() {
      try {
        // Fetch all accounts
        const accountsRes = await fetch('/api/dashboard/accounts')
        const accountsData = await accountsRes.json()
        setAccounts(accountsData)
        
        // Select first account by default
        if (accountsData.length > 0) {
          setSelectedAccount(accountsData[0].login)
        }
        
        // Fetch positions
        const positionsRes = await fetch('/api/dashboard/positions')
        const positionsData = await positionsRes.json()
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

  const currentAccount = accounts.find(a => a.login === selectedAccount) || accounts[0]

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

  if (error || accounts.length === 0) {
    return (
      <div className="min-h-screen bg-[#0a0f1a] flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-400">{error || 'No accounts found'}</p>
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
        <div className="max-w-[1600px] mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[#667eea] to-[#764ba2] flex items-center justify-center font-black">
              EV
            </div>
            <div>
              <div className="font-bold">EV Trading Labs</div>
              <div className="text-[#8da0c2] text-[0.75rem]">Real-time monitoring</div>
            </div>
          </div>
          
          <nav className="flex items-center gap-6">
            <Link href="/" className="text-[#8da0c2] hover:text-white transition-colors">
              Home
            </Link>
            <Link href="/dashboard" className="text-white font-medium">
              Dashboard
            </Link>
            <Link href="/dashboard/portfolio" className="text-[#8da0c2] hover:text-white transition-colors">
              Portfolio
            </Link>
            <Link href="/dashboard/replication" className="text-[#8da0c2] hover:text-white transition-colors">
              Replication
            </Link>
          </nav>
          
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
            <span className="text-[0.75rem] text-green-400">Live</span>
          </div>
        </div>
      </header>

      <main className="max-w-[1600px] mx-auto px-6 py-8">
        {/* Account Selector */}
        <div className="mb-8">
          <h2 className="text-[#8da0c2] text-[0.75rem] uppercase tracking-wider mb-3">Select Account</h2>
          <div className="flex flex-wrap gap-3">
            {accounts.map((account) => (
              <button
                key={account.login}
                onClick={() => setSelectedAccount(account.login)}
                className={`px-4 py-3 rounded-xl border transition-all duration-200 ${
                  selectedAccount === account.login
                    ? 'border-[#667eea] bg-[#667eea]/10'
                    : 'border-white/10 bg-white/5 hover:bg-white/10'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold ${
                    account.type === 'master' 
                      ? 'bg-[#667eea]/20 text-[#667eea]' 
                      : account.type === 'sleeve'
                      ? 'bg-[#10b981]/20 text-[#10b981]'
                      : 'bg-[#f59e0b]/20 text-[#f59e0b]'
                  }`}>
                    {account.type === 'master' ? 'M' : account.type === 'sleeve' ? 'S' : 'X'}
                  </div>
                  <div className="text-left">
                    <div className="font-medium text-sm">{account.name}</div>
                    <div className="text-[0.7rem] text-[#8da0c2]">#{account.login}</div>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Stats Grid */}
        {currentAccount && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <StatCard 
              label="Balance" 
              value={`€${currentAccount.balance.toLocaleString('es-ES', { minimumFractionDigits: 2 })}`}
              change="+2.4%"
              positive
            />
            <StatCard 
              label="Equity" 
              value={`€${currentAccount.equity.toLocaleString('es-ES', { minimumFractionDigits: 2 })}`}
              change={((currentAccount.equity - currentAccount.balance) / currentAccount.balance * 100).toFixed(1) + '%'}
              positive={currentAccount.equity >= currentAccount.balance}
            />
            <StatCard 
              label="Open Positions" 
              value={positions.length.toString()}
              change={`${winningPositions} winning`}
              positive
            />
            <StatCard 
              label="Margin Level" 
              value={`${currentAccount.marginLevel.toFixed(0)}%`}
              change="Healthy"
              positive={currentAccount.marginLevel > 150}
            />
          </div>
        )}

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
                    <tr className="text-[#8da0c2] text-[0.7rem] uppercase tracking-wider">
                      <th className="text-left pb-3">Symbol</th>
                      <th className="text-left pb-3">Type</th>
                      <th className="text-right pb-3">Volume</th>
                      <th className="text-right pb-3">Open</th>
                      <th className="text-right pb-3">SL</th>
                      <th className="text-right pb-3">TP</th>
                      <th className="text-right pb-3">Current</th>
                      <th className="text-right pb-3">P/L</th>
                    </tr>
                  </thead>
                  <tbody>
                    {positions.map((pos) => (
                      <tr key={pos.ticket} className="border-t border-white/5 hover:bg-white/5">
                        <td className="py-3">
                          <div className="font-medium">{pos.symbol}</div>
                          <div className="text-[0.65rem] text-[#8da0c2]">#{pos.ticket}</div>
                        </td>
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
                        <td className="py-3 text-right font-mono text-[0.85rem]">{pos.priceOpen.toFixed(5)}</td>
                        <td className="py-3 text-right font-mono text-[0.85rem] text-red-400/70">{pos.sl.toFixed(5)}</td>
                        <td className="py-3 text-right font-mono text-[0.85rem] text-green-400/70">{pos.tp.toFixed(5)}</td>
                        <td className="py-3 text-right font-mono text-[0.85rem]">{pos.priceCurrent.toFixed(5)}</td>
                        <td className={`py-3 text-right font-bold ${pos.profit >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                          {pos.profit >= 0 ? '+' : ''}{pos.profit.toFixed(2)}
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
              {currentAccount && (
                <div className="space-y-3">
                  <DetailRow label="Login" value={`#${currentAccount.login}`} />
                  <DetailRow label="Server" value={currentAccount.server} />
                  <DetailRow label="Margin" value={`€${currentAccount.margin.toFixed(2)}`} />
                  <DetailRow label="Free Margin" value={`€${currentAccount.freeMargin.toFixed(2)}`} />
                  <DetailRow label="Total P/L" value={`${totalProfit >= 0 ? '+' : ''}€${totalProfit.toFixed(2)}`} positive={totalProfit >= 0} />
                </div>
              )}
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

            {/* Legend */}
            <div className="bg-[rgba(17,26,45,0.6)] rounded-2xl border border-white/10 p-6">
              <h3 className="text-lg font-bold mb-4">Legend</h3>
              <div className="space-y-2 text-[0.85rem">
                <div className="flex items-center gap-3">
                  <div className="w-6 h-6 rounded bg-[#667eea]/20 text-[#667eea] flex items-center justify-center text-[0.6rem] font-bold">M</div>
                  <span className="text-[#8da0c2]">Master Account</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-6 h-6 rounded bg-[#10b981]/20 text-[#10b981] flex items-center justify-center text-[0.6rem] font-bold">S</div>
                  <span className="text-[#8da0c2]">Sleeve Account</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-6 h-6 rounded bg-[#f59e0b]/20 text-[#f59e0b] flex items-center justify-center text-[0.6rem] font-bold">X</div>
                  <span className="text-[#8da0c2]">Signal Account</span>
                </div>
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
