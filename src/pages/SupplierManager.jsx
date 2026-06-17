import { useState } from 'react'
import { Truck, Globe, Package, DollarSign, Star, Phone, Mail, MapPin, Plus, ExternalLink, CheckCircle, AlertTriangle, Search } from 'lucide-react'
import { theme } from '../theme'

const initialSuppliers = [
  {
    id: 1,
    name: 'Shenzhen Tech Co.',
    platform: '1688',
    url: 'https://shenzhen-tech.1688.com',
    products: 1240,
    avgCost: '$2.40',
    rating: 4.5,
    status: 'active',
    lastSync: '2 hours ago',
    phone: '+86 755-8284-xxxx',
    email: 'contact@shenzhen-tech.com',
    address: 'Shenzhen, Guangdong, China',
  },
  {
    id: 2,
    name: 'Yiwu Global Trading',
    platform: 'AliExpress',
    url: 'https://yiwuglobal.aliexpress.com',
    products: 893,
    avgCost: '$3.80',
    rating: 4.2,
    status: 'active',
    lastSync: '5 hours ago',
    phone: '+86 579-8512-xxxx',
    email: 'info@yiwuglobal.com',
    address: 'Yiwu, Zhejiang, China',
  },
  {
    id: 3,
    name: 'Guangzhou Fashion Hub',
    platform: '1688',
    url: 'https://gz-fashion.1688.com',
    products: 567,
    avgCost: '$5.20',
    rating: 4.0,
    status: 'pending',
    lastSync: '1 day ago',
    phone: '+86 20-3892-xxxx',
    email: 'support@gz-fashion.com',
    address: 'Guangzhou, Guangdong, China',
  },
]

function SupplierCard({ supplier, onSync }) {
  return (
    <div style={{
      background: theme.colors.bgCard,
      border: `1px solid ${supplier.status === 'active' ? theme.colors.success + '30' : theme.colors.border}`,
      borderRadius: '16px',
      padding: '20px',
      transition: 'all 0.3s',
    }}
    onMouseEnter={e => e.currentTarget.style.borderColor = theme.colors.primaryDark}
    onMouseLeave={e => e.currentTarget.style.borderColor = theme.colors.border}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 14 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{
            width: 44, height: 44, borderRadius: '12px',
            background: `linear-gradient(135deg, ${theme.colors.primary}20, ${theme.colors.primaryDark}20)`,
            border: `1px solid ${theme.colors.primaryDark}`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <Truck size={20} color={theme.colors.primary} />
          </div>
          <div>
            <div style={{ fontFamily: theme.fonts.heading, fontSize: '15px', fontWeight: 500, color: theme.colors.textBright }}>
              {supplier.name}
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 2 }}>
              <span style={{
                padding: '2px 8px',
                borderRadius: '6px',
                fontSize: '9px',
                fontWeight: 700,
                background: supplier.platform === '1688' ? `${theme.colors.warning}15` : `${theme.colors.primary}15`,
                color: supplier.platform === '1688' ? theme.colors.warning : theme.colors.primary,
              }}>
                {supplier.platform}
              </span>
              <span style={{
                padding: '2px 8px',
                borderRadius: '6px',
                fontSize: '9px',
                fontWeight: 700,
                background: supplier.status === 'active' ? `${theme.colors.success}15` : `${theme.colors.warning}15`,
                color: supplier.status === 'active' ? theme.colors.success : theme.colors.warning,
              }}>
                {supplier.status === 'active' ? 'Active' : 'Pending'}
              </span>
            </div>
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
          <Star size={14} color={theme.colors.warning} fill={theme.colors.warning} />
          <span style={{ fontSize: '12px', fontWeight: 600, color: theme.colors.textBright }}>{supplier.rating}</span>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginBottom: 14 }}>
        <div style={{ fontSize: '11px', color: theme.colors.textMuted, display: 'flex', alignItems: 'center', gap: 6 }}>
          <Package size={12} color={theme.colors.primaryLight} /> {supplier.products} products
        </div>
        <div style={{ fontSize: '11px', color: theme.colors.textMuted, display: 'flex', alignItems: 'center', gap: 6 }}>
          <DollarSign size={12} color={theme.colors.success} /> Avg: {supplier.avgCost}
        </div>
        <div style={{ fontSize: '11px', color: theme.colors.textMuted, display: 'flex', alignItems: 'center', gap: 6 }}>
          <Globe size={12} color={theme.colors.primary} />
          <a href={supplier.url} target="_blank" rel="noopener noreferrer" style={{ color: theme.colors.primary, textDecoration: 'none' }}>
            Visit <ExternalLink size={10} style={{ verticalAlign: 'middle' }} />
          </a>
        </div>
        <div style={{ fontSize: '11px', color: theme.colors.textMuted, display: 'flex', alignItems: 'center', gap: 6 }}>
          Last sync: {supplier.lastSync}
        </div>
      </div>

      <div style={{
        padding: '10px 12px',
        background: theme.colors.bg,
        borderRadius: '8px',
        marginBottom: 14,
        fontSize: '10px',
        color: theme.colors.textMuted,
        lineHeight: 1.8,
      }}>
        <div><Phone size={10} style={{ verticalAlign: 'middle', marginRight: 4 }} /> {supplier.phone}</div>
        <div><Mail size={10} style={{ verticalAlign: 'middle', marginRight: 4 }} /> {supplier.email}</div>
        <div><MapPin size={10} style={{ verticalAlign: 'middle', marginRight: 4 }} /> {supplier.address}</div>
      </div>

      <div style={{ display: 'flex', gap: 8 }}>
        <button onClick={() => onSync(supplier)} style={{
          flex: 1,
          padding: '8px',
          background: `linear-gradient(135deg, ${theme.colors.primary}, ${theme.colors.primaryDark})`,
          border: 'none',
          borderRadius: '8px',
          color: 'white',
          fontSize: '11px',
          fontWeight: 600,
          cursor: 'pointer',
          fontFamily: theme.fonts.body,
          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
        }}>
          <CheckCircle size={14} /> Sync Products
        </button>
        <button style={{
          padding: '8px 16px',
          background: 'transparent',
          border: `1px solid ${theme.colors.border}`,
          borderRadius: '8px',
          color: theme.colors.textMuted,
          fontSize: '11px',
          cursor: 'pointer',
          fontFamily: theme.fonts.body,
        }}>
          Edit
        </button>
      </div>
    </div>
  )
}

