import { useState, useEffect } from 'react';
import { FaMap, FaGlobe, FaUsers, FaUserGroup, FaBuilding, FaCircleCheck, FaFileLines, FaVideo, FaMicrophone, FaEnvelope } from "react-icons/fa6";
import { useNavigate } from 'react-router-dom';

export const Navbar = () => {
  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  
  // Fermer les menus lors du scroll
  useEffect(() => {
    const handleScroll = () => {
      if (openMenu !== null || mobileMenuOpen) {
        setOpenMenu(null);
        setMobileMenuOpen(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [openMenu, mobileMenuOpen]);

  return (
    <nav className="sticky top-0 z-50 bg-white border-b border-gray-200 px-4 md:px-8 py-4 shadow-sm">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center gap-3">
          <img
            src="/hfm.jpg"
            alt="HFM Logo"
            className="w-10 h-10 md:w-12 md:h-12"
          />
          <div className="flex flex-col leading-tight">
            <span className="text-gray-700 font-black text-base md:text-lg">MADAGASIKARA</span>
            <span className="text-gray-700 font-black text-base md:text-lg">HOAN'NY MALAGASY</span>
          </div>
        </div>

        {/* Menu Desktop - Caché sur mobile */}
        <div className="hidden lg:flex items-center gap-8">
          <div className="relative">
            <button
              onClick={() => setOpenMenu(openMenu === 'organisation' ? null : 'organisation')}
              className="flex items-center gap-2 text-gray-700 font-semibold hover:text-gray-900"
            >
              Organisation
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            {/* Sous-menu Organisation */}
            {openMenu === 'organisation' && (
              <div className="fixed left-0 right-0 top-[73px] w-full bg-white shadow-2xl border-t border-gray-200 z-40 animate-menu-slide">
              <div className="max-w-7xl mx-auto grid grid-cols-3 gap-8 p-8">

                {/* Colonne 1: FÉDÉRATIONS */}
                <div>
                  <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-4">FÉDÉRATIONS</h3>
                  <div className="space-y-3">
                    <a href="#" className="flex items-center gap-3 text-gray-800 hover:text-gray-900 transition-colors">
                      <FaMap className="w-5 h-5 text-gray-500" ></FaMap>
                      <span className="font-medium">Les fédérations provinciales</span>
                    </a>
                    <a href="#" className="flex items-center gap-3 text-gray-800 hover:text-gray-900 transition-colors">
                      <FaGlobe className="w-5 h-5 text-gray-500" />
                      <span className="font-medium">Les fédérations régionales</span>
                    </a>
                  </div>
                </div>

                {/* Colonne 2: LES INSTANCES */}
                <div>
                  <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-4">LES INSTANCES</h3>
                  <div className="space-y-3">
                    <a href="#" className="flex items-center gap-3 text-gray-800 hover:text-gray-900 transition-colors">
                      <FaUsers className="w-5 h-5 text-gray-500" />
                      <span className="font-medium">Bureau exécutif</span>
                    </a>
                    <a href="#" className="flex items-center gap-3 text-gray-800 hover:text-gray-900 transition-colors">
                      <FaUserGroup className="w-5 h-5 text-gray-500" />
                      <span className="font-medium">Bureau national</span>
                    </a>
                    <a href="#" className="flex items-center gap-3 text-gray-800 hover:text-gray-900 transition-colors">
                      <FaCircleCheck className="w-5 h-5 text-gray-500" />
                      <span className="font-medium">Commission nationale d'investiture</span>
                    </a>
                    <a href="#" className="flex items-center gap-3 text-gray-800 hover:text-gray-900 transition-colors">
                      <FaCircleCheck className="w-5 h-5 text-gray-500" />
                      <span className="font-medium">Commission des conflits</span>
                    </a>
                    <a href="#" className="flex items-center gap-3 text-gray-800 hover:text-gray-900 transition-colors">
                      <FaMap className="w-5 h-5 text-gray-500" />
                      <span className="font-medium">Les Malagasy de la diaspora</span>
                    </a>
                  </div>
                </div>

                {/* Colonne 3: Conseil national */}
                <div>
                  <div className="space-y-3 mt-8">
                    <a href="#" className="flex items-center gap-3 text-gray-800 hover:text-gray-900 transition-colors">
                      <FaBuilding className="w-5 h-5 text-gray-500" />
                      <span className="font-medium">Conseil national</span>
                    </a>
                  </div>
                </div>

              </div>

              {/* Ligne du bas avec règlement et statuts */}
              <div className="border-t border-gray-200 px-8 py-6">
                <div className="max-w-7xl mx-auto flex gap-8">
                  <a href="#" className="flex items-center gap-3 text-gray-800 hover:text-gray-900 transition-colors">
                    <FaFileLines className="w-5 h-5 text-gray-500" />
                    <span className="font-medium">Le règlement intérieur</span>
                  </a>
                  <a href="#" className="flex items-center gap-3 text-gray-800 hover:text-gray-900 transition-colors">
                    <FaFileLines className="w-5 h-5 text-gray-500" />
                    <span className="font-medium">Statuts du HO AN'NY FAHAFAHAN'I MADAGASIKARA (HFM)</span>
                  </a>
                </div>
              </div>
            </div>
            )}
          </div>

          <div className="relative">
            <button
              onClick={() => setOpenMenu(openMenu === 'actualites' ? null : 'actualites')}
              className="flex items-center gap-2 text-gray-700 font-semibold hover:text-gray-900"
            >
              Actualités
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            {/* Sous-menu Actualités */}
            {openMenu === 'actualites' && (
              <div className="fixed left-0 right-0 top-[73px] w-full bg-white shadow-2xl border-t border-gray-200 z-40 animate-menu-slide">
                <div className="max-w-7xl mx-auto grid grid-cols-3 gap-8 p-8">

                  {/* Colonne 1: ACTUALITÉ */}
                  <div>
                    <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-4">ACTUALITÉ</h3>
                    <div className="space-y-3">
                      <a href="#" className="flex items-center gap-3 text-gray-800 hover:text-gray-900 transition-colors">
                        <FaVideo className="w-5 h-5 text-gray-500" />
                        <span className="font-medium">Vidéos</span>
                      </a>
                      <a href="#" className="flex items-center gap-3 text-gray-800 hover:text-gray-900 transition-colors">
                        <FaMicrophone className="w-5 h-5 text-gray-500" />
                        <span className="font-medium">Communiqués</span>
                      </a>
                      <a href="#" className="flex items-center gap-3 text-gray-800 hover:text-gray-900 transition-colors">
                        <FaUserGroup className="w-5 h-5 text-gray-500" />
                        <span className="font-medium">Vie parlementaire</span>
                      </a>
                      <a href="#" className="flex items-center gap-3 text-gray-800 hover:text-gray-900 transition-colors">
                        <FaFileLines className="w-5 h-5 text-gray-500" />
                        <span className="font-medium">Tribunes libres</span>
                      </a>
                      <a href="#" className="flex items-center gap-3 text-gray-800 hover:text-gray-900 transition-colors">
                        <FaMicrophone className="w-5 h-5 text-gray-500" />
                        <span className="font-medium">Discours</span>
                      </a>
                      <a href="#" className="flex items-center gap-3 text-gray-800 hover:text-gray-900 transition-colors">
                        <FaEnvelope className="w-5 h-5 text-gray-500" />
                        <span className="font-medium">Lettre ouverte</span>
                      </a>
                    </div>
                  </div>

                  {/* Colonne 2 & 3: À LA UNE */}
                  <div className="col-span-2">
                    <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-4">À LA UNE</h3>
                    <div className="space-y-4">
                      <a href="#" className="flex gap-4 group hover:bg-gray-50 p-3 rounded-lg transition-colors">
                        <img
                          src="https://images.unsplash.com/photo-1589139663095-034ec884b46c?w=200&h=200&fit=crop"
                          alt="Madagascar"
                          className="w-24 h-24 object-cover rounded flex-shrink-0"
                        />
                        <div className="flex-1">
                          <h4 className="font-bold text-gray-900 text-base mb-2 group-hover:text-gray-900 transition-colors leading-snug">
                            MADAGASCAR : LE HFM APPELLE À LA SOUVERAINETÉ NATIONALE
                          </h4>
                          <p className="text-sm text-gray-600">
                            <span className="font-medium">Bureau Exécutif HFM</span> - <span>27 octobre 2025</span>
                          </p>
                        </div>
                      </a>

                      <a href="#" className="flex gap-4 group hover:bg-gray-50 p-3 rounded-lg transition-colors">
                        <img
                          src="https://images.unsplash.com/photo-1590420338487-d32d2e8d9170?w=200&h=200&fit=crop"
                          alt="Madagascar"
                          className="w-24 h-24 object-cover rounded flex-shrink-0"
                        />
                        <div className="flex-1">
                          <h4 className="font-bold text-gray-900 text-base mb-2 group-hover:text-gray-900 transition-colors leading-snug">
                            DÉVELOPPEMENT DURABLE : PROTÉGER L'ENVIRONNEMENT MALAGASY
                          </h4>
                          <p className="text-sm text-gray-600">
                            <span className="font-medium">Commission Environnement</span> - <span>25 octobre 2025</span>
                          </p>
                        </div>
                      </a>
                    </div>
                  </div>

                </div>
              </div>
            )}
          </div>

          <div className="relative">
            <button
              onClick={() => setOpenMenu(openMenu === 'projet' ? null : 'projet')}
              className="flex items-center gap-2 text-gray-700 font-semibold hover:text-gray-900"
            >
              Le projet
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            {/* Sous-menu Le projet */}
            {openMenu === 'projet' && (
              <div className="fixed left-0 right-0 top-[73px] w-full bg-white shadow-2xl border-t border-gray-200 z-40 animate-menu-slide">
                {/* Barre rouge supérieure */}
                <div className="bg-gray-800 text-white px-8 py-3">
                  <div className="max-w-7xl mx-auto flex justify-between items-center">
                    <span className="font-bold uppercase text-sm tracking-wide">PROGRAMME DU HFM</span>
                    <span className="font-bold uppercase text-sm tracking-wide">MADAGASCAR HOAN'NY MALAGASY</span>
                  </div>
                </div>

                <div className="max-w-7xl mx-auto grid grid-cols-2 gap-12 p-8">

                  {/* Colonne 1: Programmes */}
                  <div className="space-y-6">
                    <a href="#" className="block group">
                      <h3 className="text-2xl font-black text-gray-900 uppercase mb-1 group-hover:text-gray-900 transition-colors">
                        SOUVERAINETÉ NATIONALE
                      </h3>
                      <p className="text-sm text-gray-600">Madagascar aux Malagasy</p>
                    </a>

                    <a href="#" className="block group">
                      <h3 className="text-2xl font-black text-gray-900 uppercase mb-1 group-hover:text-gray-900 transition-colors">
                        DÉVELOPPEMENT ÉCONOMIQUE
                      </h3>
                      <p className="text-sm text-gray-600">Croissance durable et inclusive</p>
                    </a>

                    <a href="#" className="block group">
                      <h3 className="text-2xl font-black text-gray-900 uppercase mb-1 group-hover:text-gray-900 transition-colors">
                        AGRICULTURE ET PÊCHE
                      </h3>
                      <p className="text-sm text-gray-600">Valorisation des producteurs locaux</p>
                    </a>

                    <a href="#" className="block group">
                      <h3 className="text-2xl font-black text-gray-900 uppercase mb-1 group-hover:text-gray-900 transition-colors">
                        ÉDUCATION ET CULTURE
                      </h3>
                      <p className="text-sm text-gray-600">Promotion de la langue et l'identité malagasy</p>
                    </a>
                  </div>

                  {/* Colonne 2: Thématiques */}
                  <div className="space-y-6">
                    <a href="#" className="block group">
                      <h3 className="text-2xl font-black text-gray-900 uppercase mb-1 group-hover:text-gray-900 transition-colors">
                        ENVIRONNEMENT
                      </h3>
                      <p className="text-sm text-gray-600">
                        Protection de la biodiversité et des ressources naturelles
                      </p>
                    </a>

                    <a href="#" className="block group">
                      <h3 className="text-2xl font-black text-gray-900 uppercase mb-1 group-hover:text-gray-900 transition-colors">
                        SANTÉ ET SOCIAL
                      </h3>
                      <p className="text-sm text-gray-600">
                        Accès aux soins pour tous les Malagasy
                      </p>
                    </a>

                    <a href="#" className="block group">
                      <h3 className="text-2xl font-black text-gray-900 uppercase mb-1 group-hover:text-gray-900 transition-colors">
                        JUSTICE ET SÉCURITÉ
                      </h3>
                      <p className="text-sm text-gray-600">
                        État de droit et protection des citoyens
                      </p>
                    </a>
                  </div>

                </div>
              </div>
            )}
          </div>

          <button className="text-gray-700 hover:text-gray-900">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </button>
        </div>

        {/* Right side buttons - Adaptés pour mobile */}
        <div className="flex items-center gap-2 md:gap-4">
          <button className="hidden md:block text-gray-700 font-semibold hover:text-gray-900">
            Militer
          </button>
          <button
            onClick={() => navigate('/adherer')}
            className="bg-gray-900 text-white px-4 md:px-6 py-2 text-sm md:text-base font-bold hover:bg-gray-700 transition-colors">
            Adhérer
          </button>
          <button
            onClick={() => navigate('/login')}
            className="hidden md:block text-gray-700 font-semibold hover:text-gray-900 flex items-center gap-2"
            title="Connexion Administrateur">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
            Admin
          </button>
          <div className="hidden xl:flex flex-col text-right leading-tight ml-4">
            <span className="text-sm tracking-wider">campus</span>
            <span className="text-lg font-black">MADA</span>
          </div>

          {/* Bouton menu hamburger - Visible sur mobile */}
          <button
            className="lg:hidden ml-2 text-gray-700"
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
        <div className="lg:hidden fixed left-0 right-0 top-[73px] bg-white shadow-xl border-t border-gray-200 z-40 animate-menu-slide max-h-[calc(100vh-73px)] overflow-y-auto">
          <div className="px-6 py-6 pb-32 space-y-6">
            {/* LES FÉDÉRATIONS */}
            <div>
              <h2 className="text-lg font-black text-gray-700 mb-4">LES FÉDÉRATIONS</h2>
              <div className="space-y-2 pl-4">
                <a href="#" className="block text-gray-700 hover:text-gray-900 py-1">Les fédérations provinciales</a>
                <a href="#" className="block text-gray-700 hover:text-gray-900 py-1">Les fédérations régionales</a>
              </div>
            </div>

            {/* INSTANCES */}
            <div>
              <h2 className="text-lg font-black text-gray-700 mb-4">INSTANCES</h2>
              <div className="space-y-2 pl-4">
                <a href="#" className="block text-gray-700 hover:text-gray-900 py-1">Bureau Exécutif</a>
                <a href="#" className="block text-gray-700 hover:text-gray-900 py-1">Bureau National</a>
                <a href="#" className="block text-gray-700 hover:text-gray-900 py-1">Commission Nationale d'Investiture</a>
                <a href="#" className="block text-gray-700 hover:text-gray-900 py-1">Commission des Conflits</a>
                <a href="#" className="block text-gray-700 hover:text-gray-900 py-1">Conseil national</a>
              </div>
            </div>

            {/* ACTUALITÉS */}
            <div>
              <h2 className="text-lg font-black text-gray-700 mb-4">ACTUALITÉS</h2>
              <div className="space-y-2 pl-4">
                <a href="#" className="block text-gray-700 hover:text-gray-900 py-1">Vidéos</a>
                <a href="#" className="block text-gray-700 hover:text-gray-900 py-1">Communiqués</a>
                <a href="#" className="block text-gray-700 hover:text-gray-900 py-1">Vie parlementaire</a>
                <a href="#" className="block text-gray-700 hover:text-gray-900 py-1">Tribunes libres</a>
                <a href="#" className="block text-gray-700 hover:text-gray-900 py-1">Discours</a>
                <a href="#" className="block text-gray-700 hover:text-gray-900 py-1">Lettre ouverte</a>
              </div>
            </div>

            {/* LE PROJET */}
            <div>
              <h2 className="text-lg font-black text-gray-700 mb-4">LE PROJET</h2>
              <div className="space-y-3 pl-4">
                <div>
                  <h3 className="font-bold text-gray-900 mb-1">Souveraineté nationale</h3>
                  <p className="text-xs text-gray-600 mb-2">Madagascar aux Malagasy</p>
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 mb-1">Développement économique</h3>
                  <p className="text-xs text-gray-600 mb-2">Croissance durable et inclusive</p>
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 mb-1">Agriculture et Pêche</h3>
                  <p className="text-xs text-gray-600 mb-2">Valorisation des producteurs locaux</p>
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 mb-1">Éducation et Culture</h3>
                  <p className="text-xs text-gray-600 mb-2">Promotion de la langue et l'identité malagasy</p>
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 mb-1">Environnement</h3>
                  <p className="text-xs text-gray-600 mb-2">Protection de la biodiversité et des ressources naturelles</p>
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 mb-1">Santé et Social</h3>
                  <p className="text-xs text-gray-600 mb-2">Accès aux soins pour tous les Malagasy</p>
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 mb-1">Justice et Sécurité</h3>
                  <p className="text-xs text-gray-600 mb-2">État de droit et protection des citoyens</p>
                </div>
              </div>
            </div>

            {/* ACCÈS ADMIN - Mobile */}
            <div className="border-t border-gray-200 pt-6 mt-6">
              <button
                onClick={() => {
                  navigate('/login');
                  setMobileMenuOpen(false);
                }}
                className="w-full bg-gray-700 text-white px-6 py-3 rounded-lg font-semibold hover:bg-gray-800 transition-colors flex items-center justify-center gap-3 shadow-md"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
                Connexion Administrateur
              </button>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};
