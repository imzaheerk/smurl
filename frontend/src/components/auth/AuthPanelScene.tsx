import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import gsap from 'gsap';
import { disposeThreeObject } from '../../pages/landing/utils/disposeThreeObject';

export type AuthPanelMode = 'login' | 'register';

const COLORS = {
  login: { wire: 0x5eead4, ring: 0x38bdf8, dust: 0x99f6e4, fog: 0x020617 },
  register: { wire: 0xc4b5fd, ring: 0xf0abfc, dust: 0xe9d5ff, fog: 0x020617 }
} as const;

/** 3D panel for auth split — one WebGL context; palette eases when login ↔ register. */
export function AuthPanelScene({ mode }: { mode: AuthPanelMode }) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const matsRef = useRef<{
    crystal: THREE.MeshStandardMaterial;
    wire: THREE.LineBasicMaterial;
    rings: THREE.MeshBasicMaterial[];
    dust: THREE.PointsMaterial;
    fog: THREE.FogExp2;
    light: THREE.PointLight;
  } | null>(null);

  useEffect(() => {
    const container = wrapRef.current;
    if (!container) return;

    const scene = new THREE.Scene();
    const fog = new THREE.FogExp2(COLORS.login.fog, 0.045);
    scene.fog = fog;

    const camera = new THREE.PerspectiveCamera(40, 1, 0.1, 60);
    camera.position.set(0, 0.15, 5.2);

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
      'absolute inset-0 block h-full w-full touch-none pointer-events-none';
    container.appendChild(renderer.domElement);

    const rig = new THREE.Group();
    scene.add(rig);

    const ico = new THREE.IcosahedronGeometry(1.15, 0);
    const crystalMat = new THREE.MeshStandardMaterial({
      color: 0x050a12,
      emissive: new THREE.Color(COLORS.login.wire),
      emissiveIntensity: 0.38,
      metalness: 0.82,
      roughness: 0.2,
      transparent: true,
      opacity: 0.95
    });
    const crystal = new THREE.Mesh(ico, crystalMat);
    rig.add(crystal);

    const wireMat = new THREE.LineBasicMaterial({
      color: COLORS.login.wire,
      transparent: true,
      opacity: 0.28
    });
    const wire = new THREE.LineSegments(new THREE.WireframeGeometry(ico), wireMat);
    wire.scale.setScalar(1.03);
    rig.add(wire);

    const ringGroup = new THREE.Group();
    const ringMats: THREE.MeshBasicMaterial[] = [];
    for (let i = 0; i < 3; i++) {
      const rm = new THREE.MeshBasicMaterial({
        color: COLORS.login.ring,
        transparent: true,
        opacity: 0.1 - i * 0.025
      });
      ringMats.push(rm);
      const ring = new THREE.Mesh(
        new THREE.TorusGeometry(2.4 + i * 0.55, 0.012, 8, 88),
        rm
      );
      ring.rotation.x = Math.PI / 2 + i * 0.1;
      ring.rotation.y = i * 0.22;
      ringGroup.add(ring);
    }
    scene.add(ringGroup);

    const n = 260;
    const pos = new Float32Array(n * 3);
    for (let i = 0; i < n; i++) {
      const r = 2.2 + Math.random() * 4;
      const u = Math.random() * Math.PI * 2;
      const v = Math.acos(2 * Math.random() - 1);
      pos[i * 3] = r * Math.sin(v) * Math.cos(u);
      pos[i * 3 + 1] = r * Math.sin(v) * Math.sin(u) * 0.4;
      pos[i * 3 + 2] = r * Math.cos(v);
    }
    const pGeo = new THREE.BufferGeometry();
    pGeo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
    const dustMat = new THREE.PointsMaterial({
      color: COLORS.login.dust,
      size: 0.026,
      transparent: true,
      opacity: 0.22,
      depthWrite: false,
      blending: THREE.AdditiveBlending
    });
    const dust = new THREE.Points(pGeo, dustMat);
    scene.add(dust);

    scene.add(new THREE.AmbientLight(0xffffff, 0.18));
    const dir = new THREE.DirectionalLight(0xf1f5f9, 0.38);
    dir.position.set(3, 5, 6);
    scene.add(dir);
    const pt = new THREE.PointLight(COLORS.login.ring, 0.85, 16);
    pt.position.set(-3, 0, 4);
    scene.add(pt);

    matsRef.current = {
      crystal: crystalMat,
      wire: wireMat,
      rings: ringMats,
      dust: dustMat,
      fog,
      light: pt
    };

    const pointer = { x: 0, y: 0 };
    const onPointer = (e: PointerEvent) => {
      const rect = container.getBoundingClientRect();
      if (!rect.width || !rect.height) return;
      pointer.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      pointer.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;
    };
    window.addEventListener('pointermove', onPointer, { passive: true });

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
    const ro = new ResizeObserver(setSize);
    ro.observe(container);

    const animate = () => {
      const t = clock.getElapsedTime();
      const tx = pointer.x * 0.28;
      const ty = pointer.y * 0.22;
      rig.rotation.y += (t * 0.1 + tx * 0.2 - rig.rotation.y) * 0.045;
      rig.rotation.x += (Math.sin(t * 0.22) * 0.07 + ty * 0.14 - rig.rotation.x) * 0.045;
      ringGroup.rotation.z = t * 0.05;
      ringGroup.children.forEach((child, i) => {
        child.rotation.z = t * (0.06 + i * 0.02);
      });
      dust.rotation.y = t * 0.018;
      renderer.render(scene, camera);
      raf = requestAnimationFrame(animate);
    };
    raf = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      window.removeEventListener('pointermove', onPointer);
      disposeThreeObject(scene);
      matsRef.current = null;
      renderer.dispose();
      if (renderer.domElement.parentNode === container) {
        container.removeChild(renderer.domElement);
      }
    };
  }, []);

  useEffect(() => {
    const m = matsRef.current;
    if (!m) return;

    const target = COLORS[mode];
    const fromWire = m.crystal.emissive.clone();
    const fromRingColors = m.rings.map((mat) => mat.color.clone());
    const fromDust = m.dust.color.clone();
    const fromLight = m.light.color.clone();

    const proxy = { t: 0 };
    const ctx = gsap.context(() => {
      gsap.fromTo(
        proxy,
        { t: 0 },
        {
          t: 1,
          duration: 0.55,
          ease: 'power2.inOut',
          onUpdate: () => {
            const u = proxy.t;
            m.crystal.emissive.copy(fromWire).lerp(new THREE.Color(target.wire), u);
            m.wire.color.copy(fromWire).lerp(new THREE.Color(target.wire), u);
            m.dust.color.copy(fromDust).lerp(new THREE.Color(target.dust), u);
            m.light.color.copy(fromLight).lerp(new THREE.Color(target.ring), u);
            m.rings.forEach((mat, i) => {
              const to = new THREE.Color(target.ring);
              to.multiplyScalar(1 - i * 0.06);
              mat.color.copy(fromRingColors[i]).lerp(to, u);
            });
          }
        }
      );
    });
    return () => ctx.revert();
  }, [mode]);

  return <div ref={wrapRef} className="absolute inset-0 overflow-hidden rounded-[inherit]" aria-hidden />;
}
