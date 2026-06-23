"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { blocks } from "@/features/gallery-awwwards-rebuild/data/content";

const RADIUS = 300;
const MAX_SCALE = 3;

export default function GalleryAwwwardsRebuild() {
  const galleryRef = useRef<HTMLDivElement>(null);
  const blockRefs = useRef<HTMLDivElement[]>([]);

  useEffect(() => {
    const gallery = galleryRef.current;
    if (!gallery) return;

    const radius2 = RADIUS * RADIUS;

    interface BlockEntry {
      el: HTMLDivElement;
      cx: number;
      cy: number;
      tween: gsap.core.Tween;
    }

    let entries: BlockEntry[] = [];

    const buildEntries = () => {
      entries.forEach((entry) => entry.tween.kill());
      entries = blockRefs.current.filter(Boolean).map((el) => {
        gsap.set(el, { scale: 1 });
        const rect = el.getBoundingClientRect();
        return {
          el,
          cx: rect.left + rect.width / 2 + window.scrollX,
          cy: rect.top + rect.height / 2 + window.scrollY,
          tween: gsap
            .to(el, { scale: MAX_SCALE, ease: "power1.in", paused: true })
            .progress(1)
            .progress(0),
        };
      });
    };

    // Measure block centers from their resting (untransformed) layout.
    gsap.set(gallery, { x: 0, y: 0 });
    buildEntries();

    const handleMouseMove = (e: MouseEvent) => {
      const xDecimal = e.clientX / window.innerWidth;
      const yDecimal = e.clientY / window.innerHeight;

      const maxX = gallery.offsetWidth - window.innerWidth;
      const maxY = gallery.offsetHeight - window.innerHeight;

      gsap.to(gallery, {
        x: maxX * xDecimal * -1,
        y: maxY * yDecimal * -1,
        duration: 4,
        ease: "power2.out",
        overwrite: true,
      });

      entries.forEach((entry) => {
        const dx = (entry.cx - e.pageX) ** 2;
        const dy = (entry.cy - e.pageY) ** 2;
        entry.tween.progress(1 - (dx + dy) / radius2);
      });
    };

    const handleResize = () => buildEntries();

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("resize", handleResize);
      entries.forEach((entry) => entry.tween.kill());
      gsap.killTweensOf(gallery);
    };
  }, []);

  return (
    <div className="gar-page">
      <div ref={galleryRef} className="gar-gallery">
        {blocks.map((block, index) => (
          <div
            key={index}
            ref={(el) => {
              if (el) blockRefs.current[index] = el;
            }}
            className="gar-block"
            style={{
              ...block.position,
              backgroundImage: `url(${block.image})`,
            }}
          />
        ))}
      </div>
    </div>
  );
}
