import SmoothScroll from "@/features/poly-app-photo-dump/components/smooth-scroll";
import PhotoGallery from "@/features/poly-app-photo-dump/components/photo-gallery";
import "@/features/poly-app-photo-dump/styles/poly-app-photo-dump.scss";

export default function PolyAppPhotoDumpPage() {
  return (
    <SmoothScroll>
      <section className="photo-dump-intro">
        <h1>Time loosens its grip and the stack begins to shift</h1>
      </section>

      <PhotoGallery />

      <section className="photo-dump-outro">
        <h1>Eventually, the stack settles and the scroll continues</h1>
      </section>
    </SmoothScroll>
  );
}
