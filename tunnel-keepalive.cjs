const localtunnel = require('localtunnel');
const http = require('http');

let tunnel = null;
const PORT = 3000;
const SUBDOMAIN = 'shopzyla-mgr';

async function startTunnel() {
  if (tunnel) {
    try { tunnel.close(); } catch(e) {}
  }
  
  try {
    tunnel = await localtunnel({
      port: PORT,
      subdomain: SUBDOMAIN,
    });
    console.log('TUNNEL_URL=' + tunnel.url);
    
    tunnel.on('close', () => {
      console.log('Tunnel closed, reconnecting in 5s...');
      tunnel = null;
      setTimeout(startTunnel, 5000);
    });
    
    tunnel.on('error', (err) => {
      console.log('Tunnel error:', err.message);
    });
    
    // Keep alive by pinging every 30s
    setInterval(() => {
      try {
        http.get(`http://localhost:${PORT}/api/store`, (res) => {
          res.resume();
        }).on('error', () => {});
      } catch(e) {}
    }, 30000);
    
  } catch (err) {
    console.log('Tunnel failed: ' + err.message + ', retrying in 10s...');
    setTimeout(startTunnel, 10000);
  }
}

startTunnel();
