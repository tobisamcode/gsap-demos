"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import {
  cards,
  cardLayout,
} from "@/features/spencergabor-magnetic-cards/data/cards";
import {
  applyNeighborInfluence,
  BOUNCE_FRICTION,
  calculatePushForce,
  CURSOR_SMOOTHING,
  SPRING_STIFFNESS,
  TILT_AMOUNT,
  type CardPhysics,
} from "@/features/spencergabor-magnetic-cards/lib/physics";

export default function MagneticCards() {
  const cardsContainerRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<HTMLDivElement[]>([]);

  const cursorRef = useRef({ x: 0, y: 0, vx: 0, vy: 0 });
  const prevCursorRef = useRef({ x: 0, y: 0 });
  const cardPhysicsRef = useRef<CardPhysics[]>([]);

  useEffect(() => {
    const cardElements = cardRefs.current.filter(
      (el): el is HTMLDivElement => !!el
    );
    if (!cardElements.length) return;

    cardPhysicsRef.current = cardElements.map((el, i) => {
      gsap.set(el, {
        x: cardLayout.x[i],
        y: cardLayout.y[i],
        rotation: cardLayout.rotation[i],
        zIndex: i,
        xPercent: -50,
        yPercent: -50,
      });

      return {
        el,
        restX: cardLayout.x[i],
        restY: cardLayout.y[i],
        restR: cardLayout.rotation[i],
        x: cardLayout.x[i],
        y: cardLayout.y[i],
        r: cardLayout.rotation[i],
        vx: 0,
        vy: 0,
        vr: 0,
      };
    });

    const tick = () => {
      const container = cardsContainerRef.current;
      const cardPhysics = cardPhysicsRef.current;
      if (!container || !cardPhysics.length) return;

      const containerRect = container.getBoundingClientRect();
      const cursor = cursorRef.current;
      const forces = cardPhysics.map((card) =>
        calculatePushForce(card, cursor, containerRect)
      );

      cardPhysics.forEach((card, i) => {
        const { fx, fy } = applyNeighborInfluence(forces, i);

        card.vx =
          (card.vx + (card.restX + fx - card.x) * SPRING_STIFFNESS) *
          BOUNCE_FRICTION;
        card.vy =
          (card.vy + (card.restY + fy - card.y) * SPRING_STIFFNESS) *
          BOUNCE_FRICTION;
        card.vr =
          (card.vr + (card.restR + fx * TILT_AMOUNT - card.r) * SPRING_STIFFNESS) *
          BOUNCE_FRICTION;

        card.x += card.vx;
        card.y += card.vy;
        card.r += card.vr;

        gsap.set(card.el, { x: card.x, y: card.y, rotation: card.r });
      });
    };

    gsap.ticker.add(tick);

    return () => {
      gsap.ticker.remove(tick);
    };
  }, []);

  const handleMouseMove = (e: React.MouseEvent<HTMLElement>) => {
    const cursor = cursorRef.current;
    const prev = prevCursorRef.current;

    cursor.vx =
      cursor.vx * CURSOR_SMOOTHING +
      (e.clientX - prev.x) * (1 - CURSOR_SMOOTHING);
    cursor.vy =
      cursor.vy * CURSOR_SMOOTHING +
      (e.clientY - prev.y) * (1 - CURSOR_SMOOTHING);

    prev.x = cursor.x = e.clientX;
    prev.y = cursor.y = e.clientY;
  };

  const handleMouseLeave = () => {
    cursorRef.current.vx = 0;
    cursorRef.current.vy = 0;
  };

  return (
    <section
      className="magnetic-cards-spotlight"
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      <div className="magnetic-cards" ref={cardsContainerRef}>
        {cards.map((card, i) => (
          <div
            className="magnetic-card"
            key={i}
            ref={(el) => {
              if (el) cardRefs.current[i] = el;
            }}
          >
            <img src={card.image} alt="" />
          </div>
        ))}
      </div>
    </section>
  );
}
