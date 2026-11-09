import { BrandIntroduction } from "@/components/home/BrandIntroduction";
import { CompanyStats } from "@/components/home/CompanyStats";
import { ContactSection } from "@/components/home/ContactSection";
import { DevelopmentProcess } from "@/components/home/DevelopmentProcess";
import { ExpertiseSection } from "@/components/home/ExpertiseSection";
import { FeaturedProjects } from "@/components/home/FeaturedProjects";
import { HeroSection } from "@/components/home/HeroSection";
import { Testimonials } from "@/components/home/Testimonials";
import { WhyChooseUs } from "@/components/home/WhyChooseUs";

/**
 * Homepage. Section order and surfaces follow docs/DESIGN-SYSTEM.md:
 * obsidian → ivory → obsidian → forest → obsidian → ivory → charcoal → forest → obsidian → (footer) charcoal
 */
export default function HomePage() {
  return (
    <>
      <HeroSection />
      <BrandIntroduction />
      <FeaturedProjects />
      <ExpertiseSection />
      <CompanyStats />
      <DevelopmentProcess />
      <WhyChooseUs />
      <Testimonials />
      <ContactSection />
    </>
  );
}
