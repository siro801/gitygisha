(function(){
'use strict';
var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
var $ = function(s,c){return (c||document).querySelector(s)};
var $$ = function(s,c){return Array.prototype.slice.call((c||document).querySelectorAll(s))};
var arrow = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M19 12H5M11 18l-6-6 6-6"/></svg>';
function esc(s){return String(s).replace(/[&<>"]/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]})}

/* ---------- cities marquee ---------- */
var cities=['בני ברק','Vienna','ירושלים','London','ברכפלד','Antwerp','אשדוד','Paris','נתניה','Borough Park','עפולה','Tash','אילת','Montreal','קריית מטלון','Lakewood','צפת','Zurich','חולון','Buenos Aires','ביתר עילית','Brazil','אלעד','Costa Rica','חריש','New Jersey','כרמיאל','Miami','חיפה','Boca Raton','סנט פטרסבורג','New York','Basel','Los Angeles','Netherlands','Chicago','Monroe','Toronto','Manchester','Berlin','Rome','Madrid','Melbourne','Sydney','Johannesburg','Panama City','Mexico City'];
var mq=$('#mq');
if(mq){mq.innerHTML=cities.concat(cities).map(function(c){return '<span>'+esc(c)+'</span>'}).join('')}

/* ---------- reveal on scroll ---------- */
if('IntersectionObserver' in window && !reduce){
  var io=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){e.target.classList.add('in');io.unobserve(e.target)}})},{threshold:.1,rootMargin:'0px 0px -40px 0px'});
  $$('.rv').forEach(function(el){io.observe(el)});
}else{$$('.rv').forEach(function(el){el.classList.add('in')})}

/* ---------- active nav link ---------- */
var links=$$('.nav-links a');
if('IntersectionObserver' in window && links.length){
  var navIO=new IntersectionObserver(function(es){es.forEach(function(e){
    if(e.isIntersecting){links.forEach(function(a){a.setAttribute('aria-current',a.getAttribute('href')==='#'+e.target.id?'true':'false')})}
  })},{rootMargin:'-45% 0px -50% 0px'});
  links.forEach(function(a){var s=$(a.getAttribute('href'));if(s)navIO.observe(s)});
}

/* ---------- course filters ---------- */
var filterStatus=$('#filter-status');
$$('.filter').forEach(function(b){b.addEventListener('click',function(){
  $$('.filter').forEach(function(x){x.setAttribute('aria-pressed',String(x===b))});
  var f=b.getAttribute('data-f'),n=0;
  $$('.grid .card').forEach(function(c){var show=f==='all'||c.getAttribute('data-s')===f;c.hidden=!show;if(show){n++;c.classList.add('in')}});
  if(filterStatus)filterStatus.textContent='מוצגים '+n+' קורסים';
})});

/* ---------- flyer dialog ---------- */
var flyer=$('#flyer');
$$('[data-open-flyer]').forEach(function(b){b.addEventListener('click',function(){if(flyer&&flyer.showModal)flyer.showModal()})});
if(flyer){
  $('[data-close-flyer]',flyer).addEventListener('click',function(){flyer.close()});
  flyer.addEventListener('click',function(e){if(e.target===flyer)flyer.close()});
}

