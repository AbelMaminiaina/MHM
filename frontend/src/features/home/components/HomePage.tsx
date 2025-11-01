import { Navbar } from './Navbar';
import { HeroSection } from './HeroSection';
import { ActualiteSection } from './ActualiteSection';
import { AgendaSection } from './AgendaSection';
import { SlideSection } from "./SlideSection";
import { MapSection } from './MapSection';
import { CallToActionSection } from './CallToActionSection';
import { NewsletterSignup } from './NewsletterSignup';
import { Footer } from './Footer';

export const HomePage = () => {
  return (
    <div className="w-full overflow-x-hidden">
      <Navbar />
      <HeroSection />
      <CallToActionSection />
      <ActualiteSection />
      <AgendaSection />
      <SlideSection />
      <MapSection />      
      <NewsletterSignup />
      <Footer />
    </div>
  );
};
