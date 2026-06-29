const imageBase = "/images/streaming-gallery";

export const introText = "SCROLL TO KNOW";

export const heroLines = ["A portfolio", "built for every", "step."];

export interface FloatingImage {
  image: string;
  left: string;
  size: number;
  delay: number;
}

export const images: FloatingImage[] = [
  { image: `${imageBase}/img1.jpg`, left: "4%", size: 100, delay: 0 },
  { image: `${imageBase}/img2.jpg`, left: "18%", size: 130, delay: -2.5 },
  { image: `${imageBase}/img3.jpg`, left: "22%", size: 110, delay: -5 },
  { image: `${imageBase}/img4.jpg`, left: "12%", size: 90, delay: -7.5 },

  { image: `${imageBase}/img5.jpg`, left: "32%", size: 140, delay: -1.2 },
  { image: `${imageBase}/img6.jpg`, left: "45%", size: 115, delay: -3.8 },
  { image: `${imageBase}/img7.jpg`, left: "55%", size: 125, delay: -6.2 },
  { image: `${imageBase}/img8.jpg`, left: "38%", size: 100, delay: -8.8 },

  { image: `${imageBase}/img9.jpg`, left: "68%", size: 135, delay: -2 },
  { image: `${imageBase}/img10.jpg`, left: "80%", size: 95, delay: -4.5 },
  { image: `${imageBase}/img11.jpg`, left: "92%", size: 120, delay: -7 },
  { image: `${imageBase}/img12.jpg`, left: "74%", size: 110, delay: -9.5 },
];
