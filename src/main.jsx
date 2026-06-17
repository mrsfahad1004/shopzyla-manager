import React, { useEffect } from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App'

// Shopify App Bridge - embedded support
function AppBridgeWrapper({ children }) {
  const isEmbedded = window?.top !== window?.self
  const params = new URLSearchParams(window.location.search)
  const shop = params.get('shop')
  const host = params.get('host')

  useEffect(() => {
    if (isEmbedded || (shop && host)) {
      import('@shopify/app-bridge').then(({ createApp }) => {
        const app = createApp({
          apiKey: '901026f9a765bce56ce9682beee6b90e',
          host: host || undefined,
          shop: shop || undefined,
        })
        window.__SHOPIFY_APP__ = app
        console.log('🔗 App Bridge initialized for:', shop)
      }).catch(err => {
        console.log('⚡ App Bridge not available (standalone mode)')
      })
    }
  }, [])

  return children
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <AppBridgeWrapper>
        <App />
      </AppBridgeWrapper>
    </BrowserRouter>
  </React.StrictMode>
)
