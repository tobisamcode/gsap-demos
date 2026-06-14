import gsap from "gsap";
import { CONFIG } from "@/features/poly-app-photo-dump/data/config";
import type { GalleryCard } from "@/features/poly-app-photo-dump/lib/generate-cards";
import { getEdgePosition } from "@/features/poly-app-photo-dump/lib/viewport";

export function animateHeading(
  headingEl: HTMLHeadingElement,
  newText: string
) {
  return gsap
    .timeline()
    .to(headingEl, {
      opacity: 0,
      duration: CONFIG.headingFadeDuration,
      ease: "power2.inOut",
    })
    .call(() => {
      headingEl.textContent = newText;
    })
    .to(headingEl, {
      opacity: 1,
      duration: CONFIG.headingFadeDuration,
      ease: "power2.inOut",
    });
}

export function animateCards(
  exitingCards: GalleryCard[],
  enteringCards: GalleryCard[],
  getElement: (id: string) => HTMLDivElement | undefined
) {
  const tl = gsap.timeline();

  exitingCards.forEach((card) => {
    const element = getElement(card.id);
    if (!element) return;

    const targetEdge = getEdgePosition(
      card.centerX,
      card.centerY,
      CONFIG.cardWidth,
      CONFIG.cardHeight
    );

    tl.to(
      element,
      {
        left: targetEdge.x,
        top: targetEdge.y,
        rotation: Math.random() * 180 - 90,
        duration: CONFIG.animationDuration,
        ease: "power2.in",
      },
      0
    );
  });

  enteringCards.forEach((card) => {
    const element = getElement(card.id);
    if (!element) return;

    const targetEdge = getEdgePosition(
      card.centerX,
      card.centerY,
      CONFIG.cardWidth,
      CONFIG.cardHeight
    );

    gsap.set(element, {
      left: targetEdge.x,
      top: targetEdge.y,
      rotation: Math.random() * 180 - 90,
    });

    tl.to(
      element,
      {
        left: card.centerX - CONFIG.cardWidth / 2,
        top: card.centerY - CONFIG.cardHeight / 2,
        rotation: Math.random() * 50 - 25,
        duration: CONFIG.animationDuration,
        ease: "power2.out",
      },
      CONFIG.animationOverlap
    );
  });

  return tl;
}

export function setCardAtRest(card: GalleryCard, element: HTMLDivElement) {
  gsap.set(element, {
    left: card.centerX - CONFIG.cardWidth / 2,
    top: card.centerY - CONFIG.cardHeight / 2,
    rotation: Math.random() * 50 - 25,
  });
}
