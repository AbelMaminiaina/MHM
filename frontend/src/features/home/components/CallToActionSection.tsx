import { useNavigate } from 'react-router-dom';
import {FaXTwitter, FaFacebookF, FaLinkedin, FaTiktok, FaYoutube, FaInstagram, FaTelegram} from 'react-icons/fa6'

export const CallToActionSection = () => {
  const navigate = useNavigate();
  return (
    <div className="w-full">
      {/* Newsletter et Support Section */}
      <div className="grid grid-cols-2">
        {/* Section Teal - Newsletter */}
        <div className="bg-gradient-to-r from-teal-600 to-teal-800 px-6 py-6 flex flex-col justify-center items-center">
          <h2 className="text-white text-sm font-bold mb-3 text-center">
            Tout savoir de l'actualité du MHM et de VAL
          </h2>
          <div className="flex w-full max-w-md">
            <input
              type="email"
              placeholder="Votre adresse électronique"
              className="flex-1 px-3 py-2 text-xs bg-transparent border-2 border-white text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-white/50"
            />
            <button className="bg-transparent border-2 border-white border-l-0 px-3 hover:bg-white/10 transition-colors">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </button>
          </div>
        </div>

        {/* Section Rouge - Support */}
        <div className="bg-gradient-to-r from-red-600 to-red-700 px-6 py-6 flex flex-col justify-center items-center">
          <h2 className="text-white text-sm font-bold mb-3 text-center">
            Je soutiens la première force de MHM !
          </h2>
          <div className="flex gap-3">
            <button
              onClick={() => navigate('/adherer')}
              className="bg-red-800 text-white px-5 py-2 text-sm font-bold uppercase hover:bg-red-900 transition-colors shadow-lg"
            >
              J'adhère
            </button>
            <button className="bg-red-800 text-white px-5 py-2 text-sm font-bold uppercase hover:bg-red-900 transition-colors shadow-lg">
              Je donne
            </button>
          </div>
        </div>
      </div>

      {/* Section Réseaux Sociaux */}
      <div className="bg-white py-4 px-6">
        <div className="max-w-7xl mx-auto flex flex-row items-center justify-center gap-4">
          <h3 className="text-gray-900 text-sm font-bold uppercase">
            Suivez le Madagasikara hoan'ny Malagasy
          </h3>
          <div className="flex gap-3 items-center">
            {/* X (Twitter) */}
            <a href="#" className="text-gray-900 hover:text-blue-600 transition-colors">
              <FaXTwitter className='w-5 h-5' />
            </a>
            {/* Facebook */}
            <a href="#" className="text-gray-900 hover:text-blue-600 transition-colors">
              <FaFacebookF className='w-5 h-5' />
            </a>
            {/* YouTube */}
            <a href="#" className="text-gray-900 hover:text-red-600 transition-colors">
              <FaYoutube className='w-5 h-5' />
            </a>
            {/* Instagram */}
            <a href="#" className="text-gray-900 hover:text-pink-600 transition-colors">
              <FaInstagram className='w-5 h-5' />
            </a>
            {/* Telegram */}
            <a href="#" className="text-gray-900 hover:text-blue-500 transition-colors">
              <FaTelegram className='w-5 h-5' />
            </a>
            {/* TikTok */}
            <a href="#" className="text-gray-900 hover:text-gray-700 transition-colors">
              <FaTiktok className='w-5 h-5' />
            </a>
           {/* Linkedin */}
            <a href="#" className="text-gray-900 hover:text-gray-700 transition-colors">
              <FaLinkedin className='w-5 h-5' />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};
