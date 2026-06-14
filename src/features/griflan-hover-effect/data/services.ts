export interface Service {
  name: string;
  tags: string[];
  images: string[];
}

export const services: Service[] = [
  {
    name: "Silhouette",
    tags: [
      "Editorial",
      "Fashion Identity",
      "Monochrome",
      "Shadow Play",
      "Minimalism",
      "Studio Portraits",
    ],
    images: [
      "/images/griflan/service_1_img_1.jpg",
      "/images/griflan/service_1_img_2.jpg",
      "/images/griflan/service_1_img_3.jpg",
    ],
  },
  {
    name: "Chroma",
    tags: [
      "Color Theory",
      "Graphics",
      "Poster Design",
      "Saturation",
      "Pop Art",
      "Visual Energy",
    ],
    images: [
      "/images/griflan/service_2_img_1.jpg",
      "/images/griflan/service_2_img_2.jpg",
      "/images/griflan/service_2_img_3.jpg",
    ],
  },
  {
    name: "Persona",
    tags: [
      "Character Design",
      "Portraits",
      "Visual Storytelling",
      "Emotion",
      "Identity",
      "Artistic Direction",
    ],
    images: [
      "/images/griflan/service_3_img_1.jpg",
      "/images/griflan/service_3_img_2.jpg",
      "/images/griflan/service_3_img_3.jpg",
    ],
  },
];
