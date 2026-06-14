"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ScrollSmoother } from "gsap/ScrollSmoother";
import { Flip } from "gsap/Flip";
import {
  DARK_COLOR,
  LIGHT_COLOR,
  heroText,
  horizontalSlides,
  marqueeImages,
  outroText,
} from "@/features/wonjyou-horizontal-scroll/data/content";

gsap.registerPlugin(ScrollTrigger, ScrollSmoother, Flip);

export default function HorizontalScroll() {
  const containerRef = useRef<HTMLDivElement>(null);
  const marqueeRef = useRef<HTMLElement>(null);
  const marqueeImagesRef = useRef<HTMLDivElement>(null);
  const horizontalScrollRef = useRef<HTMLElement>(null);
  const horizontalWrapperRef = useRef<HTMLDivElement>(null);
  const pinnedImgRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    const marquee = marqueeRef.current;
    const marqueeImagesEl = marqueeImagesRef.current;
    const horizontalScroll = horizontalScrollRef.current;
    const horizontalWrapper = horizontalWrapperRef.current;
    const pinnedImg = pinnedImgRef.current;

    if (
      !container ||
      !marquee ||
      !marqueeImagesEl ||
      !horizontalScroll ||
      !horizontalWrapper ||
      !pinnedImg
    ) {
      return;
    }

    let pinnedMarqueeImgClone: HTMLImageElement | null = null;
    let isImgCloneActive = false;
    let flipAnimation: gsap.core.Animation | null = null;

    const triggers: ScrollTrigger[] = [];

    const createPinnedMarqueeImgClone = () => {
      if (isImgCloneActive) return;

      const rect = pinnedImg.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;

      pinnedMarqueeImgClone = pinnedImg.cloneNode(true) as HTMLImageElement;

      gsap.set(pinnedMarqueeImgClone, {
        position: "fixed",
        left: centerX - pinnedImg.offsetWidth / 2,
        top: centerY - pinnedImg.offsetHeight / 2,
        width: pinnedImg.offsetWidth,
        height: pinnedImg.offsetHeight,
        transform: "rotate(-5deg)",
        transformOrigin: "center center",
        pointerEvents: "none",
        willChange: "transform",
        zIndex: 100,
      });

      document.body.appendChild(pinnedMarqueeImgClone);
      gsap.set(pinnedImg, { opacity: 0 });
      isImgCloneActive = true;
    };

    const removePinnedMarqueeImgClone = () => {
      if (!isImgCloneActive) return;

      pinnedMarqueeImgClone?.remove();
      pinnedMarqueeImgClone = null;
      gsap.set(pinnedImg, { opacity: 1 });
      isImgCloneActive = false;
    };

    triggers.push(
      ScrollTrigger.create({
        trigger: marquee,
        start: "top bottom",
        end: "top top",
        scrub: true,
        onUpdate: (self) => {
          const xPosition = -75 + self.progress * 25;
          gsap.set(marqueeImagesEl, { x: `${xPosition}%` });
        },
      })
    );

    triggers.push(
      ScrollTrigger.create({
        trigger: horizontalScroll,
        start: "top top",
        end: () => `+=${window.innerHeight * 5}`,
        pin: true,
      })
    );

    triggers.push(
      ScrollTrigger.create({
        trigger: marquee,
        start: "top top",
        onEnter: createPinnedMarqueeImgClone,
        onEnterBack: createPinnedMarqueeImgClone,
        onLeaveBack: removePinnedMarqueeImgClone,
      })
    );

    triggers.push(
      ScrollTrigger.create({
        trigger: horizontalScroll,
        start: "top 50%",
        end: () => `+=${window.innerHeight * 5.5}`,
        onEnter: () => {
          if (pinnedMarqueeImgClone && isImgCloneActive && !flipAnimation) {
            const state = Flip.getState(pinnedMarqueeImgClone);

            gsap.set(pinnedMarqueeImgClone, {
              position: "fixed",
              left: 0,
              top: 0,
              width: "100%",
              height: "100svh",
              transform: "rotate(0deg)",
              transformOrigin: "center center",
            });

            flipAnimation = Flip.from(state, {
              duration: 1,
              ease: "none",
              paused: true,
            });
          }
        },
        onLeaveBack: () => {
          flipAnimation?.kill();
          flipAnimation = null;
          gsap.set(container, { backgroundColor: LIGHT_COLOR });
          gsap.set(horizontalWrapper, { x: "0%" });
        },
      })
    );

    triggers.push(
      ScrollTrigger.create({
        trigger: horizontalScroll,
        start: "top 50%",
        end: () => `+=${window.innerHeight * 5.5}`,
        onUpdate: (self) => {
          const progress = self.progress;

          if (progress <= 0.05) {
            const bgColorProgress = Math.min(progress / 0.05, 1);
            gsap.set(container, {
              backgroundColor: gsap.utils.interpolate(
                LIGHT_COLOR,
                DARK_COLOR,
                bgColorProgress
              ),
            });
          } else {
            gsap.set(container, { backgroundColor: DARK_COLOR });
          }

          if (progress <= 0.2) {
            flipAnimation?.progress(progress / 0.2);
          }

          if (progress > 0.2 && progress <= 0.95) {
            flipAnimation?.progress(1);

            const horizontalProgress = (progress - 0.2) / 0.75;
            const wrapperTranslateX = -66.67 * horizontalProgress;

            gsap.set(horizontalWrapper, { x: `${wrapperTranslateX}%` });

            const slideMovement = (66.67 / 100) * 3 * horizontalProgress;
            const imageTranslateX = -slideMovement * 100;

            if (pinnedMarqueeImgClone) {
              gsap.set(pinnedMarqueeImgClone, { x: `${imageTranslateX}%` });
            }
          } else if (progress > 0.95) {
            flipAnimation?.progress(1);

            if (pinnedMarqueeImgClone) {
              gsap.set(pinnedMarqueeImgClone, { x: "-200%" });
            }

            gsap.set(horizontalWrapper, { x: "-66.67%" });
          }
        },
      })
    );

    ScrollTrigger.refresh();

    return () => {
      flipAnimation?.kill();
      removePinnedMarqueeImgClone();
      triggers.forEach((trigger) => trigger.kill());
    };
  }, []);

  return (
    <div className="wonjyou-container" ref={containerRef}>
      <section className="wonjyou-hero">
        <h1>{heroText}</h1>
      </section>

      <section className="wonjyou-marquee" ref={marqueeRef}>
        <div className="wonjyou-marquee-wrapper">
          <div className="wonjyou-marquee-images" ref={marqueeImagesRef}>
            {marqueeImages.map((image) => (
              <div
                key={image.src}
                className={`wonjyou-marquee-img${image.pin ? " wonjyou-marquee-img-pin" : ""}`}
              >
                <img
                  ref={image.pin ? pinnedImgRef : undefined}
                  src={image.src}
                  alt={image.alt}
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="wonjyou-horizontal-scroll" ref={horizontalScrollRef}>
        <div
          className="wonjyou-horizontal-scroll-wrapper"
          ref={horizontalWrapperRef}
        >
          <div className="wonjyou-horizontal-slide wonjyou-horizontal-spacer" />

          {horizontalSlides.map((slide) => (
            <div key={slide.image} className="wonjyou-horizontal-slide">
              <div className="wonjyou-col">
                <h3>{slide.text}</h3>
              </div>
              <div className="wonjyou-col">
                <img src={slide.image} alt={slide.alt} />
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="wonjyou-outro">
        <h1>{outroText}</h1>
      </section>
    </div>
  );
}
