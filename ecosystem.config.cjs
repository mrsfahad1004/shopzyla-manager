module.exports = {
  apps: [{
    name: 'shopzyla-manager',
    script: 'server.cjs',
    cwd: '/root/Documents/Codex/2026-06-12/i-have-connected-you-to-my/proper-manager/web/frontend',
    env: {
      PORT: 3000,
      SHOPIFY_API_KEY: '8f7f32d0b4f52d20d2109b8eaf0f620c',
      SHOPIFY_API_SECRET: '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',
      SHOPIFY_ACCESS_TOKEN: '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',
      SHOPIFY_STORE: 'gmxdth-9b',
      SHOPIFY_STORE_URL: 'https://gmxdth-9b.myshopify.com',
    },
    max_memory_restart: '500M',
    error_file: '/tmp/shopzyla-pm2-error.log',
    out_file: '/tmp/shopzyla-pm2-out.log',
    merge_logs: true,
    autorestart: true,
    watch: false,
    max_restarts: 10,
    restart_delay: 3000,
  }]
}
