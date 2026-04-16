import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import gsap from 'gsap';

function disposeObject(object: THREE.Object3D) {
  object.traverse((child) => {
    const mesh = child as THREE.Mesh;
    if (!mesh.isMesh) return;
    mesh.geometry?.dispose();
    const mat = mesh.material;
    if (Array.isArray(mat)) {
      mat.forEach((m) => m.dispose());
    } else {
      mat?.dispose();
    }
  });
}

export function SplashScene() {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;
    const isMobile = window.matchMedia('(max-width: 640px)').matches;

    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x020617, isMobile ? 0.07 : 0.05);

    const camera = new THREE.PerspectiveCamera(isMobile ? 40 : 44, 1, 0.1, 100);
    camera.position.set(0, isMobile ? 0.04 : 0.12, isMobile ? 8.6 : 6.9);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, isMobile ? 1.4 : 2));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    mount.appendChild(renderer.domElement);

    const rig = new THREE.Group();
    scene.add(rig);

    const orb = new THREE.Mesh(
      new THREE.IcosahedronGeometry(isMobile ? 0.92 : 1.35, 0),
      new THREE.MeshStandardMaterial({
        color: 0x0f172a,
        emissive: 0x14b8a6,
        emissiveIntensity: isMobile ? 0.42 : 0.5,
        metalness: 0.5,
        roughness: 0.22,
        wireframe: true
      })
    );
    rig.add(orb);

    const ring = new THREE.Mesh(
      new THREE.TorusGeometry(isMobile ? 1.62 : 2.15, 0.04, 16, 220),
      new THREE.MeshBasicMaterial({ color: 0xa78bfa, transparent: true, opacity: isMobile ? 0.4 : 0.5 })
    );
    ring.rotation.set(Math.PI * 0.58, 0.2, 0.18);
    rig.add(ring);

    const ring2 = new THREE.Mesh(
      new THREE.TorusGeometry(isMobile ? 1.92 : 2.55, 0.02, 12, 220),
      new THREE.MeshBasicMaterial({ color: 0x22d3ee, transparent: true, opacity: isMobile ? 0.26 : 0.35 })
    );
    ring2.rotation.set(Math.PI * 0.22, -0.26, 0);
    rig.add(ring2);

    const particlesCount = isMobile ? 96 : 220;
    const positions = new Float32Array(particlesCount * 3);
    for (let i = 0; i < particlesCount; i++) {
      const i3 = i * 3;
      const spreadX = isMobile ? 7 : 10;
      const spreadY = isMobile ? 4.4 : 6;
      const spreadZ = isMobile ? 4 : 5;
      positions[i3] = (Math.random() - 0.5) * spreadX;
      positions[i3 + 1] = (Math.random() - 0.5) * spreadY;
      positions[i3 + 2] = (Math.random() - 0.5) * spreadZ;
    }
    const pointsGeo = new THREE.BufferGeometry();
    pointsGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    const points = new THREE.Points(
      pointsGeo,
      new THREE.PointsMaterial({
        color: 0x67e8f9,
        size: isMobile ? 0.022 : 0.03,
        transparent: true,
        opacity: isMobile ? 0.42 : 0.58,
        depthWrite: false
      })
    );
    scene.add(points);

    scene.add(new THREE.AmbientLight(0xffffff, isMobile ? 0.58 : 0.66));
    const key = new THREE.PointLight(0xffffff, isMobile ? 1 : 1.2, 22);
    key.position.set(4, 3.5, 5);
    scene.add(key);
    const rim = new THREE.PointLight(0x22d3ee, isMobile ? 0.9 : 1.1, 18);
    rim.position.set(-3.2, -1.1, 3.4);
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

    const rotTween = gsap.to(rig.rotation, {
      x: `+=${Math.PI * 2}`,
      y: `+=${Math.PI * 2}`,
      duration: isMobile ? 30 : 25,
      ease: 'none',
      repeat: -1
    });
    const ringTween = gsap.to([ring.rotation, ring2.rotation], {
      z: `+=${Math.PI * 2}`,
      duration: isMobile ? 24 : 18,
      ease: 'none',
      repeat: -1,
      stagger: 2
    });
    const pulseTween = gsap.to(orb.scale, {
      x: 1.08,
      y: 1.08,
      z: 1.08,
      duration: 2.2,
      yoyo: true,
      repeat: -1,
      ease: 'sine.inOut'
    });

    let raf = 0;
    const clock = new THREE.Clock();
    const animate = () => {
      const t = clock.getElapsedTime();
      points.rotation.y = t * 0.018;
      points.rotation.x = t * 0.01;
      rig.position.y = Math.sin(t * 0.45) * (isMobile ? 0.05 : 0.08);
      renderer.render(scene, camera);
      raf = requestAnimationFrame(animate);
    };
    animate();

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      rotTween.kill();
      ringTween.kill();
      pulseTween.kill();
      pointsGeo.dispose();
      disposeObject(scene);
      renderer.dispose();
      if (renderer.domElement.parentNode === mount) {
        mount.removeChild(renderer.domElement);
      }
    };
  }, []);

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden opacity-75 sm:opacity-90" aria-hidden>
      <div ref={mountRef} className="h-full w-full" />
      <div className="absolute inset-0 bg-gradient-to-b from-slate-950/20 via-slate-950/60 to-slate-950/90" />
    </div>
  );
}
