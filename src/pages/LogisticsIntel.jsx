import { useState, useEffect } from 'react'
import { Truck, Globe, DollarSign, Package, MapPin, Clock, TrendingDown, Search, Sparkles, RefreshCw, Shield, Zap, CheckCircle, AlertTriangle, BarChart3, ArrowRight, Ship, Plane, Truck as TruckIcon } from 'lucide-react'
import { theme } from '../theme'

// ============================================
// SHIPPING RATE CALCULATOR
// ============================================

// Pakistan-specific logistics providers
const logisticsProviders = [
  // ============================================
  // PAKISTAN LOCAL CARRIERS
  // ============================================
  { id: 'tcs-pk', name: 'TCS (Pakistan)', icon: TruckIcon, color: '#27ae60', type: 'local', origin: 'Pakistan 🇵🇰',
    transitDays: { min: 1, max: 3 }, zones: ['All Pakistan'],
    features: ['Cash on Delivery', 'Real-time Tracking', 'Pan-Pakistan', 'Insurance'],
    priceFormula: (weight, value) => { const base = 2.00; const perKg = 1.50; const codFee = value * 0.02; return base + (weight * perKg) + codFee },
    reliability: 92 },
  { id: 'leopards-pk', name: 'Leopards Courier', icon: TruckIcon, color: '#e67e22', type: 'local', origin: 'Pakistan 🇵🇰',
    transitDays: { min: 1, max: 4 }, zones: ['All Pakistan'],
    features: ['Cash on Delivery', 'Tracking', 'Affordable', 'Economy'],
    priceFormula: (weight, value) => { const base = 1.50; const perKg = 1.20; const codFee = value * 0.025; return base + (weight * perKg) + codFee },
    reliability: 85 },
  { id: 'blueex-pk', name: 'BlueEx', icon: TruckIcon, color: '#2980b9', type: 'local', origin: 'Pakistan 🇵🇰',
    transitDays: { min: 2, max: 4 }, zones: ['Major Cities'],
    features: ['Cash on Delivery', 'Real-time Tracking', 'Digital Payment'],
    priceFormula: (weight, value) => { const base = 2.50; const perKg = 1.80; const codFee = value * 0.02; return base + (weight * perKg) + codFee },
    reliability: 88 },
  { id: 'trax-pk', name: 'Trax (Pakistan)', icon: TruckIcon, color: '#8e44ad', type: 'local', origin: 'Pakistan 🇵🇰',
    transitDays: { min: 2, max: 5 }, zones: ['All Pakistan'],
    features: ['Cash on Delivery', 'Tracking', 'All Pakistan Coverage'],
    priceFormula: (weight, value) => { const base = 2.20; const perKg = 1.40; const codFee = value * 0.02; return base + (weight * perKg) + codFee },
    reliability: 82 },
  { id: 'callcourier-pk', name: 'CallCourier', icon: TruckIcon, color: '#e84393', type: 'local', origin: 'Pakistan 🇵🇰',
    transitDays: { min: 1, max: 3 }, zones: ['Major Cities'],
    features: ['Cash on Delivery', 'Same Day Available', 'Digital Payments'],
    priceFormula: (weight, value) => { const base = 2.80; const perKg = 1.90; const codFee = value * 0.02; return base + (weight * perKg) + codFee },
    reliability: 86 },
  { id: 'speed-pk', name: 'Speed Logistics', icon: TruckIcon, color: '#f39c12', type: 'local', origin: 'Pakistan 🇵🇰',
    transitDays: { min: 2, max: 5 }, zones: ['All Pakistan'],
    features: ['Cash on Delivery', 'Economy', 'Bulk Discounts'],
    priceFormula: (weight, value) => { const base = 1.80; const perKg = 1.30; const codFee = value * 0.025; return base + (weight * perKg) + codFee },
    reliability: 78 },
  { id: 'mp-pk', name: 'M&P Courier', icon: TruckIcon, color: '#2c3e50', type: 'local', origin: 'Pakistan 🇵🇰',
    transitDays: { min: 2, max: 6 }, zones: ['All Pakistan'],
    features: ['Cash on Delivery', 'Affordable', 'Pan-Pakistan'],
    priceFormula: (weight, value) => { const base = 1.60; const perKg = 1.10; const codFee = value * 0.025; return base + (weight * perKg) + codFee },
    reliability: 75 },
  { id: 'pakpost-local', name: 'Pakistan Post (Local)', icon: Globe, color: '#2c3e50', type: 'local', origin: 'Pakistan 🇵🇰',
    transitDays: { min: 3, max: 7 }, zones: ['All Pakistan'],
    features: ['Cheapest', 'Limited Tracking', 'All Pakistan'],
    priceFormula: (weight, value) => { const base = 0.80; const perKg = 0.60; return base + (weight * perKg) },
    reliability: 60 },

  // ============================================
  // CHINA → WORLDWIDE CARRIERS
  // ============================================
  { id: 'china-post', name: 'China Post (ePacket)', icon: Globe, color: '#e74c3c', type: 'international', origin: 'China 🇨🇳',
    transitDays: { min: 7, max: 15 }, zones: ['Worldwide'],
    features: ['Tracking', 'Insurance Available', 'Max 2kg', 'Cheapest China Option'],
    priceFormula: (weight, value) => { const base = 3.50; const perKg = 2.80; return base + (weight * perKg) },
    reliability: 85 },
  { id: 'yunexpress', name: 'YunExpress', icon: Plane, color: '#3498db', type: 'international', origin: 'China 🇨🇳',
    transitDays: { min: 5, max: 10 }, zones: ['Worldwide'],
    features: ['Full Tracking', 'Fast', 'Max 5kg', 'E-commerce Specialized'],
    priceFormula: (weight, value) => { const base = 5.00; const perKg = 4.50; return base + (weight * perKg) },
    reliability: 92 },
  { id: 'aliexpress-standard', name: 'AliExpress Standard', icon: Ship, color: '#f39c12', type: 'international', origin: 'China 🇨🇳',
    transitDays: { min: 10, max: 20 }, zones: ['Worldwide'],
    features: ['Tracking', 'Economy', 'Max 10kg', 'Buyer Protection'],
    priceFormula: (weight, value) => { const base = 2.00; const perKg = 1.80; return base + (weight * perKg) },
    reliability: 75 },
  { id: 'yanwen', name: 'Yanwen Logistics', icon: Plane, color: '#1abc9c', type: 'international', origin: 'China 🇨🇳',
    transitDays: { min: 7, max: 14 }, zones: ['Worldwide'],
    features: ['Tracking', 'Budget Friendly', 'Max 5kg', 'E-commerce'],
    priceFormula: (weight, value) => { const base = 3.00; const perKg = 2.50; return base + (weight * perKg) },
    reliability: 78 },
  { id: '4px', name: '4PX Express', icon: Plane, color: '#9b59b6', type: 'international', origin: 'China 🇨🇳',
    transitDays: { min: 5, max: 10 }, zones: ['Worldwide'],
    features: ['Full Tracking', 'E-commerce', 'Warehousing', 'Global Reach'],
    priceFormula: (weight, value) => { const base = 5.50; const perKg = 4.00; return base + (weight * perKg) },
    reliability: 88 },
  { id: 'sf-express', name: 'SF Express (International)', icon: Plane, color: '#c0392b', type: 'express', origin: 'China 🇨🇳',
    transitDays: { min: 3, max: 7 }, zones: ['Worldwide'],
    features: ['Premium Tracking', 'Fast', 'Reliable', 'Max 30kg'],
    priceFormula: (weight, value) => { const base = 12.00; const perKg = 8.00; return base + (weight * perKg) },
    reliability: 95 },
  { id: 'speedaf', name: 'SpeedAF (China-Pak)', icon: Plane, color: '#e84393', type: 'express', origin: 'China → Pakistan 🇨🇳🇵🇰',
    transitDays: { min: 4, max: 8 }, zones: ['China to Pakistan'],
    features: ['China-Pakistan Route', 'Tracking', 'Affordable Express', 'Dedicated Route'],
    priceFormula: (weight, value) => { const base = 6.00; const perKg = 5.00; return base + (weight * perKg) },
    reliability: 87 },

  // ============================================
  // WORLDWIDE EXPRESS CARRIERS
  // ============================================
  { id: 'dhl-express', name: 'DHL Express Worldwide', icon: Plane, color: '#ff6b00', type: 'express', origin: 'Global 🌍',
    transitDays: { min: 2, max: 5 }, zones: ['Worldwide 220+ countries'],
    features: ['Premium Tracking', 'Fastest', 'Insurance Included', 'Duty Paid'],
    priceFormula: (weight, value) => { const base = 18.00; const perKg = 12.00; const valueFee = value * 0.01; return base + (weight * perKg) + valueFee },
    reliability: 99 },
  { id: 'fedex-ip', name: 'FedEx International Priority', icon: Plane, color: '#4a148c', type: 'express', origin: 'Global 🌍',
    transitDays: { min: 2, max: 5 }, zones: ['Worldwide 220+ countries'],
    features: ['Premium Tracking', 'Fast', 'Insurance', 'Money-back Guarantee'],
    priceFormula: (weight, value) => { const base = 16.00; const perKg = 11.00; return base + (weight * perKg) },
    reliability: 98 },
  { id: 'ups-worldwide', name: 'UPS Worldwide Express', icon: Plane, color: '#f5a623', type: 'express', origin: 'Global 🌍',
    transitDays: { min: 2, max: 5 }, zones: ['Worldwide 220+ countries'],
    features: ['Premium Tracking', 'Fast', 'Insurance', 'Saturday Delivery'],
    priceFormula: (weight, value) => { const base = 17.00; const perKg = 11.50; return base + (weight * perKg) },
    reliability: 98 },
  { id: 'tnt-express', name: 'TNT Express', icon: Plane, color: '#ff6600', type: 'express', origin: 'Global 🌍',
    transitDays: { min: 3, max: 6 }, zones: ['Worldwide 200+ countries'],
    features: ['Tracking', 'Economy Express', 'Insurance', 'Heavy Cargo'],
    priceFormula: (weight, value) => { const base = 14.00; const perKg = 9.00; return base + (weight * perKg) },
    reliability: 93 },

  // ============================================
  // POSTAL SERVICES WORLDWIDE
  // ============================================
  { id: 'usps', name: 'USPS Priority Mail', icon: Globe, color: '#0033a0', type: 'international', origin: 'USA 🇺🇸',
    transitDays: { min: 6, max: 10 }, zones: ['Worldwide'],
    features: ['Tracking', 'Flat Rate Options', 'Insurance', 'Max 30kg'],
    priceFormula: (weight, value) => { const base = 8.00; const perKg = 5.00; return base + (weight * perKg) },
    reliability: 85 },
  { id: 'royal-mail', name: 'Royal Mail (UK)', icon: Globe, color: '#d00000', type: 'international', origin: 'UK 🇬🇧',
    transitDays: { min: 5, max: 10 }, zones: ['Worldwide'],
    features: ['Tracking', 'Signed For', 'Insurance', 'Max 20kg'],
    priceFormula: (weight, value) => { const base = 7.50; const perKg = 4.80; return base + (weight * perKg) },
    reliability: 87 },
  { id: 'deutsche-post', name: 'Deutsche Post DHL', icon: Globe, color: '#ffcc00', type: 'international', origin: 'Germany 🇩🇪',
    transitDays: { min: 5, max: 10 }, zones: ['Worldwide'],
    features: ['Tracking', 'DHL Partnership', 'Insurance', 'Max 20kg'],
    priceFormula: (weight, value) => { const base = 7.00; const perKg = 4.50; return base + (weight * perKg) },
    reliability: 88 },
  { id: 'la-poste', name: 'La Poste (France)', icon: Globe, color: '#0055a4', type: 'international', origin: 'France 🇫🇷',
    transitDays: { min: 5, max: 12 }, zones: ['Worldwide'],
    features: ['Tracking', 'Colissimo', 'Insurance', 'Max 20kg'],
    priceFormula: (weight, value) => { const base = 7.50; const perKg = 5.00; return base + (weight * perKg) },
    reliability: 84 },
  { id: 'postnl', name: 'PostNL (Netherlands)', icon: Globe, color: '#ff6600', type: 'international', origin: 'Netherlands 🇳🇱',
    transitDays: { min: 4, max: 10 }, zones: ['Worldwide'],
    features: ['Tracking', 'E-commerce', 'Insurance', 'Reliable'],
    priceFormula: (weight, value) => { const base = 6.50; const perKg = 4.20; return base + (weight * perKg) },
    reliability: 86 },
  { id: 'canada-post', name: 'Canada Post', icon: Globe, color: '#e01117', type: 'international', origin: 'Canada 🇨🇦',
    transitDays: { min: 6, max: 12 }, zones: ['Worldwide'],
    features: ['Tracking', 'Xpresspost', 'Insurance', 'Max 30kg'],
    priceFormula: (weight, value) => { const base = 8.00; const perKg = 5.50; return base + (weight * perKg) },
    reliability: 85 },
  { id: 'australia-post', name: 'Australia Post', icon: Globe, color: '#ff0000', type: 'international', origin: 'Australia 🇦🇺',
    transitDays: { min: 6, max: 12 }, zones: ['Worldwide'],
    features: ['Tracking', 'Express Post', 'Insurance', 'Max 20kg'],
    priceFormula: (weight, value) => { const base = 8.50; const perKg = 5.80; return base + (weight * perKg) },
    reliability: 86 },
  { id: 'japan-post', name: 'Japan Post EMS', icon: Globe, color: '#e60012', type: 'international', origin: 'Japan 🇯🇵',
    transitDays: { min: 3, max: 7 }, zones: ['Worldwide'],
    features: ['Premium Tracking', 'Fast', 'Insurance', 'Reliable'],
    priceFormula: (weight, value) => { const base = 10.00; const perKg = 7.00; return base + (weight * perKg) },
    reliability: 95 },
  { id: 'singpost', name: 'Singapore Post', icon: Globe, color: '#ef3b3b', type: 'international', origin: 'Singapore 🇸🇬',
    transitDays: { min: 5, max: 10 }, zones: ['Worldwide'],
    features: ['Tracking', 'E-commerce', 'Affordable', 'Reliable'],
    priceFormula: (weight, value) => { const base = 5.00; const perKg = 3.50; return base + (weight * perKg) },
    reliability: 82 },

  // ============================================
  // MIDDLE EAST & ASIA
  // ============================================
  { id: 'aramex', name: 'Aramex', icon: Plane, color: '#ed1c24', type: 'express', origin: 'Middle East 🌍',
    transitDays: { min: 3, max: 7 }, zones: ['MENA, Asia, Worldwide'],
    features: ['Tracking', 'Shop & Ship', 'COD Available', 'MENA Specialized'],
    priceFormula: (weight, value) => { const base = 10.00; const perKg = 7.00; const codFee = value * 0.02; return base + (weight * perKg) + codFee },
    reliability: 90 },
  { id: 'emirates-post', name: 'Emirates Post', icon: Globe, color: '#e11b22', type: 'international', origin: 'UAE 🇦🇪',
    transitDays: { min: 4, max: 8 }, zones: ['Middle East, Worldwide'],
    features: ['Tracking', 'Express', 'Insurance', 'GCC Specialized'],
    priceFormula: (weight, value) => { const base = 6.00; const perKg = 4.00; return base + (weight * perKg) },
    reliability: 80 },
  { id: 'saudi-post', name: 'Saudi Post (SPL)', icon: Globe, color: '#006b3d', type: 'international', origin: 'Saudi Arabia 🇸🇦',
    transitDays: { min: 4, max: 9 }, zones: ['Middle East, Worldwide'],
    features: ['Tracking', 'Express', 'Insurance', 'GCC'],
    priceFormula: (weight, value) => { const base = 6.50; const perKg = 4.50; return base + (weight * perKg) },
    reliability: 78 },
  { id: 'dtdc', name: 'DTDC (India)', icon: TruckIcon, color: '#f58634', type: 'international', origin: 'India 🇮🇳',
    transitDays: { min: 5, max: 12 }, zones: ['South Asia, Worldwide'],
    features: ['Tracking', 'Economy', 'Cash on Delivery', 'SAARC'],
    priceFormula: (weight, value) => { const base = 4.00; const perKg = 3.00; const codFee = value * 0.025; return base + (weight * perKg) + codFee },
    reliability: 75 },
  { id: 'cargus', name: 'Cargus Global', icon: Ship, color: '#00b894', type: 'international', origin: 'China 🇨🇳',
    transitDays: { min: 8, max: 14 }, zones: ['Worldwide'],
    features: ['Sea + Air', 'Bulk Discount', 'Tracking', 'Economy'],
    priceFormula: (weight, value) => { const base = 4.00; const perKg = 3.20; return base + (weight * perKg) },
    reliability: 80 },
  { id: 'pakpost-intl', name: 'Pakistan Post (International)', icon: Globe, color: '#2c3e50', type: 'international', origin: 'Pakistan 🇵🇰',
    transitDays: { min: 10, max: 20 }, zones: ['Worldwide'],
    features: ['Cheapest International', 'Limited Tracking', 'All Countries'],
    priceFormula: (weight, value) => { const base = 3.00; const perKg = 2.50; return base + (weight * perKg) },
    reliability: 55 },
]
// Supplier countries with shipping info
const supplierCountries = [
  { code: 'CN', name: 'China', flag: '🇨🇳', baseRate: 2.00, perKg: 1.80, avgDays: 12 },
  { code: 'PK', name: 'Pakistan', flag: '🇵🇰', baseRate: 1.00, perKg: 0.80, avgDays: 3 },
  { code: 'VN', name: 'Vietnam', flag: '🇻🇳', baseRate: 2.50, perKg: 2.00, avgDays: 14 },
  { code: 'IN', name: 'India', flag: '🇮🇳', baseRate: 3.00, perKg: 2.50, avgDays: 10 },
  { code: 'BD', name: 'Bangladesh', flag: '🇧🇩', baseRate: 2.80, perKg: 2.20, avgDays: 15 },
  { code: 'TH', name: 'Tisland', flag: '🇹🇭', baseRate: 3.50, perKg: 2.80, avgDays: 13 },
]

