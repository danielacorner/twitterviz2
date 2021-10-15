import * as THREE from "three";
import { NODE_RADIUS } from "utils/constants";

export const defaultNodeMaterial = new THREE.MeshPhysicalMaterial({
  emissive: "#0b152f",
  metalness: 0.4,
  transmission: 1,
  roughness: 0,
  envMapIntensity: 4,
  transparent: true,
  // color: "#316c83",
});
export const opacityMaterial = new THREE.MeshPhysicalMaterial({
  emissive: "#0b152f",
  metalness: 0.97,
  transmission: 1,
  roughness: 0,
  envMapIntensity: 4,
  // color: "#316c83",
});
export const invisibleMaterial = new THREE.MeshBasicMaterial({
  transparent: true,
  visible: false,
  opacity: 0,
});
export const rightClickNodeMaterial = new THREE.MeshPhysicalMaterial({
  // emissive: "#471111",
  metalness: -1,
  transmission: 1,
  roughness: 0,
  envMapIntensity: 4,
  // color: "#be5626",
});
export const notABotMaterial = new THREE.MeshPhysicalMaterial({
  emissive: "#0b152f",
  metalness: 0.4,
  transmission: 1,
  roughness: 0,
  envMapIntensity: 4,
  transparent: true,
  // opacity: 0,
  // color: "#be5626",
});
export const pointerOverMaterial = new THREE.MeshPhysicalMaterial({
  // emissive: "#002741",
  metalness: -1.5,
  roughness: 0.1,
  transmission: 1,
  envMapIntensity: 4,
  // color: "#3ad64f",
});
export const tooltipNodeMaterial = new THREE.MeshPhysicalMaterial({
  // emissive: "#002741",
  metalness: 1,
  roughness: 0.2,
  transmission: 1,
  envMapIntensity: 4,
  // color: "#26be3a",
});
export const nodeGeometry = new THREE.SphereGeometry(NODE_RADIUS, 28, 28);
