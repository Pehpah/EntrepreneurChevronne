import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';

// =============================================================================
// CONFIGURATION ET INITIALISATION
// =============================================================================

// Configuration du mode strict de React
const ENABLE_STRICT_MODE = process.env.NODE_ENV === 'development';

// Configuration des service workers (PWA)
const ENABLE_SERVICE_WORKER = process.env.NODE_ENV === 'production';

// =============================================================================
// INITIALISATION DES SERVICES
// =============================================================================

/**
 * Initialise les services de l'application
 */
const initializeServices = async () => {
  try {
    // Initialisation des analytics (exemple avec Google Analytics)
    if (process.env.REACT_APP_GA_TRACKING_ID) {
      console.log('📊 Initialisation des analytics...');
      // Ici vous pouvez initialiser Google Analytics, Mixpanel, etc.
    }

    // Initialisation du monitoring d'erreurs (exemple avec Sentry)
    if (process.env.REACT_APP_SENTRY_DSN) {
      console.log('🔍 Initialisation du monitoring d\'erreurs...');
      // Ici vous pouvez initialiser Sentry ou autre service de monitoring
    }

    // Vérification de la connectivité
    if (navigator.onLine) {
      console.log('🌐 Application en ligne');
    } else {
      console.log('📴 Application hors ligne');
    }

    console.log('✅ Services initialisés avec succès');
  } catch (error) {
    console.error('❌ Erreur lors de l\'initialisation des services:', error);
  }
};

// =============================================================================
// GESTION DES ERREURS GLOBALES
// =============================================================================

/**
 * Gestionnaire d'erreurs global pour les erreurs non capturées
 */
const setupGlobalErrorHandlers = () => {
  // Erreurs JavaScript non gérées
  window.addEventListener('error', (event) => {
    console.error('🚨 Erreur JavaScript non gérée:', {
      message: event.message,
      filename: event.filename,
      lineno: event.lineno,
      colno: event.colno,
      error: event.error,
    });

    // Ici vous pouvez envoyer l'erreur à un service de monitoring
    // sendErrorToMonitoring(event.error);
  });

  // Promesses rejetées non gérées
  window.addEventListener('unhandledrejection', (event) => {
    console.error('🚨 Promesse rejetée non gérée:', event.reason);

    // Ici vous pouvez envoyer l'erreur à un service de monitoring
    // sendErrorToMonitoring(event.reason);
  });

  // Gestion des erreurs de ressources (images, scripts, etc.)
  window.addEventListener('error', (event) => {
    if (event.target !== window) {
      console.error('🚨 Erreur de chargement de ressource:', {
        element: event.target,
        source: (event.target as any)?.src || (event.target as any)?.href,
      });
    }
  }, true);
};

// =============================================================================
// CONFIGURATION DU SERVICE WORKER (PWA)
// =============================================================================

/**
 * Enregistre le service worker pour les fonctionnalités PWA
 */
const registerServiceWorker = async () => {
  if (!ENABLE_SERVICE_WORKER || !('serviceWorker' in navigator)) {
    return;
  }

  try {
    console.log('📱 Enregistrement du service worker...');
    
    const registration = await navigator.serviceWorker.register('/sw.js');
    
    console.log('✅ Service worker enregistré:', registration.scope);

    // Écouter les mises à jour du service worker
    registration.addEventListener('updatefound', () => {
      console.log('🔄 Mise à jour du service worker détectée');
      
      const newWorker = registration.installing;
      if (newWorker) {
        newWorker.addEventListener('statechange', () => {
          if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
            console.log('🆕 Nouvelle version disponible');
            // Ici vous pouvez afficher une notification à l'utilisateur
            // showUpdateNotification();
          }
        });
      }
    });

  } catch (error) {
    console.error('❌ Erreur lors de l\'enregistrement du service worker:', error);
  }
};

// =============================================================================
// DÉTECTION DES CAPACITÉS DU NAVIGATEUR
// =============================================================================

/**
 * Vérifie les capacités du navigateur et affiche des avertissements si nécessaire
 */
const checkBrowserCapabilities = () => {
  const capabilities = {
    localStorage: typeof Storage !== 'undefined',
    sessionStorage: typeof Storage !== 'undefined',
    webWorkers: typeof Worker !== 'undefined',
    fetch: typeof fetch !== 'undefined',
    promises: typeof Promise !== 'undefined',
    es6: (() => {
      try {
        new Function('(a = 0) => a');
        return true;
      } catch (err) {
        return false;
      }
    })(),
  };

  const unsupportedFeatures = Object.entries(capabilities)
    .filter(([, supported]) => !supported)
    .map(([feature]) => feature);

  if (unsupportedFeatures.length > 0) {
    console.warn('⚠️ Fonctionnalités non supportées:', unsupportedFeatures);
    
    // Afficher un message à l'utilisateur si des fonctionnalités critiques manquent
    if (!capabilities.localStorage || !capabilities.fetch || !capabilities.promises) {
      const message = 'Votre navigateur ne supporte pas toutes les fonctionnalités requises. Veuillez le mettre à jour.';
      console.error('❌', message);
      
      // Optionnel: afficher une alerte à l'utilisateur
      // alert(message);
    }
  } else {
    console.log('✅ Toutes les fonctionnalités du navigateur sont supportées');
  }

  return capabilities;
};

