import * as THREE from 'three';

/** Dispose geometries and materials under a root (meshes, instancing, lines, points). */
export function disposeThreeObject(object: THREE.Object3D) {
  object.traverse((child) => {
    if (child instanceof THREE.InstancedMesh) {
      child.geometry?.dispose();
      const mat = child.material;
      if (Array.isArray(mat)) {
        mat.forEach((m) => m.dispose());
      } else {
        mat?.dispose();
      }
      return;
    }
    if (child instanceof THREE.Mesh) {
      child.geometry?.dispose();
      const mat = child.material;
      if (Array.isArray(mat)) {
        mat.forEach((m) => m.dispose());
      } else {
        mat?.dispose();
      }
      return;
    }
    if (child instanceof THREE.Line) {
      child.geometry?.dispose();
      const mat = child.material;
      if (Array.isArray(mat)) {
        mat.forEach((m) => m.dispose());
      } else {
        mat?.dispose();
      }
      return;
    }
    if (child instanceof THREE.Points) {
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
