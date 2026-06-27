import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import gsap from 'gsap';
import { disposeThreeObject } from '../../pages/landing/utils/disposeThreeObject';

export type AuthPanelMode = 'login' | 'register';

const PALETTE = {
  login: {
    fog: 0x0a0514,
    linkA: 0xe879f9,
    linkB: 0xc084fc,
    wire: 0xf472b6,
    ring: 0xe879f9,
    particle: 0xd8b4fe,
    light: 0xf0abfc
  },
  register: {
    fog: 0x0a0514,
    linkA: 0xfbbf24,
    linkB: 0xf472b6,
    wire: 0xfcd34d,
    ring: 0xfbbf24,
    particle: 0xfde68a,
    light: 0xfbbf24
  }
} as const;

function createChainLink(emissive: number, intensity = 0.58) {
  const geo = new THREE.TorusGeometry(0.78, 0.24, 28, 80);
  const mat = new THREE.MeshStandardMaterial({
    color: 0x0c0818,
    emissive: new THREE.Color(emissive),
    emissiveIntensity: intensity,
    metalness: 0.84,
    roughness: 0.12
  });
  return new THREE.Mesh(geo, mat);
}

/** Auth 3D: interlocking chain links — palette shifts between login and register. */
export function AuthPanelScene({ mode }: { mode: AuthPanelMode }) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const matsRef = useRef<{
    links: THREE.MeshStandardMaterial[];
    wire: THREE.MeshBasicMaterial;
    rings: THREE.MeshBasicMaterial[];
    dust: THREE.PointsMaterial;
    light: THREE.PointLight;
  } | null>(null);

  useEffect(() => {
    const container = wrapRef.current;
    if (!container) return;

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const colors = PALETTE.login;

    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(colors.fog, 0.048);

    const camera = new THREE.PerspectiveCamera(42, 1, 0.1, 50);
    camera.position.set(0, 0.1, 4.8);

    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance'
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor(0, 0);
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.08;
    renderer.domElement.className =
      'absolute inset-0 block h-full w-full touch-none pointer-events-none';
    container.appendChild(renderer.domElement);

    const rig = new THREE.Group();
    scene.add(rig);

    const chain = new THREE.Group();
    rig.add(chain);

    const linkMats: THREE.MeshStandardMaterial[] = [];

    const link1 = createChainLink(colors.linkA, 0.64);
    link1.rotation.y = Math.PI / 2;
    link1.position.set(-0.42, 0.08, 0);
    linkMats.push(link1.material as THREE.MeshStandardMaterial);
    chain.add(link1);

    const link2 = createChainLink(colors.linkB, 0.58);
    link2.rotation.x = Math.PI / 2;
    link2.position.set(0.42, -0.06, 0.12);
    linkMats.push(link2.material as THREE.MeshStandardMaterial);
    chain.add(link2);

    const wireMat = new THREE.MeshBasicMaterial({
      color: colors.wire,
      wireframe: true,
      transparent: true,
      opacity: 0.1
    });
    const wireShell = new THREE.Mesh(new THREE.TorusGeometry(0.78, 0.24, 14, 48), wireMat);
    wireShell.rotation.y = Math.PI / 2;
    wireShell.position.copy(link1.position);
    wireShell.scale.setScalar(1.05);
    chain.add(wireShell);

    const clasp = new THREE.Mesh(
      new THREE.CylinderGeometry(0.14, 0.14, 0.36, 24),
      new THREE.MeshStandardMaterial({
        color: 0x0a0514,
        emissive: new THREE.Color(colors.linkA),
        emissiveIntensity: 0.72,
        metalness: 0.7,
        roughness: 0.2
      })
    );
    clasp.rotation.z = Math.PI / 2;
    clasp.position.set(0, 0.02, 0);
    chain.add(clasp);

    const ringGroup = new THREE.Group();
    const ringMats: THREE.MeshBasicMaterial[] = [];
    const ringColors = [colors.linkA, colors.linkB, colors.ring];
    for (let i = 0; i < 3; i++) {
      const rm = new THREE.MeshBasicMaterial({
        color: ringColors[i % ringColors.length],
        transparent: true,
        opacity: 0.14 - i * 0.03
      });
      ringMats.push(rm);
      const ring = new THREE.Mesh(
        new THREE.TorusGeometry(1.85 + i * 0.42, 0.01, 8, 96),
        rm
      );
      ring.rotation.x = Math.PI / 2 + i * 0.18;
      ring.rotation.y = i * 0.32;
      ringGroup.add(ring);
    }
    scene.add(ringGroup);

    const n = 180;
    const pos = new Float32Array(n * 3);
    for (let i = 0; i < n; i++) {
      const r = 1.8 + Math.random() * 3.2;
      const u = Math.random() * Math.PI * 2;
      const v = Math.acos(2 * Math.random() - 1);
      pos[i * 3] = r * Math.sin(v) * Math.cos(u);
      pos[i * 3 + 1] = r * Math.sin(v) * Math.sin(u) * 0.35;
      pos[i * 3 + 2] = r * Math.cos(v);
    }
    const pGeo = new THREE.BufferGeometry();
    pGeo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
    const dustMat = new THREE.PointsMaterial({
      color: colors.particle,
      size: 0.024,
      transparent: true,
      opacity: 0.28,
      depthWrite: false,
      blending: THREE.AdditiveBlending
    });
    const dust = new THREE.Points(pGeo, dustMat);
    scene.add(dust);

    scene.add(new THREE.HemisphereLight(0xfae8ff, 0x0a0514, 0.28));
    scene.add(new THREE.AmbientLight(0xffffff, 0.12));
    const dir = new THREE.DirectionalLight(0xfdf4ff, 0.42);
    dir.position.set(3, 4, 5);
    scene.add(dir);
    const pt = new THREE.PointLight(colors.light, 1.1, 18);
    pt.position.set(-2.8, 0.4, 3.5);
    scene.add(pt);

    matsRef.current = {
      links: linkMats,
      wire: wireMat,
      rings: ringMats,
      dust: dustMat,
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
    const motion = prefersReducedMotion ? 0.35 : 1;

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
      const tx = pointer.x * 0.22;
      const ty = pointer.y * 0.18;

      rig.rotation.y += (t * 0.08 * motion + tx * 0.18 - rig.rotation.y) * 0.04;
      rig.rotation.x += (Math.sin(t * 0.2) * 0.05 * motion + ty * 0.12 - rig.rotation.x) * 0.04;

      link1.rotation.z = Math.sin(t * 0.38 * motion) * 0.07;
      link2.rotation.z = Math.cos(t * 0.32 * motion) * 0.06;
      wireShell.rotation.z = t * 0.06 * motion;
      clasp.rotation.x = t * 0.14 * motion;

      ringGroup.rotation.z = t * 0.04 * motion;
      ringGroup.children.forEach((child, i) => {
        child.rotation.z = t * (0.05 + i * 0.018) * motion;
      });
      dust.rotation.y = t * 0.015 * motion;

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

    const target = PALETTE[mode];
    const fromLinkColors = m.links.map((mat) => mat.emissive.clone());
    const fromWire = m.wire.color.clone();
    const fromRingColors = m.rings.map((mat) => mat.color.clone());
    const fromDust = m.dust.color.clone();
    const fromLight = m.light.color.clone();

    const linkTargets = [target.linkA, target.linkB];
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
            m.links.forEach((mat, i) => {
              mat.emissive.copy(fromLinkColors[i]).lerp(new THREE.Color(linkTargets[i]), u);
            });
            m.wire.color.copy(fromWire).lerp(new THREE.Color(target.wire), u);
            m.dust.color.copy(fromDust).lerp(new THREE.Color(target.particle), u);
            m.light.color.copy(fromLight).lerp(new THREE.Color(target.light), u);
            m.rings.forEach((mat, i) => {
              const to = new THREE.Color([target.linkA, target.linkB, target.ring][i]);
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
