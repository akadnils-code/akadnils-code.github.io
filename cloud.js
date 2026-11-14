/* All In One - module cloud (étape 1) : compte, entreprise, copie des données vers Supabase.
   L'application reste « local d'abord » : ce module n'écrit jamais dans les données locales. */
(function () {
  var URL_ = 'https://nrlganuculkiqmeemert.supabase.co';
  var KEY_ = 'sb_publishable_9v1_3epG7YTW6tY1-xgeEQ_6jNPH86T'; // clé publique par conception
  var SK = 'aio_sb', TK = 'aio_tenant', IK = 'aio_import', YK = 'aio_sync', CHUNK = 200;
  var CL = { msg: '', err: false, busy: false, tenants: null, loading: false, tried: false, email: '' };
  var ROLES = { owner: 'Propriétaire', admin: 'Administrateur', agent: 'Agent', courier: 'Livreur', vendor: 'Vendeur' };

  function esc(s) {
    return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }
  function lsGet(k) { try { return JSON.parse(localStorage.getItem(k) || 'null'); } catch (x) { return null; } }
  function lsSet(k, v) { try { if (v == null) localStorage.removeItem(k); else localStorage.setItem(k, JSON.stringify(v)); } catch (x) {} }
  function sess() { return lsGet(SK); }
  function redraw() { if (typeof render === 'function') render(); }

  function tr(m) {
    m = String(m || '');
    if (/Invalid login credentials/i.test(m)) return 'E-mail ou mot de passe incorrect.';
    if (/Email not confirmed/i.test(m)) return 'E-mail non confirmé : ouvre le message reçu puis reconnecte-toi.';
    if (/rate limit|too many/i.test(m)) return 'Trop de tentatives : réessaie dans quelques minutes.';
    if (/Failed to fetch|NetworkError|Load failed/i.test(m)) return 'Pas de connexion internet.';
    if (/Accès refusé/.test(m)) return 'Accès refusé : seul le propriétaire ou un administrateur peut faire cette action.';
    return m || 'Erreur inconnue.';
  }

  async function raw(path, opt, tok) {
    var h = Object.assign({ apikey: KEY_, 'Content-Type': 'application/json' }, opt.headers || {});
    if (tok) h.Authorization = 'Bearer ' + tok;
    var r = await fetch(URL_ + path, { method: opt.method || 'GET', headers: h, body: opt.body });
    var txt = await r.text(), j = null;
    try { j = txt ? JSON.parse(txt) : null; } catch (x) {}
    if (!r.ok) {
      var er = new Error((j && (j.msg || j.message || j.error_description || j.error)) || ('Erreur ' + r.status));
      er.status = r.status;
      throw er;
    }
    return j;
  }
  function saveSession(j) {
    if (!j || !j.access_token) return null;
    var s = {
      access_token: j.access_token,
      refresh_token: j.refresh_token,
      expires_at: j.expires_at || Math.floor(Date.now() / 1000) + (j.expires_in || 3600),
      user: { id: j.user && j.user.id, email: j.user && j.user.email }
    };
    lsSet(SK, s);
    return s;
  }
  async function token() {
    var s = sess();
    if (!s) return null;
    if (s.expires_at - 60 > Date.now() / 1000) return s.access_token;
    try {
      var j = await raw('/auth/v1/token?grant_type=refresh_token', { method: 'POST', body: JSON.stringify({ refresh_token: s.refresh_token }) });
      var n = saveSession(j);
      return n && n.access_token;
    } catch (x) {
      if (x.status === 400 || x.status === 401 || x.status === 403) { lsSet(SK, null); return null; }
      throw x;
    }
  }
  async function api(path, opt) {
    var t = await token();
    if (!t) throw new Error('Session expirée : reconnecte-toi.');
    return raw(path, opt || {}, t);
  }

  async function loadTenants() {
    var rows = await api('/rest/v1/memberships?select=role,tenant:tenants(id,name,plan,status)');
    CL.tenants = (rows || []).filter(function (r) { return r.tenant; }).map(function (r) {
      return { id: r.tenant.id, name: r.tenant.name, plan: r.tenant.plan, status: r.tenant.status, role: r.role };
    });
    var cur = lsGet(TK);
    if (!CL.tenants.some(function (t) { return t.id === cur; })) lsSet(TK, CL.tenants.length ? CL.tenants[0].id : null);
    var ct = curTenant();
    lsSet('aio_role', ct ? { tenant: ct.id, role: ct.role } : null);
  }
  // Rôle de la personne connectée (gardé en mémoire pour fonctionner hors ligne)
  window.cloudRole = function () {
    if (!sess()) return null;
    var r = lsGet('aio_role');
    return r && r.tenant === lsGet(TK) ? r.role : null;
  };
  function curTenant() {
    var id = lsGet(TK);
    return (CL.tenants || []).filter(function (t) { return t.id === id; })[0] || null;
  }

  // Prépare la copie des données : retire les images locales et les clés techniques.
  function prepare(db) {
    var imgs = 0;
    function strip(x) {
      if (typeof x === 'string') {
        if (x.indexOf('data:') === 0 && x.length > 200) { imgs++; return ''; }
        return x;
      }
      if (Array.isArray(x)) return x.map(strip);
      if (x && typeof x === 'object') { var o = {}; for (var k in x) o[k] = strip(x[k]); return o; }
      return x;
    }
    var d = strip(JSON.parse(JSON.stringify(db)));
    var s = d.set || {};
    ['db', 'ikey', 'ckey', 'tiles'].forEach(function (k) { delete s[k]; });
    d.set = s;
    return { data: d, imgs: imgs };
  }

  async function importData(tenantId) {
    var p = prepare(DB), d = p.data, orders = d.orders || [], tot = { vendors: 0, orders: 0, couriers: 0, payments: 0, blacklist: 0 };
    function add(r) { if (r) for (var k in tot) tot[k] += +r[k] || 0; }
    var first = { vend: d.vend || [], pay: d.pay || [], cour: d.cour || [], bl: d.bl || [], set: d.set, orders: orders.slice(0, CHUNK) };
    add(await api('/rest/v1/rpc/import_local_data', { method: 'POST', body: JSON.stringify({ p_tenant: tenantId, p_data: first }) }));
    for (var i = CHUNK; i < orders.length; i += CHUNK) {
      add(await api('/rest/v1/rpc/import_local_data', { method: 'POST', body: JSON.stringify({ p_tenant: tenantId, p_data: { set: d.set, orders: orders.slice(i, i + CHUNK) } }) }));
    }
    lsSet(IK, { at: Date.now(), tenant: tenantId, counts: tot, imgs: p.imgs });
    return tot;
  }


  /* ---------- synchronisation (étape 2a) ----------
     Principe : « le dernier à envoyer gagne », enregistrement par enregistrement.
     On envoie d'abord les modifications locales, puis on reçoit celles des autres appareils.
     Une modification locale pas encore envoyée n'est jamais écrasée par la réception.
     Les images ne sont pas synchronisées (étape 2c) : elles restent sur chaque appareil. */
  var TBL = [
    { k: 'orders', t: 'orders', row: function (r) { return { phone: sn(r.phone), vendor_name: sn(r.vendor), status: sn(r.status), delivery: sn(r.delivery), order_date: sn(r.date), tid: sn(r.tid) }; } },
    { k: 'vend', t: 'vendors', row: function (r) { return { name: String(r.name || '') }; } },
    { k: 'cour', t: 'couriers', row: function (r) { return { name: String(r.name || ''), phone: sn(r.phone), city: sn(r.city) }; } },
    { k: 'pay', t: 'payments', row: function (r) { return { vendor_id: sn(r.vid), amount: isFinite(+r.amount) ? +r.amount : 0 }; } }
  ];
  var syncing = false, pushTimer = null, lastAuto = 0;
  function sn(v) { return v == null || v === '' ? null : String(v); }
  function canon(x) {
    if (Array.isArray(x)) return '[' + x.map(canon).join(',') + ']';
    if (x && typeof x === 'object') {
      return '{' + Object.keys(x).filter(function (k) { return x[k] !== undefined; }).sort().map(function (k) { return JSON.stringify(k) + ':' + canon(x[k]); }).join(',') + '}';
    }
    return JSON.stringify(x);
  }
  function hash(str) {
    var h1 = 0xdeadbeef, h2 = 0x41c6ce57, i, ch;
    for (i = 0; i < str.length; i++) {
      ch = str.charCodeAt(i);
      h1 = Math.imul(h1 ^ ch, 2654435761);
      h2 = Math.imul(h2 ^ ch, 1597334677);
    }
    h1 = Math.imul(h1 ^ (h1 >>> 16), 2246822507) ^ Math.imul(h2 ^ (h2 >>> 13), 3266489909);
    h2 = Math.imul(h2 ^ (h2 >>> 16), 2246822507) ^ Math.imul(h1 ^ (h1 >>> 13), 3266489909);
    return (4294967296 * (2097151 & h2) + (h1 >>> 0)).toString(36);
  }
  function stripD(x) {
    if (typeof x === 'string') return x.indexOf('data:') === 0 && x.length > 200 ? '' : x;
    if (Array.isArray(x)) return x.map(stripD);
    if (x && typeof x === 'object') { var o = {}; for (var k in x) o[k] = stripD(x[k]); return o; }
    return x;
  }
  // Remet les images locales aux endroits où le cloud a une chaîne vide
  function restore(cloud, local) {
    if (typeof cloud === 'string') return cloud === '' && typeof local === 'string' && local.indexOf('data:') === 0 ? local : cloud;
    if (Array.isArray(cloud)) return cloud.map(function (c, i) { return restore(c, Array.isArray(local) ? local[i] : undefined); });
    if (cloud && typeof cloud === 'object') {
      var o = {};
      for (var k in cloud) o[k] = restore(cloud[k], local && typeof local === 'object' ? local[k] : undefined);
      return o;
    }
    return cloud;
  }
  function yGet() { return lsGet(YK); }
  function yNew(tenant) {
    return { tenant: tenant, on: true, hashes: { orders: {}, vend: {}, cour: {}, pay: {} }, bl: [], lastPull: {}, last: null };
  }
  function qin(list) { return '(' + list.map(function (v) { return '"' + String(v).replace(/\\/g, '\\\\').replace(/"/g, '\\"') + '"'; }).join(',') + ')'; }
  function chunks(a, n) { var r = []; for (var i = 0; i < a.length; i += n) r.push(a.slice(i, i + n)); return r; }

  async function pushAll(st) {
    var up = 0, ten = st.tenant;
    for (var ti = 0; ti < TBL.length; ti++) {
      var T = TBL[ti], cur = {}, byId = {};
      (DB[T.k] || []).forEach(function (r) {
        if (!r || r.id == null) return;
        var id = String(r.id), s = stripD(r), hh = hash(canon(s));
        cur[id] = hh;
        if (st.hashes[T.k][id] !== hh) byId[id] = Object.assign({ tenant_id: ten, id: id }, T.row(r), { data: s, deleted_at: null });
      });
      var rows = Object.keys(byId).map(function (k) { return byId[k]; });
      var parts = chunks(rows, 100);
      for (var p = 0; p < parts.length; p++) {
        await api('/rest/v1/' + T.t + '?on_conflict=tenant_id,id', { method: 'POST', headers: { Prefer: 'resolution=merge-duplicates,return=minimal' }, body: JSON.stringify(parts[p]) });
        parts[p].forEach(function (r) { st.hashes[T.k][r.id] = cur[r.id]; });
        up += parts[p].length;
        lsSet(YK, st);
      }
      var gone = Object.keys(st.hashes[T.k]).filter(function (id) { return !(id in cur); });
      var gp = chunks(gone, 100);
      for (var g = 0; g < gp.length; g++) {
        await api('/rest/v1/' + T.t + '?tenant_id=eq.' + ten + '&id=in.' + encodeURIComponent(qin(gp[g])), { method: 'PATCH', headers: { Prefer: 'return=minimal' }, body: JSON.stringify({ deleted_at: new Date().toISOString() }) });
        gp[g].forEach(function (id) { delete st.hashes[T.k][id]; });
        up += gp[g].length;
        lsSet(YK, st);
      }
    }
    // Liste noire (simple liste de numéros)
    var blNow = Array.from(new Set((DB.bl || []).map(String).filter(Boolean)));
    var add = blNow.filter(function (p) { return st.bl.indexOf(p) < 0; });
    var del = st.bl.filter(function (p) { return blNow.indexOf(p) < 0; });
    var ap = chunks(add, 100);
    for (var a = 0; a < ap.length; a++) {
      await api('/rest/v1/blacklist?on_conflict=tenant_id,phone', { method: 'POST', headers: { Prefer: 'resolution=merge-duplicates,return=minimal' }, body: JSON.stringify(ap[a].map(function (p) { return { tenant_id: ten, phone: p }; })) });
      up += ap[a].length;
    }
    var dp = chunks(del, 100);
    for (var d = 0; d < dp.length; d++) {
      await api('/rest/v1/blacklist?tenant_id=eq.' + ten + '&phone=in.' + encodeURIComponent(qin(dp[d])), { method: 'DELETE', headers: { Prefer: 'return=minimal' } });
      up += dp[d].length;
    }
    st.bl = blNow;
    lsSet(YK, st);
    return up;
  }

  async function pullAll(st) {
    var down = 0, ten = st.tenant;
    for (var ti = 0; ti < TBL.length; ti++) {
      var T = TBL[ti], list = DB[T.k] = DB[T.k] || [], idx = {};
      list.forEach(function (r, i) { if (r && r.id != null) idx[String(r.id)] = r; });
      var since = st.lastPull[T.k] || null, seen = null, drop = {};
      for (;;) {
        var rows = await api('/rest/v1/' + T.t + '?select=id,data,updated_at,deleted_at&tenant_id=eq.' + ten + (since ? '&updated_at=gte.' + encodeURIComponent(since) : '') + '&order=updated_at.asc&limit=500');
        if (!rows || !rows.length) break;
        rows.forEach(function (row) {
          var id = String(row.id), loc = idx[id], lh = loc ? hash(canon(stripD(loc))) : null, synced = st.hashes[T.k][id];
          if (row.deleted_at) {
            if (loc && lh === synced) { drop[id] = 1; delete idx[id]; delete st.hashes[T.k][id]; down++; }
            return;
          }
          var cloud = row.data;
          if (!cloud || typeof cloud !== 'object' || Array.isArray(cloud)) return;
          if (cloud.id == null) cloud.id = row.id;
          var ch = hash(canon(cloud));
          if (loc) {
            if (lh !== synced) return;               // modification locale en attente : elle gagne
            if (ch === lh) { st.hashes[T.k][id] = ch; return; }
            var m = restore(cloud, loc);
            list[list.indexOf(loc)] = m; idx[id] = m;
          } else {
            list.push(cloud); idx[id] = cloud;
          }
          st.hashes[T.k][id] = ch; down++;
        });
        seen = rows[rows.length - 1].updated_at;
        if (rows.length < 500) break;
        since = seen;
      }
      if (Object.keys(drop).length) DB[T.k] = DB[T.k].filter(function (r) { return !(r && drop[String(r.id)]); });
      if (seen) st.lastPull[T.k] = seen;
    }
    var bl = await api('/rest/v1/blacklist?select=phone&tenant_id=eq.' + ten + '&limit=5000');
    var cl = (bl || []).map(function (r) { return String(r.phone); }), clSet = {};
    cl.forEach(function (p) { clSet[p] = 1; });
    var removed = st.bl.filter(function (p) { return !clSet[p]; });
    var before = (DB.bl || []).length;
    var nb = (DB.bl || []).map(String).filter(function (p) { return removed.indexOf(p) < 0; });
    cl.forEach(function (p) { if (nb.indexOf(p) < 0) nb.push(p); });
    if (nb.length !== before || nb.some(function (p, i) { return String((DB.bl || [])[i]) !== p; })) down += Math.abs(nb.length - before) || 1;
    DB.bl = nb;
    st.bl = nb.slice();
    lsSet(YK, st);
    return down;
  }

  function typing() {
    var a = document.activeElement;
    return !!(a && /^(INPUT|TEXTAREA|SELECT)$/.test(a.tagName));
  }

  // Synchronisation complète : envoi puis réception. Renvoie { up, down } ou null si ignorée.
  async function sync(manual) {
    var st = yGet();
    if (syncing || !st || !st.on || typeof DB === 'undefined' || !DB || !sess()) return null;
    syncing = true; CL.syncing = true;
    try {
      var up = await pushAll(st), down = await pullAll(st);
      st.last = { at: Date.now(), up: up, down: down, err: '' };
      lsSet(YK, st);
      if (down) {
        if (typeof save === 'function') save();
        if (manual || !typing()) redraw();
      }
      if (manual) { CL.msg = 'Synchronisation terminée : ' + up + ' envoyé(s), ' + down + ' reçu(s).'; CL.err = false; }
      return { up: up, down: down };
    } catch (x) {
      st.last = { at: Date.now(), up: 0, down: 0, err: tr(x.message) };
      lsSet(YK, st);
      if (manual) { CL.msg = tr(x.message); CL.err = true; }
      return null;
    } finally {
      syncing = false; CL.syncing = false;
      if (manual) redraw();
    }
  }
  window.cloudSync = function () { return sync(true); };

  // Webhook universel (étape 2d) : enregistre la clé d'import de l'entreprise courante
  window.cloudWebhookUrl = function (key) { return URL_ + '/functions/v1/webhook/' + key; };
  window.cloudWebhook = async function (key, vendor) {
    try {
      if (!CL.tenants) await loadTenants();
      var ct = curTenant();
      if (!ct) throw new Error('Crée d’abord ton entreprise (Compte → Connexions).');
      await api('/rest/v1/rpc/register_webhook_key', { method: 'POST', body: JSON.stringify({ p_tenant: ct.id, p_key: key, p_vendor: vendor || '' }) });
    } catch (x) { throw new Error(tr(x.message)); }
  };

  function schedulePush() {
    var st = yGet();
    if (!st || !st.on) return;
    clearTimeout(pushTimer);
    pushTimer = setTimeout(function () { sync(false); }, 4000);
  }
  // Intercepte save() pour envoyer les changements peu après chaque enregistrement local
  if (typeof save === 'function') {
    var _save = save;
    window.save = function () { var r = _save.apply(this, arguments); schedulePush(); return r; };
  }
  function auto() {
    if (document.hidden || (typeof navigator !== 'undefined' && navigator.onLine === false)) return;
    if (Date.now() - lastAuto < 30000) return;
    lastAuto = Date.now();
    sync(false);
  }
  if (typeof setInterval === 'function') setInterval(auto, 120000);
  document.addEventListener('visibilitychange', function () { if (!document.hidden) auto(); });
  if (typeof setTimeout === 'function') setTimeout(auto, 3000);
  if (sess()) loadTenants().then(redraw).catch(function () {});

  async function run(fn) {
    CL.busy = true; CL.msg = ''; CL.err = false;
    redraw();
    try { await fn(); } catch (x) { CL.msg = tr(x.message); CL.err = true; } finally { CL.busy = false; redraw(); }
  }

  function val(id) { var el = document.getElementById(id); return el ? el.value : ''; }

  document.addEventListener('click', function (ev) {
    var t = ev.target.closest && ev.target.closest('[data-cl]');
    if (!t || CL.busy) return;
    var a = t.getAttribute('data-cl');
    if (a === 'login' || a === 'signup') {
      var em = val('cl-em').trim(), pw = val('cl-pw');
      CL.email = em;
      if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(em)) { CL.msg = 'E-mail invalide.'; CL.err = true; redraw(); return; }
      if (pw.length < 8) { CL.msg = 'Le mot de passe doit avoir au moins 8 caractères.'; CL.err = true; redraw(); return; }
      run(async function () {
        if (a === 'signup') {
          var j = await raw('/auth/v1/signup', { method: 'POST', body: JSON.stringify({ email: em, password: pw }) });
          if (j && j.access_token) { saveSession(j); CL.tenants = null; CL.tried = false; CL.msg = 'Compte créé et connecté.'; }
          else CL.msg = 'Compte créé. Ouvre l’e-mail de confirmation reçu, puis reviens te connecter.';
        } else {
          saveSession(await raw('/auth/v1/token?grant_type=password', { method: 'POST', body: JSON.stringify({ email: em, password: pw }) }));
          CL.tenants = null; CL.tried = false; CL.msg = 'Connecté.';
        }
      });
    } else if (a === 'logout') {
      run(async function () {
        var tk = null;
        try { tk = await token(); if (tk) await raw('/auth/v1/logout', { method: 'POST' }, tk); } catch (x) {}
        lsSet(SK, null); lsSet('aio_role', null); CL.tenants = null; CL.tried = false; CL.msg = 'Déconnecté.';
      });
    } else if (a === 'reload') {
      CL.tenants = null; CL.tried = false; CL.msg = ''; redraw();
    } else if (a === 'create') {
      var nm = val('cl-tn').trim();
      if (nm.length < 2 || nm.length > 80) { CL.msg = 'Nom d’entreprise : 2 à 80 caractères.'; CL.err = true; redraw(); return; }
      run(async function () {
        var id = await api('/rest/v1/rpc/create_tenant', { method: 'POST', body: JSON.stringify({ p_name: nm }) });
        lsSet(TK, id);
        await loadTenants();
        CL.msg = 'Entreprise créée.';
      });
    } else if (a === 'syncon') {
      var cs = curTenant();
      if (!cs) return;
      if (typeof DB === 'undefined' || !DB) { CL.msg = 'Déverrouille l’application avant d’activer la synchronisation.'; CL.err = true; redraw(); return; }
      if (!confirm('Activer la synchronisation avec « ' + cs.name + ' » ? Une sauvegarde de tes données actuelles sera d’abord téléchargée. Ensuite, tes données seront envoyées au cloud et celles des autres appareils seront reçues. Les images ne sont pas synchronisées.')) return;
      if (DB.orders.length || DB.vend.length) { var bb = document.createElement('button'); bb.setAttribute('data-act', 'bak'); bb.hidden = true; document.body.appendChild(bb); bb.click(); bb.remove(); }
      var old = yGet();
      lsSet(YK, old && old.tenant === cs.id ? Object.assign(old, { on: true }) : yNew(cs.id));
      run(async function () { await sync(true); });
    } else if (a === 'syncoff') {
      var so = yGet();
      if (so) { so.on = false; lsSet(YK, so); }
      CL.msg = 'Synchronisation désactivée. Tes données locales sont conservées.'; CL.err = false; redraw();
    } else if (a === 'syncnow') {
      run(async function () { await sync(true); });
    } else if (a === 'import') {
      var ct = curTenant();
      if (!ct) return;
      if (typeof DB === 'undefined' || !DB) { CL.msg = 'Déverrouille l’application avant l’envoi.'; CL.err = true; redraw(); return; }
      if (!confirm('Envoyer une copie de tes données (commandes, vendeurs, livreurs, paiements, réglages) vers l’espace cloud de « ' + ct.name + ' » ? Les photos restent sur ce téléphone. Tu peux recommencer à tout moment : les données sont mises à jour, pas dupliquées.')) return;
      run(async function () {
        var r = await importData(ct.id);
        CL.msg = 'Copie terminée : ' + r.orders + ' commande(s), ' + r.vendors + ' vendeur(s), ' + r.couriers + ' livreur(s), ' + r.payments + ' paiement(s).';
      });
    }
  });

  // Carte affichée dans Réglages
  window.cloudCard = function () {
    var s = sess(), dis = CL.busy ? ' disabled' : '', h = '<div class="card"><h2>Compte cloud</h2>';
    if (CL.msg) h += '<div class="msg' + (CL.err ? ' err' : '') + '">' + esc(CL.msg) + '</div>';
    if (!s) {
      h += '<p class="mut">Crée un compte pour sauvegarder tes données dans le cloud et, bientôt, les partager avec ton équipe. L’application continue de fonctionner hors ligne comme avant.</p>'
        + '<label>E-mail</label><input type="email" id="cl-em" autocomplete="username" value="' + esc(CL.email) + '">'
        + '<label>Mot de passe (8 caractères minimum)</label><input type="password" id="cl-pw" autocomplete="current-password">'
        + '<div class="btns"><button class="b pri" data-cl="login"' + dis + '>Connexion</button><button class="b" data-cl="signup"' + dis + '>Créer un compte</button></div></div>';
      return h;
    }
    if (CL.tenants === null && !CL.loading && !CL.tried) {
      CL.loading = true;
      loadTenants().catch(function (x) { CL.msg = tr(x.message); CL.err = true; }).then(function () {
        CL.loading = false; CL.tried = true; redraw();
      });
    }
    h += '<p class="mut">Connecté : ' + esc((s.user && s.user.email) || '') + '</p>';
    if (CL.tenants === null) {
      h += CL.tried ? '<button class="b full" data-cl="reload">Réessayer</button>' : '<p class="mut">Chargement…</p>';
    } else if (!CL.tenants.length) {
      h += '<p class="mut">Aucune entreprise. Crée la tienne :</p><label>Nom de l’entreprise</label><input id="cl-tn" maxlength="80">'
        + '<button class="b pri full" data-cl="create"' + dis + '>Créer mon entreprise</button>';
    } else {
      var c = curTenant(), im = lsGet(IK);
      h += '<p><b>' + esc(c.name) + '</b> · ' + esc(ROLES[c.role] || c.role) + ' · offre ' + esc(c.plan === 'trial' ? 'essai' : c.plan) + '</p>';
      if (c.status !== 'active') h += '<div class="msg err">Cette entreprise est suspendue.</div>';
      h += '<p class="mut">L’envoi crée une copie dans le cloud (serveurs hors du Maroc). Pour l’instant l’application continue de lire et d’écrire sur ce téléphone.</p>';
      if (im && im.tenant === c.id) {
        h += '<p class="mut">Dernière copie : ' + esc(new Date(im.at).toLocaleString('fr-FR')) + ' · ' + esc(im.counts.orders) + ' commande(s)'
          + (im.imgs ? ' · ' + esc(im.imgs) + ' image(s) non envoyée(s), conservée(s) sur ce téléphone' : '') + '</p>';
      }
      if (c.role === 'owner' || c.role === 'admin') h += '<button class="b pri full" data-cl="import"' + dis + '>Envoyer une copie de mes données</button>';
      if (c.role === 'owner' || c.role === 'admin' || c.role === 'agent') {
        var ys = yGet();
        h += '<h2 style="margin-top:14px">Synchronisation</h2>';
        if (ys && ys.on && ys.tenant === c.id) {
          h += '<p class="mut">Activée' + (ys.last ? ' · dernière : ' + esc(new Date(ys.last.at).toLocaleString('fr-FR')) + (ys.last.err ? ' · erreur : ' + esc(ys.last.err) : ' · ' + esc(ys.last.up) + ' envoyé(s), ' + esc(ys.last.down) + ' reçu(s)') : '') + '</p>'
            + '<button class="b pri full" data-cl="syncnow"' + (CL.busy || CL.syncing ? ' disabled' : '') + '>Synchroniser maintenant</button>'
            + '<button class="b full" style="margin-top:6px" data-cl="syncoff"' + dis + '>Désactiver la synchronisation</button>';
        } else {
          h += '<p class="mut">Garde tes données identiques entre plusieurs appareils et personnes de l’équipe. Les images restent sur chaque appareil pour l’instant.</p>'
            + '<button class="b pri full" data-cl="syncon"' + dis + '>Activer la synchronisation</button>';
        }
      }
    }
    h += '<button class="b full" style="margin-top:6px" data-cl="logout"' + dis + '>Se déconnecter</button></div>';
    return h;
  };
})();
