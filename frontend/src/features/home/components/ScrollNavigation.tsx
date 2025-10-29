import { useState, useEffect } from 'react';

interface ScrollNavigationProps {
  sections: Array<{
    id: string;
    label: string;
  }>;
}

export const ScrollNavigation = ({ sections }: ScrollNavigationProps) => {
  const [activeSection, setActiveSection] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const sectionElements = sections.map(section =>
        document.getElementById(section.id)
      );

      const scrollPosition = window.scrollY + window.innerHeight / 2;

      sectionElements.forEach((element, index) => {
        if (element) {
          const { offsetTop, offsetHeight } = element;
          if (scrollPosition >= offsetTop && scrollPosition < offsetTop + offsetHeight) {
            setActiveSection(index);
          }
        }
      });
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Initial check

    return () => window.removeEventListener('scroll', handleScroll);
  }, [sections]);

  const scrollToSection = (sectionId: string, index: number) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
      setActiveSection(index);
    }
  };

  return (
    <nav className="fixed right-8 top-1/2 -translate-y-1/2 z-50 hidden md:block">
      <div className="flex flex-col gap-5">
        {sections.map((section, index) => (
          <button
            key={section.id}
            className={`relative w-3 h-3 rounded-full border-2 border-white transition-all duration-300 group ${
              index === activeSection
                ? 'bg-white scale-125'
                : 'bg-white/30 hover:bg-white/60 hover:scale-110'
            }`}
            onClick={() => scrollToSection(section.id, index)}
            aria-label={`Aller à ${section.label}`}
          >
            {/* Label Tooltip */}
            <span className="absolute right-7 top-1/2 -translate-y-1/2 whitespace-nowrap bg-gray-900/90 text-white px-3 py-1.5 rounded text-sm font-medium opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity duration-300">
              {section.label}
            </span>
          </button>
        ))}
      </div>
    </nav>
  );
};
