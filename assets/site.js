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

/* ---------- ask Gitty chat: שאלות ותשובות אמיתיות של גיטי (נובמבר 2026) ---------- */
var ST='https://wa.me/447791224946';
var qa=[
  {g:'gitty',q:'למה את כל הזמן מדברת על בית המלוכה באנגליה? מה לנו, כיהודיות, ולנסיכה קייט?',a:'ברור שה׳ בחר בנו מכל העמים, ואנחנו המלכות האמיתיות. לא קייט ולא שום נסיכה או מלכה אחרת! אלא מה? מהתבוננות בסמלים, בהתנהלות, בשפת הגוף ובתפיסת המלכות, אפשר ללמוד איך את ואני צריכות להיראות, על אצילות ועל הדרך שבה אישה מחזיקה את עצמה. ובסוף, שוב: המלכות האמיתית שלנו מגיעה ממקום עמוק ואמיתי באמת.',link:{t:'להצטרפות לסטטוס היומי',h:ST,ext:1}},
  {g:'gitty',q:'למה את קוראת לנשים "מלכות"?',a:'כי כל אישה צריכה להכיר את הערך האמיתי שלה. מלכות היא לא גאווה ולא התנשאות. היא היכולת לחיות מתוך כבוד, מודעות ואחריות, ולהכיר בכוחות שהקב״ה נתן לנו.',link:{t:'לפסיעה ראשונה בארמון',h:'#c-mini'}},
  {g:'gitty',q:'איך את מחברת בין תורת ישראל, קבלה וכלים מעולם הפסיכולוגיה?',a:'אני אוהבת ללמוד ולחבר בין עולמות שיש בהם עומק וחכמה. מצד אחד חסידות, מוסר ותורת ישראל. מצד שני כלים מעשיים, שמכניסים את הרעיונות הגדולים אל תוך החיים עצמם.',link:{t:'לתכנים החינמיים',h:'#free'}},
  {g:'gitty',q:'איך את רואה בכל כך הרבה מצבים הזדמנות לצמיחה?',a:'הרבה פעמים השינוי מתחיל כשמשנים את נקודת המבט. לא תמיד אנחנו בוחרות מה יקרה לנו, אבל אנחנו כן יכולות ללמוד איך להתבונן, איך להגיב ואיך לצמוח מתוך המציאות.',link:{t:'לנקודת מבט חדשה כל יום בסטטוס',h:ST,ext:1}},
  {g:'gitty',q:'מה החלום שלך? מה היית רוצה שכל אישה תיקח ממך?',a:'שכל אישה תכיר את המהות האמיתית שלה, תבין כמה כוחות הקב״ה נתן לה, ותלמד לחיות עם יותר מודעות, אצילות ושמחה. לא להפוך למישהי אחרת. לגלות את המלכה שהיא כבר.',link:{t:'לפסיעה ראשונה בארמון',h:'#c-mini'}},
  {g:'start',q:'אני רוצה ללמוד ממך, אבל לא יודעת מאיפה להתחיל.',a:'מצעד אחד קטן. לא צריך להפוך את כל החיים ביום אחד. תתחילי להכיר את התכנים, תראי מה מדבר אלייך, ומשם הדרך כבר תתבהר.',link:{t:'לצעד הראשון: הסטטוס היומי',h:ST,ext:1}},
  {g:'start',q:'אין לי כרגע אפשרות להשקיע בקורס. אפשר ללמוד ממך בחינם?',a:'בוודאי. יש כאן תכנים חינמיים שיצרתי כדי שתוכלי להכיר את הדרך שלי ולקבל ערך גם בלי לקנות כלום. גם צעד קטן של למידה יכול לפתוח פתח גדול.',link:{t:'לתכנים החינמיים',h:'#free'}},
  {g:'start',q:'את עונה באופן אישי לכל מי ששולחת שאלה?',a:'אני מאוד אוהבת לקרוא את השאלות שמגיעות אליי. אני משתדלת להתייחס אליהן ולענות במסגרת הפעילויות והמפגשים, אבל חשוב לי להגיד בכנות: לא תמיד אוכל לענות אישית לכל פנייה.',link:{t:'להצטרפות לסטטוס היומי',h:ST,ext:1}},
  {g:'courses',q:'הקורסים מתאימים גם למי שאף פעם לא למדה התפתחות אישית?',a:'בהחלט. אני משתדלת להנגיש רעיונות עמוקים בשפה פשוטה וברורה, עם דוגמאות וכלים שאפשר לקחת הביתה. לא צריך ידע מוקדם. רק רצון ללמוד ולהתפתח.',link:{t:'להשוואת הקורסים',h:'#courses'}},
  {g:'courses',q:'מה ההבדל בין הקורס הדיגיטלי לקורס הפרונטלי?',a:'בדיגיטלי את לומדת בזמן ובקצב שלך, חוזרת על שיעורים ומתקדמת מתי שנוח לך, ויש בו גם 4 מפגשי זום איתי לשאלות. בקורס החי יש את האנרגיה של הקבוצה, המפגש והלמידה המשותפת. לכל דרך היופי שלה.',link:{t:'להשוואת הקורסים',h:'#courses'}},
  {g:'courses',q:'אפשר לקבל ממך כלים מעשיים, ולא רק רעיונות?',a:'בוודאי! ידע שלא פוגש את החיים נשאר רק ידע. בכל הלימודים שלי חשוב לי לתת כלים מעשיים, תרגילים ודרכי התבוננות שאפשר ליישם ביומיום.',link:{t:'לקורס תקשורת בזוגיות',h:'#c-tikshoret'}},
  {g:'courses',q:'למה את מדגישה כל כך את השפה והתקשורת בבית?',a:'כי למילים יש כוח עצום. לפעמים שינוי קטן בדרך שבה אנחנו מדברות משנה את כל האווירה בבית. תקשורת היא מיומנות, ואת כל מיומנות אפשר ללמוד ולשפר.',link:{t:'לקורס תקשורת בזוגיות',h:'#c-tikshoret'}}
];
var qList=$('#q-list'),thread=$('#thread'),state=$('#chat-state'),busy=false;
if(qList&&thread){
  var qIcon='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M19 12H5M11 18l-6-6 6-6"/></svg>';
  qa.forEach(function(item,k){qList.insertAdjacentHTML('beforeend','<button class="q-btn" type="button" aria-pressed="false" data-q="'+k+'" data-g="'+item.g+'"><span>'+esc(item.q)+'</span>'+qIcon+'</button>')});
  var qTopics=$$('#q-topics .filter');
  function showTopic(g){
    qTopics.forEach(function(t){t.setAttribute('aria-pressed',String(t.getAttribute('data-g')===g))});
    $$('.q-btn',qList).forEach(function(b){b.hidden=b.getAttribute('data-g')!==g});
  }
  qTopics.forEach(function(t){t.addEventListener('click',function(){showTopic(t.getAttribute('data-g'))})});
  if(qTopics.length)showTopic('gitty');
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
