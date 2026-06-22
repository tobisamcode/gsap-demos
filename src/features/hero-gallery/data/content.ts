const imageBase = "/images/hero-gallery";

export const heroTitle = "ANALOG";

export interface GalleryImage {
  image: string;
  top: string;
  left: string;
  width: number;
  height: number;
}

export const images: GalleryImage[] = [
  { image: `${imageBase}/img1.jpg`, top: "2%", left: "25%", width: 140, height: 180 },
  { image: `${imageBase}/img2.jpg`, top: "15%", left: "15%", width: 180, height: 180 },
  { image: `${imageBase}/img3.jpg`, top: "12%", left: "55%", width: 170, height: 230 },
  { image: `${imageBase}/img4.jpg`, top: "5%", left: "78%", width: 160, height: 210 },
  { image: `${imageBase}/img5.jpg`, top: "40%", left: "2%", width: 150, height: 190 },
  { image: `${imageBase}/img6.jpg`, top: "35%", left: "28%", width: 190, height: 250 },
  { image: `${imageBase}/img7.jpg`, top: "52%", left: "42%", width: 180, height: 240 },
  { image: `${imageBase}/img8.jpg`, top: "45%", left: "65%", width: 160, height: 200 },
  { image: `${imageBase}/img9.jpg`, top: "70%", left: "8%", width: 180, height: 230 },
  { image: `${imageBase}/img10.jpg`, top: "68%", left: "78%", width: 170, height: 220 },
  { image: `${imageBase}/img11.jpg`, top: "28%", left: "82%", width: 160, height: 210 },
  { image: `${imageBase}/img12.jpg`, top: "58%", left: "22%", width: 170, height: 170 },
];
