// pagemap © 2019 Lars Jung (https://larsjung.de/pagemap), The MIT License (MIT)
// eslint-disable-next-line no-sequences
function pagemap(a,b) {var c,d,e,f,g,h=window,i=h.document,j=i.documentElement,k=i.querySelector("body"),l=a.getContext("2d"),m=function(a) {return "rgba(0,0,0,".concat(a/100,")");},n={viewport:null,styles:{"header,footer,section,article":m(8),"h1,a":m(10),"h2,h3,h4":m(8)},back:m(2),view:m(5),drag:m(10),interval:null,...b},o=function(a,b,c,d) {return c.split(/\s+/).forEach(function(c) {return a[b](c,d);});},p=function(a,b,c) {return o(a,"addEventListener",b,c);},q=function(a,b,c) {return o(a,"removeEventListener",b,c);},r=function(a,b,c,d) {return {x:a,y:b,w:c,h:d};},s=function(a) {var b=1<arguments.length&&void 0!==arguments[1]?arguments[1]:{x:0,y:0}; return r(a.x-b.x,a.y-b.y,a.w,a.h);},t=function() {return r(0,0,j.scrollWidth,j.scrollHeight);},u=function() {return r(h.pageXOffset,h.pageYOffset,j.clientWidth,j.clientHeight);},v=function(a) {var b=a.getBoundingClientRect(); return {x:b.left+h.pageXOffset,y:b.top+h.pageYOffset};},w=function(a) {var b=v(a),c=b.x,d=b.y; return r(c,d,a.offsetWidth,a.offsetHeight);},z=function(a) {var b=v(a),c=b.x,d=b.y; return r(c+a.clientLeft,d+a.clientTop,a.clientWidth,a.clientHeight);},A=function(a) {var b=v(a),c=b.x,d=b.y; return r(c+a.clientLeft-a.scrollLeft,d+a.clientTop-a.scrollTop,a.scrollWidth,a.scrollHeight);},B=(function() {var b=a.clientWidth,c=a.clientHeight; return function(a,d) {return Math.min(b/a,c/d);};})(),C=function(b,c) {a.width=b,a.height=c,a.style.width="".concat(b,"px"),a.style.height="".concat(c,"px");},D=n.viewport,E=function(a) {return Array.from((D||i).querySelectorAll(a));},F=!1,G=function(a,b) {b&&(l.beginPath(),l.rect(a.x,a.y,a.w,a.h),l.fillStyle=b,l.fill());},H=function(a) {Object.keys(a).forEach(function(b) {var d=a[b]; E(b).forEach(function(a) {G(s(w(a),c),d);});});},I=function() {c=D?A(D):t(),d=D?z(D):u(),e=B(c.w,c.h),C(c.w*e,c.h*e),l.setTransform(1,0,0,1,0,0),l.clearRect(0,0,a.width,a.height),l.scale(e,e),G(s(c,c),n.back),H(n.styles),G(s(d,c),F?n.drag:n.view);},J=function(b) {b.preventDefault(); var c=z(a),i=(b.pageX-c.x)/e-d.w*f,j=(b.pageY-c.y)/e-d.h*g; D?(D.scrollLeft=i,D.scrollTop=j):h.scrollTo(i,j),I();},K=function b(c) {F=!1,a.style.cursor="grab",k.style.cursor="auto",q(h,"mousemove",J),q(h,"mouseup",b),J(c);},L=function(b) {F=!0; var i=z(a),j=s(d,c); f=((b.pageX-i.x)/e-j.x)/j.w,g=((b.pageY-i.y)/e-j.y)/j.h,(0>f||1<f||0>g||1<g)&&(f=.5,g=.5),a.style.cursor="grabbing",k.style.cursor="grabbing",p(h,"mousemove",J),p(h,"mouseup",K),J(b);}; return (function() {a.style.cursor="grab",p(a,"mousedown",L),p(D||h,"load resize scroll",I),0<n.interval&&setInterval(function() {return I();},n.interval),I();})(),{redraw:I};}

const canvas = document.createElement('canvas');
canvas.style.position = 'fixed';
canvas.style.top = '16px';
canvas.style.right = '16px';
canvas.style.width = '120px';
canvas.style.height = '90%';
canvas.style.zIndex = 2147483647;
canvas.style.backgroundColor = 'rgba(255, 255, 255, 0.2)';
document.body.appendChild(canvas);

pagemap(canvas, {
  viewport: null,
  styles: {
    'header, footer, section, article': 'rgba(0, 0, 0, 0.08)',
    'h1, a': 'rgba(0, 0, 0, 0.10)',
    'h2, h3, h4': 'rgba(0, 0, 0, 0.08)',
    'img, pre': 'rgba(0, 0, 0, 0.05)'
  },
  back: null,
  view: 'rgba(0, 0, 0, 0.08)',
  drag: 'rgba(0, 0, 0, 0.10)',
  interval: null
});
