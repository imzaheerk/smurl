import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { disposeThreeObject } from '../utils/disposeThreeObject';

/** Three pillars (marketers · developers · teams) as lit capsules + subtle orbit. */
export function LandingBuiltForScene() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x020617, 0.058);

    const camera = new THREE.PerspectiveCamera(38, 1, 0.1, 40);
    camera.position.set(0, 0.2, 5.2);

    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance'
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor(0, 0);
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.02;
    renderer.domElement.className =
      'absolute inset-0 h-full w-full block pointer-events-none touch-none';
    container.appendChild(renderer.domElement);

    const root = new THREE.Group();
    scene.add(root);

    const emissive = [0x2dd4bf, 0x38bdf8, 0xc4b5fd];
    const pillars: THREE.Mesh[] = [];
    const xPositions = [-1.15, 0, 1.15];
    for (let i = 0; i < 3; i++) {
      const geo = new THREE.CapsuleGeometry(0.2, 0.95, 5, 12);
      const mat = new THREE.MeshStandardMaterial({
        color: 0x080f1a,
        emissive: new THREE.Color(emissive[i]),
        emissiveIntensity: 0.48,
        metalness: 0.72,
        roughness: 0.2
      });
      const mesh = new THREE.Mesh(geo, mat);
      mesh.position.set(xPositions[i], 0, 0);
      root.add(mesh);
      pillars.push(mesh);
    }

    const base = new THREE.Mesh(
      new THREE.CylinderGeometry(1.85, 2.05, 0.06, 48, 1, true),
      new THREE.MeshStandardMaterial({
        color: 0x020617,
        emissive: new THREE.Color(0x1e293b),
        emissiveIntensity: 0.25,
        metalness: 0.9,
        roughness: 0.35,
        transparent: true,
        opacity: 0.75,
        side: THREE.DoubleSide
      })
    );
    base.rotation.x = Math.PI / 2;
    base.position.y = -0.72;
    root.add(base);

    scene.add(new THREE.AmbientLight(0xffffff, 0.18));
    const key = new THREE.DirectionalLight(0xf1f5f9, 0.55);
    key.position.set(2, 5, 4);
    scene.add(key);
    const fill = new THREE.PointLight(0xa78bfa, 0.75, 18);
    fill.position.set(-4, 0.5, 3);
    scene.add(fill);

    const clock = new THREE.Clock();
    let raf = 0;

    const setSize = () => {
      const w = container.clientWidth;
      const h = container.clientHeight;
      if (w === 0 || h === 0) return;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h, false);
    };
    setSize();
    window.addEventListener('resize', setSize);

    const animate = () => {
      const t = clock.getElapsedTime();
      root.rotation.y = Math.sin(t * 0.15) * 0.12;
      root.rotation.x = Math.sin(t * 0.2) * 0.05;

      pillars.forEach((p, i) => {
        p.position.y = Math.sin(t * 0.55 + i * 0.9) * 0.1;
        p.rotation.z = Math.sin(t * 0.35 + i) * 0.08;
        const s = 1 + Math.sin(t * 0.8 + i * 1.2) * 0.03;
        p.scale.set(s, s, s);
      });

      base.rotation.z = t * 0.04;

      renderer.render(scene, camera);
      raf = requestAnimationFrame(animate);
    };
    raf = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', setSize);
      disposeThreeObject(scene);
      renderer.dispose();
      if (renderer.domElement.parentNode === container) {
        container.removeChild(renderer.domElement);
      }
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="pointer-events-none relative min-h-[200px] w-full md:min-h-[240px]"
      aria-hidden
    />
  );
}
