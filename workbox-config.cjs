
module.exports = {
  globDirectory: 'dist',
  globPatterns: ['**/*.{html,js,css,png,svg,webp,json}'],
  swDest: 'dist/sw.js',
  clientsClaim: true,
  skipWaiting: true,
  navigateFallback: '/index.html',
  runtimeCaching: [
    { urlPattern: ({request}) => request.destination === 'document', handler: 'NetworkFirst', options: { cacheName: 'pages', networkTimeoutSeconds: 3 } },
    { urlPattern: ({request}) => ['style','script','worker'].includes(request.destination), handler: 'StaleWhileRevalidate', options: { cacheName: 'assets' } },
    { urlPattern: ({request}) => ['image','font'].includes(request.destination), handler: 'CacheFirst', options: { cacheName: 'static', expiration: { maxEntries: 60, maxAgeSeconds: 60*60*24*30 } } }
  ]
}
