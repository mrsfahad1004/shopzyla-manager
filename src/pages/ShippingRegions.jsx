import { useState } from 'react'
import { Globe, MapPin, Truck, DollarSign, Package, CheckCircle, AlertTriangle, Copy, ExternalLink, Edit3, Save, Plus, X, Settings, ArrowRight, TrendingDown, Zap } from 'lucide-react'
import { theme } from '../theme'

// ============================================
// SHIPPING REGIONS CONFIGURATION
// ============================================
const defaultRegions = [
  {
    id: 'pk-south-asia',
    name: '🇵🇰 South Asia',
    countries: ['Pakistan', 'India', 'Bangladesh', 'Sri Lanka', 'Nepal', 'Bhutan', 'Maldives'],
    type: 'standard',
    baseRate: 3.00,
    perKgRate: 2.00,
    estDays: '3-8',
    freeThreshold: 35,
    providers: ['TCS', 'Leopards', 'BlueEx', 'India Post', 'DTDC'],
    notes: 'Local fulfillment available for Pakistan. India via DTDC.',
  },
  {
    id: 'usa-north-america',
    name: '🇺🇸 USA & North America',
    countries: ['United States', 'Canada', 'Mexico'],
    type: 'standard',
    baseRate: 4.00,
    perKgRate: 2.50,
    estDays: '7-14',
    freeThreshold: 40,
    providers: ['USPS', 'FedEx', 'UPS', 'DHL', 'YunExpress'],
    notes: 'US local fulfillment available via FedEx/UPS. Canada via Canada Post.',
  },
  {
    id: 'uk-europe',
    name: '🇬🇧 UK & Europe',
    countries: ['United Kingdom', 'Germany', 'France', 'Italy', 'Spain', 'Netherlands', 'Belgium', 'Switzerland', 'Sweden', 'Norway', 'Denmark', 'Finland', 'Austria', 'Ireland', 'Portugal', 'Greece', 'Poland', 'Czech Republic', 'Hungary', 'Romania'],
    type: 'standard',
    baseRate: 4.50,
    perKgRate: 2.80,
    estDays: '7-14',
    freeThreshold: 35,
    providers: ['Royal Mail', 'DHL', 'Deutsche Post', 'La Poste', 'YunExpress'],
    notes: 'UK via Royal Mail. Europe via DHL/Deutsche Post. Very reliable routes.',
  },
  {
    id: 'uae-middle-east',
    name: '🇦🇪 UAE & Middle East',
    countries: ['United Arab Emirates', 'Saudi Arabia', 'Qatar', 'Kuwait', 'Bahrain', 'Oman', 'Jordan', 'Lebanon', 'Iraq', 'Yemen'],
    type: 'standard',
    baseRate: 6.00,
    perKgRate: 4.00,
    estDays: '7-14',
    freeThreshold: 45,
    providers: ['Aramex', 'Emirates Post', 'Saudi Post', 'DHL'],
    notes: 'Aramex best for Middle East. DHL for premium. Saudi Post for economy.',
  },
  {
    id: 'asia-east',
    name: '🌏 East Asia & Pacific',
    countries: ['China', 'Japan', 'South Korea', 'Taiwan', 'Hong Kong', 'Singapore', 'Malaysia', 'Thailand', 'Vietnam', 'Indonesia', 'Philippines', 'Australia', 'New Zealand'],
    type: 'standard',
    baseRate: 5.00,
    perKgRate: 3.00,
    estDays: '7-14',
    freeThreshold: 40,
    providers: ['China Post', 'YunExpress', 'Japan Post', 'SingPost', 'Australia Post'],
    notes: 'China origin — cheapest shipping. Japan/Australia via local post.',
  },
  {
    id: 'africa',
    name: '🌍 Africa',
    countries: ['South Africa', 'Nigeria', 'Kenya', 'Egypt', 'Morocco', 'Algeria', 'Ghana', 'Tanzania', 'Ethiopia', 'Uganda'],
    type: 'expensive',
    baseRate: 12.00,
    perKgRate: 8.00,
    estDays: '14-25',
    freeThreshold: 70,
    providers: ['DHL', 'FedEx', 'China Post', 'Aramex'],
    notes: 'Expensive destination. Use subsidized shipping. Recommend $8-12 customer contribution.',
  },
  {
    id: 'south-america',
    name: '🌎 South America',
    countries: ['Brazil', 'Argentina', 'Colombia', 'Chile', 'Peru', 'Ecuador', 'Venezuela', 'Uruguay', 'Paraguay', 'Bolivia'],
    type: 'expensive',
    baseRate: 14.00,
    perKgRate: 9.00,
    estDays: '15-28',
    freeThreshold: 75,
    providers: ['DHL', 'FedEx', 'China Post', 'Correios'],
    notes: 'Most expensive region. Brazil $15-25 shipping. Must use subsidized model.',
  },
  {
    id: 'other-remote',
    name: '🏝️ Remote & Other Islands',
    countries: ['Fiji', 'Papua New Guinea', 'Samoa', 'Solomon Islands', 'Vanuatu', 'Mauritius', 'Seychelles', 'Maldives (if not in SA)', 'Bahamas', 'Jamaica', 'Trinidad', 'Barbados'],
    type: 'expensive',
    baseRate: 18.00,
    perKgRate: 12.00,
    estDays: '20-35',
    freeThreshold: 100,
    providers: ['DHL', 'FedEx', 'China Post'],
    notes: 'Very expensive. Use DHL/FedEx only. Free shipping only above $100.',
  },
]

