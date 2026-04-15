import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { disposeThreeObject } from '../utils/disposeThreeObject';

export type FeatureMiniVariant = 'email' | 'social' | 'qr' | 'api';

function stdMat(emissive: number, intensity = 0.45) {
  return new THREE.MeshStandardMaterial({
    color: 0x0c1220,
    emissive: new THREE.Color(emissive),
    emissiveIntensity: intensity,
    metalness: 0.72,
    roughness: 0.22
  });
}

/** 15×15 QR-style bitmap: 1 = dark module (finders + sample data). */
function buildQrLikePattern(): boolean[][] {
  const n = 15;
  const g: boolean[][] = Array.from({ length: n }, () => Array(n).fill(false));

  const finder = (ox: number, oy: number) => {
    for (let i = 0; i < 7; i++) {
      for (let j = 0; j < 7; j++) {
        const border = i === 0 || j === 0 || i === 6 || j === 6;
        const inner = i >= 2 && i <= 4 && j >= 2 && j <= 4;
        const hole = i === 3 && j === 3;
        if (border || (inner && !hole)) {
          g[oy + i][ox + j] = true;
        }
      }
    }
  };

  finder(0, 0);
  finder(8, 0);
  finder(0, 8);

  const data: [number, number][] = [
    [7, 7],
    [8, 7],
    [9, 7],
    [7, 8],
    [9, 9],
    [10, 8],
    [11, 9],
    [12, 10],
    [7, 10],
    [8, 11],
    [10, 11],
    [11, 12],
    [12, 12],
    [13, 8],
    [13, 9],
    [14, 10]
  ];
  for (const [x, y] of data) {
    if (x < n && y < n) g[y][x] = true;
  }
  return g;
}

function makeQrCanvasTexture(): THREE.CanvasTexture {
  const px = 96;
  const canvas = document.createElement('canvas');
  canvas.width = canvas.height = px;
  const ctx = canvas.getContext('2d');
  if (!ctx) {
    const tex = new THREE.CanvasTexture(canvas);
    tex.colorSpace = THREE.SRGBColorSpace;
    return tex;
  }

  const grid = buildQrLikePattern();
  const n = grid.length;
  const pad = 6;
  const cell = (px - pad * 2) / n;

  ctx.fillStyle = '#f8fafc';
  ctx.fillRect(0, 0, px, px);

  ctx.fillStyle = '#020617';
  for (let y = 0; y < n; y++) {
    for (let x = 0; x < n; x++) {
      if (grid[y][x]) {
        const r = 1.1;
        ctx.fillRect(pad + x * cell + r, pad + y * cell + r, cell - r * 2, cell - r * 2);
      }
    }
  }

  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = 4;
  tex.needsUpdate = true;
  return tex;
}

interface LandingFeatureMiniSceneProps {
  variant: FeatureMiniVariant;
}

