const VERSION = 'v3';

function log(messages) {
  console.log(VERSION, messages);
}

log('Installing service worker');

self.addEventListener('install', (event) =>
  event.waitUntil(installServiceWorker()),
);

async function installServiceWorker() {
  log('Service Worker installation started');
  const request = new Request('offline.html');
  const response = await fetch(request);
  log('response received after loading offline.html', response);
  if (response.status !== 200) {
    throw new Error('Could not load offline page!');
  }

  const cache = await caches.open('app-cache');

  cache.put(request, response);
  log('cached offline.html');
}

self.addEventListener('install', () => {
  log('version is installed');
});

self.addEventListener('activate', () => {
  log('version is activated');
});
