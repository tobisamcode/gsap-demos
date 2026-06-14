import TextBlocksHero from "@/features/scroll-activated-text-blocks/components/text-blocks-hero";
import SmoothScroll from "@/features/scroll-activated-text-blocks/components/smooth-scroll";
import "@/features/scroll-activated-text-blocks/styles/scroll-activated-text-blocks.scss";

export default function ScrollActivatedTextBlocksPage() {
  return (
    <SmoothScroll>
      <TextBlocksHero />
    </SmoothScroll>
  );
}
