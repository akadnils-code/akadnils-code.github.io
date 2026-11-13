/* All In One - module cloud (étape 1) : compte, entreprise, copie des données vers Supabase.
   L'application reste « local d'abord » : ce module n'écrit jamais dans les données locales. */
(function () {
  var URL_ = 'https://nrlganuculkiqmeemert.supabase.co';
  var KEY_ = 'sb_publishable_9v1_3epG7YTW6tY1-xgeEQ_6jNPH86T'; // clé publique par conception
  var SK = 'aio_sb', TK = 'aio_tenant', IK = 'aio_import', CHUNK = 200;
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
    var h = { apikey: KEY_, 'Content-Type': 'application/json' };
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
  }
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
        lsSet(SK, null); CL.tenants = null; CL.tried = false; CL.msg = 'Déconnecté.';
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
    }
    h += '<button class="b full" style="margin-top:6px" data-cl="logout"' + dis + '>Se déconnecter</button></div>';
    return h;
  };
})();