function RegionCard({ region, onEdit }) {
  const [copied, setCopied] = useState(false)
  const isExpensive = region.type === 'expensive'
  const color = isExpensive ? theme.colors.error : region.freeThreshold <= 40 ? theme.colors.success : theme.colors.warning

  const copyConfig = () => {
    const text = `Region: ${region.name}\nCountries: ${region.countries.join(', ')}\nBase Rate: $${region.baseRate}\nPer Kg: $${region.perKgRate}\nFree Threshold: $${region.freeThreshold}\nProviders: ${region.providers.join(', ')}`
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    })
  }

  return (
    <div style={{
      background: theme.colors.bgCard,
      border: `1px solid ${theme.colors.border}`,
      borderRadius: '16px',
      overflow: 'hidden',
      transition: 'all 0.3s',
      position: 'relative',
    }}
    onMouseEnter={e => { e.currentTarget.style.borderColor = color; e.currentTarget.style.transform = 'translateY(-2px)' }}
    onMouseLeave={e => { e.currentTarget.style.borderColor = theme.colors.border; e.currentTarget.style.transform = 'translateY(0)' }}
    >
      {/* Type Badge */}
      <div style={{
        position: 'absolute', top: 12, right: 12,
        padding: '3px 10px', borderRadius: '6px',
        fontSize: '9px', fontWeight: 700,
        background: isExpensive ? `${theme.colors.error}15` : `${theme.colors.success}15`,
        color: isExpensive ? theme.colors.error : theme.colors.success,
        border: `1px solid ${isExpensive ? theme.colors.error + '25' : theme.colors.success + '25'}`,
      }}>
        {isExpensive ? '🔴 Premium' : '✅ Standard'}
      </div>

      <div style={{ padding: '20px' }}>
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
          <div style={{
            width: 40, height: 40, borderRadius: '10px',
            background: `${color}15`, border: `1px solid ${color}25`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '20px',
          }}>
            {region.name.split(' ')[0]}
          </div>
          <div>
            <div style={{ fontFamily: theme.fonts.heading, fontSize: '16px', fontWeight: 500, color: theme.colors.textBright }}>
              {region.name}
            </div>
            <div style={{ fontSize: '10px', color: theme.colors.textMuted }}>
              {region.countries.length} countries · {region.estDays} days delivery
            </div>
          </div>
        </div>

        {/* Countries */}
        <div style={{
          padding: '8px 10px',
          background: theme.colors.bg,
          borderRadius: '8px',
          marginBottom: 10,
          fontSize: '10px',
          color: theme.colors.text,
          lineHeight: 1.6,
        }}>
          <div style={{ fontSize: '8px', color: theme.colors.textMuted, letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 4, fontWeight: 600 }}>
            Countries
          </div>
          {region.countries.join(' · ')}
        </div>

        {/* Rates Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '8px',
          marginBottom: 10,
        }}>
          <div style={{
            padding: '8px 10px',
            background: `${theme.colors.primary}08`,
            borderRadius: '6px',
            border: `1px solid ${theme.colors.primary}15`,
          }}>
            <div style={{ fontSize: '8px', color: theme.colors.textMuted, marginBottom: 2, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Base Rate</div>
            <div style={{ fontFamily: theme.fonts.heading, fontSize: '18px', fontWeight: 700, color: theme.colors.primary }}>
              ${region.baseRate.toFixed(2)}
            </div>
            <div style={{ fontSize: '8px', color: theme.colors.textMuted }}>+ ${region.perKgRate.toFixed(2)}/kg</div>
          </div>
          <div style={{
            padding: '8px 10px',
            background: `${color}08`,
            borderRadius: '6px',
            border: `1px solid ${color}15`,
          }}>
            <div style={{ fontSize: '8px', color: theme.colors.textMuted, marginBottom: 2, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Free Shipping</div>
            <div style={{ fontFamily: theme.fonts.heading, fontSize: '18px', fontWeight: 700, color: color }}>
              ${region.freeThreshold}+
            </div>
            <div style={{ fontSize: '8px', color: theme.colors.textMuted }}>orders above get free</div>
          </div>
        </div>

        {/* Example Price */}
        <div style={{
          padding: '8px 10px',
          background: theme.colors.bg,
          borderRadius: '6px',
          marginBottom: 10,
          fontSize: '10px',
          color: theme.colors.textMuted,
        }}>
          📦 Example: 0.5kg product → <strong style={{color: theme.colors.text}}>${(region.baseRate + region.perKgRate * 0.5).toFixed(2)}</strong>
          {' · '}1kg product → <strong style={{color: theme.colors.text}}>${(region.baseRate + region.perKgRate * 1).toFixed(2)}</strong>
        </div>

        {/* Providers */}
        <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap', marginBottom: 10 }}>
          {region.providers.map((p, i) => (
            <span key={i} style={{
              padding: '2px 8px', borderRadius: '4px', fontSize: '8px',
              background: `${theme.colors.primary}08`, border: `1px solid ${theme.colors.primary}15`,
              color: theme.colors.textMuted,
            }}>
              {p}
            </span>
          ))}
        </div>

        {/* Notes */}
        <div style={{
          padding: '6px 10px',
          background: `${theme.colors.warning}08`,
          borderRadius: '6px',
          border: `1px solid ${theme.colors.warning}15`,
          fontSize: '9px',
          color: theme.colors.warning,
          marginBottom: 12,
        }}>
          💡 {region.notes}
        </div>

        {/* Actions */}
        <div style={{ display: 'flex', gap: 8 }}>
          <button onClick={() => onEdit(region)} style={{
            flex: 1, padding: '7px',
            background: theme.colors.primary, border: 'none', borderRadius: '8px',
            color: 'white', fontSize: '10px', fontWeight: 600, cursor: 'pointer',
            fontFamily: theme.fonts.body, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 4,
          }}>
            <Settings size={12} /> Configure
          </button>
          <button onClick={copyConfig} style={{
            padding: '7px 14px',
            background: `${theme.colors.primary}10`, border: `1px solid ${theme.colors.primary}20`,
            borderRadius: '8px', color: theme.colors.primary, fontSize: '10px', fontWeight: 600, cursor: 'pointer',
            fontFamily: theme.fonts.body,
          }}>
            {copied ? '✓ Copied' : <><Copy size={12} style={{verticalAlign:'middle'}} /> Copy</>}
          </button>
        </div>
      </div>
    </div>
  )
}

