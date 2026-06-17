import { Component } from 'react'
import { theme } from '../theme'

export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error }
  }

  componentDidCatch(error, errorInfo) {
    console.error('App Error:', error, errorInfo)
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '100vh',
          background: theme.colors.bg,
          padding: '40px',
          textAlign: 'center',
        }}>
          <div style={{
            width: 80,
            height: 80,
            borderRadius: '50%',
            background: `linear-gradient(135deg, ${theme.colors.error}, ${theme.colors.accent})`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: 24,
            boxShadow: `0 0 40px ${theme.colors.error}30`,
          }}>
            <span style={{ fontSize: 36 }}>⚠️</span>
          </div>
          <h1 style={{
            fontFamily: theme.fonts.heading,
            fontSize: '24px',
            color: theme.colors.textBright,
            marginBottom: 12,
          }}>
            Something Went Wrong 🛠️
          </h1>
          <p style={{
            color: theme.colors.textMuted,
            fontSize: '14px',
            marginBottom: 24,
            maxWidth: 400,
            lineHeight: 1.6,
          }}>
            An error occurred while loading the app. Try refreshing, or give me a command — I'll fix it!
          </p>
          <button
            onClick={() => window.location.reload()}
            style={{
              padding: '14px 32px',
              background: `linear-gradient(135deg, ${theme.colors.primary}, ${theme.colors.primaryDark})`,
              border: 'none',
              borderRadius: '12px',
              color: 'white',
              fontSize: '15px',
              fontWeight: 600,
              cursor: 'pointer',
              fontFamily: theme.fonts.body,
              boxShadow: theme.shadows.glow,
            }}
          >
            🔄 Refresh
          </button>
          <div style={{
            marginTop: 32,
            padding: '16px 20px',
            background: theme.colors.bgCard,
            borderRadius: '12px',
            border: `1px solid ${theme.colors.border}`,
            maxWidth: '100%',
            overflow: 'auto',
            fontSize: '11px',
            color: theme.colors.textMuted,
            textAlign: 'left',
            fontFamily: 'monospace',
          }}>
            {this.state.error?.message || 'Unknown error'}
          </div>
        </div>
      )
    }
    return this.props.children
  }
}
