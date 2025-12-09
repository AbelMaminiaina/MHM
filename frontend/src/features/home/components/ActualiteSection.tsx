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
      image: 'https://source.unsplash.com/400x300/?madagascar,politics',
      category: 'COMMUNIQUÉS',
      title: "Madagascar : Le mouvement MHM appelle à la souveraineté nationale et à la défense des valeurs malagasy",
      author: 'Bureau Exécutif MHM',
      date: '27 octobre 2025',
      size: 'normal'
    },
    {
      id: 2,
      type: 'image',
      image: 'https://source.unsplash.com/400x300/?madagascar,nature',
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
      image: 'https://source.unsplash.com/400x300/?agriculture,farming',
      category: 'COMMUNIQUÉS',
      title: "Agriculture et sécurité alimentaire : Le MHM propose un plan de valorisation des producteurs locaux",
      author: 'Val',
      date: '23 octobre 2025',
      size: 'normal'
    },
    {
      id: 6,
      type: 'image',
      image: 'https://source.unsplash.com/400x300/?education,school',
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
          {newsItems.map((item, index) => (
            <motion.div
              key={item.id}
              className="group cursor-pointer"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{ y: -8, transition: { duration: 0.3 } }}
            >
              {/* Image/Video Container */}
              <motion.div
                className="relative overflow-hidden mb-3 rounded-lg shadow-lg"
                whileHover={item.type === 'video' ? {
                  scale: 1.03,
                  boxShadow: "0 20px 40px rgba(153, 27, 27, 0.3)",
                  transition: { duration: 0.3 }
                } : {
                  scale: 1.02,
                  boxShadow: "0 15px 30px rgba(220, 38, 38, 0.2)",
                  transition: { duration: 0.3 }
                }}
              >
                {item.type === 'video' ? (
                  <div className="relative">
                    {/* Desktop: toujours afficher l'iframe */}
                    <motion.div
                      className="hidden md:block"
                      whileHover={{ scale: 1.02 }}
                      transition={{ duration: 0.3 }}
                    >
                      <iframe
                        src={item.videoUrl?.replace('watch?v=', 'embed/')}
                        title={item.title}
                        frameBorder="0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                        className="w-full aspect-video"
                      ></iframe>
                      {/* Animation pulse sur vidéo au hover */}
                      <motion.div
                        className="absolute top-2 right-2 bg-red-700 text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg"
                        initial={{ scale: 1 }}
                        whileHover={{ scale: 1.1 }}
                        animate={{ scale: [1, 1.05, 1] }}
                        transition={{ duration: 2, repeat: Infinity }}
                      >
                        ▶ VIDÉO
                      </motion.div>
                    </motion.div>

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
                        <motion.button
                          onClick={() => setPlayingVideo(item.id)}
                          className="relative w-full block"
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          <img
                            src={item.thumbnail}
                            alt={item.title}
                            className="w-full aspect-video object-cover"
                          />
                          {/* Play Button Overlay */}
                          <div className="absolute inset-0 flex items-center justify-center bg-black/20">
                            <motion.div
                              className="w-16 h-16 bg-red-700 rounded-full flex items-center justify-center shadow-lg"
                              animate={{ scale: [1, 1.1, 1] }}
                              transition={{ duration: 1.5, repeat: Infinity }}
                            >
                              <svg className="w-8 h-8 text-white ml-1" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M8 5v14l11-7z"/>
                              </svg>
                            </motion.div>
                          </div>
                        </motion.button>
                      )}
                    </div>
                  </div>
                ) : (
                  <motion.img
                    src={item.image}
                    alt={item.title}
                    className="w-full aspect-video object-cover"
                    whileHover={{ scale: 1.1 }}
                    transition={{ duration: 0.4 }}
                  />
                )}
              </motion.div>

              {/* Content */}
              <motion.div
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
              >
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
                  <p className="text-xs text-gray-600 mb-2 line-clamp-2">
                    {item.description}
                  </p>
                )}

                {/* Author and Date */}
                <div className="text-xs text-gray-600">
                  <p className="font-semibold">{item.author}</p>
                  <p className="text-xs">{item.date}</p>
                </div>
              </motion.div>
            </motion.div>
          ))}
        </div>

        {/* View More Button */}
        <motion.div
          className="text-center mt-8 sm:mt-10 lg:mt-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <motion.button
            className="bg-red-800 text-white px-6 sm:px-8 py-2.5 sm:py-3 text-sm sm:text-base font-bold uppercase hover:bg-red-900 transition-colors rounded-lg"
            whileHover={{ scale: 1.05, boxShadow: "0 10px 30px rgba(153, 27, 27, 0.4)" }}
            whileTap={{ scale: 0.95 }}
          >
            Voir plus d'actualités
          </motion.button>
        </motion.div>
      </div>
    </section>
  );
};
