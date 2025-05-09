'use client';

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from 'next/navigation';
import { getUserKey } from "../services/authService";
import { Cart } from '../types/cart';

export default function Page() {
    const [carts, setCarts] = useState<Array<Cart> | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const router = useRouter();
    const userKey = getUserKey();

    useEffect(() => {
        const getCart = async () => {
            try {
                setLoading(true);
                const response = await fetch('http://localhost:8080/api/booking', {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json'
                    }
                });

                if (!response.ok) {
                    throw new Error(`Erreur: ${response.status}`);
                }
                const cartData = await response.json();
                setCarts(cartData);
                setError(null);
            } catch (err) {
                setError('Impossible de récupérer votre panier. Veuillez réessayer.');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        getCart();
    }, []);

    const handleRemoveItem = async (cartId: number): Promise<void> => {
        try {
            setLoading(true);
            const response = await fetch(`http://localhost:8080/api/booking/${cartId}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                }
            });

            if (!response.ok) {
                throw new Error(`Erreur: ${response.status}`)
            }
            window.location.reload();
        } catch (err) {
            setError('Erreur lors de la suppression de l\'article.');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    //créer une page mes tickets disponible seulement pour les personnes connectés (affiche seulement le titre du ticket et son QRcode car e-ticket, scan recevant des infos sous format json)
    // back-end sellsByOffer (création de sellsByOffer à chaque création de bookingOffer, update de sellsCounter +1 à chaque création de ticket avec le même offerTitle)
    // créer la page espace admin, y ajouter un lien pour la création d'offerBooking et remplace le lien offerBooking sur la navbar par espace admin
    //avant de cloturer faire test avec des prix décimaux et correction si nécessaire.

    if (loading && !carts) {
        return (
            <div className="max-w-7xl mx-auto p-6 min-h-screen bg-gray-50">
                <h1 className="text-3xl font-extrabold text-gray-900 mb-8 border-b pb-4">Mon Panier</h1>
                <div className="flex justify-center items-center h-64">
                    <div className="animate-spin rounded-full h-14 w-14 border-t-4 border-b-4 border-indigo-600"></div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="max-w-7xl mx-auto p-6 min-h-screen bg-gray-50">
                <h1 className="text-3xl font-extrabold text-gray-900 mb-8 border-b pb-4">Mon Panier</h1>
                <div className="bg-red-50 border-l-4 border-red-500 p-6 rounded-lg shadow-md">
                    <div className="flex">
                        <div className="flex-shrink-0">
                            <svg className="h-6 w-6 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                            </svg>
                        </div>
                        <div className="ml-3">
                            <h3 className="text-lg font-medium text-red-800">Une erreur est survenue</h3>
                            <p className="mt-2 text-red-700">{error}</p>
                            <button
                                onClick={() => window.location.reload()}
                                className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                            >
                                Réessayer
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    //Filtre les articles du panier pour ne garder que ceux de l'utilisateur actuel
    const userCarts = carts ? carts.filter(cart => cart.userKey === userKey) : [];

    if (!carts || carts.length === 0) {
        return (
            <div className="max-w-7xl mx-auto p-6 min-h-screen bg-gray-50">
                <h1 className="text-3xl font-extrabold text-gray-900 mb-8 border-b pb-4">Mon Panier</h1>
                <div className="text-center py-16 bg-white rounded-lg shadow-sm">
                    <svg className="mx-auto h-16 w-16 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                    </svg>
                    <h2 className="mt-4 text-lg font-medium text-gray-900">Votre panier est vide</h2>
                    <p className="mt-2 text-gray-500 max-w-md mx-auto">Il est temps de découvrir nos offres et de trouver ce qui vous convient.</p>
                    <Link
                    href="/NosOffres"
                    className="mt-6 inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    >
                        Découvrir nos offres
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto p-6 bg-gray-50 min-h-screen">
            <h1 className="text-3xl font-extrabold text-gray-900 mb-6 border-b pb-4">Mon Panier</h1>
            <p className="mb-6">Les jeux Olympique s&apos;adresse au plus grand nombre. Veuillez privilégier l&apos;achat d&apos;une seule offre. Si vous comptez venir nombreux, prenez l&apos;offre avec le plus grand nombre d&apos;invités. C&apos;est pour cela que nous privilégions le paiement par Offre et non pas par total panier. Néanmoins, nous ne vous empêcherons pas de payer plusieurs Offres même si nous vous rappelons de penser aux autres personnes voulant aussi participer à cet événement. Les places ne sont pas illimités. Merci de votre compréhension.</p>
            {loading && (
                <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex justify-center items-center z-50 backdrop-blur-sm">
                    <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-indigo-600"></div>
                </div>
            )}

            <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                <div className="divide-y divide-gray-200">
                    {userCarts.map((cart) => (
                        <div key={cart.bookingId} className="flex flex-col sm:flex-row py-6 px-6">
                            <div className="flex-grow">
                                <h3 className="text-lg font-medium text-gray-900">{cart.bookingOfferTitle}</h3>
                                <p className="mt-1 text-sm text-gray-500">Nombre d&apos;invités: {cart.numberOfGuests}</p>
                                <div className="mt-2 flex justify-between items-center">
                                    <div className="text-lg font-medium text-gray-900">Prix: {cart.price}€</div>
                                    <button
                                        onClick={() => router.push(`/Checkout/${cart.bookingId}`)}
                                        className="inline-flex justify-center items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                                    >
                                        Procéder au paiement
                                        <svg className="h-5 w-5 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                                        </svg>
                                    </button>
                                    <button
                                        onClick={() => handleRemoveItem(cart.bookingId)}
                                        className="text-sm font-medium text-indigo-600 hover:text-indigo-800 flex items-center"
                                    >
                                        <svg className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                        </svg>
                                        Supprimer
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
