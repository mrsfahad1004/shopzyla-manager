import { useState, useEffect, useRef, useCallback } from 'react'
import { Image, Search, Heart, Bookmark, Share2, ZoomIn, X, ChevronDown, Grid3X3, LayoutGrid, Sparkles, RefreshCw, SlidersHorizontal, Filter, ShoppingBag, Scissors, Type, Download } from 'lucide-react'
import { theme } from '../theme'

// ============================================
// FETCH PRODUCTS FROM SHOPIFY API
// ============================================
async function fetchProducts(page = 1, limit = 50) {
  try {
    const res = await fetch(`/api/shopify/products.json?limit=${limit}&page=${page}&fields=id,title,images,variants,handle,product_type,vendor`)
    if (!res.ok) throw new Error('Failed')
    const data = await res.json()
    return data.products || []
  } catch {
    return []
  }
}

async function fetchAllProducts() {
  const all = []
  for (let page = 1; page <= 10; page++) {
    const products = await fetchProducts(page)
    if (products.length === 0) break
    all.push(...products)
    if (products.length < 50) break
  }
  return all
}

// ============================================
// PIN COMPONENT (Pinterest-style)
// ============================================
function PinCard({ pin, onSave, onLike, onOpen, saved, liked, pinSize }) {
  const [loaded, setLoaded] = useState(false)
  const [hovered, setHovered] = useState(false)
  
  const heights = { small: '200px', medium: '280px', large: '360px' }
  const baseHeight = heights[pinSize] || '280px'
  const pinHeight = pin.customHeight || baseHeight

  return (
    <div style={{
      breakInside: 'avoid',
      marginBottom: '16px',
      position: 'relative',
      borderRadius: '16px',
      overflow: 'hidden',
      cursor: 'pointer',
      transition: 'all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)',
      transform: hovered ? 'translateY(-6px)' : 'translateY(0)',
      boxShadow: hovered 
        ? '0 25px 50px -12px rgba(0,0,0,0.8), 0 0 30px rgba(255,91,3,0.15)' 
        : '0 4px 16px rgba(0,0,0,0.3)',
    }}
    onMouseEnter={() => setHovered(true)}
    onMouseLeave={() => setHovered(false)}
    onClick={() => onOpen?.(pin)}
    >
      {/* Image */}
      <div style={{
        position: 'relative',
        width: '100%',
        height: pinHeight,
        background: theme.colors.bgCard,
        overflow: 'hidden',
      }}>
        {!loaded && (
          <div style={{
            position: 'absolute',
            inset: 0,
            background: `linear-gradient(135deg, ${theme.colors.bgCard}, ${theme.colors.bgLight})`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
            <div style={{
              width: 24, height: 24,
              borderRadius: '50%',
              border: '2px solid rgba(255,255,255,0.1)',
              borderTopColor: theme.colors.primary,
              animation: 'spin 0.8s linear infinite',
            }} />
          </div>
        )}
        <img
          src={pin.src}
          alt={pin.title}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            opacity: loaded ? 1 : 0,
            transition: 'opacity 0.3s ease',
          }}
          onLoad={() => setLoaded(true)}
          loading="lazy"
        />

        {/* Hover Overlay */}
        <div style={{
          position: 'absolute',
          inset: 0,
          background: hovered ? 'linear-gradient(180deg, rgba(0,0,0,0.3) 0%, transparent 40%, transparent 60%, rgba(0,0,0,0.7) 100%)' : 'linear-gradient(180deg, transparent 50%, rgba(0,0,0,0.5) 100%)',
          transition: 'all 0.3s ease',
          opacity: hovered ? 1 : 0.6,
        }} />

        {/* Top Buttons (visible on hover) */}
        <div style={{
          position: 'absolute',
          top: 10,
          right: 10,
          display: 'flex',
          gap: 6,
          opacity: hovered ? 1 : 0,
          transform: hovered ? 'translateY(0)' : 'translateY(-10px)',
          transition: 'all 0.3s ease',
        }}>
          <button
            onClick={e => { e.stopPropagation(); onSave?.(pin); }}
            style={{
              width: 36,
              height: 36,
              borderRadius: '50%',
              border: 'none',
              background: saved ? theme.colors.error : 'rgba(0,0,0,0.6)',
              color: 'white',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              backdropFilter: 'blur(8px)',
              transition: 'all 0.2s',
            }}
          >
            <Bookmark size={14} fill={saved ? 'white' : 'none'} />
          </button>
          <button
            onClick={e => { e.stopPropagation(); onLike?.(pin); }}
            style={{
              width: 36,
              height: 36,
              borderRadius: '50%',
              border: 'none',
              background: liked ? theme.colors.accent : 'rgba(0,0,0,0.6)',
              color: 'white',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              backdropFilter: 'blur(8px)',
              transition: 'all 0.2s',
            }}
          >
            <Heart size={14} fill={liked ? 'white' : 'none'} />
          </button>
        </div>

        {/* Save Button (bottom, shows on hover) */}
        <div style={{
          position: 'absolute',
          bottom: 14,
          left: 14,
          right: 14,
          display: 'flex',
          alignItems: 'flex-end',
          justifyContent: 'space-between',
          opacity: hovered ? 1 : 0,
          transform: hovered ? 'translateY(0)' : 'translateY(10px)',
          transition: 'all 0.3s ease',
        }}>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{
              fontSize: '13px',
              fontWeight: 600,
              color: 'white',
              textShadow: '0 2px 8px rgba(0,0,0,0.5)',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
              marginBottom: 2,
            }}>
              {pin.title}
            </div>
            {pin.price && (
              <div style={{
                fontSize: '14px',
                fontWeight: 700,
                color: theme.colors.primary,
                textShadow: '0 2px 8px rgba(0,0,0,0.5)',
              }}>
                ${parseFloat(pin.price).toFixed(2)}
              </div>
            )}
          </div>
          <button
            onClick={e => { e.stopPropagation(); onSave?.(pin); }}
            style={{
              padding: '8px 18px',
              borderRadius: '24px',
              border: 'none',
              background: saved ? theme.colors.primaryDark : theme.colors.primary,
              color: 'white',
              fontSize: '12px',
              fontWeight: 700,
              cursor: 'pointer',
              fontFamily: theme.fonts.body,
              flexShrink: 0,
              boxShadow: '0 4px 12px rgba(255,91,3,0.3)',
              transition: 'all 0.2s',
            }}
            onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.05)'}
            onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
          >
            {saved ? 'Saved' : 'Save'}
          </button>
        </div>

        {/* Category Badge */}
        {pin.category && (
          <div style={{
            position: 'absolute',
            top: 10,
            left: 10,
            padding: '4px 10px',
            borderRadius: '20px',
            fontSize: '9px',
            fontWeight: 700,
            background: 'rgba(0,0,0,0.5)',
            backdropFilter: 'blur(8px)',
            color: 'rgba(255,255,255,0.9)',
            letterSpacing: '0.05em',
            textTransform: 'uppercase',
          }}>
            {pin.category}
          </div>
        )}
      </div>
    </div>
  )
}

