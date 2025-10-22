import React, { useState } from 'react';
import { Shield, Eye, FileText, Scale, Cookie, Mail, Phone, MapPin } from 'lucide-react';

type LegalSection = 'mentions' | 'privacy' | 'terms' | 'cookies';

export function LegalPage() {
  const [activeSection, setActiveSection] = useState<LegalSection>('mentions');

  const sections = [
    { id: 'mentions' as LegalSection, title: 'Mentions Légales', icon: FileText },
    { id: 'privacy' as LegalSection, title: 'Politique de Confidentialité', icon: Eye },
    { id: 'terms' as LegalSection, title: 'Conditions d\'Utilisation', icon: Scale },
    { id: 'cookies' as LegalSection, title: 'Politique des Cookies', icon: Cookie },
  ];

  const renderMentionsLegales = () => (
    <div className="prose dark:prose-invert max-w-none">
      <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">Mentions Légales</h2>
      
      <div className="bg-orange-50 dark:bg-orange-900/20 p-6 rounded-lg mb-8">
        <h3 className="text-lg font-semibold mb-4 text-orange-800 dark:text-orange-200">
          Informations sur l'éditeur
        </h3>
        <div className="space-y-3">
          <div className="flex items-center">
            <FileText className="h-5 w-5 text-orange-600 mr-3" />
            <span><strong>Raison sociale :</strong> Blog Entrepreneur Pro SARL</span>
          </div>
          <div className="flex items-center">
            <MapPin className="h-5 w-5 text-orange-600 mr-3" />
            <span><strong>Siège social :</strong> 123 Avenue de l'Innovation, 75001 Paris, France</span>
          </div>
          <div className="flex items-center">
            <Phone className="h-5 w-5 text-orange-600 mr-3" />
            <span><strong>Téléphone :</strong> +33 1 23 45 67 89</span>
          </div>
          <div className="flex items-center">
            <Mail className="h-5 w-5 text-orange-600 mr-3" />
            <span><strong>Email :</strong> contact@blogentrepreneur.fr</span>
          </div>
        </div>
      </div>

      <h3 className="text-xl font-semibold mb-4">Identification de l'entreprise</h3>
      <ul className="list-disc pl-6 mb-6 space-y-2">
        <li><strong>SIRET :</strong> 123 456 789 00012</li>
        <li><strong>RCS :</strong> Paris B 123 456 789</li>
        <li><strong>Code APE :</strong> 6201Z (Programmation informatique)</li>
        <li><strong>TVA Intracommunautaire :</strong> FR12345678901</li>
        <li><strong>Capital social :</strong> 10 000 €</li>
      </ul>

      <h3 className="text-xl font-semibold mb-4">Directeur de la publication</h3>
      <p className="mb-6">
        <strong>Nom :</strong> Jean Entrepreneur<br />
        <strong>Qualité :</strong> Gérant<br />
        <strong>Email :</strong> direction@blogentrepreneur.fr
      </p>

      <h3 className="text-xl font-semibold mb-4">Hébergement</h3>
      <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg mb-6">
        <p><strong>Hébergeur :</strong> OVH SAS</p>
        <p><strong>Adresse :</strong> 2 rue Kellermann, 59100 Roubaix, France</p>
        <p><strong>Téléphone :</strong> 1007</p>
        <p><strong>Site web :</strong> <a href="https://www.ovh.com" className="text-orange-600 hover:underline">www.ovh.com</a></p>
      </div>

      <h3 className="text-xl font-semibold mb-4">Propriété intellectuelle</h3>
      <p className="mb-4">
        L'ensemble de ce site relève de la législation française et internationale sur le droit d'auteur 
        et la propriété intellectuelle. Tous les droits de reproduction sont réservés, y compris pour 
        les documents téléchargeables et les représentations iconographiques et photographiques.
      </p>
      <p className="mb-6">
        La reproduction de tout ou partie de ce site sur un support électronique quel qu'il soit est 
        formellement interdite sauf autorisation expresse du directeur de la publication.
      </p>

      <h3 className="text-xl font-semibold mb-4">Responsabilité</h3>
      <p className="mb-6">
        Les informations contenues sur ce site sont aussi précises que possible et le site remis à jour 
        à différentes périodes de l'année, mais peut toutefois contenir des inexactitudes ou des omissions. 
        Si vous constatez une lacune, erreur ou ce qui parait être un dysfonctionnement, merci de bien 
        vouloir le signaler par email, à l'adresse contact@blogentrepreneur.fr, en décrivant le problème 
        de la manière la plus précise possible.
      </p>
    </div>
  );

  const renderPrivacyPolicy = () => (
    <div className="prose dark:prose-invert max-w-none">
      <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">Politique de Confidentialité</h2>
      
      <div className="bg-blue-50 dark:bg-blue-900/20 p-6 rounded-lg mb-8">
        <h3 className="text-lg font-semibold mb-4 text-blue-800 dark:text-blue-200">
          <Shield className="inline h-5 w-5 mr-2" />
          Engagement de confidentialité
        </h3>
        <p className="text-blue-700 dark:text-blue-300">
          Nous nous engageons à protéger vos données personnelles et à respecter votre vie privée. 
          Cette politique explique comment nous collectons, utilisons et protégeons vos informations.
        </p>
      </div>

      <h3 className="text-xl font-semibold mb-4">1. Données collectées</h3>
      <div className="mb-6">
        <h4 className="text-lg font-medium mb-3">Données collectées automatiquement :</h4>
        <ul className="list-disc pl-6 space-y-1">
          <li>Adresse IP</li>
          <li>Type de navigateur et version</li>
          <li>Système d'exploitation</li>
          <li>Pages visitées et temps passé sur le site</li>
          <li>Date et heure de visite</li>
          <li>Site web de provenance</li>
        </ul>

        <h4 className="text-lg font-medium mb-3 mt-6">Données fournies volontairement :</h4>
        <ul className="list-disc pl-6 space-y-1">
          <li>Nom et prénom (formulaires de contact)</li>
          <li>Adresse email</li>
          <li>Numéro de téléphone (optionnel)</li>
          <li>Entreprise (optionnel)</li>
          <li>Message ou commentaire</li>
        </ul>
      </div>

      <h3 className="text-xl font-semibold mb-4">2. Utilisation des données</h3>
      <p className="mb-4">Vos données personnelles sont utilisées pour :</p>
      <ul className="list-disc pl-6 mb-6 space-y-1">
        <li>Répondre à vos demandes et questions</li>
        <li>Améliorer notre site web et nos services</li>
        <li>Analyser l'utilisation du site (analytics)</li>
        <li>Vous envoyer notre newsletter (avec votre consentement)</li>
        <li>Respecter nos obligations légales</li>
      </ul>

      <h3 className="text-xl font-semibold mb-4">3. Base légale du traitement</h3>
      <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg mb-6">
        <ul className="space-y-2">
          <li><strong>Consentement :</strong> Newsletter, cookies non essentiels</li>
          <li><strong>Intérêt légitime :</strong> Analytics, amélioration du site</li>
          <li><strong>Exécution d'un contrat :</strong> Réponse aux demandes</li>
          <li><strong>Obligation légale :</strong> Conservation des données de connexion</li>
        </ul>
      </div>

      <h3 className="text-xl font-semibold mb-4">4. Partage des données</h3>
      <p className="mb-4">
        Nous ne vendons, n'échangeons, ni ne transférons vos données personnelles à des tiers, 
        sauf dans les cas suivants :
      </p>
      <ul className="list-disc pl-6 mb-6 space-y-1">
        <li>Prestataires techniques (hébergement, analytics) sous contrat de sous-traitance</li>
        <li>Obligations légales ou judiciaires</li>
        <li>Protection de nos droits et de notre sécurité</li>
      </ul>

      <h3 className="text-xl font-semibold mb-4">5. Vos droits</h3>
      <div className="grid md:grid-cols-2 gap-4 mb-6">
        <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg">
          <h4 className="font-semibold mb-2 text-green-800 dark:text-green-200">Droits RGPD</h4>
          <ul className="text-sm space-y-1">
            <li>• Droit d'accès</li>
            <li>• Droit de rectification</li>
            <li>• Droit à l'effacement</li>
            <li>• Droit à la portabilité</li>
          </ul>
        </div>
        <div className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-lg">
          <h4 className="font-semibold mb-2 text-purple-800 dark:text-purple-200">Comment exercer vos droits</h4>
          <p className="text-sm">
            Contactez-nous à l'adresse : <br />
            <strong>privacy@blogentrepreneur.fr</strong><br />
            Réponse sous 30 jours maximum
          </p>
        </div>
      </div>

      <h3 className="text-xl font-semibold mb-4">6. Sécurité et conservation</h3>
      <p className="mb-4">
        Nous mettons en œuvre des mesures techniques et organisationnelles appropriées pour protéger 
        vos données contre tout accès non autorisé, altération, divulgation ou destruction.
      </p>
      <div className="bg-yellow-50 dark:bg-yellow-900/20 p-4 rounded-lg mb-6">
        <h4 className="font-semibold mb-2 text-yellow-800 dark:text-yellow-200">Durées de conservation</h4>
        <ul className="text-sm space-y-1">
          <li>• Données de contact : 3 ans après dernier contact</li>
          <li>• Données analytics : 26 mois</li>
          <li>• Logs de connexion : 12 mois</li>
          <li>• Newsletter : jusqu'à désinscription</li>
        </ul>
      </div>
    </div>
  );

  const renderTermsOfService = () => (
    <div className="prose dark:prose-invert max-w-none">
      <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">Conditions d'Utilisation</h2>
      
      <div className="bg-red-50 dark:bg-red-900/20 p-6 rounded-lg mb-8">
        <h3 className="text-lg font-semibold mb-4 text-red-800 dark:text-red-200">
          <Scale className="inline h-5 w-5 mr-2" />
          Acceptation des conditions
        </h3>
        <p className="text-red-700 dark:text-red-300">
          En accédant et en utilisant ce site web, vous acceptez d'être lié par ces conditions d'utilisation. 
          Si vous n'acceptez pas ces conditions, veuillez ne pas utiliser notre site.
        </p>
      </div>

      <h3 className="text-xl font-semibold mb-4">1. Objet</h3>
      <p className="mb-6">
        Les présentes conditions générales d'utilisation (CGU) ont pour objet de définir les modalités 
        et conditions d'utilisation du site blogentrepreneur.fr, ainsi que les droits et obligations 
        des parties dans ce cadre.
      </p>

      <h3 className="text-xl font-semibold mb-4">2. Accès au service</h3>
      <p className="mb-4">Le service est accessible :</p>
      <ul className="list-disc pl-6 mb-6 space-y-1">
        <li>24h/24, 7j/7 sauf en cas de force majeure ou d'événement hors du contrôle de l'éditeur</li>
        <li>Depuis tout ordinateur ou appareil mobile connecté à Internet</li>
        <li>Gratuitement pour la consultation des contenus publics</li>
      </ul>

      <h3 className="text-xl font-semibold mb-4">3. Utilisation du site</h3>
      <div className="mb-6">
        <h4 className="text-lg font-medium mb-3">Utilisation autorisée :</h4>
        <ul className="list-disc pl-6 space-y-1 mb-4">
          <li>Consultation des contenus à des fins personnelles et professionnelles</li>
          <li>Partage des liens vers nos articles (avec attribution)</li>
          <li>Citation d'extraits courts avec mention de la source</li>
        </ul>

        <h4 className="text-lg font-medium mb-3">Utilisation interdite :</h4>
        <ul className="list-disc pl-6 space-y-1">
          <li>Reproduction intégrale des contenus sans autorisation</li>
          <li>Utilisation commerciale sans accord préalable</li>
          <li>Tentative de piratage ou d'intrusion</li>
          <li>Publication de contenus illégaux ou diffamatoires</li>
          <li>Spam ou envoi de messages non sollicités</li>
        </ul>
      </div>

      <h3 className="text-xl font-semibold mb-4">4. Contenu et propriété intellectuelle</h3>
      <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg mb-6">
        <p className="mb-2">
          <strong>Tous les contenus présents sur ce site (textes, images, vidéos, logos, etc.) sont protégés 
          par les droits d'auteur et sont la propriété exclusive de Blog Entrepreneur Pro ou de ses partenaires.</strong>
        </p>
        <p className="text-sm">
          Toute reproduction, même partielle, est soumise à autorisation préalable.
        </p>
      </div>

      <h3 className="text-xl font-semibold mb-4">5. Responsabilité</h3>
      <p className="mb-4">
        L'éditeur s'efforce de fournir des informations exactes et à jour, mais ne peut garantir 
        l'exactitude, la complétude ou l'actualité des informations diffusées.
      </p>
      <div className="bg-yellow-50 dark:bg-yellow-900/20 p-4 rounded-lg mb-6">
        <h4 className="font-semibold mb-2 text-yellow-800 dark:text-yellow-200">Limitation de responsabilité</h4>
        <ul className="text-sm space-y-1">
          <li>• Les conseils donnés sont à titre informatif uniquement</li>
          <li>• Aucune garantie de résultat n'est apportée</li>
          <li>• L'utilisateur reste seul responsable de ses décisions</li>
          <li>• Nous ne sommes pas responsables des dommages indirects</li>
        </ul>
      </div>

      <h3 className="text-xl font-semibold mb-4">6. Modification des conditions</h3>
      <p className="mb-6">
        Nous nous réservons le droit de modifier ces conditions d'utilisation à tout moment. 
        Les modifications prendront effet dès leur publication sur le site. Il est conseillé 
        de consulter régulièrement cette page.
      </p>

      <h3 className="text-xl font-semibold mb-4">7. Droit applicable et juridiction</h3>
      <p className="mb-6">
        Les présentes conditions sont soumises au droit français. En cas de litige, les tribunaux 
        français seront seuls compétents.
      </p>
    </div>
  );

  const renderCookiePolicy = () => (
    <div className="prose dark:prose-invert max-w-none">
      <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">Politique des Cookies</h2>
      
      <div className="bg-purple-50 dark:bg-purple-900/20 p-6 rounded-lg mb-8">
        <h3 className="text-lg font-semibold mb-4 text-purple-800 dark:text-purple-200">
          <Cookie className="inline h-5 w-5 mr-2" />
          Qu'est-ce qu'un cookie ?
        </h3>
        <p className="text-purple-700 dark:text-purple-300">
          Un cookie est un petit fichier texte déposé sur votre ordinateur lors de la visite d'un site web. 
          Il permet de mémoriser des informations relatives à votre navigation.
        </p>
      </div>

      <h3 className="text-xl font-semibold mb-4">1. Types de cookies utilisés</h3>
      
      <div className="space-y-6 mb-8">
        <div className="border border-green-200 dark:border-green-800 rounded-lg p-4">
          <h4 className="text-lg font-semibold text-green-800 dark:text-green-200 mb-2">
            Cookies essentiels (obligatoires)
          </h4>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
            Ces cookies sont nécessaires au fonctionnement du site et ne peuvent pas être désactivés.
          </p>
          <ul className="text-sm space-y-1">
            <li>• <strong>session_id :</strong> Maintien de la session utilisateur</li>
            <li>• <strong>csrf_token :</strong> Protection contre les attaques CSRF</li>
            <li>• <strong>cookie_consent :</strong> Mémorisation de vos préférences cookies</li>
          </ul>
        </div>

        <div className="border border-blue-200 dark:border-blue-800 rounded-lg p-4">
          <h4 className="text-lg font-semibold text-blue-800 dark:text-blue-200 mb-2">
            Cookies analytiques (optionnels)
          </h4>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
            Ces cookies nous aident à comprendre comment vous utilisez notre site.
          </p>
          <ul className="text-sm space-y-1">
            <li>• <strong>_ga :</strong> Google Analytics - Identification des visiteurs uniques</li>
            <li>• <strong>_gat :</strong> Google Analytics - Limitation du taux de requêtes</li>
            <li>• <strong>_gid :</strong> Google Analytics - Identification des sessions</li>
          </ul>
        </div>

        <div className="border border-orange-200 dark:border-orange-800 rounded-lg p-4">
          <h4 className="text-lg font-semibold text-orange-800 dark:text-orange-200 mb-2">
            Cookies de préférences (optionnels)
          </h4>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
            Ces cookies mémorisent vos préférences pour améliorer votre expérience.
          </p>
          <ul className="text-sm space-y-1">
            <li>• <strong>theme_preference :</strong> Thème sombre/clair choisi</li>
            <li>• <strong>language :</strong> Langue préférée</li>
            <li>• <strong>newsletter_popup :</strong> État de la popup newsletter</li>
          </ul>
        </div>
      </div>

      <h3 className="text-xl font-semibold mb-4">2. Gestion des cookies</h3>
      <div className="bg-gray-50 dark:bg-gray-800 p-6 rounded-lg mb-6">
        <h4 className="font-semibold mb-3">Paramétrer vos préférences</h4>
        <p className="mb-4 text-sm">
          Vous pouvez à tout moment modifier vos préférences concernant les cookies en cliquant 
          sur le bouton ci-dessous ou en accédant aux paramètres de votre navigateur.
        </p>
        <button className="bg-orange-600 text-white px-6 py-3 rounded-lg hover:bg-orange-700 transition-colors">
          Gérer mes cookies
        </button>
      </div>

      <h3 className="text-xl font-semibold mb-4">3. Paramétrage du navigateur</h3>
      <div className="grid md:grid-cols-2 gap-4 mb-6">
        <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
          <h4 className="font-semibold mb-2 text-blue-800 dark:text-blue-200">Chrome</h4>
          <p className="text-sm">
            Paramètres → Confidentialité et sécurité → Cookies et autres données de sites
          </p>
        </div>
        <div className="bg-red-50 dark:bg-red-900/20 p-4 rounded-lg">
          <h4 className="font-semibold mb-2 text-red-800 dark:text-red-200">Firefox</h4>
          <p className="text-sm">
            Paramètres → Vie privée et sécurité → Cookies et données de sites
          </p>
        </div>
        <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg">
          <h4 className="font-semibold mb-2 text-green-800 dark:text-green-200">Safari</h4>
          <p className="text-sm">
            Préférences → Confidentialité → Gérer les données de sites web
          </p>
        </div>
        <div className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-lg">
          <h4 className="font-semibold mb-2 text-purple-800 dark:text-purple-200">Edge</h4>
          <p className="text-sm">
            Paramètres → Cookies et autorisations de site → Cookies et données stockées
          </p>
        </div>
      </div>

      <h3 className="text-xl font-semibold mb-4">4. Durée de conservation</h3>
      <div className="bg-yellow-50 dark:bg-yellow-900/20 p-4 rounded-lg mb-6">
        <ul className="space-y-2 text-sm">
          <li><strong>Cookies de session :</strong> Supprimés à la fermeture du navigateur</li>
          <li><strong>Cookies analytiques :</strong> 26 mois maximum</li>
          <li><strong>Cookies de préférences :</strong> 12 mois maximum</li>
          <li><strong>Consentement cookies :</strong> 13 mois</li>
        </ul>
      </div>

      <h3 className="text-xl font-semibold mb-4">5. Contact</h3>
      <p className="mb-4">
        Pour toute question concernant notre politique de cookies, vous pouvez nous contacter à :
      </p>
      <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
        <p><strong>Email :</strong> cookies@blogentrepreneur.fr</p>
        <p><strong>Adresse :</strong> 123 Avenue de l'Innovation, 75001 Paris</p>
      </div>
    </div>
  );

  const renderContent = () => {
    switch (activeSection) {
      case 'mentions':
        return renderMentionsLegales();
      case 'privacy':
        return renderPrivacyPolicy();
      case 'terms':
        return renderTermsOfService();
      case 'cookies':
        return renderCookiePolicy();
      default:
        return renderMentionsLegales();
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-slate-800 to-slate-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            Informations Légales
          </h1>
          <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto opacity-90">
            Toutes les informations légales, conditions d'utilisation et politiques de confidentialité
          </p>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar Navigation */}
          <div className="lg:w-1/4">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 sticky top-8">
              <h2 className="text-lg font-semibold mb-6 text-gray-900 dark:text-white">
                Sections
              </h2>
              <nav className="space-y-2">
                {sections.map((section) => {
                  const Icon = section.icon;
                  return (
                    <button
                      key={section.id}
                      onClick={() => setActiveSection(section.id)}
                      className={`w-full flex items-center px-4 py-3 rounded-lg text-left transition-colors ${
                        activeSection === section.id
                          ? 'bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300'
                          : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                      }`}
                    >
                      <Icon className="h-5 w-5 mr-3" />
                      <span className="text-sm font-medium">{section.title}</span>
                    </button>
                  );
                })}
              </nav>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:w-3/4">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8">
              {renderContent()}
            </div>
          </div>
        </div>
      </div>

      {/* Contact Section */}
      <section className="bg-gradient-to-r from-orange-600 to-pink-600 text-white py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-6">
            Une Question Légale ?
          </h2>
          <p className="text-xl mb-8">
            Notre équipe juridique est à votre disposition pour répondre à vos questions
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="mailto:legal@blogentrepreneur.fr"
              className="bg-white text-orange-600 px-8 py-4 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
            >
              Nous Contacter
            </a>
            <button className="border-2 border-white text-white px-8 py-4 rounded-lg font-semibold hover:bg-white hover:text-orange-600 transition-colors">
              FAQ Juridique
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}