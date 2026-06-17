import { useState } from 'react'
import { Globe, Link, Upload, CheckCircle, AlertTriangle, RefreshCw, ExternalLink, Package, DollarSign, Image, List, Sparkles } from 'lucide-react'
import { theme } from '../theme'

function ProductPreview({ product, onImport, importing }) {
  return (
    <div style={{
      background: theme.colors.bgCard,
      border: `1px solid ${theme.colors.border}`,
      borderRadius: '16px',
      overflow: 'hidden',
      transition: 'all 0.3s',
    }}
    onMouseEnter={e => e.currentTarget.style.borderColor = theme.colors.primaryDark}
    onMouseLeave={e => e.currentTarget.style.borderColor = theme.colors.border}
    >
      <div style={{ display: 'flex', gap: 20, padding: 20 }}>
        {/* Thumbnail */}
        <div style={{
          width: 140,
          height: 140,
          borderRadius: '12px',
          overflow: 'hidden',
          flexShrink: 0,
          background: theme.colors.bg,
        }}>
          <img src={product.image} alt={product.title} style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
          }} />
        </div>

        {/* Details */}
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{
            fontFamily: theme.fonts.heading,
            fontSize: '16px',
            fontWeight: 500,
            color: theme.colors.textBright,
            marginBottom: 8,
          }}>
            {product.title}
          </div>
          
          <div style={{ display: 'flex', gap: 16, marginBottom: 10, flexWrap: 'wrap' }}>
            <div style={{ fontSize: '12px', color: theme.colors.textMuted }}>
              <DollarSign size={12} style={{ verticalAlign: 'middle', color: theme.colors.primary }} />{' '}
              Cost: <span style={{ color: theme.colors.primary, fontWeight: 600 }}>${product.costPrice}</span>
            </div>
            <div style={{ fontSize: '12px', color: theme.colors.textMuted }}>
              <Package size={12} style={{ verticalAlign: 'middle', color: theme.colors.success }} />{' '}
              Sell: <span style={{ color: theme.colors.success, fontWeight: 600 }}>${product.sellPrice}</span>
            </div>
            <div style={{ fontSize: '12px', color: theme.colors.textMuted }}>
              <Image size={12} style={{ verticalAlign: 'middle', color: theme.colors.warning }} />{' '}
              {product.images} images
            </div>
            <div style={{ fontSize: '12px', color: theme.colors.textMuted }}>
              <List size={12} style={{ verticalAlign: 'middle', color: theme.colors.primaryLight }} />{' '}
              {product.variants} variants
            </div>
          </div>

          <div style={{ fontSize: '11px', color: theme.colors.textMuted, lineHeight: 1.6, marginBottom: 12 }}>
            {product.description?.substring(0, 200)}...
          </div>

          {/* Variants Preview */}
          {product.variantList && (
            <div style={{
              display: 'flex',
              gap: 6,
              flexWrap: 'wrap',
              marginBottom: 12,
            }}>
              {product.variantList.map((v, i) => (
                <span key={i} style={{
                  padding: '3px 10px',
                  borderRadius: '12px',
                  fontSize: '10px',
                  background: `${theme.colors.primary}10`,
                  border: `1px solid ${theme.colors.primary}20`,
                  color: theme.colors.textMuted,
                }}>
                  {v.name}: {v.value}
                </span>
              ))}
            </div>
          )}

          <button
            onClick={() => onImport(product)}
            disabled={importing}
            style={{
              padding: '10px 24px',
              background: `linear-gradient(135deg, ${theme.colors.primary}, ${theme.colors.primaryDark})`,
              border: 'none',
              borderRadius: '10px',
              color: 'white',
              fontSize: '13px',
              fontWeight: 600,
              cursor: importing ? 'not-allowed' : 'pointer',
              fontFamily: theme.fonts.body,
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              opacity: importing ? 0.5 : 1,
              boxShadow: theme.shadows.glow,
            }}
          >
            <Upload size={16} />
            {importing ? 'Importing...' : 'Import to Shopify'}
          </button>
        </div>
      </div>
    </div>
  )
}

