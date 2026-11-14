/* All In One 8.3.0 - script principal
   Sections repérées : modules réintégrés de la v3 | v5 : code de livraison, avis, demandes, motifs livreur, sati | v6 : catalogue, créneaux, photo de preuve, notifications, da | v7 : automatisations | v7.2 : QR code + NFC (QR hors ligne, aucune dépendance résea | v7.4 : scanner QR (caméra), tags NFC associés, diagnostic */
var CIT=200000,KEY='cod_v4',OLDKEY='cod_v1',VER='9.0.0',IT=200000;
var OM={},CXS={l:null};
var DEFTPL='Bonjour 👋 [boutique] a essayé de vous joindre pour confirmer votre commande de [produit]. Répondez OUI pour confirmer, ou dites-nous à quelle heure vous rappeler. Merci !';
var DEFSCRIPT='1) Se présenter : « Bonjour, je vous appelle de la part de [boutique]. »\n2) Confirmer le produit, la quantité, le prix et la livraison.\n3) Confirmer la ville et l’adresse exacte (quartier, repère).\n4) Proposer un produit complémentaire ou un pack.\n5) Rappeler : paiement à la livraison, merci de préparer le montant.';
var DEFSET={rc:0,db:'',tiles:'',ckey:'',net:[],deals:[],wallet:[],sim:{cpw:200,tc:70,td:80,nv:5,pa:60,pv:90,q:100},cf:5,bn:6,up:12,trial:30,dth:500,dpc:20,minc:100,phone:'',rib:'',holder:'',insta:'',pt:'',pco:'',pe:'',pc:'',pphoto:'',tpl:DEFTPL,script:DEFSCRIPT,lang:'fr',lastBackup:0};
var DB=null,K=null,SALT=null,ST=null,seq=0,hiddenAt=0;
var S={tab:'home',sub:'list',msg:'',err:false,del:'',locked:false,vendor:'',sf:'',q:'',cx:'',edit:'',vsel:'',vform:false,inv:'',csvx:'',lk:null};
var Q=new URLSearchParams(location.search);
var AR={'Accueil':'الرئيسية','Appels':'المكالمات','Commandes':'الطلبات','Livraison':'التوصيل','Vendeurs':'البائعون','Finances':'المالية','Réglages':'الإعدادات','Confirmer':'تأكيد','Compte':'الحساب','Confirmé':'مؤكد','Annulé':'ملغى','Pas de réponse':'لا يجيب','Appeler':'اتصال','Relance':'تذكير','Ajouter':'إضافة','Enregistrer':'حفظ','Supprimer':'حذف','Livré':'تم التسليم','Refusé':'مرفوض','Modifier':'تعديل','Liste':'القائمة','Aucune commande à appeler.':'لا توجد طلبات للاتصال.','Rechercher…':'بحث…','Tous les vendeurs':'كل البائعين','Remis au livreur':'سُلّم للموزع'};
function T(k){return DB&&DB.set.lang==='ar'&&AR[k]?AR[k]:k}
var e=function(s){return String(s==null?'':s).replace(/[&<>"']/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]})};
var $=function(i){return document.getElementById(i)};
var uid=function(){return Date.now().toString(36)+Math.random().toString(36).slice(2,6)};
var today=function(){var d=new Date();return d.getFullYear()+'-'+('0'+(d.getMonth()+1)).slice(-2)+'-'+('0'+d.getDate()).slice(-2)};
var fm=function(x){return Math.round((+x||0)*10)/10===Math.round(x)?Math.round(x).toLocaleString('fr-FR'):(Math.round((+x||0)*10)/10).toLocaleString('fr-FR')};
var pct=function(a,b){return b?Math.round(100*a/b)+' %':'—'};
var r1=function(x){return Math.round(x*10)/10};
/* ---------- icônes ---------- */
var ICO={home:'<path d="M4 11l8-7 8 7v9a1 1 0 0 1-1 1h-4v-6h-6v6H5a1 1 0 0 1-1-1z"/>',phone:'<path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2z"/>',box:'<path d="M12 3l8 4.5v9L12 21l-8-4.5v-9L12 3z"/><path d="M4 7.5l8 4.5 8-4.5M12 12v9"/>',truck:'<path d="M3 6h11v10H3zM14 9h4l3 3v4h-7"/><circle cx="7" cy="17.5" r="1.8"/><circle cx="17" cy="17.5" r="1.8"/>',store:'<path d="M3.5 9.5L5 4h14l1.5 5.5"/><path d="M3.5 9.5a2.8 2.8 0 0 0 5.5 0 2.8 2.8 0 0 0 6 0 2.8 2.8 0 0 0 5.5 0"/><path d="M5 12.5V20h14v-7.5"/>',chart:'<path d="M5 20v-8M12 20V4M19 20v-5"/>',gear:'<circle cx="12" cy="12" r="3"/><path d="M12 3v3M12 18v3M3 12h3M18 12h3M5.6 5.6l2.1 2.1M16.3 16.3l2.1 2.1M18.4 5.6l-2.1 2.1M7.7 16.3l-2.1 2.1"/>',chat:'<path d="M21 12a8 8 0 0 1-11.6 7.1L4 20l1-4.5A8 8 0 1 1 21 12z"/>',link:'<path d="M10 14a4 4 0 0 0 5.7 0l3-3a4 4 0 0 0-5.7-5.7l-1 1"/><path d="M14 10a4 4 0 0 0-5.7 0l-3 3a4 4 0 0 0 5.7 5.7l1-1"/>',dl:'<path d="M12 4v11M7.5 10.5L12 15l4.5-4.5M5 19h14"/>'};
ICO.user='<circle cx="12" cy="8" r="3.6"/><path d="M4.5 20a7.5 7.5 0 0 1 15 0"/>';ICO.mail='<rect x="3.5" y="5.5" width="17" height="13" rx="2"/><path d="M4 7l8 6 8-6"/>';ICO.pin='<path d="M12 21s-6.5-5.6-6.5-11a6.5 6.5 0 0 1 13 0c0 5.4-6.5 11-6.5 11z"/><circle cx="12" cy="10" r="2.3"/>';ICO.cam='<path d="M4 8h3l1.5-2h7L17 8h3v11H4z"/><circle cx="12" cy="13.5" r="3.5"/>';ICO.share='<circle cx="6" cy="12" r="2.3"/><circle cx="18" cy="6" r="2.3"/><circle cx="18" cy="18" r="2.3"/><path d="M8 11l8-4M8 13l8 4"/>';
function ico(n,c){return '<svg class="i'+(c?' '+c:'')+'" viewBox="0 0 24 24" aria-hidden="true">'+(ICO[n]||'')+'</svg>'}
/* ---------- téléphone ---------- */
function mph(p){var d=String(p||'').replace(/[^\d+]/g,'');if(d[0]==='+')d=d.slice(1);else if(d.indexOf('00')===0)d=d.slice(2);if(d.indexOf('212')===0)d=d.slice(3);else if(d[0]==='0')d=d.slice(1);return /^[5-7]\d{8}$/.test(d)?'0'+d:null}
function waNum(p){var m=mph(p);return m?'212'+m.slice(1):String(p||'').replace(/\D/g,'')}
var wa=function(p,t){return 'https://wa.me/'+(p?waNum(p):'')+'?text='+encodeURIComponent(t)};
var telh=function(p){var m=mph(p);return 'tel:'+(m?'+212'+m.slice(1):e(p))};
/* ---------- stockage chiffré ---------- */
var enc=new TextEncoder(),dec=new TextDecoder();
function b64(u){var s='';for(var i=0;i<u.length;i++)s+=String.fromCharCode(u[i]);return btoa(s)}
function ub64(s){var a=atob(s),u=new Uint8Array(a.length);for(var i=0;i<a.length;i++)u[i]=a.charCodeAt(i);return u}
var CRY=!!(window.crypto&&crypto.subtle);
function dkey(pin,salt,it){return crypto.subtle.importKey('raw',enc.encode(pin),'PBKDF2',false,['deriveKey']).then(function(m){return crypto.subtle.deriveKey({name:'PBKDF2',salt:salt,iterations:it,hash:'SHA-256'},m,{name:'AES-GCM',length:256},false,['encrypt','decrypt'])})}
var IDB=null;
function idbOpen(){return new Promise(function(res){try{var r=indexedDB.open('cod4',1);r.onupgradeneeded=function(){r.result.createObjectStore('kv')};r.onsuccess=function(){res(r.result)};r.onerror=function(){res(null)}}catch(x){res(null)}})}
function storeGet(){return idbOpen().then(function(d){IDB=d;if(!d)return lsGet();return new Promise(function(res){try{var q=d.transaction('kv').objectStore('kv').get('main');q.onsuccess=function(){res(q.result?safeJ(q.result):lsGet())};q.onerror=function(){res(lsGet())}}catch(x){res(lsGet())}})})}
function lsGet(){try{return safeJ(localStorage.getItem(KEY))}catch(x){return null}}
function safeJ(s){try{return s?JSON.parse(s):null}catch(x){return null}}
function storePut(str){
  if(IDB){try{var tx=IDB.transaction('kv','readwrite');tx.objectStore('kv').put(str,'main');tx.onerror=function(){lsPut(str)};return}catch(x){}}
  lsPut(str)}
function lsPut(str){try{localStorage.setItem(KEY,str)}catch(x){S.msg='Mémoire pleine : télécharge une sauvegarde puis supprime d’anciennes données.';S.err=true}}
function save(){
  if(!DB)return;
  if(!K){storePut(JSON.stringify({enc:0,d:DB}));return}
  var iv=crypto.getRandomValues(new Uint8Array(12)),my=++seq,snap=enc.encode(JSON.stringify(DB));
  crypto.subtle.encrypt({name:'AES-GCM',iv:iv},K,snap).then(function(ct){if(my!==seq)return;storePut(JSON.stringify({enc:1,it:CIT,salt:b64(SALT),iv:b64(iv),ct:b64(new Uint8Array(ct))}))});
}
function fails(){try{return JSON.parse(localStorage.getItem('cod_f')||'{"n":0,"u":0}')}catch(x){return{n:0,u:0}}}
function lockNow(){if(!K)return;DB=null;K=null;S.locked=true;S.msg='';render()}
document.addEventListener('visibilitychange',function(){if(document.hidden)hiddenAt=Date.now();else if(K&&hiddenAt&&Date.now()-hiddenAt>300000)lockNow()});
/* ---------- données ---------- */
var okImg=function(u){return typeof u==='string'&&(u===''||/^data:image\/(jpeg|png|webp);base64,[A-Za-z0-9+\/=]+$/.test(u))};
function fix(d){d.set=Object.assign({},DEFSET,d.set||{});d.set.sim=Object.assign({},DEFSET.sim,d.set.sim||{});['orders','vend','pay','cour','bl'].forEach(function(k){d[k]=d[k]||[]});['net','deals','wallet'].forEach(function(k){d.set[k]=d.set[k]||[]});
  if(!okImg(d.set.pphoto))d.set.pphoto='';d.vend.forEach(function(v){if(!okImg(v.photo))v.photo='';v.arts=(v.arts||[]).filter(function(a){return a&&typeof a==='object'});v.arts.forEach(function(a){a.price=+a.price||0;a.old=+a.old||0;if(!okImg(a.img))a.img='';a.imgs=(a.imgs||[]).filter(function(u){return okImg(u)&&u})})});return d}
function migrate(){
  var d=fix({v:4,orders:[],vend:[],pay:[],cour:[],bl:[],set:{}});
  var raw=null;try{raw=JSON.parse(localStorage.getItem(OLDKEY)||'null')}catch(x){raw=null}
  if(!raw)return d;
  var os=raw.set||{},price=+os.price||12,basis=os.basis==='Confirmé'?'Confirmé':'Livré',fee=+os.fee||0;
  ['phone','rib','holder','insta','tpl','db','tiles','ckey'].forEach(function(k){if(os[k])d.set[k]=os[k]});
  d.set.deals=os.deals||[];d.set.wallet=os.wallet||[];d.set.sim=Object.assign({},DEFSET.sim,os.sim||{});
  d.set.net=(os.net||[]).filter(function(x){return x.type!=='Livreur'});
  (os.net||[]).filter(function(x){return x.type==='Livreur'}).forEach(function(x){d.cour.push({id:x.id||uid(),name:x.name,phone:x.phone||'',city:x.city||'',price:x.price||0,prod:x.prod||''})});
  var vm={};
  (os.vend||[]).forEach(function(v){var n=Object.assign({},v);n.fees=null;n.reg=fee;n.notes=n.notes||'';vm[v.name]=n;
    if(v.cpaid>0)d.pay.push({id:uid(),vid:n.id,amount:v.cpaid,date:today(),note:'Repris de la v3'});
    if(v.paid&&fee>0)d.pay.push({id:uid(),vid:n.id,amount:fee,date:v.date||today(),note:'Inscription payée (v3)'});
    delete n.cpaid;delete n.paid});
  (raw.orders||[]).forEach(function(o){
    var vn=o.vendor||'Boutique';
    if(!vm[vn])vm[vn]={id:uid(),name:vn,phone:'',city:'',insta:'',tiktok:'',fb:'',cat:'',notes:'',ver:false,fees:null,reg:fee,arts:[]};
    var n=Object.assign({},o,{id:o.id||uid(),date:o.date||today(),ts:Date.now(),vendor:vn,name:o.name||'',phone:mph(o.phone)||o.phone||'',product:o.product||'',address:o.address||'',city:o.city||'',channel:o.channel||'',amount:+o.amount||0,upsell:0,status:o.status||'En attente',attempts:o.attempts||0,delivery:o.delivery||'',courier:o.courier||'',note:'',reason:'',cb:0});
    if(n.status==='Confirmé'){n.cdate=n.date;n.legacy=1;n.fu=0;n.bd=0;n.fc=basis==='Confirmé'?price:0;n.fd=(basis==='Livré'&&n.delivery==='Livré')?price:0}
    d.orders.push(n);
  });
  Object.keys(vm).forEach(function(k){d.vend.push(vm[k])});
  d.migrated=true;
  return d;
}
/* ---------- métier ---------- *//* ---------- métier ---------- */
var vget=function(n){return DB.vend.filter(function(v){return v.name===n})[0]};
var vid=function(i){return DB.vend.filter(function(v){return v.id===i})[0]};
function ensureV(n){var v=vget(n);if(!v){v={id:uid(),name:n,phone:'',city:'',insta:'',tiktok:'',fb:'',cat:'',notes:'',ver:false,fees:null,reg:0,arts:[]};DB.vend.push(v)}return v}
var byId=function(i){return DB.orders.filter(function(o){return o.id===i})[0]};
var open_=function(o){return o.status==='En attente'||(o.status==='Confirmé'&&!o.delivery||o.status==='Confirmé'&&o.delivery==='En cours')};
function stage(o){return o.status!=='Confirmé'?0:o.delivery==='Livré'?3:o.delivery==='En cours'?2:1}
function bad(o){return o.status==='Annulé'||o.status==='Injoignable'||o.delivery==='Refusé'||o.delivery==='Annulé'}
function stats(l){var c=function(s){return l.filter(function(o){return o.status===s}).length};return{n:l.length,ok:c('Confirmé'),ko:c('Annulé'),un:c('Injoignable'),pe:c('En attente'),liv:l.filter(function(o){return o.status==='Confirmé'&&o.delivery==='Livré'}).length,ref:l.filter(function(o){return o.delivery==='Refusé'}).length}}
var earned=function(o){return (o.fc||0)+(o.fd||0)+(o.fu||0)};
function rateOf(v){var x=(v&&v.fees)||{},s=DB.set;return{cf:(x.cf!==''&&x.cf!=null)?+x.cf:s.cf,db:(x.db!==''&&x.db!=null)?+x.db:s.bn}}
function freeze(o){
  if(o.fc!==undefined)return;
  var v=ensureV(o.vendor),r=rateOf(v),s=DB.set,mo=today().slice(0,7);
  var prev=DB.orders.filter(function(x){return x.vendor===o.vendor&&x.fc!==undefined});
  var mc=prev.filter(function(x){return (x.cdate||'').slice(0,7)===mo}).length;
  o.cdate=today();
  if(prev.length<s.trial){o.tr=1;o.fc=0;o.bd=0}
  else{var k=mc>=s.dth?1-s.dpc/100:1;o.fc=r1(r.cf*k);o.bd=r1(r.db*k)}
  o.fu=Math.round((o.upsell||0)*s.up/100);o.fd=0;
}
function setStatus(o,s){
  o.status=s;
  if(s==='Confirmé'){freeze(o);o.cb=0}
  else if(s==='En attente'){['fc','bd','fd','fu','tr','cdate'].forEach(function(k){delete o[k]});o.delivery=''}
  else{if(o.delivery==='Livré'||o.delivery==='En cours')o.delivery='';o.fd=0}
}
function setDel(o,d){if(o.status!=='Confirmé')return;o.delivery=d;o.fd=d==='Livré'?(o.bd||0):0}
function vbal(v){var got=DB.pay.filter(function(p){return p.vid===v.id}).reduce(function(a,p){return a+p.amount},0),ea=DB.orders.filter(function(o){return o.vendor===v.name}).reduce(function(a,o){return a+earned(o)},0)  ;return{got:got,ea:ea,bal:r1(got-ea)}}
function hist(ph,id){return DB.orders.filter(function(o){return o.phone===ph&&o.id!==id})}
function risk(o){
  var h=hist(o.phone,o.id),rf=h.filter(function(x){return x.delivery==='Refusé'}).length,cx=h.filter(function(x){return x.status==='Annulé'&&x.reason==='Fausse commande'}).length,t=[];
  var bl=DB.bl.indexOf(o.phone)>=0;
  if(bl)t.push('liste noire');
  if(rf)t.push(rf+' refus à la livraison');
  if(cx)t.push(cx+' fausse(s) commande(s)');
  if(!o.address&&!o.city)t.push('adresse manquante');
  return{l:(bl||rf>=2||cx>=1)?'high':(rf||!o.address&&!o.city)?'mid':'',t:t};
}
function dup(vn,ph,pr){var lim=Date.now()-7*864e5;return DB.orders.some(function(x){return x.phone===ph&&x.vendor===vn&&(open_(x)||(pr&&x.product===pr&&(x.ts||0)>lim))})}
function addOrder(v,n,p,pr,a,x,force){
  if(!n)return'noname';
  var ph=mph(p);if(!ph)return'ph';
  v=v||'Boutique';
  if(!force&&dup(v,ph,pr))return'dup';
  ensureV(v);
  DB.orders.push(Object.assign({id:uid(),date:today(),ts:Date.now(),vendor:v,name:n,phone:ph,product:pr,address:a,city:'',channel:'',amount:0,upsell:0,status:'En attente',attempts:0,delivery:'',courier:'',note:'',reason:'',cb:0},x||{}));
  return'ok';
}
function report(res){var c={ok:0,ph:0,dup:0,noname:0};res.forEach(function(r){c[r]++});return c.ok+' ajoutée(s)'+(c.ph?', '+c.ph+' numéro(s) invalide(s)':'')+(c.dup?', '+c.dup+' doublon(s) ignoré(s)':'')+(c.noname?', '+c.noname+' sans nom':'')+'.'}
function tpl(o){return DB.set.tpl.replace(/\[boutique\]/g,o.vendor).replace(/\[produit\]/g,o.product)}
function callDue(o){return !o.cb||o.cb<=Date.now()}
function mk(m,t){S.msg=m;S.err=!!t}
var mb=function(){var h=S.msg?'<div class="msg'+(S.err?' err':'')+'">'+e(S.msg)+'</div>':'';return h};
/* ---------- vues ---------- */
function vsel(){return '<select id="vf"><option value="">'+T('Tous les vendeurs')+'</option>'+DB.vend.map(function(v){return '<option'+(v.name===S.vendor?' selected':'')+' value="'+e(v.name)+'">'+e(v.name)+'</option>'}).join('')+'</select>'}
var vis=function(){return DB.orders.filter(function(o){return !S.vendor||o.vendor===S.vendor})};
var kp=function(l,v,c){return '<div class="kpi '+(c||'')+'"><span class="mut">'+l+'</span><b>'+v+'</b></div>'};
function home(){
  var o=DB.orders,pe=o.filter(function(x){return x.status==='En attente'}),due=pe.filter(callDue),mo=today().slice(0,7);
  var om=o.filter(function(x){return (x.date||'').slice(0,7)===mo}),s=stats(om),tr=s.n-s.pe;
  var gm=o.filter(function(x){return (x.cdate||'').slice(0,7)===mo}).reduce(function(a,x){return a+earned(x)},0);
  var toCollect=0,low=[];DB.vend.forEach(function(v){var b=vbal(v).bal;if(b<0)toCollect-=b;else if(b<DB.set.minc*0.2&&DB.orders.some(function(x){return x.vendor===v.name&&x.status==='Confirmé'}))low.push(v.name)});
  var al='';
  if(S.migrated)al+='<div class="alert">Données de la v3 reprises : commandes, vendeurs, livreurs et paiements. Les commissions passées sont figées au tarif d’alors.</div>';
  if(due.length)al+='<div class="alert">'+due.length+' commande(s) à appeler maintenant.</div>';
  if(toCollect>0)al+='<div class="alert">'+fm(toCollect)+' dh à encaisser auprès des vendeurs (voir Finances).</div>';
  if(low.length)al+='<div class="alert">Crédit faible : '+e(low.join(', '))+'.</div>';
  if(o.length&&Date.now()-(DB.set.lastBackup||0)>7*864e5)al+='<div class="alert">Pas de sauvegarde depuis plus de 7 jours. Compte → Paramètres → Sécurité & données.</div>';
  if(!K&&CRY&&o.length>5)al+='<div class="alert">Tes données ne sont pas chiffrées. Active un code dans Compte → Paramètres → Sécurité & données.</div>';
  return mb()+cbar()+al+'<div class="grid">'+kp('À appeler maintenant',due.length)+kp('Programmés',pe.length-due.length)+kp('Confirmation (mois)',pct(s.ok,tr))+kp('Livraison (mois)',pct(s.liv,s.liv+s.ref),'g')+kp('Gagné ce mois',fm(gm)+' dh','g')+kp('À encaisser',fm(toCollect)+' dh',toCollect>0?'r':'')+'</div>'
   +'<div class="btns"><button class="b pri" data-act="goto" data-v="calls">'+ico('phone','s')+' Appeler</button><button class="b" data-act="goto" data-v="ord" data-s="add">'+ico('box','s')+' Ajouter</button></div>'
   +(DB.orders.length?'':'<div class="card" style="margin-top:12px"><h2>Pour commencer</h2><p class="mut">1) Crée un vendeur dans Vendeurs. 2) Ajoute ses commandes dans Commandes → Ajouter (une, collées de WhatsApp ou par liste). 3) Appelle dans l’onglet Appels. Chaque vendeur a 30 commandes d’essai gratuites.</p></div>');
}
function ordHead(o,extra){var r=risk(o);return '<div class="row"><b>'+e(o.name)+'</b>'+(extra||'')+'</div>'+(r.l?'<div class="tag '+(r.l==='high'?'ko':'')+'" style="display:inline-block;margin:4px 0">⚠ '+(r.l==='high'?'Risque élevé':'Risque moyen')+' : '+e(r.t.join(', '))+'</div>':'')}
function calls(){
  var l=vis().filter(function(o){return o.status==='En attente'}),now=l.filter(callDue),later=l.filter(function(o){return !callDue(o)});
  now.sort(function(a,b){return (a.cb||a.ts||0)-(b.cb||b.ts||0)});later.sort(function(a,b){return a.cb-b.cb});
  var h=mb()+vsel();
  var card=function(o){
    var ed=S.edit===o.id,cx=S.cx===o.id,v=vget(o.vendor),sc=(DB.set.script||'').replace(/\[boutique\]/g,o.vendor);
    return '<div class="card">'+ordHead(o,'<span class="tag">Tentative '+Math.min(3,o.attempts+1)+'/3</span>')
     +'<div class="mut">'+e(o.product)+(o.amount?' · <b>'+fm(o.amount)+' dh</b>':'')+'</div><div class="mut">'+e([o.address,o.city].filter(Boolean).join(', ')||'Adresse non renseignée')+'</div><div class="mut">'+e(o.vendor)+' · '+e(o.phone)+(o.note?' · 📝 '+e(o.note):'')+'</div>'
     +'<div class="btns"><a class="b pri" href="'+telh(o.phone)+'">'+ico('phone','s')+' '+T('Appeler')+'</a><a class="b" target="_blank" rel="noopener" href="'+wa(o.phone,tpl(o))+'">'+ico('chat','s')+' '+T('Relance')+'</a><button class="b" data-act="edit" data-id="'+o.id+'">'+T('Modifier')+'</button></div>'
     +(ed?'<div style="margin-top:8px"><label>Adresse</label><input id="e-a" value="'+e(o.address)+'"><label>Ville</label><input id="e-c" list="mc" value="'+e(o.city)+'"><label>Montant à encaisser (dh)</label><input id="e-m" type="number" min="0" inputmode="decimal" value="'+(o.amount||'')+'"><label>Vente additionnelle (dh)</label><input id="e-u" type="number" min="0" inputmode="decimal" value="'+(o.upsell||'')+'"><label>E-mail</label><input id="e-e" type="email" value="'+e(o.email||'')+'"><label>Note</label><input id="e-n" value="'+e(o.note)+'"><div class="btns"><button class="b pri" data-act="esave" data-id="'+o.id+'">'+T('Enregistrer')+'</button><button class="b" data-act="blk" data-id="'+o.id+'">'+(DB.bl.indexOf(o.phone)>=0?'Retirer de la liste noire':'Liste noire')+'</button></div></div>':'')
     +(cx?'<div style="margin-top:8px"><div class="mut">Motif d’annulation :</div><div class="btns">'+['Trop cher','A changé d’avis','Fausse commande','Déjà reçu / doublon','Adresse hors zone','Autre'].map(function(r){return '<button class="b ko sm" data-act="cxdo" data-id="'+o.id+'" data-v="'+e(r)+'">'+e(r)+'</button>'}).join('')+'</div></div>':'')
     +'<div class="btns"><button class="b ok" data-act="conf" data-id="'+o.id+'">'+T('Confirmé')+'</button><button class="b ko" data-act="cxopen" data-id="'+o.id+'">'+T('Annulé')+'</button></div>'
     +'<div class="mut" style="margin-top:8px">'+T('Pas de réponse')+' → rappeler dans :</div><div class="btns"><button class="b wa sm" data-act="try" data-id="'+o.id+'" data-h="1">1 h</button><button class="b wa sm" data-act="try" data-id="'+o.id+'" data-h="3">3 h</button><button class="b wa sm" data-act="try" data-id="'+o.id+'" data-h="24">Demain</button></div>'
     +'<details style="margin-top:8px"><summary class="mut">Script d’appel</summary><div class="mut" style="white-space:pre-wrap;margin-top:6px">'+e(sc)+'</div></details></div>'};
  if(!now.length&&!later.length)return h+'<p class="mut">'+T('Aucune commande à appeler.')+'</p>';
  h+=now.map(card).join('');
  if(later.length)h+='<h2>Programmés ('+later.length+')</h2>'+later.map(function(o){var d=new Date(o.cb);return '<div class="card"><div class="row"><b>'+e(o.name)+'</b><span class="tag">rappel '+('0'+d.getHours()).slice(-2)+':'+('0'+d.getMinutes()).slice(-2)+(d.toDateString()!==new Date().toDateString()?' demain':'')+'</span></div><div class="mut">'+e(o.product)+' · '+e(o.vendor)+'</div><div class="btns"><button class="b sm" data-act="now" data-id="'+o.id+'">Appeler maintenant</button></div></div>'}).join('');
  return h;
}
function datalist(){return '<datalist id="mc">'+['Casablanca','Rabat','Salé','Fès','Meknès','Marrakech','Tanger','Tétouan','Agadir','Oujda','Kénitra','Mohammedia','El Jadida','Safi','Nador','Béni Mellal','Settat','Khouribga','Taza','Larache','Essaouira','Errachidia','Ouarzazate','Laâyoune','Dakhla','Guelmim','Tiznit','Al Hoceïma'].map(function(c){return '<option value="'+c+'">'}).join('')+'</datalist>'}
function ordv(){
  var tabs='<div class="chips"><button class="chip'+(S.sub==='list'?' on':'')+'" data-act="sub" data-v="list">'+T('Liste')+'</button><button class="chip'+(S.sub==='add'?' on':'')+'" data-act="sub" data-v="add">'+T('Ajouter')+'</button></div>';
  return mb()+tabs+(S.sub==='add'?addv():listv());
}
function addv(){
  return '<div class="card"><h2>Une commande</h2><label>Vendeur</label><input id="f-v" list="vl" value="'+e(S.lastV||S.vendor)+'" placeholder="Nom de la boutique"><datalist id="vl">'+DB.vend.map(function(v){return '<option value="'+e(v.name)+'">'}).join('')+'</datalist>'
   +'<label>Nom du client</label><input id="f-n" autocomplete="off"><label>Téléphone (06… ou 07…)</label><input id="f-p" inputmode="tel" placeholder="0612345678"><label>Produit</label><input id="f-pr"><label>Adresse</label><input id="f-a"><label>Ville</label><input id="f-c" list="mc"><label>E-mail du client (facultatif, pour les notifications)</label><input id="f-e" type="email" inputmode="email"><label>Montant à encaisser (dh)</label><input id="f-m" type="number" min="0" inputmode="decimal"><label>Canal de vente</label><select id="f-ch"><option value="">—</option><option>Instagram</option><option>TikTok</option><option>Facebook</option><option>WhatsApp</option><option>Autre</option></select>'
   +'<label><input id="f-force" type="checkbox" style="width:auto;min-height:0;margin-right:6px">Ajouter même si le numéro existe déjà</label><button class="b pri full" data-act="add">'+T('Ajouter')+'</button></div>'
   +'<div class="card"><h2>Coller des commandes WhatsApp</h2><p class="mut">Colle le message du client (« NOUVELLE COMMANDE… »). Plusieurs messages d’un coup sont acceptés.</p><textarea id="f-paste"></textarea><button class="b pri full" data-act="paste">Ajouter depuis le message</button></div>'
   +'<div class="card"><h2>Liste ou fichier</h2><p class="mut">Une commande par ligne : nom, téléphone, produit, adresse, ville, montant. Tu peux coller depuis Excel ou Google Sheets, ou choisir un fichier CSV. Le vendeur est celui du champ ci-dessus.</p><textarea id="f-bulk" placeholder="Karim B., 0612345678, T-shirt noir M, Maarif, Casablanca, 199"></textarea><button class="b pri full" data-act="bulk">Ajouter la liste</button><label style="display:block;margin-top:8px">Ou un fichier CSV</label><input type="file" id="f-file" accept=".csv,.txt,text/csv"></div>';
}
function parseBulk(txt,v){
  var res=[],lines=txt.split(/\r?\n/).filter(function(x){return x.trim()});
  lines.forEach(function(ln,i){var q=ln.split(/[,;\t]/).map(function(x){return x.trim().replace(/^"|"$/g,'')});if(i===0&&q.length>1&&!mph(q[1])&&/nom|name/i.test(q[0]))return;res.push(addOrder(v,q[0],q[1],q[2]||'',q[3]||'',{city:q[4]||'',amount:parseFloat(q[5])||0}))});
  return res;
}
function parseOrders(txt){
  var res=[];
  txt.split(/NOUVELLE COMMANDE/i).forEach(function(p,i){
    if(i===0&&!/nom\s*[:：]/i.test(p))return;
    var f=function(re){var m=p.match(new RegExp('^\\s*(?:'+re+')\\s*[:：]\\s*(.+)$','im'));return m?m[1].trim():''};
    var n=f('nom'),ph=f('t\\S*l\\S*phone|tel'),pr=f('produit'),q=parseInt(f('quantit\\S*'))||1;
    if(n||ph)res.push(addOrder(f('vendeur'),n,ph,pr+(q>1?' ×'+q:''),f('adresse'),{city:f('ville')}))
  });
  return res;
}
function listv(){
  var l=vis().slice().reverse(),q=(S.q||'').toLowerCase();
  if(S.sf)l=l.filter(function(o){return o.status===S.sf});
  if(q)l=l.filter(function(o){return (o.name+' '+o.phone+' '+o.product+' '+o.city+' '+o.vendor).toLowerCase().indexOf(q)>=0});
  var h=vsel()+'<select id="sf"><option value="">Tous les statuts</option>'+['En attente','Confirmé','Annulé','Injoignable'].map(function(x){return '<option'+(S.sf===x?' selected':'')+'>'+x+'</option>'}).join('')+'</select><input id="q" placeholder="'+T('Rechercher…')+'" value="'+e(S.q)+'">';
  if(!l.length)return h+'<p class="mut">Aucune commande.</p>';
  return h+'<p class="mut">'+l.length+' commande(s)'+(l.length>60?' · 60 dernières affichées':'')+'</p>'+l.slice(0,60).map(function(o){
    var sel=function(k,opts,lab){return '<select data-'+k+'="1" data-id="'+o.id+'">'+opts.map(function(x){return '<option'+(o[k==='st'?'status':'delivery']===x?' selected':'')+' value="'+x+'">'+(lab&&x===''?lab:x)+'</option>'}).join('')+'</select>'};
    return '<div class="card">'+ordHead(o,'<span class="s-'+o.status+'">'+e(o.status)+'</span>')+'<div class="mut">'+e(o.vendor)+' · '+e(o.product)+(o.amount?' · '+fm(o.amount)+' dh':'')+(o.city?' · '+e(o.city):'')+(o.channel?' · '+e(o.channel):'')+' · '+e(o.date)+'</div><div class="mut">'+e(o.name)+' · '+e(o.phone)+(o.reason?' · motif : '+e(o.reason):'')+'</div>'
     +sel('st',['En attente','Confirmé','Annulé','Injoignable'])+(o.status==='Confirmé'?sel('dl',['','En cours','Livré','Refusé'],'Livraison : —'):'')
     +(earned(o)?'<div class="mut">Commission : '+fm(earned(o))+' dh'+(o.tr?' (essai gratuit)':'')+(o.legacy?' (ancien tarif)':'')+'</div>':'')
     +'<div class="btns">'+(o.status==='Confirmé'?'<button class="b sm" data-act="qrs" data-k="l" data-id="'+o.id+'">QR colis</button><button class="b sm" data-act="tagp" data-t="or" data-id="'+o.id+'">Tag NFC</button>':'')+'<button class="b sm" data-act="del" data-id="'+o.id+'">'+(S.del===o.id?'Confirmer la suppression ?':T('Supprimer'))+'</button></div></div>'}).join('');
}
var STL=['À valider','Confirmée','En cours de livraison','Livrée'];
function stepper(n){return '<div class="stp">'+STV.map(function(t,i){return '<div class="st'+(i<=n?' on':'')+'"><i>'+(i<n?'✓':i+1)+'</i>'+t+'</div>'}).join('')+'</div>'}
function nmsg0(o){return ''}
function ratesTxt(v){var r=rateOf(v);return r.cf+' dh à la confirmation + '+r.db+' dh si livrée'}
function vendv(){
  if(S.inv){var iv=vid(S.inv);if(iv)return invoice(iv);S.inv=''}
  if(S.vsel){var x=vid(S.vsel);if(x)return fiche(x);S.vsel=''}
  var h=mb()+'<button class="b pri full" data-act="vnew">'+(S.vform?'Fermer':'+ Ajouter un vendeur')+'</button>';
  if(S.vform)h+='<div class="card" style="margin-top:10px"><h2>Nouveau vendeur</h2><label>Boutique</label><input id="v-n"><label>Téléphone / WhatsApp</label><input id="v-p" inputmode="tel"><label>Ville</label><input id="v-c" list="mc"><label>Instagram (pseudo)</label><input id="v-i"><button class="b pri full" data-act="vadd">Créer la fiche</button></div>';
  if(!DB.vend.length)return h+'<p class="mut">Aucun vendeur. Crée une fiche pour commencer.</p>';
  return h+DB.vend.map(function(v){var b=vbal(v),n=DB.orders.filter(function(o){return o.vendor===v.name}).length;
    return '<div class="card vc" data-act="vopen" data-id="'+v.id+'">'+avatar(v,52)+'<div class="vi"><div class="row"><b>'+e(v.name)+(v.ver?' ✔':'')+'</b><span class="tag '+(b.bal<0?'ko':'ok')+'">'+(b.bal<0?'dû '+fm(-b.bal):'crédit '+fm(b.bal))+' dh</span></div><div class="mut">'+e([v.cat,v.city].filter(Boolean).join(' · ')||v.phone||'')+'</div><div class="mut">'+n+' commande(s) · '+(v.arts||[]).length+' article(s) · '+e(ratesTxt(v))+'</div></div></div>'}).join('');
}
var VF=[['name','Boutique'],['resp','Responsable (prénom et nom)'],['phone','Téléphone / WhatsApp'],['email','E-mail'],['city','Ville'],['addr','Adresse'],['cat','Catégorie (mode, beauté, high-tech…)'],['insta','Instagram (pseudo)'],['tiktok','TikTok (pseudo)'],['fb','Page Facebook ou Marketplace (lien)'],['site','Autre lien (Jumia, site…)'],['zones','Villes desservies'],['ice','ICE / RC (société)'],['rib','RIB (reversement)']];
function fiche(v){
  v.arts=v.arts||[];
  var b=vbal(v),os=DB.orders.filter(function(o){return o.vendor===v.name}),s=stats(os),ps=DB.pay.filter(function(p){return p.vid===v.id}).slice().reverse(),tn=DB.orders.filter(function(o){return o.vendor===v.name&&o.fc!==undefined}).length;
  var lk=S.lk&&S.lk.id===v.id?'<div class="card"><h2>Lien de commande</h2><p class="mut">À mettre dans la bio Instagram, TikTok ou Facebook. Le client t’envoie sa commande sur WhatsApp.</p><textarea id="lk" readonly>'+e(S.lk.url)+'</textarea><div class="btns"><button class="b pri" data-act="lcopy">Copier</button><button class="b" data-act="qrs" data-k="lk">QR code</button><a class="b" target="_blank" rel="noopener" href="'+wa(v.phone,'Voici ton lien de commande à mettre dans ta bio Instagram, TikTok ou Facebook : '+S.lk.url)+'">'+ico('chat','s')+' Envoyer au vendeur</a></div></div>':'';
  var h=mb()+'<button class="b full" data-act="vback" style="margin-bottom:10px">← Tous les vendeurs</button><div class="cover"></div><div class="vhead">'+avatar(v,88)+'<div><h2 style="margin:0">'+e(v.name)+'</h2><div class="mut">'+e([v.resp,v.city,v.cat].filter(Boolean).join(' · '))+'</div>'+(v.ver?'<span class="tag ok">✔ Vérifié</span>':'')+'</div></div>';
  h+=vlinks(v)+'<div class="btns"><button class="b pri" data-act="pnew" data-id="'+v.id+'">'+ico('camera')+' Ajouter un produit avec photo</button><button class="b pri" data-act="vlink" data-id="'+v.id+'">'+ico('link','s')+' Lien de commande</button></div>'+lk;
  h+='<div class="grid" style="margin-top:10px">'+kp('Commandes',s.n)+kp('Confirmées',pct(s.ok,s.n-s.pe))+kp('Livrées',pct(s.liv,s.liv+s.ref))+kp(b.bal<0?'Dû par le vendeur':'Crédit restant',fm(Math.abs(b.bal))+' dh',b.bal<0?'r':'g')+'</div>'
   +'<div class="mut">Essai gratuit : '+Math.max(0,DB.set.trial-tn)+' commande(s) restante(s) · Tarif : '+e(ratesTxt(v))+(DB.set.rc&&os.some(function(o){return o.delivery==='Refusé'})?' · '+os.filter(function(o){return o.delivery==='Refusé'}).length+' colis refusé(s) = '+fm(os.filter(function(o){return o.delivery==='Refusé'}).length*DB.set.rc)+' dh perdus':'')+'</div>';
  h+='<div class="card" style="margin-top:10px"><h2>Paiements reçus</h2><p class="mut">Le vendeur paie à l’avance (crédit) ou après relevé. Chaque commande consomme son crédit automatiquement.</p><label>Montant reçu (dh)</label><input id="p-a" type="number" min="0" inputmode="decimal" placeholder="'+(b.bal<0?Math.ceil(-b.bal):DB.set.minc)+'"><label>Note (virement, espèces…)</label><input id="p-n"><button class="b pri full" data-act="padd" data-id="'+v.id+'">Enregistrer le paiement</button>'
   +(ps.length?'<div class="wrap"><table><tr><th>Date</th><th class="n">Montant</th><th>Note</th><th></th></tr>'+ps.map(function(p){return '<tr><td>'+e(p.date)+'</td><td class="n">'+fm(p.amount)+' dh</td><td>'+e(p.note||'')+'</td><td><button class="b sm" data-act="pdel" data-id="'+p.id+'">'+(S.del===p.id?'Sûr ?':'✕')+'</button></td></tr>'}).join('')+'</table></div>':'')+'</div>'
   +'<div class="btns"><a class="b" target="_blank" rel="noopener" href="'+wa(v.phone,statement(v))+'">'+ico('chat','s')+' Relevé</a><a class="b" target="_blank" rel="noopener" href="'+wa(v.phone,repV(v))+'">'+ico('chat','s')+' Bilan</a><button class="b" data-act="inv" data-id="'+v.id+'">Facture / PDF</button></div>';
  h+='<div class="card" style="margin-top:10px"><h2>Articles ('+v.arts.length+')</h2><div class="pg">'+v.arts.map(function(a){var im=(a.imgs&&a.imgs[0])||a.img;return '<div class="pc">'+(im?'<img src="'+im+'" alt="">':'<div class="ph">'+ico('image')+'</div>')+'<div class="pb"><div class="pn">'+e(a.name)+'</div><div class="px">'+a.price+' dh</div><div class="btns"><button class="b" data-act="vlink" data-id="'+v.id+'" data-p="'+e(a.name)+'">'+ico('link')+'</button><button class="b" data-act="adel" data-id="'+a.id+'">'+(S.del===a.id?'Sûr ?':'✕')+'</button></div></div></div>'}).join('')+'</div>'
   +'</div>';
  h+='<div class="card"><h2>Logo de la boutique</h2><input type="file" accept="image/*" data-photo="profile">'+(v.photo?'<button class="b full" data-act="vphdel">Retirer la photo</button>':'')+'</div>';
  h+='<div class="card"><h2>Coordonnées de la boutique</h2>'+VF.map(function(f){return '<label>'+f[1]+'</label><input data-vf="'+f[0]+'"'+(f[0]==='city'?' list="mc"':'')+(f[0]==='reg'?' type="number" min="0"':'')+' value="'+e(v[f[0]]||'')+'">'}).join('')+'<label>Présentation</label><textarea data-vf="desc">'+e(v.desc||'')+'</textarea><label>Notes privées</label><textarea data-vf="notes">'+e(v.notes||'')+'</textarea></div>';
  h+='<div class="card"><h2>Tarif négocié (facultatif)</h2><p class="mut">Laisse vide pour utiliser le tarif général ('+DB.set.cf+' + '+DB.set.bn+' dh). Le tarif est figé sur chaque commande au moment où elle est confirmée.</p><label>Par commande confirmée (dh)</label><input type="number" min="0" step="0.5" data-vfee="cf" value="'+((v.fees&&v.fees.cf!=null&&v.fees.cf!=='')?v.fees.cf:'')+'"><label>Bonus si livrée (dh)</label><input type="number" min="0" step="0.5" data-vfee="db" value="'+((v.fees&&v.fees.db!=null&&v.fees.db!=='')?v.fees.db:'')+'"></div>';
  return h+'<div class="btns"><button class="b" data-act="vver" data-id="'+v.id+'">'+(v.ver?'Retirer le badge Vérifié':'Marquer comme vérifié')+'</button><button class="b ko" data-act="vdel" data-id="'+v.id+'">'+(S.del===v.id?'Confirmer la suppression ?':'Supprimer le vendeur')+'</button></div>';
}
function repV(v){var s=stats(DB.orders.filter(function(o){return o.vendor===v.name}));return 'Bilan '+v.name+' : '+s.n+' commandes, '+s.ok+' confirmées ('+pct(s.ok,s.n-s.pe)+'), '+s.liv+' livrées, '+s.ref+' refusées, '+s.ko+' annulées, '+s.un+' injoignables.'}
function statement(v){
  var b=vbal(v),os=DB.orders.filter(function(o){return o.vendor===v.name&&earned(o)>0}),c=os.reduce(function(a,o){return a+((o.fc||0)>0||o.fu?1:0)},0),d=os.filter(function(o){return o.fd>0}).length;
  return 'Bonjour '+v.name+', relevé : '+os.length+' commande(s) facturée(s) ('+d+' livrée(s)). Total : '+fm(b.ea)+' dh. Reçu : '+fm(b.got)+' dh. '+(b.bal<0?'Reste à régler : '+fm(-b.bal)+' dh.':'Crédit restant : '+fm(b.bal)+' dh.')+(b.bal<0&&DB.set.rib?' Virement : '+(DB.set.holder||'')+' RIB '+DB.set.rib+'.':'')+' Merci !';
}
function invoice(v){
  var b=vbal(v),os=DB.orders.filter(function(o){return o.vendor===v.name&&earned(o)>0}).sort(function(a,c){return (a.cdate||a.date)<(c.cdate||c.date)?-1:1});
  return '<div class="btns noprint"><button class="b full" data-act="invback">← Retour</button><button class="b pri full" data-act="print">Imprimer / enregistrer en PDF</button></div><div class="inv" style="margin-top:10px"><h2>Relevé de commissions</h2><div>'+e(DB.set.pco||DB.set.holder||'Amk Logistique')+(DB.set.pco&&DB.set.holder?' · '+e(DB.set.holder):'')+'</div>'+([DB.set.phone,DB.set.pe,DB.set.pc].filter(Boolean).length?'<div>'+e([DB.set.phone,DB.set.pe,DB.set.pc].filter(Boolean).join(' · '))+'</div>':'')+'<div>Vendeur : <b>'+e(v.name)+'</b> · Édité le '+today()+'</div><div class="wrap" style="margin-top:10px"><table><tr><th>Date</th><th>Client</th><th>Produit</th><th class="n">Confirm.</th><th class="n">Livraison</th><th class="n">Vente add.</th><th class="n">Total</th></tr>'
   +os.map(function(o){return '<tr><td>'+e(o.cdate||o.date)+'</td><td>'+e(o.name.split(' ')[0])+'</td><td>'+e(o.product)+(o.tr?' (essai)':'')+'</td><td class="n">'+fm(o.fc||0)+'</td><td class="n">'+fm(o.fd||0)+'</td><td class="n">'+fm(o.fu||0)+'</td><td class="n">'+fm(earned(o))+'</td></tr>'}).join('')
   +'<tr><th colspan="6">Total facturé</th><th class="n">'+fm(b.ea)+' dh</th></tr><tr><th colspan="6">Paiements reçus</th><th class="n">'+fm(b.got)+' dh</th></tr><tr><th colspan="6">'+(b.bal<0?'Reste à payer':'Crédit restant')+'</th><th class="n">'+fm(Math.abs(b.bal))+' dh</th></tr></table></div>'+(b.bal<0&&DB.set.rib?'<p>Virement : '+e(DB.set.holder||'')+' · RIB '+e(DB.set.rib)+'</p>':'')+'</div>';
}
function grp(k){var m={};DB.orders.forEach(function(o){var key=o[k]||'Non renseigné';(m[key]=m[key]||[]).push(o)});return Object.keys(m).map(function(n){var s=stats(m[n]);return{n:n,t:s.n,ok:s.ok,tr:s.n-s.pe,liv:s.liv,ref:s.ref}}).sort(function(a,b){return b.t-a.t})}
function gtab(t,k){return '<div class="card"><h2>'+t+'</h2><div class="wrap"><table><tr><th></th><th class="n">Cmd</th><th class="n">Confirm.</th><th class="n">Livraison</th></tr>'+grp(k).map(function(g){return '<tr><td>'+e(g.n)+'</td><td class="n">'+g.t+'</td><td class="n">'+pct(g.ok,g.tr)+'</td><td class="n">'+pct(g.liv,g.liv+g.ref)+'</td></tr>'}).join('')+'</table></div></div>'}
function finv(){
  var tot=0,got=0,col=0;
  var rows=DB.vend.map(function(v){var b=vbal(v),s=stats(DB.orders.filter(function(o){return o.vendor===v.name}));tot+=b.ea;got+=b.got;if(b.bal<0)col-=b.bal;return '<tr><td>'+e(v.name)+'</td><td class="n">'+s.n+'</td><td class="n">'+pct(s.ok,s.n-s.pe)+'</td><td class="n">'+pct(s.liv,s.liv+s.ref)+'</td><td class="n">'+fm(b.ea)+'</td><td class="n">'+fm(b.got)+'</td><td class="n"><b class="'+(b.bal<0?'s-Annulé':'s-Confirmé')+'">'+fm(b.bal)+'</b></td></tr>'}).join('');
  var cn=DB.cour.map(function(c){var s=stats(DB.orders.filter(function(o){return o.courier===c.name}));return '<tr><td>'+e(c.name)+'</td><td class="n">'+s.n+'</td><td class="n">'+s.liv+'</td><td class="n">'+s.ref+'</td><td class="n">'+pct(s.liv,s.liv+s.ref)+'</td></tr>'}).join('');
  return mb()+'<div class="grid">'+kp('Total gagné',fm(tot)+' dh','g')+kp('Déjà reçu',fm(got)+' dh')+kp('À encaisser',fm(col)+' dh',col>0?'r':'')+kp('Commandes',DB.orders.length)+'</div>'
   +'<div class="card"><h2>Par vendeur</h2><div class="wrap"><table><tr><th>Vendeur</th><th class="n">Cmd</th><th class="n">Confirm.</th><th class="n">Livr.</th><th class="n">Gagné</th><th class="n">Reçu</th><th class="n">Solde</th></tr>'+rows+'</table></div><p class="mut">Solde négatif = le vendeur te doit cet argent. Positif = crédit déjà payé.</p></div>'
   +gtab('Par ville','city')+gtab('Par canal de vente','channel')
   +(cn?'<div class="card"><h2>Par livreur</h2><div class="wrap"><table><tr><th>Livreur</th><th class="n">Cmd</th><th class="n">Livré</th><th class="n">Refusé</th><th class="n">Taux</th></tr>'+cn+'</table></div></div>':'')
   +'<div class="card"><h2>Export Excel</h2><div class="btns"><button class="b pri" data-act="xls">'+ico('dl','s')+' Excel (.xlsx)</button></div></div>';
}
function hdrAv(){var s=DB.set,nm=(s.holder||'').trim(),ini=(nm.split(/\s+/).map(function(w){return w.charAt(0)}).slice(0,2).join('')||'').toUpperCase();return '<span class="hav">'+(ini?'<b>'+e(ini)+'</b>':ico('user'))+'</span>'}
function instaUrl(v){v=String(v||'').trim();if(!v)return '';if(/^https?:\/\//i.test(v))return v;return 'https://instagram.com/'+encodeURIComponent(v.replace(/^@/,''))}
function vcard(){var s=DB.set,n=(s.holder||'').trim(),p=n.split(/\s+/),fn=p[0]||'',ln=p.slice(1).join(' ');
  var q=function(x){return String(x||'').replace(/\\/g,'\\\\').replace(/\r?\n/g,'\\n').replace(/,/g,'\\,').replace(/;/g,'\\;')};
  var L=['BEGIN:VCARD','VERSION:3.0','N:'+q(ln)+';'+q(fn)+';;;','FN:'+q(n)];
  if(s.pco)L.push('ORG:'+q(s.pco));if(s.pt)L.push('TITLE:'+q(s.pt));if(s.phone)L.push('TEL;TYPE=CELL:'+q(s.phone));if(s.pe)L.push('EMAIL:'+q(s.pe));if(s.pc)L.push('ADR;TYPE=WORK:;;;'+q(s.pc)+';;;');if(s.insta)L.push('URL:'+q(instaUrl(s.insta)));
  var m=String(s.pphoto||'').match(/^data:image\/jpeg;base64,([A-Za-z0-9+\/=]+)$/);if(m)L.push('PHOTO;ENCODING=b;TYPE=JPEG:'+m[1]);
  L.push('END:VCARD');
  return L.map(function(l){var o=[];while(l.length>74){o.push(l.slice(0,74));l=' '+l.slice(74)}o.push(l);return o.join('\r\n')}).join('\r\n')+'\r\n'}
function profv(){
  var s=DB.set,nm=(s.holder||'').trim(),ini=(nm.split(/\s+/).map(function(w){return w.charAt(0)}).slice(0,2).join('')||'').toUpperCase();
  var av='<div class="pfa">'+(s.pphoto?'<img src="'+s.pphoto+'" alt="">':(ini?'<span>'+e(ini)+'</span>':ico('user')))+'</div>';
  var row=function(i,v,h){return v?'<a class="pfl" '+(h?'href="'+e(h)+'" target="_blank" rel="noopener"':'')+'>'+ico(i)+'<span>'+e(v)+'</span></a>':''};
  var rows=row('phone',s.phone,s.phone?'tel:'+String(s.phone).replace(/[^\d+]/g,''):'')+row('chat',s.phone?'WhatsApp':'',s.phone?'https://wa.me/'+waNum(s.phone):'')+row('mail',s.pe,s.pe?'mailto:'+s.pe:'')+row('pin',s.pc,'')+row('link',s.insta,instaUrl(s.insta));
  var card='<div class="pfc">'+av+'<div class="pfn">'+e(nm||'Ton nom')+'</div>'+(s.pt||s.pco?'<div class="pfr">'+e([s.pt,s.pco].filter(Boolean).join(' · '))+'</div>':'')+(rows?'<div class="pfs">'+rows+'</div>':'<p class="pfm">Complète ton profil ci-dessous pour remplir ta carte.</p>')+'</div>';
  var f=function(id,k,l,x){return '<label>'+l+'</label><input id="'+id+'" data-set="'+k+'" value="'+e(s[k]||'')+'" '+(x||'')+'>'};
  return card
   +'<div class="btns" style="margin:0 0 10px"><button class="b pri" data-act="vcf">'+ico('user','s')+' Ajouter à mes contacts</button><button class="b" data-act="pshare">'+ico('share','s')+' Partager</button></div>'
   +'<div class="card"><h2>Photo</h2><div class="btns" style="margin-top:0"><label class="b">'+ico('cam','s')+' '+(s.pphoto?'Changer la photo':'Choisir une photo')+'<input type="file" accept="image/*" data-photo="me"></label>'+(s.pphoto?'<button class="b ko" data-act="mphdel">Retirer</button>':'')+'</div></div>'
   +'<div class="card"><h2>Mes informations</h2>'+f('pf-n','holder','Nom (aussi utilisé pour les relevés)','autocomplete="name"')+f('pf-t','pt','Fonction','placeholder="Ex. Confirmateur, Gérant"')+f('pf-co','pco','Société','autocomplete="organization"')+f('pf-p','phone','Téléphone / WhatsApp','inputmode="tel" autocomplete="tel"')+f('pf-e','pe','E-mail','type="email" inputmode="email" autocomplete="email"')+f('pf-c','pc','Ville','autocomplete="address-level2"')+f('pf-i','insta','Instagram','placeholder="@moncompte"')+f('pf-r','rib','RIB pour les virements','inputmode="numeric"')
   +'<button class="b pri full" data-act="psave">Enregistrer mon profil</button><p class="mut" style="margin-top:8px">Ces informations restent sur cet appareil et sont incluses dans ta sauvegarde. Ton téléphone sert aussi aux liens de commande des vendeurs.</p></div>';
}
function bioCard(){var on=!!localStorage.getItem('cod_bio');return '<div class="card" id="bio-card"><h2>Déverrouillage biométrique</h2><p class="mut">'+(on?'Activé : tu peux déverrouiller l’appli avec ton empreinte ou ton visage. Ton code reste valable.':'Déverrouille l’appli sans taper ton code. L’empreinte et le visage ne quittent jamais ton téléphone.')+'</p><button class="b'+(on?'':' pri')+' full" data-bio="'+(on?'off':'on')+'">'+(on?'Désactiver':'Activer')+'</button></div>'}
function setv(){
  var s=DB.set,sp=S.sp;if('pasc'.indexOf(sp||'x')<0||!sp)sp=S.sp='p';
  var f=function(k,l,t,x){return '<label>'+l+'</label><input '+(t==='n'?'type="number" min="0" step="0.5" inputmode="decimal"':'')+' data-set="'+k+'" value="'+e(s[k])+'" '+(x||'')+'>'};
  var ex=function(){return s.cf+s.bn};
  var seg='<div class="seg s4">'+[['p','Profil'],['a','Activité'],['s','Sécurité'],['c','Connexions']].map(function(x){return '<button data-act="sp" data-v="'+x[0]+'" class="'+(sp===x[0]?'on':'')+'">'+x[1]+'</button>'}).join('')+'</div>';
  var foot='<div class="card"><p class="mut">Version '+VER+' · <a href="privacy.html" target="_blank" rel="noopener">Politique de confidentialité</a>'+(DB.legacy?' · données v3 non affichées conservées dans la sauvegarde':'')+'</p></div>';
  if(sp==='p')return mb()+seg+profv();
  if(sp==='a')return mb()+seg
   +'<div class="card"><h2>Tarifs & commissions</h2>'+f('cf','Par commande confirmée (dh)','n')+f('bn','Bonus par commande livrée (dh)','n')+f('up','Commission sur vente additionnelle (%)','n')+f('trial','Commandes d’essai gratuites par vendeur','n')+f('dth','Remise de volume à partir de (confirmations / mois)','n')+f('dpc','Remise de volume (%)','n')+f('minc','Crédit minimum conseillé (dh)','n')+f('rc','Coût d’un colis refusé (dh) : livraison aller + retour','n')
   +'<p class="mut">Une commande livrée rapporte '+ex()+' dh ('+s.cf+' + '+s.bn+'). Tu es payé pour ton travail même si le colis est refusé. Le tarif est figé à la confirmation : changer ces valeurs n’affecte jamais les commandes passées.</p></div>'
   +'<div class="card"><h2>Messages types</h2><label>Relance WhatsApp</label><textarea data-set="tpl">'+e(s.tpl)+'</textarea><p class="mut">[boutique] et [produit] sont remplacés.</p><label>Script d’appel</label><textarea data-set="script">'+e(s.script)+'</textarea></div>';
  if(sp==='s')return mb()+seg
   +'<div class="card"><h2>Verrouillage par code</h2>'+(CRY?'<p class="mut">'+(K?'Données chiffrées sur cet appareil (AES-256). Verrouillage automatique après 5 minutes en arrière-plan.':'Un code chiffre tes données (AES-256) et verrouille l’application. Si tu l’oublies, les données sont perdues : télécharge une sauvegarde avant.')+'</p><input type="password" id="npin" autocomplete="new-password" placeholder="Nouveau code (6 chiffres ou plus)"><button class="b pri full" data-act="setpin">'+(K?'Changer le code':'Activer le code')+'</button>'+(K?'<button class="b full" style="margin-top:6px" data-act="lock">Verrouiller maintenant</button><button class="b full" style="margin-top:6px" data-act="nopin">Retirer le code</button>':''):'<p class="mut">Le chiffrement n’est pas disponible dans ce contexte (HTTPS requis).</p>')+'</div>'
   +bioCard()
   +'<div class="card"><h2>Sauvegarde & restauration</h2><p class="mut">Tout reste sur cet appareil. Télécharge une sauvegarde chaque semaine. L’export Excel se trouve dans Finances & soldes.</p><div class="btns"><button class="b pri" data-act="bak">'+ico('dl','s')+' Télécharger la sauvegarde</button><button class="b" data-act="csvx">Copier en CSV</button></div>'+(S.csvx?'<textarea id="csvxt" readonly>'+e(S.csvx)+'</textarea>':'')+'<label style="display:block;margin-top:10px">Restaurer une sauvegarde (.json)</label><input type="file" id="rs" accept=".json,application/json"><button class="b ko full" style="margin-top:8px" data-act="wipe">'+(S.del==='wipe'?'Confirmer : tout effacer ?':'Effacer toutes les données')+'</button></div>'
   +'<div class="card"><h2>Données de démonstration</h2><p class="mut">Remplit l’appli de fausses commandes pour tester ou filmer une démo. Seules les données marquées « démo » sont supprimées par le bouton de retrait.</p><div class="btns"><button class="b pri" data-act="demoon">Charger la démo</button><button class="b ko" data-act="demooff">Retirer la démo</button></div></div>'+foot;
  return mb()+seg+setLive()+impCard()+(window.cloudCard?cloudCard():'')+setMap()+foot;
}
/* ---------- Excel ---------- */
function crc32(u){var t=crc32.t;if(!t){t=crc32.t=[];for(var n=0;n<256;n++){var c=n;for(var k=0;k<8;k++)c=c&1?0xEDB88320^(c>>>1):c>>>1;t[n]=c>>>0}}var r=-1;for(var i=0;i<u.length;i++)r=t[(r^u[i])&255]^(r>>>8);return (r^-1)>>>0}
function zip(files){var en=new TextEncoder(),parts=[],cd=[],off=0;
  files.forEach(function(f){var nm=en.encode(f.n),crc=crc32(f.d),h=new DataView(new ArrayBuffer(30));h.setUint32(0,0x04034b50,true);h.setUint16(4,20,true);h.setUint16(6,0x0800,true);h.setUint16(12,0x21,true);h.setUint32(14,crc,true);h.setUint32(18,f.d.length,true);h.setUint32(22,f.d.length,true);h.setUint16(26,nm.length,true);parts.push(new Uint8Array(h.buffer),nm,f.d);
    var c=new DataView(new ArrayBuffer(46));c.setUint32(0,0x02014b50,true);c.setUint16(4,20,true);c.setUint16(6,20,true);c.setUint16(8,0x0800,true);c.setUint16(14,0x21,true);c.setUint32(16,crc,true);c.setUint32(20,f.d.length,true);c.setUint32(24,f.d.length,true);c.setUint16(28,nm.length,true);c.setUint32(42,off,true);cd.push(new Uint8Array(c.buffer),nm);off+=30+nm.length+f.d.length});
  var cs=0;cd.forEach(function(p){cs+=p.length});var z=new DataView(new ArrayBuffer(22));z.setUint32(0,0x06054b50,true);z.setUint16(8,files.length,true);z.setUint16(10,files.length,true);z.setUint32(12,cs,true);z.setUint32(16,off,true);
  return new Blob(parts.concat(cd,[new Uint8Array(z.buffer)]),{type:'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'})}
function colL(i){var r='';i++;while(i>0){var m=(i-1)%26;r=String.fromCharCode(65+m)+r;i=Math.floor((i-1)/26)}return r}
var xe=function(v){return String(v).replace(/[&<>"]/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]})};
function sheetXml(rows){var x='<?xml version="1.0" encoding="UTF-8" standalone="yes"?><worksheet xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main"><cols><col min="1" max="'+Math.max(1,(rows[0]||[]).length)+'" width="22" customWidth="1"/></cols><sheetData>';
  rows.forEach(function(r,ri){x+='<row r="'+(ri+1)+'">';r.forEach(function(v,ci){var ref=colL(ci)+(ri+1),st=ri===0?' s="1"':'';if(typeof v==='number'&&isFinite(v))x+='<c r="'+ref+'"'+st+'><v>'+v+'</v></c>';else x+='<c r="'+ref+'" t="inlineStr"'+st+'><is><t xml:space="preserve">'+xe(v==null?'':v)+'</t></is></c>'});x+='</row>'});return x+'</sheetData></worksheet>'}
function xlsx(sh){var en=new TextEncoder(),U=function(t){return en.encode(t)},H='<?xml version="1.0" encoding="UTF-8" standalone="yes"?>',R='http://schemas.openxmlformats.org/officeDocument/2006/relationships';
  var ct=H+'<Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types"><Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/><Default Extension="xml" ContentType="application/xml"/><Override PartName="/xl/workbook.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet.main+xml"/><Override PartName="/xl/styles.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.styles+xml"/>'+sh.map(function(q,i){return '<Override PartName="/xl/worksheets/sheet'+(i+1)+'.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.worksheet+xml"/>'}).join('')+'</Types>';
  var rel=H+'<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"><Relationship Id="rId1" Type="'+R+'/officeDocument" Target="xl/workbook.xml"/></Relationships>';
  var wb=H+'<workbook xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main" xmlns:r="'+R+'"><sheets>'+sh.map(function(q,i){return '<sheet name="'+xe(q.name)+'" sheetId="'+(i+1)+'" r:id="rId'+(i+1)+'"/>'}).join('')+'</sheets></workbook>';
  var wr=H+'<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">'+sh.map(function(q,i){return '<Relationship Id="rId'+(i+1)+'" Type="'+R+'/worksheet" Target="worksheets/sheet'+(i+1)+'.xml"/>'}).join('')+'<Relationship Id="rId'+(sh.length+1)+'" Type="'+R+'/styles" Target="styles.xml"/></Relationships>';
  var st=H+'<styleSheet xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main"><fonts count="2"><font><sz val="11"/><name val="Calibri"/></font><font><b/><sz val="11"/><color rgb="FF1A1405"/><name val="Calibri"/></font></fonts><fills count="3"><fill><patternFill patternType="none"/></fill><fill><patternFill patternType="gray125"/></fill><fill><patternFill patternType="solid"><fgColor rgb="FFF0D77A"/><bgColor indexed="64"/></patternFill></fill></fills><borders count="1"><border><left/><right/><top/><bottom/><diagonal/></border></borders><cellStyleXfs count="1"><xf numFmtId="0" fontId="0" fillId="0" borderId="0"/></cellStyleXfs><cellXfs count="2"><xf numFmtId="0" fontId="0" fillId="0" borderId="0" xfId="0"/><xf numFmtId="0" fontId="1" fillId="2" borderId="0" xfId="0" applyFont="1" applyFill="1"/></cellXfs></styleSheet>';
  var f=[{n:'[Content_Types].xml',d:U(ct)},{n:'_rels/.rels',d:U(rel)},{n:'xl/workbook.xml',d:U(wb)},{n:'xl/_rels/workbook.xml.rels',d:U(wr)},{n:'xl/styles.xml',d:U(st)}];
  sh.forEach(function(q,i){f.push({n:'xl/worksheets/sheet'+(i+1)+'.xml',d:U(sheetXml(q.rows))})});return zip(f)}
function dl(blob,name){var u=URL.createObjectURL(blob),a=document.createElement('a');a.href=u;a.download=name;document.body.appendChild(a);a.click();setTimeout(function(){URL.revokeObjectURL(u);a.remove()},1500)}
function sheetsData(){
  var rp=function(a,b){return b?Math.round(100*a/b):0},O=DB.orders;
  var res=[['Vendeur','Commandes','Confirmées','Taux confirmation (%)','Livrées','Refusées','Taux livraison (%)','Total gagné (dh)','Reçu (dh)','Solde (dh)']];
  DB.vend.forEach(function(v){var s=stats(O.filter(function(o){return o.vendor===v.name})),b=vbal(v);res.push([v.name,s.n,s.ok,rp(s.ok,s.n-s.pe),s.liv,s.ref,rp(s.liv,s.liv+s.ref),b.ea,b.got,b.bal])});
  var od=[['Date','Vendeur','Client','Téléphone','Produit','Adresse','Ville','Canal','Montant (dh)','Statut','Motif','Tentatives','Livraison','Livreur','Commission confirmation','Commission livraison','Vente additionnelle','Essai gratuit']].concat(O.map(function(o){return [o.date,o.vendor,o.name,o.phone,o.product,o.address,o.city||'',o.channel||'',o.amount||0,o.status,o.reason||'',o.attempts,o.delivery||'',o.courier||'',o.fc||0,o.fd||0,o.fu||0,o.tr?'Oui':'']}));
  var vi=[['Ville','Commandes','Confirmées','Livrées','Refusées','Taux livraison (%)']].concat(grp('city').map(function(g){return [g.n,g.t,g.ok,g.liv,g.ref,rp(g.liv,g.liv+g.ref)]}));
  var pa=[['Date','Vendeur','Montant (dh)','Note']].concat(DB.pay.map(function(p){var v=vid(p.vid);return [p.date,v?v.name:'?',p.amount,p.note||'']}));
  var li=[['Livreur','Téléphone','Commandes','Livrées','Refusées','Taux livraison (%)']].concat(DB.cour.map(function(c){var s=stats(O.filter(function(o){return o.courier===c.name}));return [c.name,c.phone||'',s.n,s.liv,s.ref,rp(s.liv,s.liv+s.ref)]}));
  var wl=[['Date','Prénom','Nom','Contact','Adresse','Commande','Statut']].concat(DB.set.wallet.map(function(x){return [x.d,x.pr,x.n,x.t,x.a,x.c,x.st]}));
  var ve=[['Boutique','Responsable','Téléphone','E-mail','Ville','Adresse','Catégorie','Instagram','TikTok','Facebook','Autre lien','Articles']].concat(DB.vend.map(function(x){return [x.name,x.resp||'',x.phone||'',x.email||'',x.city||'',x.addr||'',x.cat||'',x.insta||'',x.tiktok||'',x.fb||'',x.site||'',(x.arts||[]).length]}));
  return [{name:'Résumé',rows:res},{name:'Commandes',rows:od},{name:'Villes',rows:vi},{name:'Paiements',rows:pa},{name:'Portefeuille',rows:wl},{name:'Vendeurs',rows:ve},{name:'Livreurs',rows:li}];
}

/* ====== modules réintégrés de la v3 ====== */
var ICO2={
box:'<path d="M12 3l8 4.5v9L12 21l-8-4.5v-9L12 3z"/><path d="M4 7.5l8 4.5 8-4.5M12 12v9"/>',
chart:'<path d="M5 20v-8M12 20V4M19 20v-5"/>',
net:'<circle cx="6" cy="12" r="2.6"/><circle cx="18" cy="6" r="2.6"/><circle cx="18" cy="18" r="2.6"/><path d="M8.3 10.8l7.4-3.6M8.3 13.2l7.4 3.6"/>',
store:'<path d="M3.5 9.5L5 4h14l1.5 5.5"/><path d="M3.5 9.5a2.8 2.8 0 0 0 5.5 0 2.8 2.8 0 0 0 6 0 2.8 2.8 0 0 0 5.5 0"/><path d="M5 12.5V20h14v-7.5M10 20v-4.5h4V20"/>',
sliders:'<path d="M4 7h9M17 7h3M4 17h3M11 17h9"/><circle cx="15" cy="7" r="2"/><circle cx="9" cy="17" r="2"/>',
phone:'<path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2z"/>',
chat:'<path d="M21 12a8 8 0 0 1-11.6 7.1L4 20l1-4.5A8 8 0 1 1 21 12z"/>',
camera:'<rect x="3.5" y="3.5" width="17" height="17" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.2" cy="6.8" r=".6"/>',
music:'<path d="M9 18V6l10-2v12"/><circle cx="6.5" cy="18" r="2.5"/><circle cx="16.5" cy="16" r="2.5"/>',
globe:'<circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3c3 3 3 15 0 18M12 3c-3 3-3 15 0 18"/>',
link:'<path d="M10 14a4 4 0 0 0 5.7 0l3-3a4 4 0 0 0-5.7-5.7l-1 1"/><path d="M14 10a4 4 0 0 0-5.7 0l-3 3a4 4 0 0 0 5.7 5.7l1-1"/>',
search:'<circle cx="11" cy="11" r="6.5"/><path d="M20 20l-4.2-4.2"/>',
calc:'<rect x="5" y="3" width="14" height="18" rx="3"/><path d="M8 7h8M8 12h.01M12 12h.01M16 12h.01M8 16h.01M12 16h.01M16 16h.01"/>',
wallet:'<path d="M4 8V7a2 2 0 0 1 2-2h11a2 2 0 0 1 2 2v1"/><rect x="3" y="8" width="18" height="12" rx="3"/><path d="M16 14h.01"/>',
download:'<path d="M12 4v11M7.5 10.5L12 15l4.5-4.5M5 19h14"/>',
image:'<rect x="3.5" y="4.5" width="17" height="15" rx="3"/><circle cx="9" cy="10" r="1.6"/><path d="M4 17l5-4.5 4 3.5 3-2.5 4 3.5"/>',
plus:'<path d="M12 5v14M5 12h14"/>',pin:'<path d="M12 21s7-6.2 7-11.5A7 7 0 0 0 5 9.5C5 14.8 12 21 12 21z"/><circle cx="12" cy="9.5" r="2.5"/>',bag:'<path d="M6 8h12l1 12H5L6 8z"/><path d="M9 8V6.5a3 3 0 0 1 6 0V8"/>'};
Object.assign(ICO,ICO2);
var WST=['Confirmé','Annulé','Refusé'];
var ext=function(u){return e(/^https?:\/\//.test(u)?u:'https://'+u)};
function cbar(){var b='';if(DB.set.insta)b+='<a class="b" target="_blank" rel="noopener" href="https://instagram.com/'+encodeURIComponent(DB.set.insta.replace(/^@/,''))+'">'+ico('camera')+' Instagram</a>';if(DB.set.phone)b+='<a class="b" target="_blank" rel="noopener" href="https://wa.me/'+waNum(DB.set.phone)+'">'+ico('chat')+' WhatsApp</a><a class="b" href="tel:'+e(DB.set.phone)+'">'+ico('phone')+' Appeler</a>';return b?'<div class="btns" style="margin:0 0 10px">'+b+'</div>':''}
var nget=function(id){return DB.set.net.filter(function(x){return x.id===id})[0]};
function matches(b){var w=b.prod.toLowerCase().split(/[\s,;]+/).filter(function(x){return x.length>2});return DB.set.net.filter(function(s){if(s.type!=='Grossiste')return false;var p=s.prod.toLowerCase();return w.some(function(x){return p.indexOf(x)>=0})&&(!s.qty||!b.qty||b.qty>=s.qty)}).sort(function(a,c){return (a.price||1e9)-(c.price||1e9)})}
function netAdd(){return mb()+'<div class="card"><h2>Ajouter un contact professionnel</h2><label>Type</label><select id="n-t"><option>Grossiste</option><option>Acheteur</option><option>Livreur</option></select><label>Nom</label><input id="n-n"><label>Téléphone</label><input id="n-p" inputmode="tel"><label>Produits ou zones (ex : t-shirts, Casablanca)</label><input id="n-pr"><label>Quantité (minimum du grossiste, ou besoin de l’acheteur)</label><input id="n-q" type="number" min="0"><label>Prix unitaire en dh (prix du grossiste, ou budget de l’acheteur)</label><input id="n-x" type="number" min="0"><label>Ville</label><input id="n-c"><button class="b pri" style="width:100%" data-act="nadd">Ajouter</button></div>';}
function net(){
  var N=DB.set.net,B=N.filter(function(x){return x.type==='Acheteur'}),W=N.filter(function(x){return x.type==='Grossiste'});
  var del=function(a,id){return '<button class="b" data-act="'+a+'" data-id="'+id+'">'+(S.del===id?'Confirmer la suppression ?':'Supprimer')+'</button>'};
  var h=(S.msg?'<div class="msg">'+e(S.msg)+'</div>':'');
  h+='<h2>Acheteurs ('+B.length+')</h2>'+B.map(function(b){var m=S.match===b.id?matches(b):null;return '<div class="card"><div class="row"><b>'+e(b.name)+'</b><span class="mut">'+e(b.city)+'</span></div><div class="mut">'+e(b.prod)+' · '+b.qty+' pcs · budget '+b.price+' dh</div><div class="btns"><button class="b pri" data-act="nmatch" data-id="'+b.id+'">'+ico('search')+' Trouver un grossiste</button>'+del('ndel',b.id)+'</div>'+(m?(m.length?m.map(function(w){return '<div class="card" style="margin:8px 0 0"><b>'+e(w.name)+'</b><div class="mut">'+e(w.prod)+' · min '+w.qty+' pcs · '+w.price+' dh</div><div class="btns"><a class="b" target="_blank" rel="noopener" href="'+wa(w.phone,'Bonjour '+w.name+', j’ai un acheteur pour '+b.prod+' ('+b.qty+' pièces, budget '+b.price+' dh l’unité). Pouvez-vous me donner votre meilleur prix et vos délais ?')+'">'+ico('chat')+' Grossiste</a><a class="b" target="_blank" rel="noopener" href="'+wa(b.phone,'Bonjour '+b.name+', j’ai un fournisseur pour '+b.prod+(w.price?' à '+w.price+' dh l’unité':'')+'. Intéressé ?')+'">'+ico('chat')+' Acheteur</a><button class="b ok" data-act="deal" data-b="'+b.id+'" data-w="'+w.id+'">Créer l’affaire</button></div></div>'}).join(''):'<p class="mut">Aucun grossiste ne correspond. Ajoute-en, ou vérifie les mots-clés des produits et la quantité minimum.</p>'):'')+'</div>'}).join('');
  h+='<h2>Grossistes ('+W.length+')</h2>'+W.map(function(w){return '<div class="card"><div class="row"><b>'+e(w.name)+'</b><span class="mut">'+e(w.city)+'</span></div><div class="mut">'+e(w.prod)+' · min '+w.qty+' pcs · '+w.price+' dh</div><div class="btns"><a class="b" target="_blank" rel="noopener" href="'+wa(w.phone,'Bonjour '+w.name+', quels sont vos prix et quantités minimum en ce moment ?')+'">'+ico('chat')+' Écrire</a>'+del('ndel',w.id)+'</div></div>'}).join('');
  return h+livlist()+'<p class="mut">Ces contacts restent sur ton téléphone. N’envoie jamais le numéro d’une partie à l’autre sans son accord.</p>';
}
function dealsv(){
  var del=function(a,id){return '<button class="b" data-act="'+a+'" data-id="'+id+'">'+(S.del===id?'Confirmer la suppression ?':'Supprimer')+'</button>'};
  var h=(S.msg?'<div class="msg">'+e(S.msg)+'</div>':'');
  var tot=0;
  h+='<h2>Affaires</h2>'+(DB.set.deals.length?DB.set.deals.map(function(d){var mg=(d.sell-d.buy)*d.qty;if(d.status==='Conclu')tot+=mg;return '<div class="card"><div class="row"><b>'+e(d.buyer)+' ← '+e(d.seller)+'</b><span class="mut">'+e(d.status)+'</span></div><div class="mut">'+e(d.prod)+' · '+d.qty+' pcs · achat '+d.buy+' dh · vente '+d.sell+' dh · marge '+mg+' dh</div><select data-dst="1" data-id="'+d.id+'">'+['En discussion','Conclu','Perdu'].map(function(x){return '<option'+(d.status===x?' selected':'')+'>'+x+'</option>'}).join('')+'</select>'+del('ddel',d.id)+'</div>'}).join('')+'<div class="kpi"><span class="mut">Marge des affaires conclues</span><b>'+tot+' dh</b></div>':'<p class="mut">Aucune affaire pour l’instant.</p>');
  return h;
}
function allArts(){var A=[];DB.vend.forEach(function(v){(v.arts||[]).forEach(function(a){A.push({a:a,v:v})})});return A}
function disc(a){return a.old&&a.old>a.price?'-'+Math.round(100*(a.old-a.price)/a.old)+'%':''}
function pprice(a){return '<div class="px">'+a.price+' dh'+(a.old>a.price?'<span class="old">'+a.old+' dh</span>':'')+'</div>'}
function pform(){
  if(!DB.vend.length)return '<div class="card"><p class="mut">Crée d’abord un vendeur dans l’onglet Vendeurs, puis reviens ajouter ses produits.</p></div>';
  return '<div class="card"><h2>Nouveau produit</h2><label>Vendeur</label><select id="p-v">'+DB.vend.map(function(v){return '<option value="'+v.id+'"'+(v.id===S.pv?' selected':'')+'>'+e(v.name)+'</option>'}).join('')+'</select><label>Nom du produit</label><input id="p-n"><label>Prix de vente (dh)</label><input id="p-p" type="number" min="0" inputmode="decimal"><label>Ancien prix (dh, facultatif : affiche une promo)</label><input id="p-o" type="number" min="0" inputmode="decimal"><label>Catégorie (mode, beauté, high-tech…)</label><input id="p-c"><label>Description</label><input id="p-d"><label>Photos du produit (jusqu’à 4)</label><input id="p-f" type="file" accept="image/*" multiple><button class="b pri" style="width:100%" data-act="padd">Publier le produit</button></div>';
}
function pdetail(){
  var f=allArts().filter(function(x){return x.a.id===S.pview})[0];if(!f){S.pview='';return catv()}
  var a=f.a,v=f.v,im=a.imgs&&a.imgs.length?a.imgs:(a.img?[a.img]:[]),k=Math.min(S.pi||0,Math.max(0,im.length-1));
  return mb()+'<button class="b" data-act="pback" style="width:100%;margin-bottom:10px">← Catalogue</button>'+(im.length?'<img class="big" src="'+im[k]+'" alt="">':'<div class="pc"><div class="ph" style="aspect-ratio:1">'+ico('image')+'</div></div>')
   +(im.length>1?'<div class="th">'+im.map(function(m,n){return '<img class="'+(n===k?'on':'')+'" src="'+m+'" data-act="pimg" data-v="'+n+'" alt="">'}).join('')+'</div>':'')
   +'<div class="card" style="margin-top:10px"><h2>'+e(a.name)+(disc(a)?' <span class="tag" style="background:#dc2626;color:#fff">'+disc(a)+'</span>':'')+'</h2>'+pprice(a)+(a.cat?'<div class="mut">'+e(a.cat)+'</div>':'')+(a.desc?'<p>'+e(a.desc)+'</p>':'')+'<div class="mut">Vendu par <b>'+e(v.name)+'</b>'+(v.ver?' ✔ Vérifié':'')+(v.city?' · '+e(v.city):'')+'</div></div>'
   +'<div class="btns"><a class="b pri" target="_blank" rel="noopener" href="'+wa(v.phone,'Bonjour, je suis intéressé par '+a.name+' ('+a.price+' dh).')+'">'+ico('chat')+' Commander sur WhatsApp</a><button class="b" data-act="pdel" data-id="'+a.id+'">'+(S.del===a.id?'Confirmer ?':'Supprimer')+'</button></div>';
}
function catv(){
  if(S.pview)return pdetail();
  var q=(S.cq||'').toLowerCase(),A=allArts(),cats=[];
  A.forEach(function(x){if(x.a.cat&&cats.indexOf(x.a.cat)<0)cats.push(x.a.cat)});
  var l=A.filter(function(x){return (!S.pc||x.a.cat===S.pc)&&(!q||(x.a.name+' '+x.v.name+' '+(x.a.cat||'')+' '+(x.v.city||'')).toLowerCase().indexOf(q)>=0)});
  return mb()+'<button class="b pri" style="width:100%" data-act="pform">'+ico('camera')+' '+(S.pform?'Fermer':'Ajouter un produit')+'</button>'+(S.pform?pform():'')
   +'<input id="cq" style="margin-top:10px" placeholder="Rechercher un produit, une boutique, une ville…" value="'+e(S.cq||'')+'">'
   +(cats.length?'<div class="chips">'+cats.map(function(c){return '<button class="chip'+(S.pc===c?' on':'')+'" data-act="pcat" data-v="'+e(c)+'">'+e(c)+'</button>'}).join('')+'</div>':'')
   +(l.length?'<div class="pg">'+l.map(function(x){var a=x.a,im=a.imgs&&a.imgs[0]||a.img;return '<div class="pc">'+(disc(a)?'<span class="bd">'+disc(a)+'</span>':'')+'<div data-act="pview" data-id="'+a.id+'" style="cursor:pointer">'+(im?'<img src="'+im+'" alt="">':'<div class="ph">'+ico('image')+'</div>')+'<div class="pb"><div class="pn">'+e(a.name)+'</div>'+pprice(a)+'<div class="mut" style="font-size:11px">'+e(x.v.name)+(x.v.ver?' ✔':'')+(x.v.city?' · '+e(x.v.city):'')+'</div></div></div><div class="pb" style="padding-top:0"><a class="b pri" style="display:block" target="_blank" rel="noopener" href="'+wa(x.v.phone,'Bonjour, je suis intéressé par '+a.name+' ('+a.price+' dh).')+'">Commander</a></div></div>'}).join('')+'</div>':'<p class="mut">Aucun produit pour l’instant. Appuie sur « Ajouter un produit ».</p>');
}
/* ---- suivi GPS : carte 3D du Maroc, scooter animé, liens client et livreur ---- */
var STV=['En attente de validation','Validée','En cours de livraison','Livrée'],STK=['À valider','Validées','En cours de livraison','Livrées'],CS={gps:null,w:null,t:0,err:''};
function nrm(s){return String(s||'').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/[^a-z ]/g,'').trim()}
var CITIES={},MCN=[];[['Tanger',35.77,-5.80],['Tétouan',35.57,-5.37],['Oujda',34.68,-1.91],['Nador',35.17,-2.93],['Al Hoceïma',35.25,-3.94],['Larache',35.19,-6.15],['Kénitra',34.26,-6.58],['Rabat',34.02,-6.84],['Salé',34.04,-6.80],['Fès',34.03,-5.00],['Meknès',33.89,-5.55],['Taza',34.21,-4.01],['Casablanca',33.57,-7.59],['Mohammedia',33.69,-7.38],['Settat',33.00,-7.62],['El Jadida',33.23,-8.50],['Khouribga',32.88,-6.91],['Béni Mellal',32.34,-6.36],['Safi',32.30,-9.24],['Marrakech',31.63,-8.00],['Essaouira',31.51,-9.77],['Errachidia',31.93,-4.43],['Ouarzazate',30.92,-6.89],['Agadir',30.43,-9.60],['Tiznit',29.70,-9.73],['Guelmim',28.99,-10.06],['Laâyoune',27.15,-13.20],['Dakhla',23.68,-15.96]].forEach(function(c){CITIES[nrm(c[0])]=[c[1],c[2],c[0]];MCN.push(c[0])});
var CALIAS={casa:'casablanca',tangier:'tanger',fez:'fes',marrakesh:'marrakech'};
function cfind(n){n=nrm(n);if(!n)return null;n=CALIAS[n]||n;if(CITIES[n])return CITIES[n];var r=null;Object.keys(CITIES).forEach(function(k){if(!r&&n.length>2&&(n.indexOf(k)>=0||k.indexOf(n)===0))r=CITIES[k]});return r}
var POLY=[[-5.92,35.79],[-5.35,35.92],[-4.4,35.2],[-3.9,35.2],[-2.95,35.4],[-2.2,35.1],[-1.8,34.9],[-1.7,34.5],[-1.8,33.5],[-1.7,32.6],[-1.2,32.1],[-3.0,31.7],[-3.6,30.9],[-4.8,30.0],[-6.5,29.6],[-8.7,28.7],[-8.67,27.67],[-8.67,26.0],[-12.0,26.0],[-12.0,23.3],[-13.2,22.9],[-13.2,21.33],[-16.5,21.33],[-17.05,20.8],[-16.0,23.7],[-14.5,26.1],[-13.4,27.1],[-12.9,27.95],[-11.2,28.4],[-10.2,29.4],[-9.7,30.4],[-9.8,31.5],[-9.25,32.3],[-8.5,33.25],[-7.7,33.65],[-6.85,34.05],[-6.7,34.3],[-6.2,35.2]];
var pj=function(lat,lon){return [Math.round((lon+17.2)*220)/10,Math.round((36-lat)*255)/10]};
var SC='<g transform="scale(1.25)"><ellipse cx="0" cy="9" rx="11" ry="2.5" fill="#000" opacity=".35"/><circle cx="-7" cy="6" r="3.6" fill="#111" stroke="#f6dc85" stroke-width="1.2"/><circle cx="8" cy="6" r="3.6" fill="#111" stroke="#f6dc85" stroke-width="1.2"/><path d="M-7 6H-3L-1 -1H5L8 6M5 -1L7 -6H10" fill="none" stroke="#f6dc85" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/><rect x="-12" y="-6" width="7" height="6" rx="1" fill="#dc2626"/><circle cx="1" cy="-7" r="2.6" fill="#fff"/><path d="M1 -4.5V-1" stroke="#fff" stroke-width="2.2" stroke-linecap="round"/></g>';
function hav(a,b){var r=Math.PI/180,dl=(b[0]-a[0])*r,dn=(b[1]-a[1])*r,x=Math.sin(dl/2)*Math.sin(dl/2)+Math.cos(a[0]*r)*Math.cos(b[0]*r)*Math.sin(dn/2)*Math.sin(dn/2);return 12742*Math.asin(Math.sqrt(x))}
var inMA=function(q){return q&&q[0]>20&&q[0]<36.2&&q[1]>-17.5&&q[1]<-1};
function mapSvg(m){
  var RT=m.list||[m],poly=POLY.map(function(q){return pj(q[1],q[0]).join(',')}).join(' '),pts=[];
  var live=inMA(m.live)?m.live:null,gps=inMA(m.gps)?m.gps:null;
  if(!m.list){var A0=cfind(m.vc),B0=cfind(m.cc);if(A0&&B0){pts.push(pj(A0[0],A0[1]),pj(B0[0],B0[1]));if(live)pts.push(pj(live[0],live[1]));if(gps)pts.push(pj(gps[0],gps[1]))}}
  var vb=[0,0,360,400];
  if(pts.length&&!S.full){var xs=pts.map(function(q){return q[0]}),ys=pts.map(function(q){return q[1]}),x1=Math.min.apply(0,xs),x2=Math.max.apply(0,xs),y1=Math.min.apply(0,ys),y2=Math.max.apply(0,ys),w=(Math.max(x2-x1,(y2-y1)*.9,50)+70)/(S.mz||1);w=Math.min(360,Math.max(40,w));var hh=w*400/360,x0=(x1+x2)/2-w/2,y0=(y1+y2)/2-hh/2;vb=[Math.max(-10,Math.min(x0,370-w)),Math.max(-10,Math.min(y0,410-hh)),w,hh]}
  var k=Math.max(.15,vb[2]/360),ks=Math.min(1,k*1.5);
  var h='<div class="map3d'+(S.flat?' flat':'')+'"><div class="mctl"><button data-act="mz" data-v="+">+</button><button data-act="mz" data-v="-">−</button><button data-act="mz" data-v="full">'+(S.full?'Trajet':'Maroc')+'</button></div><svg viewBox="'+vb.map(function(n){return Math.round(n*10)/10}).join(' ')+'" xmlns="http://www.w3.org/2000/svg"><defs><linearGradient id="mg" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#1d4ed8"/><stop offset="1" stop-color="#0b1f5c"/></linearGradient></defs>';
  for(var i=9;i>0;i--)h+='<polygon points="'+poly+'" transform="translate(0,'+i*1.5*k+')" fill="#8a6a12"/>';
  h+='<polygon points="'+poly+'" fill="url(#mg)" stroke="#f6dc85" stroke-width="'+Math.max(.5,1.2*k)+'" stroke-linejoin="round"/>';
  Object.keys(CITIES).forEach(function(c){var q=pj(CITIES[c][0],CITIES[c][1]);h+='<circle cx="'+q[0]+'" cy="'+q[1]+'" r="'+1.8*k+'" fill="#f6dc85" opacity=".7"/>'});
  var pin=function(c,col){var q=pj(c[0],c[1]);return '<circle cx="'+q[0]+'" cy="'+q[1]+'" r="'+Math.max(2,6*k)+'" fill="'+col+'" stroke="#fff" stroke-width="'+1.5*k+'"/><text x="'+q[0]+'" y="'+(q[1]+18*k)+'" text-anchor="middle" font-size="'+Math.max(4,11*k)+'" font-weight="700" fill="#fff" stroke="#000" stroke-width="'+.5*k+'" paint-order="stroke">'+c[2]+'</text>'};
  RT.forEach(function(r,n){
    var A=cfind(r.vc),B=cfind(r.cc),lv=inMA(r.live)?r.live:null;
    if(A&&B){
      var a=pj(A[0],A[1]),b=pj(B[0],B[1]),cx=(a[0]+b[0])/2-(b[1]-a[1])*.22,cy=(a[1]+b[1])/2+(b[0]-a[0])*.22,d='M'+a[0]+' '+a[1]+' Q'+Math.round(cx)+' '+Math.round(cy)+' '+b[0]+' '+b[1];
      h+='<path d="'+d+'" fill="none" stroke="#f6dc85" stroke-width="'+Math.max(.8,2*k)+'" stroke-dasharray="'+5*k+' '+4*k+'"/>'+pin(A,'#16a34a')+pin(B,'#dc2626');
      var fl='scale('+(b[0]<a[0]?-ks:ks)+','+ks+')';
      if(r.s===2&&lv){var q=pj(lv[0],lv[1]);h+='<g transform="translate('+q[0]+','+q[1]+') '+fl+'">'+(r.ve==='car'?CAR2:SC)+'</g>'}
      else if(r.s===2)h+='<g><animateMotion dur="'+(6+n%3)+'s" repeatCount="indefinite" path="'+d+'"/><g transform="'+fl+'">'+(r.ve==='car'?CAR2:SC)+'</g></g>';
      else{var z=r.s===3?b:a;h+='<g transform="translate('+z[0]+','+(z[1]-16*k)+') scale('+ks+')">'+(r.ve==='car'?CAR2:SC)+'</g>'+(r.s===3?'<text x="'+b[0]+'" y="'+(b[1]-30*k)+'" text-anchor="middle" font-size="'+14*k+'">✅</text>':'')}
    }else if(A||B)h+=pin(A||B,'#16a34a');
  });
  if(gps){var g=pj(gps[0],gps[1]);h+='<circle cx="'+g[0]+'" cy="'+g[1]+'" r="'+Math.max(2,5*k)+'" fill="#3b82f6" stroke="#fff" stroke-width="'+1.5*k+'"/>'}
  return h+'</svg></div>';
}
/* ---- carte détaillée (Leaflet + OpenStreetMap) : zoom, villes, rues, route ---- */
var LM={el:null,map:null,g:null,spec:null,key:'',anim:0,anims:[],fail:0,bad:0,loading:0,fitN:0},ROAD={},ROADQ={},GEO={},GEOQ={};
try{GEO=JSON.parse(localStorage.getItem('cod_geo')||'{}')||{}}catch(e){GEO={}}
var LOK=function(){return !!(window.L&&window.L.map)};
var ck=function(a,b){return a[0]+','+a[1]+'>'+b[0]+','+b[1]};
function loadL(){if(LOK()||LM.loading||LM.fail)return;LM.loading=1;var l=document.createElement('link');l.rel='stylesheet';l.href='https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.min.css';document.head.appendChild(l);var c=document.createElement('script');c.src='https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.min.js';c.onload=function(){LM.loading=0;rr()};c.onerror=function(){LM.loading=0;LM.fail=1};document.head.appendChild(c)}
function geo(q){if(GEO[q]!==undefined)return GEO[q]||null;if(!GEOQ[q]){GEOQ[q]=1;try{fetch('https://nominatim.openstreetmap.org/search?format=json&limit=1&countrycodes=ma&q='+encodeURIComponent(q)).then(function(r){return r.json()}).then(function(j){GEO[q]=(j&&j[0])?[+j[0].lat,+j[0].lon]:0;try{localStorage.setItem('cod_geo',JSON.stringify(GEO))}catch(e){}if(GEO[q])rr()}).catch(function(){})}catch(e){}}return null}
function roadInfo(a,b){return ROAD[ck(a,b)]||null}
function roadGet(a,b){var k=ck(a,b);if(ROAD[k]||ROADQ[k])return;ROADQ[k]=1;try{fetch('https://router.project-osrm.org/route/v1/driving/'+a[1]+','+a[0]+';'+b[1]+','+b[0]+'?overview=simplified&geometries=geojson').then(function(r){return r.json()}).then(function(j){var t=j&&j.routes&&j.routes[0];if(t){ROAD[k]={pts:t.geometry.coordinates.map(function(c){return [c[1],c[0]]}),km:t.distance/1000,min:t.duration/60};rr()}}).catch(function(){})}catch(e){}}
function lspec(m){
  var RT=m.list||[m],out=[];
  RT.forEach(function(r){
    var Ac=cfind(r.vc),Bc=cfind(r.cc),a=Ac?[Ac[0],Ac[1]]:(r.vc?geo(r.vc+', Maroc'):null),b=Bc?[Bc[0],Bc[1]]:(r.cc?geo(r.cc+', Maroc'):null);
    if(!a||!b)return;
    var an=Ac?Ac[2]:r.vc,bn=Bc?Bc[2]:r.cc;
    if(r.aq){var g1=geo(r.aq+', '+an+', Maroc');if(g1&&hav(g1,a)<60)a=g1}
    if(r.bq){var g2=geo(r.bq+', '+bn+', Maroc');if(g2&&hav(g2,b)<60)b=g2}
    roadGet(a,b);var rd=ROAD[ck(a,b)];
    out.push({a:a,b:b,an:an,bn:bn,s:r.s,live:inMA(r.live)?r.live:null,road:rd?rd.pts:null,ve:r.ve,km:rd?rd.km:0,mn:rd?rd.min:0});
  });
  return {routes:out,gps:inMA(m.gps)?m.gps:null,key:out.map(function(r){return r.a+'|'+r.b}).join(';')+'#'+LM.fitN};
}
function mapView(m){
  if(!LOK()||LM.bad){loadL();return mapSvg(m)}
  LM.spec=lspec(m);
  return '<div class="lslot"></div><div class="btns lbtns"><button class="b" data-act="lfit">Recentrer le trajet</button><button class="b" data-act="lmaroc">Tout le Maroc</button><button class="b lfb'+(LM.follow?' on':'')+'" data-lf="1">🧭 Suivi Waze</button><button class="b" data-poi="1">📍 Zoom sur la destination</button></div>'+simUI()+'<p class="mut" style="font-size:12px">Carte OpenStreetMap : zoome avec deux doigts ou avec +/−, déplace-la avec le doigt. Internet requis pour le fond de carte.</p>';
}
function flatBtn(){return (LOK()&&!LM.bad)?'':'<button class="b" style="flex:0 0 auto;min-width:0" data-act="flat">3D / Plat</button>'}
function lpin(col,t){return L.divIcon({className:'lpin',html:'<div class="pin" style="background:'+col+'"></div><span>'+e(t)+'</span>',iconSize:[0,0]})}
function lsc(){return L.divIcon({className:'lsc',html:'<svg viewBox="-16 -14 34 30" width="46" height="40">'+SC+'</svg>',iconSize:[46,40],iconAnchor:[23,30]})}
function lanim(mk,line){var d=[0],i;for(i=1;i<line.length;i++)d.push(d[i-1]+hav(line[i-1],line[i]));LM.anims.push({mk:mk,line:line,d:d,tot:d[d.length-1]||1})}
function lstep(ts){
  if(!LM.el||!LM.el.isConnected){LM.anim=0;return}
  LM.anims.forEach(function(a){var p=((ts%14000)/14000)*a.tot,i=1;while(i<a.d.length-1&&a.d[i]<p)i++;var s0=a.d[i-1],f=Math.max(0,Math.min(1,(p-s0)/Math.max(1e-6,a.d[i]-s0))),A=a.line[i-1],B=a.line[i];a.mk.setLatLng([A[0]+(B[0]-A[0])*f,A[1]+(B[1]-A[1])*f])});
  LM.anim=requestAnimationFrame(lstep);
}
function lmDraw(){
  var sp=LM.spec,g=LM.g,all=[];g.clearLayers();LM.anims=[];if(LM.anim){cancelAnimationFrame(LM.anim);LM.anim=0}
  sp.routes.forEach(function(r){
    var line=r.road||[r.a,r.b];
    L.polyline(line,{color:'#ffffff',weight:9,opacity:.95,lineCap:'round'}).addTo(g);
    L.polyline(line,{color:'#b8921f',weight:5,opacity:1,lineCap:'round',dashArray:r.road?undefined:'8 8'}).addTo(g);
    L.marker(r.a,{icon:lpin('#16a34a',r.an)}).addTo(g);L.marker(r.b,{icon:lpin('#dc2626',r.bn)}).addTo(g);
    all.push(r.a,r.b);
    var mk=L.marker(r.s===3?r.b:r.a,{icon:lsc(),zIndexOffset:1000,interactive:false}).addTo(g);
    if(r.s===2){if(r.live)mk.setLatLng(r.live);else lanim(mk,line)}
  });
  if(sp.gps){L.circleMarker(sp.gps,{radius:8,color:'#ffffff',weight:3,fillColor:'#3b82f6',fillOpacity:1}).addTo(g);all.push(sp.gps)}
  if(LM.key!==sp.key){LM.key=sp.key;if(all.length)LM.map.fitBounds(all,{padding:[50,50],maxZoom:13});else LM.map.setView([31.8,-7.1],5)}
  if(LM.anims.length)LM.anim=requestAnimationFrame(lstep);
}
function tileUrl(){if(DB.set.tiles)return DB.set.tiles;if(DB.set.ckey)return 'https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png?key='+encodeURIComponent(DB.set.ckey);return 'https://tile.openstreetmap.org/{z}/{x}/{y}.png'}
function lmFlush(){
  var slot=document.querySelector&&document.querySelector('.lslot');if(!slot||!LOK()||!LM.spec||LM.bad)return;
  try{
    if(!LM.el){LM.el=document.createElement('div');LM.el.className='lmap'}
    slot.appendChild(LM.el);
    if(!LM.map){LM.map=L.map(LM.el,{zoomControl:true,minZoom:4,maxZoom:18}).setView([31.8,-7.1],5);L.tileLayer(tileUrl(),{subdomains:'abcd',maxZoom:19,attribution:'© OpenStreetMap contributors'+(DB.set.ckey&&!DB.set.tiles?' © CARTO':'')}).addTo(LM.map);LM.g=L.layerGroup().addTo(LM.map)}
    LM.map.invalidateSize();lmDraw();
  }catch(e){LM.bad=1;rr()}
}
var EVT=['Commande reçue, en attente de validation','Commande validée','Le livreur est en route','Colis livré'];
function tid(o){if(!o.tid){o.tid=Array.prototype.map.call(crypto.getRandomValues(new Uint8Array(16)),function(b){return ('0'+b.toString(36)).slice(-2)}).join('');save()}return o.tid}
function dbu(db,id){return db.replace(/\/$/,'')+'/track/'+id+'.json'}
function fbp(db,id,b){try{fetch(dbu(db,id),{method:'PATCH',headers:{'Content-Type':'application/json'},body:JSON.stringify(b)}).catch(function(){})}catch(e){}}
function fbg(db,id,cb){try{fetch(dbu(db,id)).then(function(r){return r.json()}).then(cb).catch(function(){})}catch(e){}}
function pub(o){var sp=sec(o);var n=Date.now(),st=stage(o),b={v:o.vendor,vc:vcity(o),cc:o.city||'',p:o.product,s:st,bad:bad(o)?1:0,c:o.courier||'',ve:vehOf(o.courier),t:n};b['ev/e'+n]={t:n,x:bad(o)?'Commande annulée ou refusée':EVT[st]};if(st===3){b.dc=dcs(o);var db_=DB.set.db,id_=tid(o);sp.then(function(){fbp(db_,id_,b)})}else fbp(DB.set.db,tid(o),b)}
function poll(){if(document.hidden)return;PT++;
  if(!DB||!DB.set.db||S.locked||Q.get('t')||Q.get('l')||Q.get('v'))return;
  DB.orders.filter(function(o){return o.tid&&!bad(o)&&stage(o)>=1&&(stage(o)<3||(stage(o)===3&&!o.rt&&PT%12===0))}).slice(-25).forEach(function(o){fbg(DB.set.db,o.tid,function(r){
    if(!r)return;var ch=false;
    if(r.bad&&!bad(o)){setDel(o,'Refusé');ch=true}else if(r.s===3&&stage(o)<3){if(aset().rv===0)setDel(o,'Livré');else if(!o.rd)o.rd=1;ch=true}else if(r.s===2&&stage(o)<2){setDel(o,'En cours');ch=true}
    if(r.pos&&o.pt!==r.pt){o.pos=r.pos;o.pt=r.pt;ch=true}if(r.rt&&o.rt!==r.rt){o.rt=r.rt;o.fb=r.fb||'';ch=true}if(r.rq&&o.rq!==r.rq){o.rq=r.rq;ch=true}
    if(ch){save();var ae=document.activeElement;if(S.tab==='trk'&&!(ae&&/INPUT|TEXTAREA|SELECT/.test(ae.tagName)))render()}})});
}
setInterval(poll,5000);
function rr(){if(Q.get('t'))renderClient();else if(Q.get('l'))renderCourier();else render()}
function nmsgL(o){var s=stage(o),l=tlink(o,'t'),T=['nous avons bien reçu votre commande « '+o.product+' » chez '+o.vendor+'. Elle est en attente de validation.','votre commande « '+o.product+' » est validée. Elle sera remise au livreur très bientôt.','votre commande « '+o.product+' » est en cours de livraison'+(o.courier?' avec '+o.courier:'')+'.'+(o.amount?' Montant à régler à la livraison : '+o.amount+' dh.':''),'votre commande « '+o.product+' » a été livrée. Merci pour votre confiance !'];return 'Bonjour '+o.name+', '+T[s]+' Suivi : '+l}
function nbar(o,big){
  var s=stage(o),m=nmsgL(o),sub='Commande '+STV[s]+' - '+o.vendor,b='<div class="btns"><a class="b'+(big?' pri':'')+'" data-act="pubo" data-id="'+o.id+'" href="sms:'+e(o.phone)+'?&body='+encodeURIComponent(m)+'">SMS</a>'+(o.email?'<a class="b'+(big?' pri':'')+'" data-act="pubo" data-id="'+o.id+'" href="mailto:'+e(o.email)+'?subject='+encodeURIComponent(sub)+'&body='+encodeURIComponent(m)+'">E-mail</a>':'')+'<a class="b" data-act="pubo" data-id="'+o.id+'" target="_blank" rel="noopener" href="'+wa(o.phone,m)+'">'+ico('chat')+' WhatsApp</a></div>';
  return big?'<div class="card" style="border-color:#f6dc85"><h2>Prévenir '+e(o.name)+'</h2><p class="mut">Étape : '+STV[s]+'.'+(o.email?'':' Pas d’e-mail enregistré pour ce client.')+'</p>'+b+'<button class="b" style="width:100%;margin-top:6px" data-act="nclose">Fermer</button></div>':'<div class="mut" style="margin-top:8px">Prévenir le client :</div>'+b}
function encq(o){return encodeURIComponent(btoa(unescape(encodeURIComponent(JSON.stringify(o)))))}
function decq(k){try{return JSON.parse(decodeURIComponent(escape(atob(Q.get(k)))))}catch(e){return null}}
function vaddr(o){var v=DB.vend.filter(function(x){return x.name===o.vendor})[0];return v?(v.addr||''):''}
function vcity(o){var v=DB.vend.filter(function(x){return x.name===o.vendor})[0];return v?v.city||'':''}
function tlink(o,k){var v=DB.vend.filter(function(x){return x.name===o.vendor})[0]||{},base=location.href.split(/[?#]/)[0];
  sec(o);if(k==='t')return base+'?t='+encq({dc:dcs(o),v:o.vendor,vc:vcity(o),cc:o.city||'',p:o.product,s:stage(o),w:DB.set.phone,c:o.courier||'',ve:vehOf(o.courier),db:DB.set.db||'',tid:tid(o)});
  return base+'?l='+encq({id:o.id,v:o.vendor,vp:v.phone||'',va:v.addr||'',vc:vcity(o),n:o.name,cp:o.phone,ca:o.address||'',cc:o.city||'',p:o.product,m:o.amount||0,w:DB.set.phone,s:stage(o),ve:vehOf(o.courier),db:DB.set.db||'',tid:tid(o)})}
var CL={},CLT=0;
function fmt(n){var m=Math.round(n);return m<60?m+' min':Math.floor(m/60)+' h '+(m%60?m%60+' min':'')}
function renderClient(){
  var d=decq('t');if(!d)return solo('<h1>Suivi de commande</h1><div class="card"><p class="mut">Lien invalide.</p></div>');
  if(d.db&&d.tid&&!CLT){var go=function(){fbg(d.db,d.tid,function(r){if(r){CL=r;renderClient()}})};CLT=setInterval(go,4000);go()}
  var m=Object.assign({},d,CL),bd=!!m.bad,s=Math.max(0,m.s||0),A=cfind(m.vc),B=cfind(m.cc),lv=inMA(m.pos)?m.pos:null,km=0,mins=0,pc=-1;
  if(A&&B){var ri=roadInfo(A,B),fr=lv?hav(lv,B)/Math.max(1,hav(A,B)):1;km=ri?ri.km*fr:hav(lv||A,B)*1.25;mins=ri?ri.min*fr*1.1:km/45*60;pc=lv?Math.round(100*Math.max(0,Math.min(1,1-hav(lv,B)/Math.max(1,hav(A,B))))):-1}
  var evs=Object.keys(m.ev||{}).map(function(k){return m.ev[k]}).sort(function(a,b){return b.t-a.t}),isLive=m.pt&&Date.now()-m.pt<45000;
  solo('<h1>Suivi de ta commande</h1><div class="card"><b>'+e(m.p)+'</b><div class="mut">Vendeur : '+e(m.v)+(m.c?' · Livreur : '+e(m.c):'')+'</div>'+(bd?'<p class="s-Annulé"><b>Livraison annulée ou refusée</b></p>':stepper(s)+'<p><b>'+STV[s]+'</b> '+(isLive?'<span class="live">● en direct</span>':'')+'</p>')+'</div>'
   +(s===2&&!bd&&km?'<div class="grid"><div class="kpi"><span class="mut">Distance restante</span><b>~'+Math.round(km)+' km</b></div><div class="kpi"><span class="mut">Arrivée estimée</span><b>~'+fmt(mins)+'</b></div></div>'+(pc>=0?'<div class="pbar"><i style="width:'+pc+'%"></i></div>':''):'')
   +mapView({ve:m.ve,vc:m.vc,cc:m.cc,s:bd?0:s,live:lv})
   +(evs.length?'<div class="card" style="margin-top:10px"><h2>Étapes</h2>'+evs.map(function(ev){var t=new Date(ev.t);return '<div class="row" style="padding:4px 0"><span>'+e(ev.x)+'</span><span class="mut">'+('0'+t.getHours()).slice(-2)+':'+('0'+t.getMinutes()).slice(-2)+'</span></div>'}).join('')+'</div>':'')
   +(m.w?'<a class="b pri" style="display:block;margin-top:10px" target="_blank" rel="noopener" href="'+wa(m.w,'Bonjour, une question sur ma commande « '+m.p+' ».')+'">'+ico('chat')+' Contacter le service</a>':'')
   +'<p class="mut">'+(d.db?'Cette page se met à jour toute seule.':'Cette page montre l’état au moment de l’envoi. Tu reçois un nouveau lien à chaque étape.')+' Distance et heure d’arrivée sont des estimations.</p>');
}
function renderCourier(){
  var d=decq('l');if(!d)return solo('<h1>Mission</h1><div class="card"><p class="mut">Lien invalide.</p></div>');
  var gm=function(q){return 'https://www.google.com/maps/dir/?api=1&destination='+encodeURIComponent(q)},msg=function(st){return wa(d.w,'SUIVI '+d.id+' '+st+'\n'+d.p+' · '+d.n)},lv=!!(d.db&&d.tid);
  var pos=CS.gps?'https://maps.google.com/?q='+CS.gps[0]+','+CS.gps[1]:'',cs=CS.s!=null?CS.s:d.s,B=cfind(d.cc),kmc=(inMA(CS.gps)&&B)?Math.round(hav(CS.gps,B)*1.25):0;
  var st=function(v,l,c){return lv?'<button class="b '+c+'" data-act="cst" data-v="'+v+'">'+l+'</button>':'<a class="b '+c+'" target="_blank" rel="noopener" href="'+msg(v)+'">'+l+'</a>'};
  solo('<h1>Ma mission</h1><div class="card"><b>'+e(d.p)+'</b>'+(d.m?'<div class="kpi" style="margin-top:8px"><span class="mut">À encaisser</span><b>'+fm(+d.m||0)+' dh</b></div>':'')+(CS.ok?'<p class="live">'+CS.ok+'</p>':'')+'</div>'
   +'<div class="card"><h2>1. Retrait chez le vendeur</h2><div>'+e(d.v)+'</div><div class="mut">'+e([d.va,d.vc].filter(Boolean).join(', '))+'</div><div class="btns">'+(d.vp?'<a class="b" href="tel:'+e(d.vp)+'">'+ico('phone')+' Appeler</a>':'')+'<a class="b" target="_blank" rel="noopener" href="'+gm([d.va,d.vc,'Maroc'].filter(Boolean).join(', '))+'">'+ico('pin')+' Itinéraire</a>'+st('En cours','Récupéré ✓','pri')+'</div></div>'
   +'<div class="card"><h2>2. Livraison au client</h2><div>'+e(d.n)+'</div><div class="mut">'+e([d.ca,d.cc].filter(Boolean).join(', '))+(kmc?' · ~'+kmc+' km':'')+'</div><div class="btns"><a class="b" href="tel:'+e(d.cp)+'">'+ico('phone')+' Appeler</a><a class="b" target="_blank" rel="noopener" href="'+gm([d.ca,d.cc,'Maroc'].filter(Boolean).join(', '))+'">'+ico('pin')+' Itinéraire</a></div><div class="btns">'+st('Livré','Livré ✓','ok')+st('Refusé','Refusé','ko')+'</div></div>'
   +mapView({ve:d.ve,vc:d.vc,cc:d.cc,s:cs===-1?0:(CS.gps&&cs<3?Math.max(2,cs):cs),gps:CS.gps,live:CS.gps,aq:d.va,bq:d.ca})
   +'<div class="card" style="margin-top:10px"><h2>Mon GPS</h2><p class="mut">'+e(CS.err||(CS.gps?(lv?'Position partagée en direct avec le client et le vendeur.'+(CS.acc?' Précision ±'+CS.acc+' m.':''):'Position active (point bleu sur la carte).'):'Active le GPS pour partager ta position. Garde l’écran allumé.'))+'</p><div class="btns"><button class="b pri" data-act="cgps">'+ico('pin')+' Activer mon GPS</button>'+(pos&&!lv?'<a class="b" target="_blank" rel="noopener" href="'+wa(d.cp,'Votre livreur est ici : '+pos)+'">Envoyer au client</a>':'')+'</div></div>');
}
function wnew(){return mb()+'<div class="card"><h2>Nouveau prospect</h2><label>Prénom</label><input id="w-pr"><label>Nom</label><input id="w-n"><label>Contact (téléphone)</label><input id="w-t" inputmode="tel"><label>Adresse</label><input id="w-a"><label>Commande</label><input id="w-c" placeholder="ex : 2 × T-shirt noir M"><label>Statut</label><select id="w-s">'+WST.map(function(x){return '<option>'+x+'</option>'}).join('')+'</select><button class="b pri" style="width:100%" data-act="wadd">Enregistrer</button></div>'}
function wlist(){
  var W=DB.set.wallet,q=(S.wq||'').toLowerCase(),f=S.wf||'',c=function(x){return W.filter(function(y){return y.st===x}).length};
  var l=W.filter(function(x){return (!f||x.st===f)&&(!q||(x.pr+' '+x.n+' '+x.t+' '+x.c+' '+x.a).toLowerCase().indexOf(q)>=0)}).slice().reverse();
  var h=mb()+'<div class="grid3">'+kp('Confirmés',c('Confirmé'),'okk')+kp('Annulés',c('Annulé'),'kok')+kp('Refusés',c('Refusé'),'kok')+'</div>';
  h+='<select id="wf" style="margin-top:10px"><option value="">Tous les statuts</option>'+WST.map(function(x){return '<option'+(f===x?' selected':'')+'>'+x+'</option>'}).join('')+'</select><input id="wq" placeholder="Rechercher un nom, un numéro…" value="'+e(S.wq||'')+'">';
  return h+(l.length?l.map(function(x){return '<div class="card"><div class="row"><b>'+e((x.pr+' '+x.n).trim())+'</b><span class="s-'+x.st+'">'+x.st+'</span></div><div class="mut">'+e(x.t)+(x.a?' · '+e(x.a):'')+'</div><div class="mut">'+e(x.c)+' · '+e(x.d)+'</div><div class="btns"><a class="b pri" href="tel:'+e(x.t)+'">'+ico('phone')+' Appeler</a><a class="b" target="_blank" rel="noopener" href="'+wa(x.t,'Bonjour '+x.pr+',')+'">'+ico('chat')+' WhatsApp</a></div><select data-wst="1" data-id="'+x.id+'">'+WST.map(function(y){return '<option'+(x.st===y?' selected':'')+'>'+y+'</option>'}).join('')+'</select><button class="b" data-act="wdel" data-id="'+x.id+'">'+(S.del===x.id?'Confirmer la suppression ?':'Supprimer')+'</button></div>'}).join(''):'<p class="mut">Aucun prospect enregistré. Ajoute-en depuis l’onglet « Nouveau prospect ».</p>');
}
var C={d:'0',a:null,op:null,fresh:true};
function cfmt(n){return isFinite(n)?String(parseFloat(n.toPrecision(10))):'Erreur'}
function cshow(){var d=C.d;if(d==='Erreur')return d;var ng=d[0]==='-',x=ng?d.slice(1):d,p=x.split('.');return (ng?'-':'')+p[0].replace(/\B(?=(\d{3})+(?!\d))/g,' ')+(p.length>1?','+p[1]:'')}
function ccalc(a,b,o){return o==='+'?a+b:o==='−'?a-b:o==='×'?a*b:(b===0?NaN:a/b)}
function cpress(k){
  if(C.d==='Erreur'&&k!=='AC')return;
  if(/^\d$/.test(k)){if(C.fresh){C.d=k;C.fresh=false}else if(C.d.replace(/\D/g,'').length<12)C.d=(C.d==='0'?k:(C.d==='-0'?'-'+k:C.d+k))}
  else if(k==='.'){if(C.fresh){C.d='0.';C.fresh=false}else if(C.d.indexOf('.')<0)C.d+='.'}
  else if(k==='AC'){C={d:'0',a:null,op:null,fresh:true}}
  else if(k==='±'){C.d=C.d[0]==='-'?C.d.slice(1):(C.d==='0'?'0':'-'+C.d)}
  else if(k==='%'){C.d=cfmt(parseFloat(C.d)/100);C.fresh=true}
  else if(k==='='){if(C.op!==null){C.d=cfmt(ccalc(C.a,parseFloat(C.d),C.op));C.op=null;C.a=null;C.fresh=true}}
  else{if(C.op!==null&&!C.fresh){C.a=ccalc(C.a,parseFloat(C.d),C.op);C.d=cfmt(C.a)}else C.a=parseFloat(C.d);C.op=k;C.fresh=true}
}
function calcv(){
  var K=[['AC','f'],['±','f'],['%','f'],['÷','o'],['7'],['8'],['9'],['×','o'],['4'],['5'],['6'],['−','o'],['1'],['2'],['3'],['+','o'],['0','z'],['.'],['=','o']],L=cshow().length,fs=L>12?34:(L>9?46:64);
  return '<div class="calc"><div class="cdisp" style="font-size:'+fs+'px">'+e(cshow())+'</div><div class="ckeys">'+K.map(function(k){return '<button class="k'+(k[1]?' '+k[1]:'')+(k[1]==='o'&&C.op===k[0]&&C.fresh?' act':'')+'" data-act="k" data-v="'+k[0]+'">'+k[0]+'</button>'}).join('')+'</div></div>';
}
function readPhoto(file,max,cb){var r=new FileReader();r.onload=function(){var im=new Image();im.onload=function(){var k=Math.min(1,max/Math.max(im.width,im.height)),c=document.createElement('canvas');c.width=Math.round(im.width*k);c.height=Math.round(im.height*k);c.getContext('2d').drawImage(im,0,0,c.width,c.height);cb(c.toDataURL('image/jpeg',0.72))};im.onerror=function(){cb('')};im.src=r.result};r.onerror=function(){cb('')};r.readAsDataURL(file)}
function avatar(x,z){return x.photo?'<img class="av" style="width:'+z+'px;height:'+z+'px" src="'+x.photo+'" alt="">':'<div class="av" style="width:'+z+'px;height:'+z+'px;font-size:'+Math.round(z*0.42)+'px">'+e((x.name||'?').charAt(0).toUpperCase())+'</div>'}
function vlinks(x){var l='';
  if(x.phone)l+='<a class="b pri" href="tel:'+e(x.phone)+'">'+ico('phone')+' Appeler</a><a class="b" target="_blank" rel="noopener" href="'+wa(x.phone,'Bonjour '+x.name+',')+'">'+ico('chat')+' WhatsApp</a>';
  if(x.insta)l+='<a class="b" target="_blank" rel="noopener" href="https://instagram.com/'+encodeURIComponent(x.insta.replace(/^@/,''))+'">'+ico('camera')+' Instagram</a>';
  if(x.tiktok)l+='<a class="b" target="_blank" rel="noopener" href="https://www.tiktok.com/@'+encodeURIComponent(x.tiktok.replace(/^@/,''))+'">'+ico('music')+' TikTok</a>';
  if(x.fb)l+='<a class="b" target="_blank" rel="noopener" href="'+ext(x.fb)+'">'+ico('globe')+' Facebook</a>';
  if(x.site)l+='<a class="b" target="_blank" rel="noopener" href="'+ext(x.site)+'">'+ico('link')+' Lien</a>';
  return l?'<div class="btns">'+l+'</div>':''}
var STK=['À valider','Validées','En cours de livraison','Livrées'];
function livlist(){return '<h2>Livreurs ('+DB.cour.length+')</h2>'+DB.cour.map(function(w){return '<div class="card"><div class="row"><b>'+e(w.name)+'</b><span class="mut">'+e(w.city)+'</span></div>'+vhsel(w)+'<div class="mut">'+e(w.prod||'')+(w.price?' · tarif '+w.price+' dh':'')+'</div><div class="btns"><a class="b" target="_blank" rel="noopener" href="'+wa(w.phone,'Bonjour '+w.name+',')+'">'+ico('chat','s')+' Écrire</a><button class="b" data-act="ndel" data-id="'+w.id+'">'+(S.del===w.id?'Confirmer la suppression ?':'Supprimer')+'</button></div></div>'}).join('')}

function solo(html){document.querySelector('header').style.display='none';$('nav').style.display='none';document.body.style.paddingBottom='20px';$('app').innerHTML=html;lmFlush()}
function courFilter(){return DB.cour.length?'<select id="tf"><option value="">Tous les livreurs</option>'+DB.cour.map(function(x){return '<option'+(S.tf===x.name?' selected':'')+'>'+e(x.name)+'</option>'}).join('')+'</select>':''}
function delv(){
  var V_=vis(),cnt=[0,0,0,0];
  V_.forEach(function(o){if(!bad(o)){var s=stage(o);cnt[s===0?0:s]++}});
  var all=V_.filter(function(o){return o.status==='Confirmé'}).slice().reverse();
  if(S.tf)all=all.filter(function(o){return o.courier===S.tf});
  var act=all.filter(function(o){return o.delivery!=='Livré'&&o.delivery!=='Refusé'}),done=all.filter(function(o){return o.delivery==='Livré'||o.delivery==='Refusé'}).slice(0,15);
  var N=S.notif&&byId(S.notif);
  var h=mb()+(N?nbar(N,true):'')+vsel()+courFilter()+'<div class="g4">'+STK.map(function(n,i){return '<div class="kpi"><span class="mut">'+n+'</span><b>'+cnt[i]+'</b></div>'}).join('')+'</div>';
  var TT=S.trk&&byId(S.trk);
  if(TT)h+='<div class="card"><div class="row"><h2 style="margin:0">'+e(TT.name)+'</h2>'+flatBtn()+'</div>'+((cfind(vcity(TT))&&cfind(TT.city))?'':'<p class="mut">Renseigne la ville du vendeur (fiche vendeur) et la ville du client pour voir le trajet.</p>')+mapView({ve:vehOf(TT.courier),vc:vcity(TT),cc:TT.city,s:stage(TT),live:TT.pos,aq:vaddr(TT),bq:TT.address})+(TT.pt&&Date.now()-TT.pt<45000?'<div class="live">● Position du livreur en direct</div>':'')+stepper(stage(TT))+'</div>';
  else{var am=V_.filter(function(o){return !bad(o)&&stage(o)===2&&cfind(vcity(o))&&cfind(o.city)});h+='<div class="card"><div class="row"><h2 style="margin:0">Carte nationale</h2>'+flatBtn()+'</div><p class="mut">'+am.length+' livraison(s) en cours.</p>'+mapView({list:am.map(function(o){return {ve:vehOf(o.courier),vc:vcity(o),cc:o.city,s:2,live:o.pos}})})+'</div>'}
  var card=function(o){
    var s=stage(o),c=DB.cour.filter(function(x){return x.name===o.courier})[0],csel=DB.cour.length?'<select data-cr="1" data-id="'+o.id+'"><option value="">Livreur : —</option>'+DB.cour.map(function(x){return '<option'+(o.courier===x.name?' selected':'')+'>'+e(x.name)+'</option>'}).join('')+'</select>':'';
    var mis='Mission de livraison : '+o.product+' pour '+o.name+'. Ouvre ce lien : '+tlink(o,'l')+'\n\nOu réponds par : SUIVI '+o.id+' Livré   /   SUIVI '+o.id+' Refusé';
    var CL='<a class="b sm" data-act="pubo" data-id="'+o.id+'" target="_blank" rel="noopener" href="'+wa(o.phone,'Bonjour '+o.name+', suis ta commande « '+o.product+' » en direct : '+tlink(o,'t'))+'">'+ico('chat','s')+' Client</a>',LV='<a class="b sm" data-act="pubo" data-id="'+o.id+'" target="_blank" rel="noopener" href="'+wa(c?c.phone:'',mis)+'">'+ico('chat','s')+' Livreur</a>';
    return '<div class="card"><div class="row"><b>'+e(o.name)+'</b><span class="tag">'+STV[s]+'</span></div><div class="mut">'+e(o.product)+' · '+e(o.vendor)+(vcity(o)?' ('+e(vcity(o))+')':'')+' → '+e(o.city||'ville ?')+(o.amount?' · '+fm(o.amount)+' dh':'')+'</div>'+(o.rd===1&&stage(o)<3?'<div class="alert">Livraison signalée à distance : vérifie avec le livreur, puis valide. <button class="b ok sm" data-act="rdok" data-id="'+o.id+'">Valider</button> <button class="b sm" data-act="rdno" data-id="'+o.id+'">Ignorer</button></div>':'')+stepper(s)
     +'<div class="btns">'+(s===1?'<button class="b pri" data-act="adv" data-id="'+o.id+'">'+T('Remis au livreur')+'</button><button class="b ko" data-act="cx2" data-id="'+o.id+'">'+T('Annulé')+'</button>':'<button class="b ok" data-act="adv" data-id="'+o.id+'">'+T('Livré')+'</button><button class="b ko" data-act="rf" data-id="'+o.id+'">'+T('Refusé')+'</button>')+'</div>'+csel
     +'<div class="btns"><a class="b sm" href="'+telh(o.phone)+'">'+ico('phone','s')+' Appeler</a>'+CL+(s===1?LV:'')+'</div>'+'<details class="oc2" data-om="'+o.id+'"'+(OM[o.id]?' open':'')+'><summary>Plus d’actions</summary><div class="btns">'+(s===1?'':LV)+'<button class="b sm" data-act="qrs" data-k="t" data-id="'+o.id+'">QR suivi</button><button class="b sm" data-act="qrs" data-k="l" data-id="'+o.id+'">QR colis</button><button class="b sm" data-act="tagp" data-t="or" data-id="'+o.id+'">Tag NFC</button><button class="b sm" data-act="trk" data-id="'+o.id+'">'+ico('pin','s')+' Carte</button></div>'+nbar(o)+'</details></div>'};
  h+=act.length?act.map(card).join(''):'<p class="mut">Aucune livraison en cours.</p>';
  h+='<details class="oc2" data-om="st"'+(OM.st?' open':'')+'><summary>Coller un statut reçu du livreur</summary><p class="mut">Le livreur t’envoie un message WhatsApp en un appui. Colle-le ici pour mettre la commande à jour.</p><textarea id="f-st" placeholder="SUIVI abc123 Livré"></textarea><button class="b pri full" data-act="applyst">Appliquer</button></details>';
  if(done.length)h+='<h2>Terminées récemment</h2>'+done.map(function(o){return '<div class="card"><div class="row"><b>'+e(o.name)+'</b><span class="s-'+(o.delivery==='Livré'?'Confirmé':'Refusé')+'">'+e(o.delivery)+'</span></div><div class="mut">'+e(o.product)+' · '+e(o.vendor)+'</div></div>'}).join('');
  return h+'<p class="mut">Suivi en temps réel entre appareils : Compte → Connexions.</p>';
}
function prov(){
  var O_=DB.orders,s=stats(O_),sum=function(f){return O_.filter(f).reduce(function(a,o){return a+(o.amount||0)},0)};
  var enc_=sum(function(o){return o.status==='Confirmé'&&o.delivery==='Livré'}),lost=sum(function(o){return o.delivery==='Refusé'}),cours=sum(function(o){return o.status==='Confirmé'&&(!o.delivery||o.delivery==='En cours')});
  var rv=DB.vend.map(function(v){var vo=O_.filter(function(o){return o.vendor===v.name}),en=vo.filter(function(o){return o.status==='Confirmé'&&o.delivery==='Livré'}).reduce(function(a,o){return a+(o.amount||0)},0),c=vo.reduce(function(a,o){return a+earned(o)},0);return '<tr><td>'+e(v.name)+'</td><td class="n">'+fm(en)+'</td><td class="n">'+fm(c)+'</td><td class="n"><b>'+fm(en-c)+' dh</b></td></tr>'}).join('');
  var pitch='Bonjour, je propose aux sociétés de livraison un service de confirmation des commandes avant expédition : moins de refus, moins de retours, un suivi clair par vendeur, par ville et par réseau social (Instagram, TikTok, Facebook, WhatsApp). Sur mon portefeuille actuel : '+s.n+' commandes, '+pct(s.liv,s.liv+s.ref)+' de livraison réussie. Je peux vous envoyer un rapport Excel complet.';
  return mb()+'<div class="grid">'+kp('Encaissé (livré)',fm(enc_)+' dh','okk')+kp('Perdu (refusé)',fm(lost)+' dh','kok')+kp('En cours de livraison',fm(cours)+' dh')+kp('Taux de livraison',pct(s.liv,s.liv+s.ref))+'</div>'
   +'<div class="card"><h2>Reversements aux vendeurs</h2><div class="wrap"><table><tr><th>Vendeur</th><th class="n">Encaissé</th><th class="n">Commission</th><th class="n">À reverser</th></tr>'+rv+'</table></div></div>'
   +'<div class="card"><h2>Proposition aux sociétés de livraison</h2><p class="mut">'+e(pitch)+'</p><div class="btns"><a class="b pri" target="_blank" rel="noopener" href="'+wa('',pitch)+'">'+ico('chat','s')+' Envoyer</a><button class="b" data-act="xls">'+ico('dl','s')+' Rapport Excel</button></div></div>';
}
function margev(){
  var m=DB.set.sim,mg=(m.pv-m.pa)*m.q;
  var inp=function(k,l){return '<label>'+l+'</label><input type="number" min="0" data-sim="'+k+'" value="'+m[k]+'">'};
  return '<div class="card"><h2>Simulateur de marge d’intermédiaire</h2>'+inp('pa','Prix d’achat unitaire (dh)')+inp('pv','Prix de vente unitaire (dh)')+inp('q','Quantité')+'<div class="kpi"><span class="mut">Marge estimée</span><b>'+fm(mg)+' dh</b></div><p class="mut">Estimation indicative : elle ne garantit aucun revenu.</p></div>';
}
function simv(){
  var m=DB.set.sim,cf=DB.set.cf,bn=DB.set.bn,conf=m.cpw*m.tc/100,liv=conf*m.td/100,wk=conf*cf+liv*bn,mo=wk*52/12,ins=0,mg=(m.pv-m.pa)*m.q;
  var inp=function(k,l){return '<label>'+l+'</label><input type="number" min="0" data-sim="'+k+'" value="'+m[k]+'">'};
  return '<div class="card"><h2>Prévision de revenus</h2>'+inp('cpw','Commandes par semaine (tous vendeurs)')+inp('tc','Taux de confirmation (%)')+inp('td','Taux de livraison (%)')+'<p class="mut">Tarif : '+cf+' dh par confirmation + '+bn+' dh par livraison'+(DB.set.rc?' · Un colis refusé coûte '+DB.set.rc+' dh au vendeur.':'')+'</p></div>'
   +'<div class="grid">'+kp('Commandes confirmées / semaine',fm(conf))+kp('Commandes livrées / semaine',fm(liv))+kp('Commissions / semaine',fm(wk)+' dh')+kp('Commissions / mois',fm(mo)+' dh')+'</div>'
   +'<div class="kpi" style="margin-top:8px"><span class="mut">Total estimé par mois</span><b>'+fm(mo)+' dh</b></div>'

   +'<p class="mut">Estimation indicative : elle ne garantit aucun revenu.</p>';
}
function morev(){
  var G=[
   ['Pilotage de l’activité',[['vend','Vendeurs partenaires','store','Boutiques, commissions, relevés'],['fin','Finances & soldes','chart','Résultats, soldes, rapport hebdo'],['auto','Automatisations','sliders','Rappels, suivi, relances']]],
   ['Développement commercial',[['cat','Catalogue produits','bag','Produits des vendeurs'],['net','Réseau professionnel','net','Grossistes, acheteurs, livreurs'],['deals','Affaires & marges','chart','Intermédiation, simulateur de marge'],['sim','Prévisions de revenus','chart','Projection des commissions'],['pro','Partenariat livraison','truck','Reversements, proposition commerciale']]],
   ['Outils terrain',[['tools','Codes QR & étiquettes NFC','box','Partager, scanner, associer'],['calc','Calculatrice','calc','Calculs rapides']]],
   ['Prospection',[['wl','Carnet de prospects','wallet','Appels sortants et suivi']]],
   ['Profil & paramètres',[['set','Mon profil','user','Photo, carte, coordonnées','p'],['set','Tarifs & messages','sliders','Commissions, messages types','a'],['set','Sécurité & données','box','Code, biométrie, sauvegarde','s'],['set','Connexions','link','Suivi en direct, import, cloud','c']]]];
  return mb()+G.map(function(g){return '<div class="sec">'+g[0]+'</div><div class="pg">'+g[1].map(function(i){return '<div class="card tile" data-act="tab" data-v="'+i[0]+'"'+(i[4]?' data-sp="'+i[4]+'"':'')+'><div class="ti">'+ico(i[2])+'</div><b>'+i[1]+'</b><div class="mut">'+i[3]+'</div></div>'}).join('')+'</div>'}).join('');
}
function toolv(){return mb()+'<div class="sec">QR code &amp; NFC</div>'+qacc()}
function setLive(){
  var s=DB.set;
  return '<div class="card"><h2>Suivi des colis en temps réel</h2><label>Adresse de la base Firebase (Realtime Database)</label><input data-set="db" value="'+e(s.db||'')+'" placeholder="https://ton-projet-default-rtdb.europe-west1.firebasedatabase.app"><p class="mut">'+(s.db?'Suivi en direct activé : le client, le livreur et toi voient les mêmes étapes en temps réel.':'Sans cette adresse, le suivi marche par liens et messages.')+' Colle les règles du fichier database.rules.json dans Firebase (Règles) : elles empêchent de lister ou d’écraser les suivis des autres.</p>'+(s.db?'<button class="b" data-act="dbtest">Tester la connexion</button><p class="mut">'+e(S.dbt||'')+'</p>':'')+'</div>';
}
function setMap(){
  var s=DB.set;
  return '<div class="card"><h2>Fond de carte personnalisé</h2><label>Adresse des tuiles (modèle)</label><input data-set="tiles" value="'+e(s.tiles||'')+'" placeholder="https://…/{z}/{x}/{y}.png"><label>Clé CARTO gratuite (style Voyager)</label><input data-set="ckey" value="'+e(s.ckey||'')+'" placeholder="carto.com/basemaps/apikey"><p class="mut">Facultatif. Par défaut : carte OpenStreetMap, sans clé. Pour un usage commercial, mets ton fournisseur (MapTiler, Stadia, Mapbox…). Recharge l’application après un changement.</p></div>';
}
function csvText(){return sheetsData()[1].rows.map(function(r){return r.map(function(v){return '"'+String(v==null?'':v).replace(/"/g,'""')+'"'}).join(';')}).join('\n')}
function xact(a,t,id,o,g){
  var h=1;
  if(0){}
  else if(a==='sp'){var spv=t.getAttribute('data-v');S.sp='pasc'.indexOf(spv)>=0?spv:'p'}
  else if(a==='mphdel'){DB.set.pphoto='';S.msg='Photo retirée.'}
  else if(a==='psave'){var PM={'pf-n':'holder','pf-t':'pt','pf-co':'pco','pf-p':'phone','pf-e':'pe','pf-c':'pc','pf-i':'insta','pf-r':'rib'},bad=0;Object.keys(PM).forEach(function(i){var el=g(i);if(!el)return;var v=el.value.trim();if(i==='pf-e'&&v&&!/^\S+@\S+\.\S+$/.test(v)){bad=1;return}DB.set[PM[i]]=v});if(bad){mk('E-mail invalide : le reste a été enregistré.',1);save();render();return 2}S.msg='Profil enregistré ✓'}
  else if(a==='vcf'){if(!(DB.set.holder||'').trim()){mk('Renseigne d’abord ton nom.',1)}else{dl(new Blob([vcard()],{type:'text/vcard'}),(DB.set.holder.trim().replace(/[^\w\-]+/g,'_')||'contact')+'.vcf');S.msg='Fiche contact téléchargée : ouvre-la pour l’ajouter à tes contacts.'}}
  else if(a==='pshare'){var ps=DB.set,pn=(ps.holder||'').trim();if(!pn){mk('Renseigne d’abord ton nom.',1);render();return 2}var ptx=[pn,[ps.pt,ps.pco].filter(Boolean).join(' · '),ps.phone?'Tél / WhatsApp : '+ps.phone:'',ps.pe?'E-mail : '+ps.pe:'',ps.pc?ps.pc:'',ps.insta?'Instagram : '+instaUrl(ps.insta):''].filter(Boolean).join('\n');
    if(navigator.share){var pf=null;try{pf=new File([vcard()],'contact.vcf',{type:'text/vcard'})}catch(x){}var pd={title:pn,text:ptx};if(pf&&navigator.canShare&&navigator.canShare({files:[pf]}))pd.files=[pf];navigator.share(pd).catch(function(){})}
    else if(navigator.clipboard&&navigator.clipboard.writeText){navigator.clipboard.writeText(ptx).then(function(){toast('Carte copiée.')},function(){toast('Copie impossible.')})}else toast('Partage indisponible sur cet appareil.');return 2}
  else if(a==='demoon'){if(DB.orders.some(function(x){return x.demo})){S.msg='Les données de démo sont déjà chargées.';return 1}
    var dv=[{id:uid(),name:'Boutique Atlas (démo)',phone:'0600000001',city:'Casablanca',insta:'',tiktok:'',fb:'',cat:'Mode',notes:'',ver:false,fees:null,reg:0,arts:[],demo:1},{id:uid(),name:'Maroc Gadgets (démo)',phone:'0600000002',city:'Rabat',insta:'',tiktok:'',fb:'',cat:'High-tech',notes:'',ver:false,fees:null,reg:0,arts:[],demo:1}];
    dv.forEach(function(v){DB.vend.push(v)});
    DB.cour.push({id:uid(),name:'Karim livreur (démo)',phone:'0600000003',city:'Casablanca',price:25,prod:'',demo:1});
    var P=[['Sara Alaoui','Robe d’été','Casablanca','En attente',0,299],['Youssef Bennani','Écouteurs sans fil','Rabat','En attente',0,199],['Imane Tazi','Montre connectée','Casablanca','Confirmé',0,350],['Omar El Fassi','Sac à main','Marrakech','Confirmé',1,420],['Nadia Cherkaoui','Coque téléphone','Fès','Confirmé',1,79],['Hamza Idrissi','Chargeur rapide','Tanger','Annulé',0,120],['Salma Berrada','Parfum 50 ml','Casablanca','Confirmé',0,260],['Reda Lahlou','Casque gamer','Rabat','En attente',0,380]];
    P.forEach(function(p,i){DB.orders.push({id:uid(),date:today(),ts:Date.now()-i*3600000,vendor:dv[i%2].name,name:p[0]+' (démo)',phone:'060000'+(1000+i),product:p[1],address:'Adresse de démonstration '+(i+1),city:p[2],channel:'Instagram',amount:p[5],upsell:0,status:p[3],attempts:0,delivery:'',courier:p[4]?'Karim livreur (démo)':'',note:'',reason:p[3]==='Annulé'?'Client injoignable':'',cb:0,demo:1})});
    S.msg='Données de démonstration chargées (8 commandes, 2 vendeurs, 1 livreur).';return 1}
  else if(a==='demooff'){DB.orders=DB.orders.filter(function(x){return !x.demo});DB.vend=DB.vend.filter(function(x){return !x.demo});DB.cour=DB.cour.filter(function(x){return !x.demo});S.msg='Données de démonstration supprimées. Vos vraies données sont intactes.';return 1}
  else if(a==='pubo'){if(o&&DB.set.db)pub(o);return 2;}
  else if(a==='mz'){var zv=t.getAttribute('data-v');if(zv==='+')S.mz=Math.min(4,(S.mz||1)*1.6);else if(zv==='-')S.mz=Math.max(.5,(S.mz||1)*.6);else{S.full=!S.full;S.mz=1}rr();return 2;}
  else if(a==='cst'){var cd=decq('l');if(cd&&cd.db){var cv2=t.getAttribute('data-v'),nw=Date.now(),bb={t:nw};if(cv2==='En cours'){bb.s=2;CS.s=2;bb['ev/e'+nw]={t:nw,x:'Colis récupéré, le livreur est en route'}}else if(cv2==='Livré'){return 2}else{bb.bad=1;bb.r='Refusé';CS.s=-1;bb['ev/e'+nw]={t:nw,x:'Livraison refusée par le client'}}fbp(cd.db,cd.tid,bb);CS.ok='Statut envoyé ✓';renderCourier();return 2;}}
  else if(a==='dbtest'){var du=DB.set.db;if(!du){S.dbt='Aucune adresse enregistrée.';}else{S.dbt='Test en cours…';var dk='test'+uid()+uid()+uid();fetch(dbu(du,dk),{method:'PUT',headers:{'Content-Type':'application/json'},body:JSON.stringify({t:Date.now()})}).then(function(r){if(!r.ok){S.dbt='Refusé (code '+r.status+'). Vérifie les règles Firebase (guide, section 13) et l’adresse.';return}return fetch(dbu(du,dk)).then(function(x){return x.json()}).then(function(j){S.dbt=(j&&j.t)?'✓ Connexion réussie : le suivi en direct est prêt.':'Réponse inattendue : vérifie l’adresse.';fetch(dbu(du,dk),{method:'DELETE'}).catch(function(){})})}).catch(function(){S.dbt='Impossible de joindre Firebase : vérifie l’adresse et ta connexion.'}).then(function(){render()})}}
  else if(a==='lfit'){LM.key='';LM.fitN++;rr();return 2;}
  else if(a==='lmaroc'){if(LM.map)LM.map.setView([31.8,-7.1],5);return 2;}
  else if(a==='nclose'){S.notif='';}
  else if(a==='trk'){S.trk=S.trk===id?'':id;}
  else if(a==='flat'){S.flat=!S.flat;}
  else if(a==='cgps'){CS.t=0;if(!navigator.geolocation){CS.err='GPS indisponible sur cet appareil.';renderCourier();return 2;}if(CS.w==null)CS.w=navigator.geolocation.watchPosition(function(p){CS.gps=[p.coords.latitude,p.coords.longitude];CS.acc=Math.round(p.coords.accuracy||0);CS.err='';var dd=decq('l');if(dd&&dd.db&&Date.now()-(CS.pp||0)>5000){CS.pp=Date.now();fbp(dd.db,dd.tid,{pos:CS.gps,pt:Date.now()})}if(Date.now()-CS.t>6000){CS.t=Date.now();renderCourier()}},function(){CS.err='GPS refusé : autorise la localisation dans ton navigateur.';renderCourier()},{enableHighAccuracy:true,maximumAge:3000});CS.err='Recherche de ta position…';renderCourier();return 2;}
  else if(a==='pform'){S.pform=!S.pform;S.msg='';}
  else if(a==='pnew'){S.tab='cat';S.pform=true;S.pv=id;S.pview='';S.msg='';}
  else if(a==='pview'){S.pview=id;S.pi=0;S.del='';}
  else if(a==='pback'){S.pview='';S.del='';}
  else if(a==='pimg'){S.pi=parseInt(t.getAttribute('data-v'))||0;}
  else if(a==='pcat'){var cv=t.getAttribute('data-v');S.pc=S.pc===cv?'':cv;}
  else if(a==='pdel'&&DB.vend.some(function(v){return (v.arts||[]).some(function(z){return z.id===id})})){var hit=null;DB.vend.forEach(function(v){(v.arts||[]).forEach(function(z){if(z.id===id)hit=v})});if(hit){if(S.del===id){hit.arts=hit.arts.filter(function(z){return z.id!==id});S.del='';S.pview='';}else{S.del=id;}}}
  else if(a==='padd'&&g('p-v')){var pv=vid(g('p-v').value),pnm=g('p-n').value.trim();if(!pv){S.msg='Choisis un vendeur (crée-le d’abord dans Vendeurs).';}else if(!pnm){S.msg='Il faut le nom du produit.';}else{var art={id:uid(),name:pnm,price:parseFloat(g('p-p').value)||0,old:parseFloat(g('p-o').value)||0,cat:g('p-c').value.trim(),desc:g('p-d').value.trim(),img:'',imgs:[]},fs=Array.prototype.slice.call(g('p-f').files,0,4);pv.arts=pv.arts||[];var fin=function(){art.img=art.imgs[0]||'';pv.arts.push(art);S.msg='Produit ajouté au catalogue.';S.pform=false;save();render()};if(!fs.length){fin();return 2;}var left=fs.length;fs.forEach(function(f){readPhoto(f,640,function(d){if(d)art.imgs.push(d);if(--left===0)fin()})});return 2;}}
  else if(a==='k'){cpress(t.getAttribute('data-v'));render();return 2;}
  else if(a==='wadd'){var wn=g('w-n').value.trim(),wp=g('w-pr').value.trim(),wt=g('w-t').value.trim();if(!(wn||wp)||!wt){S.msg='Il faut un nom et un contact.';}else{DB.set.wallet.push({id:uid(),d:new Date().toISOString().slice(0,10),pr:wp,n:wn,t:wt,a:g('w-a').value.trim(),c:g('w-c').value.trim(),st:g('w-s').value});S.msg='Prospect enregistré.';ST.wl=0;}}
  else if(a==='wdel'){if(S.del===id){DB.set.wallet=DB.set.wallet.filter(function(x){return x.id!==id});S.del='';}else{S.del=id;}}
  else if(a==='vphdel'){var vq=vid(S.vsel);if(vq)vq.photo='';}
  else if(a==='adel'){var vr=vid(S.vsel);if(vr){if(S.del===id){vr.arts=vr.arts.filter(function(x){return x.id!==id});S.del='';}else{S.del=id;}}}
  else if(a==='vart'){var vx2=vid(S.vsel),nm=g('a-n').value.trim();if(!vx2){}else if(!nm){S.msg='Il faut le nom de l’article.';}else{var fl=g('a-f').files[0],art={id:uid(),name:nm,price:parseFloat(g('a-p').value)||0,desc:g('a-d').value.trim(),img:''};vx2.arts=vx2.arts||[];if(fl){readPhoto(fl,640,function(d){art.img=d;vx2.arts.push(art);S.msg='Article ajouté.';save();render()});return 2;}vx2.arts.push(art);S.msg='Article ajouté.';}}
  else if(a==='nmatch'){S.match=S.match===id?'':id;}
  else if(a==='deal'){var bu=nget(t.getAttribute('data-b')),wh=nget(t.getAttribute('data-w'));if(bu&&wh){DB.set.deals.push({id:Date.now().toString(36)+Math.random().toString(36).slice(2,5),buyer:bu.name,seller:wh.name,prod:bu.prod,qty:bu.qty,buy:wh.price,sell:bu.price,status:'En discussion'});S.msg='Affaire créée.';}}
  else if(a==='ndel'){if(S.del===id){DB.set.net=DB.set.net.filter(function(x){return x.id!==id});DB.cour=DB.cour.filter(function(x){return x.id!==id});S.del='';}else{S.del=id;}}
  else if(a==='ddel'){if(S.del===id){DB.set.deals=DB.set.deals.filter(function(x){return x.id!==id});S.del='';}else{S.del=id;}}
  else if(a==='nadd'){var nf=function(i){return g(i).value.trim()};if(!nf('n-n')){S.msg='Il faut au moins un nom.';}else if(g('n-t').value==='Livreur'){DB.cour.push({id:uid(),name:nf('n-n'),phone:nf('n-p'),prod:nf('n-pr'),price:parseFloat(nf('n-x'))||0,city:nf('n-c')});S.msg='Livreur ajouté.';ST.net=0;}else{DB.set.net.push({id:uid(),type:g('n-t').value,name:nf('n-n'),phone:nf('n-p'),prod:nf('n-pr'),qty:parseFloat(nf('n-q'))||0,price:parseFloat(nf('n-x'))||0,city:nf('n-c')});S.msg='Contact ajouté.';ST.net=0;}}
  else h=0;
  return h}

/* ---------- affichage ---------- */
function renderBuyer(){
  document.getElementById('nav').style.display='none';document.querySelector('header').style.display='none';
  $('app').innerHTML='<h1>Commander chez '+e(Q.get('v'))+'</h1>'+(S.msg?'<div class="msg err">'+e(S.msg)+'</div>':'')+'<div class="card"><label>Produit</label><input id="b-pr" value="'+e(Q.get('p')||'')+'"><label>Quantité</label><input id="b-q" type="number" min="1" value="1"><label>Ton nom</label><input id="b-n" autocomplete="name"><label>Ton téléphone</label><input id="b-p" inputmode="tel" autocomplete="tel"><label>Adresse et ville</label><input id="b-a"><button class="b pri full" data-act="bsend">Envoyer ma commande sur WhatsApp</button><p class="mut">Tu seras rappelé pour confirmer. Tes informations servent uniquement à traiter ta commande.</p></div>';
}
function lockv(){
  var f=fails(),w=Math.max(0,Math.ceil((f.u-Date.now())/1000));
  $('app').innerHTML='<div class="lock"><h1 style="text-align:center">Application verrouillée</h1><div class="card"><label>Code</label><input type="password" id="pin" autocomplete="current-password"><button class="b pri full" data-act="unlock">Déverrouiller</button>'+(S.msg?'<p class="mut">'+e(S.msg)+'</p>':'')+(w?'<p class="mut">Trop d’essais. Réessaie dans '+w+' s.</p>':'')+'<button class="b full" style="margin-top:12px" data-act="wipe">'+(S.del==='wipe'?'Confirmer : tout effacer ?':'Code oublié : effacer les données')+'</button></div></div>';
}
function render(){
  if(Q.get('v')&&!DB&&!S.locked)return renderBuyer();
  document.documentElement.dir=(DB&&DB.set.lang==='ar')?'rtl':'ltr';
  if(S.locked||!DB){$('nav').innerHTML='';$('hs').innerHTML='';lockv();return}
  $('ver').textContent='v'+VER;$('hs').innerHTML=hdrAv();$('hs').setAttribute('aria-label','Mon profil');$('hl').textContent=DB.set.lang==='ar'?'AR':'FR';
  var MORE=['more','pod','wa','rap','auto','vend','fin','tools','cat','net','deals','wl','wn','calc','sim','pro','set'];
  var pe=DB.orders.filter(function(o){return o.status==='En attente'&&callDue(o)}).length;
  var M=[['home','Accueil','home'],['calls','Confirmer','phone'],['ord','Commandes','box'],['del','Livraison','truck'],['more','Compte','gear']];
  $('nav').innerHTML=M.map(function(m){var on=S.tab===m[0]||(m[0]==='more'&&MORE.indexOf(S.tab)>=0);return '<button data-act="tab" data-v="'+m[0]+'" class="'+(on?'on':'')+'">'+ico(m[2])+T(m[1])+(m[0]==='calls'&&pe?'<span class="bd">'+pe+'</span>':'')+'</button>'}).join('');
  var V={home:home,calls:calls,ord:ordv,del:delv,vend:vendv,fin:finv,set:setv,more:morev,tools:toolv,cat:catv,net:net,deals:dealsv,wl:wlist,wn:wnew,calc:calcv,sim:simv,pro:prov}[S.tab]||home;
  var back=(MORE.indexOf(S.tab)>0)?'<button class="b full sm" data-act="tab" data-v="more" style="margin-bottom:10px">← Compte</button>':'';
  $('app').innerHTML=back+V();
  S.msg='';S.err=false;
  lmFlush();
}
/* ---------- actions ---------- */
function g(i){return $(i)}
function readJson(file,cb){var r=new FileReader();r.onload=function(){cb(String(r.result))};r.readAsText(file)}
document.addEventListener('click',function(ev){
  var t=ev.target.closest('[data-act]');if(!t)return;
  var a=t.getAttribute('data-act'),id=t.getAttribute('data-id'),o=id?byId(id):null,keep=false;
  if(a==='unlock'){doUnlock();return}
  var xr=xact(a,t,id,o,$);if(xr){if(xr===1){save();render()}return}
  if(a==='wipe'){if(S.del==='wipe'){try{localStorage.removeItem(KEY);localStorage.removeItem('cod_f')}catch(x){}DB=fix({v:4,orders:[],vend:[],pay:[],cour:[],bl:[],set:{}});K=null;S.locked=false;S.del='';S.tab='home';save();mk('Données effacées.')}else{S.del='wipe';render();return}render();return}
  if(a==='bsend'){var bn=g('b-n').value.trim(),bp=g('b-p').value.trim(),bq=g('b-pr').value.trim();if(!bn||!mph(bp)||!bq){S.msg='Merci de remplir le produit, ton nom et un téléphone marocain valide (06… ou 07…).';renderBuyer();return}location.href=wa(Q.get('w'),'🛒 NOUVELLE COMMANDE\nVendeur: '+Q.get('v')+'\nProduit: '+bq+'\nQuantité: '+(g('b-q').value||1)+'\nNom: '+bn+'\nTéléphone: '+bp+'\nAdresse: '+g('b-a').value.trim());return}
  if(!DB)return;
  if(a==='tab'){if(t.id==='hs')S.sp='p';else if(t.getAttribute('data-sp'))S.sp=t.getAttribute('data-sp');S.pview='';S.pform=false;S.tab=t.getAttribute('data-v');S.del='';S.vsel='';S.inv='';S.vform=false;S.edit='';S.cx='';keep=true}
  else if(a==='goto'){S.tab=t.getAttribute('data-v');if(t.getAttribute('data-s'))S.sub=t.getAttribute('data-s')}
  else if(a==='sub'){S.sub=t.getAttribute('data-v')}
  else if(a==='lang'){DB.set.lang=DB.set.lang==='ar'?'fr':'ar'}
  else if(a==='conf'&&o){setStatus(o,'Confirmé');S.edit='';mk('Confirmée'+(o.tr?' (essai gratuit)':' · '+fm(earned(o))+' dh de commission')+'.')}
  else if(a==='cxopen'){S.cx=S.cx===id?'':id}
  else if(a==='cxdo'&&o){setStatus(o,'Annulé');o.reason=t.getAttribute('data-v');S.cx='';mk('Commande annulée.')}
  else if(a==='try'&&o){o.attempts++;if(o.attempts>=3){setStatus(o,'Injoignable');mk('3 tentatives : marquée injoignable.')}else{o.cb=Date.now()+(+t.getAttribute('data-h'))*3600000;if(t.getAttribute('data-h')==='24'){var d=new Date(Date.now()+864e5);d.setHours(10,0,0,0);o.cb=d.getTime()}mk('Rappel programmé.')}}
  else if(a==='now'&&o){o.cb=0}
  else if(a==='edit'){S.edit=S.edit===id?'':id}
  else if(a==='esave'&&o){o.address=g('e-a').value.trim();o.city=g('e-c').value.trim();o.amount=parseFloat(g('e-m').value)||0;o.upsell=parseFloat(g('e-u').value)||0;o.note=g('e-n').value.trim();o.email=g('e-e').value.trim();S.edit='';mk('Enregistré.')}
  else if(a==='blk'&&o){var i=DB.bl.indexOf(o.phone);if(i>=0)DB.bl.splice(i,1);else DB.bl.push(o.phone);mk(i>=0?'Retiré de la liste noire.':'Ajouté à la liste noire.')}
  else if(a==='add'){var r=addOrder(g('f-v').value.trim(),g('f-n').value.trim(),g('f-p').value.trim(),g('f-pr').value.trim(),g('f-a').value.trim(),{amount:parseFloat(g('f-m').value)||0,city:g('f-c').value.trim(),email:g('f-e').value.trim(),channel:g('f-ch').value},g('f-force').checked);
    S.lastV=g('f-v').value.trim();if(r==='ok')mk('Commande ajoutée.');else mk(r==='ph'?'Numéro invalide : utilise un numéro marocain (06… ou 07…).':r==='dup'?'Ce numéro a déjà une commande en cours chez ce vendeur. Coche « Ajouter même si… » pour forcer.':'Il faut un nom.',1)}
  else if(a==='paste'){mk(report(parseOrders(g('f-paste').value)))}
  else if(a==='bulk'){mk(report(parseBulk(g('f-bulk').value,g('f-v').value.trim())))}
  else if(a==='del'&&o){if(S.del===id){DB.orders=DB.orders.filter(function(x){return x.id!==id});S.del=''}else S.del=id}
  else if(a==='adv'&&o){if(stage(o)===1)setDel(o,'En cours');else if(stage(o)===2)setDel(o,'Livré');S.notif=o.id;mk('Commande : '+STV[stage(o)]+'.')}
  else if(a==='cx2'&&o){setStatus(o,'Annulé');o.reason='Annulé avant livraison';mk('Commande annulée.')}
  else if(a==='rf'&&o){setDel(o,'Refusé')}
  else if(a==='rdok'&&o){setDel(o,'Livré');o.rd=0;S.notif=o.id;mk('Livraison validée.')}
  else if(a==='rdno'&&o){o.rd=2}
  else if(a==='applyst'){var c3=0;g('f-st').value.replace(/SUIVI\s+(\S+)\s+(Livré|Livre|Refusé|Refuse|En cours)/gi,function(m,i,v){var q=byId(i);if(q){var k=v.toLowerCase().replace('é','e');setDel(q,k==='livre'?'Livré':k==='refuse'?'Refusé':'En cours');c3++}return m});mk(c3?c3+' statut(s) appliqué(s).':'Aucun statut reconnu.',!c3)}
  else if(a==='vnew'){S.vform=!S.vform}
  else if(a==='vadd'){var vn=g('v-n').value.trim();if(!vn)mk('Il faut le nom de la boutique.',1);else if(vget(vn))mk('Ce vendeur existe déjà.',1);else{var nv=ensureV(vn);nv.phone=g('v-p').value.trim();nv.city=g('v-c').value.trim();nv.insta=g('v-i').value.trim();S.vform=false;mk('Vendeur ajouté.')}}
  else if(a==='vopen'){S.vsel=id}
  else if(a==='vback'){S.vsel='';S.lk=null}
  else if(a==='vver'){var vv=vid(id);if(vv)vv.ver=!vv.ver}
  else if(a==='vdel'){if(S.del===id){var vd=vid(id);if(vd&&DB.orders.some(function(x){return x.vendor===vd.name}))mk('Ce vendeur a des commandes : supprime-les d’abord ou garde la fiche.',1);else{DB.vend=DB.vend.filter(function(x){return x.id!==id});DB.pay=DB.pay.filter(function(p){return p.vid!==id});S.vsel=''}S.del=''}else S.del=id}
  else if(a==='vlink'){var vl=vid(id);if(!DB.set.phone)mk('Renseigne ton numéro dans Compte → Mon profil avant de créer un lien.',1);else if(vl){S.lk={id:vl.id,url:location.origin+location.pathname+'?v='+encodeURIComponent(vl.name)+'&w='+encodeURIComponent(waNum(DB.set.phone))+(vl.arts&&vl.arts.length?'&c='+encq(vl.arts.slice(0,12).map(function(x){return{n:String(x.name).slice(0,40),p:x.price,o:x.old||0}})):'')}}}
  else if(a==='lcopy'){var lk=g('lk');lk.select();try{navigator.clipboard.writeText(lk.value)}catch(x){try{document.execCommand('copy')}catch(y){}}t.textContent='Copié ✓';return}
  else if(a==='padd'){var am=parseFloat(g('p-a').value);if(!am){mk('Indique un montant.',1)}else{DB.pay.push({id:uid(),vid:id,amount:am,date:today(),note:g('p-n').value.trim()});mk('Paiement enregistré.')}}
  else if(a==='pdel'){if(S.del===id){DB.pay=DB.pay.filter(function(p){return p.id!==id});S.del=''}else S.del=id}
  else if(a==='inv'){S.inv=id}
  else if(a==='invback'){S.inv=''}
  else if(a==='print'){window.print();return}
  else if(a==='csvx'){S.csvx=csvText()}
  else if(a==='xls'){try{dl(xlsx(sheetsData()),'reporting-cod-'+today()+'.xlsx');mk('Fichier Excel généré.')}catch(x){mk('Export impossible ici.',1)}}
  else if(a==='cadd'){var cn=g('c-n').value.trim();if(!cn)mk('Il faut un nom.',1);else{DB.cour.push({id:uid(),name:cn,phone:g('c-p').value.trim(),city:''});mk('Livreur ajouté.')}}
  else if(a==='cdel'){if(S.del===id){DB.cour=DB.cour.filter(function(x){return x.id!==id});S.del=''}else S.del=id}
  else if(a==='bak'){var data=JSON.stringify(DB);DB.set.lastBackup=Date.now();if(K){var biv=crypto.getRandomValues(new Uint8Array(12));crypto.subtle.encrypt({name:'AES-GCM',iv:biv},K,enc.encode(data)).then(function(ct){dl(new Blob([JSON.stringify({enc:1,it:CIT,salt:b64(SALT),iv:b64(biv),ct:b64(new Uint8Array(ct))})],{type:'application/json'}),'sauvegarde-cod-chiffree-'+today()+'.json')});mk('Sauvegarde chiffrée téléchargée (même code que l’application).')}else{dl(new Blob([data],{type:'application/json'}),'sauvegarde-cod-'+today()+'.json');mk('Sauvegarde téléchargée (non chiffrée : active un code dans Sécurité).')}}
  else if(a==='setpin'){var np=g('npin').value.trim();if(np.length<8||np.length>64){mk('Le code doit avoir au moins 8 caractères (lettres et chiffres conseillés).',1)}else{SALT=crypto.getRandomValues(new Uint8Array(16));CIT=600000;dkey(np,SALT,CIT).then(function(k){K=k;save();mk('Code activé : données chiffrées.');render()});return}}
  else if(a==='nopin'){K=null;save();mk('Code retiré : données non chiffrées.')}
  else if(a==='lock'){lockNow();return}
  if(o&&DB.set.db&&(a==='adv'||a==='rf'||a==='cxdo'||a==='cx2'))pub(o);
  save();render();
});
document.addEventListener('change',function(ev){
  var t=ev.target;
  if(t.id==='rs'&&t.files[0]){if(!confirm('Remplacer toutes les données actuelles par cette sauvegarde ? Une copie des données actuelles sera d’abord téléchargée.')){t.value='';return}if(DB&&(DB.orders.length||DB.vend.length)){var sb=document.createElement('button');sb.setAttribute('data-act','bak');sb.hidden=true;document.body.appendChild(sb);sb.click();sb.remove()}readJson(t.files[0],function(txt){try{var d=JSON.parse(txt);if(d&&d.enc){var pw=prompt('Code de cette sauvegarde chiffrée :');if(!pw)return;dkey(pw,ub64(d.salt),d.it||IT).then(function(k){return crypto.subtle.decrypt({name:'AES-GCM',iv:ub64(d.iv)},k,ub64(d.ct))}).then(function(pt){var x=JSON.parse(dec.decode(pt));if(!Array.isArray(x.orders))throw 0;DB=fix(x);S.tab='home';mk('Sauvegarde restaurée : '+DB.orders.length+' commande(s).'+(K?'':' Attention : données non chiffrées sur cet appareil, active un code dans Compte → Paramètres → Sécurité & données.'));save();render()}).catch(function(){mk('Code incorrect ou fichier invalide.',1);render()});return}if(!d||!Array.isArray(d.orders))throw 0;DB=fix(d);S.tab='home';mk('Sauvegarde restaurée : '+DB.orders.length+' commande(s).');save();render()}catch(x){mk('Fichier de sauvegarde invalide.',1);render()}});return}
  if(t.id==='f-file'&&t.files[0]){readJson(t.files[0],function(txt){mk(report(parseBulk(txt,g('f-v')?g('f-v').value.trim():'')));save();render()});return}
  if(!DB)return;
  var id=t.getAttribute('data-id'),o=id?byId(id):null;
  if(t.type==='file'&&t.getAttribute('data-photo')==='me'){if(t.files[0])readPhoto(t.files[0],360,function(d){if(d){DB.set.pphoto=d;S.msg='Photo enregistrée ✓';save();render()}else{mk('Image illisible.',1);render()}});return}
  if(t.type==='file'&&t.getAttribute('data-photo')==='profile'){var vp2=vid(S.vsel);if(vp2&&t.files[0])readPhoto(t.files[0],320,function(d){if(d){vp2.photo=d;save();render()}});return}
  if(t.id&&t.id.indexOf('pf-')===0&&t.getAttribute('data-set')){DB.set[t.getAttribute('data-set')]=t.value.trim();save();return}
  if(t.getAttribute('data-sim')){DB.set.sim[t.getAttribute('data-sim')]=parseFloat(t.value)||0;save();render();return}
  if(t.getAttribute('data-wst')){var wx=DB.set.wallet.filter(function(x){return x.id===id})[0];if(wx)wx.st=t.value;save();render();return}
  if(t.getAttribute('data-dst')){var dd=DB.set.deals.filter(function(x){return x.id===id})[0];if(dd)dd.status=t.value;save();render();return}
  if(t.id==='tf'){S.tf=t.value;render();return}
  if(t.id==='cq'){S.cq=t.value;render();return}
  if(t.id==='wf'){S.wf=t.value;render();return}
  if(t.id==='wq'){S.wq=t.value;render();return}
  if(t.id==='vf'){S.vendor=t.value;render();return}
  if(t.id==='sf'){S.sf=t.value;render();return}
  if(t.id==='q'){S.q=t.value;render();return}
  if(t.getAttribute('data-st')&&o){setStatus(o,t.value)}
  else if(t.getAttribute('data-dl')&&o){setDel(o,t.value)}
  else if(t.getAttribute('data-cr')&&o){o.courier=t.value}
  else if(t.getAttribute('data-set')){var k=t.getAttribute('data-set'),txt=['phone','rib','holder','insta','tpl','script','db','tiles','ckey','pt','pco','pe','pc'].indexOf(k)>=0;DB.set[k]=txt?(k==='tpl'&&!t.value.trim()?DEFTPL:t.value.trim()):Math.max(0,parseFloat(t.value)||0)}
  else if(t.getAttribute('data-vf')){var xv=vid(S.vsel);if(xv){var fk=t.getAttribute('data-vf'),nv=t.value.trim();if(fk==='reg'){xv.reg=Math.max(0,parseFloat(nv)||0);save();render();return}if(fk==='name'){if(nv&&nv!==xv.name&&!vget(nv)){DB.orders.forEach(function(x){if(x.vendor===xv.name)x.vendor=nv});xv.name=nv}}else xv[fk]=nv}}
  else if(t.getAttribute('data-vfee')){var xf=vid(S.vsel);if(xf){xf.fees=xf.fees||{};xf.fees[t.getAttribute('data-vfee')]=t.value===''?null:Math.max(0,parseFloat(t.value)||0)}}
  else return;
  save();render();
});
/* ---------- verrouillage ---------- */
function doUnlock(){
  var f=fails();if(f.u>Date.now()){render();return}
  var pin=g('pin').value;if(!pin||!ST)return;
  var salt=ub64(ST.salt);
  dkey(pin,salt,ST.it||IT).then(function(k){return crypto.subtle.decrypt({name:'AES-GCM',iv:ub64(ST.iv)},k,ub64(ST.ct)).then(function(pt){DB=fix(JSON.parse(dec.decode(pt)));K=k;SALT=salt;CIT=ST.it||IT;S.locked=false;S.msg='';try{localStorage.setItem('cod_f','{"n":0,"u":0}')}catch(x){}render()})}).catch(function(){f.n++;f.u=f.n>=5?Date.now()+Math.min(3600,30*Math.pow(2,f.n-5))*1000:0;try{localStorage.setItem('cod_f',JSON.stringify(f))}catch(x){}S.msg='Code incorrect.';render()});
}
/* ---------- démarrage ---------- */
function boot(){
  $('dl').innerHTML=datalist();
  if(Q.get('t'))return renderClient();
  if(Q.get('l'))return renderCourier();
  if(Q.get('v'))return renderBuyer();
  storeGet().then(function(raw){
    if(raw&&raw.enc){ST=raw;S.locked=true;render();return}
    if(raw&&raw.d){DB=fix(raw.d)}else{DB=migrate();S.migrated=!!DB.migrated;save()}
    render();
  });
  try{if(navigator.storage&&navigator.storage.persist)navigator.storage.persist()}catch(x){}
}
/* ===== v5 : code de livraison, avis, demandes, motifs livreur, satisfaction vendeur ===== */
var RS={n:0},LK='',PT=0,LT='',IP=null;
function dcode(d){return String((d&&d.dc)||'')}
function dcs(o){if(!o.dc){o.dc=String(100000+crypto.getRandomValues(new Uint32Array(1))[0]%900000);save()}return o.dc}
function sec(o){try{if(DB.set.db&&o.vendor!==undefined){return fetch(DB.set.db.replace(/\/$/,'')+'/secret/'+tid(o)+'/ck.json',{method:'PUT',headers:{'Content-Type':'application/json'},body:JSON.stringify(dcs(o))}).catch(function(){})}}catch(e){}return Promise.resolve()}
function sdel(dk,code,ok,ko){var n=Date.now(),b={s:3,dc:String(code),t:n};b['ev/e'+n]={t:n,x:'Colis livré'};try{fetch(dbu(dk.db,dk.tid),{method:'PATCH',headers:{'Content-Type':'application/json'},body:JSON.stringify(b)}).then(function(r){if(r.ok)ok();else ko(r.status)}).catch(function(){ko(0)})}catch(e){ko(0)}}
function toast(m){var x=document.createElement('div');x.className='tst';x.textContent=m;document.body.appendChild(x);setTimeout(function(){x.remove()},3200)}
function conf(){var c=['#d4af37','#15803d','#1d4ed8','#dc2626','#f6dc85'];for(var i=0;i<26;i++){var p=document.createElement('i');p.className='cf';p.style.cssText='left:'+Math.random()*100+'vw;background:'+c[i%5]+';animation-delay:'+Math.random()*.6+'s';document.body.appendChild(p);setTimeout(function(q){q.remove()},3400,p)}}
function snd(d,b,msg){if(d.db&&d.tid)fbp(d.db,d.tid,b);else if(d.w)window.open(wa(d.w,msg),'_blank')}
function cfire(v){var b=document.createElement('button');b.setAttribute('data-act','cst');b.setAttribute('data-v',v);b.hidden=true;document.body.appendChild(b);b.click();b.remove()}
function cash(){try{var l=JSON.parse(localStorage.getItem('cod_cr')||'[]').filter(function(x){return x.d===today()});return{n:l.length,m:l.reduce(function(a,x){return a+x.m},0)}}catch(x){return{n:0,m:0}}}
function btn(l,a,v,x,c){return '<button class="b sm'+(c?' '+c:'')+'" data-act="'+a+'" data-v="'+l+'"'+(x||'')+'>'+l+'</button>'}
/* client */
var _rc=renderClient;
renderClient=function(){
  var d=decq('t');if(!d)return _rc();
  var m=Object.assign({},d,CL),k=JSON.stringify([m,RS.n]);
  if(k===LK&&$('app').children.length)return;LK=k;_rc();
  var s=m.bad?-1:Math.max(0,m.s||0),h='',st=[1,2,3,4,5];
  if(s===2)h+='<div class="card cc"><h2>Code de livraison</h2><div class="code">'+dcode(d).split('').map(function(c){return '<i>'+c+'</i>'}).join('')+'</div><p class="mut">Donne ce code au livreur seulement après avoir vérifié ton colis. Il doit le saisir pour valider la livraison.</p></div>';
  if(s>=0&&s<3)h+='<div class="card"><h2>Un souci ?</h2><div class="btns">'+['Reporter la livraison','Changer l’adresse','Livreur injoignable','Autre problème'].map(function(x){return btn(x,'rq',x)}).join('')+'</div></div>';
  if(s===3){
    if(m.rt)h+='<div class="card cc"><h2>Merci pour ton avis</h2><div class="stars">'+st.map(function(i){return '<button class="'+(i<=m.rt?'on':'')+'" disabled>★</button>'}).join('')+'</div></div>';
    else h+='<div class="card cc"><h2>Comment s’est passée la livraison ?</h2><div class="stars">'+st.map(function(i){return '<button class="'+(i<=RS.n?'on':'')+'" data-act="rate" data-v="'+i+'" aria-label="'+i+' sur 5">★</button>'}).join('')+'</div>'+(RS.n&&RS.n<4?'<p class="mut">Qu’est-ce qui n’a pas marché ?</p><div class="btns">'+['Retard','Colis abîmé','Mauvais produit','Livreur injoignable','Autre'].map(function(x){return btn(x,'rtag',x)}).join('')+'</div>':'')+'</div>';
    try{if(!sessionStorage['cf'+d.tid]){sessionStorage['cf'+d.tid]=1;conf()}}catch(x){}
  }
  h+='<div class="card"><h2>Bon à savoir</h2>'+[['Puis-je vérifier le colis avant de payer ?','Oui. Ouvre le colis devant le livreur. Si ce n’est pas le bon produit, refuse la livraison : tu ne paies rien.'],['Combien dois-je payer ?','Le montant annoncé par le vendeur, en espèces à la réception. Aucun autre frais ne doit t’être demandé.'],['Le livreur n’est pas venu ?','Utilise « Un souci ? » ou « Contacter le service ». Ta demande apparaît dans les étapes.'],['Retour ou échange ?','Contacte le service avec ce lien de suivi : ta demande est transmise au vendeur.']].map(function(f){return '<details class="fq"><summary>'+f[0]+'</summary><p class="mut">'+f[1]+'</p></details>'}).join('')+'</div><button class="b full" data-act="shr">Partager ce suivi</button>';
  $('app').insertAdjacentHTML('beforeend',h);
};
/* livreur */
var _rl=renderCourier;
renderCourier=function(){
  _rl();var d=decq('l');if(!d)return;var A=$('app'),b=A.querySelector('[data-act=cst][data-v="Livré"]'),r=A.querySelector('[data-act=cst][data-v="Refusé"]'),h='',c=cash();
  if(b)b.setAttribute('data-act','cgo');if(r)r.setAttribute('data-act','crf');
  if(CS.ac)h+='<div class="card cc'+(CS.sh?' shake':'')+'"><h2>Code du client</h2><p class="mut">Demande le code à 6 chiffres affiché sur son suivi.</p><input id="cdin" inputmode="numeric" maxlength="6" autocomplete="one-time-code" placeholder="••••" style="text-align:center;font-size:26px;letter-spacing:10px"><button class="b ok full" data-act="cok">Valider la livraison</button>'+(CS.cm?'<p class="s-Annulé">'+CS.cm+'</p>':'')+'</div>';
  if(CS.rf)h+='<div class="card cc"><h2>Pourquoi ?</h2><div class="btns">'+[['Client absent','a'],['Report demandé','a'],['Colis refusé','r'],['Adresse introuvable','r']].map(function(x){return btn(x[0],'crs',x[0],' data-k="'+x[1]+'"')}).join('')+'</div></div>';
  if(CS.dn)h+='<div class="card cc" style="text-align:center"><svg width="64" height="64" viewBox="0 0 64 64"><circle cx="32" cy="32" r="28" fill="none" stroke="var(--okbg)" stroke-width="4"/><path class="chk" d="M18 33l10 10 18-20"/></svg><h2>Livraison validée</h2></div>';
  if(c.n)h+='<div class="kpi" style="margin-bottom:10px"><span class="mut">Encaissé aujourd’hui</span><b>'+fm(c.m)+' dh · '+c.n+' colis</b></div>';
  A.insertAdjacentHTML('afterbegin',h);
};
/* actions v5 */
document.addEventListener('click',function(ev){
  var t=ev.target.closest('[data-act]');if(!t)return;
  var a=t.getAttribute('data-act'),v=t.getAttribute('data-v'),n=Date.now(),dc=decq('t'),dk=decq('l');
  if(a==='rate'&&dc){RS.n=+v;if(RS.n>=4){var b={rt:RS.n,t:n};b['ev/e'+n]={t:n,x:'Avis client : '+RS.n+'/5'};snd(dc,b,'Mon avis sur la commande « '+dc.p+' » : '+RS.n+'/5');CL.rt=RS.n;toast('Merci !');conf()}renderClient()}
  else if(a==='rtag'&&dc){var b2={rt:RS.n,fb:v,t:n};b2['ev/e'+n]={t:n,x:'Avis client : '+RS.n+'/5 · '+v};snd(dc,b2,'Mon avis sur la commande « '+dc.p+' » : '+RS.n+'/5 ('+v+')');CL.rt=RS.n;CL.fb=v;toast('Merci, on s’en occupe.');renderClient()}
  else if(a==='rq'&&dc){var b3={rq:v,t:n};b3['ev/e'+n]={t:n,x:'Demande client : '+v};snd(dc,b3,'Bonjour, concernant ma commande « '+dc.p+' » : '+v+'.');toast('Demande envoyée')}
  else if(a==='shr'){if(navigator.share)navigator.share({title:'Suivi de commande',url:location.href}).catch(function(){});else if(navigator.clipboard){navigator.clipboard.writeText(location.href);toast('Lien copié')}}
  else if(a==='cgo'&&dk){CS.ac=1;CS.rf=0;CS.cm='';renderCourier();var i=$('cdin');if(i)i.focus()}
  else if(a==='crf'&&dk){CS.rf=1;CS.ac=0;renderCourier()}
  else if(a==='cok'&&dk){var c=($('cdin').value||'').trim();
    if(!dk.db){CS.cm='Suivi en direct (Firebase) requis pour valider le code.';renderCourier();return 2}
    sdel(dk,c,function(){deliverOk(dk)},function(st){CS.cm=st===0?'Réseau indisponible, réessaie.':''+(st===429?'Trop d’essais : mission bloquée 30 min. Contacte le vendeur pour un nouveau code.':'Code incorrect, il reste '+attLeft(dk.tid)+' essai(s). Redemande-le au client.')+'';CS.sh=1;renderCourier();setTimeout(function(){CS.sh=0},500)})}
  else if(a==='crs'&&dk&&dk.db){CS.rf=0;var k=t.getAttribute('data-k'),b4={r:v.slice(0,40),t:n};
    if(k==='r'){cfire('Refusé');b4['ev/e'+(n+1)]={t:n+1,x:'Livraison échouée : '+v}}else{b4['ev/e'+n]={t:n,x:'Livreur : '+v+', nouvelle tentative prévue'};CS.ok='Signalé ✓'}
    fbp(dk.db,dk.tid,b4);renderCourier()}
  else if(a==='inst'&&IP){IP.prompt();t.parentNode.remove()}
});
/* vendeur */
function rating(o){return +o.rate||+o.rt||0}
function satc(){var R=DB.orders.filter(function(o){return rating(o)}),n=R.length,rq=DB.orders.filter(function(o){return o.rq&&stage(o)<3&&!bad(o)}),avg=n?R.reduce(function(a,o){return a+rating(o)},0)/n:0,low=R.filter(function(o){return rating(o)<4&&o.fb}).slice(-3).reverse();
  return '<div class="card"><h2>Satisfaction clients</h2>'+(n?'<div class="grid"><div class="kpi"><span class="mut">Note moyenne</span><b>★ '+(Math.round(avg*10)/10)+' / 5</b></div><div class="kpi"><span class="mut">Avis reçus</span><b>'+n+'</b></div></div>':'<p class="mut">Les avis des clients apparaîtront ici après les livraisons suivies en direct.</p>')+low.map(function(o){return '<div class="alert">★'+rating(o)+' · '+e(o.name)+' : '+e(o.fb)+'</div>'}).join('')+rq.map(function(o){return '<div class="alert">'+e(o.name)+' demande : '+e(o.rq)+' <a class="b sm" href="tel:'+e(o.phone)+'">Appeler</a></div>'}).join('')+'</div>'}
var _rd=render;
render=function(){_rd();if(!DB||S.locked||Q.get('t')||Q.get('l')||Q.get('v'))return;var A=$('app');
  if(LT!==S.tab){LT=S.tab;A.classList.remove('tin');void A.offsetWidth;A.classList.add('tin')}
  };
/* acheteur */
var _rb=renderBuyer;
renderBuyer=function(){_rb();$('app').insertAdjacentHTML('beforeend','<div class="card"><h2>Comment ça marche</h2><div class="mut">• Tu paies à la livraison, en espèces<br>• Tu peux vérifier le produit avant de payer<br>• On t’appelle pour confirmer ta commande<br>• Tu reçois un lien pour suivre ton colis</div></div>')};
document.addEventListener('input',function(ev){var t=ev.target;if(t.id!=='b-p')return;var ok=!t.value||mph(t.value),x=$('b-pe');t.style.borderColor=ok?'':'var(--ko)';if(!x){x=document.createElement('div');x.id='b-pe';x.className='mut';t.insertAdjacentElement('afterend',x)}x.textContent=ok?'':'Numéro marocain attendu : 06… ou 07…'});
addEventListener('offline',function(){toast('Hors ligne : les infos affichées peuvent être anciennes')});
addEventListener('online',function(){toast('Connexion rétablie')});
addEventListener('beforeinstallprompt',function(ev){ev.preventDefault();IP=ev;if(Q.get('t')||Q.get('l')||Q.get('v'))return;var x=document.createElement('div');x.className='tst';x.innerHTML='Installer l’application sur ton écran d’accueil<br><button class="b sm" data-act="inst" style="margin-top:6px">Installer</button>';document.body.appendChild(x);setTimeout(function(){x.remove()},12000)});

/* ===== v6 : catalogue, créneaux, photo de preuve, notifications, darija ===== */
var DR=0,NS=null,BP=0,DAR={'Suivi de ta commande':'تتبع الطلب ديالك','Ma mission':'المهمة ديالي','Code de livraison':'كود التوصيل','Un souci ?':'عندك شي مشكل؟','Reporter la livraison':'أجّل التوصيل','Changer l’adresse':'بدّل العنوان','Livreur injoignable':'الموزع ما كيجاوبش','Autre problème':'مشكل آخر','Comment s’est passée la livraison ?':'كيفاش دازت عملية التوصيل؟','Merci pour ton avis':'شكرا على رأيك','Bon à savoir':'مزيان تعرف','Partager ce suivi':'شارك التتبع','Code du client':'كود الزبون','Valider la livraison':'أكّد التوصيل','Pourquoi ?':'علاش؟','Client absent':'الزبون ماشي موجود','Report demandé':'الزبون طلب التأجيل','Colis refusé':'الزبون رفض الكولي','Adresse introuvable':'العنوان ما تلقاش','Livraison validée':'التوصيل تأكد','Comment ça marche':'كيفاش كيخدم','Étapes':'المراحل','Photo de preuve':'تصويرة الإثبات','Prendre la photo':'صوّر الكولي','Envoyer ma commande sur WhatsApp':'صيفط الطلب ديالي فواتساب','Contacter le service':'تواصل مع الخدمة','Livrée':'تسلّم','En cours de livraison':'جاري التوصيل','Validée':'مقبولة','En attente de validation':'كتسنى التأكيد','Distance restante':'المسافة لباقية','Arrivée estimée':'الوصول المتوقع','Choisir':'اختار','Catalogue':'الكتالوج','Créneau de livraison':'وقت التوصيل','Total à payer à la livraison':'المجموع اللي غتخلص عند التوصيل','Être prévenu à chaque étape':'توصل بإشعار فكل مرحلة','Activer les notifications':'فعّل الإشعارات','Peu importe':'أي وقت','Matin (9h–12h)':'الصباح (9h–12h)','Après-midi (12h–17h)':'العشية (12h–17h)','Soir (17h–21h)':'الليل (17h–21h)'};
try{DR=localStorage.getItem('cod_dar')==='1'}catch(x){}
function dar(){if(!(Q.get('t')||Q.get('l')||Q.get('v')))return;document.documentElement.dir=DR?'rtl':'ltr';
  if(DR){var w=document.createTreeWalker($('app'),NodeFilter.SHOW_TEXT),n,l=[];while(n=w.nextNode())l.push(n);l.forEach(function(n){var k=n.nodeValue.trim();if(DAR[k])n.nodeValue=n.nodeValue.replace(k,DAR[k])});Array.prototype.forEach.call(document.querySelectorAll('#app option'),function(o){if(DAR[o.text])o.text=DAR[o.text]})}
  if(!$('lng')){var b=document.createElement('button');b.id='lng';b.className='b sm';b.setAttribute('data-act','dar');b.style.cssText='position:fixed;top:calc(8px + env(safe-area-inset-top,0px));right:10px;z-index:50;min-width:0;flex:none';document.body.appendChild(b)}
  $('lng').textContent=DR?'Français':'دارجة'}
function ntf(){var d=decq('t');if(!d||!('Notification' in window))return;var m=Object.assign({},d,CL),s=m.bad?-1:(m.s||0);
  if(NS!==null&&s!==NS&&Notification.permission==='granted'){var t=m.bad?'Livraison annulée ou refusée':STV[s];(navigator.serviceWorker?navigator.serviceWorker.ready.then(function(r){return r.showNotification(t,{body:m.p,icon:'icon-192.png',vibrate:[200,100,200]})}):Promise.reject()).catch(function(){try{new Notification(t,{body:m.p})}catch(x){}})}NS=s;
  if(d.db&&Notification.permission==='default'&&!$('ntc'))$('app').insertAdjacentHTML('afterbegin','<div class="card" id="ntc"><b>Être prévenu à chaque étape</b><button class="b full" style="margin-top:8px" data-act="ntf">Activer les notifications</button></div>')}
var _rc2=renderClient;renderClient=function(){_rc2();ntf();dar()};
var _rl2=renderCourier;renderCourier=function(){_rl2();if(!decq('l'))return;if(!$('phc'))$('app').insertAdjacentHTML('beforeend','<div class="card" id="phc"><h2>Photo de preuve</h2><p class="mut">Photographie le colis remis. La photo n’est pas gardée dans l’appli : tu l’envoies au vendeur par WhatsApp.</p><input id="pf" type="file" accept="image/*" capture="environment" hidden><button class="b full" data-act="pho">Prendre la photo</button></div>');dar()};
var _rb2=renderBuyer;
renderBuyer=function(){_rb2();var A=$('app'),c=cat_(),h='',f=A.querySelector('h1'),bt=A.querySelector('[data-act=bsend]');
  if(c.length)h='<h2>Catalogue</h2><div class="pg">'+c.map(function(a,i){return '<div class="pc">'+(a.o>a.p?'<span class="bd">-'+Math.round(100*(a.o-a.p)/a.o)+'%</span>':'')+'<div class="ph"><svg class="i" viewBox="0 0 24 24">'+ICO.box+'</svg></div><div class="pb"><div class="pn">'+e(a.n)+'</div><div class="px">'+a.p+' dh'+(a.o>a.p?'<span class="old">'+a.o+' dh</span>':'')+'</div><button class="b sm full" data-act="bpick" data-i="'+i+'">Choisir</button></div></div>'}).join('')+'</div>';
  if(f&&h)f.insertAdjacentHTML('afterend',h);
  if(bt)bt.insertAdjacentHTML('beforebegin','<label>Créneau de livraison</label><select id="b-s"><option>Peu importe</option><option>Matin (9h–12h)</option><option>Après-midi (12h–17h)</option><option>Soir (17h–21h)</option></select><div class="kpi" id="b-t" style="margin-bottom:8px"><span class="mut">Total à payer à la livraison</span><b>—</b></div>');
  BP=0;dar()};
function btot(){var q=+($('b-q').value)||1,t=$('b-t');if(t)t.lastChild.textContent=BP?fm(BP*q)+' dh':'—'}
document.addEventListener('click',function(ev){var t=ev.target.closest('[data-act=bsend]'),s=$('b-s');
  if(t&&s){var a=$('b-a'),q=+($('b-q').value)||1;if(a.value.indexOf('Créneau')<0)a.value=(a.value+(s.selectedIndex?' | Créneau : '+s.value:'')+(BP?' | Total : '+fm(BP*q)+' dh':'')).replace(/^ \| /,'').trim()}},true);
document.addEventListener('click',function(ev){var t=ev.target.closest('[data-act]');if(!t)return;var a=t.getAttribute('data-act');
  if(a==='dar'){DR=!DR;try{localStorage.setItem('cod_dar',DR?'1':'0')}catch(x){}LK='';if(Q.get('t'))renderClient();else if(Q.get('l'))renderCourier();else if(Q.get('v'))renderBuyer()}
  else if(a==='bpick'){var c=cat_()[+t.getAttribute('data-i')];if(c){$('b-pr').value=c.n;BP=c.p;btot();$('b-pr').scrollIntoView({behavior:'smooth',block:'center'});toast('Choisi : '+c.n)}}
  else if(a==='ntf'){Notification.requestPermission().then(function(){var c=$('ntc');if(c)c.remove()})}
  else if(a==='pho'){$('pf').click()}});
document.addEventListener('input',function(ev){if(ev.target.id==='b-q')btot()});
document.addEventListener('change',function(ev){var t=ev.target;if(t.id!=='pf'||!t.files[0])return;var im=new Image(),u=URL.createObjectURL(t.files[0]);
  im.onload=function(){var c=document.createElement('canvas'),k=Math.min(1,900/Math.max(im.width,im.height));c.width=im.width*k;c.height=im.height*k;c.getContext('2d').drawImage(im,0,0,c.width,c.height);URL.revokeObjectURL(u);
    c.toBlob(function(b){var d=decq('l')||{},f=new File([b],'preuve-'+(d.id||'colis')+'.jpg',{type:'image/jpeg'});
      if(navigator.canShare&&navigator.canShare({files:[f]}))navigator.share({files:[f],text:'Preuve de livraison : '+(d.p||'')+' · '+(d.n||'')}).catch(function(){});
      else{var l=document.createElement('a');l.href=URL.createObjectURL(b);l.download=f.name;l.click();toast('Photo enregistrée sur ton téléphone')}},'image/jpeg',.72)};im.src=u});

/* ===== v7 : automatisations ===== */
var LN=0,AUTO0={ca:1,cp:1,cn:1,cb:0,rv:1};
function nt(t,b){(navigator.serviceWorker?navigator.serviceWorker.ready.then(function(r){return r.showNotification(t,{body:b,icon:'icon-192.png'})}):Promise.reject()).catch(function(){try{new Notification(t,{body:b})}catch(x){}})}
function aset(){DB.set.auto=Object.assign({},AUTO0,DB.set.auto);return DB.set.auto}
function actv(n){return DB.orders.filter(function(o){return o.courier===n&&stage(o)<3&&!bad(o)}).length}
function pickc(o){var l=DB.cour.filter(function(c){return c.city&&o.city&&nrm(c.city)===nrm(o.city)});if(!l.length)l=DB.cour.filter(function(c){return !c.city});if(!l.length)return '';return l.sort(function(a,b){return actv(a.name)-actv(b.name)})[0].name}
function qcl(){return DB.orders.filter(function(o){return o.phone&&!bad(o)&&stage(o)>=1&&(o.ns==null?-1:o.ns)<stage(o)})}
function qms(){return DB.orders.filter(function(o){return o.courier&&!bad(o)&&stage(o)===1&&!o.ms&&DB.cour.some(function(c){return c.name===o.courier&&c.phone})})}
function tick(){if(!DB||S.locked||Q.get('t')||Q.get('l')||Q.get('v'))return;var A=aset(),ch=false;
  DB.orders.forEach(function(o){var k=bad(o)?-1:stage(o);
    if(A.ca&&o.status==='Confirmé'&&!o.courier&&!bad(o)&&stage(o)<3&&DB.cour.length){var c=pickc(o);if(c){o.courier=c;ch=true}}
    if(o.ns==null&&(k===3||k===-1)){o.ns=stage(o);ch=true}
    if(A.cp&&DB.set.db){if(o._ps===undefined){o._ps=k;ch=true;if(k>=1&&k<3)pub(o)}else if(o._ps!==k){o._ps=k;ch=true;if(o.tid||k>=1)pub(o)}}});
  var due=DB.orders.filter(function(o){return o.status==='En attente'&&callDue(o)}).length;
  if(A.cn&&due&&Date.now()-LN>18e5&&'Notification' in window&&Notification.permission==='granted'){LN=Date.now();nt(due+(due>1?' appels':' appel')+' à passer','Ouvre Appels pour les traiter.')}
  if(A.cb&&!K&&DB.orders.length&&Date.now()-(DB.set.lastBackup||0)>6048e5){var b=document.createElement('button');b.setAttribute('data-act','bak');b.hidden=true;document.body.appendChild(b);b.click();b.remove();ch=false}
  if(ch){save();var ae=document.activeElement;if((S.tab==='home'||S.tab==='del')&&!(ae&&/INPUT|TEXTAREA|SELECT/.test(ae.tagName)))render()}}
setInterval(tick,15000);setTimeout(tick,2500);
function autc(){var A=aset(),tg=[['ca','Attribuer un livreur automatiquement (par ville, le moins chargé)'],['cp','Publier le suivi à chaque étape'],['cn','Me rappeler les appels à passer'],['cb','Sauvegarde automatique chaque semaine (si pas de code)'],['rv','Valider moi-même les livraisons signalées à distance (anti-fraude, conseillé)']],c=qcl(),m=qms(),
  q=function(l,a,t,f){return l.length?'<div class="mut" style="margin-top:10px">'+t+' ('+l.length+')</div>'+l.slice(0,5).map(function(o){return '<div class="row" style="padding:4px 0"><span>'+e(o.name)+' · '+e(o.product||'')+'</span><button class="b sm" style="flex:none" data-act="'+a+'" data-id="'+o.id+'">Envoyer</button></div>'}).join(''):''};
  return '<div class="card"><h2>Automatisations actives</h2>'+tg.map(function(t){return '<label class="row" style="color:var(--tx);font-size:14px;padding:6px 0"><span>'+t[1]+'</span><input type="checkbox" style="width:auto;min-height:0;margin:0 0 0 8px" data-act="aut" data-k="'+t[0]+'"'+(A[t[0]]?' checked':'')+'></label>'}).join('')+q(c,'aq','Clients à prévenir')+q(m,'am','Missions à envoyer aux livreurs')+(c.length+m.length?'':'<p class="mut">Rien à envoyer pour le moment.</p>')+'<p class="mut">WhatsApp s’ouvre avec le message prêt : tu n’as qu’à appuyer sur Envoyer.</p></div>'}
var _rd2=render;render=function(){_rd2();if(DB&&!S.locked&&!Q.get('t')&&!Q.get('l')&&!Q.get('v')&&S.tab==='home'){$('app').insertAdjacentHTML('beforeend',autc());$('app').insertAdjacentHTML('afterbegin','<div class="card hero" data-act="tab" data-v="tools" style="cursor:pointer"><div class="row"><div><b>Outils QR &amp; NFC</b><div class="mut">Partager, scanner, associer un tag</div></div><span class="arr">›</span></div></div>')}};
document.addEventListener('click',function(ev){var t=ev.target.closest('[data-act]');if(!t||!DB)return;var a=t.getAttribute('data-act'),id=t.getAttribute('data-id'),o=id?DB.orders.filter(function(x){return x.id===id})[0]:null;
  if(a==='aut'){var k=t.getAttribute('data-k');aset()[k]=t.checked?1:0;if(k==='cn'&&t.checked&&'Notification' in window&&Notification.permission==='default')Notification.requestPermission();save();tick();render()}
  else if(a==='aq'&&o){o.ns=stage(o);save();window.open(wa(o.phone,nmsgL(o)),'_blank');render()}
  else if(a==='am'&&o){var c=DB.cour.filter(function(x){return x.name===o.courier})[0];o.ms=1;save();window.open(wa(c.phone,'Nouvelle mission : '+o.product+' pour '+o.name+' ('+(o.city||'')+'). Ouvre : '+tlink(o,'l')),'_blank');render()}});

/* ===== v7.2 : QR code + NFC (QR hors ligne, aucune dépendance réseau) ===== */
/*! QR: Kazuhiko Arase, MIT license, http://www.d-project.com/ — « QR Code » est une marque de DENSO WAVE */
var QRLIB=(function(){var M={},C={};function R(n){n=n.replace("./","");if(!C[n]){var m={exports:{}};C[n]=m;M[n](m,m.exports,R)}return C[n].exports}
M["QRMode"]=function(module,exports,require){module.exports = {
    MODE_NUMBER :       1 << 0,
    MODE_ALPHA_NUM :    1 << 1,
    MODE_8BIT_BYTE :    1 << 2,
    MODE_KANJI :        1 << 3
};
};
M["QRErrorCorrectLevel"]=function(module,exports,require){module.exports = {
	L : 1,
	M : 0,
	Q : 3,
	H : 2
};
};
M["QRMaskPattern"]=function(module,exports,require){module.exports = {
	PATTERN000 : 0,
	PATTERN001 : 1,
	PATTERN010 : 2,
	PATTERN011 : 3,
	PATTERN100 : 4,
	PATTERN101 : 5,
	PATTERN110 : 6,
	PATTERN111 : 7
};
};
M["QRMath"]=function(module,exports,require){var QRMath = {
	glog : function(n) {
		if (n < 1) {
			throw new Error("glog(" + n + ")");
		}
		return QRMath.LOG_TABLE[n];
	},
	gexp : function(n) {
		while (n < 0) {
			n += 255;
		}
		while (n >= 256) {
			n -= 255;
		}
		return QRMath.EXP_TABLE[n];
	},
	EXP_TABLE : new Array(256),
	LOG_TABLE : new Array(256)
};
for (var i = 0; i < 8; i++) {
	QRMath.EXP_TABLE[i] = 1 << i;
}
for (var i = 8; i < 256; i++) {
	QRMath.EXP_TABLE[i] = QRMath.EXP_TABLE[i - 4]
		^ QRMath.EXP_TABLE[i - 5]
		^ QRMath.EXP_TABLE[i - 6]
		^ QRMath.EXP_TABLE[i - 8];
}
for (var i = 0; i < 255; i++) {
	QRMath.LOG_TABLE[QRMath.EXP_TABLE[i] ] = i;
}
module.exports = QRMath;
};
M["QRPolynomial"]=function(module,exports,require){var QRMath = require('./QRMath');
function QRPolynomial(num, shift) {
	if (num.length === undefined) {
		throw new Error(num.length + "/" + shift);
	}
	var offset = 0;
	while (offset < num.length && num[offset] === 0) {
		offset++;
	}
	this.num = new Array(num.length - offset + shift);
	for (var i = 0; i < num.length - offset; i++) {
		this.num[i] = num[i + offset];
	}
}
QRPolynomial.prototype = {
	get : function(index) {
		return this.num[index];
	},
	getLength : function() {
		return this.num.length;
	},
	multiply : function(e) {
		var num = new Array(this.getLength() + e.getLength() - 1);
		for (var i = 0; i < this.getLength(); i++) {
			for (var j = 0; j < e.getLength(); j++) {
				num[i + j] ^= QRMath.gexp(QRMath.glog(this.get(i) ) + QRMath.glog(e.get(j) ) );
			}
		}
		return new QRPolynomial(num, 0);
	},
	mod : function(e) {
		if (this.getLength() - e.getLength() < 0) {
			return this;
		}
		var ratio = QRMath.glog(this.get(0) ) - QRMath.glog(e.get(0) );
		var num = new Array(this.getLength() );
		for (var i = 0; i < this.getLength(); i++) {
			num[i] = this.get(i);
		}
		for (var x = 0; x < e.getLength(); x++) {
			num[x] ^= QRMath.gexp(QRMath.glog(e.get(x) ) + ratio);
		}
		return new QRPolynomial(num, 0).mod(e);
	}
};
module.exports = QRPolynomial;
};
M["QRBitBuffer"]=function(module,exports,require){function QRBitBuffer() {
	this.buffer = [];
	this.length = 0;
}
QRBitBuffer.prototype = {
	get : function(index) {
		var bufIndex = Math.floor(index / 8);
		return ( (this.buffer[bufIndex] >>> (7 - index % 8) ) & 1) == 1;
	},
	put : function(num, length) {
		for (var i = 0; i < length; i++) {
			this.putBit( ( (num >>> (length - i - 1) ) & 1) == 1);
		}
	},
	getLengthInBits : function() {
		return this.length;
	},
	putBit : function(bit) {
		var bufIndex = Math.floor(this.length / 8);
		if (this.buffer.length <= bufIndex) {
			this.buffer.push(0);
		}
		if (bit) {
			this.buffer[bufIndex] |= (0x80 >>> (this.length % 8) );
		}
		this.length++;
	}
};
module.exports = QRBitBuffer;
};
M["QR8bitByte"]=function(module,exports,require){var QRMode = require('./QRMode');
function QR8bitByte(data) {
	this.mode = QRMode.MODE_8BIT_BYTE;
	this.data = data;
}
QR8bitByte.prototype = {
	getLength : function() {
		return this.data.length;
	},
	write : function(buffer) {
		for (var i = 0; i < this.data.length; i++) {
			buffer.put(this.data.charCodeAt(i), 8);
		}
	}
};
module.exports = QR8bitByte;
};
M["QRUtil"]=function(module,exports,require){var QRMode = require('./QRMode');
var QRPolynomial = require('./QRPolynomial');
var QRMath = require('./QRMath');
var QRMaskPattern = require('./QRMaskPattern');
var QRUtil = {
    PATTERN_POSITION_TABLE : [
        [],
        [6, 18],
        [6, 22],
        [6, 26],
        [6, 30],
        [6, 34],
        [6, 22, 38],
        [6, 24, 42],
        [6, 26, 46],
        [6, 28, 50],
        [6, 30, 54],        
        [6, 32, 58],
        [6, 34, 62],
        [6, 26, 46, 66],
        [6, 26, 48, 70],
        [6, 26, 50, 74],
        [6, 30, 54, 78],
        [6, 30, 56, 82],
        [6, 30, 58, 86],
        [6, 34, 62, 90],
        [6, 28, 50, 72, 94],
        [6, 26, 50, 74, 98],
        [6, 30, 54, 78, 102],
        [6, 28, 54, 80, 106],
        [6, 32, 58, 84, 110],
        [6, 30, 58, 86, 114],
        [6, 34, 62, 90, 118],
        [6, 26, 50, 74, 98, 122],
        [6, 30, 54, 78, 102, 126],
        [6, 26, 52, 78, 104, 130],
        [6, 30, 56, 82, 108, 134],
        [6, 34, 60, 86, 112, 138],
        [6, 30, 58, 86, 114, 142],
        [6, 34, 62, 90, 118, 146],
        [6, 30, 54, 78, 102, 126, 150],
        [6, 24, 50, 76, 102, 128, 154],
        [6, 28, 54, 80, 106, 132, 158],
        [6, 32, 58, 84, 110, 136, 162],
        [6, 26, 54, 82, 110, 138, 166],
        [6, 30, 58, 86, 114, 142, 170]
    ],
    G15 : (1 << 10) | (1 << 8) | (1 << 5) | (1 << 4) | (1 << 2) | (1 << 1) | (1 << 0),
    G18 : (1 << 12) | (1 << 11) | (1 << 10) | (1 << 9) | (1 << 8) | (1 << 5) | (1 << 2) | (1 << 0),
    G15_MASK : (1 << 14) | (1 << 12) | (1 << 10)    | (1 << 4) | (1 << 1),
    getBCHTypeInfo : function(data) {
        var d = data << 10;
        while (QRUtil.getBCHDigit(d) - QRUtil.getBCHDigit(QRUtil.G15) >= 0) {
            d ^= (QRUtil.G15 << (QRUtil.getBCHDigit(d) - QRUtil.getBCHDigit(QRUtil.G15) ) );    
        }
        return ( (data << 10) | d) ^ QRUtil.G15_MASK;
    },
    getBCHTypeNumber : function(data) {
        var d = data << 12;
        while (QRUtil.getBCHDigit(d) - QRUtil.getBCHDigit(QRUtil.G18) >= 0) {
            d ^= (QRUtil.G18 << (QRUtil.getBCHDigit(d) - QRUtil.getBCHDigit(QRUtil.G18) ) );    
        }
        return (data << 12) | d;
    },
    getBCHDigit : function(data) {
        var digit = 0;
        while (data !== 0) {
            digit++;
            data >>>= 1;
        }
        return digit;
    },
    getPatternPosition : function(typeNumber) {
        return QRUtil.PATTERN_POSITION_TABLE[typeNumber - 1];
    },
    getMask : function(maskPattern, i, j) {
        switch (maskPattern) {
        case QRMaskPattern.PATTERN000 : return (i + j) % 2 === 0;
        case QRMaskPattern.PATTERN001 : return i % 2 === 0;
        case QRMaskPattern.PATTERN010 : return j % 3 === 0;
        case QRMaskPattern.PATTERN011 : return (i + j) % 3 === 0;
        case QRMaskPattern.PATTERN100 : return (Math.floor(i / 2) + Math.floor(j / 3) ) % 2 === 0;
        case QRMaskPattern.PATTERN101 : return (i * j) % 2 + (i * j) % 3 === 0;
        case QRMaskPattern.PATTERN110 : return ( (i * j) % 2 + (i * j) % 3) % 2 === 0;
        case QRMaskPattern.PATTERN111 : return ( (i * j) % 3 + (i + j) % 2) % 2 === 0;
        default :
            throw new Error("bad maskPattern:" + maskPattern);
        }
    },
    getErrorCorrectPolynomial : function(errorCorrectLength) {
        var a = new QRPolynomial([1], 0);
        for (var i = 0; i < errorCorrectLength; i++) {
            a = a.multiply(new QRPolynomial([1, QRMath.gexp(i)], 0) );
        }
        return a;
    },
    getLengthInBits : function(mode, type) {
        if (1 <= type && type < 10) {
            switch(mode) {
            case QRMode.MODE_NUMBER     : return 10;
            case QRMode.MODE_ALPHA_NUM  : return 9;
            case QRMode.MODE_8BIT_BYTE  : return 8;
            case QRMode.MODE_KANJI      : return 8;
            default :
                throw new Error("mode:" + mode);
            }
        } else if (type < 27) {
            switch(mode) {
            case QRMode.MODE_NUMBER     : return 12;
            case QRMode.MODE_ALPHA_NUM  : return 11;
            case QRMode.MODE_8BIT_BYTE  : return 16;
            case QRMode.MODE_KANJI      : return 10;
            default :
                throw new Error("mode:" + mode);
            }
        } else if (type < 41) {
            switch(mode) {
            case QRMode.MODE_NUMBER     : return 14;
            case QRMode.MODE_ALPHA_NUM  : return 13;
            case QRMode.MODE_8BIT_BYTE  : return 16;
            case QRMode.MODE_KANJI      : return 12;
            default :
                throw new Error("mode:" + mode);
            }
        } else {
            throw new Error("type:" + type);
        }
    },
    getLostPoint : function(qrCode) {
        var moduleCount = qrCode.getModuleCount();
        var lostPoint = 0;
        var row = 0; 
        var col = 0;
        for (row = 0; row < moduleCount; row++) {
            for (col = 0; col < moduleCount; col++) {
                var sameCount = 0;
                var dark = qrCode.isDark(row, col);
                for (var r = -1; r <= 1; r++) {
                    if (row + r < 0 || moduleCount <= row + r) {
                        continue;
                    }
                    for (var c = -1; c <= 1; c++) {
                        if (col + c < 0 || moduleCount <= col + c) {
                            continue;
                        }
                        if (r === 0 && c === 0) {
                            continue;
                        }
                        if (dark === qrCode.isDark(row + r, col + c) ) {
                            sameCount++;
                        }
                    }
                }
                if (sameCount > 5) {
                    lostPoint += (3 + sameCount - 5);
                }
            }
        }
        for (row = 0; row < moduleCount - 1; row++) {
            for (col = 0; col < moduleCount - 1; col++) {
                var count = 0;
                if (qrCode.isDark(row,     col    ) ) count++;
                if (qrCode.isDark(row + 1, col    ) ) count++;
                if (qrCode.isDark(row,     col + 1) ) count++;
                if (qrCode.isDark(row + 1, col + 1) ) count++;
                if (count === 0 || count === 4) {
                    lostPoint += 3;
                }
            }
        }
        for (row = 0; row < moduleCount; row++) {
            for (col = 0; col < moduleCount - 6; col++) {
                if (qrCode.isDark(row, col) && 
                        !qrCode.isDark(row, col + 1) && 
                         qrCode.isDark(row, col + 2) && 
                         qrCode.isDark(row, col + 3) && 
                         qrCode.isDark(row, col + 4) && 
                        !qrCode.isDark(row, col + 5) && 
                         qrCode.isDark(row, col + 6) ) {
                    lostPoint += 40;
                }
            }
        }
        for (col = 0; col < moduleCount; col++) {
            for (row = 0; row < moduleCount - 6; row++) {
                if (qrCode.isDark(row, col) &&
                        !qrCode.isDark(row + 1, col) &&
                         qrCode.isDark(row + 2, col) &&
                         qrCode.isDark(row + 3, col) &&
                         qrCode.isDark(row + 4, col) &&
                        !qrCode.isDark(row + 5, col) &&
                         qrCode.isDark(row + 6, col) ) {
                    lostPoint += 40;
                }
            }
        }
        var darkCount = 0;
        for (col = 0; col < moduleCount; col++) {
            for (row = 0; row < moduleCount; row++) {
                if (qrCode.isDark(row, col) ) {
                    darkCount++;
                }
            }
        }
        var ratio = Math.abs(100 * darkCount / moduleCount / moduleCount - 50) / 5;
        lostPoint += ratio * 10;
        return lostPoint;       
    }
};
module.exports = QRUtil;
};
M["QRRSBlock"]=function(module,exports,require){var QRErrorCorrectLevel = require('./QRErrorCorrectLevel');
function QRRSBlock(totalCount, dataCount) {
	this.totalCount = totalCount;
	this.dataCount  = dataCount;
}
QRRSBlock.RS_BLOCK_TABLE = [
	[1, 26, 19],
	[1, 26, 16],
	[1, 26, 13],
	[1, 26, 9],
	[1, 44, 34],
	[1, 44, 28],
	[1, 44, 22],
	[1, 44, 16],
	[1, 70, 55],
	[1, 70, 44],
	[2, 35, 17],
	[2, 35, 13],
	[1, 100, 80],
	[2, 50, 32],
	[2, 50, 24],
	[4, 25, 9],
	[1, 134, 108],
	[2, 67, 43],
	[2, 33, 15, 2, 34, 16],
	[2, 33, 11, 2, 34, 12],
	[2, 86, 68],
	[4, 43, 27],
	[4, 43, 19],
	[4, 43, 15],
	[2, 98, 78],
	[4, 49, 31],
	[2, 32, 14, 4, 33, 15],
	[4, 39, 13, 1, 40, 14],
	[2, 121, 97],
	[2, 60, 38, 2, 61, 39],
	[4, 40, 18, 2, 41, 19],
	[4, 40, 14, 2, 41, 15],
	[2, 146, 116],
	[3, 58, 36, 2, 59, 37],
	[4, 36, 16, 4, 37, 17],
	[4, 36, 12, 4, 37, 13],
	[2, 86, 68, 2, 87, 69],
	[4, 69, 43, 1, 70, 44],
	[6, 43, 19, 2, 44, 20],
	[6, 43, 15, 2, 44, 16],
	[4, 101, 81],
	[1, 80, 50, 4, 81, 51],
	[4, 50, 22, 4, 51, 23],
	[3, 36, 12, 8, 37, 13],
	[2, 116, 92, 2, 117, 93],
	[6, 58, 36, 2, 59, 37],
	[4, 46, 20, 6, 47, 21],
	[7, 42, 14, 4, 43, 15],
	[4, 133, 107],
	[8, 59, 37, 1, 60, 38],
	[8, 44, 20, 4, 45, 21],
	[12, 33, 11, 4, 34, 12],
	[3, 145, 115, 1, 146, 116],
	[4, 64, 40, 5, 65, 41],
	[11, 36, 16, 5, 37, 17],
	[11, 36, 12, 5, 37, 13],
	[5, 109, 87, 1, 110, 88],
	[5, 65, 41, 5, 66, 42],
	[5, 54, 24, 7, 55, 25],
	[11, 36, 12],
	[5, 122, 98, 1, 123, 99],
	[7, 73, 45, 3, 74, 46],
	[15, 43, 19, 2, 44, 20],
	[3, 45, 15, 13, 46, 16],
	[1, 135, 107, 5, 136, 108],
	[10, 74, 46, 1, 75, 47],
	[1, 50, 22, 15, 51, 23],
	[2, 42, 14, 17, 43, 15],
	[5, 150, 120, 1, 151, 121],
	[9, 69, 43, 4, 70, 44],
	[17, 50, 22, 1, 51, 23],
	[2, 42, 14, 19, 43, 15],
	[3, 141, 113, 4, 142, 114],
	[3, 70, 44, 11, 71, 45],
	[17, 47, 21, 4, 48, 22],
	[9, 39, 13, 16, 40, 14],
	[3, 135, 107, 5, 136, 108],
	[3, 67, 41, 13, 68, 42],
	[15, 54, 24, 5, 55, 25],
	[15, 43, 15, 10, 44, 16],
	[4, 144, 116, 4, 145, 117],
	[17, 68, 42],
	[17, 50, 22, 6, 51, 23],
	[19, 46, 16, 6, 47, 17],
	[2, 139, 111, 7, 140, 112],
	[17, 74, 46],
	[7, 54, 24, 16, 55, 25],
	[34, 37, 13],
	[4, 151, 121, 5, 152, 122],
	[4, 75, 47, 14, 76, 48],
	[11, 54, 24, 14, 55, 25],
	[16, 45, 15, 14, 46, 16],
	[6, 147, 117, 4, 148, 118],
	[6, 73, 45, 14, 74, 46],
	[11, 54, 24, 16, 55, 25],
	[30, 46, 16, 2, 47, 17],
	[8, 132, 106, 4, 133, 107],
	[8, 75, 47, 13, 76, 48],
	[7, 54, 24, 22, 55, 25],
	[22, 45, 15, 13, 46, 16],
	[10, 142, 114, 2, 143, 115],
	[19, 74, 46, 4, 75, 47],
	[28, 50, 22, 6, 51, 23],
	[33, 46, 16, 4, 47, 17],
	[8, 152, 122, 4, 153, 123],
	[22, 73, 45, 3, 74, 46],
	[8, 53, 23, 26, 54, 24],
	[12, 45, 15, 28, 46, 16],
	[3, 147, 117, 10, 148, 118],
	[3, 73, 45, 23, 74, 46],
	[4, 54, 24, 31, 55, 25],
	[11, 45, 15, 31, 46, 16],
	[7, 146, 116, 7, 147, 117],
	[21, 73, 45, 7, 74, 46],
	[1, 53, 23, 37, 54, 24],
	[19, 45, 15, 26, 46, 16],
	[5, 145, 115, 10, 146, 116],
	[19, 75, 47, 10, 76, 48],
	[15, 54, 24, 25, 55, 25],
	[23, 45, 15, 25, 46, 16],
	[13, 145, 115, 3, 146, 116],
	[2, 74, 46, 29, 75, 47],
	[42, 54, 24, 1, 55, 25],
	[23, 45, 15, 28, 46, 16],
	[17, 145, 115],
	[10, 74, 46, 23, 75, 47],
	[10, 54, 24, 35, 55, 25],
	[19, 45, 15, 35, 46, 16],
	[17, 145, 115, 1, 146, 116],
	[14, 74, 46, 21, 75, 47],
	[29, 54, 24, 19, 55, 25],
	[11, 45, 15, 46, 46, 16],
	[13, 145, 115, 6, 146, 116],
	[14, 74, 46, 23, 75, 47],
	[44, 54, 24, 7, 55, 25],
	[59, 46, 16, 1, 47, 17],
	[12, 151, 121, 7, 152, 122],
	[12, 75, 47, 26, 76, 48],
	[39, 54, 24, 14, 55, 25],
	[22, 45, 15, 41, 46, 16],
	[6, 151, 121, 14, 152, 122],
	[6, 75, 47, 34, 76, 48],
	[46, 54, 24, 10, 55, 25],
	[2, 45, 15, 64, 46, 16],
	[17, 152, 122, 4, 153, 123],
	[29, 74, 46, 14, 75, 47],
	[49, 54, 24, 10, 55, 25],
	[24, 45, 15, 46, 46, 16],
	[4, 152, 122, 18, 153, 123],
	[13, 74, 46, 32, 75, 47],
	[48, 54, 24, 14, 55, 25],
	[42, 45, 15, 32, 46, 16],
	[20, 147, 117, 4, 148, 118],
	[40, 75, 47, 7, 76, 48],
	[43, 54, 24, 22, 55, 25],
	[10, 45, 15, 67, 46, 16],
	[19, 148, 118, 6, 149, 119],
	[18, 75, 47, 31, 76, 48],
	[34, 54, 24, 34, 55, 25],
	[20, 45, 15, 61, 46, 16]
];
QRRSBlock.getRSBlocks = function(typeNumber, errorCorrectLevel) {
	var rsBlock = QRRSBlock.getRsBlockTable(typeNumber, errorCorrectLevel);
	if (rsBlock === undefined) {
		throw new Error("bad rs block @ typeNumber:" + typeNumber + "/errorCorrectLevel:" + errorCorrectLevel);
	}
	var length = rsBlock.length / 3;
	var list = [];
	for (var i = 0; i < length; i++) {
		var count = rsBlock[i * 3 + 0];
		var totalCount = rsBlock[i * 3 + 1];
		var dataCount  = rsBlock[i * 3 + 2];
		for (var j = 0; j < count; j++) {
			list.push(new QRRSBlock(totalCount, dataCount) );	
		}
	}
	return list;
};
QRRSBlock.getRsBlockTable = function(typeNumber, errorCorrectLevel) {
	switch(errorCorrectLevel) {
	case QRErrorCorrectLevel.L :
		return QRRSBlock.RS_BLOCK_TABLE[(typeNumber - 1) * 4 + 0];
	case QRErrorCorrectLevel.M :
		return QRRSBlock.RS_BLOCK_TABLE[(typeNumber - 1) * 4 + 1];
	case QRErrorCorrectLevel.Q :
		return QRRSBlock.RS_BLOCK_TABLE[(typeNumber - 1) * 4 + 2];
	case QRErrorCorrectLevel.H :
		return QRRSBlock.RS_BLOCK_TABLE[(typeNumber - 1) * 4 + 3];
	default :
		return undefined;
	}
};
module.exports = QRRSBlock;
};
M["index"]=function(module,exports,require){
var QR8bitByte = require('./QR8bitByte');
var QRUtil = require('./QRUtil');
var QRPolynomial = require('./QRPolynomial');
var QRRSBlock = require('./QRRSBlock');
var QRBitBuffer = require('./QRBitBuffer');
function QRCode(typeNumber, errorCorrectLevel) {
	this.typeNumber = typeNumber;
	this.errorCorrectLevel = errorCorrectLevel;
	this.modules = null;
	this.moduleCount = 0;
	this.dataCache = null;
	this.dataList = [];
}
QRCode.prototype = {
	addData : function(data) {
		var newData = new QR8bitByte(data);
		this.dataList.push(newData);
		this.dataCache = null;
	},
	isDark : function(row, col) {
		if (row < 0 || this.moduleCount <= row || col < 0 || this.moduleCount <= col) {
			throw new Error(row + "," + col);
		}
		return this.modules[row][col];
	},
	getModuleCount : function() {
		return this.moduleCount;
	},
	make : function() {
		if (this.typeNumber < 1 ){
			var typeNumber = 1;
			for (typeNumber = 1; typeNumber < 40; typeNumber++) {
				var rsBlocks = QRRSBlock.getRSBlocks(typeNumber, this.errorCorrectLevel);
				var buffer = new QRBitBuffer();
				var totalDataCount = 0;
				for (var i = 0; i < rsBlocks.length; i++) {
					totalDataCount += rsBlocks[i].dataCount;
				}
				for (var x = 0; x < this.dataList.length; x++) {
					var data = this.dataList[x];
					buffer.put(data.mode, 4);
					buffer.put(data.getLength(), QRUtil.getLengthInBits(data.mode, typeNumber) );
					data.write(buffer);
				}
				if (buffer.getLengthInBits() <= totalDataCount * 8)
					break;
			}
			this.typeNumber = typeNumber;
		}
		this.makeImpl(false, this.getBestMaskPattern() );
	},
	makeImpl : function(test, maskPattern) {
		this.moduleCount = this.typeNumber * 4 + 17;
		this.modules = new Array(this.moduleCount);
		for (var row = 0; row < this.moduleCount; row++) {
			this.modules[row] = new Array(this.moduleCount);
			for (var col = 0; col < this.moduleCount; col++) {
				this.modules[row][col] = null;//(col + row) % 3;
			}
		}
		this.setupPositionProbePattern(0, 0);
		this.setupPositionProbePattern(this.moduleCount - 7, 0);
		this.setupPositionProbePattern(0, this.moduleCount - 7);
		this.setupPositionAdjustPattern();
		this.setupTimingPattern();
		this.setupTypeInfo(test, maskPattern);
		if (this.typeNumber >= 7) {
			this.setupTypeNumber(test);
		}
		if (this.dataCache === null) {
			this.dataCache = QRCode.createData(this.typeNumber, this.errorCorrectLevel, this.dataList);
		}
		this.mapData(this.dataCache, maskPattern);
	},
	setupPositionProbePattern : function(row, col)  {
		for (var r = -1; r <= 7; r++) {
			if (row + r <= -1 || this.moduleCount <= row + r) continue;
			for (var c = -1; c <= 7; c++) {
				if (col + c <= -1 || this.moduleCount <= col + c) continue;
				if ( (0 <= r && r <= 6 && (c === 0 || c === 6) ) || 
                     (0 <= c && c <= 6 && (r === 0 || r === 6) ) || 
                     (2 <= r && r <= 4 && 2 <= c && c <= 4) ) {
					this.modules[row + r][col + c] = true;
				} else {
					this.modules[row + r][col + c] = false;
				}
			}		
		}		
	},
	getBestMaskPattern : function() {
		var minLostPoint = 0;
		var pattern = 0;
		for (var i = 0; i < 8; i++) {
			this.makeImpl(true, i);
			var lostPoint = QRUtil.getLostPoint(this);
			if (i === 0 || minLostPoint >  lostPoint) {
				minLostPoint = lostPoint;
				pattern = i;
			}
		}
		return pattern;
	},
	createMovieClip : function(target_mc, instance_name, depth) {
		var qr_mc = target_mc.createEmptyMovieClip(instance_name, depth);
		var cs = 1;
		this.make();
		for (var row = 0; row < this.modules.length; row++) {
			var y = row * cs;
			for (var col = 0; col < this.modules[row].length; col++) {
				var x = col * cs;
				var dark = this.modules[row][col];
				if (dark) {
					qr_mc.beginFill(0, 100);
					qr_mc.moveTo(x, y);
					qr_mc.lineTo(x + cs, y);
					qr_mc.lineTo(x + cs, y + cs);
					qr_mc.lineTo(x, y + cs);
					qr_mc.endFill();
				}
			}
		}
		return qr_mc;
	},
	setupTimingPattern : function() {
		for (var r = 8; r < this.moduleCount - 8; r++) {
			if (this.modules[r][6] !== null) {
				continue;
			}
			this.modules[r][6] = (r % 2 === 0);
		}
		for (var c = 8; c < this.moduleCount - 8; c++) {
			if (this.modules[6][c] !== null) {
				continue;
			}
			this.modules[6][c] = (c % 2 === 0);
		}
	},
	setupPositionAdjustPattern : function() {
		var pos = QRUtil.getPatternPosition(this.typeNumber);
		for (var i = 0; i < pos.length; i++) {
			for (var j = 0; j < pos.length; j++) {
				var row = pos[i];
				var col = pos[j];
				if (this.modules[row][col] !== null) {
					continue;
				}
				for (var r = -2; r <= 2; r++) {
					for (var c = -2; c <= 2; c++) {
						if (Math.abs(r) === 2 || 
                            Math.abs(c) === 2 ||
                            (r === 0 && c === 0) ) {
							this.modules[row + r][col + c] = true;
						} else {
							this.modules[row + r][col + c] = false;
						}
					}
				}
			}
		}
	},
	setupTypeNumber : function(test) {
		var bits = QRUtil.getBCHTypeNumber(this.typeNumber);
        var mod;
		for (var i = 0; i < 18; i++) {
			mod = (!test && ( (bits >> i) & 1) === 1);
			this.modules[Math.floor(i / 3)][i % 3 + this.moduleCount - 8 - 3] = mod;
		}
		for (var x = 0; x < 18; x++) {
			mod = (!test && ( (bits >> x) & 1) === 1);
			this.modules[x % 3 + this.moduleCount - 8 - 3][Math.floor(x / 3)] = mod;
		}
	},
	setupTypeInfo : function(test, maskPattern) {
		var data = (this.errorCorrectLevel << 3) | maskPattern;
		var bits = QRUtil.getBCHTypeInfo(data);
        var mod;
		for (var v = 0; v < 15; v++) {
			mod = (!test && ( (bits >> v) & 1) === 1);
			if (v < 6) {
				this.modules[v][8] = mod;
			} else if (v < 8) {
				this.modules[v + 1][8] = mod;
			} else {
				this.modules[this.moduleCount - 15 + v][8] = mod;
			}
		}
		for (var h = 0; h < 15; h++) {
			mod = (!test && ( (bits >> h) & 1) === 1);
			if (h < 8) {
				this.modules[8][this.moduleCount - h - 1] = mod;
			} else if (h < 9) {
				this.modules[8][15 - h - 1 + 1] = mod;
			} else {
				this.modules[8][15 - h - 1] = mod;
			}
		}
		this.modules[this.moduleCount - 8][8] = (!test);
	},
	mapData : function(data, maskPattern) {
		var inc = -1;
		var row = this.moduleCount - 1;
		var bitIndex = 7;
		var byteIndex = 0;
		for (var col = this.moduleCount - 1; col > 0; col -= 2) {
			if (col === 6) col--;
			while (true) {
				for (var c = 0; c < 2; c++) {
					if (this.modules[row][col - c] === null) {
						var dark = false;
						if (byteIndex < data.length) {
							dark = ( ( (data[byteIndex] >>> bitIndex) & 1) === 1);
						}
						var mask = QRUtil.getMask(maskPattern, row, col - c);
						if (mask) {
							dark = !dark;
						}
						this.modules[row][col - c] = dark;
						bitIndex--;
						if (bitIndex === -1) {
							byteIndex++;
							bitIndex = 7;
						}
					}
				}
				row += inc;
				if (row < 0 || this.moduleCount <= row) {
					row -= inc;
					inc = -inc;
					break;
				}
			}
		}
	}
};
QRCode.PAD0 = 0xEC;
QRCode.PAD1 = 0x11;
QRCode.createData = function(typeNumber, errorCorrectLevel, dataList) {
	var rsBlocks = QRRSBlock.getRSBlocks(typeNumber, errorCorrectLevel);
	var buffer = new QRBitBuffer();
	for (var i = 0; i < dataList.length; i++) {
		var data = dataList[i];
		buffer.put(data.mode, 4);
		buffer.put(data.getLength(), QRUtil.getLengthInBits(data.mode, typeNumber) );
		data.write(buffer);
	}
	var totalDataCount = 0;
	for (var x = 0; x < rsBlocks.length; x++) {
		totalDataCount += rsBlocks[x].dataCount;
	}
	if (buffer.getLengthInBits() > totalDataCount * 8) {
		throw new Error("code length overflow. (" + 
            buffer.getLengthInBits() + 
            ">" +  
            totalDataCount * 8 + 
            ")");
	}
	if (buffer.getLengthInBits() + 4 <= totalDataCount * 8) {
		buffer.put(0, 4);
	}
	while (buffer.getLengthInBits() % 8 !== 0) {
		buffer.putBit(false);
	}
	while (true) {
		if (buffer.getLengthInBits() >= totalDataCount * 8) {
			break;
		}
		buffer.put(QRCode.PAD0, 8);
		if (buffer.getLengthInBits() >= totalDataCount * 8) {
			break;
		}
		buffer.put(QRCode.PAD1, 8);
	}
	return QRCode.createBytes(buffer, rsBlocks);
};
QRCode.createBytes = function(buffer, rsBlocks) {
	var offset = 0;
	var maxDcCount = 0;
	var maxEcCount = 0;
	var dcdata = new Array(rsBlocks.length);
	var ecdata = new Array(rsBlocks.length);
	for (var r = 0; r < rsBlocks.length; r++) {
		var dcCount = rsBlocks[r].dataCount;
		var ecCount = rsBlocks[r].totalCount - dcCount;
		maxDcCount = Math.max(maxDcCount, dcCount);
		maxEcCount = Math.max(maxEcCount, ecCount);
		dcdata[r] = new Array(dcCount);
		for (var i = 0; i < dcdata[r].length; i++) {
			dcdata[r][i] = 0xff & buffer.buffer[i + offset];
		}
		offset += dcCount;
		var rsPoly = QRUtil.getErrorCorrectPolynomial(ecCount);
		var rawPoly = new QRPolynomial(dcdata[r], rsPoly.getLength() - 1);
		var modPoly = rawPoly.mod(rsPoly);
		ecdata[r] = new Array(rsPoly.getLength() - 1);
		for (var x = 0; x < ecdata[r].length; x++) {
            var modIndex = x + modPoly.getLength() - ecdata[r].length;
			ecdata[r][x] = (modIndex >= 0)? modPoly.get(modIndex) : 0;
		}
	}
	var totalCodeCount = 0;
	for (var y = 0; y < rsBlocks.length; y++) {
		totalCodeCount += rsBlocks[y].totalCount;
	}
	var data = new Array(totalCodeCount);
	var index = 0;
	for (var z = 0; z < maxDcCount; z++) {
		for (var s = 0; s < rsBlocks.length; s++) {
			if (z < dcdata[s].length) {
				data[index++] = dcdata[s][z];
			}
		}
	}
	for (var xx = 0; xx < maxEcCount; xx++) {
		for (var t = 0; t < rsBlocks.length; t++) {
			if (xx < ecdata[t].length) {
				data[index++] = ecdata[t][xx];
			}
		}
	}
	return data;
};
module.exports = QRCode;
};
return R("index")})();
function qrSvg(t){var q,lv=[0,1],i,n;for(var li=0;li<2&&!q;li++){for(n=3;n<=40&&!q;n++){try{var c=new QRLIB(n,lv[li]);c.addData(t);c.make();q=c}catch(x){}}}
if(!q)return '';var m=q.getModuleCount(),z=4,s=m+2*z,p='';for(var r=0;r<m;r++)for(var k=0;k<m;k++)if(q.isDark(r,k))p+='M'+(k+z)+' '+(r+z)+'h1v1h-1z';
return '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 '+s+' '+s+'" shape-rendering="crispEdges" role="img" aria-label="QR code"><rect width="'+s+'" height="'+s+'" fill="#fff"/><path d="'+p+'" fill="#000"/></svg>'}

function cat_(){var c=decq('c');return Array.isArray(c)?c.slice(0,12).map(function(a){a=a||{};return{n:String(a.n||'').slice(0,40),p:+a.p||0,o:+a.o||0}}):[]}
function vurl(vl){return location.origin+location.pathname+'?v='+encodeURIComponent(vl.name)+'&w='+encodeURIComponent(waNum(DB.set.phone))+(vl.arts&&vl.arts.length?'&c='+encq(vl.arts.slice(0,12).map(function(x){return{n:String(x.name).slice(0,40),p:x.price,o:x.old||0}})):'')}
function qacc(){var vs=DB.vend.slice(0,8).map(function(v){return '<button class="b sm" data-act="qrs" data-k="vd" data-id="'+v.id+'">'+e(v.name)+'</button>'}).join(''),ms=DB.orders.filter(function(o){return o.courier&&!bad(o)&&stage(o)>=1&&stage(o)<3}).slice(0,6).map(function(o){return '<button class="b sm" data-act="qrs" data-k="l" data-id="'+o.id+'">'+e(o.courier)+' · '+e(o.name)+'</button>'}).join('');
  return '<div class="card"><h2>QR code</h2><div class="mut">Partager ou scanner un lien</div><div class="btns"><button class="b pri" data-act="qrs" data-k="app">Mon application</button><button class="b" data-act="scn">Scanner un QR</button></div>'+(vs?'<div class="mut" style="margin-top:10px">Lien de commande d’un vendeur</div><div class="btns">'+vs+'</div>':'')+(ms?'<div class="mut" style="margin-top:10px">Mission d’un livreur</div><div class="btns">'+ms+'</div>':'')+'</div><div class="card"><h2>NFC</h2><div class="mut">'+(nfcOK()?'NFC disponible sur cet appareil':'NFC : Chrome Android en HTTPS requis')+'</div><div class="btns"><button class="b" data-act="qrx" data-k="read">Lire un tag</button><button class="b" data-act="tagp">Associer un tag</button></div></div><div class="card"><h2>Diagnostic</h2><div class="mut">Vérifier caméra, NFC et connexion</div><div class="btns"><button class="b" data-act="diag">Lancer le diagnostic</button></div><p class="mut">Ces codes ouvrent un lien. Les données restent sur chaque téléphone.</p></div>'}
var QO=null;
function qclose(){scnStop();if(QO){QO.remove();QO=null}}
function qshow(title,url){
  qclose();var svg=qrSvg(url).replace('<svg ','<svg style="display:block;width:100%;height:auto" ');
  QO=document.createElement('div');QO.setAttribute('role','dialog');
  QO.style.cssText='position:fixed;top:0;right:0;bottom:0;left:0;z-index:100;background:rgba(0,0,0,.6);display:flex;align-items:center;justify-content:center;padding:16px;overflow:auto';
  QO.innerHTML='<div class="card" style="max-width:360px;width:100%;margin:0;text-align:center"><h2>'+e(title)+'</h2>'+(svg.length>40?'<div style="background:#fff;padding:6px;border-radius:12px;width:min(78vw,300px);margin:0 auto">'+svg+'</div>':'<p class="mut">Lien trop long pour un QR code.</p>')+'<p class="mut" style="font-size:12px">Scanne avec l’appareil photo du téléphone.</p><div class="btns"><button class="b" data-act="qrx" data-k="save">Enregistrer</button><button class="b" data-act="qrx" data-k="nfc">Écrire NFC</button></div><div class="btns"><button class="b" data-act="qrx" data-k="read">Lire un tag NFC</button><button class="b pri" data-act="qrx" data-k="close">Fermer</button></div></div>';
  QO._u=url;QO._s=svg;document.body.appendChild(QO)}
function nfcOK(){return 'NDEFReader' in window&&window.isSecureContext}
function nfcW(u){if(!nfcOK()){toast('NFC indisponible ici (Chrome Android en HTTPS requis). Utilise le QR code.');return}
  toast('Approche un tag NFC du téléphone…');
  new NDEFReader().write({records:[{recordType:'url',data:u}]}).then(function(){toast('Tag NFC écrit ✓')}).catch(function(x){toast(x&&x.name==='NotAllowedError'?'NFC : autorisation refusée':'NFC : écriture impossible')})}
function nfcR(){if(!nfcOK()){toast('NFC indisponible ici (Chrome Android en HTTPS requis).');return}
  var r=new NDEFReader(),base=location.origin+location.pathname;
  r.onreading=function(ev){var u='';ev.message.records.forEach(function(rc){if(rc.recordType==='url'||rc.recordType==='text'){try{u=new TextDecoder(rc.encoding||'utf-8').decode(rc.data)}catch(x){}}});
    if(u&&u.indexOf(base)===0)onScan(u);else toast('Tag ignoré : ce n’est pas un lien de cette application.')};
  r.scan().then(function(){toast('Approche un tag NFC…')}).catch(function(){toast('NFC : lecture impossible ou refusée')})}
document.addEventListener('click',function(ev){var t=ev.target.closest('[data-act]');if(!t)return;var a=t.getAttribute('data-act'),k=t.getAttribute('data-k');
  if(a==='qrs'&&DB){ev.stopPropagation();var u='',ti='';if(k==='app'){u=location.origin+location.pathname;ti='Mon application';if(u.indexOf('http')!==0){u='';toast('Ouvre l’application depuis son adresse https pour créer ce code.');return}}else if(k==='vd'){var vl=vid(t.getAttribute('data-id'));if(vl&&!DB.set.phone){toast('Renseigne ton numéro dans Compte → Mon profil d’abord.');return}if(vl){u=vurl(vl);ti='Commande : '+vl.name}}else if(k==='lk'){u=S.lk&&S.lk.url||'';ti='Lien de commande'}else{var o=byId(t.getAttribute('data-id'));if(o){u=tlink(o,k);ti=(k==='t'?'Suivi client : ':'Mission livreur : ')+o.name}}if(u)qshow(ti,u);else toast('Lien indisponible.')}
  else if(a==='qrx'){ev.stopPropagation();if(k==='close')qclose();else if(k==='save'&&QO)dl(new Blob([QO._s],{type:'image/svg+xml'}),'qr-'+today()+'.svg');else if(k==='nfc'&&QO)nfcW(QO._u);else if(k==='read')nfcR()}
},true);

/* ===== v7.4 : scanner QR (caméra), tags NFC associés, diagnostic ===== */
var GO=Q.get('go')||'',SC_={s:null,raf:0,cb:null};
var opt=function(v,l){return '<option value="'+e(v)+'">'+e(l)+'</option>'};
function ovl(h){qclose();QO=document.createElement('div');QO.setAttribute('role','dialog');QO.style.cssText='position:fixed;top:0;right:0;bottom:0;left:0;z-index:100;background:rgba(0,0,0,.6);display:flex;align-items:center;justify-content:center;padding:16px;overflow:auto';QO.innerHTML='<div class="card" style="max-width:360px;width:100%;margin:0">'+h+'</div>';document.body.appendChild(QO);return QO}
function scnStop(){if(SC_.raf)cancelAnimationFrame(SC_.raf);SC_.raf=0;if(SC_.s){SC_.s.getTracks().forEach(function(t){t.stop()});SC_.s=null}}
function scnOpen(cb,title){
  ovl('<h2>'+e(title)+'</h2><video id="scv" playsinline muted style="width:100%;border-radius:12px;background:#000;max-height:45vh"></video><p class="mut" id="scm">Autorisation de la caméra…</p><label>Secours : colle ici le code ou le lien lu</label><input id="scman" autocomplete="off"><div class="btns"><button class="b" data-act="scm">Valider le code</button><button class="b pri" data-act="qrx" data-k="close">Fermer</button></div>');
  SC_.cb=cb;var m=$('scm');
  if(!window.isSecureContext||!navigator.mediaDevices||!navigator.mediaDevices.getUserMedia){m.textContent='Caméra indisponible (adresse https requise). Scanne avec l’appareil photo du téléphone, ou colle le code ci-dessous.';return}
  if(!('BarcodeDetector' in window)){m.textContent='Lecture automatique non prise en charge par ce navigateur : scanne avec l’appareil photo du téléphone (le lien s’ouvre seul) ou colle le code ci-dessous.';return}
  navigator.mediaDevices.getUserMedia({video:{facingMode:'environment'}}).then(function(s){
    var v=$('scv');if(!v){s.getTracks().forEach(function(t){t.stop()});return}
    SC_.s=s;v.srcObject=s;v.play();m.textContent='Vise le QR code.';
    var bd,busy=0;try{bd=new BarcodeDetector({formats:['qr_code']})}catch(x){m.textContent='Lecteur QR indisponible : colle le code ci-dessous.';scnStop();return}
    (function loop(){SC_.raf=requestAnimationFrame(loop);if(busy||v.readyState<2)return;busy=1;bd.detect(v).then(function(r){busy=0;if(r&&r[0]&&r[0].rawValue){var tx=r[0].rawValue,cb=SC_.cb;qclose();cb(tx)}}).catch(function(){busy=0})})();
  }).catch(function(x){m.textContent=x&&x.name==='NotAllowedError'?'Caméra refusée : autorise-la (cadenas de la barre d’adresse → Autorisations), ou colle le code.':'Caméra inaccessible : colle le code ci-dessous.'})}
function dq(s){try{return JSON.parse(decodeURIComponent(escape(atob(s))))}catch(x){return null}}
function openGo(g){var p=String(g||'').split('.'),ty=p[0],id=p.slice(1).join('.'),ok=false;
  if(ty==='ve'&&vid(id)){S.tab='vend';S.vsel=id;S.inv='';ok=true}
  else if(ty==='co'){var c=DB.cour.filter(function(x){return x.id===id})[0];if(c){S.tab='del';S.tf=c.name;S.trk='';S.vendor='';ok=true}}
  else if(ty==='cl'&&id){S.tab='ord';S.sub='list';S.q=id;S.vendor='';S.sf='';ok=true}
  else if(ty==='or'){var o=byId(id);if(o){S.vendor='';S.tf='';if(o.status==='Confirmé'){S.tab='del';S.trk=o.id}else{S.tab='ord';S.sub='list';S.q=o.phone;S.sf=''}ok=true}}
  if(!ok)toast('Fiche introuvable sur ce téléphone.');render()}
function deliverOk(dk){CS.ac=0;CS.dn=1;CS.s=3;try{var l=JSON.parse(localStorage.getItem('cod_cr')||'[]');l.push({d:today(),m:+dk.m||0});localStorage.setItem('cod_cr',JSON.stringify(l.slice(-200)))}catch(x){}conf();toast('Livraison validée ✓');renderCourier()}
function onScan(tx){tx=String(tx||'').trim();var dk=decq('l'),m=tx.match(/^AMK\|([\w-]+)\|(\d{6})$/),base=location.origin+location.pathname;
  if(m){if(!dk||dk.tid!==m[1])return toast('Ce QR de livraison ne correspond pas à cette mission.');if(CS.dn||CS.s===3)return toast('Livraison déjà validée.');if(!dk.db)return toast('Suivi en direct requis.');return sdel(dk,m[2],function(){deliverOk(dk)},function(){toast('Code invalide.')})}
  if(tx.indexOf(base)!==0)return toast('QR non reconnu : ce n’est pas un code de cette application.');
  var i=tx.indexOf('?'),q=new URLSearchParams(i<0?'':tx.slice(i+1).split('#')[0]),go=q.get('go'),l=dq(q.get('l')),tt=dq(q.get('t'));
  if(go){if(!DB)return toast('Ce code ouvre une fiche : utilise-le dans l’application du vendeur.');return openGo(go)}
  var d=l||tt;if(!d||!d.tid)return toast('Code illisible.');
  if(dk){if(!l)return toast('Ce code n’est pas une mission.');if(d.tid!==dk.tid)return toast('Ce colis n’est pas cette mission.');if((CS.s!=null?CS.s:dk.s)>=2)return toast('Colis déjà récupéré.');cfire('En cours');CS.s=2;toast('Colis récupéré ✓');return renderCourier()}
  if(!DB)return toast('Ouvre ce lien directement avec l’appareil photo du téléphone.');
  var o=DB.orders.filter(function(x){return x.tid===d.tid})[0];if(!o)return toast('Colis inconnu sur ce téléphone.');
  S.tab='del';S.trk=o.id;S.vendor='';S.tf='';
  if(l&&stage(o)===1){if(confirm('Colis de '+o.name+' remis au livreur ?')){setDel(o,'En cours');if(DB.set.db)pub(o);S.notif=o.id;save();toast('Statut : remis au livreur ✓')}}else if(l&&stage(o)>=2)toast('Déjà remis au livreur.');
  render()}
function tgopts(ty){var h='';if(ty==='ve')DB.vend.forEach(function(v){h+=opt(v.id,v.name)});else if(ty==='co')DB.cour.forEach(function(c){h+=opt(c.id,c.name)});else if(ty==='cl'){var s={};DB.orders.forEach(function(o){if(o.phone&&!s[o.phone]){s[o.phone]=1;h+=opt(o.phone,o.name+' · '+o.phone)}})}else DB.orders.slice(-60).reverse().forEach(function(o){h+=opt(o.id,o.name+' · '+(o.product||''))});return h||'<option value="">(aucun)</option>'}
function tagp(ty,id){ovl('<h2>Associer un tag NFC</h2><label>Type</label><select id="tg-t"><option value="ve">Vendeur</option><option value="co">Livreur</option><option value="cl">Client</option><option value="or">Commande</option></select><label>Élément</label><select id="tg-i"></select><p class="mut">Le tag contient un lien vers la fiche (aucune donnée personnelle). Il s’ouvre sur ce téléphone.</p><div class="btns"><button class="b pri" data-act="tgw">Écrire sur le tag</button><button class="b" data-act="tgq">QR code</button></div><button class="b full" data-act="qrx" data-k="close">Fermer</button>');
  $('tg-t').value=ty||'ve';$('tg-i').innerHTML=tgopts($('tg-t').value);if(id)$('tg-i').value=id}
function tgurl(){var i=$('tg-i').value;if(!i){toast('Aucun élément à associer.');return{}}return{u:location.origin+location.pathname+'?go='+$('tg-t').value+'.'+encodeURIComponent(i),l:$('tg-i').selectedOptions[0].text}}
function diag(){var ok=function(l,v){return '<div class="row" style="padding:4px 0"><span>'+l+'</span><b class="'+(v?'s-Confirmé':'s-Annulé')+'">'+(v?'✓ oui':'✗ non')+'</b></div>'};
  ovl('<h2>Diagnostic NFC &amp; QR</h2>'+ok('Adresse https',window.isSecureContext)+ok('NFC (Web NFC)','NDEFReader' in window)+ok('Caméra',!!(navigator.mediaDevices&&navigator.mediaDevices.getUserMedia))+ok('Lecture QR automatique','BarcodeDetector' in window)+ok('Firebase configuré',!!(DB&&DB.set.db))+'<div id="dgp"></div><p class="mut">Le NFC web fonctionne sur Chrome Android seulement. Sans lecture automatique, utilise l’appareil photo du téléphone.</p><button class="b pri full" data-act="qrx" data-k="close">Fermer</button>');
  ['camera','nfc'].forEach(function(n){try{navigator.permissions.query({name:n}).then(function(r){var x=$('dgp');if(x)x.insertAdjacentHTML('beforeend','<div class="mut">Permission '+(n==='nfc'?'NFC':'caméra')+' : '+r.state+'</div>')}).catch(function(){})}catch(x){}})}
document.addEventListener('click',function(ev){var t=ev.target.closest('[data-act]');if(!t)return;var a=t.getAttribute('data-act');
  if(['scn','scm','tagp','tgw','tgq','diag'].indexOf(a)<0)return;ev.stopPropagation();
  if(a==='scn')scnOpen(onScan,decq('l')?'Scanner le colis ou le QR du client':'Scanner un QR code');
  else if(a==='scm'){var v=($('scman').value||'').trim();if(v){qclose();onScan(v)}}
  else if(a==='tagp')tagp(t.getAttribute('data-t'),t.getAttribute('data-id'));
  else if(a==='tgw'||a==='tgq'){var u=tgurl();if(u.u){if(a==='tgw')nfcW(u.u);else qshow(u.l,u.u)}}
  else diag()},true);
document.addEventListener('change',function(ev){if(ev.target.id==='tg-t')$('tg-i').innerHTML=tgopts(ev.target.value)});
var _rd4=render;render=function(){_rd4();if(GO&&DB&&!S.locked){var g=GO;GO='';try{history.replaceState(null,'',location.pathname)}catch(x){}openGo(g)}};
var _rl3=renderCourier;renderCourier=function(){_rl3();if(!decq('l'))return;if(!$('scc'))$('app').insertAdjacentHTML('afterbegin','<div class="card" id="scc"><h2>Scanner</h2><div class="btns"><button class="b pri" data-act="scn">Scanner le colis</button><button class="b" data-act="scn">QR du client</button></div></div>')};
var _rc3=renderClient;renderClient=function(){_rc3();var d=decq('t');if(!d||!d.tid)return;var m=Object.assign({},d,CL);if(!m.bad&&(m.s||0)===2&&!$('cqr'))$('app').insertAdjacentHTML('beforeend','<div class="card" id="cqr" style="text-align:center"><h2>QR de livraison</h2><div style="background:#fff;padding:6px;border-radius:12px;width:min(70vw,240px);margin:0 auto">'+qrSvg('AMK|'+d.tid+'|'+dcode(d)).replace('<svg ','<svg style="display:block;width:100%;height:auto" ')+'</div><p class="mut">À montrer au livreur après avoir vérifié ton colis.</p></div>')};

boot();
if('serviceWorker' in navigator){window.addEventListener('load',function(){navigator.serviceWorker.register('sw.js').catch(function(){})})}

/* ===== 7.8 : accueil style marketplace (structure Jumia, couleurs premium) ===== */
(function(){
function MX(due,pe,gm,s,tr,tc){
  var hr=new Date().getHours(),nm=(DB.set.holder||'').trim().split(/\s+/)[0]||DB.set.pco||'Amk Logistique',sub=[DB.set.pt,DB.set.pco].filter(Boolean).join(' · ')||DB.set.phone||(pe.length+' commande(s) en attente'),now=new Date(),dt=now.toLocaleDateString('fr-FR')+' • '+now.toLocaleTimeString('fr-FR',{hour:'2-digit',minute:'2-digit'}),
  bt=function(l,t,p,x){return '<button class="b'+(p?' pri':'')+'" data-act="'+(x?'goto':'tab')+'" data-v="'+t+'"'+(x||'')+'>'+l+'</button>'},
  bx=function(i,l,v,i2,v2,l2){return '<div class="sbx"><div class="sb"><div class="si">'+ico(i)+'</div><span>'+l+'</span><b>'+v+'</b></div><div class="sb2"><div class="si2">'+ico(i2)+'</div><b>'+v2+'</b><span>'+l2+'</span></div></div>'},
  cd=function(t,sb,body,btns){return '<div class="mxc"><h2>'+t+'</h2><div class="mut">'+sb+'</div>'+body+'<div class="btns">'+btns+'</div></div>'};
  return '<div class="mx"><div class="gr">'+(hr<5||hr>=18?'Bonsoir':'Bonjour')+' '+e(nm)+'</div><div class="gs">'+e(sub)+'</div></div>'
   +'<div class="mxw"><div class="deck" id="deck">'
   +cd('Résumé du mois','Solde au <b style="color:#d4742a">'+dt+'</b>',bx('box','Confirmation',pct(s.ok,tr),'chart',fm(gm)+' <small>DH</small>','Gagné'),bt('Appels ('+due.length+')','calls',1)+bt('Relances','wa')+bt('Ajouter','ord',0,' data-s="add"'))
   +cd('Livraison','Ce mois-ci',bx('truck','Taux de livraison',pct(s.liv,s.liv+s.ref),'box',(s.ref||0)+' <small>refusées</small>','Refus'),bt('Suivi','del',1)+bt('Preuves & avis','pod'))
   +cd('Finances','Ce mois-ci',bx('chart','À encaisser',fm(tc||0)+' <small>DH</small>','store',DB.vend.length,'Vendeurs'),bt('Finances','fin',1))
   +'</div><div class="dots" id="mdots"><i class="on"></i><i></i><i></i></div></div>';
}
function deckInit(){var d=$('deck'),md=$('mdots');if(!d)return;var cs=[].slice.call(d.children),o=cs.map(function(_,i){return i}),x0=null,top=function(){return cs[o[0]]},
  pos=function(){o.forEach(function(ci,p){cs[ci].setAttribute('data-p',p);cs[ci].style.transform=''});if(md)[].forEach.call(md.children,function(x,k){x.className=k===o[0]?'on':''})},next=function(){o.push(o.shift());pos()};
  pos();
  d.addEventListener('pointerdown',function(ev){if(ev.target.closest('button,a'))return;var c=ev.target.closest('.mxc');if(c!==top())return;x0=ev.clientX;c.classList.add('drag');try{c.setPointerCapture(ev.pointerId)}catch(x){}});
  d.addEventListener('pointermove',function(ev){if(x0===null)return;var dx=ev.clientX-x0;top().style.transform='translateX('+dx+'px) rotate('+dx/18+'deg)'});
  var up=function(ev){if(x0===null)return;var dx=ev.clientX-x0,c=top();x0=null;c.classList.remove('drag');
    if(Math.abs(dx)>70){c.style.transform='translateX('+(dx>0?130:-130)+'%) rotate('+(dx>0?18:-18)+'deg)';setTimeout(function(){c.style.transition='none';next();void c.offsetWidth;c.style.transition=''},260)}else c.style.transform=''};
  d.addEventListener('pointerup',up);d.addEventListener('pointercancel',up);
  if(md)[].forEach.call(md.children,function(x,k){x.addEventListener('click',function(){var n=0;while(o[0]!==k&&n++<3)next()})})}
var _rh=render;
var NM=['Automatisations actives','Pour commencer'];
function crds(){return [].slice.call($('app').querySelectorAll('.card')).filter(function(c){var h=c.querySelector('h2');return h&&NM.indexOf(h.textContent.trim())>=0})}
render=function(){
  var au=(S.tab==='auto'&&DB&&!S.locked&&!Q.get('v'));
  if(au)S.tab='home';
  _rh();
  if(au){S.tab='auto';var A=$('app'),c=crds().sort(function(x,y){return NM.indexOf(x.querySelector('h2').textContent.trim())-NM.indexOf(y.querySelector('h2').textContent.trim())});
    A.innerHTML='<button class="b full sm" data-act="tab" data-v="more" style="margin-bottom:10px">← Compte</button><div class="sec">Rappels, suivi & relances</div>';
    c.forEach(function(x){A.appendChild(x)});
    [].forEach.call($('nav').children,function(b){b.classList.toggle('on',b.getAttribute('data-v')==='more')});return}
  if(!DB||S.locked||Q.get('t')||Q.get('l')||Q.get('v')||S.tab!=='home')return;
  crds().forEach(function(x){x.remove()});
  [].slice.call($('app').children).forEach(function(c){c.remove()});
  var o=DB.orders,mo=today().slice(0,7),pe=o.filter(function(x){return x.status==='En attente'}),due=pe.filter(callDue),
  om=o.filter(function(x){return (x.date||'').slice(0,7)===mo}),s=stats(om),tr=s.n-s.pe,
  gm=o.filter(function(x){return (x.cdate||'').slice(0,7)===mo}).reduce(function(a,x){return a+earned(x)},0),
  tc=0;DB.vend.forEach(function(v){var b=vbal(v).bal;if(b<0)tc-=b});
  var h=MX(due,pe,gm,s,tr,tc);
  $('app').insertAdjacentHTML('afterbegin',h);
  deckInit();
  };
})();

/* ===== 7.9 : menu langue (FR / AR / EN / Tamazight) ===== */
(function(){
var R=[
"Accueil¦Home¦الرئيسية","Appels¦Calls¦المكالمات","Commandes¦Orders¦الطلبات","Livraison¦Delivery¦التوصيل","Compte¦Account¦الحساب","Vendeurs¦Sellers¦البائعون","Finances¦Finance¦المالية",
"Résumé du mois¦Monthly summary¦ملخص الشهر","Taux de livraison¦Delivery rate¦نسبة التسليم","refusées¦refused¦مرفوضة","Ce mois-ci¦This month¦هذا الشهر","Suivi en direct de tes livreurs¦Live tracking of your couriers¦تتبع مباشر لموزعيك","Livraisons¦Deliveries¦التوصيلات","Chez tes vendeurs¦With your sellers¦لدى البائعين","Confirmation¦Confirmation¦التأكيد","Gagné ce mois¦Earned this month¦أرباح هذا الشهر","Confirmation (mois)¦Confirmation (month)¦التأكيد (الشهر)","Livraison (mois)¦Delivery (month)¦التوصيل (الشهر)",
"Ajouter¦Add¦إضافة","Appeler¦Call¦اتصال","Appeler →¦Call →¦اتصال ←","Voir les finances →¦View finances →¦عرض المالية ←","Voir les livraisons →¦View deliveries →¦عرض التوصيلات ←","À appeler maintenant¦To call now¦للاتصال الآن",
"Aucun appel urgent, tout est à jour¦No urgent calls, all up to date¦لا مكالمات عاجلة، كل شيء محدّث","Rechercher une commande, un client…¦Search an order or a customer…¦ابحث عن طلب أو عميل…","TON ACTIVITÉ, EN DIRECT¦YOUR ACTIVITY, LIVE¦نشاطك مباشرةً",
"Programmés¦Scheduled¦مجدولة","Rappels à venir¦Upcoming reminders¦تذكيرات قادمة","À encaisser¦To collect¦للتحصيل","Chez les vendeurs¦With sellers¦لدى البائعين","Taux de confirmation¦Confirmation rate¦نسبة التأكيد","Appels à passer¦Calls to make¦مكالمات للإجراء",
"Ajoute ta première commande pour la voir ici.¦Add your first order to see it here.¦أضف أول طلب لتراه هنا.","Solde au¦Balance as of¦الرصيد في","Outils QR & NFC¦QR & NFC tools¦أدوات QR وNFC","Partager, scanner, associer un tag¦Share, scan, link a tag¦مشاركة، مسح، ربط وسم",
"En attente¦Pending¦قيد الانتظار","Confirmé¦Confirmed¦مؤكد","Annulé¦Cancelled¦ملغى","Injoignable¦Unreachable¦لا يمكن الوصول إليه","Livré¦Delivered¦تم التسليم","Refusé¦Refused¦مرفوض","En cours¦In progress¦قيد التنفيذ",
"Vendeur¦Seller¦البائع","Nom du client¦Customer name¦اسم العميل","Téléphone (06… ou 07…)¦Phone (06… or 07…)¦الهاتف (06… أو 07…)","Produit¦Product¦المنتج","Adresse¦Address¦العنوان","Ville¦City¦المدينة","Montant à encaisser (dh)¦Amount to collect (MAD)¦المبلغ المطلوب تحصيله (درهم)","Canal de vente¦Sales channel¦قناة البيع",
"Une commande¦One order¦طلب واحد","Coller des commandes WhatsApp¦Paste WhatsApp orders¦لصق طلبات واتساب","Liste ou fichier¦List or file¦قائمة أو ملف","Nom¦Name¦الاسم","Client¦Customer¦العميل","Date¦Date¦التاريخ","Montant¦Amount¦المبلغ","Note¦Note¦ملاحظة","Total¦Total¦المجموع","Téléphone¦Phone¦الهاتف","Aucune commande.¦No orders.¦لا توجد طلبات.",
"Enregistrer¦Save¦حفظ","Supprimer¦Delete¦حذف","Modifier¦Edit¦تعديل","Fermer¦Close¦إغلاق","Copier¦Copy¦نسخ","Valider¦Confirm¦تأكيد","Ignorer¦Ignore¦تجاهل","Appliquer¦Apply¦تطبيق","Commander¦Order¦اطلب","Envoyer au client¦Send to customer¦إرسال إلى العميل","Liste¦List¦القائمة","Tous les statuts¦All statuses¦كل الحالات",
"Confirmer¦Confirm¦تأكيد","Appels à passer¦Calls to make¦مكالمات للإجراء","Relances WhatsApp¦WhatsApp follow-ups¦متابعات واتساب","Suivi des colis¦Parcel tracking¦تتبع الطرود","Preuves & avis¦Proofs & reviews¦الإثباتات والآراء","Résultats¦Results¦النتائج","Rapport hebdo¦Weekly report¦التقرير الأسبوعي","Carnet¦Notebook¦الدفتر","Nouveau prospect¦New prospect¦عميل محتمل جديد","Contacts¦Contacts¦جهات الاتصال","Ajouter¦Add¦إضافة","Affaires¦Deals¦الصفقات","Simulateur de marge¦Margin simulator¦محاكي الهامش","Pilotage de l’activité¦Business management¦تسيير النشاط","Développement commercial¦Business development¦التطوير التجاري","Prospection¦Prospecting¦التنقيب عن العملاء","Profil & paramètres¦Profile & settings¦الملف والإعدادات","Paramètres¦Settings¦الإعدادات","Vendeurs partenaires¦Partner sellers¦البائعون الشركاء","Finances & soldes¦Finance & balances¦المالية والأرصدة","Catalogue produits¦Product catalogue¦كتالوج المنتجات","Réseau professionnel¦Professional network¦الشبكة المهنية","Affaires & marges¦Deals & margins¦الصفقات والهوامش","Prévisions de revenus¦Revenue forecast¦توقعات الدخل","Partenariat livraison¦Delivery partnership¦شراكة التوصيل","Codes QR & étiquettes NFC¦QR codes & NFC tags¦رموز QR وعلامات NFC","Carnet de prospects¦Prospect notebook¦دفتر العملاء المحتملين","Mon profil¦My profile¦ملفي","Tarifs & messages¦Rates & messages¦التعريفات والرسائل","Sécurité & données¦Security & data¦الأمان والبيانات","Connexions¦Connections¦الاتصالات","Activité¦Activity¦النشاط","Automatisations actives¦Active automations¦الأتمتة المفعّلة","Rappels, suivi & relances¦Reminders, tracking & follow-ups¦التذكيرات والمتابعة","Profil¦Profile¦الملف الشخصي","Ajouter à mes contacts¦Add to my contacts¦إضافة إلى جهات الاتصال","Partager¦Share¦مشاركة","Mes informations¦My information¦معلوماتي","Enregistrer mon profil¦Save my profile¦حفظ ملفي","Choisir une photo¦Choose a photo¦اختيار صورة","Changer la photo¦Change photo¦تغيير الصورة","Retirer¦Remove¦إزالة","Fonction¦Role¦الوظيفة","Société¦Company¦الشركة","E-mail¦E-mail¦البريد الإلكتروني",
"Réglages¦Settings¦الإعدادات","Sécurité¦Security¦الأمان","Données¦Data¦البيانات","Tarifs¦Rates¦التعريفات","Messages¦Messages¦الرسائل","Livreurs¦Couriers¦الموزعون","Livreur¦Courier¦الموزع","Catalogue¦Catalogue¦الكتالوج","Réseau¦Network¦الشبكة","Simulation¦Simulation¦محاكاة","Calculatrice¦Calculator¦آلة حاسبة","Portefeuille¦Portfolio¦المحفظة","Nouvel appel¦New call¦مكالمة جديدة","Affaires¦Deals¦الصفقات",
"Gestion¦Management¦الإدارة","Outils terrain¦Field tools¦أدوات ميدانية","Ventes & marché¦Sales & market¦المبيعات والسوق","Pilotage¦Steering¦المتابعة والتخطيط","Administration¦Administration¦الإدارة العامة","Boutiques et commissions¦Shops and commissions¦المتاجر والعمولات","Gains, soldes, exports¦Earnings, balances, exports¦الأرباح والأرصدة والتصدير","Rappels, suivi, avis clients¦Reminders, tracking, reviews¦تذكيرات، تتبع، آراء العملاء",
"Automatisations & avis¦Automations & reviews¦الأتمتة والآراء","Automatisations¦Automations¦الأتمتة","Satisfaction clients¦Customer satisfaction¦رضا العملاء","Pour commencer¦Getting started¦للبدء","← Compte¦← Account¦→ الحساب","← Plus¦← More¦→ المزيد","← Retour¦← Back¦→ رجوع","Suivi de commande¦Order tracking¦تتبع الطلب",
"Attribuer un livreur automatiquement (par ville, le moins chargé)¦Assign a courier automatically (by city, least loaded)¦تعيين موزع تلقائياً (حسب المدينة، الأقل انشغالاً)","Publier le suivi à chaque étape¦Publish tracking at each step¦نشر التتبع في كل مرحلة","Me rappeler les appels à passer¦Remind me of calls to make¦ذكّرني بالمكالمات المطلوبة","Sauvegarde automatique chaque semaine (si pas de code)¦Automatic weekly backup (if no code)¦نسخ احتياطي أسبوعي تلقائي (بدون رمز)","Valider moi-même les livraisons signalées à distance (anti-fraude, conseillé)¦Validate remotely reported deliveries myself (anti-fraud, recommended)¦أتحقق بنفسي من التسليمات المبلغ عنها عن بُعد (مكافحة الاحتيال، مُوصى به)",
"Rien à envoyer pour le moment.¦Nothing to send for now.¦لا شيء للإرسال حالياً.","WhatsApp s’ouvre avec le message prêt : tu n’as qu’à appuyer sur Envoyer.¦WhatsApp opens with the message ready: just tap Send.¦يفتح واتساب والرسالة جاهزة: اضغط فقط على إرسال.","Les avis des clients apparaîtront ici après les livraisons suivies en direct.¦Customer reviews will appear here after live-tracked deliveries.¦ستظهر آراء العملاء هنا بعد التسليمات المتتبعة مباشرةً.",
"1) Crée un vendeur dans Vendeurs. 2) Ajoute ses commandes dans Commandes → Ajouter (une, collées de WhatsApp ou par liste). 3) Appelle dans l’onglet Appels. Chaque vendeur a 30 commandes d’essai gratuites.¦1) Create a seller in Sellers. 2) Add their orders in Orders → Add (one, pasted from WhatsApp, or by list). 3) Call from the Calls tab. Each seller gets 30 free trial orders.¦1) أنشئ بائعاً في البائعين. 2) أضف طلباته في الطلبات ← إضافة (طلب واحد، أو لصق من واتساب، أو قائمة). 3) اتصل من تبويب المكالمات. لكل بائع 30 طلباً تجريبياً مجانياً."];
var LN={en:{},ar:{}};
R.forEach(function(l){var p=l.split('¦');LN.en[p[0]]=p[1];LN.ar[p[0]]=p[2]});
var GM={en:['Good evening ','Good morning '],ar:['مساء الخير ','صباح الخير ']};
var PT=[[/^(\d+) commande\(s\) à appeler maintenant$/,{en:function(m){return m[1]+' order(s) to call now'},ar:function(m){return m[1]+' طلب(ات) للاتصال الآن'}}],
 [/^(\d+) (?:commande\(s\) )?en attente$/,{en:function(m){return m[1]+' pending'},ar:function(m){return m[1]+' قيد الانتظار'}}],
 [/^(Bonsoir|Bonjour) (.+)$/,{en:function(m){return GM.en[m[1]==='Bonsoir'?0:1]+m[2]},ar:function(m){return GM.ar[m[1]==='Bonsoir'?0:1]+m[2]}}]];
function tr(s,l){var k=s.trim();if(!k)return null;var d=LN[l],v=d&&d[k];if(v)return s.replace(k,function(){return v});
  for(var i=0;i<PT.length;i++){var m=PT[i][0].exec(k),f=PT[i][1][l];if(m&&f)return s.replace(k,function(){return f(m)})}return null}
function walk(r,l){if(!r)return;var w=document.createTreeWalker(r,NodeFilter.SHOW_TEXT,null),n,L=[];
  while(n=w.nextNode()){var p=n.parentNode&&n.parentNode.nodeName;if(p!=='SCRIPT'&&p!=='STYLE'&&p!=='TEXTAREA')L.push(n)}
  L.forEach(function(n){var t=tr(n.nodeValue,l);if(t)n.nodeValue=t});
  [].forEach.call(r.querySelectorAll('[placeholder],[aria-label],[title]'),function(x){['placeholder','aria-label','title'].forEach(function(a){var v=x.getAttribute(a),t=v&&tr(v,l);if(t)x.setAttribute(a,t)})})}
window.trAll=function(r){var l=(DB&&DB.set.lang)||'fr';if(l!=='fr')walk(r,l)};var CD={fr:'FR',ar:'AR',en:'EN'},_rl=render;
render=function(){_rl();if(!DB||S.locked)return;var l=DB.set.lang||'fr';if(l==='tz'){l=DB.set.lang='fr';save()}
  document.documentElement.dir=l==='ar'?'rtl':'ltr';document.documentElement.lang=l;
  var hl=$('hl');if(hl)hl.textContent=CD[l]||'FR';if(l!=='fr'){walk($('app'),l);walk($('nav'),l)}};
document.addEventListener('click',function(ev){var t=ev.target,m=document.querySelector('.lgm');
  if(t.closest&&t.closest('#hl')){ev.stopImmediatePropagation();ev.preventDefault();if(m){m.remove();return}
    m=document.createElement('div');m.className='lgm';var c=DB&&DB.set.lang||'fr';
    m.innerHTML=[['fr','Français'],['ar','العربية'],['en','English']].map(function(x){return '<button data-l="'+x[0]+'"'+(c===x[0]?' class="on"':'')+'>'+x[1]+(c===x[0]?' ✓':'')+'</button>'}).join('');
    document.body.appendChild(m);return}
  var b=t.closest&&t.closest('.lgm button');
  if(b){ev.stopImmediatePropagation();ev.preventDefault();DB.set.lang=b.getAttribute('data-l');save();m.remove();render();return}
  if(m)m.remove()},true);
})();

/* ===== 8.0 : suivi façon Waze + scooter / voiture réalistes ===== */
var SCT='<svg viewBox="0 0 40 64" width="30" height="48"><ellipse cx="20" cy="36" rx="15" ry="27" fill="#000" opacity=".28"/><rect x="17" y="2" width="6" height="13" rx="3" fill="#111"/><rect x="5" y="14" width="30" height="4" rx="2" fill="#333"/><circle cx="5" cy="16" r="2.4" fill="#111"/><circle cx="35" cy="16" r="2.4" fill="#111"/><rect x="14" y="17" width="12" height="30" rx="6" fill="#374151"/><rect x="7" y="42" width="26" height="18" rx="3" fill="#b8921f" stroke="#f6dc85" stroke-width="1.2"/><path d="M12 17Q12 27 16 29M28 17Q28 27 24 29" fill="none" stroke="#0b1b3f" stroke-width="4" stroke-linecap="round"/><ellipse cx="20" cy="31" rx="9" ry="7" fill="#0b1b3f"/><circle cx="20" cy="26" r="6.5" fill="#f6dc85" stroke="#111" stroke-width="1"/><path d="M15.5 24.5Q20 21 24.5 24.5L24.5 26Q20 23.5 15.5 26Z" fill="#111"/><circle cx="20" cy="4" r="2" fill="#fff8c0"/><rect x="16" y="60" width="8" height="2" rx="1" fill="#ef4444"/></svg>';
var CAR2='<svg viewBox="0 0 40 76" width="32" height="60"><ellipse cx="20" cy="40" rx="17" ry="35" fill="#000" opacity=".28"/><rect x="1" y="13" width="6" height="14" rx="2" fill="#111"/><rect x="33" y="13" width="6" height="14" rx="2" fill="#111"/><rect x="1" y="50" width="6" height="14" rx="2" fill="#111"/><rect x="33" y="50" width="6" height="14" rx="2" fill="#111"/><rect x="5" y="3" width="30" height="70" rx="12" fill="#14213d" stroke="#f6dc85" stroke-width="1.3"/><path d="M9 22Q20 16 31 22L29 31H11Z" fill="#9fd3ff"/><rect x="10" y="31" width="20" height="18" rx="3" fill="#1c2d52"/><rect x="14" y="37" width="12" height="5" rx="1" fill="#f6dc85"/><path d="M11 49H29L31 58Q20 62 9 58Z" fill="#7fb6e6"/><rect x="8" y="4" width="7" height="3" rx="1.5" fill="#fff8c0"/><rect x="25" y="4" width="7" height="3" rx="1.5" fill="#fff8c0"/><rect x="8" y="68" width="7" height="2.5" rx="1" fill="#ef4444"/><rect x="25" y="68" width="7" height="2.5" rx="1" fill="#ef4444"/><rect x="1" y="24" width="5" height="4" rx="1.5" fill="#14213d"/><rect x="34" y="24" width="5" height="4" rx="1.5" fill="#14213d"/></svg>';
function vehOf(n){var c=DB&&DB.cour.filter(function(x){return x.name===n})[0];return c&&c.veh||'moto'}
function vhsel(w){return '<label>Véhicule</label><select data-vh="'+w.id+'"><option value="moto"'+(w.veh!=='car'?' selected':'')+'>🛵 Scooter</option><option value="car"'+(w.veh==='car'?' selected':'')+'>🚗 Voiture</option></select>'}
function brg(a,b){var r=Math.PI/180,dl=(b[1]-a[1])*r,y=Math.sin(dl)*Math.cos(b[0]*r),x=Math.cos(a[0]*r)*Math.sin(b[0]*r)-Math.sin(a[0]*r)*Math.cos(b[0]*r)*Math.cos(dl);return (Math.atan2(y,x)/r+360)%360}
function lsc(v){return L.divIcon({className:'lsc',html:'<div class="vh"><span class="pulse"></span>'+(v==='car'?CAR2:SCT)+'</div>',iconSize:[46,46],iconAnchor:[23,23]})}
function lrot(mk,h){var el=mk.getElement(),v=el&&el.firstChild;if(v)v.style.transform='rotate('+h+'deg)'}
function lanim(mk,line,x,l){var d=[0],i;for(i=1;i<line.length;i++)d.push(d[i-1]+hav(line[i-1],line[i]));LM.anims.push({mk:mk,line:line,d:d,tot:d[d.length-1]||1,x:x,l:l})}
function lstep(ts){
  if(!LM.el||!LM.el.isConnected){LM.anim=0;return}
  LM.anims.forEach(function(a){var D=a.x.sim?Math.min(70000,Math.max(18000,a.tot*2500)):16000,p=((ts%D)/D)*a.tot,i=1;while(i<a.d.length-1&&a.d[i]<p)i++;var s0=a.d[i-1],f=Math.max(0,Math.min(1,(p-s0)/Math.max(1e-6,a.d[i]-s0))),A=a.line[i-1],B=a.line[i],q=[A[0]+(B[0]-A[0])*f,A[1]+(B[1]-A[1])*f],rs=[q].concat(a.line.slice(i));
    a.mk.setLatLng(q);lrot(a.mk,brg(A,B));a.l.rest.setLatLngs(rs);a.l.flow.setLatLngs(rs);a.l.done.setLatLngs(a.line.slice(0,i).concat([q]));
    var rm=1-p/a.tot;if(LM.chip)LM.chip.textContent=(a.x.ve==='car'?'🚗 ':'🛵 ')+Math.max(1,Math.round((a.x.mn||a.tot*1.6)*rm))+' min · '+((a.x.km||a.tot)*rm).toFixed(1).replace('.',',')+' km';
    if(rm<.06&&!LM.zd){LM.zd=1;poiZoom(a.line[a.line.length-1])}if(rm>.5&&LM.zd===1){LM.zd=0;poiOff()}
    if(LM.follow&&!LM.zd){var z=LM.fz||15;if(LM.map.getZoom()!==z)LM.map.setZoom(z,{animate:false});LM.map.panTo(q,{animate:false})}});
  LM.anim=requestAnimationFrame(lstep);
}
function lmDraw(){
  var sp=LM.spec,g=LM.g,all=[];g.clearLayers();LM.anims=[];if(LM.anim){cancelAnimationFrame(LM.anim);LM.anim=0}
  if(!LM.chip||!LM.chip.isConnected){LM.chip=document.createElement('div');LM.chip.className='lchip';LM.el.appendChild(LM.chip)}
  LM.chip.style.display=sp.routes.length===1&&sp.routes[0].s===2?'':'none';
  sp.routes.forEach(function(r){
    var line=r.road||[r.a,r.b],sl=function(c,w,o,x){return L.polyline(line,Object.assign({color:c,weight:w,opacity:o,lineCap:'round',lineJoin:'round'},x||{})).addTo(g)};
    sl('#0b1f5c',12,.92);var l={rest:sl('#22d3ee',7,1),flow:sl('#ffffff',3,.95,{dashArray:'1 14',className:'rflow'}),done:L.polyline(r.s===3?line:[],{color:'#9aa4b2',weight:7,opacity:.95,lineCap:'round'}).addTo(g)};
    if(r.s===3){l.rest.setLatLngs([]);l.flow.setLatLngs([])}
    L.marker(r.a,{icon:lpin('#16a34a',r.an)}).addTo(g);L.marker(r.b,{icon:lpin('#dc2626',r.bn)}).addTo(g);all.push(r.a,r.b);
    var mk=L.marker(r.s===3?r.b:r.a,{icon:lsc(r.ve),zIndexOffset:1000,interactive:false}).addTo(g);
    if(r.s===2){if(r.live){var pv=LM.lv;mk.setLatLng(r.live);if(pv&&hav(pv,r.live)>.005)lrot(mk,brg(pv,r.live));LM.lv=r.live;var kk=hav(r.live,r.b)*1.25;LM.chip.textContent=(r.ve==='car'?'🚗 ':'🛵 ')+Math.max(1,Math.round(kk*(r.ve==='car'?1.2:1.6)))+' min · '+kk.toFixed(1).replace('.',',')+' km';if(LM.follow)LM.map.panTo(r.live,{animate:false})}else lanim(mk,line,r,l)}
    else lrot(mk,brg(r.a,r.b));
  });
  if(sp.gps){L.circleMarker(sp.gps,{radius:8,color:'#ffffff',weight:3,fillColor:'#3b82f6',fillOpacity:1}).addTo(g);all.push(sp.gps)}
  if(LM.key!==sp.key){LM.key=sp.key;if(all.length)LM.map.fitBounds(all,{padding:[50,50],maxZoom:13});else LM.map.setView([31.8,-7.1],5)}
  if(LM.anims.length)LM.anim=requestAnimationFrame(lstep);
}
document.addEventListener('click',function(ev){var b=ev.target.closest&&ev.target.closest('[data-lf]');if(!b||!LM.map)return;
  LM.follow=!LM.follow;b.classList.toggle('on',LM.follow);if(LM.follow){var t0=LM.anims[0]&&LM.anims[0].tot;LM.fz=t0?(t0<12?17:t0<60?15:13):15;LM.map.setZoom(LM.fz,{animate:false})}else rr()},true);
document.addEventListener('change',function(ev){var t=ev.target,id=t.getAttribute&&t.getAttribute('data-vh');if(!id)return;
  var c=DB.cour.filter(function(x){return x.id===id})[0];if(c){c.veh=t.value;save();render()}},true);

/* ===== 8.1 : diagnostic : bandeau d'erreur + secours des onglets ===== */
(function(){
function show(m){var d=document.getElementById('errb');if(!d){d=document.createElement('div');d.id='errb';d.style.cssText='position:fixed;left:8px;right:8px;top:8px;z-index:999;background:#7f1d1d;color:#fff;padding:10px 12px;border-radius:12px;font-size:12px;line-height:1.35;word-break:break-word';d.onclick=function(){d.remove()};document.body.appendChild(d)}d.textContent='Erreur : '+m+' (touche pour fermer)'}
window.addEventListener('error',function(e){show((e.message||'')+' [ligne '+(e.lineno||'?')+']')});
window.addEventListener('unhandledrejection',function(e){show(String(e.reason&&e.reason.message||e.reason))});
document.addEventListener('click',function(ev){var b=ev.target.closest&&ev.target.closest('#nav [data-act=tab]');if(!b||!DB)return;var v=b.getAttribute('data-v');
  setTimeout(function(){if(S.tab!==v&&!(v==='more'&&S.tab==='auto')){S.tab=v;S.pview='';S.del='';S.vsel='';S.inv='';S.vform=false;S.edit='';S.cx='';try{render()}catch(x){show(x.message)}}},80)});
})();

/* ===== 8.2 : simulation de trajet, zoom véhicule, véhicules détaillés, Waze / Google Maps ===== */
SCT='<svg viewBox="0 0 44 88" width="36" height="72"><defs><linearGradient id="sg" x1="0" x2="1"><stop offset="0" stop-color="#6b7280"/><stop offset=".5" stop-color="#e5e7eb"/><stop offset="1" stop-color="#6b7280"/></linearGradient><linearGradient id="sj" x1="0" x2="1"><stop offset="0" stop-color="#0b1b3f"/><stop offset=".5" stop-color="#27427a"/><stop offset="1" stop-color="#0b1b3f"/></linearGradient><radialGradient id="sh" cx=".4" cy=".35"><stop offset="0" stop-color="#fff8d6"/><stop offset="1" stop-color="#d4af37"/></radialGradient></defs><ellipse cx="22" cy="48" rx="17" ry="38" fill="#000" opacity=".3"/><rect x="18.5" y="2" width="7" height="15" rx="3.5" fill="#0d0d0d"/><path d="M19 5h6M19 9h6M19 13h6" stroke="#333" stroke-width=".8"/><rect x="19.5" y="14" width="5" height="14" rx="2" fill="#9ca3af"/><path d="M12 22Q22 18 32 22L31 28Q22 25 13 28Z" fill="url(#sg)" stroke="#4b5563" stroke-width=".6"/><path d="M3 24H12M32 24H41" stroke="#111" stroke-width="3" stroke-linecap="round"/><path d="M5 22l-3 4h6zM39 22l3 4h-6z" fill="#9ca3af"/><circle cx="22" cy="21" r="2.4" fill="#fff8c0"/><path d="M11 27Q22 31 33 27L34 50Q22 54 10 50Z" fill="url(#sg)" stroke="#4b5563" stroke-width=".7"/><path d="M7 27Q8 36 13 38M37 27Q36 36 31 38" fill="none" stroke="#1e3a8a" stroke-width="5.5" stroke-linecap="round"/><path d="M14 38H30L31 52H13Z" fill="#111827"/><ellipse cx="22" cy="35" rx="10.5" ry="7.5" fill="url(#sj)" stroke="#0b1b3f" stroke-width=".8"/><circle cx="22" cy="29.5" r="6.3" fill="url(#sh)" stroke="#6b5200" stroke-width=".9"/><path d="M17 27.6Q22 24.4 27 27.6L26.6 29.4Q22 27.2 17.4 29.4Z" fill="#0b1220"/><rect x="9" y="54" width="26" height="20" rx="4" fill="#b8921f" stroke="#f6dc85" stroke-width="1.3"/><path d="M12 57h20" stroke="#fff3b0" stroke-width="1.4" opacity=".7"/><rect x="18" y="62" width="8" height="8" rx="1.5" fill="#8a6a12"/><rect x="18" y="72" width="8" height="12" rx="4" fill="#0d0d0d"/><rect x="16" y="75" width="12" height="2.4" rx="1.2" fill="#ef4444"/></svg>';
CAR2='<svg viewBox="0 0 44 90" width="40" height="82"><defs><linearGradient id="cb" x1="0" x2="1"><stop offset="0" stop-color="#8a939f"/><stop offset=".5" stop-color="#f7f9fb"/><stop offset="1" stop-color="#7f8894"/></linearGradient><linearGradient id="cg" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#5b7fa3"/><stop offset="1" stop-color="#14263d"/></linearGradient></defs><ellipse cx="22" cy="47" rx="21" ry="42" fill="#000" opacity=".3"/><rect x="0.5" y="14" width="6.5" height="17" rx="3" fill="#0d0d0d"/><rect x="37" y="14" width="6.5" height="17" rx="3" fill="#0d0d0d"/><rect x="0.5" y="58" width="6.5" height="17" rx="3" fill="#0d0d0d"/><rect x="37" y="58" width="6.5" height="17" rx="3" fill="#0d0d0d"/><path d="M10 4Q22 -1 34 4Q41 12 41 26V66Q41 80 34 86Q22 91 10 86Q3 80 3 66V26Q3 12 10 4Z" fill="url(#cb)" stroke="#6b7480" stroke-width=".9"/><path d="M9 20Q22 15 35 20M12 12Q22 9 32 12" fill="none" stroke="#c4ccd5" stroke-width=".8"/><path d="M9 31Q22 25 35 31L33 44H11Z" fill="url(#cg)" stroke="#0b1220" stroke-width=".6"/><path d="M14 30Q22 27.5 30 30" stroke="#fff" stroke-width="1" opacity=".5" fill="none"/><rect x="11" y="44" width="22" height="19" rx="5" fill="#eef1f4" stroke="#b6bec8" stroke-width=".7"/><path d="M14 47h16" stroke="#fff" stroke-width="1.6" opacity=".9"/><rect x="15" y="52" width="14" height="5.5" rx="1.5" fill="#f6dc85" stroke="#8a6a12" stroke-width=".7"/><path d="M11 63H33L35 73Q22 78 9 73Z" fill="url(#cg)" stroke="#0b1220" stroke-width=".6"/><path d="M8 33L10 63M36 33L34 63" stroke="#14263d" stroke-width="2.6"/><path d="M3 34L-.5 36.5L3 39ZM41 34L44.5 36.5L41 39Z" fill="#cfd5dc" stroke="#6b7480" stroke-width=".5"/><path d="M8 6Q13 3.5 18 4.6L17 8.5Q12 8.5 8 10Z" fill="#fffbe0" stroke="#d6c46a" stroke-width=".5"/><path d="M36 6Q31 3.5 26 4.6L27 8.5Q32 8.5 36 10Z" fill="#fffbe0" stroke="#d6c46a" stroke-width=".5"/><path d="M8 82Q13 85 18 84.4L17 81Q12 81 8 79Z" fill="#dc2626"/><path d="M36 82Q31 85 26 84.4L27 81Q32 81 36 79Z" fill="#dc2626"/></svg>';
var SIM={on:0,a:'Casablanca',b:'Rabat',v:'car',id:0};
function simSpec(){var A=cfind(SIM.a)||CITIES.casablanca,B=SIM.b==='_same'?null:cfind(SIM.b),a=[A[0],A[1]],b=B?[B[0],B[1]]:[A[0]+.022,A[1]+.03];roadGet(a,b);var rd=ROAD[ck(a,b)];
  return {routes:[{a:a,b:b,an:A[2]+(B?'':' · centre'),bn:B?B[2]:A[2]+' · quartier',s:2,live:null,road:rd?rd.pts:null,ve:SIM.v,km:rd?rd.km:0,mn:rd?rd.min:0,sim:1}],gps:null,key:'sim'+SIM.id+(rd?'r':'')}}
var _ls=lspec;lspec=function(m){return SIM.on?simSpec():_ls(m)};
function simUI(){var o=function(l,v,s){return '<option'+(v!==undefined?' value="'+v+'"':'')+(s?' selected':'')+'>'+l+'</option>'},cs=MCN.map(function(c){return o(c,undefined,c===SIM.a)}).join(''),
  ds=o('Même ville','_same',SIM.b==='_same')+MCN.map(function(c){return o(c,undefined,c===SIM.b)}).join(''),sp=LM.spec&&LM.spec.routes[0],lk='';
  if(sp){var d=sp.b.join(','),s0=sp.a.join(',');lk='<a class="b" target="_blank" rel="noopener" href="https://waze.com/ul?ll='+d+'&navigate=yes">Waze</a><a class="b" target="_blank" rel="noopener" href="https://www.google.com/maps/dir/?api=1&origin='+s0+'&destination='+d+'&travelmode=driving">Google Maps</a>'}
  return '<div class="sim"><b>🎬 Simulation de trajet</b><div class="srow"><select data-sim="a">'+cs+'</select><span>→</span><select data-sim="b">'+ds+'</select></div><div class="srow"><select data-sim="v">'+o('🛵 Moto','moto',SIM.v==='moto')+o('🚗 Voiture','car',SIM.v==='car')+'</select><button class="b pri" data-sim="go">'+(SIM.on?'■ Arrêter':'▶ Lancer')+'</button></div>'+(lk?'<div class="srow">'+lk+'</div>':'')+'</div>'}
function vsc(){if(!LM.map||!LM.el)return;var z=LM.map.getZoom();LM.el.style.setProperty('--vs',Math.min(2.6,Math.max(.9,(z-11)*.32+.6)));var t=LM.anims[0]&&LM.anims[0].tot;if(SIM.on&&t)LM.fz=t<12?17:t<60?15:13;if(!LM.zb){LM.zb=1;LM.map.on('zoomend',vsc)}}
var _ld=lmDraw;lmDraw=function(){_ld();vsc()};
document.addEventListener('click',function(ev){var b=ev.target.closest&&ev.target.closest('[data-sim=go]');if(!b)return;SIM.on=SIM.on?0:1;SIM.id++;LM.follow=!!SIM.on;LM.key='';render()},true);
document.addEventListener('change',function(ev){var t=ev.target,k=t.getAttribute&&t.getAttribute('data-sim');if(!k||k==='go')return;SIM[k]=t.value;if(SIM.on)SIM.id++;LM.key='';render()},true);

/* ===== 8.3 : zoom sur la destination (maison, immeuble, commerces de proximité) ===== */
var PK={cafe:['☕','Café'],restaurant:['🍽️','Restaurant'],fast_food:['🍔','Fast-food'],bank:['🏦','Banque'],atm:['🏦','Distributeur'],pharmacy:['💊','Pharmacie'],bakery:['🥖','Boulangerie'],hairdresser:['💈','Coiffeur'],beauty:['💅','Salon de beauté'],barber:['💈','Coiffeur'],supermarket:['🛒','Supermarché'],convenience:['🛒','Épicerie'],grocery:['🛒','Épicerie'],greengrocer:['🥕','Primeur'],butcher:['🥩','Boucherie'],clothes:['👕','Vêtements'],mobile_phone:['📱','Téléphonie'],kiosk:['🏪','Kiosque']};
function poiParse(j,d){var bl=null,L=[];(j.elements||[]).forEach(function(x){var t=x.tags||{};
  if(x.type==='way'&&t.building){var g=(x.geometry||[]).map(function(p){return [p.lat,p.lon]});if(!bl||g.length>bl.g.length)bl={t:t,g:g};return}
  if(x.type==='node'){var k=t.amenity&&PK[t.amenity]?t.amenity:t.shop&&PK[t.shop]?t.shop:null,p=k?PK[k]:t.shop?['🏪','Commerce']:null;if(!p)return;L.push({ic:p[0],lb:p[1],n:t.name||'',m:Math.round(hav(d,[x.lat,x.lon])*1000),ll:[x.lat,x.lon]})}});
  L.sort(function(a,b){return a.m-b.m});
  var b=bl&&bl.t.building,lv=bl&&parseInt(bl.t['building:levels']),ty=!bl?['📍','Adresse']:/^(house|detached|semidetached_house|terrace|bungalow|villa)$/.test(b)?['🏠','Maison']:/^(apartments|residential|dormitory|flats)$/.test(b)||lv>=4?['🏢','Immeuble']:/^(commercial|retail|supermarket|kiosk|shop)$/.test(b)?['🏪','Local commercial']:lv&&lv<=2?['🏠','Maison probable']:['🏢','Bâtiment'];
  return {ty:ty,g:bl?bl.g:null,L:L.slice(0,8)}}
function poiOff(){if(LM.pg){LM.pg.clearLayers()}if(LM.pbox)LM.pbox.style.display='none'}
function poiZoom(d){if(!LM.map)return;LM.zd=LM.zd||2;if(!LM.pg)LM.pg=L.layerGroup().addTo(LM.map);if(!LM.pbox||!LM.pbox.isConnected){LM.pbox=document.createElement('div');LM.pbox.className='poibox';LM.el.appendChild(LM.pbox)}
  poiOff();LM.pbox.style.display='';LM.pbox.innerHTML='<b>📍 Destination</b><div>Recherche des lieux autour…</div>';LM.map.setView(d,18,{animate:true});
  var kk=d[0].toFixed(4)+','+d[1].toFixed(4),go=function(r){if(!LM.pg||!LM.zd)return;poiOff();LM.pbox.style.display='';
    if(r.g)L.polygon(r.g,{color:'#d4af37',weight:3,fillColor:'#f6dc85',fillOpacity:.4}).addTo(LM.pg);
    L.marker(d,{icon:L.divIcon({className:'poi',html:'<div class="pm big"><b>'+r.ty[0]+'</b><i>'+r.ty[1]+'</i></div>',iconSize:[44,44],iconAnchor:[22,22]}),zIndexOffset:900}).addTo(LM.pg);
    r.L.forEach(function(p){L.marker(p.ll,{icon:L.divIcon({className:'poi',html:'<div class="pm"><b>'+p.ic+'</b><i>'+e(p.n||p.lb)+'</i></div>',iconSize:[34,34],iconAnchor:[17,17]})}).addTo(LM.pg)});
    LM.pbox.innerHTML='<b>'+r.ty[0]+' '+r.ty[1]+'</b>'+(r.L.length?r.L.slice(0,5).map(function(p){return '<div>'+p.ic+' '+e(p.n||p.lb)+' · '+p.m+' m</div>'}).join(''):'<div>Aucun commerce repéré à proximité.</div>')};
  LM.pc=LM.pc||{};if(LM.pc[kk])return go(LM.pc[kk]);
  var q='[out:json][timeout:12];(way(around:35,'+d[0]+','+d[1]+')[building];node(around:120,'+d[0]+','+d[1]+')[amenity~"^(cafe|restaurant|fast_food|bank|atm|pharmacy|bakery)$"];node(around:120,'+d[0]+','+d[1]+')[shop];);out geom 60;';
  fetch('https://overpass-api.de/api/interpreter',{method:'POST',body:'data='+encodeURIComponent(q)}).then(function(r){return r.json()}).then(function(j){var r=poiParse(j,d);LM.pc[kk]=r;go(r)}).catch(function(){if(LM.pbox)LM.pbox.innerHTML='<b>📍 Destination</b><div>Détails indisponibles (connexion ou service saturé). Réessaie.</div>'})}
document.addEventListener('click',function(ev){var b=ev.target.closest&&ev.target.closest('[data-poi]');if(!b||!LM.map)return;
  if(LM.zd){LM.zd=0;poiOff();LM.key='';rr();return}
  var sp=LM.spec&&LM.spec.routes[0];if(sp){LM.follow=false;poiZoom(sp.b)}},true);

/* ===== 8.5 : rapport de la semaine (volumes, motifs, meilleur créneau, conseils, économie) ===== */
function wkData(){var f=new Date(new Date(today()+'T12:00:00').getTime()-6*864e5).toISOString().slice(0,10),o=DB.orders.filter(function(x){return (x.date||'')>=f}),
  c=function(fn){return o.filter(fn).length},n=o.length,ok=c(function(x){return x.status==='Confirmé'}),an=c(function(x){return x.status==='Annulé'}),inj=c(function(x){return x.status==='Injoignable'}),pe=c(function(x){return x.status==='En attente'}),
  liv=c(function(x){return x.delivery==='Livré'}),ref=c(function(x){return x.delivery==='Refusé'}),V=[],B=[],R={};for(var i=0;i<24;i++)V.push(0);for(i=0;i<8;i++)B.push([0,0]);
  o.forEach(function(x){var h=new Date(x.ts||0).getHours();V[h]++;var b=B[Math.floor(h/3)];b[0]++;if(x.status==='Confirmé')b[1]++;if(x.status==='Annulé'&&x.reason)R[x.reason]=(R[x.reason]||0)+1});
  var S=B.map(function(b,k){return {k:k,n:b[0],r:b[0]?Math.round(100*b[1]/b[0]):0}}).filter(function(s){return s.n>=3}).sort(function(x,y){return y.r-x.r}),
  rs=Object.keys(R).sort(function(x,y){return R[y]-R[x]});
  return {n:n,ok:ok,an:an,inj:inj,pe:pe,liv:liv,ref:ref,V:V,best:S[0],worst:S[S.length-1],rs:rs.slice(0,3).map(function(k){return [k,R[k]]}),f:f}}
function rapTips(w){var t=[],sl=function(s){return s.k*3+'h–'+(s.k*3+3)+'h'};
  if(w.best&&w.worst&&w.best.k!==w.worst.k&&w.best.r-w.worst.r>=20)t.push('Les commandes passées entre '+sl(w.best)+' confirment à '+w.best.r+' % contre '+w.worst.r+' % entre '+sl(w.worst)+' : appelle les premières en priorité.');
  if(w.inj>=3)t.push(w.inj+' clients injoignables : rappelle-les à un autre horaire (le soir) ou envoie le message WhatsApp.');
  if(w.rs.length)t.push('Motif n°1 d’annulation : « '+w.rs[0][0]+' » ('+w.rs[0][1]+'). Traite-le dans ton script ou sur la fiche produit.');
  if(w.liv+w.ref>=3&&w.ref/(w.liv+w.ref)>.15)t.push('Taux de refus à la livraison de '+Math.round(100*w.ref/(w.liv+w.ref))+' % : valide toi-même les livraisons signalées à distance et rappelle le client avant le passage du livreur.');
  if(w.pe>=5)t.push(w.pe+' commandes sont encore en attente : appelle-les avant qu’elles ne refroidissent.');
  return t.length?t:['Rien d’alarmant cette semaine, continue comme ça.']}
function rapHTML(){var w=wkData(),p=function(a,b){return b?Math.round(100*a/b)+' %':'—'},mx=Math.max.apply(null,w.V.concat([1])),tips=rapTips(w),
  txt='📊 Rapport 7 jours : '+w.n+' commandes, '+w.ok+' confirmées ('+p(w.ok,w.n)+'), '+w.an+' annulées, '+w.inj+' injoignables. Livrées : '+w.liv+', refusées : '+w.ref+'.\n'+tips.map(function(x,i){return (i+1)+'. '+x}).join('\n');
  return '<button class="b full sm" data-act="tab" data-v="more" style="margin-bottom:10px">← Compte</button><div class="sec">Rapport de la semaine</div><div class="mut" style="margin:-6px 0 10px">Du '+w.f.split('-').reverse().join('/')+' à aujourd’hui</div>'
  +'<div class="card rp"><div class="rg2"><div><b>'+w.n+'</b><span>Reçues</span></div><div><b>'+w.ok+'</b><span>Confirmées · '+p(w.ok,w.n)+'</span></div><div><b>'+w.an+'</b><span>Annulées · '+p(w.an,w.n)+'</span></div><div><b>'+w.inj+'</b><span>Injoignables</span></div><div><b>'+w.liv+'</b><span>Livrées</span></div><div><b>'+w.ref+'</b><span>Refusées</span></div></div></div>'
  +'<div class="card"><h2>Quand tes clients commandent</h2><div class="bars">'+w.V.map(function(v,h){return '<i style="height:'+Math.max(4,Math.round(100*v/mx))+'%"'+(h>=20||h<3?' class="n"':'')+' title="'+h+'h : '+v+'"></i>'}).join('')+'</div><div class="bl"><span>0h</span><span>6h</span><span>12h</span><span>18h</span><span>23h</span></div><div class="mut">Barres dorées : le soir et la nuit (20h à 3h).</div></div>'
  +(w.rs.length?'<div class="card"><h2>Motifs d’annulation</h2>'+w.rs.map(function(r){return '<div class="row"><span>'+e(r[0])+'</span><b>'+r[1]+'</b></div>'}).join('')+'</div>':'')
  +'<div class="card"><h2>💡 Recommandations</h2>'+tips.map(function(x){return '<p style="margin:8px 0">• '+e(x)+'</p>'}).join('')+'</div>'
  +'<div class="card"><h2>💰 Économie estimée</h2><p style="margin:6px 0">En gérant toi-même tes confirmations, tu évites au moins <b>'+fm(w.liv*5)+' DH</b> cette semaine, sur la base de 5 DH par commande livrée (tarif de départ d’un centre d’appel au Maroc).</p><div class="mut">Estimation indicative : les tarifs réels varient selon le volume et l’offre.</div></div>'
  +'<a class="b pri full" target="_blank" rel="noopener" style="display:block;text-align:center;text-decoration:none" href="https://wa.me/?text='+encodeURIComponent(txt)+'">Partager le rapport sur WhatsApp</a>'}
var _r5=render;
render=function(){var rp=S.tab==='rap'&&DB&&!S.locked&&!Q.get('v');if(rp)S.tab='more';_r5();
  if(rp){S.tab='rap';$('app').innerHTML=rapHTML();[].forEach.call($('nav').children,function(b){b.classList.toggle('on',b.getAttribute('data-v')==='more')})}};

/* ===== 8.6 : WhatsApp en un mot + mémo de rappel intégré ===== */
function waMsg(o){return 'Bonjour '+o.name+' 👋 C’est '+(o.vendor||'votre boutique')+'.\nVotre commande : '+(o.product||'—')+(o.amount?' · '+fm(o.amount)+' DH':'')+(o.city?' · livraison à '+o.city:'')+'.\nRépondez par UN mot :\n✅ OUI pour confirmer\n❌ NON pour annuler\n✏️ MODIFIER pour changer l’adresse ou le produit\n(نعم = تأكيد · لا = إلغاء)\nMerci !'}
function waHref(o){return 'https://wa.me/'+waNum(o.phone)+'?text='+encodeURIComponent(waMsg(o))}
function hhmm(t){return new Date(t).toLocaleTimeString('fr-FR',{hour:'2-digit',minute:'2-digit'})}
function memoLines(){return DB.orders.filter(function(o){return o.status==='En attente'}).sort(function(x,y){return (x.cb||0)-(y.cb||0)}).slice(0,8).map(function(o){return '• '+o.name+' · '+(o.product||'—')+' · '+(callDue(o)?'à rappeler maintenant':'rappel à '+hhmm(o.cb))+(o.wa?' (WhatsApp envoyé)':'')})}
function memoTxt(){var m=memoLines();return m.length?'\n\n🔔 Mémo de rappel :\n'+m.join('\n'):''}
function waHTML(){var P=DB.orders.filter(function(o){return o.status==='En attente'}),sent=P.filter(function(o){return o.wa}).sort(function(x,y){return x.wa-y.wa}),todo=P.filter(function(o){return !o.wa}).slice(0,15),
  ago=function(t){var m=Math.round((Date.now()-t)/6e4);return m<60?m+' min':Math.floor(m/60)+' h'};
  return '<button class="b full sm" data-act="tab" data-v="more" style="margin-bottom:10px">← Compte</button><div class="sec">Relances WhatsApp</div><div class="mut" style="margin:-6px 0 10px">Envoie le message, le client répond OUI / NON / MODIFIER, et tu touches sa réponse ici.</div>'
  +'<div class="card"><h2>🔔 Mémo de rappel</h2>'+(sent.length?sent.map(function(o){return '<div class="wi"><b>'+e(o.name)+'</b><div class="mut">'+e(o.product||'—')+' · envoyé il y a '+ago(o.wa)+' · '+(callDue(o)?'<b style="color:#c2410c">⏰ à relancer</b>':'relance à '+hhmm(o.cb))+'</div><div class="wbt"><button class="b" data-wr="'+o.id+'|OUI">✅ OUI</button><button class="b" data-wr="'+o.id+'|NON">❌ NON</button><button class="b" data-wr="'+o.id+'|MOD">✏️ Modifier</button><a class="b" href="tel:'+e(o.phone)+'" style="text-decoration:none;text-align:center">📞</a></div></div>'}).join(''):'<div class="mut">Aucun message en attente de réponse.</div>')
  +(sent.length?'<a class="b full" target="_blank" rel="noopener" style="display:block;text-align:center;text-decoration:none;margin-top:8px" href="https://wa.me/?text='+encodeURIComponent('🔔 Mémo de rappel :\n'+memoLines().join('\n'))+'">Partager mon mémo sur WhatsApp</a>':'')+'</div>'
  +'<div class="card"><h2>À envoyer ('+todo.length+')</h2>'+(todo.length?todo.map(function(o){return '<div class="wi"><div class="row"><b>'+e(o.name)+'</b><span class="mut">'+(o.amount?fm(o.amount)+' DH':'')+'</span></div><div class="mut">'+e(o.product||'—')+(o.city?' · '+e(o.city):'')+'</div><div class="wbt"><a class="b pri" data-wa="'+o.id+'" target="_blank" rel="noopener" href="'+waHref(o)+'" style="text-decoration:none;text-align:center">Envoyer sur WhatsApp</a></div></div>'}).join(''):'<div class="mut">Toutes les commandes en attente ont déjà reçu le message.</div>')+'</div>'}
var _r6=render;
render=function(){var w=S.tab==='wa'&&DB&&!S.locked&&!Q.get('v');if(w)S.tab='more';_r6();
  if(w){S.tab='wa';$('app').innerHTML=waHTML();[].forEach.call($('nav').children,function(b){b.classList.toggle('on',b.getAttribute('data-v')==='more')})}};
document.addEventListener('click',function(ev){var t=ev.target,b=t.closest&&t.closest('[data-wa]'),r=t.closest&&t.closest('[data-wr]');
  if(b){var o=DB.orders.filter(function(x){return x.id===b.getAttribute('data-wa')})[0];if(o){o.wa=Date.now();o.cb=Date.now()+2*36e5;o.note=(o.note?o.note+' · ':'')+'WhatsApp envoyé '+hhmm(o.wa);save();setTimeout(render,400)}return}
  if(r){var p=r.getAttribute('data-wr').split('|'),q=DB.orders.filter(function(x){return x.id===p[0]})[0];if(!q)return;ev.preventDefault();
    if(p[1]==='OUI')setStatus(q,'Confirmé');else if(p[1]==='NON'){setStatus(q,'Annulé');q.reason='Client a répondu NON (WhatsApp)'}else{q.cb=Date.now()+30*6e4;q.note=(q.note?q.note+' · ':'')+'Client veut modifier'}
    save();render()}},true);

/* ===== 8.7 : preuve de livraison (photo + heure + GPS), sondage 1-5, effets premium ===== */
function burst(){try{navigator.vibrate&&navigator.vibrate(25)}catch(x){}var d=document.createElement('div');d.className='cf';for(var i=0;i<24;i++){var s=document.createElement('i');s.style.cssText='--x:'+Math.round(Math.random()*260-130)+'px;--y:'+Math.round(-110-Math.random()*150)+'px;--r:'+Math.round(Math.random()*720-360)+'deg;background:'+['#f6dc85','#d4af37','#22d3ee','#3fae7f','#fff'][i%5]+';animation-delay:'+(Math.random()*.1).toFixed(2)+'s';d.appendChild(s)}document.body.appendChild(d);setTimeout(function(){d.remove()},1500)}
var _ss=setStatus;setStatus=function(o,s){_ss(o,s);if(s==='Confirmé')burst()};
var _sd=setDel;setDel=function(o,d){_sd(o,d);if(d==='Livré')burst()};
function img2(f,txt,done){var r=new FileReader();r.onload=function(){var im=new Image();im.onload=function(){var k=Math.min(1,560/Math.max(im.width,im.height)),c=document.createElement('canvas'),w=Math.round(im.width*k),h=Math.round(im.height*k);c.width=w;c.height=h;var x=c.getContext('2d');x.drawImage(im,0,0,w,h);x.fillStyle='rgba(0,0,0,.6)';x.fillRect(0,h-26,w,26);x.fillStyle='#fff';x.font='bold 12px sans-serif';x.fillText(txt,8,h-9);done(c.toDataURL('image/jpeg',.62))};im.src=r.result};r.readAsDataURL(f)}
function svMsg(o){return 'Bonjour '+o.name+', merci pour votre commande ('+(o.product||'—')+') 🙏\nSur une échelle de 1 à 5 ⭐ (5 = excellent), comment s’est passée la livraison ?\nRépondez simplement par un chiffre.\n(من 1 إلى 5 ⭐)'}
function podHTML(){var O=DB.orders,rt=O.filter(function(o){return rating(o)}),avg=rt.length?(rt.reduce(function(s,o){return s+rating(o)},0)/rt.length).toFixed(1).replace('.',','):'—',np=O.filter(function(o){return o.pod}).length,
  tp=O.filter(function(o){return o.status==='Confirmé'&&o.delivery!=='Refusé'}).sort(function(x,y){return (x.pod?1:0)-(y.pod?1:0)}).slice(0,12),dv=O.filter(function(o){return o.delivery==='Livré'}).slice(0,12),
  st=function(n){return '★★★★★'.slice(0,n)+'☆☆☆☆☆'.slice(0,5-n)};
  return '<button class="b full sm" data-act="tab" data-v="more" style="margin-bottom:10px">← Compte</button><div class="sec">Preuves de livraison & avis clients</div>'
  +satc()
  +'<div class="card"><h2>📸 Preuves de livraison ('+np+')</h2><div class="mut" style="margin-bottom:6px">Photo du colis remis, horodatée avec l’heure et la position GPS : elle règle les litiges.</div>'
  +(tp.length?tp.map(function(o){return '<div class="wi"><div class="row"><b>'+e(o.name)+'</b><span class="mut">'+e(o.city||'')+(o.amount?' · '+fm(o.amount)+' DH':'')+'</span></div>'
    +(o.pod?'<img class="pod" src="'+o.pod.i+'" alt="Preuve"><div class="mut">✅ '+new Date(o.pod.ts).toLocaleString('fr-FR')+(o.pod.g?' · '+e(o.pod.g):'')+'</div><div class="wbt"><button class="b" data-ps="'+o.id+'">Partager</button><label class="b">Refaire<input type="file" accept="image/*" capture="environment" hidden data-pod="'+o.id+'"></label></div>'
     :'<div class="wbt"><label class="b pri">📸 Prendre la photo<input type="file" accept="image/*" capture="environment" hidden data-pod="'+o.id+'"></label></div>')+'</div>'}).join(''):'<div class="mut">Aucune commande confirmée à prouver pour le moment.</div>')+'</div>'
  +'<div class="card"><h2>⭐ Sondages de satisfaction</h2>'+(dv.length?dv.map(function(o){return '<div class="wi"><div class="row"><b>'+e(o.name)+'</b><span class="mut">'+e(o.product||'')+'</span></div>'
    +(rating(o)?'<div style="color:#d4af37;font-size:20px;letter-spacing:2px">'+st(rating(o))+'</div>'
     :(o.sv?'<div class="mut">Sondage envoyé : touche la note reçue</div><div class="wbt">'+[1,2,3,4,5].map(function(n){return '<button class="b" data-rt="'+o.id+'|'+n+'">'+n+'⭐</button>'}).join('')+'</div>'
      :'<div class="wbt"><a class="b pri" data-sv="'+o.id+'" target="_blank" rel="noopener" href="https://wa.me/'+waNum(o.phone)+'?text='+encodeURIComponent(svMsg(o))+'" style="text-decoration:none;text-align:center">Envoyer le sondage WhatsApp</a></div>'))+'</div>'}).join(''):'<div class="mut">Les commandes livrées apparaîtront ici pour envoyer le sondage.</div>')+'</div>'}
var _r7=render;
render=function(){var w=S.tab==='pod'&&DB&&!S.locked&&!Q.get('v');if(w)S.tab='more';_r7();
  if(w){S.tab='pod';$('app').innerHTML=podHTML();[].forEach.call($('nav').children,function(b){b.classList.toggle('on',b.getAttribute('data-v')==='more')})}};
function oid(i){return DB.orders.filter(function(x){return x.id===i})[0]}
document.addEventListener('change',function(ev){var t=ev.target,id=t.getAttribute&&t.getAttribute('data-pod'),o=id&&oid(id),f=t.files&&t.files[0];if(!o||!f)return;
  var go=function(p){var ts=Date.now(),g=p?p.coords.latitude.toFixed(5)+','+p.coords.longitude.toFixed(5):'';img2(f,new Date(ts).toLocaleString('fr-FR')+(g?' · '+g:''),function(d){o.pod={i:d,ts:ts,g:g};save();render();burst()})};
  if(navigator.geolocation)navigator.geolocation.getCurrentPosition(go,function(){go(null)},{timeout:4000,maximumAge:60000});else go(null)},true);
document.addEventListener('click',function(ev){var t=ev.target,q=t.closest&&t.closest('[data-sv]'),r=t.closest&&t.closest('[data-rt]'),s=t.closest&&t.closest('[data-ps]');
  if(q){var o=oid(q.getAttribute('data-sv'));if(o){o.sv=Date.now();save();setTimeout(render,400)}return}
  if(r){var p=r.getAttribute('data-rt').split('|'),x=oid(p[0]);if(x){x.rate=+p[1];x.rts=Date.now();save();render();if(x.rate>=4)burst()}return}
  if(s){var y=oid(s.getAttribute('data-ps'));if(!y||!y.pod)return;fetch(y.pod.i).then(function(b){return b.blob()}).then(function(b){var f=new File([b],'preuve-'+y.name+'.jpg',{type:'image/jpeg'});
    if(navigator.canShare&&navigator.canShare({files:[f]}))navigator.share({files:[f],text:'Preuve de livraison · '+y.name+' · '+new Date(y.pod.ts).toLocaleString('fr-FR')});else{var l=document.createElement('a');l.href=y.pod.i;l.download=f.name;l.click()}})}},true);

/* ===== 8.8 : sous-onglets (une vue à la fois : on supprime la surcharge) ===== */
var _r8=render,TMAP={wa:['calls',1],rap:['fin',1],pod:['del',1],wn:['wl',1]},ST={},TB={calls:{f:waHTML,n:['📞 Appels à passer','💬 Relances WhatsApp']},del:{f:podHTML,n:['🛵 Suivi des colis','📸 Preuves & avis']},fin:{f:rapHTML,n:['💰 Résultats','📊 Rapport hebdo']},wl:{f:wnew,n:['📒 Carnet','➕ Nouveau prospect']},net:{f:netAdd,n:['👥 Contacts','➕ Ajouter']},deals:{f:margev,n:['🤝 Affaires','🧮 Simulateur de marge']}};
render=function(){if(TMAP[S.tab]){ST[TMAP[S.tab][0]]=TMAP[S.tab][1];S.tab=TMAP[S.tab][0]}
  _r8();if(!DB||S.locked||Q.get('t')||Q.get('l')||Q.get('v'))return;
  var T=TB[S.tab],A=$('app');if(!T||!A)return;var i=ST[S.tab]||0,w0=document.createElement('div'),w1=document.createElement('div');
  w0.id='st0';w1.id='st1';[].slice.call(A.children).forEach(function(c){w0.appendChild(c)});
  w1.innerHTML=T.f().replace(/<button class="b full sm"[^>]*>← Compte<\/button>/,'');w0.hidden=!!i;w1.hidden=!i;
  A.insertAdjacentHTML('afterbegin','<div class="seg">'+T.n.map(function(t,k){return '<button data-st="'+k+'"'+(k===i?' class="on"':'')+'>'+t+'</button>'}).join('')+'</div>');
  A.appendChild(w0);A.appendChild(w1);if(window.trAll)window.trAll(w1)};
document.addEventListener('click',function(ev){var b=ev.target.closest&&ev.target.closest('[data-st]');if(!b)return;var i=+b.getAttribute('data-st');ST[S.tab]=i;
  [].forEach.call(b.parentNode.children,function(x,k){x.className=k===i?'on':''});var a0=$('st0'),a1=$('st1');if(a0)a0.hidden=!!i;if(a1)a1.hidden=!i;
  window.scrollTo({top:0});if(typeof LM!=='undefined'&&LM.map)setTimeout(function(){LM.map.invalidateSize()},60)},true);

/* ===== 8.9 : Commandes compactes + Compte en sous-onglets ===== */
var SG={more:0},MG=[['Gestion',['Pilotage de l’activité','Développement commercial']],['Terrain',['Outils terrain','Prospection']],['Paramètres',['Profil & paramètres']]];
function cptSeg(A,i){var cur=-1;[].slice.call(A.children).forEach(function(c){if(c.classList&&c.classList.contains('sec')){var t=(c.textContent||'').trim();cur=-1;MG.forEach(function(g,k){if(g[1].indexOf(t)>=0)cur=k})}c.hidden=cur>=0&&cur!==i})}
function ordCompact(A){[].slice.call(A.querySelectorAll('.card')).forEach(function(c){var s=c.querySelector('select[data-st]');if(!s||c.querySelector('details.oc2'))return;
  var ch=[].slice.call(c.children),k=-1;ch.forEach(function(x,j){if(x===s||x.contains(s))k=j});var rest=ch.slice(k+1);if(!rest.length)return;
  var d=document.createElement('details');d.className='oc2';d.innerHTML='<summary>Détails & actions</summary>';rest.forEach(function(x){d.appendChild(x)});c.appendChild(d)})}
var _r9=render;
render=function(){_r9();if(!DB||S.locked||Q.get('t')||Q.get('l')||Q.get('v'))return;var A=$('app');if(!A)return;
  if(S.tab==='more'){var i=SG.more||0;A.insertAdjacentHTML('afterbegin','<div class="seg">'+MG.map(function(g,k){return '<button data-sg="'+k+'"'+(k===i?' class="on"':'')+'>'+g[0]+'</button>'}).join('')+'</div>');cptSeg(A,i)}
  else if(S.tab==='ord'&&S.sub!=='add')ordCompact(A)};
document.addEventListener('click',function(ev){var b=ev.target.closest&&ev.target.closest('[data-sg]');if(!b)return;SG.more=+b.getAttribute('data-sg');render();window.scrollTo({top:0})},true);

/* ===== 8.9b : All In One · Amk Logistique : code limité à 3 essais, empreinte / visage, import automatique ===== */
var _sd0=sdel;
function attGet(t){try{var r=JSON.parse(localStorage.getItem('cod_att_'+t)||'{"n":0,"u":0}');return r.u&&r.u<Date.now()?{n:0,u:0}:r}catch(x){return {n:0,u:0}}}
function attLeft(t){return Math.max(0,3-attGet(t).n)}
sdel=function(dk,code,ok,ko){var r=attGet(dk.tid);if(r.n>=3)return ko(429);
  _sd0(dk,code,function(){try{localStorage.removeItem('cod_att_'+dk.tid)}catch(x){}ok()},function(st){if(st!==0){r.n++;r.u=Date.now()+18e5;try{localStorage.setItem('cod_att_'+dk.tid,JSON.stringify(r))}catch(x){}return ko(r.n>=3?429:st)}ko(st)})};
function rnd(n){return crypto.getRandomValues(new Uint8Array(n))}
function kvPut(k,v){return idbOpen().then(function(d){return new Promise(function(res,rej){var tx=d.transaction('kv','readwrite');v===null?tx.objectStore('kv').delete(k):tx.objectStore('kv').put(v,k);tx.oncomplete=res;tx.onerror=rej})})}
function kvGet(k){return idbOpen().then(function(d){return new Promise(function(res,rej){var q=d.transaction('kv').objectStore('kv').get(k);q.onsuccess=function(){q.result?res(q.result):rej()};q.onerror=rej})})}
function bioEnable(){if(!K)return toast('Crée d’abord un code PIN (Compte → Admin → Sécurité).');if(!window.PublicKeyCredential||!navigator.credentials)return toast('Appareil non compatible.');
  navigator.credentials.create({publicKey:{challenge:rnd(32),rp:{name:'All In One · Amk Logistique'},user:{id:rnd(16),name:'amk',displayName:'Amk Logistique'},pubKeyCredParams:[{type:'public-key',alg:-7},{type:'public-key',alg:-257}],authenticatorSelection:{authenticatorAttachment:'platform',userVerification:'required'},timeout:60000}})
   .then(function(c){return kvPut('bioK',K).then(function(){localStorage.setItem('cod_bio',b64(new Uint8Array(c.rawId)));toast('Empreinte / visage activés ✅');render()})}).catch(function(){toast('Activation annulée ou impossible.')})}
function bioOff(){try{localStorage.removeItem('cod_bio')}catch(x){}kvPut('bioK',null).catch(function(){});toast('Empreinte / visage désactivés.');render()}
function bioUnlock(){var id=localStorage.getItem('cod_bio');if(!id||!ST)return;
  navigator.credentials.get({publicKey:{challenge:rnd(32),allowCredentials:[{type:'public-key',id:ub64(id)}],userVerification:'required',timeout:60000}}).then(function(){return kvGet('bioK')})
   .then(function(k){return crypto.subtle.decrypt({name:'AES-GCM',iv:ub64(ST.iv)},k,ub64(ST.ct)).then(function(pt){DB=fix(JSON.parse(dec.decode(pt)));K=k;SALT=ub64(ST.salt);CIT=ST.it||IT;S.locked=false;S.msg='';render()})})
   .catch(function(){S.msg='Empreinte / visage indisponible : utilise ton code.';render()})}
var IMPB=0;
function impPull(man){var db=DB&&DB.set.db,k=DB&&DB.set.ikey;if(!db||!k||IMPB)return man&&toast('Renseigne d’abord le lien Firebase (Compte → Paramètres → Connexions).');IMPB=1;var u=db.replace(/\/$/,'')+'/import/'+k;
  fetch(u+'.json').then(function(r){return r.json()}).then(function(d){IMPB=0;if(!d||typeof d!=='object')return man&&toast('Aucune nouvelle commande.');var n=0,x=0;
    Object.keys(d).slice(0,50).forEach(function(id){var o=cxIn(d[id]||{}),r=(o.xid&&xidHas(o.xid))?'dup':addOrder(String(o.vendor||DB.set.ivendor||'Boutique').slice(0,60),String(o.name||'').slice(0,80),String(o.phone||''),String(o.product||'').slice(0,120),String(o.address||'').slice(0,160),{city:String(o.city||'').slice(0,40),amount:+o.amount||0,channel:String(o.source||'Import').slice(0,30),xid:String(o.xid||'')});
      r==='ok'?n++:x++;fetch(u+'/'+encodeURIComponent(id)+'.json',{method:'DELETE'}).catch(function(){})});
    if(n){save();render();toast(n+' commande(s) importée(s) ✅')}else if(man)toast(x+' ignorée(s) (doublon ou numéro invalide).')}).catch(function(){IMPB=0;man&&toast('Import impossible : vérifie ta connexion.')})}
var _ra=render;
render=function(){_ra();
  if(S.locked||!DB){if(localStorage.getItem('cod_bio')&&!$('bio-btn')){var c=document.querySelector('.lock .card');if(c)c.insertAdjacentHTML('afterbegin','<button class="b pri full" id="bio-btn" data-bio="unlock" style="margin-bottom:12px">🔐 Empreinte / visage</button>')}return}
  if(!window.__impT){window.__impT=setInterval(function(){if(!document.hidden&&DB)impPull()},60000);setTimeout(function(){impPull()},2500)}
};
document.addEventListener('click',function(ev){var t=ev.target.closest&&ev.target.closest('[data-bio],[data-imp]');if(!t)return;
  if(t.hasAttribute('data-imp'))return impPull(1);var v=t.getAttribute('data-bio');v==='on'?bioEnable():v==='off'?bioOff():bioUnlock()},true);
document.addEventListener('change',function(ev){var t=ev.target;if(!DB||!t.id)return;if(t.id==='iem'){DB.set.iemail=t.value.trim().slice(0,80);save()}else if(t.id==='ivd'){DB.set.ivendor=t.value.trim().slice(0,60);save()}},true);

/* ===== 8.6.0 : carte d'accueil + géolocalisation, adresses modifiables, contrôles croisés, couleurs du profil ===== */
(function(){
var HM={el:null,map:null,g:null,me:null,acc:null,tries:0},LMS={me:null,acc:null},TH={k:''};
function okL(){return !!(window.L&&window.L.map)}
function geoErr(er){var c=er&&er.code;return c===1?'Localisation refusée. Autorise-la dans les réglages (iPhone : Réglages › Confidentialité › Service de localisation ; Android : Chrome › Paramètres du site › Localisation).':c===2?'Position introuvable. Active le GPS ou sors en extérieur.':c===3?'Délai dépassé. Réessaie.':'Géolocalisation indisponible sur cet appareil.'}
function locate(map,store,btn){
  if(!navigator.geolocation||!window.isSecureContext){toast(!navigator.geolocation?geoErr():'La géolocalisation demande une adresse https.');return}
  var t0=btn?btn.textContent:'';if(btn){btn.disabled=true;btn.textContent='…'}
  var done=function(){if(btn){btn.disabled=false;btn.textContent=t0}};
  navigator.geolocation.getCurrentPosition(function(p){
    var ll=[p.coords.latitude,p.coords.longitude],r=Math.min(p.coords.accuracy||50,2000);
    try{
      if(store.me)store.me.setLatLng(ll);else store.me=L.circleMarker(ll,{radius:8,color:'#fff',weight:3,fillColor:'#3b82f6',fillOpacity:1}).addTo(map);
      if(store.acc){store.acc.setLatLng(ll);store.acc.setRadius(r)}else store.acc=L.circle(ll,{radius:r,color:'#3b82f6',weight:1,fillOpacity:.12}).addTo(map);
      map.setView(ll,r>800?13:15)}catch(x){}
    done()},function(er){toast(geoErr(er));done()},{enableHighAccuracy:true,timeout:15000,maximumAge:30000})}
/* --- carte de l'accueil --- */
function active(o){try{return !bad(o)&&(o.status==='En attente'||(o.status==='Confirmé'&&stage(o)<3))}catch(x){return false}}
function hmFlush(){
  var slot=$('hmslot');if(!slot)return;
  if(!okL()){var n=$('hmn');if(n)n.textContent='Chargement de la carte…';if(HM.tries++<6)setTimeout(function(){if($('hmslot')&&!HM.map)hmFlush()},1500);return}
  try{
    var n2=$('hmn');if(n2)n2.textContent='';
    if(!HM.el){HM.el=document.createElement('div');HM.el.className='lmap hm'}
    slot.appendChild(HM.el);
    if(!HM.map){HM.map=L.map(HM.el,{zoomControl:true,minZoom:4,maxZoom:18}).setView([31.8,-7.1],5);L.tileLayer(tileUrl(),{subdomains:'abcd',maxZoom:19,attribution:'© OpenStreetMap contributors'}).addTo(HM.map);HM.g=L.layerGroup().addTo(HM.map)}
    HM.map.invalidateSize();HM.g.clearLayers();
    var by={},pts=[];
    DB.orders.forEach(function(o){if(!active(o))return;if(o.lat!=null&&o.lng!=null&&isFinite(o.lat)&&isFinite(o.lng)){var pl=[+o.lat,+o.lng];pts.push(pl);L.circleMarker(pl,{radius:6,color:'#fff',weight:2,fillColor:'#3b82f6',fillOpacity:1}).bindTooltip(String(o.name||'')).addTo(HM.g)}var c=cfind(o.city);if(!c)return;var k=c[2];by[k]=by[k]||{c:c,n:0};by[k].n++});
    Object.keys(by).forEach(function(k){var b=by[k],ll=[b.c[0],b.c[1]];pts.push(ll);
      L.circleMarker(ll,{radius:7+Math.min(10,b.n*2),color:'#fff',weight:2,fillColor:'#d4af37',fillOpacity:.95}).bindTooltip(k+' · '+b.n,{permanent:b.n>0&&Object.keys(by).length<9}).addTo(HM.g)});
    if(HM.me)pts.push(HM.me.getLatLng());
    if(pts.length&&!HM.fit){HM.fit=1;HM.map.fitBounds(pts,{padding:[40,40],maxZoom:11})}
  }catch(x){}
}
function homeMap(){
  var A=$('app');if(!A||$('hmc'))return;
  var c=document.createElement('div');c.className='card';c.id='hmc';
  c.innerHTML='<div class="row"><h2 style="margin:0">Carte des livraisons</h2><button class="b sm pri" data-hm="loc" style="flex:0 0 auto;min-width:0">📍 Me géolocaliser</button></div><div id="hmslot" class="lslot"></div><div class="mut" id="hmn"></div>';
  var g=A.querySelector('.grid');if(g&&g.parentNode===A)g.parentNode.insertBefore(c,g.nextSibling);else A.appendChild(c);
  hmFlush()}
/* bouton sur la carte de suivi (Livraison) */
function lmCtl(){
  if(!okL()||!LM||!LM.map||LM.__loc===LM.map)return;LM.__loc=LM.map;
  var C=L.Control.extend({options:{position:'topright'},onAdd:function(){var b=L.DomUtil.create('button','locbtn');b.type='button';b.title='Me géolocaliser';b.setAttribute('aria-label','Me géolocaliser');b.textContent='📍';L.DomEvent.disableClickPropagation(b);L.DomEvent.on(b,'click',function(ev){L.DomEvent.stop(ev);locate(LM.map,LMS,null)});return b}});
  new C().addTo(LM.map)}
/* --- contrôles croisés (admin) --- */
function checks(){
  var L1=[],ph={},now=Date.now();
  DB.orders.forEach(function(o){if(!active(o))return;var k=String(o.phone||'');ph[k]=(ph[k]||0)+1});
  DB.orders.forEach(function(o){if(!active(o))return;var p=[];
    if(!o.address||!o.city)p.push('adresse ou ville manquante');
    else if(!cfind(o.city))p.push('ville non reconnue (pas de carte)');
    if(o.status==='Confirmé'&&!o.courier)p.push('sans livreur');
    var t=Date.parse(o.cdate||'');if(o.status==='Confirmé'&&t&&now-t>2*864e5)p.push('confirmée depuis +48 h, non livrée');
    if(ph[String(o.phone||'')]>1)p.push('numéro en double');
    if(p.length)L1.push({o:o,t:p.join(' · ')})});
  return L1}
function homeChecks(){
  var A=$('app'),m=$('hmc');if(!A||$('ctl'))return;var l=checks();if(!l.length)return;
  var c=document.createElement('div');c.className='card';c.id='ctl';
  c.innerHTML='<h2>À vérifier ('+l.length+')</h2>'+l.slice(0,6).map(function(x){return '<div class="row" style="padding:5px 0;gap:8px"><span style="min-width:0"><b>'+e(x.o.name)+'</b><div class="mut">'+e(x.t)+'</div></span><button class="b sm" data-ae="'+e(x.o.id)+'" style="flex:0 0 auto;min-width:0">✏️</button></div>'}).join('')+(l.length>6?'<div class="mut">+ '+(l.length-6)+' autre(s) dans Commandes.</div>':'');
  if(m&&m.parentNode)m.parentNode.insertBefore(c,m.nextSibling);else A.appendChild(c)}
/* --- adresses modifiables --- */
function addEditBtns(){
  var A=$('app');if(!A||!DB)return;
  var ns=A.querySelectorAll('[data-act][data-id]');
  for(var i=0;i<ns.length;i++){
    var id=ns[i].getAttribute('data-id'),c=ns[i].closest('.card');if(!c||c.querySelector('[data-ae]'))continue;
    if(!byId(id))continue;
    var b=document.createElement('button');b.className='b sm';b.setAttribute('data-ae',id);b.textContent='✏️ Modifier adresse';
    var bs=c.querySelectorAll('.btns');(bs.length?bs[bs.length-1]:c).appendChild(b)}}
function openAE(id){
  var o=byId(id);if(!o)return;var v=null;try{v=vget(o.vendor)}catch(x){}
  var h='<h2>Modifier la commande</h2><label>Nom du client</label><input id="ae-n" value="'+e(o.name)+'"><label>Téléphone</label><input id="ae-p" inputmode="tel" value="'+e(o.phone)+'"><label>Adresse de livraison</label><input id="ae-a" value="'+e(o.address)+'"><label>Ville</label><input id="ae-c" list="mc" value="'+e(o.city)+'">';
  if(v)h+='<h2 style="margin-top:10px">Retrait chez '+e(v.name)+'</h2><label>Adresse du vendeur</label><input id="ae-va" value="'+e(v.addr||'')+'"><label>Ville du vendeur</label><input id="ae-vc" list="mc" value="'+e(v.city||'')+'">';
  h+='<div class="btns"><button class="b pri" data-ae-do="'+e(id)+'">Enregistrer</button><button class="b" data-ae-x="1">Annuler</button></div>';
  var ov=ovl(h),ia=ov.querySelector('#ae-a'),iv=ov.querySelector('#ae-va');
  [[ia,o],[iv,v]].forEach(function(p){var el=p[0],src=p[1];if(!el)return;el.dataset.init='1';el.dataset.pl=el.value;if(src&&src.lat!=null&&src.lat!==''&&isFinite(src.lat)&&src.lng!=null&&isFinite(src.lng)){el.dataset.lat=src.lat;el.dataset.lng=src.lng}});
  if(window.__sugDecorate)window.__sugDecorate(ov)}
function saveAE(id){
  var o=byId(id);if(!o)return;var n=$('ae-n').value.trim(),m=mph($('ae-p').value);
  if(!n)return toast('Le nom est obligatoire.');if(!m)return toast('Numéro marocain invalide (06… ou 07…).');
  o.name=n;o.phone=m;o.address=$('ae-a').value.trim();o.city=$('ae-c').value.trim();
  var v=null;try{v=vget(o.vendor)}catch(x){}
  if(v&&$('ae-va')){v.addr=$('ae-va').value.trim();v.city=$('ae-vc').value.trim()}
  var da=$('ae-a');if(da&&da.dataset.lat){o.lat=+da.dataset.lat;o.lng=+da.dataset.lng}else{delete o.lat;delete o.lng}
  var dv=$('ae-va');if(v&&dv){if(dv.dataset.lat){v.lat=+dv.dataset.lat;v.lng=+dv.dataset.lng}else{delete v.lat;delete v.lng}}
  save();qclose();try{if(o.tid)pub(o)}catch(x){}render();toast('Modifié ✅')}
document.addEventListener('click',function(ev){
  var t=ev.target.closest&&ev.target.closest('[data-hm],[data-ae],[data-ae-do],[data-ae-x]');if(!t)return;
  ev.preventDefault();ev.stopPropagation();
  if(t.hasAttribute('data-hm')){if(HM.map)locate(HM.map,HM,t);else toast('Carte pas encore chargée.')}
  else if(t.hasAttribute('data-ae'))openAE(t.getAttribute('data-ae'));
  else if(t.hasAttribute('data-ae-do'))saveAE(t.getAttribute('data-ae-do'));
  else qclose()},true);
/* --- couleurs d'après la photo de profil --- */
function rgb2hsl(r,g,b){r/=255;g/=255;b/=255;var mx=Math.max(r,g,b),mn=Math.min(r,g,b),h=0,s=0,l=(mx+mn)/2,d=mx-mn;if(d){s=l>.5?d/(2-mx-mn):d/(mx+mn);h=mx===r?(g-b)/d+(g<b?6:0):mx===g?(b-r)/d+2:(r-g)/d+4;h*=60}return [h,s,l]}
function hsl2hex(h,s,l){var a=s*Math.min(l,1-l),f=function(n){var k=(n+h/30)%12,c=l-a*Math.max(-1,Math.min(k-3,9-k,1));return ('0'+Math.round(255*c).toString(16)).slice(-2)};return '#'+f(0)+f(8)+f(4)}
function setMeta(c){var ms=document.querySelectorAll('meta[name="theme-color"]');if(!ms.length){var m=document.createElement('meta');m.name='theme-color';document.head.appendChild(m);ms=[m]}for(var i=0;i<ms.length;i++){ms[i].removeAttribute('media');ms[i].setAttribute('content',c)}}
function themeApply(){
  var ph=(DB&&DB.set&&DB.set.pphoto)||'',k=ph?ph.length+ph.slice(-24):'';if(k===TH.k)return;TH.k=k;
  var st=$('pcol');
  if(!ph){if(st)st.remove();setMeta('#111111');return}
  var im=new Image();im.onload=function(){try{
    var cv=document.createElement('canvas');cv.width=cv.height=24;var cx=cv.getContext('2d');cx.drawImage(im,0,0,24,24);
    var d=cx.getImageData(0,0,24,24).data,B12=[],n;
    for(n=0;n<12;n++)B12.push({w:0,r:0,g:0,b:0});
    for(var i=0;i<d.length;i+=4){var R=d[i],G=d[i+1],B=d[i+2],mx=Math.max(R,G,B),mn=Math.min(R,G,B),s=mx?(mx-mn)/mx:0,l=(mx+mn)/510;if(l<.1||l>.92)continue;var wt=.1+s*s*3,bi=Math.floor(rgb2hsl(R,G,B)[0]/30)%12,q=B12[bi];q.w+=wt;q.r+=R*wt;q.g+=G*wt;q.b+=B*wt}
    var ord=B12.map(function(x,k){return {k:k,w:x.w}}).sort(function(a,b){return b.w-a.w});
    if(!ord[0].w)return;
    var top=ord[0].k,sec=null;
    for(n=1;n<12;n++){var dk=Math.abs(ord[n].k-top);dk=Math.min(dk,12-dk);if(ord[n].w>ord[0].w*.12&&dk>=2){sec=ord[n].k;break}}
    var col=function(k){var x=B12[k];return rgb2hsl(x.r/x.w,x.g/x.w,x.b/x.w)};
    var c_1=col(top),c_2=sec==null?[(c_1[0]+35)%360,c_1[1],c_1[2]]:col(sec);
    var h=c_1[0],s2=Math.max(.35,Math.min(.85,c_1[1])),h2=c_2[0],s3=Math.max(.3,Math.min(.85,c_2[1]));
    var c1=hsl2hex(h,s2,.30),c2=hsl2hex(h,s2,.18),hi=hsl2hex(h,s2,.5);
    var bgA=hsl2hex(h,s2,.82),bgB=hsl2hex(h2,s3,.9),dkA=hsl2hex(h,s2*.8,.2),dkB=hsl2hex(h2,s3*.8,.1);
    var css=':root{--pc:'+c1+';--pc-d:'+c2+';--bgA:'+bgA+';--bgB:'+bgB+';--bg:'+bgB+'}@media (prefers-color-scheme:dark){:root{--bgA:'+dkA+';--bgB:'+dkB+';--bg:'+dkB+'}}'
      +'html,body{background-color:var(--bgB)!important}body{background-image:linear-gradient(160deg,var(--bgA),var(--bgB) 70%)!important;background-attachment:fixed;background-repeat:no-repeat;min-height:100vh}'
      +'header{background:linear-gradient(135deg,'+c2+','+c1+')!important;border-bottom-color:'+hi+'!important}'
      +'nav{background:hsla('+Math.round(h)+','+Math.round(s2*100)+'%,13%,.95)!important;border-color:'+hi+'!important}'
      +'.seg button.on,.chip.on{background:'+c1+'!important;color:#fff!important;border-color:'+c1+'!important}';
    var el=$('pcol');if(!el){el=document.createElement('style');el.id='pcol';document.head.appendChild(el)}el.textContent=css;setMeta(c2)
  }catch(x){}};
  im.src=ph}
var _r10=render;
render=function(){_r10();
  if(!DB||S.locked||Q.get('t')||Q.get('l')||Q.get('v'))return;
  try{if(S.tab==='home'){homeMap();homeChecks()}addEditBtns();lmCtl();themeApply()}catch(x){}};
})();

/* ===== 8.6.1 : rôles (garde d'interface) : livreur et vendeur n'ont que l'onglet qui les concerne ===== */
(function(){
function rl(){try{var r=window.cloudRole&&window.cloudRole();return r==='courier'||r==='vendor'?r:null}catch(x){return null}}
var _rg=render;
render=function(){var r=rl();if(r&&DB&&!S.locked&&!Q.get('t')&&!Q.get('l')&&!Q.get('v')){var ok=r==='courier'?'del':'ord';if(S.tab!==ok){S.tab=ok;S.sub='';S.vsel='';S.edit=''}}
  _rg();
  if(!r||!DB||S.locked||Q.get('t')||Q.get('l')||Q.get('v'))return;
  try{var ok2=r==='courier'?'del':'ord',ns=document.querySelectorAll('nav button');for(var i=0;i<ns.length;i++)if(ns[i].getAttribute('data-v')!==ok2)ns[i].style.display='none';
    var hs=$('hs');if(hs)hs.style.display='none';
    var bs=document.querySelectorAll('#app [data-ae],#app [data-act="edit"],#app [data-act="goto"]');for(var j=0;j<bs.length;j++)bs[j].style.display='none';
    document.body.setAttribute('data-role',r)}catch(x){}};
})();

/* ===== 8.7.0 : suggestions d'adresses et de villes + repère sur la carte ===== */
(function(){
var TYPES=['Rue ','Boulevard ','Avenue ','Route ','Quartier ','Lotissement ','Résidence ','Immeuble ','Hay ','Derb ','Rond-point ','Place ','Impasse ','Cité ','Villa ','Douar '];
var CITYOF={'e-a':'e-c','f-a':'f-c','ae-a':'ae-c','ae-va':'ae-vc'},ADR=/^(e-a|f-a|w-a|b-a|ae-a|ae-va)$/,CTY=/^(e-c|f-c|v-c|n-c|ae-c|ae-vc)$/;
var BX=null,CUR=null,TM=null,AB=null,CACHE={},PK=null,PF=null;
function isAddr(el){return !!el&&el.tagName==='INPUT'&&(ADR.test(el.id)||el.getAttribute('data-vf')==='addr')}
function isCity(el){return !!el&&el.tagName==='INPUT'&&(CTY.test(el.id)||el.getAttribute('data-vf')==='city')}
function canPin(el){return isAddr(el)&&el.id!=='w-a'&&el.id!=='b-a'}
function nz(s){s=String(s||'').toLowerCase();try{s=s.normalize('NFD').replace(/[\u0300-\u036f]/g,'')}catch(x){}return s}
function okL2(){return !!(window.L&&window.L.map)}
function cityVal(el){var c=null;if(CITYOF[el.id])c=$(CITYOF[el.id]);else if(el.getAttribute('data-vf')==='addr'){c=document.querySelector('input[data-vf="city"]')}return c?c.value.trim():''}
function num(v){return v!=null&&v!==''&&isFinite(v)}
/* --- suggestions locales (hors ligne) --- */
function localCity(q){var n=nz(q),o=[];(MCN||[]).forEach(function(c){var k=nz(c);if(k.indexOf(n)===0)o.unshift({t:c,kind:'ville'});else if(k.indexOf(n)>0)o.push({t:c,kind:'ville'})});return o.slice(0,6)}
function localAddr(q,city){
  var n=nz(q),out=[],seen={};
  if(n.length<=14&&n.indexOf(' ')<0)TYPES.forEach(function(t){var k=nz(t);if(k.indexOf(n)===0&&k.trim()!==n)out.push({t:t,kind:'type'})});
  var pool=[];
  DB.orders.forEach(function(o){if(o.address&&(!city||nz(o.city)===nz(city)))pool.push([o.address,o.lat,o.lng])});
  DB.vend.forEach(function(v){if(v.addr)pool.push([v.addr,v.lat,v.lng])});
  pool.forEach(function(p){var k=nz(p[0]);if(seen[k]||k===n||k.indexOf(n)<0||out.length>=9)return;seen[k]=1;out.push({t:p[0],lat:num(p[1])?+p[1]:null,lng:num(p[2])?+p[2]:null,kind:'hist'})});
  return out}
/* --- suggestions en ligne (OpenStreetMap / Nominatim) --- */
function remote(q,city,cityMode,cb){
  var key=(cityMode?'c|':'a|')+nz(q)+'|'+nz(city);if(CACHE[key])return cb(CACHE[key]);
  if(AB){try{AB.abort()}catch(x){}}
  AB=window.AbortController?new AbortController():null;
  var url='https://nominatim.openstreetmap.org/search?format=jsonv2&addressdetails=1&limit=6&countrycodes=ma&accept-language=fr&q='+encodeURIComponent(cityMode?q:(q+(city?', '+city:'')+', Maroc'));
  fetch(url,AB?{signal:AB.signal}:{}).then(function(r){return r.json()}).then(function(j){
    var out=[],seen={};(j||[]).forEach(function(r){var a=r.address||{},ct=a.city||a.town||a.village||a.municipality||a.county||'',t;
      if(cityMode){t=ct||r.name||''}
      else{var st=a.road||a.pedestrian||a.footway||a.path||'',sub=a.suburb||a.neighbourhood||a.quarter||a.city_district||'';
        t=[((a.house_number?a.house_number+' ':'')+st).trim(),sub].filter(Boolean).join(', ');if(!t)t=(r.name||String(r.display_name||'').split(',').slice(0,2).join(',')).trim()}
      if(!t||seen[nz(t)])return;seen[nz(t)]=1;out.push({t:t,city:ct,lat:+r.lat,lng:+r.lon,kind:'net'})});
    CACHE[key]=out;cb(out)}).catch(function(){cb([])})}
/* --- liste déroulante --- */
function position(){
  if(!BX||!CUR)return;var r=CUR.getBoundingClientRect(),vh=window.innerHeight,below=vh-r.bottom,h=Math.min(260,BX.scrollHeight);
  BX.style.left=Math.max(6,r.left)+'px';BX.style.width=Math.min(r.width,window.innerWidth-12)+'px';
  if(below<h+10&&r.top>below){BX.style.top='auto';BX.style.bottom=(vh-r.top+2)+'px'}else{BX.style.bottom='auto';BX.style.top=(r.bottom+2)+'px'}}
function hide(){if(BX)BX.style.display='none';CUR=null}
function show(el,items){
  if(!items.length){hide();return}
  if(!BX){BX=document.createElement('div');BX.className='sgb';BX.addEventListener('mousedown',function(ev){ev.preventDefault()});document.body.appendChild(BX)}
  CUR=el;BX._it=items;
  BX.innerHTML=items.map(function(it,i){return '<button type="button" class="sgi" data-sgi="'+i+'"><span>'+e(it.t)+'</span><small>'+(it.kind==='hist'?'déjà utilisée':it.kind==='net'?'📍 carte':it.kind==='type'?'type de voie':'ville')+'</small></button>'}).join('');
  BX.style.display='block';position()}
function suggest(el,cityMode){
  clearTimeout(TM);var q=el.value.trim();if(q.length<2){hide();return}
  var loc=cityMode?localCity(q):localAddr(q,cityVal(el));show(el,loc);
  if(q.length<3||(cityMode&&loc.length>=4))return;
  TM=setTimeout(function(){remote(q,cityVal(el),cityMode,function(net){
    if(document.activeElement!==el)return;var seen={},all=[];
    loc.concat(net).forEach(function(it){var k=nz(it.t);if(seen[k])return;seen[k]=1;all.push(it)});show(el,all.slice(0,9))})},500)}
function mark(el){var r=el.nextElementSibling;if(r&&r.className==='pinrow'){var s=r.querySelector('span');if(s)s.textContent=el.dataset.lat?'✅ Repère enregistré':''}}
function pick(it){
  var el=CUR;if(!el)return;el.value=it.t;el.dataset.init='1';
  if(num(it.lat)&&num(it.lng)){el.dataset.lat=it.lat;el.dataset.lng=it.lng;el.dataset.pl=it.t}else{delete el.dataset.lat;delete el.dataset.lng;el.dataset.pl=it.t}
  if(el.getAttribute('data-vf')==='addr'){var v=vid(S.vsel);if(v){if(el.dataset.lat){v.lat=+el.dataset.lat;v.lng=+el.dataset.lng}else{delete v.lat;delete v.lng}}}
  if(it.city&&isAddr(el)){var c=CITYOF[el.id]?$(CITYOF[el.id]):document.querySelector('input[data-vf="city"]');if(c&&!c.value){c.value=it.city;c.dispatchEvent(new Event('change',{bubbles:true}))}}
  el.dispatchEvent(new Event('change',{bubbles:true}));hide();mark(el)}
/* --- initialisation des champs (repère existant + bouton carte) --- */
function prep(el){
  el.dataset.init='1';var src=null;
  if(el.id==='e-a'){var b=el.closest('.card');b=b&&b.querySelector('[data-act="esave"]');src=b&&byId(b.getAttribute('data-id'))}
  else if(el.getAttribute('data-vf')==='addr')src=vid(S.vsel);
  if(src&&num(src.lat)&&num(src.lng)){el.dataset.lat=src.lat;el.dataset.lng=src.lng}
  el.dataset.pl=el.value}
function decorate(root){
  var ins=(root||document).querySelectorAll('input');
  for(var i=0;i<ins.length;i++){var el=ins[i];
    if(isCity(el))el.removeAttribute('list');
    if(!canPin(el))continue;
    if(!el.dataset.init)prep(el);
    var nx=el.nextElementSibling;if(nx&&nx.className==='pinrow'){mark(el);continue}
    if(!el.id)el.id='pinadr';
    var d=document.createElement('div');d.className='pinrow';d.innerHTML='<button type="button" class="b sm" data-pin="'+el.id+'">📍 Marquer le repère sur la carte</button><span class="mut"></span>';
    el.parentNode.insertBefore(d,el.nextSibling);mark(el)}}
/* --- sélecteur de repère --- */
function closePk(){if(PK){try{PK.map.remove()}catch(x){}PK.o.remove();PK=null}}
function setM(ll){PK.ll=ll;if(PK.mk)PK.mk.setLatLng(ll);else{PK.mk=L.marker(ll,{draggable:true,icon:L.divIcon({className:'pkpin',html:'📍',iconSize:[30,30],iconAnchor:[15,28]})}).addTo(PK.map);PK.mk.on('dragend',function(){var p=PK.mk.getLatLng();PK.ll=[p.lat,p.lng]})}}
function pkMsg(m){var s=PK&&PK.o.querySelector('[data-pk-s]');if(s)s.textContent=m||''}
function pkFind(){
  var el=PK.el,q=el.value.trim();if(!q){pkMsg('Écris d’abord l’adresse.');return}
  pkMsg('Recherche…');var c=cityVal(el);
  fetch('https://nominatim.openstreetmap.org/search?format=jsonv2&limit=1&countrycodes=ma&accept-language=fr&q='+encodeURIComponent(q+(c?', '+c:'')+', Maroc')).then(function(r){return r.json()}).then(function(j){
    if(!PK)return;if(j&&j[0]){var ll=[+j[0].lat,+j[0].lon];setM(ll);PK.map.setView(ll,17);pkMsg('Vérifie et ajuste le point si besoin.')}else pkMsg('Adresse introuvable : touche la carte pour placer le repère.')}).catch(function(){pkMsg('Pas de connexion : touche la carte pour placer le repère.')})}
function pkLoc(){
  if(!navigator.geolocation||!window.isSecureContext)return pkMsg('Position indisponible.');
  pkMsg('Localisation…');navigator.geolocation.getCurrentPosition(function(p){if(!PK)return;var ll=[p.coords.latitude,p.coords.longitude];setM(ll);PK.map.setView(ll,17);pkMsg('')},function(){pkMsg('Localisation refusée ou impossible.')},{enableHighAccuracy:true,timeout:15000,maximumAge:30000})}
function pkOpen(el){
  if(!okL2())return toast('Carte pas encore chargée, réessaie dans un instant.');
  closePk();
  var o=document.createElement('div');o.className='pkw';
  o.innerHTML='<div class="pkc"><h2>Marquer le repère</h2><p class="mut" style="margin:0 0 6px">Touche la carte ou glisse le point 📍 sur l’endroit exact.</p><div class="pkm"></div><div class="btns"><button type="button" class="b sm" data-pk="loc">📍 Ma position</button><button type="button" class="b sm" data-pk="find">🔎 Chercher l’adresse</button></div><div class="mut" data-pk-s style="min-height:16px"></div><div class="btns"><button type="button" class="b pri" data-pk="ok">Valider</button><button type="button" class="b" data-pk="no">Annuler</button></div></div>';
  document.body.appendChild(o);
  var c0=num(el.dataset.lat)?[+el.dataset.lat,+el.dataset.lng]:null,cf=cfind(cityVal(el));
  var map=L.map(o.querySelector('.pkm'),{zoomControl:true,minZoom:4,maxZoom:19}).setView(c0||(cf?[cf[0],cf[1]]:[31.8,-7.1]),c0?17:(cf?13:5));
  L.tileLayer(tileUrl(),{subdomains:'abcd',maxZoom:19,attribution:'© OpenStreetMap contributors'}).addTo(map);
  PK={el:el,o:o,map:map,mk:null,ll:c0};if(c0)setM(c0);
  map.on('click',function(ev){setM([ev.latlng.lat,ev.latlng.lng])});
  setTimeout(function(){if(PK)PK.map.invalidateSize()},200);
  if(!c0&&el.value.trim().length>3)pkFind()}
function pkOk(){
  if(!PK||!PK.ll)return toast('Touche la carte pour placer le repère.');
  var el=PK.el,ll=PK.ll;el.dataset.lat=ll[0];el.dataset.lng=ll[1];el.dataset.init='1';el.dataset.pl=el.value;
  if(el.getAttribute('data-vf')==='addr'){var v=vid(S.vsel);if(v){v.lat=ll[0];v.lng=ll[1];save()}}
  closePk();mark(el);
  if(!el.value.trim()){fetch('https://nominatim.openstreetmap.org/reverse?format=jsonv2&addressdetails=1&zoom=18&accept-language=fr&lat='+ll[0]+'&lon='+ll[1]).then(function(r){return r.json()}).then(function(r){
    var a=(r&&r.address)||{},t=[((a.house_number?a.house_number+' ':'')+(a.road||'')).trim(),a.suburb||a.neighbourhood||a.quarter||''].filter(Boolean).join(', ');
    if(t&&!el.value.trim()){el.value=t;el.dataset.pl=t;el.dispatchEvent(new Event('change',{bubbles:true}))}
    var c=CITYOF[el.id]?$(CITYOF[el.id]):null,ct=a.city||a.town||a.village||'';if(c&&!c.value&&ct)c.value=ct}).catch(function(){})}
  else el.dispatchEvent(new Event('change',{bubbles:true}));
  toast('Repère enregistré 📍')}
/* --- événements --- */
document.addEventListener('input',function(ev){
  var el=ev.target;
  if(isAddr(el)){
    if(el.dataset.pl!==undefined&&el.value!==el.dataset.pl&&el.dataset.lat){delete el.dataset.lat;delete el.dataset.lng;mark(el);
      if(el.getAttribute('data-vf')==='addr'){var v=vid(S.vsel);if(v){delete v.lat;delete v.lng}}}
    suggest(el,false)}
  else if(isCity(el)){el.removeAttribute('list');suggest(el,true)}},true);
document.addEventListener('focusin',function(ev){var el=ev.target;if(isCity(el))el.removeAttribute('list');if(canPin(el)&&!el.dataset.init)prep(el)},true);
document.addEventListener('focusout',function(){setTimeout(function(){var a=document.activeElement;if(!a||a!==CUR)hide()},250)},true);
window.addEventListener('resize',position);window.addEventListener('scroll',function(){if(BX&&BX.style.display==='block')position()},true);
document.addEventListener('click',function(ev){
  var t=ev.target.closest&&ev.target.closest('.sgi,[data-pin],[data-pk],[data-act="esave"],[data-act="add"]');if(!t)return;
  if(t.classList.contains('sgi')){ev.preventDefault();ev.stopPropagation();var it=BX&&BX._it&&BX._it[+t.getAttribute('data-sgi')];if(it)pick(it);return}
  if(t.hasAttribute('data-pin')){ev.preventDefault();ev.stopPropagation();var el=$(t.getAttribute('data-pin'));if(el)pkOpen(el);return}
  if(t.hasAttribute('data-pk')){ev.preventDefault();ev.stopPropagation();var k=t.getAttribute('data-pk');if(k==='ok')pkOk();else if(k==='no')closePk();else if(k==='loc')pkLoc();else if(k==='find')pkFind();return}
  var a=t.getAttribute('data-act');
  if(a==='esave'){var o=byId(t.getAttribute('data-id')),f=$('e-a');if(o&&f&&f.dataset.init){if(num(f.dataset.lat)){o.lat=+f.dataset.lat;o.lng=+f.dataset.lng}else{delete o.lat;delete o.lng}}}
  else if(a==='add'){var g=$('f-a');PF=g&&num(g.dataset.lat)?{lat:+g.dataset.lat,lng:+g.dataset.lng,a:g.value.trim()}:null;setTimeout(function(){PF=null},0)}},true);
/* nouvelle commande : on garde le repère choisi */
var _ao=addOrder;
addOrder=function(){var r=_ao.apply(this,arguments);if(r==='ok'&&PF){var o=DB.orders[DB.orders.length-1];if(o&&o.address===PF.a){o.lat=PF.lat;o.lng=PF.lng}}return r};
/* lien livreur : coordonnées exactes si un repère existe */
var _tl=tlink;
tlink=function(o,k){var u=_tl(o,k);if(k!=='l')return u;
  try{var i=u.indexOf('?l='),d=JSON.parse(decodeURIComponent(escape(atob(decodeURIComponent(u.slice(i+3)))))),v=null;try{v=vget(o.vendor)}catch(x){}
    if(num(o.lat)&&num(o.lng))d.cl=[+o.lat,+o.lng];if(v&&num(v.lat)&&num(v.lng))d.vl=[+v.lat,+v.lng];
    return u.slice(0,i)+'?l='+encq(d)}catch(x){return u}};
var _rcz=renderCourier;
renderCourier=function(){_rcz();
  try{var d=decq('l');if(!d)return;var as=document.querySelectorAll('a[href*="google.com/maps/dir"]'),ft=function(c){return c&&num(c[0])&&num(c[1])?'https://www.google.com/maps/dir/?api=1&destination='+c[0]+','+c[1]:''};
    if(as[0]&&ft(d.vl))as[0].href=ft(d.vl);if(as[1]&&ft(d.cl))as[1].href=ft(d.cl)}catch(x){}};
/* branchement sur le rendu */
window.__sugDecorate=decorate;
var _rs=render;
render=function(){hide();_rs();if(!DB||S.locked||Q.get('t')||Q.get('l'))return;try{decorate($('app'))}catch(x){}};
})();

/* ===== 8.7.1 : photo de profil en arrière-plan flouté (au lieu de l'en-tête) ===== */
(function(){
function bgp(){
  var ph=(DB&&DB.set&&DB.set.pphoto)||'',el=document.getElementById('bgp');
  if(!ph||S.locked||Q.get('t')||Q.get('l')||Q.get('v')){if(el)el.remove();return}
  var k=ph.length+ph.slice(-24);
  if(!el){el=document.createElement('div');el.id='bgp';el.setAttribute('aria-hidden','true');document.body.insertBefore(el,document.body.firstChild)}
  if(el.getAttribute('data-k')!==k){el.style.backgroundImage='url("'+ph+'")';el.setAttribute('data-k',k)}
}
var _r71=render;
render=function(){_r71();try{bgp()}catch(x){}};
})();

/* ===== 8.8.0 : toile de liaison — lecteur universel de commandes (CSV / JSON / webhook) ===== */
var CX=(function(){
  var nk=function(s){return String(s==null?'':s).toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/[^a-z0-9]/g,'')};
  var SY={
    name:['shippingname','billingname','fullname','customername','clientname','nomcomplet','nomclient','nomprenom','destinataire','recipient','client','customer','nom','name'],
    first:['firstname','prenom','givenname'],
    last:['lastname','surname','familyname'],
    phone:['shippingphone','phone','telephone','tel','mobile','gsm','whatsapp','phonenumber','numerotelephone','numtel','telephoneclient','customerphone','billingphone','contact','numero'],
    addr:['address1','shippingaddress1','billingaddress1','address','adresse','shippingaddress','adresselivraison','street','addressline1','firstline','rue'],
    addr2:['address2','complement','addressline2','secondline'],
    city:['city','shippingcity','ville','billingcity','town','localite','commune'],
    amount:['totalprice','total','ordertotal','totalamount','grandtotal','montantcod','codamount','cod','montant','amount','prixtotal','totaldh','prix','price'],
    vendor:['boutique','storename','store','shopname','shop','vendeur','vendor','seller','merchant'],
    xid:['ordernumber','orderid','numerocommande','ordernum','orderref','reference','ref','number','commande','id'],
    prod:['produit','product','productname','lineitemname','article','designation','titre','title','itemname','nomproduit','produits','products','items'],
    qty:['lineitemquantity','quantity','qty','quantite','qte']
  };
  var PREF=['shipping','delivery','livraison','customer','client','billing'];
  var BAD={
    p:/line_?item|shipping_lines|item|product|variant|tax|discount|fulfil|carrier|courier|store|shop|merchant|vendor|seller|company/,
    amount:/line_?item|shipping_lines|item|product|variant|tax|discount|fulfil|refund|shipping|delivery|livraison|money|_set/,
    vendor:/line_?item|item|product|variant|customer|client|shipping|billing|address/,
    xid:/customer|client|line_?item|item|product|variant|shipping|billing|address|tax|fulfil|store|shop|vendor/,
    prod:/customer|client|shipping|billing|address|tax/,
    qty:/line_items|items|customer|client|shipping|billing/
  };
  var BF={name:'p',first:'p',last:'p',phone:'p',addr:'p',addr2:'p',city:'p',amount:'amount',vendor:'vendor',xid:'xid',prod:'prod',qty:'qty'};
  function flat(o,p,out,d){p=p||'';out=out||[];d=d||0;if(d>7)return out;
    if(Array.isArray(o)){o.slice(0,60).forEach(function(v,i){flat(v,p+'.'+i,out,d+1)});return out}
    if(o&&typeof o==='object'){Object.keys(o).forEach(function(k){flat(o[k],p?p+'.'+k:k,out,d+1)});return out}
    if(o===null||o===undefined)return out;var v=String(o).trim();if(!v)return out;
    var seg=p.split('.').filter(function(x){return !/^\d+$/.test(x)}),last=seg[seg.length-1]||'';
    out.push({p:p.toLowerCase(),k:nk(last),v:v,dp:p.split('.').length});return out}
  function cands(L,f,pref){var syn=SY[f],bad=BAD[BF[f]],pr=pref||PREF,r=[];
    L.forEach(function(x){var i=syn.indexOf(x.k);if(i<0||bad.test(x.p))return;var pi=pr.length;for(var j=0;j<pr.length;j++)if(x.p.indexOf(pr[j])>=0){pi=j;break}
      r.push({v:x.v,s:i*100+x.dp*10+pi})});
    r.sort(function(a,b){return a.s-b.s});return r.map(function(x){return x.v})}
  function num(v){var s=String(v).replace(/[^\d,.\-]/g,'');if(!s)return 0;var lc=s.lastIndexOf(','),ld=s.lastIndexOf('.');
    if(lc>ld)s=s.replace(/\./g,'').replace(',','.');else s=s.replace(/,/g,'');return parseFloat(s)||0}
  function fo(x,keys){var ks=Object.keys(x),i,j;for(i=0;i<keys.length;i++)for(j=0;j<ks.length;j++)if(nk(ks[j])===keys[i]){var v=x[ks[j]];if((typeof v==='string'||typeof v==='number')&&String(v).trim())return String(v).trim()}return ''}
  function items(o,out,pk,d){if(d>6)return;
    if(Array.isArray(o)){var ob=o.filter(function(x){return x&&typeof x==='object'&&!Array.isArray(x)});
      if(ob.length&&/item|product|produit|article|cart|panier|variant|commande/.test(pk)){ob.slice(0,40).forEach(function(x){
        var nm=fo(x,['name','productname','title','produit','nom','designation','label'])||(x.product&&typeof x.product==='object'?fo(x.product,['name','title']):''),q=+fo(x,['quantity','qty','quantite','qte']);
        if(nm)out.push(nm+(q>1?' ×'+q:''))})}
      else o.slice(0,40).forEach(function(x){items(x,out,pk,d+1)});return}
    if(o&&typeof o==='object')Object.keys(o).forEach(function(k){items(o[k],out,k.toLowerCase(),d+1)})}
  var KN={shopify:'Shopify',woocommerce:'WooCommerce',woo:'WooCommerce',youcan:'YouCan',storeino:'Storeino',lightfunnels:'LightFunnels',ecomanager:'Ecomanager',jumia:'Jumia',avito:'Avito',marjanemall:'Marjane Mall',marjane:'Marjane Mall',wix:'Wix',zid:'Zid'};
  function detect(rec,hint,L){var h=nk(hint);if(h)return KN[h]||String(hint).slice(0,20);
    if(rec&&rec.line_items&&rec.shipping_address&&rec.total_price!==undefined)return 'Shopify';
    if(rec&&rec.line_items&&rec.billing&&rec.order_key!==undefined)return 'WooCommerce';
    if(L.some(function(x){return x.k==='lineitemname'}))return 'Shopify';return 'Import'}
  function one(rec,hint,dv){if(!rec||typeof rec!=='object')return null;var L=flat(rec);if(!L.length)return null;
    var o={src:detect(rec,hint,L)},c;
    c=cands(L,'name').filter(function(v){return /[A-Za-z\u00C0-\u024F\u0600-\u06FF]/.test(v)&&v.indexOf('@')<0});o.name=c[0]||'';
    if(!o.name){var f=cands(L,'first')[0]||'',l=cands(L,'last')[0]||'';o.name=(f+' '+l).trim()}
    o.phone=cands(L,'phone').filter(function(v){return mph(v)})[0]||cands(L,'phone')[0]||'';
    var a1=cands(L,'addr').filter(function(v){return !/^\d+$/.test(v)})[0]||'',a2=cands(L,'addr2')[0]||'';o.address=(a1+(a2?', '+a2:'')).slice(0,160);
    o.city=cands(L,'city')[0]||'';
    o.amount=num(cands(L,'amount')[0]||0);
    o.vendor=cands(L,'vendor')[0]||dv||'';
    var it=[];items(rec,it,'',0);var pr=it.join(', ');
    if(!pr){pr=cands(L,'prod')[0]||'';var q=+(cands(L,'qty')[0]||0);if(pr&&q>1)pr+=' ×'+q}
    o.product=pr.slice(0,160);
    var x=cands(L,'xid')[0]||'';if(!x){var t=L.filter(function(z){return z.k==='name'&&/^#\d+/.test(z.v)})[0];if(t)x=t.v}
    o.xid=x?o.src+':'+x:'';
    return o}
  function csv(t){var f=t.split(/\r?\n/)[0]||'',cn={',':0,';':0,'\t':0},i;for(i=0;i<f.length;i++)if(cn[f[i]]!==undefined)cn[f[i]]++;
    var dl=cn[';']>cn[',']&&cn[';']>=cn['\t']?';':(cn['\t']>cn[',']?'\t':',');
    var rows=[],r=[],c='',q=false;
    for(i=0;i<t.length;i++){var ch=t[i];
      if(q){if(ch==='"'){if(t[i+1]==='"'){c+='"';i++}else q=false}else c+=ch}
      else if(ch==='"')q=true;
      else if(ch===dl){r.push(c);c=''}
      else if(ch==='\n'){r.push(c);rows.push(r);r=[];c=''}
      else if(ch!=='\r')c+=ch}
    if(c!==''||r.length){r.push(c);rows.push(r)}
    return rows.filter(function(x){return x.some(function(y){return String(y).trim()})})}
  function unwrap(j){if(Array.isArray(j))return j;if(j&&typeof j==='object'){var ks=['orders','data','items','results','commandes'];for(var i=0;i<ks.length;i++)if(Array.isArray(j[ks[i]]))return j[ks[i]]}return [j]}
  function recs(txt){txt=String(txt||'').replace(/^\uFEFF/,'').trim();if(!txt)return [];
    if(txt[0]==='{'||txt[0]==='['){try{return unwrap(JSON.parse(txt))}catch(x){}}
    var rows=csv(txt);if(!rows.length)return [];
    var all={};Object.keys(SY).forEach(function(k){SY[k].forEach(function(s){all[s]=1})});
    var isH=rows[0].map(nk).filter(function(h){return all[h]}).length>=2,
        keys=isH?rows[0].map(function(h){return String(h).trim()}):['nom','telephone','produit','adresse','ville','montant'];
    return rows.slice(isH?1:0).map(function(r){var o={};keys.forEach(function(k,i){if(k&&r[i]!==undefined&&(o[k]===undefined||o[k]===''))o[k]=r[i]});return o})}
  function list(rs,hint,dv){var out=[];rs.forEach(function(r){var o=one(r,hint,dv);if(!o)return;var p=out[out.length-1];
    if(p&&o.xid&&o.xid===p.xid&&!o.name&&!o.phone){if(o.product&&p.product.indexOf(o.product)<0)p.product=(p.product+', '+o.product).slice(0,160);return}
    out.push(o)});return out}
  return {parse:function(txt,hint,dv){return list(recs(txt),hint,dv)},fromRaw:function(raw,hint,dv){return list(unwrap(raw),hint,dv)[0]||null},num:num};
})();

/* ----- interface des connecteurs (Compte → Connexions) ----- */
function xidHas(x){return !!x&&DB.orders.some(function(q){return q.xid===x})}
function cxIn(o){if(o&&o._raw){var m=CX.fromRaw(o._raw,o._src,DB.set.ivendor);return m?{vendor:m.vendor,name:m.name,phone:m.phone,product:m.product,address:m.address,city:m.city,amount:m.amount,source:m.src,xid:m.xid}:{}}return o}
function cxAdd(o){if(xidHas(o.xid))return 'dup';return addOrder(String(o.vendor||DB.set.ivendor||'Boutique').slice(0,60),String(o.name||'').slice(0,80),o.phone,String(o.product||'').slice(0,120),String(o.address||'').slice(0,160),{city:String(o.city||'').slice(0,40),amount:o.amount||0,channel:String(o.src||'Import').slice(0,30),xid:o.xid||''})}
function cxOk(o){return !!(o.name&&mph(o.phone))}
function cxAnalyse(txt){var sl=$('cx-s'),l=CX.parse(txt,sl?sl.value:'',DB.set.ivendor);if(!l.length){toast('Aucune commande reconnue dans ce contenu.');return}CXS.l=l;render()}
function impCard(){var s=DB.set;if(!s.ikey){s.ikey=b64(rnd(18)).replace(/[^A-Za-z0-9]/g,'x');save()}
  var L=CXS.l,pv='';
  if(L){var ok=L.filter(cxOk),dp=ok.filter(function(o){return xidHas(o.xid)}).length;
    pv='<div class="alert">'+L.length+' commande(s) lue(s) · '+ok.length+' valide(s)'+(L.length-ok.length?' · '+(L.length-ok.length)+' ignorée(s) (nom ou numéro manquant)':'')+(dp?' · '+dp+' déjà importée(s)':'')+'</div>'
     +L.slice(0,5).map(function(o){return '<div class="mut">• '+e(o.name||'?')+' · '+e(o.phone||'n° ?')+' · '+e((o.product||'').slice(0,40))+(o.city?' · '+e(o.city):'')+(o.amount?' · '+fm(o.amount)+' dh':'')+' <i>('+e(o.src)+')</i></div>'}).join('')
     +(L.length>5?'<div class="mut">… et '+(L.length-5)+' autre(s)</div>':'')
     +'<div class="btns"><button class="b pri" data-cx="go">Importer '+ok.length+'</button><button class="b" data-cx="no">Annuler</button></div>'}
  var wk=(window.cloudWebhookUrl&&s.whk===s.ikey&&s.whv===(s.ivendor||''))?cloudWebhookUrl(s.ikey):'';
  return '<div class="card" id="imp-card"><h2>Connecteurs boutiques</h2><p class="mut">Importe les commandes de n’importe quelle boutique (YouCan, Shopify, WooCommerce, Storeino, LightFunnels…). Les colonnes nom, téléphone, ville, produit et montant sont reconnues automatiquement ; tu vérifies l’aperçu avant d’importer, les doublons sont ignorés.</p>'
   +'<label>Boutique par défaut</label><input id="ivd" placeholder="Boutique" value="'+e(s.ivendor||'')+'">'
   +'<details class="oc2"'+(L?' open':'')+'><summary>Importer un fichier ou coller des commandes</summary>'
   +'<label>Plateforme d’origine</label><select id="cx-s"><option value="">Détection automatique</option><option>Jumia</option><option>Marjane Mall</option><option>Avito</option><option>YouCan</option><option>Shopify</option><option>WooCommerce</option><option>Storeino</option><option>LightFunnels</option><option>Ecomanager</option></select>'
   +'<label class="b full" style="margin-top:8px">'+ico('dl','s')+' Choisir un fichier (Excel, CSV ou JSON)<input type="file" accept=".xlsx,.csv,.tsv,.txt,.json,text/csv,application/json,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" data-cx-file hidden></label>'
   +'<textarea id="cx-t" placeholder="…ou colle ici un export CSV / JSON de commandes"></textarea><p class="mut">Jumia, Marjane Mall : la plateforme livre et encaisse elle-même. Importe ces commandes seulement pour les suivre, pas pour les confirmer ni les livrer.</p>'
   +'<button class="b pri full" data-cx="an">Analyser</button></details>'+pv
   +'<details class="oc2"><summary>Réception automatique (webhook)</summary><p class="mut">Les commandes de ta boutique arrivent toutes seules dans l’appli (synchronisation cloud activée). Dans ta boutique, ajoute un webhook « commande créée » vers l’adresse ci-dessous, terminée par ?s=youcan (ou storeino, lightfunnels, shopify…) pour indiquer la plateforme.</p>'
   +(window.cloudWebhook?'':'<div class="msg err">Module cloud indisponible.</div>')
   +(wk?'<label>Adresse du webhook</label><input readonly value="'+e(wk)+'" onclick="this.select()">':'')
   +'<button class="b pri full" style="margin-top:10px" data-cx="wh">'+(wk?'Mettre à jour':'Activer la réception automatique')+'</button>'
   +(s.db?'<button class="b full" style="margin-top:6px" data-imp="1">Vérifier les nouvelles commandes (Firebase)</button>':'')+'</details></div>'}
document.addEventListener('click',function(ev){var t=ev.target.closest&&ev.target.closest('[data-cx]');if(!t||!DB)return;var a=t.getAttribute('data-cx');
  if(a==='an'){var x=$('cx-t');cxAnalyse(x?x.value:'')}
  else if(a==='no'){CXS.l=null;render()}
  else if(a==='wh'){if(!window.cloudWebhook)return toast('Module cloud indisponible.');var s=DB.set,k=s.ikey,v=s.ivendor||'';cloudWebhook(k,v).then(function(){s.whk=k;s.whv=v;save();render();toast('Réception automatique activée ✅')}).catch(function(x){toast(x&&x.message?x.message:'Activation impossible.')})}
  else if(a==='go'&&CXS.l){var ok=CXS.l.filter(cxOk),sk=CXS.l.length-ok.length,res=ok.map(cxAdd);CXS.l=null;save();render();toast(report(res)+(sk?' '+sk+' ignorée(s) (nom ou numéro manquant).':''))}},true);
document.addEventListener('change',function(ev){var t=ev.target;if(!DB||!t||!t.hasAttribute)return;
  if(t.hasAttribute('data-cx-file')){var f=t.files&&t.files[0];if(!f)return;if(f.size>3e6){toast('Fichier trop lourd (3 Mo maximum).');t.value='';return}
    var xl=/\.xlsx$/i.test(f.name),r=new FileReader();
    r.onload=function(){if(xl)cxXlsx(r.result).then(cxAnalyse).catch(function(x){toast(x&&x.message?x.message:'Fichier Excel illisible.')});else cxAnalyse(String(r.result||''))};
    r.onerror=function(){toast('Lecture du fichier impossible.')};if(xl)r.readAsArrayBuffer(f);else r.readAsText(f);t.value=''}},true);
document.addEventListener('toggle',function(ev){var d=ev.target;if(d&&d.getAttribute&&d.getAttribute('data-om'))OM[d.getAttribute('data-om')]=d.open},true);
/* ----- commandes reçues par webhook : crée le vendeur s'il n'existe pas encore ----- */
var CXN=-1,_rcx=render;
render=function(){_rcx();try{if(DB&&!S.locked&&DB.orders.length!==CXN){CXN=DB.orders.length;var ch=false;DB.orders.forEach(function(o){if(o&&o.vendor&&!vget(o.vendor)){ensureV(o.vendor);ch=true}});if(ch)save()}}catch(x){}};

/* ----- lecture des fichiers Excel (.xlsx) sans bibliothèque ----- */
function cxUnesc(s){return String(s).replace(/&#x([0-9a-f]+);/gi,function(_,h){return String.fromCharCode(parseInt(h,16))}).replace(/&#(\d+);/g,function(_,d){return String.fromCharCode(+d)}).replace(/&lt;/g,'<').replace(/&gt;/g,'>').replace(/&quot;/g,'"').replace(/&apos;/g,"'").replace(/&amp;/g,'&')}
function cxTexts(x){var t='',m,re=/<t\b[^>]*>([\s\S]*?)<\/t>/g;x=String(x).replace(/<rPh\b[\s\S]*?<\/rPh>/g,'');while((m=re.exec(x)))t+=m[1];return cxUnesc(t)}
async function cxXlsx(buf){
  if(typeof DecompressionStream==='undefined')throw new Error('Ce navigateur ne lit pas les fichiers Excel : enregistre le fichier en CSV.');
  var u=new Uint8Array(buf),dv=new DataView(buf),i,eo=-1,files={};
  for(i=u.length-22;i>=Math.max(0,u.length-65600);i--)if(dv.getUint32(i,true)===0x06054b50){eo=i;break}
  if(eo<0)throw new Error('Fichier Excel illisible.');
  var n=dv.getUint16(eo+10,true),p=dv.getUint32(eo+16,true);
  for(i=0;i<n;i++){if(dv.getUint32(p,true)!==0x02014b50)break;
    var m=dv.getUint16(p+10,true),cs=dv.getUint32(p+20,true),nl=dv.getUint16(p+28,true),el=dv.getUint16(p+30,true),cl=dv.getUint16(p+32,true),lo=dv.getUint32(p+42,true);
    files[new TextDecoder().decode(u.subarray(p+46,p+46+nl))]={m:m,cs:cs,lo:lo};p+=46+nl+el+cl}
  async function rd(nm){var f=files[nm];if(!f)return null;var ds=f.lo+30+dv.getUint16(f.lo+26,true)+dv.getUint16(f.lo+28,true),d=u.subarray(ds,ds+f.cs);
    if(f.m===0)return new TextDecoder().decode(d);
    return new TextDecoder().decode(await new Response(new Blob([d]).stream().pipeThrough(new DecompressionStream('deflate-raw'))).arrayBuffer())}
  var sh=Object.keys(files).filter(function(k){return /^xl\/worksheets\/sheet\d+\.xml$/.test(k)}).sort(function(a,b){return parseInt(a.replace(/\D/g,''),10)-parseInt(b.replace(/\D/g,''),10)})[0];
  if(!sh)throw new Error('Aucune feuille trouvée dans ce fichier Excel.');
  var ss=[],sx=await rd('xl/sharedStrings.xml'),mm,re=/<si\b[^>]*>([\s\S]*?)<\/si>/g;
  if(sx)while((mm=re.exec(sx)))ss.push(cxTexts(mm[1]));
  var xml=await rd(sh),rows=[],rr=/<row\b[^>]*>([\s\S]*?)<\/row>/g,rm;
  while((rm=rr.exec(xml))&&rows.length<5001){var row=[],cr=/<c\b([^>]*?)(?:\/>|>([\s\S]*?)<\/c>)/g,cm;
    while((cm=cr.exec(rm[1]))){var at=cm[1]||'',body=cm[2]||'',ref=(/\br="([A-Z]+)\d+"/.exec(at)||[])[1]||'',t=(/\bt="(\w+)"/.exec(at)||[])[1]||'',ci=0,k;
      for(k=0;k<ref.length;k++)ci=ci*26+ref.charCodeAt(k)-64;ci=ci?ci-1:row.length;
      var v=/<v>([\s\S]*?)<\/v>/.exec(body),val='';
      if(t==='inlineStr')val=cxTexts(body);else if(v)val=t==='s'?(ss[+v[1]]||''):cxUnesc(v[1]);
      row[ci]=val}
    rows.push(row)}
  return rows.map(function(r){var o=[];for(var k=0;k<r.length;k++){var x=r[k]==null?'':String(r[k]);o.push('"'+x.replace(/"/g,'""')+'"')}return o.join(',')}).join('\n')}
