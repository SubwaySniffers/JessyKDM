console.log('SUCK MY EURTY ASS ICK');
const canvas = document.getElementById('display');
canvas.width = canvas.offsetWidth;
canvas.height = canvas.offsetHeight;
const ctx = canvas.getContext('2d');
let baseCol = [5, 64, 150];
let endCol = [8, 96, 225];
function pcnt(xPercent, yPercent) {
return {
  x: (xPercent / 100) * canvas.width,
  y: (yPercent / 100) * canvas.height
};
}
function d2h(d) {
    return '0123456789abcdef'[Math.floor(d / 16)] + '0123456789abcdef'[d % 16];
}

for (let i = 0; i < 50; i++) {
    let {x, y} = pcnt(Math.floor(Math.random() * 90), Math.floor(Math.random() * 90));
    let {w, h} = pcnt(10, 10);
    ctx.fillStyle = '#'+d2h(endCol[0])+d2h(endCol[1])+d2h(endCol[2]);
    ctx.fillRect(x, y, w, h);
}
