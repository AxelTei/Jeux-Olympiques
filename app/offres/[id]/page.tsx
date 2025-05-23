'use client';
import { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { use } from 'react';
import { useRouter } from 'next/navigation';
import { getAuthToken, getRole, getUserKey } from '@/app/services/authService';

interface Offer {
    bookingOfferId: string;
    title: string;
    price: number;
    numberOfCustomers: number;
}

export default function Page({ params }: {params: Promise<{id: string}>}) {
    const router = useRouter();
    const { id } = use(params);
    const [offer, setOffer] = useState<Offer | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const token = getAuthToken();
    const [isAdmin, setIsAdmin] = useState(false);
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    useEffect(() => {
        if (!id) return;
        const token = getAuthToken();
        setIsLoggedIn(!!token);
        const role = getRole();
        if (role === '["ROLE_ADMIN"]') {
            setIsAdmin(!!role);
        }
        const fetchOfferDetail = async () => {
            try {
                const response = await fetch(`/api/offers/${id}`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                });

                if (!response.ok) {
                    if (response.status === 404) {
                        throw new Error("Offre non trouvé");
                    }
                    throw new Error('Erreur lors de la récupération de l\'offre');
                }

                const data = await response.json();
                setOffer(data);
            } catch (err) {
                console.error('Erreur:', err);
                setError("Une erreur est survenue");
            } finally {
                setLoading(false);
            }
        };

        fetchOfferDetail();
    }, [id]);

    const addBooking = async (offer: Offer) => {
    
        const userKey = getUserKey();
    
        const booking = {
            "bookingOfferTitle" : offer.title,
            "price" : offer.price,
            "userKey" : userKey,
            "numberOfGuests": offer.numberOfCustomers
        };
        try {
            const response = await fetch('/api/addBooking', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(booking),
            });
    
            if (!response.ok) {
                throw new Error(`Error: ${response.status}`);
            };
        } catch (error) {
            console.error('Échec lors de l\'ajout de la réservation:', error);
        };
    
        router.push("/Panier");
    };

    async function deleteOffer(id: string): Promise<boolean> {
        try {
            const response = await fetch(`/api/offers/${id}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + token,
                },
                credentials: 'include'
            });

            if (!response.ok) {
                throw new Error(`Error: ${response.status}`);
            }

            return true;
        } catch (error) {
            console.error('Échec lors de la suppression de l\'offre:', error);
            return false;
        }
    };

    return (
        <div className='max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8'>
            <Head>
                <title>{loading ? 'Chargement...' : error ? 'Erreur' : `${offer?.title}`}</title>
            </Head>

            <div className='mb-6'>
                <button
                    onClick={() => router.back()}
                    className='flex items-center text-indigo-600 hover:text-indigo-800'
                >
                    <svg className='h-5 w-5 mr-1' fill='none' viewBox='0 0 24 24' stroke="currentColor">
                        <path strokeLinecap='round' strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7"/>
                    </svg>
                    Retour au catalogue
                </button>
            </div>

            {loading ? (
                <div className='flex justify-center items-center h-64'>
                    <div className='animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500'></div>
                </div>
            ) : error ? (
                <div className='bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded'>
                    {error}
                </div>
            ) : offer ? (
                <div className='bg-white shadow overflow-hidden rounded-lg'>
                    <div className='px-4 py-5 sm:px-6 bg-gray-50'>
                        <h1 className='text-2xl font-bold text-gray-900'>{offer.title}</h1>
                    </div>
                    <div className='border-t border-gray-200 px-4 py-5 sm:p-6'>
                        <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
                            <div className='md:col-span-2'>
                                <h3 className='text-lg font-medium text-gray-900 mb-2'>Description</h3>
                                <p className='text-gray-600'>Ticket pour l&apos;accès complet aux Jeux Olympiques 2024 se déroulant à Paris. Durant toute la durée de l&apos;événement.</p>

                                <div className='mt-8'>
                                    <h3 className='text-lg font-medium text-gray-900 mb-4'>Caractéristiques</h3>
                                    <div className='border-t border-gray-200'>
                                        <dl>
                                            <div className='bg-gray-50 px-4 py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6'>
                                                <dt className='text-sm font-medium text-gray-500'>Prix</dt>
                                                <dd className='mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2'>{offer.price} €</dd>
                                            </div>
                                            <div className='bg-white px-4 py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6'>
                                                <dt className='text-sm font-medium text-gray-500'>Nombre de places</dt>
                                                <dd className='mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2'>{offer.numberOfCustomers}</dd>
                                            </div>
                                        </dl>
                                    </div>
                                </div>
                            </div>

                            <div className='md:col-span-1'>
                                <div className='bg-gray-100 p-4 rounded-lg'>
                                    <div className='mb-4'>
                                        <span className='text-2xl font-bold text-gray-900'>{offer.price} €</span>
                                    </div>

                                    {isLoggedIn && (<div className='space-y-3'>
                                        <button
                                            className='w-full bg-indigo-600 text-white py-2 px-4 rounded hover:bg-indigo-700 transition-colors'
                                            onClick={() => addBooking(offer)}
                                        >
                                            Ajouter au panier
                                        </button>
                                    </div>) || (<p className="flex-1 text-center text-sm text-gray-600">Vous devez créer un compte et vous connectez pour ajouter une offre à votre panier.</p>)}
                                </div>
                            </div>
                        </div>
                    </div>

                    {isAdmin && (<div className='border-t border-gray-200 px-4 py-4 sm:px-6 flex justify-between'>
                        <Link
                            href={`/offres/${offer.bookingOfferId}/edit`}
                            className='text-indigo-600 hover:text-indigo-800'
                        >
                            Modifier
                        </Link>
                        <button
                            className='text-red-600 hover:text-red-800'
                            onClick={() => {
                                if (window.confirm('Êtes-vous sûr de vouloir supprimer cette offre ?')) {
                                    deleteOffer(id);
                                    router.push("/NosOffres");
                                }
                            }}
                        >
                            Supprimer
                        </button>
                    </div>)}
                </div>
            ) : null}
        </div>
    );
}