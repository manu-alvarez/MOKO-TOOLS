// Service Worker para Moko Tooling & Utils PWA
const CACHE_NAME = 'moko-tools-v1'
const urlsToCache = [
  '/',
  '/manifest.json',
  '/favicon.svg',
  '/og-image.png',
  '/data/tools.json',
]

// Instalar Service Worker y cachear recursos
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('Service Worker: Caching files')
      return cache.addAll(urlsToCache).catch((error) => {
        console.error('Service Worker: Cache addAll error:', error)
      })
    })
  )
  self.skipWaiting()
})

// Activar Service Worker y limpiar cachés antiguos
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            console.log('Service Worker: Deleting old cache:', cacheName)
            return caches.delete(cacheName)
          }
        })
      )
    })
  )
  self.clients.claim()
})

// Estrategia: Network First, fallback to Cache
self.addEventListener('fetch', (event) => {
  event.respondWith(
    fetch(event.request)
      .then((response) => {
        // Clonar la respuesta
        const responseClone = response.clone()
        
        // Guardar en caché
        caches.open(CACHE_NAME).then((cache) => {
          cache.put(event.request, responseClone)
        })
        
        return response
      })
      .catch(() => {
        // Si falla la red, intentar con caché
        return caches.match(event.request).then((cachedResponse) => {
          if (cachedResponse) {
            return cachedResponse
          }
          
          // Si no hay en caché, devolver respuesta genérica
          return new Response('Offline - No cached version available', {
            status: 503,
            statusText: 'Service Unavailable',
            headers: new Headers({
              'Content-Type': 'text/plain',
            }),
          })
        })
      })
  )
})