export default function SupplierManager() {
  const [suppliers, setSuppliers] = useState(initialSuppliers)
  const [search, setSearch] = useState('')

  const filteredSuppliers = search
    ? suppliers.filter(s => s.name.toLowerCase().includes(search.toLowerCase()))
    : suppliers

  const handleSync = (supplier) => {
    alert(`🔄 Syncing ${supplier.products} products from ${supplier.name}...`)
  }

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
            🚚 Supplier Manager
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
            Manage 1688, AliExpress, and dropshipping suppliers — {suppliers.length} connected
          </div>
        </div>

        <button style={{
          padding: '10px 20px',
          background: `linear-gradient(135deg, ${theme.colors.primary}, ${theme.colors.primaryDark})`,
          border: 'none',
          borderRadius: '10px',
          color: 'white',
          fontSize: '12px',
          fontWeight: 600,
          cursor: 'pointer',
          fontFamily: theme.fonts.body,
          display: 'flex', alignItems: 'center', gap: 8,
          boxShadow: theme.shadows.glow,
        }}>
          <Plus size={16} /> Add Supplier
        </button>
      </div>

      {/* Search */}
      <div style={{ position: 'relative', marginBottom: 20 }}>
        <Search size={16} style={{
          position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)',
          color: theme.colors.textMuted,
        }} />
        <input
          type="text"
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Search suppliers..."
          style={{
            width: '100%',
            padding: '12px 16px 12px 42px',
            background: theme.colors.bgCard,
            border: `1px solid ${theme.colors.border}`,
            borderRadius: '12px',
            color: theme.colors.textBright,
            fontSize: '13px',
            fontFamily: theme.fonts.body,
            outline: 'none',
          }}
          onFocus={e => e.currentTarget.style.borderColor = theme.colors.primary}
          onBlur={e => e.currentTarget.style.borderColor = theme.colors.border}
        />
      </div>

      {/* Supplier Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))',
        gap: '16px',
      }}>
        {filteredSuppliers.map(s => (
          <SupplierCard key={s.id} supplier={s} onSync={handleSync} />
        ))}
      </div>
    </div>
  )
}
