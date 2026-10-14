// Simple Pong (Ping-Pong) implementation
(function(){
  if(document.getElementById('pongCanvas')) return;
  const container = document.querySelector('#gameArea');
  const canvas = document.createElement('canvas'); canvas.id='pongCanvas'; canvas.width=640; canvas.height=320; canvas.style.border='1px solid rgba(255,255,255,0.06)';
  container.appendChild(canvas);
  const ctx = canvas.getContext('2d');
  const paddleH=60, paddleW=10; let leftY=130, rightY=130;
  const ball = {x:canvas.width/2,y:canvas.height/2, vx:3, vy:2, r:6};
  function draw(){ ctx.fillStyle='#071023'; ctx.fillRect(0,0,canvas.width,canvas.height);
    ctx.fillStyle='#e6eef6'; ctx.fillRect(20,leftY,paddleW,paddleH); ctx.fillRect(canvas.width-30,rightY,paddleW,paddleH);
    ctx.beginPath(); ctx.arc(ball.x,ball.y,ball.r,0,Math.PI*2); ctx.fill();
  }
  function step(){ ball.x+=ball.vx; ball.y+=ball.vy; if(ball.y<ball.r||ball.y>canvas.height-ball.r) ball.vy*=-1;
    // left paddle
    if(ball.x-ball.r<30 && ball.y>leftY && ball.y<leftY+paddleH){ ball.vx*=-1 }
    // right paddle
    if(ball.x+ball.r>canvas.width-30 && ball.y>rightY && ball.y<rightY+paddleH){ ball.vx*=-1 }
    // score & reset
    if(ball.x<0 || ball.x>canvas.width){ ball.x=canvas.width/2; ball.y=canvas.height/2; ball.vx = (Math.random()>0.5?1:-1)*3; ball.vy = (Math.random()>0.5?1:-1)*2 }
    // simple AI for right paddle
    if(rightY + paddleH/2 < ball.y) rightY += 2; else rightY -=2;
    // limit
    rightY = Math.max(0, Math.min(canvas.height-paddleH, rightY));
  }
  // control left paddle with mouse
  canvas.addEventListener('mousemove', e => { const rect=canvas.getBoundingClientRect(); leftY = e.clientY - rect.top - paddleH/2; leftY = Math.max(0, Math.min(canvas.height-paddleH, leftY)); });
  function loop(){ step(); draw(); requestAnimationFrame(loop) }
  loop();
})();
