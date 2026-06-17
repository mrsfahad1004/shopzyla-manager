import { useState, useEffect } from 'react'
import { Globe, MapPin, Truck, DollarSign, TrendingDown, Shield, Zap, CheckCircle, AlertTriangle, Search, Settings, Package, Sparkles, RefreshCw } from 'lucide-react'
import { theme } from '../theme'

const countriesData = {
  'Pakistan': { flag: '🇵🇰', shippingCost: [2, 5], freeThreshold: 25, localFulfillment: true, localProviders: 'TCS, Leopards, BlueEx' },
  'India': { flag: '🇮🇳', shippingCost: [5, 12], freeThreshold: 40, localFulfillment: false, localProviders: '' },
  'Bangladesh': { flag: '🇧🇩', shippingCost: [6, 14], freeThreshold: 45, localFulfillment: false, localProviders: '' },
  'Sri Lanka': { flag: '🇱🇰', shippingCost: [7, 15], freeThreshold: 50, localFulfillment: false, localProviders: '' },
  'UAE': { flag: '🇦🇪', shippingCost: [5, 10], freeThreshold: 35, localFulfillment: false, localProviders: 'Aramex' },
  'Saudi Arabia': { flag: '🇸🇦', shippingCost: [6, 12], freeThreshold: 40, localFulfillment: false, localProviders: '' },
  'Turkey': { flag: '🇹🇷', shippingCost: [7, 14], freeThreshold: 40, localFulfillment: false, localProviders: '' },
  'United States': { flag: '🇺🇸', shippingCost: [4, 8], freeThreshold: 35, localFulfillment: true, localProviders: 'USPS, FedEx, UPS' },
  'Canada': { flag: '🇨🇦', shippingCost: [5, 10], freeThreshold: 40, localFulfillment: true, localProviders: 'Canada Post' },
  'United Kingdom': { flag: '🇬🇧', shippingCost: [4, 8], freeThreshold: 30, localFulfillment: true, localProviders: 'Royal Mail' },
  'Germany': { flag: '🇩🇪', shippingCost: [4, 9], freeThreshold: 30, localFulfillment: true, localProviders: 'DHL' },
  'France': { flag: '🇫🇷', shippingCost: [4, 9], freeThreshold: 35, localFulfillment: false, localProviders: '' },
  'Italy': { flag: '🇮🇹', shippingCost: [5, 10], freeThreshold: 35, localFulfillment: false, localProviders: '' },
  'Spain': { flag: '🇪🇸', shippingCost: [5, 10], freeThreshold: 35, localFulfillment: false, localProviders: '' },
  'Netherlands': { flag: '🇳🇱', shippingCost: [4, 9], freeThreshold: 30, localFulfillment: false, localProviders: '' },
  'Japan': { flag: '🇯🇵', shippingCost: [5, 10], freeThreshold: 35, localFulfillment: true, localProviders: 'Japan Post' },
  'South Korea': { flag: '🇰🇷', shippingCost: [5, 10], freeThreshold: 35, localFulfillment: false, localProviders: '' },
  'Australia': { flag: '🇦🇺', shippingCost: [6, 12], freeThreshold: 40, localFulfillment: true, localProviders: 'Australia Post' },
  'Singapore': { flag: '🇸🇬', shippingCost: [4, 9], freeThreshold: 30, localFulfillment: false, localProviders: '' },
  'Malaysia': { flag: '🇲🇾', shippingCost: [5, 11], freeThreshold: 35, localFulfillment: false, localProviders: '' },
  'Brazil': { flag: '🇧🇷', shippingCost: [12, 25], freeThreshold: 70, localFulfillment: false, localProviders: '' },
  'Nigeria': { flag: '🇳🇬', shippingCost: [12, 25], freeThreshold: 70, localFulfillment: false, localProviders: '' },
  'South Africa': { flag: '🇿🇦', shippingCost: [10, 20], freeThreshold: 60, localFulfillment: false, localProviders: '' },
  'Egypt': { flag: '🇪🇬', shippingCost: [8, 18], freeThreshold: 55, localFulfillment: false, localProviders: '' },
  'Mexico': { flag: '🇲🇽', shippingCost: [8, 16], freeThreshold: 50, localFulfillment: false, localProviders: '' },
  'Argentina': { flag: '🇦🇷', shippingCost: [10, 22], freeThreshold: 65, localFulfillment: false, localProviders: '' },
}

