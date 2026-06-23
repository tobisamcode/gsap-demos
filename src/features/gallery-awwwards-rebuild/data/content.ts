const imageBase = "/images/gallery-awwwards-rebuild";

export interface GalleryBlock {
  image: string;
  position: {
    top?: string;
    left?: string;
    bottom?: string;
    right?: string;
  };
}

export const blocks: GalleryBlock[] = [
  { image: `${imageBase}/1.jpeg`, position: { top: "0", left: "10%" } },
  { image: `${imageBase}/2.jpeg`, position: { top: "5%", left: "0%" } },
  { image: `${imageBase}/3.jpeg`, position: { top: "25%", left: "15%" } },
  { image: `${imageBase}/4.jpeg`, position: { top: "50%", left: "10%" } },
  { image: `${imageBase}/5.jpeg`, position: { top: "8%", left: "20%" } },
  { image: `${imageBase}/6.jpeg`, position: { top: "40%", left: "0%" } },
  { image: `${imageBase}/7.jpeg`, position: { top: "65%", left: "3%" } },
  { image: `${imageBase}/8.jpeg`, position: { top: "75%", left: "20%" } },
  { image: `${imageBase}/9.jpeg`, position: { top: "0", left: "35%" } },
  { image: `${imageBase}/10.jpeg`, position: { top: "25%", left: "40%" } },
  { image: `${imageBase}/11.jpeg`, position: { bottom: "0", right: "35%" } },
  { image: `${imageBase}/12.jpeg`, position: { bottom: "75%", right: "20%" } },
  { image: `${imageBase}/13.jpeg`, position: { bottom: "65%", right: "3%" } },
  { image: `${imageBase}/14.jpeg`, position: { bottom: "35%", right: "45%" } },
  { image: `${imageBase}/15.jpeg`, position: { bottom: "40%", right: "0%" } },
  { image: `${imageBase}/16.jpeg`, position: { bottom: "8%", right: "20%" } },
  { image: `${imageBase}/17.jpeg`, position: { bottom: "50%", right: "5%" } },
  { image: `${imageBase}/18.jpeg`, position: { bottom: "25%", right: "15%" } },
  { image: `${imageBase}/19.jpeg`, position: { bottom: "5%", right: "3%" } },
  { image: `${imageBase}/20.jpeg`, position: { bottom: "0", right: "10%" } },
  { image: `${imageBase}/21.jpeg`, position: { top: "2%", left: "50%" } },
  { image: `${imageBase}/22.jpeg`, position: { top: "35%", left: "63%" } },
  { image: `${imageBase}/23.jpeg`, position: { top: "45%", left: "25%" } },
  { image: `${imageBase}/24.jpeg`, position: { top: "60%", left: "27%" } },
  { image: `${imageBase}/25.jpeg`, position: { top: "12%", left: "70%" } },
  { image: `${imageBase}/26.jpeg`, position: { bottom: "12%", right: "70%" } },
];
