/**
 * Бэкенд сайта «Александр Якунин» на Google Apps Script + Google Таблица.
 *
 * Установка — см. README.md. Коротко:
 *   1. Создать Google Таблицу → Расширения → Apps Script → вставить этот файл.
 *   2. Выполнить функцию setup() (выдать разрешения).
 *   3. Развернуть → Новое развёртывание → Веб-приложение
 *      (Запуск от имени: я, Доступ: все) → скопировать URL в js/config.js.
 * После обновления этого файла: Развернуть → Управление развёртываниями → ✏️ → Новая версия.
 */

var SH = { settings: 'Настройки', services: 'Услуги', photos: 'Фото', exceptions: 'График', bookings: 'Записи', reviews: 'Отзывы' };

var COLS = {
  services: [['id', 'ID'], ['cat', 'Категория'], ['name', 'Название'], ['desc', 'Описание'], ['priceFrom', 'Цена от'], ['priceTo', 'Цена до'], ['duration', 'Минут'], ['note', 'Примечание'], ['visible', 'Показывать'], ['icon', 'Иконка']],
  photos: [['id', 'ID'], ['url', 'Ссылка'], ['fileId', 'ID файла'], ['cat', 'Категория'], ['caption', 'Подпись']],
  exceptions: [['id', 'ID'], ['type', 'Тип'], ['from', 'Дата'], ['to', 'По дату'], ['start', 'С'], ['end', 'До'], ['note', 'Заметка']],
  reviews: [['id', 'ID'], ['created', 'Создан'], ['bookingId', 'ID записи'], ['name', 'Имя'], ['service', 'Услуга'], ['rating', 'Оценка'], ['text', 'Текст'], ['rstatus', 'Статус']],
  bookings: [['id', 'ID'], ['created', 'Создана'], ['date', 'Дата'], ['start', 'Начало'], ['end', 'Конец'], ['name', 'Имя'], ['phone', 'Телефон'], ['services', 'Услуги'], ['total', 'Сумма от, ₽'], ['status', 'Статус'], ['comment', 'Комментарий'], ['contact', 'Связь'], ['email', 'Email'], ['source', 'Источник'], ['serviceIds', 'ID услуг'], ['eventId', 'ID события'], ['token', 'Ключ отмены'], ['log', 'Уведомления']]
};
var TEXT_COLS = { date: 1, from: 1, to: 1, start: 1, end: 1, phone: 1, id: 1, serviceIds: 1, fileId: 1, token: 1, bookingId: 1 };
var STATUS_RU = { 'new': 'Новая', confirmed: 'Подтверждена', done: 'Выполнена', cancelled: 'Отменена' };
var EX_RU = { off: 'Выходной', busy: 'Занято', hours: 'Особые часы' };
var REV_RU = { pending: 'На модерации', approved: 'Опубликован', rejected: 'Скрыт' };

var DEFAULT_SCHEDULE = {
  days: { 1: { on: true, start: '10:00', end: '20:00' }, 2: { on: true, start: '10:00', end: '20:00' }, 3: { on: true, start: '10:00', end: '20:00' }, 4: { on: true, start: '10:00', end: '20:00' }, 5: { on: true, start: '10:00', end: '20:00' }, 6: { on: true, start: '11:00', end: '18:00' }, 0: { on: false, start: '11:00', end: '18:00' } },
  step: 30, horizon: 90, leadHours: 2, breakOn: false, breakStart: '14:00', breakEnd: '15:00'
};
var DEFAULT_NOTIFY = {
  ownerEmail: '', emailOnNew: true, dailyDigest: true, calendarAdd: true, calendarBusy: true, calendarId: '',
  clientEmailOnNew: true, clientEmail: true, clientEmailReminder: true, clientEmailReview: true,
  smsruOn: false, smsruKey: '', smsOnNew: false, smsOnConfirm: true, smsOnCancel: true, smsReminder: false,
  tplConfirm: 'Здравствуйте, {имя}! Ваша запись подтверждена: {дата} в {время} — {услуги}. {адрес}До встречи! Александр Якунин, {телефон}',
  tplCancel: 'Здравствуйте, {имя}! К сожалению, запись на {дата} в {время} отменена. Напишите или позвоните мне, подберём другое время: {телефон}. Александр',
  tplNew: 'Здравствуйте, {имя}! Заявка на {дата} в {время} ({услуги}) получена. Я свяжусь с вами для подтверждения. Александр Якунин',
  tplReminder: 'Напоминаю: завтра в {время} вы записаны — {услуги}. {адрес}Если планы изменились, дайте знать: {телефон}. Александр'
};
var DEFAULT_SERVICES = [
  { id: 's1', cat: 'Стрижки', name: 'Мужская стрижка', desc: 'Консультация, мытьё головы, стрижка и укладка', priceFrom: 1000, priceTo: 1250, duration: 60, note: '', visible: true, icon: 'comb' },
  { id: 's2', cat: 'Стрижки', name: 'Женская стрижка', desc: 'Подбор формы под тип лица и волос, мытьё, укладка', priceFrom: 1500, priceTo: 2000, duration: 90, note: '', visible: true, icon: 'scissors' },
  { id: 's3', cat: 'Окрашивание', name: 'Сложное окрашивание', desc: 'Airtouch, балаяж, шатуш, тонирование', priceFrom: 3500, priceTo: 5000, duration: 180, note: 'без учёта материалов', visible: true, icon: 'color' },
  { id: 's4', cat: 'Укладки и причёски', name: 'Укладка', desc: 'Повседневная или вечерняя укладка', priceFrom: 2000, priceTo: 2500, duration: 60, note: '', visible: true, icon: 'dryer' },
  { id: 's5', cat: 'Укладки и причёски', name: 'Причёска', desc: 'Вечерняя, свадебная, для фотосессии', priceFrom: 2000, priceTo: 2500, duration: 90, note: '', visible: true, icon: 'crown' },
  { id: 's6', cat: 'Макияж', name: 'Макияж', desc: 'Дневной, вечерний, для съёмки или события', priceFrom: 2000, priceTo: 3000, duration: 60, note: '', visible: true, icon: 'lips' }
];
var VERSION = 4;
var DEFAULT_PASSWORD = 'yakunin2026';
var PUBLIC_ACTIONS = { 'public': 1, book: 1, clientCancel: 1, bookingInfo: 1, version: 1, submitReview: 1, reviewInfo: 1 };
var CACHE_KEY = 'public_v2';

/* ======================= Точки входа ======================= */

function doGet(e) {
  var action = (e && e.parameter && e.parameter.action) || 'public';
  if (action === 'owner') return ownerPage_(e.parameter);
  return route_(action, {});
}

function doPost(e) {
  var req;
  try { req = JSON.parse(e.postData.contents); } catch (err) { return json_({ ok: false, error: 'Некорректный запрос' }); }
  return route_(req.action, req);
}

function route_(action, req) {
  try {
    var h = HANDLERS[action];
    if (!h) throw new Error('Неизвестное действие: ' + action + '. Возможно, нужно обновить развёртывание скрипта.');
    if (!PUBLIC_ACTIONS[action]) checkAuth_(req.password);
    var res = h(req) || {};
    res.ok = true;
    return json_(res);
  } catch (err) {
    return json_({ ok: false, error: String(err && err.message || err), code: err && err.code });
  }
}

function json_(o) {
  return ContentService.createTextOutput(JSON.stringify(o)).setMimeType(ContentService.MimeType.JSON);
}

