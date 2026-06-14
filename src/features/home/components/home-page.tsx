import Copy from "@/features/home/components/copy";
import HomeClock from "@/features/home/components/home-clock";
import HomeDemos from "@/features/home/components/home-demos";
import { overviewParagraphs } from "@/features/home/data/content";
import "@/features/home/styles/home.scss";

export default function HomePage() {
  return (
    <div className="home-page">
      <header className="home-header">
        <h1 className="home-logo">
          My GSAP <br /> <span> — Demo</span>
        </h1>
        <HomeClock />
      </header>

      <main className="home-overview">
        <Copy delay={0.3} animateOnScroll={false}>
          {overviewParagraphs.map((paragraph) => (
            <p key={paragraph.index} className="home-overview-item">
              <span className="home-overview-index">{paragraph.index}</span>
              {paragraph.text}
            </p>
          ))}
        </Copy>
      </main>

      <HomeDemos />
    </div>
  );
}
