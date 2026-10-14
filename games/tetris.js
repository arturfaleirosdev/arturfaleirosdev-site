// Minimal Tetris implementation (canvas-based)
(function(){
  if(document.getElementById('tetrisCanvas')) return;
  const container = document.querySelector('#gameArea');
  const canvas = document.createElement('canvas'); canvas.id='tetrisCanvas'; canvas.width=240; canvas.height=400; canvas.style.border='1px solid rgba(255,255,255,0.06)';
  container.appendChild(canvas);
  const ctx = canvas.getContext('2d');
  const ROWS = 20, COLS = 10, BLOCK=20;
  const field = Array.from({length:ROWS},()=>Array(COLS).fill(0));
  const pieces = {
    I: [[1,1,1,1]],
    O: [[1,1],[1,1]],
    T: [[0,1,0],[1,1,1]],
    S: [[0,1,1],[1,1,0]],
    Z: [[1,1,0],[0,1,1]],
    J: [[1,0,0],[1,1,1]],
    L: [[0,0,1],[1,1,1]]
  };
  const colors = {0:'#071023',I:'#06b6d4',O:'#f59e0b',T:'#8b5cf6',S:'#10b981',Z:'#ef4444',J:'#3b82f6',L:'#f97316'};
  function randPiece(){ const keys=Object.keys(pieces); const k=keys[Math.floor(Math.random()*keys.length)]; return {shape:pieces[k],type:k,x:Math.floor(COLS/2)-1,y:0}; }
  let piece = randPiece();
  function draw(){ ctx.fillStyle=colors[0]; ctx.fillRect(0,0,COLS*BLOCK,ROWS*BLOCK);
    for(let r=0;r<ROWS;r++) for(let c=0;c<COLS;c++) if(field[r][c]){ctx.fillStyle=field[r][c]; ctx.fillRect(c*BLOCK,r*BLOCK,BLOCK-1,BLOCK-1)}
    // draw current piece
    const s = piece.shape; for(let r=0;r<s.length;r++) for(let c=0;c<s[r].length;c++) if(s[r][c]){ ctx.fillStyle=colors[piece.type]; ctx.fillRect((piece.x+c)*BLOCK,(piece.y+r)*BLOCK,BLOCK-1,BLOCK-1)}
  }
  function collide(nx,ny,shape){ for(let r=0;r<shape.length;r++) for(let c=0;c<shape[r].length;c++) if(shape[r][c]){
      const x = nx+c, y = ny+r; if(x<0||x>=COLS||y>=ROWS) return true; if(y>=0 && field[y][x]) return true;
    } return false }
  function rotate(shape){ const H=shape.length, W=shape[0].length; const out = Array.from({length:W},()=>Array(H).fill(0)); for(let r=0;r<H;r++) for(let c=0;c<W;c++) out[c][H-1-r]=shape[r][c]; return out }
  function lock(){ const s=piece.shape; for(let r=0;r<s.length;r++) for(let c=0;c<s[r].length;c++) if(s[r][c]){ const y=piece.y+r; const x=piece.x+c; if(y>=0) field[y][x]=colors[piece.type]; }
    // clear lines
    for(let r=ROWS-1;r>=0;r--){ if(field[r].every(v=>v)){ field.splice(r,1); field.unshift(Array(COLS).fill(0)); r++; }}
    piece=randPiece(); if(collide(piece.x,piece.y,piece.shape)){ alert('Game over'); field.forEach((row,i)=>field[i]=Array(COLS).fill(0)); }
  }
  let dropInterval=500, last=0;
  function update(ts){ if(!last) last=ts; if(ts-last>dropInterval){ if(!collide(piece.x,piece.y+1,piece.shape)) piece.y++; else lock(); last=ts } draw(); requestAnimationFrame(update) }
  document.addEventListener('keydown',e=>{
    if(e.key==='ArrowLeft' && !collide(piece.x-1,piece.y,piece.shape)) piece.x--;
    if(e.key==='ArrowRight' && !collide(piece.x+1,piece.y,piece.shape)) piece.x++;
    if(e.key==='ArrowDown' && !collide(piece.x,piece.y+1,piece.shape)) piece.y++;
    if(e.key===' ') { const r = rotate(piece.shape); if(!collide(piece.x,piece.y,r)) piece.shape=r; }
  });
  requestAnimationFrame(update);
})();
