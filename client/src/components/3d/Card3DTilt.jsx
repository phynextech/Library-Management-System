import React, { useRef, useState } from 'react';

export const Card3DTilt = ({ children, className = '', maxTilt = 12, glare = true }) => {
  const cardRef = useRef(null);
  const [tilt, setTilt] = useState({ x: 0, y: 0, glareX: 50, glareY: 50, opacity: 0 });

  const handleMouseMove = (e) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rotateX = ((y - centerY) / centerY) * -maxTilt;
    const rotateY = ((x - centerX) / centerX) * maxTilt;

    const glareX = (x / rect.width) * 100;
    const glareY = (y / rect.height) * 100;

    setTilt({
      x: rotateX,
      y: rotateY,
      glareX,
      glareY,
      opacity: 0.15,
    });
  };

  const handleMouseLeave = () => {
    setTilt({ x: 0, y: 0, glareX: 50, glareY: 50, opacity: 0 });
  };

  return (
    <div
      style={{ perspective: 1000 }}
      className={`relative inline-block w-full transition-transform duration-200 ease-out`}
    >
      <div
        ref={cardRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        style={{
          transform: `rotateX(${tilt.x}deg) rotateY(${tilt.y}deg) translateZ(10px)`,
          transformStyle: 'preserve-3d',
          transition: 'transform 0.15s ease-out',
        }}
        className={`relative overflow-hidden rounded-2xl ${className}`}
      >
        {children}

        {/* Dynamic Specular Sheen Glare */}
        {glare && (
          <div
            className="pointer-events-none absolute inset-0 transition-opacity duration-300"
            style={{
              opacity: tilt.opacity,
              background: `radial-gradient(circle 280px at ${tilt.glareX}% ${tilt.glareY}%, rgba(255,255,255,0.8), transparent 70%)`,
            }}
          />
        )}
      </div>
    </div>
  );
};

export default Card3DTilt;
