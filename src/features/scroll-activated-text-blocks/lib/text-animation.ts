import gsap from "gsap";

export function getWordProgress(
  phaseProgress: number,
  wordIndex: number,
  totalWords: number,
  overlapCount: number
) {
  const totalLength = 1 + overlapCount / totalWords;
  const scale =
    1 /
    Math.min(
      totalLength,
      1 + (totalWords - 1) / totalWords + overlapCount / totalWords
    );

  const startTime = (wordIndex / totalWords) * scale;
  const endTime = startTime + (overlapCount / totalWords) * scale;
  const duration = endTime - startTime;

  if (phaseProgress <= startTime) return 0;
  if (phaseProgress >= endTime) return 1;
  return (phaseProgress - startTime) / duration;
}

export function animateBlock(
  outBlock: { words: Element[] },
  inBlock: { words: Element[] },
  phaseProgress: number,
  overlapCount = 3
) {
  outBlock.words.forEach((word, i) => {
    const progress = getWordProgress(
      phaseProgress,
      i,
      outBlock.words.length,
      overlapCount
    );
    gsap.set(word, { yPercent: progress * 100 });
  });

  inBlock.words.forEach((word, i) => {
    const progress = getWordProgress(
      phaseProgress,
      i,
      inBlock.words.length,
      overlapCount
    );
    gsap.set(word, { yPercent: 100 - progress * 100 });
  });
}
