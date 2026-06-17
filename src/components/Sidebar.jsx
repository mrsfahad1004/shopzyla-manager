import { NavLink, useLocation } from 'react-router-dom'
import { LayoutDashboard, PackageSearch, Search, SprayCan, Zap, ChevronLeft, Store, Image, Type, Globe, DollarSign, Truck, BarChart3, Bot } from 'lucide-react'
import { theme } from '../theme'
import { useState } from 'react'

const navItems = [
  { path: '/', icon: LayoutDashboard, label: 'Dashboard' },
  { path: '/bulk-manager', icon: PackageSearch, label: 'Bulk Manager' },
  { path: '/auto-import', icon: Zap, label: 'Auto Import' },
  { path: '/seo-helper', icon: Search, label: 'SEO Helper' },
  { path: '/content-cleaner', icon: SprayCan, label: 'Content Cleaner' },
  { path: '/visual-store', icon: Image, label: 'Visual Store' },
  { path: '/bulk-image-editor', icon: Type, label: 'Bulk Image Editor' },
  { path: '/import-1688', icon: Globe, label: '1688 Import' },
  { path: '/amazon-price-sync', icon: DollarSign, label: 'Amazon Price' },
  { path: '/seo-optimizer', icon: Search, label: 'SEO Optimizer' },
  { path: '/analytics', icon: BarChart3, label: 'Analytics' },
  { path: '/supplier-manager', icon: Truck, label: 'Suppliers' },
  { path: '/smart-automation', icon: Bot, label: 'Smart Automation' },
  { path: '/smart-shipping', icon: Globe, label: 'Smart Shipping' },
  { path: '/shipping-regions', icon: Globe, label: 'Shipping Regions' },
  { path: '/logistics-intel', icon: Globe, label: 'Logistics Intel' },
]

const originalItems = navItems.slice(0, 5)
const newItems = navItems.slice(5)

