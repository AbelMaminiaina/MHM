import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { qrcodeService } from '../services/qrcode.service';

export const QRCodeCSVImport = () => {
  const queryClient = useQueryClient();
  const [file, setFile] = useState<File | null>(null);
  const [validity, setValidity] = useState(new Date().getFullYear().toString());
  const [dragActive, setDragActive] = useState(false);

  const importMutation = useMutation({
    mutationFn: ({ file, validity }: { file: File; validity: string }) =>
      qrcodeService.importCSV(file, validity),
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: ['qrcode-batches'] });
      queryClient.invalidateQueries({ queryKey: ['batch-stats'] });

      const batch = response.data;
      const message = `
Import terminé !
━━━━━━━━━━━━━━━━
📊 Résultats :
  • Total : ${batch.totalMembers} membres
  • ✅ Envoyés : ${batch.successfulSends}
  • ❌ Échecs : ${batch.failedSends}
  • 📈 Taux : ${batch.successRate}%

${batch.failedSends > 0 ? '⚠️ Vous pouvez relancer les échecs depuis le dashboard.' : ''}
      `;

      alert(message);
      setFile(null);
    },
    onError: (error: { response?: { data?: { message?: string } } }) => {
      alert(error?.response?.data?.message || 'Erreur lors de l\'import CSV');
    },
  });

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const droppedFile = e.dataTransfer.files[0];
      if (droppedFile.type === 'text/csv' || droppedFile.name.endsWith('.csv')) {
        setFile(droppedFile);
      } else {
        alert('Veuillez sélectionner un fichier CSV');
      }
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      if (selectedFile.type === 'text/csv' || selectedFile.name.endsWith('.csv')) {
        setFile(selectedFile);
      } else {
        alert('Veuillez sélectionner un fichier CSV');
      }
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) {
      alert('Veuillez sélectionner un fichier CSV');
      return;
    }
    if (!validity) {
      alert('Veuillez spécifier l\'année de validité');
      return;
    }

    if (confirm(`Envoyer les QR Codes à tous les membres du fichier ${file.name} pour l'année ${validity} ?`)) {
      importMutation.mutate({ file, validity });
    }
  };

  const downloadTemplate = () => {
    const csvContent = `memberId,name,email,status,validity
M-2025-0001,Jean Dupont,jean.dupont@email.com,active,2025
M-2025-0002,Marie Martin,marie.martin@email.com,active,2025
M-2025-0003,Pierre Durand,pierre.durand@email.com,active,2025`;

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'qrcode-import-template.csv';
    link.click();
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <div className="mb-6">
        <h2 className="text-xl font-bold text-gray-900 mb-2">
          Import CSV - Envoi en Masse
        </h2>
        <p className="text-sm text-gray-600">
          Importez un fichier CSV pour envoyer des QR Codes à plusieurs membres simultanément
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Year Selection */}
        <div>
          <label htmlFor="validity" className="block text-sm font-medium text-gray-700 mb-2">
            Année de validité
          </label>
          <input
            id="validity"
            type="text"
            value={validity}
            onChange={(e) => setValidity(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            placeholder="2025"
            required
          />
        </div>

        {/* File Drop Zone */}
        <div
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
          className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
            dragActive
              ? 'border-blue-500 bg-blue-50'
              : 'border-gray-300 bg-gray-50'
          }`}
        >
          <input
            type="file"
            id="csv-file"
            accept=".csv"
            onChange={handleFileChange}
            className="hidden"
          />

          {file ? (
            <div className="space-y-2">
              <svg
                className="mx-auto h-12 w-12 text-green-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <p className="text-sm font-medium text-gray-900">{file.name}</p>
              <p className="text-xs text-gray-500">
                {(file.size / 1024).toFixed(2)} KB
              </p>
              <button
                type="button"
                onClick={() => setFile(null)}
                className="text-sm text-red-600 hover:text-red-700"
              >
                Supprimer
              </button>
            </div>
          ) : (
            <div className="space-y-2">
              <svg
                className="mx-auto h-12 w-12 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                />
              </svg>
              <div>
                <label
                  htmlFor="csv-file"
                  className="cursor-pointer text-blue-600 hover:text-blue-700 font-medium"
                >
                  Cliquez pour sélectionner
                </label>
                <span className="text-gray-600"> ou glissez-déposez un fichier CSV</span>
              </div>
              <p className="text-xs text-gray-500">
                Format CSV uniquement, maximum 5 MB
              </p>
            </div>
          )}
        </div>

        {/* CSV Format Info */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h3 className="text-sm font-semibold text-blue-900 mb-2">
            📄 Format CSV attendu
          </h3>
          <p className="text-sm text-blue-800 mb-2">
            Colonnes requises : <code className="bg-blue-100 px-1 rounded">memberId</code> (ou memberNumber), <code className="bg-blue-100 px-1 rounded">email</code>
          </p>
          <p className="text-sm text-blue-800 mb-3">
            Colonnes optionnelles : name, status, validity
          </p>
          <button
            type="button"
            onClick={downloadTemplate}
            className="text-sm text-blue-600 hover:text-blue-700 font-medium flex items-center gap-2"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
            Télécharger le modèle CSV
          </button>
        </div>

        {/* Submit Button */}
        <div className="flex gap-4">
          <button
            type="submit"
            disabled={!file || importMutation.isPending}
            className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed font-medium"
          >
            {importMutation.isPending ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                Import en cours...
              </span>
            ) : (
              'Lancer l\'envoi en masse'
            )}
          </button>
        </div>
      </form>
    </div>
  );
};
