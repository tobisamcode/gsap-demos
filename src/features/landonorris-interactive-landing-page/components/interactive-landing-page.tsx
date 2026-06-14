"use client";

import { useEffect, useRef } from "react";
import {
  portfolio,
  siteName,
  tagline,
} from "@/features/landonorris-interactive-landing-page/data/content";
import { initFluidPortrait } from "@/features/landonorris-interactive-landing-page/lib/init-fluid-portrait";

export default function InteractiveLandingPage() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    return initFluidPortrait(canvas);
  }, []);

  return (
    <>
      <nav className="landonorris-nav">
        <div className="landonorris-site-name">
          <a href="#">{siteName}</a>
        </div>
        <div className="landonorris-menu">
          <p>Menu</p>
        </div>
      </nav>

      <section className="landonorris-hero">
        <canvas ref={canvasRef} />

        <div className="landonorris-hero-footer">
          <p>{tagline}</p>
          <p>{portfolio}</p>
        </div>
      </section>
    </>
  );
}
