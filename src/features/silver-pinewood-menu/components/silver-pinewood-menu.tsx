"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import {
  heroHeading,
  logoLabel,
  menuItems,
} from "@/features/silver-pinewood-menu/data/content";
import { initMenuScene } from "@/features/silver-pinewood-menu/lib/init-menu-scene";

export default function SilverPinewoodMenu() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const togglerTextRef = useRef<HTMLParagraphElement>(null);

  const isMenuOpenRef = useRef(false);
  const isAnimatingRef = useRef(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    return initMenuScene(canvas);
  }, []);

  const handleToggle = () => {
    const overlay = overlayRef.current;
    const togglerText = togglerTextRef.current;
    if (!overlay || !togglerText) return;
    if (isAnimatingRef.current) return;

    isMenuOpenRef.current = !isMenuOpenRef.current;
    isAnimatingRef.current = true;

    if (isMenuOpenRef.current) {
      gsap.to(overlay, {
        opacity: 1,
        duration: 0.5,
        ease: "power3.out",
        onStart: () => {
          overlay.style.pointerEvents = "all";
        },
        onComplete: () => {
          isAnimatingRef.current = false;
        },
      });
      togglerText.textContent = "Close";
    } else {
      gsap.to(overlay, {
        opacity: 0,
        duration: 0.5,
        ease: "power3.out",
        onComplete: () => {
          overlay.style.pointerEvents = "none";
          isAnimatingRef.current = false;
        },
      });
      togglerText.textContent = "Menu";
    }
  };

  const handleItemEnter = (event: React.MouseEvent<HTMLAnchorElement>) => {
    gsap.to(event.currentTarget, {
      backgroundSize: "100% 100%",
      duration: 0.75,
      ease: "power2.out",
      overwrite: true,
    });
  };

  const handleItemLeave = (event: React.MouseEvent<HTMLAnchorElement>) => {
    gsap.to(event.currentTarget, {
      backgroundSize: "0% 100%",
      duration: 0.25,
      ease: "power2.out",
      overwrite: true,
    });
  };

  return (
    <div className="spm-page">
      <nav className="spm-nav">
        <div className="spm-logo">
          <a href="#">{logoLabel}</a>
        </div>
        <div className="spm-menu-toggler" onClick={handleToggle}>
          <p ref={togglerTextRef}>Menu</p>
        </div>
      </nav>

      <div ref={overlayRef} className="spm-menu-overlay">
        <canvas ref={canvasRef}></canvas>

        <div className="spm-menu-links">
          {menuItems.map((item) => (
            <div key={item.label} className="spm-menu-item">
              <a
                href={item.href}
                onMouseEnter={handleItemEnter}
                onMouseLeave={handleItemLeave}
              >
                {item.label}
              </a>
            </div>
          ))}
        </div>
      </div>

      <section className="spm-hero">
        <h1>{heroHeading}</h1>
      </section>
    </div>
  );
}
