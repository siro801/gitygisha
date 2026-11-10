(function(){
'use strict';
var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
var finePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
var $ = function(s,c){return (c||document).querySelector(s)};
var $$ = function(s,c){return Array.prototype.slice.call((c||document).querySelectorAll(s))};
function esc(s){return String(s).replace(/[&<>"]/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]})}
var hasIO='IntersectionObserver' in window;

/* ---------- hero: מילים עולות אחת אחרי השנייה ---------- */
$$('.hero-title .w').forEach(function(w,k){w.style.setProperty('--k',k)});

/* ---------- reveal on scroll ---------- */
if(hasIO && !reduce){
  var io=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){e.target.classList.add('in');io.unobserve(e.target)}})},{threshold:.1,rootMargin:'0px 0px -40px 0px'});
  $$('.rv').forEach(function(el){io.observe(el)});
}else{$$('.rv').forEach(function(el){el.classList.add('in')})}

/* ---------- active nav link ---------- */
var links=$$('.nav-links a');
if(hasIO && links.length){
  var navIO=new IntersectionObserver(function(es){es.forEach(function(e){
    if(e.isIntersecting){links.forEach(function(a){a.setAttribute('aria-current',a.getAttribute('href')==='#'+e.target.id?'true':'false')})}
  })},{rootMargin:'-45% 0px -50% 0px'});
  links.forEach(function(a){var s=$(a.getAttribute('href'));if(s)navIO.observe(s)});
}

/* ---------- חוט הזהב: התקדמות הגלילה ---------- */
var fill=$('#thread-fill'),ticking=false;
function onScroll(){
  if(ticking)return;ticking=true;
  requestAnimationFrame(function(){
    var max=document.documentElement.scrollHeight-innerHeight;
    if(fill)fill.style.setProperty('--p',max>0?Math.min(1,scrollY/max):0);
    ticking=false;
  });
}
addEventListener('scroll',onScroll,{passive:true});onScroll();

/* ---------- ספירה עולה במספרים ---------- */
var nums=$$('[data-count]');
function countUp(el){
  var to=+el.getAttribute('data-count'),plus=el.hasAttribute('data-plus'),t0=null,D=1600;
  function fmt(n){return Math.round(n).toLocaleString('en-US')+(plus?'+':'')}
  if(reduce){el.textContent=fmt(to);return}
  function step(t){if(!t0)t0=t;var p=Math.min(1,(t-t0)/D),e=1-Math.pow(1-p,4);el.textContent=fmt(to*e);if(p<1)requestAnimationFrame(step)}
  el.textContent=fmt(0);requestAnimationFrame(step);
}
if(hasIO&&nums.length){
  var cIO=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){countUp(e.target);cIO.unobserve(e.target)}})},{threshold:.6});
  nums.forEach(function(n){cIO.observe(n)});
}

/* ---------- אבקת זהב בפתיחה ---------- */
var cv=$('#dust');
if(cv&&cv.getContext&&!reduce){
  var ctx=cv.getContext('2d'),W=0,H=0,dpr=Math.min(2,window.devicePixelRatio||1),parts=[],running=true,raf=0;
  function size(){
    W=cv.clientWidth;H=cv.clientHeight;cv.width=W*dpr;cv.height=H*dpr;ctx.setTransform(dpr,0,0,dpr,0,0);
    var n=Math.min(70,Math.round(W*H/16000));parts=[];
    for(var i=0;i<n;i++)parts.push({x:Math.random()*W,y:Math.random()*H,r:.4+Math.random()*1.5,v:.12+Math.random()*.35,a:Math.random()*Math.PI*2,s:.01+Math.random()*.025});
  }
  function draw(){
    ctx.clearRect(0,0,W,H);
    for(var i=0;i<parts.length;i++){var p=parts[i];
      p.y-=p.v;p.a+=p.s;p.x+=Math.sin(p.a)*.25;if(p.y<-4){p.y=H+4;p.x=Math.random()*W}
      var o=.35+.45*Math.abs(Math.sin(p.a));
      ctx.beginPath();ctx.arc(p.x,p.y,p.r,0,Math.PI*2);ctx.fillStyle='rgba(230,207,143,'+o.toFixed(2)+')';ctx.fill();
    }
    if(running)raf=requestAnimationFrame(draw);
  }
  size();draw();
  addEventListener('resize',function(){size()});
  function setRun(r){if(r===running)return;running=r;if(r)draw();else cancelAnimationFrame(raf)}
  if(hasIO)new IntersectionObserver(function(es){setRun(es[0].isIntersecting&&!document.hidden)}).observe(cv);
  document.addEventListener('visibilitychange',function(){setRun(!document.hidden)});
}

