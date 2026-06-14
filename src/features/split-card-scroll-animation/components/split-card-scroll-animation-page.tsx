import SmoothScroll from "@/features/split-card-scroll-animation/components/smooth-scroll";
import SplitCardSection from "@/features/split-card-scroll-animation/components/split-card-section";
import "@/features/split-card-scroll-animation/styles/split-card-scroll-animation.scss";

export default function SplitCardScrollAnimationPage() {
  return (
    <SmoothScroll>
      <section className="split-card-intro">
        <h1>Every idea begins as a single image</h1>
      </section>

      <SplitCardSection />

      <section className="split-card-outro">
        <h1>Every transition leaves a trace</h1>
      </section>
    </SmoothScroll>
  );
}
