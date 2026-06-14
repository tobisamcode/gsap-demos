export const PROXIMITY_RADIUS = 500;
export const PUSH_FORCE = 10;
export const TILT_AMOUNT = 0.1;
export const NEIGHBOR_INFLUENCE = 0.2;
export const SPRING_STIFFNESS = 0.05;
export const BOUNCE_FRICTION = 0.85;
export const CURSOR_SMOOTHING = 0.75;

export interface CardPhysics {
  el: HTMLDivElement;
  restX: number;
  restY: number;
  restR: number;
  x: number;
  y: number;
  r: number;
  vx: number;
  vy: number;
  vr: number;
}

export interface PushForce {
  fx: number;
  fy: number;
}

export function calculatePushForce(
  card: CardPhysics,
  cursor: { x: number; y: number; vx: number; vy: number },
  containerRect: DOMRect
): PushForce {
  const speed = Math.sqrt(cursor.vx ** 2 + cursor.vy ** 2);
  if (speed < 0.5) return { fx: 0, fy: 0 };

  const cx = containerRect.left + containerRect.width / 2 + card.restX;
  const cy = containerRect.top + containerRect.height / 2 + card.restY;
  const dist = Math.sqrt((cursor.x - cx) ** 2 + (cursor.y - cy) ** 2);

  if (dist > PROXIMITY_RADIUS) return { fx: 0, fy: 0 };

  const weight = (1 - dist / PROXIMITY_RADIUS) ** 3;

  return {
    fx: cursor.vx * PUSH_FORCE * weight,
    fy: cursor.vy * PUSH_FORCE * weight,
  };
}

export function applyNeighborInfluence(
  forces: PushForce[],
  index: number
): PushForce {
  let fx = forces[index].fx;
  let fy = forces[index].fy;

  forces.forEach((f, j) => {
    if (j === index) return;
    const falloff = NEIGHBOR_INFLUENCE ** Math.abs(j - index);
    fx += f.fx * falloff;
    fy += f.fy * falloff * 0.6;
  });

  return { fx, fy };
}
