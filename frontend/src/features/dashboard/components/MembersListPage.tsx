import { useState, useEffect, useRef } from 'react';
import { useMembers } from '../hooks/useMembers';

export const MembersListPage = () => {
  const tableRef = useRef<HTMLDivElement>(null);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const limit = 20;

  const { data, isLoading, error, isError } = useMembers({
    page,
    limit,
    search: search || undefined,
  });

  useEffect(() => {
    // Scroll vers la liste des membres quand la page se charge
    if (tableRef.current) {
      tableRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, []);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
    setPage(1);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  if (isError) {
    return (
      <div className="min-h-screen bg-gray-50 p-8">
        <div className="max-w-7xl mx-auto">
          <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded">
            <p className="font-semibold">Erreur</p>
            <p>{error?.message || 'Une erreur est survenue lors du chargement des membres'}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        <div ref={tableRef} className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Nos Membres Actifs
          </h1>
          <p className="text-gray-600">
            Découvrez les membres de l'association Madagasikara Hoan'ny Malagasy
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="max-w-xl">
            <label
              htmlFor="search"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Rechercher un membre
            </label>
            <input
              id="search"
              type="text"
              placeholder="Rechercher par nom ou prénom..."
              value={search}
              onChange={handleSearch}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        {isLoading && (
          <div className="bg-white rounded-lg shadow-sm p-12 text-center">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            <p className="mt-4 text-gray-600">Chargement des membres...</p>
          </div>
        )}

        {!isLoading && data && (
          <>
            <div className="bg-white rounded-lg shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Prénom
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Nom
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Ville
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Date d'adhésion
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {data.data.members.length === 0 ? (
                      <tr>
                        <td
                          colSpan={4}
                          className="px-6 py-12 text-center text-gray-500"
                        >
                          Aucun membre trouvé
                        </td>
                      </tr>
                    ) : (
                      data.data.members.map((member) => (
                        <tr
                          key={member._id}
                          className="hover:bg-gray-50 transition-colors"
                        >
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className="flex-shrink-0 h-10 w-10 bg-blue-100 rounded-full flex items-center justify-center">
                                <span className="text-blue-600 font-semibold text-sm">
                                  {member.firstName.charAt(0)}
                                </span>
                              </div>
                              <div className="ml-4">
                                <div className="text-sm font-medium text-gray-900">
                                  {member.firstName}
                                </div>
                              </div>
                            </div>
                          </td>

                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-medium text-gray-900">
                              {member.lastName}
                            </div>
                          </td>

                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">
                              {member.address?.city || '-'}
                            </div>
                          </td>

                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-500">
                              {formatDate(member.membershipDate)}
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {data.data.pagination.pages > 1 && (
              <div className="bg-white rounded-lg shadow-sm px-6 py-4 mt-6">
                <div className="flex items-center justify-between">
                  <div className="text-sm text-gray-700">
                    Page{' '}
                    <span className="font-medium">{data.data.pagination.page}</span>{' '}
                    sur{' '}
                    <span className="font-medium">{data.data.pagination.pages}</span>
                    {' - '}
                    <span className="font-medium">{data.data.pagination.total}</span>{' '}
                    membre(s) au total
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setPage((p) => Math.max(1, p - 1))}
                      disabled={page === 1}
                      className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Précédent
                    </button>
                    <button
                      onClick={() => setPage((p) => p + 1)}
                      disabled={page >= data.data.pagination.pages}
                      className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Suivant
                    </button>
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};
