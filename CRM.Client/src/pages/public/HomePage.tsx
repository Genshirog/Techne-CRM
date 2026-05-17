import HeroSection from "../../components/public/HeroSection";
import ServicesSection from "../../components/public/home/ServiceSection";
import AboutSection from "../../components/public/home/AboutSection";
import TestimonialsSection from "../../components/public/home/Testimonials";
import ContactSection from "../../components/public/ContactSection";
import characterImage from "../../assets/character.png";
// ─── Home Page ────────────────────────────────────────────────────────────────
export default function HomePage() {
  return (
    <>
      <link
        href="https://fonts.googleapis.com/css2?family=Space+Mono:wght@400;700&display=swap"
        rel="stylesheet"
      />
      <div style={{ fontFamily: "system-ui, sans-serif" }}>
        <HeroSection
          badge="Professional Repair Services"
          title="Professional Repair Services For Your"
          titleHighlight="Electronics & Appliances"
          description="Expert technicians specializing in Laptops, Printers, Washing Machines..."
          stats={[
            { value: "500+", label: "Devices Fixed" },
            { value: "98%",  label: "Satisfaction"  },
            { value: "5yr",  label: "Experience"    },
          ]}
          cta={{ label: "Inquire Now", to: "/inquire" }}
          image={characterImage}
          imageAlt="Kenji 'Spark' Tanaka"
        />
        <ServicesSection />
        <TestimonialsSection />
        <AboutSection />
        <ContactSection />
      </div>
    </>
  );
}