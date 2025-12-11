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
    title: "REJOIGNEZ LE HFM",
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
    title: "SUIVEZ TOUTE L'ACTUALITÉ DU HO AN'NY FAHAFAHAN'I MADAGASIKARA (HFM)",
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
    title: "SOUTENEZ VALOHERY ET LE HO AN'NY FAHAFAHAN'I MADAGASIKARA (HFM)",
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
    }, 3000);

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

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
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
          className="absolute inset-0 bg-cover bg-center transition-all duration-700"
          style={{ backgroundImage: `url(${slide.backgroundImage})` }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ opacity: { duration: 0.8, ease: appleEase } }}
        >
          {/* Overlay pour améliorer la lisibilité du texte en mobile */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/30 to-black/50 lg:bg-transparent"></div>
        </motion.div>

        {/* Partie Gauche - Zone Blanche avec Accents Rouge (Superposée) */}
        <motion.div
          key={`content-${currentSlide}`}
          className="relative z-30 w-full lg:w-[40%] h-[450px] lg:h-[320px] border-l-8 border-red-600 lg:border-l-8 lg:border-l-red-600 lg:border-r lg:border-t lg:border-b lg:border-white/60 lg:shadow-2xl lg:rounded-lg flex flex-col px-6 md:px-12 lg:px-12 xl:px-16 pt-4 lg:pt-5 pb-24 lg:pb-20 my-0 lg:my-16 lg:ml-12 overflow-hidden"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, ease: appleEase }}
        >
          {/* Fond dégradé sombre pour la lisibilité du texte blanc */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/20 to-black/40 -z-10"></div>

          {/* Badge Rouge - En haut */}
          <div className="w-full mb-6 lg:mb-8 flex justify-center">
            <div className="inline-block bg-red-600 text-white px-6 py-2.5 text-sm font-bold uppercase shadow-2xl rounded-md">
              {slide.badge}
            </div>
          </div>

          {/* Titre Principal - Centré verticalement */}
          <div className="w-full flex-1 flex items-center justify-center">
            <h1 className="text-white text-xl md:text-2xl lg:text-4xl xl:text-2xl font-black leading-tight uppercase text-center drop-shadow-2xl">
              {slide.title}
            </h1>
          </div>

          {/* Bouton CTA - En bas fixe */}
          <div className="absolute bottom-4 lg:bottom-5 left-0 right-0 flex justify-center px-6">
            <button className="bg-red-600 text-white px-8 md:px-10 py-3 md:py-3.5 text-sm md:text-base lg:text-lg font-bold uppercase shadow-2xl rounded-lg cursor-pointer hover:bg-red-700 hover:shadow-[0_0_30px_rgba(220,38,38,0.6)] transition-all duration-300 ease-in-out transform hover:scale-105">
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

      {/* Boutons de Navigation - Précédent */}
      <button
        onClick={prevSlide}
        className="absolute left-4 lg:left-8 top-1/2 -translate-y-1/2 z-40 bg-white/90 hover:bg-white text-gray-800 p-3 lg:p-4 rounded-full shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-110 group backdrop-blur-sm"
        aria-label="Slide précédent"
      >
        <svg
          className="w-5 h-5 lg:w-6 lg:h-6 transform group-hover:-translate-x-1 transition-transform duration-300"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
        </svg>
      </button>

      {/* Boutons de Navigation - Suivant */}
      <button
        onClick={nextSlide}
        className="absolute right-4 lg:right-8 top-1/2 -translate-y-1/2 z-40 bg-white/90 hover:bg-white text-gray-800 p-3 lg:p-4 rounded-full shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-110 group backdrop-blur-sm"
        aria-label="Slide suivant"
      >
        <svg
          className="w-5 h-5 lg:w-6 lg:h-6 transform group-hover:translate-x-1 transition-transform duration-300"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
        </svg>
      </button>

      {/* Indicateurs de Slides Modernisés */}
      <div className="relative lg:absolute bottom-0 lg:bottom-12 left-0 lg:left-1/2 lg:-translate-x-1/2 flex justify-center items-center gap-2 z-20 py-4 lg:py-0">
        {slides.map((_, index) => (
          <button
            key={index}
            className="group relative"
            onClick={() => goToSlide(index)}
            aria-label={`Aller au slide ${index + 1}`}
          >
            {/* Cercle indicateur */}
            <div className={`relative transition-all duration-300 ${
              index === currentSlide
                ? 'w-4 h-4 lg:w-5 lg:h-5'
                : 'w-3 h-3 lg:w-4 lg:h-4'
            }`}>
              {/* Point indicateur */}
              <div className={`w-full h-full rounded-full transition-all duration-300 ${
                index === currentSlide
                  ? 'bg-red-600 shadow-lg shadow-red-600/50'
                  : 'bg-gray-400 lg:bg-white/70 hover:bg-gray-500 lg:hover:bg-white hover:shadow-md backdrop-blur-sm'
              }`} />
            </div>

            {/* Tooltip au survol */}
            <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 bg-gray-900 text-white text-xs px-3 py-1.5 rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap pointer-events-none">
              {slides[index].badge}
            </div>
          </button>
        ))}
      </div>

      {/* Style pour l'animation de progression */}
      <style>{`
        @keyframes progress {
          from {
            stroke-dashoffset: 283;
          }
          to {
            stroke-dashoffset: 0;
          }
        }
      `}</style>
    </section>
  );
};
