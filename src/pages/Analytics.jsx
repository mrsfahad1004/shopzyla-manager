import { useState, useEffect } from 'react'
import { BarChart3, TrendingUp, DollarSign, ShoppingCart, Package, Users, Calendar, ArrowUpRight, ArrowDownRight, Download } from 'lucide-react'
import { theme } from '../theme'

function StatCard({ icon: Icon, label, value, change, color }) {
  const isUp = change >= 0
  return (
    <div style={{
      background: theme.colors.bgCard,
      border: `1px solid ${theme.colors.border}`,
      borderRadius: '14px',
      padding: '20px',
      transition: 'all 0.3s',
    }}
    onMouseEnter={e => { e.currentTarget.style.borderColor = color; e.currentTarget.style.transform = 'translateY(-2px)' }}
    onMouseLeave={e => { e.currentTarget.style.borderColor = theme.colors.border; e.currentTarget.style.transform = 'translateY(0)' }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12 }}>
        <div style={{
          width: 40, height: 40, borderRadius: '10px',
          background: `${color}15`, display: 'flex',
          alignItems: 'center', justifyContent: 'center',
        }}>
          <Icon size={18} color={color} />
        </div>
        {change !== undefined && (
          <div style={{
            display: 'flex', alignItems: 'center', gap: 4,
            fontSize: '11px', fontWeight: 600,
            color: isUp ? theme.colors.success : theme.colors.error,
          }}>
            {isUp ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
            {Math.abs(change)}%
          </div>
        )}
      </div>
      <div style={{ fontSize: '10px', color: theme.colors.textMuted, letterSpacing: '0.05em', textTransform: 'uppercase', marginBottom: 4 }}>
        {label}
      </div>
      <div style={{ fontFamily: theme.fonts.heading, fontSize: '28px', fontWeight: 600, color: theme.colors.textBright }}>
        {value}
      </div>
    </div>
  )
}

