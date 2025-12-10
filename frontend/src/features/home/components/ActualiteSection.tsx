import { useState } from 'react';
import { motion } from 'framer-motion';

interface NewsItem {
  id: number;
  type: 'image' | 'video';
  image?: string;
  thumbnail?: string;
  category: string;
  title: string;
  description?: string;
  author: string;
  date: string;
  duration?: string;
  size: string;
  videoUrl?: string;
}

export const ActualiteSection = () => {
  const [playingVideo, setPlayingVideo] = useState<number | null>(null);

  const newsItems: NewsItem[] = [
    {
      id: 1,
      type: 'image',
      image: '/images/antananarivo.jpg',
      category: 'COMMUNIQUÉS',
      title: "Madagascar : Le mouvement MHM appelle à la souveraineté nationale et à la défense des valeurs malagasy",
      author: 'Bureau Exécutif MHM',
      date: '27 octobre 2025',
      size: 'normal'
    },
    {
      id: 2,
      type: 'image',
      image: '/images/tsingy.jpg',
      category: 'COMMUNIQUÉS',
      title: "Développement durable : Le MHM présente son programme pour la protection de l'environnement malagasy",
      author: 'Commission Environnement',
      date: '25 octobre 2025',
      size: 'normal'
    },
    {
      id: 3,
      type: 'video',
      thumbnail: 'https://img.youtube.com/vi/0_eX_zSsfe8/maxresdefault.jpg',
      category: 'VIDÉO',
      title: "Le président du MHM présente sa vision pour Madagascar : souveraineté, développement et fierté nationale",
      description: "Découvrez la vision complète du MHM pour un Madagascar souverain, prospère et fier de son identité. Un discours inspirant pour l'avenir de notre nation.",
      author: 'Président MHM',
      date: '27 octobre 2025',
      duration: '15:32',
      size: 'large',
      videoUrl: 'https://www.youtube.com/watch?v=0_eX_zSsfe8'
    },
    {
      id: 4,
      type: 'video',
      thumbnail: 'https://img.youtube.com/vi/0_eX_zSsfe8/maxresdefault.jpg',
      category: 'VIDÉO',
      title: "Interview exclusive : La jeunesse malgache s'engage pour l'avenir de Madagascar avec le MHM",
      description: "Les jeunes leaders du MHM partagent leur engagement pour transformer Madagascar. Une génération mobilisée pour le changement et la justice sociale.",
      author: 'Porte-parole Jeunesse MHM',
      date: '26 octobre 2025',
      duration: '12:45',
      size: 'large',
      videoUrl: 'https://www.youtube.com/watch?v=0_eX_zSsfe8'
    },
    {
      id: 5,
      type: 'image',
      image: '/images/rizieres.jpg',
      category: 'COMMUNIQUÉS',
      title: "Agriculture et sécurité alimentaire : Le MHM propose un plan de valorisation des producteurs locaux",
      author: 'Val',
      date: '23 octobre 2025',
      size: 'normal'
    },
    {
      id: 6,
      type: 'image',
      image: '/images/sud-madagascar.jpg',
      category: 'COMMUNIQUÉS',
      title: "Éducation nationale : Le MHM demande la revalorisation du système éducatif malgache et la promotion du bilinguisme",
      author: 'Randrianarisoa Fidy',
      date: '20 octobre 2025',
      size: 'normal'
    }
  ];

  return (
    <section className="bg-gradient-to-b from-red-50 to-white py-8 sm:py-10 lg:py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-black uppercase mb-6 sm:mb-8 lg:mb-12 text-red-900">
          ACTUALITÉ
        </h2>

        {/* News Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 lg:gap-6 items-start">
          {newsItems.map((item) => (
            <div
              key={item.id}
              className="group cursor-pointer hover:-translate-y-2 transition-transform duration-200"
            >
              {/* Image/Video Container */}
              <div
                className="relative overflow-hidden mb-3 rounded-lg shadow-lg group-hover:shadow-xl transition-shadow duration-300"
              >
                {item.type === 'video' ? (
                  <div className="relative">
                    {/* Desktop: toujours afficher l'iframe */}
                    <div className="hidden md:block">
                      <iframe
                        src={item.videoUrl?.replace('watch?v=', 'embed/')}
                        title={item.title}
                        frameBorder="0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                        className="w-full aspect-video"
                      ></iframe>
                      {/* Badge vidéo */}
                      <div className="absolute top-2 right-2 bg-red-700 text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg">
                        ▶ VIDÉO
                      </div>
                    </div>

                    {/* Mobile: thumbnail puis iframe au clic */}
                    <div className="block md:hidden">
                      {playingVideo === item.id ? (
                        <iframe
                          src={`${item.videoUrl?.replace('watch?v=', 'embed/')}?autoplay=1`}
                          title={item.title}
                          frameBorder="0"
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                          allowFullScreen
                          className="w-full aspect-video"
                        ></iframe>
                      ) : (
                        <button
                          onClick={() => setPlayingVideo(item.id)}
                          className="relative w-full block"
                        >
                          <img
                            src={item.thumbnail}
                            alt={item.title}
                            className="w-full aspect-video object-cover"
                          />
                          {/* Play Button Overlay */}
                          <div className="absolute inset-0 flex items-center justify-center bg-black/20">
                            <div className="w-16 h-16 bg-red-700 rounded-full flex items-center justify-center shadow-lg">
                              <svg className="w-8 h-8 text-white ml-1" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M8 5v14l11-7z"/>
                              </svg>
                            </div>
                          </div>
                        </button>
                      )}
                    </div>
                  </div>
                ) : (
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-full aspect-video object-cover"
                    loading="lazy"
                  />
                )}
              </div>

              {/* Content */}
              <div>
                {/* Category Badge */}
                <div className="flex items-center gap-1.5 mb-1.5">
                  <div className="w-1.5 h-1.5 bg-red-600 rounded-full"></div>
                  <span className="text-xs font-bold uppercase text-red-900">
                    {item.category}
                  </span>
                  {item.type === 'video' && (
                    <span className="ml-auto text-xs font-semibold text-red-700">
                      ⏱ {item.duration}
                    </span>
                  )}
                </div>

                {/* Title */}
                <h3 className="text-sm font-bold text-gray-900 mb-2 line-clamp-2 group-hover:text-red-700 transition-colors">
                  {item.title}
                </h3>

                {/* Description (pour les vidéos) */}
                {item.type === 'video' && item.description && (
                  <p className="text-xs text-gray-600 mb-2 line-clamp-2 text-justify">
                    {item.description}
                  </p>
                )}

                {/* Author and Date */}
                <div className="text-xs text-gray-600">
                  <p className="font-semibold">{item.author}</p>
                  <p className="text-xs">{item.date}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* View More Button */}
        <div className="text-center mt-8 sm:mt-10 lg:mt-12">
          <button className="bg-red-800 text-white px-6 sm:px-8 py-2.5 sm:py-3 text-sm sm:text-base font-bold uppercase hover:bg-red-900 hover:shadow-lg transition-all duration-200 rounded-lg">
            Voir plus d'actualités
          </button>
        </div>
      </div>
    </section>
  );
};
