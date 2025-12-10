import { motion } from 'framer-motion';

export const MapSection = () => {


  const actions = [
    {
      id: 1,
      title: 'ENGAGEZ-VOUS POUR MADAGASCAR',
      subtitle: 'REJOIGNEZ',
      name: 'LE MHM !',
      image: '/images/antananarivo.jpg',
      link: '#'
    }
  ];

  const federations = [
    { name: 'Antananarivo', members: '2,500+', icon: '🏛️' },
    { name: 'Toamasina', members: '1,800+', icon: '⚓' },
    { name: 'Antsiranana', members: '1,500+', icon: '🏖️' },
    { name: 'Mahajanga', members: '1,200+', icon: '🌊' },
    { name: 'Fianarantsoa', members: '1,100+', icon: '⛰️' },
    { name: 'Toliara', members: '950+', icon: '🌴' }
  ];

  return (
    <section className="bg-gradient-to-b from-orange-50 to-white py-8 sm:py-12 lg:py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-12 lg:gap-16">
          {/* Left - Federations Section */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-20px" }}
            transition={{ duration: 0.3 }}
          >
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-gray-900 mb-4 sm:mb-6 uppercase leading-tight">
              Nos Fédérations à<br />
              <span className="text-orange-600">Madagascar</span>
            </h2>

            <p className="text-base sm:text-lg text-gray-700 mb-6 sm:mb-8 lg:mb-10 leading-relaxed text-justify">
              Retrouvez votre fédération locale et connectez-vous avec des milliers de membres engagés pour Madagascar.
            </p>

            {/* Federation Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
              {federations.map((fed, index) => (
                <motion.div
                  key={fed.name}
                  className="bg-white p-5 sm:p-6 rounded-2xl border-2 border-orange-200 hover:border-orange-500 hover:shadow-xl transition-all duration-300 cursor-pointer group"
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true, margin: "-20px" }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                  whileHover={{ y: -5, scale: 1.02 }}
                >
                  <div className="text-3xl sm:text-4xl mb-2 sm:mb-3 group-hover:scale-110 transition-transform duration-300">{fed.icon}</div>
                  <h3 className="font-black text-base sm:text-lg text-gray-900 mb-1">{fed.name}</h3>
                  <p className="text-xs sm:text-sm text-orange-600 font-bold">{fed.members} membres</p>
                </motion.div>
              ))}
            </div>

            {/* CTA Button */}
            <button className="w-full bg-gradient-to-r from-orange-600 to-orange-800 text-white py-3 sm:py-4 px-4 sm:px-6 rounded-full text-sm sm:text-base font-bold uppercase hover:from-orange-700 hover:to-orange-900 transition-all duration-300 shadow-xl hover:shadow-2xl hover:scale-105 active:scale-95">
              Trouver ma fédération →
            </button>
          </motion.div>

          {/* Right - Actions Section */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-20px" }}
            transition={{ duration: 0.3 }}
          >
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-gray-900 mb-4 sm:mb-6 lg:mb-8 uppercase leading-tight">
              Nos <span className="text-orange-600">Actions</span>
            </h2>

            <p className="text-base sm:text-lg text-gray-700 mb-6 sm:mb-8 lg:mb-10 leading-relaxed text-justify">
              Engagez-vous pour Madagascar et rejoignez un mouvement citoyen qui agit pour le développement et la souveraineté de notre nation.
            </p>

            {/* Action Card */}
            {actions.map((action) => (
              <motion.a
                key={action.id}
                href={action.link}
                className="block relative overflow-hidden rounded-xl sm:rounded-2xl cursor-pointer mb-4 sm:mb-6 shadow-2xl border-2 border-orange-200 hover:border-orange-500"
                style={{ height: '350px' }}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.4 }}
                whileHover={{
                  scale: 1.02,
                  boxShadow: "0 30px 60px rgba(0, 0, 0, 0.3)",
                  transition: { duration: 0.3 }
                }}
              >
                {/* Image de fond */}
                <div
                  className="absolute inset-0 bg-cover bg-center"
                  style={{ backgroundImage: `url(${action.image})` }}
                />
                {/* Gradient Overlay */}
                <motion.div
                  className="absolute inset-0 bg-gradient-to-t from-stone-900/80 via-stone-900/40 to-transparent flex flex-col items-center justify-end p-4 sm:p-6 lg:p-8"
                  whileHover={{ backgroundColor: "rgba(41, 37, 36, 0.85)" }}
                  transition={{ duration: 0.3 }}
                >
                  {/* Badge */}
                  <motion.div
                    className="bg-orange-600 text-white text-xs font-black px-3 sm:px-4 py-1.5 sm:py-2 mb-3 sm:mb-4 uppercase rounded-full shadow-lg"
                    whileHover={{ scale: 1.1 }}
                    transition={{ duration: 0.3 }}
                  >
                    {action.title}
                  </motion.div>

                  {/* Title */}
                  <motion.h3
                    className="text-white text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black text-center mb-1 sm:mb-2 uppercase drop-shadow-2xl"
                    whileHover={{ scale: 1.05, y: -5 }}
                    transition={{ duration: 0.3 }}
                  >
                    {action.subtitle}
                  </motion.h3>

                  <motion.h3
                    className="text-white text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black text-center uppercase drop-shadow-2xl"
                    whileHover={{ scale: 1.05, y: -5 }}
                    transition={{ duration: 0.3 }}
                  >
                    {action.name}
                  </motion.h3>

                  {/* Logo */}
                  <motion.div
                    className="mt-3 sm:mt-4 lg:mt-6"
                    whileHover={{ scale: 1.1, rotate: 5 }}
                    transition={{ duration: 0.3 }}
                  >
                    <img src="/mhm.svg" alt="Logo MHM" className="h-8 sm:h-10 lg:h-12 drop-shadow-2xl" />
                  </motion.div>
                </motion.div>
              </motion.a>
            ))}

            {/* CTA Button */}
            <button className="w-full bg-gradient-to-r from-red-700 to-red-900 text-white py-3 sm:py-4 px-4 sm:px-6 rounded-full text-sm sm:text-base font-bold uppercase hover:from-red-800 hover:to-red-950 transition-all duration-300 shadow-xl hover:shadow-2xl hover:scale-105 active:scale-95 inline-flex items-center justify-center gap-2">
              Toutes nos initiatives
              <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
