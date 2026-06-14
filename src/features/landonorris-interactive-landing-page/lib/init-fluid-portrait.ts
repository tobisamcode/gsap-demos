import * as THREE from "three";
import {
  vertexShader,
  fluidFragmentShader,
  displayFragmentShader,
} from "@/features/landonorris-interactive-landing-page/lib/shaders";
import { portraitImages } from "@/features/landonorris-interactive-landing-page/data/content";

function createPlaceholderTexture(color: string) {
  const placeholder = document.createElement("canvas");
  placeholder.width = 512;
  placeholder.height = 512;
  const ctx = placeholder.getContext("2d")!;
  ctx.fillStyle = color;
  ctx.fillRect(0, 0, 512, 512);

  const texture = new THREE.CanvasTexture(placeholder);
  texture.minFilter = THREE.LinearFilter;
  return texture;
}

function loadImage(
  url: string,
  textureSizeVector: THREE.Vector2,
  onLoad: (texture: THREE.CanvasTexture) => void
) {
  const img = new Image();
  img.crossOrigin = "Anonymous";

  img.onload = () => {
    const originalWidth = img.width;
    const originalHeight = img.height;
    textureSizeVector.set(originalWidth, originalHeight);

    const maxSize = 4096;
    let newWidth = originalWidth;
    let newHeight = originalHeight;

    if (originalWidth > maxSize || originalHeight > maxSize) {
      if (originalWidth > originalHeight) {
        newWidth = maxSize;
        newHeight = Math.floor(originalHeight * (maxSize / originalWidth));
      } else {
        newHeight = maxSize;
        newWidth = Math.floor(originalWidth * (maxSize / originalHeight));
      }
    }

    const canvas = document.createElement("canvas");
    canvas.width = newWidth;
    canvas.height = newHeight;
    const ctx = canvas.getContext("2d")!;
    ctx.drawImage(img, 0, 0, newWidth, newHeight);

    const texture = new THREE.CanvasTexture(canvas);
    texture.minFilter = THREE.LinearFilter;
    texture.magFilter = THREE.LinearFilter;
    onLoad(texture);
  };

  img.src = url;
}

