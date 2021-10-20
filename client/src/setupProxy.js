const {createProxyMiddleware} = require('http-proxy-middleware');

module.exports = function (app) {
    app.use(['/socket.io'],createProxyMiddleware({
        target: 'http://localhost:80',
        changeOrigin: true,
        ws: true,
    }));
};