var HANDLERS = {
  'public': function () { return getPublic_(); },
  version: function () { return { version: VERSION, services: readTable_('services').length, passwordSet: !!PropertiesService.getScriptProperties().getProperty('ADMIN_PASSWORD') }; },
  book: function (req) { return book_(req); },
  clientCancel: function (req) { return clientCancel_(req); },
  bookingInfo: function (req) {
    var b = findByToken_(req.id, req.token);
    return { booking: { date: b.date, start: b.start, end: b.end, services: b.services, status: b.status, name: b.name } };
  },
  reviewInfo: function (req) {
    var b = findByToken_(req.id, req.token);
    var done = readTable_('reviews').some(function (r) { return String(r.bookingId) === String(b.id); });
    return { booking: { name: String(b.name || '').split(' ')[0], services: b.services, date: b.date }, reviewed: done };
  },
  submitReview: function (req) { return submitReview_(req); },
  saveReview: function (req) {
    var r = req.review || {};
    var cur = readTable_('reviews').filter(function (x) { return String(x.id) === String(r.id); })[0];
    if (!cur) throw new Error('Отзыв не найден');
    ['name', 'service', 'text', 'rating', 'rstatus'].forEach(function (k) { if (r[k] !== undefined) cur[k] = r[k]; });
    updateRowById_('reviews', cur);
    clearCache_();
    return { review: cur };
  },
  deleteReview: function (req) { deleteRowById_('reviews', req.id); clearCache_(); return {}; },
  login: function () { return {}; },
  adminData: function () {
    var since = addDays_(today_(), -120);
    return {
      settings: readSettings_(),
      services: readServices_(),
      photos: readTable_('photos'),
      exceptions: readTable_('exceptions'),
      bookings: readBookings_().filter(function (b) { return b.date >= since; }),
      clientReviews: readTable_('reviews'),
      version: VERSION
    };
  },
  saveSettings: function (req) {
    writeSettings_(req.settings || {});
    ensureTriggers_();
    return {};
  },
  saveServices: function (req) { writeTable_('services', req.services || []); clearCache_(); return {}; },
  savePhotos: function (req) { writeTable_('photos', req.photos || []); clearCache_(); return {}; },
  saveExceptions: function (req) {
    var t = today_();
    var list = (req.exceptions || []).filter(function (e) { return (e.to || e.from) >= addDays_(t, -30); });
    writeTable_('exceptions', list);
    clearCache_();
    return {};
  },
  saveBooking: function (req) { return saveBooking_(req.booking || {}, req.silent); },
  deleteBooking: function (req) {
    var lock = LockService.getScriptLock(); lock.waitLock(20000);
    try {
      var b = readBookings_().filter(function (x) { return String(x.id) === String(req.id); })[0];
      if (b) { deleteEvent_(b); deleteRowById_('bookings', b.id); }
    } finally { lock.releaseLock(); }
    clearCache_();
    return {};
  },
  sendClientEmail: function (req) {
    var settings = readSettings_();
    var b = readBookings_().filter(function (x) { return String(x.id) === String(req.id); })[0];
    if (!b) throw new Error('Запись не найдена');
    if (!isEmail_(b.email)) throw new Error('У клиента не указан e-mail');
    sendClientMail_(b, settings, req.kind || 'custom', req.text);
    addLog_(b, 'Клиенту: письмо вручную');
    updateRowById_('bookings', b);
    return { message: 'Письмо отправлено на ' + b.email };
  },
  upload: function (req) {
    if (!req.data) throw new Error('Нет файла');
    var mime = req.mime || 'image/jpeg';
    var blob = Utilities.newBlob(Utilities.base64Decode(req.data), mime, req.name || 'file');
    var file = photoFolder_().createFile(blob);
    file.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW);
    var id = file.getId();
    var url = /^audio\//.test(mime) ? 'https://drive.google.com/uc?export=download&id=' + id : 'https://lh3.googleusercontent.com/d/' + id;
    return { fileId: id, url: url };
  },
  deleteFile: function (req) {
    try { DriveApp.getFileById(req.fileId).setTrashed(true); } catch (e) {}
    return {};
  },
  changePassword: function (req) {
    var p = String(req.newPassword || '');
    if (p.length < 6) throw new Error('Пароль слишком короткий');
    PropertiesService.getScriptProperties().setProperty('ADMIN_PASSWORD', p);
    return {};
  },
  testEmail: function () {
    var settings = readSettings_();
    var to = ownerEmail_(settings);
    MailApp.sendEmail({ to: to, subject: 'Тест: уведомления с сайта работают', htmlBody: emailHtml_(settings, { title: 'Всё работает', text: 'Сюда будут приходить письма о новых записях и вечерняя сводка на завтра.' }), name: 'Сайт — онлайн-запись' });
    return { message: 'Письмо отправлено на ' + to };
  },
  testClientEmail: function () {
    var settings = readSettings_();
    var to = ownerEmail_(settings);
    var demo = { id: 'demo', token: 'demo', name: 'Мария Иванова', date: addDays_(today_(), 2), start: '12:00', end: '13:30', services: 'Женская стрижка', total: 1500, email: to, phone: '+7 (900) 000-00-00' };
    sendClientMail_(demo, settings, 'confirm');
    return { message: 'Пример письма клиенту отправлен на ' + to };
  }
};

/* ======================= Авторизация ======================= */

function checkAuth_(password) {
  var props = PropertiesService.getScriptProperties();
  var real = props.getProperty('ADMIN_PASSWORD');
  if (!real) { real = DEFAULT_PASSWORD; props.setProperty('ADMIN_PASSWORD', real); } // setup() не запускали
  var cache = CacheService.getScriptCache();
  var fails = +(cache.get('auth_fails') || 0);
  if (fails >= 15) { var e0 = new Error('Слишком много попыток входа. Подождите 10 минут.'); e0.code = 'auth'; throw e0; }
  if (!real || String(password || '') !== real) {
    cache.put('auth_fails', String(fails + 1), 600);
    Utilities.sleep(700);
    var e = new Error('Неверный пароль'); e.code = 'auth'; throw e;
  }
}

/* ======================= Публичные данные ======================= */

function getPublic_() {
  var hit = CacheService.getScriptCache().get(CACHE_KEY);
  if (hit) return JSON.parse(hit);
  return buildPublic_();
}

/** Собрать публичные данные и положить в кэш (15 минут). */
function buildPublic_() {
  var settings = readSettings_();
  var pub = JSON.parse(JSON.stringify(settings));
  delete pub.notify;
  var t = today_();
  var res = {
    settings: pub,
    services: readServices_().filter(function (s) { return s.visible !== false; }),
    photos: readTable_('photos'),
    exceptions: readTable_('exceptions').filter(function (e) { return (e.to || e.from) >= t; }).map(function (e) {
      return { id: e.id, type: e.type, from: e.from, to: e.to, start: e.start, end: e.end, note: e.type === 'off' ? e.note : '' };
    }),
    busy: collectBusy_(settings, t),
    tz: Session.getScriptTimeZone(),
    clientReviews: publicReviews_(),
    version: VERSION
  };
  try { CacheService.getScriptCache().put(CACHE_KEY, JSON.stringify(res), 900); } catch (e) {}
  return res;
}

/** Триггер каждые 10 минут: держит кэш «тёплым», чтобы сайт открывался быстро
 *  и подхватывал события из Google Календаря. */
function warmCache() { buildPublic_(); }

function clearCache_() { CacheService.getScriptCache().remove(CACHE_KEY); }

function collectBusy_(settings, fromDate) {
  var busy = readBookings_().filter(function (b) { return b.status !== 'cancelled' && b.date >= fromDate; })
    .map(function (b) { return { d: b.date, s: toMin_(b.start), e: toMin_(b.end) }; });
  if ((settings.notify || {}).calendarBusy) {
    try { busy = busy.concat(calendarBusy_(settings, fromDate)); } catch (e) { console.warn('calendar busy: ' + e); }
  }
  return busy;
}

