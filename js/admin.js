/* Панель мастера: всё содержимое сайта редактируется здесь. */
(function () {
  'use strict';
  const $ = (s, r) => (r || document).querySelector(s);
  const $$ = (s, r) => Array.from((r || document).querySelectorAll(s));
  const esc = Y.esc;
  const root = $('#adminRoot');
  const I = (d) => '<svg class="i" viewBox="0 0 24 24">' + d + '</svg>';
  const IC = {
    bookings: I('<rect x="3" y="4.5" width="18" height="16" rx="2"/><path d="M3 9.5h18M8 2.5v4M16 2.5v4"/>'),
    schedule: I('<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>'),
    services: I('<path d="M3 12V4h8l10 10-8 8z"/><circle cx="7.5" cy="7.5" r="1.5"/>'),
    portfolio: I('<rect x="3" y="4" width="18" height="16" rx="2"/><circle cx="9" cy="10" r="2"/><path d="m21 16-5-5-8 9"/>'),
    about: I('<circle cx="12" cy="8" r="4"/><path d="M4 21c1.5-4 4.5-6 8-6s6.5 2 8 6"/>'),
    contacts: I('<path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2"/>'),
    reviews: I('<path d="M12 3l2.7 5.6 6.1.9-4.4 4.3 1 6.1L12 17l-5.4 2.9 1-6.1L3.2 9.5l6.1-.9z"/>'),
    music: I('<path d="M9 18V5l11-2v13"/><circle cx="6" cy="18" r="3"/><circle cx="17" cy="16" r="3"/>'),
    notify: I('<path d="M6 16V11a6 6 0 1 1 12 0v5l2 2H4z"/><path d="M10 21h4"/>'),
    site: I('<circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.7 1.7 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.8-.3 1.7 1.7 0 0 0-1 1.5V21a2 2 0 1 1-4 0v-.1a1.7 1.7 0 0 0-1.1-1.5 1.7 1.7 0 0 0-1.8.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.7 1.7 0 0 0 .3-1.8 1.7 1.7 0 0 0-1.5-1H3a2 2 0 1 1 0-4h.1a1.7 1.7 0 0 0 1.5-1.1 1.7 1.7 0 0 0-.3-1.8l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.7 1.7 0 0 0 1.8.3H9a1.7 1.7 0 0 0 1-1.5V3a2 2 0 1 1 4 0v.1a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.8-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.7 1.7 0 0 0-.3 1.8V9a1.7 1.7 0 0 0 1.5 1H21a2 2 0 1 1 0 4h-.1a1.7 1.7 0 0 0-1.5 1z"/>'),
    up: I('<path d="M12 19V5M6 11l6-6 6 6"/>'),
    down: I('<path d="M12 5v14M6 13l6 6 6-6"/>'),
    left: I('<path d="M15 6l-6 6 6 6"/>'),
    right: I('<path d="M9 6l6 6-6 6"/>'),
    trash: I('<path d="M4 7h16M10 11v6M14 11v6M6 7l1 13h10l1-13M9 7V4h6v3"/>'),
    plus: I('<path d="M12 5v14M5 12h14"/>'),
    eye: I('<path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12z"/><circle cx="12" cy="12" r="3"/>'),
    eyeOff: I('<path d="M3 3l18 18M10.6 5.1A10 10 0 0 1 12 5c6.5 0 10 7 10 7a17 17 0 0 1-3 3.9M6.6 6.6A17 17 0 0 0 2 12s3.5 7 10 7a9.6 9.6 0 0 0 5.4-1.6"/>'),
    out: I('<path d="M15 4h4v16h-4M10 16l4-4-4-4M14 12H3"/>'),
    msg: I('<path d="M4 5h16v11H8l-4 4z"/>'),
    phone: I('<path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2"/>'),
    mail: I('<rect x="3" y="5" width="18" height="14" rx="2"/><path d="m3 7 9 6 9-6"/>'),
    edit: I('<path d="M4 20h4L19 9l-4-4L4 16z"/>'),
    refresh: I('<path d="M20 11a8 8 0 1 0-2.3 5.7M20 4v7h-7"/>'),
    play: '<svg class="i" viewBox="0 0 24 24" style="fill:currentColor;stroke:none"><path d="M8 5v14l11-7z"/></svg>',
    pause: '<svg class="i" viewBox="0 0 24 24" style="fill:currentColor;stroke:none"><path d="M7 5h3v14H7zM14 5h3v14h-3z"/></svg>'
  };
  const TABS = [
    ['bookings', 'Записи'], ['schedule', 'Расписание'], ['services', 'Услуги и цены'], ['portfolio', 'Портфолио'],
    ['about', 'О мастере'], ['contacts', 'Контакты'], ['reviews', 'Отзывы'], ['music', 'Музыка'],
    ['notify', 'Уведомления'], ['site', 'Настройки сайта']
  ];
  const KIND = { s: 'settings', svc: 'services', ex: 'exceptions', ph: 'photos' };
  const SAVE_ACTION = { settings: 'saveSettings', services: 'saveServices', exceptions: 'saveExceptions', photos: 'savePhotos' };
  const ACCENTS = [['#d4af37', 'Золото'], ['#e3c38a', 'Шампань'], ['#c0c0c0', 'Серебро'], ['#cd7f32', 'Бронза'], ['#d8a08a', 'Розовое золото'], ['#5fa582', 'Изумруд']];

  const A = { open: false, tab: 'bookings', filter: 'upcoming', q: '', calMonth: null, dirty: new Set(), trash: [], s: null, services: [], photos: [], exceptions: [], bookings: [], demo: false };
  const today = () => Y.now().date;
  const cap = Y.cap;

  /* ---------- вход ---------- */
  function openAdmin() {
    if (A.open) return;
    document.body.classList.add('adm-lock');
    if (Y.api.password()) loadAll(true);
    else showLogin();
  }
  function showLogin(err) {
    root.innerHTML = '<div class="adm-login"><form class="adm-login__card" id="admLogin">' +
      '<img src="img/logo.png" alt="">' +
      '<h2>Вход для мастера</h2><p>Управление записями, расписанием, услугами, фото и всем содержимым сайта.' + (Y.api.demo ? '<br><b>Демо-режим:</b> пароль <code>admin</code>' : '') + '</p>' +
      '<label class="a-field"><span>Пароль</span><input class="a-in" type="password" id="admPw" autocomplete="current-password" required></label>' +
      (err ? '<p style="color:#ff8a7e;margin:10px 0 0">' + esc(err) + '</p>' : '') +
      '<button class="btn btn--solid" type="submit">Войти</button>' +
      '<div class="adm-login__foot"><button type="button" data-a="closeLogin">Вернуться на сайт</button></div>' +
    '</form></div>';
    setTimeout(() => { const i = $('#admPw'); if (i) i.focus(); }, 50);
  }
  root.addEventListener('submit', async (e) => {
    if (e.target.id !== 'admLogin') return;
    e.preventDefault();
    const btn = $('button[type=submit]', e.target);
    btn.classList.add('is-loading');
    Y.api.setPassword($('#admPw').value);
    try {
      await Y.api.admin('login');
      loadAll(true);
    } catch (err) {
      Y.api.setPassword('');
      let msg = err.code === 'auth' ? (err.message || 'Неверный пароль') : err.message;
      if (!Y.api.demo) {
        try {
          const pub = await Y.api.publicData();
          if (!pub.version) msg = 'На сервере работает старая версия скрипта, поэтому пароль не принимается. Обновите Code.gs и сделайте «Новую версию» развёртывания (README → «Обновление»). После этого пароль по умолчанию — yakunin2026.';
        } catch (e2) {}
      }
      showLogin(msg);
    }
  });

  async function loadAll(first) {
    if (first) root.innerHTML = '<div class="adm"><div class="adm__top"><div class="adm__title">Загрузка…</div></div></div>';
    try {
      const d = await Y.api.admin('adminData');
      A.s = Y.mergeSettings(d.settings);
      A.services = d.services && d.services.length ? d.services : Y.clone(Y.DEFAULT_SERVICES);
      A.services.forEach((s) => { if (!s.icon) s.icon = 'sparkle'; });
      A.photos = d.photos || [];
      A.exceptions = d.exceptions || [];
      A.bookings = d.bookings || [];
      A.clientReviews = d.clientReviews || [];
      A.demo = !!d.demo || Y.api.demo;
      A.serverVersion = d.version || 0;
      A.dirty.clear();
      A.trash = [];
      A.open = true;
      render();
    } catch (err) {
      if (err.code === 'auth') { Y.api.setPassword(''); showLogin('Войдите снова'); }
      else { closeAdmin(true); Y.toast('Не удалось открыть панель: ' + err.message, true); }
    }
  }
  async function refreshBookings() {
    try {
      const d = await Y.api.admin('adminData');
      A.bookings = d.bookings || [];
      A.clientReviews = d.clientReviews || [];
      if ((A.tab === 'bookings' || A.tab === 'schedule') && !$('.a-modal')) renderMain();
    } catch (e) {}
  }
  function closeAdmin(force) {
    if (!force && A.dirty.size && !confirm('Есть несохранённые изменения. Выйти без сохранения?')) return;
    A.open = false;
    root.innerHTML = '';
    document.body.classList.remove('adm-lock');
    if (location.hash === '#admin') history.replaceState(null, '', location.pathname + location.search);
    if (Y.reloadPublic) Y.reloadPublic();
  }

  /* ---------- каркас ---------- */
  const pendingCount = () => (A.clientReviews || []).filter((r) => r.rstatus === 'pending').length;
  const newCount = () => A.bookings.filter((b) => b.status === 'new' && b.date >= today()).length;
  function render() {
    const n = newCount();
    root.innerHTML = '<div class="adm">' +
      '<div class="adm__top"><div class="adm__title"><img src="' + esc(A.s.site.logo ? Y.img(A.s.site.logo, 200) : Y.DEFAULT_LOGO) + '" alt=""><span>Панель мастера</span>' + (A.demo ? '<span class="adm__badge">ДЕМО</span>' : '') + '</div>' +
        '<button class="a-btn a-btn--sm" data-a="close">' + IC.eye + '<span>На сайт</span></button>' +
        '<button class="a-btn a-btn--sm" data-a="logout" title="Выйти">' + IC.out + '<span>Выйти</span></button></div>' +
      '<div class="adm__body"><nav class="adm__tabs">' +
        TABS.map(([k, l]) => '<button class="adm__tab' + (A.tab === k ? ' is-on' : '') + '" data-tab="' + k + '">' + IC[k] + l + (k === 'bookings' ? '<em' + (n ? '' : ' hidden') + '>' + n + '</em>' : k === 'reviews' && pendingCount() ? '<em>' + pendingCount() + '</em>' : '') + '</button>').join('') +
      '</nav><main class="adm__main" id="admMain"></main></div>' +
      '<div id="admSave"></div><div id="admModal"></div></div>';
    renderMain();
  }
  const TAB_FN = {};
  function renderMain() {
    const m = $('#admMain');
    if (!m) return;
    const warn = !A.demo && A.serverVersion < Y.SERVER_VERSION ? '<div class="a-note" style="border-color:var(--danger);background:rgba(231,76,60,.1)"><b>На сервере старая версия скрипта.</b> Часть функций (письма клиентам, отмена по ссылке, запись на услуги по умолчанию) не работает. Откройте Apps Script → вставьте новый Code.gs → выполните setup → Развернуть → Управление развёртываниями → ✏️ → «Новая версия».</div>' : '';
    m.innerHTML = '<div class="adm__inner">' + warn + TAB_FN[A.tab]() + '</div>';
    renderSaveBar();
    const badge = $('.adm__tab[data-tab="bookings"] em');
    if (badge) { const n = newCount(); badge.textContent = n; badge.hidden = !n; }
    if (A.tab === 'portfolio') bindPhotoDnd();
  }
  function renderSaveBar() {
    const el = $('#admSave');
    if (el) el.innerHTML = A.dirty.size ? '<div class="a-save"><span>Есть несохранённые изменения</span><button class="a-btn a-btn--sm" data-a="discard">Отменить</button><button class="a-btn a-btn--sm a-btn--gold" data-a="save">Сохранить</button></div>' : '';
  }
  function markDirty(kind) {
    const had = A.dirty.size;
    A.dirty.add(kind);
    if (!had) renderSaveBar();
  }
  async function saveAll(silent) {
    if (!A.dirty.size) return true;
    const btn = $('[data-a="save"]');
    if (btn) { btn.disabled = true; btn.textContent = 'Сохраняем…'; }
    if (A.dirty.has('settings') && !A.s.site.siteUrl && /^https?:/.test(location.protocol) && !/localhost|127\.0\.0\.1/.test(location.hostname)) {
      A.s.site.siteUrl = location.origin + location.pathname.replace(/index\.html$/, '');
    }
    try {
      for (const kind of Array.from(A.dirty)) {
        const body = {};
        if (kind === 'settings') body.settings = A.s;
        if (kind === 'services') body.services = A.services;
        if (kind === 'photos') body.photos = A.photos;
        if (kind === 'exceptions') body.exceptions = A.exceptions;
        await Y.api.admin(SAVE_ACTION[kind], body);
        A.dirty.delete(kind);
      }
      for (const id of A.trash.splice(0)) { try { await Y.api.admin('deleteFile', { fileId: id }); } catch (e) {} }
      if (Y.applyLocal) Y.applyLocal({ settings: A.s, services: A.services, photos: A.photos, exceptions: A.exceptions });
      if (!silent) Y.toast('Сохранено — изменения уже на сайте');
      renderSaveBar();
      return true;
    } catch (e) {
      Y.toast('Ошибка сохранения: ' + e.message, true);
      renderSaveBar();
      return false;
    }
  }

  /* ---------- привязка полей ---------- */
  const rootOf = (k) => ({ s: A.s, svc: A.services, ex: A.exceptions, ph: A.photos }[k]);
  function getPath(path) {
    const p = path.split('.');
    let o = rootOf(p[0]);
    for (let i = 1; i < p.length && o != null; i++) o = o[p[i]];
    return o;
  }
  function setPath(path, val) {
    const p = path.split('.');
    let o = rootOf(p[0]);
    for (let i = 1; i < p.length - 1; i++) {
      if (o[p[i]] == null || typeof o[p[i]] !== 'object') o[p[i]] = {};
      o = o[p[i]];
    }
    o[p[p.length - 1]] = val;
    markDirty(KIND[p[0]]);
  }
  function inp(path, label, o) {
    o = o || {};
    let v = getPath(path);
    if (o.t === 'lines' && Array.isArray(v)) v = v.join('\n');
    const attrs = ' data-p="' + path + '"' + (o.t ? ' data-t="' + o.t + '"' : '') + (o.ph ? ' placeholder="' + esc(o.ph) + '"' : '') + (o.list ? ' list="' + o.list + '"' : '') + (o.rerender ? ' data-rerender="1"' : '') + (o.attrs || '');
    let ctrl;
    if (o.ta) ctrl = '<textarea class="a-ta" rows="' + (o.rows || 4) + '"' + attrs + '>' + esc(v == null ? '' : v) + '</textarea>';
    else if (o.options) ctrl = '<select class="a-sel"' + attrs + '>' + o.options.map((x) => '<option value="' + esc(x[0]) + '"' + (String(x[0]) === String(v) ? ' selected' : '') + '>' + esc(x[1]) + '</option>').join('') + '</select>';
    else ctrl = '<input class="a-in" type="' + (o.type || 'text') + '" value="' + esc(v == null ? '' : v) + '"' + attrs + '>';
    return '<label class="a-field' + (o.full ? ' a-full' : '') + '"><span>' + label + '</span>' + ctrl + (o.hint ? '<small>' + o.hint + '</small>' : '') + '</label>';
  }
  function sw(path, label, hint, rerender) {
    return '<div class="a-field"><label class="a-switch"><input type="checkbox" data-p="' + path + '" data-t="bool"' + (rerender ? ' data-rerender="1"' : '') + (getPath(path) ? ' checked' : '') + '>' + label + '</label>' + (hint ? '<small>' + hint + '</small>' : '') + '</div>';
  }
  function readVal(el) {
    const t = el.dataset.t;
    if (t === 'bool') return el.checked;
    if (t === 'num') return el.value === '' ? '' : +el.value;
    if (t === 'lines') return el.value.split('\n').map((x) => x.trim()).filter(Boolean);
    return el.value;
  }
  root.addEventListener('input', (e) => {
    const el = e.target.closest('[data-p]');
    if (el && el.type !== 'checkbox' && el.tagName !== 'SELECT') {
      setPath(el.dataset.p, readVal(el));
      if (el.type === 'color' || el.type === 'range') livePreview();
    }
    if (e.target.id === 'aSearch') { A.q = e.target.value; const l = $('#bkList'); if (l) l.innerHTML = bookingListHtml(); }
  });
  root.addEventListener('change', (e) => {
    const el = e.target.closest('[data-p]');
    if (!el) return;
    if (el.type === 'checkbox' || el.tagName === 'SELECT') {
      setPath(el.dataset.p, readVal(el));
      if (el.dataset.rerender) renderMain();
    }
  });
  function livePreview() {
    document.documentElement.style.setProperty('--accent', A.s.site.accent);
  }

  /* ---------- общие элементы ---------- */
  function modal(html) { $('#admModal').innerHTML = '<div class="a-modal" data-a="modalBg"><div class="a-modal__card">' + html + '</div></div>'; }
  function closeModal() { const m = $('#admModal'); if (m) m.innerHTML = ''; }
  const TPL_HINT = 'Подстановки: {имя}, {дата}, {время}, {услуги}, {сумма}, {адрес}, {телефон}';
  const head = (title, lead, right) => '<div class="adm__row adm__row--between"><div><h2>' + title + '</h2>' + (lead ? '<p class="adm__lead" style="margin:0">' + lead + '</p>' : '') + '</div>' + (right ? '<div class="adm__row" style="margin:0">' + right + '</div>' : '') + '</div>';

  async function uploadImage(file, maxSide, png) {
    const type = png ? 'image/png' : 'image/jpeg';
    if (A.demo) return { url: await Y.resizeImage(file, Math.min(maxSide, 900), 0.8, type), fileId: '' };
    const data = await Y.resizeImage(file, maxSide, 0.86, type);
    const r = await Y.api.admin('upload', { name: (file.name || 'photo').replace(/\.[^.]+$/, '') + (png ? '.png' : '.jpg'), mime: type, data: data.split(',')[1] });
    return { url: r.url, fileId: r.fileId };
  }
  function singlePhoto(key, obj, label, def, hint, isLogo) {
    const cur = obj[key];
    return '<div class="a-card a-single"><img class="' + (isLogo ? 'is-logo' : '') + '" src="' + esc(Y.img(cur || def, 400)) + '" data-fb="' + esc(Y.imgFallback(cur || def)) + '" alt="">' +
      '<div><b>' + label + '</b><p class="adm__lead" style="margin:4px 0 12px">' + hint + (cur ? '' : ' Сейчас — стандартное.') + '</p>' +
      (key === 'logo' ? '<label class="a-switch" style="margin:0 0 12px"><input type="checkbox" id="logoKnock" checked>Сделать чёрный фон прозрачным и обрезать поля</label>' : '') +
      '<div class="adm__row" style="margin:0"><label class="a-btn a-btn--gold">Загрузить новое<input type="file" accept="image/*" hidden data-upload-single="' + key + '" data-obj="' + (obj === A.s.site ? 'site' : 'profile') + '"' + (isLogo ? ' data-png="1"' : '') + '></label>' +
      (cur ? '<button class="a-btn" data-a="resetSingle" data-k="' + key + '" data-obj="' + (obj === A.s.site ? 'site' : 'profile') + '">Вернуть стандартное</button>' : '') + '</div></div></div>';
  }

  /* =====================================================================
     ЗАПИСИ
     ===================================================================== */
  TAB_FN.bookings = function () {
    const t = today();
    const weekEnd = Y.addDays(t, 7);
    const active = A.bookings.filter((b) => b.status !== 'cancelled');
    const newN = newCount();
    const month = t.slice(0, 7);
    const revenue = A.bookings.filter((b) => (b.status === 'done' || b.status === 'confirmed') && String(b.date).slice(0, 7) === month).reduce((a, b) => a + (+b.total || 0), 0);
    const filters = [['upcoming', 'Предстоящие'], ['new', 'Новые' + (newN ? ' · ' + newN : '')], ['past', 'Прошедшие'], ['cancelled', 'Отменённые'], ['all', 'Все']];
    return head('Записи', 'Новые заявки с сайта появляются здесь автоматически' + (A.demo ? '' : ', в Google Календаре и в таблице') + '. Подтвердите запись — клиенту уйдёт письмо (если он указал e-mail).',
        '<button class="a-btn" data-a="refresh">' + IC.refresh + 'Обновить</button><button class="a-btn a-btn--gold" data-a="addBooking">' + IC.plus + 'Добавить запись</button>') +
      '<div class="a-stats" style="margin-top:18px">' +
        '<div class="a-stat' + (newN ? ' a-stat--hl' : '') + '"><b>' + newN + '</b><span>ждут подтверждения</span></div>' +
        '<div class="a-stat"><b>' + active.filter((b) => b.date === t).length + '</b><span>сегодня</span></div>' +
        '<div class="a-stat"><b>' + active.filter((b) => b.date >= t && b.date < weekEnd).length + '</b><span>за 7 дней</span></div>' +
        '<div class="a-stat"><b>' + Y.fmtMoney(revenue) + '</b><span>₽ в этом месяце (от)</span></div>' +
      '</div>' +
      '<div class="adm__row adm__row--between"><div class="a-seg" id="bkFilter">' + filters.map((f) => '<button data-f="' + f[0] + '" class="' + (A.filter === f[0] ? 'is-on' : '') + '">' + f[1] + '</button>').join('') + '</div>' +
      '<input class="a-in" id="aSearch" placeholder="Поиск по имени или телефону" value="' + esc(A.q) + '" style="max-width:280px"></div>' +
      '<div id="bkList">' + bookingListHtml() + '</div>';
  };
  function bookingListHtml() {
    const t = today();
    let list = A.bookings.slice();
    if (A.filter === 'upcoming') list = list.filter((b) => b.date >= t && b.status !== 'cancelled' && b.status !== 'done');
    if (A.filter === 'new') list = list.filter((b) => b.status === 'new');
    if (A.filter === 'past') list = list.filter((b) => b.date < t && b.status !== 'cancelled');
    if (A.filter === 'cancelled') list = list.filter((b) => b.status === 'cancelled');
    if (A.q) {
      const q = A.q.toLowerCase(), qd = q.replace(/\D/g, '');
      list = list.filter((b) => String(b.name).toLowerCase().indexOf(q) >= 0 || (qd.length >= 3 && Y.phoneDigits(b.phone).indexOf(qd) >= 0));
    }
    const desc = A.filter === 'past' || A.filter === 'cancelled' || A.filter === 'all';
    list.sort((a, b) => (a.date + a.start < b.date + b.start ? -1 : 1) * (desc ? -1 : 1));
    if (!list.length) return '<div class="a-empty"><strong>Записей нет</strong>' + (A.filter === 'upcoming' ? 'Как только клиент запишется на сайте, заявка появится здесь.' : 'Попробуйте другой фильтр.') + '</div>';
    let html = '', cur = '';
    list.forEach((b) => {
      if (b.date !== cur) {
        cur = b.date;
        const n = list.filter((x) => x.date === cur).length;
        html += '<div class="a-day' + (cur === t ? ' a-day--today' : '') + '">' + cap(Y.fmtDate(cur, true)) + ' <small>' + n + ' ' + Y.plural(n, 'запись', 'записи', 'записей') + '</small></div>';
      }
      html += bookingCard(b);
    });
    return html;
  }
  function bookingCard(b) {
    const st = Y.STATUS[b.status] || Y.STATUS.new;
    const d = Y.phoneDigits(b.phone);
    const act = [];
    if (b.status === 'new') act.push('<button class="a-btn a-btn--sm a-btn--ok" data-a="confirm" data-id="' + b.id + '">Подтвердить</button>');
    if (b.status === 'confirmed') act.push('<button class="a-btn a-btn--sm" data-a="markDone" data-id="' + b.id + '">Выполнена</button>');
    if (b.status === 'cancelled' || b.status === 'done') act.push('<button class="a-btn a-btn--sm" data-a="restore" data-id="' + b.id + '">Вернуть</button>');
    if (b.status !== 'cancelled') act.push('<button class="a-btn a-btn--sm" data-a="message" data-id="' + b.id + '">' + IC.msg + 'Написать</button>');
    act.push('<button class="a-btn a-btn--sm a-btn--icon" data-a="editBooking" data-id="' + b.id + '" title="Изменить">' + IC.edit + '</button>');
    if (b.status === 'new' || b.status === 'confirmed') act.push('<button class="a-btn a-btn--sm a-btn--danger" data-a="cancel" data-id="' + b.id + '">Отменить</button>');
    else act.push('<button class="a-btn a-btn--sm a-btn--icon a-btn--danger" data-a="deleteBooking" data-id="' + b.id + '" title="Удалить">' + IC.trash + '</button>');
    return '<div class="a-bk a-bk--' + b.status + '">' +
      '<div class="a-bk__time">' + esc(b.start) + '<small>до ' + esc(b.end) + '</small></div>' +
      '<div><div class="a-bk__name">' + esc(b.name) + ' <span class="pill pill--' + st.cls + '">' + st.label + '</span></div>' +
        '<div class="a-bk__svc">' + esc(b.services) + (b.total ? ' · от ' + Y.fmtMoney(b.total) + ' ₽' : '') + '</div>' +
        '<div class="a-bk__meta">' + (d.length === 11 ? '<a href="tel:+' + d + '">' + esc(Y.fmtPhone(b.phone)) + '</a>' : '') +
          (b.email ? '<a href="mailto:' + esc(b.email) + '">✉ ' + esc(b.email) + '</a>' : '<span>без e-mail</span>') +
          (b.contact ? '<span>Связь: ' + esc(b.contact) + '</span>' : '') + (b.source ? '<span>' + esc(b.source) + '</span>' : '') + '</div>' +
        (b.comment ? '<div class="a-bk__comment">' + esc(b.comment) + '</div>' : '') +
        (b.log ? '<div class="a-bk__log">' + esc(b.log) + '</div>' : '') +
      '</div><div class="a-bk__actions">' + act.join('') + '</div></div>';
  }
  const findB = (id) => A.bookings.find((b) => String(b.id) === String(id));
  async function setStatus(id, status) {
    const b = findB(id);
    const prev = b.status;
    b.status = status;
    renderMain();
    try {
      const r = await Y.api.admin('saveBooking', { booking: { id: b.id, status } });
      if (r.booking) Object.assign(b, r.booking);
      renderMain();
      return r;
    } catch (e) {
      b.status = prev;
      renderMain();
      Y.toast('Ошибка: ' + e.message, true);
      throw e;
    }
  }
  function messageModal(b, kind, notified) {
    const tpls = { confirm: A.s.notify.tplConfirm, cancel: A.s.notify.tplCancel, remind: A.s.notify.tplReminder };
    const d = Y.phoneDigits(b.phone);
    const titles = { confirm: 'Запись подтверждена', cancel: 'Запись отменена', remind: 'Сообщение клиенту' };
    const auto = (notified || []).length ? '<div class="a-note">✓ Автоматически отправлено: ' + notified.map(esc).join(', ') + '</div>'
      : (kind !== 'remind' && !b.email ? '<div class="a-note a-note--info">Клиент не указал e-mail — отправьте SMS с телефона или позвоните.</div>' : '');
    modal('<h3>' + titles[kind] + '</h3><p>' + esc(b.name) + ' · ' + cap(Y.fmtDate(b.date, true)) + ', ' + esc(b.start) + '</p>' + auto +
      '<div class="adm__row" style="margin-bottom:10px"><div class="a-seg" id="tplSeg">' +
        [['confirm', 'Подтверждение'], ['remind', 'Напоминание'], ['cancel', 'Отмена']].map((x) => '<button data-k="' + x[0] + '" class="' + (x[0] === kind ? 'is-on' : '') + '">' + x[1] + '</button>').join('') +
      '</div></div>' +
      '<label class="a-field"><span>Текст (можно изменить)</span><textarea class="a-ta" id="msgText" rows="5">' + esc(Y.fillTemplate(tpls[kind], b, A.s)) + '</textarea></label>' +
      '<p style="margin:10px 0 0">SMS откроется на вашем телефоне с готовым текстом — останется нажать «Отправить». E-mail уходит сразу с вашего Gmail.</p>' +
      '<div class="a-modal__actions">' +
        '<button class="a-btn a-btn--gold" data-a="sendSms" data-phone="' + d + '">SMS</button>' +
        (b.email ? '<button class="a-btn a-btn--gold" data-a="sendMail" data-id="' + b.id + '">' + IC.mail + 'На e-mail</button>' : '') +
        '<button class="a-btn" data-a="copyMsg">Скопировать</button>' +
        '<a class="a-btn" href="tel:+' + d + '">' + IC.phone + 'Позвонить</a>' +
      '</div><div class="a-modal__actions"><button class="a-btn" data-a="closeModal">Готово</button></div>');
    $('#tplSeg').addEventListener('click', (e) => {
      const k = e.target.closest('[data-k]');
      if (!k) return;
      $$('#tplSeg button').forEach((x) => x.classList.toggle('is-on', x === k));
      $('#msgText').value = Y.fillTemplate(tpls[k.dataset.k], b, A.s);
    });
  }
  function bookingModal(b, preset) {
    const isNew = !b;
    b = b ? Y.clone(b) : Object.assign({ date: today(), start: '12:00', end: '13:00', name: '', phone: '', email: '', comment: '', status: 'confirmed', serviceIds: '' }, preset || {});
    const ids = String(b.serviceIds || '').split(',').filter(Boolean);
    const dur = Y.toMin(b.end) - Y.toMin(b.start);
    modal('<h3>' + (isNew ? 'Новая запись' : 'Изменить запись') + '</h3><p>' + (isNew ? 'Для клиентов, записавшихся по телефону или лично — время закроется на сайте.' : 'Изменения сразу попадут в расписание и календарь.') + '</p>' +
      '<form id="bkEdit" class="a-grid" style="grid-template-columns:1fr 1fr">' +
        '<label class="a-field"><span>Дата</span><input class="a-in" type="date" name="date" value="' + esc(b.date) + '" required></label>' +
        '<label class="a-field"><span>Время</span><input class="a-in" type="time" name="start" value="' + esc(b.start) + '" step="300" required></label>' +
        '<div class="a-field a-full"><span>Услуги</span><div class="a-chips" id="bkSvc">' +
          A.services.map((s) => '<button type="button" class="a-chip' + (ids.indexOf(String(s.id)) >= 0 ? ' is-on' : '') + '" data-id="' + esc(s.id) + '" data-dur="' + (+s.duration || 60) + '">' + esc(s.name) + '</button>').join('') +
        '</div></div>' +
        '<label class="a-field"><span>Длительность, мин</span><input class="a-in" type="number" name="dur" min="5" step="5" value="' + (dur > 0 ? dur : 60) + '"></label>' +
        '<label class="a-field"><span>Статус</span><select class="a-sel" name="status">' + Object.keys(Y.STATUS).map((k) => '<option value="' + k + '"' + (k === b.status ? ' selected' : '') + '>' + Y.STATUS[k].label + '</option>').join('') + '</select></label>' +
        '<label class="a-field"><span>Имя клиента</span><input class="a-in" name="name" value="' + esc(b.name) + '" required></label>' +
        '<label class="a-field"><span>Телефон</span><input class="a-in" name="phone" type="tel" value="' + esc(b.phone) + '" placeholder="+7"></label>' +
        '<label class="a-field a-full"><span>E-mail (для писем клиенту)</span><input class="a-in" name="email" type="email" value="' + esc(b.email || '') + '"></label>' +
        '<label class="a-field a-full"><span>Услуги текстом (если нет в списке)</span><input class="a-in" name="services" value="' + esc(b.services || '') + '"></label>' +
        '<label class="a-field a-full"><span>Комментарий</span><textarea class="a-ta" name="comment" rows="2">' + esc(b.comment || '') + '</textarea></label>' +
        '<div id="bkWarn" class="a-full"></div>' +
      '</form>' +
      '<div class="a-modal__actions"><button class="a-btn" data-a="closeModal">Отмена</button><button class="a-btn a-btn--gold" data-a="saveBookingModal" data-id="' + esc(b.id || '') + '">Сохранить</button></div>');
    const form = $('#bkEdit');
    const checkOverlap = () => {
      const s = Y.toMin(form.start.value), e = s + (+form.dur.value || 60);
      const clash = A.bookings.filter((x) => x.id !== b.id && x.status !== 'cancelled' && x.date === form.date.value && Y.toMin(x.start) < e && Y.toMin(x.end) > s);
      $('#bkWarn').innerHTML = clash.length ? '<div class="a-note">Пересекается с: ' + clash.map((x) => esc(x.start + '–' + x.end + ' ' + x.name)).join(', ') + '</div>' : '';
    };
    $('#bkSvc').addEventListener('click', (e) => {
      const c = e.target.closest('.a-chip');
      if (!c) return;
      c.classList.toggle('is-on');
      const on = $$('#bkSvc .a-chip.is-on');
      if (on.length) { form.dur.value = on.reduce((a, x) => a + +x.dataset.dur, 0); form.services.value = on.map((x) => x.textContent).join(', '); }
      checkOverlap();
    });
    form.addEventListener('input', checkOverlap);
    checkOverlap();
  }
  async function saveBookingModal(id) {
    const f = $('#bkEdit');
    if (!f.name.value.trim() || !f.date.value || !f.start.value) return Y.toast('Заполните дату, время и имя', true);
    if (f.email.value && !Y.isEmail(f.email.value)) return Y.toast('Проверьте e-mail', true);
    const on = $$('#bkSvc .a-chip.is-on');
    const ids = on.map((x) => x.dataset.id);
    const booking = {
      date: f.date.value, start: f.start.value,
      end: Y.fromMin(Math.min(Y.toMin(f.start.value) + (+f.dur.value || 60), 1439)),
      services: f.services.value.trim() || on.map((x) => x.textContent).join(', ') || 'Услуга',
      serviceIds: ids.join(','),
      total: A.services.filter((s) => ids.indexOf(String(s.id)) >= 0).reduce((a, s) => a + (+s.priceFrom || 0), 0),
      name: f.name.value.trim(), phone: f.phone.value.trim() ? Y.fmtPhone(f.phone.value) : '', email: f.email.value.trim(),
      comment: f.comment.value, status: f.status.value
    };
    if (id) booking.id = id; else booking.contact = 'Звонок';
    const btn = $('[data-a="saveBookingModal"]');
    btn.disabled = true;
    try {
      await Y.api.admin('saveBooking', { booking, silent: true });
      closeModal();
      await refreshBookings();
      renderMain();
      Y.toast(id ? 'Запись обновлена' : 'Запись добавлена');
    } catch (e) { btn.disabled = false; Y.toast('Ошибка: ' + e.message, true); }
  }

  /* =====================================================================
     РАСПИСАНИЕ
     ===================================================================== */
  TAB_FN.schedule = function () {
    const order = [1, 2, 3, 4, 5, 6, 0];
    const t = today();
    const offs = A.exceptions.map((e, i) => Object.assign({ i }, e)).filter((e) => e.type === 'off' && (e.to || e.from) >= t && e.to && e.to !== e.from);
    const steps = [[15, '15 минут'], [20, '20 минут'], [30, '30 минут'], [45, '45 минут'], [60, '1 час']];
    return head('Расписание', 'Нажмите на день в календаре, чтобы сделать его выходным, задать особые часы или закрыть часть времени. Клиенты видят только свободное время.') +
      '<h3>Календарь</h3>' + calendarHtml() +
      '<h3>Обычный график по дням недели</h3><div class="a-week">' +
        order.map((d) => {
          const day = A.s.schedule.days[d] || { on: false, start: '10:00', end: '19:00' };
          return '<div class="a-wd' + (day.on ? '' : ' is-off') + '"><label class="a-switch"><input type="checkbox" data-p="s.schedule.days.' + d + '.on" data-t="bool" data-rerender="1"' + (day.on ? ' checked' : '') + '>' + cap(Y.WD[d]) + '</label>' +
            '<div class="a-wd__times"><input class="a-in" type="time" step="900" data-p="s.schedule.days.' + d + '.start" value="' + esc(day.start) + '"><span>—</span><input class="a-in" type="time" step="900" data-p="s.schedule.days.' + d + '.end" value="' + esc(day.end) + '"></div></div>';
        }).join('') +
      '</div>' +
      '<h3>Отпуск (несколько дней подряд)</h3>' +
      offs.map((e) => '<div class="a-list-item"><div><b>с ' + Y.fmtDate(e.from) + ' по ' + Y.fmtDate(e.to) + '</b>' + (e.note ? '<small>' + esc(e.note) + '</small>' : '') + '</div><button class="a-btn a-btn--sm a-btn--icon a-btn--danger" data-a="delEx" data-i="' + e.i + '">' + IC.trash + '</button></div>').join('') +
      '<div class="a-card"><div class="a-grid" style="align-items:end" id="exOff">' +
        '<label class="a-field"><span>С</span><input class="a-in" type="date" name="from" min="' + t + '"></label>' +
        '<label class="a-field"><span>По (включительно)</span><input class="a-in" type="date" name="to" min="' + t + '"></label>' +
        '<label class="a-field"><span>Заметка (видна клиентам)</span><input class="a-in" name="note" placeholder="Например: отпуск"></label>' +
        '<button class="a-btn a-btn--gold" data-a="addVacation">' + IC.plus + 'Добавить</button>' +
      '</div></div>' +
      '<h3>Параметры записи</h3><div class="a-card"><div class="a-grid">' +
        sw('s.site.bookingOn', 'Онлайн-запись включена', 'Выключите на время — клиенты увидят телефон') +
        inp('s.schedule.step', 'Шаг сетки времени', { options: steps, t: 'num' }) +
        inp('s.schedule.horizon', 'На сколько дней вперёд открыта запись', { type: 'number', t: 'num', attrs: ' min="1" max="365"' }) +
        inp('s.schedule.leadHours', 'Минимум часов до визита', { type: 'number', t: 'num', attrs: ' min="0" max="72"', hint: 'Чтобы не записывались «через 10 минут»' }) +
      '</div><div class="a-grid" style="margin-top:14px;align-items:end">' +
        sw('s.schedule.breakOn', 'Ежедневный перерыв') + inp('s.schedule.breakStart', 'Перерыв с', { type: 'time' }) + inp('s.schedule.breakEnd', 'Перерыв до', { type: 'time' }) +
      '</div></div>' +
      (A.demo ? '' : '<div class="a-note a-note--info" style="margin-top:14px">Совет: любое событие, добавленное в ваш Google Календарь, автоматически закрывает это время на сайте (настраивается во вкладке «Уведомления»).</div>');
  };
  function calendarHtml() {
    const t = today();
    if (!A.calMonth) A.calMonth = t.slice(0, 7);
    const [y, m] = A.calMonth.split('-').map(Number);
    const offset = (new Date(y, m - 1, 1).getDay() + 6) % 7;
    const days = new Date(y, m, 0).getDate();
    const stt = { schedule: A.s.schedule, exceptions: A.exceptions, busy: [], tz: undefined };
    let cells = '';
    for (let i = 0; i < offset; i++) cells += '<div class="a-cal__day is-empty"></div>';
    for (let d = 1; d <= days; d++) {
      const key = A.calMonth + '-' + Y.pad(d);
      const h = Y.dayHours(key, stt);
      const bks = A.bookings.filter((b) => b.date === key && b.status !== 'cancelled').length;
      const busyN = A.exceptions.filter((e) => e.type === 'busy' && e.from === key).length;
      cells += '<button type="button" class="a-cal__day' + (h.open ? '' : ' is-off') + (h.special ? ' is-special' : '') + (key === t ? ' is-today' : '') + (key < t ? ' is-past' : '') + '" data-a="dayModal" data-date="' + key + '">' +
        '<b>' + d + '</b><span>' + (h.open ? Y.fromMin(h.start) + '–' + Y.fromMin(h.end) : (h.reason === 'off' ? (h.note || 'выходной') : 'выходной')) + (busyN ? ' · занято ' + busyN : '') + '</span>' +
        (bks ? '<em>' + bks + ' ' + Y.plural(bks, 'запись', 'записи', 'записей') + '</em>' : '') + '</button>';
    }
    return '<div class="a-cal"><div class="a-cal__head"><button class="a-btn a-btn--sm a-btn--icon" data-a="calMonth" data-d="-1">' + IC.left + '</button><span>' + Y.MONTHS_NOM[m - 1] + ' ' + y + '</span><button class="a-btn a-btn--sm a-btn--icon" data-a="calMonth" data-d="1">' + IC.right + '</button></div>' +
      '<div class="a-cal__grid">' + ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'].map((w) => '<span class="a-cal__wd">' + w + '</span>').join('') + cells + '</div></div>';
  }
  function dayModal(date) {
    const wd = A.s.schedule.days[String(Y.parseDate(date).getDay())] || { on: false };
    const vac = A.exceptions.find((e) => e.type === 'off' && e.to && e.to !== e.from && date >= e.from && date <= e.to);
    const single = A.exceptions.find((e) => e.type === 'off' && e.from === date && (!e.to || e.to === e.from));
    const hours = A.exceptions.find((e) => e.type === 'hours' && e.from === date);
    const mode = single ? 'off' : hours ? 'hours' : 'default';
    const busy = A.exceptions.map((e, i) => Object.assign({ i }, e)).filter((e) => e.type === 'busy' && e.from === date);
    const bks = A.bookings.filter((b) => b.date === date && b.status !== 'cancelled').sort((a, b) => (a.start < b.start ? -1 : 1));
    modal('<h3>' + cap(Y.fmtDate(date, true)) + '</h3>' +
      (vac ? '<div class="a-note">Этот день входит в отпуск с ' + Y.fmtDate(vac.from) + ' по ' + Y.fmtDate(vac.to) + '. Изменить отпуск можно ниже на странице.</div>' :
      '<div class="a-field"><span>Режим дня</span><div class="a-seg" id="dayMode">' +
        [['default', 'По графику (' + (wd.on ? wd.start + '–' + wd.end : 'выходной') + ')'], ['off', 'Выходной'], ['hours', 'Особые часы']].map((x) => '<button type="button" data-m="' + x[0] + '" class="' + (x[0] === mode ? 'is-on' : '') + '">' + x[1] + '</button>').join('') +
      '</div></div>' +
      '<div class="a-grid" id="dayHours" style="margin-top:12px' + (mode === 'hours' ? '' : ';display:none') + '">' +
        '<label class="a-field"><span>С</span><input class="a-in" type="time" id="dhStart" step="900" value="' + esc(hours ? hours.start : wd.start || '10:00') + '"></label>' +
        '<label class="a-field"><span>До</span><input class="a-in" type="time" id="dhEnd" step="900" value="' + esc(hours ? hours.end : wd.end || '18:00') + '"></label></div>') +
      '<h3 style="margin-top:22px">Закрыть часть времени</h3>' +
      busy.map((e) => '<div class="a-list-item"><div><b>' + e.start + '–' + e.end + '</b>' + (e.note ? '<small>' + esc(e.note) + '</small>' : '') + '</div><button class="a-btn a-btn--sm a-btn--icon a-btn--danger" data-a="delBusy" data-i="' + e.i + '" data-date="' + date + '">' + IC.trash + '</button></div>').join('') +
      '<div class="a-grid" style="grid-template-columns:1fr 1fr 1.4fr auto;align-items:end">' +
        '<label class="a-field"><span>С</span><input class="a-in" type="time" id="bzStart" step="900" value="13:00"></label>' +
        '<label class="a-field"><span>До</span><input class="a-in" type="time" id="bzEnd" step="900" value="14:00"></label>' +
        '<label class="a-field"><span>Заметка</span><input class="a-in" id="bzNote" placeholder="только для вас"></label>' +
        '<button class="a-btn" data-a="addBusy" data-date="' + date + '">' + IC.plus + '</button></div>' +
      '<h3 style="margin-top:22px">Записи на этот день</h3>' +
      (bks.length ? bks.map((b) => '<div class="a-list-item"><div><b>' + b.start + '–' + b.end + ' · ' + esc(b.name) + '</b><small>' + esc(b.services) + ' · ' + (Y.STATUS[b.status] || {}).label + '</small></div></div>').join('') : '<p>Записей нет.</p>') +
      '<div class="a-modal__actions"><button class="a-btn" data-a="closeModal">Отмена</button><button class="a-btn" data-a="addBookingOn" data-date="' + date + '">' + IC.plus + 'Добавить запись</button><button class="a-btn a-btn--gold" data-a="applyDay" data-date="' + date + '">Готово</button></div>');
    const seg = $('#dayMode');
    if (seg) seg.addEventListener('click', (e) => {
      const b = e.target.closest('[data-m]');
      if (!b) return;
      $$('#dayMode button').forEach((x) => x.classList.toggle('is-on', x === b));
      $('#dayHours').style.display = b.dataset.m === 'hours' ? '' : 'none';
    });
  }
  function applyDay(date) {
    const seg = $('#dayMode .is-on');
    if (seg) {
      const m = seg.dataset.m;
      A.exceptions = A.exceptions.filter((e) => !((e.type === 'hours' && e.from === date) || (e.type === 'off' && e.from === date && (!e.to || e.to === e.from))));
      if (m === 'off') A.exceptions.push({ id: Y.uid(), type: 'off', from: date, to: date, start: '', end: '', note: '' });
      if (m === 'hours') {
        const s = $('#dhStart').value, e = $('#dhEnd').value;
        if (!s || !e || Y.toMin(e) <= Y.toMin(s)) return Y.toast('Проверьте время', true);
        A.exceptions.push({ id: Y.uid(), type: 'hours', from: date, to: '', start: s, end: e, note: '' });
      }
      markDirty('exceptions');
    }
    closeModal();
    renderMain();
  }

  /* =====================================================================
     УСЛУГИ
     ===================================================================== */
  TAB_FN.services = function () {
    const cats = A.services.map((s) => s.cat).filter((c, i, a) => c && a.indexOf(c) === i);
    return head('Услуги и цены', 'Длительность нужна для расчёта свободного времени. Скрытые услуги не видны клиентам. Порядок категорий — по первой услуге в категории.', '<button class="a-btn a-btn--gold" data-a="addSvc">' + IC.plus + 'Добавить услугу</button>') +
      '<div class="a-card" style="margin:18px 0"><div class="a-grid">' + inp('s.profile.priceNote', 'Примечание под заголовком прайса', { ta: true, rows: 2, full: true }) + '</div></div>' +
      '<datalist id="svcCats">' + cats.map((c) => '<option value="' + esc(c) + '">').join('') + '</datalist>' +
      A.services.map((s, i) =>
        '<div class="a-card a-svc' + (s.visible === false ? ' is-hidden' : '') + '"><div class="a-grid">' +
          inp('svc.' + i + '.name', 'Название') + inp('svc.' + i + '.cat', 'Категория', { list: 'svcCats' }) +
          inp('svc.' + i + '.priceFrom', 'Цена от, ₽', { type: 'number', t: 'num', attrs: ' min="0" step="50"' }) +
          inp('svc.' + i + '.priceTo', 'Цена до, ₽', { type: 'number', t: 'num', attrs: ' min="0" step="50"', hint: 'Пусто — будет «от …»' }) +
          inp('svc.' + i + '.duration', 'Длительность, мин', { type: 'number', t: 'num', attrs: ' min="5" step="5"' }) +
          inp('svc.' + i + '.note', 'Примечание', { ph: 'без учёта материалов' }) +
          inp('svc.' + i + '.desc', 'Описание', { full: true }) +
          '<div class="a-field a-full"><span>Иконка</span><div class="a-icons">' + Object.keys(Y.ICONS).map((k) => '<button type="button" title="' + Y.ICONS[k][0] + '" class="' + (s.icon === k ? 'is-on' : '') + '" data-a="svcIcon" data-i="' + i + '" data-k="' + k + '">' + Y.icon(k) + '</button>').join('') + '</div></div>' +
        '</div><div class="a-svc__tools">' +
          '<button class="a-btn a-btn--sm a-btn--icon" data-a="svcMove" data-i="' + i + '" data-d="-1" title="Выше"' + (i ? '' : ' disabled') + '>' + IC.up + '</button>' +
          '<button class="a-btn a-btn--sm a-btn--icon" data-a="svcMove" data-i="' + i + '" data-d="1" title="Ниже"' + (i < A.services.length - 1 ? '' : ' disabled') + '>' + IC.down + '</button>' +
          '<button class="a-btn a-btn--sm a-btn--icon" data-a="svcToggle" data-i="' + i + '" title="' + (s.visible === false ? 'Показать' : 'Скрыть') + '">' + (s.visible === false ? IC.eyeOff : IC.eye) + '</button>' +
          '<button class="a-btn a-btn--sm a-btn--icon a-btn--danger" data-a="svcDel" data-i="' + i + '" title="Удалить">' + IC.trash + '</button>' +
        '</div></div>'
      ).join('');
  };

  /* =====================================================================
     ПОРТФОЛИО
     ===================================================================== */
  TAB_FN.portfolio = function () {
    const cats = A.photos.map((x) => x.cat).concat(['Стрижки', 'Окрашивание', 'Укладки', 'Образы', 'Макияж', 'Уход', 'За работой']).filter((c, i, a) => c && a.indexOf(c) === i);
    return head('Портфолио', 'Перетаскивайте фото, чтобы менять порядок (на телефоне — стрелками). Фото сжимаются перед загрузкой и хранятся в вашем Google Диске.') +
      '<div style="height:16px"></div>' +
      (A.photos.length ? '' : '<div class="a-note">Сейчас на сайте показываются ' + Y.DEFAULT_PHOTOS.length + ' фото со старого сайта. Как только вы загрузите свои — будут показываться они. Чтобы оставить часть старых, импортируйте их и удалите лишние.<div style="margin-top:10px"><button class="a-btn a-btn--sm" data-a="importPhotos">Импортировать фото со старого сайта</button></div></div>') +
      '<label class="a-drop" id="drop"><input type="file" accept="image/*" multiple hidden id="multiUpload"><strong>Перетащите фото сюда или нажмите, чтобы выбрать</strong>Можно сразу несколько. Новые фото появятся в начале.</label>' +
      '<div class="a-card" style="margin:16px 0 14px"><div class="a-grid" style="align-items:end">' +
        inp('s.site.galleryView', 'Вид по умолчанию', { options: [['cinema', 'Слайдшоу с миниатюрами'], ['grid', 'Сетка (как Pinterest)']] }) +
        sw('s.site.galleryAutoplay', 'Автопрокрутка слайдшоу') +
        inp('s.site.galleryInterval', 'Секунд на фото', { type: 'number', t: 'num', attrs: ' min="2" max="20"' }) +
        inp('s.site.galleryColsMobile', 'Сетка: колонок на телефоне', { options: [[1, '1 колонка'], [2, '2 колонки']], t: 'num' }) +
        inp('s.site.galleryPage', 'Сетка: фото до «Показать ещё»', { type: 'number', t: 'num', attrs: ' min="4" max="60"' }) +
      '</div></div>' +
      '<datalist id="phCats">' + cats.map((c) => '<option value="' + esc(c) + '">').join('') + '</datalist>' +
      '<div class="a-photos" id="phGrid">' +
        A.photos.map((ph, i) =>
          '<div class="a-ph" draggable="true" data-i="' + i + '"><div class="a-ph__img"><img src="' + esc(Y.img(ph, 400)) + '" data-fb="' + esc(Y.imgFallback(ph)) + '" alt="" loading="lazy"><span class="a-ph__num">' + (i + 1) + '</span></div>' +
          '<div class="a-ph__body">' +
            '<input class="a-in" data-p="ph.' + i + '.cat" value="' + esc(ph.cat || '') + '" list="phCats" placeholder="Категория">' +
            '<input class="a-in" data-p="ph.' + i + '.caption" value="' + esc(ph.caption || '') + '" placeholder="Подпись">' +
            '<div class="a-ph__tools">' +
              '<button class="a-btn a-btn--sm a-btn--icon" data-a="phMove" data-i="' + i + '" data-d="-1"' + (i ? '' : ' disabled') + '>' + IC.left + '</button>' +
              '<button class="a-btn a-btn--sm a-btn--icon" data-a="phFirst" data-i="' + i + '" title="Сделать первым"' + (i ? '' : ' disabled') + '>1</button>' +
              '<button class="a-btn a-btn--sm a-btn--icon" data-a="phMove" data-i="' + i + '" data-d="1"' + (i < A.photos.length - 1 ? '' : ' disabled') + '>' + IC.right + '</button>' +
              '<button class="a-btn a-btn--sm a-btn--icon a-btn--danger" data-a="phDel" data-i="' + i + '">' + IC.trash + '</button>' +
            '</div></div></div>'
        ).join('') +
      '</div>';
  };
  function bindPhotoDnd() {
    const grid = $('#phGrid');
    if (!grid) return;
    let from = null;
    grid.addEventListener('dragstart', (e) => {
      const c = e.target.closest('.a-ph');
      if (!c || e.target.closest('input')) return;
      from = +c.dataset.i;
      c.classList.add('is-drag');
      e.dataTransfer.effectAllowed = 'move';
      try { e.dataTransfer.setData('text/plain', String(from)); } catch (err) {}
    });
    grid.addEventListener('dragover', (e) => {
      const c = e.target.closest('.a-ph');
      if (from == null || !c) return;
      e.preventDefault();
      $$('.a-ph.is-over', grid).forEach((x) => x !== c && x.classList.remove('is-over'));
      c.classList.add('is-over');
    });
    grid.addEventListener('drop', (e) => {
      const c = e.target.closest('.a-ph');
      if (from == null || !c) return;
      e.preventDefault();
      const to = +c.dataset.i;
      if (to !== from) {
        A.photos.splice(to, 0, A.photos.splice(from, 1)[0]);
        markDirty('photos');
      }
      from = null;
      renderMain();
    });
    grid.addEventListener('dragend', () => { from = null; $$('.a-ph', grid).forEach((x) => x.classList.remove('is-drag', 'is-over')); });
  }
  async function uploadMany(files) {
    files = Array.from(files).filter((f) => /^image\//.test(f.type) || /\.(heic|heif)$/i.test(f.name));
    if (!files.length) return;
    let done = 0, failed = 0;
    for (const f of files) {
      Y.toast('Загружаем фото ' + (done + failed + 1) + ' из ' + files.length + '…');
      try {
        const r = await uploadImage(f, 1800);
        A.photos.unshift({ id: Y.uid(), url: r.url, fileId: r.fileId, cat: '', caption: '' });
        done++;
      } catch (e) { failed++; console.error(e); }
    }
    markDirty('photos');
    renderMain();
    await saveAll(true);
    Y.toast('Загружено: ' + done + (failed ? ', не удалось: ' + failed + ' (попробуйте JPG)' : '') + '. Укажите категории.', !!failed);
  }

  /* =====================================================================
     О МАСТЕРЕ
     ===================================================================== */
  TAB_FN.about = function () {
    const p = A.s.profile;
    return head('О мастере', 'Имя, описание, факты и главные фотографии сайта.') +
      '<h3>Главный экран</h3><div class="a-card"><div class="a-grid">' +
        inp('s.profile.firstName', 'Имя') + inp('s.profile.lastName', 'Фамилия') +
        inp('s.profile.title', 'Специализация', { hint: 'Например: Стилист · Визажист' }) +
        inp('s.profile.since', 'Работаю с (год)', { type: 'number', t: 'num', hint: 'Стаж посчитается сам' }) +
        inp('s.profile.tagline', 'Слоган под именем', { ta: true, rows: 2, full: true }) +
      '</div></div>' +
      '<h3>Фотографии</h3>' +
      singlePhoto('heroPhoto', p, 'Фото на главном экране', Y.DEFAULT_HERO, 'Вертикальное или квадратное, лицо ближе к центру.') +
      singlePhoto('aboutPhoto', p, 'Фото в разделе «О мастере»', Y.DEFAULT_ABOUT, 'Вертикальное, 4:5.') +
      '<h3>Биография</h3><div class="a-card"><div class="a-grid">' +
        inp('s.profile.about', 'Текст (каждый абзац с новой строки)', { ta: true, rows: 5, full: true }) +
        inp('s.profile.facts', 'Факты (каждый с новой строки)', { ta: true, rows: 5, full: true, t: 'lines' }) +
        inp('s.profile.awards', 'Квалификация, обучение, награды (каждое с новой строки)', { ta: true, rows: 4, full: true, t: 'lines' }) +
      '</div></div>';
  };

  /* =====================================================================
     КОНТАКТЫ
     ===================================================================== */
  TAB_FN.contacts = function () {
    return head('Контакты', 'Всё, что показывается в разделе «Контакты», в письмах клиентам и в поиске Google.') +
      '<h3>Связь</h3><div class="a-card"><div class="a-grid">' +
        inp('s.profile.phone', 'Телефон', { type: 'tel' }) + inp('s.profile.email', 'E-mail', { type: 'email', hint: 'Ответы клиентов на письма придут сюда' }) +
        inp('s.profile.telegram', 'Telegram (ник без @)') + inp('s.profile.instagram', 'Instagram (ник)') + inp('s.profile.vk', 'ВКонтакте (ник или id)') +
      '</div></div>' +
      '<h3>Адрес и карта</h3><div class="a-card"><div class="a-grid">' +
        inp('s.profile.city', 'Город') + inp('s.profile.address', 'Адрес', { hint: 'Улица, дом, салон. Пусто — карта не показывается' }) +
        inp('s.profile.addressNote', 'Как найти', { ph: 'Вход со двора, 2 этаж, домофон 12', full: true }) +
        inp('s.site.mapProvider', 'Карта', { options: [['google', 'Google Maps (без рекламы)'], ['yandex', 'Яндекс Карты (может показывать рекламу)'], ['none', 'Не показывать']] }) +
      '</div></div>' +
      '<h3>Время работы</h3><div class="a-card"><div class="a-grid">' +
        inp('s.profile.hoursText', 'Свой текст (необязательно)', { ta: true, rows: 3, full: true, ph: 'Пусто — время работы берётся из расписания автоматически:\n' + Y.hoursList(A.s.schedule).map((h) => h.days + ': ' + h.hours).join('\n') }) +
      '</div></div>';
  };

  /* =====================================================================
     ОТЗЫВЫ
     ===================================================================== */
  const stars = (n) => '★'.repeat(Math.max(1, Math.min(5, +n || 5)));
  const pubReviews = () => (A.clientReviews || []).filter((r) => r.rstatus === 'approved').map((r) => {
    const d = new Date(r.created);
    return { id: r.id, name: r.name, service: r.service, rating: +r.rating || 5, text: r.text, date: isNaN(d) ? '' : Y.MONTHS_NOM[d.getMonth()].toLowerCase() + ' ' + d.getFullYear(), source: 'site' };
  }).reverse();
  TAB_FN.reviews = function () {
    const list = A.s.reviews;
    const cr = (A.clientReviews || []).slice().reverse();
    const pending = cr.filter((r) => r.rstatus === 'pending');
    const other = cr.filter((r) => r.rstatus !== 'pending');
    const card = (r) => '<div class="a-list-item" style="align-items:start"><div><b>' + esc(r.name) + ' · <span style="color:var(--accent)">' + stars(r.rating) + '</span></b>' +
      '<small>' + esc(r.service || '') + (r.created ? ' · ' + new Date(r.created).toLocaleDateString('ru-RU') : '') + '</small>' +
      '<p style="margin:8px 0 0;white-space:pre-wrap">' + esc(r.text) + '</p></div><div class="adm__row" style="margin:0;gap:6px;justify-content:flex-end">' +
      (r.rstatus !== 'approved' ? '<button class="a-btn a-btn--sm a-btn--ok" data-a="crApprove" data-id="' + esc(r.id) + '">Опубликовать</button>' : '<span class="pill pill--ok">На сайте</span>') +
      (r.rstatus === 'approved' ? '<button class="a-btn a-btn--sm" data-a="crHide" data-id="' + esc(r.id) + '">Скрыть</button>' : r.rstatus === 'pending' ? '<button class="a-btn a-btn--sm" data-a="crHide" data-id="' + esc(r.id) + '">Отклонить</button>' : '<span class="pill pill--done">Скрыт</span>') +
      '<button class="a-btn a-btn--sm a-btn--icon a-btn--danger" data-a="crDel" data-id="' + esc(r.id) + '" title="Удалить">' + IC.trash + '</button></div></div>';
    return head('Отзывы', 'Клиенты оставляют отзывы по ссылке из письма. Новый отзыв приходит вам на почту — опубликовать можно прямо из письма или здесь.') +
      '<h3>Ждут проверки · ' + pending.length + '</h3>' +
      (pending.length ? pending.map(card).join('') : '<div class="a-empty" style="padding:24px"><strong>Новых отзывов нет</strong>Ссылка «Оставить отзыв» есть в письмах клиентам, а после отметки «Выполнена» клиенту приходит отдельная просьба.</div>') +
      (other.length ? '<h3>Отзывы с сайта</h3>' + other.map(card).join('') : '') +
      '<div class="adm__row adm__row--between" style="margin-top:28px"><h3 style="margin:0">Добавленные вручную</h3><button class="a-btn a-btn--gold a-btn--sm" data-a="addReview">' + IC.plus + 'Добавить отзыв</button></div>' +
      '<p class="adm__lead">Например, отзывы из соцсетей. Добавляйте только настоящие отзывы.</p>' +
      list.map((r, i) => '<div class="a-card a-svc"><div class="a-grid">' +
        inp('s.reviews.' + i + '.name', 'Имя клиента') + inp('s.reviews.' + i + '.service', 'Услуга') +
        inp('s.reviews.' + i + '.date', 'Дата', { ph: 'сентябрь 2026' }) +
        inp('s.reviews.' + i + '.rating', 'Оценка', { options: [[5, '★★★★★'], [4, '★★★★'], [3, '★★★']], t: 'num' }) +
        inp('s.reviews.' + i + '.text', 'Текст отзыва', { ta: true, rows: 3, full: true }) +
      '</div><div class="a-svc__tools">' +
        '<button class="a-btn a-btn--sm a-btn--icon" data-a="revMove" data-i="' + i + '" data-d="-1"' + (i ? '' : ' disabled') + '>' + IC.up + '</button>' +
        '<button class="a-btn a-btn--sm a-btn--icon" data-a="revMove" data-i="' + i + '" data-d="1"' + (i < list.length - 1 ? '' : ' disabled') + '>' + IC.down + '</button>' +
        '<button class="a-btn a-btn--sm a-btn--icon a-btn--danger" data-a="revDel" data-i="' + i + '">' + IC.trash + '</button>' +
      '</div></div>').join('');
  };

  /* =====================================================================
     МУЗЫКА
     ===================================================================== */
  const prev = new Audio();
  let prevIdx = -1;
  prev.addEventListener('ended', () => { prevIdx = -1; if (A.tab === 'music') renderMain(); });
  TAB_FN.music = function () {
    const m = A.s.music;
    return head('Музыка', 'Небольшой плеер на сайте. Музыка никогда не включается сама — только по нажатию посетителя.') +
      '<div class="a-card" style="margin-top:18px"><div class="a-grid" style="align-items:center">' +
        sw('s.site.music', 'Показывать плеер на сайте') +
        sw('s.site.musicAutostart', 'Включать музыку при первом действии посетителя', 'Браузеры не разрешают звук до первого клика/касания. Играет самый лёгкий трек, до этого момента музыка не загружается. Если посетитель выключит — больше не включится сам.') +
        inp('s.music.volume', 'Громкость по умолчанию', { type: 'range', t: 'num', attrs: ' min="0" max="1" step="0.05"' }) +
      '</div></div>' +
      '<h3>Плейлист · ' + m.tracks.length + '</h3>' +
      m.tracks.map((t, i) => '<div class="a-track">' +
        '<button class="a-btn a-btn--sm a-btn--icon" data-a="trackPlay" data-i="' + i + '" title="Прослушать">' + (prevIdx === i && !prev.paused ? IC.pause : IC.play) + '</button>' +
        '<div class="a-grid" style="grid-template-columns:1fr 1.4fr">' +
          '<input class="a-in" data-p="s.music.tracks.' + i + '.title" value="' + esc(t.title) + '" placeholder="Название">' +
          (t.fileId ? '<span class="adm__lead" style="margin:0;align-self:center">Файл на Google Диске</span>' : '<input class="a-in" data-p="s.music.tracks.' + i + '.url" value="' + esc(t.url) + '" placeholder="Ссылка на mp3">') +
        '</div><div class="adm__row" style="margin:0;gap:4px">' +
          '<button class="a-btn a-btn--sm a-btn--icon" data-a="trackMove" data-i="' + i + '" data-d="-1"' + (i ? '' : ' disabled') + '>' + IC.up + '</button>' +
          '<button class="a-btn a-btn--sm a-btn--icon" data-a="trackMove" data-i="' + i + '" data-d="1"' + (i < m.tracks.length - 1 ? '' : ' disabled') + '>' + IC.down + '</button>' +
          '<button class="a-btn a-btn--sm a-btn--icon a-btn--danger" data-a="trackDel" data-i="' + i + '">' + IC.trash + '</button></div></div>').join('') +
      '<div class="a-card" style="margin-top:12px"><div class="a-grid" style="align-items:end">' +
        '<label class="a-field"><span>Название</span><input class="a-in" id="trTitle" placeholder="Исполнитель — трек"></label>' +
        '<label class="a-field"><span>Ссылка на mp3</span><input class="a-in" id="trUrl" placeholder="https://…/track.mp3"></label>' +
        '<button class="a-btn" data-a="trackAdd">' + IC.plus + 'Добавить ссылку</button>' +
        (A.demo ? '' : '<label class="a-btn a-btn--gold">Загрузить mp3<input type="file" accept="audio/*" hidden id="audioUpload"></label>') +
      '</div><p class="adm__lead" style="margin:12px 0 0">Файл до 15 МБ. Используйте музыку, на которую у вас есть права (без авторских ограничений). По умолчанию стоят записи классической музыки из общественного достояния.</p></div>' +
      '<div class="adm__row" style="margin-top:12px"><button class="a-btn a-btn--sm" data-a="tracksDefault">Вернуть стандартный плейлист</button></div>';
  };

  /* =====================================================================
     УВЕДОМЛЕНИЯ
     ===================================================================== */
  TAB_FN.notify = function () {
    return head('Уведомления', 'Как вы узнаёте о новых записях и какие письма получают клиенты.') +
      (A.demo ? '<div class="a-note" style="margin-top:14px">Демо-режим: письма, календарь и SMS заработают после подключения Google Таблицы (см. README).</div>' : '') +
      '<h3>Вам</h3><div class="a-card"><div class="a-grid">' +
        inp('s.notify.ownerEmail', 'E-mail для уведомлений', { type: 'email', ph: 'по умолчанию — ваш Google-аккаунт', full: true }) +
        sw('s.notify.emailOnNew', 'Письмо о каждой новой записи') +
        sw('s.notify.dailyDigest', 'Вечерняя сводка на завтра (~20:00)') +
        sw('s.notify.calendarAdd', 'Добавлять записи в Google Календарь', 'С напоминанием за 1 час') +
        sw('s.notify.calendarBusy', 'События календаря = занятое время') +
        inp('s.notify.calendarId', 'ID календаря (необязательно)', { ph: 'основной календарь', full: true }) +
      '</div>' + (A.demo ? '' : '<div class="adm__row" style="margin:14px 0 0"><button class="a-btn" data-a="testEmail">Тестовое письмо мне</button></div>') + '</div>' +
      '<h3>Клиентам на e-mail — бесплатно, автоматически</h3><div class="a-card">' +
        '<p class="adm__lead" style="margin:0 0 12px">Если клиент указал e-mail при записи, письма уходят с вашего Gmail в фирменном оформлении. В письме есть кнопка «Отменить запись» — время освободится само, а вам придёт уведомление.</p>' +
        '<div class="a-grid">' +
        sw('s.notify.clientEmailOnNew', 'Сразу после записи: «Заявка получена»') +
        sw('s.notify.clientEmail', 'При подтверждении и отмене', 'В подтверждении — кнопка «Добавить в Google Календарь»') +
        sw('s.notify.clientEmailReminder', 'Напоминание накануне визита') +
        sw('s.notify.clientEmailReview', 'Просьба об отзыве после визита', 'Уходит, когда вы отмечаете запись «Выполнена»') +
      '</div>' + (A.demo ? '' : '<div class="adm__row" style="margin:14px 0 0"><button class="a-btn" data-a="testClientEmail">Прислать мне пример письма клиенту</button></div>') + '</div>' +
      '<h3>Шаблоны сообщений</h3><div class="a-card"><div class="a-grid">' +
        inp('s.notify.tplNew', 'Заявка получена', { ta: true, rows: 2, full: true }) +
        inp('s.notify.tplConfirm', 'Подтверждение', { ta: true, rows: 3, full: true }) +
        inp('s.notify.tplReminder', 'Напоминание (за день)', { ta: true, rows: 3, full: true }) +
        inp('s.notify.tplCancel', 'Отмена', { ta: true, rows: 3, full: true, hint: TPL_HINT }) +
      '</div></div>' +
      '<h3>Автоматические SMS — по желанию, платно</h3><div class="a-card">' +
        '<p class="adm__lead" style="margin:0 0 14px">Через <a href="https://sms.ru" target="_blank" rel="noopener" style="text-decoration:underline">SMS.ru</a>: регистрация, пополнение баланса (несколько рублей за SMS), API-ключ сюда.</p>' +
        '<div class="a-grid">' + sw('s.notify.smsruOn', 'Включить SMS.ru') + inp('s.notify.smsruKey', 'API-ключ (api_id)') +
          sw('s.notify.smsOnNew', 'SMS «заявка получена»') + sw('s.notify.smsOnConfirm', 'SMS при подтверждении') + sw('s.notify.smsOnCancel', 'SMS при отмене') + sw('s.notify.smsReminder', 'SMS-напоминание за день') +
      '</div></div>';
  };

  /* =====================================================================
     НАСТРОЙКИ САЙТА
     ===================================================================== */
  TAB_FN.site = function () {
    const s = A.s.site;
    const labels = { home: 'Главная', about: 'О мастере', works: 'Портфолио', prices: 'Цены', reviews: 'Отзывы', booking: 'Онлайн-запись', contacts: 'Контакты' };
    const texts = [
      ['heroCta', 'Главная: кнопка записи'], ['heroCta2', 'Главная: вторая кнопка'], ['heroCta3', 'Главная: третья кнопка'], ['aboutCta', 'О мастере: ссылка на портфолио'], ['aboutTitle', 'О мастере: подпись'],
      ['worksTitle', 'Портфолио: заголовок'], ['worksSub', 'Портфолио: подзаголовок'], ['pricesTitle', 'Цены: заголовок'],
      ['reviewsTitle', 'Отзывы: заголовок'], ['reviewsSub', 'Отзывы: подпись'], ['bookingTitle', 'Запись: заголовок'],
      ['bookingSub', 'Запись: подзаголовок'], ['bookingOff', 'Запись выключена: текст'], ['successTitle', 'После записи: заголовок'],
      ['successText', 'После записи: текст'], ['contactsTitle', 'Контакты: заголовок'], ['contactsSub', 'Контакты: подзаголовок'], ['footer', 'Подвал: доп. текст']
    ];
    return head('Настройки сайта', 'Внешний вид, разделы, тексты, поиск Google и резервная копия.') +
      '<h3>Акцентный цвет</h3><div class="a-card"><div class="a-colors">' +
        ACCENTS.map((c) => '<button type="button" title="' + c[1] + '" style="background:' + c[0] + '" class="' + (s.accent.toLowerCase() === c[0] ? 'is-on' : '') + '" data-a="accent" data-c="' + c[0] + '"></button>').join('') +
        '<label class="a-field" style="flex-direction:row;align-items:center;gap:10px;margin-left:8px"><input class="a-in" type="color" data-p="s.site.accent" value="' + esc(s.accent) + '"><span>свой цвет</span></label>' +
      '</div></div>' +
      '<h3>Эффекты</h3><div class="a-card"><div class="a-grid">' +
        sw('s.site.animations', 'Плавное появление элементов', 'Заголовки по буквам, мягкое появление блоков, смена разделов «шторкой»') +
        sw('s.site.cursor', 'Фирменный курсор', 'Точка в цвете акцента и кольцо при клике. Только на компьютерах') +
        sw('s.site.tilt', '3D-наклон карточек', 'Карточки услуг, отзывов и фото слегка поворачиваются за мышью') +
        sw('s.site.parallax', 'Параллакс главного экрана', 'Фото и текст на главной смещаются за мышью') +
        sw('s.site.particles', 'Золотая пыль на главном экране') +
        sw('s.site.grain', 'Плёночное зерно', 'Едва заметная текстура поверх сайта') +
        sw('s.site.intro', 'Экран загрузки', 'Логотип и реальный процент загрузки при входе на сайт') +
      '</div></div>' +
      '<h3>Логотип и иконка вкладки</h3>' +
      singlePhoto('logo', s, 'Логотип', Y.DEFAULT_LOGO, 'Светлый текст на чёрном фоне или PNG с прозрачностью. Показывается в меню, на телефоне и в письмах.', true) +
      singlePhoto('favicon', s, 'Иконка вкладки браузера', 'img/logo_ya.jpg', 'Квадратная картинка. По умолчанию — «YA» на чёрном.', true) +
      '<h3>Разделы сайта</h3><p class="adm__lead">Включайте, выключайте, переименовывайте и меняйте порядок пунктов меню.</p><div class="a-sections">' +
        s.sections.map((sec, i) => '<div class="a-sec">' +
          (sec.id === 'home' ? '<span style="width:40px"></span>' : '<label class="a-switch"><input type="checkbox" data-p="s.site.sections.' + i + '.on" data-t="bool"' + (sec.on ? ' checked' : '') + '></label>') +
          '<label class="a-field"><span>' + labels[sec.id] + '</span><input class="a-in" data-p="s.site.sections.' + i + '.label" value="' + esc(sec.label) + '"></label>' +
          '<div class="adm__row" style="margin:0;gap:4px">' + (sec.id === 'home' ? '' :
            '<button class="a-btn a-btn--sm a-btn--icon" data-a="secMove" data-i="' + i + '" data-d="-1"' + (i > 1 ? '' : ' disabled') + '>' + IC.up + '</button>' +
            '<button class="a-btn a-btn--sm a-btn--icon" data-a="secMove" data-i="' + i + '" data-d="1"' + (i < s.sections.length - 1 ? '' : ' disabled') + '>' + IC.down + '</button>') + '</div></div>').join('') +
      '</div>' +
      '<h3>Тексты на сайте</h3><div class="a-card"><div class="a-grid">' + texts.map((t) => inp('s.site.texts.' + t[0], t[1], /Sub|Text|Off/.test(t[0]) ? { ta: true, rows: 2 } : {})).join('') + '</div></div>' +
      '<h3>Поиск Google и соцсети</h3><div class="a-card"><div class="a-grid">' +
        inp('s.site.seoTitle', 'Заголовок страницы', { full: true, hint: 'Показывается во вкладке и в результатах поиска' }) +
        inp('s.site.seoDescription', 'Описание', { ta: true, rows: 2, full: true }) +
        inp('s.site.siteUrl', 'Адрес сайта', { full: true, ph: 'https://…', hint: 'Нужен для ссылок в письмах (отмена записи, логотип). Заполняется автоматически при сохранении.' }) +
      '</div></div>' +
      '<h3>Политика конфиденциальности</h3><div class="a-card"><div class="a-grid">' + inp('s.site.privacy', 'Текст (открывается по ссылке в форме записи и в подвале)', { ta: true, rows: 8, full: true }) + '</div></div>' +
      '<h3>Пароль от панели мастера</h3><div class="a-card"><div class="a-grid" style="align-items:end">' +
        '<label class="a-field"><span>Новый пароль</span><input class="a-in" type="password" id="pw1" autocomplete="new-password"></label>' +
        '<label class="a-field"><span>Ещё раз</span><input class="a-in" type="password" id="pw2" autocomplete="new-password"></label>' +
        '<button class="a-btn a-btn--gold" data-a="changePw">Сменить пароль</button>' +
      '</div></div>' +
      '<h3>Резервная копия</h3><div class="a-card"><p class="adm__lead" style="margin:0 0 12px">Файл со всеми настройками, услугами, фото и расписанием (без записей клиентов).</p><div class="adm__row" style="margin:0">' +
        '<button class="a-btn" data-a="backup">Скачать резервную копию</button><label class="a-btn">Восстановить из файла<input type="file" accept=".json,application/json" hidden id="restoreFile"></label>' +
        (A.demo ? '<button class="a-btn a-btn--danger" data-a="resetDemo">Сбросить демо-данные</button>' : '') + '</div></div>';
  };

  /* =====================================================================
     ОБРАБОТКА ДЕЙСТВИЙ
     ===================================================================== */
  root.addEventListener('change', async (e) => {
    const t = e.target;
    if (t.id === 'multiUpload') { await uploadMany(t.files); t.value = ''; }
    if (t.dataset.uploadSingle) {
      const key = t.dataset.uploadSingle, obj = t.dataset.obj === 'site' ? A.s.site : A.s.profile;
      const f = t.files[0];
      if (!f) return;
      Y.toast('Загружаем…');
      try {
        let r;
        if (key === 'logo' && $('#logoKnock') && $('#logoKnock').checked) {
          const data = await Y.knockoutBlack(f, 900);
          r = A.demo ? { url: data, fileId: '' } : await Y.api.admin('upload', { name: 'logo.png', mime: 'image/png', data: data.split(',')[1] });
        } else r = await uploadImage(f, key === 'favicon' ? 256 : key === 'logo' ? 800 : 1800, !!t.dataset.png);
        if (obj[key] && obj[key].fileId) A.trash.push(obj[key].fileId);
        obj[key] = { url: r.url, fileId: r.fileId };
        markDirty('settings');
        renderMain();
        await saveAll(true);
        Y.toast('Готово — уже на сайте');
      } catch (err) { Y.toast('Не удалось загрузить: ' + err.message, true); }
    }
    if (t.id === 'audioUpload') {
      const f = t.files[0];
      t.value = '';
      if (!f) return;
      if (f.size > 15 * 1024 * 1024) return Y.toast('Файл больше 15 МБ — сожмите его', true);
      Y.toast('Загружаем музыку… это может занять минуту');
      try {
        const r = await Y.api.admin('upload', { name: f.name, mime: f.type || 'audio/mpeg', data: await Y.fileToBase64(f) });
        A.s.music.tracks.push({ id: Y.uid(), title: f.name.replace(/\.[^.]+$/, ''), url: r.url, fileId: r.fileId, size: f.size });
        markDirty('settings');
        renderMain();
        await saveAll(true);
        Y.toast('Трек добавлен');
      } catch (err) { Y.toast('Не удалось загрузить: ' + err.message, true); }
    }
    if (t.id === 'restoreFile') {
      const f = t.files[0];
      t.value = '';
      if (!f) return;
      try {
        const d = JSON.parse(await f.text());
        if (!d.settings) throw new Error('Это не файл резервной копии');
        if (!confirm('Заменить текущие настройки, услуги, фото и расписание данными из файла?')) return;
        A.s = Y.mergeSettings(d.settings);
        if (Array.isArray(d.services)) { A.services = d.services; markDirty('services'); }
        if (Array.isArray(d.photos)) { A.photos = d.photos; markDirty('photos'); }
        if (Array.isArray(d.exceptions)) { A.exceptions = d.exceptions; markDirty('exceptions'); }
        markDirty('settings');
        renderMain();
        Y.toast('Загружено из файла. Нажмите «Сохранить».');
      } catch (err) { Y.toast('Ошибка: ' + err.message, true); }
    }
  });
  root.addEventListener('dragover', (e) => { const d = e.target.closest('#drop'); if (d) { e.preventDefault(); d.classList.add('is-over'); } });
  root.addEventListener('dragleave', (e) => { const d = e.target.closest('#drop'); if (d) d.classList.remove('is-over'); });
  root.addEventListener('drop', (e) => {
    const d = e.target.closest('#drop');
    if (!d) return;
    e.preventDefault();
    d.classList.remove('is-over');
    uploadMany(e.dataTransfer.files);
  });

  root.addEventListener('click', async (e) => {
    const tab = e.target.closest('[data-tab]');
    if (tab) {
      A.tab = tab.dataset.tab;
      $$('.adm__tab').forEach((x) => x.classList.toggle('is-on', x === tab));
      renderMain();
      $('#admMain').scrollTop = 0;
      return;
    }
    const f = e.target.closest('#bkFilter [data-f]');
    if (f) {
      A.filter = f.dataset.f;
      $$('#bkFilter button').forEach((x) => x.classList.toggle('is-on', x === f));
      $('#bkList').innerHTML = bookingListHtml();
      return;
    }
    const el = e.target.closest('[data-a]');
    if (!el) return;
    const a = el.dataset.a, id = el.dataset.id, i = +el.dataset.i;
    if (a === 'modalBg' && e.target !== el) return;

    switch (a) {
      case 'closeLogin': closeAdmin(true); break;
      case 'close': closeAdmin(); break;
      case 'logout':
        if (A.dirty.size && !confirm('Есть несохранённые изменения. Выйти?')) return;
        Y.api.setPassword('');
        closeAdmin(true);
        break;
      case 'save': saveAll(); break;
      case 'discard': if (confirm('Отменить все несохранённые изменения?')) { loadAll(); if (Y.reloadPublic) Y.reloadPublic(); } break;
      case 'modalBg': case 'closeModal': closeModal(); break;
      case 'refresh': await refreshBookings(); Y.toast('Обновлено'); break;

      /* записи */
      case 'confirm': {
        const b = findB(id);
        try { const r = await setStatus(id, 'confirmed'); messageModal(findB(id) || b, 'confirm', r.notified || []); } catch (err) {}
        break;
      }
      case 'cancel': {
        const b = findB(id);
        if (!confirm('Отменить запись ' + b.name + ' на ' + Y.fmtDate(b.date) + ' ' + b.start + '? Время снова станет свободным.')) return;
        try { const r = await setStatus(id, 'cancelled'); messageModal(findB(id) || b, 'cancel', r.notified || []); } catch (err) {}
        break;
      }
      case 'markDone': setStatus(id, 'done').catch(() => {}); break;
      case 'restore': setStatus(id, 'confirmed').catch(() => {}); break;
      case 'message': messageModal(findB(id), findB(id).status === 'new' ? 'confirm' : 'remind'); break;
      case 'editBooking': bookingModal(findB(id)); break;
      case 'addBooking': bookingModal(null); break;
      case 'addBookingOn': bookingModal(null, { date: el.dataset.date }); break;
      case 'saveBookingModal': saveBookingModal(id); break;
      case 'deleteBooking':
        if (!confirm('Удалить запись насовсем?')) return;
        try { await Y.api.admin('deleteBooking', { id }); A.bookings = A.bookings.filter((b) => String(b.id) !== String(id)); renderMain(); }
        catch (err) { Y.toast(err.message, true); }
        break;
      case 'sendSms': {
        const ios = /iPhone|iPad|iPod|Macintosh/.test(navigator.userAgent);
        location.href = 'sms:+' + el.dataset.phone + (ios ? '&' : '?') + 'body=' + encodeURIComponent($('#msgText').value);
        break;
      }
      case 'sendMail':
        el.disabled = true;
        try { const r = await Y.api.admin('sendClientEmail', { id, text: $('#msgText').value }); Y.toast(r.message || 'Письмо отправлено'); refreshBookings(); }
        catch (err) { Y.toast(err.message, true); }
        el.disabled = false;
        break;
      case 'copyMsg':
        try { await navigator.clipboard.writeText($('#msgText').value); } catch (err) { $('#msgText').select(); document.execCommand('copy'); }
        Y.toast('Текст скопирован');
        break;

      /* расписание */
      case 'calMonth': {
        const [y, m] = A.calMonth.split('-').map(Number);
        const d = new Date(y, m - 1 + +el.dataset.d, 1);
        A.calMonth = d.getFullYear() + '-' + Y.pad(d.getMonth() + 1);
        renderMain();
        break;
      }
      case 'dayModal': dayModal(el.dataset.date); break;
      case 'applyDay': applyDay(el.dataset.date); break;
      case 'addBusy': {
        const s = $('#bzStart').value, en = $('#bzEnd').value;
        if (!s || !en || Y.toMin(en) <= Y.toMin(s)) return Y.toast('Проверьте время', true);
        A.exceptions.push({ id: Y.uid(), type: 'busy', from: el.dataset.date, to: '', start: s, end: en, note: $('#bzNote').value });
        markDirty('exceptions');
        dayModal(el.dataset.date);
        break;
      }
      case 'delBusy': A.exceptions.splice(i, 1); markDirty('exceptions'); dayModal(el.dataset.date); break;
      case 'addVacation': {
        const box = $('#exOff');
        const from = $('[name=from]', box).value, to = $('[name=to]', box).value || from;
        if (!from) return Y.toast('Выберите даты', true);
        if (to < from) return Y.toast('Дата «по» раньше даты «с»', true);
        A.exceptions.push({ id: Y.uid(), type: 'off', from, to, start: '', end: '', note: $('[name=note]', box).value });
        markDirty('exceptions');
        renderMain();
        break;
      }
      case 'delEx': A.exceptions.splice(i, 1); markDirty('exceptions'); renderMain(); break;

      /* услуги */
      case 'addSvc':
        A.services.push({ id: 's' + Y.uid(), cat: (A.services[A.services.length - 1] || {}).cat || 'Услуги', name: 'Новая услуга', desc: '', priceFrom: 1000, priceTo: '', duration: 60, note: '', visible: true, icon: 'sparkle' });
        markDirty('services');
        renderMain();
        setTimeout(() => { const m = $('#admMain'); m.scrollTop = m.scrollHeight; }, 30);
        break;
      case 'svcMove': move(A.services, i, +el.dataset.d); markDirty('services'); renderMain(); break;
      case 'svcToggle': A.services[i].visible = A.services[i].visible === false; markDirty('services'); renderMain(); break;
      case 'svcIcon': A.services[i].icon = el.dataset.k; markDirty('services'); $$('[data-a="svcIcon"][data-i="' + i + '"]').forEach((x) => x.classList.toggle('is-on', x === el)); break;
      case 'svcDel': if (confirm('Удалить услугу «' + A.services[i].name + '»?')) { A.services.splice(i, 1); markDirty('services'); renderMain(); } break;

      /* портфолио */
      case 'importPhotos': A.photos = Y.DEFAULT_PHOTOS.map((p) => Object.assign({}, p, { id: Y.uid() })); markDirty('photos'); renderMain(); break;
      case 'phMove': move(A.photos, i, +el.dataset.d); markDirty('photos'); renderMain(); break;
      case 'phFirst': A.photos.unshift(A.photos.splice(i, 1)[0]); markDirty('photos'); renderMain(); break;
      case 'phDel':
        if (!confirm('Удалить фото из портфолио?')) return;
        if (A.photos[i].fileId) A.trash.push(A.photos[i].fileId);
        A.photos.splice(i, 1); markDirty('photos'); renderMain();
        break;
      case 'resetSingle': {
        const obj = el.dataset.obj === 'site' ? A.s.site : A.s.profile;
        const old = obj[el.dataset.k];
        if (old && old.fileId) A.trash.push(old.fileId);
        obj[el.dataset.k] = null;
        markDirty('settings'); renderMain();
        break;
      }

      /* отзывы */
      case 'crApprove': case 'crHide': case 'crDel': {
        if (a === 'crDel' && !confirm('Удалить отзыв насовсем?')) return;
        try {
          if (a === 'crDel') { await Y.api.admin('deleteReview', { id }); A.clientReviews = A.clientReviews.filter((r) => String(r.id) !== String(id)); }
          else {
            const rstatus = a === 'crApprove' ? 'approved' : 'rejected';
            await Y.api.admin('saveReview', { review: { id, rstatus } });
            const r = A.clientReviews.find((x) => String(x.id) === String(id));
            if (r) r.rstatus = rstatus;
          }
          if (Y.applyLocal) Y.applyLocal({ clientReviews: pubReviews() });
          render();
          Y.toast(a === 'crApprove' ? 'Отзыв опубликован' : a === 'crHide' ? 'Отзыв скрыт' : 'Отзыв удалён');
        } catch (err) { Y.toast(err.message, true); }
        break;
      }
      case 'addReview': A.s.reviews.unshift({ id: Y.uid(), name: '', service: '', date: '', rating: 5, text: '' }); markDirty('settings'); renderMain(); break;
      case 'revMove': move(A.s.reviews, i, +el.dataset.d); markDirty('settings'); renderMain(); break;
      case 'revDel': if (confirm('Удалить отзыв?')) { A.s.reviews.splice(i, 1); markDirty('settings'); renderMain(); } break;

      /* музыка */
      case 'trackPlay': {
        const t = A.s.music.tracks[i];
        if (prevIdx === i && !prev.paused) { prev.pause(); }
        else { prev.src = Y.audioUrl(t); prev.volume = 0.6; prev.play().catch(() => Y.toast('Не удалось воспроизвести — проверьте ссылку', true)); prevIdx = i; }
        setTimeout(renderMain, 100);
        break;
      }
      case 'trackMove': move(A.s.music.tracks, i, +el.dataset.d); markDirty('settings'); renderMain(); break;
      case 'trackDel':
        if (!confirm('Удалить трек из плейлиста?')) return;
        if (A.s.music.tracks[i].fileId) A.trash.push(A.s.music.tracks[i].fileId);
        A.s.music.tracks.splice(i, 1); markDirty('settings'); renderMain();
        break;
      case 'trackAdd': {
        const url = $('#trUrl').value.trim();
        if (!/^https?:\/\//.test(url)) return Y.toast('Вставьте ссылку, начинающуюся с https://', true);
        A.s.music.tracks.push({ id: Y.uid(), title: $('#trTitle').value.trim() || 'Трек', url, fileId: '' });
        markDirty('settings'); renderMain();
        break;
      }
      case 'tracksDefault': A.s.music.tracks = Y.clone(Y.DEFAULT_TRACKS); markDirty('settings'); renderMain(); break;

      /* уведомления */
      case 'testEmail': case 'testClientEmail':
        try { if (A.dirty.has('settings')) await saveAll(true); const r = await Y.api.admin(a); Y.toast(r.message || 'Письмо отправлено'); }
        catch (err) { Y.toast(err.message, true); }
        break;
      case 'changePw': {
        const p1 = $('#pw1').value, p2 = $('#pw2').value;
        if (p1.length < 6) return Y.toast('Пароль — минимум 6 символов', true);
        if (p1 !== p2) return Y.toast('Пароли не совпадают', true);
        try { await Y.api.admin('changePassword', { newPassword: p1 }); Y.api.setPassword(p1); $('#pw1').value = $('#pw2').value = ''; Y.toast('Пароль изменён'); }
        catch (err) { Y.toast(err.message, true); }
        break;
      }

      /* сайт */
      case 'accent': A.s.site.accent = el.dataset.c; markDirty('settings'); livePreview(); renderMain(); break;
      case 'secMove': {
        const j = i + +el.dataset.d;
        if (j < 1 || j >= A.s.site.sections.length) return;
        move(A.s.site.sections, i, +el.dataset.d); markDirty('settings'); renderMain();
        break;
      }
      case 'backup': {
        const data = { version: 2, date: new Date().toISOString(), settings: Object.assign({}, A.s, { notify: Object.assign({}, A.s.notify, { smsruKey: '' }) }), services: A.services, photos: A.photos, exceptions: A.exceptions };
        const url = URL.createObjectURL(new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' }));
        const link = document.createElement('a');
        link.href = url; link.download = 'sait-yakunin-' + today() + '.json';
        document.body.appendChild(link); link.click(); link.remove();
        setTimeout(() => URL.revokeObjectURL(url), 1000);
        break;
      }
      case 'resetDemo':
        if (!confirm('Сбросить все демо-данные?')) return;
        await Y.api.admin('resetDemo');
        Y.api.setPassword('admin');
        loadAll();
        if (Y.reloadPublic) Y.reloadPublic();
        Y.toast('Демо-данные сброшены');
        break;
    }
  });
  function move(arr, i, d) {
    const j = i + d;
    if (j < 0 || j >= arr.length) return;
    const t = arr[i]; arr[i] = arr[j]; arr[j] = t;
  }

  document.addEventListener('keydown', (e) => {
    if (!A.open) return;
    if (e.key === 'Escape' && $('.a-modal')) closeModal();
    if ((e.ctrlKey || e.metaKey) && e.key === 's') { e.preventDefault(); saveAll(); }
  });
  window.addEventListener('beforeunload', (e) => { if (A.open && A.dirty.size) { e.preventDefault(); e.returnValue = ''; } });

  /* ---------- точки входа ---------- */
  $('#adminLink').addEventListener('click', (e) => { e.preventDefault(); openAdmin(); });
  window.addEventListener('hashchange', () => { if (location.hash === '#admin') openAdmin(); });
  if (location.hash === '#admin') openAdmin();
  setInterval(() => { if (A.open && A.tab === 'bookings' && !document.hidden && !$('.a-modal')) refreshBookings(); }, 60000);
})();
