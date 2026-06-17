import { Routes, Route } from 'react-router-dom'
import Sidebar from './components/Sidebar'
import AnimatedBackground from './components/AnimatedBackground'
import ChatPanel from './components/ChatPanel'
import ErrorBoundary from './components/ErrorBoundary'
import Dashboard from './pages/Dashboard'
import BulkManager from './pages/BulkManager'
import AutoImport from './pages/AutoImport'
import SEOHelper from './pages/SEOHelper'
import ContentCleaner from './pages/ContentCleaner'
import VisualStore from './pages/VisualStore'
import BulkImageEditor from './pages/BulkImageEditor'
import Import1688 from './pages/Import1688'
import AmazonPriceSync from './pages/AmazonPriceSync'
import SEOOptimizer from './pages/SEOOptimizer'
import Analytics from './pages/Analytics'
import SupplierManager from './pages/SupplierManager'
import SmartAutomation from './pages/SmartAutomation'
import SmartShipping from './pages/SmartShipping'
import ShippingRegions from './pages/ShippingRegions'
import LogisticsIntel from './pages/LogisticsIntel'
import { theme } from './theme'

export default function App() {
  return (
    <ErrorBoundary>
      <div style={{
        display: 'flex',
        minHeight: '100vh',
        background: theme.colors.bg,
        position: 'relative',
      }}>
        <AnimatedBackground />
        <Sidebar />
        <ChatPanel />
        <main style={{
          marginLeft: '240px',
          flex: 1,
          padding: '32px 40px',
          position: 'relative',
          zIndex: 1,
          minHeight: '100vh',
          maxWidth: 'calc(100vw - 240px)',
          overflowX: 'hidden',
        }}>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/bulk-manager" element={<BulkManager />} />
            <Route path="/auto-import" element={<AutoImport />} />
            <Route path="/seo-helper" element={<SEOHelper />} />
            <Route path="/content-cleaner" element={<ContentCleaner />} />
            <Route path="/visual-store" element={<VisualStore />} />
            <Route path="/bulk-image-editor" element={<BulkImageEditor />} />
            <Route path="/import-1688" element={<Import1688 />} />
            <Route path="/amazon-price-sync" element={<AmazonPriceSync />} />
            <Route path="/seo-optimizer" element={<SEOOptimizer />} />
            <Route path="/analytics" element={<Analytics />} />
            <Route path="/supplier-manager" element={<SupplierManager />} />
            <Route path="/smart-automation" element={<SmartAutomation />} />
            <Route path="/smart-shipping" element={<SmartShipping />} />
            <Route path="/shipping-regions" element={<ShippingRegions />} />
            <Route path="/logistics-intel" element={<LogisticsIntel />} />
          </Routes>
        </main>
      </div>
    </ErrorBoundary>
  )
}
