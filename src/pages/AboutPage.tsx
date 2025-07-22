import React from 'react';
import { Mail, Linkedin, Twitter, Target, Heart, Lightbulb } from 'lucide-react';
import { Newsletter } from '../components/Newsletter';

export function AboutPage() {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-slate-900 to-slate-800 text-white py-16 lg:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <h1 className="text-4xl lg:text-5xl font-bold mb-6">
              À propos d'<span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-orange-600">Entrepreneur Chevronné</span>
            </h1>
            <p className="text-xl text-slate-300">
              Notre mission : Démocratiser l'entrepreneuriat en partageant les meilleures pratiques, 
              outils et témoignages d'entrepreneurs qui transforment leurs visions en réalités.
            </p>
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-16 bg-white dark:bg-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl lg:text-4xl font-bold text-slate-900 dark:text-white mb-6">
                Notre Mission
              </h2>
              <p className="text-lg text-slate-600 dark:text-slate-300 mb-6">
                Entrepreneur Chevronné est né d'une conviction profonde : l'entrepreneuriat est un levier 
                puissant de transformation économique et sociale. Notre rôle est de rendre accessible 
                l'expertise entrepreneuriale à tous ceux qui osent entreprendre.
              </p>
              <p className="text-lg text-slate-600 dark:text-slate-300">
                Nous croyons que chaque entrepreneur, qu'il soit débutant ou expérimenté, mérite d'avoir 
                accès aux meilleures stratégies, outils et retours d'expérience pour maximiser ses chances de succès.
              </p>
            </div>
            <div className="relative">
              <img
                src="https://images.pexels.com/photos/3184433/pexels-photo-3184433.jpeg"
                alt="Équipe entrepreneuriale"
                className="rounded-2xl shadow-2xl"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-16 bg-slate-50 dark:bg-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold text-slate-900 dark:text-white mb-4">
              Nos Valeurs
            </h2>
            <p className="text-xl text-slate-600 dark:text-slate-400 max-w-3xl mx-auto">
              Les principes qui guident notre approche et notre engagement envers la communauté entrepreneuriale
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center p-8 bg-white dark:bg-slate-800 rounded-2xl shadow-lg">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-orange-500 to-orange-600 rounded-full mb-6">
                <Target className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-4">
                Excellence
              </h3>
              <p className="text-slate-600 dark:text-slate-300">
                Nous nous engageons à partager uniquement du contenu de qualité supérieure, 
                testé et approuvé par des entrepreneurs expérimentés.
              </p>
            </div>

            <div className="text-center p-8 bg-white dark:bg-slate-800 rounded-2xl shadow-lg">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-emerald-500 to-emerald-600 rounded-full mb-6">
                <Heart className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-4">
                Bienveillance
              </h3>
              <p className="text-slate-600 dark:text-slate-300">
                Nous créons un environnement d'apprentissage positif où chaque entrepreneur 
                peut grandir sans jugement, dans le respect mutuel.
              </p>
            </div>

            <div className="text-center p-8 bg-white dark:bg-slate-800 rounded-2xl shadow-lg">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full mb-6">
                <Lightbulb className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-4">
                Innovation
              </h3>
              <p className="text-slate-600 dark:text-slate-300">
                Nous restons à l'avant-garde des tendances entrepreneuriales et adaptons 
                constamment notre approche aux évolutions du marché.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Author Section */}
      <section className="py-16 bg-white dark:bg-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="relative">
              <img
                src="https://images.pexels.com/photos/3184338/pexels-photo-3184338.jpeg"
                alt="Entrepreneur Chevronné"
                className="rounded-2xl shadow-2xl"
              />
            </div>
            <div>
              <h2 className="text-3xl lg:text-4xl font-bold text-slate-900 dark:text-white mb-6">
                L'Auteur
              </h2>
              <p className="text-lg text-slate-600 dark:text-slate-300 mb-6">
                Fort de plus de 15 ans d'expérience dans l'entrepreneuriat et l'accompagnement 
                d'entreprises, je partage mes connaissances et celles d'un réseau de 200+ entrepreneurs 
                pour vous aider à éviter les pièges courants et accélérer votre croissance.
              </p>
              <p className="text-lg text-slate-600 dark:text-slate-300 mb-8">
                Ayant créé et développé plusieurs entreprises, conseillé des startups et accompagné 
                des dirigeants, je comprends les défis uniques de l'entrepreneuriat moderne.
              </p>
              
              <div className="flex space-x-4">
                <a
                  href="mailto:contact@entrepreneur-chevronne.com"
                  className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-orange-500 to-orange-600 text-white font-semibold rounded-lg hover:from-orange-600 hover:to-orange-700 transition-all duration-300"
                >
                  <Mail className="w-5 h-5 mr-2" />
                  Me contacter
                </a>
                <a
                  href="https://linkedin.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center px-6 py-3 border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 font-semibold rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700 transition-all duration-300"
                >
                  <Linkedin className="w-5 h-5 mr-2" />
                  LinkedIn
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Newsletter */}
      <section className="py-16 bg-slate-50 dark:bg-slate-900">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <Newsletter />
        </div>
      </section>

      {/* Contact CTA */}
      <section className="py-16 bg-gradient-to-r from-slate-900 to-slate-800 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl lg:text-4xl font-bold mb-6">
            Construisons l'avenir ensemble
          </h2>
          <p className="text-xl text-slate-300 mb-8">
            Vous avez une question, une suggestion, ou souhaitez partager votre témoignage ? 
            N'hésitez pas à nous contacter.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="mailto:contact@entrepreneur-chevronne.com"
              className="px-8 py-4 bg-gradient-to-r from-orange-500 to-orange-600 text-white font-semibold rounded-lg hover:from-orange-600 hover:to-orange-700 transition-all duration-300"
            >
              Nous écrire
            </a>
            <a
              href="https://linkedin.com"
              target="_blank"
              rel="noopener noreferrer"
              className="px-8 py-4 border-2 border-white text-white font-semibold rounded-lg hover:bg-white hover:text-slate-900 transition-all duration-300"
            >
              Nous suivre
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}