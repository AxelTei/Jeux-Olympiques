'use client';
import Link from "next/link";
import Head from "next/head";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { getRole } from "../services/authService";

export default function Page() {
    const router = useRouter();
    const [offers, setOffers] = useState([]);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(true);
    const [isAdmin, setIsAdmin] = useState(false);

    useEffect(() => {
        const role = getRole();
        if (role === '["ROLE_ADMIN"]') {
            setIsAdmin(!!role);
        }
        const fetchOffers = async () => {
            try {
                const response = await fetch("http://localhost:8080/api/bookingOffer", {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                });

                if (!response.ok) {
                    throw new Error('Erreur lors de la récupération des offres');
                }

                const data = await response.json();
                setOffers(data);
            } catch (err) {
                console.error('Erreur:', err);
                setError('Impossible de charger les offres. Veuillez réessayez plus tard.');
            } finally {
                setLoading(false);
            }
        };

        fetchOffers();
    }, []);

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <Head>
                <title>Nos Offres</title>
                <meta name="description" content="Catalogue des offres disponibles"/>
            </Head>

            <div className="mb-6 flex justify-between items-center">
                <h1 className="text-3xl font-bold text-gray-900">Nos Offres</h1>
                {isAdmin && <Link
                    href="GestionDesOffres"
                    className="inline-flex items-center px-4 py-2 border border-transparent rounded-sm shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                    Ajouter une offre
                </Link>}
                {/* Lien à protéger pour admin seulement */}
            </div>

            {loading ? (
                <div className="flex justify-center items-center h-64">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
                </div>
            ) : error ? (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
                    {error}
                </div>
            ) : offers.length === 0 ? (
                <div className="text-center py-10">
                    <p className="text-gray-500">Aucune offre disponible pour le moment.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mt-12 mb-12">
                    {offers.map((offer) => (
                        <div
                            key={offer.bookingOfferId}
                            className="border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow"
                        >
                            <div className="p-4">
                                <h2 className="text-lg font-semibold text-gray-800 mb-1">{offer.title}</h2>
                                <div className="flex justify-between items-center">
                                    <span className="text-sm text-green-600">
                                        pour {offer.numberOfCustomers} personnes.
                                    </span>
                                    <span className="text-indigo-600 font-medium">{offer.price} €</span>
                                </div>
                                <div className="mt-4 flex space-x-2">
                                    <button
                                        onClick={() => router.push(`/offres/${offer.bookingOfferId}`)}
                                        className="flex-1 text-center py-2 border border-gray-300 rounded text-sm text-gray-700 hover:bg-gray-50"
                                    >
                                        Détails
                                    </button>
                                    <button
                                        className="flex-1 text-center py-2 bg-indigo-600 rounded text-sm text-white hover:bg-indigo-700"
                                    >
                                        Ajouter au panier
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};
