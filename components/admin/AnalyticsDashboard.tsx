'use client'
import { useState, useEffect, useCallback } from 'react'

// ── Types ────────────────────────────────────────────────────
interface MonthData {
  label: string
  orders: number
  b2b: number
  b2c: number
  inquiries: number
  revenue: number
}

interface AnalyticsData {
  monthlyData:      MonthData[]
  b2bTotal:         number
  b2cTotal:         number
  statusData:       { status: string; count: number }[]
  topProductsData:  { productName: string; orderCount: number; totalQty: number }[]
  summary: {
    totalOrders:      number
    totalInquiries:   number
    deliveredOrders:  number
    cancelledOrders:  number
    estimatedRevenue: number
    conversionRate:   number
  }
}

// ── Color palette ─────────────────────────────────────────────
const WOOD   = '#a85e2e'
const WOOD_L = '#e0b878'
const BLUE   = '#3b82f6'
const GREEN  = '#10b981'
const PURPLE = '#8b5cf6'
const RED    = '#ef4444'
const AMBER  = '#f59e0b'
const GREY   = '#d1d5db'

const STATUS_COLORS: Record<string, string> = {
  PENDING:       AMBER,
  CONFIRMED:     BLUE,
  IN_PRODUCTION: PURPLE,
  DELIVERED:     GREEN,
  CANCELLED:     RED,
}

// ── Helpers ───────────────────────────────────────────────────
function fmt(n: number)    { return n.toLocaleString('en-IN') }
function fmtRs(n: number)  { return `₹${n.toLocaleString('en-IN')}` }
function clamp(n: number, min: number, max: number) { return Math.min(Math.max(n, min), max) }