/* ---------- voices (טקסטים לדוגמה: להחליף בציטוטים אמיתיים) ---------- */
var voices=[
  {i:'מ',name:'מ., בני ברק',role:'בוגרת תקשורת בזוגיות',topic:'זוגיות',q:'חשבתי שאני יודעת לדבר עם בעלי. אחרי הקורס הבנתי שעד עכשיו רק דיברתי. היום אני גם שומעת.'},
  {i:'ר',name:'ר., London',role:'בקהילה 3 שנים',topic:'חיבור יומי',q:'הסטטוס של גיטי הוא הדבר הראשון שאני פותחת בבוקר. חמש דקות, ואני יוצאת ליום אחרת.'},
  {i:'ש',name:'ש., ירושלים',role:'פסיעה ראשונה בארמון',topic:'התחלה',q:'נרשמתי למיני קורס רק כדי לנסות. בשיעור השלישי כבר ידעתי שאני ממשיכה לקורס המלא.'},
  {i:'ח',name:'ח., Antwerp',role:'שיעור שמנופוביה',topic:'ערך עצמי',q:'בפעם הראשונה מישהי דיברה איתי על ערך עצמי בלי לבקש ממני להשתנות.'},
  {i:'י',name:'י., אשדוד',role:'מאזינה לקו התוכן',topic:'קו התוכן',q:'אני מקשיבה לקו בדרך לעבודה. מרגיש כמו חברה טובה שיודעת בדיוק מה להגיד.'},
  {i:'א',name:'א., Lakewood',role:'בוגרת הכשרת מאמנות',topic:'הכשרה',q:'ההכשרה נתנה לי שפה. היום אני מלווה נשים אחרות באותה דרך שליוו אותי.'}
];
var tabsEl=$('#v-tabs'),panelsEl=$('#v-panels'),box=$('#voices-box');
if(tabsEl&&panelsEl){
  var DUR=8000,cur=0,timer=null,paused=reduce,hoverPause=false;
  box.style.setProperty('--dur',DUR+'ms');
  voices.forEach(function(v,k){
    tabsEl.insertAdjacentHTML('beforeend','<li role="presentation"><button class="v-tab" type="button" role="tab" id="vt'+k+'" aria-controls="vp'+k+'" aria-selected="false" tabindex="-1"><span class="avatar" aria-hidden="true">'+esc(v.i)+'</span><span class="v-who"><b>'+esc(v.name)+'</b><span>'+esc(v.topic)+'</span></span><span class="v-prog" aria-hidden="true"></span></button></li>');
    panelsEl.insertAdjacentHTML('beforeend','<figure class="v-panel" role="tabpanel" id="vp'+k+'" aria-labelledby="vt'+k+'" hidden><blockquote>'+esc(v.q)+'</blockquote><figcaption><b>'+esc(v.name)+'</b><span>· '+esc(v.role)+'</span></figcaption></figure>');
  });
  var tabs=$$('.v-tab',tabsEl),panels=$$('.v-panel',panelsEl);
  function show(k,focus){
    cur=(k+tabs.length)%tabs.length;
    tabs.forEach(function(t,j){var on=j===cur;t.setAttribute('aria-selected',String(on));t.tabIndex=on?0:-1;
      var p=t.querySelector('.v-prog');p.style.animation='none';void p.offsetWidth;p.style.animation='';});
    panels.forEach(function(p,j){p.hidden=j!==cur});
    if(focus)tabs[cur].focus();
    schedule();
  }
  function schedule(){clearTimeout(timer);if(!paused&&!hoverPause)timer=setTimeout(function(){show(cur+1)},DUR)}
  function setPaused(p){paused=p;box.classList.toggle('paused',p||hoverPause);
    var pb=$('#v-pause');pb.setAttribute('aria-label',p?'הפעלת ההחלפה האוטומטית':'עצירת ההחלפה האוטומטית');
    pb.innerHTML=p?'<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M7 5v14l11-7z"/></svg>':'<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><rect x="6" y="5" width="4" height="14" rx="1"/><rect x="14" y="5" width="4" height="14" rx="1"/></svg>';
    if(p)clearTimeout(timer);else show(cur)}
  tabs.forEach(function(t,j){
    t.addEventListener('click',function(){show(j)});
    t.addEventListener('keydown',function(e){
      var k=e.key;if(k==='ArrowLeft'||k==='ArrowDown'){e.preventDefault();show(cur+1,true)}
      else if(k==='ArrowRight'||k==='ArrowUp'){e.preventDefault();show(cur-1,true)}
      else if(k==='Home'){e.preventDefault();show(0,true)}else if(k==='End'){e.preventDefault();show(tabs.length-1,true)}
    });
  });
  $('#v-next').addEventListener('click',function(){show(cur+1)});
  $('#v-prev').addEventListener('click',function(){show(cur-1)});
  $('#v-pause').addEventListener('click',function(){setPaused(!paused)});
  ['mouseenter','focusin'].forEach(function(ev){box.addEventListener(ev,function(){hoverPause=true;box.classList.add('paused');clearTimeout(timer)})});
  ['mouseleave','focusout'].forEach(function(ev){box.addEventListener(ev,function(e){if(ev==='focusout'&&box.contains(e.relatedTarget))return;hoverPause=false;box.classList.toggle('paused',paused);schedule()})});
  setPaused(paused);
}

