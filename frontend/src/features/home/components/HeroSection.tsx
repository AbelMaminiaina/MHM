import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

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
    title: "CE QUE VEULENT LES MALAGASY, LE NOUVEAU LIVRE DE VAL",
    ctaText: "PRÉCOMMANDEZ DÈS MAINTENANT",
    bookImage: "https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=400&h=600&fit=crop",
    showBook: true,
    backgroundImage: "/images/baobabs.jpg" // Allée des Baobabs Madagascar
  },
  {
    id: 3,
    badge: "ENGAGEMENT",
    title: "REJOIGNEZ LE MHM",
    ctaText: "J'ADHÈRE",
    bookImage: "https://images.unsplash.com/photo-1529107386315-e1a2ed48a620?w=800&h=600&fit=crop",
    showBook: false,
    backgroundImage: "/images/rizieres.jpg" // Rizières Madagascar
  },
  {
    id: 4,
    badge: "ACTION",
    title: "DÉFENDONS NOS LIBERTÉS ET NOTRE DÉMOCRATIE",
    ctaText: "JE PARTICIPE",
    bookImage: "https://images.unsplash.com/photo-1494412519320-aa613dfb7738?w=800&h=600&fit=crop",
    showBook: false,
    backgroundImage: "/images/antananarivo.jpg" // Antananarivo Madagascar
  },
  {
    id: 5,
    badge: "ACTUALITÉ",
    title: "SUIVEZ TOUTE L'ACTUALITÉ DU MADAGASIKARA HOAN'NY MALAGASY (MHM)",
    ctaText: "EN SAVOIR PLUS",
    bookImage: "https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=800&h=600&fit=crop",
    showBook: false,
    backgroundImage: "/images/tsingy.jpg" // Tsingy de Bemaraha
  },
  {
    id: 6,
    badge: "PROJET",
    title: "DÉCOUVREZ NOTRE PROJET POUR LA MADAGASIKARA",
    ctaText: "VOIR LE PROJET",
    bookImage: "https://images.unsplash.com/photo-1541872703-74c5e44368f9?w=800&h=600&fit=crop",
    showBook: false,
    backgroundImage: "/images/nosy-be.jpg" // Nosy Be - Plages
  },
  {
    id: 7,
    badge: "SOUTIEN",
    title: "SOUTENEZ VALOHERY ET LE MADAGASIKARA HOAN'NY MALAGASY (MHM)",
    ctaText: "JE SOUTIENS",
    bookImage: "https://images.unsplash.com/photo-1517048676732-d65bc937f952?w=800&h=600&fit=crop",
    showBook: false,
    backgroundImage: "/images/sud-madagascar.jpg" // Sud de Madagascar
  },
];

export const HeroSection = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isFirstLoad, setIsFirstLoad] = useState(true);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    // Détection de la préférence utilisateur pour les animations réduites
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mediaQuery.matches);

    const handleChange = (e: MediaQueryListEvent) => {
      setPrefersReducedMotion(e.matches);
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 13000);

    // Désactiver l'animation d'entrée après le premier chargement
    const firstLoadTimer = setTimeout(() => {
      setIsFirstLoad(false);
    }, 2000);

    return () => {
      clearInterval(timer);
      clearTimeout(firstLoadTimer);
    };
  }, []);

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
  };

  const slide = slides[currentSlide];

  // Durées et configurations d'animation
  const animationDuration = prefersReducedMotion ? 0.3 : 1.5;
  const appleEase = [0.25, 0.1, 0.25, 1] as const;

  return (
    <section className="relative w-full px-4 md:px-8">
      {/* Hero Principal - Largeur limitée et centrée */}
      <div className="relative max-w-7xl mx-auto min-h-[450px] lg:min-h-[500px] rounded-lg overflow-hidden">
        {/* Partie Droite - Zone avec Image de fond (En arrière-plan) */}
        <motion.div
          key={`background-${currentSlide}`}
          className="absolute right-0 top-0 lg:top-2 bottom-0 md:bottom-10 lg:bottom-16 w-full md:w-[70%] lg:w-[90%] bg-cover bg-center transition-all duration-700"
          style={{ backgroundImage: `url(${slide.backgroundImage})` }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ opacity: { duration: 0.8, ease: appleEase } }}
        >
        </motion.div>

        {/* Partie Gauche - Zone Blanche avec Accents Rouge (Superposée) */}
        <motion.div
          key={`content-${currentSlide}`}
          className="relative z-30 w-full lg:w-[50%] h-[450px] lg:h-[320px] bg-white/95 lg:bg-white border-l-8 border-red-600 shadow-2xl flex flex-col px-6 md:px-12 lg:px-16 xl:px-20 pt-4 lg:pt-5 pb-24 lg:pb-20 my-0 lg:my-16"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, ease: appleEase }}
        >
          {/* Badge Rouge - En haut */}
          <div className="w-full mb-6 lg:mb-8 flex justify-center">
            <div className="inline-block bg-red-600 text-white px-6 py-2.5 text-sm font-bold uppercase shadow-lg">
              {slide.badge}
            </div>
          </div>

          {/* Titre Principal - Centré verticalement */}
          <div className="w-full flex-1 flex items-center justify-center">
            <h1 className="text-gray-900 text-xl md:text-2xl lg:text-4xl xl:text-2xl font-black leading-tight uppercase text-center">
              {slide.title}
            </h1>
          </div>

          {/* Bouton CTA - En bas fixe */}
          <div className="absolute bottom-4 lg:bottom-5 left-0 right-0 flex justify-center px-6">
            <button className="bg-red-600 text-white px-8 md:px-10 py-2 md:py-2.5 text-sm md:text-base lg:text-lg font-bold uppercase shadow-xl cursor-pointer hover:bg-red-700 transition-all duration-300 ease-in-out transform hover:scale-105">
              {slide.ctaText}
            </button>
          </div>
        </motion.div>

        {/* Ligne lumineuse au centre (glow effect) - Uniquement au premier chargement */}
        {isFirstLoad && !prefersReducedMotion && (
          <motion.div
            className="absolute left-[25%] md:left-[35%] lg:left-1/2 top-0 h-full w-px hidden md:block"
            initial={{ opacity: 0, scaleY: 0 }}
            animate={{ opacity: [0, 1, 0.7, 0], scaleY: [0, 1, 1, 1] }}
            transition={{
              duration: animationDuration * 0.8,
              ease: 'easeOut',
              delay: 0.3,
            }}
          >
            {/* Ligne centrale */}
            <div className="absolute inset-0 bg-white/60" />

            {/* Glow effect */}
            <div className="absolute inset-0 bg-white/40 blur-sm w-2 -translate-x-1/2" />
            <div className="absolute inset-0 bg-white/20 blur-md w-4 -translate-x-1/2" />
            <div className="absolute inset-0 bg-white/10 blur-lg w-8 -translate-x-1/2" />
          </motion.div>
        )}
      </div> 

      {/* Indicateurs de Slides */}
      <div className="relative lg:absolute bottom-0 lg:bottom-12 left-0 lg:left-1/2 lg:-translate-x-1/2 flex justify-center gap-3 z-20 py-4 lg:py-0">
        {slides.map((_, index) => (
          <button
            key={index}
            className={`h-2 ${
              index === currentSlide
                ? 'w-10 bg-red-600'
                : 'w-10 bg-red-200 hover:bg-red-300'
            }`}
            onClick={() => goToSlide(index)}
            aria-label={`Aller au slide ${index + 1}`}
          />
        ))}
      </div>
    </section>
  );
};