function calendarBusy_(settings, fromDate) {
  var cal = getCalendar_(settings);
  if (!cal) return [];
  var horizon = +((settings.schedule || {}).horizon) || 30;
  var out = [];
  cal.getEvents(parseDate_(fromDate), parseDate_(addDays_(fromDate, horizon + 1))).forEach(function (ev) {
    if (ev.getTag('bookingId')) return; // событие создано самим сайтом — уже учтено
    if (ev.isAllDayEvent()) {
      var d = ev.getAllDayStartDate(), last = ev.getAllDayEndDate();
      while (d < last) { out.push({ d: fmtDate_(d), s: 0, e: 1440 }); d = new Date(d.getTime() + 864e5); }
      return;
    }
    var s = ev.getStartTime(), e = ev.getEndTime();
    var cur = fmtDate_(s), endKey = fmtDate_(e);
    var sMin = s.getHours() * 60 + s.getMinutes();
    while (cur <= endKey) {
      var eMin = cur === endKey ? e.getHours() * 60 + e.getMinutes() : 1440;
      if (eMin > sMin) out.push({ d: cur, s: sMin, e: eMin });
      cur = addDays_(cur, 1); sMin = 0;
    }
  });
  return out;
}

/* ======================= Запись клиента ======================= */

function book_(req) {
  if (req.website) return { booking: { id: 'x' } }; // бот заполнил скрытое поле
  var name = String(req.name || '').trim().slice(0, 80);
  var phone = phoneDigits_(req.phone);
  var email = String(req.email || '').trim().slice(0, 120);
  if (!name) throw new Error('Укажите имя');
  if (phone.length !== 11) throw new Error('Проверьте номер телефона');
  if (email && !isEmail_(email)) throw new Error('Проверьте e-mail');
  if (!/^\d{4}-\d{2}-\d{2}$/.test(req.date || '') || !/^\d{2}:\d{2}$/.test(req.start || '')) throw new Error('Выберите дату и время');

  var lock = LockService.getScriptLock();
  lock.waitLock(25000);
  var booking, settings;
  try {
    settings = readSettings_();
    if (settings.site && settings.site.bookingOn === false) throw new Error('Онлайн-запись сейчас выключена');
    var ids = (req.serviceIds || []).map(String);
    var chosen = readServices_().filter(function (s) { return ids.indexOf(String(s.id)) >= 0 && s.visible !== false; });
    if (!chosen.length) throw new Error('Выберите услугу');
    var dur = chosen.reduce(function (a, s) { return a + (+s.duration || 60); }, 0);

    var t = today_();
    var samePhone = readBookings_().filter(function (b) { return b.status !== 'cancelled' && b.date >= t && phoneDigits_(b.phone) === phone; });
    if (samePhone.length >= 3) throw new Error('У вас уже есть несколько активных записей. Позвоните, если нужно больше.');

    var st = { schedule: settings.schedule, exceptions: readTable_('exceptions'), busy: collectBusy_(settings, t) };
    var slot = daySlots_(req.date, dur, st).filter(function (x) { return x.time === req.start; })[0];
    if (!slot || slot.status !== 'free') { var e = new Error('К сожалению, это время уже заняли. Выберите другое.'); e.code = 'taken'; throw e; }

    booking = {
      id: Utilities.getUuid().slice(0, 8),
      created: new Date(),
      date: req.date,
      start: req.start,
      end: fromMin_(toMin_(req.start) + dur),
      name: name,
      phone: fmtPhone_(phone),
      services: chosen.map(function (s) { return s.name; }).join(', '),
      total: chosen.reduce(function (a, s) { return a + (+s.priceFrom || 0); }, 0),
      status: 'new',
      comment: String(req.comment || '').trim().slice(0, 1000),
      contact: String(req.contact || '').slice(0, 40),
      email: email,
      source: 'Сайт',
      serviceIds: chosen.map(function (s) { return s.id; }).join(','),
      eventId: '',
      token: Utilities.getUuid().replace(/-/g, '').slice(0, 16),
      log: ''
    };
    booking.eventId = upsertEvent_(booking, settings) || '';
    appendRow_('bookings', booking);
  } finally {
    lock.releaseLock();
  }
  clearCache_();

  // Уведомления — после записи; ошибки не отменяют запись
  var n = settings.notify || {};
  var emailed = false;
  if (n.emailOnNew) { try { notifyOwnerNew_(booking, settings); } catch (e) { console.warn(e); } }
  if (booking.email && n.clientEmailOnNew) {
    try { sendClientMail_(booking, settings, 'new'); addLog_(booking, 'Клиенту: письмо «заявка получена»'); emailed = true; }
    catch (e) { addLog_(booking, 'Ошибка письма клиенту: ' + e.message); }
  }
  if (n.smsruOn && n.smsOnNew) {
    try { sendSms_(booking.phone, fill_(n.tplNew, booking, settings), settings); addLog_(booking, 'Клиенту: SMS «заявка получена»'); }
    catch (e) { addLog_(booking, 'Ошибка SMS: ' + e.message); }
  }
  if (booking.log) { try { updateRowById_('bookings', booking); } catch (e) {} }

  return { booking: { id: booking.id, date: booking.date, start: booking.start, end: booking.end, services: booking.services, total: booking.total }, emailed: emailed };
}

function findByToken_(id, token) {
  var b = readBookings_().filter(function (x) { return String(x.id) === String(id); })[0];
  if (!b || !token || String(b.token) !== String(token)) throw new Error('Запись не найдена или ссылка устарела');
  return b;
}

function clientCancel_(req) {
  var settings = readSettings_();
  var lock = LockService.getScriptLock(); lock.waitLock(20000);
  var b;
  try {
    b = findByToken_(req.id, req.token);
    if (b.status === 'cancelled') return { booking: b, already: true };
    if (b.status === 'done' || b.date < today_()) throw new Error('Эту запись уже нельзя отменить');
    b.status = 'cancelled';
    deleteEvent_(b); b.eventId = '';
    addLog_(b, 'Отменена клиентом по ссылке из письма');
    updateRowById_('bookings', b);
  } finally { lock.releaseLock(); }
  clearCache_();
  try {
    MailApp.sendEmail({
      to: ownerEmail_(settings), subject: '❌ Клиент отменил запись: ' + b.name + ', ' + fmtDateRu_(b.date) + ' ' + b.start,
      htmlBody: emailHtml_(settings, { title: 'Клиент отменил запись', text: b.name + ' отменил(а) запись по ссылке из письма. Время снова свободно для записи.', rows: [['Когда', fmtDateRu_(b.date, true) + ', ' + b.start], ['Услуги', b.services], ['Телефон', b.phone]] }),
      name: 'Сайт — онлайн-запись'
    });
  } catch (e) { console.warn(e); }
  return { booking: { date: b.date, start: b.start, services: b.services } };
}

/* ======================= Изменение записи (админ) ======================= */

