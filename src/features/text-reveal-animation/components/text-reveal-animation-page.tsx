import Copy from "@/features/text-reveal-animation/components/copy";
import SmoothScroll from "@/features/text-reveal-animation/components/smooth-scroll";
import {
  aboutHeading,
  aboutImage,
  aboutLabel,
  footerLinks,
  heroHeading,
  heroImage,
  navLinks,
  philosophyHeading,
  philosophyLabel,
  storyParagraphs,
} from "@/features/text-reveal-animation/data/content";
import "@/features/text-reveal-animation/styles/text-reveal-animation.scss";

export default function TextRevealAnimationPage() {
  return (
    <SmoothScroll>
      <div className="text-reveal-page">
        <nav className="text-reveal-nav">
          <div className="text-reveal-col">
            <div className="text-reveal-sub-col">
              <span>Greyloom</span>
            </div>
            <div className="text-reveal-sub-col">
              {navLinks.map((link) => (
                <span key={link}>{link}</span>
              ))}
            </div>
          </div>
          <div className="text-reveal-col">
            <span>Let&apos;s talk</span>
          </div>
        </nav>

        <section className="text-reveal-hero">
          <div className="text-reveal-hero-img">
            <img src={heroImage} alt="" />
          </div>

          <div className="text-reveal-header">
            <Copy delay={0.5}>
              <h1>{heroHeading}</h1>
            </Copy>
          </div>
        </section>

        <section className="text-reveal-about">
          <Copy>
            <span>{aboutLabel}</span>
          </Copy>
          <div className="text-reveal-header">
            <Copy>
              <h1>{aboutHeading}</h1>
            </Copy>
          </div>
        </section>

        <section className="text-reveal-about-img">
          <img src={aboutImage} alt="" />
        </section>

        <section className="text-reveal-story">
          <div className="text-reveal-col">
            <Copy>
              <h1>
                The Story Behind <br /> Our Stillness
              </h1>
            </Copy>
          </div>
          <div className="text-reveal-col">
            <Copy>
              {storyParagraphs.map((paragraph) => (
                <p key={paragraph.slice(0, 24)}>{paragraph}</p>
              ))}
            </Copy>
          </div>
        </section>

        <section className="text-reveal-philosophy">
          <Copy>
            <span>{philosophyLabel}</span>
          </Copy>
          <div className="text-reveal-header">
            <Copy>
              <h1>{philosophyHeading}</h1>
            </Copy>
          </div>
        </section>

        <footer className="text-reveal-footer">
          <div className="text-reveal-col">
            <div className="text-reveal-sub-col">
              <span>Terms & Conditions</span>
            </div>
            <div className="text-reveal-sub-col">
              <Copy>
                {footerLinks.map((link) => (
                  <h1 key={link}>{link}</h1>
                ))}
              </Copy>
            </div>
          </div>

          <div className="text-reveal-col">
            <span>Copyright Greyloom 2025</span>
          </div>
        </footer>
      </div>
    </SmoothScroll>
  );
}
