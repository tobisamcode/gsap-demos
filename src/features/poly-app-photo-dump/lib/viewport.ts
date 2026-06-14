export interface Viewport {
  centerX: number;
  centerY: number;
  rangeMin: number;
  rangeMax: number;
}

export function getViewport(): Viewport {
  const centerX = window.innerWidth / 2;
  const centerY = window.innerHeight / 2;
  const rangeMin = Math.min(window.innerWidth, window.innerHeight) * 0.35;
  const rangeMax = Math.min(window.innerWidth, window.innerHeight) * 0.7;

  return { centerX, centerY, rangeMin, rangeMax };
}

export function getEdgePosition(
  centerX: number,
  centerY: number,
  cardWidth: number,
  cardHeight: number
) {
  const distances = {
    left: centerX,
    right: window.innerWidth - centerX,
    top: centerY,
    bottom: window.innerHeight - centerY,
  };

  const minDistance = Math.min(...Object.values(distances));
  const cardCenterOffsetX = cardWidth / 2;
  const cardCenterOffsetY = cardHeight / 2;
  const offsetVariation = () => (Math.random() - 0.5) * 400;

  if (minDistance === distances.left) {
    return {
      x: -300 - Math.random() * 200,
      y: centerY - cardCenterOffsetY + offsetVariation(),
    };
  }
  if (minDistance === distances.right) {
    return {
      x: window.innerWidth + 50 + Math.random() * 200,
      y: centerY - cardCenterOffsetY + offsetVariation(),
    };
  }
  if (minDistance === distances.top) {
    return {
      x: centerX - cardCenterOffsetX + offsetVariation(),
      y: -400 - Math.random() * 200,
    };
  }
  return {
    x: centerX - cardCenterOffsetX + offsetVariation(),
    y: window.innerHeight + 50 + Math.random() * 200,
  };
}