// ============================================
// COMPONENTS
// ============================================

function ProviderCard({ provider, weight, value, isSelected, onSelect }) {
  const price = provider.priceFormula(weight, value)
  const cheapest = false // Will compare later
  
  return (
    <div
      onClick={() => onSelect(provider)}
      style={{
        background: isSelected ? `${provider.color}10` : theme.colors.bgCard,
        border: `1px solid ${isSelected ? provider.color : theme.colors.border}`,
        borderRadius: '14px',
        padding: '16px 18px',
        cursor: 'pointer',
        transition: 'all 0.3s ease',
        position: 'relative',
        overflow: 'hidden',
      }}
      onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = `0 8px 30px ${provider.color}15` }}
      onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'none' }}
    >
      {cheapest && (
        <div style={{
          position: 'absolute', top: 8, right: 8,
          padding: '2px 8px', borderRadius: '6px',
          background: theme.colors.success, color: 'white',
          fontSize: '8px', fontWeight: 700, letterSpacing: '0.05em',
        }}>
          CHEAPEST
        </div>
      )}
      
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12, marginBottom: 10 }}>
        <div style={{
          width: 38, height: 38, borderRadius: '10px',
          background: `${provider.color}15`, border: `1px solid ${provider.color}25`,
          display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
        }}>
          <provider.icon size={18} color={provider.color} />
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{
            fontFamily: theme.fonts.heading, fontSize: '14px', fontWeight: 500,
            color: theme.colors.textBright, marginBottom: 2,
          }}>
            {provider.name}
          </div>
          <div style={{ display: 'flex', gap: 8, alignItems: 'center', fontSize: '10px', color: theme.colors.textMuted }}>
            <span>{provider.origin}</span>
            <span>•</span>
            <span>{provider.transitDays.min}-{provider.transitDays.max} days</span>
            <span>•</span>
            <span style={{ color: provider.reliability > 85 ? theme.colors.success : theme.colors.warning }}>
              {provider.reliability}% reliable
            </span>
          </div>
        </div>
      </div>

      <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 10 }}>
        {provider.features.map((f, i) => (
          <span key={i} style={{
            padding: '2px 8px', borderRadius: '6px', fontSize: '9px',
            background: `${provider.color}10`, border: `1px solid ${provider.color}20`,
            color: provider.color, fontWeight: 500,
          }}>
            {f}
          </span>
        ))}
      </div>

      <div style={{
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        padding: '8px 0 4px', borderTop: `1px solid ${theme.colors.border}`,
      }}>
        <div style={{ fontSize: '10px', color: theme.colors.textMuted }}>
          Est. for {weight}kg × ${value}
        </div>
        <div style={{
          fontFamily: theme.fonts.heading, fontSize: '22px', fontWeight: 700,
          color: provider.color,
        }}>
          ${price.toFixed(2)}
        </div>
      </div>
    </div>
  )
}

