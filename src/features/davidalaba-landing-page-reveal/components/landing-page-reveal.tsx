"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { SplitText } from "gsap/SplitText";
import CustomEase from "gsap/CustomEase";
import {
  brandName,
  heroLines,
  preloaderCopy,
  preloaderImages,
} from "@/features/davidalaba-landing-page-reveal/data/content";
import { createSplit } from "@/features/davidalaba-landing-page-reveal/lib/create-split";

gsap.registerPlugin(CustomEase, SplitText);

export default function LandingPageReveal() {
  const preloaderRef = useRef<HTMLDivElement>(null);
  const progressBarRef = useRef<HTMLDivElement>(null);
  const preloaderImagesRef = useRef<HTMLDivElement>(null);
  const preloaderCopyRef = useRef<HTMLParagraphElement>(null);
  const preloaderHeaderRef = useRef<HTMLDivElement>(null);
  const preloaderHeaderLinkRef = useRef<HTMLAnchorElement>(null);
  const imageWrapperRefs = useRef<HTMLDivElement[]>([]);
  const imageInnerRefs = useRef<HTMLImageElement[]>([]);
  const headerLineRefs = useRef<HTMLHeadingElement[]>([]);
  const dividerRefs = useRef<HTMLDivElement[]>([]);

  useEffect(() => {
    CustomEase.create("hop", "0.9, 0, 0.1, 1");

    const progressBar = progressBarRef.current!;
    const preloader = preloaderRef.current!;
    const preloaderImagesEl = preloaderImagesRef.current!;
    const preloaderHeader = preloaderHeaderRef.current!;
    const preloaderHeaderLink = preloaderHeaderLinkRef.current!;
    const preloaderCopyEl = preloaderCopyRef.current!;
    const headerH1s = headerLineRefs.current.filter(Boolean);
    const imageWrappers = imageWrapperRefs.current.filter(Boolean);
    const imageInners = imageInnerRefs.current.filter(Boolean);
    const dividers = dividerRefs.current.filter(Boolean);

    const splitPreloaderHeader = createSplit(
      preloaderHeaderLink,
      "chars",
      "char"
    );
    const splitPreloaderCopy = createSplit(preloaderCopyEl, "lines", "line");
    const splitHeader = createSplit(headerH1s, "lines", "line");

    const chars = splitPreloaderHeader.chars;
    const lines = splitPreloaderCopy.lines;
    const headerLines = splitHeader.lines;
    const initialChar = chars[0];
    const lastChar = chars[chars.length - 1];

    chars.forEach((char, index) => {
      gsap.set(char, { yPercent: index % 2 === 0 ? -100 : 100 });
    });

    gsap.set(lines, { yPercent: 100 });
    gsap.set(headerLines, { yPercent: 100 });

    const tl = gsap.timeline({ delay: 0.25 });

    tl.to(progressBar, {
      scaleX: 1,
      duration: 4,
      ease: "power3.inOut",
    })
      .set(progressBar, { transformOrigin: "right" })
      .to(progressBar, {
        scaleX: 0,
        duration: 1,
        ease: "power3.in",
      });

    imageWrappers.forEach((preloaderImg, index) => {
      tl.to(
        preloaderImg,
        {
          clipPath: "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)",
          duration: 1,
          ease: "hop",
          delay: index * 0.75,
        },
        "-=5"
      );
    });

    imageInners.forEach((preloaderImageInner, index) => {
      tl.to(
        preloaderImageInner,
        {
          scale: 1,
          duration: 1.5,
          ease: "hop",
          delay: index * 0.75,
        },
        "-=5.25"
      );
    });

    tl.to(
      lines,
      {
        yPercent: 0,
        duration: 2,
        ease: "hop",
        stagger: 0.1,
      },
      "-=5.5"
    );

    tl.to(
      chars,
      {
        yPercent: 0,
        duration: 1,
        ease: "hop",
        stagger: 0.025,
      },
      "-=5"
    );

    tl.to(
      preloaderImagesEl,
      {
        clipPath: "polygon(0% 0%, 100% 0%, 100% 0%, 0% 0%)",
        duration: 1,
        ease: "hop",
      },
      "-=1.5"
    );

    tl.to(
      lines,
      {
        y: "-125%",
        duration: 2,
        ease: "hop",
        stagger: 0.1,
      },
      "-=2"
    );

    tl.to(
      chars,
      {
        yPercent: (index) => {
          if (index === 0 || index === chars.length - 1) {
            return 0;
          }
          return index % 2 === 0 ? 100 : -100;
        },
        duration: 1,
        ease: "hop",
        stagger: 0.025,
        delay: 0.5,
        onStart: () => {
          const initialCharMask = initialChar.parentElement;
          const lastCharMask = lastChar.parentElement;

          if (
            initialCharMask &&
            initialCharMask.classList.contains("char-mask")
          ) {
            initialCharMask.style.overflow = "visible";
          }

          if (lastCharMask && lastCharMask.classList.contains("char-mask")) {
            lastCharMask.style.overflow = "visible";
          }

          const viewportWidth = window.innerWidth;
          const centerX = viewportWidth / 2;
          const initialCharRect = initialChar.getBoundingClientRect();
          const lastCharRect = lastChar.getBoundingClientRect();

          gsap.to([initialChar, lastChar], {
            duration: 1,
            ease: "hop",
            delay: 0.5,
            x: (i) => {
              if (i === 0) {
                return centerX - initialCharRect.left - initialCharRect.width;
              }
              return centerX - lastCharRect.left;
            },
            onComplete: () => {
              gsap.set(preloaderHeader, { mixBlendMode: "difference" });
              gsap.to(preloaderHeader, {
                y: "2rem",
                scale: 0.35,
                duration: 1.75,
                ease: "hop",
              });
            },
          });
        },
      },
      "-=2.5"
    );

    tl.to(
      preloader,
      {
        clipPath: "polygon(0% 0%, 100% 0%, 100% 0%, 0% 0%)",
        duration: 1.75,
        ease: "hop",
      },
      "-=0.5"
    );

    tl.to(
      headerLines,
      {
        yPercent: 0,
        duration: 1,
        ease: "power4.out",
        stagger: 0.1,
      },
      "-=0.75"
    );

    tl.to(
      dividers,
      {
        scaleX: 1,
        duration: 1,
        ease: "power4.out",
        stagger: 0.1,
      },
      "<"
    );

    return () => {
      tl.kill();
      splitPreloaderHeader.revert();
      splitPreloaderCopy.revert();
      splitHeader.revert();
    };
  }, []);

  return (
    <>
      <div className="davidalaba-preloader" ref={preloaderRef}>
        <div className="davidalaba-progress-bar" ref={progressBarRef} />

        <div className="davidalaba-preloader-images" ref={preloaderImagesRef}>
          {preloaderImages.map((src, i) => (
            <div
              className="davidalaba-preloader-img"
              key={i}
              ref={(el) => {
                if (el) imageWrapperRefs.current[i] = el;
              }}
            >
              <img
                src={src}
                alt=""
                ref={(el) => {
                  if (el) imageInnerRefs.current[i] = el;
                }}
              />
            </div>
          ))}
        </div>

        <div className="davidalaba-preloader-copy">
          <p ref={preloaderCopyRef}>{preloaderCopy}</p>
        </div>
      </div>

      <div className="davidalaba-preloader-header" ref={preloaderHeaderRef}>
        <a href="#" ref={preloaderHeaderLinkRef}>
          {brandName}
        </a>
      </div>

      <section className="davidalaba-hero">
        {heroLines.map((line, i) => (
          <div className="davidalaba-header-row" key={i}>
            <div
              className="davidalaba-divider"
              ref={(el) => {
                if (el) dividerRefs.current[i] = el;
              }}
            />
            <h1
              ref={(el) => {
                if (el) headerLineRefs.current[i] = el;
              }}
            >
              {line}
            </h1>
          </div>
        ))}
      </section>
    </>
  );
}
