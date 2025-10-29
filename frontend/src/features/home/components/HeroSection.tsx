import { useState, useEffect } from 'react';

interface Slide {
  id: number;
  badge: string;
  title: string;
  ctaText: string;
  bookImage: string;
  showBook: boolean;
  backgroundImage: string;
}

const slides: Slide[] = [
  {
    id: 1,
    badge: "SORTIE LE 29 OCTOBRE",
    title: "CE QUE VEULENT LES MALGACHES, LE NOUVEAU LIVRE DE VAL",
    ctaText: "PRÉCOMMANDEZ DÈS MAINTENANT",
    bookImage: "https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=400&h=600&fit=crop",
    showBook: true,
    backgroundImage: "/images/allee-baobabs.jpg" // Allée des Baobabs Madagascar
  },
  {
    id: 3,
    badge: "ENGAGEMENT",
    title: "REJOIGNEZ LE MHM",
    ctaText: "J'ADHÈRE",
    bookImage: "https://images.unsplash.com/photo-1529107386315-e1a2ed48a620?w=800&h=600&fit=crop",
    showBook: false,
    backgroundImage: "/images/tsingy-bemaraha.jpg" // Tsingy de Bemaraha Madagascar
  },
  {
    id: 4,
    badge: "ACTION",
    title: "DÉFENDONS NOS LIBERTÉS ET NOTRE DÉMOCRATIE",
    ctaText: "JE PARTICIPE",
    bookImage: "https://images.unsplash.com/photo-1494412519320-aa613dfb7738?w=800&h=600&fit=crop",
    showBook: false,
    backgroundImage: "/images/nosy-be.jpg" // Nosy Be - Plages paradisiaques Madagascar
  },
  {
    id: 5,
    badge: "ACTUALITÉ",
    title: "SUIVEZ TOUTE L'ACTUALITÉ DU MADAGASIKARA HOAN'NY MALAGASY (MHM)",
    ctaText: "EN SAVOIR PLUS",
    bookImage: "https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=800&h=600&fit=crop",
    showBook: false,
    backgroundImage: "/images/rova-manjakamiadana.jpg" // Rova Manjakamiadana - Palais Royal Antananarivo
  },
  {
    id: 6,
    badge: "PROJET",
    title: "DÉCOUVREZ NOTRE PROJET POUR LA MADAGASIKARA",
    ctaText: "VOIR LE PROJET",
    bookImage: "https://images.unsplash.com/photo-1541872703-74c5e44368f9?w=800&h=600&fit=crop",
    showBook: false,
    backgroundImage: "/images/sud-madagascar.jpg" // Sud de Madagascar - Paysages arides
  },
  {
    id: 7,
    badge: "SOUTIEN",
    title: "SOUTENEZ VALOHERY ET LE MADAGASIKARA HOAN'NY MALAGASY (MHM)",
    ctaText: "JE SOUTIENS",
    bookImage: "https://images.unsplash.com/photo-1517048676732-d65bc937f952?w=800&h=600&fit=crop",
    showBook: false,
    backgroundImage: "/images/rizieres-madagascar.jpg" // Rizières en terrasses Madagascar
  },
];

export const HeroSection = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);

    return () => clearInterval(timer);
  }, []);

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
  };

  const slide = slides[currentSlide];

  return (
    <section className="relative w-full px-4 md:px-8">
      {/* Hero Principal - Largeur limitée et centrée */}
      <div className="relative max-w-7xl mx-auto min-h-[450px] lg:min-h-[500px] rounded-lg overflow-hidden">
        {/* Partie Droite - Zone avec Image de fond (En arrière-plan) */}
        <div
          className="absolute right-0 top-0 lg:top-2 bottom-0 md:bottom-10 lg:bottom-16 w-full md:w-[70%] lg:w-[90%] bg-cover bg-right flex items-center justify-center md:justify-end px-6 lg:px-8 transition-all duration-700"
          style={{ backgroundImage: `linear-gradient(to right, rgba(0,0,0,0.6), rgba(0,0,0,0.3)), url(${slide.backgroundImage})` }}
        >
          {/* Image réelle pour tous les slides */}
          <div className="relative z-20 w-full h-full max-w-[200px] md:max-w-[280px] lg:max-w-[320px] flex items-center py-4 lg:py-6 animate-slide-up">
            <div className="aspect-[2/3] w-full max-h-full">
              <img
                src={slide.bookImage}
                alt={slide.title}
                className="w-full h-full rounded-lg shadow-2xl object-cover"
              />
            </div>
          </div>
        </div>

        {/* Partie Gauche - Zone Teal avec Texte (Superposée) */}
        <div className="relative z-30 w-full lg:w-[50%] h-[450px] lg:h-[320px] bg-gradient-to-br from-[#115e59]/80 via-[#0f766e]/80 to-[#14b8a6]/80 lg:from-[#115e59] lg:via-[#0f766e] lg:to-[#14b8a6] flex flex-col px-6 md:px-12 lg:px-16 xl:px-20 pt-4 lg:pt-5 pb-24 lg:pb-20 my-0 lg:my-16">
          {/* Badge Rouge - En haut */}
          <div className="w-full mb-6 lg:mb-8 flex justify-center">
            <div className="inline-block bg-red-600 text-white px-6 py-2.5 text-sm font-bold uppercase shadow-lg">
              {slide.badge}
            </div>
          </div>

          {/* Titre Principal - Centré verticalement */}
          <div className="w-full flex-1 flex items-center justify-center animate-fade-in">
            <h1 className="text-white text-xl md:text-2xl lg:text-4xl xl:text-2xl font-black leading-tight uppercase text-center">
              {slide.title}
            </h1>
          </div>

          {/* Bouton CTA - En bas fixe */}
          <div className="absolute bottom-4 lg:bottom-5 left-0 right-0 flex justify-center px-6">
            <button className="bg-white text-[#115e59] px-8 md:px-10 py-2 md:py-2.5 text-sm md:text-base lg:text-lg font-bold uppercase shadow-xl cursor-pointer hover:bg-[#115e59] hover:text-white transition-all duration-300 ease-in-out transform hover:scale-105">
              {slide.ctaText}
            </button>
          </div>
        </div>
      </div> 

      {/* Indicateurs de Slides */}
      <div className="relative lg:absolute bottom-0 lg:bottom-12 left-0 lg:left-1/2 lg:-translate-x-1/2 flex justify-center gap-3 z-20 py-4 lg:py-0">
        {slides.map((_, index) => (
          <button
            key={index}
            className={`h-2 transition-all duration-300 ${
              index === currentSlide
                ? 'w-10 bg-[#115e59]'
                : 'w-10 bg-teal-200 hover:bg-teal-300'
            }`}
            onClick={() => goToSlide(index)}
            aria-label={`Aller au slide ${index + 1}`}
          />
        ))}
      </div>
    </section>
  );
};
