export type Service = {
  title: string;
  tags: string[];
  images: [string, string, string];
};

export const services: Service[] = [
  {
    title: "Brand Strategy",
    tags: ["Identity", "Positioning", "Voice", "Research"],
    images: ["/images/img1.jpg", "/images/img2.jpg", "/images/img3.jpg"],
  },
  {
    title: "Visual Design",
    tags: ["UI", "Motion", "Typography", "Systems"],
    images: ["/images/img4.jpg", "/images/img5.jpg", "/images/img6.jpg"],
  },
  {
    title: "Digital Experience",
    tags: ["Web", "Product", "Interaction", "Launch"],
    images: ["/images/img7.jpg", "/images/img8.jpg", "/images/img9.jpg"],
  },
];
