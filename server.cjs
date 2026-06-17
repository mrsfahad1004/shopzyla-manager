const express = require('express');
const path = require('path');
const https = require('https');
const fs = require('fs');

const PORT = process.env.PORT || 3000;
const DIST = path.join(__dirname, 'dist');
const SHOPIFY_STORE = process.env.SHOPIFY_STORE || 'gmxdth-9b';
const SHOPIFY_STORE_URL = process.env.SHOPIFY_STORE_URL || `https://${SHOPIFY_STORE}.myshopify.com`;
const ACCESS_TOKEN = process.env.SHOPIFY_ACCESS_TOKEN;
const API_KEY = process.env.SHOPIFY_API_KEY || '901026f9a765bce56ce9682beee6b90e';
const API_VERSION = '2024-10';
const APP_URL = process.env.APP_URL || 'https://shopzyla-manager-production.up.railway.app';

const app = express();
app.set('trust proxy', 1);
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// CSP + CORS for embedded Shopify Admin
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

// ── Shopify API Proxy ──
function shopifyRequest(method, endpoint, body) {
  return new Promise((resolve, reject) => {
    const store = SHOPIFY_STORE.includes('.') ? SHOPIFY_STORE : `${SHOPIFY_STORE}.myshopify.com`;
    const options = {
      hostname: store,
      path: `/admin/api/${API_VERSION}${endpoint}`,
      method,
      headers: {
        'X-Shopify-Access-Token': ACCESS_TOKEN,
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

// REST API proxy
app.use('/api/shopify', async (req, res) => {
  try {
    const ep = req.url.startsWith('/') ? req.url : '/' + req.url;
    const result = await shopifyRequest(req.method, ep, req.body);
    res.status(result.status).json(result.data || {});
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// GraphQL proxy
app.post('/api/graphql', async (req, res) => {
  try {
    const result = await shopifyRequest('POST', '/graphql.json', req.body);
    res.status(result.status).json(result.data || {});
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// Store status
app.get('/api/store', async (req, res) => {
  try {
    const shopInfo = await shopifyRequest('GET', '/shop.json');
    const productCount = await shopifyRequest('GET', '/products/count.json');
    const collectionsCount = await shopifyRequest('GET', '/collections/count.json');
    const ordersCount = await shopifyRequest('GET', '/orders/count.json');
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

// ── Custom App Install Handler ──
// Shopify Custom Apps do NOT need OAuth. Just serve the app.
app.get('/auth/install', (req, res) => {
  const shop = req.query.shop || SHOPIFY_STORE;
  res.redirect(`/?shop=${shop}`);
});

// ── Static files with SPA fallback ──
function injectConfig(html) {
  const config = JSON.stringify({
    apiKey: API_KEY,
    storeUrl: SHOPIFY_STORE_URL,
    storeName: SHOPIFY_STORE,
    connected: !!ACCESS_TOKEN,
  });
  return html.replace('</title>', `</title><script>window.__SHOPIFY_CONFIG__=${config}</script>`);
}

app.use((req, res, next) => {
  if (req.path.startsWith('/api/')) return next();

  const filePath = path.join(DIST, req.path === '/' ? 'index.html' : req.path);
  if (fs.existsSync(filePath) && fs.statSync(filePath).isFile()) {
    if (path.extname(filePath) === '.html') {
      return res.send(injectConfig(fs.readFileSync(filePath, 'utf8')));
    }
    return next();
  }

  // SPA fallback
  const indexPath = path.join(DIST, 'index.html');
  if (fs.existsSync(indexPath)) {
    return res.send(injectConfig(fs.readFileSync(indexPath, 'utf8')));
  }
  next();
});

app.use(express.static(DIST));
app.use('/api/', (req, res) => res.status(404).json({ error: 'API endpoint not found' }));

// ── Start ──
app.listen(PORT, '0.0.0.0', () => {
  console.log(`  🚀 ShopZyla Manager v1.0`);
  console.log(`  📍 http://localhost:${PORT}/`);
  console.log(`  📦 ${SHOPIFY_STORE_URL}`);
  console.log(`  🔑 ${ACCESS_TOKEN ? 'Connected ✓' : 'No Token ✗'}`);
  if (ACCESS_TOKEN) {
    shopifyRequest('GET', '/shop.json').then(r => {
      console.log(`  🏪 ${r.data?.shop?.name || 'ShopZyla'} — connected`);
    }).catch(() => {});
  }
});
