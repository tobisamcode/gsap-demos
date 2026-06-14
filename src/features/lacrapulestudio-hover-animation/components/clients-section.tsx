"use client";

import { useCallback, useEffect, useRef } from "react";
import gsap from "gsap";
import CustomEase from "gsap/CustomEase";
import {
  clients,
  getClientImage,
} from "@/features/lacrapulestudio-hover-animation/data/clients";

gsap.registerPlugin(CustomEase);

interface ActivePreview {
  wrapper: HTMLDivElement;
  img: HTMLImageElement;
}

export default function ClientsSection() {
  const previewRef = useRef<HTMLDivElement>(null);
  const clientRefs = useRef<(HTMLDivElement | null)[]>([]);
  const activeClientIndexRef = useRef(-1);
  const activePreviewRef = useRef<ActivePreview | null>(null);

  useEffect(() => {
    CustomEase.create(
      "hop",
      "M0,0 C0.071,0.505 0.192,0.726 0.318,0.852 0.45,0.984 0.504,1 1,1"
    );
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
      if (activeClientIndexRef.current === index) return;

      if (activeClientIndexRef.current !== -1) {
        hidePreview();
      }

      activeClientIndexRef.current = index;

      const preview = previewRef.current;
      if (!preview) return;

      const wrapper = document.createElement("div");
      wrapper.className = "lacrapule-client-img-wrapper";

      const img = document.createElement("img");
      img.src = getClientImage(index);
      img.alt = clients[index];
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
    [hidePreview]
  );

  const handleMouseOut = useCallback(
    (index: number, relatedTarget: EventTarget | null) => {
      const clientEl = clientRefs.current[index];
      if (!clientEl) return;

      if (relatedTarget instanceof Node && clientEl.contains(relatedTarget)) {
        return;
      }

      if (activeClientIndexRef.current === index) {
        activeClientIndexRef.current = -1;
      }

      hidePreview();
    },
    [hidePreview]
  );

  return (
    <section className="lacrapule-clients">
      <div className="lacrapule-clients-preview" ref={previewRef} />

      <div className="lacrapule-clients-header">
        <p>Trusted Us</p>
      </div>

      <div className="lacrapule-clients-list">
        {clients.map((name, index) => (
          <div
            key={name}
            className="lacrapule-client-name"
            ref={(el) => {
              clientRefs.current[index] = el;
            }}
            onMouseEnter={() => handleMouseOver(index)}
            onMouseLeave={(e) => handleMouseOut(index, e.relatedTarget)}
          >
            <h1>{name}</h1>
          </div>
        ))}
      </div>
    </section>
  );
}
