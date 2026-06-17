import { useState, useEffect, useRef, useCallback } from 'react'
import { Store, TrendingUp, Package, AlertTriangle, CheckCircle, ArrowUpRight, ShoppingCart, DollarSign, Activity, Zap, Sparkles, Globe, Cpu, BarChart3, MousePointer2, Search, SprayCan } from 'lucide-react'
import { theme } from '../theme'

// 3D Tilt Card Component
function TiltCard({ children, style = {}, className = '' }) {
  const cardRef = useRef(null)
  const [tilt, setTilt] = useState({ x: 0, y: 0 })
  const [glow, setGlow] = useState({ x: 50, y: 50 })

  const handleMouseMove = useCallback((e) => {
    if (!cardRef.current) return
    const rect = cardRef.current.getBoundingClientRect()
    const x = (e.clientX - rect.left) / rect.width
    const y = (e.clientY - rect.top) / rect.height
    setTilt({
      x: (y - 0.5) * 12,
      y: (x - 0.5) * -12,
    })
    setGlow({ x: x * 100, y: y * 100 })
  }, [])

  const handleMouseLeave = useCallback(() => {
    setTilt({ x: 0, y: 0 })
    setGlow({ x: 50, y: 50 })
  }, [])

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        perspective: '1200px',
        transformStyle: 'preserve-3d',
        ...style,
      }}
    >
      <div style={{
        transform: `rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)`,
        transition: 'transform 0.15s ease-out',
        transformStyle: 'preserve-3d',
        height: '100%',
        position: 'relative',
      }}>
        {children}
        {/* Glow effect */}
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          borderRadius: 'inherit',
          background: `radial-gradient(circle at ${glow.x}% ${glow.y}%, ${theme.colors.primary}10 0%, transparent 60%)`,
          pointerEvents: 'none',
          transition: 'background 0.3s ease',
        }} />
      </div>
    </div>
  )
}

// 3D Stat Card
function StatCard({ icon: Icon, label, value, sub, trend, color = '#FF5B03', delay = 0 }) {
  const [visible, setVisible] = useState(false)
  const [hovered, setHovered] = useState(false)
  const [floatY, setFloatY] = useState(0)

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), delay)
    return () => clearTimeout(t)
  }, [delay])

  // Floating animation
  useEffect(() => {
    if (!visible) return
    const interval = setInterval(() => {
      setFloatY(Math.sin(Date.now() / 2000) * 3)
    }, 50)
    return () => clearInterval(interval)
  }, [visible])

  return (
    <TiltCard>
      <div
        style={{
          background: `linear-gradient(135deg, ${theme.colors.bgCard} 0%, ${theme.colors.bgLight} 100%)`,
          border: `1px solid ${hovered ? color : theme.colors.border}`,
          borderRadius: '20px',
          padding: '24px',
          position: 'relative',
          overflow: 'hidden',
          transform: visible
            ? `translateY(${floatY}px) scale(1)`
            : 'translateY(40px) scale(0.95)',
          opacity: visible ? 1 : 0,
          transition: 'all 0.5s cubic-bezier(0.34, 1.56, 0.64, 1), transform 0.05s linear',
          cursor: 'default',
          boxShadow: hovered
            ? `0 20px 60px rgba(255, 91, 3, 0.2), ${theme.shadows.card}`
            : (visible ? theme.shadows.card : 'none'),
          backdropFilter: 'blur(10px)',
        }}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      >
        {/* Animated gradient border */}
        <div style={{
          position: 'absolute',
          top: -1,
          left: -1,
          right: -1,
          bottom: -1,
          borderRadius: '21px',
          background: hovered ? `linear-gradient(135deg, ${color}, ${theme.colors.primaryLight}, ${color})` : 'transparent',
          zIndex: -1,
          opacity: hovered ? 0.5 : 0,
          transition: 'opacity 0.3s ease',
        }} />

        {/* Glow orb */}
        <div style={{
          position: 'absolute',
          top: '-40%',
          right: '-30%',
          width: '120%',
          height: '120%',
          background: `radial-gradient(circle, ${color}10 0%, transparent 70%)`,
          pointerEvents: 'none',
          transition: 'all 0.5s ease',
          transform: hovered ? 'scale(1.2)' : 'scale(1)',
        }} />

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16, position: 'relative', zIndex: 1 }}>
          <div style={{
            width: 48,
            height: 48,
            borderRadius: '14px',
            background: `linear-gradient(135deg, ${color}20, ${color}08)`,
            border: `1px solid ${color}30`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transform: hovered ? 'scale(1.1) rotate(-5deg)' : 'scale(1) rotate(0deg)',
            transition: 'all 0.3s ease',
            boxShadow: hovered ? `0 0 20px ${color}30` : 'none',
          }}>
            <Icon size={22} color={color} />
          </div>
          {trend !== undefined && trend !== null && (
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: 4,
              padding: '4px 10px',
              borderRadius: '8px',
              background: trend > 0 ? 'rgba(34, 197, 94, 0.15)' : 'rgba(239, 68, 68, 0.15)',
              color: trend > 0 ? theme.colors.success : theme.colors.error,
              fontSize: '11px',
              fontWeight: 600,
              backdropFilter: 'blur(4px)',
            }}>
              <ArrowUpRight size={12} style={{ transform: trend < 0 ? 'rotate(90deg)' : 'none' }} />
              {Math.abs(trend)}%
            </div>
          )}
        </div>

        <div style={{ position: 'relative', zIndex: 1 }}>
          <div style={{
            fontFamily: theme.fonts.body,
            fontSize: '11px',
            color: theme.colors.textMuted,
            fontWeight: 500,
            marginBottom: 6,
            letterSpacing: '0.1em',
            textTransform: 'uppercase',
          }}>
            {label}
          </div>
          <div style={{
            fontFamily: theme.fonts.heading,
            fontSize: '36px',
            fontWeight: 700,
            color: theme.colors.textBright,
            letterSpacing: '0.02em',
            textShadow: hovered ? `0 0 30px ${color}30` : 'none',
            transition: 'text-shadow 0.3s ease',
          }}>
            {value}
          </div>
          {sub && (
            <div style={{
              fontSize: '12px',
              color: theme.colors.textMuted,
              marginTop: 4,
              display: 'flex',
              alignItems: 'center',
              gap: 6,
            }}>
              <div style={{
                width: 6,
                height: 6,
                borderRadius: '50%',
                background: color,
                opacity: 0.5,
              }} />
              {sub}
            </div>
          )}
        </div>
      </div>
    </TiltCard>
  )
}

