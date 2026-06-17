import { useState } from 'react'
import { Search, Globe, FileText, RefreshCw, CheckCircle, AlertTriangle, Eye, ArrowUpRight } from 'lucide-react'
import { theme } from '../theme'

const products = [
  { id: 1, title: '高端智能手机壳防摔保护壳适用于iPhone 15 Pro Max', translated: 'Premium Anti-Drop Phone Case for iPhone 15 Pro Max', type: 'Phone Accessories', seoTitle: 'Premium iPhone 15 Pro Max Case | Shockproof | ShopZyla', seoDesc: 'Shop premium anti-drop phone case for iPhone 15 Pro Max. Military-grade protection, sleek design. Free shipping over $50.', status: 'pending' },
  { id: 2, title: '女士真皮手提包大容量通勤托特包', translated: 'Genuine Leather Women Handbag Large Capacity Commuter Tote', type: 'Handbags', seoTitle: 'Genuine Leather Tote Bag Women | Large Capacity | ShopZyla', seoDesc: 'Discover our genuine leather handbag for women. Spacious tote perfect for work and travel. Premium quality, elegant design.', status: 'pending' },
  { id: 3, title: '新款男士石英手表防水夜光运动手表', translated: 'New Men Quartz Watch Waterproof Luminous Sport Watch', type: 'Watches', seoTitle: 'Men Quartz Sport Watch Waterproof Luminous | ShopZyla', seoDesc: 'Stylish men quartz watch with waterproof and luminous features. Perfect for sports and daily wear. Premium quality.', status: 'approved' },
]

function ProductRow({ product, onApprove }) {
  return (
    <div style={{
      background: theme.colors.bg,
      border: `1px solid ${theme.colors.border}`,
      borderRadius: '12px',
      padding: '16px 20px',
      marginBottom: 10,
      transition: 'all 0.2s',
    }}
    onMouseEnter={e => { e.currentTarget.borderColor = theme.colors.primaryDark }}
    onMouseLeave={e => { e.currentTarget.style.borderColor = theme.colors.border }}
    >
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: 16 }}>
        <div style={{ flex: 1, minWidth: 0 }}>
          {/* Original */}
          <div style={{ fontSize: '11px', color: theme.colors.textMuted, marginBottom: 4, fontFamily: theme.fonts.body }}>
            Original (Chinese):
          </div>
          <div style={{ fontSize: '12px', color: theme.colors.textMuted, marginBottom: 12, fontStyle: 'italic', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            {product.title}
          </div>

          {/* Translated */}
          <div style={{ fontSize: '11px', color: theme.colors.success, marginBottom: 4, display: 'flex', alignItems: 'center', gap: 6 }}>
            <CheckCircle size={11} />
            Translated (English):
          </div>
          <div style={{ fontFamily: theme.fonts.heading, fontSize: '14px', fontWeight: 500, color: theme.colors.textBright, marginBottom: 10, letterSpacing: '0.02em' }}>
            {product.translated}
          </div>

          {/* SEO Details */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
            <div>
              <div style={{ fontSize: '10px', color: theme.colors.textMuted, marginBottom: 2 }}>Meta Title (60 chars)</div>
              <div style={{
                fontSize: '11px',
                color: product.seoTitle.length > 60 ? theme.colors.warning : theme.colors.text,
                padding: '6px 10px',
                background: `${theme.colors.primary}08`,
                borderRadius: '6px',
                border: `1px solid ${theme.colors.border}`,
              }}>
                {product.seoTitle}
                <span style={{ color: theme.colors.textMuted, marginLeft: 4 }}>({product.seoTitle.length})</span>
              </div>
            </div>
            <div>
              <div style={{ fontSize: '10px', color: theme.colors.textMuted, marginBottom: 2 }}>Meta Description (160 chars)</div>
              <div style={{
                fontSize: '11px',
                color: product.seoDesc.length > 160 ? theme.colors.warning : theme.colors.text,
                padding: '6px 10px',
                background: `${theme.colors.primary}08`,
                borderRadius: '6px',
                border: `1px solid ${theme.colors.border}`,
              }}>
                {product.seoDesc.substring(0, 80)}...
                <span style={{ color: theme.colors.textMuted, marginLeft: 4 }}>({product.seoDesc.length})</span>
              </div>
            </div>
          </div>
        </div>

        {/* Status */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8, flexShrink: 0 }}>
          <div style={{
            padding: '4px 10px',
            borderRadius: '12px',
            fontSize: '10px',
            fontWeight: 600,
            background: product.status === 'approved' ? `${theme.colors.success}15` : `${theme.colors.warning}15`,
            color: product.status === 'approved' ? theme.colors.success : theme.colors.warning,
            border: `1px solid ${product.status === 'approved' ? theme.colors.success + '30' : theme.colors.warning + '30'}`,
          }}>
            {product.status === 'approved' ? 'Approved' : 'Pending'}
          </div>
          <button style={{
            padding: '8px 16px',
            background: product.status === 'approved' ? 'transparent' : `linear-gradient(135deg, ${theme.colors.primary}, ${theme.colors.primaryDark})`,
            border: product.status === 'approved' ? `1px solid ${theme.colors.textMuted}` : 'none',
            borderRadius: '8px',
            color: product.status === 'approved' ? theme.colors.textMuted : 'white',
            fontSize: '11px',
            fontWeight: 600,
            cursor: 'pointer',
            fontFamily: theme.fonts.body,
            transition: 'all 0.2s',
            whiteSpace: 'nowrap',
          }}
          onMouseEnter={e => { if (product.status !== 'approved') { e.currentTarget.style.transform = 'scale(1.05)'; e.currentTarget.style.boxShadow = theme.shadows.glow } }}
          onMouseLeave={e => { if (product.status !== 'approved') { e.currentTarget.style.transform = 'scale(1)'; e.currentTarget.style.boxShadow = 'none' } }}
          >
            {product.status === 'approved' ? 'Edit' : 'Approve'}
          </button>
        </div>
      </div>
    </div>
  )
}

