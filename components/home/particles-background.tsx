'use client';

import { useEffect, useRef } from 'react';

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  opacity: number;
  baseOpacity: number;
  color: string;
}

export function ParticlesBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particles = useRef<Particle[]>([]);
  const mouse = useRef({ x: 0, y: 0 });
  const animationFrame = useRef<number>(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resize = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
      initParticles();
    };

    const initParticles = () => {
      const particleCount = window.innerWidth < 768 ? 50 : 80;
      particles.current = [];

      for (let i = 0; i < particleCount; i++) {
        const isPrimary = Math.random() > 0.3;
        particles.current.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          vx: (Math.random() - 0.5) * 1.2 + (Math.random() > 0.5 ? 0.3 : -0.3),
          vy: (Math.random() - 0.5) * 1.2 + (Math.random() > 0.5 ? 0.3 : -0.3),
          size: Math.random() * 1 + 2,
          opacity: Math.random() * 0.2 + 0.4,
          baseOpacity: Math.random() * 0.2 + 0.4,
          color: isPrimary ? '#3B82F6' : '#00FFFF',
        });
      }
    };

    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouse.current = {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      };
    };

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      particles.current.forEach((particle) => {
        const dx = mouse.current.x - particle.x;
        const dy = mouse.current.y - particle.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < 150 && distance > 0) {
          const force = ((150 - distance) / 150) * 0.2;
          particle.vx += (dx / distance) * force;
          particle.vy += (dy / distance) * force;
          particle.opacity = Math.min(0.8, particle.baseOpacity + force * 2);
        } else {
          particle.opacity = Math.max(
            particle.baseOpacity,
            particle.opacity - 0.01
          );
        }

        particle.x += particle.vx;
        particle.y += particle.vy;

        // Minimum hız koruması - parçacıklar asla durmasın
        const speed = Math.sqrt(particle.vx * particle.vx + particle.vy * particle.vy);
        if (speed < 0.4) {
          particle.vx *= 1.05;
          particle.vy *= 1.05;
        } else if (speed > 2) {
          particle.vx *= 0.98;
          particle.vy *= 0.98;
        }

        if (particle.x < 0) particle.x = canvas.width;
        if (particle.x > canvas.width) particle.x = 0;
        if (particle.y < 0) particle.y = canvas.height;
        if (particle.y > canvas.height) particle.y = 0;

        ctx.save();
        ctx.shadowColor = particle.color;
        ctx.shadowBlur = 15;
        ctx.globalAlpha = particle.opacity;
        ctx.fillStyle = particle.color;
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      });

      animationFrame.current = requestAnimationFrame(animate);
    };

    resize();
    animate();

    window.addEventListener('resize', resize);
    canvas.addEventListener('mousemove', handleMouseMove);

    return () => {
      window.removeEventListener('resize', resize);
      canvas.removeEventListener('mousemove', handleMouseMove);
      if (animationFrame.current) {
        cancelAnimationFrame(animationFrame.current);
      }
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full"
      style={{ zIndex: 0, pointerEvents: 'auto' }}
    />
  );
}
