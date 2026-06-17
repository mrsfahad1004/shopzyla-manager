import { useState } from 'react'
import { PackageSearch, Type, DollarSign, Tags, Barcode, Upload, Download, CheckCircle, ArrowRight } from 'lucide-react'
import { theme } from '../theme'

function ActionCard({ icon: Icon, title, desc, children, color = theme.colors.primary }) {
  const [expanded, setExpanded] = useState(false)

  return (
    <div style={{
      background: `linear-gradient(135deg, ${theme.colors.bgCard} 0%, ${theme.colors.bgLight} 100%)`,
      border: `1px solid ${theme.colors.border}`,
      borderRadius: '16px',
      overflow: 'hidden',
      transition: 'all 0.3s ease',
      boxShadow: theme.shadows.card,
    }}>
      <div
        onClick={() => setExpanded(!expanded)}
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '20px 24px',
          cursor: 'pointer',
          transition: 'all 0.2s',
        }}
        onMouseEnter={e => { e.currentTarget.style.background = theme.colors.bgCardHover }}
        onMouseLeave={e => { e.currentTarget.style.background = 'transparent' }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <div style={{
            width: 44,
            height: 44,
            borderRadius: '12px',
            background: `linear-gradient(135deg, ${color}25, ${color}10)`,
            border: `1px solid ${color}30`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
            <Icon size={20} color={color} />
          </div>
          <div>
            <div style={{ fontFamily: theme.fonts.heading, fontSize: '16px', fontWeight: 500, color: theme.colors.textBright, letterSpacing: '0.03em' }}>
              {title}
            </div>
            <div style={{ fontSize: '12px', color: theme.colors.textMuted, marginTop: 2 }}>{desc}</div>
          </div>
        </div>
        <ArrowRight size={18} color={theme.colors.textMuted} style={{
          transform: expanded ? 'rotate(90deg)' : 'none',
          transition: 'transform 0.3s ease'
        }} />
      </div>
      
      {expanded && (
        <div style={{ padding: '0 24px 20px', borderTop: `1px solid ${theme.colors.border}` }}>
          {children}
        </div>
      )}
    </div>
  )
}

export default function BulkManager() {
  const [multiplier, setMultiplier] = useState('5')
  const [productType, setProductType] = useState('')

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
          Bulk Product Manager
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
          Perform bulk operations on your 750 products — <span style={{ color: theme.colors.primary }}>750 products waiting</span>
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        {/* Assign Product Types */}
        <ActionCard icon={Type} title="Assign Product Types" desc="Bulk assign categories to all uncategorized products" color={theme.colors.primary}>
          <div style={{ marginTop: 16 }}>
            <div style={{ display: 'flex', gap: 12, marginBottom: 12 }}>
              <select
                value={productType}
                onChange={e => setProductType(e.target.value)}
                style={{
                  flex: 1,
                  padding: '12px 16px',
                  background: theme.colors.bg,
                  border: `1px solid ${theme.colors.border}`,
                  borderRadius: '10px',
                  color: theme.colors.textBright,
                  fontSize: '14px',
                  fontFamily: theme.fonts.body,
                  outline: 'none',
                }}
              >
                <option value="">Select product type...</option>
                <option value="Phone Accessories">Phone Accessories</option>
                <option value="Car Accessories">Car Accessories</option>
                <option value="Handbags">Handbags</option>
                <option value="Wallets & Card Holders">Wallets & Card Holders</option>
                <option value="Skincare">Skincare</option>
                <option value="Makeup">Makeup</option>
                <option value="Beauty Tools">Beauty Tools</option>
                <option value="Hair Accessories">Hair Accessories</option>
                <option value="Jewelry">Jewelry</option>
                <option value="Watches">Watches</option>
                <option value="Home Decor">Home Decor</option>
                <option value="Clothing">Clothing</option>
                <option value="Shoes">Shoes</option>
                <option value="Accessories">Accessories</option>
              </select>
              <button style={{
                padding: '12px 24px',
                background: `linear-gradient(135deg, ${theme.colors.primary}, ${theme.colors.primaryDark})`,
                border: 'none',
                borderRadius: '10px',
                color: 'white',
                fontSize: '14px',
                fontWeight: 600,
                cursor: 'pointer',
                fontFamily: theme.fonts.body,
                boxShadow: theme.shadows.glow,
                transition: 'all 0.2s',
              }}
              onMouseEnter={e => { e.currentTarget.style.transform = 'scale(1.03)'; e.currentTarget.style.boxShadow = theme.shadows.glowStrong }}
              onMouseLeave={e => { e.currentTarget.style.transform = 'scale(1)'; e.currentTarget.style.boxShadow = theme.shadows.glow }}
              >
                Apply to All
              </button>
            </div>
            <div style={{ fontSize: '11px', color: theme.colors.textMuted, display: 'flex', alignItems: 'center', gap: 6 }}>
              <CheckCircle size={12} color={theme.colors.success} />
              750 products without type — 20 types available
            </div>
          </div>
        </ActionCard>

        {/* Bulk Pricing */}
        <ActionCard icon={DollarSign} title="Bulk Pricing Update" desc="Apply premium pricing multiplier (5-20x)" color={theme.colors.primaryLight}>
          <div style={{ marginTop: 16 }}>
            <div style={{ display: 'flex', gap: 12, marginBottom: 12, alignItems: 'center' }}>
              <div style={{ fontSize: '13px', color: theme.colors.textMuted, whiteSpace: 'nowrap' }}>Price Multiplier:</div>
              <input
                type="range"
                min="2"
                max="20"
                value={multiplier}
                onChange={e => setMultiplier(e.target.value)}
                style={{
                  flex: 1,
                  accentColor: theme.colors.primary,
                  height: 6,
                }}
              />
              <div style={{
                width: 48,
                height: 36,
                background: theme.colors.bg,
                border: `1px solid ${theme.colors.border}`,
                borderRadius: '8px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: theme.colors.primary,
                fontFamily: theme.fonts.heading,
                fontSize: '16px',
                fontWeight: 600,
              }}>
                {multiplier}x
              </div>
            </div>
            <div style={{ display: 'flex', gap: 12 }}>
              <button style={{
                flex: 1,
                padding: '12px',
                background: `linear-gradient(135deg, ${theme.colors.primary}, ${theme.colors.primaryDark})`,
                border: 'none',
                borderRadius: '10px',
                color: 'white',
                fontSize: '14px',
                fontWeight: 600,
                cursor: 'pointer',
                fontFamily: theme.fonts.body,
                boxShadow: theme.shadows.glow,
                transition: 'all 0.2s',
              }}
              onMouseEnter={e => { e.currentTarget.style.transform = 'scale(1.02)'; e.currentTarget.style.boxShadow = theme.shadows.glowStrong }}
              onMouseLeave={e => { e.currentTarget.style.transform = 'scale(1)'; e.currentTarget.style.boxShadow = theme.shadows.glow }}
              >
                Apply Pricing Update
              </button>
              <button style={{
                padding: '12px 20px',
                background: 'transparent',
                border: `1px solid ${theme.colors.border}`,
                borderRadius: '10px',
                color: theme.colors.textMuted,
                fontSize: '13px',
                cursor: 'pointer',
                fontFamily: theme.fonts.body,
                transition: 'all 0.2s',
              }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = theme.colors.primary; e.currentTarget.style.color = theme.colors.primary }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = theme.colors.border; e.currentTarget.style.color = theme.colors.textMuted }}
              >
                Preview
              </button>
            </div>
            <div style={{ fontSize: '11px', color: theme.colors.textMuted, marginTop: 8, display: 'flex', alignItems: 'center', gap: 6 }}>
              <DollarSign size={12} color={theme.colors.primary} />
              Current avg: $8.17 → {multiplier > 5 ? 'Premium' : 'Standard'} range
            </div>
          </div>
        </ActionCard>

        {/* Generate SKUs */}
        <ActionCard icon={Barcode} title="Generate SKUs" desc="Auto-create SKUs for all 7,549 variants" color={theme.colors.accent}>
          <div style={{ marginTop: 16 }}>
            <div style={{ display: 'flex', gap: 12, marginBottom: 12 }}>
              <input
                type="text"
                placeholder="SKU Prefix (e.g. SZ-)"
                defaultValue="SZ-"
                style={{
                  flex: 1,
                  padding: '12px 16px',
                  background: theme.colors.bg,
                  border: `1px solid ${theme.colors.border}`,
                  borderRadius: '10px',
                  color: theme.colors.textBright,
                  fontSize: '14px',
                  fontFamily: theme.fonts.body,
                  outline: 'none',
                }}
              />
              <button style={{
                padding: '12px 24px',
                background: `linear-gradient(135deg, ${theme.colors.accent}, #b83a4e)`,
                border: 'none',
                borderRadius: '10px',
                color: 'white',
                fontSize: '14px',
                fontWeight: 600,
                cursor: 'pointer',
                fontFamily: theme.fonts.body,
                boxShadow: `0 0 20px ${theme.colors.accent}30`,
                transition: 'all 0.2s',
              }}
              onMouseEnter={e => { e.currentTarget.style.transform = 'scale(1.03)' }}
              onMouseLeave={e => { e.currentTarget.style.transform = 'scale(1)' }}
              >
                Generate All
              </button>
            </div>
            <div style={{ fontSize: '11px', color: theme.colors.textMuted, display: 'flex', alignItems: 'center', gap: 6 }}>
              <Barcode size={12} color={theme.colors.accent} />
              Pattern: SZ-{'{'}CATEGORY{'}'}-{'{'}###{'}'} — 7,549 SKUs to generate
            </div>
          </div>
        </ActionCard>

        {/* Bulk Tags */}
        <ActionCard icon={Tags} title="Bulk Tags" desc="Add tags to products by collection or type" color={theme.colors.success}>
          <div style={{ marginTop: 16 }}>
            <div style={{ marginBottom: 12 }}>
              <input
                type="text"
                placeholder="Enter tags separated by comma (e.g. premium, trending, new)"
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  background: theme.colors.bg,
                  border: `1px solid ${theme.colors.border}`,
                  borderRadius: '10px',
                  color: theme.colors.textBright,
                  fontSize: '14px',
                  fontFamily: theme.fonts.body,
                  outline: 'none',
                  marginBottom: 10,
                }}
              />
              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                {['Premium', 'New Arrival', 'Best Seller', 'Limited Edition', 'Sale'].map(tag => (
                  <span key={tag} style={{
                    padding: '6px 12px',
                    borderRadius: '20px',
                    background: `${theme.colors.success}15`,
                    border: `1px solid ${theme.colors.success}25`,
                    color: theme.colors.success,
                    fontSize: '11px',
                    fontWeight: 500,
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                  }}
                  onMouseEnter={e => { e.currentTarget.style.background = `${theme.colors.success}25` }}
                  onMouseLeave={e => { e.currentTarget.style.background = `${theme.colors.success}15` }}
                  >
                    + {tag}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </ActionCard>

        {/* Import/Export */}
        <ActionCard icon={Upload} title="Import / Export" desc="Download optimized CSV or import updates to store" color={theme.colors.warning}>
          <div style={{ marginTop: 16, display: 'flex', gap: 12 }}>
            <button style={{
              flex: 1,
              padding: '14px',
              background: `linear-gradient(135deg, ${theme.colors.warning}, #ca8a04)`,
              border: 'none',
              borderRadius: '10px',
              color: 'white',
              fontSize: '14px',
              fontWeight: 600,
              cursor: 'pointer',
              fontFamily: theme.fonts.body,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 8,
              transition: 'all 0.2s',
            }}
            onMouseEnter={e => { e.currentTarget.style.transform = 'scale(1.02)' }}
            onMouseLeave={e => { e.currentTarget.style.transform = 'scale(1)' }}
            >
              <Download size={16} /> Export Optimized CSV
            </button>
            <button style={{
              flex: 1,
              padding: '14px',
              background: 'transparent',
              border: `1px solid ${theme.colors.warning}`,
              borderRadius: '10px',
              color: theme.colors.warning,
              fontSize: '14px',
              fontWeight: 600,
              cursor: 'pointer',
              fontFamily: theme.fonts.body,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 8,
              transition: 'all 0.2s',
            }}
            onMouseEnter={e => { e.currentTarget.style.background = `${theme.colors.warning}10` }}
            onMouseLeave={e => { e.currentTarget.style.background = 'transparent' }}
            >
              <Upload size={16} /> Import to Store
            </button>
          </div>
        </ActionCard>
      </div>
    </div>
  )
}
