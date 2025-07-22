import React, { useState } from 'react';
import { Mail, CheckCircle } from 'lucide-react';

export function Newsletter() {
  const [email, setEmail] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) {
      // Simulation d'inscription
      console.log('Newsletter subscription:', email);
      setIsSubmitted(true);
      setEmail('');
      setTimeout(() => setIsSubmitted(false), 3000);
    }
  };

  if (isSubmitted) {
    return (
      <div className="bg-gradient-to-r from-green-500 to-emerald-600 rounded-2xl p-8 text-white text-center">
        <CheckCircle className="h-12 w-12 mx-auto mb-4" />
        <h3 className="text-2xl font-bold mb-2">Merci pour votre inscription !</h3>
        <p className="text-green-100">
          Vous recevrez bientôt nos meilleurs conseils entrepreneuriaux.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-r from-orange-500 to-orange-600 rounded-2xl p-8 text-white">
      <div className="max-w-md mx-auto text-center">
        <Mail className="h-12 w-12 mx-auto mb-4 text-orange-100" />
        <h3 className="text-2xl font-bold mb-2">
          Rejoignez notre communauté
        </h3>
        <p className="text-orange-100 mb-6">
          Recevez chaque semaine nos meilleurs conseils, outils et témoignages d'entrepreneurs qui réussissent.
        </p>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-3">
            <input
              type="email"
              placeholder="Votre email professionnel"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="flex-1 px-4 py-3 rounded-lg text-slate-900 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-white focus:ring-opacity-50"
            />
            <button
              type="submit"
              className="px-6 py-3 bg-white text-orange-600 font-semibold rounded-lg hover:bg-orange-50 focus:outline-none focus:ring-2 focus:ring-white focus:ring-opacity-50 transition-all duration-300 whitespace-nowrap"
            >
              S'inscrire
            </button>
          </div>
        </form>
        
        <p className="text-xs text-orange-200 mt-4">
          Aucun spam. Désinscription en un clic. Vos données sont protégées.
        </p>
      </div>
    </div>
  );
}