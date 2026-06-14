import AnimatedCopy from "@/features/terminal-text-reveal-animation/components/animated-copy";
import SmoothScroll from "@/features/terminal-text-reveal-animation/components/smooth-scroll";
import {
  aboutCopy,
  aboutHeading,
  bannerImage,
  heroImage,
  outroHeading,
  services,
} from "@/features/terminal-text-reveal-animation/data/content";
import "@/features/terminal-text-reveal-animation/styles/terminal-text-reveal-animation.scss";

export default function TerminalTextRevealAnimationPage() {
  return (
    <SmoothScroll>
      <div className="terminal-page">
        <section className="terminal-hero">
        <img src={heroImage} alt="" />
      </section>

      <section className="terminal-about">
        <div className="terminal-header">
          <h1>{aboutHeading}</h1>
        </div>
        <div className="terminal-copy">
          <AnimatedCopy>
            <p>{aboutCopy}</p>
          </AnimatedCopy>
        </div>
      </section>

      <section className="terminal-banner-img">
        <img src={bannerImage} alt="" />
      </section>

      <section className="terminal-services">
        {services.map((service) => (
          <div
            key={service.title}
            className={`terminal-service${service.imageFirst ? " terminal-service-reverse" : ""}`}
          >
            {service.imageFirst ? (
              <>
                <div className="terminal-col">
                  <img src={service.image} alt={service.title} />
                </div>
                <div className="terminal-col">
                  <div className="terminal-service-copy">
                    <h3>{service.title}</h3>
                    <AnimatedCopy>
                      <p>{service.copy}</p>
                    </AnimatedCopy>
                  </div>
                </div>
              </>
            ) : (
              <>
                <div className="terminal-col">
                  <div className="terminal-service-copy">
                    <h3>{service.title}</h3>
                    <AnimatedCopy>
                      <p>{service.copy}</p>
                    </AnimatedCopy>
                  </div>
                </div>
                <div className="terminal-col">
                  <img src={service.image} alt={service.title} />
                </div>
              </>
            )}
          </div>
        ))}
      </section>

      <section className="terminal-outro">
        <h3>{outroHeading}</h3>
      </section>
      </div>
    </SmoothScroll>
  );
}