export default function ShippingRegions() {
  const [search, setSearch] = useState('')
  const [filterType, setFilterType] = useState('all')

  const filteredRegions = defaultRegions.filter(r => {
    if (filterType !== 'all' && r.type !== filterType) return false
    if (search && !r.name.toLowerCase().includes(search.toLowerCase()) && 
        !r.countries.some(c => c.toLowerCase().includes(search.toLowerCase()))) return false
    return true
  })

  const handleEdit = (region) => {
    alert(`✏️ Edit mode for ${region.name}\n\nYou can customize: Base rate, Per kg rate, Free threshold, Countries, and Providers.\n\nThis will be available in the next update!`)
  }

  const standardRegions = filteredRegions.filter(r => r.type === 'standard')
  const expensiveRegions = filteredRegions.filter(r => r.type === 'expensive')

  // Calculate totals
  const totalCountries = defaultRegions.reduce((s, r) => s + r.countries.length, 0)
  const totalCost0_5kg = defaultRegions.reduce((s, r) => s + (r.baseRate + r.perKgRate * 0.5), 0) / defaultRegions.length

  return (
    <div>
      {/* Header */}
      <div style={{ marginBottom: 24 }}>
        <div style={{
          fontFamily: theme.fonts.heading, fontSize: '32px', fontWeight: 600,
          color: theme.colors.textBright, letterSpacing: '0.02em',
          textTransform: 'uppercase', marginBottom: 4,
          display: 'flex', alignItems: 'center', gap: 10,
        }}>
          🌍 Shipping Regions & Rates
          <span style={{
            fontSize: '10px', fontWeight: 400, color: theme.colors.primary,
            background: `${theme.colors.primary}10`, padding: '2px 10px', borderRadius: '8px',
            border: `1px solid ${theme.colors.primary}20`,
          }}>
            Setup Guide
          </span>
        </div>
        <div style={{ width: '60px', height: '4px', background: `linear-gradient(90deg, ${theme.colors.primary}, ${theme.colors.primaryLight})`, borderRadius: '2px', marginBottom: 8, boxShadow: theme.shadows.glow }} />
        <div style={{ fontSize: '13px', color: theme.colors.textMuted }}>
          Regional shipping rates with auto free threshold — UK, UAE, USA, Asia, KSA, South Asia & more
        </div>
      </div>

      {/* Quick Stats */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))',
        gap: '10px', marginBottom: 20,
      }}>
        {[
          { label: 'Regions', value: defaultRegions.length, icon: Globe, color: theme.colors.primary },
          { label: 'Countries', value: totalCountries, icon: MapPin, color: theme.colors.success },
          { label: 'Avg 0.5kg Rate', value: `$${totalCost0_5kg.toFixed(2)}`, icon: DollarSign, color: theme.colors.primaryLight },
          { label: 'Std Free Threshold', value: `$${Math.round(defaultRegions.filter(r => r.type === 'standard').reduce((s, r) => s + r.freeThreshold, 0) / defaultRegions.filter(r => r.type === 'standard').length)}`, icon: Truck, color: theme.colors.warning },
        ].map((s, i) => (
          <div key={i} style={{ background: theme.colors.bgCard, border: `1px solid ${theme.colors.border}`, borderRadius: '10px', padding: '10px 12px', display: 'flex', alignItems: 'center', gap: 8 }}>
            <div style={{ width: 28, height: 28, borderRadius: '8px', background: `${s.color}15`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <s.icon size={12} color={s.color} />
            </div>
            <div>
              <div style={{ fontSize: '8px', color: theme.colors.textMuted, letterSpacing: '0.05em', textTransform: 'uppercase' }}>{s.label}</div>
              <div style={{ fontFamily: theme.fonts.heading, fontSize: '15px', fontWeight: 600, color: theme.colors.textBright }}>{s.value}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Controls */}
      <div style={{
        background: theme.colors.bgCard, border: `1px solid ${theme.colors.border}`,
        borderRadius: '12px', padding: '14px 18px', marginBottom: 20,
        display: 'flex', gap: 12, flexWrap: 'wrap', alignItems: 'center',
      }}>
        <input type="text" value={search} onChange={e => setSearch(e.target.value)}
          placeholder="Search region or country..."
          style={{ flex: 1, minWidth: 150, padding: '8px 12px', background: theme.colors.bg, border: `1px solid ${theme.colors.border}`, borderRadius: '8px', color: theme.colors.textBright, fontSize: '12px', fontFamily: theme.fonts.body, outline: 'none' }} />
        <div style={{ display: 'flex', gap: 4 }}>
          {[
            { key: 'all', label: 'All' },
            { key: 'standard', label: '✅ Standard' },
            { key: 'expensive', label: '🔴 Premium' },
          ].map(f => (
            <button key={f.key} onClick={() => setFilterType(f.key)} style={{
              padding: '5px 12px', borderRadius: '6px',
              border: `1px solid ${filterType === f.key ? theme.colors.primary : theme.colors.border}`,
              background: filterType === f.key ? `${theme.colors.primary}15` : 'transparent',
              color: filterType === f.key ? theme.colors.primary : theme.colors.textMuted,
              fontSize: '10px', fontWeight: 600, cursor: 'pointer', fontFamily: theme.fonts.body,
            }}>
              {f.label}
            </button>
          ))}
        </div>
        <button style={{
          padding: '8px 16px', background: `linear-gradient(135deg, ${theme.colors.primary}, ${theme.colors.primaryDark})`,
          border: 'none', borderRadius: '8px', color: 'white', fontSize: '11px', fontWeight: 600, cursor: 'pointer',
          fontFamily: theme.fonts.body, display: 'flex', alignItems: 'center', gap: 6, whiteSpace: 'nowrap',
        }}>
          <Plus size={14} /> Add Region
        </button>
      </div>

      {/* Standard Regions */}
      {standardRegions.length > 0 && (
        <div style={{ marginBottom: 24 }}>
          <div style={{
            fontFamily: theme.fonts.heading, fontSize: '13px', fontWeight: 500,
            color: theme.colors.success, marginBottom: 10, display: 'flex', alignItems: 'center', gap: 8,
          }}>
            ✅ Standard Shipping Regions ({standardRegions.length})
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '14px' }}>
            {standardRegions.map(r => <RegionCard key={r.id} region={r} onEdit={handleEdit} />)}
          </div>
        </div>
      )}

      {/* Expensive Regions */}
      {expensiveRegions.length > 0 && (
        <div style={{ marginBottom: 24 }}>
          <div style={{
            fontFamily: theme.fonts.heading, fontSize: '13px', fontWeight: 500,
            color: theme.colors.error, marginBottom: 10, display: 'flex', alignItems: 'center', gap: 8,
          }}>
            🔴 Premium / Expensive Regions ({expensiveRegions.length})
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '14px' }}>
            {expensiveRegions.map(r => <RegionCard key={r.id} region={r} onEdit={handleEdit} />)}
          </div>
        </div>
      )}

      {/* Setup Guide for Shopify Admin */}
      <div style={{
        background: `linear-gradient(135deg, ${theme.colors.bgCard}, ${theme.colors.bgLight})`,
        border: `1px solid ${theme.colors.border}`,
        borderRadius: '16px', padding: '24px',
      }}>
        <div style={{ fontFamily: theme.fonts.heading, fontSize: '15px', fontWeight: 500, color: theme.colors.textBright, marginBottom: 14, display: 'flex', alignItems: 'center', gap: 8 }}>
          <Settings size={16} color={theme.colors.primaryLight} />
          How to Set Up in Shopify Admin
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8, fontSize: '11px', color: theme.colors.text, lineHeight: 1.6 }}>
          {[
            '1. Go to Shopify Admin → Settings → Shipping and delivery',
            '2. Click "Manage rates" for each shipping zone',
            '3. Create new zones: UK, Europe, USA, Middle East, Asia, South Asia, Africa, South America',
            '4. Add the countries listed in each region above to their respective zone',
            '5. Set "Price-based rate" — Free shipping on orders above the threshold shown',
            '6. Set "Standard rate" — Use the base rate + per kg rate shown above',
            '7. For expensive regions (Africa, S.America, Remote): Set higher free threshold + subsidize shipping',
          ].map((step, i) => (
            <div key={i} style={{
              padding: '8px 12px', background: theme.colors.bg, borderRadius: '8px',
              border: `1px solid ${theme.colors.border}`,
            }}>
              {step}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
