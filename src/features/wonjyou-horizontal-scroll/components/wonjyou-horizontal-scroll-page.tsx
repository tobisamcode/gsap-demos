import HorizontalScroll from "@/features/wonjyou-horizontal-scroll/components/horizontal-scroll";
import SmoothScroll from "@/features/wonjyou-horizontal-scroll/components/smooth-scroll";
import "@/features/wonjyou-horizontal-scroll/styles/wonjyou-horizontal-scroll.scss";

export default function WonjyouHorizontalScrollPage() {
  return (
    <SmoothScroll>
      <HorizontalScroll />
    </SmoothScroll>
  );
}
