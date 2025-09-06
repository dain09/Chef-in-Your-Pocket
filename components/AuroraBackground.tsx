import React, { memo, useRef, useEffect } from 'react';

// NOTE: This file now contains the ParticleBackground component to fulfill the user's request
// for a more "alive" background, replacing the old AuroraBackground.

interface ParticleBackgroundProps {
    colorOverlay?: string | null;
}

const ParticleBackground: React.FC<ParticleBackgroundProps> = ({ colorOverlay }) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        let animationFrameId: number;
        let particles: Particle[] = [];
        const particleColor = 'rgba(229, 184, 76, 0.7)'; // New gold color
        const lineColor = 'rgba(229, 184, 76, 0.1)';

        const resizeCanvas = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        };

        class Particle {
            x: number;
            y: number;
            size: number;
            speedX: number;
            speedY: number;

            constructor(x: number, y: number, size: number, speedX: number, speedY: number) {
                this.x = x;
                this.y = y;
                this.size = size;
                this.speedX = speedX;
                this.speedY = speedY;
            }

            draw() {
                if(!ctx) return;
                ctx.fillStyle = particleColor;
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
                ctx.fill();
            }

            update() {
                if (this.x > canvas.width || this.x < 0) this.speedX = -this.speedX;
                if (this.y > canvas.height || this.y < 0) this.speedY = -this.speedY;
                this.x += this.speedX;
                this.y += this.speedY;
            }
        }

        const init = () => {
            particles = [];
            const numberOfParticles = (canvas.height * canvas.width) / 9000;
            for (let i = 0; i < numberOfParticles; i++) {
                const size = Math.random() * 2 + 1;
                const x = Math.random() * (canvas.width - size * 2) + size;
                const y = Math.random() * (canvas.height - size * 2) + size;
                const speedX = (Math.random() * 0.5) - 0.25;
                const speedY = (Math.random() * 0.5) - 0.25;
                particles.push(new Particle(x, y, size, speedX, speedY));
            }
        };
        
        const connect = () => {
            let opacityValue = 1;
            for (let a = 0; a < particles.length; a++) {
                for (let b = a; b < particles.length; b++) {
                    const distance = ((particles[a].x - particles[b].x) * (particles[a].x - particles[b].x))
                                   + ((particles[a].y - particles[b].y) * (particles[a].y - particles[b].y));
                    if (distance < (canvas.width/7) * (canvas.height/7)) {
                        opacityValue = 1 - (distance/20000);
                        if (!ctx) return;
                        ctx.strokeStyle = `rgba(229, 184, 76, ${opacityValue * 0.1})`;
                        ctx.lineWidth = 1;
                        ctx.beginPath();
                        ctx.moveTo(particles[a].x, particles[a].y);
                        ctx.lineTo(particles[b].x, particles[b].y);
                        ctx.stroke();
                    }
                }
            }
        };

        const animate = () => {
            if(!ctx) return;
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            particles.forEach(p => {
                p.update();
                p.draw();
            });
            connect();
            animationFrameId = requestAnimationFrame(animate);
        };

        resizeCanvas();
        init();
        animate();

        window.addEventListener('resize', () => {
          resizeCanvas();
          init();
        });

        return () => {
            cancelAnimationFrame(animationFrameId);
            window.removeEventListener('resize', resizeCanvas);
        };

    }, []);

    return (
        <div className="fixed top-0 left-0 w-full h-full -z-10 overflow-hidden animated-gradient">
            <canvas ref={canvasRef} className="absolute inset-0" />
        </div>
    );
};

export default memo(ParticleBackground);