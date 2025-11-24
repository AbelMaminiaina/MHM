import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { QRCodeCSVImport } from './QRCodeCSVImport';
import { QRCodeBatchesDashboard } from './QRCodeBatchesDashboard';

export const QRCodeManagementPage = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'import' | 'dashboard'>('import');

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Gestion des QR Codes
              </h1>
              <p className="text-sm text-gray-600 mt-1">
                Envoi en masse et suivi des opérations
              </p>
            </div>
            <div className="flex gap-4">
              <button
                onClick={() => navigate('/admin/dashboard')}
                className="px-4 py-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
              >
                ← Retour au dashboard
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Tabs */}
        <div className="mb-6">
          <nav className="flex space-x-4 border-b border-gray-200">
            <button
              onClick={() => setActiveTab('import')}
              className={`px-4 py-2 font-medium text-sm transition-colors ${
                activeTab === 'import'
                  ? 'border-b-2 border-blue-500 text-blue-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              📤 Import CSV
            </button>
            <button
              onClick={() => setActiveTab('dashboard')}
              className={`px-4 py-2 font-medium text-sm transition-colors ${
                activeTab === 'dashboard'
                  ? 'border-b-2 border-blue-500 text-blue-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              📊 Historique & Statistiques
            </button>
          </nav>
        </div>

        {/* Tab Content */}
        {activeTab === 'import' ? (
          <QRCodeCSVImport />
        ) : (
          <QRCodeBatchesDashboard />
        )}

        {/* Help Section */}
        <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-blue-900 mb-3">
            💡 Guide d'utilisation
          </h3>
          <div className="grid md:grid-cols-2 gap-6 text-sm text-blue-800">
            <div>
              <h4 className="font-semibold mb-2">Import CSV</h4>
              <ul className="space-y-1 list-disc list-inside">
                <li>Téléchargez le modèle CSV</li>
                <li>Remplissez avec vos données (memberId, email requis)</li>
                <li>Spécifiez l'année de validité</li>
                <li>Importez le fichier pour envoi automatique</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-2">Dashboard</h4>
              <ul className="space-y-1 list-disc list-inside">
                <li>Consultez les statistiques globales</li>
                <li>Visualisez l'historique des envois</li>
                <li>Voir les détails de chaque batch</li>
                <li>Relancez les envois échoués</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
