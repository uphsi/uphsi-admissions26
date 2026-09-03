
const qs=(s,el=document)=>el.querySelector(s);
const qsa=(s,el=document)=>[...el.querySelectorAll(s)];

const menuBtn=qs('#menuBtn'), nav=qs('#navLinks');
if(menuBtn){menuBtn.addEventListener('click',()=>{nav.classList.toggle('open');menuBtn.setAttribute('aria-expanded',nav.classList.contains('open'));});}

const themeBtn=qs('#themeToggle');
const savedTheme=localStorage.getItem('uphs-theme');
if(savedTheme==='dark') document.body.classList.add('dark');
if(themeBtn){
  themeBtn.textContent=document.body.classList.contains('dark')?'☀':'◐';
  themeBtn.addEventListener('click',()=>{
    document.body.classList.toggle('dark');
    localStorage.setItem('uphs-theme',document.body.classList.contains('dark')?'dark':'light');
    themeBtn.textContent=document.body.classList.contains('dark')?'☀':'◐';
  });
}

let fontSize=parseInt(localStorage.getItem('uphs-font')||'16');
function applyFont(){document.documentElement.style.setProperty('--base-font',fontSize+'px');localStorage.setItem('uphs-font',fontSize);}
qsa('[data-font]').forEach(btn=>btn.addEventListener('click',()=>{
  const action=btn.dataset.font;
  if(action==='up') fontSize=Math.min(20,fontSize+1);
  if(action==='down') fontSize=Math.max(14,fontSize-1);
  if(action==='reset') fontSize=16;
  applyFont();
}));
applyFont();

const revealObserver=new IntersectionObserver(entries=>{
  entries.forEach(e=>{if(e.isIntersecting){e.target.classList.add('visible');revealObserver.unobserve(e.target);}});
},{threshold:.1});
qsa('.reveal').forEach(el=>revealObserver.observe(el));

qsa('.accordion-button').forEach(btn=>btn.addEventListener('click',()=>{
  const panel=btn.parentElement.querySelector('.accordion-panel');
  const open=btn.getAttribute('aria-expanded')==='true';
  btn.setAttribute('aria-expanded',String(!open));
  btn.querySelector('span:last-child').textContent=open?'+':'−';
  panel.style.maxHeight=open?null:panel.scrollHeight+'px';
}));


const admissionTracks = {
  jhs: {
    admissionEnd: '2026-10-09T23:59:59+08:00',
    examDate: '2026-10-17T08:00:00+08:00',
    admissionTitle: 'Grade 7 admission period ends',
    examTitle: 'Grade 7 entrance examination'
  },
  shs: {
    admissionEnd: '2026-10-19T23:59:59+08:00',
    examDate: '2026-10-24T08:00:00+08:00',
    admissionTitle: 'Grade 11 admission period ends',
    examTitle: 'Grade 11 entrance examination'
  }
};

function countdownParts(diff){
  return {
    days: Math.floor(diff/86400000),
    hours: Math.floor(diff/3600000)%24,
    minutes: Math.floor(diff/60000)%60,
    seconds: Math.floor(diff/1000)%60
  };
}

function updateTrackCountdown(key){
  const track=admissionTracks[key];
  const box=qs(`#${key}Countdown`);
  if(!box) return;

  const now=new Date();
  const admissionEnd=new Date(track.admissionEnd);
  const examDate=new Date(track.examDate);
  let target, label, title;

  if(now < admissionEnd){
    target=admissionEnd;
    label='Admission period ends in';
    title=track.admissionTitle;
  } else if(now < examDate){
    target=examDate;
    label='Admission period has ended — exam in';
    title=track.examTitle;
  } else {
    qs(`#${key}CountdownLabel`).textContent='Entrance examination date';
    qs(`#${key}CountdownTitle`).textContent='Examination period reached';
    ['days','hours','minutes','seconds'].forEach(unit=>qs(`#${key}-${unit}`).textContent='00');
    return;
  }

  const p=countdownParts(Math.max(0,target-now));
  qs(`#${key}CountdownLabel`).textContent=label;
  qs(`#${key}CountdownTitle`).textContent=title;
  qs(`#${key}-days`).textContent=String(p.days).padStart(2,'0');
  qs(`#${key}-hours`).textContent=String(p.hours).padStart(2,'0');
  qs(`#${key}-minutes`).textContent=String(p.minutes).padStart(2,'0');
  qs(`#${key}-seconds`).textContent=String(p.seconds).padStart(2,'0');
}

function tick(){
  updateTrackCountdown('jhs');
  updateTrackCountdown('shs');
}
tick();
setInterval(tick,1000);