export default function AnalyticsDashboard() {
  const [data, setData]       = useState<AnalyticsData | null>(null)
  const [loading, setLoading] = useState(true)
  const [months, setMonths]   = useState(12)
  const [error, setError]     = useState('')

  // Export state
  const [exportType,   setExportType]   = useState<'orders'|'inquiries'|'products'>('orders')
  const [exportFormat, setExportFormat] = useState<'csv'|'xlsx'>('xlsx')
  const [exportFrom,   setExportFrom]   = useState('')
  const [exportTo,     setExportTo]     = useState('')
  const [exporting,    setExporting]    = useState(false)

  const load = useCallback(async () => {
    setLoading(true)
    setError('')
    try {
      const res  = await fetch(`/api/admin/analytics?months=${months}`)
      const json = await res.json()
      if (!res.ok) { setError(json.error); return }
      setData(json)
    } catch { setError('Failed to load analytics.') }
    setLoading(false)
  }, [months])

  useEffect(() => { load() }, [load])

  const handleExport = async () => {
    setExporting(true)
    const params = new URLSearchParams({
      type: exportType, format: exportFormat,
      ...(exportFrom ? { from: exportFrom } : {}),
      ...(exportTo   ? { to:   exportTo   } : {}),
    })
    const res = await fetch(`/api/admin/export?${params}`)
    if (res.ok) {
      const blob = await res.blob()
      const url  = URL.createObjectURL(blob)
      const a    = document.createElement('a')
      a.href     = url
      a.download = `craftura-${exportType}-${new Date().toISOString().slice(0,10)}.${exportFormat}`
      a.click()
      URL.revokeObjectURL(url)
    } else {
      const d = await res.json()
      alert(d.error || 'Export failed')
    }
    setExporting(false)
  }

  if (loading) return (
    <div className="p-8 flex items-center justify-center min-h-96">
      <div className="text-center">
        <div className="w-10 h-10 border-3 border-stone-200 border-t-wood-600 rounded-full animate-spin mx-auto mb-3"/>
        <p className="text-stone-400 text-sm">Loading analytics…</p>
      </div>
    </div>
  )

  if (error) return (
    <div className="p-8">
      <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl p-5 text-sm">{error}</div>
    </div>
  )

  if (!data) return null
  const { monthlyData, b2bTotal, b2cTotal, statusData, topProductsData, summary } = data

  return (
    <div className="p-8 space-y-8">

      {/* ── Header ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-display font-semibold text-charcoal-800">Analytics</h1>
          <p className="text-stone-400 text-sm mt-1">Business intelligence from your order data</p>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs text-stone-400">Show last</span>
          {[3, 6, 12].map(m => (
            <button key={m} onClick={() => setMonths(m)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                months === m
                  ? 'bg-charcoal-800 text-white'
                  : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
              }`}>
              {m}mo
            </button>
          ))}
        </div>
      </div>

      {/* ── KPI Cards ── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 xl:grid-cols-6 gap-4">
        {[
          { label: 'Total Orders',     value: fmt(summary.totalOrders),       color: '#3b82f6', icon: '📋' },
          { label: 'Delivered',         value: fmt(summary.deliveredOrders),   color: '#10b981', icon: '✅' },
          { label: 'Total Inquiries',   value: fmt(summary.totalInquiries),    color: '#f59e0b', icon: '💬' },
          { label: 'Conversion Rate',   value: `${summary.conversionRate}%`,   color: '#8b5cf6', icon: '📈' },
          { label: 'Cancelled',         value: fmt(summary.cancelledOrders),   color: '#ef4444', icon: '❌' },
          { label: 'Est. Revenue',      value: fmtRs(summary.estimatedRevenue), color: '#a85e2e', icon: '₹' },
        ].map(k => (
          <div key={k.label} className="bg-white rounded-2xl border border-stone-100 shadow-sm p-5">
            <div className="flex items-center gap-2 mb-3">
              <span className="text-lg">{k.icon}</span>
            </div>
            <div className="font-display text-2xl font-semibold text-charcoal-800 mb-0.5"
              style={{ color: k.color }}>
              {k.value}
            </div>
            <div className="text-xs text-stone-400">{k.label}</div>
          </div>
        ))}
      </div>

      {/* ── Row 1: Orders over time + B2B vs B2C ── */}
      <div className="grid lg:grid-cols-3 gap-6">

        {/* Bar chart: Orders over time */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-stone-100 shadow-sm p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="font-semibold text-charcoal-700">Orders Over Time</h2>
            <div className="flex items-center gap-4 text-xs">
              <span className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-sm inline-block" style={{ background: WOOD }}/>B2B
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-sm inline-block" style={{ background: WOOD_L }}/>B2C
              </span>
            </div>
          </div>
          <BarChart data={monthlyData} />
        </div>

        {/* Donut: B2B vs B2C */}
        <div className="bg-white rounded-2xl border border-stone-100 shadow-sm p-6">
          <h2 className="font-semibold text-charcoal-700 mb-6">B2B vs B2C Split</h2>
          <DonutChart b2b={b2bTotal} b2c={b2cTotal} />
        </div>
      </div>

      {/* ── Row 2: Status breakdown + Top Products ── */}
      <div className="grid lg:grid-cols-2 gap-6">

        {/* Horizontal bar: Order status */}
        <div className="bg-white rounded-2xl border border-stone-100 shadow-sm p-6">
          <h2 className="font-semibold text-charcoal-700 mb-6">Orders by Status</h2>
          <StatusBars data={statusData} />
        </div>

        {/* Horizontal bar: Top products */}
        <div className="bg-white rounded-2xl border border-stone-100 shadow-sm p-6">
          <h2 className="font-semibold text-charcoal-700 mb-6">Top Products by Orders</h2>
          <TopProductsBars data={topProductsData} />
        </div>
      </div>

      {/* ── Row 3: Inquiries line + Monthly table ── */}
      <div className="grid lg:grid-cols-3 gap-6">

        {/* Line chart: Orders vs Inquiries */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-stone-100 shadow-sm p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="font-semibold text-charcoal-700">Orders vs Inquiries Trend</h2>
            <div className="flex items-center gap-4 text-xs">
              <span className="flex items-center gap-1.5">
                <span className="w-3 h-0.5 inline-block" style={{ background: WOOD }}/>Orders
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-3 h-0.5 inline-block" style={{ background: BLUE }}/>Inquiries
              </span>
            </div>
          </div>
          <LineChart data={monthlyData} />
        </div>

        {/* Monthly summary table */}
        <div className="bg-white rounded-2xl border border-stone-100 shadow-sm p-6 overflow-hidden">
          <h2 className="font-semibold text-charcoal-700 mb-4">Monthly Summary</h2>
          <div className="overflow-x-auto -mx-1">
            <table className="w-full text-xs">
              <thead>
                <tr className="text-stone-400 uppercase tracking-wider">
                  <th className="text-left py-2 px-1">Month</th>
                  <th className="text-right py-2 px-1">Orders</th>
                  <th className="text-right py-2 px-1">Inquiries</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-50">
                {[...monthlyData].reverse().slice(0, 12).map(row => (
                  <tr key={row.label} className="hover:bg-stone-50">
                    <td className="py-2 px-1 font-medium text-charcoal-700">{row.label}</td>
                    <td className="py-2 px-1 text-right text-charcoal-600">{row.orders}</td>
                    <td className="py-2 px-1 text-right text-stone-400">{row.inquiries}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* ── Export Panel ── */}
      <div className="bg-white rounded-2xl border border-stone-100 shadow-sm p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-9 h-9 bg-green-50 text-green-600 rounded-xl flex items-center justify-center text-lg">📥</div>
          <div>
            <h2 className="font-semibold text-charcoal-700">Export Data</h2>
            <p className="text-xs text-stone-400 mt-0.5">Download orders, inquiries or products as CSV or Excel</p>
          </div>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-4 items-end">
          {/* Type */}
          <div>
            <label className="block text-xs font-medium text-charcoal-600 mb-1.5">Data Type</label>
            <select className="form-input text-sm"
              value={exportType} onChange={e => setExportType(e.target.value as any)}>
              <option value="orders">Orders</option>
              <option value="inquiries">Inquiries</option>
              <option value="products">Products</option>
            </select>
          </div>

          {/* Format */}
          <div>
            <label className="block text-xs font-medium text-charcoal-600 mb-1.5">Format</label>
            <div className="flex rounded-lg border border-stone-200 p-0.5 bg-stone-50">
              {(['csv', 'xlsx'] as const).map(f => (
                <button key={f} onClick={() => setExportFormat(f)}
                  className={`flex-1 py-2 text-xs font-semibold rounded-md transition-all uppercase tracking-wide ${
                    exportFormat === f
                      ? 'bg-white shadow-sm text-charcoal-800'
                      : 'text-stone-400 hover:text-charcoal-600'
                  }`}>
                  {f}
                </button>
              ))}
            </div>
          </div>

          {/* Date range */}
          <div>
            <label className="block text-xs font-medium text-charcoal-600 mb-1.5">From Date</label>
            <input type="date" className="form-input text-sm"
              value={exportFrom} onChange={e => setExportFrom(e.target.value)}/>
          </div>
          <div>
            <label className="block text-xs font-medium text-charcoal-600 mb-1.5">To Date</label>
            <input type="date" className="form-input text-sm"
              value={exportTo} onChange={e => setExportTo(e.target.value)}/>
          </div>

          {/* Export button */}
          <button onClick={handleExport} disabled={exporting}
            className="flex items-center justify-center gap-2 px-5 py-2.5 bg-charcoal-800 hover:bg-charcoal-900 text-white text-sm font-medium rounded-xl transition-colors disabled:opacity-60">
            {exporting ? (
              <><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"/>Exporting…</>
            ) : (
              <><svg width="15" height="15" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"/>
              </svg>Download {exportFormat.toUpperCase()}</>
            )}
          </button>
        </div>

        {/* Quick export shortcuts */}
        <div className="mt-5 pt-5 border-t border-stone-100 flex flex-wrap gap-2">
          <span className="text-xs text-stone-400 self-center mr-1">Quick exports:</span>
          {[
            { label: 'This month orders',       type: 'orders',    from: thisMonthStart(), to: '' },
            { label: 'All orders (Excel)',       type: 'orders',    from: '',               to: '', fmt: 'xlsx' },
            { label: 'All inquiries (CSV)',      type: 'inquiries', from: '',               to: '' },
            { label: 'Full product catalogue',  type: 'products',  from: '',               to: '' },
          ].map(q => (
            <button key={q.label}
              onClick={() => {
                setExportType(q.type as any)
                setExportFrom(q.from)
                setExportTo(q.to)
                if (q.fmt) setExportFormat(q.fmt as any)
              }}
              className="text-xs px-3 py-1.5 rounded-lg border border-stone-200 text-stone-500 hover:border-wood-400 hover:text-wood-600 transition-all">
              {q.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}

function thisMonthStart() {
  const d = new Date()
  return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-01`
}

// ══════════════════════════════════════════════════════════════
// ── SVG Chart Components ──────────────────────────────────────
// ══════════════════════════════════════════════════════════════

function BarChart({ data }: { data: MonthData[] }) {
  if (!data.length) return <Empty />
  const maxVal = Math.max(...data.map(d => d.orders), 1)
  const H = 160
  const W = 100
  const BAR_W = clamp(Math.floor((W / data.length) * 0.55), 4, 18)

  return (
    <div className="overflow-x-auto">
      <svg viewBox={`0 0 ${W} ${H + 20}`} className="w-full" style={{ minWidth: data.length * 28 }}>
        {/* Grid lines */}
        {[0, 0.25, 0.5, 0.75, 1].map(pct => {
          const y = H - pct * H
          return (
            <line key={pct} x1="0" y1={y} x2={W} y2={y}
              stroke="#f0ece7" strokeWidth="0.5"/>
          )
        })}

        {data.map((d, i) => {
          const x      = (i / data.length) * W + (W / data.length) / 2
          const b2bH   = (d.b2b / maxVal) * H
          const b2cH   = (d.b2c / maxVal) * H
          const totalH = b2bH + b2cH

          return (
            <g key={d.label}>
              {/* B2C (bottom) */}
              <rect x={x - BAR_W/2} y={H - b2cH} width={BAR_W} height={b2cH}
                fill={WOOD_L} rx="2"/>
              {/* B2B (top) */}
              <rect x={x - BAR_W/2} y={H - totalH} width={BAR_W} height={b2bH}
                fill={WOOD} rx="2"/>
              {/* Label */}
              <text x={x} y={H + 12} textAnchor="middle"
                fontSize="4.5" fill="#a8a29e">
                {d.label}
              </text>
              {/* Value on hover — show as title */}
              <title>{d.label}: {d.orders} orders (B2B: {d.b2b}, B2C: {d.b2c})</title>
            </g>
          )
        })}
      </svg>
    </div>
  )
}

function DonutChart({ b2b, b2c }: { b2b: number; b2c: number }) {
  const total = b2b + b2c
  if (total === 0) return <Empty />

  const b2bPct  = b2b / total
  const cx = 60, cy = 60, r = 48, sw = 20
  const circum  = 2 * Math.PI * r
  const b2bDash = b2bPct * circum
  const b2cDash = (1 - b2bPct) * circum

  return (
    <div className="flex flex-col items-center gap-5">
      <svg viewBox="0 0 120 120" className="w-40 h-40">
        {/* B2C arc */}
        <circle cx={cx} cy={cy} r={r} fill="none"
          stroke={WOOD_L} strokeWidth={sw}
          strokeDasharray={`${b2cDash} ${circum - b2cDash}`}
          strokeDashoffset={0}
          transform={`rotate(-90 ${cx} ${cy})`}/>
        {/* B2B arc */}
        <circle cx={cx} cy={cy} r={r} fill="none"
          stroke={WOOD} strokeWidth={sw}
          strokeDasharray={`${b2bDash} ${circum - b2bDash}`}
          strokeDashoffset={-b2cDash}
          transform={`rotate(-90 ${cx} ${cy})`}/>
        {/* Center label */}
        <text x={cx} y={cy - 5} textAnchor="middle" fontSize="10" fontWeight="600" fill="#1c1917">
          {total}
        </text>
        <text x={cx} y={cy + 8} textAnchor="middle" fontSize="5.5" fill="#78716c">
          total orders
        </text>
      </svg>
      <div className="flex gap-6 text-sm">
        <div className="text-center">
          <div className="flex items-center gap-1.5 mb-1">
            <span className="w-3 h-3 rounded-sm" style={{ background: WOOD }}/>
            <span className="font-semibold text-charcoal-700">B2B</span>
          </div>
          <div className="font-display text-lg font-bold" style={{ color: WOOD }}>{b2b}</div>
          <div className="text-xs text-stone-400">{Math.round(b2bPct * 100)}%</div>
        </div>
        <div className="text-center">
          <div className="flex items-center gap-1.5 mb-1">
            <span className="w-3 h-3 rounded-sm" style={{ background: WOOD_L }}/>
            <span className="font-semibold text-charcoal-700">B2C</span>
          </div>
          <div className="font-display text-lg font-bold" style={{ color: WOOD_L }}>{b2c}</div>
          <div className="text-xs text-stone-400">{Math.round((1 - b2bPct) * 100)}%</div>
        </div>
      </div>
    </div>
  )
}

function StatusBars({ data }: { data: { status: string; count: number }[] }) {
  if (!data.length) return <Empty />
  const max = Math.max(...data.map(d => d.count), 1)
  const labels: Record<string, string> = {
    PENDING: 'Pending', CONFIRMED: 'Confirmed',
    IN_PRODUCTION: 'In Production', DELIVERED: 'Delivered', CANCELLED: 'Cancelled',
  }

  return (
    <div className="space-y-4">
      {data.map(d => {
        const pct = (d.count / max) * 100
        const color = STATUS_COLORS[d.status] || GREY
        return (
          <div key={d.status}>
            <div className="flex items-center justify-between text-xs mb-1.5">
              <span className="font-medium text-charcoal-700">{labels[d.status] || d.status}</span>
              <span className="font-semibold" style={{ color }}>{d.count}</span>
            </div>
            <div className="h-2.5 rounded-full overflow-hidden" style={{ background: '#f0ece7' }}>
              <div className="h-full rounded-full transition-all duration-700"
                style={{ width: `${pct}%`, background: color }}/>
            </div>
          </div>
        )
      })}
    </div>
  )
}

function TopProductsBars({ data }: { data: { productName: string; orderCount: number }[] }) {
  if (!data.length) return <Empty />
  const max = Math.max(...data.map(d => d.orderCount), 1)
  const top5 = data.slice(0, 7)

  return (
    <div className="space-y-4">
      {top5.map((d, i) => {
        const pct   = (d.orderCount / max) * 100
        const color = [WOOD, BLUE, PURPLE, GREEN, AMBER, RED, '#06b6d4'][i]
        return (
          <div key={d.productName}>
            <div className="flex items-center justify-between text-xs mb-1.5">
              <span className="font-medium text-charcoal-700 truncate max-w-[180px]" title={d.productName}>
                {d.productName}
              </span>
              <span className="font-semibold ml-2 shrink-0" style={{ color }}>
                {d.orderCount} orders
              </span>
            </div>
            <div className="h-2.5 rounded-full overflow-hidden" style={{ background: '#f0ece7' }}>
              <div className="h-full rounded-full transition-all duration-700"
                style={{ width: `${pct}%`, background: color }}/>
            </div>
          </div>
        )
      })}
    </div>
  )
}

function LineChart({ data }: { data: MonthData[] }) {
  if (!data.length) return <Empty />
  const H    = 140
  const W    = 100
  const maxO = Math.max(...data.map(d => d.orders), 1)
  const maxI = Math.max(...data.map(d => d.inquiries), 1)
  const maxV = Math.max(maxO, maxI, 1)
  const n    = data.length

  const orderPoints = data.map((d, i) => ({
    x: n === 1 ? 50 : (i / (n - 1)) * W,
    y: H - (d.orders    / maxV) * H,
  }))
  const inquiryPoints = data.map((d, i) => ({
    x: n === 1 ? 50 : (i / (n - 1)) * W,
    y: H - (d.inquiries / maxV) * H,
  }))

  const polyline = (pts: { x: number; y: number }[]) =>
    pts.map(p => `${p.x},${p.y}`).join(' ')

  const area = (pts: { x: number; y: number }[], color: string) => {
    if (pts.length < 2) return null
    const d = `M${pts[0].x},${H} ` +
      pts.map(p => `L${p.x},${p.y}`).join(' ') +
      ` L${pts[pts.length-1].x},${H} Z`
    return <path d={d} fill={color} opacity="0.08"/>
  }

  return (
    <div className="overflow-x-auto">
      <svg viewBox={`0 0 ${W} ${H + 16}`} className="w-full" style={{ minWidth: n * 24 }}>
        {/* Grid */}
        {[0, 0.5, 1].map(p => (
          <line key={p} x1="0" y1={H - p*H} x2={W} y2={H - p*H}
            stroke="#f0ece7" strokeWidth="0.5"/>
        ))}
        {/* Area fills */}
        {area(inquiryPoints, BLUE)}
        {area(orderPoints,   WOOD)}
        {/* Lines */}
        <polyline points={polyline(inquiryPoints)}
          fill="none" stroke={BLUE} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        <polyline points={polyline(orderPoints)}
          fill="none" stroke={WOOD} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        {/* Dots + labels */}
        {data.map((d, i) => (
          <g key={i}>
            <circle cx={orderPoints[i].x}   cy={orderPoints[i].y}   r="1.5" fill={WOOD}/>
            <circle cx={inquiryPoints[i].x} cy={inquiryPoints[i].y} r="1.5" fill={BLUE}/>
            <text x={orderPoints[i].x} y={H + 11} textAnchor="middle"
              fontSize="4" fill="#a8a29e">
              {d.label}
            </text>
            <title>{d.label}: {d.orders} orders, {d.inquiries} inquiries</title>
          </g>
        ))}
      </svg>
    </div>
  )
}

function Empty() {
  return (
    <div className="flex items-center justify-center h-32 text-stone-300 text-sm">
      No data for this period
    </div>
  )
}
