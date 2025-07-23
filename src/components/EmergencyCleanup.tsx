import React, { useState } from 'react';
import { AlertTriangle, Trash2, RefreshCw } from 'lucide-react';
import { EMERGENCY_RESET, checkStorageStatus } from '../utils/emergencyCleanup';

export function EmergencyCleanup() {
  const [showConfirm, setShowConfirm] = useState(false);
  const [isResetting, setIsResetting] = useState(false);

  const handleEmergencyReset = () => {
    if (!showConfirm) {
      setShowConfirm(true);
      return;
    }

    setIsResetting(true);
    console.log('🚨 DÉCLENCHEMENT DU RESET D\'URGENCE...');
    
    try {
      EMERGENCY_RESET();
    } catch (error) {
      console.error('Erreur lors du reset:', error);
      setIsResetting(false);
    }
  };

  const handleCheckStatus = () => {
    checkStorageStatus();
  };

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <div className="bg-red-50 dark:bg-red-900/20 border-2 border-red-200 dark:border-red-800 rounded-lg p-4 shadow-lg max-w-sm">
        <div className="flex items-center mb-3">
          <AlertTriangle className="h-5 w-5 text-red-600 dark:text-red-400 mr-2" />
          <h3 className="text-sm font-semibold text-red-800 dark:text-red-300">
            Problème localStorage
          </h3>
        </div>
        
        <p className="text-xs text-red-700 dark:text-red-400 mb-3">
          Si l'admin ne fonctionne pas, utilisez le reset d'urgence.
        </p>

        <div className="space-y-2">
          <button
            onClick={handleCheckStatus}
            className="w-full px-3 py-2 text-xs bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors flex items-center justify-center"
          >
            <RefreshCw className="h-3 w-3 mr-1" />
            Vérifier l'état
          </button>

          <button
            onClick={handleEmergencyReset}
            disabled={isResetting}
            className={`w-full px-3 py-2 text-xs rounded transition-colors flex items-center justify-center ${
              showConfirm
                ? 'bg-red-600 text-white hover:bg-red-700'
                : 'bg-red-500 text-white hover:bg-red-600'
            } ${isResetting ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            <Trash2 className="h-3 w-3 mr-1" />
            {isResetting
              ? 'Reset en cours...'
              : showConfirm
              ? 'CONFIRMER LE RESET'
              : 'Reset d\'urgence'
            }
          </button>

          {showConfirm && (
            <button
              onClick={() => setShowConfirm(false)}
              className="w-full px-3 py-2 text-xs bg-gray-500 text-white rounded hover:bg-gray-600 transition-colors"
            >
              Annuler
            </button>
          )}
        </div>
      </div>
    </div>
  );
}