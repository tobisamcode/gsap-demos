export interface MenuItem {
  label: string;
  href: string;
}

export const logoLabel = "Golden Hour Atelier";

export const heroHeading = "A Study in Time and Texture";

export const menuItems: MenuItem[] = [
  { label: "Studio", href: "#" },
  { label: "Coordinates", href: "#" },
  { label: "Framework", href: "#" },
  { label: "Garden", href: "#" },
  { label: "Design", href: "#" },
  { label: "Collective", href: "#" },
  { label: "Features", href: "#" },
  { label: "Atrium", href: "#" },
];

export const modelPath = "/models/silver-pinewood-menu/model.glb";

export const sceneConfig = {
  canvasBg: "#1a1a1a",
  metalness: 0.55,
  roughness: 0.75,
  baseZoom: 0.35,
  baseCamPosY: -1.25,
  baseCamPosZ: 0,
  baseRotationX: 0,
  baseRotationY: 0.3,
  baseRotationZ: 0,
  ambientIntensity: 0.25,
  keyIntensity: 0.5,
  keyPosX: 2.5,
  keyPosY: 10,
  keyPosZ: 10,
  fillIntensity: 1.5,
  fillPosX: -5,
  fillPosY: 2.5,
  fillPosZ: -2.5,
  rimIntensity: 2.5,
  rimPosX: -7.5,
  rimPosY: 5,
  rimPosZ: -10,
  topIntensity: 0.5,
  topPosX: 0,
  topPosY: 15,
  topPosZ: 0,
  cursorLightEnabled: true,
  cursorLightIntensity: 2.5,
  cursorLightColor: 0xffffff,
  cursorLightDistance: 7.5,
  cursorLightDecay: 2,
  cursorLightPosZ: 1.25,
  cursorLightSmoothness: 0.5,
  cursorLightScale: 1,
  parallaxSensitivityX: 0.25,
  parallaxSensitivityY: 0.05,
} as const;
