import { NextResponse } from 'next/server'
import { getAccount } from '@/lib/bridge'

export async function GET() {
  try {
    const account = await getAccount()
    return NextResponse.json(account)
  } catch (error) {
    console.error('Dashboard API error:', error)
    return NextResponse.json({ error: 'Failed to fetch account data' }, { status: 500 })
  }
}
