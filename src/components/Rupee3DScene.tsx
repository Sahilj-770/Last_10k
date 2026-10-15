import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

interface Rupee3DSceneProps {
  scrollProgress?: number;
  className?: string;
  theme?: 'dark' | 'light';
  interactive?: boolean;
}

export const Rupee3DScene: React.FC<Rupee3DSceneProps> = ({
  scrollProgress = 0,
  className = '',
  theme = 'dark',
  interactive = true,
}) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const coinGroupRef = useRef<THREE.Group | null>(null);
  const particlesRef = useRef<THREE.Points | null>(null);
  const targetRotationRef = useRef({ x: 0.2, y: 0.4 });
  const mouseRef = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const width = container.clientWidth || 400;
    const height = container.clientHeight || 400;

    // Check prefers-reduced-motion
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // Scene
    const scene = new THREE.Scene();

    // Camera
    const camera = new THREE.PerspectiveCamera(40, width / height, 0.1, 100);
    camera.position.set(0, 0, 7.8);

    // Renderer
    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true,
      powerPreference: 'high-performance',
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = theme === 'dark' ? 1.25 : 1.1;
    container.appendChild(renderer.domElement);

    // Coin Group
    const coinGroup = new THREE.Group();
    scene.add(coinGroup);
    coinGroupRef.current = coinGroup;

    // Canvas Texture Generator for Coin Faces
    const createCoinFaceTexture = (isFront: boolean) => {
      const canvas = document.createElement('canvas');
      canvas.width = 1024;
      canvas.height = 1024;
      const ctx = canvas.getContext('2d')!;

      // Background metallic radial sheen
      const radGrad = ctx.createRadialGradient(512, 512, 50, 512, 512, 512);
      radGrad.addColorStop(0, '#f9edd2');
      radGrad.addColorStop(0.5, '#e0c58a');
      radGrad.addColorStop(0.85, '#bf9b50');
      radGrad.addColorStop(1, '#785b20');
      ctx.fillStyle = radGrad;
      ctx.fillRect(0, 0, 1024, 1024);

      // Outer reeded rim pattern
      ctx.strokeStyle = '#684d19';
      ctx.lineWidth = 14;
      ctx.beginPath();
      ctx.arc(512, 512, 490, 0, Math.PI * 2);
      ctx.stroke();

      ctx.strokeStyle = '#fff2cf';
      ctx.lineWidth = 6;
      ctx.beginPath();
      ctx.arc(512, 512, 475, 0, Math.PI * 2);
      ctx.stroke();

      // Outer bead dots (authentic coin edge)
      const numBeads = 72;
      for (let i = 0; i < numBeads; i++) {
        const angle = (i / numBeads) * Math.PI * 2;
        const bx = 512 + Math.cos(angle) * 455;
        const by = 512 + Math.sin(angle) * 455;
        ctx.fillStyle = '#fff9e6';
        ctx.beginPath();
        ctx.arc(bx, by, 5, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = '#654b17';
        ctx.beginPath();
        ctx.arc(bx + 1, by + 1, 3.5, 0, Math.PI * 2);
        ctx.fill();
      }

      // Inner concentric rings
      ctx.strokeStyle = 'rgba(255, 240, 200, 0.45)';
      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.arc(512, 512, 410, 0, Math.PI * 2);
      ctx.stroke();

      ctx.strokeStyle = 'rgba(90, 65, 20, 0.5)';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.arc(512, 512, 400, 0, Math.PI * 2);
      ctx.stroke();

      if (isFront) {
        // Front Face: Bold Indian Rupee Symbol ₹ with embossed relief
        ctx.font = 'bold 360px "Space Grotesk", "Plus Jakarta Sans", system-ui, sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';

        // Deep drop shadow for stamped relief
        ctx.fillStyle = 'rgba(60, 42, 10, 0.85)';
        ctx.fillText('₹', 516, 518);

        // Highlight bevel
        ctx.fillStyle = 'rgba(255, 255, 240, 0.9)';
        ctx.fillText('₹', 508, 506);

        // Primary brass fill
        ctx.fillStyle = '#d4ae58';
        ctx.fillText('₹', 512, 512);

        // Subtext on coin face: "LAST ₹10,000"
        ctx.font = 'bold 42px "Space Grotesk", monospace';
        ctx.fillStyle = 'rgba(55, 38, 8, 0.9)';
        ctx.fillText('• 30 DAYS • 10,000 CAPITAL •', 514, 762);
        ctx.fillStyle = '#fef4dc';
        ctx.fillText('• 30 DAYS • 10,000 CAPITAL •', 512, 760);

        ctx.font = 'bold 34px "JetBrains Mono", monospace';
        ctx.fillStyle = '#593e0e';
        ctx.fillText('SURVIVAL COIN', 513, 261);
        ctx.fillStyle = '#fff4d8';
        ctx.fillText('SURVIVAL COIN', 512, 260);
      } else {
        // Back Face: "10000" denomination & circular telemetry
        ctx.font = 'bold 240px "Space Grotesk", sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';

        ctx.fillStyle = 'rgba(60, 42, 10, 0.85)';
        ctx.fillText('10K', 516, 495);
        ctx.fillStyle = '#d4ae58';
        ctx.fillText('10K', 512, 490);

        ctx.font = 'bold 44px "Space Grotesk", monospace';
        ctx.fillStyle = '#fff4d8';
        ctx.fillText('RUPEES • 2026', 512, 670);

        ctx.font = 'bold 36px "JetBrains Mono", monospace';
        ctx.fillStyle = '#5a400e';
        ctx.fillText('DAY 12 TO 30 RUNWAY', 512, 310);
      }

      const texture = new THREE.CanvasTexture(canvas);
      texture.anisotropy = renderer.capabilities.getMaxAnisotropy();
      texture.needsUpdate = true;
      return texture;
    };

    const frontTexture = createCoinFaceTexture(true);
    const backTexture = createCoinFaceTexture(false);

    // Bump Map for coin faces to create 3D tactile relief
    const createBumpTexture = () => {
      const canvas = document.createElement('canvas');
      canvas.width = 512;
      canvas.height = 512;
      const ctx = canvas.getContext('2d')!;
      ctx.fillStyle = '#808080';
      ctx.fillRect(0, 0, 512, 512);

      // Symbol bump
      ctx.font = 'bold 180px sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillStyle = '#ffffff';
      ctx.fillText('₹', 256, 256);

      // Rim bump
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 10;
      ctx.beginPath();
      ctx.arc(256, 256, 240, 0, Math.PI * 2);
      ctx.stroke();

      const bumpTex = new THREE.CanvasTexture(canvas);
      bumpTex.needsUpdate = true;
      return bumpTex;
    };
    const bumpTexture = createBumpTexture();

    // Create Coin Geometry: Cylinder with beveled rim rings
    const coinRadius = 2.15;
    const coinThickness = 0.28;
    const cylinderGeo = new THREE.CylinderGeometry(
      coinRadius,
      coinRadius,
      coinThickness,
      80,
      1,
      false
    );

    // Coin Materials (Multi-material: edge, top, bottom)
    const edgeMaterial = new THREE.MeshStandardMaterial({
      color: 0xcaa356,
      metalness: 0.92,
      roughness: 0.28,
      bumpScale: 0.04,
    });

    const frontFaceMaterial = new THREE.MeshStandardMaterial({
      map: frontTexture,
      bumpMap: bumpTexture,
      bumpScale: 0.08,
      color: 0xffffff,
      metalness: 0.88,
      roughness: 0.22,
    });

    const backFaceMaterial = new THREE.MeshStandardMaterial({
      map: backTexture,
      bumpMap: bumpTexture,
      bumpScale: 0.08,
      color: 0xffffff,
      metalness: 0.88,
      roughness: 0.22,
    });

    const coinMesh = new THREE.Mesh(cylinderGeo, [
      edgeMaterial, // 0: side
      frontFaceMaterial, // 1: top (front face when tilted)
      backFaceMaterial, // 2: bottom (reverse face)
    ]);
    // Tilt coin initially so top face looks forward
    coinMesh.rotation.x = Math.PI / 2;
    coinGroup.add(coinMesh);

    // Outer subtle metallic glow ring (Acid Lime brand resonance)
    const ringGeo = new THREE.TorusGeometry(coinRadius + 0.18, 0.018, 16, 100);
    const ringMat = new THREE.MeshBasicMaterial({
      color: 0xccff00,
      transparent: true,
      opacity: theme === 'dark' ? 0.65 : 0.45,
    });
    const haloRing = new THREE.Mesh(ringGeo, ringMat);
    haloRing.rotation.x = Math.PI / 2;
    coinGroup.add(haloRing);

    // Luminous Atmospheric Particles
    const particleCount = 140;
    const particleGeometry = new THREE.BufferGeometry();
    const particlePositions = new Float32Array(particleCount * 3);
    const particleScales = new Float32Array(particleCount);

    for (let i = 0; i < particleCount; i++) {
      const radius = 2.4 + Math.random() * 3.8;
      const theta = Math.random() * Math.PI * 2;
      const phi = (Math.random() - 0.5) * Math.PI;

      particlePositions[i * 3] = radius * Math.cos(phi) * Math.cos(theta);
      particlePositions[i * 3 + 1] = radius * Math.sin(phi);
      particlePositions[i * 3 + 2] = radius * Math.cos(phi) * Math.sin(theta);
      particleScales[i] = Math.random() * 0.08 + 0.02;
    }

    particleGeometry.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3));
    particleGeometry.setAttribute('scale', new THREE.BufferAttribute(particleScales, 1));

    const particleMaterial = new THREE.PointsMaterial({
      color: theme === 'dark' ? 0xccff00 : 0xb8860b,
      size: 0.065,
      transparent: true,
      opacity: theme === 'dark' ? 0.6 : 0.4,
      blending: THREE.AdditiveBlending,
    });

    const particles = new THREE.Points(particleGeometry, particleMaterial);
    scene.add(particles);
    particlesRef.current = particles;

    // Lights
    // 1. Ambient
    const ambientLight = new THREE.AmbientLight(
      0xffffff,
      theme === 'dark' ? 0.75 : 1.1
    );
    scene.add(ambientLight);

    // 2. Main Key Directional Light (Warm White)
    const keyLight = new THREE.DirectionalLight(0xfffaed, 2.8);
    keyLight.position.set(4, 5, 6);
    scene.add(keyLight);

    // 3. Acid Lime Dramatic Rim Light (Signature Brand Glow)
    const limeRimLight = new THREE.DirectionalLight(0xccff00, 3.2);
    limeRimLight.position.set(-5, -4, 3);
    scene.add(limeRimLight);

    // 4. Cool Fill Light (Soft Cyan depth)
    const fillLight = new THREE.DirectionalLight(0x70b8ff, 1.4);
    fillLight.position.set(2, -4, -4);
    scene.add(fillLight);

    // Mouse Parallax Interaction
    const handleMouseMove = (e: MouseEvent) => {
      if (!interactive || prefersReducedMotion) return;
      const rect = container.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      const y = -(((e.clientY - rect.top) / rect.height) * 2 - 1);
      mouseRef.current = { x: Math.max(-1, Math.min(1, x)), y: Math.max(-1, Math.min(1, y)) };
    };

    window.addEventListener('mousemove', handleMouseMove);

    // Resize Handler
    const handleResize = () => {
      if (!container) return;
      const w = container.clientWidth || 400;
      const h = container.clientHeight || 400;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };

    const resizeObserver = new ResizeObserver(handleResize);
    resizeObserver.observe(container);

    // Animation Loop
    let animationFrameId: number;
    let clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const delta = clock.getDelta();
      const time = clock.getElapsedTime();

      if (coinGroupRef.current) {
        // Base continuous gentle spin unless prefersReducedMotion
        if (!prefersReducedMotion) {
          targetRotationRef.current.y += delta * 0.45;
        }

        // Mouse Parallax interpolation
        const mouseX = mouseRef.current.x * 0.35;
        const mouseY = mouseRef.current.y * 0.25;

        // Smooth rotation damping
        coinGroupRef.current.rotation.y = THREE.MathUtils.lerp(
          coinGroupRef.current.rotation.y,
          targetRotationRef.current.y + mouseX,
          0.08
        );
        coinGroupRef.current.rotation.x = THREE.MathUtils.lerp(
          coinGroupRef.current.rotation.x,
          targetRotationRef.current.x - mouseY,
          0.08
        );

        // Subtle levitation bob
        coinGroupRef.current.position.y = Math.sin(time * 1.5) * 0.12;

        // Halo ring breathing pulse
        haloRing.scale.setScalar(1 + Math.sin(time * 2.2) * 0.025);
      }

      // Rotate background particles
      if (particlesRef.current) {
        particlesRef.current.rotation.y += delta * 0.06;
        particlesRef.current.rotation.x = Math.sin(time * 0.4) * 0.08;
      }

      renderer.render(scene, camera);
    };

    animate();

    // Cleanup
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      resizeObserver.disconnect();
      cancelAnimationFrame(animationFrameId);

      // Disposals
      cylinderGeo.dispose();
      ringGeo.dispose();
      particleGeometry.dispose();
      frontTexture.dispose();
      backTexture.dispose();
      bumpTexture.dispose();
      edgeMaterial.dispose();
      frontFaceMaterial.dispose();
      backFaceMaterial.dispose();
      ringMat.dispose();
      particleMaterial.dispose();
      renderer.dispose();

      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, [theme, interactive]);

  // Handle Scroll Progress Updates
  useEffect(() => {
    if (!coinGroupRef.current) return;
    // Morph rotation and tilt based on scrollProgress
    const targetY = scrollProgress * Math.PI * 3.5;
    const targetX = 0.25 + Math.sin(scrollProgress * Math.PI) * 0.45;
    const targetZ = Math.sin(scrollProgress * Math.PI * 2) * 0.2;

    targetRotationRef.current.x = targetX;
    targetRotationRef.current.y = targetY;

    if (coinGroupRef.current) {
      coinGroupRef.current.rotation.z = targetZ;
      // As user scrolls past hero, scale down or position shift
      const scale = Math.max(0.72, 1 - scrollProgress * 0.35);
      coinGroupRef.current.scale.set(scale, scale, scale);
    }
  }, [scrollProgress]);

  return (
    <div
      ref={mountRef}
      className={`relative w-full h-full min-h-[340px] pointer-events-none select-none ${className}`}
      aria-label="Interactive 3D Metallic Rupee Coin"
      role="img"
    />
  );
};