export function initFluidPortrait(canvas: HTMLCanvasElement) {
  const renderer = new THREE.WebGLRenderer({
    canvas,
    antialias: true,
    precision: "highp",
  });

  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

  const scene = new THREE.Scene();
  const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);

  const mouse = new THREE.Vector2(0.5, 0.5);
  const prevMouse = new THREE.Vector2(0.5, 0.5);
  let isMoving = false;
  let lastMoveTime = 0;

  const size = 500;
  const pingPongTargets = [
    new THREE.WebGLRenderTarget(size, size, {
      minFilter: THREE.LinearFilter,
      magFilter: THREE.LinearFilter,
      format: THREE.RGBAFormat,
      type: THREE.FloatType,
    }),
    new THREE.WebGLRenderTarget(size, size, {
      minFilter: THREE.LinearFilter,
      magFilter: THREE.LinearFilter,
      format: THREE.RGBAFormat,
      type: THREE.FloatType,
    }),
  ];
  let currentTarget = 0;

  const topTexture = createPlaceholderTexture("#0000ff");
  const bottomTexture = createPlaceholderTexture("#ff0000");
  const topTextureSize = new THREE.Vector2(1, 1);
  const bottomTextureSize = new THREE.Vector2(1, 1);

  const trailsMaterial = new THREE.ShaderMaterial({
    uniforms: {
      uPrevTrails: { value: null },
      uMouse: { value: mouse },
      uPrevMouse: { value: prevMouse },
      uResolution: { value: new THREE.Vector2(size, size) },
      uDecay: { value: 0.97 },
      uIsMoving: { value: false },
    },
    vertexShader,
    fragmentShader: fluidFragmentShader,
  });

  const displayMaterial = new THREE.ShaderMaterial({
    uniforms: {
      uFluid: { value: null },
      uTopTexture: { value: topTexture },
      uBottomTexture: { value: bottomTexture },
      uResolution: {
        value: new THREE.Vector2(window.innerWidth, window.innerHeight),
      },
      uDpr: { value: window.devicePixelRatio },
      uTopTextureSize: { value: topTextureSize },
      uBottomTextureSize: { value: bottomTextureSize },
    },
    vertexShader,
    fragmentShader: displayFragmentShader,
  });

  loadImage(portraitImages.top, topTextureSize, (texture) => {
    displayMaterial.uniforms.uTopTexture.value = texture;
  });

  loadImage(portraitImages.bottom, bottomTextureSize, (texture) => {
    displayMaterial.uniforms.uBottomTexture.value = texture;
  });

  const planeGeometry = new THREE.PlaneGeometry(2, 2);
  const displayMesh = new THREE.Mesh(planeGeometry, displayMaterial);
  scene.add(displayMesh);

  const simMesh = new THREE.Mesh(planeGeometry, trailsMaterial);
  const simScene = new THREE.Scene();
  simScene.add(simMesh);

  renderer.setRenderTarget(pingPongTargets[0]);
  renderer.clear();
  renderer.setRenderTarget(pingPongTargets[1]);
  renderer.clear();
  renderer.setRenderTarget(null);

  const updatePointer = (clientX: number, clientY: number) => {
    const canvasRect = canvas.getBoundingClientRect();

    if (
      clientX >= canvasRect.left &&
      clientX <= canvasRect.right &&
      clientY >= canvasRect.top &&
      clientY <= canvasRect.bottom
    ) {
      prevMouse.copy(mouse);
      mouse.x = (clientX - canvasRect.left) / canvasRect.width;
      mouse.y = 1 - (clientY - canvasRect.top) / canvasRect.height;
      isMoving = true;
      lastMoveTime = performance.now();
    } else {
      isMoving = false;
    }
  };

  const onMouseMove = (event: MouseEvent) => {
    updatePointer(event.clientX, event.clientY);
  };

  const onTouchMove = (event: TouchEvent) => {
    if (event.touches.length > 0) {
      event.preventDefault();
      updatePointer(event.touches[0].clientX, event.touches[0].clientY);
    }
  };

  const onWindowResize = () => {
    renderer.setSize(window.innerWidth, window.innerHeight);
    displayMaterial.uniforms.uResolution.value.set(
      window.innerWidth,
      window.innerHeight
    );
    displayMaterial.uniforms.uDpr.value = window.devicePixelRatio;
  };

  let rafId = 0;

  const animate = () => {
    rafId = requestAnimationFrame(animate);

    if (isMoving && performance.now() - lastMoveTime > 50) {
      isMoving = false;
    }

    const prevTarget = pingPongTargets[currentTarget];
    currentTarget = (currentTarget + 1) % 2;
    const currentRenderTarget = pingPongTargets[currentTarget];

    trailsMaterial.uniforms.uPrevTrails.value = prevTarget.texture;
    trailsMaterial.uniforms.uMouse.value.copy(mouse);
    trailsMaterial.uniforms.uPrevMouse.value.copy(prevMouse);
    trailsMaterial.uniforms.uIsMoving.value = isMoving;

    renderer.setRenderTarget(currentRenderTarget);
    renderer.render(simScene, camera);

    displayMaterial.uniforms.uFluid.value = currentRenderTarget.texture;

    renderer.setRenderTarget(null);
    renderer.render(scene, camera);
  };

  animate();

  window.addEventListener("mousemove", onMouseMove);
  window.addEventListener("touchmove", onTouchMove, { passive: false });
  window.addEventListener("resize", onWindowResize);

  return () => {
    cancelAnimationFrame(rafId);
    window.removeEventListener("mousemove", onMouseMove);
    window.removeEventListener("touchmove", onTouchMove);
    window.removeEventListener("resize", onWindowResize);

    planeGeometry.dispose();
    trailsMaterial.dispose();
    displayMaterial.dispose();
    topTexture.dispose();
    bottomTexture.dispose();
    pingPongTargets.forEach((target) => target.dispose());
    renderer.dispose();
  };
}
