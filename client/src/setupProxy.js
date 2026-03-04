const { createProxyMiddleware } = require('http-proxy-middleware');

const proxyTarget =
  process.env.API_PROXY_TARGET ||
  process.env.REACT_APP_API_PROXY_TARGET ||
  'http://localhost:4567';

module.exports = function(app) {
  app.use(
    '/api',
    createProxyMiddleware({
      target: proxyTarget,
      changeOrigin: true,
    })
  );
};
