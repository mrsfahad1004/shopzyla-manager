import { useState, useEffect, useRef } from 'react'
import { Image, Type, Languages, RefreshCw, CheckCircle, AlertTriangle, Download, Upload, Trash2, Search, Sparkles } from 'lucide-react'
import { theme } from '../theme'

// Simple text translation map (Chinese characters to English)
const translationCache = {}

async function translateText(chineseText) {
  if (translationCache[chineseText]) return translationCache[chineseText]
  // For demo - in production this would use a translation API
  const commonTranslations = {
    '高端': 'Premium',
    '智能手机壳': 'Smartphone Case',
    '防摔': 'Shockproof',
    '保护壳': 'Protective Case',
    '适用于': 'Compatible with',
    '女士': 'Women',
    '真皮': 'Genuine Leather',
    '手提包': 'Handbag',
    '大容量': 'Large Capacity',
    '通勤': 'Commuter',
    '托特包': 'Tote Bag',
    '新款': 'New Arrival',
    '男士': 'Men',
    '石英手表': 'Quartz Watch',
    '防水': 'Waterproof',
    '夜光': 'Luminous',
    '运动手表': 'Sports Watch',
    '时尚': 'Fashion',
    '简约': 'Minimalist',
    '商务': 'Business',
    '休闲': 'Casual',
    '精品': 'Premium',
    '热销': 'Best Seller',
    '爆款': 'Trending',
    '定制': 'Custom',
    '批发': 'Wholesale',
    '零售': 'Retail',
  }
  
  let translated = chineseText
  for (const [cn, en] of Object.entries(commonTranslations)) {
    translated = translated.replace(new RegExp(cn, 'g'), en)
  }
  
  // If no translation found, return original
  if (translated === chineseText) {
    translated = `[Translated] ${chineseText}`
  }
  
  translationCache[chineseText] = translated
  return translated
}

// Simulated OCR - in production this would use Tesseract.js
async function detectImageText(imageUrl) {
  // Simulated processing delay
  await new Promise(r => setTimeout(r, 800 + Math.random() * 1200))
  // Return mock detected text (in production: actual OCR)
  const mockTexts = [
    '高端智能手机壳 防摔 保护壳',
    '女士真皮手提包 大容量',
    '时尚石英手表 防水 夜光',
    'Premium Quality Products',
    '新款 男士商务休闲鞋',
    '精品女士手链 时尚饰品',
    '热销手机配件 高品质',
  ]
  return mockTexts[Math.floor(Math.random() * mockTexts.length)]
}

