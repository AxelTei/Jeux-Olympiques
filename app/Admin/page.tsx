'use client';
// pages/admin/sells-by-offer.tsx
import { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { getAuthToken } from '../services/authService';

// Interface pour typer les données de ventes par offre
interface SellsByOffer {
  id: string;
  offerTitle: string;
  offerPrice: number;
  sells: number;
}

export default function SellsByOfferPage() {
  const [sellsData, setSellsData] = useState<SellsByOffer[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const token = getAuthToken();

  useEffect(() => {
    const fetchSellsData = async () => {
      try {
        setIsLoading(true);
        // Remplacez l'URL par l'endpoint de votre API Spring Boot
        const response = await fetch('http://localhost:8080/api/sellsByOffer', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + token
            },
        });

        if (!response.ok) {
          throw new Error(`Erreur: ${response.status}`);
        }

        const data = await response.json();
        setSellsData(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Une erreur est survenue');
        console.error('Erreur lors de la récupération des données:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchSellsData();
  }, [token]);

  // Calculs pour les statistiques
  const totalSales = sellsData.reduce((acc, item) => acc + item.sells, 0);

  return (
    <div className="bg-gray-50 min-h-screen">
      <Head>
        <title>Admin - Ventes par offre</title>
        <meta name="description" content="Administration des ventes par offre" />
      </Head>

      <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
        <h1 className="text-2xl font-semibold text-gray-900 mb-6">Ventes par offre</h1>
        <p className='mb-6 text-gray-600'>Si vous voulez modifier ou supprimer une offre, rendez-vous sur la page de détails de l&apos;offre. Accessible dans la page Nos Offres. Suivez le lien de la barre de navigation.</p>
        <Link
            href="GestionDesOffres"
            className="mb-6 inline-flex items-center px-4 py-2 border border-transparent rounded-sm shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
            Ajouter une offre
        </Link>

        
        {/* Statistiques rapides */}
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 mb-6">
          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <dt className="text-sm font-medium text-gray-500 truncate">Total des ventes</dt>
              <dd className="mt-1 text-3xl font-semibold text-indigo-600">{totalSales}</dd>
            </div>
          </div>
          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <dt className="text-sm font-medium text-gray-500 truncate">Nombre d&apos;offres</dt>
              <dd className="mt-1 text-3xl font-semibold text-indigo-600">{sellsData.length}</dd>
            </div>
          </div>
        </div>

        {/* État de chargement */}
        {isLoading && (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-500"></div>
            <span className="ml-3 text-gray-600">Chargement...</span>
          </div>
        )}
        
        {/* Message d'erreur */}
        {error && (
          <div className="bg-red-50 border-l-4 border-red-400 p-4 mb-6">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-red-700">{error}</p>
                <button 
                  className="mt-2 text-sm font-medium text-red-700 hover:text-red-600"
                  onClick={() => window.location.reload()}
                >
                  Réessayer
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Tableau des ventes */}
        {!isLoading && !error && (
          <>
            {sellsData.length === 0 ? (
              <div className="bg-white shadow overflow-hidden sm:rounded-lg p-6 text-center text-gray-500">
                Aucune donnée de vente disponible
              </div>
            ) : (
              <div className="shadow overflow-hidden border-b border-gray-200 sm:rounded-lg">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Offre
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Ventes
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Revenus
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {sellsData.map((item) => (
                      <tr key={item.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">{item.offerTitle}</div>
                          <div className="text-sm text-gray-500">ID: {item.id}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">{item.sells}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">{item.offerPrice} €</div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
