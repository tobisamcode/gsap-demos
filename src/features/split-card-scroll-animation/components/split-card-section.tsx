"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ScrollSmoother } from "gsap/ScrollSmoother";
import { cards } from "@/features/split-card-scroll-animation/data/cards";

gsap.registerPlugin(ScrollTrigger, ScrollSmoother);

export default function SplitCardSection() {
  const stickyRef = useRef<HTMLElement>(null);
  const stickyHeaderRef = useRef<HTMLHeadingElement>(null);
  const cardContainerRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<HTMLDivElement[]>([]);

  const isGapAnimationCompletedRef = useRef(false);
  const isFlipAnimationCompletedRef = useRef(false);

  useEffect(() => {
    const sticky = stickyRef.current!;
    const stickyHeader = stickyHeaderRef.current!;
    const cardContainer = cardContainerRef.current!;
    const cardElements = cardRefs.current.filter(Boolean);

    const resetStyles = () => {
      [stickyHeader, cardContainer, ...cardElements].forEach((el) => {
        el.style.cssText = "";
      });
      isGapAnimationCompletedRef.current = false;
      isFlipAnimationCompletedRef.current = false;
    };

    const mm = gsap.matchMedia();

    mm.add("(max-width: 999px)", () => {
      resetStyles();
      return () => {};
    });

    mm.add("(min-width: 1000px)", () => {
      const trigger = ScrollTrigger.create({
        trigger: sticky,
        start: "top top",
        end: () => `+=${window.innerHeight * 4}px`,
        scrub: 1,
        pin: true,
        pinSpacing: true,
        onUpdate: (self) => {
          const progress = self.progress;
          const card1 = cardRefs.current[0];
          const card2 = cardRefs.current[1];
          const card3 = cardRefs.current[2];

          if (progress >= 0.1 && progress <= 0.25) {
            const headerProgress = gsap.utils.mapRange(
              0.1,
              0.25,
              0,
              1,
              progress
            );
            gsap.set(stickyHeader, {
              y: gsap.utils.mapRange(0, 1, 40, 0, headerProgress),
              opacity: gsap.utils.mapRange(0, 1, 0, 1, headerProgress),
            });
          } else if (progress < 0.1) {
            gsap.set(stickyHeader, { y: 40, opacity: 0 });
          } else if (progress > 0.25) {
            gsap.set(stickyHeader, { y: 0, opacity: 1 });
          }

          if (progress <= 0.25) {
            gsap.set(cardContainer, {
              width: `${gsap.utils.mapRange(0, 0.25, 75, 60, progress)}%`,
            });
          } else {
            gsap.set(cardContainer, { width: "60%" });
          }

          if (progress >= 0.35 && !isGapAnimationCompletedRef.current) {
            gsap.to(cardContainer, {
              gap: "20px",
              duration: 0.5,
              ease: "power3.out",
            });
            gsap.to(cardElements, {
              borderRadius: "20px",
              duration: 0.5,
              ease: "power3.out",
            });
            isGapAnimationCompletedRef.current = true;
          } else if (progress < 0.35 && isGapAnimationCompletedRef.current) {
            gsap.to(cardContainer, {
              gap: "0px",
              duration: 0.5,
              ease: "power3.out",
            });
            if (card1) {
              gsap.to(card1, {
                borderRadius: "20px 0 0 20px",
                duration: 0.5,
                ease: "power3.out",
              });
            }
            if (card2) {
              gsap.to(card2, {
                borderRadius: "0px",
                duration: 0.5,
                ease: "power3.out",
              });
            }
            if (card3) {
              gsap.to(card3, {
                borderRadius: "0 20px 20px 0",
                duration: 0.5,
                ease: "power3.out",
              });
            }
            isGapAnimationCompletedRef.current = false;
          }

          if (progress >= 0.7 && !isFlipAnimationCompletedRef.current) {
            gsap.to(cardElements, {
              rotationY: 180,
              duration: 0.75,
              ease: "power3.inOut",
              stagger: 0.1,
            });
            gsap.to([card1, card3].filter(Boolean), {
              y: 30,
              rotationZ: (i) => [-15, 15][i],
              duration: 0.75,
              ease: "power3.inOut",
            });
            isFlipAnimationCompletedRef.current = true;
          } else if (progress < 0.7 && isFlipAnimationCompletedRef.current) {
            gsap.to(cardElements, {
              rotationY: 0,
              duration: 0.75,
              ease: "power3.inOut",
              stagger: -0.1,
            });
            gsap.to([card1, card3].filter(Boolean), {
              y: 0,
              rotationZ: 0,
              duration: 0.75,
              ease: "power3.inOut",
            });
            isFlipAnimationCompletedRef.current = false;
          }
        },
      });

      return () => {
        trigger.kill();
      };
    });

    return () => {
      mm.revert();
    };
  }, []);

  return (
    <section className="split-card-sticky" ref={stickyRef}>
      <div className="split-card-sticky-header">
        <h1 ref={stickyHeaderRef}>Three pillars with one purpose</h1>
      </div>

      <div className="split-card-container" ref={cardContainerRef}>
        {cards.map((card, i) => (
          <div
            className="split-card"
            key={card.id}
            id={card.id}
            style={{ borderRadius: card.initialBorderRadius }}
            ref={(el) => {
              if (el) cardRefs.current[i] = el;
            }}
          >
            <div className="split-card-front">
              <img src={card.image} alt="" />
            </div>
            <div className={`split-card-back ${card.backClass}`}>
              <span>( {card.number} )</span>
              <p>{card.label}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
