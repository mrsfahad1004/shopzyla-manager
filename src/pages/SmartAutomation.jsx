import { useState, useEffect } from 'react'
import { Zap, RefreshCw, CheckCircle, AlertTriangle, Settings, Package, Globe, DollarSign, Tags, Layers, ShoppingBag, Sparkles, Clock, TrendingUp, ToggleLeft, ToggleRight } from 'lucide-react'
import { theme } from '../theme'

// Automation Rule Card
function AutomationRule({ icon: Icon, title, desc, enabled, onToggle, status, color, stats }) {
  return (
    <div style={{
      background: theme.colors.bgCard,
      border: `1px solid ${enabled ? color + '40' : theme.colors.border}`,
      borderRadius: '16px',
      padding: '20px 24px',
      transition: 'all 0.3s ease',
      position: 'relative',
      overflow: 'hidden',
    }}
    onMouseEnter={e => { e.currentTarget.style.borderColor = color + '60'; e.currentTarget.style.transform = 'translateY(-2px)' }}
    onMouseLeave={e => { e.currentTarget.style.borderColor = enabled ? color + '40' : theme.colors.border; e.currentTarget.style.transform = 'translateY(0)' }}
    >
      {/* Glow when enabled */}
      {enabled && (
        <div style={{
          position: 'absolute',
          top: '-50%',
          right: '-30%',
          width: '200px',
          height: '200px',
          background: `radial-gradient(circle, ${color}08 0%, transparent 70%)`,
          pointerEvents: 'none',
        }} />
      )}

      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 12 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          <div style={{
            width: 44,
            height: 44,
            borderRadius: '12px',
            background: `${color}15`,
            border: `1px solid ${color}25`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'all 0.3s',
          }}>
            <Icon size={20} color={enabled ? color : theme.colors.textMuted} />
          </div>
          <div>
            <div style={{
              fontFamily: theme.fonts.heading,
              fontSize: '15px',
              fontWeight: 500,
              color: theme.colors.textBright,
              letterSpacing: '0.02em',
              marginBottom: 2,
            }}>
              {title}
            </div>
            <div style={{ fontSize: '11px', color: theme.colors.textMuted, lineHeight: 1.5, maxWidth: 400 }}>
              {desc}
            </div>
          </div>
        </div>

        <button
          onClick={onToggle}
          style={{
            width: 48,
            height: 28,
            borderRadius: '14px',
            border: 'none',
            background: enabled ? color : theme.colors.border,
            cursor: 'pointer',
            position: 'relative',
            transition: 'all 0.3s',
            flexShrink: 0,
            boxShadow: enabled ? `0 0 12px ${color}30` : 'none',
          }}
        >
          <div style={{
            width: 22,
            height: 22,
            borderRadius: '50%',
            background: 'white',
            position: 'absolute',
            top: 3,
            left: enabled ? 23 : 3,
            transition: 'all 0.3s',
            boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
          }} />
        </button>
      </div>

      {/* Stats */}
      {stats && (
        <div style={{
          display: 'flex',
          gap: 12,
          padding: '10px 14px',
          background: theme.colors.bg,
          borderRadius: '10px',
          border: `1px solid ${theme.colors.border}`,
          marginTop: 8,
        }}>
          {stats.map((s, i) => (
            <div key={i} style={{ flex: 1 }}>
              <div style={{ fontSize: '9px', color: theme.colors.textMuted, letterSpacing: '0.05em', textTransform: 'uppercase', marginBottom: 2 }}>
                {s.label}
              </div>
              <div style={{
                fontFamily: theme.fonts.heading,
                fontSize: '16px',
                fontWeight: 600,
                color: s.color || theme.colors.textBright,
              }}>
                {s.value}
              </div>
            </div>
          ))}
          {status && (
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: 6,
              padding: '4px 12px',
              borderRadius: '8px',
              fontSize: '10px',
              fontWeight: 600,
              background: status === 'active' ? `${theme.colors.success}15` : `${theme.colors.warning}15`,
              color: status === 'active' ? theme.colors.success : theme.colors.warning,
              height: 'fit-content',
              alignSelf: 'center',
            }}>
              <div style={{
                width: 6,
                height: 6,
                borderRadius: '50%',
                background: status === 'active' ? theme.colors.success : theme.colors.warning,
                animation: status === 'active' ? 'pulseLive 2s infinite' : 'none',
              }} />
              {status === 'active' ? 'Active' : 'Idle'}
            </div>
          )}
        </div>
      )}

      {/* Action Buttons */}
      <div style={{ display: 'flex', gap: 8, marginTop: 12 }}>
        <button
          onClick={() => alert(`🔄 Running ${title} manually...`)}
          style={{
            padding: '8px 16px',
            background: `${color}15`,
            border: `1px solid ${color}25`,
            borderRadius: '8px',
            color: color,
            fontSize: '11px',
            fontWeight: 600,
            cursor: 'pointer',
            fontFamily: theme.fonts.body,
            display: 'flex',
            alignItems: 'center',
            gap: 6,
            transition: 'all 0.2s',
          }}
          onMouseEnter={e => e.currentTarget.style.background = `${color}25`}
          onMouseLeave={e => e.currentTarget.style.background = `${color}15`}
        >
          <RefreshCw size={12} /> Run Now
        </button>
        <button style={{
          padding: '8px 14px',
          background: 'transparent',
          border: `1px solid ${theme.colors.border}`,
          borderRadius: '8px',
          color: theme.colors.textMuted,
          fontSize: '11px',
          fontWeight: 500,
          cursor: 'pointer',
          fontFamily: theme.fonts.body,
          transition: 'all 0.2s',
        }}>
          <Settings size={12} style={{ marginRight: 4, verticalAlign: 'middle' }} />
          Settings
        </button>
      </div>
    </div>
  )
}

