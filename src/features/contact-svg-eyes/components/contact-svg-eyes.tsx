"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import {
  footer,
  navLinks,
  socialRows,
} from "@/features/contact-svg-eyes/data/content";

function ScrollText({ label }: { label: string }) {
  const letters = Array.from(label);

  const renderBlock = (blockKey: string) => (
    <div className="ce-block" key={blockKey}>
      {letters.map((char, index) => (
        <span className="ce-letter" key={`${blockKey}-${index}`}>
          {char === " " ? "\u00a0" : char}
        </span>
      ))}
    </div>
  );

  return (
    <a className="ce-text" href="#">
      {renderBlock("a")}
      {renderBlock("b")}
    </a>
  );
}

export default function ContactSvgEyes() {
  const svgRef = useRef<SVGSVGElement>(null);
  const leftEyeRef = useRef<SVGGElement>(null);
  const rightEyeRef = useRef<SVGGElement>(null);

  useEffect(() => {
    const svg = svgRef.current;
    const leftEye = leftEyeRef.current;
    const rightEye = rightEyeRef.current;
    if (!svg || !leftEye || !rightEye) return;

    const eyes = [leftEye, rightEye].map((element) => {
      gsap.set(element, { transformOrigin: "center" });
      const bbox = element.getBBox();
      return {
        element,
        centerX: bbox.x + bbox.width / 2,
        centerY: bbox.y + bbox.height / 2,
        rotation: 0,
      };
    });

    const point = svg.createSVGPoint();
    let requestId: number | null = null;

    const rotateTo = (eye: (typeof eyes)[number], x: number, y: number) => {
      const dx = x - eye.centerX;
      const dy = y - eye.centerY;
      const target = (Math.atan2(dy, dx) * 180) / Math.PI;
      // shortest rotation path (mirrors GSAP 2's "_rad_short")
      const delta = ((target - eye.rotation + 540) % 360) - 180;
      eye.rotation += delta;

      gsap.to(eye.element, {
        duration: 0.3,
        rotation: eye.rotation,
        transformOrigin: "center",
        overwrite: "auto",
      });
    };

    const onFrame = () => {
      const ctm = svg.getScreenCTM();
      if (ctm) {
        const local = point.matrixTransform(ctm.inverse());
        eyes.forEach((eye) => rotateTo(eye, local.x, local.y));
      }
      requestId = null;
    };

    const onMouseMove = (event: MouseEvent) => {
      point.x = event.clientX;
      point.y = event.clientY;
      if (!requestId) {
        requestId = requestAnimationFrame(onFrame);
      }
    };

    window.addEventListener("mousemove", onMouseMove);

    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      if (requestId) cancelAnimationFrame(requestId);
    };
  }, []);

  return (
    <div className="ce-page">
      <nav className="ce-nav">
        <div className="ce-logo">
          <a href="#">Cochi La</a>
        </div>
        <div className="ce-links">
          {navLinks.map((link) => (
            <a key={link} href="#">
              {link}
            </a>
          ))}
        </div>
        <div className="ce-contact">
          <a href="#">Contact</a>
        </div>
      </nav>

      <footer className="ce-footer">
        <div className="ce-mail">
          <a href="#">{footer.mail}</a>
        </div>
        <div className="ce-location">
          <a href="#">{footer.location}</a>
        </div>
      </footer>

      <div className="ce-wrapper">
        <svg ref={svgRef} className="ce-svg" viewBox="0 0 1000 1000">
          <g ref={leftEyeRef} id="ce-left-eye">
            <circle
              className="ce-eye-outer"
              cx="400"
              cy="500"
              r="100"
              stroke="#0f0f0f"
              strokeWidth="2"
              fill="#fff"
            />
            <circle className="ce-eye-inner" cx="480" cy="500" r="20" fill="#0f0f0f" />
          </g>

          <g ref={rightEyeRef} id="ce-right-eye">
            <circle
              className="ce-eye-outer"
              cx="600"
              cy="500"
              r="100"
              stroke="#0f0f0f"
              strokeWidth="2"
              fill="#fff"
            />
            <circle className="ce-eye-inner" cx="680" cy="500" r="20" fill="#0f0f0f" />
          </g>
        </svg>

        <div className="ce-container">
          {socialRows.map((row, rowIndex) => (
            <div className="ce-row" key={rowIndex}>
              {row.map((label) => (
                <ScrollText key={label} label={label} />
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
