const menu=document.getElementById('hamburgerMenu'),nav=document.getElementById('mainNav');
menu.addEventListener('click',()=>{const open=nav.classList.toggle('open');menu.setAttribute('aria-expanded',open)});
document.querySelectorAll('.main-nav a').forEach(a=>a.addEventListener('click',()=>{nav.classList.remove('open');menu.setAttribute('aria-expanded','false')}));
const observer=new IntersectionObserver(entries=>{entries.forEach(e=>{if(e.isIntersecting){e.target.classList.add('visible');observer.unobserve(e.target)}})},{threshold:.12});
document.querySelectorAll('.reveal').forEach((el,i)=>{el.style.transitionDelay=Math.min(i*45,250)+'ms';observer.observe(el)});
const header=document.querySelector('.site-header');
addEventListener('scroll',()=>{header.style.boxShadow=scrollY>20?'0 10px 40px rgba(0,0,0,.16)':'none'},{passive:true});