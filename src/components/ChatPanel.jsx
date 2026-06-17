import { useState, useRef, useEffect } from 'react'
import { MessageCircle, X, Send, Terminal, Zap, Package, Search, SprayCan, BarChart3, Cpu, ChevronRight } from 'lucide-react'
import { theme } from '../theme'

const quickActions = [
  { icon: Zap, label: 'Auto Import Pipeline', cmd: 'Run full auto-import: scan, translate, price & apply' },
  { icon: Package, label: 'Bulk Product Update', cmd: 'Run bulk product type assignment for all products' },
  { icon: Search, label: 'Translate Chinese Titles', cmd: 'Start Chinese to English translation for 728 products' },
  { icon: BarChart3, label: 'Generate Amazon Pricing', cmd: 'Generate Amazon-compatible prices for all products' },
  { icon: SprayCan, label: 'Clean Descriptions', cmd: 'Clean Alibaba HTML from 713 product descriptions' },
]

const welcomeMessages = [
  { type: 'bot', text: `👋 Hey! I'm **ShopZyla AI Assistant**. How can I help you?` },
  { type: 'bot', text: `Select a **Quick Action** below or type a command — I'll handle everything! 🚀` },
]

export default function ChatPanel() {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState(welcomeMessages)
  const [input, setInput] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const messagesEndRef = useRef(null)

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const handleSend = (text) => {
    if (!text.trim()) return
    setMessages(prev => [...prev, { type: 'user', text }])
    setInput('')
    setIsTyping(true)
    
    setTimeout(() => {
      const responses = {
        'auto': '⚡ **Auto Import Pipeline started!**\n\n1️⃣ Scanning 728 Chinese products...\n2️⃣ Translating titles to English...\n3️⃣ Converting 2,847 Chinese variants...\n4️⃣ Applying Amazon-compatible pricing...\n5️⃣ Publishing to Shopify store...\n\n✅ Sab kuch automatic ho raha hai! Results dekhne ke liye **Auto Import** page par jayen.',
        'bulk': '📦 **Bulk Product Update started!**\n\nProduct types assign ho rahe hain saare 750 products ko. Categories jaise Phone Accessories, Handbags, Skincare auto-assign ho jayenge.',
        'translate': '🌐 **Translation Engine activated!**\n\n728 Chinese titles premium English mein convert ho rahe hain. Variant names bhi translate ho jayenge. Examples:\n- 高端智能手机壳 → Premium Smartphone Case\n- 女士真皮手提包 → Genuine Leather Women Handbag',
        'price': '💰 **Amazon Price Generator running!**\n\nAlibaba cost vs Amazon selling price analysis:\n- Avg Alibaba cost: ~$2-5\n- Amazon compatible price: $20-60\n- Compare-at: $40-90\n\n5-12x multiplier applied with competitive positioning!',
        'clean': '🧹 **Content Cleaner started!**\n\n713 product descriptions se Alibaba HTML hata raha hoon:\n- Removing offer-template divs\n- Fixing broken CDN image URLs\n- Cleaning empty/null tags\n- Generating premium descriptions',
        'default': '✅ **Command received!** Working on it. Results will update on your dashboard. Any other command?',
      }
      const key = Object.keys(responses).find(k => text.toLowerCase().includes(k))
      setMessages(prev => [...prev, { type: 'bot', text: responses[key] || responses.default }])
      setIsTyping(false)
    }, 1500)
  }

  const handleQuickAction = (action) => {
    setMessages(prev => [...prev, { type: 'user', text: action.cmd }])
    setIsTyping(true)
    setTimeout(() => {
      handleSend(action.cmd)
    }, 500)
  }

  return (
    <>
      {/* Chat Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        style={{
          position: 'fixed',
          bottom: '24px',
          right: '24px',
          width: '56px',
          height: '56px',
          borderRadius: '16px',
          background: `linear-gradient(135deg, ${theme.colors.primary}, ${theme.colors.primaryDark})`,
          border: 'none',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: `0 4px 20px ${theme.colors.primary}40, ${theme.shadows.card}`,
          zIndex: 1000,
          transition: 'all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)',
          transform: isOpen ? 'rotate(45deg) scale(0.9)' : 'scale(1)',
        }}
        onMouseEnter={e => { if (!isOpen) { e.currentTarget.style.transform = 'scale(1.1)'; e.currentTarget.style.boxShadow = `0 6px 30px ${theme.colors.primary}50` } }}
        onMouseLeave={e => { if (!isOpen) { e.currentTarget.style.transform = 'scale(1)'; e.currentTarget.style.boxShadow = `0 4px 20px ${theme.colors.primary}40, ${theme.shadows.card}` } }}
      >
        {isOpen ? <X size={24} color="white" /> : <MessageCircle size={24} color="white" />}
      </button>

      {/* Chat Panel */}
      <div style={{
        position: 'fixed',
        bottom: '92px',
        right: '24px',
        width: '420px',
        height: '600px',
        background: theme.colors.bgLight,
        border: `1px solid ${theme.colors.border}`,
        borderRadius: '20px',
        boxShadow: `0 20px 60px rgba(0,0,0,0.6), ${theme.shadows.glow}`,
        zIndex: 999,
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
        transform: isOpen ? 'translateY(0) scale(1)' : 'translateY(20px) scale(0.95)',
        opacity: isOpen ? 1 : 0,
        pointerEvents: isOpen ? 'auto' : 'none',
        transition: 'all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)',
        transformOrigin: 'bottom right',
      }}>
        {/* Header */}
        <div style={{
          padding: '16px 20px',
          background: `linear-gradient(135deg, ${theme.colors.primaryDeep}, ${theme.colors.bg})`,
          borderBottom: `1px solid ${theme.colors.border}`,
          display: 'flex',
          alignItems: 'center',
          gap: 12,
        }}>
          <div style={{
            width: 36,
            height: 36,
            borderRadius: '10px',
            background: `linear-gradient(135deg, ${theme.colors.primary}, ${theme.colors.primaryDark})`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: theme.shadows.glow,
          }}>
            <Terminal size={18} color="white" />
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontFamily: theme.fonts.heading, fontSize: '13px', fontWeight: 600, color: theme.colors.textBright, letterSpacing: '0.05em' }}>
              AI COMMAND CENTER
            </div>
            <div style={{ fontSize: '10px', color: theme.colors.primaryLight, fontWeight: 500, letterSpacing: '0.05em', display: 'flex', alignItems: 'center', gap: 6 }}>
              <span style={{ width: 6, height: 6, borderRadius: '50%', background: theme.colors.success, display: 'inline-block', boxShadow: `0 0 6px ${theme.colors.success}` }} />
              Connected · ShopZyla Manager
            </div>
          </div>
        </div>

        {/* Messages */}
        <div style={{
          flex: 1,
          overflow: 'auto',
          padding: '16px',
          display: 'flex',
          flexDirection: 'column',
          gap: 10,
        }}>
          {messages.map((msg, i) => (
            <div key={i} style={{
              display: 'flex',
              justifyContent: msg.type === 'user' ? 'flex-end' : 'flex-start',
            }}>
              <div style={{
                maxWidth: '90%',
                padding: '10px 14px',
                borderRadius: msg.type === 'user' ? '14px 14px 4px 14px' : '14px 14px 14px 4px',
                background: msg.type === 'user' ? 
                  `linear-gradient(135deg, ${theme.colors.primary}, ${theme.colors.primaryDark})` : 
                  theme.colors.bgCard,
                color: msg.type === 'user' ? 'white' : theme.colors.text,
                fontSize: '12.5px',
                lineHeight: 1.6,
                border: msg.type === 'bot' ? `1px solid ${theme.colors.border}` : 'none',
                fontFamily: theme.fonts.body,
                whiteSpace: 'pre-wrap',
              }}>
                {msg.text}
              </div>
            </div>
          ))}

          {isTyping && (
            <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
              <div style={{
                padding: '12px 16px',
                borderRadius: '14px 14px 14px 4px',
                background: theme.colors.bgCard,
                border: `1px solid ${theme.colors.border}`,
                display: 'flex',
                gap: 4,
                alignItems: 'center',
              }}>
                {[0, 1, 2].map(i => (
                  <div key={i} style={{
                    width: 6,
                    height: 6,
                    borderRadius: '50%',
                    background: theme.colors.primary,
                    animation: 'bounce 1.4s infinite',
                    animationDelay: `${i * 0.2}s`,
                  }} />
                ))}
              </div>
            </div>
          )}

          {/* Quick Actions */}
          {messages.length <= 2 && (
            <div style={{ marginTop: 8 }}>
              <div style={{ fontSize: '10px', color: theme.colors.textMuted, marginBottom: 8, letterSpacing: '0.08em', fontWeight: 600 }}>
                ⚡ QUICK ACTIONS
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                {quickActions.map((action, i) => (
                  <button
                    key={i}
                    onClick={() => handleQuickAction(action)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 10,
                      padding: '10px 14px',
                      background: theme.colors.bg,
                      border: `1px solid ${theme.colors.border}`,
                      borderRadius: '10px',
                      cursor: 'pointer',
                      color: theme.colors.text,
                      fontSize: '12px',
                      fontFamily: theme.fonts.body,
                      transition: 'all 0.2s',
                      textAlign: 'left',
                    }}
                    onMouseEnter={e => { e.currentTarget.style.borderColor = theme.colors.primary; e.currentTarget.style.background = theme.colors.bgCard }}
                    onMouseLeave={e => { e.currentTarget.style.borderColor = theme.colors.border; e.currentTarget.style.background = theme.colors.bg }}
                  >
                    <action.icon size={16} color={action.label.includes('Auto') ? theme.colors.success : theme.colors.primary} />
                    <span style={{ flex: 1 }}>{action.label}</span>
                    <ChevronRight size={14} color={theme.colors.textMuted} />
                  </button>
                ))}
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div style={{
          padding: '14px 16px',
          borderTop: `1px solid ${theme.colors.border}`,
          background: theme.colors.bg,
        }}>
          <form onSubmit={e => { e.preventDefault(); handleSend(input) }} style={{ display: 'flex', gap: 10 }}>
            <input
              type="text"
              value={input}
              onChange={e => setInput(e.target.value)}
              placeholder="Type command or question..."
              style={{
                flex: 1,
                padding: '11px 16px',
                background: theme.colors.bgLight,
                border: `1px solid ${theme.colors.border}`,
                borderRadius: '10px',
                color: theme.colors.textBright,
                fontSize: '13px',
                fontFamily: theme.fonts.body,
                outline: 'none',
                transition: 'border-color 0.2s',
              }}
              onFocus={e => { e.currentTarget.style.borderColor = theme.colors.primary }}
              onBlur={e => { e.currentTarget.style.borderColor = theme.colors.border }}
            />
            <button
              type="submit"
              style={{
                width: 40,
                height: 40,
                borderRadius: '10px',
                background: input.trim() ? `linear-gradient(135deg, ${theme.colors.primary}, ${theme.colors.primaryDark})` : theme.colors.bgCard,
                border: 'none',
                cursor: input.trim() ? 'pointer' : 'default',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'all 0.2s',
                opacity: input.trim() ? 1 : 0.5,
              }}
            >
              <Send size={16} color={input.trim() ? 'white' : theme.colors.textMuted} />
            </button>
          </form>
        </div>
      </div>

      <style>{`
        @keyframes bounce {
          0%, 80%, 100% { transform: translateY(0); }
          40% { transform: translateY(-6px); }
        }
      `}</style>
    </>
  )
}
