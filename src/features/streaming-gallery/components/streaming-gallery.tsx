"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import {
  heroLines,
  images,
  introText,
} from "@/features/streaming-gallery/data/content";

export default function StreamingGallery() {
  const galleryRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const scope = galleryRef.current;
    if (!scope) return;

    const ctx = gsap.context(() => {
      const items = gsap.utils.toArray<HTMLElement>(".sg-floating-image");
      const timelines: gsap.core.Timeline[] = [];

      const BASE_DURATION = 4;
      const entranceDuration = BASE_DURATION * 0.16;
      const exitDuration = BASE_DURATION * -0.2;
      const exitStartTime = BASE_DURATION - exitDuration;

      items.forEach((item) => {
        const startDelay = parseFloat(item.dataset.delay || "") || 0;

        const tl = gsap.timeline({
          repeat: -1,
          delay: startDelay,
        });

        tl.fromTo(
          item,
          { y: "0%" },
          { y: "-125vh", duration: BASE_DURATION, ease: "linear" },
          0
        );

        tl.fromTo(
          item,
          { scale: 0.4, opacity: 0 },
          {
            scale: 1,
            opacity: 1,
            duration: entranceDuration,
            ease: "power1.out",
          },
          0
        );

        tl.to(
          item,
          { scale: 0.4, opacity: 0, duration: exitDuration, ease: "power1.out" },
          exitStartTime
        );

        timelines.push(tl);
      });

      let lastScrollY = window.scrollY;

      const handleScroll = () => {
        const currentScrollY = window.scrollY;

        if (currentScrollY > lastScrollY) {
          timelines.forEach((tl) =>
            gsap.to(tl, { timeScale: 1, duration: 0.4, ease: "power1.out" })
          );
        } else if (currentScrollY < lastScrollY) {
          timelines.forEach((tl) =>
            gsap.to(tl, { timeScale: -1, duration: 0.4, ease: "power1.out" })
          );
        }
        lastScrollY = currentScrollY;
      };

      window.addEventListener("scroll", handleScroll, { passive: true });

      return () => {
        window.removeEventListener("scroll", handleScroll);
      };
    }, scope);

    return () => ctx.revert();
  }, []);

  return (
    <div className="sg-page">
      <div className="sg-section">{introText}</div>

      <section ref={galleryRef} className="sg-gallery">
        <div className="sg-images">
          {images.map((item, index) => (
            <div
              key={index}
              className="sg-floating-image"
              data-delay={item.delay}
              style={{
                left: item.left,
                top: "100%",
                width: `${item.size}px`,
                height: `${item.size}px`,
              }}
            >
              <img src={item.image} alt="" />
            </div>
          ))}
        </div>

        <div className="sg-hero">
          <h1>
            {heroLines.map((line, index) => (
              <span key={index}>
                {line}
                {index < heroLines.length - 1 && <br />}
              </span>
            ))}
          </h1>
        </div>
      </section>

      <div className="sg-section" style={{ color: "transparent" }} />
    </div>
  );
}