// Issue Card with 3D hover
function IssueCard({ icon: Icon, title, count, severity = 'critical' }) {
  const [hovered, setHovered] = useState(false)
  const colors = {
    critical: { bg: `${theme.colors.error}15`, border: `${theme.colors.error}30`, text: theme.colors.error, glow: `${theme.colors.error}20` },
    warning: { bg: `${theme.colors.warning}15`, border: `${theme.colors.warning}30`, text: theme.colors.warning, glow: `${theme.colors.warning}20` },
    success: { bg: `${theme.colors.success}15`, border: `${theme.colors.success}30`, text: theme.colors.success, glow: `${theme.colors.success}20` },
  }
  const c = colors[severity] || colors.critical

  return (
    <TiltCard>
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 14,
          padding: '16px 20px',
          background: `linear-gradient(135deg, ${c.bg} 0%, ${theme.colors.bgCard} 100%)`,
          border: `1px solid ${hovered ? c.text : c.border}`,
          borderRadius: '14px',
          transition: 'all 0.3s ease',
          transform: hovered ? 'translateY(-2px)' : 'none',
          cursor: 'default',
          position: 'relative',
          overflow: 'hidden',
          boxShadow: hovered ? `0 8px 30px ${c.glow}` : 'none',
        }}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      >
        <div style={{
          position: 'absolute',
          top: '-100%',
          right: '-50%',
          width: '150%',
          height: '150%',
          background: `radial-gradient(circle, ${c.glow} 0%, transparent 60%)`,
          pointerEvents: 'none',
          opacity: hovered ? 0.6 : 0,
          transition: 'opacity 0.3s',
        }} />
        <div style={{
          width: 36,
          height: 36,
          borderRadius: '10px',
          background: c.bg,
          border: `1px solid ${c.border}`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
          position: 'relative',
          zIndex: 1,
          transform: hovered ? 'rotate(10deg)' : 'rotate(0deg)',
          transition: 'transform 0.3s ease',
        }}>
          <Icon size={16} color={c.text} />
        </div>
        <div style={{ flex: 1, position: 'relative', zIndex: 1 }}>
          <div style={{ fontFamily: theme.fonts.body, fontSize: '13px', fontWeight: 500, color: theme.colors.textBright }}>{title}</div>
          <div style={{ fontSize: '11px', color: theme.colors.textMuted, marginTop: 2 }}>{count} products affected</div>
        </div>
        <div style={{
          width: 32,
          height: 32,
          borderRadius: '50%',
          background: `linear-gradient(135deg, ${c.text}, ${c.text}aa)`,
          color: 'white',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '13px',
          fontWeight: 700,
          flexShrink: 0,
          position: 'relative',
          zIndex: 1,
          boxShadow: hovered ? `0 0 20px ${c.text}40` : 'none',
          transform: hovered ? 'scale(1.1)' : 'scale(1)',
          transition: 'all 0.3s ease',
        }}>
          {count}
        </div>
      </div>
    </TiltCard>
  )
}

