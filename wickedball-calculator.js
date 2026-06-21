/* WickedBall homepage pricing calculator. Loaded externally via jsDelivr so the inline JS never has to pass the Cloudflare WAF. */
(function(){
  if(!document.getElementById('pkgSeg')){return;} // only run where the calculator markup exists (homepage)
  // Real WickedBall in-store pricing
  const PKG = {
    all:    { name:'All-Access',    perGuest:30, dur:{'1':350,'1.5':450,'2':550,'2.5':650,'3':750} },
    deluxe: { name:'Deluxe',        perGuest:30, dur:{'1':500,'1.5':600,'2':700,'2.5':800,'3':900} },
    vip:    { name:'VIP / Private', perGuest:40, dur:{'2':1250,'2.5':1375,'3':1500} }
  };
  let pkg='all', dur=null, guests=10, day='week';

  const totalEl=document.getElementById('total');
  const perEl=document.getElementById('perPerson');
  const breakEl=document.getElementById('breakdown');
  const hrSeg=document.getElementById('hrSeg');
  const money=n=>'$'+Math.round(n).toLocaleString('en-US');

  function buildDurations(){
    const keys=Object.keys(PKG[pkg].dur).sort((a,b)=>parseFloat(a)-parseFloat(b));
    if(!keys.includes(dur)) dur=keys[0];
    hrSeg.innerHTML='';
    keys.forEach(k=>{
      const b=document.createElement('button');
      b.dataset.hr=k; b.setAttribute('aria-pressed', k===dur);
      b.innerHTML=k+' hr<small>'+money(PKG[pkg].dur[k])+'</small>';
      b.onclick=()=>{dur=k;[...hrSeg.children].forEach(x=>x.setAttribute('aria-pressed',x===b));render();};
      hrSeg.appendChild(b);
    });
  }
  function render(){
    const base=PKG[pkg].dur[dur];
    const baseAfter= day==='week' ? base*0.9 : base;
    const extra=Math.max(0,guests-10);
    const guestCost=extra*PKG[pkg].perGuest;
    const total=baseAfter+guestCost;
    totalEl.textContent=money(total);
    perEl.textContent='≈ '+money(total/guests)+' / guest at '+guests+' guests';
    let rows='<div><span>'+PKG[pkg].name+' · '+dur+' hr base</span><span>'+money(base)+'</span></div>';
    if(day==='week') rows+='<div><span>Weekday special (10% off)</span><span>−'+money(base*0.1)+'</span></div>';
    rows+='<div><span>Extra guests ('+extra+' × $'+PKG[pkg].perGuest+')</span><span>'+money(guestCost)+'</span></div>';
    breakEl.innerHTML=rows;
    // Build the GHL funnel URL with the calculator data + carry through any ad UTMs / click IDs
    var lock=document.getElementById('lockBtn');
    var params=new URLSearchParams(window.location.search); // preserves utm_source, utm_medium, utm_campaign, gclid, fbclid, etc.
    params.set('package', PKG[pkg].name);
    params.set('duration', dur);
    params.set('estimated_total', Math.round(total));
    params.set('guest_count', guests);
    lock.href='https://ghloffer.wickedballchicago.com/request-page?'+params.toString();
  }
  document.getElementById('pkgSeg').addEventListener('click',e=>{
    const b=e.target.closest('button'); if(!b)return;
    pkg=b.dataset.pkg;
    [...document.querySelectorAll('#pkgSeg button')].forEach(x=>x.setAttribute('aria-pressed',x===b));
    buildDurations(); render();
  });
  document.getElementById('daySeg').addEventListener('click',e=>{
    const b=e.target.closest('button'); if(!b)return;
    day=b.dataset.day;
    [...document.querySelectorAll('#daySeg button')].forEach(x=>x.setAttribute('aria-pressed',x===b));
    render();
  });
  document.getElementById('gPlus').onclick=()=>{guests++;document.getElementById('gVal').textContent=guests;render();};
  document.getElementById('gMinus').onclick=()=>{if(guests>6){guests--;document.getElementById('gVal').textContent=guests;render();}};
  buildDurations(); render();

  // Count-up
  const reduce=matchMedia('(prefers-reduced-motion: reduce)').matches;
  document.querySelectorAll('.ti .num[data-count]').forEach(el=>{
    const io=new IntersectionObserver((ents)=>{ents.forEach(en=>{ if(!en.isIntersecting)return;
      const target=+el.dataset.count, suf=el.dataset.suffix||'';
      if(reduce){el.innerHTML=target.toLocaleString()+suf;io.disconnect();return;}
      let i=0;const t=setInterval(()=>{i++;const v=Math.min(target,Math.round(target/40*i));el.innerHTML=v.toLocaleString()+suf;if(i>=40){clearInterval(t);el.innerHTML=target.toLocaleString()+suf;}},22);
      io.disconnect();
    });},{threshold:.5});
    io.observe(el);
  });
})();
