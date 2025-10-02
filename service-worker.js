const CACHE_NAME = 'toolnine-cache-v1';
const urlsToCache = [
  '/',
  '/index.html',
  '/style.css',
  '/theme.js',
  '/script.js',
  '/about.html',
  '/contact.html',
  '/privacy.html',
  '/disclaimer.html',
  '/blog.html',
  // All tool pages:
  '/tools/image-to-pdf.html',
  '/tools/image-compressor.html',
  '/tools/image-resizer.html',
  '/tools/convert-png-jpg.html',
  '/tools/steganography.html',
  '/tools/image-palette-extractor.html',
  '/tools/image-placeholder-generator.html',
  '/tools/text-diff.html',
  '/tools/text-encryptor.html',
  '/tools/text-to-pdf.html',
  '/tools/word-counter.html',
  '/tools/unit-converter.html',
  '/tools/document-scanner.html',
  '/tools/url-encoder.html',
  '/tools/hash-generator.html',
  '/tools/password-manager.html',
  '/tools/password-generator.html',
  '/tools/qr-generator.html',
  '/tools/image-to-prompt.html',
  '/tools/json-formatter.html',
  '/tools/html-viewer.html',
  '/tools/line-operations.html',
  '/tools/text-cleaner.html',
  '/tools/delivery-note-generator.html',
  '/tools/csv-editor.html',
  '/tools/calculator.html',
  // External resources:
  'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;800&display=swap'
];
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(urlsToCache))
  );
});
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => response || fetch(event.request))
  );
});
self.addEventListener('activate', event => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then(cacheNames => Promise.all(
      cacheNames.map(cacheName => {
        if (!cacheWhitelist.includes(cacheName)) {
          return caches.delete(cacheName);
        }
      })
    ))
  );
});