/* ---------- ask Gitty chat (שאלות ותשובות לדוגמה: להחליף בשיח אמיתי) ---------- */
var qa=[
  {q:'אין לי זמן בכלל. מאיפה מתחילים?',a:'מתחילים קטן. חמש דקות ביום של הקשבה לעצמך שוות יותר משעה פעם בחודש. בשביל זה יש את הסטטוס היומי.',link:{t:'להצטרפות לסטטוס',h:'https://wa.me/447791224946',ext:1}},
  {q:'מה זה בעצם "אישה בקבלה"?',a:'אישה שמקבלת את עצמה, את החיים ואת מה שבורא עולם נותן לה. לא מתוך השלמה, מתוך שמחה. משם מתחיל השפע.',link:{t:'לטעימה: פסיעה ראשונה בארמון',h:'#courses'}},
  {q:'בעלי לא מבין אותי. מה עושים?',a:'מתחילים מהצד שלך. כשאישה משנה את הדרך שבה היא מדברת, הבית כולו נשמע אחרת. זה בדיוק מה שלומדים בתקשורת בזוגיות.',link:{t:'לקורס תקשורת בזוגיות',h:'#courses'}},
  {q:'דיגיטלי או מחזור חי, מה מתאים לי?',a:'הדיגיטלי למי שצריכה גמישות, ויש בו 4 מפגשי זום איתי לשאלות. המחזור החי למי שרוצה קבוצה ותהליך צמוד.',link:{t:'להשוואת הקורסים',h:'#courses'}},
  {q:'אפשר להתחיל בלי לשלם כלום?',a:'בטח. קו התוכן, הסטטוס והמגזין חינמיים לגמרי. תתחילי שם, ותרגישי מה מדבר אלייך.',link:{t:'לתכנים החינמיים',h:'#free'}}
];
var qList=$('#q-list'),thread=$('#thread'),state=$('#chat-state'),busy=false;
if(qList&&thread){
  var qIcon='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M19 12H5M11 18l-6-6 6-6"/></svg>';
  qa.forEach(function(item,k){qList.insertAdjacentHTML('beforeend','<button class="q-btn" type="button" aria-pressed="false" data-q="'+k+'"><span>'+esc(item.q)+'</span>'+qIcon+'</button>')});
  var hint=thread.querySelector('.chat-hint');
  $$('.q-btn',qList).forEach(function(b){b.addEventListener('click',function(){
    if(busy)return;busy=true;
    var item=qa[+b.getAttribute('data-q')];
    b.setAttribute('aria-pressed','true');
    if(hint){hint.remove();hint=null}
    var her=document.createElement('div');her.className='bubble her';her.textContent=item.q;thread.appendChild(her);
    var typing=document.createElement('div');typing.className='typing';typing.setAttribute('aria-label','גיטי מקלידה');typing.innerHTML='<i></i><i></i><i></i>';
    var delay=reduce?0:1100;
    setTimeout(function(){thread.appendChild(typing);state.textContent='מקלידה…';thread.scrollTop=thread.scrollHeight},reduce?0:350);
    setTimeout(function(){
      typing.remove();state.textContent='זמינה בסטטוס היומי';
      var g=document.createElement('div');g.className='bubble gitty';
      var l=item.link;
      g.innerHTML=esc(item.a)+'<br><a href="'+l.h+'"'+(l.ext?' target="_blank" rel="noopener"':'')+'>'+esc(l.t)+' ←</a>';
      thread.appendChild(g);thread.scrollTop=thread.scrollHeight;busy=false;
    },delay+(reduce?0:500));
  })});
}
})();