const regions = {
  'South Asia': ['Pakistan', 'India', 'Bangladesh', 'Sri Lanka'],
  'Middle East': ['UAE', 'Saudi Arabia', 'Turkey'],
  'North America': ['United States', 'Canada', 'Mexico'],
  'Europe': ['United Kingdom', 'Germany', 'France', 'Italy', 'Spain', 'Netherlands'],
  'East Asia': ['Japan', 'South Korea', 'Australia', 'Singapore', 'Malaysia'],
  'South America': ['Brazil', 'Argentina'],
  'Africa': ['Nigeria', 'South Africa', 'Egypt'],
}

export default function SmartShipping() {
  const [search, setSearch] = useState('')
  const [selectedRegion, setSelectedRegion] = useState('all')
  const [thresholds, setThresholds] = useState({})
  const [storeInfo, setStoreInfo] = useState(null)

  useEffect(() => {
    fetch('/api/store').then(r => r.json()).then(d => setStoreInfo(d)).catch(() => {})
  }, [])

  const handleThresholdChange = (countryCode, value) => {
    setThresholds(prev => ({ ...prev, [countryCode]: value }))
  }

  const allCountries = Object.entries(countriesData).map(([name, data]) => ({
    name,
    ...data,
    freeThreshold: thresholds[name] !== undefined ? thresholds[name] : data.freeThreshold,
  }))

  const filtered = allCountries.filter(c => {
    if (selectedRegion !== 'all' && !regions[selectedRegion]?.includes(c.name)) return false
    if (search && !c.name.toLowerCase().includes(search.toLowerCase())) return false
    return true
  })

  const getLevel = (cost) => {
    const avg = (cost[0] + cost[1]) / 2
    return avg > 12 ? 'high' : avg > 7 ? 'medium' : 'low'
  }

  const levelConfig = {
    high: { color: theme.colors.error, label: 'Expensive', icon: '🔴' },
    medium: { color: theme.colors.warning, label: 'Moderate', icon: '⚠️' },
    low: { color: theme.colors.success, label: 'Cheap', icon: '✅' },
  }

  return (
    <div>
      <div style={{
        fontFamily: theme.fonts.heading, fontSize: '32px', fontWeight: 600,
        color: theme.colors.textBright, letterSpacing: '0.02em',
        textTransform: 'uppercase', marginBottom: 4,
        display: 'flex', alignItems: 'center', gap: 12,
      }}>
        🌍 Smart Shipping Rules
      </div>
      <div style={{
        width: '60px', height: '4px',
        background: `linear-gradient(90deg, ${theme.colors.primary}, ${theme.colors.primaryLight})`,
        borderRadius: '2px', marginBottom: 12, boxShadow: theme.shadows.glow,
      }} />
      <div style={{ fontSize: '13px', color: theme.colors.textMuted, marginBottom: 20 }}>
        Per-country free shipping thresholds + auto-detect customer region
      </div>

      {/* Controls */}
      <div style={{
        background: theme.colors.bgCard, border: `1px solid ${theme.colors.border}`,
        borderRadius: '14px', padding: '16px 20px', marginBottom: 20,
      }}>
        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', alignItems: 'center' }}>
          <div style={{ flex: 1, minWidth: 180, position: 'relative' }}>
            <Search size={14} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: theme.colors.textMuted }} />
            <input type="text" value={search} onChange={e => setSearch(e.target.value)}
              placeholder="Search country..." onFocus={e => e.target.style.borderColor = theme.colors.primary}
              onBlur={e => e.target.style.borderColor = theme.colors.border}
              style={{ width: '100%', padding: '8px 12px 8px 36px', background: theme.colors.bg, border: `1px solid ${theme.colors.border}`, borderRadius: '8px', color: theme.colors.textBright, fontSize: '12px', fontFamily: theme.fonts.body, outline: 'none' }} />
          </div>
          <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
            {['all', ...Object.keys(regions)].map(region => (
              <button key={region} onClick={() => setSelectedRegion(region)} style={{
                padding: '5px 12px', borderRadius: '6px', border: `1px solid ${selectedRegion === region ? theme.colors.primary : theme.colors.border}`,
                background: selectedRegion === region ? `${theme.colors.primary}15` : 'transparent',
                color: selectedRegion === region ? theme.colors.primary : theme.colors.textMuted,
                fontSize: '9px', fontWeight: 600, cursor: 'pointer', fontFamily: theme.fonts.body,
                textTransform: 'capitalize', whiteSpace: 'nowrap',
              }}>
                {region === 'all' ? 'All' : region}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Country Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '14px' }}>
        {filtered.map(country => {
          const level = getLevel(country.shippingCost)
          const cfg = levelConfig[level]
          const avgCost = (country.shippingCost[0] + country.shippingCost[1]) / 2

          return (
            <div key={country.name} style={{
              background: theme.colors.bgCard,
              border: `1px solid ${theme.colors.border}`,
              borderRadius: '14px',
              overflow: 'hidden',
              transition: 'box-shadow 0.2s',
            }}>
              <div style={{ padding: '16px 18px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 10 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span style={{ fontSize: '24px', lineHeight: 1 }}>{country.flag}</span>
                    <div>
                      <div style={{ fontFamily: theme.fonts.heading, fontSize: '14px', fontWeight: 500, color: theme.colors.textBright }}>
                        {country.name}
                      </div>
                    </div>
                  </div>
                  <div style={{
                    padding: '3px 10px', borderRadius: '8px', fontSize: '10px', fontWeight: 700,
                    background: `${cfg.color}15`, color: cfg.color,
                    border: `1px solid ${cfg.color}25`,
                  }}>
                    {cfg.icon} {cfg.label}
                  </div>
                </div>

                <div style={{ padding: '10px 12px', background: theme.colors.bg, borderRadius: '8px', marginBottom: 10 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '10px', color: theme.colors.textMuted, marginBottom: 4 }}>
                    <span>Shipping Cost</span>
                    <span>${country.shippingCost[0]} — ${country.shippingCost[1]}</span>
                  </div>
                  <div style={{ height: 4, background: theme.colors.border, borderRadius: 2, overflow: 'hidden' }}>
                    <div style={{
                      width: `${(avgCost / 25) * 100}%`,
                      height: '100%',
                      background: `linear-gradient(90deg, ${theme.colors.success}, ${theme.colors.warning}, ${theme.colors.error})`,
                      borderRadius: 2,
                    }} />
                  </div>
                </div>

                <div style={{ padding: '8px 10px', background: `${theme.colors.primary}08`, borderRadius: '8px', border: `1px solid ${theme.colors.primary}15`, marginBottom: 10 }}>
                  <div style={{ fontSize: '9px', color: theme.colors.textMuted, marginBottom: 4, letterSpacing: '0.05em', textTransform: 'uppercase' }}>
                    Free Shipping Threshold
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <input type="range" min={10} max={100} step={5}
                      value={country.freeThreshold}
                      onChange={e => handleThresholdChange(country.name, parseInt(e.target.value))}
                      style={{ flex: 1, height: 6, accentColor: theme.colors.primary }} />
                    <span style={{ fontFamily: theme.fonts.heading, fontSize: '18px', fontWeight: 700, color: theme.colors.primary, minWidth: 45, textAlign: 'right' }}>
                      ${country.freeThreshold}
                    </span>
                  </div>
                  <div style={{ fontSize: '9px', color: theme.colors.textMuted, marginTop: 4 }}>
                    Orders above ${country.freeThreshold} get FREE shipping
                  </div>
                </div>

                {country.localFulfillment && (
                  <div style={{ padding: '6px 10px', background: `${theme.colors.success}08`, borderRadius: '6px', border: `1px solid ${theme.colors.success}15`, fontSize: '10px', color: theme.colors.success, marginBottom: 8, display: 'flex', alignItems: 'center', gap: 6 }}>
                    <CheckCircle size={12} />
                    Local fulfillment: {country.localProviders}
                  </div>
                )}

                {!country.localFulfillment && (
                  <div style={{ padding: '6px 10px', background: `${cfg.color}08`, borderRadius: '6px', border: `1px solid ${cfg.color}15`, fontSize: '10px', color: cfg.color, marginBottom: 8, display: 'flex', alignItems: 'center', gap: 6 }}>
                    <AlertTriangle size={12} />
                    Ships from China
                  </div>
                )}

                <div style={{ padding: '8px 10px', background: theme.colors.bg, borderRadius: '6px', fontSize: '10px', color: theme.colors.text, lineHeight: 1.5 }}>
                  {avgCost > 10
                    ? `💡 Strategy: Subsidized shipping (customer pays $5-8). Free threshold $${country.freeThreshold}+.`
                    : avgCost > 5
                    ? `💡 Strategy: Free shipping above $${country.freeThreshold}. Standard shipping $3-7 below.`
                    : `💡 Strategy: Free shipping above $${country.freeThreshold}. Customer pays $2-4 below. Low cost advantage!`}
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {filtered.length === 0 && (
        <div style={{ textAlign: 'center', padding: '60px', color: theme.colors.textMuted }}>
          <Globe size={48} style={{ marginBottom: 12, opacity: 0.3 }} />
          <div style={{ fontSize: '14px' }}>No countries match your search</div>
        </div>
      )}

      {/* ===== APPLY TO STORE SECTION ===== */}
      <div style={{
        marginTop: 32,
        background: `linear-gradient(135deg, ${theme.colors.bgCard}, ${theme.colors.bgLight})`,
        border: `1px solid ${theme.colors.border}`,
        borderRadius: '16px', padding: '28px',
      }}>
        <div style={{
          fontFamily: theme.fonts.heading, fontSize: '18px', fontWeight: 600,
          color: theme.colors.textBright, marginBottom: 8,
          display: 'flex', alignItems: 'center', gap: 10,
        }}>
          ⚡ Apply These Rules to Your Store
        </div>
        <div style={{ fontSize: '12px', color: theme.colors.textMuted, marginBottom: 20, lineHeight: 1.6 }}>
          Customer ko checkout par shipping charges dikhe iske liye Shopify Admin mein shipping zones manually set karne honge.
          Neeche exact settings hain jo aap Shopify Admin mein daal sakti hain.
        </div>

        {/* Three Regions */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px', marginBottom: 20 }}>
          <div style={{ background: theme.colors.bg, borderRadius: '12px', padding: '18px', border: `1px solid ${theme.colors.success}25` }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
              <div style={{ width: 32, height: 32, borderRadius: '50%', background: `${theme.colors.success}20`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <span>✅</span>
              </div>
              <div style={{ fontFamily: theme.fonts.heading, fontSize: '14px', fontWeight: 600, color: theme.colors.success }}>
                Cheap Shipping Zone
              </div>
            </div>
            <div style={{ fontSize: '10px', color: theme.colors.textMuted, marginBottom: 8 }}>Countries: Pakistan, USA, UK, Germany, Singapore, UAE</div>
            <div style={{ fontSize: '10px', color: theme.colors.text, marginBottom: 4 }}>• Orders under $35 → $3-5 shipping</div>
            <div style={{ fontSize: '10px', color: theme.colors.text, marginBottom: 4 }}>• Orders above $35 → FREE shipping</div>
            <div style={{ fontSize: '10px', color: theme.colors.text }}>• Delivery: 7-15 days (China Post) or local</div>
          </div>

          <div style={{ background: theme.colors.bg, borderRadius: '12px', padding: '18px', border: `1px solid ${theme.colors.warning}25` }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
              <div style={{ width: 32, height: 32, borderRadius: '50%', background: `${theme.colors.warning}20`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <span>⚠️</span>
              </div>
              <div style={{ fontFamily: theme.fonts.heading, fontSize: '14px', fontWeight: 600, color: theme.colors.warning }}>
                Moderate Shipping Zone
              </div>
            </div>
            <div style={{ fontSize: '10px', color: theme.colors.textMuted, marginBottom: 8 }}>Countries: Canada, France, Italy, Saudi Arabia, Japan, Australia</div>
            <div style={{ fontSize: '10px', color: theme.colors.text, marginBottom: 4 }}>• Orders under $45 → $6-10 shipping</div>
            <div style={{ fontSize: '10px', color: theme.colors.text, marginBottom: 4 }}>• Orders above $45 → FREE shipping</div>
            <div style={{ fontSize: '10px', color: theme.colors.text }}>• Delivery: 10-20 days</div>
          </div>

          <div style={{ background: theme.colors.bg, borderRadius: '12px', padding: '18px', border: `1px solid ${theme.colors.error}25` }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
              <div style={{ width: 32, height: 32, borderRadius: '50%', background: `${theme.colors.error}20`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <span>🔴</span>
              </div>
              <div style={{ fontFamily: theme.fonts.heading, fontSize: '14px', fontWeight: 600, color: theme.colors.error }}>
                Expensive Shipping Zone
              </div>
            </div>
            <div style={{ fontSize: '10px', color: theme.colors.textMuted, marginBottom: 8 }}>Countries: Brazil, Nigeria, South Africa, Argentina</div>
            <div style={{ fontSize: '10px', color: theme.colors.text, marginBottom: 4 }}>• Orders under $70 → $10-15 shipping</div>
            <div style={{ fontSize: '10px', color: theme.colors.text, marginBottom: 4 }}>• Orders above $70 → FREE shipping</div>
            <div style={{ fontSize: '10px', color: theme.colors.text }}>• Delivery: 15-30 days (economy)</div>
          </div>
        </div>

        {/* Manual Setup Guide */}
        <div style={{
          background: theme.colors.bg, border: `1px solid ${theme.colors.border}`,
          borderRadius: '12px', padding: '18px 20px',
          marginBottom: 16,
        }}>
          <div style={{ fontFamily: theme.fonts.heading, fontSize: '13px', fontWeight: 500, color: theme.colors.textBright, marginBottom: 10 }}>
            📋 Shopify Admin Setup Steps
          </div>
          {[
            'Go to Shopify Admin → Settings → Shipping and delivery',
            'Click "Create shipping zone" → Name it "Standard Worldwide"',
            'Add all countries you serve to this zone',
            'Add rate: "Standard" → $4.99 (for orders under $35)',
            'Add rate: "Free Shipping" → $0.00 (for orders $35 and above)',
            'Click Save — customer ab checkout par shipping rates dekhe ga!',
            'Optional: Create separate zones for expensive countries with $70 threshold',
          ].map((step, i) => (
            <div key={i} style={{
              display: 'flex', alignItems: 'flex-start', gap: 10,
              padding: '6px 0', borderBottom: i < 6 ? `1px solid ${theme.colors.border}` : 'none',
              fontSize: '11px', color: theme.colors.text,
            }}>
              <span style={{
                width: 20, height: 20, borderRadius: '50%', background: `${theme.colors.primary}15`,
                color: theme.colors.primary, display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '9px', fontWeight: 700, flexShrink: 0, marginTop: 1,
              }}>{i + 1}</span>
              <span>{step}</span>
            </div>
          ))}
        </div>

        <a href="https://gmxdth-9b.myshopify.com/admin/settings/shipping" target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none' }}>
          <button style={{
            width: '100%', padding: '14px',
            background: `linear-gradient(135deg, ${theme.colors.primary}, ${theme.colors.primaryDark})`,
            border: 'none', borderRadius: '10px', color: 'white',
            fontSize: '14px', fontWeight: 700, cursor: 'pointer',
            fontFamily: theme.fonts.body, boxShadow: theme.shadows.glow,
          }}>
            🚀 Open Shopify Shipping Settings
          </button>
        </a>
        <div style={{ marginTop: 8, fontSize: '10px', color: theme.colors.textMuted, textAlign: 'center' }}>
          ⚡ Aapko bas Shopify Admin mein 3-4 zones create karne hain — customer ko checkout par sab dikhe ga!
        </div>
      </div>
    </div>
  )
}
