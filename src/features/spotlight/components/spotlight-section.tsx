"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const projects = [
  "Human Form Study",
  "Interior Light",
  "Project 21",
  "Shadow Portraits",
  "Everyday Objects",
  "Unit 07 Care",
  "Motion Practice",
  "Noonlight Series",
  "Material Stillness",
  "Quiet Walk",
];

export default function SpotlightSection() {
  const spotlightRef = useRef<HTMLElement>(null);
  const projectIndexRef = useRef<HTMLHeadingElement>(null);
  const projectImagesContainerRef = useRef<HTMLDivElement>(null);
  const projectNamesContainerRef = useRef<HTMLDivElement>(null);
  const projectImgRefs = useRef<HTMLDivElement[]>([]);

  useEffect(() => {
    const spotlight = spotlightRef.current!;
    const projectIndex = projectIndexRef.current!;
    const projectImgsContainer = projectImagesContainerRef.current!;
    const projectNamesContainer = projectNamesContainerRef.current!;
    const projectImgs = projectImgRefs.current;
    const projectNameEls =
      projectNamesContainer.querySelectorAll<HTMLParagraphElement>("p");
    const totalProjectCount = projectNameEls.length;

    const spotlightSectionHeight = spotlight.offsetHeight;
    const spotlightSectionPadding = parseFloat(
      getComputedStyle(spotlight).padding,
    );
    const projectIndexHeight = projectIndex.offsetHeight;
    const containerHeight = projectNamesContainer.offsetHeight;
    const imagesHeight = projectImgsContainer.offsetHeight;

    const moveDistanceIndex =
      spotlightSectionHeight - spotlightSectionPadding * 2 - projectIndexHeight;
    const moveDistanceNames =
      spotlightSectionHeight - spotlightSectionPadding * 2 - containerHeight;
    const moveDistanceImages = window.innerHeight - imagesHeight;

    const imgActivationThreshold = window.innerHeight / 2;

    const trigger = ScrollTrigger.create({
      trigger: spotlight,
      start: "top top",
      end: `+=${window.innerHeight * 5}px`,
      pin: true,
      pinSpacing: true,
      scrub: 1,
      onUpdate: (self) => {
        const progress = self.progress;
        const currentIndex = Math.min(
          Math.floor(progress * totalProjectCount) + 1,
          totalProjectCount,
        );

        projectIndex.textContent = `${String(currentIndex).padStart(2, "0")}/${String(totalProjectCount).padStart(2, "0")}`;

        gsap.set(projectIndex, { y: progress * moveDistanceIndex });
        gsap.set(projectImgsContainer, { y: progress * moveDistanceImages });

        projectImgs.forEach((img) => {
          const { top, bottom } = img.getBoundingClientRect();
          const isActive =
            top <= imgActivationThreshold && bottom >= imgActivationThreshold;
          gsap.set(img, { opacity: isActive ? 1 : 0.5 });
        });

        projectNameEls.forEach((p, index) => {
          const startProgress = index / totalProjectCount;
          const endProgress = (index + 1) / totalProjectCount;
          const projectProgress = Math.max(
            0,
            Math.min(
              1,
              (progress - startProgress) / (endProgress - startProgress),
            ),
          );

          gsap.set(p, { y: -projectProgress * moveDistanceNames });
          gsap.set(p, {
            color:
              projectProgress > 0 && projectProgress < 1 ? "#fff" : "#4a4a4a",
          });
        });
      },
    });

    return () => {
      trigger.kill();
    };
  }, []);

  return (
    <section ref={spotlightRef} className="spotlight">
      <div className="project-index">
        <h1 ref={projectIndexRef}>01/10</h1>
      </div>

      <div ref={projectImagesContainerRef} className="project-images">
        {projects.map((_, i) => (
          <div
            key={i}
            className="project-img"
            ref={(el) => {
              if (el) projectImgRefs.current[i] = el;
            }}
          >
            <img src={`/images/spotlight/img${i + 1}.jpg`} alt="" />
          </div>
        ))}
      </div>

      <div ref={projectNamesContainerRef} className="project-names">
        {projects.map((name, i) => (
          <p key={i}>{name}</p>
        ))}
      </div>
    </section>
  );
}
