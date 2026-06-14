import ServiceItem from "@/features/griflan-hover-effect/components/service-item";
import { services } from "@/features/griflan-hover-effect/data/services";
import "@/features/griflan-hover-effect/styles/griflan-hover-effect.scss";

export default function GriflanHoverEffectPage() {
  return (
    <section className="services">
      {services.map((service) => (
        <ServiceItem key={service.name} service={service} />
      ))}
    </section>
  );
}
