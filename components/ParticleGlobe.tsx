'use client';

import { useEffect, useRef } from 'react';

interface Particle {
  lon: number;
  lat: number;
}

interface ParticleGlobeProps {
  speed?: number;
}

export default function ParticleGlobe({ speed = 1 }: ParticleGlobeProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<Particle[]>([]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const setCanvasSize = () => {
      const size = Math.min(window.innerWidth, 600);
      canvas.width = size;
      canvas.height = size;
    };
    setCanvasSize();
    window.addEventListener('resize', setCanvasSize);

    let angle = 0;
    const rotationSpeed = ((Math.PI * 2) / (12 * 60)) * speed;
    let animationId: number;

    const animate = () => {
      const radius = canvas.width * 0.35;
      const centerX = canvas.width / 2;
      const centerY = canvas.height / 2;

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      angle += rotationSpeed;

      const sortedParticles = particlesRef.current.map(p => {
        const rotatedLon = p.lon + angle;
        const x = radius * Math.cos(p.lat) * Math.cos(rotatedLon);
        const y = radius * Math.sin(p.lat);
        const z = radius * Math.cos(p.lat) * Math.sin(rotatedLon);

        return { x, y, z };
      }).sort((a, b) => a.z - b.z);

      sortedParticles.forEach(({ x, y, z }) => {
        const scale = (z + radius) / (2 * radius);
        const x2d = centerX + x;
        const y2d = centerY - y;
        const size = 0.9 + 0.6 * scale;
        const opacity = 0.35 + 0.55 * scale;

        ctx.fillStyle = `rgba(60, 110, 180, ${opacity})`;
        ctx.beginPath();
        ctx.arc(x2d, y2d, size, 0, Math.PI * 2);
        ctx.fill();
      });

      animationId = requestAnimationFrame(animate);
    };

    const img = new Image();
    img.src = '/globe/lizi.png';

    img.onload = () => {
      const tempCanvas = document.createElement('canvas');
      tempCanvas.width = img.width;
      tempCanvas.height = img.height;
      const tempCtx = tempCanvas.getContext('2d');
      if (!tempCtx) return;

      tempCtx.drawImage(img, 0, 0);
      const imageData = tempCtx.getImageData(0, 0, img.width, img.height);
      const particles: Particle[] = [];

      const samplingRate = 3;
      for (let y = 0; y < img.height; y += samplingRate) {
        for (let x = 0; x < img.width; x += samplingRate) {
          const i = (y * img.width + x) * 4;
          const brightness = (imageData.data[i] + imageData.data[i + 1] + imageData.data[i + 2]) / 3;

          if (brightness > 100 && Math.random() > 0.7) {
            const lon = (x / img.width) * Math.PI * 2;
            const lat = (y / img.height) * Math.PI - Math.PI / 2;
            particles.push({ lon, lat });
          }
        }
      }

      particlesRef.current = particles;
    };

    animate();

    return () => {
      window.removeEventListener('resize', setCanvasSize);
      cancelAnimationFrame(animationId);
    };
  }, [speed]);

  return (
    <div className="particleGlobeWrap" aria-hidden="true">
      <canvas ref={canvasRef} className="particleGlobe3d" />
      <div className="particleGlobeGlow" />
      <div className="particleGlobeVignette" />
    </div>
  );
}
