import gsap from "gsap";
import { SplitText } from "gsap/SplitText";

type SplitType = "chars" | "lines";

export function createSplit(
  target: Element | Element[],
  type: SplitType,
  className: string
) {
  return SplitText.create(target, {
    type,
    [`${type}Class`]: className,
    mask: type,
  });
}
