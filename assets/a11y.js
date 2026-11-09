/* גישה לאישה · ווידג'ט נגישות עצמאי (ללא צד שלישי, ללא מעקב) · SIRO Systems */
(function () {
  'use strict';
  var KEY = 'gisha-a11y';
  var root = document.documentElement;
  var state = { zoom: 0, contrast: false, gray: false, links: false, font: false, still: false };
  try { var saved = JSON.parse(localStorage.getItem(KEY) || 'null'); if (saved) for (var k in state) if (k in saved) state[k] = saved[k]; } catch (e) {}

  var css = '' +
    '#a11y-w{position:fixed;bottom:18px;inset-inline-end:18px;z-index:9999;font-family:Assistant,system-ui,Arial,sans-serif;direction:rtl}' +
    '#a11y-btn{width:54px;height:54px;border-radius:50%;border:2px solid #E6CF8F;background:#1D0F33;color:#E6CF8F;display:grid;place-items:center;cursor:pointer;box-shadow:0 10px 30px -8px rgba(0,0,0,.7)}' +
    '#a11y-btn:hover{background:#2A1650}' +
    '#a11y-btn svg{width:30px;height:30px}' +
    '#a11y-btn:focus-visible,#a11y-p button:focus-visible,#a11y-p a:focus-visible{outline:3px solid #E6CF8F;outline-offset:3px}' +
    '#a11y-p{position:absolute;bottom:66px;inset-inline-end:0;width:min(300px,calc(100vw - 36px));background:#150A25;color:#F6F0E4;border:1px solid rgba(201,168,76,.45);border-radius:18px;padding:16px;box-shadow:0 24px 60px -12px rgba(0,0,0,.8)}' +
    '#a11y-p[hidden]{display:none}' +
    '#a11y-p h2{font-size:17px;font-weight:700;color:#E6CF8F;margin:0 0 12px;font-family:inherit}' +
    '#a11y-p .a11y-zoom{display:flex;align-items:center;justify-content:space-between;gap:8px;margin-bottom:10px;border:1px solid rgba(246,240,228,.18);border-radius:12px;padding:6px 10px}' +
    '#a11y-p .a11y-zoom span{font-size:15px;font-weight:600}' +
    '#a11y-p .a11y-zoom button{width:40px;height:40px;border-radius:10px;border:1px solid rgba(246,240,228,.25);background:transparent;color:#F6F0E4;font-size:20px;font-weight:700;cursor:pointer}' +
    '#a11y-p .a11y-grid{display:grid;grid-template-columns:1fr 1fr;gap:8px}' +
    '#a11y-p .a11y-grid button{min-height:48px;border-radius:12px;border:1px solid rgba(246,240,228,.2);background:rgba(246,240,228,.04);color:#F6F0E4;font:600 14.5px/1.25 inherit;font-family:inherit;cursor:pointer;padding:6px 8px}' +
    '#a11y-p .a11y-grid button[aria-pressed="true"]{background:#E6CF8F;color:#0E0619;border-color:#E6CF8F}' +
    '#a11y-p .a11y-foot{display:flex;justify-content:space-between;align-items:center;margin-top:12px;font-size:14px}' +
    '#a11y-p .a11y-foot a{color:#E6CF8F}' +
    '#a11y-p .a11y-foot button{background:none;border:0;color:#F6F0E4;text-decoration:underline;font:inherit;cursor:pointer;padding:6px}' +
    /* מצבים */
    'html.a11y-z1 body{zoom:1.12}html.a11y-z2 body{zoom:1.25}html.a11y-z3 body{zoom:1.4}' +
    'html.a11y-contrast{--text:#fff;--text-2:#fff;--text-3:#fff;--gold-300:#FFE27A;--line:#fff;--line-2:rgba(255,255,255,.6)}' +
    'html.a11y-contrast body,html.a11y-contrast .card,html.a11y-contrast .a11y-sec{background:#000!important}' +
    'html.a11y-contrast body *{text-shadow:none!important}' +
    'html.a11y-gray body>:not(#a11y-w){filter:grayscale(1)}' +
    'html.a11y-links a{text-decoration:underline!important;text-underline-offset:3px}' +
    'html.a11y-font body *:not(svg):not(path){font-family:Arial,Helvetica,sans-serif!important;letter-spacing:.01em!important}' +
    'html.a11y-still *,html.a11y-still *::before,html.a11y-still *::after{animation:none!important;transition:none!important;scroll-behavior:auto!important}' +
    'html.a11y-still .rv{opacity:1!important;transform:none!important}';

  var style = document.createElement('style');
  style.id = 'a11y-css';
  style.textContent = css;
  document.head.appendChild(style);

  var statementHref = (location.pathname.indexOf('accessibility') > -1) ? '#main' : 'accessibility.html';
  var opts = [
    ['contrast', 'ניגודיות גבוהה'],
    ['gray', 'גווני אפור'],
    ['links', 'הדגשת קישורים'],
    ['font', 'גופן קריא'],
    ['still', 'עצירת אנימציות']
  ];

  var w = document.createElement('div');
  w.id = 'a11y-w';
  w.innerHTML =
    '<button id="a11y-btn" type="button" aria-expanded="false" aria-controls="a11y-p" aria-label="תפריט נגישות">' +
      '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><circle cx="12" cy="4" r="2"/><path d="M20.5 7.5c-.2-.6-.9-.9-1.5-.7-2.1.7-4.4 1-7 1s-4.9-.3-7-1c-.6-.2-1.3.1-1.5.7s.1 1.3.7 1.5c1.7.6 3.6.9 5.6 1v3.2L8.4 20c-.2.6.1 1.3.7 1.5.6.2 1.3-.1 1.5-.7L12 16.6l1.4 4.2c.2.6.9.9 1.5.7.6-.2.9-.9.7-1.5L14 13.2V10c2-.1 3.9-.4 5.6-1 .7-.2 1-.9.9-1.5z"/></svg>' +
    '</button>' +
    '<div id="a11y-p" role="dialog" aria-modal="false" aria-labelledby="a11y-h" hidden>' +
      '<h2 id="a11y-h">התאמות נגישות</h2>' +
      '<div class="a11y-zoom"><button type="button" data-z="-1" aria-label="הקטנת טקסט">−</button><span id="a11y-zl" aria-live="polite"></span><button type="button" data-z="1" aria-label="הגדלת טקסט">+</button></div>' +
      '<div class="a11y-grid">' + opts.map(function (o) { return '<button type="button" data-o="' + o[0] + '" aria-pressed="false">' + o[1] + '</button>'; }).join('') +
        '<button type="button" data-reset>איפוס הכול</button></div>' +
      '<div class="a11y-foot"><a href="' + statementHref + '">הצהרת נגישות</a><button type="button" data-close>סגירה</button></div>' +
    '</div>';
  document.body.appendChild(w);

  var btn = w.querySelector('#a11y-btn'), panel = w.querySelector('#a11y-p'), zl = w.querySelector('#a11y-zl');
  var zoomLabels = ['גודל טקסט רגיל', 'טקסט גדול', 'טקסט גדול יותר', 'טקסט הכי גדול'];

  function apply() {
    root.classList.remove('a11y-z1', 'a11y-z2', 'a11y-z3');
    if (state.zoom > 0) root.classList.add('a11y-z' + state.zoom);
    opts.forEach(function (o) {
      root.classList.toggle('a11y-' + o[0], !!state[o[0]]);
      w.querySelector('[data-o="' + o[0] + '"]').setAttribute('aria-pressed', state[o[0]] ? 'true' : 'false');
    });
    zl.textContent = zoomLabels[state.zoom];
    try { localStorage.setItem(KEY, JSON.stringify(state)); } catch (e) {}
  }
  function open(v) {
    panel.hidden = !v;
    btn.setAttribute('aria-expanded', v ? 'true' : 'false');
    if (v) panel.querySelector('button').focus(); else btn.focus();
  }

  btn.addEventListener('click', function () { open(panel.hidden); });
  panel.addEventListener('click', function (e) {
    var t = e.target.closest('button'); if (!t) return;
    if (t.hasAttribute('data-z')) state.zoom = Math.max(0, Math.min(3, state.zoom + (+t.getAttribute('data-z'))));
    else if (t.hasAttribute('data-o')) { var k = t.getAttribute('data-o'); state[k] = !state[k]; }
    else if (t.hasAttribute('data-reset')) { state = { zoom: 0, contrast: false, gray: false, links: false, font: false, still: false }; }
    else if (t.hasAttribute('data-close')) { open(false); return; }
    apply();
  });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && !panel.hidden) open(false); });
  document.addEventListener('click', function (e) { if (!panel.hidden && !w.contains(e.target)) { panel.hidden = true; btn.setAttribute('aria-expanded', 'false'); } });

  apply();
})();
