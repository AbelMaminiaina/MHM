import { Link } from 'react-router-dom';
import {FaXTwitter, FaFacebookF, FaYoutube, FaTelegram, FaInstagram, FaTiktok, FaLinkedin} from 'react-icons/fa6';

export const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-8 py-12">
        {/* Top Section - Logo, Social, and Links */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-8 mb-12">
          {/* Left Column - Logo and Social */}
          <div className="md:col-span-1 text-center md:text-left flex flex-col items-center md:items-start">
            <div className="mb-6">
              <img
                src="/mhm.svg"
                alt="MHM Logo"
                className="w-16 h-16 mb-3 mx-auto md:mx-0"
              />
              <div className="text-sm font-bold leading-tight">
                <div>MADAGASIKARA</div>
                <div>HOAN'NY MALAGASY</div>
              </div>
            </div>

            {/* Madagascar Badge */}
            <div className="bg-white rounded p-3 mb-6 inline-block">
              <div className="text-red-700 font-black text-xs">MHM.MG</div>
            </div>

            {/* Social Media Icons */}
            <div className="flex gap-4 mb-6 justify-center md:justify-start">
              <a href="#" className="hover:text-red-400 transition-colors">
                <FaXTwitter className="w-5 h-5" />
              </a>
              <a href="#" className="hover:text-red-400 transition-colors">
                <FaFacebookF className='w-5 h-5'/>
              </a>
              <a href="#" className="hover:text-red-400 transition-colors">
                <FaInstagram className='w-5 h-5' />
              </a>
              <a href="#" className="hover:text-red-400 transition-colors">
                <FaYoutube className='w-5 h-5' />
              </a>
              <a href="#" className='hover:text-red-400 transition-colors'>
                <FaTelegram className='w-5 h-5'/>
              </a>
              <a href="#" className="hover:text-red-400 transition-colors">
                <FaTiktok className='w-5 h-5'/>
              </a>
              <a href="#" className="hover:text-red-400 transition-colors">
                <FaLinkedin className='w-5 h-5' />
              </a>
            </div>

            {/* Groupe Logo */}
            <div className="text-sm">
              <div className="font-bold">Groupe</div>
              <div className="font-bold">MADAGASIKARA</div>
              <div className="font-bold">HOAN'NY MALAGASY</div>
            </div>
          </div>

          {/* FÉDÉRATIONS */}
          <div className="text-center md:text-left">
            <h3 className="font-bold text-sm uppercase mb-4">FÉDÉRATIONS</h3>
            <ul className="space-y-2 text-sm">
              <li><a href="#" className="hover:text-red-400 transition-colors">Les fédérations provinciales</a></li>
              <li><a href="#" className="hover:text-red-400 transition-colors">Les fédérations régionales</a></li>
              <li><a href="#" className="hover:text-red-400 transition-colors">Les Malagasy de la diaspora</a></li>
            </ul>
          </div>

          {/* INSTANCES */}
          <div className="text-center md:text-left">
            <h3 className="font-bold text-sm uppercase mb-4">INSTANCES</h3>
            <ul className="space-y-2 text-sm">
              <li><a href="#" className="hover:text-red-400 transition-colors">Bureau Exécutif</a></li>
              <li><a href="#" className="hover:text-red-400 transition-colors">Bureau National</a></li>
              <li><a href="#" className="hover:text-red-400 transition-colors">Commission Nationale d'Investiture</a></li>
              <li><a href="#" className="hover:text-red-400 transition-colors">Commission des Conflits</a></li>
              <li><a href="#" className="hover:text-red-400 transition-colors">Le Congrès</a></li>
              <li><Link to="/members" className="hover:text-red-400 transition-colors">Les adhérents</Link></li>
            </ul>
          </div>

          {/* ACTUALITÉS */}
          <div className="text-center md:text-left">
            <h3 className="font-bold text-sm uppercase mb-4">ACTUALITÉS</h3>
            <ul className="space-y-2 text-sm">
              <li><a href="#" className="hover:text-red-400 transition-colors">Communiqués</a></li>
              <li><a href="#" className="hover:text-red-400 transition-colors">Tribunes libres</a></li>
              <li><a href="#" className="hover:text-red-400 transition-colors">Lettre ouverte</a></li>
              <li><a href="#" className="hover:text-red-400 transition-colors">Vidéos</a></li>
            </ul>
          </div>

          {/* MILITER */}
          <div className="text-center md:text-left">
            <h3 className="font-bold text-sm uppercase mb-4">MILITER</h3>
            <ul className="space-y-2 text-sm">
              <li><Link to="/adherer" className="hover:text-red-400 transition-colors">J'adhère au MHM</Link></li>
              <li><a href="#" className="hover:text-red-400 transition-colors">Je donne au MHM</a></li>
              <li><a href="#" className="hover:text-red-400 transition-colors">Je m'engage au MHM</a></li>
              <li><a href="#" className="hover:text-red-400 transition-colors">Contacter le MHM</a></li>
            </ul>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-slate-700 my-8"></div>

        {/* Bottom Section */}
        <div className="text-center text-sm">
          <div className="font-bold mb-3">MADAGASIKARA HOAN'NY MALAGASY</div>
          <div className="mb-4 text-gray-400">
            Lot IVA 45 Ambohidahy - Antananarivo 101 - +261 34 00 000 00
          </div>
          <div className="text-xs text-gray-500 flex flex-wrap justify-center gap-2">
            <span>Tous droits réservés</span>
            <span>|</span>
            <a href="#" className="hover:text-red-400 underline">Mentions légales et CGU</a>
            <span>|</span>
            <a href="#" className="hover:text-red-400 underline">Politique de Confidentialité</a>
            <span>|</span>
            <a href="#" className="hover:text-red-400 underline">Politique des cookies</a>
            <span>|</span>
            <a href="#" className="hover:text-red-400 underline">Nous contacter</a>
            <span>|</span>
            <a href="#" className="hover:text-red-400 underline">Formulaire RGPD</a>
          </div>
        </div>
      </div>
    </footer>
  );
};
