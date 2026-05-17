import HeroSection from "../../components/public/HeroSection";
import ServicesSection from "../../components/public/services/ServiceSection";
import ContactUsSection from "../../components/public/ContactSection";
import characterImage from "../../assets/service.png";

export default function ServicesPage() {
  return (
    <div style={{ fontFamily: "system-ui, sans-serif" }}>
      <HeroSection
        badge="What We Offer"
        title="Repair Services Built Around"
        titleHighlight="Your Device"
        description="From laptops to solar panels — our certified technicians handle it all with precision and care."
        cta={{ label: "Get a Quote", to: "/inquire" }}
        image={characterImage}
        imageAlt="Kenji 'Spark' Tanaka"
      />
      <ServicesSection />
      <ContactUsSection />
    </div>
  );
}