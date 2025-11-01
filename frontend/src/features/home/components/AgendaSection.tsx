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

const agendaData: AgendaEvent[] = [
  {
    id: '1',
    day: '28',
    month: 'OCTOBRE',
    time: '07H45',
    title: 'VAL SUR MADAGASIKARA INFO',
    category: 'Medias',
    description: 'Val sera l\'invité de Madagasikara Info mardi 28 octobre à 7h45.',
    imageUrl: '/images/jacobelli.jpg'
  },
  {
    id: '2',
    day: '29',
    month: 'OCTOBRE',
    time: '10H30',
    title: 'Val SUR TVM',
    category: 'Medias',
    description: 'Valohery sera l\'invité de TVM mercredi 29 octobre à 10h30.',
    imageUrl: '/images/val-tvm.jpg'
  },
  {
    id: '3',
    day: '29',
    month: 'OCTOBRE',
    time: '12H00',
    title: '« CE QUE VEULENT LES MALAGASY »',
    category: 'Evenements',
    description: '« Ce que veulent les Malagasy » : précommandez dès maintenant le nouveau livre de Valohery',
    imageUrl: '/images/book-event.jpg'
  },
  {
    id: '4',
    day: '29',
    month: 'OCTOBRE',
    time: '18H00',
    title: 'SÉANCE DE DÉDICACES À VELIZY',
    category: 'Deplacements',
    description: 'Séance de dédicaces du nouveau livre de Valohery',
    imageUrl: '/images/book-signing.jpg'
  }
];

const actionItems = [
  { id: '1', title: 'MILITER', imageUrl: '/images/action-militer.jpg', link: '#' },
  { id: '2', title: 'FAIRE UN DON', imageUrl: '/images/action-don.jpg', link: '#' },
  { id: '3', title: 'ADHÉRER', imageUrl: '/images/action-adherer.jpg', link: '#' },
  { id: '4', title: 'PROJET', imageUrl: '/images/action-projet.jpg', link: '#' }
];

export const AgendaSection = () => {
  return (
    <section className="bg-white py-8 px-10">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16">
        {/* Left - Agenda */}
        <div>
          <h2 className="text-3xl md:text-4xl font-black text-gray-900 mb-10 uppercase">
            AGENDA
          </h2>
          <div className="space-y-6">
            {agendaData.map((event) => (
              <div
                key={event.id}
                className="flex gap-5 pb-4 border-b border-gray-200 last:border-b-0"
              >
                {/* Date */}
                <div className="flex-shrink-0 text-center min-w-[100px]">
                  <div className="text-4xl font-black text-gray-900 leading-none">
                    {event.day}
                  </div>
                  <div className="text-xs font-bold text-gray-600 uppercase mt-1">
                    {event.month}
                  </div>
                  <div className="text-base font-bold text-gray-900 mt-2">
                    {event.time}
                  </div>
                </div>

                {/* Details */}
                <div className="flex gap-5 flex-1">
                  {event.imageUrl && (
                    <img
                      src={event.imageUrl}
                      alt={event.title}
                      className="w-24 h-24 object-cover rounded flex-shrink-0"
                    />
                  )}
                  <div className="flex-1">
                    <h3 className="text-xl font-black text-gray-900 mb-3 uppercase">
                      {event.title}
                    </h3>
                    <span className="inline-block text-xs font-bold text-gray-600 uppercase mb-4">
                      {event.category}
                    </span>
                    <p className="text-sm text-gray-700 leading-tight">
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
          <div className="grid grid-cols-2 gap-5">
            {actionItems.map((action) => (
              <a
                key={action.id}
                href={action.link}
                className="relative h-64 rounded-lg overflow-hidden group cursor-pointer hover:scale-105 transition-transform duration-300"
                style={{
                  backgroundImage: `url(${action.imageUrl})`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center'
                }}
              >
                <div className="absolute inset-0 bg-gradient-to-b from-black/30 to-black/70 group-hover:from-black/40 group-hover:to-black/80 transition-all duration-300 flex items-center justify-center">
                  <h3 className="text-white text-3xl font-black text-center uppercase drop-shadow-lg">
                    {action.title}
                  </h3>
                </div>
              </a>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