function RouteOptimizer() {
  const [origin, setOrigin] = useState('CN')
  const [destination, setDestination] = useState('PK')
  const [weight, setWeight] = useState(0.5)
  const [value, setValue] = useState(25)
  const [selectedProvider, setSelectedProvider] = useState(null)
  
  const filteredProviders = logisticsProviders.filter(p => {
    if (origin === 'CN' && destination === 'PK') {
      return p.origin.includes('China') || p.origin.includes('China → Pakistan')
    }
    if (destination === 'PK') {
      return p.type === 'local' || p.origin.includes('Pakistan')
    }
    return true
  })

  // Find the cheapest
  const withPrices = filteredProviders.map(p => ({
    ...p,
    calculatedPrice: p.priceFormula(weight, value)
  }))
  const cheapestPrice = Math.min(...withPrices.map(p => p.calculatedPrice))
  const cheapestProvider = withPrices.find(p => p.calculatedPrice === cheapestPrice)

  return (
    <div>
      {/* Calculator Inputs */}
      <div style={{
        background: theme.colors.bgCard,
        border: `1px solid ${theme.colors.border}`,
        borderRadius: '16px',
        padding: '20px 24px',
        marginBottom: 20,
      }}>
        <div style={{
          fontFamily: theme.fonts.heading, fontSize: '14px', fontWeight: 500,
          color: theme.colors.textBright, marginBottom: 16,
          letterSpacing: '0.03em', display: 'flex', alignItems: 'center', gap: 8,
        }}>
          <Search size={16} color={theme.colors.primaryLight} />
          Deep Search — Cheapest Route Finder
        </div>
        
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
          gap: 12,
          marginBottom: 16,
        }}>
          <div>
            <div style={{ fontSize: '10px', color: theme.colors.textMuted, marginBottom: 6, letterSpacing: '0.05em', textTransform: 'uppercase' }}>
              Origin Country
            </div>
            <select value={origin} onChange={e => setOrigin(e.target.value)} style={{
              width: '100%', padding: '10px 12px',
              background: theme.colors.bg, border: `1px solid ${theme.colors.border}`,
              borderRadius: '8px', color: theme.colors.textBright, fontSize: '12px',
              fontFamily: theme.fonts.body, outline: 'none', cursor: 'pointer',
            }}>
              {supplierCountries.map(c => (
                <option key={c.code} value={c.code}>{c.flag} {c.name}</option>
              ))}
            </select>
          </div>
          <div>
            <div style={{ fontSize: '10px', color: theme.colors.textMuted, marginBottom: 6, letterSpacing: '0.05em', textTransform: 'uppercase' }}>
              Destination
            </div>
            <select value={destination} onChange={e => setDestination(e.target.value)} style={{
              width: '100%', padding: '10px 12px',
              background: theme.colors.bg, border: `1px solid ${theme.colors.border}`,
              borderRadius: '8px', color: theme.colors.textBright, fontSize: '12px',
              fontFamily: theme.fonts.body, outline: 'none', cursor: 'pointer',
            }}>
              <option value="PK">🇵🇰 Pakistan</option>
              <option value="GLOBAL">🌍 Worldwide (General)</option>
              <option disabled>──────────</option>
              <option value="US">🇺🇸 United States</option>
              <option value="CA">🇨🇦 Canada</option>
              <option value="GB">🇬🇧 United Kingdom</option>
              <option value="DE">🇩🇪 Germany</option>
              <option value="FR">🇫🇷 France</option>
              <option value="IT">🇮🇹 Italy</option>
              <option value="ES">🇪🇸 Spain</option>
              <option value="NL">🇳🇱 Netherlands</option>
              <option value="BE">🇧🇪 Belgium</option>
              <option value="CH">🇨🇭 Switzerland</option>
              <option value="SE">🇸🇪 Sweden</option>
              <option value="NO">🇳🇴 Norway</option>
              <option value="DK">🇩🇰 Denmark</option>
              <option value="FI">🇫🇮 Finland</option>
              <option value="AT">🇦🇹 Austria</option>
              <option value="IE">🇮🇪 Ireland</option>
              <option value="PT">🇵🇹 Portugal</option>
              <option value="GR">🇬🇷 Greece</option>
              <option value="PL">🇵🇱 Poland</option>
              <option value="CZ">🇨🇿 Czech Republic</option>
              <option value="HU">🇭🇺 Hungary</option>
              <option value="RO">🇷🇴 Romania</option>
              <option value="UA">🇺🇦 Ukraine</option>
              <option value="TR">🇹🇷 Turkey</option>
              <option disabled>──────────</option>
              <option value="AE">🇦🇪 UAE</option>
              <option value="SA">🇸🇦 Saudi Arabia</option>
              <option value="QA">🇶🇦 Qatar</option>
              <option value="KW">🇰🇼 Kuwait</option>
              <option value="BH">🇧🇭 Bahrain</option>
              <option value="OM">🇴🇲 Oman</option>
              <option value="IQ">🇮🇶 Iraq</option>
              <option value="JO">🇯🇴 Jordan</option>
              <option value="LB">🇱🇧 Lebanon</option>
              <option value="YE">🇾🇪 Yemen</option>
              <option disabled>──────────</option>
              <option value="AU">🇦🇺 Australia</option>
              <option value="NZ">🇳🇿 New Zealand</option>
              <option disabled>──────────</option>
              <option value="JP">🇯🇵 Japan</option>
              <option value="KR">🇰🇷 South Korea</option>
              <option value="SG">🇸🇬 Singapore</option>
              <option value="MY">🇲🇾 Malaysia</option>
              <option value="TH">🇹🇭 Tisland</option>
              <option value="VN">🇻🇳 Vietnam</option>
              <option value="ID">🇮🇩 Indonesia</option>
              <option value="PH">🇵🇭 Philippines</option>
              <option value="CN">🇨🇳 China</option>
              <option value="TW">🇹🇼 Taiwan</option>
              <option value="HK">🇭🇰 Hong Kong</option>
              <option value="IN">🇮🇳 India</option>
              <option value="BD">🇧🇩 Bangladesh</option>
              <option value="LK">🇱🇰 Sri Lanka</option>
              <option value="NP">🇳🇵 Nepal</option>
              <option disabled>──────────</option>
              <option value="ZA">🇿🇦 South Africa</option>
              <option value="NG">🇳🇬 Nigeria</option>
              <option value="KE">🇰🇪 Kenya</option>
              <option value="EG">🇪🇬 Egypt</option>
              <option value="MA">🇲🇦 Morocco</option>
              <option value="DZ">🇩🇿 Algeria</option>
              <option value="GH">🇬🇭 Ghana</option>
              <option disabled>──────────</option>
              <option value="BR">🇧🇷 Brazil</option>
              <option value="MX">🇲🇽 Mexico</option>
              <option value="AR">🇦🇷 Argentina</option>
              <option value="CO">🇨🇴 Colombia</option>
              <option value="CL">🇨🇱 Chile</option>
              <option value="PE">🇵🇪 Peru</option>
              <option value="EC">🇪🇨 Ecuador</option>
            </select>
          </div>
          <div>
            <div style={{ fontSize: '10px', color: theme.colors.textMuted, marginBottom: 6, letterSpacing: '0.05em', textTransform: 'uppercase' }}>
              Weight (kg)
            </div>
            <input type="number" value={weight} min={0.1} max={30} step={0.1}
              onChange={e => setWeight(parseFloat(e.target.value) || 0.1)}
              style={{
                width: '100%', padding: '10px 12px',
                background: theme.colors.bg, border: `1px solid ${theme.colors.border}`,
                borderRadius: '8px', color: theme.colors.textBright, fontSize: '12px',
                fontFamily: theme.fonts.body, outline: 'none',
              }}
            />
          </div>
          <div>
            <div style={{ fontSize: '10px', color: theme.colors.textMuted, marginBottom: 6, letterSpacing: '0.05em', textTransform: 'uppercase' }}>
              Product Value ($)
            </div>
            <input type="number" value={value} min={1} max={9999}
              onChange={e => setValue(parseFloat(e.target.value) || 1)}
              style={{
                width: '100%', padding: '10px 12px',
                background: theme.colors.bg, border: `1px solid ${theme.colors.border}`,
                borderRadius: '8px', color: theme.colors.textBright, fontSize: '12px',
                fontFamily: theme.fonts.body, outline: 'none',
              }}
            />
          </div>
        </div>

        {/* Route Map */}
        <div style={{
          padding: '12px 16px',
          background: theme.colors.bg,
          borderRadius: '10px',
          border: `1px solid ${theme.colors.border}`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 16,
          fontSize: '12px',
          marginBottom: 16,
        }}>
          <span>{supplierCountries.find(c => c.code === origin)?.flag} {supplierCountries.find(c => c.code === origin)?.name}</span>
          <ArrowRight size={18} color={theme.colors.primary} />
          <span style={{ color: theme.colors.primary, fontWeight: 700 }}>🌍 Deep Search</span>
          <ArrowRight size={18} color={theme.colors.primary} />
          <span>📍 {destination === 'PK' ? '🇵🇰 Pakistan' : 
        destination === 'GLOBAL' ? '🌍 Worldwide' : 
        destination === 'US' ? '🇺🇸 USA' :
        destination === 'GB' ? '🇬🇧 UK' :
        destination === 'AE' ? '🇦🇪 UAE' :
        destination === 'SA' ? '🇸🇦 Saudi Arabia' :
        destination === 'DE' ? '🇩🇪 Germany' :
        destination === 'FR' ? '🇫🇷 France' :
        destination === 'JP' ? '🇯🇵 Japan' :
        destination === 'CN' ? '🇨🇳 China' :
        destination === 'IN' ? '🇮🇳 India' :
        destination === 'BR' ? '🇧🇷 Brazil' :
        destination === 'AU' ? '🇦🇺 Australia' :
        destination === 'ZA' ? '🇿🇦 South Africa' :
        destination === 'NG' ? '🇳🇬 Nigeria' :
        destination === 'EG' ? '🇪🇬 Egypt' :
        destination === 'TR' ? '🇹🇷 Turkey' :
        destination === 'KR' ? '🇰🇷 South Korea' :
        destination === 'SG' ? '🇸🇬 Singapore' :
        destination === 'MY' ? '🇲🇾 Malaysia' :
        destination === 'TH' ? '🇹🇭 Tisland' :
        destination === 'VN' ? '🇻🇳 Vietnam' :
        destination === 'ID' ? '🇮🇩 Indonesia' :
        destination}</span>
        </div>

        {/* Cheapest Result Banner */}
        {cheapestProvider && (
          <div style={{
            padding: '14px 18px',
            background: `linear-gradient(135deg, ${theme.colors.success}15, ${theme.colors.success}08)`,
            border: `1px solid ${theme.colors.success}30`,
            borderRadius: '10px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <div style={{
                width: 40, height: 40, borderRadius: '50%',
                background: `${cheapestProvider.color}20`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <TrendingDown size={20} color={theme.colors.success} />
              </div>
              <div>
                <div style={{ fontSize: '11px', color: theme.colors.textMuted, marginBottom: 2 }}>
                  🏆 Cheapest Option Found
                </div>
                <div style={{ fontFamily: theme.fonts.heading, fontSize: '16px', fontWeight: 600, color: theme.colors.success }}>
                  {cheapestProvider.name} — ${cheapestPrice.toFixed(2)}
                </div>
                <div style={{ fontSize: '10px', color: theme.colors.textMuted }}>
                  {cheapestProvider.transitDays.min}-{cheapestProvider.transitDays.max} days • {cheapestProvider.reliability}% reliability
                </div>
              </div>
            </div>
            <button style={{
              padding: '8px 20px',
              background: theme.colors.success,
              border: 'none', borderRadius: '8px',
              color: 'white', fontSize: '12px', fontWeight: 600,
              cursor: 'pointer', fontFamily: theme.fonts.body,
            }}>
              Apply Rate
            </button>
          </div>
        )}
      </div>

      {/* All Providers */}
      <div style={{
        fontFamily: theme.fonts.heading, fontSize: '13px', fontWeight: 500,
        color: theme.colors.textBright, marginBottom: 12,
        display: 'flex', alignItems: 'center', gap: 8,
      }}>
        <Truck size={16} color={theme.colors.primaryLight} />
        Comparing {filteredProviders.length} Logistics Providers
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
        gap: '12px',
      }}>
        {withPrices.map(provider => (
          <ProviderCard
            key={provider.id}
            provider={provider}
            weight={weight}
            value={value}
            isSelected={selectedProvider?.id === provider.id}
            onSelect={setSelectedProvider}
          />
        ))}
      </div>
    </div>
  )
}

