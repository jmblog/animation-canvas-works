export {};

interface Dot {
  x: number;
  y: number;
  xMove: '+' | '-';
  yMove: '+' | '-';
  speed: number;
}

const main = () => {
  const canvas = document.getElementById('mainCanvas') as HTMLCanvasElement;
  const ctx = canvas.getContext('2d');
  if (ctx === null) return;

  // Set canvas width and height
  canvas.width = document.body.clientWidth;
  canvas.height = document.body.clientHeight;

  canvas.style.background = '#0e1e25';

  const dots: Dot[] = [];
  const numberOfDots = canvas.width / 10;

  // Prepare dots
  for (let i = 0; i < numberOfDots; i++) {
    dots.push({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      xMove: ['+', '-'][Math.floor(Math.random() * 2)],
      yMove: ['+', '-'][Math.floor(Math.random() * 2)],
      speed: Math.random() * 0.7 + 0.1,
    } as Dot);
  }

  // Start moving dots
  moveDots(ctx, dots, canvas.width, canvas.height);
};

const moveDots = (ctx: CanvasRenderingContext2D, dots: Dot[], canvasWidth: number, canvasHeight: number) => {
  const threshold = 100;

  ctx.clearRect(0, 0, canvasWidth, canvasHeight);

  dots.forEach(dot => {
    if (dot.xMove === '+') {
      dot.x += dot.speed;
    } else {
      dot.x -= dot.speed;
    }
    if (dot.yMove === '+') {
      dot.y += dot.speed;
    } else {
      dot.y -= dot.speed;
    }

    // If a dot moves outside of the canvas, move it backward
    if (dot.x >= canvasWidth) {
      dot.xMove = '-';
    }
    if (dot.x <= 0) {
      dot.xMove = '+';
    }
    if (dot.y >= canvasHeight) {
      dot.yMove = '-';
    }
    if (dot.y <= 0) {
      dot.yMove = '+';
    }

    drawDot(ctx, dot, 0.2);

    // Draw Lines between dots which are close nearby
    dots.forEach(dotB => {
      if (dot.x === dotB.x && dot.y === dotB.y) {
        return;
      }
      const distanceX = Math.abs(dot.x - dotB.x);
      const distanceY = Math.abs(dot.y - dotB.y);
      if (distanceX < threshold && distanceY < threshold) {
        const alpha = (1 - distanceX / threshold) * (1 - distanceY / threshold);
        drawLine(ctx, dot, dotB, alpha);
        drawDot(ctx, dot, alpha);
      }
    });
  });

  window.requestAnimationFrame(() => {
    return moveDots(ctx, dots, canvasWidth, canvasHeight);
  });
};

const drawDot = (ctx: CanvasRenderingContext2D, dot: Dot, alpha: number) => {
  ctx.beginPath();
  ctx.arc(dot.x, dot.y, 2, 0, 2 * Math.PI, false);
  ctx.fillStyle = `rgba(116, 134, 141, ${alpha})`;
  ctx.fill();
};

const drawLine = (ctx: CanvasRenderingContext2D, dotA: Dot, dotB: Dot, alpha: number) => {
  ctx.beginPath();
  ctx.moveTo(dotA.x, dotA.y);
  ctx.lineTo(dotB.x, dotB.y);
  ctx.strokeStyle = `rgba(116, 134, 141, ${alpha})`;
  ctx.stroke();
};

document.addEventListener('DOMContentLoaded', () => {
  main();
});

window.addEventListener('resize', () => {
  main();
});
