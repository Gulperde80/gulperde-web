(function () {
  if (localStorage.getItem('gp_kvkk')) return;

  var style = document.createElement('style');
  style.textContent =
    '.gp-kvkk{position:fixed;bottom:0;left:0;right:0;z-index:9999;' +
    'background:rgba(26,22,18,.97);backdrop-filter:blur(8px);-webkit-backdrop-filter:blur(8px);' +
    'border-top:1px solid rgba(184,151,90,.3);padding:14px 28px;' +
    'display:flex;align-items:center;justify-content:space-between;gap:20px;' +
    'font-family:"Jost",system-ui,sans-serif;}' +
    '.gp-kvkk-text{font-size:.78rem;font-weight:300;color:rgba(245,240,232,.72);line-height:1.5;}' +
    '.gp-kvkk-text a{color:#b8975a;text-decoration:underline;}' +
    '.gp-kvkk-btns{display:flex;gap:8px;flex-shrink:0;}' +
    '.gp-kvkk-btn{font-family:inherit;font-size:.7rem;font-weight:400;letter-spacing:.08em;' +
    'text-transform:uppercase;padding:7px 16px;border-radius:3px;cursor:pointer;' +
    'transition:all .2s;border:1px solid;}' +
    '.gp-kvkk-accept{background:#b8975a;color:#1a1612;border-color:#b8975a;}' +
    '.gp-kvkk-accept:hover{background:#9a7c45;border-color:#9a7c45;}' +
    '.gp-kvkk-reject{background:transparent;color:rgba(245,240,232,.55);border-color:rgba(245,240,232,.2);}' +
    '.gp-kvkk-reject:hover{color:rgba(245,240,232,.9);border-color:rgba(245,240,232,.5);}' +
    '@media(max-width:600px){.gp-kvkk{flex-direction:column;align-items:flex-start;padding:14px 20px;}' +
    '.gp-kvkk-btns{width:100%;}.gp-kvkk-btn{flex:1;text-align:center;}}';
  document.head.appendChild(style);

  var bar = document.createElement('div');
  bar.className = 'gp-kvkk';
  bar.innerHTML =
    '<span class="gp-kvkk-text">Bu site bazı temel işlevler için çerezler kullanmaktadır. ' +
    'Detaylar için <a href="/kvkk.html">Gizlilik Politikası</a> sayfamızı inceleyebilirsiniz.</span>' +
    '<div class="gp-kvkk-btns">' +
    '<button class="gp-kvkk-btn gp-kvkk-reject">Reddet</button>' +
    '<button class="gp-kvkk-btn gp-kvkk-accept">Kabul Et</button>' +
    '</div>';
  document.body.appendChild(bar);

  function dismiss(choice) {
    localStorage.setItem('gp_kvkk', choice);
    bar.style.transition = 'opacity .3s,transform .3s';
    bar.style.opacity = '0';
    bar.style.transform = 'translateY(100%)';
    setTimeout(function () { bar.remove(); }, 310);
  }

  bar.querySelector('.gp-kvkk-accept').addEventListener('click', function () { dismiss('kabul'); });
  bar.querySelector('.gp-kvkk-reject').addEventListener('click', function () { dismiss('red'); });
})();