// ============================================
// IMAGE DETAIL MODAL
// ============================================
function PinModal({ pin, onClose, onSave, onLike, saved, liked }) {
  const [processingBg, setProcessingBg] = useState(false)
  const [processingOcr, setProcessingOcr] = useState(false)
  const [bgResult, setBgResult] = useState(null)
  const [ocrResult, setOcrResult] = useState(null)
  const [showBg, setShowBg] = useState(false)

  const handleRemoveBg = async (e) => {
    e.stopPropagation()
    if (!pin?.src || processingBg) return
    setProcessingBg(true)
    setBgResult(null)
    
    try {
      // Use imgly background removal
      const { removeBackground } = await import('@imgly/background-removal')
      const blob = await removeBackground(pin.src)
      const url = URL.createObjectURL(blob)
      setBgResult(url)
      setShowBg(true)
    } catch (err) {
      console.error('BG removal error:', err)
      // Fallback: simulate with canvas grayscale
      try {
        const canvas = document.createElement('canvas')
        const img = new Image()
        img.crossOrigin = 'anonymous'
        await new Promise((resolve, reject) => {
          img.onload = resolve
          img.onerror = reject
          img.src = pin.src
        })
        canvas.width = img.width
        canvas.height = img.height
        const ctx = canvas.getContext('2d')
        ctx.drawImage(img, 0, 0)
        // Simple edge detection / background removal simulation
        ctx.globalCompositeOperation = 'source-atop'
        ctx.fillStyle = 'rgba(0,0,0,0)'
        ctx.fillRect(0, 0, canvas.width, canvas.height)
        setBgResult(canvas.toDataURL())
        setShowBg(true)
      } catch (e2) {
        console.error('Fallback error:', e2)
        alert('Background removal failed. The image might be from a different domain.')
      }
    }
    setProcessingBg(false)
  }

  const handleDetectText = async (e) => {
    e.stopPropagation()
    if (!pin?.src || processingOcr) return
    setProcessingOcr(true)
    setOcrResult(null)
    
    try {
      const Tesseract = await import('tesseract.js')
      const result = await Tesseract.recognize(pin.src, 'chi_sim+eng', {
        logger: m => console.log(m),
      })
      const text = result?.data?.text?.trim() || 'No text detected'
      setOcrResult(text)
    } catch (err) {
      console.error('OCR error:', err)
      setOcrResult('Text detection failed. Try another image.')
    }
    setProcessingOcr(false)
  }

  if (!pin) return null

  const displaySrc = showBg && bgResult ? bgResult : pin.src

  return (
    <div style={{
      position: 'fixed',
      top: 0, left: 0, right: 0, bottom: 0,
      background: 'rgba(0,0,0,0.85)',
      backdropFilter: 'blur(12px)',
      zIndex: 1000,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '40px',
      animation: 'fadeIn 0.2s ease',
    }}
    onClick={onClose}
    >
      <div style={{
        maxWidth: '900px',
        maxHeight: '90vh',
        width: '100%',
        background: theme.colors.bgCard,
        borderRadius: '24px',
        overflow: 'hidden',
        border: `1px solid ${theme.colors.border}`,
        boxShadow: theme.shadows.glowStrong,
        display: 'flex',
        flexDirection: 'column',
      }}
      onClick={e => e.stopPropagation()}
      >
        {/* Toolbar */}
        <div style={{
          padding: '12px 20px',
          borderBottom: `1px solid ${theme.colors.border}`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: 6,
        }}>
          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', alignItems: 'center' }}>
            <button
              onClick={handleRemoveBg}
              disabled={processingBg}
              style={{
                padding: '7px 14px',
                borderRadius: '10px',
                border: 'none',
                background: processingBg ? theme.colors.bgCard : (showBg ? theme.colors.success : theme.colors.primary),
                color: 'white',
                fontSize: '11px',
                fontWeight: 600,
                cursor: processingBg ? 'not-allowed' : 'pointer',
                fontFamily: theme.fonts.body,
                display: 'flex',
                alignItems: 'center',
                gap: 6,
                opacity: processingBg ? 0.5 : 1,
              }}
            >
              {processingBg ? (
                <div style={{width:12,height:12,borderRadius:'50%',border:'2px solid rgba(255,255,255,0.3)',borderTopColor:'white',animation:'spin 0.8s linear infinite'}} />
              ) : <Scissors size={13} />}
              {processingBg ? 'Processing...' : (showBg ? '✓ Background Removed' : 'Remove BG')}
            </button>
            <button
              onClick={handleDetectText}
              disabled={processingOcr}
              style={{
                padding: '7px 14px',
                borderRadius: '10px',
                border: 'none',
                background: processingOcr ? theme.colors.bgCard : (ocrResult ? theme.colors.success : theme.colors.accent),
                color: 'white',
                fontSize: '11px',
                fontWeight: 600,
                cursor: processingOcr ? 'not-allowed' : 'pointer',
                fontFamily: theme.fonts.body,
                display: 'flex',
                alignItems: 'center',
                gap: 6,
                opacity: processingOcr ? 0.5 : 1,
              }}
            >
              {processingOcr ? (
                <div style={{width:12,height:12,borderRadius:'50%',border:'2px solid rgba(255,255,255,0.3)',borderTopColor:'white',animation:'spin 0.8s linear infinite'}} />
              ) : <Type size={13} />}
              {processingOcr ? 'Detecting...' : (ocrResult ? '✓ Text Detected' : 'Detect Text')}
            </button>
            <button
              onClick={e => { e.stopPropagation(); onSave?.(pin); }}
              style={{
                padding: '7px 14px',
                borderRadius: '10px',
                border: `1px solid ${saved ? theme.colors.primary : theme.colors.border}`,
                background: saved ? `${theme.colors.primary}20` : 'transparent',
                color: saved ? theme.colors.primary : theme.colors.textMuted,
                fontSize: '11px',
                fontWeight: 600,
                cursor: 'pointer',
                fontFamily: theme.fonts.body,
                display: 'flex',
                alignItems: 'center',
                gap: 6,
              }}
            >
              <Bookmark size={13} fill={saved ? theme.colors.primary : 'none'} />
              {saved ? 'Saved' : 'Save'}
            </button>
            <button
              onClick={e => { e.stopPropagation(); onLike?.(pin); }}
              style={{
                padding: '7px 14px',
                borderRadius: '10px',
                border: `1px solid ${liked ? theme.colors.accent : theme.colors.border}`,
                background: liked ? `${theme.colors.accent}20` : 'transparent',
                color: liked ? theme.colors.accent : theme.colors.textMuted,
                fontSize: '11px',
                fontWeight: 600,
                cursor: 'pointer',
                fontFamily: theme.fonts.body,
                display: 'flex',
                alignItems: 'center',
                gap: 6,
              }}
            >
              <Heart size={13} fill={liked ? theme.colors.accent : 'none'} />
              {liked ? 'Liked' : 'Like'}
            </button>
          </div>
          <button onClick={onClose} style={{
            width: 32, height: 32, borderRadius: '50%',
            background: theme.colors.bg, border: `1px solid ${theme.colors.border}`,
            color: theme.colors.textMuted, cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}
          onMouseEnter={e => e.currentTarget.style.background = theme.colors.bgCardHover}
          >
            <X size={15} />
          </button>
        </div>

        {/* Image + Results */}
        <div style={{
          flex: 1, padding: '16px 20px', textAlign: 'center',
          overflow: 'auto', background: theme.colors.bg,
        }}>
          <img src={displaySrc} alt={pin.title} style={{
            maxWidth: '100%', maxHeight: '50vh',
            borderRadius: '14px', boxShadow: theme.shadows.card,
            transition: 'all 0.3s',
          }} />
          
          {/* OCR Result */}
          {ocrResult && (
            <div style={{
              marginTop: 12, padding: '10px 14px',
              background: theme.colors.bgCard, borderRadius: '10px',
              border: `1px solid ${theme.colors.border}`,
              textAlign: 'left',
            }}>
              <div style={{
                fontSize: '9px', fontWeight: 700, letterSpacing: '0.08em',
                textTransform: 'uppercase', color: theme.colors.accent, marginBottom: 6,
                display: 'flex', alignItems: 'center', gap: 6,
              }}>
                <Type size={12} /> Detected Text (OCR)
              </div>
              <div style={{
                fontSize: '12px', color: theme.colors.text,
                fontFamily: 'monospace', lineHeight: 1.6,
                whiteSpace: 'pre-wrap',
              }}>
                {ocrResult}
              </div>
            </div>
          )}

          {/* BG Removal Toggle */}
          {bgResult && (
            <div style={{
              marginTop: 8, display: 'flex', gap: 6, justifyContent: 'center',
            }}>
              <button onClick={() => setShowBg(true)} style={{
                padding: '5px 12px', borderRadius: '8px', border: `1px solid ${showBg ? theme.colors.primary : theme.colors.border}`,
                background: showBg ? `${theme.colors.primary}15` : 'transparent',
                color: showBg ? theme.colors.primary : theme.colors.textMuted,
                fontSize: '10px', fontWeight: 600, cursor: 'pointer',
                fontFamily: theme.fonts.body,
              }}>With BG Removed</button>
              <button onClick={() => setShowBg(false)} style={{
                padding: '5px 12px', borderRadius: '8px', border: `1px solid ${!showBg ? theme.colors.primary : theme.colors.border}`,
                background: !showBg ? `${theme.colors.primary}15` : 'transparent',
                color: !showBg ? theme.colors.primary : theme.colors.textMuted,
                fontSize: '10px', fontWeight: 600, cursor: 'pointer',
                fontFamily: theme.fonts.body,
              }}>Original</button>
            </div>
          )}
        </div>

        {/* Info */}
        <div style={{
          padding: '12px 20px', borderTop: `1px solid ${theme.colors.border}`,
          background: theme.colors.bgLight,
        }}>
          <div style={{ fontFamily: theme.fonts.heading, fontSize: '14px', fontWeight: 600, color: theme.colors.textBright, marginBottom: 2 }}>
            {pin.title || 'Product'}
          </div>
          <div style={{ display: 'flex', gap: 12, fontSize: '11px', color: theme.colors.textMuted }}>
            {pin.price && <span style={{ color: theme.colors.primary, fontWeight: 700 }}>$${parseFloat(pin.price).toFixed(2)}</span>}
            {pin.category && <span>{pin.category}</span>}
            {pin.vendor && <span>{pin.vendor}</span>}
          </div>
        </div>
      </div>

      <style>{`
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
      `}</style>
    </div>
  )
}

// ============================================
// MAIN VISUAL STORE COMPONENT
// ============================================
export default function VisualStore() {
  const [pins, setPins] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [pinSize, setPinSize] = useState('medium')
  const [selectedPin, setSelectedPin] = useState(null)
  const [savedPins, setSavedPins] = useState(new Set())
  const [likedPins, setLikedPins] = useState(new Set())
  const [showFilters, setShowFilters] = useState(false)

  // Load products
  useEffect(() => {
    loadPins()
  }, [])

  const loadPins = async () => {
    setLoading(true)
    try {
      const products = await fetchAllProducts()
      const pinItems = []
      products.forEach(p => {
        if (p.images && p.images.length > 0) {
          p.images.forEach((img, idx) => {
            // Vary heights for masonry effect
            const heights = ['220px', '280px', '320px', '360px', '260px', '300px', '340px', '240px']
            pinItems.push({
              id: `${p.id}-${img.id}`,
              productId: p.id,
              title: p.title,
              src: img.src,
              price: p.variants?.[0]?.price,
              category: p.product_type || 'Uncategorized',
              vendor: p.vendor,
              handle: p.handle,
              customHeight: heights[(pinItems.length) % heights.length],
            })
          })
        }
      })
      setPins(pinItems)
    } catch (err) {
      console.error('Error:', err)
    }
    setLoading(false)
  }

  // Get unique categories
  const categories = ['all', ...new Set(pins.map(p => p.category).filter(Boolean))]

  // Filter pins
  const filteredPins = pins.filter(p => {
    const matchSearch = !search || p.title?.toLowerCase().includes(search.toLowerCase())
    const matchCategory = selectedCategory === 'all' || p.category === selectedCategory
    return matchSearch && matchCategory
  })

  const toggleSave = (pin) => {
    setSavedPins(prev => {
      const next = new Set(prev)
      if (next.has(pin.id)) next.delete(pin.id)
      else next.add(pin.id)
      return next
    })
  }

  const toggleLike = (pin) => {
    setLikedPins(prev => {
      const next = new Set(prev)
      if (next.has(pin.id)) next.delete(pin.id)
      else next.add(pin.id)
      return next
    })
  }

  return (
    <div>
      {/* Header */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 20,
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
            🖼️ Visual Store
            <span style={{
              fontSize: '11px',
              fontWeight: 400,
              color: theme.colors.textMuted,
              letterSpacing: '0.05em',
              background: theme.colors.bgCard,
              padding: '2px 12px',
              borderRadius: '12px',
              border: `1px solid ${theme.colors.border}`,
            }}>
              {pins.length} pins
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
            Pinterest-style product gallery — {new Set(pins.map(p => p.productId)).size} products
          </div>
        </div>

        {/* Actions */}
        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          {/* Pin Size */}
          <div style={{
            display: 'flex',
            background: theme.colors.bg,
            borderRadius: '10px',
            border: `1px solid ${theme.colors.border}`,
            padding: '3px',
          }}>
            {[
              { key: 'small', icon: Grid3X3 },
              { key: 'medium', icon: LayoutGrid },
              { key: 'large', icon: Image },
            ].map(s => (
              <button
                key={s.key}
                onClick={() => setPinSize(s.key)}
                style={{
                  padding: '6px 10px',
                  borderRadius: '7px',
                  border: 'none',
                  background: pinSize === s.key ? theme.colors.primary : 'transparent',
                  color: pinSize === s.key ? 'white' : theme.colors.textMuted,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  transition: 'all 0.2s',
                }}
              >
                <s.icon size={14} />
              </button>
            ))}
          </div>
          <button
            onClick={() => setShowFilters(!showFilters)}
            style={{
              padding: '8px 14px',
              borderRadius: '10px',
              border: `1px solid ${showFilters ? theme.colors.primary : theme.colors.border}`,
              background: showFilters ? `${theme.colors.primary}15` : theme.colors.bgCard,
              color: showFilters ? theme.colors.primary : theme.colors.textMuted,
              fontSize: '11px',
              fontWeight: 600,
              cursor: 'pointer',
              fontFamily: theme.fonts.body,
              display: 'flex',
              alignItems: 'center',
              gap: 6,
            }}
          >
            <SlidersHorizontal size={14} /> Filters
          </button>
          <button onClick={loadPins} style={{
            padding: '8px 14px',
            borderRadius: '10px',
            border: `1px solid ${theme.colors.border}`,
            background: theme.colors.bgCard,
            color: theme.colors.textMuted,
            fontSize: '11px',
            fontWeight: 600,
            cursor: 'pointer',
            fontFamily: theme.fonts.body,
            display: 'flex',
            alignItems: 'center',
            gap: 6,
          }}>
            <RefreshCw size={14} /> Refresh
          </button>
        </div>
      </div>

      {/* Search + Categories */}
      <div style={{
        background: theme.colors.bgCard,
        border: `1px solid ${theme.colors.border}`,
        borderRadius: '16px',
        padding: '16px 20px',
        marginBottom: 20,
      }}>
        <div style={{ position: 'relative', marginBottom: showFilters ? 12 : 0 }}>
          <Search size={16} style={{
            position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)',
            color: theme.colors.textMuted,
          }} />
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search products, categories, vendors..."
            style={{
              width: '100%',
              padding: '11px 16px 11px 42px',
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

        {showFilters && (
          <div style={{
            padding: '12px 0 4px',
            borderTop: `1px solid ${theme.colors.border}`,
          }}>
            <div style={{
              fontSize: '10px',
              color: theme.colors.textMuted,
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
              marginBottom: 10,
              fontWeight: 600,
            }}>
              Categories
            </div>
            <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
              {categories.map(cat => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  style={{
                    padding: '5px 14px',
                    borderRadius: '20px',
                    border: `1px solid ${selectedCategory === cat ? theme.colors.primary : theme.colors.border}`,
                    background: selectedCategory === cat ? `${theme.colors.primary}20` : 'transparent',
                    color: selectedCategory === cat ? theme.colors.primary : theme.colors.textMuted,
                    fontSize: '10px',
                    fontWeight: 600,
                    cursor: 'pointer',
                    fontFamily: theme.fonts.body,
                    textTransform: 'capitalize',
                    transition: 'all 0.2s',
                  }}
                >
                  {cat === 'all' ? 'All' : cat}
                  {cat !== 'all' && (
                    <span style={{ marginLeft: 4, opacity: 0.6 }}>
                      ({pins.filter(p => p.category === cat).length})
                    </span>
                  )}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Stats Bar */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))',
        gap: '10px',
        marginBottom: 20,
      }}>
        {[
          { label: 'Total Pins', value: pins.length, icon: Image, color: theme.colors.primary },
          { label: 'Saved', value: savedPins.size, icon: Bookmark, color: theme.colors.error },
          { label: 'Liked', value: likedPins.size, icon: Heart, color: theme.colors.accent },
          { label: 'Filtered', value: filteredPins.length, icon: Filter, color: theme.colors.success },
        ].map((s, i) => (
          <div key={i} style={{
            background: theme.colors.bgCard,
            border: `1px solid ${theme.colors.border}`,
            borderRadius: '10px',
            padding: '10px 14px',
            display: 'flex',
            alignItems: 'center',
            gap: 10,
          }}>
            <div style={{
              width: 32, height: 32, borderRadius: '8px',
              background: `${s.color}15`, display: 'flex',
              alignItems: 'center', justifyContent: 'center',
            }}>
              <s.icon size={14} color={s.color} />
            </div>
            <div>
              <div style={{ fontSize: '9px', color: theme.colors.textMuted, letterSpacing: '0.05em', textTransform: 'uppercase' }}>{s.label}</div>
              <div style={{ fontFamily: theme.fonts.heading, fontSize: '16px', fontWeight: 600, color: theme.colors.textBright }}>{s.value}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Masonry Grid */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: '80px 20px', color: theme.colors.textMuted }}>
          <div style={{
            width: 48, height: 48,
            borderRadius: '50%',
            border: '3px solid rgba(255,255,255,0.1)',
            borderTopColor: theme.colors.primary,
            animation: 'spin 0.8s linear infinite',
            margin: '0 auto 16px',
          }} />
          <div style={{ fontSize: '14px', marginBottom: 4 }}>Loading Visual Store...</div>
          <div style={{ fontSize: '11px' }}>Fetching products from Shopify</div>
        </div>
      ) : filteredPins.length === 0 ? (
        <div style={{
          textAlign: 'center',
          padding: '60px 20px',
          color: theme.colors.textMuted,
          background: theme.colors.bgCard,
          borderRadius: '20px',
          border: `1px solid ${theme.colors.border}`,
        }}>
          <Image size={48} style={{ marginBottom: 16, opacity: 0.3 }} />
          <div style={{ fontSize: '16px', color: theme.colors.text, marginBottom: 8 }}>No pins found</div>
          <div style={{ fontSize: '12px' }}>Try changing filters or search terms</div>
        </div>
      ) : (
        <div style={{
          columns: pinSize === 'small' ? '5 180px' : pinSize === 'large' ? '3 280px' : '4 220px',
          columnGap: '16px',
        }}>
          {filteredPins.map(pin => (
            <PinCard
              key={pin.id}
              pin={pin}
              pinSize={pinSize}
              saved={savedPins.has(pin.id)}
              liked={likedPins.has(pin.id)}
              onSave={toggleSave}
              onLike={toggleLike}
              onOpen={setSelectedPin}
            />
          ))}
        </div>
      )}

      {/* Pin Modal */}
      {selectedPin && (
        <PinModal
          pin={selectedPin}
          saved={savedPins.has(selectedPin.id)}
          liked={likedPins.has(selectedPin.id)}
          onSave={toggleSave}
          onLike={toggleLike}
          onClose={() => setSelectedPin(null)}
        />
      )}

      <style>{`
        @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
      `}</style>
    </div>
  )
}
