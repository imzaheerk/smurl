import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { disposeThreeObject } from '../utils/disposeThreeObject';

/** Compact “shorten → share → measure” pipeline in WebGL (three nodes + links). */
export function LandingHowItWorksScene() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x020617, 0.055);

    const camera = new THREE.PerspectiveCamera(38, 1, 0.1, 40);
    camera.position.set(0, 0.35, 4.8);

    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance'
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor(0, 0);
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1;
    renderer.domElement.className =
      'absolute inset-0 h-full w-full block pointer-events-none touch-none';
    container.appendChild(renderer.domElement);

    const root = new THREE.Group();
    scene.add(root);

    const nodes: THREE.Mesh[] = [];
    const emissive = [0x2dd4bf, 0x38bdf8, 0xc4b5fd];
    const baseX = [-1.05, 0, 1.05];
    for (let i = 0; i < 3; i++) {
      const g = new THREE.IcosahedronGeometry(0.28, 0);
      const mat = new THREE.MeshStandardMaterial({
        color: 0x0b1220,
        emissive: new THREE.Color(emissive[i]),
        emissiveIntensity: 0.58,
        metalness: 0.62,
        roughness: 0.22
      });
      const mesh = new THREE.Mesh(g, mat);
      mesh.position.set(baseX[i], 0, 0);
      root.add(mesh);
      nodes.push(mesh);
    }

    const lineGeo = new THREE.BufferGeometry();
    const linePos = new Float32Array(12);
    lineGeo.setAttribute('position', new THREE.BufferAttribute(linePos, 3));
    const lines = new THREE.LineSegments(
      lineGeo,
      new THREE.LineBasicMaterial({
        color: 0x67e8f9,
        transparent: true,
        opacity: 0.38
      })
    );
    root.add(lines);

    const hub = new THREE.Mesh(
      new THREE.TorusGeometry(0.42, 0.04, 12, 48),
      new THREE.MeshStandardMaterial({
        color: 0x020617,
        emissive: new THREE.Color(0x14b8a6),
        emissiveIntensity: 0.35,
        metalness: 0.85,
        roughness: 0.2,
        transparent: true,
        opacity: 0.85
      })
    );
    hub.rotation.x = Math.PI / 2.15;
    hub.position.z = -0.38;
    root.add(hub);

    scene.add(new THREE.AmbientLight(0xffffff, 0.22));
    const key = new THREE.DirectionalLight(0xe0f2fe, 0.45);
    key.position.set(3, 4, 5);
    scene.add(key);
    const rim = new THREE.PointLight(0xa78bfa, 0.9, 14);
    rim.position.set(-3, -1, 3);
    scene.add(rim);

    const syncLines = () => {
      let o = 0;
      for (let s = 0; s < 2; s++) {
        const a = nodes[s].position;
        const b = nodes[s + 1].position;
        linePos[o++] = a.x;
        linePos[o++] = a.y;
        linePos[o++] = a.z;
        linePos[o++] = b.x;
        linePos[o++] = b.y;
        linePos[o++] = b.z;
      }
      lineGeo.attributes.position.needsUpdate = true;
    };

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
    const onResize = () => setSize();
    window.addEventListener('resize', onResize);

    const animate = () => {
      const t = clock.getElapsedTime();
      root.rotation.y = t * 0.22;
      root.rotation.x = Math.sin(t * 0.28) * 0.1;

      nodes.forEach((m, i) => {
        m.position.y = Math.sin(t * 0.85 + i * 1.25) * 0.18;
        m.rotation.x = t * 0.55 + i * 0.4;
        m.rotation.z = t * 0.35 + i * 0.2;
      });

      hub.rotation.z = t * 0.12;
      hub.position.y = Math.sin(t * 0.5) * 0.06;

      syncLines();
      renderer.render(scene, camera);
      raf = requestAnimationFrame(animate);
    };
    raf = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', onResize);
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
