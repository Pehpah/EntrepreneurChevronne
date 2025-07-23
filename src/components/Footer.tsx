import React from 'react';
import { Mail, Linkedin, Twitter, Facebook, BookOpen } from 'lucide-react';

interface FooterProps {
  onPageChange?: (page: string) => void;
}

export function Footer({ onPageChange }: FooterProps) {
  return (
    <footer className="bg-slate-900 dark:bg-slate-950 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Logo et Description */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center space-x-3 mb-4">
              <div className="bg-gradient-to-r from-orange-500 to-orange-600 p-2 rounded-lg">
                <BookOpen className="h-6 w-6 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-bold">Entrepreneur Chevronné</h3>
                <p className="text-sm text-slate-400">Votre guide vers le succès</p>
              </div>
            </div>
            <p className="text-slate-300 mb-6 max-w-md">
              Découvrez les stratégies, outils et témoignages qui font la différence dans le monde de l'entrepreneuriat. 
              Rejoignez notre communauté d'entrepreneurs ambitieux et chevronnés.
            </p>
            <div className="flex space-x-4">
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-slate-400 hover:text-white transition-colors duration-300"
              >
                <Linkedin className="h-5 w-5" />
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-slate-400 hover:text-white transition-colors duration-300"
              >
                <Twitter className="h-5 w-5" />
              </a>
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-slate-400 hover:text-white transition-colors duration-300"
              >
                <Facebook className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Navigation */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Navigation</h4>
            <ul className="space-y-2">
              <li>
                <button 
                  onClick={() => onPageChange?.('accueil')} 
                  className="text-slate-300 hover:text-white transition-colors duration-300"
                >
                  Accueil
                </button>
              </li>
              <li>
                <button 
                  onClick={() => onPageChange?.('articles')} 
                  className="text-slate-300 hover:text-white transition-colors duration-300"
                >
                  Articles
                </button>
              </li>
              <li>
                <button 
                  onClick={() => onPageChange?.('temoignages')} 
                  className="text-slate-300 hover:text-white transition-colors duration-300"
                >
                  Témoignages
                </button>
              </li>
              <li>
                <button 
                  onClick={() => onPageChange?.('ressources')} 
                  className="text-slate-300 hover:text-white transition-colors duration-300"
                >
                  Ressources
                </button>
              </li>
              <li>
                <button 
                  onClick={() => onPageChange?.('collaborations')} 
                  className="text-slate-300 hover:text-white transition-colors duration-300"
                >
                  Collaborations
                </button>
              </li>
            </ul>
          </div>

          {/* Contact & Legal */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Contact & Légal</h4>
            <ul className="space-y-2">
              <li className="flex items-center space-x-2">
                <Mail className="h-4 w-4 text-slate-400" />
                <span className="text-slate-300">contact@entrepreneur-chevronne.com</span>
              </li>
              <li>
                <button 
                  onClick={() => onPageChange?.('a-propos')} 
                  className="text-slate-300 hover:text-white transition-colors duration-300"
                >
                  À propos
                </button>
              </li>
              <li>
                <button 
                  onClick={() => onPageChange?.('legal')} 
                  className="text-slate-300 hover:text-white transition-colors duration-300"
                >
                  Mentions légales
                </button>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-slate-700 mt-8 pt-8 text-center">
          <p className="text-slate-400">
            © {new Date().getFullYear()} Entrepreneur Chevronné. Tous droits réservés.
          </p>
        </div>
      </div>
    </footer>
  );
}