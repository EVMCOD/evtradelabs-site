'use client';

import { useState } from 'react';
import Navbar from '../_components/Navbar';

const mockData = {
  account: {
    name: 'EV Trading Lab #001',
    broker: 'IC Markets',
    currency: 'USD',
    server: 'ICMarketsSC-Demo',
    leverage: '1:500',
    balance: 24853.42,
    equity: 26147.18,
    margin: 1842.30,
    freeMargin: 24304.88,
    marginLevel: 1419.2,
    dailyPnL: 1293.76,
    monthlyPnL: 4853.42,
  },
  stats: {
    totalTrades: 847,
    winRate: 68.4,
    profitFactor: 2.31,
    expectancy: 1.24,
    sharpeRatio: 2.87,
    maxDrawdown: 8.32,
    maxDrawdownPeak: 12.45,
    recoveryFactor: 3.21,
    riskRewardRatio: 1.87,
    // MFE/MAE
    mfe: 2847.50,
    mae: -342.18,
    avgMFE: 423.18,
    avgMAE: -89.42,
    // Trade stats
    avgWin: 385.42,
    avgLoss: -187.65,
    largestWin: 2847.50,
    largestLoss: -892.30,
    avgRiskPercent: 1.23,
    totalVolume: 124583.5,
    // Streaks
    currentStreak: 7,
    bestStreak: 23,
    worstStreak: -12,
    avgTradesPerDay: 4.2,
  },
  equityCurve: [
    { date: 'Ene', balance: 20000 },
    { date: 'Feb', balance: 21300 },
    { date: 'Mar', balance: 20850 },
    { date: 'Abr', balance: 22400 },
    { date: 'May', balance: 23100 },
    { date: 'Jun', balance: 22950 },
    { date: 'Jul', balance: 23800 },
    { date: 'Ago', balance: 24100 },
    { date: 'Sep', balance: 23500 },
    { date: 'Oct', balance: 24300 },
    { date: 'Nov', balance: 24853 },
  ],
  recentTrades: [
    { id: 847, symbol: 'EURUSD', type: 'BUY', volume: 0.50, openPrice: 1.0842, currentPrice: 1.0893, profit: 255.00, mfe: 312.50, mae: -12.30, date: '10:32' },
    { id: 846, symbol: 'GBPJPY', type: 'SELL', volume: 0.30, openPrice: 188.450, currentPrice: 188.120, profit: 142.80, mfe: 198.20, mae: -45.60, date: '09:15' },
    { id: 845, symbol: 'XAUUSD', type: 'BUY', volume: 0.20, openPrice: 2345.00, currentPrice: 2348.50, profit: 70.00, mfe: 124.00, mae: -28.40, date: '08:45' },
    { id: 844, symbol: 'EURUSD', type: 'SELL', volume: 0.50, openPrice: 1.0890, currentPrice: 1.0865, profit: 125.00, mfe: 156.80, mae: -32.10, date: 'Yesterday' },
    { id: 843, symbol: 'USDJPY', type: 'BUY', volume: 0.40, openPrice: 154.320, currentPrice: 154.180, profit: -56.00, mfe: 89.40, mae: -124.30, date: 'Yesterday' },
  ],
};

function StatCard({ label, value, sub, color = 'white' }: { label: string; value: string; sub?: string; color?: string }) {
  return (
    <div className="rounded-xl p-4" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}>
      <div className="text-[0.7rem] text-white/40 uppercase tracking-wider mb-1">{label}</div>
      <div className={`text-[1.3rem] font-black ${color}`}>{value}</div>
      {sub && <div className="text-[0.7rem] text-white/30 mt-0.5">{sub}</div>}
    </div>
  );
}

function MfeMaeBar({ mfe, mae, label }: { mfe: number; mae: number; label: string }) {
  const total = mfe + Math.abs(mae);
  const mfePct = (mfe / total) * 100;
  const maePct = (Math.abs(mae) / total) * 100;
  
  return (
    <div className="mb-3">
      <div className="flex justify-between text-[0.75rem] mb-1">
        <span className="text-white/50">{label}</span>
        <span className="text-[#22c55e]">MFE {mfe.toFixed(2)}</span>
        <span className="text-[#ef4444]">MAE {mae.toFixed(2)}</span>
      </div>
      <div className="h-2 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.05)' }}>
        <div className="h-full float-end" style={{ width: `${mfePct}%`, background: 'linear-gradient(90deg, #22c55e, #4ade80)' }} />
      </div>
    </div>
  );
}

