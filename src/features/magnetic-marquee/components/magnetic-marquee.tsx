"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { SplitText } from "gsap/SplitText";
import {
  copy,
  footer,
  marqueeImages,
  navLeft,
  navRight,
  subtitle,
  title,
} from "@/features/magnetic-marquee/data/content";

gsap.registerPlugin(SplitText);

const config = {
  marqueeScrollSpeed: 100,
  stripFollowEase: 0.05,
  stripEdgeInset: 175,
  contentRiseRate: 0.85,
  risenTopGap: 100,
  liftHeadStart: 125,
  wakeStrength: 2.5,
  wakeReach: 125,
  lineSettleEase: 0.09,
};

interface TextLine {
  el: HTMLElement;
  restCenterY: number;
  currentY: number;
  source: Element;
}

export default function MagneticMarquee() {
  const sectionRef = useRef<HTMLElement>(null);
  const marqueeRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const spotlightSection = sectionRef.current;
    const marqueeStrip = marqueeRef.current;
    const marqueeTrack = trackRef.current;
    if (!spotlightSection || !marqueeStrip || !marqueeTrack) return;

    const sourceItems = Array.from(marqueeTrack.children) as HTMLElement[];
    const oneSetWidth = sourceItems.reduce(
      (sum, item) => sum + item.offsetWidth,
      0,
    );
    const setsNeeded = Math.ceil(window.innerWidth / oneSetWidth) + 1;

    const clones: HTMLElement[] = [];
    for (let copyIndex = 0; copyIndex < setsNeeded; copyIndex++) {
      sourceItems.forEach((item) => {
        const clone = item.cloneNode(true) as HTMLElement;
        marqueeTrack.appendChild(clone);
        clones.push(clone);
      });
    }

    const marqueeTween = gsap.to(marqueeTrack, {
      x: `-=${oneSetWidth}`,
      duration: oneSetWidth / config.marqueeScrollSpeed,
      ease: "none",
      repeat: -1,
      modifiers: {
        x: (x) => `${gsap.utils.wrap(-oneSetWidth, 0, parseFloat(x))}px`,
      },
    });

    let stripBaseTop = 0;
    let stripHeight = 0;
    let sectionHeight = 0;
    let stripRestCenterY = 0;
    let contentTopAtRest = 0;

    let stripTargetY = 0;
    let stripCurrentY = 0;
    let stripPrevY = 0;
    let hasPointerMoved = false;

    let textLines: TextLine[] = [];

    const measureGeometry = () => {
      sectionHeight = spotlightSection.getBoundingClientRect().height;
      stripBaseTop = marqueeStrip.offsetTop;
      stripHeight = marqueeStrip.offsetHeight;

      stripRestCenterY = config.stripEdgeInset;

      let blockTop = Infinity;
      textLines.forEach((line) => {
        let y = 0;
        let node: HTMLElement | null = line.el;
        while (node && node !== spotlightSection) {
          y += node.offsetTop;
          node = node.offsetParent as HTMLElement | null;
        }
        line.restCenterY = y + line.el.offsetHeight / 2;
        blockTop = Math.min(
          blockTop,
          line.restCenterY - line.el.offsetHeight / 2,
        );
      });
      contentTopAtRest = isFinite(blockTop) ? blockTop : sectionHeight * 0.4;

      if (!hasPointerMoved) {
        const restY = config.stripEdgeInset - stripBaseTop - stripHeight / 2;
        stripTargetY = restY;
        stripCurrentY = restY;
        stripPrevY = restY;
      }
    };

    const splitTargets = gsap.utils.toArray<HTMLElement>(
      spotlightSection.querySelectorAll(
        ".mm-content-wrapper h1, .mm-content-wrapper h3, .mm-copy p",
      ),
    );

    const splits = splitTargets.map((element) =>
      SplitText.create(element, {
        type: "lines",
        linesClass: "mm-line",
        onSplit(instance) {
          textLines = textLines.filter((line) => line.source !== element);
          instance.lines.forEach((lineEl) => {
            textLines.push({
              el: lineEl as HTMLElement,
              restCenterY: 0,
              currentY: 0,
              source: element,
            });
          });
          measureGeometry();
        },
      }),
    );

    window.addEventListener("resize", measureGeometry);

    const handleMouseMove = (event: MouseEvent) => {
      hasPointerMoved = true;
      const bounds = spotlightSection.getBoundingClientRect();
      const cursorY = event.clientY - bounds.top;

      const wantedY = cursorY - stripBaseTop - stripHeight / 2;
      const highestY = config.stripEdgeInset - stripBaseTop - stripHeight / 2;
      const lowestY =
        sectionHeight - config.stripEdgeInset - stripBaseTop - stripHeight / 2;
      stripTargetY = gsap.utils.clamp(highestY, lowestY, wantedY);
    };

    spotlightSection.addEventListener("mousemove", handleMouseMove);

    const tick = () => {
      stripCurrentY += (stripTargetY - stripCurrentY) * config.stripFollowEase;
      gsap.set(marqueeStrip, { y: stripCurrentY });

      const stripCenterY = stripBaseTop + stripCurrentY + stripHeight / 2;
      const stripVelocityY = stripCurrentY - stripPrevY;
      stripPrevY = stripCurrentY;

      const descentBelowRest = Math.max(0, stripCenterY - stripRestCenterY);
      const maxRise = Math.max(0, contentTopAtRest - config.risenTopGap);
      const contentRise = -Math.min(
        descentBelowRest * config.contentRiseRate,
        maxRise,
      );

      textLines.forEach((line) => {
        const gapToStrip = line.restCenterY - stripCenterY;
        const reachedLine =
          stripCenterY + config.liftHeadStart >= line.restCenterY;

        const wakeInfluence = Math.exp(
          -(gapToStrip * gapToStrip) /
            (2 * config.wakeReach * config.wakeReach),
        );
        const wakeOffset = stripVelocityY * wakeInfluence * config.wakeStrength;

        const lineTarget = (reachedLine ? contentRise : 0) + wakeOffset;

        line.currentY += (lineTarget - line.currentY) * config.lineSettleEase;
        gsap.set(line.el, { y: line.currentY });
      });
    };

    gsap.ticker.add(tick);

    return () => {
      gsap.ticker.remove(tick);
      marqueeTween.kill();
      window.removeEventListener("resize", measureGeometry);
      spotlightSection.removeEventListener("mousemove", handleMouseMove);
      splits.forEach((split) => split.revert());
      clones.forEach((clone) => clone.remove());
      gsap.set(marqueeStrip, { clearProps: "transform" });
    };
  }, []);

  return (
    <section ref={sectionRef} className="mm-spotlight">
      <div className="mm-nav">
        <p>{navLeft}</p>
        <p>{navRight}</p>
      </div>

      <div ref={marqueeRef} className="mm-marquee">
        <div ref={trackRef} className="mm-marquee-track">
          {marqueeImages.map((src, index) => (
            <div key={index} className="mm-marquee-item">
              <img src={src} alt="" />
            </div>
          ))}
        </div>
      </div>

      <div className="mm-content-wrapper">
        <h1>{title}</h1>
        <h3>{subtitle}</h3>
        <div className="mm-copy">
          {copy.map((paragraph, index) => (
            <p key={index}>{paragraph}</p>
          ))}
        </div>
      </div>

      <div className="mm-footer">
        <p>{footer}</p>
      </div>
    </section>
  );
}
