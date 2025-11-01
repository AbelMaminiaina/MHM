import { useState, useRef } from 'react';

export const SlideSection = () => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const [activeIndex, setActiveIndex] = useState(0);

  const topCards = [
    {
      id: 1,
      subtitle: 'Pour la',
      title: 'SOUVERAINETÉ',
      description: 'Madagascar aux Malagasy',
      bgColor: 'bg-red-600'
    },
    {
      id: 2,
      subtitle: 'Pour le',
      title: 'DÉVELOPPEMENT',
      description: 'Économique et social durable',
      bgColor: 'bg-red-700'
    },
    {
      id: 3,
      subtitle: 'Pour la protection de',
      title: 'L\'ENVIRONNEMENT',
      description: 'Biodiversité et ressources naturelles',
      bgColor: 'bg-red-600'
    },
    {
      id: 4,
      subtitle: 'Pour la valorisation de',
      title: 'LA CULTURE MALAGASY',
      description: 'Langue, traditions et identité',
      bgColor: 'bg-red-700'
    },
    {
      id: 5,
      subtitle: 'Pour la valorisation de',
      title: 'LA CULTURE MALAGASY',
      description: 'Langue, traditions et identité',
      bgColor: 'bg-red-600'
    }
  ];

  const checkScrollPosition = () => {
    if (scrollContainerRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
      setCanScrollLeft(scrollLeft > 0);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);

      // Calculer l'index de la carte active
      const cardWidth = 320; // Largeur approximative d'une carte
      const currentIndex = Math.round(scrollLeft / cardWidth);
      setActiveIndex(currentIndex);
    }
  };

  const scrollToCard = (index: number) => {
    if (scrollContainerRef.current) {
      const cardWidth = 320;
      scrollContainerRef.current.scrollTo({
        left: index * cardWidth,
        behavior: 'smooth'
      });
    }
  };

  const scroll = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      const scrollAmount = 400;
      const newScrollLeft = direction === 'left'
        ? scrollContainerRef.current.scrollLeft - scrollAmount
        : scrollContainerRef.current.scrollLeft + scrollAmount;

      scrollContainerRef.current.scrollTo({
        left: newScrollLeft,
        behavior: 'smooth'
      });
    }
  };

  return (
    <section className="bg-gray-50 py-16 px-4 md:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="relative group">
          {/* Bouton gauche */}
          {canScrollLeft && (
            <button
              onClick={() => scroll('left')}
              className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white/90 hover:bg-white shadow-lg rounded-full p-3 transition-all opacity-0 group-hover:opacity-100 md:opacity-100"
              aria-label="Défiler vers la gauche"
            >
              <svg className="w-6 h-6 text-gray-800" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
          )}

          {/* Conteneur de slides avec scroll horizontal */}
          <div
            ref={scrollContainerRef}
            onScroll={checkScrollPosition}
            className="flex overflow-x-auto snap-x snap-mandatory scrollbar-hide pb-4"
            style={{
              scrollbarWidth: 'none',
              msOverflowStyle: 'none',
            }}
          >
            {topCards.map((card) => (
              <div
                key={card.id}
                className={`${card.bgColor} text-white p-6 cursor-pointer snap-start flex-shrink-0 w-[280px] md:w-[320px] transition-all duration-300 hover:scale-105 hover:shadow-2xl relative overflow-hidden group`}
              >
                {/* Overlay gradient au survol */}
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/0 via-purple-500/0 to-pink-500/0 group-hover:from-blue-500/30 group-hover:via-purple-500/30 group-hover:to-pink-500/30 transition-all duration-500"></div>

                {/* Contenu */}
                <div className="relative z-10">
                  <p className="text-xs font-semibold mb-2 group-hover:text-yellow-300 transition-colors duration-300">{card.subtitle}</p>
                  <h3 className="text-2xl md:text-3xl font-black mb-1 group-hover:scale-105 transition-transform duration-300">{card.title}</h3>
                  {card.description && (
                    <p className="text-xs font-medium group-hover:text-gray-100 transition-colors duration-300">{card.description}</p>
                  )}
                </div>

                {/* Effet de brillance au survol */}
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                  <div className="absolute top-0 -left-full h-full w-1/2 bg-gradient-to-r from-transparent via-white/20 to-transparent skew-x-12 group-hover:left-full transition-all duration-1000"></div>
                </div>
              </div>
            ))}
          </div>

          {/* Bouton droit */}
          {canScrollRight && (
            <button
              onClick={() => scroll('right')}
              className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white/90 hover:bg-white shadow-lg rounded-full p-3 transition-all opacity-0 group-hover:opacity-100 md:opacity-100"
              aria-label="Défiler vers la droite"
            >
              <svg className="w-6 h-6 text-gray-800" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          )}
        </div>

        {/* Indicateurs de carte */}
        <div className="flex justify-center gap-2 mt-6">
          {topCards.map((card, index) => (
            <button
              key={card.id}
              onClick={() => scrollToCard(index)}
              className={`transition-all duration-300 rounded-full ${
                activeIndex === index
                  ? 'w-8 h-3 bg-red-600'
                  : 'w-3 h-3 bg-gray-300 hover:bg-gray-400'
              }`}
              aria-label={`Aller à la carte ${index + 1}`}
            />
          ))}
        </div>
      </div>

      <style>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </section>
  );
}