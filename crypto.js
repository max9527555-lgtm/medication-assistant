(function(root){
const bytes=s=>Uint8Array.from(atob(s),c=>c.charCodeAt(0));
const base64=buffer=>{let s='';const a=new Uint8Array(buffer);for(let i=0;i<a.length;i+=8192)s+=String.fromCharCode(...a.subarray(i,i+8192));return btoa(s);};
async function derive(password,salt,iterations=600000){const material=await crypto.subtle.importKey('raw',new TextEncoder().encode(password),'PBKDF2',false,['deriveKey']);return crypto.subtle.deriveKey({name:'PBKDF2',salt:bytes(salt),iterations,hash:'SHA-256'},material,{name:'AES-GCM',length:256},false,['encrypt','decrypt']);}
async function seal(key,data){const iv=crypto.getRandomValues(new Uint8Array(12));const cipher=await crypto.subtle.encrypt({name:'AES-GCM',iv,additionalData:new TextEncoder().encode('drug-assistant-v1')},key,new TextEncoder().encode(JSON.stringify(data)));return {iv:base64(iv),cipher:base64(cipher)};}
async function open(key,data){const text=await crypto.subtle.decrypt({name:'AES-GCM',iv:bytes(data.iv),additionalData:new TextEncoder().encode('drug-assistant-v1')},key,bytes(data.cipher));return JSON.parse(new TextDecoder().decode(text));}
root.DrugCrypto={derive,seal,open};if(typeof module!=='undefined')module.exports=root.DrugCrypto;
})(typeof window==='undefined'?globalThis:window);
