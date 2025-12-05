const preLoad = function () {
    return caches.open("offline").then(function (cache) {
        // caching index and important routes
        return cache.addAll(filesToCache);
    });
};

self.addEventListener("install", function (event) {
    event.waitUntil(preLoad());
});

const filesToCache = [
    '/',
    '/offline.html',
    '/dashboard',
    '/login',
    '/register'
];

const checkResponse = function (request) {
    return new Promise(function (fulfill, reject) {
        fetch(request).then(function (response) {
            // Allow redirects (302, 301) and successful responses (200-299)
            // Only reject on 404 or network errors
            if (response.status === 404) {
                reject();
            } else if (response.status >= 200 && response.status < 400) {
                fulfill(response);
            } else {
                // For other status codes, try to fulfill but let the app handle it
                fulfill(response);
            }
        }, reject);
    });
};

const addToCache = function (request) {
    // Only cache http(s) requests
    if (!request.url.startsWith('http')) {
        return Promise.resolve();
    }
    return caches.open("offline").then(function (cache) {
        return fetch(request).then(function (response) {
            return cache.put(request, response);
        });
    });
};


const returnFromCache = function (request) {
    return caches.open("offline").then(function (cache) {
        return cache.match(request).then(function (matching) {
            if (!matching || matching.status === 404) {
                return cache.match("offline.html");
            } else {
                return matching;
            }
        });
    });
};

self.addEventListener("fetch", function (event) {
    const url = new URL(event.request.url);

    // Skip service worker for API routes
    if (url.pathname.startsWith('/api/')) {
        return;
    }

    // Skip service worker for POST/PUT/DELETE/PATCH requests
    if (event.request.method !== 'GET') {
        return;
    }

    // Skip service worker for authenticated routes that might redirect
    // Let the browser handle these normally
    if (url.pathname.startsWith('/accounts/') ||
        url.pathname.startsWith('/transactions/') ||
        url.pathname.startsWith('/budgets/') ||
        url.pathname.startsWith('/goals/') ||
        url.pathname.startsWith('/profile') ||
        url.pathname.startsWith('/settings') ||
        url.pathname.startsWith('/reports')) {
        return;
    }

    event.respondWith(checkResponse(event.request).catch(function () {
        return returnFromCache(event.request);
    }));
    if(!event.request.url.startsWith('http')){
        event.waitUntil(addToCache(event.request));
    }
});
