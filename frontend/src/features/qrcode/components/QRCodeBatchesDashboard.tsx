import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { qrcodeService } from '../services/qrcode.service';
import type { QRCodeBatch } from '../types/qrcode.types';

export const QRCodeBatchesDashboard = () => {
  const queryClient = useQueryClient();
  const [selectedBatch, setSelectedBatch] = useState<QRCodeBatch | null>(null);

  // Fetch batch statistics
  const { data: statsData, isLoading: statsLoading } = useQuery({
    queryKey: ['batch-stats'],
    queryFn: () => qrcodeService.getBatchStats(),
  });

  // Fetch batches list
  const { data: batchesData, isLoading: batchesLoading } = useQuery({
    queryKey: ['qrcode-batches'],
    queryFn: () => qrcodeService.getBatches({ limit: 20 }),
  });

  // Retry mutation
  const retryMutation = useMutation({
    mutationFn: (batchId: string) => qrcodeService.retryBatch(batchId),
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: ['qrcode-batches'] });
      queryClient.invalidateQueries({ queryKey: ['batch-stats'] });

      alert(`
Relance terminée !
━━━━━━━━━━━━━━━━
✅ Succès : ${response.data.retriedSuccess}
❌ Échecs : ${response.data.retriedFailed}
      `);
    },
    onError: (error: { response?: { data?: { message?: string } } }) => {
      alert(error?.response?.data?.message || 'Erreur lors de la relance');
    },
  });

  const getStatusBadge = (status: string) => {
    const badges = {
      completed: 'bg-green-100 text-green-800',
      partial: 'bg-yellow-100 text-yellow-800',
      processing: 'bg-blue-100 text-blue-800',
      failed: 'bg-red-100 text-red-800',
      pending: 'bg-gray-100 text-gray-800',
    };
    return badges[status as keyof typeof badges] || badges.pending;
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return '✅';
      case 'partial':
        return '⚠️';
      case 'processing':
        return '⏳';
      case 'failed':
        return '❌';
      default:
        return '⏸';
    }
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleString('fr-FR', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="space-y-6">
      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Batches Totaux</p>
              <p className="text-3xl font-bold text-gray-900">
                {statsLoading ? '-' : statsData?.data.totalBatches || 0}
              </p>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
              <span className="text-2xl">📦</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">QR Codes Envoyés</p>
              <p className="text-3xl font-bold text-green-600">
                {statsLoading ? '-' : statsData?.data.totalSends || 0}
              </p>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
              <span className="text-2xl">✅</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Échecs</p>
              <p className="text-3xl font-bold text-red-600">
                {statsLoading ? '-' : statsData?.data.totalFails || 0}
              </p>
            </div>
            <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
              <span className="text-2xl">❌</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Taux de Réussite</p>
              <p className="text-3xl font-bold text-blue-600">
                {statsLoading ? '-' : `${statsData?.data.successRate || 0}%`}
              </p>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
              <span className="text-2xl">📈</span>
            </div>
          </div>
        </div>
      </div>

      {/* Batches List */}
      <div className="bg-white rounded-lg shadow-sm">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">
            Historique des Envois
          </h2>
        </div>

        {batchesLoading ? (
          <div className="p-12 text-center">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            <p className="mt-4 text-gray-600">Chargement...</p>
          </div>
        ) : batchesData?.data.batches.length === 0 ? (
          <div className="p-12 text-center">
            <span className="text-6xl">📭</span>
            <p className="mt-4 text-gray-600">Aucun batch trouvé</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Batch
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Type
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Statut
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Progression
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {batchesData?.data.batches.map((batch) => (
                  <tr key={batch._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div className="text-sm font-medium text-gray-900">
                        {batch.batchName}
                      </div>
                      {batch.csvFilename && (
                        <div className="text-xs text-gray-500">
                          📄 {batch.csvFilename}
                        </div>
                      )}
                    </td>

                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm text-gray-900">
                        {batch.batchType}
                      </span>
                    </td>

                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusBadge(
                          batch.status
                        )}`}
                      >
                        {getStatusIcon(batch.status)} {batch.status}
                      </span>
                    </td>

                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <div className="flex-1">
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div
                              className="bg-blue-600 h-2 rounded-full"
                              style={{ width: `${batch.completionPercentage}%` }}
                            />
                          </div>
                        </div>
                        <div className="text-sm text-gray-600 min-w-[80px]">
                          {batch.successfulSends}/{batch.totalMembers}
                        </div>
                      </div>
                      {batch.failedSends > 0 && (
                        <div className="text-xs text-red-600 mt-1">
                          {batch.failedSends} échec(s)
                        </div>
                      )}
                    </td>

                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatDate(batch.completedAt || batch.startedAt || batch.createdAt)}
                    </td>

                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex gap-2">
                        <button
                          onClick={() => setSelectedBatch(batch)}
                          className="text-blue-600 hover:text-blue-700"
                        >
                          Détails
                        </button>
                        {batch.failedSends > 0 && batch.status !== 'processing' && (
                          <button
                            onClick={() => retryMutation.mutate(batch._id)}
                            disabled={retryMutation.isPending}
                            className="text-orange-600 hover:text-orange-700 disabled:opacity-50"
                          >
                            Relancer
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Batch Details Modal */}
      {selectedBatch && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center">
              <h3 className="text-lg font-semibold text-gray-900">
                Détails du Batch
              </h3>
              <button
                onClick={() => setSelectedBatch(null)}
                className="text-gray-400 hover:text-gray-500"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="p-6 space-y-4">
              {/* Batch Info */}
              <div className="grid grid-cols-2 gap-4 p-4 bg-gray-50 rounded-lg">
                <div>
                  <p className="text-sm text-gray-600">Nom du batch</p>
                  <p className="font-medium">{selectedBatch.batchName}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Validité</p>
                  <p className="font-medium">{selectedBatch.validity}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Total membres</p>
                  <p className="font-medium">{selectedBatch.totalMembers}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Taux de réussite</p>
                  <p className="font-medium">{selectedBatch.successRate}%</p>
                </div>
              </div>

              {/* Results List */}
              <div>
                <h4 className="font-semibold text-gray-900 mb-2">
                  Résultats ({selectedBatch.results.length})
                </h4>
                <div className="border border-gray-200 rounded-lg max-h-96 overflow-y-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50 sticky top-0">
                      <tr>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">
                          Membre
                        </th>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">
                          Email
                        </th>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">
                          Statut
                        </th>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">
                          Erreur
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {selectedBatch.results.map((result, index) => (
                        <tr key={index} className={result.status === 'failed' ? 'bg-red-50' : ''}>
                          <td className="px-4 py-2 text-sm">
                            <div>{result.name}</div>
                            <div className="text-xs text-gray-500">{result.memberNumber}</div>
                          </td>
                          <td className="px-4 py-2 text-sm">{result.email}</td>
                          <td className="px-4 py-2 text-sm">
                            {result.status === 'success' ? '✅ Envoyé' : '❌ Échec'}
                          </td>
                          <td className="px-4 py-2 text-sm text-red-600">
                            {result.error || '-'}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
