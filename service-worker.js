// Service Worker Code for PWA installation and caching

// 1. Define Cache Name and Files to Cache
const CACHE_NAME = 'onetool-cache-v1'; // Cache version name
const urlsToCache = [
  '/', // The start page of your app
  '/index.html',
  '/style.css',
  '/theme.js',
  // Add other necessary pages and assets here
  '/about.html',
  '/contact.html',
  '/privacy.html',
  '/disclaimer.html',
  '/blog.html',
  // Add tool-specific files here:
  '/tools/image-to-pdf.html',
  '/tools/image-compressor.html',
  '/tools/image-resizer.html',
  '/tools/convert-png-jpg.html',
  '/tools/steganography.html',
  '/tools/text-diff.html',
  '/tools/text-encryptor.html',
  '/tools/text-to-pdf.html',
  '/tools/word-counter.html',
  '/tools/unit-converter.html',
  '/tools/document-scanner.html',
  '/tools/url-encoder.html',
  '/tools/hash-generator.html',
  '/tools/password-generator.html',
  '/tools/qr-generator.html',
  '/tools/image-to-prompt.html',
  '/tools/json-formatter.html',
  // --- New Tools Added Here ---
  '/tools/html-viewer.html',
  '/tools/line-operations.html',
  '/tools/text-cleaner.html',
  // --- End New Tools ---
  // Add external resources (like jspdf or font) if needed
  'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;800&display=swap',
  'https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js',
  'https://cdnjs.cloudflare.com/ajax/libs/Sortable/1.15.0/Sortable.min.js',
  'https://cdnjs.cloudflare.com/ajax/libs/qrcodejs/1.0.0/qrcode.min.js',
  'https://cdnjs.cloudflare.com/ajax/libs/js-sha256/0.9.0/sha256.min.js',
  'https://cdnjs.cloudflare.com/ajax/libs/blueimp-md5/2.19.0/js/md5.min.js',
  'https://cdnjs.cloudflare.com/ajax/libs/diff-match-patch/20121119/diff_match_patch.js'
];

// 2. Install event: Cache all files listed in urlsToCache
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Opened cache');
        return cache.addAll(urlsToCache); // Cache all files for offline use
      })
  );
});

// 3. Fetch event: Intercept network requests and serve from cache first
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        if (response) {
          return response; // Return cached response if found
        }
        return fetch(event.request); // Fetch from network if not in cache
      })
  );
});

// 4. Activate event: Clean up old caches (if you update CACHE_NAME)
self.addEventListener('activate', event => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            return caches.delete(cacheName); // Delete old caches
          }
        })
      );
    })
  );
});
