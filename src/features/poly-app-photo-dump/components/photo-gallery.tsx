"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { CONFIG, getSectionIndex } from "@/features/poly-app-photo-dump/data/config";
import {
  animateCards,
  animateHeading,
  setCardAtRest,
} from "@/features/poly-app-photo-dump/lib/animations";
import {
  generateCards,
  type GalleryCard,
} from "@/features/poly-app-photo-dump/lib/generate-cards";
import { getViewport } from "@/features/poly-app-photo-dump/lib/viewport";

gsap.registerPlugin(ScrollTrigger);

interface PendingTransition {
  exitingCards: GalleryCard[];
  enteringCards: GalleryCard[];
  targetSection: number;
}

export default function PhotoGallery() {
  const galleryRef = useRef<HTMLElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const cardRefs = useRef<Map<string, HTMLDivElement>>(new Map());

  const [cards, setCards] = useState<GalleryCard[]>([]);
  const [heading, setHeading] = useState<string>(CONFIG.headings[0]);

  const currentSectionRef = useRef(0);
  const isAnimatingRef = useRef(false);
  const cardsRef = useRef(cards);
  cardsRef.current = cards;

  const scrollTriggerRef = useRef<ScrollTrigger | null>(null);
  const pendingTransitionRef = useRef<PendingTransition | null>(null);
  const pendingResizeRef = useRef(false);

  useEffect(() => {
    setCards(generateCards(1, getViewport()));
  }, []);

  useLayoutEffect(() => {
    if (!cards.length) return;

    const headingEl = headingRef.current!;

    if (pendingTransitionRef.current) {
      const { exitingCards, enteringCards, targetSection } =
        pendingTransitionRef.current;
      pendingTransitionRef.current = null;

      Promise.all([
        animateCards(exitingCards, enteringCards, (id) =>
          cardRefs.current.get(id)
        ),
        animateHeading(headingEl, CONFIG.headings[targetSection]),
      ]).then(() => {
        setCards(
          enteringCards.map((c) => ({ ...c, status: "active" as const }))
        );
        setHeading(CONFIG.headings[targetSection]);
        currentSectionRef.current = targetSection;
        isAnimatingRef.current = false;
      });

      return;
    }

    if (pendingResizeRef.current) {
      pendingResizeRef.current = false;
      cards.forEach((card) => {
        const el = cardRefs.current.get(card.id);
        if (el) setCardAtRest(card, el);
      });
      ScrollTrigger.refresh();
      return;
    }

    if (scrollTriggerRef.current) return;

    cards.forEach((card) => {
      const el = cardRefs.current.get(card.id);
      if (el) setCardAtRest(card, el);
    });
    gsap.set(headingEl, { opacity: 1 });

    scrollTriggerRef.current = ScrollTrigger.create({
      trigger: galleryRef.current!,
      start: "top top",
      end: () => `+=${window.innerHeight * 6}`,
      pin: true,
      pinSpacing: true,
      onUpdate: ({ progress }) => {
        if (isAnimatingRef.current) return;

        const targetSection = getSectionIndex(progress);
        if (targetSection === currentSectionRef.current) return;

        isAnimatingRef.current = true;
        const nextViewport = getViewport();
        const activeCards = cardsRef.current.filter((c) => c.status === "active");
        const exitingCards = activeCards.map((c) => ({
          ...c,
          status: "exiting" as const,
        }));
        const enteringCards = generateCards(targetSection + 1, nextViewport).map(
          (c) => ({ ...c, status: "entering" as const })
        );

        pendingTransitionRef.current = {
          exitingCards,
          enteringCards,
          targetSection,
        };
        setCards([...exitingCards, ...enteringCards]);
      },
    });
  }, [cards]);

  useEffect(() => {
    const handleResize = () => {
      pendingResizeRef.current = true;
      setCards(
        generateCards(currentSectionRef.current + 1, getViewport())
      );
    };

    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
      scrollTriggerRef.current?.kill();
      scrollTriggerRef.current = null;
    };
  }, []);

  return (
    <section className="photo-dump-gallery" ref={galleryRef}>
      <h1 ref={headingRef}>{heading}</h1>

      {cards.map((card) => (
        <div
          className="photo-dump-card"
          key={card.id}
          ref={(el) => {
            if (el) cardRefs.current.set(card.id, el);
            else cardRefs.current.delete(card.id);
          }}
        >
          <img src={card.image} alt="" />
        </div>
      ))}
    </section>
  );
}
