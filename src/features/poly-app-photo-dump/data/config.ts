export const CONFIG = {
  cardCount: 15,
  cardWidth: 250,
  cardHeight: 300,
  animationDuration: 0.75,
  animationOverlap: 0.5,
  headingFadeDuration: 0.5,
  headings: [
    "Order is temporary while you're passing through",
    "Memories shuffle like cards in an endless deck",
    "Each moment scatters as another takes its place",
    "The fragments float before settling once more",
  ],
} as const;

export function getSectionIndex(progress: number) {
  if (progress < 0.25) return 0;
  if (progress < 0.5) return 1;
  if (progress < 0.75) return 2;
  return 3;
}