export default function Import1688() {
  const [url, setUrl] = useState('')
  const [loading, setLoading] = useState(false)
  const [product, setProduct] = useState(null)
  const [error, setError] = useState(null)
  const [importing, setImporting] = useState(false)
  const [history, setHistory] = useState([])

  const handleParse = async () => {
    if (!url.trim()) return
    setLoading(true)
    setError(null)
    setProduct(null)

    // Simulate parsing 1688 URL
    await new Promise(r => setTimeout(r, 2000))

    // In production: actual 1688 scraper/parser
    const mockProduct = {
      title: '高端智能手机壳防摔保护壳适用于iPhone 15 Pro Max',
      translatedTitle: 'Premium Anti-Drop Phone Case for iPhone 15 Pro Max',
      costPrice: (Math.random() * 5 + 2).toFixed(2),
      sellPrice: (Math.random() * 20 + 15).toFixed(2),
      images: Math.floor(Math.random() * 5) + 3,
      variants: Math.floor(Math.random() * 8) + 2,
      image: 'https://via.placeholder.com/400x400.png?text=1688+Product',
      description: 'High quality phone case made from premium materials. Compatible with iPhone 15 Pro Max. Features anti-drop protection, shockproof design, and precise cutouts for all ports and buttons.',
      variantList: [
        { name: 'Color', value: 'Black/White/Blue/Pink' },
        { name: 'Material', value: 'Silicone/Plastic/Leather' },
      ],
    }

    setProduct(mockProduct)
    setLoading(false)
  }

  const handleImport = async (prod) => {
    setImporting(true)
    // Simulate import to Shopify
    await new Promise(r => setTimeout(r, 3000))
    setHistory(prev => [{
      title: prod.translatedTitle || prod.title,
      time: new Date().toLocaleTimeString(),
      status: 'success'
    }, ...prev])
    setImporting(false)
    setProduct(null)
    setUrl('')
  }

  return (
    <div>
      <div style={{ marginBottom: 28 }}>
        <div style={{
          fontFamily: theme.fonts.heading,
          fontSize: '32px',
          fontWeight: 600,
          color: theme.colors.textBright,
          letterSpacing: '0.02em',
          textTransform: 'uppercase',
          marginBottom: 4,
        }}>
          📦 1688 Import Tool
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
          Paste 1688.com / AliExpress / any product URL — auto import to Shopify
        </div>
      </div>

      {/* URL Input */}
      <div style={{
        background: `linear-gradient(135deg, ${theme.colors.bgCard} 0%, ${theme.colors.bgLight} 100%)`,
        border: `1px solid ${theme.colors.border}`,
        borderRadius: '16px',
        padding: '24px 28px',
        marginBottom: 24,
      }}>
        <div style={{
          fontFamily: theme.fonts.heading,
          fontSize: '14px',
          fontWeight: 500,
          color: theme.colors.textBright,
          marginBottom: 12,
          letterSpacing: '0.03em',
        }}>
          Product URL
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
          <div style={{ flex: 1, position: 'relative' }}>
            <Link size={16} style={{
              position: 'absolute', left: 14, top: '50%',
              transform: 'translateY(-50%)',
              color: theme.colors.textMuted,
            }} />
            <input
              type="url"
              value={url}
              onChange={e => setUrl(e.target.value)}
              placeholder="https://detail.1688.com/offer/...  or  https://www.aliexpress.com/item/..."
              style={{
                width: '100%',
                padding: '14px 16px 14px 44px',
                background: theme.colors.bg,
                border: `1px solid ${theme.colors.border}`,
                borderRadius: '10px',
                color: theme.colors.textBright,
                fontSize: '13px',
                fontFamily: theme.fonts.body,
                outline: 'none',
                transition: 'border-color 0.2s',
              }}
              onFocus={e => e.currentTarget.style.borderColor = theme.colors.primary}
              onBlur={e => e.currentTarget.style.borderColor = theme.colors.border}
            />
          </div>
          <button
            onClick={handleParse}
            disabled={loading || !url.trim()}
            style={{
              padding: '14px 28px',
              background: `linear-gradient(135deg, ${theme.colors.primary}, ${theme.colors.primaryDark})`,
              border: 'none',
              borderRadius: '10px',
              color: 'white',
              fontSize: '13px',
              fontWeight: 600,
              cursor: loading || !url.trim() ? 'not-allowed' : 'pointer',
              fontFamily: theme.fonts.body,
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              opacity: loading || !url.trim() ? 0.5 : 1,
              boxShadow: theme.shadows.glow,
            }}
          >
            {loading ? (
              <div style={{width:16,height:16,borderRadius:'50%',border:'2px solid rgba(255,255,255,0.3)',borderTopColor:'white',animation:'spin 0.8s linear infinite'}} />
            ) : <Globe size={16} />}
            {loading ? 'Parsing...' : 'Parse & Import'}
          </button>
        </div>
        <div style={{
          marginTop: 10,
          fontSize: '11px',
          color: theme.colors.textMuted,
          display: 'flex',
          gap: 16,
        }}>
          <span>Supported: 1688.com, AliExpress, Taobao, Made-in-China</span>
        </div>
      </div>

      {/* Error */}
      {error && (
        <div style={{
          padding: '14px 18px',
          background: `${theme.colors.error}10`,
          border: `1px solid ${theme.colors.error}25`,
          borderRadius: '12px',
          color: theme.colors.error,
          fontSize: '12px',
          marginBottom: 20,
          display: 'flex',
          alignItems: 'center',
          gap: 8,
        }}>
          <AlertTriangle size={16} />
          {error}
        </div>
      )}

      {/* Preview */}
      {product && !importing && (
        <ProductPreview product={product} onImport={handleImport} importing={importing} />
      )}

      {importing && (
        <div style={{
          textAlign: 'center',
          padding: '40px',
          color: theme.colors.textMuted,
        }}>
          <div style={{
            width: 48, height: 48,
            borderRadius: '50%',
            border: '3px solid rgba(255,255,255,0.1)',
            borderTopColor: theme.colors.primary,
            animation: 'spin 0.8s linear infinite',
            margin: '0 auto 16px',
          }} />
          <div style={{ fontSize: '14px', color: theme.colors.text }}>Importing to Shopify...</div>
          <div style={{ fontSize: '11px', marginTop: 4 }}>Creating product, uploading images, setting variants</div>
        </div>
      )}

      {/* Import History */}
      {history.length > 0 && (
        <div style={{
          marginTop: 28,
          background: theme.colors.bgCard,
          border: `1px solid ${theme.colors.border}`,
          borderRadius: '14px',
          padding: '20px 24px',
        }}>
          <div style={{
            fontFamily: theme.fonts.heading,
            fontSize: '13px',
            fontWeight: 500,
            color: theme.colors.textBright,
            marginBottom: 14,
            letterSpacing: '0.03em',
            display: 'flex',
            alignItems: 'center',
            gap: 8,
          }}>
            <RefreshCw size={14} color={theme.colors.primaryLight} />
            Import History ({history.length})
          </div>
          {history.map((h, i) => (
            <div key={i} style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '8px 0',
              borderBottom: i < history.length - 1 ? `1px solid ${theme.colors.border}` : 'none',
              fontSize: '12px',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <CheckCircle size={14} color={theme.colors.success} />
                <span style={{ color: theme.colors.text }}>{h.title}</span>
              </div>
              <span style={{ color: theme.colors.textMuted, fontSize: '11px' }}>{h.time}</span>
            </div>
          ))}
        </div>
      )}

      <style>{`
        @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
      `}</style>
    </div>
  )
}
