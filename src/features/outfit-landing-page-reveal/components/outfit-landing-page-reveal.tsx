"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { SplitText } from "gsap/SplitText";
import { CustomEase } from "gsap/CustomEase";
import {
  brandName,
  heroFooter,
  heroHeading,
  navLinks,
  preloaderImages,
  preloaderImgInitRotations,
} from "@/features/outfit-landing-page-reveal/data/content";

gsap.registerPlugin(SplitText, CustomEase);

export default function OutfitLandingPageReveal() {
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const q = <T extends Element>(s: string) => root.querySelector<T>(s);
    const qa = <T extends Element>(s: string) =>
      Array.from(root.querySelectorAll<T>(s));

    CustomEase.create("hop", "0.8, 0, 0.2, 1");
    CustomEase.create("hop2", "0.9, 0, 0.1, 1");

    const splits: SplitText[] = [];
    let tl: gsap.core.Timeline | null = null;

    const makeSplit = (
      targets: Element[],
      type: "chars" | "words",
      className: string,
      mask = true
    ) => {
      const split = SplitText.create(targets, {
        type,
        [`${type}Class`]: className,
        ...(mask && { mask: type }),
      });
      splits.push(split);
      return split;
    };

    const setup = () => {
      makeSplit(qa(".olp-preloader-header h1"), "chars", "olp-char");
      makeSplit(qa(".olp-nav a"), "words", "olp-word");
      makeSplit(qa(".olp-header h1"), "chars", "olp-char", false);
      makeSplit(qa(".olp-hero-footer p"), "words", "olp-word");

      gsap.set(qa(".olp-preloader-img"), {
        rotate: (i: number) => preloaderImgInitRotations[i],
      });

      tl = gsap.timeline({ delay: 0.5 });

      tl.to(qa(".olp-preloader-img"), {
        scale: 1,
        clipPath: "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)",
        duration: 1,
        ease: "hop",
        stagger: 0.2,
      });

      tl.to(
        qa(".olp-preloader-header h1 .olp-char"),
        {
          y: "0%",
          duration: 1,
          ease: "hop2",
          stagger: { each: 0.125, from: "random" },
        },
        "0.35"
      );

      tl.to(
        q(".olp-preloader-counter p"),
        {
          y: "0%",
          duration: 1,
          ease: "hop2",
          onStart: () => {
            const counterEl = q<HTMLParagraphElement>(
              ".olp-preloader-counter p"
            );
            if (!counterEl) return;
            const counter = { value: 0 };

            gsap.to(counter, {
              value: 100,
              duration: 2,
              delay: 0.5,
              ease: "power2.inOut",
              onUpdate: () => {
                counterEl.textContent = String(
                  Math.round(counter.value)
                ).padStart(3, "0");
              },
            });
          },
        },
        "<"
      );

      tl.to(
        q(".olp-preloader-counter p"),
        {
          y: "-100%",
          duration: 0.75,
          ease: "hop2",
        },
        3.25
      );

      tl.to(
        qa(".olp-preloader-header h1 .olp-char"),
        {
          y: "-100%",
          duration: 0.75,
          ease: "hop2",
          stagger: { each: 0.125, from: "random" },
        },
        3.25
      );

      tl.to(
        qa(".olp-preloader-images .olp-preloader-img"),
        {
          scale: 0,
          clipPath: "polygon(20% 20%, 80% 20%, 80% 80%, 20% 80%)",
          duration: 1,
          ease: "hop2",
          stagger: -0.075,
        },
        3.5
      );

      tl.to(
        q(".olp-preloader"),
        {
          clipPath: "polygon(0% 0%, 100% 0%, 100% 0%, 0% 0%)",
          duration: 1,
          ease: "hop2",
        },
        4.35
      );

      tl.to(
        qa(".olp-header h1 .olp-char"),
        {
          y: "0%",
          duration: 1,
          ease: "hop",
          stagger: { each: 0.075, from: "random" },
        },
        4.65
      );

      tl.to(
        qa(".olp-nav a .olp-word"),
        {
          y: "0%",
          duration: 1,
          ease: "hop",
          stagger: 0.075,
        },
        4.75
      );

      tl.to(
        qa(".olp-hero-footer p .olp-word"),
        {
          y: "0%",
          duration: 1,
          ease: "hop",
          stagger: 0.075,
        },
        4.75
      );
    };

    if (document.fonts?.status === "loaded") {
      setup();
    } else {
      document.fonts.ready.then(setup);
    }

    return () => {
      tl?.kill();
      splits.forEach((split) => split.revert());
    };
  }, []);

  return (
    <div ref={rootRef} className="olp-page">
      <div className="olp-preloader">
        <div className="olp-preloader-images">
          {preloaderImages.map((src, index) => (
            <div key={index} className="olp-preloader-img">
              <img src={src} alt="" />
            </div>
          ))}
        </div>

        <div className="olp-preloader-header">
          <h1>{brandName}</h1>

          <div className="olp-preloader-counter">
            <p>000</p>
          </div>
        </div>
      </div>

      <nav className="olp-nav">
        <div className="olp-nav-logo">
          <a href="#">{brandName}</a>
        </div>

        <div className="olp-nav-links">
          {navLinks.map((link) => (
            <a key={link} href="#">
              {link}
            </a>
          ))}
        </div>
      </nav>

      <section className="olp-hero">
        <div className="olp-header">
          <h1>{heroHeading}</h1>
        </div>

        <div className="olp-hero-footer">
          {heroFooter.map((item) => (
            <p key={item}>{item}</p>
          ))}
        </div>
      </section>
    </div>
  );
}