// Activity Log Entry
function LogEntry({ entry }) {
  const colors = {
    success: theme.colors.success,
    warning: theme.colors.warning,
    error: theme.colors.error,
    info: theme.colors.primary,
  }
  return (
    <div style={{
      display: 'flex',
      alignItems: 'flex-start',
      gap: 10,
      padding: '8px 12px',
      borderRadius: '8px',
      transition: 'background 0.2s',
      fontSize: '11px',
    }}
    onMouseEnter={e => e.currentTarget.style.background = theme.colors.bg}
    onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
    >
      <div style={{
        width: 6,
        height: 6,
        borderRadius: '50%',
        background: colors[entry.type] || theme.colors.textMuted,
        marginTop: 4,
        flexShrink: 0,
      }} />
      <div style={{ flex: 1, minWidth: 0 }}>
        <span style={{ color: theme.colors.textMuted }}>[{entry.time}]</span>{' '}
        <span style={{ color: theme.colors.text }}>{entry.text}</span>
      </div>
      <div style={{
        fontSize: '9px',
        color: colors[entry.type] || theme.colors.textMuted,
        fontWeight: 600,
        textTransform: 'uppercase',
        flexShrink: 0,
      }}>
        {entry.type}
      </div>
    </div>
  )
}

// Initial log entries
const initialLogs = [
  { text: 'Smart Automation Engine initialized', type: 'info', time: '10:00:00' },
  { text: '3,840 products loaded for monitoring', type: 'info', time: '10:00:01' },
  { text: '728 Chinese titles detected — ready for auto-translate', type: 'warning', time: '10:00:02' },
  { text: '750 products without types — auto-tag ready', type: 'info', time: '10:00:03' },
  { text: 'Auto-collection rules: 12 collections configured', type: 'success', time: '10:00:04' },
]

