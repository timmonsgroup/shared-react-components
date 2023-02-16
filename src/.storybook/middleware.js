const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function(app) {
  
    app.use(
        '/api/map',
        createProxyMiddleware({
            target: 'http://localhost:3001',
            changeOrigin: true,
            pathRewrite: {
              '^/api': ''
            },
        })
    );
  
    app.use(
        '/mapping',
        createProxyMiddleware({
            target: 'https://fht.dev.timmons-dev.com',
            changeOrigin: true,
        })
    );

    app.use(
        '/api',
        createProxyMiddleware({
            target: 'http://localhost:6006',
            changeOrigin: true,
            pathRewrite: {
              '^/api': ''
            },
        })
    );
};