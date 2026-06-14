"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ScrollSmoother } from "gsap/ScrollSmoother";
import { SplitText } from "gsap/SplitText";
import {
  copyBlocks,
  marqueeImages,
} from "@/features/scroll-activated-text-blocks/data/content";
import { animateBlock } from "@/features/scroll-activated-text-blocks/lib/text-animation";

gsap.registerPlugin(ScrollTrigger, ScrollSmoother, SplitText);

const OVERLAP_COUNT = 3;

export default function TextBlocksHero() {
  const heroRef = useRef<HTMLElement>(null);
  const indicatorRef = useRef<HTMLDivElement>(null);
  const marqueeTrackRef = useRef<HTMLDivElement>(null);
  const copyBlockRefs = useRef<HTMLParagraphElement[]>([]);

  useEffect(() => {
    const hero = heroRef.current!;
    const indicator = indicatorRef.current!;
    const marqueeTrack = marqueeTrackRef.current!;
    const textBlocks = copyBlockRefs.current.filter(Boolean);

    const splitInstances = textBlocks.map((block) =>
      SplitText.create(block, { type: "words", mask: "words" }),
    );

    gsap.set(splitInstances[1].words, { yPercent: 100 });
    gsap.set(splitInstances[2].words, { yPercent: 100 });

    let targetVelocity = 0;
    let lastScrollTop = 0;
    let marqueePosition = 0;
    let smoothVelocity = 0;

    const marqueeTick = () => {
      const smoother = ScrollSmoother.get();
      if (smoother) {
        const scrollTop = smoother.scrollTop();
        targetVelocity = Math.abs(scrollTop - lastScrollTop) * 0.02;
        lastScrollTop = scrollTop;
      }

      smoothVelocity += (targetVelocity - smoothVelocity) * 0.5;

      const baseSpeed = 0.45;
      const speed = baseSpeed + smoothVelocity * 9;
      marqueePosition -= speed;

      const trackWidth = marqueeTrack.scrollWidth / 2;
      if (marqueePosition <= -trackWidth) {
        marqueePosition = 0;
      }

      gsap.set(marqueeTrack, { x: marqueePosition });
      targetVelocity *= 0.9;
    };

    gsap.ticker.add(marqueeTick);

    const trigger = ScrollTrigger.create({
      trigger: hero,
      start: "top top",
      end: () => `+=${window.innerHeight * 5}`,
      pin: true,
      pinSpacing: true,
      onUpdate: (self) => {
        const scrollProgress = self.progress;

        gsap.set(indicator, { "--progress": scrollProgress });

        if (scrollProgress <= 0.5) {
          animateBlock(
            splitInstances[0],
            splitInstances[1],
            scrollProgress / 0.5,
            OVERLAP_COUNT,
          );
        } else {
          gsap.set(splitInstances[0].words, { yPercent: 100 });
          animateBlock(
            splitInstances[1],
            splitInstances[2],
            (scrollProgress - 0.5) / 0.5,
            OVERLAP_COUNT,
          );
        }
      },
    });

    return () => {
      trigger.kill();
      gsap.ticker.remove(marqueeTick);
      splitInstances.forEach((split) => split.revert());
    };
  }, []);

  return (
    <section className="text-blocks-hero" ref={heroRef}>
      <nav className="text-blocks-nav">
        <p>/ CG191125</p>
        <p>Experiment_507</p>
      </nav>

      <div className="text-blocks-about-copy">
        {copyBlocks.map((text, i) => (
          <div className="text-blocks-copy-block" key={i}>
            <p
              ref={(el) => {
                if (el) copyBlockRefs.current[i] = el;
              }}
            >
              {text}
            </p>
          </div>
        ))}
      </div>

      <div className="text-blocks-marquee">
        <div className="text-blocks-marquee-track" ref={marqueeTrackRef}>
          {[...marqueeImages, ...marqueeImages].map((src, i) => (
            <div className="text-blocks-marquee-item" key={i}>
              <img src={src} alt="" />
            </div>
          ))}
        </div>
      </div>

      <div className="text-blocks-scroll-indicator" ref={indicatorRef} />
    </section>
  );
}
