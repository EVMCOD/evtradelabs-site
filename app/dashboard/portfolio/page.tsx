'use client'

import { useEffect, useState, useCallback } from 'react'
import Link from 'next/link'

interface Account {
  login: string
  name: string
  type: 'master' | 'sleeve' | 'signal'
  broker: string
  server: string
  balance: number
  equity: number
  currency: string
  leverage: number
  isConnected: boolean
  riskProfile?: 'conservative' | 'moderate' | 'aggressive'
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
    sharpeRatio: number
  }
  replication: {
    isEnabled: boolean
    ratio: number
    positionsReplicated: number
  }
}

interface Trade {
  id: string
  ticket: number
  timestamp: string
  symbol: string
  type: 'BUY' | 'SELL'
  volume: number
  openPrice: number
  closePrice?: number
  sl: number
  tp: number
  pnl: number
  commission: number
  swap: number
  account: string
  accountType: 'master' | 'sleeve' | 'signal'
  duration: string
  status: 'open' | 'closed'
}

export default function PortfolioPage() {
  const [accounts, setAccounts] = useState<Account[]>([])
  const [trades, setTrades] = useState<Trade[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedPeriod, setSelectedPeriod] = useState<'today' | 'week' | 'month'>('today')

  const fetchData = useCallback(async () => {
    try {
      const [accountsRes, tradesRes] = await Promise.all([
        fetch('/api/dashboard/accounts'),
        fetch('/api/dashboard/positions')
      ])
      
      const accountsData = await accountsRes.json()
      const positionsData = await tradesRes.json()
      
      // Transform positions to trades
      const mockTrades: Trade[] = positionsData.positions?.slice(0, 5).map((p: any, i: number) => ({
        id: `T${p.ticket}`,
        ticket: p.ticket,
        timestamp: new Date(Date.now() - i * 3600000).toISOString(),
        symbol: p.symbol,
        type: p.type,
        volume: p.volume,
        openPrice: p.priceOpen,
        closePrice: p.priceCurrent,
        sl: p.sl,
        tp: p.tp,
        pnl: p.profit,
        commission: -2.5,
        swap: -0.3,
        account: '12345678',
        accountType: 'master',
        duration: `${Math.floor(Math.random() * 48) + 1}h`,
        status: 'open'
      })) || []

      setAccounts(accountsData.accounts || getMockAccounts())
      setTrades(mockTrades)
    } catch {
      setAccounts(getMockAccounts())
    }
    setLoading(false)
  }, [])

  useEffect(() => {
    fetchData()
    const interval = setInterval(fetchData, 10000)
    return () => clearInterval(interval)
  }, [fetchData])

  const getMockAccounts = (): Account[] => [
    {
      login: '12345678',
      name: 'Master Account',
      type: 'master',
      broker: 'ICMarkets',
      server: 'ICMarketsSC-Demo',
      balance: 24521.50,
      equity: 25834.20,
      currency: 'EUR',
      leverage: 100,
      isConnected: true,
      performance: {
        todayPnl: 1312.70,
        todayPnlPercent: 5.65,
        weekPnl: 3420.30,
        monthPnl: 7840.50,
        drawdown: 3.2,
        maxDrawdown: 8.5,
        winRate: 67.3,
        profitFactor: 2.1,
        totalTrades: 156,
        sharpeRatio: 1.84
      },
      replication: { isEnabled: true, ratio: 1, positionsReplicated: 25 }
    },
    {
      login: '87654321',
      name: 'Sleeve EUR',
      type: 'sleeve',
      broker: 'ICMarkets',
      server: 'ICMarketsSC-Demo',
      balance: 8540.20,
      equity: 8720.50,
      currency: 'EUR',
      leverage: 100,
      isConnected: true,
      riskProfile: 'conservative',
      performance: {
        todayPnl: 180.30,
        todayPnlPercent: 2.15,
        weekPnl: 520.40,
        monthPnl: 1180.00,
        drawdown: 1.8,
        maxDrawdown: 4.2,
        winRate: 71.2,
        profitFactor: 2.3,
        totalTrades: 89,
        sharpeRatio: 1.95
      },
      replication: { isEnabled: true, ratio: 0.5, positionsReplicated: 12 }
    },
    {
      login: '87654322',
      name: 'Sleeve Gold',
      type: 'sleeve',
      broker: 'Vantage',
      server: 'VantageGlobal-Demo',
      balance: 12300.00,
      equity: 12450.80,
      currency: 'EUR',
      leverage: 200,
      isConnected: true,
      riskProfile: 'aggressive',
      performance: {
        todayPnl: -120.50,
        todayPnlPercent: -0.97,
        weekPnl: 890.20,
        monthPnl: 2150.30,
        drawdown: 4.5,
        maxDrawdown: 12.3,
        winRate: 58.9,
        profitFactor: 1.7,
        totalTrades: 67,
        sharpeRatio: 1.42
      },
      replication: { isEnabled: true, ratio: 0.75, positionsReplicated: 8 }
    },
    {
      login: '87654323',
      name: 'Sleeve Indices',
      type: 'sleeve',
      broker: 'VT Markets',
      server: 'VTM-Demo',
      balance: 5200.00,
      equity: 5180.40,
      currency: 'EUR',
      leverage: 100,
      isConnected: false,
      riskProfile: 'moderate',
      performance: {
        todayPnl: -19.60,
        todayPnlPercent: -0.38,
        weekPnl: 180.50,
        monthPnl: 420.80,
        drawdown: 2.1,
        maxDrawdown: 5.8,
        winRate: 64.5,
        profitFactor: 1.9,
        totalTrades: 45,
        sharpeRatio: 1.68
      },
      replication: { isEnabled: false, ratio: 0.3, positionsReplicated: 5 }
    },
    {
      login: '99887766',
      name: 'Signal Provider',
      type: 'signal',
      broker: 'TradingView',
      server: 'Signals-MT5',
      balance: 50000.00,
      equity: 53500.00,
      currency: 'USD',
      leverage: 50,
      isConnected: true,
      performance: {
        todayPnl: 2500.00,
        todayPnlPercent: 4.90,
        weekPnl: 6800.00,
        monthPnl: 15200.00,
        drawdown: 5.2,
        maxDrawdown: 15.0,
        winRate: 62.8,
        profitFactor: 2.4,
        totalTrades: 312,
        sharpeRatio: 2.1
      },
      replication: { isEnabled: false, ratio: 0, positionsReplicated: 0 }
    }
  ]

  const totalEquity = accounts.reduce((sum, acc) => sum + acc.equity, 0)
  const totalBalance = accounts.reduce((sum, acc) => sum + acc.balance, 0)
  const totalPnlToday = accounts.reduce((sum, acc) => sum + acc.performance.todayPnl, 0)
  const connectedAccounts = accounts.filter(acc => acc.isConnected).length

  const getPnlForPeriod = (acc: Account) => {
    switch (selectedPeriod) {
      case 'today': return acc.performance.todayPnl
      case 'week': return acc.performance.weekPnl
      case 'month': return acc.performance.monthPnl
    }
  }

  const getPnlPercentForPeriod = (acc: Account) => {
    switch (selectedPeriod) {
      case 'today': return acc.performance.todayPnlPercent
      case 'week': return (acc.performance.weekPnl / acc.balance) * 100
      case 'month': return (acc.performance.monthPnl / acc.balance) * 100
    }
  }

  const formatCurrency = (value: number, currency = 'EUR') => {
    const symbol = currency === 'USD' ? '$' : '€'
    return `${symbol}${value.toLocaleString('es-ES', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
  }

  const formatTime = (isoString: string) => {
    const date = new Date(isoString)
    return date.toLocaleString('es-ES', { 
      day: '2-digit', 
      month: '2-digit',
      hour: '2-digit', 
      minute: '2-digit' 
    })
  }

  const getAccountTypeBadge = (type: Account['type']) => {
    switch (type) {
      case 'master': return { bg: 'bg-[#667eea]/20', text: 'text-[#667eea]', label: 'MASTER' }
      case 'sleeve': return { bg: 'bg-green-500/20', text: 'text-green-400', label: 'SLEEVE' }
      case 'signal': return { bg: 'bg-yellow-500/20', text: 'text-yellow-400', label: 'SIGNAL' }
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0a0f1a] flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-[#667eea] border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="mt-4 text-[#8da0c2]">Loading portfolio...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#0a0f1a] text-white">
      {/* Header */}
      <header className="border-b border-white/10 bg-[rgba(17,26,45,0.95)] backdrop-blur-xl sticky top-0 z-50">
        <div className="max-w-[1800px] mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/dashboard" className="text-[#8da0c2] hover:text-white transition-colors flex items-center gap-2">
                <span>←</span>
                <span>Back</span>
              </Link>
              <div className="w-px h-6 bg-white/20" />
              <div>
                <div className="font-bold text-lg">Portfolio Manager</div>
                <div className="text-[#8da0c2] text-xs">Complete account overview</div>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 text-xs">
                <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                <span>{connectedAccounts}/{accounts.length} Connected</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-[1800px] mx-auto px-6 py-8 space-y-8">
        {/* Total Portfolio Summary */}
        <div className="grid grid-cols-4 gap-6">
          <div className="col-span-2 bg-gradient-to-br from-[#667eea]/20 to-[#764ba2]/20 rounded-2xl border border-[#667eea]/30 p-6">
            <div className="text-[#8da0c2] text-xs uppercase tracking-wider mb-2">Total Equity</div>
            <div className="text-4xl font-black mb-1">€{totalEquity.toLocaleString('es-ES', { minimumFractionDigits: 2 })}</div>
            <div className="flex items-center gap-4 text-sm">
              <span className="text-[#8da0c2]">Total Balance: <span className="text-white font-medium">€{totalBalance.toLocaleString('es-ES', { minimumFractionDigits: 2 })}</span></span>
              <span className={`font-bold ${totalPnlToday >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                {totalPnlToday >= 0 ? '+' : ''}€{totalPnlToday.toFixed(2)} today
              </span>
            </div>
          </div>
          
          <div className="bg-[rgba(17,26,45,0.6)] rounded-2xl border border-white/10 p-6">
            <div className="text-[#8da0c2] text-xs uppercase tracking-wider mb-2">Total P/L {selectedPeriod}</div>
            <div className={`text-3xl font-black ${totalPnlToday >= 0 ? 'text-green-400' : 'text-red-400'}`}>
              {totalPnlToday >= 0 ? '+' : ''}€{totalPnlToday.toFixed(2)}
            </div>
            <div className="text-xs text-[#8da0c2] mt-1">
              {accounts.length} accounts
            </div>
          </div>
          
          <div className="bg-[rgba(17,26,45,0.6)] rounded-2xl border border-white/10 p-6">
            <div className="text-[#8da0c2] text-xs uppercase tracking-wider mb-2">Avg Win Rate</div>
            <div className="text-3xl font-black">
              {(accounts.reduce((sum, acc) => sum + acc.performance.winRate, 0) / accounts.length).toFixed(1)}%
            </div>
            <div className="text-xs text-[#8da0c2] mt-1">
              Profit Factor: {(accounts.reduce((sum, acc) => sum + acc.performance.profitFactor, 0) / accounts.length).toFixed(2)}
            </div>
          </div>
        </div>

        {/* Period Selector */}
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold">Accounts</h2>
          <div className="flex gap-2">
            {(['today', 'week', 'month'] as const).map((period) => (
              <button
                key={period}
                onClick={() => setSelectedPeriod(period)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  selectedPeriod === period
                    ? 'bg-[#667eea] text-white'
                    : 'bg-white/5 text-[#8da0c2] hover:bg-white/10'
                }`}
              >
                {period === 'today' ? 'Today' : period === 'week' ? 'This Week' : 'This Month'}
              </button>
            ))}
          </div>
        </div>

        {/* Accounts Grid */}
        <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
          {accounts.map((account) => {
            const badge = getAccountTypeBadge(account.type)
            const pnl = getPnlForPeriod(account)
            const pnlPercent = getPnlPercentForPeriod(account)
            
            return (
              <div 
                key={account.login}
                className="bg-[rgba(17,26,45,0.6)] rounded-2xl border border-white/10 p-6 hover:border-[#667eea]/30 transition-all"
              >
                {/* Account Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center font-bold text-lg ${
                      account.type === 'master' ? 'bg-[#667eea]/20 text-[#667eea]' :
                      account.type === 'sleeve' ? 'bg-green-500/20 text-green-400' :
                      'bg-yellow-500/20 text-yellow-400'
                    }`}>
                      {account.name.charAt(0)}
                    </div>
                    <div>
                      <div className="font-bold">{account.name}</div>
                      <div className="flex items-center gap-2">
                        <span className="text-[#8da0c2] text-xs">#{account.login}</span>
                        <span className={`px-2 py-0.5 rounded text-xs font-bold ${badge.bg} ${badge.text}`}>
                          {badge.label}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className={`w-3 h-3 rounded-full ${account.isConnected ? 'bg-green-500' : 'bg-red-500'}`} />
                </div>

                {/* Balance & Equity */}
                <div className="grid grid-cols-2 gap-3 mb-4">
                  <div className="bg-white/5 rounded-lg p-3">
                    <div className="text-[#8da0c2] text-xs mb-1">Balance</div>
                    <div className="font-bold">{formatCurrency(account.balance, account.currency)}</div>
                  </div>
                  <div className="bg-white/5 rounded-lg p-3">
                    <div className="text-[#8da0c2] text-xs mb-1">Equity</div>
                    <div className={`font-bold ${account.equity >= account.balance ? 'text-green-400' : 'text-red-400'}`}>
                      {formatCurrency(account.equity, account.currency)}
                    </div>
                  </div>
                </div>

                {/* P/L for Period */}
                <div className="bg-white/5 rounded-lg p-4 mb-4">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-[#8da0c2] text-sm">P/L {selectedPeriod}</span>
                    <span className={`text-xl font-bold ${pnl >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                      {pnl >= 0 ? '+' : ''}{formatCurrency(pnl, account.currency)}
                    </span>
                  </div>
                  <div className="flex justify-between items-center text-xs text-[#8da0c2]">
                    <span>Return</span>
                    <span className={pnlPercent >= 0 ? 'text-green-400' : 'text-red-400'}>
                      {pnlPercent >= 0 ? '+' : ''}{pnlPercent.toFixed(2)}%
                    </span>
                  </div>
                </div>

                {/* Performance Stats */}
                <div className="grid grid-cols-3 gap-2 mb-4">
                  <div className="text-center">
                    <div className="text-[#8da0c2] text-xs">Win Rate</div>
                    <div className="font-bold text-sm">{account.performance.winRate}%</div>
                  </div>
                  <div className="text-center">
                    <div className="text-[#8da0c2] text-xs">Drawdown</div>
                    <div className="font-bold text-sm text-red-400">{account.performance.drawdown}%</div>
                  </div>
                  <div className="text-center">
                    <div className="text-[#8da0c2] text-xs">Trades</div>
                    <div className="font-bold text-sm">{account.performance.totalTrades}</div>
                  </div>
                </div>

                {/* Risk Profile (for sleeves) */}
                {account.riskProfile && (
                  <div className="flex items-center justify-between text-xs mb-4 px-2">
                    <span className="text-[#8da0c2]">Risk Profile</span>
                    <span className={`font-bold uppercase ${
                      account.riskProfile === 'aggressive' ? 'text-red-400' :
                      account.riskProfile === 'moderate' ? 'text-yellow-400' :
                      'text-green-400'
                    }`}>
                      {account.riskProfile}
                    </span>
                  </div>
                )}

                {/* Replication Status (for sleeves) */}
                {account.type === 'sleeve' && (
                  <div className="flex items-center justify-between text-xs mb-4 px-2">
                    <span className="text-[#8da0c2]">Replication</span>
                    <span className={account.replication.isEnabled ? 'text-green-400' : 'text-gray-500'}>
                      {account.replication.isEnabled 
                        ? `Active (${(account.replication.ratio * 100).toFixed(0)}%)`
                        : 'Disabled'}
                    </span>
                  </div>
                )}

                {/* Broker Info */}
                <div className="text-xs text-[#8da0c2] border-t border-white/5 pt-3">
                  {account.broker} · {account.server} · {account.leverage}:1 leverage
                </div>
              </div>
            )
          })}
        </div>

        {/* Recent Trades / Journal */}
        <div className="bg-[rgba(17,26,45,0.6)] rounded-2xl border border-white/10 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold">Trading Journal</h3>
            <Link 
              href="/dashboard/journal"
              className="text-xs text-[#667eea] hover:text-[#8da0c2] transition-colors"
            >
              View Full Journal →
            </Link>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="text-[#8da0c2] text-xs uppercase border-b border-white/10">
                  <th className="text-left py-3 px-4">Time</th>
                  <th className="text-left py-3 px-4">Account</th>
                  <th className="text-left py-3 px-4">Symbol</th>
                  <th className="text-left py-3 px-4">Type</th>
                  <th className="text-right py-3 px-4">Volume</th>
                  <th className="text-right py-3 px-4">Open</th>
                  <th className="text-right py-3 px-4">Current</th>
                  <th className="text-right py-3 px-4">P/L</th>
                  <th className="text-center py-3 px-4">Status</th>
                </tr>
              </thead>
              <tbody>
                {trades.length === 0 ? (
                  <tr>
                    <td colSpan={9} className="text-center py-8 text-[#8da0c2]">
                      No trades yet. Connect your MT5 accounts to start tracking.
                    </td>
                  </tr>
                ) : (
                  trades.map((trade) => (
                    <tr key={trade.id} className="border-b border-white/5 hover:bg-white/5">
                      <td className="py-3 px-4 text-sm font-mono">{formatTime(trade.timestamp)}</td>
                      <td className="py-3 px-4">
                        <span className="text-xs">#{trade.account}</span>
                      </td>
                      <td className="py-3 px-4 font-medium">{trade.symbol}</td>
                      <td className={`py-3 px-4 font-bold ${
                        trade.type === 'BUY' ? 'text-green-400' : 'text-red-400'
                      }`}>
                        {trade.type}
                      </td>
                      <td className="py-3 px-4 text-right">{trade.volume.toFixed(2)}</td>
                      <td className="py-3 px-4 text-right">{trade.openPrice.toFixed(5)}</td>
                      <td className="py-3 px-4 text-right">{trade.closePrice?.toFixed(5) || '-'}</td>
                      <td className={`py-3 px-4 text-right font-bold ${
                        trade.pnl >= 0 ? 'text-green-400' : 'text-red-400'
                      }`}>
                        {trade.pnl >= 0 ? '+' : ''}€{trade.pnl.toFixed(2)}
                      </td>
                      <td className="py-3 px-4 text-center">
                        <span className={`px-2 py-1 rounded text-xs font-bold ${
                          trade.status === 'open' 
                            ? 'bg-blue-500/20 text-blue-400' 
                            : 'bg-green-500/20 text-green-400'
                        }`}>
                          {trade.status.toUpperCase()}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  )
}
