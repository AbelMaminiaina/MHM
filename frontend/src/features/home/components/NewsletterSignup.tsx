import { useState } from 'react';

export const NewsletterSignup = () => {
  const [email, setEmail] = useState('');
  const [accepted, setAccepted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email && accepted) {
      console.log('Newsletter signup:', email);
      // Handle newsletter signup
    }
  };

  return (
    <section className="bg-gradient-to-r from-red-50 via-white to-red-50 py-8 sm:py-12 lg:py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 items-center">
          {/* Left Side - Text */}
          <div className="text-gray-800">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-black uppercase mb-3 sm:mb-4 text-red-900">
              Inscrivez-vous pour rester informé
            </h2>
            <p className="text-base sm:text-lg md:text-xl leading-relaxed text-justify">
              Pour recevoir toute l'actualité du Madagasikara hoan'ny Malagasy et connaître les
              événements organisés près de chez vous, inscrivez-vous.
            </p>
          </div>

          {/* Right Side - Form */}
          <div>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="flex flex-col sm:flex-row gap-3">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Votre adresse électronique"
                  className="w-full sm:flex-1 px-3 sm:px-4 py-2.5 sm:py-3 text-sm sm:text-base text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-red-600 border border-gray-300"
                  required
                />
                <button
                  type="submit"
                  className="w-full sm:w-auto bg-red-700 text-white px-6 sm:px-8 py-2.5 sm:py-3 text-sm sm:text-base font-bold hover:bg-red-800 transition-colors whitespace-nowrap shadow-lg"
                >
                  Je m'inscris
                </button>
              </div>

              <div className="flex items-start gap-2 sm:gap-3">
                <input
                  type="checkbox"
                  id="newsletter-consent"
                  checked={accepted}
                  onChange={(e) => setAccepted(e.target.checked)}
                  className="mt-1 w-4 h-4 sm:w-5 sm:h-5 accent-red-700 cursor-pointer flex-shrink-0"
                  required
                />
                <label htmlFor="newsletter-consent" className="text-gray-700 text-xs sm:text-sm leading-relaxed cursor-pointer text-justify">
                  J'accepte de recevoir les newsletters du Madagasikara Hoan'ny Malagasy. Je pourrai
                  toujours me désinscrire en cliquant sur le lien présent en bas de page de la
                  newsletter.{' '}
                  <a href="#" className="underline hover:text-red-600">
                    Lire notre politique de confidentialité.
                  </a>
                </label>
              </div>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};
