export interface Card {
  image: string;
}

export const cards: Card[] = [
  { image: "/images/spencergabor-magnetic-cards/card-img-1.jpg" },
  { image: "/images/spencergabor-magnetic-cards/card-img-2.jpg" },
  { image: "/images/spencergabor-magnetic-cards/card-img-3.jpg" },
  { image: "/images/spencergabor-magnetic-cards/card-img-4.jpg" },
];

export const cardLayout = {
  rotation: [5, -5, 7.5, -10],
  x: [-275, -100, 100, 275],
  y: [10, -10, 25, -10],
};
