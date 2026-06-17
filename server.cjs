const express = require('express');
const path = require('path');
const https = require('https');
const http = require('http');
const fs = require('fs');

const PORT = process.env.PORT || 3000;
const DIST = path.join(__dirname, 'dist');
const SHOPIFY_STORE = process.env.SHOPIFY_STORE || 'gmxdth-9b';
const SHOPIFY_STORE_URL = process.env.SHOPIFY_STORE_URL || `https://${SHOPIFY_STORE}.myshopify.com`;
const ACCESS_TOKEN = process.env.SHOPIFY_ACCESS_TOKEN;
const API_KEY = process.env.SHOPIFY_API_KEY || '901026f9a765bce56ce9682beee6b90e';
const API_VERSION = '2024-10';
const APP_URL = process.env.APP_URL || `https://shopzyla-manager-production.up.railway.app`;

const app = express();
app.set('trust proxy', 1);
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Log all requests
app.use((req, res, next) => {
  console.log(`  ➜ ${req.method} ${req.url}`);
  next();
});

// CSP for embedded Shopify
app.use((req, res, next) => {
  res.setHeader('Content-Security-Policy',
    `frame-ancestors https://*.myshopify.com https://admin.shopify.com https://*.shopify.com 'self';`
  );
  res.setHeader('X-Frame-Options', 'ALLOWALL');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With');
  if (req.method === 'OPTIONS') return res.status(204).end();
  next();
});

// Shopify API helper
function shopifyRequest(method, endpoint, body) {
  return new Promise((resolve, reject) => {
    const store = SHOPIFY_STORE.includes('.') ? SHOPIFY_STORE : `${SHOPIFY_STORE}.myshopify.com`;
    const options = {
      hostname: store,
      path: `/admin/api/${API_VERSION}${endpoint}`,
      method,
      headers: {
        'X-Shopify-Access-Token': ACCESS_TOKEN || '',
        'Content-Type': 'application/json',
        'User-Agent': 'ShopZyla-Manager/1.0',
      },
      rejectUnauthorized: false,
    };
    const req = https.request(options, (res) => {
      let data = '';
      res.on('data', c => data += c);
      res.on('end', () => {
        try { resolve({ status: res.statusCode, data: data ? JSON.parse(data) : null }); }
        catch (e) { resolve({ status: res.statusCode, data }); }
      });
    });
    req.on('error', reject);
    req.setTimeout(30000, () => { req.destroy(); reject(new Error('Timeout')); });
    if (body) req.write(JSON.stringify(body));
    req.end();
  });
}

// API Routes
app.use('/api/shopify', async (req, res) => {
  try {
    const ep = req.url.startsWith('/') ? req.url : '/' + req.url;
    const result = await shopifyRequest(req.method, ep, req.body);
    res.status(result.status).json(result.data || {});
  } catch (err) { res.status(500).json({ error: err.message }); }
});

app.post('/api/graphql', async (req, res) => {
  try {
    const result = await shopifyRequest('POST', '/graphql.json', req.body);
    res.status(result.status).json(result.data || {});
  } catch (err) { res.status(500).json({ error: err.message }); }
});

app.get('/api/store', async (req, res) => {
  try {
    const [shopInfo, productCount, collectionsCount, ordersCount] = await Promise.all([
      shopifyRequest('GET', '/shop.json').catch(() => ({ data: null })),
      shopifyRequest('GET', '/products/count.json').catch(() => ({ data: null })),
      shopifyRequest('GET', '/collections/count.json').catch(() => ({ data: null })),
      shopifyRequest('GET', '/orders/count.json').catch(() => ({ data: null })),
    ]);
    res.json({
      connected: !!ACCESS_TOKEN,
      store: SHOPIFY_STORE_URL,
      apiKey: API_KEY,
      appUrl: APP_URL,
      productCount: productCount.data?.count || 0,
      collectionCount: collectionsCount.data?.count || 0,
      orderCount: ordersCount.data?.count || 0
    });
  } catch (err) {
    res.json({ connected: false, store: SHOPIFY_STORE_URL, error: err.message });
  }
});

// Simple health check - respond quickly
app.get('/health', (req, res) => {
  res.json({ status: 'ok', time: Date.now() });
});

// SPA middleware
function injectConfig(html) {
  const config = JSON.stringify({
    apiKey: API_KEY,
    storeUrl: SHOPIFY_STORE_URL,
    storeName: SHOPIFY_STORE,
    connected: !!ACCESS_TOKEN,
  });
  return html.replace('</title>', `</title><script>window.__SHOPIFY_CONFIG__=${config}</script>`);
}

// Serve static files with SPA fallback
app.use((req, res, next) => {
  if (req.path.startsWith('/api/')) return next();
  if (req.path.startsWith('/health')) return next();

  const filePath = path.join(DIST, req.path === '/' ? 'index.html' : req.path);
  try {
    if (fs.existsSync(filePath) && fs.statSync(filePath).isFile()) {
      if (path.extname(filePath) === '.html') {
        return res.send(injectConfig(fs.readFileSync(filePath, 'utf8')));
      }
      return next();
    }
  } catch(e) { /* file not found */ }

  // SPA fallback
  const indexPath = path.join(DIST, 'index.html');
  if (fs.existsSync(indexPath)) {
    return res.send(injectConfig(fs.readFileSync(indexPath, 'utf8')));
  }
  next();
});

app.use(express.static(DIST));
app.use('/api/', (req, res) => res.status(404).json({ error: 'API endpoint not found' }));
app.use((req, res) => res.status(200).send(injectConfig(fs.readFileSync(path.join(DIST, 'index.html'), 'utf8'))));

// Create server with http module
const server = http.createServer(app);

server.listen(PORT, '0.0.0.0', () => {
  console.log(`  🚀 ShopZyla Manager v1.0`);
  console.log(`  📍 http://localhost:${PORT}/`);
  console.log(`  📦 ${SHOPIFY_STORE_URL}`);
  console.log(`  🔑 ${ACCESS_TOKEN ? 'Connected ✓' : 'No Token ✗'}`);
  console.log(`  🌍 ${APP_URL}`);
});

// Handle errors gracefully
server.on('error', (err) => {
  console.error('Server error:', err.message);
  setTimeout(() => process.exit(1), 1000);
});

// Graceful shutdown
process.on('SIGTERM', () => { server.close(() => process.exit(0)); });
process.on('SIGINT', () => { server.close(() => process.exit(0)); });
