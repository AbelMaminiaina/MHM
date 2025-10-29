export const FederationsSection = () => {
  return (
    <section className="bg-gray-50 py-20 px-10">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
        {/* Left - Federations */}
        <div>
          <h2 className="text-4xl md:text-5xl font-black text-gray-900 leading-tight mb-5 uppercase">
            LES FÉDÉRATIONS DU<br />
            Madagasikara Hoan'ny Malagasy
          </h2>
          <p className="text-base font-bold text-gray-900 leading-relaxed mb-10">
            RETROUVEZ VOTRE FÉDÉRATION ET SES COORDONNÉES<br />
            PRÈS DE CHEZ VOUS EN QUELQUES CLICS.
          </p>
          <div className="w-full max-w-2xl">
            <img
              src="/images/madagasikara-map.svg"
              alt="Carte de Madagasikara"
              className="w-full h-auto drop-shadow-lg"
            />
          </div>
        </div>

        {/* Right - Actions */}
        <div>
          <h2 className="text-4xl md:text-5xl font-black text-gray-900 mb-8 uppercase">
            NOS ACTIONS
          </h2>
          <div className="relative w-full h-[500px] rounded-xl overflow-hidden shadow-2xl hover:-translate-y-1 transition-transform duration-300 cursor-pointer">
            <img
              src="/images/val-support.jpg"
              alt="Soutenons Valohery"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-black/20 to-black/60 flex flex-col items-center justify-center p-10">
              <div className="bg-red-600 text-white px-5 py-2 text-sm font-bold uppercase mb-5">
                SAUVONS LA DÉMOCRATIE
              </div>
              <h3 className="text-white text-5xl md:text-6xl font-black text-center leading-tight uppercase mb-10 drop-shadow-2xl">
                SOUTENONS<br />
                val !
              </h3>
              <img
                src="/images/rn-logo-white.svg"
                alt=" National"
                className="w-32 h-auto drop-shadow-lg"
              />
            </div>
          </div>
          <a
            href="#"
            className="inline-block mt-5 text-base font-bold text-gray-900 hover:text-blue-600 transition-colors duration-300"
          >
            Toutes nos pétitions →
          </a>
        </div>
      </div>
    </section>
  );
};