/* ---------- זרקור והטיה עדינה בכרטיסים ---------- */
if(finePointer&&!reduce){
  $$('.card').forEach(function(c){
    c.addEventListener('pointermove',function(e){
      var r=c.getBoundingClientRect(),x=(e.clientX-r.left)/r.width,y=(e.clientY-r.top)/r.height;
      c.style.setProperty('--mx',(x*100)+'%');c.style.setProperty('--my',(y*100)+'%');
      c.style.transform='perspective(900px) rotateX('+((.5-y)*4).toFixed(2)+'deg) rotateY('+((x-.5)*4).toFixed(2)+'deg) translateY(-4px)';
    });
    c.addEventListener('pointerleave',function(){c.style.transform=''});
  });
}

/* ---------- course filters ---------- */
var filterStatus=$('#filter-status'),fBtns=$$('.filter[data-f]');
fBtns.forEach(function(b){b.addEventListener('click',function(){
  fBtns.forEach(function(x){x.setAttribute('aria-pressed',String(x===b))});
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

/* ---------- מאיפה מתחילים: שתי שאלות והמלצה ---------- */
var ST='https://wa.me/447791224946';
var recs={
  status:{title:'הסטטוס היומי של גיטי',why:'מסר קצר כל יום בווטסאפ. הדרך הכי קלה להכיר את הגישה, בלי התחייבות.',price:'חינם',cta:'שלחי הודעה והצטרפי',h:ST,ext:1,tm:'חינם'},
  mini:{title:'פסיעה ראשונה בארמון',why:'5 שיעורי האזנה של 10–20 דקות. ובונוס: שובר ₪300 לקורס המלא.',price:'₪87',cta:'להרשמה מיידית',h:'https://secure.cardcom.solutions/e/7plsttYqU2aUDeqA1OMBQ',ext:1,img:'pictures/mini-course.png',card:'#c-mini'},
  digital:{title:'תקשורת בזוגיות: הקורס הדיגיטלי',why:'12 מפגשים בקצב שלך, ועוד 4 מפגשי זום עם גיטי לשאלות ותשובות.',price:'₪3,797 · חלק א׳',cta:'לפרטים ולהרשמה',h:'https://gitygisha.com/%D7%A7%D7%95%D7%A8%D7%A1-%D7%AA%D7%A7%D7%A9%D7%95%D7%A8%D7%AA-%D7%91%D7%96%D7%95%D7%92%D7%99%D7%95%D7%AA/',ext:1,img:'pictures/tikshoret.png',card:'#c-tikshoret'},
  live:{title:'תקשורת בזוגיות: המחזור החי',why:'קבוצה, זום חי וליווי צמוד של גיטי. הצטרפי לרשימת ההמתנה למחזור הבא.',price:'',cta:'לרשימת ההמתנה',h:'https://registrationform.ravpage.co.il/free',ext:1,img:'pictures/tikshoret.png',card:'#c-live'},
  pninim:{title:'פנינים של גיטי',why:'שיעורים קצרים לנושאים בוערים: גבולות, הורות ועוד. בדיוק לכמה דקות ביום.',price:'',cta:'לספרייה',h:'https://my.schooler.biz/s/114432/gvoolut',ext:1,img:'pictures/pninim.jpg',card:'#c-pninim'},
  coach:{title:'הכשרת מאמנות בגישה',why:'לבוגרות חלק א׳ וב׳ שרוצות ללוות נשים אחרות. ההודעה על המחזור הבא נשלחת אישית.',price:'',cta:'כתבי לנו',h:'mailto:info@gitygisha.com?subject=%D7%94%D7%9B%D7%A9%D7%A8%D7%AA%20%D7%9E%D7%90%D7%9E%D7%A0%D7%95%D7%AA',img:'pictures/maamanot.jpeg',card:'#c-coach'}
};
var route={new:{min:'status',week:'mini',frame:'mini'},deep:{min:'pninim',week:'digital',frame:'live'},home:{min:'mini',week:'digital',frame:'live'}};
var finder=$('#finder');
if(finder){
  var s1=$('#f-step1'),s2=$('#f-step2'),res=$('#f-result'),bar=$('#f-bar'),cnt=$('#f-count'),pick=null;
  function setBar(w,label){bar.style.setProperty('--w',w);cnt.textContent=label}
  function go(step){
    s1.hidden=step!==1;s2.hidden=step!==2;res.hidden=step!==3;
    if(step===1){setBar('8%','שאלה 1 מתוך 2');$$('.f-opt',s1).forEach(function(b){b.classList.remove('picked')})}
    if(step===2){setBar('50%','שאלה 2 מתוך 2');$$('.f-opt',s2).forEach(function(b){b.classList.remove('picked')})}
  }
  function burst(){
    if(reduce)return '';
    var cols=['#E6CF8F','#FFF6DD','#C9A84C','#B79BE0'],h='';
    for(var i=0;i<28;i++){var a=Math.random()*Math.PI*2,d=120+Math.random()*220;
      h+='<i style="--x:'+Math.round(Math.cos(a)*d)+'px;--y:'+Math.round(Math.sin(a)*d)+'px;--r:'+Math.round(Math.random()*540)+'deg;--c:'+cols[i%4]+';animation-delay:'+Math.round(Math.random()*120)+'ms"></i>'}
    return '<div class="burst" aria-hidden="true">'+h+'</div>';
  }
  function show(key){
    var r=recs[key];
    var media=r.img?'<div class="r-media"><img src="'+r.img+'" alt=""></div>':'<div class="r-media type-media"><div class="tm"><span>'+esc(r.tm)+'</span><small>להתחיל היום</small></div></div>';
    res.innerHTML=burst()+media+
      '<div class="r-body"><span class="r-label">הצעד הבא שלך</span><h3>'+esc(r.title)+'</h3><p>'+esc(r.why)+'</p>'+
      (r.price?'<span class="r-price">'+esc(r.price)+'</span>':'')+
      '<div class="r-actions"><a class="btn btn-gold" href="'+r.h+'"'+(r.ext?' target="_blank" rel="noopener"':'')+'>'+esc(r.cta)+(r.ext?'<span class="sr-only"> (נפתח בחלון חדש)</span>':'')+'</a>'+
      (r.card?'<a class="link" href="'+r.card+'" data-flash>לכרטיס המלא</a>':'')+'</div>'+
      '<div class="r-again"><button class="link" type="button" data-restart>לבחור מחדש</button>'+(key!=='status'?'<a class="link" href="#free">או להתחיל בחינם</a>':'')+'</div></div>';
    setBar('100%','מצאנו!');go(3);
    res.focus({preventScroll:true});
    $('[data-restart]',res).addEventListener('click',function(){go(1);$('#fq1').focus()});
    var fl=$('[data-flash]',res);
    if(fl)fl.addEventListener('click',function(){var c=$(r.card);if(c){c.hidden=false;c.classList.remove('flash');void c.offsetWidth;c.classList.add('flash')}});
  }
  $$('.f-opt',s1).forEach(function(b){b.addEventListener('click',function(){
    pick=b.getAttribute('data-a');b.classList.add('picked');
    setTimeout(function(){if(pick==='grad'){show('coach')}else{go(2);$('#fq2').focus({preventScroll:true})}},reduce?0:260);
  })});
  $$('.f-opt',s2).forEach(function(b){b.addEventListener('click',function(){
    b.classList.add('picked');var t=b.getAttribute('data-t');
    setTimeout(function(){show(route[pick][t])},reduce?0:260);
  })});
  $('#f-back').addEventListener('click',function(){go(1);$('#fq1').focus()});
  go(1);
}

/* ---------- סרגל פעולה בטלפון ---------- */
var dock=$('#dock');
if(dock&&hasIO){
  var vis={top:true,path:false,foot:false};
  var dIO=new IntersectionObserver(function(es){es.forEach(function(e){vis[e.target.getAttribute('data-dock')]=e.isIntersecting});
    dock.classList.toggle('show',!vis.top&&!vis.path&&!vis.foot)},{threshold:0});
  [['#top','top'],['#path','path'],['.page-foot','foot']].forEach(function(p){var el=$(p[0]);if(el){el.setAttribute('data-dock',p[1]);dIO.observe(el)}});
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
if(tabsEl&&panelsEl&&!$('#voices').hidden){
  var DUR=8000,cur=0,timer=null,paused=reduce,hoverPause=false;
  box.style.setProperty('--dur',DUR+'ms');
  voices.forEach(function(v,k){
    tabsEl.insertAdjacentHTML('beforeend','<li role="presentation"><button class="v-tab" type="button" role="tab" id="vt'+k+'" aria-controls="vp'+k+'" aria-selected="false" tabindex="-1"><span class="avatar" aria-hidden="true">'+esc(v.i)+'</span><span class="v-who"><b>'+esc(v.name)+'</b><span>'+esc(v.topic)+'</span></span><span class="v-prog" aria-hidden="true"></span></button></li>');
    panelsEl.insertAdjacentHTML('beforeend','<figure class="v-panel" role="tabpanel" id="vp'+k+'" aria-labelledby="vt'+k+'" hidden><blockquote>'+esc(v.q)+'</blockquote><figcaption><b>'+esc(v.name)+'</b><span>· '+esc(v.role)+'</span></figcaption></figure>');
  });
  var tabs=$$('.v-tab',tabsEl),panels=$$('.v-panel',panelsEl);
  function vShow(k,focus){
    cur=(k+tabs.length)%tabs.length;
    tabs.forEach(function(t,j){var on=j===cur;t.setAttribute('aria-selected',String(on));t.tabIndex=on?0:-1;
      var p=t.querySelector('.v-prog');p.style.animation='none';void p.offsetWidth;p.style.animation='';});
    panels.forEach(function(p,j){p.hidden=j!==cur});
    if(focus)tabs[cur].focus();
    schedule();
  }
  function schedule(){clearTimeout(timer);if(!paused&&!hoverPause)timer=setTimeout(function(){vShow(cur+1)},DUR)}
  function setPaused(p){paused=p;box.classList.toggle('paused',p||hoverPause);
    var pb=$('#v-pause');pb.setAttribute('aria-label',p?'הפעלת ההחלפה האוטומטית':'עצירת ההחלפה האוטומטית');
    pb.innerHTML=p?'<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M7 5v14l11-7z"/></svg>':'<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><rect x="6" y="5" width="4" height="14" rx="1"/><rect x="14" y="5" width="4" height="14" rx="1"/></svg>';
    if(p)clearTimeout(timer);else vShow(cur)}
  tabs.forEach(function(t,j){
    t.addEventListener('click',function(){vShow(j)});
    t.addEventListener('keydown',function(e){
      var k=e.key;if(k==='ArrowLeft'||k==='ArrowDown'){e.preventDefault();vShow(cur+1,true)}
      else if(k==='ArrowRight'||k==='ArrowUp'){e.preventDefault();vShow(cur-1,true)}
      else if(k==='Home'){e.preventDefault();vShow(0,true)}else if(k==='End'){e.preventDefault();vShow(tabs.length-1,true)}
    });
  });
  $('#v-next').addEventListener('click',function(){vShow(cur+1)});
  $('#v-prev').addEventListener('click',function(){vShow(cur-1)});
  $('#v-pause').addEventListener('click',function(){setPaused(!paused)});
  ['mouseenter','focusin'].forEach(function(ev){box.addEventListener(ev,function(){hoverPause=true;box.classList.add('paused');clearTimeout(timer)})});
  ['mouseleave','focusout'].forEach(function(ev){box.addEventListener(ev,function(e){if(ev==='focusout'&&box.contains(e.relatedTarget))return;hoverPause=false;box.classList.toggle('paused',paused);schedule()})});
  setPaused(paused);
}

/* ---------- ask Gitty chat: שאלות ותשובות אמיתיות של גיטי (נובמבר 2026) ---------- */
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
