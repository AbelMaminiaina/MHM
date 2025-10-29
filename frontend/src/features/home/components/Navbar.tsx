import { useState } from 'react';

export const Navbar = () => {
  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <nav className="relative bg-white border-b border-gray-200 px-4 md:px-8 py-4">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center gap-3">
          <img
            src="/mhm.svg"
            alt="MHM Logo"
            className="w-10 h-10 md:w-12 md:h-12"
          />
          <div className="flex flex-col leading-tight">
            <span className="text-teal-800 font-black text-base md:text-lg">MADAGASIKARA</span>
            <span className="text-teal-800 font-black text-base md:text-lg">HOAN'NY MALAGASY</span>
          </div>
        </div>

        {/* Menu Desktop - Caché sur mobile */}
        <div className="hidden lg:flex items-center gap-8">
          <div className="relative">
            <button
              onClick={() => setOpenMenu(openMenu === 'organisation' ? null : 'organisation')}
              className="flex items-center gap-2 text-teal-800 font-semibold hover:text-teal-600"
            >
              Organisation
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            {/* Sous-menu Organisation */}
            {openMenu === 'organisation' && (
              <div className="fixed left-0 right-0 top-[72px] w-full bg-white shadow-2xl border-t border-gray-200 z-50 animate-menu-slide">
              <div className="max-w-7xl mx-auto grid grid-cols-3 gap-8 p-8">

                {/* Colonne 1: FÉDÉRATIONS */}
                <div>
                  <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-4">FÉDÉRATIONS</h3>
                  <div className="space-y-3">
                    <a href="#" className="flex items-center gap-3 text-gray-800 hover:text-teal-600 transition-colors">
                      <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                      </svg>
                      <span className="font-medium">Les fédérations métropolitaines</span>
                    </a>
                    <a href="#" className="flex items-center gap-3 text-gray-800 hover:text-teal-600 transition-colors">
                      <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <span className="font-medium">Les fédérations d'Outre-mer</span>
                    </a>
                  </div>
                </div>

                {/* Colonne 2: LES INSTANCES */}
                <div>
                  <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-4">LES INSTANCES</h3>
                  <div className="space-y-3">
                    <a href="#" className="flex items-center gap-3 text-gray-800 hover:text-teal-600 transition-colors">
                      <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                      </svg>
                      <span className="font-medium">Bureau exécutif</span>
                    </a>
                    <a href="#" className="flex items-center gap-3 text-gray-800 hover:text-teal-600 transition-colors">
                      <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                      </svg>
                      <span className="font-medium">Bureau national</span>
                    </a>
                    <a href="#" className="flex items-center gap-3 text-gray-800 hover:text-teal-600 transition-colors">
                      <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                      </svg>
                      <span className="font-medium">Commission nationale d'investiture</span>
                    </a>
                    <a href="#" className="flex items-center gap-3 text-gray-800 hover:text-teal-600 transition-colors">
                      <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                      </svg>
                      <span className="font-medium">Commission des conflits</span>
                    </a>
                    <a href="#" className="flex items-center gap-3 text-gray-800 hover:text-teal-600 transition-colors">
                      <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <span className="font-medium">Les Français de l'étranger</span>
                    </a>
                  </div>
                </div>

                {/* Colonne 3: Conseil national */}
                <div>
                  <div className="space-y-3 mt-8">
                    <a href="#" className="flex items-center gap-3 text-gray-800 hover:text-teal-600 transition-colors">
                      <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                      </svg>
                      <span className="font-medium">Conseil national</span>
                    </a>
                  </div>
                </div>

              </div>

              {/* Ligne du bas avec règlement et statuts */}
              <div className="border-t border-gray-200 px-8 py-6">
                <div className="max-w-7xl mx-auto flex gap-8">
                  <a href="#" className="flex items-center gap-3 text-gray-800 hover:text-teal-600 transition-colors">
                    <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    <span className="font-medium">Le règlement intérieur</span>
                  </a>
                  <a href="#" className="flex items-center gap-3 text-gray-800 hover:text-teal-600 transition-colors">
                    <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    <span className="font-medium">Statuts du MADAGASIKARA HOAN'NY MALAGASY (MHM)</span>
                  </a>
                </div>
              </div>
            </div>
            )}
          </div>

          <div className="relative">
            <button
              onClick={() => setOpenMenu(openMenu === 'actualites' ? null : 'actualites')}
              className="flex items-center gap-2 text-teal-800 font-semibold hover:text-teal-600"
            >
              Actualités
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
          </div>

          <div className="relative">
            <button
              onClick={() => setOpenMenu(openMenu === 'projet' ? null : 'projet')}
              className="flex items-center gap-2 text-teal-800 font-semibold hover:text-teal-600"
            >
              Le projet
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
          </div>

          <button className="text-teal-800 hover:text-teal-600">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </button>
        </div>

        {/* Right side buttons - Adaptés pour mobile */}
        <div className="flex items-center gap-2 md:gap-4">
          <button className="hidden md:block text-teal-800 font-semibold hover:text-teal-600">
            Militer
          </button>
          <button className="bg-red-600 text-white px-4 md:px-6 py-2 text-sm md:text-base font-bold hover:bg-red-700 transition-colors">
            Adhérer
          </button>
          <div className="hidden xl:flex flex-col text-right leading-tight ml-4">
            <span className="text-sm tracking-wider">campus</span>
            <span className="text-lg font-black">MADA</span>
          </div>

          {/* Bouton menu hamburger - Visible sur mobile */}
          <button
            className="lg:hidden ml-2 text-teal-800"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle menu"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {mobileMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Menu Mobile */}
      {mobileMenuOpen && (
        <div className="lg:hidden fixed left-0 right-0 top-[72px] bg-white shadow-xl border-t border-gray-200 z-50 animate-menu-slide max-h-[calc(100vh-72px)] overflow-y-auto">
          <div className="px-6 py-6 space-y-6">
            {/* LES FÉDÉRATIONS */}
            <div>
              <h2 className="text-lg font-black text-teal-800 mb-4">LES FÉDÉRATIONS</h2>
              <div className="space-y-2 pl-4">
                <a href="#" className="block text-gray-700 hover:text-teal-600 py-1">Les fédérations métropolitaines</a>
                <a href="#" className="block text-gray-700 hover:text-teal-600 py-1">Les fédérations d'Outre-mer</a>
              </div>
            </div>

            {/* INSTANCES */}
            <div>
              <h2 className="text-lg font-black text-teal-800 mb-4">INSTANCES</h2>
              <div className="space-y-2 pl-4">
                <a href="#" className="block text-gray-700 hover:text-teal-600 py-1">Bureau Exécutif</a>
                <a href="#" className="block text-gray-700 hover:text-teal-600 py-1">Bureau National</a>
                <a href="#" className="block text-gray-700 hover:text-teal-600 py-1">Commission Nationale d'Investiture</a>
                <a href="#" className="block text-gray-700 hover:text-teal-600 py-1">Commission des Conflits</a>
                <a href="#" className="block text-gray-700 hover:text-teal-600 py-1">Conseil national</a>
              </div>
            </div>

            {/* ACTUALITÉS */}
            <div>
              <h2 className="text-lg font-black text-teal-800 mb-4">ACTUALITÉS</h2>
              <div className="space-y-2 pl-4">
                <a href="#" className="block text-gray-700 hover:text-teal-600 py-1">Communiqués</a>
                <a href="#" className="block text-gray-700 hover:text-teal-600 py-1">Tribunes libres</a>
                <a href="#" className="block text-gray-700 hover:text-teal-600 py-1">Lettre ouverte</a>
                <a href="#" className="block text-gray-700 hover:text-teal-600 py-1">Vidéos</a>
              </div>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};
