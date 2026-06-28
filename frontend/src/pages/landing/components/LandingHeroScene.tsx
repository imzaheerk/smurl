import { type RefObject, useEffect, useRef } from 'react';
import * as THREE from 'three';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const PALETTE = {
  fog: 0x0a0514,
  linkA: 0xe879f9,
  linkB: 0xfbbf24,
  linkC: 0x818cf8,
  wire: 0xf472b6,
  node: 0xf59e0b,
  particle: 0xc084fc
} as const;

function disposeObject3D(object: THREE.Object3D) {
  object.traverse((child) => {
    if (child instanceof THREE.InstancedMesh || child instanceof THREE.Mesh || child instanceof THREE.Points) {
      child.geometry?.dispose();
      const mat = child.material;
      if (Array.isArray(mat)) {
        mat.forEach((m) => m.dispose());
      } else {
        mat?.dispose();
      }
    }
  });
}

function createChainLink(emissive: number, intensity = 0.55) {
  const geo = new THREE.TorusGeometry(0.92, 0.28, 32, 96);
  const mat = new THREE.MeshStandardMaterial({
    color: 0x0c0a18,
    emissive: new THREE.Color(emissive),
    emissiveIntensity: intensity,
    metalness: 0.82,
    roughness: 0.14
  });
  return new THREE.Mesh(geo, mat);
}

export interface LandingHeroSceneProps {
  scrollRootRef?: RefObject<HTMLElement | null>;
}

