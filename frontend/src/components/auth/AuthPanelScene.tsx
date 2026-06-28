import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import gsap from 'gsap';
import { disposeThreeObject } from '../../pages/landing/utils/disposeThreeObject';

export type AuthPanelMode = 'login' | 'register';

const PALETTE = {
  login: {
    fog: 0x0a0514,
    primary: 0xe879f9,
    secondary: 0xc084fc,
    accent: 0xf472b6,
    portal: 0xf0abfc,
    flow: 0xd8b4fe,
    particle: 0xc084fc,
    light: 0xf0abfc
  },
  register: {
    fog: 0x0a0514,
    primary: 0xfbbf24,
    secondary: 0xf472b6,
    accent: 0xfcd34d,
    portal: 0xfde68a,
    flow: 0xfbbf24,
    particle: 0xfde68a,
    light: 0xfbbf24
  }
} as const;

type Palette = (typeof PALETTE)[AuthPanelMode];

type SceneMaterials = {
  tube: THREE.MeshStandardMaterial;
  portal: THREE.MeshStandardMaterial;
  longBar: THREE.MeshStandardMaterial;
  shortChip: THREE.MeshStandardMaterial;
  pings: THREE.MeshStandardMaterial[];
  rings: THREE.MeshBasicMaterial[];
  dust: THREE.PointsMaterial;
  light: THREE.PointLight;
};

function emissiveMat(color: number, intensity = 0.55) {
  return new THREE.MeshStandardMaterial({
    color: 0x0c0818,
    emissive: new THREE.Color(color),
    emissiveIntensity: intensity,
    metalness: 0.82,
    roughness: 0.14
  });
}

function tweenPalette(m: SceneMaterials, target: Palette) {
  const from = {
    tube: m.tube.emissive.clone(),
    portal: m.portal.emissive.clone(),
    longBar: m.longBar.emissive.clone(),
    shortChip: m.shortChip.emissive.clone(),
    pings: m.pings.map((mat) => mat.emissive.clone()),
    rings: m.rings.map((mat) => mat.color.clone()),
    dust: m.dust.color.clone(),
    light: m.light.color.clone()
  };

  const proxy = { t: 0 };
  return gsap.context(() => {
    gsap.fromTo(
      proxy,
      { t: 0 },
      {
        t: 1,
        duration: 0.55,
        ease: 'power2.inOut',
        onUpdate: () => {
          const u = proxy.t;
          m.tube.emissive.copy(from.tube).lerp(new THREE.Color(target.flow), u);
          m.portal.emissive.copy(from.portal).lerp(new THREE.Color(target.portal), u);
          m.longBar.emissive.copy(from.longBar).lerp(new THREE.Color(target.secondary), u);
          m.shortChip.emissive.copy(from.shortChip).lerp(new THREE.Color(target.primary), u);
          m.pings.forEach((mat, i) => {
            mat.emissive.copy(from.pings[i]).lerp(new THREE.Color(target.primary), u);
          });
          m.dust.color.copy(from.dust).lerp(new THREE.Color(target.particle), u);
          m.light.color.copy(from.light).lerp(new THREE.Color(target.light), u);
          m.rings.forEach((mat, i) => {
            const to = new THREE.Color(i === 0 ? target.primary : target.secondary);
            mat.color.copy(from.rings[i]).lerp(to, u);
          });
        }
      }
    );
  });
}

