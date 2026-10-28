'use strict';
(async()=>{
 const status=document.getElementById('updateStatus');
 try{
  if(!('serviceWorker' in navigator))throw Error('当前浏览器不支持离线更新');
  const registration=await navigator.serviceWorker.register('./sw.js',{updateViaCache:'none'});
  await registration.update();
  const worker=registration.installing||registration.waiting;
  if(worker&&worker.state!=='activated')await new Promise((resolve,reject)=>{
   const timer=setTimeout(()=>{worker.removeEventListener('statechange',changed);reject(Error('更新等待超时，请联网重试'));},60000);
   function changed(){
    if(worker.state==='activated'){clearTimeout(timer);worker.removeEventListener('statechange',changed);resolve();}
    else if(worker.state==='redundant'){clearTimeout(timer);worker.removeEventListener('statechange',changed);reject(Error('下载未完成，请重试'));}
   }
   worker.addEventListener('statechange',changed);changed();
  });
  await navigator.serviceWorker.ready;
  location.replace('./');
 }catch(error){status.textContent='更新未完成：'+error.message+'。请刷新本页重试，本地数据未清除。';}
})();
