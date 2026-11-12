var V='cod-v15',T='cod-tiles-v3',F=['./','index.html','styles.css','app.js','manifest.webmanifest','icon-192.png','icon-512.png','icon-512-maskable.png','privacy.html'];
var API=/firebaseio\.com|router\.project-osrm\.org|nominatim\.openstreetmap\.org/;
var TILE=/basemaps\.cartocdn\.com|tile\.openstreetmap\.org|cdnjs\.cloudflare\.com/;
var LINK=/[?&](t|l|v|go)=/;
self.addEventListener('install',function(e){e.waitUntil(caches.open(V).then(function(c){return Promise.all(F.map(function(u){return c.add(u).catch(function(){})}))}).then(function(){return self.skipWaiting()}))});
self.addEventListener('activate',function(e){e.waitUntil(caches.keys().then(function(k){return Promise.all(k.filter(function(x){return x!==V&&x!==T}).map(function(x){return caches.delete(x)}))}).then(function(){return self.clients.claim()}))});
function trim(c,n){c.keys().then(function(k){if(k.length>n)c.delete(k[0]).then(function(){trim(c,n)})})}
self.addEventListener('fetch',function(e){
  var r=e.request;if(r.method!=='GET'||API.test(r.url))return;
  if(TILE.test(r.url)){e.respondWith(caches.open(T).then(function(c){return c.match(r).then(function(m){return m||fetch(r).then(function(x){if(x.ok||x.type==='opaque'){c.put(r,x.clone());trim(c,400)}return x})})}));return}
  var u=new URL(r.url);if(u.origin!==location.origin)return;
  var lien=LINK.test(u.search);
  e.respondWith(fetch(r).then(function(x){if(x.ok&&!lien){var c=x.clone();caches.open(V).then(function(y){y.put(r,c)})}return x}).catch(function(){return caches.match(r,{ignoreSearch:true}).then(function(m){return m||caches.match('index.html')})}));
});
