const reducedMotion=window.matchMedia('(prefers-reduced-motion: reduce)');
if(!reducedMotion.matches)document.documentElement.classList.add('js-motion');
const reveals=new IntersectionObserver(entries=>entries.forEach(entry=>{if(entry.isIntersecting){entry.target.classList.add('is-visible');reveals.unobserve(entry.target)}}),{threshold:.08});
document.querySelectorAll('.reveal').forEach((el,i)=>{el.style.transitionDelay=`${el.classList.contains('plan')?i%3*80:0}ms`;reveals.observe(el)});
const progress=document.querySelector('.scroll-progress');
let scrollScheduled=false;
function updateProgress(){const total=document.documentElement.scrollHeight-innerHeight;progress.style.transform=`scaleX(${total>0?scrollY/total:0})`;scrollScheduled=false}
addEventListener('scroll',()=>{if(!scrollScheduled){requestAnimationFrame(updateProgress);scrollScheduled=true}},{passive:true});addEventListener('resize',updateProgress);updateProgress();
const navLinks=[...document.querySelectorAll('.desktop-nav a')];
const sectionObserver=new IntersectionObserver(entries=>{entries.forEach(e=>{if(e.isIntersecting)navLinks.forEach(a=>a.classList.toggle('current',a.hash===`#${e.target.id}`))})},{rootMargin:'-20% 0px -50% 0px'});
document.querySelectorAll('section[id]').forEach(el=>sectionObserver.observe(el));
const menuToggle=document.querySelector('.menu-toggle'),mobileMenu=document.querySelector('.mobile-menu');
function closeMenu(){mobileMenu.hidden=true;menuToggle.setAttribute('aria-expanded','false');menuToggle.setAttribute('aria-label','Abrir menu')}
menuToggle.addEventListener('click',()=>{const open=menuToggle.getAttribute('aria-expanded')==='true';mobileMenu.hidden=open;menuToggle.setAttribute('aria-expanded',String(!open));menuToggle.setAttribute('aria-label',open?'Abrir menu':'Fechar menu')});
mobileMenu.querySelectorAll('a').forEach(a=>a.addEventListener('click',closeMenu));
addEventListener('keydown',e=>{if(e.key==='Escape')closeMenu()});
addEventListener('resize',()=>{if(innerWidth>1050)closeMenu()});
const hero=document.querySelector('.hero-new');
const heroArt=document.querySelector('.hero-art');
hero.addEventListener('pointermove',e=>{
  if(reducedMotion.matches||e.pointerType!=='mouse')return;
  const r=hero.getBoundingClientRect();
  heroArt.style.setProperty('--art-x',`${(e.clientX-r.left-r.width/2)/r.width*12}px`);
  heroArt.style.setProperty('--art-y',`${(e.clientY-r.top-r.height/2)/r.height*8}px`);
});
hero.addEventListener('pointerleave',()=>{heroArt.style.setProperty('--art-x','0px');heroArt.style.setProperty('--art-y','0px')});
const dialog=document.querySelector('#plan-dialog');
document.querySelectorAll('.plan-select').forEach(button=>button.addEventListener('click',()=>{dialog.querySelector('#dialog-title span').textContent=button.dataset.plan;dialog.querySelector('.dialog-price').textContent=button.dataset.price;dialog.showModal()}));
dialog.querySelector('.dialog-close').addEventListener('click',()=>dialog.close());
dialog.addEventListener('click',e=>{if(e.target===dialog){const r=dialog.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)dialog.close()}});
document.querySelector('#year').textContent=new Date().getFullYear();

const schedule=document.querySelector('.schedule-board');
const dayTabs=[...schedule.querySelectorAll('.day-tab')];
const dayPanels=[...schedule.querySelectorAll('.schedule-panel')];
schedule.querySelector('.schedule-tabs').setAttribute('role','tablist');
function selectDay(tab,focus=false){
  dayTabs.forEach(button=>{const active=button===tab;button.setAttribute('aria-selected',String(active));button.tabIndex=active?0:-1});
  dayPanels.forEach(panel=>{panel.hidden=panel.id!==`aulas-${tab.dataset.day}`});
  if(focus)tab.focus();
  updateProgress();
}
dayTabs.forEach((tab,index)=>{
  tab.setAttribute('role','tab');
  tab.setAttribute('aria-controls',`aulas-${tab.dataset.day}`);
  const panel=document.getElementById(`aulas-${tab.dataset.day}`);
  panel.setAttribute('role','tabpanel');panel.setAttribute('aria-labelledby',tab.id);panel.tabIndex=0;
  tab.addEventListener('click',()=>selectDay(tab));
  tab.addEventListener('keydown',event=>{
    let target;
    if(event.key==='ArrowRight')target=(index+1)%dayTabs.length;
    if(event.key==='ArrowLeft')target=(index-1+dayTabs.length)%dayTabs.length;
    if(event.key==='Home')target=0;
    if(event.key==='End')target=dayTabs.length-1;
    if(target!==undefined){event.preventDefault();selectDay(dayTabs[target],true)}
  });
});
selectDay(dayTabs[0]);
