const VIBRANT_COLORS = [
  'hsl(270 75% 60%)',  // vibrant purple
  'hsl(330 80% 65%)',  // vibrant pink
  'hsl(180 70% 50%)',  // vibrant teal
  'hsl(25 95% 60%)',   // vibrant orange
  'hsl(85 80% 55%)',   // vibrant lime
  'hsl(211 84% 58%)',  // zus blue
  'hsl(33 100% 65%)',  // zus amber
];

const SHAPES = ['●', '★', '■', '▲', '♥', '◆'];

function randomInRange(min: number, max: number) {
  return Math.random() * (max - min) + min;
}

export const triggerConfetti = (type: 'default' | 'celebration' | 'success' | 'burst' = 'default') => {
  const duration = type === 'celebration' ? 5000 : 3000;
  const animationEnd = Date.now() + duration;
  const particleCountMultiplier = type === 'celebration' ? 80 : 50;

  const interval: any = setInterval(function() {
    const timeLeft = animationEnd - Date.now();

    if (timeLeft <= 0) {
      return clearInterval(interval);
    }

    const particleCount = particleCountMultiplier * (timeLeft / duration);
    
    // Create confetti particles
    for (let i = 0; i < particleCount; i++) {
      const particle = document.createElement('div');
      const color = VIBRANT_COLORS[Math.floor(Math.random() * VIBRANT_COLORS.length)];
      const shape = Math.random() > 0.5 ? 'circle' : 'shape';
      
      particle.style.position = 'fixed';
      particle.style.pointerEvents = 'none';
      particle.style.zIndex = '9999';
      particle.style.opacity = '1';
      particle.style.fontSize = '20px';
      
      if (shape === 'circle') {
        particle.style.width = `${randomInRange(8, 15)}px`;
        particle.style.height = particle.style.width;
        particle.style.backgroundColor = color;
        particle.style.borderRadius = '50%';
      } else {
        particle.textContent = SHAPES[Math.floor(Math.random() * SHAPES.length)];
        particle.style.color = color;
      }
      
      // Position based on type
      if (type === 'burst') {
        particle.style.left = '50%';
        particle.style.top = '50%';
      } else {
        particle.style.left = `${randomInRange(10, 90)}%`;
        particle.style.top = '-20px';
      }
      
      document.body.appendChild(particle);
      
      const xMovement = type === 'burst' 
        ? randomInRange(-300, 300) 
        : randomInRange(-100, 100);
      
      const yMovement = type === 'burst'
        ? randomInRange(-200, 400)
        : window.innerHeight + 20;
      
      const animation = particle.animate([
        { 
          transform: `translate(0, 0) rotate(0deg) scale(1)`,
          opacity: 1 
        },
        { 
          transform: `translate(${xMovement}px, ${yMovement}px) rotate(${randomInRange(0, 720)}deg) scale(${randomInRange(0.5, 1.5)})`,
          opacity: 0 
        }
      ], {
        duration: randomInRange(2000, type === 'celebration' ? 5000 : 4000),
        easing: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)'
      });
      
      animation.onfinish = () => {
        particle.remove();
      };
    }
  }, type === 'burst' ? 50 : 250);
};

// Fireworks effect for major celebrations
export const triggerFireworks = () => {
  const bursts = 5;
  for (let i = 0; i < bursts; i++) {
    setTimeout(() => {
      triggerConfetti('burst');
    }, i * 300);
  }
};
