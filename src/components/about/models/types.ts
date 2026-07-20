import * as THREE from "three";

export type AboutModelVariant =
  | "knowledge_library"
  | "telescope_view"
  | "truth_bridge"
  | "cosmic_gate"
  | "question_orb"
  | "story_orbit"
  | "evidence_grid"
  | "constellation_path"
  | "satellite_orbit";

export interface AboutModelInstance {
  scene: THREE.Scene;
  camera: THREE.PerspectiveCamera;
  root: THREE.Group;
  update: (delta: number, elapsed: number) => void;
  resize: (width: number, height: number) => void;
  dispose: () => void;
}