/** WebGL hero: interlocking chain links, network nodes, particle field — scroll + pointer reactive. */
export function LandingHeroScene({ scrollRootRef }: LandingHeroSceneProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    const isMobile = window.matchMedia('(max-width: 767px)').matches;
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const config = {
      cameraFov: isMobile ? 50 : 38,
      cameraStartY: isMobile ? 0.15 : 0.05,
      cameraStartZ: isMobile ? 8.5 : 7.4,
      pointerX: isMobile ? 0.2 : 0.42,
      pointerY: isMobile ? 0.15 : 0.32,
      rigLerp: isMobile ? 0.028 : 0.04,
      scrollRigX: isMobile ? 0.28 : 0.48,
      scrollRigY: isMobile ? 0.18 : 0.3,
      scrollCamZ: isMobile ? 0.55 : 1.0,
      scrollCamY: isMobile ? 0.15 : 0.28,
      orbitNodeCount: isMobile ? 8 : 16,
      particleCount: isMobile ? 220 : 420
    };

    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(PALETTE.fog, 0.042);

    const camera = new THREE.PerspectiveCamera(config.cameraFov, 1, 0.1, 100);
    camera.position.set(0, config.cameraStartY, config.cameraStartZ);

    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance'
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor(0x000000, 0);
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.12;
    renderer.domElement.className =
      'absolute inset-0 h-full w-full block pointer-events-none touch-none';
    container.appendChild(renderer.domElement);

    const rig = new THREE.Group();
    scene.add(rig);

    const chain = new THREE.Group();
    rig.add(chain);

    const link1 = createChainLink(PALETTE.linkA, 0.62);
    link1.rotation.y = Math.PI / 2;
    link1.position.set(-0.55, 0.1, 0);
    chain.add(link1);

    const link2 = createChainLink(PALETTE.linkB, 0.58);
    link2.rotation.x = Math.PI / 2;
    link2.position.set(0.55, -0.05, 0.15);
    chain.add(link2);

    const link3 = createChainLink(PALETTE.linkC, 0.52);
    link3.rotation.z = Math.PI / 3.5;
    link3.rotation.y = Math.PI / 4;
    link3.position.set(0, 0.35, -0.4);
    link3.scale.setScalar(0.72);
    chain.add(link3);

    const wireGeo = new THREE.TorusGeometry(0.92, 0.28, 16, 64);
    const wireMat = new THREE.MeshBasicMaterial({
      color: PALETTE.wire,
      wireframe: true,
      transparent: true,
      opacity: 0.09
    });
    const wireShell = new THREE.Mesh(wireGeo, wireMat);
    wireShell.rotation.y = Math.PI / 2;
    wireShell.position.copy(link1.position);
    wireShell.scale.setScalar(1.04);
    chain.add(wireShell);

    const core = new THREE.Mesh(
      new THREE.IcosahedronGeometry(0.22, 1),
      new THREE.MeshStandardMaterial({
        color: 0x0a0514,
        emissive: new THREE.Color(0xf472b6),
        emissiveIntensity: 0.85,
        metalness: 0.6,
        roughness: 0.18
      })
    );
    core.position.set(0, 0.05, 0);
    chain.add(core);

    const orbitRings = new THREE.Group();
    const ringColors = [PALETTE.linkA, PALETTE.linkB, PALETTE.linkC];
    for (let i = 0; i < 3; i++) {
      const ring = new THREE.Mesh(
        new THREE.TorusGeometry(2.1 + i * 0.48, 0.014, 8, 128),
        new THREE.MeshBasicMaterial({
          color: ringColors[i],
          transparent: true,
          opacity: 0.16 - i * 0.03
        })
      );
      ring.rotation.x = Math.PI / 2 + i * 0.28;
      ring.rotation.y = i * 0.45;
      orbitRings.add(ring);
    }
    scene.add(orbitRings);

    const orbitNodeCount = config.orbitNodeCount;
    const nodeGeo = new THREE.OctahedronGeometry(0.08, 0);
    const nodeMat = new THREE.MeshStandardMaterial({
      color: 0x0a0514,
      emissive: new THREE.Color(PALETTE.node),
      emissiveIntensity: 0.7,
      metalness: 0.55,
      roughness: 0.22
    });
    const orbitNodes = new THREE.InstancedMesh(nodeGeo, nodeMat, orbitNodeCount);
    orbitNodes.instanceMatrix.setUsage(THREE.DynamicDrawUsage);
    scene.add(orbitNodes);

    const radii = [1.6, 2.0, 2.45, 2.9];
    const phases: number[] = [];
    const speeds: number[] = [];
    const planeTilt: number[] = [];
    for (let i = 0; i < orbitNodeCount; i++) {
      phases.push((i / orbitNodeCount) * Math.PI * 2);
      speeds.push(0.3 + (i % 4) * 0.1);
      planeTilt.push((i % 5) * 0.32 - 0.64);
      const dummy = new THREE.Object3D();
      dummy.updateMatrix();
      orbitNodes.setMatrixAt(i, dummy.matrix);
    }
    const dummy = new THREE.Object3D();

    const particleCount = config.particleCount;
    const positions = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount; i++) {
      const r = 2.6 + Math.random() * 4.2;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      positions[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      positions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta) * 0.48;
      positions[i * 3 + 2] = r * Math.cos(phi);
    }
    const pGeo = new THREE.BufferGeometry();
    pGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    const particles = new THREE.Points(
      pGeo,
      new THREE.PointsMaterial({
        color: PALETTE.particle,
        size: 0.028,
        transparent: true,
        opacity: 0.35,
        depthWrite: false,
        blending: THREE.AdditiveBlending
      })
    );
    scene.add(particles);

    scene.add(new THREE.HemisphereLight(0xfae8ff, 0x0a0514, 0.32));
    scene.add(new THREE.AmbientLight(0xffffff, 0.1));
    const key = new THREE.DirectionalLight(0xfdf4ff, 0.5);
    key.position.set(5, 4, 6);
    scene.add(key);
    const fill = new THREE.PointLight(0xe879f9, 1.1, 28);
    fill.position.set(-4.5, -0.8, 4);
    scene.add(fill);
    const rim = new THREE.PointLight(0xfbbf24, 1.4, 22);
    rim.position.set(4, 2.5, 3);
    scene.add(rim);

    const pointer = { x: 0, y: 0 };
    const targetRot = { x: 0, y: 0 };

    const onPointer = (e: PointerEvent) => {
      const rect = container.getBoundingClientRect();
      if (rect.width === 0 || rect.height === 0) return;
      pointer.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      pointer.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;
    };

    if (!isMobile) {
      window.addEventListener('pointermove', onPointer, { passive: true });
    }

    const scrollState = { progress: 0 };
    let scrollTrigger: ScrollTrigger | null = null;
    const rootEl = scrollRootRef?.current;
    if (rootEl) {
      scrollTrigger = ScrollTrigger.create({
        trigger: rootEl,
        start: 'top bottom',
        end: 'bottom top',
        scrub: 0.55,
        onUpdate: (self) => {
          scrollState.progress = self.progress;
        }
      });
      requestAnimationFrame(() => ScrollTrigger.refresh());
    }

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
      const sp = scrollState.progress;

      targetRot.x = pointer.y * config.pointerY;
      targetRot.y = pointer.x * config.pointerX;

      const timeFactor = prefersReducedMotion ? 0.025 : 0.085;
      const rotYTimeFactor = prefersReducedMotion ? 0.04 : 0.13;
      rig.rotation.x +=
        (t * timeFactor + targetRot.x * 0.2 + sp * config.scrollRigX - rig.rotation.x) * config.rigLerp;
      rig.rotation.y +=
        (t * rotYTimeFactor + targetRot.y * 0.2 + sp * config.scrollRigY - rig.rotation.y) * config.rigLerp;

      link1.rotation.z = Math.sin(t * 0.35) * 0.06;
      link2.rotation.z = Math.cos(t * 0.28) * 0.05;
      link3.rotation.x += 0.004;
      core.rotation.x = t * 0.18;
      core.rotation.y = t * 0.24;
      wireShell.rotation.z = t * 0.08;

      orbitRings.rotation.z = t * 0.045 + sp * 0.35;
      orbitRings.rotation.x = Math.sin(t * 0.1) * 0.06 + sp * 0.1;
      orbitRings.children.forEach((child, i) => {
        child.rotation.z = t * (0.08 + i * 0.025);
      });

      const camZ = config.cameraStartZ - sp * config.scrollCamZ;
      const camY = config.cameraStartY + sp * config.scrollCamY;
      camera.position.z += (camZ - camera.position.z) * 0.08;
      camera.position.y += (camY - camera.position.y) * 0.08;
      camera.lookAt(0, sp * 0.12, 0);

      for (let i = 0; i < orbitNodeCount; i++) {
        const r = radii[i % radii.length];
        const ang = t * speeds[i] + phases[i];
        const tilt = planeTilt[i];
        dummy.position.set(Math.cos(ang) * r, Math.sin(ang * 0.7 + tilt) * 0.5, Math.sin(ang) * r);
        dummy.scale.setScalar(0.8 + (i % 3) * 0.14);
        dummy.rotation.set(t * 0.35 + i, t * 0.2, t * 0.12);
        dummy.updateMatrix();
        orbitNodes.setMatrixAt(i, dummy.matrix);
      }
      orbitNodes.instanceMatrix.needsUpdate = true;

      particles.rotation.y = t * 0.022 + sp * 0.18;

      renderer.render(scene, camera);
      raf = requestAnimationFrame(animate);
    };
    raf = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(raf);
      scrollTrigger?.kill();
      window.removeEventListener('resize', onResize);
      if (!isMobile) {
        window.removeEventListener('pointermove', onPointer);
      }
      disposeObject3D(scene);
      renderer.dispose();
      if (renderer.domElement.parentNode === container) {
        container.removeChild(renderer.domElement);
      }
    };
  }, [scrollRootRef]);

  return (
    <div
      ref={containerRef}
      className="pointer-events-none absolute inset-0 overflow-hidden"
      aria-hidden
    />
  );
}