// Quick Action Button
function QuickAction({ icon: Icon, label, desc, color }) {
  const [hovered, setHovered] = useState(false)
  return (
    <TiltCard>
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 14,
          padding: '16px 20px',
          background: hovered ? `${color}08` : theme.colors.bgCard,
          border: `1px solid ${hovered ? color : theme.colors.border}`,
          borderRadius: '14px',
          cursor: 'pointer',
          transition: 'all 0.3s ease',
          transform: hovered ? 'translateY(-2px)' : 'none',
          boxShadow: hovered ? `0 8px 30px ${color}15` : 'none',
          position: 'relative',
          overflow: 'hidden',
        }}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      >
        <div style={{
          position: 'absolute',
          top: '-50%',
          right: '-30%',
          width: '120%',
          height: '120%',
          background: `radial-gradient(circle, ${color}08 0%, transparent 60%)`,
          pointerEvents: 'none',
          opacity: hovered ? 0.8 : 0,
          transition: 'opacity 0.3s',
        }} />
        <div style={{
          width: 40,
          height: 40,
          borderRadius: '12px',
          background: `linear-gradient(135deg, ${color}20, ${color}08)`,
          border: `1px solid ${color}30`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'relative',
          zIndex: 1,
          transform: hovered ? 'scale(1.1) rotate(-5deg)' : 'scale(1) rotate(0deg)',
          transition: 'all 0.3s ease',
        }}>
          <Icon size={18} color={color} />
        </div>
        <div style={{ flex: 1, position: 'relative', zIndex: 1 }}>
          <div style={{ fontFamily: theme.fonts.body, fontSize: '13px', fontWeight: 500, color: theme.colors.textBright }}>{label}</div>
          <div style={{ fontSize: '11px', color: theme.colors.textMuted, marginTop: 2 }}>{desc}</div>
        </div>
        <ArrowUpRight size={16} color={hovered ? color : theme.colors.textMuted} style={{
          position: 'relative',
          zIndex: 1,
          transform: hovered ? 'translate(2px, -2px)' : 'none',
          transition: 'transform 0.3s ease',
        }} />
      </div>
    </TiltCard>
  )
}

