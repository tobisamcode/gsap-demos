"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ScrollSmoother } from "gsap/ScrollSmoother";
import { stickyCards } from "@/features/sticky-cards/data/cards";

gsap.registerPlugin(ScrollTrigger, ScrollSmoother);

export default function StickyCards() {
  const containerRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const container = containerRef.current;
    const cards = cardRefs.current.filter(Boolean) as HTMLDivElement[];

    if (!container || cards.length === 0) return;

    const triggers: ScrollTrigger[] = [];

    cards.forEach((card, index) => {
      if (index < cards.length - 1) {
        triggers.push(
          ScrollTrigger.create({
            trigger: card,
            start: "top top",
            endTrigger: cards[cards.length - 1],
            end: "top top",
            pin: true,
            pinSpacing: false,
          })
        );
      }

      if (index < cards.length - 1) {
        triggers.push(
          ScrollTrigger.create({
            trigger: cards[index + 1],
            start: "top bottom",
            end: "top top",
            onUpdate: (self) => {
              const progress = self.progress;
              gsap.set(card, {
                scale: 1 - progress * 0.25,
                rotation: (index % 2 === 0 ? 5 : -5) * progress,
                "--after-opacity": progress,
              });
            },
          })
        );
      }
    });

    ScrollTrigger.refresh();

    return () => {
      triggers.forEach((trigger) => trigger.kill());
    };
  }, []);

  return (
    <div className="sticky-cards" ref={containerRef}>
      {stickyCards.map((card, index) => (
        <div
          key={card.index}
          className="sticky-card"
          ref={(el) => {
            cardRefs.current[index] = el;
          }}
        >
          <div className="sticky-card-index">
            <h1>{card.index}</h1>
          </div>
          <div className="sticky-card-content">
            <div className="sticky-card-content-wrapper">
              <h1 className="sticky-card-header">{card.title}</h1>

              <div className="sticky-card-img">
                <img src={card.image} alt={card.title} />
              </div>

              <div className="sticky-card-copy">
                <div className="sticky-card-copy-title">
                  <p>(About the state)</p>
                </div>
                <div className="sticky-card-copy-description">
                  <p>{card.description}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
