import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { modelPath, sceneConfig } from "@/features/silver-pinewood-menu/data/content";

export function initMenuScene(canvas: HTMLCanvasElement) {
  const config = {
    ...sceneConfig,
    baseCamPosX: window.innerWidth < 1000 ? 0 : -0.75,
  };

  const scene = new THREE.Scene();
  scene.background = new THREE.Color(config.canvasBg);

  const camera = new THREE.PerspectiveCamera(
    60,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
  );

  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.0;

  const ambientLight = new THREE.AmbientLight(0xffffff, config.ambientIntensity);
  scene.add(ambientLight);

  const keyLight = new THREE.DirectionalLight(0xffffff, config.keyIntensity);
  keyLight.position.set(config.keyPosX, config.keyPosY, config.keyPosZ);
  keyLight.castShadow = true;
  keyLight.shadow.mapSize.width = 4096;
  keyLight.shadow.mapSize.height = 4096;
  keyLight.shadow.camera.near = 0.1;
  keyLight.shadow.camera.far = 100;
  keyLight.shadow.bias = -0.00005;
  keyLight.shadow.normalBias = 0.05;
  scene.add(keyLight);

  const fillLight = new THREE.DirectionalLight(0xffffff, config.fillIntensity);
  fillLight.position.set(config.fillPosX, config.fillPosY, config.fillPosZ);
  scene.add(fillLight);

  const rimLight = new THREE.DirectionalLight(0xffffff, config.rimIntensity);
  rimLight.position.set(config.rimPosX, config.rimPosY, config.rimPosZ);
  scene.add(rimLight);

  const topLight = new THREE.DirectionalLight(0xffffff, config.topIntensity);
  topLight.position.set(config.topPosX, config.topPosY, config.topPosZ);
  scene.add(topLight);

  const cursorLight = new THREE.PointLight(
    config.cursorLightColor,
    config.cursorLightIntensity,
    config.cursorLightDistance,
    config.cursorLightDecay
  );
  cursorLight.position.set(0, 0, config.cursorLightPosZ);
  cursorLight.visible = config.cursorLightEnabled;
  scene.add(cursorLight);

  const loader = new GLTFLoader();
  let model: THREE.Object3D | null = null;
  let modelCenter = new THREE.Vector3();

  loader.load(modelPath, (gltf) => {
    model = gltf.scene;

    model.traverse((node) => {
      const mesh = node as THREE.Mesh;
      if (mesh.isMesh) {
        mesh.castShadow = true;
        mesh.receiveShadow = true;

        const material = mesh.material as THREE.MeshStandardMaterial;
        if (material) {
          material.metalness = config.metalness;
          material.roughness = config.roughness;
          material.needsUpdate = true;
        }
      }
    });

    const box = new THREE.Box3().setFromObject(model);
    modelCenter = box.getCenter(new THREE.Vector3());
    const size = box.getSize(new THREE.Vector3());

    model.position.set(
      -modelCenter.x + config.baseCamPosX,
      -modelCenter.y + config.baseCamPosY,
      -modelCenter.z + config.baseCamPosZ
    );

    model.rotation.set(
      config.baseRotationX,
      config.baseRotationY,
      config.baseRotationZ
    );

    const maxDim = Math.max(size.x, size.y, size.z);
    camera.position.z = maxDim * config.baseZoom;
    camera.lookAt(0, 0, 0);

    scene.add(model);
  });

  let mouseX = 0;
  let mouseY = 0;
  let targetRotationX = 0;
  let targetRotationY = 0;
  let currentRotationX = 0;
  let currentRotationY = 0;
  let cursorLightTargetX = 0;
  let cursorLightTargetY = 0;

  const handleMouseMove = (event: MouseEvent) => {
    mouseX = (event.clientX / window.innerWidth) * 2 - 1;
    mouseY = -(event.clientY / window.innerHeight) * 2 + 1;

    cursorLightTargetX = mouseX * config.cursorLightScale;
    cursorLightTargetY = mouseY * config.cursorLightScale;
  };

  const handleResize = () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);

    config.baseCamPosX = window.innerWidth < 1000 ? 0 : -0.75;
    if (model) {
      model.position.set(
        -modelCenter.x + config.baseCamPosX,
        -modelCenter.y + config.baseCamPosY,
        -modelCenter.z + config.baseCamPosZ
      );
    }
  };

  document.addEventListener("mousemove", handleMouseMove);
  window.addEventListener("resize", handleResize);

  let frameId = 0;
  const animate = () => {
    frameId = requestAnimationFrame(animate);

    if (model) {
      targetRotationY = mouseX * config.parallaxSensitivityX;
      targetRotationX = -mouseY * config.parallaxSensitivityY;

      currentRotationX += (targetRotationX - currentRotationX) * 0.05;
      currentRotationY += (targetRotationY - currentRotationY) * 0.05;

      model.rotation.x = config.baseRotationX + currentRotationX;
      model.rotation.y = config.baseRotationY + currentRotationY;
      model.rotation.z = config.baseRotationZ;
    }

    cursorLight.position.x +=
      (cursorLightTargetX - cursorLight.position.x) *
      config.cursorLightSmoothness;
    cursorLight.position.y +=
      (cursorLightTargetY - cursorLight.position.y) *
      config.cursorLightSmoothness;

    renderer.render(scene, camera);
  };
  animate();

  return () => {
    cancelAnimationFrame(frameId);
    document.removeEventListener("mousemove", handleMouseMove);
    window.removeEventListener("resize", handleResize);
    renderer.dispose();
    scene.traverse((node) => {
      const mesh = node as THREE.Mesh;
      if (mesh.isMesh) {
        mesh.geometry?.dispose();
        const material = mesh.material;
        if (Array.isArray(material)) {
          material.forEach((m) => m.dispose());
        } else {
          material?.dispose();
        }
      }
    });
  };
}
