import SmoothScroll from "@/features/sticky-cards/components/smooth-scroll";
import StickyCards from "@/features/sticky-cards/components/sticky-cards";
import "@/features/sticky-cards/styles/sticky-cards.scss";

export default function StickyCardsPage() {
  return (
    <SmoothScroll>
      <section className="sticky-cards-intro">
        <h1>The Foundations</h1>
      </section>

      <StickyCards />

      <section className="sticky-cards-outro">
        <h1>Ends in Form</h1>
      </section>
    </SmoothScroll>
  );
}
