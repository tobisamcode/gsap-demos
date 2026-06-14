export interface SplitCard {
  id: string;
  image: string;
  number: string;
  label: string;
  backClass: string;
  initialBorderRadius: string;
}

export const cards: SplitCard[] = [
  {
    id: "card-1",
    image: "/images/split-card-scroll-animation/card_cover_1.jpg",
    number: "01",
    label: "Interactive Web Experiences",
    backClass: "split-card-back-1",
    initialBorderRadius: "20px 0 0 20px",
  },
  {
    id: "card-2",
    image: "/images/split-card-scroll-animation/card_cover_2.jpg",
    number: "02",
    label: "Thoughtful Design Language",
    backClass: "split-card-back-2",
    initialBorderRadius: "0px",
  },
  {
    id: "card-3",
    image: "/images/split-card-scroll-animation/card_cover_3.jpg",
    number: "03",
    label: "Visual Design Systems",
    backClass: "split-card-back-3",
    initialBorderRadius: "0 20px 20px 0",
  },
];
