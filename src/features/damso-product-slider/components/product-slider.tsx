"use client";

import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import gsap from "gsap";
import {
  BUFFER_SIZE,
  createInitialSlides,
  getProductIndex,
  products,
  SLIDE_WIDTH,
} from "@/features/damso-product-slider/data/products";

interface Slide {
  id: string;
  relativeIndex: number;
  productIndex: number;
}

export default function ProductSlider() {
  const [currentProductIndex, setCurrentProductIndex] = useState(0);
  const [slides, setSlides] = useState<Slide[]>(() => createInitialSlides());
  const [activeProduct, setActiveProduct] = useState(products[0]);

  const productPreviewRef = useRef<HTMLDivElement>(null);
  const productBannerRef = useRef<HTMLDivElement>(null);
  const controllerInnerRef = useRef<HTMLDivElement>(null);
  const controllerOuterRef = useRef<HTMLDivElement>(null);
  const closeIconSpanRefs = useRef<HTMLSpanElement[]>([]);
  const prevBtnRef = useRef<HTMLButtonElement>(null);
  const nextBtnRef = useRef<HTMLButtonElement>(null);
  const slideRefs = useRef<Map<string, HTMLLIElement>>(new Map());

  const isPreviewAnimatingRef = useRef(false);
  const isPreviewOpenRef = useRef(false);
  const hasInitializedRef = useRef(false);
  const currentProductIndexRef = useRef(0);
  const slidesRef = useRef(slides);
  slidesRef.current = slides;

  const getActualIndex = useCallback((index: number) => {
    const len = products.length;
    return ((index % len) + len) % len;
  }, []);

  const setActiveProductByIndex = useCallback((index: number) => {
    setActiveProduct(products[getActualIndex(index)]);
  }, [getActualIndex]);

  const setActiveProductFromSlide = useCallback(() => {
    const activeSlide = slidesRef.current.find((slide) => slide.relativeIndex === 0);
    const index = activeSlide?.productIndex ?? currentProductIndexRef.current;
    setActiveProduct(products[index]);
  }, []);

  const updateButtonStates = useCallback(() => {
    const disabled =
      isPreviewAnimatingRef.current || isPreviewOpenRef.current;
    prevBtnRef.current?.classList.toggle("disabled", disabled);
    nextBtnRef.current?.classList.toggle("disabled", disabled);
  }, []);

  const updateSliderPosition = useCallback((animate = true) => {
    slidesRef.current.forEach((slide) => {
      const element = slideRefs.current.get(slide.id);
      if (!element) return;

      const isActive = slide.relativeIndex === 0;
      const props = {
        x: slide.relativeIndex * SLIDE_WIDTH,
        scale: isActive ? 1.25 : 0.75,
        zIndex: isActive ? 100 : 1,
      };

      if (animate) {
        gsap.to(element, {
          ...props,
          duration: 0.75,
          ease: "power3.out",
        });
      } else {
        gsap.set(element, props);
      }
    });
  }, []);

  useLayoutEffect(() => {
    updateSliderPosition(hasInitializedRef.current);
    hasInitializedRef.current = true;
  }, [slides, updateSliderPosition]);

  useEffect(() => {
    if (productPreviewRef.current) {
      gsap.set(productPreviewRef.current, { xPercent: -50, yPercent: 100 });
    }
  }, []);

  const getActiveSlide = useCallback(() => {
    return slidesRef.current.find((slide) => slide.relativeIndex === 0);
  }, []);

  const animateSideItems = useCallback((hide = false) => {
    const activeSlide = getActiveSlide();

    slidesRef.current.forEach((slide) => {
      const absIndex = Math.abs(slide.relativeIndex);
      if (absIndex !== 1 && absIndex !== 2) return;

      const element = slideRefs.current.get(slide.id);
      if (!element) return;

      gsap.to(element, {
        x: hide
          ? slide.relativeIndex * SLIDE_WIDTH * 1.5
          : slide.relativeIndex * SLIDE_WIDTH,
        opacity: hide ? 0 : 1,
        duration: 0.75,
        ease: "power3.inOut",
      });
    });

    if (activeSlide) {
      const element = slideRefs.current.get(activeSlide.id);
      if (element) {
        gsap.to(element, {
          scale: hide ? 0.75 : 1.25,
          opacity: hide ? 0 : 1,
          duration: 0.75,
          ease: "power3.inOut",
        });
      }
    }
  }, [getActiveSlide]);

  const animateControllerTransition = useCallback((opening = false) => {
    const navEls = [
      controllerOuterRef.current?.querySelector(".damso-controller-label p"),
      prevBtnRef.current,
      nextBtnRef.current,
    ].filter(Boolean);

    gsap.to(navEls, {
      opacity: opening ? 0 : 1,
      duration: 0.2,
      ease: "power3.out",
      delay: opening ? 0 : 0.4,
    });

    if (controllerOuterRef.current) {
      gsap.to(controllerOuterRef.current, {
        clipPath: opening ? "circle(0% at 50% 50%)" : "circle(50% at 50% 50%)",
        duration: 0.75,
        ease: "power3.inOut",
      });
    }

    if (controllerInnerRef.current) {
      gsap.to(controllerInnerRef.current, {
        clipPath: opening ? "circle(50% at 50% 50%)" : "circle(40% at 50% 50%)",
        duration: 0.75,
        ease: "power3.inOut",
      });
    }

    const closeSpans = closeIconSpanRefs.current.filter(Boolean);
    gsap.to(closeSpans, {
      width: opening ? "20px" : "0px",
      duration: opening ? 0.4 : 0.3,
      ease: opening ? "power3.out" : "power3.in",
      stagger: opening ? 0.1 : 0.05,
      delay: opening ? 0.2 : 0,
    });
  }, []);

  const togglePreview = useCallback(() => {
    if (isPreviewAnimatingRef.current) return;

    isPreviewAnimatingRef.current = true;
    updateButtonStates();

    if (!isPreviewOpenRef.current) {
      setActiveProductFromSlide();
    }

    const opening = !isPreviewOpenRef.current;

    if (productPreviewRef.current) {
      gsap.to(productPreviewRef.current, {
        yPercent: opening ? -50 : 100,
        xPercent: -50,
        duration: 0.75,
        ease: "power3.inOut",
      });
    }

    if (productBannerRef.current) {
      gsap.to(productBannerRef.current, {
        opacity: opening ? 1 : 0,
        duration: 0.4,
        delay: opening ? 0.25 : 0,
        ease: "power3.inOut",
      });
    }

    animateSideItems(opening);
    animateControllerTransition(opening);

    window.setTimeout(() => {
      isPreviewAnimatingRef.current = false;
      isPreviewOpenRef.current = opening;
      updateButtonStates();
    }, 600);
  }, [
    animateControllerTransition,
    animateSideItems,
    setActiveProductFromSlide,
    updateButtonStates,
  ]);

  const moveNext = useCallback(() => {
    if (isPreviewAnimatingRef.current || isPreviewOpenRef.current) return;

    setCurrentProductIndex((prev) => {
      const nextIndex = prev + 1;
      setSlides((currentSlides) => {
        const updated = currentSlides
          .filter((slide) => slide.relativeIndex !== -BUFFER_SIZE)
          .map((slide) => ({
            ...slide,
            relativeIndex: slide.relativeIndex - 1,
          }));

        updated.push({
          id: `slide-${BUFFER_SIZE}-${crypto.randomUUID()}`,
          relativeIndex: BUFFER_SIZE,
          productIndex: getProductIndex(BUFFER_SIZE, nextIndex),
        });

        return updated;
      });

      currentProductIndexRef.current = nextIndex;
      setActiveProductByIndex(nextIndex);
      return nextIndex;
    });
  }, [setActiveProductByIndex]);

  const movePrev = useCallback(() => {
    if (isPreviewAnimatingRef.current || isPreviewOpenRef.current) return;

    setCurrentProductIndex((prev) => {
      const nextIndex = prev - 1;
      setSlides((currentSlides) => {
        const updated = currentSlides
          .filter((slide) => slide.relativeIndex !== BUFFER_SIZE)
          .map((slide) => ({
            ...slide,
            relativeIndex: slide.relativeIndex + 1,
          }));

        updated.push({
          id: `slide-${-BUFFER_SIZE}-${crypto.randomUUID()}`,
          relativeIndex: -BUFFER_SIZE,
          productIndex: getProductIndex(-BUFFER_SIZE, nextIndex),
        });

        return updated;
      });

      currentProductIndexRef.current = nextIndex;
      setActiveProductByIndex(nextIndex);
      return nextIndex;
    });
  }, [setActiveProductByIndex]);

  return (
    <div className="damso-container">
      <div className="damso-nav">
        <div className="damso-logo">
          <p>Codegrid / Exp 0493</p>
        </div>
        <div className="damso-product-name">
          <p>{activeProduct.name}</p>
        </div>
      </div>

      <div className="damso-gallery">
        <ul className="damso-products">
          {slides.map((slide) => {
            const product = products[slide.productIndex];
            return (
              <li
                key={slide.id}
                data-relative-index={slide.relativeIndex}
                ref={(el) => {
                  if (el) slideRefs.current.set(slide.id, el);
                  else slideRefs.current.delete(slide.id);
                }}
              >
                <img src={product.img} alt={product.name} />
              </li>
            );
          })}
        </ul>

        <div className="damso-controller">
          <div
            className="damso-controller-inner"
            ref={controllerInnerRef}
            onClick={togglePreview}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") togglePreview();
            }}
            role="button"
            tabIndex={0}
          >
            <div className="damso-close-icon">
              <span
                ref={(el) => {
                  if (el) closeIconSpanRefs.current[0] = el;
                }}
              />
              <span
                ref={(el) => {
                  if (el) closeIconSpanRefs.current[1] = el;
                }}
              />
            </div>
          </div>

          <div className="damso-controller-outer" ref={controllerOuterRef}>
            <div className="damso-controller-label">
              <p>Menu</p>
            </div>

            <button
              type="button"
              className="damso-nav-btn damso-nav-btn-prev"
              ref={prevBtnRef}
              onClick={movePrev}
              aria-label="Previous product"
            >
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <path d="M6 6h2v12H6V6zm10.5 0L9 12l7.5 6V6z" fill="currentColor" />
              </svg>
            </button>
            <button
              type="button"
              className="damso-nav-btn damso-nav-btn-next"
              ref={nextBtnRef}
              onClick={moveNext}
              aria-label="Next product"
            >
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <path d="M16 6h2v12h-2V6zM6 6l7.5 6L6 18V6z" fill="currentColor" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      <div className="damso-product-banner" ref={productBannerRef}>
        <img src={activeProduct.img} alt={activeProduct.name} />
      </div>

      <div className="damso-product-preview" ref={productPreviewRef}>
        <div className="damso-product-preview-info">
          <div className="damso-product-preview-name">
            <p>{activeProduct.name}</p>
          </div>
          <div className="damso-product-preview-tag">
            <p>{activeProduct.tag}</p>
          </div>
        </div>

        <div className="damso-product-preview-img">
          <img src={activeProduct.img} alt={activeProduct.name} />
        </div>

        <div className="damso-product-url">
          <div className="damso-btn">
            <a href={activeProduct.url}>View Details</a>
          </div>
        </div>
      </div>
    </div>
  );
}
