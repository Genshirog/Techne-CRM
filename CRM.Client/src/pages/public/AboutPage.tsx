import HeroSection from "../../components/public/HeroSection";
import ContactUsSection from "../../components/public/ContactSection";
import characterImage from "../../assets/about.png";
import AboutSection from "../../components/public/about/AboutSection";

export default function AboutPage(){
    return(
        <div style={{ fontFamily: "system-ui, sans-serif" }}>
        <HeroSection
            badge="Who Is TechneFixer"
            title="Quality Work Is The Best"
            titleHighlight="Our Business"
            description="From laptops to solar panels — our certified technicians handle it all with precision and care."
            cta={{ label: "Get a Quote", to: "/inquire" }}
            image={characterImage}
            imageAlt="Kenji 'Spark' Tanaka"
        />
        <AboutSection />
        <ContactUsSection />
    </div>
    );
}