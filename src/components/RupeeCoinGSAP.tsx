import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';

interface RupeeCoinGSAPProps {
  theme?: 'dark' | 'light';
  className?: string;
}

export const RupeeCoinGSAP: React.FC<RupeeCoinGSAPProps> = ({
  theme = 'dark',
  className = '',
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const coinRef = useRef<HTMLDivElement>(null);
  const haloRef = useRef<HTMLDivElement>(null);
  const shadowRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    const coin = coinRef.current;
    const halo = haloRef.current;
    const shadow = shadowRef.current;
    if (!container || !coin) return;

    // Check prefers-reduced-motion
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const ctx = gsap.context(() => {
      if (prefersReducedMotion) {
        gsap.set(coin, { opacity: 1, y: 0 });
        return;
      }

      // Initial Entrance Animation
      gsap.fromTo(
        coin,
        {
          opacity: 0,
          scale: 0.85,
          rotationY: -45,
          rotationX: 20,
          y: 40,
        },
        {
          opacity: 1,
          scale: 1,
          rotationY: 0,
          rotationX: 0,
          y: 0,
          duration: 1.2,
          ease: 'power3.out',
        }
      );

      // Continuous Idle Levitation
      gsap.to(coin, {
        y: -16,
        rotationZ: 1.5,
        rotationX: -4,
        duration: 3.2,
        yoyo: true,
        repeat: -1,
        ease: 'sine.inOut',
      });

      // Shadow Breathing Response
      if (shadow) {
        gsap.to(shadow, {
          scale: 0.82,
          opacity: theme === 'dark' ? 0.35 : 0.25,
          duration: 3.2,
          yoyo: true,
          repeat: -1,
          ease: 'sine.inOut',
        });
      }

      // Halo Pulse
      if (halo) {
        gsap.to(halo, {
          scale: 1.08,
          opacity: theme === 'dark' ? 0.8 : 0.45,
          duration: 2.4,
          yoyo: true,
          repeat: -1,
          ease: 'sine.inOut',
        });
      }

      // Interactive Mouse Parallax using GSAP quickTo
      const xTo = gsap.quickTo(coin, 'rotationY', { duration: 0.8, ease: 'power2.out' });
      const yTo = gsap.quickTo(coin, 'rotationX', { duration: 0.8, ease: 'power2.out' });

      const handleMouseMove = (e: MouseEvent) => {
        const rect = container.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width - 0.5;
        const y = (e.clientY - rect.top) / rect.height - 0.5;
        xTo(x * 32); // +/- 16 deg
        yTo(-y * 24); // +/- 12 deg
      };

      const handleMouseLeave = () => {
        xTo(0);
        yTo(0);
      };

      container.addEventListener('mousemove', handleMouseMove);
      container.addEventListener('mouseleave', handleMouseLeave);

      return () => {
        container.removeEventListener('mousemove', handleMouseMove);
        container.removeEventListener('mouseleave', handleMouseLeave);
      };
    }, containerRef);

    return () => ctx.revert();
  }, [theme]);

  // Generate 64 perimeter beaded coin dots
  const numBeads = 64;
  const beads = Array.from({ length: numBeads }, (_, i) => {
    const angle = (i / numBeads) * Math.PI * 2;
    const r = 168;
    const cx = 200 + Math.cos(angle) * r;
    const cy = 200 + Math.sin(angle) * r;
    return { cx, cy, key: i };
  });

  return (
    <div
      ref={containerRef}
      className={`relative w-full max-w-[460px] aspect-square flex items-center justify-center select-none perspective-[1000px] ${className}`}
      role="img"
      aria-label="Sculpted 3D Metallic Rupee Coin animated with GSAP"
    >
      {/* Dynamic Acid Lime Halo Aura */}
      <div
        ref={haloRef}
        className="absolute inset-6 rounded-full bg-radial from-[#ccff00]/25 via-[#ccff00]/5 to-transparent blur-2xl pointer-events-none transition-opacity"
      />

      {/* Floating Floor Shadow */}
      <div
        ref={shadowRef}
        className={`absolute bottom-6 w-[280px] h-10 rounded-full blur-xl pointer-events-none ${
          theme === 'dark' ? 'bg-black/70' : 'bg-[#12141a]/25'
        }`}
      />

      {/* GSAP-Controlled 3D Coin Sculpture Container */}
      <div
        ref={coinRef}
        className="relative w-[340px] h-[340px] sm:w-[380px] sm:h-[380px] cursor-grab active:cursor-grabbing transform-gpu"
        style={{ transformStyle: 'preserve-3d' }}
      >
        <svg
          viewBox="0 0 400 400"
          className="w-full h-full overflow-visible drop-shadow-2xl"
        >
          <defs>
            {/* Outer Coin Edge Metallic Gradient */}
            <linearGradient id="coinEdgeGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#fef3c7" />
              <stop offset="25%" stopColor="#d97706" />
              <stop offset="50%" stopColor="#78350f" />
              <stop offset="75%" stopColor="#b45309" />
              <stop offset="100%" stopColor="#fef3c7" />
            </linearGradient>

            {/* Inner Metallic Coin Radial Sheen */}
            <radialGradient id="coinFaceGrad" cx="35%" cy="30%" r="75%">
              <stop offset="0%" stopColor="#fffbeb" />
              <stop offset="30%" stopColor="#fde68a" />
              <stop offset="65%" stopColor="#d97706" />
              <stop offset="90%" stopColor="#92400e" />
              <stop offset="100%" stopColor="#451a03" />
            </radialGradient>

            {/* Acid Lime Specular Rim Glow */}
            <radialGradient id="limeRimGrad" cx="50%" cy="50%" r="50%">
              <stop offset="85%" stopColor="#ccff00" stopOpacity="0" />
              <stop offset="96%" stopColor="#ccff00" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#ccff00" stopOpacity="0" />
            </radialGradient>

            {/* Embossed Symbol Gradient */}
            <linearGradient id="symbolGrad" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#ffffff" />
              <stop offset="45%" stopColor="#fef08a" />
              <stop offset="85%" stopColor="#b45309" />
              <stop offset="100%" stopColor="#451a03" />
            </linearGradient>

            {/* Subtle Texture Noise Pattern */}
            <filter id="coinBevel">
              <feDropShadow dx="2" dy="4" stdDeviation="3" floodColor="#271305" floodOpacity="0.8" />
            </filter>
            <filter id="symbolShadow">
              <feDropShadow dx="3" dy="5" stdDeviation="4" floodColor="#1a0b02" floodOpacity="0.85" />
            </filter>
          </defs>

          {/* Outer Brand Glow Ring */}
          <circle
            cx="200"
            cy="200"
            r="192"
            fill="none"
            stroke="#ccff00"
            strokeWidth="2.5"
            strokeOpacity={theme === 'dark' ? '0.75' : '0.45'}
            strokeDasharray="4 8"
          />

          {/* Coin Outer Reeded Bevel Border */}
          <circle
            cx="200"
            cy="200"
            r="184"
            fill="url(#coinEdgeGrad)"
            stroke="#451a03"
            strokeWidth="4"
            filter="url(#coinBevel)"
          />

          {/* Stepped Inner Border */}
          <circle
            cx="200"
            cy="200"
            r="176"
            fill="none"
            stroke="#fef3c7"
            strokeWidth="2.5"
            strokeOpacity="0.9"
          />

          {/* Beaded Edge Ring (Authentic Indian Coin Detail) */}
          <g>
            {beads.map((b) => (
              <circle
                key={b.key}
                cx={b.cx}
                cy={b.cy}
                r="3"
                fill="#fffbeb"
                stroke="#78350f"
                strokeWidth="0.8"
              />
            ))}
          </g>

          {/* Inner Groove Ring */}
          <circle
            cx="200"
            cy="200"
            r="156"
            fill="none"
            stroke="#78350f"
            strokeWidth="3"
            strokeOpacity="0.75"
          />
          <circle
            cx="200"
            cy="200"
            r="152"
            fill="none"
            stroke="#fef08a"
            strokeWidth="1.5"
            strokeOpacity="0.8"
          />

          {/* Main Metallic Coin Basin */}
          <circle
            cx="200"
            cy="200"
            r="148"
            fill="url(#coinFaceGrad)"
          />

          {/* Micro Concentric Turning Grooves */}
          <circle cx="200" cy="200" r="136" fill="none" stroke="rgba(255,255,255,0.18)" strokeWidth="1" />
          <circle cx="200" cy="200" r="124" fill="none" stroke="rgba(69,26,3,0.2)" strokeWidth="1" />
          <circle cx="200" cy="200" r="112" fill="none" stroke="rgba(255,255,255,0.15)" strokeWidth="1" />
          <circle cx="200" cy="200" r="100" fill="none" stroke="rgba(69,26,3,0.15)" strokeWidth="1" />

          {/* Top Arc Inscription */}
          <path
            id="topCoinArc"
            d="M 90 200 A 110 110 0 0 1 310 200"
            fill="none"
          />
          <text
            fontSize="11"
            fontFamily="'Space Grotesk', system-ui, sans-serif"
            fontWeight="bold"
            letterSpacing="3"
            fill="#fffbeb"
            stroke="#451a03"
            strokeWidth="0.5"
            textAnchor="middle"
          >
            <textPath href="#topCoinArc" startOffset="50%">
              SURVIVAL CAPITAL • 30 DAYS
            </textPath>
          </text>

          {/* Bottom Arc Inscription */}
          <path
            id="botCoinArc"
            d="M 310 200 A 110 110 0 0 1 90 200"
            fill="none"
          />
          <text
            fontSize="10"
            fontFamily="'JetBrains Mono', monospace"
            fontWeight="bold"
            letterSpacing="2.5"
            fill="#fef08a"
            stroke="#451a03"
            strokeWidth="0.5"
            textAnchor="middle"
          >
            <textPath href="#botCoinArc" startOffset="50%">
              ★ THE LAST ₹10,000 ★
            </textPath>
          </text>

          {/* Center Embossed Indian Rupee Symbol ₹ */}
          <g filter="url(#symbolShadow)">
            {/* Bevel highlight offset */}
            <text
              x="199"
              y="228"
              textAnchor="middle"
              fontSize="120"
              fontFamily="'Space Grotesk', 'Plus Jakarta Sans', sans-serif"
              fontWeight="900"
              fill="#ffffff"
              fillOpacity="0.75"
            >
              ₹
            </text>
            {/* Stamped depth shadow offset */}
            <text
              x="203"
              y="233"
              textAnchor="middle"
              fontSize="120"
              fontFamily="'Space Grotesk', 'Plus Jakarta Sans', sans-serif"
              fontWeight="900"
              fill="#271305"
            >
              ₹
            </text>
            {/* Primary embossed face */}
            <text
              x="200"
              y="230"
              textAnchor="middle"
              fontSize="120"
              fontFamily="'Space Grotesk', 'Plus Jakarta Sans', sans-serif"
              fontWeight="900"
              fill="url(#symbolGrad)"
              stroke="#582404"
              strokeWidth="2.5"
            >
              ₹
            </text>
          </g>

          {/* Brand Acid Lime Edge Specular Highlight Ring */}
          <circle
            cx="200"
            cy="200"
            r="184"
            fill="url(#limeRimGrad)"
            pointerEvents="none"
          />
        </svg>

        {/* Live Denomination Pill Below Coin */}
        <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 px-4 py-1.5 rounded-full bg-[#12141a]/90 dark:bg-black/90 border border-[#ccff00]/40 text-[#ccff00] text-xs font-mono font-bold shadow-xl flex items-center gap-1.5 whitespace-nowrap">
          <span className="w-1.5 h-1.5 rounded-full bg-[#ccff00] animate-ping" />
          <span>FINITE RESOURCE DISK</span>
        </div>
      </div>
    </div>
  );
};