/** Auth 3D: redirect portal — long URL flows through a ring into a short link chip. */
export function AuthPanelScene({ mode }: { mode: AuthPanelMode }) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const matsRef = useRef<SceneMaterials | null>(null);

  useEffect(() => {
    const container = wrapRef.current;
    if (!container) return;

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const colors = PALETTE.login;

    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(colors.fog, 0.052);

    const camera = new THREE.PerspectiveCamera(44, 1, 0.1, 60);
    camera.position.set(0, 0.15, 5.4);

    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance'
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor(0, 0);
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.1;
    renderer.domElement.className =
      'absolute inset-0 block h-full w-full touch-none pointer-events-none';
    container.appendChild(renderer.domElement);

    const rig = new THREE.Group();
    scene.add(rig);

    const portalGroup = new THREE.Group();
    rig.add(portalGroup);

    const portalMat = emissiveMat(colors.portal, 0.62);
    const portal = new THREE.Mesh(new THREE.TorusGeometry(1.05, 0.045, 20, 128), portalMat);
    portal.rotation.x = Math.PI / 2.15;
    portal.rotation.y = 0.35;
    portalGroup.add(portal);

    const portalGlow = new THREE.Mesh(
      new THREE.TorusGeometry(1.05, 0.09, 16, 96),
      new THREE.MeshBasicMaterial({
        color: colors.accent,
        transparent: true,
        opacity: 0.07,
        blending: THREE.AdditiveBlending,
        depthWrite: false
      })
    );
    portalGlow.rotation.copy(portal.rotation);
    portalGroup.add(portalGlow);

    const longBarMat = emissiveMat(colors.secondary, 0.48);
    const longBar = new THREE.Mesh(new THREE.BoxGeometry(1.65, 0.11, 0.11), longBarMat);
    longBar.position.set(-1.55, 0.05, 0.15);
    longBar.rotation.z = 0.08;
    rig.add(longBar);

    const shortChipMat = emissiveMat(colors.primary, 0.72);
    const shortChip = new THREE.Mesh(new THREE.BoxGeometry(0.52, 0.22, 0.22), shortChipMat);
    shortChip.position.set(1.48, -0.02, -0.08);
    shortChip.rotation.z = -0.06;
    rig.add(shortChip);

    const redirectCurve = new THREE.CubicBezierCurve3(
      new THREE.Vector3(-0.75, 0.08, 0.12),
      new THREE.Vector3(-0.35, 0.85, 0.45),
      new THREE.Vector3(0.35, -0.75, -0.25),
      new THREE.Vector3(0.95, 0.02, -0.05)
    );

    const tubeMat = emissiveMat(colors.flow, 0.38);
    rig.add(new THREE.Mesh(new THREE.TubeGeometry(redirectCurve, 72, 0.035, 10, false), tubeMat));

    const pingCount = 5;
    const pingMats: THREE.MeshStandardMaterial[] = [];
    const pings: THREE.Mesh[] = [];
    const pingGeo = new THREE.SphereGeometry(0.055, 12, 12);
    for (let i = 0; i < pingCount; i++) {
      const pm = emissiveMat(colors.primary, 0.95);
      pingMats.push(pm);
      const ping = new THREE.Mesh(pingGeo, pm);
      rig.add(ping);
      pings.push(ping);
    }

    const hub = new THREE.Mesh(new THREE.SphereGeometry(0.12, 20, 20), emissiveMat(colors.accent, 0.85));
    hub.position.set(0, 0, 0);
    portalGroup.add(hub);

    const ringGroup = new THREE.Group();
    const ringMats: THREE.MeshBasicMaterial[] = [];
    for (let i = 0; i < 2; i++) {
      const rm = new THREE.MeshBasicMaterial({
        color: i === 0 ? colors.primary : colors.secondary,
        transparent: true,
        opacity: 0.1 - i * 0.025
      });
      ringMats.push(rm);
      const ring = new THREE.Mesh(new THREE.TorusGeometry(2.05 + i * 0.55, 0.008, 8, 120), rm);
      ring.rotation.x = Math.PI / 2 + i * 0.4;
      ring.rotation.y = i * 0.5;
      ringGroup.add(ring);
    }
    scene.add(ringGroup);

    const n = 140;
    const pos = new Float32Array(n * 3);
    for (let i = 0; i < n; i++) {
      const r = 2.2 + Math.random() * 3;
      const u = Math.random() * Math.PI * 2;
      const v = Math.acos(2 * Math.random() - 1);
      pos[i * 3] = r * Math.sin(v) * Math.cos(u);
      pos[i * 3 + 1] = r * Math.sin(v) * Math.sin(u) * 0.4;
      pos[i * 3 + 2] = r * Math.cos(v);
    }
    const dustMat = new THREE.PointsMaterial({
      color: colors.particle,
      size: 0.022,
      transparent: true,
      opacity: 0.24,
      depthWrite: false,
      blending: THREE.AdditiveBlending
    });
    const dust = new THREE.Points(
      new THREE.BufferGeometry().setAttribute('position', new THREE.BufferAttribute(pos, 3)),
      dustMat
    );
    scene.add(dust);

    scene.add(new THREE.HemisphereLight(0xfae8ff, 0x0a0514, 0.3));
    scene.add(new THREE.AmbientLight(0xffffff, 0.1));
    const dir = new THREE.DirectionalLight(0xfdf4ff, 0.38);
    dir.position.set(3, 4, 5);
    scene.add(dir);
    const pt = new THREE.PointLight(colors.light, 1.2, 20);
    pt.position.set(-2.5, 0.8, 4);
    scene.add(pt);

    matsRef.current = {
      tube: tubeMat,
      portal: portalMat,
      longBar: longBarMat,
      shortChip: shortChipMat,
      pings: pingMats,
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
    const motion = prefersReducedMotion ? 0.3 : 1;
    const pingOffset = pings.map((_, i) => i / pingCount);

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
      const tx = pointer.x * 0.2;
      const ty = pointer.y * 0.16;

      rig.rotation.y += (t * 0.05 * motion + tx * 0.14 - rig.rotation.y) * 0.035;
      rig.rotation.x += (Math.sin(t * 0.18) * 0.04 * motion + ty * 0.1 - rig.rotation.x) * 0.035;

      portal.rotation.z = t * 0.1 * motion;
      portalGlow.rotation.z = portal.rotation.z;
      hub.scale.setScalar(1 + Math.sin(t * 2.2) * 0.06 * motion);

      longBar.position.x = -1.55 + Math.sin(t * 0.5) * 0.04 * motion;
      shortChip.position.x = 1.48 + Math.cos(t * 0.45) * 0.03 * motion;
      shortChip.rotation.y = Math.sin(t * 0.35) * 0.12 * motion;

      const flowSpeed = 0.14 * motion;
      pings.forEach((ping, i) => {
        const u = (t * flowSpeed + pingOffset[i]) % 1;
        const point = redirectCurve.getPointAt(u);
        const tangent = redirectCurve.getTangentAt(u).normalize();
        ping.position.copy(point);
        ping.scale.setScalar(0.85 + Math.sin(t * 3 + i) * 0.15 * motion);
        ping.lookAt(point.clone().add(tangent));
      });

      ringGroup.rotation.z = t * 0.03 * motion;
      ringGroup.children.forEach((child, i) => {
        child.rotation.z = t * (0.045 + i * 0.015) * motion;
      });
      dust.rotation.y = t * 0.012 * motion;

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
    const ctx = tweenPalette(m, PALETTE[mode]);
    return () => ctx.revert();
  }, [mode]);

  return <div ref={wrapRef} className="absolute inset-0 overflow-hidden rounded-[inherit]" aria-hidden />;
}
