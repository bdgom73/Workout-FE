const {createProxyMiddleware} =  require('http-proxy-middleware');


module.exports = (app) => {
    app.use(
        '/myApi', 
        createProxyMiddleware({
            target: 'http://127.0.0.1:8080',
            changeOrigin: true,
        }));
    app.use(
        '/login/oauth/access_token', 
        createProxyMiddleware({
            target: 'https://github.com',
            changeOrigin: true,
        }));
    app.use(
        '/user', 
        createProxyMiddleware({
            target: 'https://api.github.com',
            changeOrigin: true,
        }));
};