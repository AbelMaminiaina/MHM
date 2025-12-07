export const MapSection = () => {


  const actions = [
    {
      id: 1,
      title: 'ENGAGEZ-VOUS POUR MADAGASCAR',
      subtitle: 'REJOIGNEZ',
      name: 'LE MHM !',
      image: 'https://source.unsplash.com/800x600/?madagascar,people,crowd',
      link: '#'
    }
  ];

  return (
    <section className="bg-white py-16 px-8">
      <div className="max-w-7xl mx-auto">
        
        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Left - Map Section */}
          <div>
            <h2 className="text-3xl md:text-4xl font-black text-gray-900 mb-4 uppercase text-center">
              LES FÉDÉRATIONS DU<br />MADAGASIKARA HOAN'NY MALAGASY
            </h2>
            <p className="text-center text-gray-700 font-bold mb-8">
              RETROUVEZ VOTRE FÉDÉRATION ET SES COORDONNÉES<br />
              PRÈS DE CHEZ VOUS EN QUELQUES CLICS.
            </p>

            {/* Madagascar Map Container */}
            {/* <div className="relative bg-white p-8 flex items-center justify-center min-h-[700px]"> */}
              {/* Interactive Madagascar SVG Map */}
              {/* <div className="relative w-full max-w-md mx-auto">
                <svg viewBox="0 0 400 700" className="w-full h-auto drop-shadow-lg"> */}
                  {/* Background */}
                  {/* <rect width="400" height="700" fill="#F3F4F6" opacity="0.3"/> */}

                  {/* Antsiranana - North */}
                  {/* <path
                    d="M200 30 L220 40 L235 55 L245 75 L250 95 L248 115 L240 130 L220 140 L200 145 L180 140 L160 130 L152 115 L150 95 L155 75 L165 55 L180 40 Z"
                    fill={selectedProvince?.id === 'antsiranana' ? '#3B82F6' : '#FEF08A'}
                    stroke="#6B7280"
                    strokeWidth="2"
                    className="cursor-pointer hover:fill-blue-300 transition-colors"
                    onClick={() => setSelectedProvince(provinces.find(p => p.id === 'antsiranana') || null)}
                  />
                  <text x="200" y="95" textAnchor="middle" fontSize="12" fontWeight="bold" fill="#1F2937" className="pointer-events-none">
                    ANTSIRANANA
                  </text> */}

                  {/* Mahajanga - Northwest */}
                  {/* <path
                    d="M152 115 L140 135 L125 155 L110 180 L95 210 L85 245 L80 280 L82 310 L90 330 L105 340 L125 345 L145 340 L160 330 L170 315 L175 295 L175 270 L170 245 L165 220 L160 195 L155 170 L150 145 L150 130 Z"
                    fill={selectedProvince?.id === 'mahajanga' ? '#3B82F6' : '#FEF08A'}
                    stroke="#6B7280"
                    strokeWidth="2"
                    className="cursor-pointer hover:fill-blue-300 transition-colors"
                    onClick={() => setSelectedProvince(provinces.find(p => p.id === 'mahajanga') || null)}
                  />
                  <text x="130" y="240" textAnchor="middle" fontSize="11" fontWeight="bold" fill="#1F2937" className="pointer-events-none">
                    MAHAJANGA
                  </text> */}

                  {/* Toamasina - East */}
                  {/* <path
                    d="M248 115 L260 135 L275 160 L285 190 L295 225 L305 260 L312 295 L315 330 L312 360 L305 385 L295 405 L280 415 L260 420 L240 415 L220 405 L205 390 L195 370 L190 345 L190 320 L195 290 L200 260 L205 230 L215 200 L225 170 L235 145 L240 130 Z"
                    fill={selectedProvince?.id === 'toamasina' ? '#3B82F6' : '#FEF08A'}
                    stroke="#6B7280"
                    strokeWidth="2"
                    className="cursor-pointer hover:fill-blue-300 transition-colors"
                    onClick={() => setSelectedProvince(provinces.find(p => p.id === 'toamasina') || null)}
                  />
                  <text x="250" y="290" textAnchor="middle" fontSize="11" fontWeight="bold" fill="#1F2937" className="pointer-events-none">
                    TOAMASINA
                  </text> */}

                  {/* Antananarivo - Center */}
                  {/* <path
                    d="M170 315 L180 295 L190 275 L195 250 L200 225 L205 250 L210 275 L215 300 L218 325 L218 350 L215 375 L210 395 L205 410 L195 420 L180 425 L165 423 L150 418 L138 408 L128 393 L122 373 L120 348 L122 328 L130 315 L145 308 Z"
                    fill={selectedProvince?.id === 'antananarivo' ? '#3B82F6' : '#FEF08A'}
                    stroke="#6B7280"
                    strokeWidth="2"
                    className="cursor-pointer hover:fill-blue-300 transition-colors"
                    onClick={() => setSelectedProvince(provinces.find(p => p.id === 'antananarivo') || null)}
                  />
                  <text x="170" y="360" textAnchor="middle" fontSize="10" fontWeight="bold" fill="#1F2937" className="pointer-events-none">
                    ANTANANARIVO
                  </text> */}

                  {/* Fianarantsoa - South Center */}
                  {/* <path
                    d="M195 420 L210 435 L220 455 L228 480 L233 510 L235 540 L233 570 L228 595 L220 615 L208 630 L192 640 L175 643 L158 640 L143 632 L130 618 L120 598 L113 573 L110 543 L110 513 L113 483 L120 458 L130 438 L143 425 L158 418 L178 418 Z"
                    fill={selectedProvince?.id === 'fianarantsoa' ? '#3B82F6' : '#FEF08A'}
                    stroke="#6B7280"
                    strokeWidth="2"
                    className="cursor-pointer hover:fill-blue-300 transition-colors"
                    onClick={() => setSelectedProvince(provinces.find(p => p.id === 'fianarantsoa') || null)}
                  />
                  <text x="170" y="540" textAnchor="middle" fontSize="10" fontWeight="bold" fill="#1F2937" className="pointer-events-none">
                    FIANARANTSOA
                  </text> */}

                  {/* Toliara - Southwest */}
                  {/* <path
                    d="M110 543 L105 573 L100 608 L95 643 L92 675 L95 700 L110 695 L128 685 L145 672 L160 655 L172 635 L180 615 L185 590 L188 565 L188 540 L185 515 L180 490 L172 470 L160 455 L145 445 L128 440 L115 443 L105 455 L100 475 L98 500 L100 525 Z"
                    fill={selectedProvince?.id === 'toliara' ? '#3B82F6' : '#FEF08A'}
                    stroke="#6B7280"
                    strokeWidth="2"
                    className="cursor-pointer hover:fill-blue-300 transition-colors"
                    onClick={() => setSelectedProvince(provinces.find(p => p.id === 'toliara') || null)}
                  />
                  <text x="140" y="590" textAnchor="middle" fontSize="11" fontWeight="bold" fill="#1F2937" className="pointer-events-none">
                    TOLIARA
                  </text> */}

                  {/* MADAGASCAR text */}
                  {/* <text x="200" y="40" textAnchor="middle" fill="#1F2937" fontSize="20" fontWeight="black">
                    MADAGASCAR
                  </text>
                </svg> */}

                {/* Province Info Panel */}
                {/* {selectedProvince && (
                  <div className="mt-6 bg-blue-50 border-2 border-blue-500 rounded-lg p-6 animate-fade-in">
                    <div className="flex justify-between items-start mb-4">
                      <h3 className="text-2xl font-black text-gray-900">{selectedProvince.name}</h3>
                      <button
                        onClick={() => setSelectedProvince(null)}
                        className="text-gray-500 hover:text-gray-700 text-2xl leading-none"
                      >
                        ×
                      </button>
                    </div>
                    <div className="space-y-2 text-gray-700">
                      <p><span className="font-bold">Capitale:</span> {selectedProvince.capital}</p>
                      <p><span className="font-bold">Population:</span> {selectedProvince.population}</p>
                      <p className="text-sm mt-3">{selectedProvince.description}</p>
                    </div>
                    <button className="mt-4 bg-blue-600 text-white px-4 py-2 rounded font-bold hover:bg-blue-700 transition-colors">
                      En savoir plus →
                    </button>
                  </div>
                )}
              </div>
            </div> */}
          </div>

          {/* Right - Actions Section */}
          <div>
            <h2 className="text-3xl md:text-4xl font-black text-gray-900 mb-8 uppercase">
              NOS ACTIONS
            </h2>

            {/* Action Card */}
            {actions.map((action) => (
              <a
                key={action.id}
                href={action.link}
                className="block relative overflow-hidden group cursor-pointer mb-6 h-[500px]"
                style={{
                  backgroundImage: `url(${action.image})`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                }}
              >
                <div className="absolute inset-0 bg-gradient-to-t from-blue-900/60 via-blue-900/20 to-transparent flex flex-col items-center justify-end p-8 group-hover:scale-105 transition-transform duration-300">
                  <div className="bg-red-600 text-white text-xs font-black px-4 py-2 mb-4 uppercase">
                    {action.title}
                  </div>
                  <h3 className="text-white text-4xl md:text-5xl font-black text-center mb-2 uppercase italic">
                    {action.subtitle}
                  </h3>
                  <h3 className="text-white text-4xl md:text-5xl font-black text-center uppercase italic">
                    {action.name}
                  </h3>
                  <div className="mt-6">
                    <img src="/mhm.svg" alt="Logo MHM" className="h-12" />
                  </div>
                </div>
              </a>
            ))}

            {/* Link */}
            <a
              href="#"
              className="text-gray-900 font-bold text-sm hover:text-blue-700 transition-colors inline-flex items-center gap-2"
            >
              Toutes nos initiatives
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};
