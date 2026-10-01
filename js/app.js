/* Публичная часть сайта: разделы-экраны, портфолио-слайдшоу, услуги, отзывы, пошаговая запись, контакты, плеер, эффекты. */
(function () {
  'use strict';
  const $ = (s, r) => (r || document).querySelector(s);
  const $$ = (s, r) => Array.from((r || document).querySelectorAll(s));
  const esc = Y.esc;
  const CFG = window.SITE_CONFIG || {};
  const svg = (d, cls) => '<svg class="' + (cls || 'i') + '" viewBox="0 0 24 24" aria-hidden="true">' + d + '</svg>';
  const IC = {
    home: '<path d="M3 11l9-7 9 7v9a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1z"/>',
    about: '<circle cx="12" cy="8" r="4"/><path d="M4 21c1.5-4 4.5-6 8-6s6.5 2 8 6"/>',
    works: '<rect x="3" y="3" width="7" height="9"/><rect x="14" y="3" width="7" height="5"/><rect x="14" y="12" width="7" height="9"/><rect x="3" y="16" width="7" height="5"/>',
    prices: '<path d="M3 12V4h8l10 10-8 8z"/><circle cx="7.5" cy="7.5" r="1.5"/>',
    reviews: '<path d="M12 3l2.7 5.6 6.1.9-4.4 4.3 1 6.1L12 17l-5.4 2.9 1-6.1L3.2 9.5l6.1-.9z"/>',
    booking: '<rect x="3" y="4.5" width="18" height="16" rx="2"/><path d="M3 9.5h18M8 2.5v4M16 2.5v4M12 13v5M9.5 15.5h5"/>',
    contacts: '<path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2"/>',
    more: '<path d="M4 7h16M4 12h16M4 17h16"/>',
    left: '<path d="M15 6l-6 6 6 6"/>',
    right: '<path d="M9 6l6 6-6 6"/>',
    arrow: '<path d="M5 12h14M13 6l6 6-6 6"/>',
    back: '<path d="M19 12H5M11 6l-6 6 6 6"/>',
    check: '<path d="M5 12.5l4.5 4.5L19 7.5"/>',
    mail: '<rect x="3" y="5" width="18" height="14" rx="2"/><path d="m3 7 9 6 9-6"/>',
    pin: '<path d="M12 21s-7-6.2-7-11.5A7 7 0 0 1 19 9.5C19 14.8 12 21 12 21z"/><circle cx="12" cy="9.5" r="2.5"/>',
    clock: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
    send: '<path d="M21 3 10 14M21 3l-7 18-4-7-7-4z"/>',
    close: '<path d="M6 6l12 12M18 6 6 18"/>',
    cal: '<rect x="3" y="4.5" width="18" height="16" rx="2"/><path d="M3 9.5h18M8 2.5v4M16 2.5v4"/>'
  };
  const SOCIAL = {
    telegram: '<svg viewBox="0 0 24 24"><path d="M21.9 4.3 18.7 19.4c-.2 1.1-.9 1.3-1.8.8l-4.8-3.6-2.3 2.2c-.3.3-.5.5-1 .5l.3-4.9 8.9-8c.4-.3-.1-.5-.6-.2l-11 6.9-4.7-1.5c-1-.3-1-1 .2-1.5L20.5 3c.9-.3 1.6.2 1.4 1.3z"/></svg>',
    instagram: '<svg viewBox="0 0 24 24"><path d="M12 7.3A4.7 4.7 0 1 0 12 16.7 4.7 4.7 0 0 0 12 7.3zm0 7.8a3.1 3.1 0 1 1 0-6.2 3.1 3.1 0 0 1 0 6.2zM17 6a1.1 1.1 0 1 0 0 2.2A1.1 1.1 0 0 0 17 6zM21.9 7.9c-.1-1.6-.4-3-1.6-4.2S17.7 2.2 16.1 2.1C14.5 2 9.5 2 7.9 2.1c-1.6.1-3 .4-4.2 1.6S2.2 6.3 2.1 7.9C2 9.5 2 14.5 2.1 16.1c.1 1.6.4 3 1.6 4.2s2.6 1.5 4.2 1.6c1.6.1 6.6.1 8.2 0 1.6-.1 3-.4 4.2-1.6s1.5-2.6 1.6-4.2c.1-1.6.1-6.6 0-8.2zm-2 10.4a3.1 3.1 0 0 1-1.8 1.8c-1.2.5-4.2.4-5.6.4s-4.4.1-5.6-.4a3.1 3.1 0 0 1-1.8-1.8c-.5-1.2-.4-4.2-.4-5.6s-.1-4.4.4-5.6a3.1 3.1 0 0 1 1.8-1.8C7.6 4.3 10.6 4.4 12 4.4s4.4-.1 5.6.4a3.1 3.1 0 0 1 1.8 1.8c.5 1.2.4 4.2.4 5.6s.1 4.4-.4 5.6z"/></svg>',
    vk: '<svg viewBox="0 0 24 24"><path d="M13.1 18.5c-6.4 0-10.1-4.4-10.2-11.7H6c.1 5.4 2.5 7.7 4.4 8.1V6.8h3v4.6c1.9-.2 3.8-2.3 4.4-4.6h3a8.9 8.9 0 0 1-4 5.8 9.3 9.3 0 0 1 4.7 5.9h-3.3a5.8 5.8 0 0 0-4.8-4.2v4.2h-.3z"/></svg>'
  };
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  const isMobile = () => window.matchMedia('(max-width: 1023px)').matches;
  const wait = (ms) => new Promise((r) => setTimeout(r, ms));

  /* ---------- состояние ---------- */
  const S = { settings: Y.mergeSettings({}), services: Y.DEFAULT_SERVICES, photos: [], exceptions: [], busy: [], clientReviews: [], tz: CFG.TZ, loaded: false, error: false, serverOld: false, version: 0 };
  const B = { step: 1, ids: [], date: null, time: null, month: null, contact: 'Звонок', form: { agree: true }, err: '', sending: false, cat: 'Все' };
  const G = { filter: 'Все', shown: 12, list: [], view: null, page: 12 };
  const R = { cur: null, visible: [], lastNav: 0, edgeT: 0, first: true };
  const LOAD = { fonts: false, hero: false, data: false };
  const st = () => ({ schedule: S.settings.schedule, exceptions: S.exceptions, busy: S.busy, tz: S.tz });
  const chosen = () => S.services.filter((s) => B.ids.indexOf(String(s.id)) >= 0);
  const minDur = () => Math.min.apply(null, S.services.map((s) => +s.duration || 60).concat([240]));
  const totalDur = () => (B.ids.length ? chosen().reduce((a, s) => a + (+s.duration || 60), 0) : minDur());
  const text = (k) => S.settings.site.texts[k] || '';
  const site = () => S.settings.site;
  let heroReadyRes;
  const heroReady = new Promise((r) => (heroReadyRes = r));
  heroReady.then(() => (LOAD.hero = true));
  (document.fonts && document.fonts.ready ? Promise.race([document.fonts.ready, wait(2500)]) : wait(300)).then(() => (LOAD.fonts = true));

  /* ---------- загрузка ----------
     Последние данные храним в браузере: повторный визит показывается мгновенно,
     свежие данные подгружаются фоном (сервер всё равно перепроверяет каждую запись). */
  const CACHE_KEY = 'yakunin_pub_v1';
  function applyData(d) {
    S.settings = Y.mergeSettings(d.settings);
    S.services = Array.isArray(d.services) && d.services.length ? d.services : Y.DEFAULT_SERVICES;
    S.photos = Array.isArray(d.photos) ? d.photos : [];
    S.exceptions = d.exceptions || [];
    S.busy = d.busy || [];
    S.clientReviews = d.clientReviews || [];
    S.tz = d.tz || CFG.TZ;
    S.version = d.version || 0;
    // старая версия скрипта на сервере не умеет записывать на услуги по умолчанию
    S.serverOld = !Y.api.demo && !d.version;
  }
  function saveCache() {
    if (Y.api.demo) return;
    const s = Y.clone(S.settings);
    delete s.notify;
    try { localStorage.setItem(CACHE_KEY, JSON.stringify({ t: Date.now(), d: { settings: s, services: S.services, photos: S.photos, exceptions: S.exceptions, busy: S.busy, clientReviews: S.clientReviews, tz: S.tz, version: S.version } })); } catch (e) {}
  }
  if (!Y.api.demo) {
    try {
      const c = JSON.parse(localStorage.getItem(CACHE_KEY));
      if (c && c.d) { applyData(c.d); S.loaded = Date.now() - c.t < 30 * 60e3; LOAD.data = true; }
    } catch (e) {}
  }
  async function load() {
    try {
      const d = await Y.api.publicData();
      applyData(d);
      S.error = false;
      saveCache();
      if (S.serverOld) console.warn('На сервере старая версия Code.gs — обновите развёртывание (см. README).');
    } catch (e) {
      console.error(e);
      if (!S.loaded) S.error = true;
    }
    S.loaded = true;
    LOAD.data = true;
    B.ids = B.ids.filter((id) => S.services.some((s) => String(s.id) === id));
    renderAll();
  }
  Y.reloadPublic = load;
  // Панель мастера применяет сохранённые изменения сразу, не дожидаясь ответа сервера
  Y.applyLocal = (d) => {
    if (d.settings) S.settings = Y.mergeSettings(d.settings);
    if (d.services) S.services = d.services.filter((s) => s.visible !== false);
    if (d.photos) S.photos = d.photos;
    if (d.exceptions) S.exceptions = d.exceptions;
    if (d.clientReviews) S.clientReviews = d.clientReviews;
    G.view = null;
    renderAll();
    saveCache();
  };

  function renderAll() {
    applyTheme();
    renderSections();
    renderProfile();
    renderGallery();
    renderPrices();
    renderReviews();
    renderBooking();
    renderContacts();
    renderNearest();
    setupPlayer();
    applyEffects();
    renderMeta();
    document.body.classList.remove('is-loading');
    if (R.cur && !R.first) startReveal(panel(R.cur));
  }

  /* ---------- оформление из настроек ---------- */
  let accentHex = '#d4af37';
  function applyTheme() {
    accentHex = /^#[0-9a-f]{6}$/i.test(site().accent || '') ? site().accent : '#d4af37';
    const root = document.documentElement.style;
    root.setProperty('--accent', accentHex);
    const n = parseInt(accentHex.slice(1), 16);
    const lum = (0.299 * (n >> 16) + 0.587 * ((n >> 8) & 255) + 0.114 * (n & 255)) / 255;
    root.setProperty('--accent-ink', lum > 0.55 ? '#0a0a0a' : '#ffffff');
    root.setProperty('--gal-cols-m', +site().galleryColsMobile === 1 ? 1 : 2);
    const logo = site().logo ? Y.img(site().logo, 600) : Y.DEFAULT_LOGO;
    $$('.js-logo').forEach((i) => { if (i.getAttribute('src') !== logo) i.src = logo; });
    if (site().favicon) $('#favicon').href = Y.img(site().favicon, 128);
    G.page = Math.max(4, +site().galleryPage || 12);
    if (!G.view) {
      let saved = null;
      try { saved = sessionStorage.getItem('y_gview'); } catch (e) {}
      G.view = saved || site().galleryView || 'cinema';
    }
  }

  /* ---------- эффекты: каждый включается/выключается в «Настройках сайта» ---------- */
  function applyEffects() {
    const s = site(), h = document.documentElement.classList;
    h.toggle('fx-grain', s.grain !== false && !reduced);
    h.toggle('fx-anim', s.animations !== false && !reduced);
    h.toggle('fx-cursor', !!s.cursor && finePointer);
    h.toggle('fx-tilt', s.tilt !== false && finePointer && !reduced);
    if (s.particles === false || reduced) dust.stop(true);
    else if (R.cur === 'home') dust.start();
    if (!s.parallax) { $('#heroImg').style.removeProperty('--px'); $('#heroImg').style.removeProperty('--py'); $('#heroContent').style.removeProperty('--tx'); $('#heroContent').style.removeProperty('--ty'); }
    if (!h.contains('fx-tilt') && tiltEl) resetTilt();
    // Курсор: системный, но в фирменном виде — точка в цвете акцента с тёмной обводкой (виден на любом фоне)
    const enc = (x) => 'url("data:image/svg+xml,' + encodeURIComponent(x) + '")';
    const a = accentHex;
    const dot = "<svg xmlns='http://www.w3.org/2000/svg' width='22' height='22'><circle cx='11' cy='11' r='4.5' fill='" + a + "' stroke='#000' stroke-opacity='.7' stroke-width='1.6'/></svg>";
    const ring = "<svg xmlns='http://www.w3.org/2000/svg' width='36' height='36'><circle cx='18' cy='18' r='12' fill='none' stroke='#000' stroke-opacity='.45' stroke-width='3.6'/><circle cx='18' cy='18' r='12' fill='none' stroke='" + a + "' stroke-width='1.6'/><circle cx='18' cy='18' r='2.4' fill='" + a + "' stroke='#000' stroke-opacity='.6'/></svg>";
    document.documentElement.style.setProperty('--cur-d', enc(dot) + ' 11 11, auto');
    document.documentElement.style.setProperty('--cur-p', enc(ring) + ' 18 18, pointer');
  }
  // Небольшой эффект курсора: тонкое кольцо расходится от точки клика
  document.addEventListener('pointerdown', (e) => {
    if (e.pointerType !== 'mouse' || !document.documentElement.classList.contains('fx-cursor') || document.body.classList.contains('adm-lock')) return;
    const r = document.createElement('span');
    r.className = 'click-ring';
    r.style.left = e.clientX + 'px';
    r.style.top = e.clientY + 'px';
    document.body.appendChild(r);
    setTimeout(() => r.remove(), 650);
  });

  /* =====================================================================
     РАЗДЕЛЫ И НАВИГАЦИЯ
     ===================================================================== */
  const panel = (id) => document.getElementById(id);
  const allReviews = () => (S.clientReviews || []).concat((S.settings.reviews || []).filter((r) => r.text));
  function sectionOn(id) {
    const cfg = site().sections.find((x) => x.id === id);
    if (id === 'home') return true;
    if (!cfg || !cfg.on) return false;
    if (id === 'reviews' && !allReviews().length) return false;
    return true;
  }
  const label = (id) => (site().sections.find((x) => x.id === id) || {}).label || id;

  function renderSections() {
    R.visible = site().sections.map((x) => x.id).filter(sectionOn);
    Y.SECTION_IDS.forEach((id) => { const p = panel(id); if (p) p.hidden = R.visible.indexOf(id) < 0; });
    R.visible.forEach((id, i) => { const k = $('#' + id + ' .kicker__num'); if (k) k.textContent = Y.pad(i + 1); });
    const num = (id) => Y.pad(R.visible.indexOf(id) + 1);
    const links = R.visible.map((id) => '<a href="#' + id + '" data-go="' + id + '"><small>' + num(id) + '</small>' + esc(label(id)) + '</a>').join('');
    $('#sideNav').innerHTML = '<i class="side__bar" id="sideBar"></i>' + links;
    $('#sheetNav').innerHTML = links;
    const main = ['home', 'works', 'booking', 'prices'].filter((id) => R.visible.indexOf(id) >= 0);
    const bn = $('#bottomNav');
    bn.style.gridTemplateColumns = 'repeat(' + (main.length + 1) + ', 1fr)';
    bn.innerHTML = main.map((id) =>
      '<a href="#' + id + '" data-go="' + id + '" class="' + (id === 'booking' ? 'bn-main' : '') + '"><span>' + svg(IC[id]) + '</span><span>' + esc(id === 'home' ? 'Главная' : label(id)) + '</span></a>'
    ).join('') + '<button type="button" data-sheet-open><span>' + svg(IC.more) + '</span><span>Ещё</span></button>';
    $('#pagerTotal').textContent = Y.pad(R.visible.length);
    if (!R.cur || R.visible.indexOf(R.cur) < 0) go(hashSection() || 'home', { instant: true, noPush: true });
    else markNav();
  }
  function hashSection() {
    const h = decodeURIComponent(location.hash.slice(1));
    return R.visible.indexOf(h) >= 0 ? h : null;
  }
  function markNav() {
    $$('.side__nav a, .bottomnav [data-go], .sheet__nav a').forEach((a) => a.classList.toggle('is-on', a.dataset.go === R.cur));
    const i = R.visible.indexOf(R.cur);
    $('#pagerNum').textContent = Y.pad(i + 1);
    $('#pagerUp').disabled = i <= 0;
    $('#pagerDown').disabled = i >= R.visible.length - 1;
    $('#pagerFill').style.height = ((i + 1) / R.visible.length) * 100 + '%';
    $('#topTitle').textContent = R.cur === 'home' ? '' : label(R.cur);
    const on = $('.side__nav a.is-on');
    const bar = $('#sideBar');
    if (on && bar) bar.style.transform = 'translateY(' + (on.offsetTop + (on.offsetHeight - 18) / 2) + 'px)';
  }

  function go(id, opts) {
    opts = opts || {};
    if (R.visible.indexOf(id) < 0) id = 'home';
    const prev = R.cur;
    closeSheet();
    closePlaylist();
    if (prev === id) {
      if (!opts.noPush) panel(id).scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }
    const next = panel(id);
    const back = prev && R.visible.indexOf(id) < R.visible.indexOf(prev);
    next.scrollTop = 0; // раздел всегда открывается сверху
    resetReveal(next);
    if (opts.instant || !prev || !document.documentElement.classList.contains('fx-anim')) {
      $$('.panel').forEach((p) => p.classList.remove('is-active', 'is-leaving', 'enter-fwd', 'enter-back'));
      next.classList.add('is-active');
    } else {
      const old = panel(prev);
      clearTimeout(R.leaveT);
      $$('.panel.is-leaving').forEach((p) => p.classList.remove('is-leaving'));
      next.classList.add('no-anim', back ? 'enter-back' : 'enter-fwd', 'is-active');
      void next.offsetWidth;
      next.classList.remove('no-anim');
      requestAnimationFrame(() => requestAnimationFrame(() => next.classList.remove('enter-fwd', 'enter-back')));
      old.classList.remove('is-active');
      old.classList.add('is-leaving');
      R.leaveT = setTimeout(() => { old.classList.remove('is-leaving'); resetReveal(old); }, 1050);
    }
    R.cur = id;
    R.lastNav = Date.now();
    R.edgeT = Date.now();
    resetTilt();
    if (!opts.noPush && location.hash !== '#' + id) history.pushState(null, '', '#' + id);
    markNav();
    updateProgress();
    if (R.first) { R.first = false; introDone.then(() => startReveal(next)); }
    else setTimeout(() => startReveal(next), opts.instant ? 30 : 380);
    onEnter(id, prev);
  }
  function step(d) {
    const i = R.visible.indexOf(R.cur) + d;
    if (i >= 0 && i < R.visible.length) go(R.visible[i]);
  }
  function onEnter(id, prev) {
    if (id === 'contacts') loadMap();
    if (id === 'works') cinemaTimer(); else clearTimeout(C.timer);
    if (id === 'home') dust.start(); else if (prev === 'home') setTimeout(() => dust.stop(), 1000);
    if (id === 'reviews') updateDots();
  }
  window.addEventListener('popstate', () => {
    const h = hashSection();
    if (h) go(h, { noPush: true });
    else if (!/^#(admin|cancel=|review=)/.test(location.hash)) go('home', { noPush: true });
  });

  document.addEventListener('click', (e) => {
    if (e.target.closest('#adminRoot')) return;
    const g = e.target.closest('[data-go]');
    if (g) { e.preventDefault(); go(g.dataset.go); return; }
    if (e.target.closest('[data-go-next]')) return step(1);
    if (e.target.closest('[data-go-prev]')) return step(-1);
    if (e.target.closest('[data-sheet-open]')) return openSheet();
    if (e.target.closest('[data-sheet-close]')) return closeSheet();
    if (e.target.closest('[data-modal]')) return openPrivacy();
    const b = e.target.closest('.btn');
    if (b) ripple(b, e);
    if (!e.target.closest('#playlist, [data-player="list"]')) closePlaylist();
  });
  function openSheet() { $('#sheet').hidden = false; }
  function closeSheet() { $('#sheet').hidden = true; }

  function updateProgress() {
    const p = panel(R.cur);
    if (!p) return;
    const max = p.scrollHeight - p.clientHeight;
    $('#scrollProgress').style.width = (max > 4 ? (p.scrollTop / max) * 100 : 0) + '%';
  }
  $$('.panel').forEach((p) => p.addEventListener('scroll', () => { if (p.id === R.cur) updateProgress(); }, { passive: true }));

  // колесо мыши: раздел помещается в экран — прокрутка листает разделы
  let wheelAcc = 0, wheelT = 0;
  $('#stage').addEventListener('wheel', (e) => {
    if (isMobile() || !R.cur || !$('#lightbox').hidden || !$('#modal').hidden || document.body.classList.contains('adm-lock')) return;
    if (e.target.closest('.cinema__thumbs, .rv__track, .times__grid, .bk-grid') && Math.abs(e.deltaX) > Math.abs(e.deltaY)) return;
    const p = panel(R.cur);
    const now = Date.now();
    if (now - wheelT > 250) wheelAcc = 0;
    wheelT = now;
    const atBottom = p.scrollTop + p.clientHeight >= p.scrollHeight - 2;
    const atTop = p.scrollTop <= 1;
    if ((e.deltaY > 0 && !atBottom) || (e.deltaY < 0 && !atTop)) { R.edgeT = now; wheelAcc = 0; return; }
    if (now - R.lastNav < 1200 || now - R.edgeT < 450) return;
    wheelAcc += e.deltaY;
    if (Math.abs(wheelAcc) > 90) { wheelAcc = 0; step(e.deltaY > 0 ? 1 : -1); }
  }, { passive: true });

  // свайп влево/вправо на телефоне → соседний раздел
  let tStart = null;
  $('#stage').addEventListener('touchstart', (e) => { const t = e.touches[0]; tStart = { x: t.clientX, y: t.clientY, t: Date.now(), el: e.target }; }, { passive: true });
  $('#stage').addEventListener('touchend', (e) => {
    if (!tStart) return;
    const t = e.changedTouches[0];
    const dx = t.clientX - tStart.x, dy = t.clientY - tStart.y;
    const el = tStart.el, t0 = tStart.t;
    tStart = null;
    if (Math.abs(dx) < 70 || Math.abs(dx) < Math.abs(dy) * 1.7 || Date.now() - t0 > 700) return;
    if (el.closest('.cal')) return shiftMonth(dx < 0 ? 1 : -1);
    if (el.closest('.cinema__stage')) return showSlide(C.i + (dx < 0 ? 1 : -1), dx < 0 ? 1 : -1);
    if (el.closest('input, textarea, .map, .chips, .cinema__thumbs, .playlist__list, .cards, .rv__track, .tabs, .bk')) return;
    step(dx < 0 ? 1 : -1);
  }, { passive: true });

  function ripple(btn, e) {
    const r = btn.getBoundingClientRect();
    const s = Math.max(r.width, r.height);
    const el = document.createElement('span');
    el.className = 'ripple';
    el.style.cssText = 'width:' + s + 'px;height:' + s + 'px;left:' + (e.clientX - r.left - s / 2) + 'px;top:' + (e.clientY - r.top - s / 2) + 'px';
    btn.appendChild(el);
    setTimeout(() => el.remove(), 650);
  }

  /* ---------- появление элементов, заголовки по буквам, счётчики ---------- */
  function startReveal(p) {
    if (!p) return;
    if (!('IntersectionObserver' in window) || !document.documentElement.classList.contains('fx-anim')) {
      $$('.a-up, .js-split, .tile', p).forEach((el) => el.classList.add('is-in'));
      return;
    }
    if (!p._io) {
      p._io = new IntersectionObserver((entries) => {
        let n = 0;
        entries.forEach((en) => {
          if (!en.isIntersecting) return;
          const el = en.target;
          el.style.setProperty('--d', Math.min(n++, 8));
          el.classList.add('is-in');
          $$('.js-count', el).concat(el.classList.contains('js-count') ? [el] : []).forEach(countUp);
          p._io.unobserve(el);
        });
      }, { root: p, rootMargin: '0px 0px -6% 0px', threshold: 0.06 });
    }
    $$('.a-up:not(.is-in), .js-split:not(.is-in), .tile:not(.is-in)', p).forEach((el) => p._io.observe(el));
  }
  function resetReveal(p) {
    if (!p) return;
    if (p._io) p._io.disconnect();
    $$('.a-up.is-in, .js-split.is-in, .tile.is-in', p).forEach((el) => el.classList.remove('is-in'));
  }
  function splitText(el) {
    const t = el.textContent;
    el.setAttribute('aria-label', t);
    let i = 0;
    el.innerHTML = t.split(/(\s+)/).map((w) => (/^\s+$/.test(w) ? w : '<span class="w" aria-hidden="true">' + Array.from(w).map((ch) => '<span class="c" style="--i:' + i++ + '">' + esc(ch) + '</span>').join('') + '</span>')).join('');
    el.dataset.split = t;
  }
  function countUp(el) {
    const m = String(el.dataset.val || el.textContent).match(/^(\d+)(.*)$/);
    if (!m || !document.documentElement.classList.contains('fx-anim')) return;
    el.dataset.val = m[0];
    const target = +m[1], suffix = m[2], t0 = performance.now(), dur = 1400;
    (function f(now) {
      const k = Math.min(1, (now - t0) / dur), e = 1 - Math.pow(1 - k, 3);
      el.textContent = Math.round(target * e) + suffix;
      if (k < 1) requestAnimationFrame(f);
    })(t0);
  }

  /* ---------- экран загрузки: показывает реальный прогресс (шрифты, фото, расписание) ---------- */
  function runIntro() {
    const el = $('#intro');
    if (reduced || document.documentElement.classList.contains('no-intro')) { el.classList.add('is-gone'); return Promise.resolve(); }
    return new Promise((res) => {
      const steps = [['fonts', 'Шрифты'], ['hero', 'Фотографии'], ['data', 'Расписание']];
      const t0 = Date.now();
      let p = 0, finished = false;
      const tick = setInterval(() => {
        if (site().intro === false) return finish(true);
        const done = steps.filter((s) => LOAD[s[0]]).length;
        const goal = done === 3 ? 100 : done * 33 + 26;
        p += (goal - p) * (done === 3 ? 0.25 : 0.06);
        $('#introNum').textContent = Math.min(100, Math.round(p));
        $('#introBar').style.width = p + '%';
        const next = steps.find((s) => !LOAD[s[0]]);
        $('#introStep').textContent = next ? next[1] : 'Готово';
        const elapsed = Date.now() - t0;
        if ((done === 3 && p > 99 && elapsed > 900) || elapsed > 6000) finish();
      }, 50);
      function finish(fast) {
        if (finished) return;
        finished = true;
        clearInterval(tick);
        $('#introNum').textContent = 100;
        $('#introBar').style.width = '100%';
        setTimeout(() => {
          el.classList.add('is-done');
          setTimeout(() => el.classList.add('is-gone'), 1000);
          setTimeout(res, 250);
        }, fast ? 0 : 200);
      }
    });
  }
  const introDone = runIntro();

  /* =====================================================================
     ПРОФИЛЬ, ГЛАВНЫЙ ЭКРАН, «О МАСТЕРЕ»
     ===================================================================== */
  function renderProfile() {
    const p = S.settings.profile;
    const years = Math.max(1, new Date().getFullYear() - (+p.since || 2010));
    const vals = {
      fullName: p.firstName + ' ' + p.lastName, firstName: p.firstName, lastName: p.lastName, title: p.title, city: p.city,
      tagline: p.tagline, years: years + '+', yearsLabel: Y.plural(years, 'год', 'года', 'лет') + ' в профессии', priceNote: p.priceNote
    };
    $$('[data-bind]').forEach((el) => {
      const k = el.dataset.bind;
      let v = k.indexOf('text.') === 0 ? text(k.slice(5)) : vals[k];
      if (k === 'text.footer') v = v ? ' · ' + v : '';
      if (v === undefined) return;
      if (el.classList.contains('js-split')) { if (el.dataset.split !== v) { el.textContent = v; splitText(el); } }
      else if (el.classList.contains('js-count')) { if (el.dataset.val !== v) { el.dataset.val = v; el.textContent = v; } }
      else el.textContent = v;
    });
    $$('.js-split').forEach((el) => { if (!el.dataset.split) splitText(el); });
    setHero(p.heroPhoto);
    const about = $('#aboutImg');
    const src = p.aboutPhoto || Y.DEFAULT_ABOUT;
    about.dataset.fb = Y.imgFallback(src);
    if (about.getAttribute('src') !== Y.img(src, 900)) about.src = Y.img(src, 900);
    $('#aboutText').innerHTML = String(p.about || '').split(/\n+/).filter(Boolean).map((t) => '<p>' + esc(t) + '</p>').join('');
    $('#facts').innerHTML = (p.facts || []).map((f) => '<li>' + esc(f) + '</li>').join('');
    $('#awards').innerHTML = (p.awards || []).map((f) => '<li>' + esc(f) + '</li>').join('');
    $('#aboutTabs [data-tab="facts"]').hidden = !(p.facts || []).length;
    $('#aboutTabs [data-tab="awards"]').hidden = !(p.awards || []).length;
    const soc = socialLinks();
    $$('.js-socials').forEach((el) => (el.innerHTML = soc.map((s) => '<a class="social" href="' + esc(s[1]) + '" target="_blank" rel="noopener" aria-label="' + s[2] + '" title="' + s[2] + '">' + SOCIAL[s[0]] + '</a>').join('')));
  }
  $('#aboutTabs').addEventListener('click', (e) => {
    const b = e.target.closest('[data-tab]');
    if (!b) return;
    $$('#aboutTabs button').forEach((x) => x.classList.toggle('is-on', x === b));
    $$('#about .pane').forEach((x) => x.classList.toggle('is-on', x.dataset.pane === b.dataset.tab));
  });
  function socialLinks() {
    const p = S.settings.profile;
    const out = [];
    if (p.instagram) out.push(['instagram', 'https://instagram.com/' + String(p.instagram).replace(/^@|https?:\/\/(www\.)?instagram\.com\//g, ''), 'Instagram']);
    if (p.telegram) out.push(['telegram', tgUrl(p.telegram), 'Telegram']);
    if (p.vk) out.push(['vk', 'https://vk.com/' + String(p.vk).replace(/^https?:\/\/(vk\.com|vk\.ru)\//, ''), 'ВКонтакте']);
    return out;
  }
  const tgUrl = (t) => 'https://t.me/' + String(t).replace(/^@|https?:\/\/t\.me\//g, '');

  // Главное фото. Исходный портрет со старого сайта имеет белые поля — обрезаем их на лету.
  let heroKey = null;
  function setHero(photo) {
    const img = $('#heroImg');
    const key = photo ? Y.img(photo, 1600) : 'legacy';
    if (heroKey === key) return;
    heroKey = key;
    img.style.opacity = 0;
    const show = (src) => { img.onload = () => { img.style.opacity = 1; heroReadyRes(); }; img.onerror = heroReadyRes; img.src = src; };
    if (photo) { img.dataset.fb = Y.imgFallback(photo); show(key); return; }
    const im = new Image();
    im.crossOrigin = 'anonymous';
    im.onload = () => {
      try {
        const k = im.naturalWidth / 1142;
        const c = document.createElement('canvas');
        c.width = Math.round(865 * k);
        c.height = Math.round(1272 * k);
        c.getContext('2d').drawImage(im, 70 * k, 168 * k, c.width, c.height, 0, 0, c.width, c.height);
        c.toBlob((b) => show(b ? URL.createObjectURL(b) : Y.DEFAULT_HERO), 'image/jpeg', 0.92);
      } catch (e) { show(Y.DEFAULT_HERO); }
    };
    im.onerror = () => show(Y.DEFAULT_HERO);
    im.src = Y.DEFAULT_HERO;
  }

  // параллакс слоёв главного экрана: фото и текст движутся в разные стороны
  $('#home').addEventListener('mousemove', (e) => {
    if (!site().parallax || isMobile() || reduced) return;
    const x = e.clientX / window.innerWidth - 0.5, y = e.clientY / window.innerHeight - 0.5;
    $('#heroImg').style.setProperty('--px', (x * -22).toFixed(1) + 'px');
    $('#heroImg').style.setProperty('--py', (y * -14).toFixed(1) + 'px');
    $('#heroContent').style.setProperty('--tx', (x * 10).toFixed(1) + 'px');
    $('#heroContent').style.setProperty('--ty', (y * 8).toFixed(1) + 'px');
    dust.mouse(e.clientX, e.clientY);
  });

  // золотая пыль на главном экране
  const dust = (function () {
    const cv = $('#dust');
    const ctx = cv.getContext('2d');
    let parts = [], raf = 0, w = 0, h = 0, mx = -999, my = -999, running = false;
    function size() {
      const r = cv.getBoundingClientRect();
      const dpr = Math.min(2, window.devicePixelRatio || 1);
      w = r.width; h = r.height;
      cv.width = w * dpr; cv.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }
    function seed() {
      parts = Array.from({ length: isMobile() ? 22 : 40 }, () => ({ x: Math.random() * w, y: Math.random() * h, r: Math.random() * 1.4 + 0.4, vy: -(Math.random() * 0.22 + 0.05), ph: Math.random() * 6.28, sp: Math.random() * 0.02 + 0.006 }));
    }
    function frame() {
      raf = 0;
      if (!running || document.hidden) return;
      ctx.clearRect(0, 0, w, h);
      const n = parseInt(accentHex.slice(1), 16), rgb = (n >> 16) + ',' + ((n >> 8) & 255) + ',' + (n & 255);
      parts.forEach((p) => {
        p.ph += p.sp; p.y += p.vy; p.x += Math.sin(p.ph) * 0.18;
        const dx = p.x - mx, dy = p.y - my, d2 = dx * dx + dy * dy;
        if (d2 < 9000) { const f = (9000 - d2) / 9000; p.x += dx * 0.02 * f; p.y += dy * 0.02 * f; }
        if (p.y < -10) { p.y = h + 10; p.x = Math.random() * w; }
        ctx.beginPath();
        ctx.fillStyle = 'rgba(' + rgb + ',' + (0.35 + Math.sin(p.ph * 2) * 0.25).toFixed(2) + ')';
        ctx.arc(p.x, p.y, p.r, 0, 6.283);
        ctx.fill();
      });
      raf = requestAnimationFrame(frame);
    }
    return {
      start() {
        if (reduced || site().particles === false) return;
        running = true;
        size();
        if (!parts.length) seed();
        if (!raf) raf = requestAnimationFrame(frame);
      },
      stop(clear) { running = false; if (clear) ctx.clearRect(0, 0, cv.width, cv.height); },
      mouse(x, y) { const r = cv.getBoundingClientRect(); mx = x - r.left; my = y - r.top; },
      resize() { if (running) { size(); seed(); } }
    };
  })();
  window.addEventListener('resize', () => { dust.resize(); markNav(); renderPrices(); updateDots(); });
  document.addEventListener('visibilitychange', () => { if (!document.hidden && R.cur === 'home') dust.start(); });

  // 3D-наклон карточек (без свечения); карточка поднимается над соседями
  let tiltEl = null;
  function resetTilt() { if (tiltEl) { tiltEl.style.transform = ''; tiltEl.classList.remove('is-tilting'); tiltEl = null; } }
  document.addEventListener('mousemove', (e) => {
    if (!document.documentElement.classList.contains('fx-tilt')) return;
    const el = e.target.closest && e.target.closest('.tilt');
    if (tiltEl && tiltEl !== el) resetTilt();
    if (!el || el.closest('#adminRoot')) return;
    const r = el.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width, py = (e.clientY - r.top) / r.height;
    el.classList.add('is-tilting');
    el.style.transform = 'perspective(900px) rotateX(' + ((0.5 - py) * 12).toFixed(2) + 'deg) rotateY(' + ((px - 0.5) * 14).toFixed(2) + 'deg) translateZ(26px)';
    tiltEl = el;
  }, { passive: true });
  document.addEventListener('mouseleave', resetTilt);

  /* ---------- ближайшее окно ---------- */
  function renderNearest() {
    const el = $('#nearest');
    if (!S.loaded || S.error || S.serverOld || !site().bookingOn || !sectionOn('booking')) return (el.hidden = true);
    const f = Y.firstFree(minDur(), st());
    el.hidden = !f;
    if (f) $('#nearestValue').textContent = Y.cap(Y.fmtDateRel(f.date, S.tz)) + ', ' + f.time;
    fitSlot();
  }
  // подпись под «Записаться» растягивается по ширине заголовка кнопки
  function fitSlot() {
    const slot = $('#nearest'), main = slot && slot.parentElement && $('.book__main', slot.parentElement);
    if (!slot || slot.hidden || !main) return;
    slot.style.fontSize = '10px';
    const w = main.getBoundingClientRect().width, sw = slot.scrollWidth;
    if (sw > 0 && w > 0) slot.style.fontSize = Math.max(8, Math.min(16, 10 * w / sw)) + 'px';
  }
  window.addEventListener('resize', fitSlot);
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(fitSlot);

  /* =====================================================================
     ПОРТФОЛИО: слайдшоу с миниатюрами или сетка
     ===================================================================== */
  const C = { i: 0, playing: true, timer: 0, init: false };
  const galleryPhotos = () => (S.photos && S.photos.length ? S.photos : Y.DEFAULT_PHOTOS);
  function renderGallery(fade) {
    const all = galleryPhotos();
    const cats = all.map((p) => p.cat).filter((c, i, a) => c && a.indexOf(c) === i);
    if (G.filter !== 'Все' && cats.indexOf(G.filter) < 0) G.filter = 'Все';
    $('#galleryFilters').innerHTML = cats.length > 1
      ? ['Все'].concat(cats).map((c) => {
          const n = c === 'Все' ? all.length : all.filter((p) => p.cat === c).length;
          return '<button class="chip' + (c === G.filter ? ' is-on' : '') + '" data-cat="' + esc(c) + '" role="tab" aria-selected="' + (c === G.filter) + '">' + esc(c) + '<sup>' + n + '</sup></button>';
        }).join('')
      : '';
    G.list = G.filter === 'Все' ? all : all.filter((p) => p.cat === G.filter);
    $$('#gview button').forEach((b) => b.classList.toggle('is-on', b.dataset.view === G.view));
    const cinema = G.view === 'cinema';
    $('#cinema').hidden = !cinema;
    $('#gallery').hidden = cinema;
    if (!C.init) { C.init = true; C.playing = site().galleryAutoplay !== false; }
    if (cinema) {
      $('#galleryMore').hidden = true;
      renderThumbs();
      if (C.i >= G.list.length) C.i = 0;
      showSlide(C.i, 0, true);
      return;
    }
    if (G.shown < G.page) G.shown = G.page;
    const html = G.list.slice(0, G.shown).map((p, i) =>
      '<figure class="tile tilt" data-i="' + i + '">' +
        '<img src="' + esc(Y.img(p, 800)) + '" data-fb="' + esc(Y.imgFallback(p)) + '" alt="' + esc(p.caption || p.cat || 'Работа мастера') + '" loading="lazy" decoding="async">' +
        (p.caption || p.cat ? '<figcaption class="tile__cap">' + esc(p.caption || p.cat) + '</figcaption>' : '') +
      '</figure>'
    ).join('');
    const box = $('#gallery');
    const put = () => { box.innerHTML = html; if (R.cur === 'works') startReveal(panel('works')); };
    if (fade) { box.classList.add('is-fading'); setTimeout(() => { put(); box.classList.remove('is-fading'); }, 300); }
    else put();
    $('#galleryMore').hidden = G.list.length <= G.shown;
  }
  function renderThumbs() {
    $('#cThumbs').innerHTML = G.list.map((p, i) =>
      '<button class="cthumb' + (i === C.i ? ' is-on' : '') + '" data-ci="' + i + '" aria-label="Фото ' + (i + 1) + '"><img src="' + esc(Y.img(p, 180)) + '" data-fb="' + esc(Y.imgFallback(p)) + '" alt="" loading="lazy" decoding="async"></button>'
    ).join('');
    $('#cTotal').textContent = Y.pad(G.list.length);
  }
  function showSlide(i, dir, instant) {
    const n = G.list.length;
    if (!n) { $('#cSlides').innerHTML = ''; return; }
    i = ((i % n) + n) % n;
    const same = i === C.i && $('#cSlides .cslide.is-shown');
    C.i = i;
    const p = G.list[i];
    const box = $('#cSlides');
    if (!same || instant) {
      const olds = $$('.cslide', box);
      olds.slice(0, -1).forEach((o) => o.remove());
      const old = olds[olds.length - 1];
      if (!(old && old.dataset.src === Y.img(p, 1600) && instant)) {
        const el = document.createElement('div');
        el.className = 'cslide' + (dir > 0 ? ' enter-next' : dir < 0 ? ' enter-prev' : '');
        el.dataset.src = Y.img(p, 1600);
        el.style.setProperty('--dur', ((+site().galleryInterval || 5) + 2) + 's');
        el.innerHTML = '<img class="cslide__bg" src="' + esc(Y.img(p, 400)) + '" alt="" aria-hidden="true">' +
          '<img class="cslide__img" src="' + esc(Y.img(p, 1600)) + '" data-fb="' + esc(Y.imgFallback(p)) + '" alt="' + esc(p.caption || p.cat || 'Работа мастера') + '">';
        box.appendChild(el);
        let done = false;
        const reveal = () => {
          if (done) return;
          done = true;
          void el.offsetWidth;
          el.classList.remove('enter-next', 'enter-prev');
          el.classList.add('is-shown');
          if (old) { old.classList.remove('is-shown'); old.classList.add('is-out'); setTimeout(() => old.remove(), 1150); }
        };
        const img = $('.cslide__img', el);
        if (img.complete) requestAnimationFrame(reveal);
        else { img.addEventListener('load', () => requestAnimationFrame(reveal)); img.addEventListener('error', reveal); setTimeout(reveal, 1500); }
      }
    }
    $('#cNum').textContent = Y.pad(i + 1);
    $('#cCap').textContent = p.caption || p.cat || '';
    $$('#cThumbs .cthumb').forEach((t) => t.classList.toggle('is-on', +t.dataset.ci === i));
    const th = $('#cThumbs .cthumb.is-on'), strip = $('#cThumbs');
    if (th) strip.scrollTo({ left: th.offsetLeft - strip.clientWidth / 2 + th.clientWidth / 2, behavior: instant ? 'auto' : 'smooth' });
    const nx = G.list[(i + 1) % n];
    if (nx) new Image().src = Y.img(nx, 1600);
    cinemaTimer();
  }
  function cinemaTimer() {
    clearTimeout(C.timer);
    const cin = $('#cinema');
    cin.classList.toggle('is-playing', C.playing);
    const bar = $('#cProgress');
    bar.style.animation = 'none';
    void bar.offsetWidth;
    bar.style.animation = '';
    cin.style.setProperty('--dur', (+site().galleryInterval || 5) + 's');
    if (!C.playing || G.view !== 'cinema' || R.cur !== 'works' || !$('#lightbox').hidden || document.hidden || cin.classList.contains('is-paused')) return;
    C.timer = setTimeout(() => showSlide(C.i + 1, 1), (+site().galleryInterval || 5) * 1000);
  }
  $('#cinema').addEventListener('click', (e) => {
    const t = e.target.closest('[data-c], [data-ci]');
    if (t && t.dataset.ci != null) return showSlide(+t.dataset.ci, +t.dataset.ci > C.i ? 1 : -1);
    if (t) {
      const a = t.dataset.c;
      if (a === 'prev') showSlide(C.i - 1, -1);
      if (a === 'next') showSlide(C.i + 1, 1);
      if (a === 'play') { C.playing = !C.playing; cinemaTimer(); }
      if (a === 'full') lbOpen(C.i);
      return;
    }
    if (e.target.closest('.cinema__stage')) lbOpen(C.i);
  });
  $('#cStage').addEventListener('mouseenter', () => { $('#cinema').classList.add('is-paused'); clearTimeout(C.timer); });
  $('#cStage').addEventListener('mouseleave', () => { $('#cinema').classList.remove('is-paused'); cinemaTimer(); });
  document.addEventListener('visibilitychange', () => { if (!document.hidden) cinemaTimer(); });
  $('#gview').addEventListener('click', (e) => {
    const b = e.target.closest('[data-view]');
    if (!b || b.dataset.view === G.view) return;
    G.view = b.dataset.view;
    try { sessionStorage.setItem('y_gview', G.view); } catch (err) {}
    renderGallery();
    startReveal(panel('works'));
  });
  $('#galleryFilters').addEventListener('click', (e) => {
    const b = e.target.closest('.chip');
    if (!b || b.dataset.cat === G.filter) return;
    G.filter = b.dataset.cat;
    G.shown = G.page;
    C.i = 0;
    renderGallery(true);
  });
  $('#galleryMore').addEventListener('click', () => { G.shown += G.page; renderGallery(); });

  /* лайтбокс */
  let lbI = 0;
  const lb = $('#lightbox');
  function lbShow(i) {
    const n = G.list.length;
    lbI = (i + n) % n;
    const p = G.list[lbI];
    const img = $('#lbImg');
    img.dataset.fb = Y.imgFallback(p);
    img.src = Y.img(p, 1800);
    img.style.animation = 'none'; void img.offsetWidth; img.style.animation = '';
    img.alt = p.caption || p.cat || '';
    $('#lbCap').textContent = (p.caption || p.cat || '') + '   ' + (lbI + 1) + ' / ' + n;
  }
  function lbOpen(i) { lb.hidden = false; clearTimeout(C.timer); lbShow(i); }
  function lbClose() {
    lb.hidden = true;
    if (G.view === 'cinema' && lbI !== C.i) showSlide(lbI, lbI > C.i ? 1 : -1); else cinemaTimer();
  }
  $('#gallery').addEventListener('click', (e) => { const f = e.target.closest('.tile'); if (f) lbOpen(+f.dataset.i); });
  lb.addEventListener('click', (e) => {
    const a = e.target.closest('[data-lb]');
    if (a) { a.dataset.lb === 'close' ? lbClose() : lbShow(lbI + (a.dataset.lb === 'next' ? 1 : -1)); }
    else if (e.target === lb || e.target.classList.contains('lightbox__fig')) lbClose();
  });
  let lbX = null;
  lb.addEventListener('touchstart', (e) => (lbX = e.touches[0].clientX), { passive: true });
  lb.addEventListener('touchend', (e) => {
    if (lbX == null) return;
    const dx = e.changedTouches[0].clientX - lbX;
    if (Math.abs(dx) > 50) lbShow(lbI + (dx < 0 ? 1 : -1));
    lbX = null;
  });
  document.addEventListener('keydown', (e) => {
    if (document.body.classList.contains('adm-lock')) return;
    if (!lb.hidden) {
      if (e.key === 'Escape') lbClose();
      if (e.key === 'ArrowRight') lbShow(lbI + 1);
      if (e.key === 'ArrowLeft') lbShow(lbI - 1);
      return;
    }
    if (e.key === 'Escape') { closeModal(); closeSheet(); closePlaylist(); }
    if (R.cur === 'works' && G.view === 'cinema' && $('#modal').hidden && !/INPUT|TEXTAREA/.test(document.activeElement.tagName)) {
      if (e.key === 'ArrowRight') showSlide(C.i + 1, 1);
      if (e.key === 'ArrowLeft') showSlide(C.i - 1, -1);
    }
  });

  /* =====================================================================
     УСЛУГИ: вкладки категорий, карточки страницами — без прокрутки
     ===================================================================== */
  function groupByCat(list) {
    const groups = [];
    list.forEach((s) => {
      const c = s.cat || 'Услуги';
      let g = groups.find((x) => x.cat === c);
      if (!g) groups.push((g = { cat: c, items: [] }));
      g.items.push(s);
    });
    return groups;
  }
  const PR = { cat: null, page: 0 };
  function renderPrices() {
    const groups = groupByCat(S.services);
    if (!groups.length) return;
    if (!PR.cat || !groups.some((g) => g.cat === PR.cat)) { PR.cat = groups[0].cat; PR.page = 0; }
    $('#priceTabs').innerHTML = groups.length > 1 ? groups.map((g) => '<button class="chip' + (g.cat === PR.cat ? ' is-on' : '') + '" data-pcat="' + esc(g.cat) + '" role="tab">' + esc(g.cat) + '<sup>' + g.items.length + '</sup></button>').join('') : '';
    const items = groups.find((g) => g.cat === PR.cat).items;
    const per = isMobile() ? 99 : 6;
    const pages = Math.max(1, Math.ceil(items.length / per));
    PR.page = Math.min(PR.page, pages - 1);
    const canBook = site().bookingOn && sectionOn('booking');
    $('#priceGrid').innerHTML = items.slice(PR.page * per, PR.page * per + per).map((s, i) =>
      '<article class="svc-card tilt" style="--i:' + i + '">' +
        '<span class="svc-card__icon">' + Y.icon(s.icon) + '</span>' +
        '<h4>' + esc(s.name) + '</h4><p>' + esc(s.desc || '') + '</p>' +
        '<div class="svc-card__foot"><div><div class="svc-card__price">' + Y.fmtPrice(s.priceFrom, s.priceTo) + '</div><div class="svc-card__dur">' + Y.fmtDur(s.duration) + (s.note ? ' · ' + esc(s.note) : '') + '</div></div>' +
        (canBook ? '<button class="svc-card__book" type="button" data-book="' + esc(s.id) + '">Записаться</button>' : '') + '</div>' +
      '</article>'
    ).join('');
    $('#pricePager').hidden = pages < 2;
    $('#pricePage').textContent = (PR.page + 1) + ' / ' + pages;
  }
  $('#priceTabs').addEventListener('click', (e) => {
    const b = e.target.closest('[data-pcat]');
    if (!b || b.dataset.pcat === PR.cat) return;
    PR.cat = b.dataset.pcat;
    PR.page = 0;
    renderPrices();
  });
  $('#pricePager').addEventListener('click', (e) => {
    const b = e.target.closest('[data-pp]');
    if (!b) return;
    PR.page = Math.max(0, PR.page + +b.dataset.pp);
    renderPrices();
  });
  $('#priceGrid').addEventListener('click', (e) => {
    const b = e.target.closest('[data-book]');
    if (!b) return;
    B.ids = [b.dataset.book];
    B.time = null;
    B.step = 2;
    renderBooking();
    go('booking');
  });

  /* =====================================================================
     ОТЗЫВЫ: карусель + отзыв по ссылке из письма
     ===================================================================== */
  function renderReviews() {
    const list = allReviews();
    const box = $('#reviewsList');
    if (!list.length) { box.innerHTML = ''; $('#rvScore').innerHTML = ''; return; }
    const avg = list.reduce((a, r) => a + (+r.rating || 5), 0) / list.length;
    $('#rvScore').innerHTML = '<b>' + avg.toFixed(1).replace('.', ',') + '</b><span>' + '★'.repeat(Math.round(avg)) + '</span><small>' + list.length + ' ' + Y.plural(list.length, 'отзыв', 'отзыва', 'отзывов') + '</small>';
    box.innerHTML = list.map((r, i) => {
      const long = String(r.text || '').length > 240;
      return '<article class="review tilt"><div class="review__stars">' + '★'.repeat(Math.max(1, Math.min(5, +r.rating || 5))) + '</div>' +
        '<p class="review__text">' + esc(r.text) + '</p>' + (long ? '<button class="review__more" data-rvi="' + i + '">Читать полностью</button>' : '') +
        '<div class="review__who">' + esc(r.name) + (r.service || r.date ? '<small>' + esc([r.service, r.date].filter(Boolean).join(' · ')) + '</small>' : '') +
        (r.source === 'site' ? '<span class="review__src"><i></i>Подтверждённый визит</span>' : '') + '</div></article>';
    }).join('');
    updateDots();
  }
  function rvPer() { const t = $('#reviewsList'); const c = t.firstElementChild; return c ? Math.max(1, Math.round(t.clientWidth / (c.clientWidth + 16))) : 1; }
  function updateDots() {
    const t = $('#reviewsList');
    const n = t.children.length;
    if (!n) return;
    const pages = Math.max(1, Math.ceil(n / rvPer()));
    const cur = Math.round(t.scrollLeft / Math.max(1, t.clientWidth));
    $('#rvDots').innerHTML = pages > 1 ? Array.from({ length: pages }, (_, i) => '<i data-rvp="' + i + '" class="' + (i === cur ? 'is-on' : '') + '"></i>').join('') : '';
    $('.rv__nav').hidden = pages < 2;
  }
  $('#reviewsList').addEventListener('scroll', () => { clearTimeout(updateDots.t); updateDots.t = setTimeout(updateDots, 80); }, { passive: true });
  $('#reviewsBox').addEventListener('click', (e) => {
    const t = $('#reviewsList');
    const nav = e.target.closest('[data-rv]');
    if (nav) return t.scrollBy({ left: +nav.dataset.rv * t.clientWidth, behavior: 'smooth' });
    const dot = e.target.closest('[data-rvp]');
    if (dot) return t.scrollTo({ left: +dot.dataset.rvp * t.clientWidth, behavior: 'smooth' });
    const more = e.target.closest('[data-rvi]');
    if (more) {
      const r = allReviews()[+more.dataset.rvi];
      modal('<div class="review__stars">' + '★'.repeat(+r.rating || 5) + '</div><h3 style="margin-top:10px">' + esc(r.name) + '</h3><p style="color:var(--muted);font-size:13px">' + esc([r.service, r.date].filter(Boolean).join(' · ')) + '</p><div class="modal__text">' + esc(r.text) + '</div>');
    }
  });
  async function checkReviewLink() {
    const m = location.hash.match(/^#review=([^.]+)\.(.+)$/);
    if (!m) return;
    const id = m[1], token = m[2];
    history.replaceState(null, '', location.pathname + location.search);
    modal('<h3>Отзыв о визите</h3><p>Загружаем…</p>');
    try {
      const r = await Y.api.call('reviewInfo', { id, token });
      if (r.reviewed) return modal('<div class="done__icon">' + svg(IC.check) + '</div><h3>Спасибо!</h3><p>Вы уже оставили отзыв об этом визите.</p>');
      let rating = 5;
      modal('<h3>Как прошёл визит?</h3><p>' + esc(r.booking.services) + ' · ' + Y.fmtDate(r.booking.date) + '</p>' +
        '<div class="stars-pick" id="rvStars">' + [1, 2, 3, 4, 5].map((n) => '<button type="button" data-star="' + n + '" class="is-on" aria-label="' + n + '">★</button>').join('') + '</div>' +
        '<form class="form" id="rvForm"><div class="field"><input id="rv_name" placeholder=" " value="' + esc(r.booking.name) + '" maxlength="60"><label for="rv_name">Ваше имя</label></div>' +
        '<div class="field"><textarea id="rv_text" placeholder=" " maxlength="1500" required></textarea><label for="rv_text">Ваш отзыв</label></div>' +
        '<div class="form-error" id="rvErr" hidden></div>' +
        '<button class="btn btn--solid btn--block" type="submit" id="rvSend"><span>Отправить отзыв</span></button></form>');
      $('#rvStars').addEventListener('click', (e) => {
        const b = e.target.closest('[data-star]');
        if (!b) return;
        rating = +b.dataset.star;
        $$('#rvStars button').forEach((x) => x.classList.toggle('is-on', +x.dataset.star <= rating));
      });
      $('#rvForm').addEventListener('submit', async (e) => {
        e.preventDefault();
        const txt = $('#rv_text').value.trim();
        if (txt.length < 3) { $('#rvErr').hidden = false; $('#rvErr').textContent = 'Напишите пару слов о визите'; return; }
        $('#rvSend').classList.add('is-loading');
        try {
          await Y.api.call('submitReview', { id, token, rating, text: txt, name: $('#rv_name').value.trim() });
          modal('<div class="done__icon">' + svg(IC.check) + '</div><h3>Спасибо за отзыв!</h3><p>Он появится на сайте после проверки мастером.</p><div class="modal__actions"><button class="btn btn--solid btn--sm" data-modal-close><span>Хорошо</span></button></div>');
        } catch (err) { $('#rvSend').classList.remove('is-loading'); $('#rvErr').hidden = false; $('#rvErr').textContent = err.message; }
      });
    } catch (err) { modal('<h3>Не получилось</h3><p>' + esc(err.message) + '</p>'); }
  }

  /* =====================================================================
     ОНЛАЙН-ЗАПИСЬ: 1 услуги → 2 дата и время → 3 контакты
     ===================================================================== */
  function renderBooking() {
    const box = $('#book');
    const p = S.settings.profile;
    if (B.step === 3 && $('#bForm')) saveForm();
    if (!S.loaded) { box.innerHTML = '<div class="bk"><div class="empty" style="margin:24px"><span class="spinner"></span><b>Загружаем свободное время…</b>Обычно это занимает несколько секунд.</div></div>'; return; }
    if (S.error || !site().bookingOn || S.serverOld) {
      box.innerHTML = '<div class="bk"><div class="empty" style="margin:24px"><b>' + (S.error || S.serverOld ? 'Онлайн-запись временно недоступна' : esc(text('bookingOff'))) + '</b>' +
        'Позвоните или напишите — запишу вас вручную.<br><a class="btn btn--gold btn--sm" href="tel:+' + Y.phoneDigits(p.phone) + '"><span>' + esc(p.phone) + '</span></a></div></div>';
      return;
    }
    if (!$('#bkMain')) box.innerHTML = '<div class="bk" id="bk"><div class="bk__steps" id="bkSteps"></div><div class="bk__body"><div class="bk__main" id="bkMain"></div><aside class="bk__aside" id="bkAside"></aside></div></div>';
    const names = ['Услуги', 'Дата и время', 'Контакты'];
    $('#bkSteps').innerHTML = names.map((n, i) => '<button type="button" class="bk__step' + (B.step === i + 1 ? ' is-on' : B.step > i + 1 ? ' is-done' : '') + '" data-step="' + (i + 1) + '"' + (B.step > i + 1 ? '' : ' disabled') + '><span>' + (B.step > i + 1 ? '✓' : i + 1) + '</span><em>' + n + '</em></button>').join('');
    if (B.step === 1) stepServices();
    else if (B.step === 2) stepWhen();
    else stepContacts();
    renderAside();
  }
  function stepServices() {
    const cats = S.services.map((s) => s.cat).filter((c, i, a) => c && a.indexOf(c) === i);
    const useTabs = S.services.length > 8 && cats.length > 1;
    if (useTabs && B.cat !== 'Все' && cats.indexOf(B.cat) < 0) B.cat = 'Все';
    const list = useTabs && B.cat !== 'Все' ? S.services.filter((s) => s.cat === B.cat) : S.services;
    $('#bkMain').innerHTML = '<div class="bk__fade"><h3 class="bk__h">Что будем делать?</h3><p class="bk__hint">Можно выбрать несколько услуг — время визита посчитается само.</p>' +
      (useTabs ? '<div class="chips">' + ['Все'].concat(cats).map((c) => '<button class="chip' + (c === B.cat ? ' is-on' : '') + '" data-bcat="' + esc(c) + '">' + esc(c) + '</button>').join('') + '</div>' : '') +
      '<div class="bk-grid">' + list.map((s) => {
        const on = B.ids.indexOf(String(s.id)) >= 0;
        return '<button type="button" class="svc-opt' + (on ? ' is-on' : '') + '" data-svc="' + esc(s.id) + '" aria-pressed="' + on + '">' + Y.icon(s.icon) + '<b>' + esc(s.name) + '</b><small>' + Y.fmtPrice(s.priceFrom, s.priceTo) + ' · ' + Y.fmtDur(s.duration) + '</small><span class="svc-opt__check">' + svg(IC.check) + '</span></button>';
      }).join('') + '</div>' +
      '<div class="bk__nav"><span></span><button type="button" class="btn btn--solid btn--cta" data-to="2"' + (B.ids.length ? '' : ' disabled') + '><span>Выбрать время</span>' + svg(IC.arrow) + '</button></div></div>';
  }
  function stepWhen() {
    ensureDate();
    $('#bkMain').innerHTML = '<div class="bk__fade"><h3 class="bk__h">Дата и время</h3><p class="bk__hint">Визит ≈ ' + Y.fmtDur(totalDur()) + '. Зачёркнутое время уже занято.</p>' +
      '<div class="bk-when"><div class="cal" id="bCal"></div><div><div class="times__label" id="bDay" style="margin-bottom:12px"></div><div id="bTimes"></div></div></div>' +
      '<div class="bk__nav"><button type="button" class="link-btn" data-to="1">' + svg(IC.back) + 'Назад</button><button type="button" class="btn btn--solid btn--cta" data-to="3" id="toContacts"' + (B.time ? '' : ' disabled') + '><span>Далее</span>' + svg(IC.arrow) + '</button></div></div>';
    renderCal();
    renderTimes();
  }
  function stepContacts() {
    const f = B.form;
    const contacts = ['Звонок', 'SMS', 'Telegram', 'E-mail'];
    $('#bkMain').innerHTML = '<div class="bk__fade"><h3 class="bk__h">Ваши контакты</h3><p class="bk__hint">На этот номер или e-mail придёт подтверждение записи.</p>' +
      '<form class="bk-form" id="bForm" novalidate>' +
        '<div class="field"><input id="f_name" name="name" type="text" placeholder=" " autocomplete="name" maxlength="80" value="' + esc(f.name || '') + '"><label for="f_name">Имя и фамилия</label></div>' +
        '<div class="field"><input id="f_phone" name="phone" type="tel" placeholder=" " autocomplete="tel" inputmode="tel" value="' + esc(f.phone || '') + '"><label for="f_phone">Телефон</label></div>' +
        '<div class="field full"><input id="f_email" name="email" type="email" placeholder=" " autocomplete="email" inputmode="email" value="' + esc(f.email || '') + '"><label for="f_email">E-mail для подтверждения (необязательно)</label></div>' +
        '<div class="full"><div class="seg-label">Как удобнее связаться?</div><div class="seg" id="bContact">' + contacts.map((c) => '<button type="button" data-c="' + c + '" class="' + (B.contact === c ? 'is-on' : '') + '">' + c + '</button>').join('') + '</div></div>' +
        '<div class="field full"><textarea id="f_comment" name="comment" placeholder=" " maxlength="1000">' + esc(f.comment || '') + '</textarea><label for="f_comment">Комментарий: пожелания, длина волос</label></div>' +
        '<input class="hp" type="text" name="website" tabindex="-1" autocomplete="off" aria-hidden="true">' +
        '<label class="check full"><input type="checkbox" name="agree"' + (f.agree !== false ? ' checked' : '') + '><span>Согласен(на) на обработку персональных данных по <button type="button" data-modal="privacy">политике конфиденциальности</button></span></label>' +
        '<div class="form-error full" id="bErr"' + (B.err ? '' : ' hidden') + '>' + esc(B.err) + '</div>' +
      '</form>' +
      '<div class="bk__nav"><button type="button" class="link-btn" data-to="2">' + svg(IC.back) + 'Назад</button><button type="button" class="btn btn--solid btn--cta" id="bSubmit"><span>Записаться</span>' + svg(IC.check) + '</button></div></div>';
    const ph = $('#f_phone');
    ph.addEventListener('focus', () => { if (!ph.value) ph.value = '+7 '; });
    ph.addEventListener('blur', () => { if (ph.value.trim() === '+7') ph.value = ''; });
    ph.addEventListener('input', () => { ph.value = maskPhone(ph.value) || '+7 '; });
    $('#bForm').addEventListener('submit', (e) => { e.preventDefault(); submit(); });
  }
  function saveForm() {
    const f = $('#bForm');
    if (!f) return;
    const fd = new FormData(f);
    B.form = { name: fd.get('name'), phone: fd.get('phone'), email: fd.get('email'), comment: fd.get('comment'), agree: !!fd.get('agree'), website: fd.get('website') };
  }
  function renderAside() {
    const list = chosen();
    const from = list.reduce((a, s) => a + (+s.priceFrom || 0), 0);
    const to = list.reduce((a, s) => a + (+s.priceTo || +s.priceFrom || 0), 0);
    $('#bkAside').innerHTML = '<p class="sum__title">Ваша запись</p><div class="sum">' +
      '<div><span>Услуги</span><b>' + (list.length ? esc(list.map((s) => s.name).join(', ')) : '—') + '</b></div>' +
      '<div><span>Когда</span><b>' + (B.time ? Y.cap(Y.fmtDate(B.date, true)) + ', ' + B.time : '—') + '</b></div>' +
      (list.length ? '<div><span>Длительность</span><b>' + Y.fmtDur(totalDur()) + '</b></div>' : '') + '</div>' +
      '<div class="sum sum__total"><div><span>Итого</span><b>' + (list.length ? (to > from ? Y.fmtMoney(from) + '–' + Y.fmtMoney(to) : Y.fmtMoney(from)) + ' ₽' : '—') + '</b></div></div>';
  }
  function dayState(d) {
    const today = Y.now(S.tz).date;
    const hz = +S.settings.schedule.horizon || 30;
    if (d < today) return 'past';
    if (Y.dayIndex(d) - Y.dayIndex(today) >= hz) return 'out';
    const r = Y.daySlots(d, totalDur(), st());
    if (!r.open) return 'off';
    if (r.free) return 'free';
    if (r.slots.every((s) => s.status === 'past')) return 'past';
    return 'full';
  }
  function ensureDate() {
    const today = Y.now(S.tz).date;
    if (!B.date || dayState(B.date) !== 'free') {
      const hz = +S.settings.schedule.horizon || 30;
      let found = null;
      for (let i = 0; i < hz && !found; i++) { const d = Y.addDays(today, i); if (dayState(d) === 'free') found = d; }
      if (!B.date || found) B.date = found || today;
    }
    B.month = B.date.slice(0, 7);
  }
  function shiftMonth(d) {
    const [y, m] = B.month.split('-').map(Number);
    const nd = new Date(y, m - 1 + d, 1);
    const key = nd.getFullYear() + '-' + Y.pad(nd.getMonth() + 1);
    const today = Y.now(S.tz).date;
    const last = Y.addDays(today, (+S.settings.schedule.horizon || 30) - 1);
    if (key < today.slice(0, 7) || key > last.slice(0, 7)) return;
    B.month = key;
    renderCal();
  }
  function renderCal() {
    const [y, m] = B.month.split('-').map(Number);
    const offset = (new Date(y, m - 1, 1).getDay() + 6) % 7;
    const days = new Date(y, m, 0).getDate();
    const today = Y.now(S.tz).date;
    const last = Y.addDays(today, (+S.settings.schedule.horizon || 30) - 1);
    let cells = '';
    for (let i = 0; i < offset; i++) cells += '<span></span>';
    for (let d = 1; d <= days; d++) {
      const key = B.month + '-' + Y.pad(d);
      const s = dayState(key);
      const lbl = Y.fmtDate(key, true) + ': ' + ({ free: 'есть свободное время', full: 'всё занято', off: 'выходной', past: 'недоступно', out: 'запись ещё не открыта' })[s];
      cells += '<button type="button" class="cal__day' + (key === B.date ? ' is-on' : '') + (key === today ? ' is-today' : '') + '" data-date="' + key + '" data-s="' + s + '" aria-label="' + lbl + '" title="' + lbl + '"' + (s === 'free' || s === 'full' ? '' : ' disabled') + '>' + d + '</button>';
    }
    $('#bCal').innerHTML =
      '<div class="cal__head"><span class="cal__month">' + Y.MONTHS_NOM[m - 1] + ' ' + y + '</span><span class="cal__nav">' +
        '<button type="button" class="rbtn" data-month="-1" aria-label="Предыдущий месяц"' + (B.month <= today.slice(0, 7) ? ' disabled' : '') + '>' + svg(IC.left) + '</button>' +
        '<button type="button" class="rbtn" data-month="1" aria-label="Следующий месяц"' + (B.month >= last.slice(0, 7) ? ' disabled' : '') + '>' + svg(IC.right) + '</button></span></div>' +
      '<div class="cal__grid">' + ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'].map((w) => '<span class="cal__wd">' + w + '</span>').join('') + cells + '</div>';
  }
  function renderTimes() {
    const r = Y.daySlots(B.date, totalDur(), st());
    $('#bDay').textContent = Y.cap(Y.fmtDate(B.date, true));
    const visible = r.slots.filter((s) => s.status !== 'past');
    if (B.time && !visible.some((s) => s.time === B.time && s.status === 'free')) B.time = null;
    let html;
    if (!r.open || !r.free) {
      const hz = +S.settings.schedule.horizon || 30;
      let next = null;
      for (let i = 1; i < hz && !next; i++) { const d = Y.addDays(B.date, i); if (dayState(d) === 'free') next = d; }
      html = '<div class="empty"><b>' + (!r.open ? 'В этот день мастер не работает' : 'На этот день всё занято') + '</b>' +
        (next ? '<button type="button" class="btn btn--line btn--sm" data-date="' + next + '"><span>Ближайшее: ' + Y.fmtDate(next, true) + '</span></button>' : 'Позвоните — постараюсь найти время.') + '</div>';
    } else {
      const title = { busy: 'Занято', short: 'Выбранные услуги не помещаются до следующей записи', free: 'Свободно' };
      html = '<div class="times__grid">' + visible.map((s) => '<button type="button" class="time' + (s.time === B.time ? ' is-on' : '') + '" data-time="' + s.time + '" data-s="' + s.status + '" title="' + title[s.status] + '">' + s.time + '</button>').join('') + '</div>' +
        '<div class="legend"><span><i></i>свободно</span><span><i class="l-busy"></i>занято</span><span><i class="l-short"></i>не хватит времени</span></div>';
    }
    $('#bTimes').innerHTML = html;
    const btn = $('#toContacts');
    if (btn) btn.disabled = !B.time;
  }
  function maskPhone(v) {
    let d = v.replace(/\D/g, '');
    if (!d) return '';
    if (d[0] === '8') d = '7' + d.slice(1);
    if (d[0] !== '7') d = '7' + d;
    d = d.slice(0, 11);
    let out = '+7';
    if (d.length > 1) out += ' (' + d.slice(1, 4);
    if (d.length >= 4) out += ')';
    if (d.length > 4) out += ' ' + d.slice(4, 7);
    if (d.length > 7) out += '-' + d.slice(7, 9);
    if (d.length > 9) out += '-' + d.slice(9, 11);
    return out;
  }
  function toStep(n) {
    if (B.step === 3) saveForm();
    if (n >= 2 && !B.ids.length) n = 1;
    if (n === 3 && !B.time) n = 2;
    B.step = n;
    B.err = '';
    renderBooking();
  }
  $('#book').addEventListener('click', (e) => {
    const t = e.target;
    const to = t.closest('[data-to]');
    if (to) return toStep(+to.dataset.to);
    const stp = t.closest('.bk__step.is-done');
    if (stp) return toStep(+stp.dataset.step);
    const bc = t.closest('[data-bcat]');
    if (bc) { B.cat = bc.dataset.bcat; return stepServices(); }
    const svc = t.closest('[data-svc]');
    if (svc) {
      const id = svc.dataset.svc;
      const i = B.ids.indexOf(id);
      i >= 0 ? B.ids.splice(i, 1) : B.ids.push(id);
      B.time = null;
      svc.classList.toggle('is-on', i < 0);
      $('[data-to="2"]', $('#bkMain')).disabled = !B.ids.length;
      renderAside();
      return;
    }
    const mo = t.closest('[data-month]');
    if (mo) return shiftMonth(+mo.dataset.month);
    const d = t.closest('[data-date]');
    if (d) { B.date = d.dataset.date; B.month = B.date.slice(0, 7); B.time = null; renderCal(); renderTimes(); renderAside(); return; }
    const tm = t.closest('.time');
    if (tm) {
      if (tm.dataset.s !== 'free') return toast(tm.dataset.s === 'busy' ? 'Это время уже занято' : 'Услуги не помещаются до следующей записи — выберите время раньше или другой день');
      B.time = tm.dataset.time;
      $$('.time', $('#bTimes')).forEach((x) => x.classList.toggle('is-on', x === tm));
      $('#toContacts').disabled = false;
      renderAside();
      return;
    }
    const c = t.closest('#bContact [data-c]');
    if (c) {
      B.contact = c.dataset.c;
      $$('#bContact button').forEach((x) => x.classList.toggle('is-on', x === c));
      if (B.contact === 'E-mail') $('#f_email').focus();
      return;
    }
    if (t.closest('#bSubmit')) submit();
  });
  function setErr(msg) {
    B.err = msg || '';
    const el = $('#bErr');
    if (!el) return;
    el.textContent = B.err;
    el.hidden = !B.err;
  }

  // Ожидание ответа: плавный «живой» прогресс, подсказки и мини-игра «поймай искры»
  function startWait() {
    const bk = $('#bk');
    const w = document.createElement('div');
    w.className = 'bwait';
    w.innerHTML = '<div class="bwait__num" id="wNum">0</div><div class="bwait__bar"><i id="wBar"></i></div><div class="bwait__msg" id="wMsg">Проверяем свободное время</div><div class="bwait__game" id="wGame">Пока ждём — поймайте волшебные искры ✦ <b id="wScore">0</b></div>';
    bk.appendChild(w);
    const msgs = ['Проверяем свободное время', 'Бронируем окно', 'Сохраняем запись', 'Сообщаем мастеру', 'Почти готово'];
    let p = 0, mi = 0, score = 0;
    const iv = setInterval(() => {
      p += (93 - p) * 0.03;
      $('#wNum', w).textContent = Math.round(p);
      $('#wBar', w).style.width = p + '%';
    }, 100);
    const mv = setInterval(() => {
      mi = Math.min(msgs.length - 1, mi + 1);
      const m = $('#wMsg', w);
      m.style.opacity = 0;
      setTimeout(() => { m.textContent = msgs[mi]; m.style.opacity = 1; }, 300);
    }, 2300);
    let gv = 0;
    const gameT = 0;
    $('#wGame', w).classList.add('is-on');
    const spawn = () => {
      const s = document.createElement('button');
      s.type = 'button';
      s.className = 'spark';
      s.setAttribute('aria-label', 'Искра');
      s.style.left = 10 + Math.random() * 80 + '%';
      s.style.top = 12 + Math.random() * 70 + '%';
      s.style.setProperty('--sz', (40 + Math.random() * 14) + 'px');
      s.style.setProperty('--rot', (Math.random() * 60 - 30) + 'deg');
      w.appendChild(s);
      setTimeout(() => s.remove(), 2600);
    };
    spawn();
    gv = setInterval(spawn, 520);
    w.addEventListener('click', (e) => {
      const s = e.target.closest('.spark');
      if (!s || s.classList.contains('is-pop')) return;
      s.classList.add('is-pop');
      score++;
      $('#wScore', w).textContent = score;
      const cx = s.offsetLeft + s.offsetWidth / 2, cy = s.offsetTop + s.offsetHeight / 2;
      const ring = document.createElement('i');
      ring.className = 'spark-ring';
      ring.style.left = cx + 'px'; ring.style.top = cy + 'px';
      w.appendChild(ring);
      setTimeout(() => ring.remove(), 700);
      for (let k = 0; k < 12; k++) {
        const d = document.createElement('i');
        d.className = 'spark-dust';
        const ang = (k / 12) * Math.PI * 2 + Math.random() * 0.5, len = 50 + Math.random() * 60;
        d.style.left = cx + 'px'; d.style.top = cy + 'px';
        d.style.setProperty('--dx', Math.cos(ang) * len + 'px');
        d.style.setProperty('--dy', Math.sin(ang) * len + 'px');
        w.appendChild(d);
        setTimeout(() => d.remove(), 900);
      }
      s.style.visibility = 'hidden';
      setTimeout(() => s.remove(), 700);
    });
    return {
      done() {
        clearInterval(iv); clearInterval(mv); clearInterval(gv); clearTimeout(gameT);
        $('#wNum', w).textContent = 100;
        $('#wBar', w).style.width = '100%';
        $('#wMsg', w).textContent = 'Готово';
        return wait(420).then(() => w.remove());
      },
      fail() { clearInterval(iv); clearInterval(mv); clearInterval(gv); clearTimeout(gameT); w.remove(); }
    };
  }
  async function submit() {
    if (B.sending) return;
    saveForm();
    const f = B.form;
    const data = { name: String(f.name || '').trim(), phone: f.phone, email: String(f.email || '').trim(), comment: f.comment, website: f.website };
    $$('#bForm .field').forEach((x) => x.classList.remove('is-error'));
    const errs = [];
    const bad = (id, msg) => { errs.push(msg); $(id).parentNode.classList.add('is-error'); };
    if (!data.name) bad('#f_name', 'Укажите имя');
    if (Y.phoneDigits(data.phone).length !== 11) bad('#f_phone', 'Проверьте номер телефона');
    if (data.email && !Y.isEmail(data.email)) bad('#f_email', 'Проверьте e-mail');
    if (B.contact === 'E-mail' && !data.email) bad('#f_email', 'Укажите e-mail — вы выбрали связь по почте');
    if (!f.agree) errs.push('Нужно согласие на обработку данных');
    if (errs.length) return setErr(errs.join('. '));
    setErr('');
    B.sending = true;
    const w = startWait();
    try {
      const r = await Y.api.call('book', Object.assign(data, { date: B.date, start: B.time, serviceIds: B.ids.slice(), contact: B.contact }));
      const bk = r.booking || {};
      const done = { id: bk.id, date: B.date, start: B.time, end: bk.end || Y.fromMin(Y.toMin(B.time) + totalDur()), services: bk.services || chosen().map((s) => s.name).join(', '), total: bk.total, name: data.name, email: data.email };
      S.busy.push({ d: done.date, s: Y.toMin(done.start), e: Y.toMin(done.end) });
      await w.done();
      B.ids = []; B.time = null; B.step = 1; B.form = { agree: true };
      renderBooking();
      renderNearest();
      successModal(done, r.emailed);
    } catch (e) {
      w.fail();
      if (e.code === 'taken') { B.time = null; await load(); B.step = 2; renderBooking(); toast(e.message, true); }
      else setErr(e.message || 'Не удалось отправить. Проверьте интернет и попробуйте ещё раз.');
    }
    B.sending = false;
  }

  /* ---------- модальные окна ---------- */
  function modal(html) {
    const m = $('#modal');
    m.innerHTML = '<div class="modal__card" role="dialog" aria-modal="true"><button class="modal__close" data-modal-close aria-label="Закрыть">' + svg(IC.close) + '</button>' + html + '</div>';
    m.hidden = false;
  }
  function closeModal() { $('#modal').hidden = true; }
  $('#modal').addEventListener('click', (e) => { if (e.target.id === 'modal' || e.target.closest('[data-modal-close]')) closeModal(); });
  function successModal(b, emailed) {
    const links = Y.calLinks(b, S.settings);
    modal('<div class="done__icon">' + svg(IC.check) + '</div>' +
      '<h3>' + esc(text('successTitle')) + '</h3><p>' + esc(text('successText')) + '</p>' +
      (b.email ? '<p style="font-size:13.5px;color:var(--muted)">' + (emailed || Y.api.demo ? 'Письмо отправлено на ' + esc(b.email) + (Y.api.demo ? ' (в демо-режиме письма не уходят)' : '') + '. Если его нет — загляните в «Спам».' : 'Подтверждение придёт на ' + esc(b.email) + '.') + '</p>' : '') +
      '<div class="sum"><div><span>Когда</span><b>' + Y.cap(Y.fmtDate(b.date, true)) + ', ' + b.start + '–' + b.end + '</b></div><div><span>Услуги</span><b>' + esc(b.services) + '</b></div>' +
      (b.total ? '<div class="sum__total"><span>Стоимость</span><b>от ' + Y.fmtMoney(b.total) + ' ₽</b></div>' : '') + '</div>' +
      '<div class="modal__actions" style="align-items:center;justify-content:space-between"><button class="btn btn--solid btn--sm" data-modal-close><span>Хорошо</span></button>' +
      '<a class="link-btn" href="' + esc(links.google) + '" target="_blank" rel="noopener">' + svg(IC.cal) + 'Добавить в Google Календарь</a></div>');
  }
  function openPrivacy() { modal('<h3>Политика конфиденциальности</h3><div class="modal__text">' + esc(site().privacy) + '</div>'); }

  // отмена записи по ссылке из письма: #cancel=ID.TOKEN
  async function checkCancelLink() {
    const m = location.hash.match(/^#cancel=([^.]+)\.(.+)$/);
    if (!m) return;
    const id = m[1], token = m[2];
    history.replaceState(null, '', location.pathname + location.search);
    modal('<h3>Отмена записи</h3><p>Проверяем запись…</p>');
    try {
      const r = await Y.api.call('bookingInfo', { id, token });
      const b = r.booking;
      if (b.status === 'cancelled') return modal('<h3>Запись уже отменена</h3><p>' + Y.cap(Y.fmtDate(b.date, true)) + ', ' + b.start + ' — ' + esc(b.services) + '.</p>');
      modal('<h3>Отменить запись?</h3><div class="sum"><div><span>Когда</span><b>' + Y.cap(Y.fmtDate(b.date, true)) + ', ' + b.start + '</b></div><div><span>Услуги</span><b>' + esc(b.services) + '</b></div></div>' +
        '<p style="font-size:13.5px;color:var(--muted)">Время освободится для других клиентов, мастер получит уведомление.</p>' +
        '<div class="modal__actions"><button class="btn btn--solid btn--sm" id="doCancel"><span>Да, отменить</span></button><button class="btn btn--line btn--sm" data-modal-close><span>Оставить запись</span></button></div>');
      $('#doCancel').addEventListener('click', async (e) => {
        e.currentTarget.classList.add('is-loading');
        try {
          await Y.api.call('clientCancel', { id, token });
          modal('<div class="done__icon">' + svg(IC.check) + '</div><h3>Запись отменена</h3><p>Спасибо, что предупредили! Будем рады видеть вас в другой раз.</p><div class="modal__actions"><button class="btn btn--gold btn--sm" data-modal-close data-go="booking"><span>Записаться на другое время</span></button></div>');
          load();
        } catch (err) { modal('<h3>Не получилось</h3><p>' + esc(err.message) + '</p>'); }
      });
    } catch (err) {
      modal('<h3>Не получилось</h3><p>' + esc(err.message) + '</p><p>Позвоните мастеру: ' + esc(S.settings.profile.phone) + '</p>');
    }
  }

  /* ---------- контакты и интерактивная карта ---------- */
  let mapKey = '';
  function renderContacts() {
    const p = S.settings.profile;
    const addr = [p.city, p.address].filter(Boolean).join(', ');
    const tel = Y.phoneDigits(p.phone);
    const hours = p.hoursText
      ? '<div>' + esc(p.hoursText).replace(/\n/g, '<br>') + '</div>'
      : '<div class="hours">' + Y.hoursList(S.settings.schedule).map((h) => '<span>' + h.days + '</span><span>' + h.hours + '</span>').join('') + '</div>';
    const row = (icon, lbl, val, href) => (val ? (href ? '<a class="crow" href="' + esc(href) + '"' + (/^http/.test(href) ? ' target="_blank" rel="noopener"' : '') + '>' : '<div class="crow">') +
      '<span class="crow__icon">' + svg(IC[icon]) + '</span><span><small>' + lbl + '</small><b>' + val + '</b></span>' + (href ? '</a>' : '</div>') : '');
    const route = (site().mapProvider === 'google' ? 'https://www.google.com/maps/search/?api=1&query=' : 'https://yandex.ru/maps/?text=') + encodeURIComponent(addr || p.city || '');
    $('#contactCard').innerHTML =
      row('contacts', 'Телефон', esc(p.phone), tel.length === 11 ? 'tel:+' + tel : '') +
      row('mail', 'E-mail', esc(p.email), p.email ? 'mailto:' + p.email : '') +
      row('send', 'Telegram', p.telegram ? '@' + esc(String(p.telegram).replace(/^@|https?:\/\/t\.me\//g, '')) : '', p.telegram ? tgUrl(p.telegram) : '') +
      row('pin', 'Адрес', esc(addr || p.city) + (p.addressNote ? '<br><span style="font-size:13px;color:var(--muted)">' + esc(p.addressNote) + '</span>' : (!p.address ? '<br><span style="font-size:13px;color:var(--muted)">Точный адрес сообщу при подтверждении записи</span>' : '')), route) +
      row('clock', 'Время работы', hours) +
      '<div class="ccard__actions">' +
        (tel.length === 11 ? '<a class="btn btn--gold btn--sm" href="tel:+' + tel + '"><span>Позвонить</span></a>' : '') +
        (p.telegram ? '<a class="btn btn--line btn--sm" href="' + esc(tgUrl(p.telegram)) + '" target="_blank" rel="noopener"><span>Telegram</span></a>' : '') +
        '<a class="btn btn--line btn--sm" href="' + esc(route) + '" target="_blank" rel="noopener"><span>Маршрут</span></a>' +
      '</div><div class="socials js-socials">' + socialLinks().map((s) => '<a class="social" href="' + esc(s[1]) + '" target="_blank" rel="noopener" aria-label="' + s[2] + '">' + SOCIAL[s[0]] + '</a>').join('') + '</div>';
    if (R.cur === 'contacts') loadMap();
  }
  function loadMap() {
    const p = S.settings.profile, prov = site().mapProvider, box = $('#mapBox');
    box.hidden = prov === 'none';
    if (prov === 'none') return;
    const q = [p.city, p.address].filter(Boolean).join(', ') || 'Санкт-Петербург';
    const z = p.address ? 16 : 11;
    const key = prov + '|' + q;
    if (key === mapKey) return;
    mapKey = key;
    const e = encodeURIComponent(q);
    const src = prov === 'google' ? 'https://www.google.com/maps?q=' + e + '&z=' + z + '&output=embed' : 'https://yandex.ru/map-widget/v1/?text=' + e + '&z=' + z;
    box.innerHTML = '<iframe src="' + src + '" loading="lazy" title="Карта: ' + esc(q) + '" allowfullscreen referrerpolicy="no-referrer-when-downgrade"></iframe>';
  }

  /* =====================================================================
     МУЗЫКА: плеер, плейлист, мягкий автозапуск самого лёгкого трека
     ===================================================================== */
  const audio = $('#audio');
  const P = { i: -1, failed: 0, fadeT: 0, wantAuto: false, volume: 0.45 };
  const tracks = () => (S.settings.music.tracks || []).filter((t) => t.url || t.fileId);
  const musicPref = (v) => { try { if (v) localStorage.setItem('y_music', v); return localStorage.getItem('y_music'); } catch (e) { return null; } };
  function lightestIdx() {
    const list = tracks();
    let best = 0;
    list.forEach((t, i) => { if ((+t.size || Infinity) < (+list[best].size || Infinity)) best = i; });
    return best;
  }
  function setupPlayer() {
    const on = site().music && tracks().length > 0;
    ['#player', '#sheetPlayer'].forEach((s) => ($(s).hidden = !on));
    $('.topbar__music').hidden = !on;
    if (!on) { audio.pause(); closePlaylist(); return; }
    if (P.i < 0 || P.i >= tracks().length) P.i = lightestIdx();
    P.volume = Math.min(1, Math.max(0, +S.settings.music.volume || 0.45));
    if (!P.fadeT) audio.volume = P.volume;
    P.wantAuto = site().musicAutostart !== false;
    renderPlaylist();
    updatePlayer();
    if (P.wantAuto && !P.tried) { P.tried = true; playIdx(lightestIdx(), true); }
  }
  function renderPlaylist() {
    const html = tracks().map((t, i) => '<li><button data-track="' + i + '" class="' + (i === P.i ? 'is-on' : '') + '"><small>' + Y.pad(i + 1) + '</small><span>' + esc(t.title) + '</span><em>' + (i === P.i && !audio.paused ? '<span class="eq"><i></i><i></i><i></i><i></i></span>' : t.size ? (t.size / 1048576).toFixed(1) + ' МБ' : '') + '</em></button></li>').join('');
    $('#playlistList').innerHTML = html;
    $('#sheetList').innerHTML = html;
  }
  function updatePlayer() {
    const t = tracks()[P.i];
    const playing = !audio.paused;
    $$('[data-player-title]').forEach((el) => (el.textContent = t ? t.title : '—'));
    ['#player', '#sheetPlayer', '.topbar__music', '#playlist'].forEach((s) => $(s).classList.toggle('is-playing', playing));
    renderPlaylist();
  }
  function fadeIn() {
    clearInterval(P.fadeT);
    audio.volume = 0;
    const target = P.volume;
    P.fadeT = setInterval(() => {
      audio.volume = Math.min(target, audio.volume + target / 25);
      if (audio.volume >= target) { clearInterval(P.fadeT); P.fadeT = 0; }
    }, 100);
  }
  function playIdx(i, fade) {
    const list = tracks();
    if (!list.length) return;
    P.i = (i + list.length) % list.length;
    audio.src = Y.audioUrl(list[P.i]);
    if (fade) fadeIn(); else audio.volume = P.volume;
    audio.play().catch(() => {});
    updatePlayer();
  }
  function togglePlay() {
    if (!audio.src) { musicPref('on'); return playIdx(P.i < 0 ? lightestIdx() : P.i, true); }
    if (audio.paused) { musicPref('on'); audio.play().catch(() => toast('Не удалось включить музыку')); }
    else { musicPref('off'); audio.pause(); }
  }
  function closePlaylist() { const p = $('#playlist'); if (p) p.hidden = true; $$('.player__list').forEach((b) => b.classList.remove('is-on')); }
  document.addEventListener('click', (e) => {
    const tr = e.target.closest('[data-track]');
    if (tr) { musicPref('on'); return playIdx(+tr.dataset.track, true); }
    const b = e.target.closest('[data-player]');
    if (!b) return;
    const a = b.dataset.player;
    if (a === 'toggle') togglePlay();
    if (a === 'next') { musicPref('on'); playIdx(P.i + 1); }
    if (a === 'prev') { musicPref('on'); if (audio.currentTime > 3) { audio.currentTime = 0; audio.play().catch(() => {}); } else playIdx(P.i - 1); }
    if (a === 'list') {
      const pl = $('#playlist');
      pl.hidden = !pl.hidden;
      $$('.player__list').forEach((x) => x.classList.toggle('is-on', !pl.hidden));
    }
    if (a === 'seek' && audio.duration) {
      const r = b.getBoundingClientRect();
      audio.currentTime = ((e.clientX - r.left) / r.width) * audio.duration;
    }
  });
  audio.addEventListener('play', () => { P.failed = 0; updatePlayer(); });
  audio.addEventListener('pause', updatePlayer);
  audio.addEventListener('ended', () => playIdx(P.i + 1));
  audio.addEventListener('timeupdate', () => {
    const w = audio.duration ? (audio.currentTime / audio.duration) * 100 + '%' : '0';
    $$('[data-player-progress]').forEach((el) => (el.style.width = w));
  });
  audio.addEventListener('error', () => {
    if (!audio.src) return;
    P.failed++;
    if (P.failed < tracks().length) playIdx(P.i + 1);
    else { toast('Не удалось загрузить музыку', true); audio.removeAttribute('src'); updatePlayer(); }
  });
  // Браузеры запрещают звук до первого действия посетителя — включаем при первом касании/клике/клавише.
  function autoStart(e) {
    if (!P.wantAuto || !site().music || !tracks().length) return;
    if (e && e.target && e.target.closest && e.target.closest('[data-player], [data-track], #adminRoot')) return;
    ['pointerdown', 'keydown', 'touchend', 'click'].forEach((t) => document.removeEventListener(t, autoStart, true));
    if (audio.src && !audio.paused) return;
    playIdx(lightestIdx(), true);
  }
  ['pointerdown', 'keydown', 'touchend', 'click'].forEach((t) => document.addEventListener(t, autoStart, true));

  /* ---------- SEO: заголовок, описание, разметка Schema.org ---------- */
  function renderMeta() {
    const s = site(), p = S.settings.profile;
    document.title = s.seoTitle || p.firstName + ' ' + p.lastName;
    const setMeta = (sel, v) => { const m = document.querySelector(sel); if (m && v) m.setAttribute('content', v); };
    setMeta('meta[name="description"]', s.seoDescription);
    setMeta('meta[property="og:title"]', s.seoTitle);
    setMeta('meta[property="og:description"]', s.seoDescription);
    if (p.heroPhoto) setMeta('meta[property="og:image"]', Y.img(p.heroPhoto, 1200));
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const rv = allReviews();
    $('#ldjson').textContent = JSON.stringify({
      '@context': 'https://schema.org', '@type': 'HairSalon',
      name: p.firstName + ' ' + p.lastName + ' — ' + p.title.replace(/\s*·\s*/g, ', '),
      description: s.seoDescription, url: s.siteUrl || location.origin + location.pathname,
      image: p.heroPhoto ? Y.img(p.heroPhoto, 1200) : Y.DEFAULT_HERO,
      telephone: '+' + Y.phoneDigits(p.phone), email: p.email || undefined, priceRange: '₽₽',
      address: { '@type': 'PostalAddress', addressLocality: p.city, streetAddress: p.address || undefined, addressCountry: 'RU' },
      openingHoursSpecification: Object.keys(S.settings.schedule.days).filter((d) => S.settings.schedule.days[d].on).map((d) => ({
        '@type': 'OpeningHoursSpecification', dayOfWeek: days[+d], opens: S.settings.schedule.days[d].start, closes: S.settings.schedule.days[d].end
      })),
      aggregateRating: rv.length ? { '@type': 'AggregateRating', ratingValue: (rv.reduce((a, r) => a + (+r.rating || 5), 0) / rv.length).toFixed(1), reviewCount: rv.length } : undefined,
      sameAs: socialLinks().map((x) => x[1]),
      makesOffer: S.services.map((x) => ({ '@type': 'Offer', name: x.name, price: x.priceFrom || undefined, priceCurrency: 'RUB' }))
    });
  }

  /* ---------- тост ---------- */
  let toastT;
  function toast(msg, isErr) {
    const t = $('#toast');
    t.textContent = msg;
    t.classList.toggle('is-error', !!isErr);
    t.hidden = false;
    clearTimeout(toastT);
    toastT = setTimeout(() => (t.hidden = true), 4200);
  }
  Y.toast = toast;

  /* ---------- старт ---------- */
  $('#year').textContent = new Date().getFullYear();
  renderAll();
  load().then(() => { checkCancelLink(); checkReviewLink(); });
  setInterval(() => { if (!document.hidden && R.cur === 'booking' && !B.sending && $('#modal').hidden && B.step < 3) load(); }, 120000);
})();
