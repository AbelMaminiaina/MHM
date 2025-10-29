import { Navbar } from './Navbar';
import { HeroSection } from './HeroSection';

export const HomePage = () => {
  return (
    <div className="w-full overflow-x-hidden">
      <Navbar />
      <HeroSection />
    </div>
  );
};
