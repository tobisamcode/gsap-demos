"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import Matter from "matter-js";
import type { Service } from "@/features/griflan-hover-effect/data/services";

const { Engine, World, Bodies, Body } = Matter;

export default function ServiceItem({ service }: { service: Service }) {
  const serviceRef = useRef<HTMLDivElement>(null);
  const nameRef = useRef<HTMLHeadingElement>(null);
  const imageRefs = useRef<HTMLDivElement[]>([]);
  const tagRefs = useRef<(HTMLDivElement | null)[]>([]);

  const isHoveredRef = useRef(false);
  const tagDropTimer = useRef<gsap.core.Tween | null>(null);

  // A new id remounts the tags subtree, giving each hover a fresh physics run.
  const [tagsKey, setTagsKey] = useState<number | null>(null);

  useEffect(() => {
    if (tagsKey === null) return;

    const serviceEl = serviceRef.current!;
    const tags = tagRefs.current.filter((el): el is HTMLDivElement => !!el);
    if (!tags.length) return;

    const serviceWidth = serviceEl.offsetWidth;
    const serviceHeight = serviceEl.offsetHeight;
    const tagSizes = tags.map((tag) => ({
      width: tag.offsetWidth,
      height: tag.offsetHeight,
    }));

    const engine = Engine.create({ gravity: { x: 0, y: 2 } });

    const wallThickness = 20;
    const floorOffset = window.innerWidth < 1000 ? 25 : 50;

    const floor = Bodies.rectangle(
      serviceWidth / 2,
      serviceHeight - floorOffset + wallThickness / 2,
      serviceWidth * 3,
      wallThickness,
      { isStatic: true }
    );
    const leftWall = Bodies.rectangle(
      -wallThickness / 2,
      serviceHeight / 2,
      wallThickness,
      serviceHeight * 3,
      { isStatic: true }
    );
    const rightWall = Bodies.rectangle(
      serviceWidth + wallThickness / 2,
      serviceHeight / 2,
      wallThickness,
      serviceHeight * 3,
      { isStatic: true }
    );
    World.add(engine.world, [floor, leftWall, rightWall]);

    const tagBodies = tags.map((tag, i) => {
      const { width, height } = tagSizes[i];
      const startX = serviceWidth * 0.25 + Math.random() * serviceWidth * 0.5;
      const startY = -(height / 2) - i * 5;
      const angle = (Math.random() - 0.5) * 0.4;

      const body = Bodies.rectangle(startX, startY, width, height, {
        chamfer: { radius: height / 2 },
        restitution: 0.15,
        friction: 0.6,
        density: 0.002,
      });
      Body.setAngle(body, angle);
      World.add(engine.world, body);

      gsap.to(tag, {
        opacity: 1,
        duration: 0.3,
        delay: i * 0.04,
        ease: "power2.out",
      });

      return body;
    });

    let rafId = requestAnimationFrame(function update() {
      Engine.update(engine, 1000 / 60);

      for (let i = 0; i < tags.length; i++) {
        const body = tagBodies[i];
        const { width, height } = tagSizes[i];
        tags[i].style.transform = `translate(${body.position.x - width / 2}px, ${body.position.y - height / 2}px) rotate(${body.angle}rad)`;
      }

      rafId = requestAnimationFrame(update);
    });

    return () => {
      cancelAnimationFrame(rafId);
      Engine.clear(engine);
    };
  }, [tagsKey]);

  const handleMouseEnter = () => {
    isHoveredRef.current = true;
    const expandedHeight = window.innerWidth < 1000 ? "12.5rem" : "25rem";

    gsap.killTweensOf(serviceRef.current);
    gsap.killTweensOf(imageRefs.current);
    gsap.killTweensOf(nameRef.current);

    gsap.to(serviceRef.current, {
      height: expandedHeight,
      duration: 0.75,
      ease: "elastic.out(1,0.5)",
    });
    gsap.to(nameRef.current, {
      color: "#FFFFD9",
      duration: 0.25,
      ease: "power4.out",
    });
    gsap.to(imageRefs.current, {
      y: "-50%",
      duration: 0.75,
      ease: "elastic.out(1,0.5)",
      stagger: 0.075,
    });

    tagDropTimer.current = gsap.delayedCall(0.2, () => {
      if (isHoveredRef.current) setTagsKey(Date.now());
    });
  };

  const handleMouseLeave = () => {
    isHoveredRef.current = false;
    const collapsedHeight = window.innerWidth < 1000 ? "5rem" : "10rem";

    tagDropTimer.current?.kill();

    gsap.killTweensOf(serviceRef.current);
    gsap.killTweensOf(imageRefs.current);
    gsap.killTweensOf(nameRef.current);

    const activeTags = tagRefs.current.filter((el): el is HTMLDivElement => !!el);
    if (activeTags.length) {
      gsap.to(activeTags, {
        opacity: 0,
        duration: 0.25,
        ease: "power2.out",
        onComplete: () => {
          if (!isHoveredRef.current) setTagsKey(null);
        },
      });
    } else {
      setTagsKey(null);
    }

    gsap.to(nameRef.current, {
      color: "#ff3831",
      duration: 0.25,
      ease: "power4.out",
    });
    gsap.to(imageRefs.current, {
      y: "50%",
      duration: 0.75,
      ease: "elastic.out(1,0.5)",
      stagger: 0.075,
    });
    gsap.to(serviceRef.current, {
      height: collapsedHeight,
      duration: 0.5,
      ease: "elastic.out(1,0.75)",
    });
  };

  return (
    <div
      className="service"
      ref={serviceRef}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div className="service-name">
        <h1 ref={nameRef}>{service.name}</h1>
      </div>

      <div className="service-images">
        {service.images.map((src, i) => (
          <div
            className="img"
            key={i}
            ref={(el) => {
              if (el) imageRefs.current[i] = el;
            }}
          >
            <img src={src} alt="" />
          </div>
        ))}
      </div>

      {tagsKey !== null && (
        <div className="tags-container" key={tagsKey}>
          {service.tags.map((label, i) => (
            <div
              className="tag"
              key={i}
              ref={(el) => {
                tagRefs.current[i] = el;
              }}
            >
              {label}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