export default function DashboardPage() {
  const [selectedAccount, setSelectedAccount] = useState(0);
  
  return (
    <div className="min-h-screen" style={{ background: 'linear-gradient(180deg, #0a0a0f 0%, #0d1117 100%)' }}>
      <Navbar />
      
      <div className="max-w-[1400px] mx-auto px-5 pt-28 pb-16">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
          <div>
            <div className="text-[0.7rem] text-white/30 uppercase tracking-wider mb-1">Dashboard</div>
            <h1 className="text-[2rem] font-black text-white">{mockData.account.name}</h1>
            <div className="flex items-center gap-3 mt-2 text-[0.8rem] text-white/40">
              <span>{mockData.account.broker}</span>
              <span className="text-white/20">•</span>
              <span>{mockData.account.server}</span>
              <span className="text-white/20">•</span>
              <span>Leverage {mockData.account.leverage}</span>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <div className="px-4 py-2 rounded-lg text-[#22c55e] text-[0.85rem] font-bold" style={{ background: 'rgba(34,197,94,0.1)', border: '1px solid rgba(34,197,94,0.2)' }}>
              ● Conectado
            </div>
            <div className="text-[0.8rem] text-white/40">Última actualización: hace 2 min</div>
          </div>
        </div>

        {/* Balance & Equity Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="rounded-2xl p-6" style={{ background: 'linear-gradient(135deg, rgba(102,126,234,0.15) 0%, rgba(139,92,246,0.05) 100%)', border: '1px solid rgba(102,126,234,0.2)' }}>
            <div className="text-[0.7rem] text-white/40 uppercase tracking-wider mb-2">Balance</div>
            <div className="text-[2.2rem] font-black text-white">${mockData.account.balance.toLocaleString('en-US', { minimumFractionDigits: 2 })}</div>
          </div>
          <div className="rounded-2xl p-6" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}>
            <div className="text-[0.7rem] text-white/40 uppercase tracking-wider mb-2">Equity</div>
            <div className="text-[2.2rem] font-black text-[#22c55e]">${mockData.account.equity.toLocaleString('en-US', { minimumFractionDigits: 2 })}</div>
          </div>
          <div className="rounded-2xl p-6" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}>
            <div className="text-[0.7rem] text-white/40 uppercase tracking-wider mb-2">Margin</div>
            <div className="text-[2.2rem] font-black text-white">${mockData.account.margin.toLocaleString('en-US', { minimumFractionDigits: 2 })}</div>
            <div className="text-[0.7rem] text-white/30 mt-1">Free: ${mockData.account.freeMargin.toLocaleString('en-US', { minimumFractionDigits: 2 })}</div>
          </div>
          <div className="rounded-2xl p-6" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}>
            <div className="text-[0.7rem] text-white/40 uppercase tracking-wider mb-2">Daily P&L</div>
            <div className="text-[2.2rem] font-black text-[#22c55e]">+${mockData.account.dailyPnL.toLocaleString('en-US', { minimumFractionDigits: 2 })}</div>
            <div className="text-[0.7rem] text-white/30 mt-1">Monthly: +${mockData.account.monthlyPnL.toLocaleString('en-US', { minimumFractionDigits: 2 })}</div>
          </div>
        </div>

        {/* Equity Curve */}
        <div className="rounded-2xl p-6 mb-6" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}>
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-[1rem] font-bold text-white">Equity Curve</h2>
            <div className="flex gap-4 text-[0.8rem]">
              <span className="text-white/40">Profit: <span className="text-[#22c55e] font-semibold">+${(mockData.account.equity - 20000).toLocaleString('en-US', { minimumFractionDigits: 2 })}</span></span>
              <span className="text-white/40">Return: <span className="text-[#22c55e] font-semibold">+24.27%</span></span>
            </div>
          </div>
          <div className="h-[250px] relative">
            <svg viewBox="0 0 1000 200" className="w-full h-full" preserveAspectRatio="none">
              {/* Grid */}
              {[0, 50, 100, 150, 200].map(y => (
                <line key={y} x1="0" y1={y} x2="1000" y2={y} stroke="rgba(255,255,255,0.03)" strokeWidth="1"/>
              ))}
              {/* Area fill */}
              <defs>
                <linearGradient id="equityGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#22c55e" stopOpacity="0.3"/>
                  <stop offset="100%" stopColor="#22c55e" stopOpacity="0"/>
                </linearGradient>
              </defs>
              <polygon 
                points={mockData.equityCurve.map((p, i) => `${(i / (mockData.equityCurve.length - 1)) * 1000},${200 - ((p.balance - 19000) / 8000) * 180}`).join(' ')}
                fill="url(#equityGrad)"
              />
              {/* Line */}
              <polyline 
                points={mockData.equityCurve.map((p, i) => `${(i / (mockData.equityCurve.length - 1)) * 1000},${200 - ((p.balance - 19000) / 8000) * 180}`).join(' ')}
                fill="none"
                stroke="#22c55e"
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              {/* Dots */}
              {mockData.equityCurve.map((p, i) => (
                <circle 
                  key={i}
                  cx={(i / (mockData.equityCurve.length - 1)) * 1000}
                  cy={200 - ((p.balance - 19000) / 8000) * 180}
                  r="6"
                  fill="#22c55e"
                  stroke="#0a0a0f"
                  strokeWidth="2"
                />
              ))}
            </svg>
            {/* X-axis labels */}
            <div className="flex justify-between mt-2 text-[0.65rem] text-white/30">
              {mockData.equityCurve.map(p => (
                <span key={p.date}>{p.date}</span>
              ))}
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 mb-6">
          <StatCard label="Total Trades" value={mockData.stats.totalTrades.toString()} />
          <StatCard label="Win Rate" value={`${mockData.stats.winRate}%`} color="text-[#22c55e]" />
          <StatCard label="Profit Factor" value={mockData.stats.profitFactor.toFixed(2)} color="text-[#22c55e]" />
          <StatCard label="Expectancy" value={`$${mockData.stats.expectancy.toFixed(2)}`} color="text-[#22c55e]" />
          <StatCard label="Sharpe Ratio" value={mockData.stats.sharpeRatio.toFixed(2)} />
          <StatCard label="Max Drawdown" value={`${mockData.stats.maxDrawdown}%`} color="text-[#ef4444]" />
          <StatCard label="Avg Win" value={`$${mockData.stats.avgWin.toFixed(2)}`} color="text-[#22c55e]" />
          <StatCard label="Avg Loss" value={`$${mockData.stats.avgLoss.toFixed(2)}`} color="text-[#ef4444]" />
          <StatCard label="Largest Win" value={`$${mockData.stats.largestWin.toFixed(2)}`} color="text-[#22c55e]" />
          <StatCard label="Largest Loss" value={`$${mockData.stats.largestLoss.toFixed(2)}`} color="text-[#ef4444]" />
          <StatCard label="Risk Reward" value={mockData.stats.riskRewardRatio.toFixed(2)} />
          <StatCard label="Recovery Factor" value={mockData.stats.recoveryFactor.toFixed(2)} color="text-[#22c55e]" />
        </div>

        {/* MFE/MAE Section */}
        <div className="grid md:grid-cols-2 gap-6 mb-6">
          <div className="rounded-2xl p-6" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}>
            <h2 className="text-[1rem] font-bold text-white mb-6">MFE / MAE Analysis</h2>
            
            <div className="mb-6">
              <div className="text-[0.8rem] text-white/50 mb-3">Lifetime MFE vs MAE</div>
              <div className="flex justify-between text-[1.2rem] font-bold">
                <span className="text-[#22c55e]">MFE: ${mockData.stats.mfe.toFixed(2)}</span>
                <span className="text-[#ef4444]">MAE: ${mockData.stats.mae.toFixed(2)}</span>
              </div>
            </div>
            
            <div className="h-[80px] rounded-lg overflow-hidden relative" style={{ background: 'rgba(255,255,255,0.02)' }}>
              <div className="absolute inset-0 flex items-center">
                <div className="w-full px-4">
                  <div className="h-full rounded-full overflow-hidden flex">
                    <div className="bg-gradient-to-r from-transparent to-[#22c55e]" style={{ width: `${(mockData.stats.mfe / (mockData.stats.mfe + Math.abs(mockData.stats.mae))) * 100}%` }} />
                    <div className="bg-gradient-to-l from-transparent to-[#ef4444]" style={{ width: `${(Math.abs(mockData.stats.mae) / (mockData.stats.mfe + Math.abs(mockData.stats.mae))) * 100}%` }} />
                  </div>
                </div>
              </div>
            </div>
            <div className="flex justify-between text-[0.65rem] text-white/30 mt-2">
              <span>100% MFE</span>
              <span>0%</span>
              <span>100% MAE</span>
            </div>
            
            <div className="grid grid-cols-2 gap-4 mt-6">
              <div className="text-center p-3 rounded-lg" style={{ background: 'rgba(34,197,94,0.08)' }}>
                <div className="text-[0.7rem] text-white/40">Avg MFE</div>
                <div className="text-[1.1rem] font-bold text-[#22c55e]">${mockData.stats.avgMFE.toFixed(2)}</div>
              </div>
              <div className="text-center p-3 rounded-lg" style={{ background: 'rgba(239,68,68,0.08)' }}>
                <div className="text-[0.7rem] text-white/40">Avg MAE</div>
                <div className="text-[1.1rem] font-bold text-[#ef4444]">-${Math.abs(mockData.stats.avgMAE).toFixed(2)}</div>
              </div>
            </div>
          </div>

          <div className="rounded-2xl p-6" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}>
            <h2 className="text-[1rem] font-bold text-white mb-6">Streaks & Volume</h2>
            
            <div className="grid grid-cols-3 gap-4 mb-6">
              <div className="text-center">
                <div className="text-[0.7rem] text-white/40 mb-1">Current</div>
                <div className="text-[1.5rem] font-black text-[#22c55e]">+{mockData.stats.currentStreak}</div>
                <div className="text-[0.65rem] text-white/30">trades</div>
              </div>
              <div className="text-center">
                <div className="text-[0.7rem] text-white/40 mb-1">Best</div>
                <div className="text-[1.5rem] font-black text-[#22c55e]">+{mockData.stats.bestStreak}</div>
                <div className="text-[0.65rem] text-white/30">trades</div>
              </div>
              <div className="text-center">
                <div className="text-[0.7rem] text-white/40 mb-1">Worst</div>
                <div className="text-[1.5rem] font-black text-[#ef4444]">{mockData.stats.worstStreak}</div>
                <div className="text-[0.65rem] text-white/30">trades</div>
              </div>
            </div>
            
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-[0.8rem] mb-1">
                  <span className="text-white/50">Avg Trades/Day</span>
                  <span className="text-white font-semibold">{mockData.stats.avgTradesPerDay}</span>
                </div>
                <div className="h-2 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.05)' }}>
                  <div className="h-full rounded-full bg-gradient-to-r from-[#667eea] to-[#a78bfa]" style={{ width: '42%' }} />
                </div>
              </div>
              <div>
                <div className="flex justify-between text-[0.8rem] mb-1">
                  <span className="text-white/50">Avg Risk/Trade</span>
                  <span className="text-white font-semibold">{mockData.stats.avgRiskPercent}%</span>
                </div>
                <div className="h-2 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.05)' }}>
                  <div className="h-full rounded-full bg-gradient-to-r from-[#f59e0b] to-[#ef4444]" style={{ width: '24.6%' }} />
                </div>
              </div>
              <div>
                <div className="flex justify-between text-[0.8rem] mb-1">
                  <span className="text-white/50">Total Volume</span>
                  <span className="text-white font-semibold">{mockData.stats.totalVolume.toLocaleString()} lots</span>
                </div>
                <div className="h-2 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.05)' }}>
                  <div className="h-full rounded-full bg-gradient-to-r from-[#22c55e] to-[#4ade80]" style={{ width: '78%' }} />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Trades */}
        <div className="rounded-2xl overflow-hidden" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}>
          <div className="p-6 border-b border-white/5">
            <h2 className="text-[1rem] font-bold text-white">Recent Trades</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="text-[0.7rem] text-white/40 uppercase tracking-wider">
                  <th className="text-left p-4">Symbol</th>
                  <th className="text-left p-4">Type</th>
                  <th className="text-right p-4">Volume</th>
                  <th className="text-right p-4">Open Price</th>
                  <th className="text-right p-4">Current</th>
                  <th className="text-right p-4">Profit</th>
                  <th className="text-right p-4">MFE</th>
                  <th className="text-right p-4">MAE</th>
                  <th className="text-right p-4">Time</th>
                </tr>
              </thead>
              <tbody>
                {mockData.recentTrades.map((trade) => (
                  <tr key={trade.id} className="border-t border-white/5 hover:bg-white/[0.02] transition-colors">
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-[0.65rem] font-bold ${trade.type === 'BUY' ? 'bg-[#22c55e]/15 text-[#22c55e]' : 'bg-[#ef4444]/15 text-[#ef4444]'}`}>
                          {trade.symbol.slice(0, 2)}
                        </div>
                        <span className="text-white font-semibold text-[0.85rem]">{trade.symbol}</span>
                      </div>
                    </td>
                    <td className="p-4">
                      <span className={`text-[0.75rem] font-bold px-2 py-1 rounded ${trade.type === 'BUY' ? 'bg-[#22c55e]/15 text-[#22c55e]' : 'bg-[#ef4444]/15 text-[#ef4444]'}`}>
                        {trade.type}
                      </span>
                    </td>
                    <td className="p-4 text-right text-white text-[0.85rem]">{trade.volume.toFixed(2)}</td>
                    <td className="p-4 text-right text-white/70 text-[0.85rem]">{trade.openPrice}</td>
                    <td className="p-4 text-right text-white text-[0.85rem]">{trade.currentPrice}</td>
                    <td className={`p-4 text-right font-bold text-[0.85rem] ${trade.profit >= 0 ? 'text-[#22c55e]' : 'text-[#ef4444]'}`}>
                      {trade.profit >= 0 ? '+' : ''}{trade.profit.toFixed(2)}
                    </td>
                    <td className="p-4 text-right text-[#22c55e] text-[0.85rem]">{trade.mfe.toFixed(2)}</td>
                    <td className="p-4 text-right text-[#ef4444] text-[0.85rem]">{trade.mae.toFixed(2)}</td>
                    <td className="p-4 text-right text-white/40 text-[0.75rem]">{trade.date}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
