import { useState } from 'react';

export const ActualiteSection = () => {
  const [playingVideo, setPlayingVideo] = useState<number | null>(null);

  const newsItems = [
    {
      id: 1,
      type: 'image',
      image: 'https://images.unsplash.com/photo-1589139663095-034ec884b46c?w=400&h=300&fit=crop',
      category: 'COMMUNIQUÉS',
      title: "Madagascar : Le mouvement MHM appelle à la souveraineté nationale et à la défense des valeurs malagasy",
      author: 'Bureau Exécutif MHM',
      date: '27 octobre 2025',
      size: 'normal'
    },
    {
      id: 2,
      type: 'image',
      image: 'https://images.unsplash.com/photo-1590420338487-d32d2e8d9170?w=400&h=300&fit=crop',
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
      author: 'Président MHM',
      date: '27 octobre 2025',
      size: 'large',
      videoUrl: 'https://www.youtube.com/watch?v=0_eX_zSsfe8'
    },
    {
      id: 4,
      type: 'video',
      thumbnail: 'https://img.youtube.com/vi/0_eX_zSsfe8/maxresdefault.jpg',
      category: 'VIDÉO',
      title: "Interview exclusive : La jeunesse malgache s'engage pour l'avenir de Madagascar avec le MHM",
      author: 'Porte-parole Jeunesse MHM',
      date: '26 octobre 2025',
      size: 'large',
      videoUrl: 'https://www.youtube.com/watch?v=0_eX_zSsfe8'
    },
    {
      id: 5,
      type: 'image',
      image: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=400&h=300&fit=crop',
      category: 'COMMUNIQUÉS',
      title: "Agriculture et sécurité alimentaire : Le MHM propose un plan de valorisation des producteurs locaux",
      author: 'Val',
      date: '23 octobre 2025',
      size: 'normal'
    },
    {
      id: 6,
      type: 'image',
      image: 'https://images.unsplash.com/photo-1609137144813-7d9921338f24?w=400&h=300&fit=crop',
      category: 'COMMUNIQUÉS',
      title: "Éducation nationale : Le MHM demande la revalorisation du système éducatif malgache et la promotion du bilinguisme",
      author: 'Randrianarisoa Fidy',
      date: '20 octobre 2025',
      size: 'normal'
    }
  ];

  return (
    <section className="bg-white py-8 px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <h2 className="text-3xl md:text-4xl font-black uppercase mb-12 text-gray-900">
          ACTUALITÉ
        </h2>

        {/* News Grid */}
        <div className="grid grid-cols-3 gap-6 items-start">
          {newsItems.map((item) => (
            <div
              key={item.id}
              className="group cursor-pointer"
            >
              {/* Image/Video Container */}
              <div className="relative overflow-hidden mb-3">
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
                            <div className="w-16 h-16 bg-red-600 rounded-full flex items-center justify-center">
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
                    className="w-full aspect-video object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                )}
              </div>

              {/* Content */}
              {item.type !== 'video' && (
                <div>
                  {/* Category Badge */}
                  <div className="flex items-center gap-1.5 mb-1.5">
                    <div className="w-1.5 h-1.5 bg-gray-900 rounded-full"></div>
                    <span className="text-xs font-bold uppercase text-gray-900">
                      {item.category}
                    </span>
                  </div>

                  {/* Title */}
                  <h3 className="text-sm font-bold text-gray-900 mb-2 line-clamp-2 group-hover:text-blue-700 transition-colors">
                    {item.title}
                  </h3>

                  {/* Author and Date */}
                  <div className="text-xs text-gray-600">
                    <p className="font-semibold">{item.author}</p>
                    <p className="text-xs">{item.date}</p>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* View More Button */}
        <div className="text-center mt-12">
          <button className="bg-gray-900 text-white px-8 py-3 font-bold uppercase hover:bg-gray-800 transition-colors">
            Voir plus d'actualités
          </button>
        </div>
      </div>
    </section>
  );
};