function saveBooking_(patch, silent) {
  var settings = readSettings_();
  var n = settings.notify || {};
  var lock = LockService.getScriptLock();
  lock.waitLock(20000);
  var b, prevStatus, isNew = false;
  try {
    b = patch.id ? readBookings_().filter(function (x) { return String(x.id) === String(patch.id); })[0] : null;
    if (!b) {
      isNew = true;
      b = { id: Utilities.getUuid().slice(0, 8), created: new Date(), source: 'Вручную', status: 'confirmed', eventId: '', email: '', contact: '', comment: '', serviceIds: '', total: 0, token: Utilities.getUuid().replace(/-/g, '').slice(0, 16), log: '' };
    }
    prevStatus = isNew ? '' : b.status;
    ['date', 'start', 'end', 'name', 'phone', 'services', 'serviceIds', 'total', 'status', 'comment', 'email', 'contact'].forEach(function (k) {
      if (patch[k] !== undefined) b[k] = patch[k];
    });
    if (!b.token) b.token = Utilities.getUuid().replace(/-/g, '').slice(0, 16);
    if (b.status === 'cancelled') { deleteEvent_(b); b.eventId = ''; }
    else b.eventId = upsertEvent_(b, settings) || b.eventId || '';
    if (isNew) appendRow_('bookings', b);
    else updateRowById_('bookings', b);
  } finally {
    lock.releaseLock();
  }
  clearCache_();

  var notified = [];
  if (!silent && prevStatus !== b.status && b.status === 'done' && n.clientEmailReview && isEmail_(b.email) && siteUrl_(settings)) {
    try { sendClientMail_(b, settings, 'review'); notified.push('e-mail с просьбой об отзыве'); addLog_(b, 'Клиенту: письмо «оставьте отзыв»'); updateRowById_('bookings', b); }
    catch (e) { addLog_(b, 'Ошибка письма: ' + e.message); }
  }
  if (!silent && prevStatus !== b.status && (b.status === 'confirmed' || b.status === 'cancelled')) {
    var kind = b.status === 'confirmed' ? 'confirm' : 'cancel';
    if (n.clientEmail && isEmail_(b.email)) {
      try { sendClientMail_(b, settings, kind); notified.push('e-mail'); addLog_(b, 'Клиенту: письмо «' + (kind === 'confirm' ? 'подтверждение' : 'отмена') + '»'); }
      catch (e) { addLog_(b, 'Ошибка письма: ' + e.message); }
    }
    if (n.smsruOn && n[kind === 'confirm' ? 'smsOnConfirm' : 'smsOnCancel']) {
      try { if (sendSms_(b.phone, fill_(n[kind === 'confirm' ? 'tplConfirm' : 'tplCancel'], b, settings), settings)) { notified.push('SMS'); addLog_(b, 'Клиенту: SMS'); } }
      catch (e) { addLog_(b, 'Ошибка SMS: ' + e.message); }
    }
    if (notified.length || b.log) updateRowById_('bookings', b);
  }
  return { booking: b, notified: notified };
}

/* ======================= Расчёт свободного времени ======================= */

function dayHours_(date, st) {
  var ex = st.exceptions || [];
  for (var i = 0; i < ex.length; i++) {
    var e = ex[i];
    if (e.type === 'off' && date >= e.from && date <= (e.to || e.from)) return { open: false };
  }
  var h = ex.filter(function (e) { return e.type === 'hours' && e.from === date; })[0];
  if (h) return { open: true, start: toMin_(h.start), end: toMin_(h.end) };
  var d = (st.schedule.days || {})[String(parseDate_(date).getDay())];
  if (!d || !d.on) return { open: false };
  return { open: true, start: toMin_(d.start), end: toMin_(d.end) };
}

function daySlots_(date, dur, st) {
  var h = dayHours_(date, st);
  if (!h.open) return [];
  var step = Math.max(5, +st.schedule.step || 30);
  var busy = (st.busy || []).filter(function (b) { return b.d === date; }).map(function (b) { return [b.s, b.e]; });
  (st.exceptions || []).forEach(function (e) { if (e.type === 'busy' && e.from === date) busy.push([toMin_(e.start), toMin_(e.end)]); });
  if (st.schedule.breakOn) busy.push([toMin_(st.schedule.breakStart), toMin_(st.schedule.breakEnd)]);
  var now = new Date();
  var nowKey = fmtDate_(now);
  var minAbs = dayIndex_(nowKey) * 1440 + now.getHours() * 60 + now.getMinutes() + (+st.schedule.leadHours || 0) * 60;
  var horizonEnd = addDays_(nowKey, (+st.schedule.horizon || 30));
  var base = dayIndex_(date) * 1440;
  var ov = function (a, b) { return busy.some(function (x) { return a < x[1] && b > x[0]; }); };
  var out = [];
  for (var t = h.start; t < h.end; t += step) {
    var status;
    if (base + t < minAbs || date >= horizonEnd) status = 'past';
    else if (ov(t, Math.min(t + step, h.end))) status = 'busy';
    else if (t + dur <= h.end && !ov(t, t + dur)) status = 'free';
    else status = 'short';
    out.push({ time: fromMin_(t), status: status });
  }
  return out;
}

/* ======================= Google Календарь ======================= */

function getCalendar_(settings) {
  var id = ((settings.notify || {}).calendarId || '').trim();
  if (id) { var c = CalendarApp.getCalendarById(id); if (c) return c; }
  return CalendarApp.getDefaultCalendar();
}

function upsertEvent_(b, settings) {
  if (!(settings.notify || {}).calendarAdd) return b.eventId || '';
  try {
    var cal = getCalendar_(settings);
    var start = dateTime_(b.date, b.start), end = dateTime_(b.date, b.end);
    var mark = b.status === 'confirmed' ? '✅ ' : b.status === 'done' ? '✔ ' : '🆕 ';
    var title = mark + b.name + ' — ' + b.services;
    var desc = 'Телефон: ' + b.phone + (b.contact ? '\nСвязь: ' + b.contact : '') + (b.email ? '\nEmail: ' + b.email : '') +
      (b.comment ? '\nКомментарий: ' + b.comment : '') + '\nСумма от: ' + b.total + ' ₽\nСтатус: ' + (STATUS_RU[b.status] || b.status);
    var ev = null;
    if (b.eventId) { try { ev = cal.getEventById(b.eventId); } catch (e) { ev = null; } }
    if (ev) {
      ev.setTitle(title); ev.setTime(start, end); ev.setDescription(desc);
    } else {
      ev = cal.createEvent(title, start, end, { description: desc });
      ev.setTag('bookingId', String(b.id));
      try { ev.removeAllReminders(); ev.addPopupReminder(60); } catch (e) {}
    }
    return ev.getId();
  } catch (e) {
    console.warn('calendar: ' + e);
    return b.eventId || '';
  }
}

function deleteEvent_(b) {
  if (!b.eventId) return;
  try {
    var ev = getCalendar_(readSettings_()).getEventById(b.eventId);
    if (ev) ev.deleteEvent();
  } catch (e) { console.warn(e); }
}

/* ======================= Письма ======================= */

