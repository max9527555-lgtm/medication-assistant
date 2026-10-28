const PREFIX='drug-assistant:'+self.registration.scope+':';
const CACHE=PREFIX+'v3-theme-45af2a';
const ASSETS=['./','./index.html','./style.css','./app.js','./core.js','./crypto.js','./seed.json','./manifest.webmanifest','./icon.svg','./icon-192.png','./icon-512.png','./vendor/dexie.min.js','./vendor/xlsx.full.min.js','./vendor/pinyin-pro.js'];
self.addEventListener('install',event=>event.waitUntil(caches.open(CACHE).then(cache=>cache.addAll(ASSETS))));
self.addEventListener('activate',event=>event.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(key=>key.startsWith(PREFIX)&&key!==CACHE).map(key=>caches.delete(key)))).then(()=>self.clients.claim())));
self.addEventListener('fetch',event=>{
 const request=event.request,url=new URL(request.url),scope=new URL(self.registration.scope);
 if(request.method!=='GET'||url.origin!==scope.origin||!url.pathname.startsWith(scope.pathname)||url.pathname==='/health'||url.pathname.endsWith('/local-ca.cer'))return;
 event.respondWith(caches.open(CACHE).then(async cache=>{
   if(request.mode==='navigate'){const shell=await cache.match(new URL('./index.html',scope));return shell||fetch(request);}
   return await cache.match(request)||fetch(request);
 }));
});
