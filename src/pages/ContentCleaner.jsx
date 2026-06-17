import { useState } from 'react'
import { SprayCan, Code, Image, FileText, AlertTriangle, CheckCircle, Trash2, RefreshCw, Eye } from 'lucide-react'
import { theme } from '../theme'

function IssueBlock({ icon: Icon, title, count, desc, severity = 'warning', onFix }) {
  const sevColors = {
    critical: { bg: `${theme.colors.error}10`, border: `${theme.colors.error}25`, dot: theme.colors.error },
    warning: { bg: `${theme.colors.warning}10`, border: `${theme.colors.warning}25`, dot: theme.colors.warning },
    info: { bg: `${theme.colors.primary}10`, border: `${theme.colors.primary}25`, dot: theme.colors.primary },
  }
  const c = sevColors[severity] || sevColors.warning

  return (
    <div style={{
      background: theme.colors.bgCard,
      border: `1px solid ${c.border}`,
      borderRadius: '14px',
      padding: '20px 24px',
      transition: 'all 0.3s ease',
    }}
    onMouseEnter={e => { e.currentTarget.style.borderColor = c.dot; e.currentTarget.style.transform = 'translateY(-2px)' }}
    onMouseLeave={e => { e.currentTarget.style.borderColor = c.border; e.currentTarget.style.transform = 'translateY(0)' }}
    >
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 12 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{
            width: 40,
            height: 40,
            borderRadius: '10px',
            background: c.bg,
            border: `1px solid ${c.border}`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
            <Icon size={18} color={c.dot} />
          </div>
          <div>
            <div style={{ fontFamily: theme.fonts.heading, fontSize: '15px', fontWeight: 500, color: theme.colors.textBright, letterSpacing: '0.02em' }}>
              {title}
            </div>
            <div style={{ fontSize: '12px', color: theme.colors.textMuted, marginTop: 2 }}>
              {count} products affected
            </div>
          </div>
        </div>
        <div style={{
          width: 32,
          height: 32,
          borderRadius: '50%',
          background: c.dot,
          color: 'white',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '13px',
          fontWeight: 700,
          flexShrink: 0,
        }}>
          {count}
        </div>
      </div>

      <div style={{ fontSize: '12px', color: theme.colors.text, lineHeight: 1.6, marginBottom: 14, padding: '8px 12px', background: theme.colors.bg, borderRadius: '8px', border: `1px solid ${theme.colors.border}` }}>
        {desc}
      </div>

      <div style={{ display: 'flex', gap: 10 }}>
        <button
          onClick={onFix}
          style={{
            padding: '10px 20px',
            background: `linear-gradient(135deg, ${c.dot}, ${c.dot}dd)`,
            border: 'none',
            borderRadius: '8px',
            color: 'white',
            fontSize: '12px',
            fontWeight: 600,
            cursor: 'pointer',
            fontFamily: theme.fonts.body,
            display: 'flex',
            alignItems: 'center',
            gap: 6,
            transition: 'all 0.2s',
          }}
          onMouseEnter={e => { e.currentTarget.style.transform = 'scale(1.03)' }}
          onMouseLeave={e => { e.currentTarget.style.transform = 'scale(1)' }}
        >
          <Trash2 size={14} /> Fix All
        </button>
        <button style={{
          padding: '10px 20px',
          background: 'transparent',
          border: `1px solid ${theme.colors.border}`,
          borderRadius: '8px',
          color: theme.colors.textMuted,
          fontSize: '12px',
          cursor: 'pointer',
          fontFamily: theme.fonts.body,
          display: 'flex',
          alignItems: 'center',
          gap: 6,
          transition: 'all 0.2s',
        }}
        onMouseEnter={e => { e.currentTarget.style.color = theme.colors.primary; e.currentTarget.style.borderColor = theme.colors.primaryDark }}
        onMouseLeave={e => { e.currentTarget.style.color = theme.colors.textMuted; e.currentTarget.style.borderColor = theme.colors.border }}
        >
          <Eye size={14} /> Preview
        </button>
      </div>
    </div>
  )
}

export default function ContentCleaner() {
  return (
    <div>
      <div style={{ marginBottom: 36 }}>
        <div style={{
          fontFamily: theme.fonts.heading,
          fontSize: '38px',
          fontWeight: 600,
          color: theme.colors.textBright,
          letterSpacing: '0.02em',
          textTransform: 'uppercase',
          marginBottom: 8,
        }}>
          Content Cleaner
        </div>
        <div style={{
          width: '60px',
          height: '4px',
          background: `linear-gradient(90deg, ${theme.colors.primary}, ${theme.colors.primaryLight})`,
          borderRadius: '2px',
          marginBottom: 12,
          boxShadow: theme.shadows.glow,
        }} />
        <div style={{ fontSize: '14px', color: theme.colors.textMuted }}>
          Clean Alibaba HTML, fix broken images, polish descriptions — <span style={{ color: theme.colors.error }}>713 products need cleanup</span>
        </div>
      </div>

      {/* Summary Cards */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
        gap: '14px',
        marginBottom: 28,
      }}>
        {[
          { label: 'Total Products', value: '750', icon: FileText, color: theme.colors.primary },
          { label: 'Need Cleanup', value: '713', icon: AlertTriangle, color: theme.colors.error },
          { label: 'Clean', value: '37', icon: CheckCircle, color: theme.colors.success },
          { label: 'Broken Images', value: '727', icon: Image, color: theme.colors.warning },
        ].map((s, i) => (
          <div key={i} style={{
            background: theme.colors.bgCard,
            border: `1px solid ${theme.colors.border}`,
            borderRadius: '12px',
            padding: '16px 18px',
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
              <div style={{ fontSize: '10px', color: theme.colors.textMuted, letterSpacing: '0.05em', textTransform: 'uppercase' }}>{s.label}</div>
              <div style={{ fontFamily: theme.fonts.heading, fontSize: '18px', fontWeight: 600, color: theme.colors.textBright }}>{s.value}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Clean All Button */}
      <div style={{
        background: `linear-gradient(135deg, ${theme.colors.bgCard} 0%, ${theme.colors.bgLight} 100%)`,
        border: `1px solid ${theme.colors.border}`,
        borderRadius: '16px',
        padding: '24px 28px',
        marginBottom: 24,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        position: 'relative',
        overflow: 'hidden',
      }}>
        <div style={{
          position: 'absolute',
          top: '-50px',
          right: '-50px',
          width: '200px',
          height: '200px',
          background: `radial-gradient(circle, ${theme.colors.error}10 0%, transparent 70%)`,
          pointerEvents: 'none',
        }} />
        <div>
          <div style={{ fontFamily: theme.fonts.heading, fontSize: '18px', fontWeight: 500, color: theme.colors.textBright, marginBottom: 6, letterSpacing: '0.03em' }}>
            🧹 Clean Everything at Once
          </div>
          <div style={{ fontSize: '12px', color: theme.colors.textMuted, lineHeight: 1.5 }}>
            Strip Alibaba HTML · Remove broken CDN URLs · Clean empty tags · Generate premium descriptions
          </div>
        </div>
        <button style={{
          padding: '14px 28px',
          background: `linear-gradient(135deg, ${theme.colors.error}, ${theme.colors.accent})`,
          border: 'none',
          borderRadius: '10px',
          color: 'white',
          fontSize: '14px',
          fontWeight: 600,
          cursor: 'pointer',
          fontFamily: theme.fonts.body,
          display: 'flex',
          alignItems: 'center',
          gap: 8,
          boxShadow: `0 0 30px ${theme.colors.error}30`,
          transition: 'all 0.2s',
          whiteSpace: 'nowrap',
        }}
        onMouseEnter={e => { e.currentTarget.style.transform = 'scale(1.03)'; e.currentTarget.style.boxShadow = `0 0 40px ${theme.colors.error}40` }}
        onMouseLeave={e => { e.currentTarget.style.transform = 'scale(1)'; e.currentTarget.style.boxShadow = `0 0 30px ${theme.colors.error}30` }}
        >
          <RefreshCw size={16} /> Start Full Cleanup
        </button>
      </div>

      {/* Issues List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
        <IssueBlock
          icon={Code}
          title="Alibaba Template HTML"
          count="713"
          severity="critical"
          desc="Raw Alibaba/1688 template HTML in descriptions including offer-template divs, _sdmap image maps, and Chinese measurement tables. These display broken layouts on mobile."
        />
        <IssueBlock
          icon={Image}
          title="Broken Alibaba CDN Images"
          count="727"
          severity="critical"
          desc="Images pointing to cbu01.alicdn.com and other Alibaba CDNs that may not work reliably. Need to be replaced with Shopify CDN or re-uploaded."
        />
        <IssueBlock
          icon={Trash2}
          title="Empty & Null Content Tags"
          count="489"
          severity="warning"
          desc="Descriptions contain &lt;p&gt;null&lt;/p&gt; blocks, empty &lt;div&gt; tags, and broken HTML elements that create empty space on product pages."
        />
        <IssueBlock
          icon={FileText}
          title="Chinese Measurement Text"
          count="623"
          severity="warning"
          desc="Wholesale pricing text in Chinese, measurement units (mm/cm), and supplier notes that need to be translated or removed for international customers."
        />
        <IssueBlock
          icon={AlertTriangle}
          title="Missing Premium Descriptions"
          count="750"
          severity="info"
          desc="No products have premium, brand-appropriate descriptions. Need to generate compelling copy that drives conversions."
        />
      </div>

      {/* Recent Cleanups */}
      <div style={{
        marginTop: 28,
        background: theme.colors.bgCard,
        border: `1px solid ${theme.colors.border}`,
        borderRadius: '14px',
        padding: '20px 24px',
      }}>
        <div style={{ fontFamily: theme.fonts.heading, fontSize: '14px', fontWeight: 500, color: theme.colors.textBright, marginBottom: 12, letterSpacing: '0.03em' }}>
          Recent Cleanup Log
        </div>
        <div style={{ fontSize: '12px', color: theme.colors.textMuted, lineHeight: 2 }}>
          <div>No cleanup operations yet. Start cleaning above.</div>
        </div>
      </div>
    </div>
  )
}
