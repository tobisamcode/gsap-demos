import SmoothScroll from "@/features/spotlight/components/smooth-scroll";
import SpotlightSection from "@/features/spotlight/components/spotlight-section";
import "@/features/spotlight/styles/spotlight.scss";

export default function SpotlightPage() {
  return (
    <SmoothScroll>
      <section className="intro">
        <p>A collection of selected works</p>
      </section>

      <SpotlightSection />

      <section className="outro">
        <p>Scroll complete</p>
      </section>
    </SmoothScroll>
  );
}
