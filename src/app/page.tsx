import Header from '@/components/Header/Header';
import Hero from '@/components/Hero/Hero';
import StatsStrip from '@/components/StatsStrip/StatsStrip';
import Results from '@/components/Results/Results';
import About from '@/components/About/About';
import Expertise from '@/components/Expertise/Expertise';
import Experience from '@/components/Experience/Experience';
import HowIWork from '@/components/HowIWork/HowIWork';
import LeadCalculator from '@/components/LeadCalculator/LeadCalculator';
import Certifications from '@/components/Certifications/Certifications';
import CreativeGallery from '@/components/CreativeGallery/CreativeGallery';
import ChecksAndCall from '@/components/ChecksAndCall/ChecksAndCall';
import Contact from '@/components/Contact/Contact';

export default function Home() {
  return (
    <main>
      <Header />
      <Hero />
      <StatsStrip />
      <Results />
      <About />
      <Expertise />
      <Experience />
      <HowIWork />
      <LeadCalculator />
      <Certifications />
      <CreativeGallery />
      <ChecksAndCall />
      <Contact />
    </main>
  );
}