// 3D Floating Hero Banner
function HeroBanner() {
  return (
    <div style={{
      background: `linear-gradient(135deg, ${theme.colors.primaryDeep} 0%, ${theme.colors.bg} 50%, #0a0500 100%)`,
      border: `1px solid ${theme.colors.primaryDark}`,
      borderRadius: '24px',
      padding: '40px 48px',
      marginBottom: 36,
      position: 'relative',
      overflow: 'hidden',
      boxShadow: `0 0 80px ${theme.colors.primary}10, ${theme.shadows.card}`,
    }}>
      {/* Animated gradient orbs */}
      <div style={{
        position: 'absolute',
        top: '-100px',
        left: '-100px',
        width: '400px',
        height: '400px',
        background: `radial-gradient(circle, ${theme.colors.primary}12 0%, transparent 70%)`,
        borderRadius: '50%',
        animation: 'heroOrb 8s ease-in-out infinite',
        pointerEvents: 'none',
      }} />
      <div style={{
        position: 'absolute',
        bottom: '-150px',
        right: '-80px',
        width: '500px',
        height: '500px',
        background: `radial-gradient(circle, ${theme.colors.primaryLight}08 0%, transparent 70%)`,
        borderRadius: '50%',
        animation: 'heroOrb2 12s ease-in-out infinite',
        pointerEvents: 'none',
      }} />

      <div style={{ position: 'relative', zIndex: 1, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: 10,
            marginBottom: 16,
          }}>
            <span style={{
              padding: '4px 12px',
              borderRadius: '20px',
              background: `${theme.colors.success}15`,
              border: `1px solid ${theme.colors.success}30`,
              color: theme.colors.success,
              fontSize: '10px',
              fontWeight: 700,
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
            }}>
              🟢 LIVE — 3,433 Products
            </span>
            <span style={{
              padding: '4px 12px',
              borderRadius: '20px',
              background: `${theme.colors.primary}15`,
              border: `1px solid ${theme.colors.primary}30`,
              color: theme.colors.primary,
              fontSize: '10px',
              fontWeight: 700,
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
            }}>
              🚀 Phase 1 Active
            </span>
          </div>

          <h1 style={{
            fontFamily: theme.fonts.heading,
            fontSize: '44px',
            fontWeight: 700,
            color: theme.colors.textBright,
            letterSpacing: '0.02em',
            textTransform: 'uppercase',
            marginBottom: 12,
            textShadow: `0 0 40px ${theme.colors.primary}20`,
          }}>
            ShopZyla{' '}
            <span style={{
              background: `linear-gradient(135deg, ${theme.colors.primary}, ${theme.colors.primaryLight})`,
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}>
              Manager
            </span>
          </h1>

          <p style={{
            fontSize: '15px',
            color: theme.colors.textMuted,
            maxWidth: 500,
            lineHeight: 1.7,
            fontFamily: theme.fonts.body,
          }}>
            Complete control of your Shopify store. Chinese to English translation, Amazon pricing, bulk operations — all in one place. 🚀
          </p>

          <div style={{ display: 'flex', gap: 12, marginTop: 24 }}>
            {[
              { label: 'Auto Import', color: theme.colors.success, icon: Zap },
              { label: 'Bulk Manager', color: theme.colors.primaryLight, icon: Package },
              { label: 'SEO Helper', color: theme.colors.warning, icon: Search },
              { label: 'Content Cleaner', color: theme.colors.accent, icon: SprayCan },
            ].map((badge, i) => (
              <div key={i} style={{
                display: 'flex',
                alignItems: 'center',
                gap: 6,
                padding: '8px 14px',
                borderRadius: '10px',
                background: `${badge.color}10`,
                border: `1px solid ${badge.color}25`,
                color: badge.color,
                fontSize: '11px',
                fontWeight: 600,
                fontFamily: theme.fonts.body,
              }}>
                <badge.icon size={14} />
                {badge.label}
              </div>
            ))}
          </div>
        </div>

        {/* 3D Product Showcase */}
        <div style={{
          width: 200,
          height: 200,
          position: 'relative',
          flexShrink: 0,
        }}>
          {/* Floating rotating rings */}
          <div style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: 180,
            height: 180,
            borderRadius: '50%',
            border: `1px solid ${theme.colors.primary}20`,
            animation: 'ringRotate 10s linear infinite',
          }} />
          <div style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: 140,
            height: 140,
            borderRadius: '50%',
            border: `1px solid ${theme.colors.primaryLight}15`,
            animation: 'ringRotate 8s linear infinite reverse',
          }} />
          <div style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: 100,
            height: 100,
            borderRadius: '50%',
            background: `radial-gradient(circle, ${theme.colors.primary}20, transparent 70%)`,
            animation: 'pulseGlow 3s ease-in-out infinite',
          }} />
          {/* Central icon */}
          <div style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: 60,
            height: 60,
            borderRadius: '16px',
            background: `linear-gradient(135deg, ${theme.colors.primary}, ${theme.colors.primaryDark})`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: `0 0 40px ${theme.colors.primary}40`,
            animation: 'floatIcon 3s ease-in-out infinite',
          }}>
            <Store size={28} color="white" />
          </div>
        </div>
      </div>

      <style>{`
        @keyframes heroOrb {
          0%, 100% { transform: translate(0, 0) scale(1); }
          50% { transform: translate(50px, 30px) scale(1.1); }
        }
        @keyframes heroOrb2 {
          0%, 100% { transform: translate(0, 0) scale(1); }
          33% { transform: translate(-30px, -50px) scale(1.2); }
          66% { transform: translate(40px, -20px) scale(0.9); }
        }
        @keyframes ringRotate {
          0% { transform: translate(-50%, -50%) rotate(0deg); }
          100% { transform: translate(-50%, -50%) rotate(360deg); }
        }
        @keyframes pulseGlow {
          0%, 100% { opacity: 0.5; transform: translate(-50%, -50%) scale(1); }
          50% { opacity: 1; transform: translate(-50%, -50%) scale(1.1); }
        }
        @keyframes floatIcon {
          0%, 100% { transform: translate(-50%, -50%) translateY(0); }
          50% { transform: translate(-50%, -50%) translateY(-8px); }
        }
      `}</style>
    </div>
  )
}