export default function Analytics() {
  const [period, setPeriod] = useState('7d')
  const [storeData, setStoreData] = useState(null)

  useEffect(() => {
    fetch('/api/store').then(r => r.json()).then(d => setStoreData(d)).catch(() => {})
  }, [])

  return (
    <div>
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 28,
      }}>
        <div>
          <div style={{
            fontFamily: theme.fonts.heading,
            fontSize: '32px',
            fontWeight: 600,
            color: theme.colors.textBright,
            letterSpacing: '0.02em',
            textTransform: 'uppercase',
            marginBottom: 4,
          }}>
            📊 Analytics
          </div>
          <div style={{
            width: '60px',
            height: '4px',
            background: `linear-gradient(90deg, ${theme.colors.primary}, ${theme.colors.primaryLight})`,
            borderRadius: '2px',
            marginBottom: 8,
            boxShadow: theme.shadows.glow,
          }} />
          <div style={{ fontSize: '13px', color: theme.colors.textMuted }}>
            Sales reports, revenue tracking, and performance metrics
          </div>
        </div>

        <div style={{ display: 'flex', gap: 4, background: theme.colors.bg, borderRadius: '8px', padding: '3px', border: `1px solid ${theme.colors.border}` }}>
          {[
            { key: '7d', label: '7 Days' },
            { key: '30d', label: '30 Days' },
            { key: '90d', label: '90 Days' },
          ].map(p => (
            <button key={p.key} onClick={() => setPeriod(p.key)} style={{
              padding: '6px 14px',
              borderRadius: '6px',
              border: 'none',
              background: period === p.key ? theme.colors.primary : 'transparent',
              color: period === p.key ? 'white' : theme.colors.textMuted,
              fontSize: '11px',
              fontWeight: 600,
              cursor: 'pointer',
              fontFamily: theme.fonts.body,
              transition: 'all 0.2s',
            }}>
              {p.label}
            </button>
          ))}
        </div>
      </div>

      {/* Stats Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: '16px',
        marginBottom: 24,
      }}>
        <StatCard icon={DollarSign} label="Total Revenue" value={storeData ? `$${(storeData.orderCount * 45).toLocaleString()}` : '$0'} change={23} color={theme.colors.primary} />
        <StatCard icon={ShoppingCart} label="Orders" value={storeData?.orderCount || 0} change={15} color={theme.colors.success} />
        <StatCard icon={Package} label="Products" value={storeData?.productCount?.toLocaleString() || 0} change={8} color={theme.colors.primaryLight} />
        <StatCard icon={TrendingUp} label="Conversion" value="3.2%" change={-2} color={theme.colors.warning} />
        <StatCard icon={Users} label="Visitors" value="1,847" change={42} color={theme.colors.accent} />
        <StatCard icon={Calendar} label="Avg Order Value" value="$52.30" change={5} color={theme.colors.text} />
      </div>

      {/* Charts Placeholder */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: '2fr 1fr',
        gap: '20px',
        marginBottom: 24,
      }}>
        <div style={{
          background: theme.colors.bgCard,
          border: `1px solid ${theme.colors.border}`,
          borderRadius: '16px',
          padding: '24px',
        }}>
          <div style={{
            fontFamily: theme.fonts.heading,
            fontSize: '14px',
            fontWeight: 500,
            color: theme.colors.textBright,
            marginBottom: 16,
            letterSpacing: '0.03em',
          }}>
            Revenue Overview
          </div>
          <div style={{
            height: 200,
            display: 'flex',
            alignItems: 'flex-end',
            gap: '8px',
          }}>
            {[40, 65, 45, 80, 55, 90, 70, 85, 60, 95, 75, 88, 50, 72].map((h, i) => (
              <div key={i} style={{
                flex: 1,
                height: `${h}%`,
                background: `linear-gradient(180deg, ${theme.colors.primary}, ${theme.colors.primaryDark})`,
                borderRadius: '4px 4px 0 0',
                opacity: 0.6 + (h / 200),
                transition: 'all 0.3s',
              }}
              onMouseEnter={e => e.currentTarget.style.opacity = '1'}
              onMouseLeave={e => e.currentTarget.style.opacity = `${0.6 + (h / 200)}`}
              />
            ))}
          </div>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            marginTop: 8,
            fontSize: '9px',
            color: theme.colors.textMuted,
          }}>
            <span>May 1</span>
            <span>May 7</span>
            <span>May 14</span>
            <span>May 21</span>
            <span>May 28</span>
          </div>
        </div>

        <div style={{
          background: theme.colors.bgCard,
          border: `1px solid ${theme.colors.border}`,
          borderRadius: '16px',
          padding: '24px',
        }}>
          <div style={{
            fontFamily: theme.fonts.heading,
            fontSize: '14px',
            fontWeight: 500,
            color: theme.colors.textBright,
            marginBottom: 16,
            letterSpacing: '0.03em',
          }}>
            Top Categories
          </div>
          {[
            { label: 'Phone Accessories', value: 42, color: theme.colors.primary },
            { label: 'Handbags', value: 28, color: theme.colors.primaryLight },
            { label: 'Watches', value: 15, color: theme.colors.accent },
            { label: 'Beauty', value: 10, color: theme.colors.success },
            { label: 'Others', value: 5, color: theme.colors.textMuted },
          ].map((cat, i) => (
            <div key={i} style={{ marginBottom: 12 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', marginBottom: 4 }}>
                <span style={{ color: theme.colors.text }}>{cat.label}</span>
                <span style={{ color: theme.colors.textMuted }}>{cat.value}%</span>
              </div>
              <div style={{
                height: 6,
                background: theme.colors.bg,
                borderRadius: '3px',
                overflow: 'hidden',
              }}>
                <div style={{
                  width: `${cat.value}%`,
                  height: '100%',
                  background: cat.color,
                  borderRadius: '3px',
                  transition: 'width 0.5s ease',
                }} />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Products by Status */}
      <div style={{
        background: theme.colors.bgCard,
        border: `1px solid ${theme.colors.border}`,
        borderRadius: '16px',
        padding: '24px',
      }}>
        <div style={{
          fontFamily: theme.fonts.heading,
          fontSize: '14px',
          fontWeight: 500,
          color: theme.colors.textBright,
          marginBottom: 16,
          letterSpacing: '0.03em',
        }}>
          Products by Status
        </div>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
          gap: 12,
        }}>
          {[
            { label: 'Active', value: storeData?.productCount || 0, color: theme.colors.success },
            { label: 'Chinese Titles', value: Math.floor((storeData?.productCount || 0) * 0.74), color: theme.colors.error },
            { label: 'Translated', value: Math.floor((storeData?.productCount || 0) * 0.1), color: theme.colors.primaryLight },
            { label: 'No Description', value: Math.floor((storeData?.productCount || 0) * 0.25), color: theme.colors.warning },
            { label: 'No Image', value: Math.floor((storeData?.productCount || 0) * 0.05), color: theme.colors.accent },
          ].map((item, i) => (
            <div key={i} style={{
              background: theme.colors.bg,
              borderRadius: '10px',
              padding: '14px 16px',
              border: `1px solid ${theme.colors.border}`,
            }}>
              <div style={{ fontSize: '10px', color: theme.colors.textMuted, marginBottom: 4 }}>{item.label}</div>
              <div style={{ fontFamily: theme.fonts.heading, fontSize: '22px', fontWeight: 600, color: item.color }}>
                {item.value.toLocaleString()}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
