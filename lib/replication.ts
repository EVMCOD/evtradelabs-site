// MT5 Replication Engine for EV Trading Labs
// Handles position mirroring between master and sleeve accounts

import type { Position } from './bridge'

export interface ReplicationConfig {
  masterLogin: string
  sleeveLogin: string
  replicationRatio: number // 0-1, percentage of lot size to replicate
  enabled: boolean
  syncSlTp: boolean // Sync stop loss and take profit
  maxSlippage: number // in pips
  minLotSize: number
  maxLotSize: number
  riskProfile: 'conservative' | 'moderate' | 'aggressive'
  maxDailyLoss: number // percentage
  maxOpenPositions: number
  excludeSymbols: string[] // symbols NOT to replicate
}

export interface ReplicationSignal {
  id: string
  timestamp: string
  symbol: string
  type: 'BUY' | 'SELL'
  volume: number
  price: number
  sl?: number
  tp?: number
  reason: string // 'NEW_POSITION' | 'MODIFIED' | 'CLOSED'
}

export interface ReplicationStatus {
  sleeveLogin: string
  isActive: boolean
  lastSync: string
  positionsReplicated: number
  totalReplicatedLots: number
  pnlReplicated: number
  errors: string[]
}

// Default replication config
export const DEFAULT_REPLICATION_CONFIG: ReplicationConfig = {
  masterLogin: '',
  sleeveLogin: '',
  replicationRatio: 1.0, // 100% of master lots
  enabled: true,
  syncSlTp: true,
  maxSlippage: 3,
  minLotSize: 0.01,
  maxLotSize: 5.0,
  riskProfile: 'moderate',
  maxDailyLoss: 5,
  maxOpenPositions: 10,
  excludeSymbols: [],
}

// Calculate replicated lot size based on balance ratio
export function calculateReplicatedLotSize(
  masterLotSize: number,
  masterBalance: number,
  sleeveBalance: number,
  config: ReplicationConfig
): number {
  const balanceRatio = sleeveBalance / masterBalance
  const scaledLot = masterLotSize * balanceRatio * config.replicationRatio
  
  // Clamp to min/max
  return Math.max(config.minLotSize, Math.min(config.maxLotSize, scaledLot))
}

// Calculate SL/TP based on sleeve risk profile
export function calculateSleeveRiskLevels(
  masterSl: number,
  masterTp: number,
  entryPrice: number,
  riskProfile: 'conservative' | 'moderate' | 'aggressive'
): { sl: number; tp: number } {
  const riskMultipliers = {
    conservative: 0.5, // tighter stops
    moderate: 0.75,
    aggressive: 1.0 // same as master
  }
  
  const multiplier = riskMultipliers[riskProfile]
  const distanceSl = Math.abs(entryPrice - masterSl)
  const distanceTp = Math.abs(masterTp - entryPrice)
  
  const newSl = entryPrice - (distanceSl * multiplier * (masterSl < entryPrice ? 1 : -1))
  const newTp = entryPrice + (distanceTp * multiplier * (masterTp > entryPrice ? 1 : -1))
  
  return { sl: newSl, tp: newTp }
}

// Check if position should be replicated
export function shouldReplicatePosition(
  symbol: string,
  config: ReplicationConfig
): boolean {
  if (!config.enabled) return false
  if (config.excludeSymbols.includes(symbol)) return false
  return true
}

// Generate replication signal from master position
export function generateReplicationSignal(
  position: Position,
  masterBalance: number,
  sleeveBalance: number,
  config: ReplicationConfig
): ReplicationSignal | null {
  if (!shouldReplicatePosition(position.symbol, config)) {
    return null
  }
  
  const replicatedLot = calculateReplicatedLotSize(
    position.volume,
    masterBalance,
    sleeveBalance,
    config
  )
  
  if (replicatedLot < config.minLotSize) {
    return null // Position too small to replicate
  }
  
  const { sl, tp } = config.syncSlTp 
    ? calculateSleeveRiskLevels(position.sl, position.tp, position.priceOpen, config.riskProfile)
    : { sl: position.sl, tp: position.tp }
  
  return {
    id: `REP-${position.ticket}-${Date.now()}`,
    timestamp: new Date().toISOString(),
    symbol: position.symbol,
    type: position.type,
    volume: replicatedLot,
    price: position.priceCurrent,
    sl,
    tp,
    reason: 'NEW_POSITION'
  }
}

// Calculate equity protection threshold
export function calculateEquityProtection(
  sleeveBalance: number,
  maxDailyLossPercent: number
): number {
  return sleeveBalance * (1 - maxDailyLossPercent / 100)
}

// Check if daily loss limit exceeded
export function isDailyLossLimitExceeded(
  currentEquity: number,
  dailyStartBalance: number,
  maxDailyLossPercent: number
): boolean {
  const loss = ((dailyStartBalance - currentEquity) / dailyStartBalance) * 100
  return loss >= maxDailyLossPercent
}

// Format replication status for dashboard
export function formatReplicationStatus(
  config: ReplicationConfig,
  positions: Position[],
  currentEquity: number,
  dailyStartBalance: number
): ReplicationStatus {
  const errors: string[] = []
  
  if (!config.enabled) {
    errors.push('Replication disabled')
  }
  
  if (isDailyLossLimitExceeded(currentEquity, dailyStartBalance, config.maxDailyLoss)) {
    errors.push('Daily loss limit exceeded - replication paused')
  }
  
  if (positions.length >= config.maxOpenPositions) {
    errors.push('Max open positions reached')
  }
  
  return {
    sleeveLogin: config.sleeveLogin,
    isActive: config.enabled && errors.length === 0,
    lastSync: new Date().toISOString(),
    positionsReplicated: positions.length,
    totalReplicatedLots: positions.reduce((sum, p) => sum + p.volume, 0),
    pnlReplicated: positions.reduce((sum, p) => sum + p.profit, 0),
    errors
  }
}
