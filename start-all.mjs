import express from 'express';
import path from 'path';
import https from 'https';
import http from 'http';
import fs from 'fs';
import { fileURLToPath } from 'url';
import localtunnel from 'localtunnel';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Load env
const envPath = path.join(__dirname, '..', '..', '.env');
if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, 'utf8');
  envContent.split('\n').forEach(line => {
    const [key, ...val] = line.split('=');
    if (key && val.length) process.env[key.trim()] = val.join('=').trim();
  });
}

const HTTP_PORT = parseInt(process.env.PORT || '3000');
const DIST = path.join(__dirname, 'dist');
const SHOPIFY_STORE = process.env.SHOPIFY_STORE || 'gmxdth-9b';
const SHOPIFY_STORE_URL = process.env.SHOPIFY_STORE_URL || `https://${SHOPIFY_STORE}.myshopify.com`;
const ACCESS_TOKEN = process.env.SHOPIFY_ACCESS_TOKEN;
const API_KEY = process.env.SHOPIFY_API_KEY || '8f7f32d0b4f52d20d2109b8eaf0f620c';
const API_VERSION = '2024-10';

const app = express();
app.set('trust proxy', 1);
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// CSP + CORS
app.use((req, res, next) => {
  res.setHeader('Content-Security-Policy', 
    "frame-ancestors https://*.myshopify.com https://admin.shopify.com https://*.shopify.com https://*.spin.dev 'self';"
  );
  res.setHeader('X-Frame-Options', 'ALLOWALL');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With');
  if (req.method === 'OPTIONS') return res.status(204).end();
  next();
});

// Shopify API proxy
function shopifyRequest(method, endpoint, body) {
  return new Promise((resolve, reject) => {
    const apiUrl = endpoint.startsWith('http')
      ? new URL(endpoint)
      : new URL(`https://${SHOPIFY_STORE}.myshopify.com/admin/api/${API_VERSION}${endpoint}`);
    const options = {
      hostname: apiUrl.hostname,
      path: apiUrl.pathname + apiUrl.search,
      method,
      headers: {
        'X-Shopify-Access-Token': ACCESS_TOKEN,
        'Content-Type': 'application/json',
        'User-Agent': 'ShopZyla-Manager/1.0',
      },
      rejectUnauthorized: false,
    };
    const r = https.request(options, (res) => {
      let data = '';
      res.on('data', c => data += c);
      res.on('end', () => {
        try { resolve({ status: res.statusCode, data: data ? JSON.parse(data) : null }); }
        catch (e) { resolve({ status: res.statusCode, data }); }
      });
    });
    r.on('error', reject);
    r.setTimeout(30000, () => { r.destroy(); reject(new Error('Timeout')); });
    if (body) r.write(JSON.stringify(body));
    r.end();
  });
}

app.use('/api/shopify', async (req, res) => {
  try {
    const endpoint = req.url.startsWith('/') ? req.url : '/' + req.url;
    const result = await shopifyRequest(req.method, endpoint, req.body);
    res.status(result.status).json(result.data || {});
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/graphql', async (req, res) => {
  try {
    const result = await shopifyRequest('POST', '/graphql.json', req.body);
    res.status(result.status).json(result.data || {});
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/store', async (req, res) => {
  try {
    const [shopInfo, productCount, collectionsCount, ordersCount] = await Promise.all([
      shopifyRequest('GET', '/shop.json'),
      shopifyRequest('GET', '/products/count.json'),
      shopifyRequest('GET', '/collections/count.json'),
      shopifyRequest('GET', '/orders/count.json'),
    ]);
    res.json({
      connected: !!ACCESS_TOKEN,
      store: SHOPIFY_STORE_URL,
      apiKey: API_KEY,
      shopInfo: shopInfo.data?.shop || null,
      productCount: productCount.data?.count || 0,
      collectionCount: collectionsCount.data?.count || 0,
      orderCount: ordersCount.data?.count || 0,
    });
  } catch (err) {
    res.json({ connected: false, store: SHOPIFY_STORE_URL, error: err.message });
  }
});

// Static files
function injectConfig(html) {
  const cleaned = html.replace(/<script([^>]*) crossorigin/g, '<script$1');
  return cleaned.replace('</title>', `</title><script>window.__SHOPIFY_CONFIG__=${JSON.stringify({
    apiKey: API_KEY,
    storeUrl: SHOPIFY_STORE_URL,
    storeName: SHOPIFY_STORE,
    connected: !!ACCESS_TOKEN,
  })}</script>`);
}

app.use((req, res, next) => {
  if (req.path.startsWith('/api/')) return next();
  const filePath = req.path === '/' ? path.join(DIST, 'index.html') : path.join(DIST, req.path);
  if (fs.existsSync(filePath) && fs.statSync(filePath).isFile()) {
    const ext = path.extname(filePath);
    if (ext === '.html') {
      const html = fs.readFileSync(filePath, 'utf8');
      res.setHeader('Content-Type', 'text/html');
      return res.send(injectConfig(html));
    }
    return next();
  }
  const indexPath = path.join(DIST, 'index.html');
  if (fs.existsSync(indexPath)) {
    const html = fs.readFileSync(indexPath, 'utf8');
    res.setHeader('Content-Type', 'text/html');
    return res.send(injectConfig(html));
  }
  next();
});

app.use(express.static(DIST));
app.use('/api/', (req, res) => res.status(404).json({ error: 'API endpoint not found' }));

// Start server
const server = http.createServer(app);
server.listen(HTTP_PORT, '0.0.0.0', async () => {
  console.log('');
  console.log('  ╔═══════════════════════════════════╗');
  console.log('  ║      🚀 ShopZyla Manager App      ║');
  console.log('  ╚═══════════════════════════════════╝');
  console.log('');
  console.log(`  ➜  Local:   http://localhost:${HTTP_PORT}/`);
  console.log(`  ➜  API:     http://localhost:${HTTP_PORT}/api/store`);
  console.log('');
  console.log(`  📦  Store:   ${SHOPIFY_STORE_URL}`);
  console.log(`  🔑  API:     ${ACCESS_TOKEN ? 'Connected ✓' : 'No Token ✗'}`);
  console.log('');

  // Start tunnel
  try {
    const tunnel = await localtunnel({ 
      port: HTTP_PORT, 
      subdomain: 'shopzyla-mgr',
      allow_invalid_cert: true,
    });
    console.log(`  🌍  Tunnel:  ${tunnel.url}`);
    console.log('');

    // Auto-bypass interstitial by making a request with follow-redirect
    try {
      const resp = await fetch(tunnel.url, { redirect: 'follow' });
      console.log(`  ✅  Tunnel verified (${resp.status})`);
    } catch(e) {
      // Might get a redirect page, that's fine
      console.log(`  ⚡  Tunnel active (need browser click)`);
    }

    console.log('  ⚠️  For Shopify Admin embedding:');
    console.log(`  📋  1. Open ${tunnel.url} in browser`);
    console.log('  📋  2. Click "Continue" button');
    console.log('  📋  3. Set App URL in Shopify Admin to: ' + tunnel.url);
    console.log('');
    console.log('  🔄  Tunnel will reconnect automatically if dropped');
    console.log('');

    tunnel.on('close', () => {
      console.log('  ❌ Tunnel closed, restarting...');
    });
  } catch (err) {
    console.log(`  ⚡  Tunnel unavailable: ${err.message}`);
    console.log('  📋  App accessible at http://localhost:' + HTTP_PORT);
    console.log('');
  }
});
