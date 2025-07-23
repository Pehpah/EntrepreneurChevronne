import React, { useState, useEffect } from 'react';
import { AlertTriangle, Trash2, RefreshCw, CheckCircle } from 'lucide-react';
import { EMERGENCY_RESET, checkStorageStatus } from '../utils/emergencyCleanup';

export function EmergencyCleanup() {
  const [showConfirm, setShowConfirm] = useState(false);
  const [isResetting, setIsResetting] = useState(false);
  const [storageStatus, setStorageStatus] = useState<'unknown' | 'ok' | 'warning' | 'error'>('unknown');
  const [isVisible, setIsVisible] = useState(true);

  // Vérifier l'état du stockage au montage
  useEffect(() => {
    const checkStatus = () => {
      try {
        const status = checkStorageStatus();
        
        // Déterminer la gravité
        if (status.quotaUsage > 90) {
          setStorageStatus('error');
        } else if (status.quotaUsage > 70) {
          setStorageStatus('warning');
        } else {
          setStorageStatus('ok');
        }
      } catch (error) {
        setStorageStatus('error');
      }
    };

    checkStatus();
    
    // Vérifier toutes les 30 secondes
    const interval = setInterval(checkStatus, 30000);
    return () => clearInterval(interval);
  }, []);

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
    const status = checkStorageStatus();
    console.log('📊 État du stockage:', status);
    
    // Mettre à jour le statut visuel
    if (status.quotaUsage > 90) {
      setStorageStatus('error');
    } else if (status.quotaUsage > 70) {
      setStorageStatus('warning');
    } else {
      setStorageStatus('ok');
    }
  };

  const getStatusColor = () => {
    switch (storageStatus) {
      case 'ok': return 'green';
      case 'warning': return 'yellow';
      case 'error': return 'red';
      default: return 'gray';
    }
  };

  const getStatusMessage = () => {
    switch (storageStatus) {
      case 'ok': return 'Stockage OK';
      case 'warning': return 'Stockage plein à 70%+';
      case 'error': return 'Quota localStorage dépassé !';
      default: return 'Vérification...';
    }
  };

  if (!isVisible) {
    return (
      <button
        onClick={() => setIsVisible(true)}
        className="fixed bottom-4 right-4 z-50 w-12 h-12 bg-red-500 text-white rounded-full shadow-lg hover:bg-red-600 transition-colors flex items-center justify-center"
        title="Ouvrir les outils de diagnostic"
      >
        <AlertTriangle className="h-5 w-5" />
      </button>
    );
  }

  const statusColor = getStatusColor();

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <div className={`bg-${statusColor}-50 dark:bg-${statusColor}-900/20 border-2 border-${statusColor}-200 dark:border-${statusColor}-800 rounded-lg p-4 shadow-lg max-w-sm`}>
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center">
            {storageStatus === 'ok' ? (
              <CheckCircle className={`h-5 w-5 text-${statusColor}-600 dark:text-${statusColor}-400 mr-2`} />
            ) : (
              <AlertTriangle className={`h-5 w-5 text-${statusColor}-600 dark:text-${statusColor}-400 mr-2`} />
            )}
            <h3 className={`text-sm font-semibold text-${statusColor}-800 dark:text-${statusColor}-300`}>
              Diagnostic Stockage
            </h3>
          </div>
          <button
            onClick={() => setIsVisible(false)}
            className={`text-${statusColor}-600 hover:text-${statusColor}-800 dark:text-${statusColor}-400 dark:hover:text-${statusColor}-200`}
          >
            ×
          </button>
        </div>
        
        <p className={`text-xs text-${statusColor}-700 dark:text-${statusColor}-400 mb-3`}>
          {getStatusMessage()}
        </p>

        <div className="space-y-2">
          <button
            onClick={handleCheckStatus}
            className="w-full px-3 py-2 text-xs bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors flex items-center justify-center"
          >
            <RefreshCw className="h-3 w-3 mr-1" />
            Vérifier l'état
          </button>
          
          {storageStatus !== 'ok' && (
            <button
              onClick={handleEmergencyReset}
              disabled={isResetting}
              className={`w-full px-3 py-2 text-xs font-semibold rounded transition-colors flex items-center justify-center ${
                showConfirm
                  ? 'bg-red-600 text-white hover:bg-red-700'
                  : 'bg-red-500 text-white hover:bg-red-600'
              } ${isResetting ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              <Trash2 className="h-3 w-3 mr-1" />
              {isResetting ? 'Reset en cours...' : showConfirm ? 'CONFIRMER LE RESET' : 'Reset d\'urgence'}
            </button>
          )}
          
          {showConfirm && !isResetting && (
            <button
              onClick={() => setShowConfirm(false)}
              className="w-full px-3 py-2 text-xs bg-gray-300 text-gray-700 rounded hover:bg-gray-400 transition-colors"
            >
              Annuler
            </button>
          )}
        </div>
        
        <div className="mt-3 pt-2 border-t border-gray-200 dark:border-gray-700">
          <p className="text-xs text-gray-600 dark:text-gray-400">
            💡 <strong>Admin inaccessible ?</strong> Utilisez le reset d'urgence ou ouvrez la console (F12) et tapez : <code className="bg-gray-200 dark:bg-gray-800 px-1 rounded">EMERGENCY_RESET()</code>
          </p>
        </div>
      </div>
    </div>
  );
}