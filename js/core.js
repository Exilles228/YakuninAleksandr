/* Общая логика: значения по умолчанию, расчёт свободного времени, API, демо-бэкенд. */
(function () {
  'use strict';
  const Y = (window.Y = {});
  const CFG = window.SITE_CONFIG || {};

  /* ---------- утилиты ---------- */
  Y.pad = (n) => String(n).padStart(2, '0');
  Y.esc = (s) =>
    String(s == null ? '' : s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  Y.clone = (o) => JSON.parse(JSON.stringify(o));
  Y.uid = () => Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
  Y.toMin = (s) => {
    if (typeof s === 'number') return s;
    const p = String(s || '0:0').split(':');
    return (+p[0] || 0) * 60 + (+p[1] || 0);
  };
  Y.fromMin = (m) => Y.pad(Math.floor(m / 60)) + ':' + Y.pad(m % 60);
  Y.dateKey = (d) => d.getFullYear() + '-' + Y.pad(d.getMonth() + 1) + '-' + Y.pad(d.getDate());
  Y.parseDate = (k) => {
    const p = String(k).split('-').map(Number);
    return new Date(p[0], p[1] - 1, p[2]);
  };
  Y.addDays = (k, n) => {
    const d = Y.parseDate(k);
    d.setDate(d.getDate() + n);
    return Y.dateKey(d);
  };
  Y.dayIndex = (k) => {
    const p = String(k).split('-').map(Number);
    return Math.round(Date.UTC(p[0], p[1] - 1, p[2]) / 864e5);
  };
  /* Текущие дата и минуты в часовом поясе мастера */
  Y.now = (tz) => {
    try {
      const parts = new Intl.DateTimeFormat('en-CA', {
        timeZone: tz || CFG.TZ || 'Europe/Moscow',
        year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', hourCycle: 'h23'
      }).formatToParts(new Date());
      const g = (t) => (parts.find((p) => p.type === t) || {}).value;
      return { date: g('year') + '-' + g('month') + '-' + g('day'), min: ((+g('hour')) % 24) * 60 + (+g('minute')) };
    } catch (e) {
      const d = new Date();
      return { date: Y.dateKey(d), min: d.getHours() * 60 + d.getMinutes() };
    }
  };

  const MONTHS = ['января', 'февраля', 'марта', 'апреля', 'мая', 'июня', 'июля', 'августа', 'сентября', 'октября', 'ноября', 'декабря'];
  Y.MONTHS_SHORT = ['янв', 'фев', 'мар', 'апр', 'мая', 'июн', 'июл', 'авг', 'сен', 'окт', 'ноя', 'дек'];
  Y.MONTHS_NOM = ['Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь', 'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь'];
  Y.WD = ['воскресенье', 'понедельник', 'вторник', 'среда', 'четверг', 'пятница', 'суббота'];
  Y.WD_SHORT = ['Вс', 'Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб'];

  Y.cap = (s) => (s ? s[0].toUpperCase() + s.slice(1) : s);
  Y.fmtDate = (k, withWd) => {
    if (!k) return '';
    const d = Y.parseDate(k);
    const s = d.getDate() + ' ' + MONTHS[d.getMonth()];
    return withWd ? Y.WD[d.getDay()] + ', ' + s : s;
  };
  Y.fmtDateRel = (k, tz) => {
    const diff = Y.dayIndex(k) - Y.dayIndex(Y.now(tz).date);
    if (diff === 0) return 'сегодня';
    if (diff === 1) return 'завтра';
    if (diff === 2) return 'послезавтра';
    return Y.fmtDate(k, true);
  };
  Y.fmtMoney = (n) => String(Math.round(+n || 0)).replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
  Y.fmtPrice = (from, to) => {
    from = +from || 0; to = +to || 0;
    if (from && to && to > from) return Y.fmtMoney(from) + ' – ' + Y.fmtMoney(to) + ' ₽';
    if (from) return (to ? '' : 'от ') + Y.fmtMoney(from) + ' ₽';
    if (to) return 'до ' + Y.fmtMoney(to) + ' ₽';
    return 'по запросу';
  };
  Y.fmtDur = (m) => {
    m = +m || 0;
    const h = Math.floor(m / 60), r = m % 60;
    return (h ? h + ' ч' : '') + (h && r ? ' ' : '') + (r ? r + ' мин' : '') || '—';
  };
  Y.phoneDigits = (p) => {
    let d = String(p || '').replace(/\D/g, '');
    if (d.length === 11 && d[0] === '8') d = '7' + d.slice(1);
    if (d.length === 10) d = '7' + d;
    return d;
  };
  Y.fmtPhone = (p) => {
    const d = Y.phoneDigits(p);
    if (d.length !== 11) return p || '';
    return '+' + d[0] + ' (' + d.slice(1, 4) + ') ' + d.slice(4, 7) + '-' + d.slice(7, 9) + '-' + d.slice(9, 11);
  };
  Y.plural = (n, one, few, many) => {
    const a = Math.abs(n) % 100, b = a % 10;
    if (a > 10 && a < 20) return many;
    if (b > 1 && b < 5) return few;
    if (b === 1) return one;
    return many;
  };
  Y.isEmail = (s) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(s || '').trim());

  /* «Пн–Пт: 10:00–20:00 · Сб: 11:00–18:00 · Вс: выходной» */
  Y.hoursList = (schedule) => {
    const order = [1, 2, 3, 4, 5, 6, 0];
    const key = (d) => { const x = (schedule.days || {})[d]; return x && x.on ? x.start + '–' + x.end : 'выходной'; };
    const out = [];
    order.forEach((d) => {
      const k = key(d);
      const last = out[out.length - 1];
      if (last && last.k === k) last.to = d;
      else out.push({ from: d, to: d, k });
    });
    return out.map((g) => ({ days: Y.WD_SHORT[g.from] + (g.to !== g.from ? '–' + Y.WD_SHORT[g.to] : ''), hours: g.k }));
  };

  /* ---------- изображения и файлы ---------- */
  const TILDA = 'https://static.tildacdn.info/';
  Y.img = (p, w) => {
    w = w || 1200;
    const url = typeof p === 'string' ? p : (p && p.url) || '';
    const fileId = p && typeof p === 'object' ? p.fileId : '';
    if (fileId) return 'https://lh3.googleusercontent.com/d/' + fileId + '=w' + w;
    if (url.indexOf(TILDA) === 0) {
      const rest = url.slice(TILDA.length);
      const i = rest.indexOf('/');
      return 'https://thumb.tildacdn.com/' + rest.slice(0, i) + '/-/resize/' + w + 'x/-/format/webp' + rest.slice(i);
    }
    return url;
  };
  Y.imgFallback = (p) => {
    const url = typeof p === 'string' ? p : (p && p.url) || '';
    const fileId = p && typeof p === 'object' ? p.fileId : '';
    if (fileId) return 'https://drive.google.com/thumbnail?id=' + fileId + '&sz=w1600';
    return url;
  };
  Y.audioUrl = (t) => (t.fileId ? 'https://drive.google.com/uc?export=download&id=' + t.fileId : t.url);
  document.addEventListener('error', (e) => {
    const t = e.target;
    if (t && t.tagName === 'IMG' && t.dataset.fb && t.src !== t.dataset.fb) {
      t.src = t.dataset.fb;
      t.removeAttribute('data-fb');
    }
  }, true);

  /* ---------- иконки услуг (выбираются в админке) ---------- */
  Y.ICONS = {
    scissors: ['Ножницы', '<circle cx="6" cy="6" r="3"/><circle cx="6" cy="18" r="3"/><path d="M20 4 8.1 15.9M14.5 14.5 20 20M8.1 8.1 12 12"/>'],
    color: ['Окрашивание', '<path d="M12 3s6 6.5 6 11a6 6 0 0 1-12 0c0-4.5 6-11 6-11z"/><path d="M9 15a3 3 0 0 0 3 3"/>'],
    brush: ['Кисть', '<path d="M18 3l3 3-9.5 9.5-3-3z"/><path d="M8.5 12.5C6 12.5 4 14 4 16.5 4 18.5 3 20 3 20s3.5.5 5.5-1.5c1.5-1.5 1.5-3.5 0-4.5"/>'],
    dryer: ['Фен / укладка', '<path d="M4 9a5 5 0 0 1 5-5h7l4 2v6l-4 2H9A5 5 0 0 1 4 9z"/><circle cx="9" cy="9" r="2"/><path d="M11 14l-1 7h3l1-7"/>'],
    lips: ['Макияж', '<path d="M2 12c2-3 5-5 7-5 1.3 0 2.2.7 3 1.5.8-.8 1.7-1.5 3-1.5 2 0 5 2 7 5-2 3-5 6-10 6S4 15 2 12z"/><path d="M2 12h20"/>'],
    crown: ['Причёска / образ', '<path d="M3 8l4.5 4L12 5l4.5 7L21 8l-2 11H5z"/>'],
    sparkle: ['Сияние', '<path d="M12 3l1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8z"/><path d="M19 16l.7 2 2 .7-2 .7-.7 2-.7-2-2-.7 2-.7z"/>'],
    wave: ['Локоны', '<path d="M3 7c3-3 6 3 9 0s6 3 9 0M3 12c3-3 6 3 9 0s6 3 9 0M3 17c3-3 6 3 9 0s6 3 9 0"/>'],
    drop: ['Уход', '<path d="M12 21a7 7 0 0 0 7-7c0-5-7-11-7-11S5 9 5 14a7 7 0 0 0 7 7z"/><path d="M12 11v6M9 14h6"/>'],
    beard: ['Барбер', '<path d="M5 5v6a7 7 0 0 0 14 0V5"/><path d="M9 13c1 .8 2 1 3 1s2-.2 3-1"/><path d="M12 18v3"/>'],
    comb: ['Расчёска', '<path d="M3 7h18v4H3z"/><path d="M5 11v7M8 11v7M11 11v7M14 11v7M17 11v7M20 11v5"/>'],
    mirror: ['Зеркало', '<ellipse cx="12" cy="9" rx="6" ry="7"/><path d="M12 16v6M9 22h6"/>']
  };
  Y.icon = (key, cls) => '<svg class="' + (cls || 'i') + '" viewBox="0 0 24 24" aria-hidden="true">' + (Y.ICONS[key] || Y.ICONS.sparkle)[1] + '</svg>';

  /* ---------- значения по умолчанию ---------- */
  const T = (p) => TILDA + p;
  Y.DEFAULT_HERO = T('tild3836-3364-4739-a461-313066303965/noroot.jpg');
  Y.DEFAULT_ABOUT = T('tild3835-6266-4531-b438-343866393136/photo_2023-06-30_13-.jpg');
  Y.DEFAULT_LOGO = 'img/logo.png';
  Y.SERVER_VERSION = 4;

  // Фото со старого сайта — показываются, пока в админке не добавлены свои
  Y.DEFAULT_PHOTOS = [
    ['tild3062-3264-4233-a362-623038633838/_MG_0827.jpg', 'Образы'],
    ['tild6237-6564-4230-a138-626432386363/1_2.jpg', 'Стрижки'],
    ['tild3132-3433-4035-a364-653538343966/_MG_0412.jpg', 'Образы'],
    ['tild6562-6632-4232-b439-376462343633/hbXjAGkzX4Q.jpg', 'Стрижки'],
    ['tild3434-3432-4734-b637-643838363937/photo_2023-06-30_13-.jpg', 'Образы'],
    ['tild6236-3761-4933-a637-303031613366/5.jpg', 'Стрижки'],
    ['tild3834-6165-4264-a264-636563346536/photo_2023-06-30_13-.jpg', 'Образы'],
    ['tild3339-3038-4138-b465-363432323632/IMG_20211128_170837_.jpg', 'Окрашивание'],
    ['tild3039-3236-4332-a462-653964353634/_MG_1007.jpg', 'Укладки'],
    ['tild3833-3233-4335-b732-303333626131/IMG_20220222_182706_.jpg', 'Стрижки'],
    ['tild3233-3663-4332-b065-653362643538/Preview_224.JPG', 'Укладки'],
    ['tild6538-6333-4437-a664-316463656364/IMG_20200901_134854_.jpg', 'Стрижки'],
    ['tild3235-3336-4539-a233-663335303465/photo_2023-06-30_13-.jpg', 'Укладки'],
    ['tild6465-6564-4536-b532-643830303732/B612_20201028_124717.jpg', 'Стрижки'],
    ['tild6462-6130-4336-b239-643330333363/IMG_4599.jpg', 'Образы'],
    ['tild6461-6431-4964-a338-353061643963/IMG_20200623_153513_.jpg', 'Стрижки'],
    ['tild3866-3937-4864-b735-373762663365/_MG_0215.jpg', 'Укладки'],
    ['tild3338-6238-4236-b538-353265376233/IMG_20210710_174936_.jpg', 'Окрашивание'],
    ['tild3264-6364-4534-b632-613464356231/_MG_0436.jpg', 'Образы'],
    ['tild6566-3733-4132-b939-313736636335/IMG_20201026_114416_.jpg', 'Окрашивание'],
    ['tild3361-6639-4531-b065-623931633934/_MG_4000.jpg', 'Образы'],
    ['tild6236-6363-4336-b432-636666336532/KMtQ0T39JOg.jpg', 'Стрижки'],
    ['tild3433-6230-4833-a337-363864323161/B612_20201027_150558.jpg', 'Образы'],
    ['tild3535-3436-4764-a132-663034333637/photo_2023-06-30_14-.jpg', 'За работой'],
    ['tild3539-3930-4461-b863-366434336430/photo_2023-06-30_13-.jpg', 'Укладки'],
    ['tild3737-6439-4562-a539-613862613862/photo_2023-06-30_14-.jpg', 'За работой'],
    ['tild6263-3662-4237-b937-336638643535/Screenshot_20211003-.jpg', 'Образы'],
    ['tild6337-6539-4631-b862-646564376464/photo_2023-06-30_13-.jpg', 'За работой'],
    ['tild6335-6463-4965-a131-396231363761/photo_2023-06-30_13-.jpg', 'Образы'],
    ['tild6364-3664-4366-a266-346435363031/photo_2023-06-30_14-.jpg', 'За работой'],
    ['tild6361-3763-4562-b031-386338356330/IMG_20201026_114352_.jpg', 'Окрашивание'],
    ['tild6335-6563-4662-b665-386636656663/IMG_6981.jpg', 'За работой'],
    ['tild6431-3437-4733-b863-303562663038/IMG_20201023_163932_.jpg', 'Стрижки'],
    ['tild3538-3361-4333-a336-393233613237/photo_2023-06-30_14-.jpg', 'За работой']
  ].map((a, i) => ({ id: 'd' + i, url: T(a[0]), fileId: '', cat: a[1], caption: '' }));

  Y.DEFAULT_SERVICES = [
    { id: 's1', cat: 'Стрижки', name: 'Мужская стрижка', desc: 'Консультация, мытьё головы, стрижка и укладка', priceFrom: 1000, priceTo: 1250, duration: 60, note: '', visible: true, icon: 'comb' },
    { id: 's2', cat: 'Стрижки', name: 'Женская стрижка', desc: 'Подбор формы под тип лица и волос, мытьё, укладка', priceFrom: 1500, priceTo: 2000, duration: 90, note: '', visible: true, icon: 'scissors' },
    { id: 's3', cat: 'Окрашивание', name: 'Сложное окрашивание', desc: 'Airtouch, балаяж, шатуш, тонирование', priceFrom: 3500, priceTo: 5000, duration: 180, note: 'без учёта материалов', visible: true, icon: 'color' },
    { id: 's4', cat: 'Укладки и причёски', name: 'Укладка', desc: 'Повседневная или вечерняя укладка', priceFrom: 2000, priceTo: 2500, duration: 60, note: '', visible: true, icon: 'dryer' },
    { id: 's5', cat: 'Укладки и причёски', name: 'Причёска', desc: 'Вечерняя, свадебная, для фотосессии', priceFrom: 2000, priceTo: 2500, duration: 90, note: '', visible: true, icon: 'crown' },
    { id: 's6', cat: 'Макияж', name: 'Макияж', desc: 'Дневной, вечерний, для съёмки или события', priceFrom: 2000, priceTo: 3000, duration: 60, note: '', visible: true, icon: 'lips' }
  ];

  // Спокойная фортепианная музыка — общественное достояние (Wikimedia Commons)
  const WM = 'https://upload.wikimedia.org/wikipedia/commons/';
  Y.DEFAULT_TRACKS = [
    { id: 't1', title: 'Эрик Сати — Гимнопедия № 1', url: WM + 'transcoded/9/90/Erik_Satie_-_gymnopedies_-_la_1_ere._lent_et_douloureux.ogg/Erik_Satie_-_gymnopedies_-_la_1_ere._lent_et_douloureux.ogg.mp3', fileId: '', size: 4299790 },
    { id: 't2', title: 'Клод Дебюсси — Лунный свет', url: WM + 'transcoded/b/be/Clair_de_lune_%28Claude_Debussy%29_Suite_bergamasque.ogg/Clair_de_lune_%28Claude_Debussy%29_Suite_bergamasque.ogg.mp3', fileId: '', size: 7563179 },
    { id: 't3', title: 'Эрик Сати — Гносьенна № 1', url: WM + 'transcoded/9/91/Satie_-_Gnossienne_1.ogg/Satie_-_Gnossienne_1.ogg.mp3', fileId: '', size: 4954436 },
    { id: 't4', title: 'Фредерик Шопен — Ноктюрн ми-бемоль мажор', url: WM + '8/82/Nocturne_in_E_flat_major%2C_Op._9_no._2.mp3', fileId: '', size: 5175969 }
  ];

  Y.SECTION_IDS = ['home', 'about', 'works', 'prices', 'reviews', 'booking', 'contacts'];

  const day = (on, start, end) => ({ on, start, end });
  Y.DEFAULT_SETTINGS = {
    profile: {
      firstName: 'Александр',
      lastName: 'Якунин',
      title: 'Стилист · Визажист',
      city: 'Санкт-Петербург',
      address: '',
      addressNote: '',
      since: 2010,
      tagline: 'Стрижки, окрашивание, укладки и макияж. Чисто, красиво и с индивидуальным подходом — чтобы из кресла вы вставали сияющими.',
      about: 'Освоил профессию парикмахера-визажиста в 2010 году. Прошёл обучение в школе Pivot Point, посещал семинары Ollin, Estel и Kapous.\nЛюблю свою работу и хочу двигаться вперёд, делая мир прекраснее.',
      facts: [
        'Главный стилист проекта «Завтрак со звездой» с 2018 года',
        'Работаю с лучшими модельными агентствами Санкт-Петербурга',
        'Участвую в творческих фотосессиях для российских и иностранных журналов',
        'Нахожу индивидуальный подход к каждому клиенту'
      ],
      awards: ['Школа Pivot Point', 'Семинары Ollin, Estel, Kapous'],
      heroPhoto: null,
      aboutPhoto: null,
      phone: '+7 921 760-02-61',
      email: 'u_s_b89@mail.ru',
      telegram: 'Youheartme',
      instagram: 'yakuninsasha',
      vk: 'alex.yakunin89',
      hoursText: '',
      priceNote: 'Цены ориентировочные: итоговая стоимость зависит от длины и густоты волос. Материалы для окрашивания оплачиваются отдельно.'
    },
    site: {
      accent: '#d4af37',
      cursor: true,
      parallax: true,
      music: true,
      musicAutostart: true,
      intro: true,
      particles: true,
      tilt: true,
      grain: true,
      animations: true,
      galleryView: 'cinema',
      galleryAutoplay: true,
      galleryInterval: 5,
      galleryColsMobile: 2,
      galleryPage: 12,
      bookingOn: true,
      mapProvider: 'google',
      logo: null,
      favicon: null,
      siteUrl: '',
      seoTitle: 'Александр Якунин — стилист-визажист, Санкт-Петербург',
      seoDescription: 'Стрижки, сложное окрашивание, укладки, причёски и макияж. Онлайн-запись на свободное время.',
      sections: [
        { id: 'home', on: true, label: 'Главная' },
        { id: 'about', on: true, label: 'О мастере' },
        { id: 'works', on: true, label: 'Портфолио' },
        { id: 'prices', on: true, label: 'Цены' },
        { id: 'reviews', on: true, label: 'Отзывы' },
        { id: 'booking', on: true, label: 'Запись' },
        { id: 'contacts', on: true, label: 'Контакты' }
      ],
      texts: {
        heroCta: 'Записаться',
        heroCta2: 'Портфолио',
        heroCta3: 'Обо мне',
        aboutCta: 'Смотреть работы',
        aboutTitle: 'О мастере',
        worksTitle: 'Портфолио',
        worksSub: 'Избранные работы: стрижки, окрашивание, укладки и образы.',
        pricesTitle: 'Услуги и цены',
        reviewsTitle: 'Отзывы',
        reviewsSub: 'Что говорят клиенты',
        bookingTitle: 'Онлайн-запись',
        bookingSub: 'Выберите услугу, дату и свободное время. Я подтвержу запись по телефону, SMS или на e-mail.',
        bookingOff: 'Онлайн-запись временно недоступна. Позвоните или напишите мне — подберу время.',
        successTitle: 'Вы записаны!',
        successText: 'Я свяжусь с вами для подтверждения. Если вы указали e-mail — письмо с деталями уже отправлено.',
        contactsTitle: 'Контакты',
        contactsSub: 'Позвоните или напишите — помогу выбрать услугу и подберу время.',
        footer: ''
      },
      privacy: 'Оставляя заявку на сайте, вы соглашаетесь на обработку персональных данных: имени, телефона и e-mail.\n\nДанные используются только для записи на услуги, подтверждения и напоминания о визите и не передаются третьим лицам.\n\nХранение: записи хранятся в защищённом аккаунте мастера и удаляются по вашему запросу. Чтобы удалить данные, напишите или позвоните мастеру по контактам на сайте.'
    },
    music: { tracks: null, volume: 0.45 },
    reviews: [],
    schedule: {
      days: {
        1: day(true, '10:00', '20:00'), 2: day(true, '10:00', '20:00'), 3: day(true, '10:00', '20:00'),
        4: day(true, '10:00', '20:00'), 5: day(true, '10:00', '20:00'), 6: day(true, '11:00', '18:00'), 0: day(false, '11:00', '18:00')
      },
      step: 30,
      horizon: 90,
      leadHours: 2,
      breakOn: false,
      breakStart: '14:00',
      breakEnd: '15:00'
    },
    notify: {
      ownerEmail: '',
      emailOnNew: true,
      dailyDigest: true,
      calendarAdd: true,
      calendarBusy: true,
      calendarId: '',
      clientEmailOnNew: true,
      clientEmail: true,
      clientEmailReminder: true,
      clientEmailReview: true,
      smsruOn: false,
      smsruKey: '',
      smsOnNew: false,
      smsOnConfirm: true,
      smsOnCancel: true,
      smsReminder: false,
      tplConfirm: 'Здравствуйте, {имя}! Ваша запись подтверждена: {дата} в {время} — {услуги}. {адрес}До встречи! Александр Якунин, {телефон}',
      tplCancel: 'Здравствуйте, {имя}! К сожалению, запись на {дата} в {время} отменена. Напишите или позвоните мне, подберём другое время: {телефон}. Александр',
      tplNew: 'Здравствуйте, {имя}! Заявка на {дата} в {время} ({услуги}) получена. Я свяжусь с вами для подтверждения. Александр Якунин',
      tplReminder: 'Напоминаю: завтра в {время} вы записаны — {услуги}. {адрес}Если планы изменились, дайте знать: {телефон}. Александр'
    }
  };

  const isObj = (o) => o && typeof o === 'object' && !Array.isArray(o);
  Y.deepMerge = (base, over) => {
    const out = Y.clone(base);
    if (!isObj(over)) return out;
    Object.keys(over).forEach((k) => {
      const v = over[k];
      if (v === undefined) return;
      out[k] = isObj(v) && isObj(out[k]) ? Y.deepMerge(out[k], v) : v;
    });
    return out;
  };
  Y.mergeSettings = (s) => {
    const m = Y.deepMerge(Y.DEFAULT_SETTINGS, s || {});
    // список разделов: сохраняем порядок из настроек и добавляем новые разделы
    const saved = Array.isArray(m.site.sections) ? m.site.sections.filter((x) => Y.SECTION_IDS.indexOf(x.id) >= 0) : [];
    Y.DEFAULT_SETTINGS.site.sections.forEach((d) => { if (!saved.some((x) => x.id === d.id)) saved.push(Y.clone(d)); });
    m.site.sections = saved;
    if (!Array.isArray(m.music.tracks)) m.music.tracks = Y.clone(Y.DEFAULT_TRACKS);
    if (!Array.isArray(m.reviews)) m.reviews = [];
    if (m.site.texts && m.site.texts.heroCta2 === 'Смотреть портфолио') m.site.texts.heroCta2 = 'Портфолио';
    ['facts', 'awards'].forEach((k) => {
      if (!Array.isArray(m.profile[k])) m.profile[k] = String(m.profile[k] || '').split('\n').filter(Boolean);
    });
    return m;
  };

  /* Подставить значения в шаблон сообщения */
  Y.fillTemplate = (tpl, b, settings) => {
    const p = (settings && settings.profile) || {};
    const addr = [p.city, p.address].filter(Boolean).join(', ');
    const map = {
      'имя': (b.name || '').split(' ')[0],
      'дата': Y.fmtDate(b.date, true),
      'время': b.start,
      'услуги': b.services,
      'сумма': b.total ? Y.fmtMoney(b.total) + ' ₽' : '',
      'адрес': p.address ? 'Адрес: ' + addr + '. ' : '',
      'телефон': p.phone || ''
    };
    return String(tpl || '').replace(/\{([а-яё_]+)\}/gi, (m, k) => (k.toLowerCase() in map ? map[k.toLowerCase()] : m)).replace(/\s{2,}/g, ' ').trim();
  };

  /* ---------- расчёт свободного времени ---------- */
  // st = { schedule, exceptions, busy:[{d,s,e}], tz }
  Y.dayHours = (date, st) => {
    const ex = st.exceptions || [];
    for (const e of ex) if (e.type === 'off' && date >= e.from && date <= (e.to || e.from)) return { open: false, reason: 'off', note: e.note };
    const h = ex.find((e) => e.type === 'hours' && e.from === date);
    if (h) return { open: true, start: Y.toMin(h.start), end: Y.toMin(h.end), special: true };
    const d = (st.schedule.days || {})[String(Y.parseDate(date).getDay())];
    if (!d || !d.on) return { open: false, reason: 'weekend' };
    return { open: true, start: Y.toMin(d.start), end: Y.toMin(d.end) };
  };
  Y.dayBusy = (date, st) => {
    const out = (st.busy || []).filter((b) => b.d === date).map((b) => [b.s, b.e]);
    (st.exceptions || []).forEach((e) => {
      if (e.type === 'busy' && e.from === date) out.push([Y.toMin(e.start), Y.toMin(e.end)]);
    });
    const s = st.schedule;
    if (s.breakOn) out.push([Y.toMin(s.breakStart), Y.toMin(s.breakEnd)]);
    return out;
  };
  Y.daySlots = (date, dur, st) => {
    const h = Y.dayHours(date, st);
    if (!h.open) return { open: false, reason: h.reason, slots: [], free: 0 };
    const step = Math.max(5, +st.schedule.step || 30);
    dur = Math.max(+dur || step, 5);
    const busy = Y.dayBusy(date, st);
    const now = Y.now(st.tz);
    const minAbs = Y.dayIndex(now.date) * 1440 + now.min + (+st.schedule.leadHours || 0) * 60;
    const base = Y.dayIndex(date) * 1440;
    const ov = (a, b) => busy.some(([s, e]) => a < e && b > s);
    const slots = [];
    let free = 0;
    for (let t = h.start; t < h.end; t += step) {
      const cellEnd = Math.min(t + step, h.end);
      let status;
      if (base + t < minAbs) status = 'past';
      else if (ov(t, cellEnd)) status = 'busy';
      else if (t + dur <= h.end && !ov(t, t + dur)) status = 'free';
      else status = 'short';
      if (status === 'free') free++;
      slots.push({ t, time: Y.fromMin(t), status });
    }
    return { open: true, slots, free, start: h.start, end: h.end };
  };
  Y.firstFree = (dur, st) => {
    const today = Y.now(st.tz).date;
    const hz = +st.schedule.horizon || 30;
    for (let i = 0; i < hz; i++) {
      const d = Y.addDays(today, i);
      const s = Y.daySlots(d, dur, st).slots.find((x) => x.status === 'free');
      if (s) return { date: d, time: s.time };
    }
    return null;
  };
  Y.busyFromBookings = (bookings) =>
    (bookings || []).filter((b) => b.status !== 'cancelled').map((b) => ({ d: b.date, s: Y.toMin(b.start), e: Y.toMin(b.end) }));

  Y.STATUS = {
    new: { label: 'Новая', cls: 'new' },
    confirmed: { label: 'Подтверждена', cls: 'ok' },
    done: { label: 'Выполнена', cls: 'done' },
    cancelled: { label: 'Отменена', cls: 'cancel' }
  };

  /* ---------- API ---------- */
  const API_URL = (CFG.API_URL || '').trim();
  const DEMO_KEY = 'yakunin_demo_db_v2';

  // GET с таймаутом и одной повторной попыткой: Apps Script иногда «зависает» на холодном старте
  async function getWithRetry(url) {
    for (let attempt = 0; attempt < 2; attempt++) {
      const ctrl = window.AbortController ? new AbortController() : null;
      const t = ctrl ? setTimeout(() => ctrl.abort(), attempt ? 30000 : 15000) : 0;
      try {
        const r = await fetch(url + '&_=' + Date.now() + attempt, ctrl ? { signal: ctrl.signal } : undefined);
        clearTimeout(t);
        return r;
      } catch (e) {
        clearTimeout(t);
        if (attempt) throw e;
      }
    }
  }
  async function remote(action, body, method) {
    let res;
    if (method === 'GET') {
      res = await getWithRetry(API_URL + (API_URL.indexOf('?') < 0 ? '?' : '&') + 'action=' + action);
    } else {
      // text/plain — чтобы не было CORS preflight-запроса к Apps Script
      res = await fetch(API_URL, { method: 'POST', headers: { 'Content-Type': 'text/plain;charset=utf-8' }, body: JSON.stringify(Object.assign({ action }, body || {})) });
    }
    const j = await res.json();
    if (!j.ok) {
      const old = /Неизвестное действие/.test(j.error || '');
      const err = new Error(old ? 'На сервере старая версия скрипта. Обновите развёртывание: Apps Script → Развернуть → Управление развёртываниями → ✏️ → «Новая версия».' : j.error || 'Ошибка сервера');
      err.code = old ? 'old' : j.code;
      throw err;
    }
    return j;
  }

  /* ----- демо-бэкенд в localStorage (повторяет логику Apps Script) ----- */
  const local = {
    load() {
      try {
        const j = JSON.parse(localStorage.getItem(DEMO_KEY));
        if (j && j.v === 2) return j;
      } catch (e) {}
      const db = local.seed();
      local.save(db);
      return db;
    },
    save(db) {
      try { localStorage.setItem(DEMO_KEY, JSON.stringify(db)); } catch (e) { throw new Error('Не хватает места в браузере (демо-режим). Используйте фото поменьше.'); }
    },
    seed() {
      const today = Y.now(CFG.TZ).date;
      const mk = (off, start, dur, name, svc, status, email) => ({
        id: Y.uid(), created: new Date().toISOString(), date: Y.addDays(today, off), start, end: Y.fromMin(Y.toMin(start) + dur),
        services: svc, serviceIds: '', total: 0, name, phone: '+7 900 000-00-00', email: email || '', contact: 'Звонок',
        comment: 'Демо-запись', status, source: 'Демо', token: Y.uid(), log: ''
      });
      return {
        v: 2, password: 'admin', settings: {}, services: Y.clone(Y.DEFAULT_SERVICES), photos: [], exceptions: [], reviews: [],
        bookings: [
          mk(1, '12:00', 90, 'Мария', 'Женская стрижка', 'confirmed', 'maria@example.com'),
          mk(1, '15:00', 60, 'Игорь', 'Мужская стрижка', 'new'),
          mk(2, '10:00', 180, 'Анна', 'Сложное окрашивание', 'confirmed'),
          mk(2, '16:30', 60, 'Ольга', 'Макияж', 'new', 'olga@example.com'),
          mk(3, '11:00', 90, 'Екатерина', 'Причёска', 'confirmed')
        ]
      };
    },
    addLog(b, text) {
      const t = new Date();
      b.log = (b.log ? b.log + '\n' : '') + Y.pad(t.getDate()) + '.' + Y.pad(t.getMonth() + 1) + ' ' + Y.pad(t.getHours()) + ':' + Y.pad(t.getMinutes()) + ' ' + text;
    },
    handle(action, body) {
      const db = local.load();
      const settings = Y.mergeSettings(db.settings);
      const ok = (o) => Object.assign({ ok: true }, o || {});
      const services = db.services.length ? db.services : Y.DEFAULT_SERVICES;
      const today = Y.now(CFG.TZ).date;
      if (action === 'public') {
        const s = Y.clone(db.settings || {});
        delete s.notify;
        return ok({
          settings: s,
          services: services.filter((x) => x.visible !== false),
          photos: db.photos,
          exceptions: db.exceptions.filter((e) => (e.to || e.from) >= today).map((e) => ({ id: e.id, type: e.type, from: e.from, to: e.to, start: e.start, end: e.end, note: e.type === 'off' ? e.note : '' })),
          busy: Y.busyFromBookings(db.bookings.filter((b) => b.date >= today)),
          clientReviews: (db.reviews || []).filter((r) => r.rstatus === 'approved').map((r) => ({ id: r.id, name: r.name, service: r.service, rating: +r.rating, text: r.text, date: Y.MONTHS_NOM[new Date(r.created).getMonth()].toLowerCase() + ' ' + new Date(r.created).getFullYear(), source: 'site' })).reverse(),
          tz: CFG.TZ,
          version: Y.SERVER_VERSION
        });
      }
      if (action === 'book') {
        const b = validateBooking(body, services, { schedule: settings.schedule, exceptions: db.exceptions, busy: Y.busyFromBookings(db.bookings), tz: CFG.TZ });
        b.source = 'Сайт (демо)';
        b.token = Y.uid();
        if (b.email && settings.notify.clientEmailOnNew) local.addLog(b, 'Клиенту: письмо «заявка получена» (демо — не отправлено)');
        db.bookings.push(b);
        local.save(db);
        return ok({ booking: { id: b.id, date: b.date, start: b.start, end: b.end, services: b.services, total: b.total }, emailed: !!b.email });
      }
      if (action === 'clientCancel') {
        const b = db.bookings.find((x) => String(x.id) === String(body.id) && x.token === body.token);
        if (!b) throw new Error('Запись не найдена или ссылка устарела');
        if (b.status === 'cancelled') return ok({ booking: b, already: true });
        b.status = 'cancelled';
        local.addLog(b, 'Отменена клиентом по ссылке');
        local.save(db);
        return ok({ booking: { date: b.date, start: b.start, services: b.services } });
      }
      if (action === 'reviewInfo') {
        const b = db.bookings.find((x) => String(x.id) === String(body.id) && x.token === body.token);
        if (!b) throw new Error('Запись не найдена или ссылка устарела');
        return ok({ booking: { name: String(b.name).split(' ')[0], services: b.services, date: b.date }, reviewed: (db.reviews || []).some((r) => r.bookingId === b.id) });
      }
      if (action === 'submitReview') {
        const b = db.bookings.find((x) => String(x.id) === String(body.id) && x.token === body.token);
        if (!b) throw new Error('Запись не найдена или ссылка устарела');
        db.reviews = db.reviews || [];
        if (db.reviews.some((r) => r.bookingId === b.id)) throw new Error('Вы уже оставили отзыв — спасибо!');
        if (String(body.text || '').trim().length < 3) throw new Error('Напишите пару слов о визите');
        db.reviews.push({ id: Y.uid(), created: new Date().toISOString(), bookingId: b.id, name: String(body.name || b.name).trim() || 'Клиент', service: b.services, rating: Math.max(1, Math.min(5, +body.rating || 5)), text: String(body.text).trim(), rstatus: 'pending' });
        local.save(db);
        return ok();
      }
      if (action === 'bookingInfo') {
        const b = db.bookings.find((x) => String(x.id) === String(body.id) && x.token === body.token);
        if (!b) throw new Error('Запись не найдена или ссылка устарела');
        return ok({ booking: { date: b.date, start: b.start, end: b.end, services: b.services, status: b.status, name: b.name } });
      }
      // дальше — только для админа
      if (body.password !== db.password) {
        const e = new Error('Неверный пароль');
        e.code = 'auth';
        throw e;
      }
      switch (action) {
        case 'login': return ok();
        case 'adminData': return ok({ settings: db.settings, services: db.services, photos: db.photos, exceptions: db.exceptions, bookings: db.bookings, clientReviews: db.reviews || [], demo: true, version: Y.SERVER_VERSION });
        case 'saveReview': {
          const r = (db.reviews || []).find((x) => x.id === body.review.id);
          if (!r) throw new Error('Отзыв не найден');
          Object.assign(r, body.review);
          break;
        }
        case 'deleteReview': db.reviews = (db.reviews || []).filter((x) => x.id !== body.id); break;
        case 'saveSettings': db.settings = body.settings; break;
        case 'saveServices': db.services = body.services; break;
        case 'savePhotos': db.photos = body.photos; break;
        case 'saveExceptions': db.exceptions = body.exceptions; break;
        case 'saveBooking': {
          const b = body.booking;
          let cur = db.bookings.find((x) => x.id === b.id);
          const notified = [];
          if (cur) {
            const prev = cur.status;
            Object.assign(cur, b);
            if (!body.silent && prev !== cur.status && (cur.status === 'confirmed' || cur.status === 'cancelled') && cur.email && settings.notify.clientEmail) {
              notified.push('e-mail (демо — не отправлено)');
              local.addLog(cur, 'Клиенту: письмо «' + (cur.status === 'confirmed' ? 'подтверждение' : 'отмена') + '» (демо)');
            }
          } else {
            cur = Object.assign({ id: Y.uid(), created: new Date().toISOString(), source: 'Вручную', token: Y.uid(), log: '' }, b);
            db.bookings.push(cur);
          }
          local.save(db);
          return ok({ booking: cur, notified });
        }
        case 'deleteBooking': db.bookings = db.bookings.filter((x) => x.id !== body.id); break;
        case 'sendClientEmail': {
          const b = db.bookings.find((x) => x.id === body.id);
          if (!b || !Y.isEmail(b.email)) throw new Error('У клиента нет e-mail');
          local.addLog(b, 'Клиенту: письмо вручную (демо)');
          local.save(db);
          return ok({ message: 'Демо-режим: письмо не отправлено, но в рабочей версии уйдёт на ' + b.email });
        }
        case 'upload':
          if (/^audio\//.test(body.mime || '')) throw new Error('В демо-режиме музыку можно добавить только ссылкой');
          return ok({ url: 'data:' + (body.mime || 'image/jpeg') + ';base64,' + body.data, fileId: '' });
        case 'deleteFile': return ok();
        case 'changePassword': db.password = body.newPassword; break;
        case 'testEmail': case 'testClientEmail': return ok({ message: 'В демо-режиме письма не отправляются' });
        case 'resetDemo': localStorage.removeItem(DEMO_KEY); return ok();
        default: throw new Error('Неизвестное действие: ' + action);
      }
      local.save(db);
      return ok();
    }
  };

  function validateBooking(req, services, st) {
    const name = String(req.name || '').trim().slice(0, 80);
    const phone = Y.phoneDigits(req.phone);
    if (!name) throw new Error('Укажите имя');
    if (phone.length < 11) throw new Error('Проверьте номер телефона');
    if (req.email && !Y.isEmail(req.email)) throw new Error('Проверьте e-mail');
    const ids = (req.serviceIds || []).map(String);
    const chosen = services.filter((s) => ids.indexOf(String(s.id)) >= 0 && s.visible !== false);
    if (!chosen.length) throw new Error('Выберите услугу');
    const dur = chosen.reduce((a, s) => a + (+s.duration || 60), 0);
    const slot = Y.daySlots(req.date, dur, st).slots.find((s) => s.time === req.start);
    if (!slot || slot.status !== 'free') {
      const e = new Error('К сожалению, это время уже занято. Выберите другое.');
      e.code = 'taken';
      throw e;
    }
    return {
      id: Y.uid(), created: new Date().toISOString(), date: req.date, start: req.start, end: Y.fromMin(Y.toMin(req.start) + dur),
      services: chosen.map((s) => s.name).join(', '), serviceIds: chosen.map((s) => s.id).join(','),
      total: chosen.reduce((a, s) => a + (+s.priceFrom || 0), 0), name, phone: Y.fmtPhone(phone),
      email: String(req.email || '').trim().slice(0, 120), contact: String(req.contact || '').slice(0, 40),
      comment: String(req.comment || '').trim().slice(0, 1000), status: 'new', log: ''
    };
  }

  const delay = (fn, ms) => new Promise((res, rej) => setTimeout(() => { try { res(fn()); } catch (e) { rej(e); } }, ms));
  Y.api = {
    demo: !API_URL,
    publicData() {
      return API_URL ? remote('public', null, 'GET') : Promise.resolve(local.handle('public', {}));
    },
    call(action, data) {
      return API_URL ? remote(action, data) : delay(() => local.handle(action, data || {}), 600);
    },
    admin(action, body) {
      body = Object.assign({}, body || {}, { password: Y.api.password() });
      return API_URL ? remote(action, body) : delay(() => local.handle(action, body), 150);
    },
    password() {
      try { return sessionStorage.getItem('y_admin_pw') || ''; } catch (e) { return ''; }
    },
    setPassword(p) {
      try { p ? sessionStorage.setItem('y_admin_pw', p) : sessionStorage.removeItem('y_admin_pw'); } catch (e) {}
    }
  };

  /* Сжать изображение перед загрузкой (до maxSide px, JPEG) */
  Y.resizeImage = (file, maxSide, quality, type) =>
    new Promise((resolve, reject) => {
      const img = new Image();
      const url = URL.createObjectURL(file);
      img.onload = () => {
        const k = Math.min(1, (maxSide || 1800) / Math.max(img.width, img.height));
        const c = document.createElement('canvas');
        c.width = Math.round(img.width * k);
        c.height = Math.round(img.height * k);
        c.getContext('2d').drawImage(img, 0, 0, c.width, c.height);
        URL.revokeObjectURL(url);
        resolve(c.toDataURL(type || 'image/jpeg', quality || 0.86));
      };
      img.onerror = () => { URL.revokeObjectURL(url); reject(new Error('Не удалось прочитать изображение. Попробуйте JPG или PNG.')); };
      img.src = url;
    });
  /* Логотип на чёрном фоне → PNG с прозрачным фоном, обрезанный по содержимому */
  Y.knockoutBlack = (file, maxSide) =>
    new Promise((resolve, reject) => {
      const img = new Image();
      const url = URL.createObjectURL(file);
      img.onload = () => {
        const k = Math.min(1, (maxSide || 900) / Math.max(img.width, img.height));
        const c = document.createElement('canvas');
        c.width = Math.round(img.width * k); c.height = Math.round(img.height * k);
        const x = c.getContext('2d');
        x.drawImage(img, 0, 0, c.width, c.height);
        URL.revokeObjectURL(url);
        const d = x.getImageData(0, 0, c.width, c.height), a = d.data;
        let L = c.width, R = 0, T = c.height, B = 0;
        for (let i = 0; i < a.length; i += 4) {
          const m = Math.max(a[i], a[i + 1], a[i + 2]);
          const al = m < 30 ? 0 : Math.min(255, Math.round((m - 30) * 255 / 210));
          if (al) { const f = 255 / Math.max(m, 1); a[i] = Math.min(255, a[i] * f); a[i + 1] = Math.min(255, a[i + 1] * f); a[i + 2] = Math.min(255, a[i + 2] * f); }
          a[i + 3] = al;
          if (al > 30) { const p = i / 4, px = p % c.width, py = (p / c.width) | 0; if (px < L) L = px; if (px > R) R = px; if (py < T) T = py; if (py > B) B = py; }
        }
        x.putImageData(d, 0, 0);
        if (R < L) return resolve(c.toDataURL('image/png'));
        const w = R - L + 9, h = B - T + 9;
        const o = document.createElement('canvas');
        o.width = w; o.height = h;
        o.getContext('2d').drawImage(c, L - 4, T - 4, w, h, 0, 0, w, h);
        resolve(o.toDataURL('image/png'));
      };
      img.onerror = () => { URL.revokeObjectURL(url); reject(new Error('Не удалось прочитать изображение')); };
      img.src = url;
    });
  Y.fileToBase64 = (file) =>
    new Promise((resolve, reject) => {
      const r = new FileReader();
      r.onload = () => resolve(String(r.result).split(',')[1]);
      r.onerror = () => reject(new Error('Не удалось прочитать файл'));
      r.readAsDataURL(file);
    });

  /* Ссылки на календарь для клиента */
  Y.calLinks = (b, settings) => {
    const p = settings.profile;
    const tz = CFG.TZ || 'Europe/Moscow';
    const dt = (d, t) => d.replace(/-/g, '') + 'T' + t.replace(':', '') + '00';
    const title = 'Запись: ' + b.services + ' — ' + p.firstName + ' ' + p.lastName;
    const loc = [p.city, p.address].filter(Boolean).join(', ');
    const details = 'Мастер: ' + p.firstName + ' ' + p.lastName + ', ' + p.phone;
    const g = 'https://calendar.google.com/calendar/render?action=TEMPLATE&text=' + encodeURIComponent(title) +
      '&dates=' + dt(b.date, b.start) + '/' + dt(b.date, b.end) + '&ctz=' + encodeURIComponent(tz) +
      '&details=' + encodeURIComponent(details) + '&location=' + encodeURIComponent(loc);
    const ics = ['BEGIN:VCALENDAR', 'VERSION:2.0', 'PRODID:-//yakunin//booking//RU', 'BEGIN:VEVENT',
      'UID:' + (b.id || Y.uid()) + '@yakunin', 'DTSTAMP:' + new Date().toISOString().replace(/[-:]/g, '').slice(0, 15) + 'Z',
      'DTSTART;TZID=' + tz + ':' + dt(b.date, b.start), 'DTEND;TZID=' + tz + ':' + dt(b.date, b.end),
      'SUMMARY:' + title, 'DESCRIPTION:' + details, 'LOCATION:' + loc,
      'BEGIN:VALARM', 'TRIGGER:-PT3H', 'ACTION:DISPLAY', 'DESCRIPTION:' + title, 'END:VALARM',
      'END:VEVENT', 'END:VCALENDAR'].join('\r\n');
    return { google: g, ics: 'data:text/calendar;charset=utf-8,' + encodeURIComponent(ics) };
  };
})();
