import { BrandIntroduction } from "@/components/home/BrandIntroduction";
import { CompanyStats } from "@/components/home/CompanyStats";
import { ContactSection } from "@/components/home/ContactSection";
import { DevelopmentProcess } from "@/components/home/DevelopmentProcess";
import { ExpertiseSection } from "@/components/home/ExpertiseSection";
import { FeaturedProjects } from "@/components/home/FeaturedProjects";
import { HeroSection } from "@/components/home/HeroSection";
import { MaterialsStrip } from "@/components/home/MaterialsStrip";
import { TourTeaser } from "@/components/home/TourTeaser";
import { Testimonials } from "@/components/home/Testimonials";
import { WhyChooseUs } from "@/components/home/WhyChooseUs";
import { getProjects } from "@/lib/data/projects";

/**
 * Homepage, in order: hero (tower explorer) · About (paper) · Step inside (stone) · Selected work
 * (white) · Expertise (stone) · Stats (paper) · Process (white) · Why Meridian (stone) ·
 * Materials (white) · Testimonials (paper) · Contact (blue), then the footer.
 */
export default async function HomePage() {
  // The first project that has a 360° tour is the one the "Step inside" section invites you into.
  const tourProject = (await getProjects()).find((project) => project.virtualTour);

  return (
    <>
      <HeroSection />
      <BrandIntroduction />
      {tourProject && <TourTeaser project={tourProject} />}
      <FeaturedProjects />
      <ExpertiseSection />
      <CompanyStats />
      <DevelopmentProcess />
      <WhyChooseUs />
      <MaterialsStrip />
      <Testimonials />
      <ContactSection />
    </>
  );
}