// =============================================================================
// INFORMATIONS DE DEBUG
// =============================================================================

/**
 * Affiche les informations de debug en mode développement
 */
const showDebugInfo = () => {
  if (process.env.NODE_ENV !== 'development') {
    return;
  }

  console.group('🔧 Informations de debug');
  console.log('Mode:', process.env.NODE_ENV);
  console.log('Version React:', React.version);
  console.log('User Agent:', navigator.userAgent);
  console.log('Langue:', navigator.language);
  console.log('Plateforme:', navigator.platform);
  console.log('Cookies activés:', navigator.cookieEnabled);
  console.log('Connexion:', navigator.onLine ? 'En ligne' : 'Hors ligne');
  
  // Informations sur l'écran
  console.log('Résolution:', `${screen.width}x${screen.height}`);
  console.log('Viewport:', `${window.innerWidth}x${window.innerHeight}`);
  
  // Variables d'environnement (sans les secrets)
  const envVars = Object.entries(process.env)
    .filter(([key]) => key.startsWith('REACT_APP_') && !key.includes('SECRET') && !key.includes('KEY'))
    .reduce((acc, [key, value]) => ({ ...acc, [key]: value }), {});
  
  if (Object.keys(envVars).length > 0) {
    console.log('Variables d\'environnement:', envVars);
  }
  
  console.groupEnd();
};

// =============================================================================
// INITIALISATION PRINCIPALE
// =============================================================================

/**
 * Fonction principale d'initialisation
 */
const initializeApp = async () => {
  console.log('🚀 Démarrage de l\'application...');

  // Vérifier les capacités du navigateur
  checkBrowserCapabilities();

  // Configurer les gestionnaires d'erreurs
  setupGlobalErrorHandlers();

  // Initialiser les services
  await initializeServices();

  // Enregistrer le service worker
  await registerServiceWorker();

  // Afficher les informations de debug
  showDebugInfo();

  console.log('✅ Application initialisée avec succès');
};

// =============================================================================
// RENDU DE L'APPLICATION
// =============================================================================

/**
 * Composant racine avec gestion d'erreurs
 */
const AppWithErrorBoundary: React.FC = () => {
  return (
    <React.StrictMode={ENABLE_STRICT_MODE}>
      <App />
    </React.StrictMode>
  );
};

// =============================================================================
// POINT D'ENTRÉE PRINCIPAL
// =============================================================================

const main = async () => {
  try {
    // Initialiser l'application
    await initializeApp();

    // Obtenir l'élément racine
    const rootElement = document.getElementById('root');
    
    if (!rootElement) {
      throw new Error('Élément racine #root introuvable dans le DOM');
    }

    // Créer la racine React 18
    const root = ReactDOM.createRoot(rootElement);

    // Rendre l'application
    root.render(
      ENABLE_STRICT_MODE ? (
        <React.StrictMode>
          <App />
        </React.StrictMode>
      ) : (
        <App />
      )
    );

    console.log('🎉 Application rendue avec succès');

  } catch (error) {
    console.error('💥 Erreur fatale lors du démarrage:', error);
    
    // Afficher un message d'erreur à l'utilisateur
    const rootElement = document.getElementById('root');
    if (rootElement) {
      rootElement.innerHTML = `
        <div style="
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          min-height: 100vh;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
          background: #f8fafc;
          color: #334155;
          text-align: center;
          padding: 2rem;
        ">
          <div style="
            background: white;
            padding: 2rem;
            border-radius: 0.5rem;
            box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
            max-width: 400px;
          ">
            <h1 style="color: #dc2626; margin-bottom: 1rem;">
              ⚠️ Erreur de chargement
            </h1>
            <p style="margin-bottom: 1.5rem;">
              Une erreur est survenue lors du chargement de l'application.
            </p>
            <button 
              onclick="window.location.reload()" 
              style="
                background: #3b82f6;
                color: white;
                border: none;
                padding: 0.75rem 1.5rem;
                border-radius: 0.375rem;
                cursor: pointer;
                font-weight: 500;
              "
            >
              Recharger la page
            </button>
          </div>
        </div>
      `;
    }
  }
};

// Démarrer l'application
main();

// =============================================================================
// HOT MODULE REPLACEMENT (HMR) - Développement uniquement
// =============================================================================

if (process.env.NODE_ENV === 'development' && (module as any).hot) {
  (module as any).hot.accept('./App', () => {
    console.log('🔄 Hot reload détecté');
  });
}