export default function SmartAutomation() {
  const [rules, setRules] = useState({
    stockReplace: { enabled: true, status: 'active', lastRun: '2 min ago', processed: 47 },
    autoTranslate: { enabled: true, status: 'active', lastRun: '5 min ago', processed: 728 },
    autoPricing: { enabled: true, status: 'active', lastRun: '10 min ago', processed: 3840 },
    autoTags: { enabled: true, status: 'active', lastRun: '3 min ago', processed: 3050 },
    autoCollection: { enabled: true, status: 'idle', lastRun: '1 hour ago', processed: 12 },
  })
  const [logs, setLogs] = useState(initialLogs)
  const [productStats, setProductStats] = useState(null)

  useEffect(() => {
    fetch('/api/store').then(r => r.json()).then(d => setProductStats(d)).catch(() => {})
  }, [])

  const toggleRule = (ruleKey) => {
    setRules(prev => ({
      ...prev,
      [ruleKey]: {
        ...prev[ruleKey],
        enabled: !prev[ruleKey].enabled,
        status: !prev[ruleKey].enabled ? 'active' : 'idle',
      }
    }))
    const newLog = {
      text: `${ruleKey === 'stockReplace' ? 'Auto Stock Replacement' : 
               ruleKey === 'autoTranslate' ? 'Auto Translation' :
               ruleKey === 'autoPricing' ? 'Auto Pricing' :
               ruleKey === 'autoTags' ? 'Auto Tags' : 'Auto Collections'} ${rules[ruleKey].enabled ? 'disabled' : 'enabled'}`,
      type: rules[ruleKey].enabled ? 'warning' : 'success',
      time: new Date().toLocaleTimeString(),
    }
    setLogs(prev => [newLog, ...prev])
  }

  return (
    <div>
      {/* Header */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 28,
        flexWrap: 'wrap',
        gap: 12,
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
            display: 'flex',
            alignItems: 'center',
            gap: 10,
          }}>
            🤖 Smart Automation
            <span style={{
              fontSize: '10px',
              fontWeight: 400,
              color: theme.colors.success,
              background: `${theme.colors.success}10`,
              padding: '2px 10px',
              borderRadius: '8px',
              border: `1px solid ${theme.colors.success}20`,
              letterSpacing: '0.05em',
            }}>
              <div style={{width:6,height:6,borderRadius:'50%',background:theme.colors.success,display:'inline-block',marginRight:4,animation:'pulseLive 2s infinite',verticalAlign:'middle'}} />
              All Systems Active
            </span>
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
            Fully automated product management — out-of-stock replacement, translation, pricing, tags & collections
          </div>
        </div>
      </div>

      {/* Stats Overview */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
        gap: '12px',
        marginBottom: 24,
      }}>
        {[
          { label: 'Products', value: productStats?.productCount?.toLocaleString() || '3,840', icon: Package, color: theme.colors.primary },
          { label: 'Rules Active', value: Object.values(rules).filter(r => r.enabled).length + '/5', icon: Settings, color: theme.colors.success },
          { label: 'Auto-Processed', value: Object.values(rules).reduce((s, r) => s + (r.processed || 0), 0).toLocaleString(), icon: Zap, color: theme.colors.primaryLight },
          { label: 'Pending Actions', value: '750', icon: Clock, color: theme.colors.warning },
          { label: 'Auto-Replace Ready', value: '12', icon: TrendingUp, color: theme.colors.accent },
        ].map((s, i) => (
          <div key={i} style={{
            background: theme.colors.bgCard,
            border: `1px solid ${theme.colors.border}`,
            borderRadius: '12px',
            padding: '14px 16px',
            display: 'flex',
            alignItems: 'center',
            gap: 12,
          }}>
            <div style={{
              width: 36,
              height: 36,
              borderRadius: '10px',
              background: `${s.color}15`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
              <s.icon size={16} color={s.color} />
            </div>
            <div>
              <div style={{ fontSize: '10px', color: theme.colors.textMuted, letterSpacing: '0.05em', textTransform: 'uppercase' }}>
                {s.label}
              </div>
              <div style={{ fontFamily: theme.fonts.heading, fontSize: '18px', fontWeight: 600, color: theme.colors.textBright }}>
                {s.value}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Automation Rules */}
      <div style={{ marginBottom: 24 }}>
        <div style={{
          fontFamily: theme.fonts.heading,
          fontSize: '18px',
          fontWeight: 500,
          color: theme.colors.textBright,
          letterSpacing: '0.03em',
          marginBottom: 14,
          display: 'flex',
          alignItems: 'center',
          gap: 8,
        }}>
          <Zap size={18} color={theme.colors.primaryLight} />
          Automation Rules
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          {/* 1. Out-of-Stock Replacement */}
          <AutomationRule
            icon={ShoppingBag}
            title="Out-of-Stock Auto Replacement"
            desc="When any product reaches 0 stock, auto-replace with a similar product from the same category. Matches by product type, vendor, and price range."
            color={theme.colors.accent}
            enabled={rules.stockReplace.enabled}
            status={rules.stockReplace.status}
            onToggle={() => toggleRule('stockReplace')}
            stats={[
              { label: 'Replaced', value: rules.stockReplace.processed, color: theme.colors.success },
              { label: 'Last Run', value: rules.stockReplace.lastRun, color: theme.colors.textMuted },
              { label: 'Ready', value: '12 products', color: theme.colors.warning },
            ]}
          />

          {/* 2. Auto Translate */}
          <AutomationRule
            icon={Globe}
            title="Auto Chinese → English Translation"
            desc="New products are auto-detected for Chinese titles & variants, then translated to premium English. Variant limit: max 5 per product."
            color={theme.colors.primary}
            enabled={rules.autoTranslate.enabled}
            status={rules.autoTranslate.status}
            onToggle={() => toggleRule('autoTranslate')}
            stats={[
              { label: 'Translated', value: rules.autoTranslate.processed, color: theme.colors.success },
              { label: 'Pending', value: '0', color: theme.colors.success },
              { label: 'Variant Limit', value: 'Max 5', color: theme.colors.primaryLight },
            ]}
          />

          {/* 3. Auto Pricing */}
          <AutomationRule
            icon={DollarSign}
            title="Amazon-Compatible Auto Pricing"
            desc="Every product price is automatically set to Amazon competitive levels. Multiplier-based pricing with compare-at price."
            color={theme.colors.success}
            enabled={rules.autoPricing.enabled}
            status={rules.autoPricing.status}
            onToggle={() => toggleRule('autoPricing')}
            stats={[
              { label: 'Priced', value: rules.autoPricing.processed, color: theme.colors.success },
              { label: 'Multiplier', value: '5-12x', color: theme.colors.primaryLight },
              { label: 'Avg Profit', value: '68%', color: theme.colors.success },
            ]}
          />

          {/* 4. Auto Tags */}
          <AutomationRule
            icon={Tags}
            title="Smart Auto Tags"
            desc="Products get auto-tagged based on category, vendor, price range, and status. New products are tagged instantly."
            color={theme.colors.warning}
            enabled={rules.autoTags.enabled}
            status={rules.autoTags.status}
            onToggle={() => toggleRule('autoTags')}
            stats={[
              { label: 'Tagged', value: rules.autoTags.processed, color: theme.colors.success },
              { label: 'Tag Types', value: '12', color: theme.colors.primaryLight },
              { label: 'Auto-Generated', value: '3,050 tags', color: theme.colors.warning },
            ]}
          />

          {/* 5. Auto Collections */}
          <AutomationRule
            icon={Layers}
            title="Auto Collection Push"
            desc="Products are auto-pushed to smart collections based on their category and type. New products added to collections instantly."
            color={theme.colors.primaryLight}
            enabled={rules.autoCollection.enabled}
            status={rules.autoCollection.status}
            onToggle={() => toggleRule('autoCollection')}
            stats={[
              { label: 'Collections', value: '12', color: theme.colors.success },
              { label: 'Products Mapped', value: '2,400', color: theme.colors.primaryLight },
              { label: 'Last Sync', value: rules.autoCollection.lastRun, color: theme.colors.textMuted },
            ]}
          />
        </div>
      </div>

      {/* Pipeline Status */}
      <div style={{
        background: theme.colors.bgCard,
        border: `1px solid ${theme.colors.border}`,
        borderRadius: '16px',
        padding: '24px',
        marginBottom: 24,
      }}>
        <div style={{
          fontFamily: theme.fonts.heading,
          fontSize: '16px',
          fontWeight: 500,
          color: theme.colors.textBright,
          marginBottom: 16,
          letterSpacing: '0.03em',
          display: 'flex',
          alignItems: 'center',
          gap: 10,
        }}>
          <Sparkles size={18} color={theme.colors.primaryLight} />
          Full Automation Pipeline Flow
        </div>

        {/* Pipeline Steps */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '4px',
          flexWrap: 'wrap',
        }}>
          {[
            { label: '1. New Product Detected', desc: 'Shopify webhook / API scan', color: theme.colors.primary },
            { label: '2. Translate CN→EN', desc: 'Title + Variants (max 5)', color: theme.colors.primaryLight },
            { label: '3. Amazon Price Set', desc: '5-12x multiplier applied', color: theme.colors.success },
            { label: '4. Auto Tags Applied', desc: 'Category, vendor, price tags', color: theme.colors.warning },
            { label: '5. Collection Push', desc: 'Smart collection auto-add', color: theme.colors.accent },
            { label: '✅ Live on Store', desc: 'Auto-published', color: theme.colors.success },
          ].map((step, i) => (
            <div key={i} style={{
              flex: 1,
              minWidth: 120,
              padding: '12px 14px',
              background: theme.colors.bg,
              borderRadius: '10px',
              border: `1px solid ${step.color}25`,
              textAlign: 'center',
            }}>
              <div style={{
                fontSize: '11px',
                fontWeight: 600,
                color: step.color,
                marginBottom: 4,
                fontFamily: theme.fonts.heading,
              }}>
                {step.label}
              </div>
              <div style={{ fontSize: '9px', color: theme.colors.textMuted }}>
                {step.desc}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Activity Log */}
      <div style={{
        background: theme.colors.bgCard,
        border: `1px solid ${theme.colors.border}`,
        borderRadius: '16px',
        overflow: 'hidden',
      }}>
        <div style={{
          padding: '14px 20px',
          borderBottom: `1px solid ${theme.colors.border}`,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}>
          <div style={{
            fontFamily: theme.fonts.heading,
            fontSize: '13px',
            fontWeight: 500,
            color: theme.colors.textBright,
            letterSpacing: '0.03em',
            display: 'flex',
            alignItems: 'center',
            gap: 8,
          }}>
            <Clock size={14} color={theme.colors.primaryLight} />
            Automation Activity Log
          </div>
          <span style={{ fontSize: '10px', color: theme.colors.textMuted }}>
            {logs.length} entries
          </span>
        </div>
        <div style={{
          padding: '8px 12px',
          maxHeight: 240,
          overflowY: 'auto',
        }}>
          {logs.map((entry, i) => (
            <LogEntry key={i} entry={entry} />
          ))}
        </div>
      </div>

      <style>{`
        @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
        @keyframes pulseLive { 0%, 100% { opacity: 1; } 50% { opacity: 0.3; } }
      `}</style>
    </div>
  )
}
