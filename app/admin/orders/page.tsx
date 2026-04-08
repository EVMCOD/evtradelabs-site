'use client'

import { useState, useEffect } from 'react'

interface Order {
  id: string
  status: string
  total: number
  currency: string
  customerEmail: string
  customerName: string
  createdAt: string
  items: any[]
  notes: string
}

interface Stats {
  totalOrders: number
  pendingOrders: number
  completedOrders: number
  totalRevenue: number
}

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([])
  const [stats, setStats] = useState<Stats | null>(null)
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<string>('')
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)

  useEffect(() => {
    fetchOrders()
  }, [filter])

  const fetchOrders = async () => {
    setLoading(true)
    try {
      const url = filter ? `/api/admin/orders?status=${filter}` : '/api/admin/orders'
      const res = await fetch(url)
      const data = await res.json()
      setOrders(data.orders)
      setStats(data.stats)
    } catch (e) {
      console.error('Failed to fetch orders:', e)
    }
    setLoading(false)
  }

  const updateOrderStatus = async (id: string, status: string) => {
    await fetch('/api/admin/orders', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, status }),
    })
    fetchOrders()
    setSelectedOrder(null)
  }

  const formatCurrency = (cents: number, currency: string = 'EUR') => {
    return new Intl.NumberFormat('es-ES', {
      style: 'currency',
      currency,
    }).format(cents / 100)
  }

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('es-ES', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  const statusColors: Record<string, string> = {
    PENDING: '#f59e0b',
    PROCESSING: '#3b82f6',
    COMPLETED: '#22c55e',
    CANCELLED: '#ef4444',
    REFUNDED: '#8b5cf6',
  }

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#0f172a', padding: '24px', fontFamily: 'system-ui, sans-serif' }}>
      {/* Header */}
      <div style={{ marginBottom: '32px' }}>
        <h1 style={{ fontSize: '28px', fontWeight: 700, color: '#fff', marginBottom: '8px' }}>
          Order Management
        </h1>
        <p style={{ color: '#94a3b8' }}>Manage and track all your orders</p>
      </div>

      {/* Stats Cards */}
      {stats && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px', marginBottom: '32px' }}>
          <StatCard label="Total Orders" value={stats.totalOrders} color="#3b82f6" />
          <StatCard label="Pending" value={stats.pendingOrders} color="#f59e0b" />
          <StatCard label="Completed" value={stats.completedOrders} color="#22c55e" />
          <StatCard label="Revenue" value={formatCurrency(stats.totalRevenue)} color="#a855f7" />
        </div>
      )}

      {/* Filters */}
      <div style={{ display: 'flex', gap: '12px', marginBottom: '24px' }}>
        {['ALL', 'PENDING', 'PROCESSING', 'COMPLETED', 'CANCELLED'].map(status => (
          <button
            key={status}
            onClick={() => setFilter(status === 'ALL' ? '' : status)}
            style={{
              padding: '8px 16px',
              backgroundColor: (filter === status || (status === 'ALL' && !filter)) ? '#3b82f6' : '#1e293b',
              color: '#fff',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              fontSize: '13px',
              fontWeight: 500,
            }}
          >
            {status === 'ALL' ? 'All' : status.charAt(0) + status.slice(1).toLowerCase()}
          </button>
        ))}
      </div>

      {/* Orders Table */}
      <div style={{ backgroundColor: '#1e293b', borderRadius: '16px', overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ backgroundColor: '#0f172a' }}>
              <th style={{ padding: '16px', textAlign: 'left', color: '#94a3b8', fontSize: '12px', fontWeight: 600, textTransform: 'uppercase' }}>Order</th>
              <th style={{ padding: '16px', textAlign: 'left', color: '#94a3b8', fontSize: '12px', fontWeight: 600, textTransform: 'uppercase' }}>Customer</th>
              <th style={{ padding: '16px', textAlign: 'left', color: '#94a3b8', fontSize: '12px', fontWeight: 600, textTransform: 'uppercase' }}>Status</th>
              <th style={{ padding: '16px', textAlign: 'left', color: '#94a3b8', fontSize: '12px', fontWeight: 600, textTransform: 'uppercase' }}>Total</th>
              <th style={{ padding: '16px', textAlign: 'left', color: '#94a3b8', fontSize: '12px', fontWeight: 600, textTransform: 'uppercase' }}>Date</th>
              <th style={{ padding: '16px', textAlign: 'left', color: '#94a3b8', fontSize: '12px', fontWeight: 600, textTransform: 'uppercase' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {orders.map(order => (
              <tr key={order.id} style={{ borderTop: '1px solid #333' }}>
                <td style={{ padding: '16px', color: '#fff', fontSize: '13px', fontFamily: 'monospace' }}>
                  #{order.id.slice(-8).toUpperCase()}
                </td>
                <td style={{ padding: '16px' }}>
                  <div style={{ color: '#fff', fontSize: '14px', fontWeight: 500 }}>{order.customerName || 'Guest'}</div>
                  <div style={{ color: '#94a3b8', fontSize: '12px' }}>{order.customerEmail}</div>
                </td>
                <td style={{ padding: '16px' }}>
                  <span style={{
                    padding: '4px 10px',
                    borderRadius: '20px',
                    fontSize: '12px',
                    fontWeight: 600,
                    backgroundColor: statusColors[order.status] + '20',
                    color: statusColors[order.status],
                  }}>
                    {order.status}
                  </span>
                </td>
                <td style={{ padding: '16px', color: '#fff', fontSize: '14px', fontWeight: 600 }}>
                  {formatCurrency(order.total, order.currency)}
                </td>
                <td style={{ padding: '16px', color: '#94a3b8', fontSize: '13px' }}>
                  {formatDate(order.createdAt)}
                </td>
                <td style={{ padding: '16px' }}>
                  <button
                    onClick={() => setSelectedOrder(order)}
                    style={{
                      padding: '6px 12px',
                      backgroundColor: '#3b82f6',
                      color: '#fff',
                      border: 'none',
                      borderRadius: '6px',
                      cursor: 'pointer',
                      fontSize: '12px',
                      fontWeight: 500,
                    }}
                  >
                    View
                  </button>
                </td>
              </tr>
            ))}
            {orders.length === 0 && (
              <tr>
                <td colSpan={6} style={{ padding: '48px', textAlign: 'center', color: '#94a3b8' }}>
                  No orders found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Order Detail Modal */}
      {selectedOrder && (
        <div style={{
          position: 'fixed',
          inset: 0,
          backgroundColor: 'rgba(0,0,0,0.8)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000,
        }}>
          <div style={{
            backgroundColor: '#1e293b',
            borderRadius: '16px',
            padding: '24px',
            width: '600px',
            maxHeight: '80vh',
            overflow: 'auto',
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '24px' }}>
              <h2 style={{ color: '#fff', fontSize: '20px', margin: 0 }}>
                Order #{selectedOrder.id.slice(-8).toUpperCase()}
              </h2>
              <button onClick={() => setSelectedOrder(null)} style={{
                background: 'none',
                border: 'none',
                color: '#94a3b8',
                cursor: 'pointer',
                fontSize: '20px',
              }}>✕</button>
            </div>

            {/* Status */}
            <div style={{ marginBottom: '24px' }}>
              <label style={{ color: '#94a3b8', fontSize: '12px', display: 'block', marginBottom: '8px' }}>Status</label>
              <select
                value={selectedOrder.status}
                onChange={(e) => updateOrderStatus(selectedOrder.id, e.target.value)}
                style={{
                  width: '100%',
                  padding: '10px 12px',
                  backgroundColor: '#0f172a',
                  border: '1px solid #333',
                  borderRadius: '8px',
                  color: '#fff',
                  fontSize: '14px',
                }}
              >
                <option value="PENDING">Pending</option>
                <option value="PROCESSING">Processing</option>
                <option value="COMPLETED">Completed</option>
                <option value="CANCELLED">Cancelled</option>
                <option value="REFUNDED">Refunded</option>
              </select>
            </div>

            {/* Customer Info */}
            <div style={{ marginBottom: '24px' }}>
              <label style={{ color: '#94a3b8', fontSize: '12px', display: 'block', marginBottom: '8px' }}>Customer</label>
              <div style={{ color: '#fff', fontSize: '14px' }}>{selectedOrder.customerName || 'Guest'}</div>
              <div style={{ color: '#94a3b8', fontSize: '13px' }}>{selectedOrder.customerEmail}</div>
            </div>

            {/* Items */}
            <div style={{ marginBottom: '24px' }}>
              <label style={{ color: '#94a3b8', fontSize: '12px', display: 'block', marginBottom: '8px' }}>Items</label>
              {selectedOrder.items.map((item: any) => (
                <div key={item.id} style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  padding: '12px',
                  backgroundColor: '#0f172a',
                  borderRadius: '8px',
                  marginBottom: '8px',
                }}>
                  <div>
                    <div style={{ color: '#fff', fontSize: '14px' }}>{item.productName}</div>
                    <div style={{ color: '#94a3b8', fontSize: '12px' }}>{item.accessType} × {item.quantity}</div>
                  </div>
                  <div style={{ color: '#fff', fontSize: '14px', fontWeight: 600 }}>
                    {formatCurrency(item.totalPrice, selectedOrder.currency)}
                  </div>
                </div>
              ))}
            </div>

            {/* Total */}
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              padding: '16px',
              backgroundColor: '#3b82f6',
              borderRadius: '8px',
            }}>
              <span style={{ color: '#fff', fontSize: '16px', fontWeight: 600 }}>Total</span>
              <span style={{ color: '#fff', fontSize: '20px', fontWeight: 700 }}>
                {formatCurrency(selectedOrder.total, selectedOrder.currency)}
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

function StatCard({ label, value, color }: { label: string; value: string | number; color: string }) {
  return (
    <div style={{
      backgroundColor: '#1e293b',
      borderRadius: '12px',
      padding: '20px',
    }}>
      <div style={{ color: '#94a3b8', fontSize: '13px', marginBottom: '8px' }}>{label}</div>
      <div style={{ color, fontSize: '28px', fontWeight: 700 }}>{value}</div>
    </div>
  )
}
