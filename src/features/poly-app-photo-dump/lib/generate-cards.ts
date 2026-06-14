import { CONFIG } from "@/features/poly-app-photo-dump/data/config";
import type { Viewport } from "@/features/poly-app-photo-dump/lib/viewport";

export type CardStatus = "active" | "entering" | "exiting";

export interface GalleryCard {
  id: string;
  image: string;
  centerX: number;
  centerY: number;
  status: CardStatus;
}

export function generateCards(
  setNumber: number,
  viewport: Viewport
): GalleryCard[] {
  return Array.from({ length: CONFIG.cardCount }, (_, i) => {
    const angle = Math.random() * Math.PI * 2;
    const radius =
      viewport.rangeMin +
      Math.random() * (viewport.rangeMax - viewport.rangeMin);
    const centerX = viewport.centerX + Math.cos(angle) * radius;
    const centerY = viewport.centerY + Math.sin(angle) * radius;

    return {
      id: `set${setNumber}-img${i + 1}-${crypto.randomUUID()}`,
      image: `/images/poly-app-photo-dump/set${setNumber}/img${i + 1}.jpg`,
      centerX,
      centerY,
      status: "active" as const,
    };
  });
}