/** Lightweight channel visual per card (single small WebGL view). */
export function LandingFeatureMiniScene({ variant }: LandingFeatureMiniSceneProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x020617, 0.09);

    const camera = new THREE.PerspectiveCamera(42, 1, 0.1, 20);
    camera.position.set(0, 0.05, 2.6);

    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: 'low-power'
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.75));
    renderer.setClearColor(0, 0);
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1;
    renderer.domElement.className = 'absolute inset-0 h-full w-full block';
    container.appendChild(renderer.domElement);

    const root = new THREE.Group();
    scene.add(root);

    scene.add(new THREE.AmbientLight(0xffffff, 0.28));
    const dir = new THREE.DirectionalLight(0xe2e8f0, 0.55);
    dir.position.set(2, 3, 4);
    scene.add(dir);

    let knotMesh: THREE.Mesh | null = null;
    let wireFollow: THREE.LineSegments | null = null;

    if (variant === 'email') {
      const envelopeShape = new THREE.Shape();
      const bw = 0.48;
      const bottomY = -0.32;
      const shoulderY = 0.1;
      const tipY = 0.38;
      envelopeShape.moveTo(-bw, bottomY);
      envelopeShape.lineTo(bw, bottomY);
      envelopeShape.lineTo(bw, shoulderY);
      envelopeShape.lineTo(0, tipY);
      envelopeShape.lineTo(-bw, shoulderY);
      envelopeShape.closePath();

      const extrude = new THREE.ExtrudeGeometry(envelopeShape, {
        depth: 0.085,
        bevelEnabled: true,
        bevelThickness: 0.018,
        bevelSize: 0.018,
        bevelSegments: 2
      });
      extrude.center();

      const shell = new THREE.Mesh(extrude, stdMat(0x2dd4bf, 0.42));
      shell.rotation.x = Math.PI * 0.06;
      root.add(shell);

      const innerPlane = new THREE.Mesh(
        new THREE.PlaneGeometry(0.58, 0.22),
        new THREE.MeshStandardMaterial({
          color: 0xf1f5f9,
          emissive: new THREE.Color(0xccfbf1),
          emissiveIntensity: 0.14,
          metalness: 0.05,
          roughness: 0.88,
          side: THREE.DoubleSide
        })
      );
      innerPlane.position.set(0, -0.04, 0.052);
      innerPlane.rotation.x = -0.08;
      root.add(innerPlane);

      const seal = new THREE.Mesh(
        new THREE.CircleGeometry(0.055, 28),
        stdMat(0xf472b6, 0.58)
      );
      seal.position.set(0, 0.06, 0.09);
      seal.rotation.x = -0.28;
      root.add(seal);
    } else if (variant === 'social') {
      for (let i = 0; i < 3; i++) {
        const em = i === 1 ? 0x38bdf8 : 0x2dd4bf;
        const m = new THREE.Mesh(new THREE.BoxGeometry(0.38, 0.48, 0.06), stdMat(em, 0.44));
        m.position.set((i - 1) * 0.42, (i - 1) * -0.06, i * 0.04);
        m.rotation.z = (i - 1) * 0.12;
        root.add(m);
      }
    } else if (variant === 'qr') {
      const qrMap = makeQrCanvasTexture();
      const frame = new THREE.Mesh(
        new THREE.BoxGeometry(0.92, 0.92, 0.06),
        stdMat(0x134e4a, 0.28)
      );
      frame.rotation.x = 0.05;
      root.add(frame);

      const face = new THREE.Mesh(
        new THREE.PlaneGeometry(0.78, 0.78),
        new THREE.MeshStandardMaterial({
          map: qrMap,
          roughness: 0.45,
          metalness: 0.12,
          emissive: new THREE.Color(0x042f2e),
          emissiveIntensity: 0.08
        })
      );
      face.position.set(0, 0, 0.036);
      root.add(face);

      const corners = new THREE.LineSegments(
        new THREE.EdgesGeometry(new THREE.PlaneGeometry(0.78, 0.78)),
        new THREE.LineBasicMaterial({ color: 0x5eead4, transparent: true, opacity: 0.45 })
      );
      corners.position.set(0, 0, 0.037);
      root.add(corners);
    } else {
      const geo = new THREE.TorusKnotGeometry(0.32, 0.1, 48, 8, 2, 3);
      knotMesh = new THREE.Mesh(geo, stdMat(0xc4b5fd, 0.46));
      root.add(knotMesh);
      const wf = new THREE.WireframeGeometry(geo);
      wireFollow = new THREE.LineSegments(
        wf,
        new THREE.LineBasicMaterial({ color: 0x5eead4, transparent: true, opacity: 0.14 })
      );
      wireFollow.scale.setScalar(1.02);
      root.add(wireFollow);
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
    window.addEventListener('resize', setSize);

    const animate = () => {
      const t = clock.getElapsedTime();
      const slow = variant === 'email' || variant === 'qr';
      root.rotation.y = t * (slow ? 0.16 : 0.35);
      root.rotation.x = Math.sin(t * 0.5) * (slow ? 0.05 : 0.08);
      if (variant === 'api' && knotMesh && wireFollow) {
        knotMesh.rotation.x = t * 0.55;
        knotMesh.rotation.y = t * 0.4;
        wireFollow.rotation.copy(knotMesh.rotation);
      }
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
  }, [variant]);

  return (
    <div
      ref={containerRef}
      className="relative h-[100px] w-full overflow-hidden rounded-xl bg-gradient-to-br from-slate-900/90 via-slate-950 to-slate-900/90 md:h-[108px]"
      aria-hidden
    />
  );
}
