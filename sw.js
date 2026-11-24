const C="libreta-v11";
const ASSETS=["./","./index.html","./manifest.webmanifest","./icons/icon-192.png","./icons/icon-512.png","./icons/icon-180.png"];
self.addEventListener("install",e=>{e.waitUntil(caches.open(C).then(c=>Promise.all(ASSETS.map(a=>fetch(a,{cache:"no-store"}).then(r=>c.put(a,r)))))) ;self.skipWaiting();});
self.addEventListener("activate",e=>{e.waitUntil(caches.keys().then(k=>Promise.all(k.filter(x=>x!==C).map(x=>caches.delete(x)))).then(()=>self.clients.claim()));});
self.addEventListener("fetch",e=>{
  if(e.request.method!=="GET")return;
  const u=new URL(e.request.url);
  if(u.origin===location.origin){
    // siempre la versión más reciente del servidor (sin caché HTTP); la caché local solo sirve sin conexión
    e.respondWith(fetch(e.request.url,{cache:"no-store",credentials:"same-origin"}).then(r=>{if(r.ok){const cp=r.clone();caches.open(C).then(c=>c.put(e.request,cp));}return r;}).catch(()=>caches.match(e.request).then(r=>r||caches.match("./index.html"))));
  }else if(/(fonts\.googleapis\.com|fonts\.gstatic\.com|cdn\.jsdelivr\.net)$/.test(u.hostname)){
    e.respondWith(caches.match(e.request).then(r=>r||fetch(e.request).then(res=>{const cp=res.clone();caches.open(C).then(c=>c.put(e.request,cp));return res;})));
  }
});
