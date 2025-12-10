interface AgendaEvent {
  id: string;
  day: string;
  month: string;
  time: string;
  title: string;
  category: 'Medias' | 'Evenements' | 'Deplacements';
  description: string;
  imageUrl?: string;
}

const categoryColors = {
  'Medias': 'bg-pink-600',
  'Evenements': 'bg-red-600',
  'Deplacements': 'bg-pink-700'
};

const agendaData: AgendaEvent[] = [
  {
    id: '1',
    day: '28',
    month: 'OCTOBRE',
    time: '07H45',
    title: 'VAL SUR MADAGASIKARA INFO',
    category: 'Medias',
    description: 'Val sera l\'invité de Madagasikara Info mardi 28 octobre à 7h45.',
    imageUrl: '/images/antananarivo.jpg'
  },
  {
    id: '2',
    day: '29',
    month: 'OCTOBRE',
    time: '10H30',
    title: 'Val SUR TVM',
    category: 'Medias',
    description: 'Valohery sera l\'invité de TVM mercredi 29 octobre à 10h30.',
    imageUrl: '/images/baobabs.jpg'
  },
  {
    id: '3',
    day: '29',
    month: 'OCTOBRE',
    time: '12H00',
    title: '« CE QUE VEULENT LES MALAGASY »',
    category: 'Evenements',
    description: '« Ce que veulent les Malagasy » : précommandez dès maintenant le nouveau livre de Valohery',
    imageUrl: '/images/lakana.jpg'
  },
  {
    id: '4',
    day: '29',
    month: 'OCTOBRE',
    time: '18H00',
    title: 'SÉANCE DE DÉDICACES À VELIZY',
    category: 'Deplacements',
    description: 'Séance de dédicaces du nouveau livre de Valohery',
    imageUrl: '/images/nosy-be.jpg'
  }
];

const actionItems = [
  {
    id: '1',
    title: 'MILITER',
    description: 'Rejoignez le mouvement',
    color: 'from-red-600 to-red-800',
    imageUrl: '/images/rizieres.jpg',
    link: '#'
  },
  {
    id: '2',
    title: 'FAIRE UN DON',
    description: 'Soutenez nos actions',
    color: 'from-pink-600 to-pink-800',
    imageUrl: '/images/tsingy.jpg',
    link: '#'
  },
  {
    id: '3',
    title: 'ADHÉRER',
    description: 'Devenez membre HFM',
    color: 'from-rose-600 to-rose-800',
    imageUrl: '/images/sud-madagascar.jpg',
    link: '#'
  },
  {
    id: '4',
    title: 'PROJET',
    description: 'Découvrez notre vision',
    color: 'from-red-700 to-red-900',
    imageUrl: '/images/baobabs1.jpg',
    link: '#'
  }
];

export const AgendaSection = () => {
  return (
    <section className="bg-gradient-to-b from-pink-50 to-white py-8 sm:py-10 lg:py-12 px-4 sm:px-6 lg:px-10">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-12 lg:gap-16">
        {/* Left - Agenda */}
        <div>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-pink-900 mb-6 sm:mb-8 lg:mb-10 uppercase">
            AGENDA
          </h2>
          <div className="space-y-3 sm:space-y-4">
            {agendaData.map((event) => (
              <div
                key={event.id}
                className="flex flex-col sm:flex-row gap-3 sm:gap-5 p-4 sm:p-5 rounded-xl border-2 border-pink-100 hover:border-pink-400 bg-white hover:bg-gradient-to-r hover:from-pink-50 hover:to-white transition-all duration-200 shadow-sm hover:shadow-lg cursor-pointer"
              >
                {/* Date */}
                <div className="flex-shrink-0 text-center w-full sm:min-w-[100px] sm:w-auto bg-gradient-to-br from-pink-600 to-pink-800 text-white rounded-lg p-3 sm:p-4 shadow-md">
                  <div className="text-3xl sm:text-4xl font-black leading-none">
                    {event.day}
                  </div>
                  <div className="text-xs font-bold uppercase mt-1 opacity-90">
                    {event.month}
                  </div>
                  <div className="text-sm font-bold mt-2 bg-white/20 px-2 py-1 rounded">
                    {event.time}
                  </div>
                </div>

                {/* Details */}
                <div className="flex gap-3 sm:gap-5 flex-1">
                  {event.imageUrl && (
                    <div className="relative overflow-hidden rounded-lg flex-shrink-0 shadow-md w-20 h-20 sm:w-24 sm:h-24">
                      <img
                        src={event.imageUrl}
                        alt={event.title}
                        className="w-full h-full object-cover"
                        loading="lazy"
                      />
                    </div>
                  )}
                  <div className="flex-1">
                    <h3 className="text-base sm:text-lg font-black text-gray-900 mb-2 uppercase">
                      {event.title}
                    </h3>
                    <span className={`inline-flex items-center gap-1 text-xs font-bold text-white px-2.5 sm:px-3 py-1 rounded-full mb-2 sm:mb-3 ${categoryColors[event.category]}`}>
                      {event.category}
                    </span>
                    <p className="text-xs sm:text-sm text-gray-700 leading-relaxed text-justify">
                      {event.description}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right - Actions */}
        <div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
            {actionItems.map((action, index) => (
              <a
                key={action.id}
                href={action.link}
                className="relative min-h-[240px] sm:h-64 rounded-xl sm:rounded-2xl overflow-hidden group cursor-pointer shadow-xl hover:shadow-2xl border-2 border-transparent hover:border-white transition-all duration-200"
              >
                {/* Image de fond */}
                <img
                  src={action.imageUrl}
                  alt={action.title}
                  className="absolute inset-0 w-full h-full object-cover"
                  loading={index < 2 ? "eager" : "lazy"}
                  decoding="async"
                />
                {/* Gradient overlay avec couleur dynamique */}
                <div className={`absolute inset-0 bg-gradient-to-br ${action.color} opacity-60 group-hover:opacity-75 transition-opacity duration-200`} />

                {/* Contenu */}
                <div className="absolute inset-0 flex flex-col items-center justify-center p-4 sm:p-6">
                  {/* Titre */}
                  <h3 className="text-white text-xl sm:text-2xl lg:text-3xl font-black text-center uppercase drop-shadow-2xl mb-2 sm:mb-3">
                    {action.title}
                  </h3>

                  {/* Description qui apparaît au hover */}
                  <p className="text-white text-xs sm:text-sm font-bold text-center opacity-0 group-hover:opacity-100 transition-opacity duration-200 bg-black/40 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full backdrop-blur-sm">
                    {action.description}
                  </p>
                </div>

                {/* Flèche d'action */}
                <div className="absolute bottom-3 right-3 sm:bottom-4 sm:right-4 bg-white text-gray-900 w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center font-black text-lg sm:text-xl opacity-0 group-hover:opacity-100 transition-opacity duration-200 shadow-2xl">
                  →
                </div>
              </a>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
