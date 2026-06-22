"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { heroTitle, images } from "@/features/hero-gallery/data/content";

export default function HeroGallery() {
  const containerRef = useRef<HTMLElement>(null);
  const galleryRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    const gallery = galleryRef.current;
    if (!container || !gallery) return;

    const cards = gsap.utils.toArray<HTMLElement>(
      container.querySelectorAll(".hg-card"),
    );

    const handleMouseMove = (e: MouseEvent) => {
      const { innerWidth, innerHeight } = window;

      const mouseX = e.clientX;
      const mouseY = e.clientY;

      const galleryX = gsap.utils.mapRange(0, innerWidth, 350, -350, mouseX);
      const galleryY = gsap.utils.mapRange(0, innerHeight, 330, -330, mouseY);

      gsap.to(gallery, {
        x: galleryX,
        y: galleryY,
        duration: 1.2,
        ease: "power2.out",
      });

      const normalizedX = gsap.utils.mapRange(0, innerWidth, -1, 1, mouseX);
      const compressionAmount = Math.abs(normalizedX) * 300;
      const viewportCenter = innerWidth / 2;

      cards.forEach((card) => {
        const rect = card.getBoundingClientRect();

        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;

        const dx = centerX - mouseX;
        const dy = centerY - mouseY;

        const distance = Math.sqrt(dx * dx + dy * dy);
        const radius = 350;

        const distanceFromCenter = centerX - viewportCenter;
        const compressionX =
          -(distanceFromCenter / viewportCenter) * compressionAmount;

        if (distance < radius) {
          const force = (radius - distance) / radius;

          gsap.to(card, {
            x: compressionX + dx * force * 0.35,
            y: dy * force * 0.35,
            rotation: dx * force * 0.02,
            duration: 0.8,
            ease: "power3.out",
          });
        } else {
          gsap.to(card, {
            x: compressionX,
            y: 0,
            rotation: 0,
            duration: 1,
            ease: "power3.out",
          });
        }
      });
    };

    window.addEventListener("mousemove", handleMouseMove);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      gsap.killTweensOf(cards);
      gsap.killTweensOf(gallery);
    };
  }, []);

  return (
    <section ref={containerRef} className="hg-page">
      <h1 className="hg-title">{heroTitle}</h1>

      <div ref={galleryRef} className="hg-gallery">
        {images.map((item, index) => (
          <div
            key={index}
            className="hg-card"
            style={{
              top: item.top,
              left: item.left,
              width: `${item.width}px`,
              height: `${item.height}px`,
            }}
          >
            <img src={item.image} alt="" />
          </div>
        ))}
      </div>
    </section>
  );
}
