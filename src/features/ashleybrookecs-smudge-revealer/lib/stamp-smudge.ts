import gsap from "gsap";
import { CONFIG } from "@/features/ashleybrookecs-smudge-revealer/data/config";

export function stampSmudgeAt(
  container: SVGGElement,
  x: number,
  y: number,
  radius: number
) {
  const circle = document.createElementNS("http://www.w3.org/2000/svg", "circle");

  circle.setAttribute("cx", String(x));
  circle.setAttribute("cy", String(y));
  circle.setAttribute("r", String(radius));
  circle.setAttribute("fill", "#fff");

  container.prepend(circle);

  const animatedRadius = { current: radius };

  const timeline = gsap.timeline({
    onUpdate() {
      circle.setAttribute("r", String(Math.max(0, animatedRadius.current)));
    },
    onComplete() {
      timeline.kill();
      circle.remove();
    },
  });

  timeline.to(animatedRadius, {
    current: radius * CONFIG.expandMultiplier,
    duration: CONFIG.expandTime,
    ease: CONFIG.expandEase,
  });

  timeline.to(
    animatedRadius,
    {
      current: 0,
      duration: CONFIG.dissolveTime,
      ease: CONFIG.dissolveEase,
    },
    CONFIG.dissolveStart
  );
}
