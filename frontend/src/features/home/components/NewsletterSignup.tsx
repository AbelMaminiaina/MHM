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
    <section className="bg-gradient-to-r from-red-50 via-white to-red-50 py-16 px-8">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
          {/* Left Side - Text */}
          <div className="text-gray-800">
            <h2 className="text-3xl md:text-4xl font-black uppercase mb-4 text-red-900">
              Inscrivez-vous pour rester informé
            </h2>
            <p className="text-lg md:text-xl leading-relaxed">
              Pour recevoir toute l'actualité du Madagasikara hoan'ny Malagasy et connaître les
              événements organisés près de chez vous, inscrivez-vous.
            </p>
          </div>

          {/* Right Side - Form */}
          <div>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="flex gap-3">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Votre adresse électronique"
                  className="flex-1 px-4 py-3 text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-red-600 border border-gray-300"
                  required
                />
                <button
                  type="submit"
                  className="bg-red-700 text-white px-8 py-3 font-bold hover:bg-red-800 transition-colors whitespace-nowrap shadow-lg"
                >
                  Je m'inscris
                </button>
              </div>

              <div className="flex items-start gap-3">
                <input
                  type="checkbox"
                  id="newsletter-consent"
                  checked={accepted}
                  onChange={(e) => setAccepted(e.target.checked)}
                  className="mt-1 w-5 h-5 accent-red-700 cursor-pointer"
                  required
                />
                <label htmlFor="newsletter-consent" className="text-gray-700 text-sm leading-relaxed cursor-pointer">
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