// Animated background for store overview
function StoreOverview() {
  const [hoveredCard, setHoveredCard] = useState(null)

  const items = [
    { label: 'Store URL', value: 'www.shopszyla.com', icon: Store, color: theme.colors.primary },
    { label: 'Products', value: '3,433', icon: Package, color: theme.colors.success },
    { label: 'Variants', value: '52,324', icon: TrendingUp, color: theme.colors.primaryLight },
    { label: 'Collections', value: '21', icon: Activity, color: theme.colors.warning },
    { label: 'Categories', value: '38', icon: BarChart3, color: theme.colors.accent },
    { label: 'Pending Updates', value: '728', icon: AlertTriangle, color: theme.colors.error },
  ]

  return (
    <TiltCard>
      <div style={{
        background: `linear-gradient(135deg, ${theme.colors.bgCard} 0%, ${theme.colors.bgLight} 100%)`,
        border: `1px solid ${theme.colors.border}`,
        borderRadius: '20px',
        padding: '32px',
        position: 'relative',
        overflow: 'hidden',
      }}>
        <div style={{
          position: 'absolute',
          top: 0,
          right: 0,
          width: '400px',
          height: '400px',
          background: `radial-gradient(circle, ${theme.colors.primary}08 0%, transparent 70%)`,
          pointerEvents: 'none',
        }} />
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: 24,
          position: 'relative',
          zIndex: 1,
        }}>
          <div>
            <div style={{
              fontFamily: theme.fonts.heading,
              fontSize: '18px',
              fontWeight: 600,
              color: theme.colors.textBright,
              letterSpacing: '0.05em',
              textTransform: 'uppercase',
            }}>
              📊 Store Overview
            </div>
            <div style={{ fontSize: '12px', color: theme.colors.textMuted, marginTop: 4 }}>
              Last updated: June 2026
            </div>
          </div>
          <div style={{
            padding: '8px 16px',
            borderRadius: '20px',
            background: `linear-gradient(135deg, ${theme.colors.success}15, ${theme.colors.success}08)`,
            border: `1px solid ${theme.colors.success}30`,
            color: theme.colors.success,
            fontSize: '11px',
            fontWeight: 700,
            letterSpacing: '0.08em',
            display: 'flex',
            alignItems: 'center',
            gap: 6,
          }}>
            <div style={{
              width: 8,
              height: 8,
              borderRadius: '50%',
              background: theme.colors.success,
              boxShadow: `0 0 10px ${theme.colors.success}`,
              animation: 'pulseLive 2s ease-in-out infinite',
            }} />
            LIVE
          </div>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
          gap: '14px',
          position: 'relative',
          zIndex: 1,
        }}>
          {items.map((item, i) => (
            <div
              key={i}
              style={{
                padding: '16px',
                background: hoveredCard === i ? `${item.color}08` : theme.colors.bg,
                borderRadius: '14px',
                border: `1px solid ${hoveredCard === i ? item.color + '40' : theme.colors.border}`,
                transition: 'all 0.3s ease',
                transform: hoveredCard === i ? 'translateY(-3px)' : 'none',
                boxShadow: hoveredCard === i ? `0 8px 25px ${item.color}15` : 'none',
                cursor: 'default',
              }}
              onMouseEnter={() => setHoveredCard(i)}
              onMouseLeave={() => setHoveredCard(null)}
            >
              <div style={{
                fontSize: '10px',
                color: theme.colors.textMuted,
                marginBottom: 8,
                display: 'flex',
                alignItems: 'center',
                gap: 6,
                letterSpacing: '0.05em',
                textTransform: 'uppercase',
              }}>
                <item.icon size={12} color={item.color} />
                {item.label}
              </div>
              <div style={{
                fontFamily: theme.fonts.heading,
                fontSize: '20px',
                fontWeight: 600,
                color: theme.colors.textBright,
                letterSpacing: '0.02em',
              }}>
                {item.value}
              </div>
            </div>
          ))}
        </div>

        <style>{`
          @keyframes pulseLive {
            0%, 100% { opacity: 1; }
            50% { opacity: 0.4; }
          }
        `}</style>
      </div>
    </TiltCard>
  )
}

