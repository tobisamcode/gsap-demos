import ClientsSection from "@/features/lacrapulestudio-hover-animation/components/clients-section";
import { navLinks } from "@/features/lacrapulestudio-hover-animation/data/clients";
import "@/features/lacrapulestudio-hover-animation/styles/lacrapulestudio-hover-animation.scss";

export default function LacrapulestudioHoverAnimationPage() {
  return (
    <div className="lacrapule-page">
      <nav className="lacrapule-nav">
        <div className="lacrapule-logo">
          <a href="#">Nørd Objects</a>
        </div>

        <div className="lacrapule-nav-links">
          {navLinks.map((link) => (
            <a key={link.label} href={link.href}>
              {link.label}
            </a>
          ))}
        </div>
      </nav>

      <ClientsSection />

      <footer className="lacrapule-footer">
        <p>Experiment 503</p>
        <p>Developed by Codegrid</p>
      </footer>
    </div>
  );
}
