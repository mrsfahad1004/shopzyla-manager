const express = require('express');
const path = require('path');
const https = require('https');
const http = require('http');
const fs = require('fs');
const crypto = require('crypto');

// Load env
const envPath = path.join(__dirname, '..', '..', '.env');
if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, 'utf8');
  envContent.split('\n').forEach(line => {
    const [key, ...val] = line.split('=');
    if (key && val.length) process.env[key.trim()] = val.join('=').trim();
  });
}

const HTTP_PORT = process.env.HTTP_PORT || 3000;
const HTTPS_PORT = process.env.HTTPS_PORT || 3443;
const DIST = path.join(__dirname, 'dist');
const SHOPIFY_STORE = process.env.SHOPIFY_STORE || 'gmxdth-9b';
const SHOPIFY_STORE_URL = process.env.SHOPIFY_STORE_URL || `https://${SHOPIFY_STORE}.myshopify.com`;
const ACCESS_TOKEN = process.env.SHOPIFY_ACCESS_TOKEN;
const API_KEY = process.env.SHOPIFY_API_KEY || '8f7f32d0b4f52d20d2109b8eaf0f620c';
const API_VERSION = '2024-10';

// Self-signed cert paths
const CERT_DIR = '/tmp/shopzyla-certs';
const CERT_PATH = path.join(CERT_DIR, 'cert.pem');
const KEY_PATH = path.join(CERT_DIR, 'key.pem');

if (!fs.existsSync(CERT_PATH) || !fs.existsSync(KEY_PATH)) {
  console.error('❌ SSL certificates not found. Run /tmp/generate-cert.sh first');
  process.exit(1);
}

const app = express();
app.set('trust proxy', 1);
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// CORS + CSP for embedded Shopify Admin
app.use((req, res, next) => {
  res.setHeader('Content-Security-Policy', 
    "frame-ancestors https://*.myshopify.com https://admin.shopify.com https://*.shopify.com 'self';"
  );
  res.setHeader('X-Frame-Options', 'ALLOWALL');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With');
  if (req.method === 'OPTIONS') return res.status(204).end();
  next();
});

// ============================================
// SHOPIFY API PROXY
// ============================================
function shopifyRequest(method, endpoint, body) {
  return new Promise((resolve, reject) => {
    const apiUrl = endpoint.startsWith('http')
      ? new URL(endpoint)
      : new URL(`https://${SHOPIFY_STORE}.myshopify.com/admin/api/${API_VERSION}${endpoint}`);
    
    const options = {
      hostname: apiUrl.hostname,
      path: apiUrl.pathname + apiUrl.search,
      method: method,
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
        try {
          resolve({ status: res.statusCode, data: data ? JSON.parse(data) : null });
        } catch (e) {
          resolve({ status: res.statusCode, data: data });
        }
      });
    });
    r.on('error', reject);
    r.setTimeout(30000, () => { r.destroy(); reject(new Error('Timeout')); });
    if (body) r.write(JSON.stringify(body));
    r.end();
  });
}

// Shopify REST API proxy
app.use('/api/shopify', async (req, res) => {
  try {
    const endpoint = req.url.startsWith('/') ? req.url : '/' + req.url;
    const result = await shopifyRequest(req.method, endpoint, req.body);
    res.status(result.status).json(result.data || {});
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Shopify GraphQL proxy
app.post('/api/graphql', async (req, res) => {
  try {
    const result = await shopifyRequest('POST', '/graphql.json', req.body);
    res.status(result.status).json(result.data || {});
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
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
      shopInfo: shopInfo.data?.shop || null,
      productCount: productCount.data?.count || 0,
      collectionCount: collectionsCount.data?.count || 0,
      orderCount: ordersCount.data?.count || 0,
    });
  } catch (err) {
    res.json({ connected: false, store: SHOPIFY_STORE_URL, error: err.message });
  }
});

// ============================================
// STATIC FILES (with SPA fallback)
// ============================================
const staticDir = path.resolve(DIST);

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
  
  const filePath = req.path === '/' ? path.join(staticDir, 'index.html') : path.join(staticDir, req.path);
  
  if (fs.existsSync(filePath) && fs.statSync(filePath).isFile()) {
    const ext = path.extname(filePath);
    if (ext === '.html') {
      const html = fs.readFileSync(filePath, 'utf8');
      res.setHeader('Content-Type', 'text/html');
      return res.send(injectConfig(html));
    }
    return next();
  }
  
  // SPA fallback
  const indexPath = path.join(staticDir, 'index.html');
  if (fs.existsSync(indexPath)) {
    const html = fs.readFileSync(indexPath, 'utf8');
    res.setHeader('Content-Type', 'text/html');
    return res.send(injectConfig(html));
  }
  
  next();
});

// Serve static assets
app.use(express.static(DIST));

// 404 for unknown API routes
app.use('/api/', (req, res) => {
  res.status(404).json({ error: 'API endpoint not found' });
});

// ============================================
// START BOTH HTTP AND HTTPS
// ============================================
const sslOptions = {
  key: fs.readFileSync(KEY_PATH),
  cert: fs.readFileSync(CERT_PATH),
};

// HTTP server (redirects to HTTPS)
http.createServer((req, res) => {
  const host = req.headers.host || 'localhost';
  res.writeHead(301, { Location: `https://${host.replace(/:\d+/, '')}:${HTTPS_PORT}${req.url}` });
  res.end();
}).listen(HTTP_PORT, '0.0.0.0');

// HTTPS server
https.createServer(sslOptions, app).listen(HTTPS_PORT, '0.0.0.0', () => {
  console.log('');
  console.log('  ╔═══════════════════════════════════╗');
  console.log('  ║      🚀 ShopZyla Manager App      ║');
  console.log('  ╚═══════════════════════════════════╝');
  console.log('');
  console.log('  ➜  Local HTTP:   http://localhost:' + HTTP_PORT + '/');
  console.log('  ➜  Local HTTPS:  https://localhost:' + HTTPS_PORT + '/');
  console.log('  ➜  API:          http://localhost:' + HTTP_PORT + '/api/store');
  console.log('');
  console.log('  📦  Store:       ' + SHOPIFY_STORE_URL);
  console.log('  🔑  API:         ' + (ACCESS_TOKEN ? 'Connected ✓' : 'No Token ✗'));
  console.log('  🔒  HTTPS:       Self-signed (accept browser warning once)');
  console.log('  🔗  App Bridge:  Enabled for embedded Shopify Admin');
  console.log('');
  console.log('  ⚠️  IMPORTANT: For Shopify Admin embedding:');
  console.log('  📋  Set App URL in Shopify Admin to: https://localhost:' + HTTPS_PORT);
  console.log('  ✅  Or use the tunnel URL: https://shopzyla-mgr.loca.lt');
  console.log('');
});
