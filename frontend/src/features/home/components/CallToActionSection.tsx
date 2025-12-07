import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {FaXTwitter, FaFacebookF, FaLinkedin, FaTiktok, FaYoutube, FaInstagram, FaTelegram} from 'react-icons/fa6'

export const CallToActionSection = () => {
  const navigate = useNavigate();
  return (
    <div className="w-full">
      {/* Newsletter et Support Section */}
      <div className="grid grid-cols-1 md:grid-cols-2">
        {/* Section Teal - Newsletter */}
        <motion.div
          className="bg-gradient-to-r from-teal-600 to-teal-800 px-4 sm:px-6 py-6 sm:py-8 flex flex-col justify-center items-center cursor-pointer"
          initial={{ opacity: 0, x: -50 }}
          whileInView={{ opacity: 1, x: 0 }}
          whileHover={{
            scale: 1.02,
            boxShadow: "0 20px 60px rgba(0, 0, 0, 0.3)",
            transition: { duration: 0.3 }
          }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <motion.h2
            className="text-white text-xs sm:text-sm font-bold mb-3 sm:mb-4 text-center"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            whileHover={{ scale: 1.05, y: -2 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.3, ease: "easeOut" }}
          >
            Tout savoir de l'actualité du MHM et de VAL
          </motion.h2>
          <motion.div
            className="flex w-full max-w-md"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.5, ease: "easeOut" }}
          >
            <input
              type="email"
              placeholder="Votre adresse électronique"
              className="flex-1 px-2.5 sm:px-3 py-2 text-xs bg-transparent border-2 border-white text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-white/50"
            />
            <button className="bg-transparent border-2 border-white border-l-0 px-2.5 sm:px-3 hover:bg-white/10 transition-colors">
              <svg className="w-4 h-4 sm:w-5 sm:h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </button>
          </motion.div>
        </motion.div>

        {/* Section Rouge - Support */}
        <motion.div
          className="bg-gradient-to-r from-red-600 to-red-700 px-4 sm:px-6 py-6 sm:py-8 flex flex-col justify-center items-center cursor-pointer"
          initial={{ opacity: 0, x: 50 }}
          whileInView={{ opacity: 1, x: 0 }}
          whileHover={{
            scale: 1.02,
            boxShadow: "0 20px 60px rgba(0, 0, 0, 0.3)",
            transition: { duration: 0.3 }
          }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <motion.h2
            className="text-white text-xs sm:text-sm font-bold mb-3 sm:mb-4 text-center"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            whileHover={{ scale: 1.05, y: -2 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.3, ease: "easeOut" }}
          >
            Je soutiens la première force de MHM !
          </motion.h2>
          <motion.div
            className="flex gap-2 sm:gap-3"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.5, ease: "easeOut" }}
          >
            <motion.button
              onClick={() => navigate('/adherer')}
              className="bg-red-800 text-white px-4 sm:px-5 py-2 text-xs sm:text-sm font-bold uppercase hover:bg-red-900 transition-colors shadow-lg"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              J'adhère
            </motion.button>
            <motion.button
              className="bg-red-800 text-white px-4 sm:px-5 py-2 text-xs sm:text-sm font-bold uppercase hover:bg-red-900 transition-colors shadow-lg"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Je donne
            </motion.button>
          </motion.div>
        </motion.div>
      </div>

      {/* Section Réseaux Sociaux */}
      <div className="bg-white py-4 sm:py-5 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4">
          <h3 className="text-gray-900 text-xs sm:text-sm font-bold uppercase text-center">
            Suivez le Madagasikara hoan'ny Malagasy
          </h3>
          <div className="flex gap-2.5 sm:gap-3 items-center">
            {/* X (Twitter) */}
            <a href="#" className="text-gray-900 hover:text-blue-600 transition-colors">
              <FaXTwitter className='w-4 h-4 sm:w-5 sm:h-5' />
            </a>
            {/* Facebook */}
            <a href="#" className="text-gray-900 hover:text-blue-600 transition-colors">
              <FaFacebookF className='w-4 h-4 sm:w-5 sm:h-5' />
            </a>
            {/* YouTube */}
            <a href="#" className="text-gray-900 hover:text-red-600 transition-colors">
              <FaYoutube className='w-4 h-4 sm:w-5 sm:h-5' />
            </a>
            {/* Instagram */}
            <a href="#" className="text-gray-900 hover:text-pink-600 transition-colors">
              <FaInstagram className='w-4 h-4 sm:w-5 sm:h-5' />
            </a>
            {/* Telegram */}
            <a href="#" className="text-gray-900 hover:text-blue-500 transition-colors">
              <FaTelegram className='w-4 h-4 sm:w-5 sm:h-5' />
            </a>
            {/* TikTok */}
            <a href="#" className="text-gray-900 hover:text-gray-700 transition-colors">
              <FaTiktok className='w-4 h-4 sm:w-5 sm:h-5' />
            </a>
           {/* Linkedin */}
            <a href="#" className="text-gray-900 hover:text-gray-700 transition-colors">
              <FaLinkedin className='w-4 h-4 sm:w-5 sm:h-5' />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};
