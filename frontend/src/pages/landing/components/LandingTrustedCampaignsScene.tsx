import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { disposeThreeObject } from '../utils/disposeThreeObject';

const PARTNER_COLORS = [0x5eead4, 0x7dd3fc, 0xc4b5fd, 0xf9a8d4];

/** “Trusted campaigns” motif: hub + four orbiting nodes + radial links. */
export function LandingTrustedCampaignsScene() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x020617, 0.06);

    const camera = new THREE.PerspectiveCamera(40, 1, 0.1, 50);
    camera.position.set(0, 0.55, 4.2);

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

    const ring = new THREE.Mesh(
      new THREE.TorusGeometry(1.25, 0.018, 10, 96),
      new THREE.MeshStandardMaterial({
        color: 0x020617,
        emissive: new THREE.Color(0x134e4a),
        emissiveIntensity: 0.35,
        metalness: 0.82,
        roughness: 0.22,
        transparent: true,
        opacity: 0.9
      })
    );
    ring.rotation.x = Math.PI / 2.05;
    root.add(ring);

    const hub = new THREE.Mesh(
      new THREE.SphereGeometry(0.12, 24, 24),
      new THREE.MeshStandardMaterial({
        color: 0x020617,
        emissive: new THREE.Color(0x2dd4bf),
        emissiveIntensity: 0.9,
        metalness: 0.55,
        roughness: 0.2
      })
    );
    root.add(hub);

    const partnerMeshes: THREE.Mesh[] = [];
    const baseAngles = [0, Math.PI / 2, Math.PI, (3 * Math.PI) / 2];
    const radius = 1.38;
    for (let i = 0; i < 4; i++) {
      const geo = new THREE.OctahedronGeometry(0.16, 0);
      const mat = new THREE.MeshStandardMaterial({
        color: 0x0b1220,
        emissive: new THREE.Color(PARTNER_COLORS[i]),
        emissiveIntensity: 0.62,
        metalness: 0.58,
        roughness: 0.24
      });
      const m = new THREE.Mesh(geo, mat);
      partnerMeshes.push(m);
      root.add(m);
    }

    const lineGeo = new THREE.BufferGeometry();
    const linePos = new Float32Array(4 * 3 * 2);
    lineGeo.setAttribute('position', new THREE.BufferAttribute(linePos, 3));
    const spokes = new THREE.LineSegments(
      lineGeo,
      new THREE.LineBasicMaterial({
        color: 0x94a3b8,
        transparent: true,
        opacity: 0.28
      })
    );
    root.add(spokes);

    scene.add(new THREE.AmbientLight(0xffffff, 0.2));
    const dir = new THREE.DirectionalLight(0xe2e8f0, 0.5);
    dir.position.set(4, 6, 5);
    scene.add(dir);
    const pt = new THREE.PointLight(0x38bdf8, 0.85, 16);
    pt.position.set(-3, 1, 4);
    scene.add(pt);

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

    const syncSpokes = () => {
      let o = 0;
      for (const m of partnerMeshes) {
        linePos[o++] = hub.position.x;
        linePos[o++] = hub.position.y;
        linePos[o++] = hub.position.z;
        linePos[o++] = m.position.x;
        linePos[o++] = m.position.y;
        linePos[o++] = m.position.z;
      }
      lineGeo.attributes.position.needsUpdate = true;
    };

    const animate = () => {
      const t = clock.getElapsedTime();
      root.rotation.y = t * 0.18;
      root.rotation.x = Math.sin(t * 0.22) * 0.06;

      ring.rotation.z = t * 0.08;

      partnerMeshes.forEach((m, i) => {
        const ang = baseAngles[i] + t * 0.35;
        m.position.x = Math.cos(ang) * radius;
        m.position.z = Math.sin(ang) * radius;
        m.position.y = Math.sin(t * 0.7 + i * 1.1) * 0.14;
        m.rotation.x = t * 0.6 + i;
        m.rotation.y = t * 0.45;
      });

      hub.position.y = Math.sin(t * 0.9) * 0.05;

      syncSpokes();
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
      className="pointer-events-none relative min-h-[180px] w-full md:min-h-[220px]"
      aria-hidden
    />
  );
}