export default function SEOHelper() {
  const [filter, setFilter] = useState('all')

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
          SEO Helper
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
          Translate Chinese titles, generate SEO metadata — <span style={{ color: theme.colors.warning }}>728 Chinese titles pending</span>
        </div>
      </div>

      {/* Stats Bar */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
        gap: '14px',
        marginBottom: 24,
      }}>
        {[
          { label: 'Chinese Titles', value: '728', icon: Globe, color: theme.colors.error },
          { label: 'Translated', value: '22', icon: CheckCircle, color: theme.colors.success },
          { label: 'SEO Ready', value: '0', icon: Search, color: theme.colors.warning },
          { label: 'Meta Generated', value: '750', icon: FileText, color: theme.colors.primary },
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

      {/* Bulk Action */}
      <div style={{
        background: `linear-gradient(135deg, ${theme.colors.bgCard} 0%, ${theme.colors.bgLight} 100%)`,
        border: `1px solid ${theme.colors.border}`,
        borderRadius: '16px',
        padding: '20px 24px',
        marginBottom: 24,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
      }}>
        <div>
          <div style={{ fontFamily: theme.fonts.heading, fontSize: '14px', fontWeight: 500, color: theme.colors.textBright, marginBottom: 4 }}>
            Bulk Translate & SEO Generate
          </div>
          <div style={{ fontSize: '11px', color: theme.colors.textMuted }}>
            Auto-translate all Chinese titles and generate meta tags for 750 products
          </div>
        </div>
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
          display: 'flex',
          alignItems: 'center',
          gap: 8,
          boxShadow: theme.shadows.glow,
          transition: 'all 0.2s',
        }}
        onMouseEnter={e => { e.currentTarget.style.transform = 'scale(1.03)'; e.currentTarget.style.boxShadow = theme.shadows.glowStrong }}
        onMouseLeave={e => { e.currentTarget.style.transform = 'scale(1)'; e.currentTarget.style.boxShadow = theme.shadows.glow }}
        >
          <RefreshCw size={16} /> Run Bulk Translate
        </button>
      </div>

      {/* Product List */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
        <div style={{ fontFamily: theme.fonts.heading, fontSize: '14px', fontWeight: 500, color: theme.colors.textBright, letterSpacing: '0.03em' }}>
          Product Preview
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          {['all', 'pending', 'approved'].map(f => (
            <button key={f} onClick={() => setFilter(f)} style={{
              padding: '6px 14px',
              borderRadius: '20px',
              border: `1px solid ${filter === f ? theme.colors.primary : theme.colors.border}`,
              background: filter === f ? `${theme.colors.primary}15` : 'transparent',
              color: filter === f ? theme.colors.primary : theme.colors.textMuted,
              fontSize: '11px',
              fontWeight: 500,
              cursor: 'pointer',
              fontFamily: theme.fonts.body,
              textTransform: 'capitalize',
              transition: 'all 0.2s',
            }}>
              {f === 'all' ? 'All' : f}
            </button>
          ))}
        </div>
      </div>

      <div>
        {products.map(p => (
          <ProductRow key={p.id} product={p} />
        ))}
      </div>

      {/* Load More Placeholder */}
      <div style={{
        textAlign: 'center',
        padding: '24px',
        color: theme.colors.textMuted,
        fontSize: '12px',
        borderTop: `1px solid ${theme.colors.border}`,
        marginTop: 8,
      }}>
        Showing 3 of 750 products — <span style={{ color: theme.colors.primary, cursor: 'pointer' }}>Load more</span>
      </div>
    </div>
  )
}