function ownerEmail_(settings) {
  return ((settings.notify || {}).ownerEmail || '').trim() || Session.getEffectiveUser().getEmail();
}
function fullName_(settings) {
  var p = settings.profile || {};
  return ((p.firstName || 'Александр') + ' ' + (p.lastName || 'Якунин')).trim();
}
function siteUrl_(settings) {
  return String(((settings.site || {}).siteUrl) || '').replace(/[#?].*$/, '').replace(/\/+$/, '');
}
function accent_(settings) {
  var a = (settings.site || {}).accent;
  return /^#[0-9a-f]{6}$/i.test(a || '') ? a : '#d4af37';
}

/** Общий шаблон письма: тёмный, с акцентным цветом сайта */
function emailHtml_(settings, o) {
  var acc = accent_(settings);
  var site = siteUrl_(settings);
  var logo = (settings.site || {}).logo;
  var logoUrl = logo && logo.fileId ? 'https://lh3.googleusercontent.com/d/' + logo.fileId + '=w300' : (site ? site + '/img/logo_square.jpg' : '');
  var rows = (o.rows || []).filter(function (r) { return r[1]; }).map(function (r) {
    return '<tr><td style="padding:10px 0;border-bottom:1px solid #2a2a2a;color:#9a9a9a;font-size:14px;width:40%">' + esc_(r[0]) + '</td><td style="padding:10px 0;border-bottom:1px solid #2a2a2a;color:#f0f0f0;font-size:15px;font-weight:600">' + esc_(r[1]) + '</td></tr>';
  }).join('');
  var btns = (o.buttons || []).map(function (b, i) {
    return '<a href="' + esc_(b[1]) + '" style="display:inline-block;margin:6px 8px 0 0;padding:13px 22px;border-radius:30px;text-decoration:none;font-weight:600;font-size:14px;' +
      (i === 0 ? 'background:' + acc + ';color:#0a0a0a' : 'border:1px solid #444;color:#f0f0f0') + '">' + esc_(b[0]) + '</a>';
  }).join('');
  var p = settings.profile || {};
  return '<div style="background:#0a0a0a;padding:32px 12px;font-family:Arial,Helvetica,sans-serif">' +
    '<div style="max-width:560px;margin:0 auto;background:#141414;border:1px solid #262626;border-radius:18px;overflow:hidden">' +
    (logoUrl ? '<div style="text-align:center;padding:26px 0 0"><img src="' + logoUrl + '" width="110" height="110" alt="" style="border-radius:12px"></div>' : '') +
    '<div style="padding:26px 30px 30px">' +
    '<div style="width:40px;height:2px;background:' + acc + ';margin:0 0 18px"></div>' +
    '<h1 style="margin:0 0 14px;color:#f0f0f0;font-size:24px;font-weight:700;letter-spacing:.3px">' + esc_(o.title || '') + '</h1>' +
    (o.text ? '<p style="margin:0 0 18px;color:#d0d0d0;font-size:15px;line-height:1.6;white-space:pre-line">' + esc_(o.text) + '</p>' : '') +
    (rows ? '<table style="width:100%;border-collapse:collapse;margin:0 0 16px">' + rows + '</table>' : '') +
    btns +
    (o.after || '') +
    (o.note ? '<p style="margin:22px 0 0;color:#8a8a8a;font-size:13px;line-height:1.5">' + o.note + '</p>' : '') +
    '</div>' +
    '<div style="padding:16px 30px;border-top:1px solid #262626;color:#8a8a8a;font-size:12px">' + esc_(fullName_(settings)) + (p.phone ? ' · ' + esc_(p.phone) : '') + (site ? ' · <a href="' + site + '" style="color:' + acc + '">' + esc_(site.replace(/^https?:\/\//, '')) + '</a>' : '') + '</div>' +
    '</div></div>';
}

/** Письмо клиенту: kind = new | confirm | cancel | reminder | custom */
function sendClientMail_(b, settings, kind, customText) {
  var n = settings.notify || {};
  var p = settings.profile || {};
  var site = siteUrl_(settings);
  var cfg = {
    'new': ['Заявка на запись получена', n.tplNew],
    confirm: ['Запись подтверждена', n.tplConfirm],
    cancel: ['Запись отменена', n.tplCancel],
    reminder: ['Напоминание о записи', n.tplReminder],
    review: ['Спасибо за визит!', 'Здравствуйте, {имя}! Спасибо, что выбрали меня. Буду благодарен, если вы оставите пару слов о визите — это займёт минуту. Александр'],
    custom: ['Сообщение от мастера', customText || n.tplConfirm]
  }[kind] || ['Запись', ''];
  var text = customText || fill_(cfg[1], b, settings);
  var addr = [p.city, p.address].filter(String).join(', ');
  var buttons = [];
  var cancelUrl = site && b.token && kind !== 'cancel' ? site + '/#cancel=' + b.id + '.' + b.token : '';
  var reviewUrl = site && b.token ? site + '/#review=' + b.id + '.' + b.token : '';
  if (kind === 'cancel') { if (site) buttons.push(['Записаться снова', site + '/#booking']); }
  else if (kind === 'review') { if (reviewUrl) buttons.push(['Оставить отзыв', reviewUrl]); }
  else {
    if (kind === 'confirm') buttons.push(['Добавить в Google Календарь', gcalUrl_(b, settings)]);
    if (p.phone) buttons.push(['Позвонить мастеру', 'tel:+' + phoneDigits_(p.phone)]);
    if (cancelUrl) buttons.push(['Отменить запись', cancelUrl]);
  }
  var html = emailHtml_(settings, {
    title: cfg[0],
    text: text,
    rows: kind === 'custom' || kind === 'review' ? [] : [['Когда', fmtDateRu_(b.date, true) + ', ' + b.start + '–' + b.end], ['Услуги', b.services], ['Стоимость', b.total ? 'от ' + b.total + ' ₽' : ''], ['Адрес', p.address ? addr : ''], ['Мастер', fullName_(settings)]],
    buttons: buttons,
    after: reviewUrl && kind !== 'review' && kind !== 'cancel' ? '<p style="margin:20px 0 0;font-size:13px;color:#8a8a8a">После визита будем рады вашему отзыву: <a href="' + reviewUrl + '" style="color:' + accent_(settings) + '">оставить отзыв</a></p>' : '',
    note: kind === 'confirm' ? 'Если планы изменятся, пожалуйста, предупредите заранее.' : ''
  });
  var mail = { to: b.email, subject: cfg[0] + ' — ' + fullName_(settings), htmlBody: html, body: text, name: fullName_(settings) };
  var reply = String(p.email || '').trim() || ownerEmail_(settings);
  if (isEmail_(reply)) mail.replyTo = reply;
  MailApp.sendEmail(mail);
}

function gcalUrl_(b, settings) {
  var p = settings.profile || {};
  var dt = function (d, t) { return d.replace(/-/g, '') + 'T' + t.replace(':', '') + '00'; };
  return 'https://calendar.google.com/calendar/render?action=TEMPLATE&text=' + encodeURIComponent('Запись: ' + b.services + ' — ' + fullName_(settings)) +
    '&dates=' + dt(b.date, b.start) + '/' + dt(b.date, b.end) + '&ctz=' + encodeURIComponent(Session.getScriptTimeZone()) +
    '&details=' + encodeURIComponent('Мастер: ' + fullName_(settings) + ' ' + (p.phone || '')) + '&location=' + encodeURIComponent([p.city, p.address].filter(String).join(', '));
}

function notifyOwnerNew_(b, settings) {
  var d = phoneDigits_(b.phone);
  var site = siteUrl_(settings);
  var buttons = [['✓ Подтвердить', ownerLink_('b', b.id, 'confirm')], ['✕ Отказать', ownerLink_('b', b.id, 'reject')]];
  if (site) buttons.push(['Открыть панель мастера', site + '/#admin']);
  MailApp.sendEmail({
    to: ownerEmail_(settings),
    subject: '🆕 Запись: ' + b.name + ', ' + fmtDateRu_(b.date) + ' ' + b.start,
    htmlBody: emailHtml_(settings, {
      title: 'Новая запись: ' + b.name,
      rows: [['Когда', fmtDateRu_(b.date, true) + ', ' + b.start + '–' + b.end], ['Услуги', b.services], ['Сумма от', b.total + ' ₽'], ['Телефон', b.phone], ['Связь', b.contact], ['E-mail', b.email], ['Комментарий', b.comment]],
      buttons: buttons,
      after: '<p style="margin:14px 0 0;font-size:13px"><a href="tel:+' + d + '" style="color:' + accent_(settings) + '">Позвонить клиенту: ' + esc_(b.phone) + '</a></p>',
      note: 'Кнопки «Подтвердить» и «Отказать» сразу меняют статус в таблице и календаре' + (b.email ? ' и отправляют клиенту письмо.' : '. У клиента нет e-mail — сообщите ему по телефону.')
    }),
    name: 'Сайт — онлайн-запись'
  });
}

function sendSms_(phone, text, settings) {
  var n = settings.notify || {};
  if (!n.smsruOn || !n.smsruKey) return false;
  var res = UrlFetchApp.fetch('https://sms.ru/sms/send', {
    method: 'post', muteHttpExceptions: true,
    payload: { api_id: n.smsruKey, to: phoneDigits_(phone), msg: text, json: 1 }
  });
  var j = JSON.parse(res.getContentText() || '{}');
  if (j.status !== 'OK') throw new Error('SMS.ru: ' + (j.status_text || res.getContentText()));
  var sms = j.sms && j.sms[phoneDigits_(phone)];
  return !sms || sms.status === 'OK';
}

function addLog_(b, text) {
  var line = Utilities.formatDate(new Date(), tz_(), 'dd.MM HH:mm') + ' ' + text;
  b.log = (b.log ? b.log + '\n' : '') + line;
}

/** Ежедневно ~20:00: сводка мастеру и напоминания клиентам на завтра. */
function dailyDigest() {
  var settings = readSettings_();
  var n = settings.notify || {};
  var tomorrow = addDays_(today_(), 1);
  var list = readBookings_().filter(function (b) { return b.date === tomorrow && b.status !== 'cancelled'; })
    .sort(function (a, b) { return a.start < b.start ? -1 : 1; });
  if (n.dailyDigest && list.length) {
    MailApp.sendEmail({
      to: ownerEmail_(settings), subject: 'Записи на завтра: ' + list.length, name: 'Сайт — онлайн-запись',
      htmlBody: emailHtml_(settings, {
        title: 'Завтра, ' + fmtDateRu_(tomorrow, true),
        rows: list.map(function (b) { return [b.start + '–' + b.end, b.name + ' · ' + b.services + ' · ' + b.phone + (b.status === 'new' ? ' (не подтверждена)' : '')]; })
      })
    });
  }
  list.forEach(function (b) {
    if (b.status !== 'confirmed') return;
    var changed = false;
    if (n.smsruOn && n.smsReminder) { try { sendSms_(b.phone, fill_(n.tplReminder, b, settings), settings); addLog_(b, 'Клиенту: SMS-напоминание'); changed = true; } catch (e) { console.warn(e); } }
    if (n.clientEmailReminder && isEmail_(b.email)) { try { sendClientMail_(b, settings, 'reminder'); addLog_(b, 'Клиенту: письмо-напоминание'); changed = true; } catch (e) { console.warn(e); } }
    if (changed) updateRowById_('bookings', b);
  });
}

function fill_(tpl, b, settings) {
  var p = settings.profile || {};
  var addr = [p.city, p.address].filter(String).join(', ');
  var map = {
    'имя': String(b.name || '').split(' ')[0], 'дата': fmtDateRu_(b.date, true), 'время': b.start, 'услуги': b.services,
    'сумма': b.total ? b.total + ' ₽' : '', 'адрес': p.address ? 'Адрес: ' + addr + '. ' : '', 'телефон': p.phone || ''
  };
  return String(tpl || '').replace(/\{([а-яё_]+)\}/gi, function (m, k) { k = k.toLowerCase(); return k in map ? map[k] : m; }).replace(/\s{2,}/g, ' ').trim();
}

/* ======================= Отзывы клиентов ======================= */

function publicReviews_() {
  var M = ['январь', 'февраль', 'март', 'апрель', 'май', 'июнь', 'июль', 'август', 'сентябрь', 'октябрь', 'ноябрь', 'декабрь'];
  return readTable_('reviews').filter(function (r) { return r.rstatus === 'approved'; }).map(function (r) {
    var d = new Date(r.created);
    return { id: r.id, name: r.name, service: r.service, rating: +r.rating || 5, text: r.text, date: isNaN(d) ? '' : M[d.getMonth()] + ' ' + d.getFullYear(), source: 'site' };
  }).reverse();
}

function submitReview_(req) {
  var b = findByToken_(req.id, req.token);
  var text = String(req.text || '').trim().slice(0, 1500);
  if (text.length < 3) throw new Error('Напишите пару слов о визите');
  var lock = LockService.getScriptLock(); lock.waitLock(20000);
  var r;
  try {
    if (readTable_('reviews').some(function (x) { return String(x.bookingId) === String(b.id); })) throw new Error('Вы уже оставили отзыв — спасибо!');
    r = {
      id: Utilities.getUuid().slice(0, 8), created: new Date().toISOString(), bookingId: b.id,
      name: String(req.name || b.name || '').trim().slice(0, 60) || 'Клиент', service: b.services,
      rating: Math.max(1, Math.min(5, +req.rating || 5)), text: text, rstatus: 'pending'
    };
    appendRow_('reviews', r);
  } finally { lock.releaseLock(); }
  var settings = readSettings_();
  try {
    MailApp.sendEmail({
      to: ownerEmail_(settings), subject: '⭐ Новый отзыв: ' + r.name + ' — ' + new Array(r.rating + 1).join('★'), name: 'Сайт — отзывы',
      htmlBody: emailHtml_(settings, {
        title: 'Новый отзыв на модерации', text: r.text,
        rows: [['Клиент', r.name], ['Оценка', new Array(r.rating + 1).join('★')], ['Услуга', r.service]],
        buttons: [['✓ Опубликовать', ownerLink_('r', r.id, 'approve')], ['Скрыть', ownerLink_('r', r.id, 'hide')]],
        note: 'Опубликованный отзыв сразу появится на сайте. Управлять отзывами можно и в панели мастера → «Отзывы».'
      })
    });
  } catch (e) { console.warn(e); }
  return { review: { id: r.id } };
}

/* ======================= Кнопки в письме мастеру ======================= */

function secret_() {
  var p = PropertiesService.getScriptProperties();
  var s = p.getProperty('LINK_SECRET');
  if (!s) { s = Utilities.getUuid() + Utilities.getUuid(); p.setProperty('LINK_SECRET', s); }
  return s;
}
function sign_(str) {
  return Utilities.base64EncodeWebSafe(Utilities.computeHmacSha256Signature(str, secret_())).replace(/=+$/, '').slice(0, 32);
}
function ownerLink_(kind, id, op) {
  var url = '';
  try { url = ScriptApp.getService().getUrl(); } catch (e) {}
  return url + '?action=owner&k=' + kind + '&id=' + encodeURIComponent(id) + '&op=' + op + '&sig=' + sign_(kind + '|' + id + '|' + op);
}

/** Страница для кнопок из письма: сначала показывает, что будет сделано, потом выполняет. */
function ownerPage_(p) {
  var settings = readSettings_();
  var acc = accent_(settings);
  var site = siteUrl_(settings);
  var page = function (title, text, buttons) {
    var btns = (buttons || []).map(function (b, i) {
      return '<a target="_top" href="' + esc_(b[1]) + '" style="display:inline-block;margin:8px 8px 0 0;padding:14px 24px;border-radius:30px;text-decoration:none;font-weight:600;font-size:15px;' +
        (i === 0 ? 'background:' + acc + ';color:#0a0a0a' : 'border:1px solid #444;color:#f0f0f0') + '">' + esc_(b[0]) + '</a>';
    }).join('');
    var html = '<div style="min-height:100vh;margin:0;background:#0a0a0a;font-family:Arial,Helvetica,sans-serif;display:flex;align-items:center;justify-content:center;padding:20px;box-sizing:border-box">' +
      '<div style="max-width:480px;width:100%;background:#141414;border:1px solid #262626;border-radius:16px;padding:32px 28px">' +
      '<div style="width:40px;height:2px;background:' + acc + ';margin:0 0 18px"></div>' +
      '<h1 style="margin:0 0 12px;color:#f0f0f0;font-size:22px">' + esc_(title) + '</h1>' +
      '<p style="margin:0;color:#c9c9c9;font-size:15px;line-height:1.6;white-space:pre-line">' + esc_(text) + '</p>' + btns + '</div></div>';
    return HtmlService.createHtmlOutput(html).setTitle(title).addMetaTag('viewport', 'width=device-width, initial-scale=1');
  };
  var panel = site ? [['Открыть панель мастера', site + '/#admin']] : [];
  if (!p.sig || p.sig !== sign_(p.k + '|' + p.id + '|' + p.op)) return page('Ссылка недействительна', 'Откройте панель мастера, чтобы управлять записями.', panel);
  var selfUrl = ownerLink_(p.k, p.id, p.op) + '&do=1';
  try {
    if (p.k === 'b') {
      var b = readBookings_().filter(function (x) { return String(x.id) === String(p.id); })[0];
      if (!b) return page('Запись не найдена', 'Возможно, её удалили.', panel);
      var target = p.op === 'confirm' ? 'confirmed' : 'cancelled';
      var info = b.name + ', ' + fmtDateRu_(b.date, true) + ', ' + b.start + '–' + b.end + '\n' + b.services + '\n' + b.phone;
      if (b.status === target) return page(target === 'confirmed' ? 'Запись уже подтверждена' : 'Запись уже отменена', info, panel);
      if (!p['do']) return page(target === 'confirmed' ? 'Подтвердить запись?' : 'Отказать в записи?', info + (b.email ? '\n\nКлиенту автоматически уйдёт письмо.' : '\n\nУ клиента нет e-mail — сообщите ему по телефону.'),
        [[target === 'confirmed' ? '✓ Подтвердить' : '✕ Отказать', selfUrl]].concat(panel));
      var r = saveBooking_({ id: b.id, status: target });
      return page(target === 'confirmed' ? 'Запись подтверждена ✓' : 'Запись отменена', info + (r.notified.length ? '\n\nОтправлено клиенту: ' + r.notified.join(', ') : ''), panel);
    }
    if (p.k === 'r') {
      var rv = readTable_('reviews').filter(function (x) { return String(x.id) === String(p.id); })[0];
      if (!rv) return page('Отзыв не найден', '', panel);
      var st = p.op === 'approve' ? 'approved' : 'rejected';
      var rinfo = rv.name + ' — ' + new Array((+rv.rating || 5) + 1).join('★') + '\n«' + rv.text + '»';
      if (!p['do']) return page(st === 'approved' ? 'Опубликовать отзыв?' : 'Скрыть отзыв?', rinfo, [[st === 'approved' ? '✓ Опубликовать' : 'Скрыть', selfUrl]].concat(panel));
      rv.rstatus = st;
      updateRowById_('reviews', rv);
      clearCache_();
      return page(st === 'approved' ? 'Отзыв опубликован ✓' : 'Отзыв скрыт', rinfo, panel);
    }
  } catch (e) {
    return page('Ошибка', e.message, panel);
  }
  return page('Неизвестное действие', '', panel);
}

/* ======================= Хранилище (Google Таблица) ======================= */

function ss_() { return SpreadsheetApp.getActive(); }

var HEADERS_OK_ = {};
function sheet_(kind) {
  var name = SH[kind];
  var sh = ss_().getSheetByName(name);
  if (!sh) {
    sh = ss_().insertSheet(name);
    if (COLS[kind]) {
      COLS[kind].forEach(function (c, i) { if (TEXT_COLS[c[0]]) sh.getRange(2, i + 1, sh.getMaxRows() - 1, 1).setNumberFormat('@'); });
    } else {
      sh.getRange(1, 1, 1, 2).setValues([['Ключ', 'Значение (JSON)']]).setFontWeight('bold').setBackground('#f4f1ec');
      sh.setFrozenRows(1);
    }
  }
  // Миграция: добавить новые столбцы в старые таблицы
  if (COLS[kind] && !HEADERS_OK_[kind]) {
    var cols = COLS[kind];
    var head = sh.getRange(1, 1, 1, cols.length).getValues()[0];
    var need = cols.some(function (c, i) { return head[i] !== c[1]; });
    if (need) {
      sh.getRange(1, 1, 1, cols.length).setValues([cols.map(function (c) { return c[1]; })]).setFontWeight('bold').setBackground('#f4f1ec');
      sh.setFrozenRows(1);
      cols.forEach(function (c, i) { if (TEXT_COLS[c[0]] && !head[i]) sh.getRange(2, i + 1, sh.getMaxRows() - 1, 1).setNumberFormat('@'); });
    }
    HEADERS_OK_[kind] = true;
  }
  return sh;
}

function norm_(key, v) {
  if (v instanceof Date) {
    if (key === 'start' || key === 'end') return Utilities.formatDate(v, tz_(), 'HH:mm');
    if (key === 'created') return v.toISOString();
    return Utilities.formatDate(v, tz_(), 'yyyy-MM-dd');
  }
  if (key === 'visible') return !(v === false || v === 'FALSE' || v === 'нет' || v === 'Нет' || v === 0);
  if (key === 'status') { for (var k in STATUS_RU) if (STATUS_RU[k] === v) return k; return v || 'new'; }
  if (key === 'type') { for (var t in EX_RU) if (EX_RU[t] === v) return t; return v; }
  if (key === 'rstatus') { for (var q in REV_RU) if (REV_RU[q] === v) return q; return v || 'pending'; }
  if ((key === 'start' || key === 'end') && /^\d:\d\d$/.test(v)) return '0' + v;
  return v === null || v === undefined ? '' : v;
}
function denorm_(key, v) {
  if (key === 'status') return STATUS_RU[v] || v;
  if (key === 'type') return EX_RU[v] || v;
  if (key === 'rstatus') return REV_RU[v] || v;
  if (key === 'visible') return v === false ? 'нет' : 'да';
  if (v === null || v === undefined) return '';
  if (typeof v === 'object' && !(v instanceof Date)) return JSON.stringify(v);
  return v;
}

function readTable_(kind) {
  var sh = sheet_(kind);
  var last = sh.getLastRow();
  if (last < 2) return [];
  var cols = COLS[kind];
  return sh.getRange(2, 1, last - 1, cols.length).getValues()
    .filter(function (r) { return String(r[0]) !== ''; })
    .map(function (r) {
      var o = {};
      cols.forEach(function (c, i) { o[c[0]] = norm_(c[0], r[i]); });
      return o;
    });
}

function writeTable_(kind, list) {
  var lock = LockService.getScriptLock(); lock.waitLock(20000);
  try {
    var sh = sheet_(kind);
    var cols = COLS[kind];
    var last = sh.getLastRow();
    if (last > 1) sh.getRange(2, 1, last - 1, cols.length).clearContent();
    if (!list.length) return;
    var rows = list.map(function (o) {
      if (!o.id) o.id = Utilities.getUuid().slice(0, 8);
      return cols.map(function (c) { return denorm_(c[0], o[c[0]]); });
    });
    sh.getRange(2, 1, rows.length, cols.length).setValues(rows);
  } finally { lock.releaseLock(); }
}

function readServices_() {
  var list = readTable_('services');
  if (!list.length) return JSON.parse(JSON.stringify(DEFAULT_SERVICES)); // таблица пустая — услуги по умолчанию
  list.forEach(function (s) {
    s.priceFrom = s.priceFrom === '' ? '' : +s.priceFrom;
    s.priceTo = s.priceTo === '' ? '' : +s.priceTo;
    s.duration = +s.duration || 60;
    s.icon = s.icon || 'sparkle';
  });
  return list;
}

function readBookings_() {
  return readTable_('bookings').map(function (b) { b.total = +b.total || 0; return b; });
}

function appendRow_(kind, o) {
  var sh = sheet_(kind);
  var cols = COLS[kind];
  sh.getRange(sh.getLastRow() + 1, 1, 1, cols.length).setValues([cols.map(function (c) { return denorm_(c[0], o[c[0]]); })]);
}

function findRow_(kind, id) {
  var sh = sheet_(kind);
  var last = sh.getLastRow();
  if (last < 2) return -1;
  var ids = sh.getRange(2, 1, last - 1, 1).getValues();
  for (var i = 0; i < ids.length; i++) if (String(ids[i][0]) === String(id)) return i + 2;
  return -1;
}

function updateRowById_(kind, o) {
  var row = findRow_(kind, o.id);
  if (row < 0) return appendRow_(kind, o);
  var cols = COLS[kind];
  sheet_(kind).getRange(row, 1, 1, cols.length).setValues([cols.map(function (c) { return denorm_(c[0], o[c[0]]); })]);
}

function deleteRowById_(kind, id) {
  var row = findRow_(kind, id);
  if (row > 0) sheet_(kind).deleteRow(row);
}

function readSettings_() {
  var sh = sheet_('settings');
  var last = sh.getLastRow();
  var out = {};
  if (last >= 2) {
    sh.getRange(2, 1, last - 1, 2).getValues().forEach(function (r) {
      if (!r[0]) return;
      try { out[r[0]] = JSON.parse(r[1]); } catch (e) { out[r[0]] = r[1]; }
    });
  }
  out.schedule = merge_(DEFAULT_SCHEDULE, out.schedule);
  out.notify = merge_(DEFAULT_NOTIFY, out.notify);
  out.profile = out.profile || {};
  out.site = out.site || {};
  return out;
}

function writeSettings_(s) {
  var lock = LockService.getScriptLock(); lock.waitLock(20000);
  try {
    var sh = sheet_('settings');
    var last = sh.getLastRow();
    if (last > 1) sh.getRange(2, 1, last - 1, 2).clearContent();
    var rows = Object.keys(s).map(function (k) { return [k, JSON.stringify(s[k])]; });
    if (rows.length) sh.getRange(2, 1, rows.length, 2).setValues(rows);
  } finally { lock.releaseLock(); }
  clearCache_();
}

function merge_(base, over) {
  var out = JSON.parse(JSON.stringify(base));
  if (!over || typeof over !== 'object') return out;
  Object.keys(over).forEach(function (k) {
    var v = over[k];
    out[k] = v && typeof v === 'object' && !Array.isArray(v) && out[k] && typeof out[k] === 'object' ? merge_(out[k], v) : v;
  });
  return out;
}

function photoFolder_() {
  var props = PropertiesService.getScriptProperties();
  var id = props.getProperty('PHOTO_FOLDER_ID');
  if (id) { try { return DriveApp.getFolderById(id); } catch (e) {} }
  var f = DriveApp.createFolder('Сайт — фото');
  props.setProperty('PHOTO_FOLDER_ID', f.getId());
  return f;
}

/* ======================= Даты и форматы ======================= */

function tz_() { return Session.getScriptTimeZone(); }
function fmtDate_(d) { return Utilities.formatDate(d, tz_(), 'yyyy-MM-dd'); }
function today_() { return fmtDate_(new Date()); }
function parseDate_(k) { var p = String(k).split('-'); return new Date(+p[0], +p[1] - 1, +p[2]); }
function dateTime_(k, t) { var d = parseDate_(k); var m = toMin_(t); d.setHours(Math.floor(m / 60), m % 60, 0, 0); return d; }
function addDays_(k, n) { var d = parseDate_(k); d.setDate(d.getDate() + n); return fmtDate_(d); }
function dayIndex_(k) { var p = String(k).split('-'); return Math.round(Date.UTC(+p[0], +p[1] - 1, +p[2]) / 864e5); }
function toMin_(s) { var p = String(s || '0:0').split(':'); return (+p[0] || 0) * 60 + (+p[1] || 0); }
function fromMin_(m) { return ('0' + Math.floor(m / 60)).slice(-2) + ':' + ('0' + (m % 60)).slice(-2); }
function fmtDateRu_(k, withWd) {
  var M = ['января', 'февраля', 'марта', 'апреля', 'мая', 'июня', 'июля', 'августа', 'сентября', 'октября', 'ноября', 'декабря'];
  var W = ['воскресенье', 'понедельник', 'вторник', 'среда', 'четверг', 'пятница', 'суббота'];
  var d = parseDate_(k);
  return (withWd ? W[d.getDay()] + ', ' : '') + d.getDate() + ' ' + M[d.getMonth()];
}
function phoneDigits_(p) {
  var d = String(p || '').replace(/\D/g, '');
  if (d.length === 11 && d[0] === '8') d = '7' + d.slice(1);
  if (d.length === 10) d = '7' + d;
  return d;
}
function fmtPhone_(d) {
  d = phoneDigits_(d);
  if (d.length !== 11) return d;
  return '+' + d[0] + ' (' + d.slice(1, 4) + ') ' + d.slice(4, 7) + '-' + d.slice(7, 9) + '-' + d.slice(9, 11);
}
function isEmail_(s) { return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(s || '').trim()); }
function esc_(s) { return String(s == null ? '' : s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }

/* ======================= Установка ======================= */

/**
 * ЗАПУСТИТЕ ОДИН РАЗ: создаёт листы, папку для фото, пароль и ежедневный триггер.
 * Повторный запуск безопасен (ничего не удаляет).
 */
function setup() {
  var log = [];
  var step = function (name, fn) {
    try { fn(); log.push('✓ ' + name); } catch (e) { log.push('✗ ' + name + ': ' + e.message); }
  };
  var props = PropertiesService.getScriptProperties();
  step('Пароль панели', function () { if (!props.getProperty('ADMIN_PASSWORD')) props.setProperty('ADMIN_PASSWORD', DEFAULT_PASSWORD); });
  step('Листы таблицы', function () { Object.keys(SH).forEach(function (k) { sheet_(k); }); });
  step('Удаление пустого «Лист1»', function () {
    var def = ss_().getSheetByName('Лист1') || ss_().getSheetByName('Sheet1');
    if (def && ss_().getSheets().length > 1 && def.getLastRow() === 0) ss_().deleteSheet(def);
  });
  step('Услуги по умолчанию', function () { if (!readTable_('services').length) writeTable_('services', DEFAULT_SERVICES); });
  step('Цвета статусов', function () {
    var sh = sheet_('bookings');
    var statusCol = COLS.bookings.map(function (c) { return c[0]; }).indexOf('status') + 1;
    var rng = sh.getRange(2, statusCol, sh.getMaxRows() - 1, 1);
    var rule = function (text, bg) { return SpreadsheetApp.newConditionalFormatRule().whenTextEqualTo(text).setBackground(bg).setRanges([rng]).build(); };
    sh.setConditionalFormatRules([rule('Новая', '#f6e6c8'), rule('Подтверждена', '#d8eadf'), rule('Выполнена', '#e6e2dc'), rule('Отменена', '#f3d9d5')]);
  });
  step('Папка для фото', function () { photoFolder_(); });
  step('Фоновые задачи', function () { ensureTriggers_(); });
  step('Доступ к календарю', function () { CalendarApp.getDefaultCalendar(); });
  step('Доступ к почте', function () { MailApp.getRemainingDailyQuota(); });
  step('Кэш сайта', function () { clearCache_(); buildPublic_(); });
  console.log(log.join('\n'));
  console.log('Версия скрипта: ' + VERSION + '. Пароль панели мастера: ' + props.getProperty('ADMIN_PASSWORD'));
  console.log('ВАЖНО: Развернуть → Управление развёртываниями → ✏️ → Версия: «Новая версия» → Развернуть.');
}

function ensureTriggers_() {
  var names = ScriptApp.getProjectTriggers().map(function (t) { return t.getHandlerFunction(); });
  if (names.indexOf('dailyDigest') < 0) ScriptApp.newTrigger('dailyDigest').timeBased().everyDays(1).atHour(20).create();
  if (names.indexOf('warmCache') < 0) ScriptApp.newTrigger('warmCache').timeBased().everyMinutes(10).create();
}

/** Если забыли пароль: запустите эту функцию — пароль станет yakunin2026. */
function resetPassword() {
  PropertiesService.getScriptProperties().setProperty('ADMIN_PASSWORD', DEFAULT_PASSWORD);
  console.log('Пароль сброшен на yakunin2026');
}
