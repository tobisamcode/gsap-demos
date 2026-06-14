"use client";

import { useEffect, useId, useRef } from "react";
import { CONFIG } from "@/features/ashleybrookecs-smudge-revealer/data/config";
import { stampSmudgeAt } from "@/features/ashleybrookecs-smudge-revealer/lib/stamp-smudge";

export default function SmudgeRevealer() {
  const heroRef = useRef<HTMLElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const blobsRef = useRef<SVGGElement>(null);

  const pointerRef = useRef({ x: 0, y: 0 });
  const smoothPointerRef = useRef({ x: 0, y: 0 });
  const hasStartedRef = useRef(false);

  const filterId = useId().replace(/:/g, "");
  const maskId = useId().replace(/:/g, "");

  const handlePointerMove = (x: number, y: number) => {
    if (!hasStartedRef.current) {
      pointerRef.current.x = smoothPointerRef.current.x = x;
      pointerRef.current.y = smoothPointerRef.current.y = y;
      hasStartedRef.current = true;
      return;
    }

    pointerRef.current.x = x;
    pointerRef.current.y = y;
  };

  useEffect(() => {
    const hero = heroRef.current!;
    const svg = svgRef.current!;
    const blobs = blobsRef.current!;

    const handleTouchStart = (e: TouchEvent) => {
      e.preventDefault();
      handlePointerMove(e.touches[0].pageX, e.touches[0].pageY);
    };

    const handleTouchMove = (e: TouchEvent) => {
      e.preventDefault();
      handlePointerMove(e.touches[0].pageX, e.touches[0].pageY);
    };

    const matchSVGToViewport = () => {
      svg.style.width = `${window.innerWidth}px`;
      svg.style.height = `${window.innerHeight}px`;
    };

    matchSVGToViewport();

    let rafId = requestAnimationFrame(function update() {
      if (hasStartedRef.current) {
        const pointer = pointerRef.current;
        const smooth = smoothPointerRef.current;

        smooth.x += (pointer.x - smooth.x) * CONFIG.smoothing;
        smooth.y += (pointer.y - smooth.y) * CONFIG.smoothing;

        const speed = Math.hypot(pointer.x - smooth.x, pointer.y - smooth.y);

        if (speed > CONFIG.movementThreshold) {
          stampSmudgeAt(
            blobs,
            smooth.x,
            smooth.y,
            speed * CONFIG.sizeFromSpeed,
          );
        }
      }

      rafId = requestAnimationFrame(update);
    });

    window.addEventListener("resize", matchSVGToViewport);
    hero.addEventListener("touchstart", handleTouchStart, { passive: false });
    hero.addEventListener("touchmove", handleTouchMove, { passive: false });

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener("resize", matchSVGToViewport);
      hero.removeEventListener("touchstart", handleTouchStart);
      hero.removeEventListener("touchmove", handleTouchMove);
    };
  }, []);

  return (
    <section
      className="smudge-revealer-hero"
      ref={heroRef}
      onMouseMove={(e) => handlePointerMove(e.pageX, e.pageY)}
    >
      <div className="smudge-revealer-foreground">
        <h1>Dig in</h1>
      </div>

      <div
        className="smudge-revealer-background"
        style={{
          mask: `url(#${maskId})`,
          WebkitMask: `url(#${maskId})`,
        }}
      >
        <h3>
          The things worth finding are never on the surface. They live in the
          parts you almost scrolled past.
        </h3>
      </div>

      <svg
        xmlns="http://www.w3.org/2000/svg"
        preserveAspectRatio="none"
        className="smudge-revealer-svg"
        ref={svgRef}
      >
        <defs>
          <filter id={filterId}>
            <feGaussianBlur in="SourceGraphic" stdDeviation="25" />
            <feColorMatrix
              type="matrix"
              values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 60 -14"
            />
          </filter>
        </defs>
        <mask id={maskId}>
          <g
            className="smudge-revealer-blobs"
            filter={`url(#${filterId})`}
            ref={blobsRef}
          />
        </mask>
      </svg>
    </section>
  );
}
