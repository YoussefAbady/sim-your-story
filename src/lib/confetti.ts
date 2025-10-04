export const triggerConfetti = () => {
  const duration = 3 * 1000;
  const animationEnd = Date.now() + duration;
  const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };

  function randomInRange(min: number, max: number) {
    return Math.random() * (max - min) + min;
  }

  const interval: any = setInterval(function() {
    const timeLeft = animationEnd - Date.now();

    if (timeLeft <= 0) {
      return clearInterval(interval);
    }

    const particleCount = 50 * (timeLeft / duration);
    
    // Create confetti particles manually with DOM
    for (let i = 0; i < particleCount; i++) {
      const particle = document.createElement('div');
      particle.style.position = 'fixed';
      particle.style.width = '10px';
      particle.style.height = '10px';
      particle.style.backgroundColor = `hsl(${Math.random() * 360}, 70%, 60%)`;
      particle.style.left = `${randomInRange(10, 90)}%`;
      particle.style.top = '-20px';
      particle.style.borderRadius = '50%';
      particle.style.pointerEvents = 'none';
      particle.style.zIndex = '9999';
      particle.style.opacity = '1';
      
      document.body.appendChild(particle);
      
      const animation = particle.animate([
        { 
          transform: `translate(0, 0) rotate(0deg)`,
          opacity: 1 
        },
        { 
          transform: `translate(${randomInRange(-100, 100)}px, ${window.innerHeight + 20}px) rotate(${randomInRange(0, 360)}deg)`,
          opacity: 0 
        }
      ], {
        duration: randomInRange(2000, 4000),
        easing: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)'
      });
      
      animation.onfinish = () => {
        particle.remove();
      };
    }
  }, 250);
};