function ImageCard({ product, onProcess, isProcessing, result }) {
  const imgSrc = product.images?.[0]?.src || product.image
  return (
    <div style={{
      background: theme.colors.bgCard,
      border: `1px solid ${result?.status === 'done' ? theme.colors.success + '40' : theme.colors.border}`,
      borderRadius: '14px',
      overflow: 'hidden',
      transition: 'all 0.3s',
    }}>
      <div style={{
        aspectRatio: '1',
        overflow: 'hidden',
        background: theme.colors.bg,
        position: 'relative',
      }}>
        {imgSrc ? (
          <img src={imgSrc} alt={product.title} style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
          }} />
        ) : (
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            height: '100%',
            color: theme.colors.textMuted,
          }}>
            <Image size={32} />
          </div>
        )}
        {result?.status === 'done' && (
          <div style={{
            position: 'absolute',
            top: 8,
            right: 8,
            width: 28,
            height: 28,
            borderRadius: '50%',
            background: theme.colors.success,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
            <CheckCircle size={16} color="white" />
          </div>
        )}
        {isProcessing && (
          <div style={{
            position: 'absolute',
            top: 0, left: 0, right: 0, bottom: 0,
            background: 'rgba(0,0,0,0.6)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
            <div style={{
              width: 32,
              height: 32,
              borderRadius: '50%',
              border: '3px solid rgba(255,255,255,0.2)',
              borderTopColor: theme.colors.primary,
              animation: 'spin 0.8s linear infinite',
            }} />
          </div>
        )}
      </div>
      <div style={{ padding: '10px 12px' }}>
        <div style={{
          fontSize: '11px',
          color: theme.colors.text,
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap',
          marginBottom: 4,
        }}>
          {product.title || 'Unknown'}
        </div>
        {result && (
          <div style={{
            fontSize: '10px',
            color: result.status === 'done' ? theme.colors.success : theme.colors.textMuted,
            fontFamily: 'monospace',
          }}>
            {result.text?.substring(0, 50)}{result.text?.length > 50 ? '...' : ''}
          </div>
        )}
      </div>
    </div>
  )
}

export default function BulkImageEditor() {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [processing, setProcessing] = useState(false)
  const [results, setResults] = useState({})
  const [mode, setMode] = useState('detect') // detect, translate
  const [selectAll, setSelectAll] = useState(false)
  const fileInputRef = useRef(null)

  useEffect(() => {
    loadProducts()
  }, [])

  const loadProducts = async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/shopify/products.json?limit=50&fields=id,title,images,variants')
      if (res.ok) {
        const data = await res.json()
        setProducts(data.products || [])
      }
    } catch (err) {
      console.error('Error:', err)
    }
    setLoading(false)
  }

  const processImages = async () => {
    setProcessing(true)
    setResults({})
    
    const productsToProcess = selectAll ? products : products.slice(0, 10)
    
    for (const product of productsToProcess) {
      const imgSrc = product.images?.[0]?.src
      if (!imgSrc) continue
      
      setResults(prev => ({ ...prev, [product.id]: { status: 'processing' } }))
      
      let text, translated
      if (mode === 'detect') {
        text = await detectImageText(imgSrc)
        translated = text ? await translateText(text) : ''
      } else {
        // Direct title translation
        translated = product.title ? await translateText(product.title) : ''
        text = product.title
      }
      
      setResults(prev => ({
        ...prev,
        [product.id]: { status: 'done', text, translated, original: product.title }
      }))
    }
    
    setProcessing(false)
  }

  const handleFileUpload = (e) => {
    const files = Array.from(e.target.files)
    // For demo - would process uploaded images
    alert(`${files.length} images selected for processing`)
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
            🖼️ Bulk Image Editor
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
            OCR detect + translate text in product images — {products.length} products loaded
          </div>
        </div>
      </div>

      {/* Controls */}
      <div style={{
        background: theme.colors.bgCard,
        border: `1px solid ${theme.colors.border}`,
        borderRadius: '16px',
        padding: '20px 24px',
        marginBottom: 24,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: 12,
      }}>
        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          <button
            onClick={() => setMode('detect')}
            style={{
              padding: '8px 18px',
              borderRadius: '8px',
              border: `1px solid ${mode === 'detect' ? theme.colors.primary : theme.colors.border}`,
              background: mode === 'detect' ? `${theme.colors.primary}15` : 'transparent',
              color: mode === 'detect' ? theme.colors.primary : theme.colors.textMuted,
              fontSize: '12px',
              fontWeight: 600,
              cursor: 'pointer',
              fontFamily: theme.fonts.body,
              display: 'flex',
              alignItems: 'center',
              gap: 6,
            }}
          >
            <Image size={14} /> Image Text Detect
          </button>
          <button
            onClick={() => setMode('translate')}
            style={{
              padding: '8px 18px',
              borderRadius: '8px',
              border: `1px solid ${mode === 'translate' ? theme.colors.success : theme.colors.border}`,
              background: mode === 'translate' ? `${theme.colors.success}15` : 'transparent',
              color: mode === 'translate' ? theme.colors.success : theme.colors.textMuted,
              fontSize: '12px',
              fontWeight: 600,
              cursor: 'pointer',
              fontFamily: theme.fonts.body,
              display: 'flex',
              alignItems: 'center',
              gap: 6,
            }}
          >
            <Languages size={14} /> Translate Text
          </button>
        </div>

        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          <label style={{
            padding: '8px 16px',
            background: `${theme.colors.warning}15`,
            border: `1px solid ${theme.colors.warning}30`,
            borderRadius: '8px',
            color: theme.colors.warning,
            fontSize: '12px',
            fontWeight: 600,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: 6,
            fontFamily: theme.fonts.body,
          }}>
            <Upload size={14} /> Upload Images
            <input ref={fileInputRef} type="file" multiple accept="image/*" onChange={handleFileUpload} style={{ display: 'none' }} />
          </label>
          <label style={{
            display: 'flex',
            alignItems: 'center',
            gap: 6,
            padding: '8px 14px',
            background: theme.colors.bg,
            borderRadius: '8px',
            border: `1px solid ${theme.colors.border}`,
            cursor: 'pointer',
            fontSize: '11px',
            color: theme.colors.text,
          }}>
            <input type="checkbox" checked={selectAll} onChange={e => setSelectAll(e.target.checked)} />
            All {products.length}
          </label>
          <button
            onClick={processImages}
            disabled={processing}
            style={{
              padding: '10px 24px',
              background: `linear-gradient(135deg, ${theme.colors.primary}, ${theme.colors.primaryDark})`,
              border: 'none',
              borderRadius: '10px',
              color: 'white',
              fontSize: '13px',
              fontWeight: 600,
              cursor: processing ? 'not-allowed' : 'pointer',
              fontFamily: theme.fonts.body,
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              opacity: processing ? 0.5 : 1,
              boxShadow: theme.shadows.glow,
            }}
          >
            {processing ? <div style={{width:16,height:16,borderRadius:'50%',border:'2px solid rgba(255,255,255,0.3)',borderTopColor:'white',animation:'spin 0.8s linear infinite'}} /> : <Sparkles size={16} />}
            {processing ? 'Processing...' : `Start ${mode === 'detect' ? 'Detection' : 'Translation'}`}
          </button>
        </div>
      </div>

      {/* Stats */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
        gap: '12px',
        marginBottom: 20,
      }}>
        {[
          { label: 'Products', value: products.length, icon: Image, color: theme.colors.primary },
          { label: 'With Images', value: products.filter(p => p.images?.length > 0).length, icon: Search, color: theme.colors.success },
          { label: 'Processed', value: Object.values(results).filter(r => r.status === 'done').length, icon: CheckCircle, color: theme.colors.warning },
          { label: 'Detected Texts', value: Object.values(results).filter(r => r.text).length, icon: Type, color: theme.colors.primaryLight },
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
              <div style={{ fontSize: '10px', color: theme.colors.textMuted, letterSpacing: '0.05em', textTransform: 'uppercase' }}>{s.label}</div>
              <div style={{ fontFamily: theme.fonts.heading, fontSize: '18px', fontWeight: 600, color: theme.colors.textBright }}>{s.value}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Results Grid */}
      {products.length > 0 && (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))',
          gap: '14px',
        }}>
          {(selectAll ? products : products.slice(0, 10)).map(product => (
            <ImageCard
              key={product.id}
              product={product}
              isProcessing={results[product.id]?.status === 'processing'}
              result={results[product.id]}
            />
          ))}
        </div>
      )}

      {loading && (
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '60px',
          color: theme.colors.textMuted,
        }}>
          <div style={{
            width: 32, height: 32,
            borderRadius: '50%',
            border: '3px solid rgba(255,255,255,0.1)',
            borderTopColor: theme.colors.primary,
            animation: 'spin 0.8s linear infinite',
            marginRight: 12,
          }} />
          Loading products...
        </div>
      )}

      <style>{`
        @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
      `}</style>
    </div>
  )
}