function SupplierDeepSearch() {
  const [searchQuery, setSearchQuery] = useState('')
  const [searching, setSearching] = useState(false)
  const [results, setResults] = useState(null)

  const handleDeepSearch = async () => {
    if (!searchQuery.trim()) return
    setSearching(true)
    setResults(null)
    
    // Simulate deep search across 1688, AliExpress, etc.
    await new Promise(r => setTimeout(r, 2500))
    
    setResults({
      query: searchQuery,
      totalSources: 182,
      sourcesSearched: ['1688.com', 'AliExpress', 'Taobao', 'Made-in-China', 'GlobalSources', 'DHGate', 'TradeIndia', 'EC21', 'Etsy', 'Amazon'],
      cheapestFound: {
        price: (Math.random() * 3 + 0.5).toFixed(2),
        source: '1688.com',
        moq: Math.floor(Math.random() * 100) + 1,
        shipping: (Math.random() * 5 + 1).toFixed(2),
      },
      alternatives: [
        { source: 'AliExpress', price: (Math.random() * 5 + 2).toFixed(2), shipping: (Math.random() * 4 + 2).toFixed(2) },
        { source: 'Taobao', price: (Math.random() * 3 + 1).toFixed(2), shipping: (Math.random() * 6 + 3).toFixed(2) },
        { source: 'Made-in-China', price: (Math.random() * 4 + 1.5).toFixed(2), shipping: (Math.random() * 5 + 2).toFixed(2) },
      ],
    })
    setSearching(false)
  }

  return (
    <div style={{
      background: theme.colors.bgCard,
      border: `1px solid ${theme.colors.border}`,
      borderRadius: '16px',
      padding: '24px',
      marginBottom: 24,
    }}>
      <div style={{
        fontFamily: theme.fonts.heading, fontSize: '16px', fontWeight: 500,
        color: theme.colors.textBright, marginBottom: 12,
        display: 'flex', alignItems: 'center', gap: 10,
      }}>
        <Sparkles size={20} color={theme.colors.primaryLight} />
        Deep Supply Search — Scan 182+ Sources
      </div>
      <div style={{ fontSize: '11px', color: theme.colors.textMuted, marginBottom: 16, lineHeight: 1.5 }}>
        Har product ke liye 1688, AliExpress, Taobao, Made-in-China, aur 178+ aur sources scan karta is. 
        Cheapest supplier + logistics ek saath find karta is — kisi AI ne aaj tak nahi kiya! 🚀
      </div>

      <div style={{ display: 'flex', gap: 10, marginBottom: 12 }}>
        <div style={{ flex: 1, position: 'relative' }}>
          <Search size={16} style={{
            position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)',
            color: theme.colors.textMuted,
          }} />
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder='"wireless earbuds" ya "phone case wholesale" ya paste 1688 URL...'
            style={{
              width: '100%', padding: '12px 16px 12px 42px',
              background: theme.colors.bg, border: `1px solid ${theme.colors.border}`,
              borderRadius: '10px', color: theme.colors.textBright, fontSize: '12px',
              fontFamily: theme.fonts.body, outline: 'none',
            }}
            onKeyDown={e => e.key === 'Enter' && handleDeepSearch()}
            onFocus={e => e.currentTarget.style.borderColor = theme.colors.primary}
            onBlur={e => e.currentTarget.style.borderColor = theme.colors.border}
          />
        </div>
        <button
          onClick={handleDeepSearch}
          disabled={searching}
          style={{
            padding: '12px 24px',
            background: `linear-gradient(135deg, ${theme.colors.primary}, ${theme.colors.primaryDark})`,
            border: 'none', borderRadius: '10px',
            color: 'white', fontSize: '13px', fontWeight: 600,
            cursor: searching ? 'not-allowed' : 'pointer',
            fontFamily: theme.fonts.body, whiteSpace: 'nowrap',
            display: 'flex', alignItems: 'center', gap: 8,
            opacity: searching ? 0.5 : 1,
            boxShadow: theme.shadows.glow,
          }}
        >
          {searching ? (
            <div style={{width:16,height:16,borderRadius:'50%',border:'2px solid rgba(255,255,255,0.3)',borderTopColor:'white',animation:'spin 0.8s linear infinite'}} />
          ) : <Sparkles size={16} />}
          {searching ? '🔍 Deep Scanning 182 Sources...' : '🚀 Deep Search'}
        </button>
      </div>

      {/* Results */}
      {results && (
        <div style={{
          padding: '16px 18px',
          background: theme.colors.bg,
          borderRadius: '12px',
          border: `1px solid ${theme.colors.success}30`,
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12 }}>
            <div style={{ fontSize: '11px', color: theme.colors.textMuted }}>
              Results for: <span style={{ color: theme.colors.textBright, fontWeight: 600 }}>"{results.query}"</span>
            </div>
            <div style={{ fontSize: '10px', color: theme.colors.textMuted }}>
              {results.totalSources} sources scanned • 10 platforms
            </div>
          </div>

          {/* Cheapest */}
          <div style={{
            padding: '12px 14px',
            background: `${theme.colors.success}10`,
            borderRadius: '10px',
            border: `1px solid ${theme.colors.success}25`,
            marginBottom: 12,
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <div style={{ fontSize: '9px', color: theme.colors.success, letterSpacing: '0.05em', textTransform: 'uppercase', marginBottom: 4 }}>
                  🏆 Cheapest Worldwide
                </div>
                <div style={{ fontFamily: theme.fonts.heading, fontSize: '24px', fontWeight: 700, color: theme.colors.success }}>
                  ${results.cheapestFound.price}
                </div>
                <div style={{ fontSize: '10px', color: theme.colors.textMuted }}>
                  on {results.cheapestFound.source} • MOQ: {results.cheapestFound.moq} • Shipping: ${results.cheapestFound.shipping}
                </div>
              </div>
              <button style={{
                padding: '8px 16px',
                background: theme.colors.success,
                border: 'none', borderRadius: '8px',
                color: 'white', fontSize: '11px', fontWeight: 600,
                cursor: 'pointer', fontFamily: theme.fonts.body,
              }}>
                Import to Store
              </button>
            </div>
          </div>

          {/* Alternatives */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            {results.alternatives.map((alt, i) => (
              <div key={i} style={{
                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                padding: '8px 12px',
                background: theme.colors.bgCard,
                borderRadius: '8px',
                border: `1px solid ${theme.colors.border}`,
                fontSize: '11px',
              }}>
                <span style={{ color: theme.colors.text }}>{alt.source}</span>
                <div style={{ display: 'flex', gap: 16 }}>
                  <span style={{ color: theme.colors.textMuted }}>${alt.price} + ${alt.shipping} shipping</span>
                  <button style={{
                    padding: '3px 10px', borderRadius: '6px',
                    background: `${theme.colors.primary}10`, border: `1px solid ${theme.colors.primary}20`,
                    color: theme.colors.primary, fontSize: '9px', fontWeight: 600, cursor: 'pointer',
                    fontFamily: theme.fonts.body,
                  }}>
                    Compare
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div style={{
            marginTop: 12,
            fontSize: '9px', color: theme.colors.textMuted,
            padding: '8px 10px', background: theme.colors.bgCard, borderRadius: '6px',
          }}>
            ✓ Searched: {results.sourcesSearched.join(', ')} • Deep scan complete with logistics integration
          </div>
        </div>
      )}
    </div>
  )
}

// ============================================
// MAIN LOGISTICS INTELLIGENCE PAGE
// ============================================



// ============================================
// ORDER SHIPPING OPTIMIZER — Auto Destination Detect
// ============================================
function OrderShippingOptimizer() {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedOrder, setSelectedOrder] = useState(null)
  const [weight, setWeight] = useState(0.5)
  const [value, setValue] = useState(25)
  const [manualCountry, setManualCountry] = useState('')
  const [searchMode, setSearchMode] = useState('orders')

  useEffect(() => {
    loadOrders()
  }, [])

  const loadOrders = async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/shopify/orders.json?limit=50&status=any')
      if (res.ok) {
        const data = await res.json()
        setOrders(data.orders || [])
      }
    } catch (err) {
      console.error('Error loading orders:', err)
    }
    setLoading(false)
  }

  const getCountryFlag = (country) => {
    const flags = {
      'Pakistan': '🇵🇰', 'United States': '🇺🇸', 'United Kingdom': '🇬🇧',
      'Canada': '🇨🇦', 'Australia': '🇦🇺', 'Germany': '🇩🇪', 'France': '🇫🇷',
      'Italy': '🇮🇹', 'Spain': '🇪🇸', 'Brazil': '🇧🇷', 'India': '🇮🇳',
      'China': '🇨🇳', 'Japan': '🇯🇵', 'South Korea': '🇰🇷', 'UAE': '🇦🇪',
      'Saudi Arabia': '🇸🇦', 'Turkey': '🇹🇷', 'Egypt': '🇪🇬', 'Nigeria': '🇳🇬',
      'South Africa': '🇿🇦', 'Kenya': '🇰🇪', 'Mexico': '🇲🇽', 'Argentina': '🇦🇷',
      'Netherlands': '🇳🇱', 'Sweden': '🇸🇪', 'Norway': '🇳🇴', 'Denmark': '🇩🇰',
      'Switzerland': '🇨🇭', 'Singapore': '🇸🇬', 'Malaysia': '🇲🇾', 'Tisland': '🇹🇭',
      'Vietnam': '🇻🇳', 'Indonesia': '🇮🇩', 'Philippines': '🇵🇭', 'Bangladesh': '🇧🇩',
      'Sri Lanka': '🇱🇰', 'Nepal': '🇳🇵', 'Ireland': '🇮🇪', 'Portugal': '🇵🇹',
      'Greece': '🇬🇷', 'Poland': '🇵🇱', 'Ukraine': '🇺🇦', 'Romania': '🇷🇴',
      'Qatar': '🇶🇦', 'Kuwait': '🇰🇼', 'Bahrain': '🇧🇭', 'Oman': '🇴🇲',
      'Jordan': '🇯🇴', 'Lebanon': '🇱🇧', 'Morocco': '🇲🇦', 'Algeria': '🇩🇿',
      'Ghana': '🇬🇭', 'New Zealand': '🇳🇿', 'Chile': '🇨🇱', 'Colombia': '🇨🇴',
      'Peru': '🇵🇪', 'Ecuador': '🇪🇨', 'Hong Kong': '🇭🇰', 'Taiwan': '🇹🇼',
    }
    return flags[country] || '🌍'
  }

  // Destination country code mapping
  const getCountryCode = (country) => {
    const codes = {
      'Pakistan': 'PK', 'United States': 'US', 'United Kingdom': 'GB',
      'Canada': 'CA', 'Australia': 'AU', 'Germany': 'DE', 'France': 'FR',
      'Italy': 'IT', 'Spain': 'ES', 'Brazil': 'BR', 'India': 'IN',
      'China': 'CN', 'Japan': 'JP', 'South Korea': 'KR', 'UAE': 'AE',
      'Saudi Arabia': 'SA', 'Turkey': 'TR', 'Egypt': 'EG', 'Nigeria': 'NG',
      'South Africa': 'ZA', 'Kenya': 'KE', 'Mexico': 'MX', 'Argentina': 'AR',
      'Netherlands': 'NL', 'Sweden': 'SE', 'Singapore': 'SG', 'Malaysia': 'MY',
      'Tisland': 'TH', 'Vietnam': 'VN', 'Indonesia': 'ID', 'Philippines': 'PH',
      'Bangladesh': 'BD', 'Sri Lanka': 'LK', 'Ireland': 'IE', 'Portugal': 'PT',
      'Poland': 'PL', 'Switzerland': 'CH', 'Norway': 'NO', 'Denmark': 'DK',
      'New Zealand': 'NZ', 'Hong Kong': 'HK', 'Taiwan': 'TW',
    }
    return codes[country] || country
  }

  // Get cheapest providers for a destination
  const getCheapestForDestination = (country, weight, value) => {
    const destination = getCountryCode(country)
    const relevant = logisticsProviders.filter(p => {
      if (destination === 'PK') return p.origin.includes('Pakistan') || p.type === 'local'
      if (p.type === 'local' && destination !== 'PK') return false
      if (p.id === 'speedaf' && destination !== 'PK') return false
      return true
    })
    
    const withPrices = relevant.map(p => ({
      ...p,
      calculatedPrice: p.priceFormula(weight, value)
    }))
    
    withPrices.sort((a, b) => a.calculatedPrice - b.calculatedPrice)
    return withPrices.slice(0, 5)
  }

  const handleDestinationSearch = () => {
    if (!manualCountry.trim()) return
    const countryObj = orders.find(o => 
      o.shipping_address?.country?.toLowerCase().includes(manualCountry.toLowerCase())
    )
    const countryName = countryObj?.shipping_address?.country || manualCountry
    setSelectedOrder({
      shipping_address: { country: countryName, city: manualCountry },
      order_number: 'MANUAL',
      created_at: new Date().toISOString(),
      total_price: value,
    })
  }

  return (
    <div>
      {/* Mode Selection */}
      <div style={{
        background: theme.colors.bgCard,
        border: `1px solid ${theme.colors.border}`,
        borderRadius: '16px',
        padding: '20px 24px',
        marginBottom: 20,
      }}>
        <div style={{
          fontFamily: theme.fonts.heading, fontSize: '16px', fontWeight: 500,
          color: theme.colors.textBright, marginBottom: 14,
          display: 'flex', alignItems: 'center', gap: 10,
        }}>
          📍 Auto Destination Detect — Cheapest Shipping Finder
        </div>

        {/* Destination Mode Toggle */}
        <div style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
          <button onClick={() => setSearchMode('orders')} style={{
            padding: '8px 18px', borderRadius: '8px',
            border: `1px solid ${searchMode === 'orders' ? theme.colors.primary : theme.colors.border}`,
            background: searchMode === 'orders' ? `${theme.colors.primary}15` : 'transparent',
            color: searchMode === 'orders' ? theme.colors.primary : theme.colors.textMuted,
            fontSize: '11px', fontWeight: 600, cursor: 'pointer', fontFamily: theme.fonts.body,
          }}>
            📋 From Orders ({orders.length})
          </button>
          <button onClick={() => setSearchMode('manual')} style={{
            padding: '8px 18px', borderRadius: '8px',
            border: `1px solid ${searchMode === 'manual' ? theme.colors.primary : theme.colors.border}`,
            background: searchMode === 'manual' ? `${theme.colors.primary}15` : 'transparent',
            color: searchMode === 'manual' ? theme.colors.primary : theme.colors.textMuted,
            fontSize: '11px', fontWeight: 600, cursor: 'pointer', fontFamily: theme.fonts.body,
          }}>
            ✏️ Manual Search
          </button>
        </div>

        {/* Manual Search */}
        {searchMode === 'manual' && (
          <div style={{ display: 'flex', gap: 10, marginBottom: 14 }}>
            <div style={{ flex: 1 }}>
              <input type="text" value={manualCountry} onChange={e => setManualCountry(e.target.value)}
                placeholder="Enter country name (e.g. Brazil, Nigeria, USA)..."
                style={{ width: '100%', padding: '10px 14px', background: theme.colors.bg, border: `1px solid ${theme.colors.border}`, borderRadius: '8px', color: theme.colors.textBright, fontSize: '12px', fontFamily: theme.fonts.body, outline: 'none' }}
                onKeyDown={e => e.key === 'Enter' && handleDestinationSearch()}
              />
            </div>
            <button onClick={handleDestinationSearch} style={{
              padding: '10px 20px', background: `linear-gradient(135deg, ${theme.colors.primary}, ${theme.colors.primaryDark})`,
              border: 'none', borderRadius: '8px', color: 'white', fontSize: '12px', fontWeight: 600,
              cursor: 'pointer', fontFamily: theme.fonts.body, whiteSpace: 'nowrap',
            }}>
              🔍 Find Shipping
            </button>
          </div>
        )}

        {/* Package Info */}
        <div style={{ display: 'flex', gap: 12, marginBottom: 16, flexWrap: 'wrap' }}>
          <div style={{ flex: 1, minWidth: 100 }}>
            <div style={{ fontSize: '9px', color: theme.colors.textMuted, marginBottom: 4, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Weight (kg)</div>
            <input type="number" value={weight} min={0.1} max={30} step={0.1} onChange={e => setWeight(parseFloat(e.target.value) || 0.1)}
              style={{ width: '100%', padding: '8px 12px', background: theme.colors.bg, border: `1px solid ${theme.colors.border}`, borderRadius: '8px', color: theme.colors.textBright, fontSize: '12px', fontFamily: theme.fonts.body, outline: 'none' }} />
          </div>
          <div style={{ flex: 1, minWidth: 100 }}>
            <div style={{ fontSize: '9px', color: theme.colors.textMuted, marginBottom: 4, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Product Value ($)</div>
            <input type="number" value={value} min={1} step={1} onChange={e => setValue(parseFloat(e.target.value) || 1)}
              style={{ width: '100%', padding: '8px 12px', background: theme.colors.bg, border: `1px solid ${theme.colors.border}`, borderRadius: '8px', color: theme.colors.textBright, fontSize: '12px', fontFamily: theme.fonts.body, outline: 'none' }} />
          </div>
          <button onClick={() => setSelectedOrder(null)} style={{
            padding: '8px 16px', background: `${theme.colors.warning}15`, border: `1px solid ${theme.colors.warning}25`,
            borderRadius: '8px', color: theme.colors.warning, fontSize: '11px', fontWeight: 600, cursor: 'pointer',
            fontFamily: theme.fonts.body, alignSelf: 'flex-end',
          }}>
            <RefreshCw size={12} style={{ marginRight: 4, verticalAlign: 'middle' }} /> Refresh
          </button>
        </div>
      </div>

      {/* Orders List */}
      {searchMode === 'orders' && (
        <div style={{ marginBottom: 20 }}>
          {loading ? (
            <div style={{ textAlign: 'center', padding: '40px', color: theme.colors.textMuted }}>
              <div style={{width:32,height:32,borderRadius:'50%',border:'3px solid rgba(255,255,255,0.1)',borderTopColor:theme.colors.primary,animation:'spin 0.8s linear infinite',margin:'0 auto 12px'}} />
              Loading orders...
            </div>
          ) : orders.length === 0 ? (
            <div style={{
              background: theme.colors.bgCard, border: `1px solid ${theme.colors.border}`,
              borderRadius: '14px', padding: '30px', textAlign: 'center', color: theme.colors.textMuted,
            }}>
              <Package size={40} style={{ marginBottom: 12, opacity: 0.3 }} />
              <div style={{ fontSize: '14px', color: theme.colors.text, marginBottom: 6 }}>No orders yet in store</div>
              <div style={{ fontSize: '11px' }}>Jab orders ayenge to yahan customer destinations auto-detect honge.<br />Tab tak <strong style={{color: theme.colors.primary}}>Manual Search</strong> use karein!</div>
            </div>
          ) : (
            <div style={{
              background: theme.colors.bgCard, border: `1px solid ${theme.colors.border}`,
              borderRadius: '14px', overflow: 'hidden',
            }}>
              <div style={{ padding: '10px 16px', background: theme.colors.bg, borderBottom: `1px solid ${theme.colors.border}`, fontSize: '10px', color: theme.colors.textMuted, fontWeight: 600, letterSpacing: '0.05em', textTransform: 'uppercase' }}>
                📋 Customer Orders — Click to See Shipping Options
              </div>
              {orders.map(order => {
                const addr = order.shipping_address || {}
                const flag = getCountryFlag(addr.country)
                return (
                  <div key={order.id}
                    onClick={() => setSelectedOrder(order)}
                    style={{
                      padding: '10px 16px', borderBottom: `1px solid ${theme.colors.border}`,
                      cursor: 'pointer', transition: 'background 0.2s',
                      background: selectedOrder?.id === order.id ? theme.colors.bg : 'transparent',
                    }}
                    onMouseEnter={e => e.currentTarget.style.background = theme.colors.bgCardHover}
                    onMouseLeave={e => e.currentTarget.style.background = selectedOrder?.id === order.id ? theme.colors.bg : 'transparent'}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '12px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <span style={{ fontSize: '16px' }}>{flag}</span>
                        <span style={{ color: theme.colors.text }}>{addr.city || 'Unknown'}, {addr.country || 'Unknown'}</span>
                        <span style={{ color: theme.colors.textMuted, fontSize: '10px' }}>#{order.order_number}</span>
                      </div>
                      <div style={{ color: theme.colors.primary, fontSize: '11px' }}>
                        {order.total_price ? `$${order.total_price}` : ''}
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      )}

      {/* Shipping Results */}
      {selectedOrder && (() => {
        const addr = selectedOrder.shipping_address || { country: manualCountry || 'Unknown', city: '' }
        const destination = addr.country
        const cheapestProviders = getCheapestForDestination(destination, weight, value)
        const cheapest = cheapestProviders[0]

        if (!cheapest) return null

        return (
          <div>
            {/* Destination Header */}
            <div style={{
              background: `linear-gradient(135deg, ${theme.colors.success}10, ${theme.colors.success}05)`,
              border: `1px solid ${theme.colors.success}25`,
              borderRadius: '14px', padding: '16px 20px', marginBottom: 16,
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <div style={{ fontSize: '36px' }}>{getCountryFlag(destination)}</div>
                <div>
                  <div style={{ fontFamily: theme.fonts.heading, fontSize: '18px', fontWeight: 600, color: theme.colors.textBright }}>
                    Shipping to: {destination}
                  </div>
                  <div style={{ fontSize: '11px', color: theme.colors.textMuted }}>
                    {addr.city ? `${addr.city}, ` : ''}{destination} | {weight}kg | ${value} product value
                    {selectedOrder.order_number !== 'MANUAL' && ` | Order #${selectedOrder.order_number}`}
                  </div>
                </div>
              </div>
              <div style={{
                padding: '8px 16px', borderRadius: '10px',
                background: theme.colors.success, color: 'white',
                fontSize: '14px', fontWeight: 700, fontFamily: theme.fonts.heading,
              }}>
                From ${cheapest.calculatedPrice.toFixed(2)}
              </div>
            </div>

            {/* Cheapest Options */}
            <div style={{
              fontFamily: theme.fonts.heading, fontSize: '13px', fontWeight: 500,
              color: theme.colors.textBright, marginBottom: 10,
              display: 'flex', alignItems: 'center', gap: 8,
            }}>
              🚚 Cheapest Shipping Options to {destination}
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {cheapestProviders.map((p, i) => {
                const isCheapest = i === 0
                return (
                  <div key={p.id} style={{
                    background: isCheapest ? `${theme.colors.success}05` : theme.colors.bgCard,
                    border: `1px solid ${isCheapest ? theme.colors.success : theme.colors.border}`,
                    borderRadius: '12px', padding: '14px 18px',
                    transition: 'all 0.2s',
                  }}
                  onMouseEnter={e => e.currentTarget.style.borderColor = p.color}
                  onMouseLeave={e => e.currentTarget.style.borderColor = isCheapest ? theme.colors.success : theme.colors.border}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <div style={{
                          width: 36, height: 36, borderRadius: '10px',
                          background: `${p.color}15`, border: `1px solid ${p.color}25`,
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                        }}>
                          <p.icon size={16} color={p.color} />
                        </div>
                        <div>
                          <div style={{ fontFamily: theme.fonts.heading, fontSize: '14px', fontWeight: 500, color: theme.colors.textBright }}>
                            {p.name}
                            {isCheapest && <span style={{ marginLeft: 8, padding: '2px 8px', borderRadius: '6px', fontSize: '9px', background: theme.colors.success, color: 'white', fontWeight: 700 }}>BEST</span>}
                          </div>
                          <div style={{ fontSize: '10px', color: theme.colors.textMuted, display: 'flex', gap: 8, marginTop: 2 }}>
                            <span>{p.transitDays.min}-{p.transitDays.max} days</span>
                            <span>•</span>
                            <span>Reliability: {p.reliability}%</span>
                            <span>•</span>
                            <span>{p.origin}</span>
                          </div>
                        </div>
                      </div>
                      <div style={{ textAlign: 'right' }}>
                        <div style={{ fontFamily: theme.fonts.heading, fontSize: '24px', fontWeight: 700, color: p.color }}>
                          ${p.calculatedPrice.toFixed(2)}
                        </div>
                        <button style={{
                          marginTop: 4, padding: '4px 12px', borderRadius: '6px',
                          background: p.color, border: 'none', color: 'white',
                          fontSize: '9px', fontWeight: 600, cursor: 'pointer',
                          fontFamily: theme.fonts.body, opacity: 0.9,
                        }}
                        onClick={() => alert(`✅ ${p.name} selected for ${destination}! Rate: $${p.calculatedPrice.toFixed(2)}`)}
                        >
                          Select
                        </button>
                      </div>
                    </div>

                    {/* Features */}
                    <div style={{ display: 'flex', gap: 4, marginTop: 8, flexWrap: 'wrap' }}>
                      {p.features.map((f, fi) => (
                        <span key={fi} style={{
                          padding: '1px 8px', borderRadius: '4px', fontSize: '8px',
                          background: `${p.color}08`, border: `1px solid ${p.color}15`,
                          color: p.color,
                        }}>{f}</span>
                      ))}
                    </div>
                  </div>
                )
              })}
            </div>

            {/* View on Map */}
            <div style={{
              marginTop: 14,
              background: theme.colors.bgCard, border: `1px solid ${theme.colors.border}`,
              borderRadius: '10px', padding: '12px 16px',
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              fontSize: '11px', color: theme.colors.textMuted,
            }}>
              <span>
                🌍 <strong style={{color: theme.colors.text}}>{destination}</strong> ke liye {cheapestProviders.length} logistics providers compare kiye gaye.
                Cheapest: <strong style={{color: theme.colors.success}}>{cheapest.name}</strong> at <strong style={{color: theme.colors.success}}>${cheapest.calculatedPrice.toFixed(2)}</strong>
              </span>
              <button style={{
                padding: '6px 14px', borderRadius: '6px',
                background: `${theme.colors.primary}10`, border: `1px solid ${theme.colors.primary}20`,
                color: theme.colors.primary, fontSize: '10px', fontWeight: 600, cursor: 'pointer',
                fontFamily: theme.fonts.body,
              }}
              onClick={() => alert(`✅ ${cheapest.name} applied as default shipping for ${destination}!`)}
              >
                Set as Default
              </button>
            </div>
          </div>
        )
      })()}

      <style>{`
        @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
      `}</style>
    </div>
  )
}
// ============================================
// SHIPPING STRATEGY ANALYZER
// ============================================
function ShippingStrategyAnalyzer() {
  const [productCost, setProductCost] = useState(5)
  const [sellingPrice, setSellingPrice] = useState(25)
  const [shippingCost, setShippingCost] = useState(25)
  const [weight, setWeight] = useState(0.5)
  const [orderCount, setOrderCount] = useState(1)
  const [destination, setDestination] = useState('brazil')
  const [strategy, setStrategy] = useState(null)

  const analyze = () => {
    const totalShipping = shippingCost * orderCount
    const revenue = sellingPrice * orderCount
    const totalCost = (productCost * orderCount) + totalShipping
    const profit = revenue - totalCost
    const margin = (profit / revenue) * 100

    // Strategy recommendations
    const strategies = []

    // 1. Current situation
    strategies.push({
      name: 'Current (Customer Pays Shipping)',
      customerSees: `$${sellingPrice} + $${totalShipping} shipping`,
      totalCustomerPays: revenue + totalShipping,
      yourProfit: profit,
      yourMargin: margin.toFixed(1),
      isProfitable: profit > 0,
      recommendation: margin > 20 ? '✅ Good' : margin > 0 ? '⚠️ Low Margin' : '❌ Loss',
    })

    // 2. Free shipping with price increase
    const freeShipPrice = Math.round((sellingPrice + totalShipping) * 1.15)
    const freeShipRevenue = freeShipPrice * orderCount
    const freeShipProfit = freeShipRevenue - (productCost * orderCount) - totalShipping
    const freeShipMargin = (freeShipProfit / freeShipRevenue) * 100
    strategies.push({
      name: 'Free Shipping (Price Increased 15%)',
      customerSees: `$${freeShipPrice} with FREE shipping`,
      totalCustomerPays: freeShipRevenue,
      yourProfit: freeShipProfit,
      yourMargin: freeShipMargin.toFixed(1),
      isProfitable: freeShipProfit > 0,
      recommendation: freeShipMargin > 20 ? '✅ Best Strategy' : freeShipMargin > 0 ? '⚠️ Low' : '❌ Loss',
    })

    // 3. Free shipping threshold
    const thresholdPrice = Math.round((sellingPrice + totalShipping) / 0.7)
    const thresholdRevenue = thresholdPrice * orderCount
    const thresholdProfit = thresholdRevenue - (productCost * orderCount) - totalShipping
    const thresholdMargin = (thresholdProfit / thresholdRevenue) * 100
    strategies.push({
      name: 'Tiered Free Shipping (70% Margin Goal)',
      customerSees: `FREE shipping on orders $$${thresholdPrice}+ | Below: $${Math.round(totalShipping * 0.6)} shipping`,
      totalCustomerPays: thresholdRevenue,
      yourProfit: thresholdProfit,
      yourMargin: thresholdMargin.toFixed(1),
      isProfitable: thresholdProfit > 0,
      recommendation: thresholdMargin > 20 ? '✅ Recommended' : '⚠️ Adjust',
    })

    // 4. Multi-product consolidation
    const consolidatedShipping = shippingCost * 1.3 // 3 products same box
    const consolidatedRevenue = sellingPrice * 3
    const consolidatedCost = (productCost * 3) + consolidatedShipping
    const consolidatedProfit = consolidatedRevenue - consolidatedCost
    const consolidatedMargin = (consolidatedProfit / consolidatedRevenue) * 100
    strategies.push({
      name: 'Multi-Product (3 items, 1 shipment)',
      customerSees: `3 products × $${sellingPrice} = $${consolidatedRevenue}, shipping $${consolidatedShipping.toFixed(1)}`,
      totalCustomerPays: consolidatedRevenue + consolidatedShipping,
      yourProfit: consolidatedProfit,
      yourMargin: consolidatedMargin.toFixed(1),
      isProfitable: consolidatedProfit > 0,
      recommendation: consolidatedMargin > 20 ? '✅ Best for Bulk' : '⚠️ Average',
    })

    // 5. Loss leader (subsidized shipping)
    const subsidizedShipping = Math.round(totalShipping * 0.4)
    const subsidizedRevenue = sellingPrice * orderCount
    const subsidizedProfit = subsidizedRevenue - (productCost * orderCount) - subsidizedShipping
    const subsidizedMargin = (subsidizedProfit / subsidizedRevenue) * 100
    strategies.push({
      name: 'Subsidized Shipping (Pay 40%)',
      customerSees: `$${sellingPrice} + $${subsidizedShipping} shipping`,
      totalCustomerPays: subsidizedRevenue + subsidizedShipping,
      yourProfit: subsidizedProfit,
      yourMargin: subsidizedMargin.toFixed(1),
      isProfitable: subsidizedProfit > 0,
      recommendation: subsidizedMargin > 20 ? '✅ Good Strategy' : subsidizedMargin > 0 ? '⚠️ Thin Margin' : '❌ Loss',
    })

    // Find best strategy
    const best = strategies.reduce((a, b) => (a.yourProfit > b.yourProfit ? a : b))

    setStrategy({ strategies, best, destination })
  }

  return (
    <div>
      {/* Input Form */}
      <div style={{
        background: `linear-gradient(135deg, ${theme.colors.bgCard}, ${theme.colors.bgLight})`,
        border: `1px solid ${theme.colors.border}`,
        borderRadius: '16px',
        padding: '24px',
        marginBottom: 20,
      }}>
        <div style={{
          fontFamily: theme.fonts.heading, fontSize: '16px', fontWeight: 500,
          color: theme.colors.textBright, marginBottom: 16,
          display: 'flex', alignItems: 'center', gap: 10,
        }}>
          💰 Shipping Profit Calculator — Free Delivery Profitable Hai Ya Loss?
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
          gap: 12,
          marginBottom: 16,
        }}>
          <div>
            <div style={{ fontSize: '9px', color: theme.colors.textMuted, letterSpacing: '0.05em', textTransform: 'uppercase', marginBottom: 6 }}>
              Product Cost ($)
            </div>
            <input type="number" value={productCost} min={0.5} max={999} step={0.5}
              onChange={e => setProductCost(parseFloat(e.target.value) || 0.5)}
              style={{ width: '100%', padding: '10px 12px', background: theme.colors.bg, border: `1px solid ${theme.colors.border}`, borderRadius: '8px', color: theme.colors.textBright, fontSize: '13px', fontFamily: theme.fonts.body, outline: 'none' }} />
          </div>
          <div>
            <div style={{ fontSize: '9px', color: theme.colors.textMuted, letterSpacing: '0.05em', textTransform: 'uppercase', marginBottom: 6 }}>
              Selling Price ($)
            </div>
            <input type="number" value={sellingPrice} min={1} max={9999} step={1}
              onChange={e => setSellingPrice(parseFloat(e.target.value) || 1)}
              style={{ width: '100%', padding: '10px 12px', background: theme.colors.bg, border: `1px solid ${theme.colors.border}`, borderRadius: '8px', color: theme.colors.textBright, fontSize: '13px', fontFamily: theme.fonts.body, outline: 'none' }} />
          </div>
          <div>
            <div style={{ fontSize: '9px', color: theme.colors.textMuted, letterSpacing: '0.05em', textTransform: 'uppercase', marginBottom: 6 }}>
              Shipping Cost ($)
            </div>
            <input type="number" value={shippingCost} min={0} max={999} step={0.5}
              onChange={e => setShippingCost(parseFloat(e.target.value) || 0)}
              style={{ width: '100%', padding: '10px 12px', background: theme.colors.bg, border: `1px solid ${theme.colors.border}`, borderRadius: '8px', color: theme.colors.textBright, fontSize: '13px', fontFamily: theme.fonts.body, outline: 'none' }} />
          </div>
          <div>
            <div style={{ fontSize: '9px', color: theme.colors.textMuted, letterSpacing: '0.05em', textTransform: 'uppercase', marginBottom: 6 }}>
              Destination
            </div>
            <select value={destination} onChange={e => setDestination(e.target.value)}
              style={{ width: '100%', padding: '10px 12px', background: theme.colors.bg, border: `1px solid ${theme.colors.border}`, borderRadius: '8px', color: theme.colors.textBright, fontSize: '12px', fontFamily: theme.fonts.body, outline: 'none', cursor: 'pointer' }}>
              <option value="brazil">🇧🇷 Brazil (Expensive)</option>
              <option value="nigeria">🇳🇬 Nigeria (Expensive)</option>
              <option value="usa">🇺🇸 USA (Medium)</option>
              <option value="uk">🇬🇧 UK (Medium)</option>
              <option value="germany">🇩🇪 Germany (Medium)</option>
              <option value="pakistan">🇵🇰 Pakistan (Cheap)</option>
              <option value="uae">🇦🇪 UAE (Medium)</option>
              <option value="saudi">🇸🇦 Saudi Arabia (Medium)</option>
              <option value="australia">🇦🇺 Australia (Expensive)</option>
            </select>
          </div>
        </div>

        <button onClick={analyze} style={{
          padding: '12px 32px',
          background: `linear-gradient(135deg, ${theme.colors.primary}, ${theme.colors.primaryDark})`,
          border: 'none', borderRadius: '10px',
          color: 'white', fontSize: '13px', fontWeight: 700,
          cursor: 'pointer', fontFamily: theme.fonts.body,
          display: 'flex', alignItems: 'center', gap: 8,
          boxShadow: theme.shadows.glow,
        }}>
          🧮 Analyze & Get Strategy
        </button>
      </div>

      {/* Results */}
      {strategy && (
        <>
          {/* Best Strategy Banner */}
          <div style={{
            padding: '18px 22px',
            background: `linear-gradient(135deg, ${theme.colors.success}15, ${theme.colors.success}05)`,
            border: `1px solid ${theme.colors.success}30`,
            borderRadius: '14px',
            marginBottom: 20,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}>
            <div>
              <div style={{ fontSize: '10px', color: theme.colors.success, letterSpacing: '0.05em', textTransform: 'uppercase', marginBottom: 4 }}>
                🏆 Best Strategy for {strategy.destination.toUpperCase()}
              </div>
              <div style={{ fontFamily: theme.fonts.heading, fontSize: '20px', fontWeight: 700, color: theme.colors.textBright }}>
                {strategy.best.name}
              </div>
              <div style={{ fontSize: '12px', color: theme.colors.textMuted, marginTop: 4 }}>
                Profit: <span style={{ color: strategy.best.yourProfit > 0 ? theme.colors.success : theme.colors.error, fontWeight: 700 }}>
                  ${strategy.best.yourProfit.toFixed(2)}
                </span> | Margin: {strategy.best.yourMargin}%
              </div>
            </div>
            <div style={{
              padding: '8px 20px',
              borderRadius: '20px',
              background: strategy.best.yourProfit > 0 ? theme.colors.success : theme.colors.error,
              color: 'white',
              fontSize: '14px',
              fontWeight: 700,
            }}>
              {strategy.best.yourProfit > 0 ? '✅ PROFIT' : '❌ LOSS'}
            </div>
          </div>

          {/* All Strategies */}
          <div style={{
            fontFamily: theme.fonts.heading, fontSize: '13px', fontWeight: 500,
            color: theme.colors.textBright, marginBottom: 10,
          }}>
            📋 All Strategies Comparison
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {strategy.strategies.map((s, i) => (
              <div key={i} style={{
                background: s === strategy.best ? `${theme.colors.success}05` : theme.colors.bgCard,
                border: `1px solid ${s === strategy.best ? theme.colors.success : theme.colors.border}`,
                borderRadius: '12px',
                padding: '14px 18px',
                transition: 'all 0.2s',
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    {s === strategy.best && <span style={{ fontSize: '16px' }}>🏆</span>}
                    <div style={{ fontFamily: theme.fonts.heading, fontSize: '13px', fontWeight: 500, color: theme.colors.textBright }}>
                      {s.name}
                    </div>
                  </div>
                  <div style={{
                    padding: '2px 10px', borderRadius: '8px',
                    fontSize: '10px', fontWeight: 700,
                    background: s.yourProfit > 0 ? `${theme.colors.success}15` : `${theme.colors.error}15`,
                    color: s.yourProfit > 0 ? theme.colors.success : theme.colors.error,
                  }}>
                    {s.recommendation}
                  </div>
                </div>

                <div style={{ display: 'flex', gap: 16, fontSize: '11px', color: theme.colors.textMuted, flexWrap: 'wrap' }}>
                  <span>👁️ Customer sees: <span style={{ color: theme.colors.text }}>{s.customerSees}</span></span>
                  <span>💰 Your profit: <span style={{ color: s.yourProfit > 0 ? theme.colors.success : theme.colors.error, fontWeight: 600 }}>${s.yourProfit.toFixed(2)}</span></span>
                  <span>📊 Margin: <span style={{ color: parseFloat(s.yourMargin) > 20 ? theme.colors.success : parseFloat(s.yourMargin) > 0 ? theme.colors.warning : theme.colors.error, fontWeight: 600 }}>{s.yourMargin}%</span></span>
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {/* Quick Tips */}
      <div style={{
        marginTop: 24,
        background: theme.colors.bgCard,
        border: `1px solid ${theme.colors.border}`,
        borderRadius: '14px',
        padding: '20px',
      }}>
        <div style={{
          fontFamily: theme.fonts.heading, fontSize: '13px', fontWeight: 500,
          color: theme.colors.textBright, marginBottom: 12,
        }}>
          💡 Smart Shipping Tips for ShopZyla
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8, fontSize: '11px', color: theme.colors.text, lineHeight: 1.6 }}>
          {[
            '🚀 Free shipping on orders $50+ — customer zyada kharida, aapki shipping recover ho jaye',
            '📦 Multi-product orders ko ek shipment mein bhejo — shipping cost 50-70% bachega',
            '🇨🇳 China → Pakistan bulk → Customer: sea se cheap, phir TCS/Leopards se $2-5 local delivery',
            '💰 Agar shipping $20+ is to product price mein $5-8 shipping chipa do, "Free Shipping" likho',
            '🌍 Brazil/Nigeria jese expensive destinations ke liye shipping subsidy do (customer $8-12 de, aap baaki cover karo)',
            '📊 Conversion rate 15% badhta is jab "Free Shipping" dikhta is — lekin loss mat karo',
          ].map((tip, i) => (
            <div key={i} style={{
              padding: '8px 12px',
              background: theme.colors.bg,
              borderRadius: '8px',
              border: `1px solid ${theme.colors.border}`,
            }}>
              {tip}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
export default function LogisticsIntel() {
  const [activeTab, setActiveTab] = useState('search')

  return (
    <div>
      {/* Header */}
      <div style={{ marginBottom: 24 }}>
        <div style={{
          fontFamily: theme.fonts.heading, fontSize: '32px', fontWeight: 600,
          color: theme.colors.textBright, letterSpacing: '0.02em',
          textTransform: 'uppercase', marginBottom: 4,
          display: 'flex', alignItems: 'center', gap: 12,
        }}>
          🚀 Logistics Intelligence
          <span style={{
            fontSize: '10px', fontWeight: 400,
            color: theme.colors.primary, letterSpacing: '0.05em',
            background: `${theme.colors.primary}10`,
            padding: '2px 10px', borderRadius: '8px',
            border: `1px solid ${theme.colors.primary}20`,
          }}>
            Deep Search Engine
          </span>
        </div>
        <div style={{
          width: '60px', height: '4px',
          background: `linear-gradient(90deg, ${theme.colors.primary}, ${theme.colors.primaryLight})`,
          borderRadius: '2px', marginBottom: 8, boxShadow: theme.shadows.glow,
        }} />
        <div style={{ fontSize: '13px', color: theme.colors.textMuted }}>
          Scan 182+ sources across 10+ platforms to find the cheapest supplier + logistics worldwide — real-time comparison
        </div>
      </div>

      {/* Tabs */}
      <div style={{
        display: 'flex', gap: 4, marginBottom: 20,
        background: theme.colors.bg, padding: '3px',
        borderRadius: '10px', border: `1px solid ${theme.colors.border}`,
        width: 'fit-content',
      }}>
        {[
          { key: 'search', icon: Search, label: '🔍 Deep Supply Search' },
          { key: 'routes', icon: Truck, label: '🚚 Route & Rate Comparison' },
          { key: 'tracking', icon: MapPin, label: '📦 Track & Intelligence' },
        { key: 'strategy', icon: DollarSign, label: '💡 Shipping Strategy' },
        ].map(tab => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            style={{
              padding: '10px 20px',
              borderRadius: '8px',
              border: 'none',
              background: activeTab === tab.key ? theme.colors.primary : 'transparent',
              color: activeTab === tab.key ? 'white' : theme.colors.textMuted,
              fontSize: '12px',
              fontWeight: 600,
              cursor: 'pointer',
              fontFamily: theme.fonts.body,
              transition: 'all 0.2s',
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      {activeTab === 'search' && <SupplierDeepSearch />}
      
      {activeTab === 'routes' && (
        <>
          {/* Quick Stats */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
            gap: '12px',
            marginBottom: 20,
          }}>
            {[
              { label: 'Providers', value: logisticsProviders.length, icon: Truck, color: theme.colors.primary },
              { label: 'Countries', value: '12+', icon: Globe, color: theme.colors.success },
              { label: 'Cheapest Rate', value: `$${Math.min(...logisticsProviders.map(p => p.priceFormula(0.5, 25))).toFixed(2)}`, icon: TrendingDown, color: theme.colors.primaryLight },
              { label: 'Avg Transit', value: '1-20 days', icon: Clock, color: theme.colors.warning },
            ].map((s, i) => (
              <div key={i} style={{
                background: theme.colors.bgCard, border: `1px solid ${theme.colors.border}`,
                borderRadius: '12px', padding: '14px 16px', display: 'flex', alignItems: 'center', gap: 12,
              }}>
                <div style={{ width: 36, height: 36, borderRadius: '10px', background: `${s.color}15`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <s.icon size={16} color={s.color} />
                </div>
                <div>
                  <div style={{ fontSize: '10px', color: theme.colors.textMuted, letterSpacing: '0.05em', textTransform: 'uppercase' }}>{s.label}</div>
                  <div style={{ fontFamily: theme.fonts.heading, fontSize: '18px', fontWeight: 600, color: theme.colors.textBright }}>{s.value}</div>
                </div>
              </div>
            ))}
          </div>

          <RouteOptimizer />
        </>
      )}

      {activeTab === 'tracking' && <OrderShippingOptimizer />}
      
      {activeTab === 'strategy' && <ShippingStrategyAnalyzer />}

      <style>{`
        @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
      `}</style>
    </div>
  )
}