export default function Sidebar() {
  const [collapsed, setCollapsed] = useState(false)
  const location = useLocation()

  const renderNavItem = (item) => {
    const isActive = location.pathname === item.path
    
    return (
      <NavLink
        key={item.path}
        to={item.path}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          padding: collapsed ? '10px' : '10px 14px',
          borderRadius: '8px',
          textDecoration: 'none',
          color: isActive ? theme.colors.textBright : theme.colors.textMuted,
          background: isActive ? 
            `linear-gradient(135deg, ${theme.colors.primaryDeep}, rgba(255, 91, 3, 0.15))` : 
            'transparent',
          border: isActive ? `1px solid ${theme.colors.primaryDark}` : '1px solid transparent',
          transition: 'all 0.2s ease',
          cursor: 'pointer',
          justifyContent: collapsed ? 'center' : 'flex-start',
          position: 'relative',
          overflow: 'hidden',
        }}
        onMouseEnter={e => {
          if (!isActive) {
            e.currentTarget.style.background = theme.colors.bgCard
            e.currentTarget.style.color = theme.colors.textBright
          }
        }}
        onMouseLeave={e => {
          if (!isActive) {
            e.currentTarget.style.background = 'transparent'
            e.currentTarget.style.color = theme.colors.textMuted
          }
        }}
      >
        <item.icon size={18} style={{ flexShrink: 0 }} />
        {!collapsed && (
          <span style={{
            fontFamily: theme.fonts.body,
            fontSize: '12px',
            fontWeight: 500,
            letterSpacing: '0.02em',
            whiteSpace: 'nowrap',
          }}>
            {item.label}
          </span>
        )}
        {isActive && !collapsed && (
          <div style={{
            position: 'absolute',
            right: 0,
            top: '50%',
            transform: 'translateY(-50%)',
            width: 3,
            height: 20,
            borderRadius: '3px 0 0 3px',
            background: theme.colors.primary,
            boxShadow: `0 0 10px ${theme.colors.primary}`,
          }} />
        )}
      </NavLink>
    )
  }

  return (
    <nav style={{
      width: collapsed ? '70px' : '240px',
      minHeight: '100vh',
      background: theme.colors.bgLight,
      borderRight: `1px solid ${theme.colors.border}`,
      display: 'flex',
      flexDirection: 'column',
      transition: 'width 0.3s ease',
      position: 'fixed',
      left: 0,
      top: 0,
      zIndex: 100,
      overflowY: 'auto',
      overflowX: 'hidden',
    }}>
      {/* Logo */}
      <div style={{
        padding: collapsed ? '16px 8px' : '20px 24px',
        borderBottom: `1px solid ${theme.colors.border}`,
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        overflow: 'hidden',
        flexShrink: 0,
      }}>
        <div style={{
          width: 36,
          height: 36,
          borderRadius: '10px',
          background: `linear-gradient(135deg, ${theme.colors.primary}, ${theme.colors.primaryDark})`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
          boxShadow: theme.shadows.glow,
        }}>
          <Store size={18} color="white" />
        </div>
        {!collapsed && (
          <div style={{ overflow: 'hidden' }}>
            <div style={{
              fontFamily: theme.fonts.heading,
              fontSize: '18px',
              fontWeight: 600,
              color: theme.colors.textBright,
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
              whiteSpace: 'nowrap',
            }}>
              ShopZyla
            </div>
            <div style={{
              fontSize: '10px',
              color: theme.colors.primary,
              letterSpacing: '0.2em',
              textTransform: 'uppercase',
              fontWeight: 500,
            }}>
              Manager Pro
            </div>
          </div>
        )}
      </div>

      {/* Navigation */}
      <div style={{
        flex: 1,
        padding: collapsed ? '12px 8px' : '16px 12px',
        display: 'flex',
        flexDirection: 'column',
        gap: '2px',
      }}>
        {originalItems.map(item => renderNavItem(item))}
        
        {!collapsed && <div style={{ height: '1px', background: theme.colors.border, margin: '8px 12px' }} />}
        {collapsed && <div style={{ height: '1px', background: theme.colors.border, margin: '6px 0' }} />}

        {newItems.slice(0, 4).map(item => renderNavItem(item))}
        
        {!collapsed && <div style={{ height: '1px', background: theme.colors.border, margin: '8px 12px' }} />}
        {collapsed && <div style={{ height: '1px', background: theme.colors.border, margin: '6px 0' }} />}

        {newItems.slice(4).map(item => renderNavItem(item))}
      </div>

      {/* Bottom Actions */}
      <div style={{
        padding: collapsed ? '8px' : '12px',
        borderTop: `1px solid ${theme.colors.border}`,
        flexShrink: 0,
        display: 'flex',
        flexDirection: 'column',
        gap: 6,
      }}>
        {!collapsed && (
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            padding: '8px 12px',
            borderRadius: '8px',
            background: `${theme.colors.success}08`,
            border: `1px solid ${theme.colors.success}15`,
          }}>
            <div style={{
              width: 8,
              height: 8,
              borderRadius: '50%',
              background: theme.colors.success,
              animation: 'pulseLive 2s infinite',
            }} />
            <span style={{
              fontSize: '10px',
              color: theme.colors.textMuted,
              fontWeight: 500,
            }}>
              3,840 products online
            </span>
          </div>
        )}
        <button
          onClick={() => setCollapsed(!collapsed)}
          style={{
            width: '100%',
            padding: '10px',
            background: 'transparent',
            border: `1px solid ${theme.colors.border}`,
            borderRadius: '8px',
            color: theme.colors.textMuted,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'all 0.2s',
          }}
          onMouseEnter={e => { e.currentTarget.style.color = theme.colors.primary; e.currentTarget.style.borderColor = theme.colors.primaryDark }}
          onMouseLeave={e => { e.currentTarget.style.color = theme.colors.textMuted; e.currentTarget.style.borderColor = theme.colors.border }}
        >
          <ChevronLeft size={16} style={{ transform: collapsed ? 'rotate(180deg)' : 'none', transition: 'transform 0.3s' }} />
        </button>
      </div>

      <style>{`
        @keyframes pulseLive {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.3; }
        }
      `}</style>
    </nav>
  )
}