export default function Dashboard() {
  const stats = [
    { icon: Store, label: 'Total Products', value: '3,433', sub: '750 need attention', trend: 12, color: theme.colors.primary },
    { icon: Package, label: 'Chinese Products', value: '2,847', sub: 'Need translation', trend: 8, color: theme.colors.accent },
    { icon: TrendingUp, label: 'Translated', value: '22', sub: 'Of 2,847 Chinese products', trend: 5, color: theme.colors.success },
    { icon: DollarSign, label: 'Avg Price', value: '$28.50', sub: 'Amazon compatible', trend: 15, color: theme.colors.primaryLight },
  ]

  const issues = [
    { icon: Globe, title: 'Chinese Titles', count: 728, severity: 'critical' },
    { icon: AlertTriangle, title: 'Alibaba HTML Cleanup', count: 713, severity: 'critical' },
    { icon: CheckCircle, title: 'Missing Descriptions', count: 750, severity: 'warning' },
    { icon: AlertTriangle, title: 'Broken CDN Images', count: 727, severity: 'warning' },
  ]

  return (
    <div>
      {/* Hero Banner */}
      <HeroBanner />

      {/* Stats Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
        gap: '20px',
        marginBottom: 40,
      }}>
        {stats.map((stat, i) => (
          <StatCard key={i} {...stat} delay={i * 100} />
        ))}
      </div>

      {/* Issues & Quick Actions */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: '28px',
        marginBottom: 40,
      }}>
        {/* Issues Column */}
        <div>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: 16,
          }}>
            <h2 style={{
              fontFamily: theme.fonts.heading,
              fontSize: '18px',
              fontWeight: 500,
              color: theme.colors.textBright,
              letterSpacing: '0.05em',
              textTransform: 'uppercase',
            }}>
              <AlertTriangle size={16} style={{ marginRight: 8, verticalAlign: 'middle', color: theme.colors.warning }} />
              Issues Overview
            </h2>
            <span style={{
              fontSize: '11px',
              color: theme.colors.textMuted,
              padding: '4px 10px',
              background: theme.colors.bgCard,
              borderRadius: '20px',
            }}>
              {issues.length} total
            </span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {issues.map((issue, i) => (
              <IssueCard key={i} {...issue} />
            ))}
          </div>
        </div>

        {/* Quick Actions Column */}
        <div>
          <h2 style={{
            fontFamily: theme.fonts.heading,
            fontSize: '18px',
            fontWeight: 500,
            color: theme.colors.textBright,
            letterSpacing: '0.05em',
            textTransform: 'uppercase',
            marginBottom: 16,
          }}>
            <Zap size={16} style={{ marginRight: 8, verticalAlign: 'middle', color: theme.colors.primaryLight }} />
            Quick Actions
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            <QuickAction icon={Package} label="Assign Product Types" desc="Bulk assign categories to 750 products" color={theme.colors.primary} />
            <QuickAction icon={DollarSign} label="Update Pricing" desc="Set premium pricing (5-20x multiplier)" color={theme.colors.primaryLight} />
            <QuickAction icon={Globe} label="Translate Titles" desc="Convert 728 Chinese titles to English" color={theme.colors.success} />
            <QuickAction icon={CheckCircle} label="Generate SKUs" desc="Auto-create SKUs for all variants" color={theme.colors.warning} />
          </div>
        </div>
      </div>

      {/* Store Overview */}
      <StoreOverview />
    </div>
  )
}
