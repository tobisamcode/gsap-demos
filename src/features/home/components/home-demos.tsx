"use client";

import { useCallback, useEffect, useRef } from "react";
import Link from "next/link";
import gsap from "gsap";
import CustomEase from "gsap/CustomEase";
import { demoLinks } from "@/features/home/data/content";

gsap.registerPlugin(CustomEase);

interface ActivePreview {
  wrapper: HTMLDivElement;
  img: HTMLImageElement;
}

export default function HomeDemos() {
  const previewRef = useRef<HTMLDivElement>(null);
  const linkRefs = useRef<(HTMLAnchorElement | null)[]>([]);
  const activeIndexRef = useRef(-1);
  const activePreviewRef = useRef<ActivePreview | null>(null);
  const isSmallScreenRef = useRef(false);

  useEffect(() => {
    CustomEase.create(
      "hop",
      "M0,0 C0.071,0.505 0.192,0.726 0.318,0.852 0.45,0.984 0.504,1 1,1",
    );

    const mql = window.matchMedia("(max-width: 1000px)");
    const update = () => {
      isSmallScreenRef.current = mql.matches;
    };
    update();
    mql.addEventListener("change", update);
    return () => mql.removeEventListener("change", update);
  }, []);

  const hidePreview = useCallback(() => {
    const active = activePreviewRef.current;
    if (!active) return;

    const { wrapper, img } = active;
    activePreviewRef.current = null;

    gsap.to(img, {
      opacity: 0,
      duration: 0.5,
      ease: "power1.out",
      onComplete: () => {
        wrapper.remove();
      },
    });
  }, []);

  const handleMouseOver = useCallback(
    (index: number) => {
      if (activeIndexRef.current === index) return;

      if (activeIndexRef.current !== -1) {
        hidePreview();
      }

      activeIndexRef.current = index;

      const preview = previewRef.current;
      if (!preview) return;

      const wrapper = document.createElement("div");
      wrapper.className = "home-demo-img-wrapper";

      const img = document.createElement("img");
      img.src = demoLinks[index].image;
      img.alt = demoLinks[index].label;
      gsap.set(img, { scale: 1.25, opacity: 0 });

      wrapper.appendChild(img);
      preview.appendChild(wrapper);

      activePreviewRef.current = { wrapper, img };

      gsap.to(wrapper, {
        clipPath: "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)",
        duration: 0.5,
        ease: "hop",
      });

      gsap.to(img, {
        opacity: 1,
        duration: 0.25,
        ease: "power2.out",
      });

      gsap.to(img, {
        scale: 1,
        duration: 1.25,
        ease: "hop",
      });
    },
    [hidePreview],
  );

  const handleMouseOut = useCallback(
    (index: number, relatedTarget: EventTarget | null) => {
      const linkEl = linkRefs.current[index];
      if (!linkEl) return;

      if (relatedTarget instanceof Node && linkEl.contains(relatedTarget)) {
        return;
      }

      if (activeIndexRef.current === index) {
        activeIndexRef.current = -1;
      }

      hidePreview();
    },
    [hidePreview],
  );

  const handleClick = useCallback(
    (event: React.MouseEvent<HTMLAnchorElement>, index: number) => {
      if (!isSmallScreenRef.current) return;

      // First tap previews the demo; a second tap follows the link.
      if (activeIndexRef.current !== index) {
        event.preventDefault();
        handleMouseOver(index);
      }
    },
    [handleMouseOver],
  );

  return (
    <section className="home-demos">
      <div className="home-demos-preview" ref={previewRef} />

      <div className="home-demos-header">
        <p>Explore the demos</p>
      </div>

      <p className="home-demos-list">
        {demoLinks.map((demo, index) => (
          <span key={demo.href} className="home-demo-item">
            <Link
              href={demo.href}
              className="home-demo-link"
              ref={(el) => {
                linkRefs.current[index] = el;
              }}
              onMouseEnter={() => {
                if (!isSmallScreenRef.current) handleMouseOver(index);
              }}
              onMouseLeave={(e) => {
                if (!isSmallScreenRef.current)
                  handleMouseOut(index, e.relatedTarget);
              }}
              onClick={(e) => handleClick(e, index)}
            >
              {demo.label}
            </Link>
            {index < demoLinks.length - 1 ? ", " : "."}
          </span>
        ))}
      </p>
    </section>
  );
}
