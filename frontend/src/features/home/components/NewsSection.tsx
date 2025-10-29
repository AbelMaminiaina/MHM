interface NewsCard {
  id: string;
  type: 'communique' | 'video';
  title: string;
  author?: string;
  date: string;
  imageUrl: string;
  videoUrl?: string;
}

const newsData: NewsCard[] = [
  {
    id: '1',
    type: 'communique',
    title: '« Budget Lecornu 2026 : Nos PME/TPE ultra-marines sacrifiées ».',
    author: 'André Rougé',
    date: '17 octobre 2025',
    imageUrl: '/images/news-1.jpg'
  },
  {
    id: '2',
    type: 'communique',
    title: 'Lecornu 2 : Le rideau de fumée de « l\'urgence pour les Outre-mer ».',
    author: 'André Rougé',
    date: '16 octobre 2025',
    imageUrl: '/images/news-2.jpg'
  },
  {
    id: '3',
    type: 'video',
    title: 'Motion de censure : le discours de Valohery en intégr...',
    date: '16 octobre 2025',
    imageUrl: '/images/news-video-1.jpg',
    videoUrl: 'https://youtube.com/watch?v=xxx'
  },
  {
    id: '4',
    type: 'video',
    title: 'Valohery sur TVM : « La censure est possible ! »',
    date: '15 octobre 2025',
    imageUrl: '/images/news-video-2.jpg',
    videoUrl: 'https://youtube.com/watch?v=xxx'
  },
  {
    id: '5',
    type: 'communique',
    title: 'Réponse institutionnelle à la crise économique et sociale calédonienne ou les incohérences du IRMAR.',
    author: 'Louis Aliot',
    date: '15 octobre 2025',
    imageUrl: '/images/news-5.jpg'
  },
  {
    id: '6',
    type: 'communique',
    title: 'La Guadeloupe frappée une nouvelle fois : la résilience ne peut plus tenir lieu de politique.',
    author: 'Rody TOLASSY',
    date: '15 octobre 2025',
    imageUrl: '/images/news-6.jpg'
  }
];

export const NewsSection = () => {
  return (
    <section className="bg-gray-50 py-20 px-10">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {newsData.map((news) => (
          <article
            key={news.id}
            className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-xl hover:-translate-y-1 transition-all duration-300 cursor-pointer group"
          >
            {/* Image */}
            <div className="relative w-full h-56 overflow-hidden bg-gray-200">
              <img
                src={news.imageUrl}
                alt={news.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
              {news.type === 'video' && (
                <div className="absolute inset-0 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <svg className="w-20 h-14" viewBox="0 0 68 48">
                    <path
                      fill="#ff0000"
                      d="M66.52 7.74c-.78-2.93-2.49-5.41-5.42-6.19C55.79.13 34 0 34 0S12.21.13 6.9 1.55c-2.93.78-4.63 3.26-5.42 6.19C.06 13.05 0 24 0 24s.06 10.95 1.48 16.26c.78 2.93 2.49 5.41 5.42 6.19C12.21 47.87 34 48 34 48s21.79-.13 27.1-1.55c2.93-.78 4.64-3.26 5.42-6.19C67.94 34.95 68 24 68 24s-.06-10.95-1.48-16.26z"
                    />
                    <path fill="#fff" d="M45 24L27 14v20" />
                  </svg>
                </div>
              )}
            </div>

            {/* Content */}
            <div className="p-6">
              <div className="flex items-center gap-2 mb-3">
                <span className="w-2 h-2 rounded-full bg-blue-600"></span>
                <span className="text-xs font-bold text-gray-600 uppercase">
                  {news.type === 'communique' ? 'COMMUNIQUÉS' : 'VIDÉO'}
                </span>
              </div>
              <h3 className="text-lg font-bold text-gray-900 leading-snug mb-3 line-clamp-3">
                {news.title}
              </h3>
              {news.author && (
                <p className="text-sm font-semibold text-gray-700 mb-2">{news.author}</p>
              )}
              <p className="text-sm text-gray-500">{news.date}</p>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
};
