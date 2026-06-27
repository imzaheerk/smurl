import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import gsap from 'gsap';
import { disposeThreeObject } from '../pages/landing/utils/disposeThreeObject';

/** Splash background: glowing link ring + fuchsia/amber orbit bands. */
export function SplashScene() {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    const isMobile = window.matchMedia('(max-width: 640px)').matches;
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x0a0514, isMobile ? 0.065 : 0.048);

    const camera = new THREE.PerspectiveCamera(isMobile ? 42 : 46, 1, 0.1, 80);
    camera.position.set(0, 0, isMobile ? 7.8 : 6.6);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, isMobile ? 1.5 : 2));
    renderer.setClearColor(0, 0);
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.08;
    renderer.domElement.className = 'absolute inset-0 h-full w-full';
    mount.appendChild(renderer.domElement);

    const rig = new THREE.Group();
    scene.add(rig);

    const linkMat = new THREE.MeshStandardMaterial({
      color: 0x0c0818,
      emissive: new THREE.Color(0xe879f9),
      emissiveIntensity: 0.62,
      metalness: 0.85,
      roughness: 0.12
    });
    const link = new THREE.Mesh(
      new THREE.TorusGeometry(isMobile ? 0.85 : 1.15, isMobile ? 0.26 : 0.34, 28, 96),
      linkMat
    );
    link.rotation.x = Math.PI / 2.4;
    link.rotation.y = 0.45;
    rig.add(link);

    const linkGlow = new THREE.Mesh(
      new THREE.TorusGeometry(isMobile ? 0.85 : 1.15, isMobile ? 0.38 : 0.48, 16, 64),
      new THREE.MeshBasicMaterial({
        color: 0xf472b6,
        transparent: true,
        opacity: 0.06,
        blending: THREE.AdditiveBlending,
        depthWrite: false
      })
    );
    linkGlow.rotation.copy(link.rotation);
    rig.add(linkGlow);

    const core = new THREE.Mesh(
      new THREE.OctahedronGeometry(isMobile ? 0.18 : 0.24, 0),
      new THREE.MeshStandardMaterial({
        color: 0x0a0514,
        emissive: new THREE.Color(0xfbbf24),
        emissiveIntensity: 0.78,
        metalness: 0.6,
        roughness: 0.18
      })
    );
    rig.add(core);

    const rings: THREE.Mesh[] = [];
    const ringColors = [0xe879f9, 0xfbbf24];
    for (let i = 0; i < 2; i++) {
      const ring = new THREE.Mesh(
        new THREE.TorusGeometry((isMobile ? 1.55 : 2.05) + i * (isMobile ? 0.45 : 0.55), 0.012, 8, 128),
        new THREE.MeshBasicMaterial({
          color: ringColors[i],
          transparent: true,
          opacity: isMobile ? 0.22 : 0.28
        })
      );
      ring.rotation.x = Math.PI / 2 + i * 0.35;
      ring.rotation.y = i * 0.5;
      rings.push(ring);
      rig.add(ring);
    }

    const particleCount = isMobile ? 100 : 180;
    const positions = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount; i++) {
      const r = 2.5 + Math.random() * 4;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      positions[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      positions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta) * 0.45;
      positions[i * 3 + 2] = r * Math.cos(phi);
    }
    const pointsGeo = new THREE.BufferGeometry();
    pointsGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    const points = new THREE.Points(
      pointsGeo,
      new THREE.PointsMaterial({
        color: 0xc084fc,
        size: isMobile ? 0.02 : 0.026,
        transparent: true,
        opacity: isMobile ? 0.3 : 0.38,
        depthWrite: false,
        blending: THREE.AdditiveBlending
      })
    );
    scene.add(points);

    scene.add(new THREE.HemisphereLight(0xfae8ff, 0x0a0514, 0.35));
    scene.add(new THREE.AmbientLight(0xffffff, 0.1));
    const key = new THREE.PointLight(0xf0abfc, isMobile ? 1 : 1.25, 24);
    key.position.set(3.5, 2.5, 5);
    scene.add(key);
    const rim = new THREE.PointLight(0xfbbf24, isMobile ? 0.85 : 1.05, 20);
    rim.position.set(-3, -0.5, 4);
    scene.add(rim);

    const resize = () => {
      const width = mount.clientWidth;
      const height = mount.clientHeight;
      if (!width || !height) return;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height, false);
    };
    const ro = new ResizeObserver(resize);
    ro.observe(mount);
    resize();

    const motion = prefersReducedMotion ? 0.35 : 1;
    const rotTween = prefersReducedMotion
      ? null
      : gsap.to(rig.rotation, {
          y: `+=${Math.PI * 2}`,
          duration: isMobile ? 28 : 22,
          ease: 'none',
          repeat: -1
        });

    let raf = 0;
    const clock = new THREE.Clock();
    const animate = () => {
      const t = clock.getElapsedTime();
      link.rotation.z = t * 0.12 * motion;
      linkGlow.rotation.z = link.rotation.z;
      core.rotation.x = t * 0.2 * motion;
      core.rotation.y = t * 0.28 * motion;
      rings.forEach((ring, i) => {
        ring.rotation.z = t * (0.06 + i * 0.02) * motion;
      });
      points.rotation.y = t * 0.015 * motion;
      rig.position.y = Math.sin(t * 0.4) * (isMobile ? 0.04 : 0.07) * motion;
      renderer.render(scene, camera);
      raf = requestAnimationFrame(animate);
    };
    animate();

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      rotTween?.kill();
      disposeThreeObject(scene);
      renderer.dispose();
      if (renderer.domElement.parentNode === mount) {
        mount.removeChild(renderer.domElement);
      }
    };
  }, []);

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden opacity-80 sm:opacity-90" aria-hidden>
      <div ref={mountRef} className="relative h-full w-full" />
      <div className="absolute inset-0 bg-gradient-to-b from-[#0a0514]/10 via-[#0a0514]/55 to-[#0a0514]/95" />
    </div>
  );
}
