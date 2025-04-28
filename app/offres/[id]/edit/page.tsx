"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { use } from 'react';

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
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        const fetchOffer = async () => {
            try {
                setIsLoading(true);

                const response = await fetch(`http://localhost:8080/api/bookingOffer/${id}`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                });

                if (!response.ok) {
                    throw new Error(`Erreur ${response.status}: ${response.statusText}`);
                }

                const offerData = await response.json();
                setOffer(offerData);
            } catch (err) {
                setError(err instanceof Error ? err.message : 'Une erreur est survenue');
                console.error('Erreur lors du chargement de l\'offre:', err);
            } finally {
                setIsLoading(false);
            }
        };

        fetchOffer();
    }, [id]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setOffer(prev => {
            if (!prev) return prev;
            return {
                ...prev,
                [name]: name === 'price' || name === 'numberOfCustomers' ? parseFloat(value) : value
            };
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!offer) return;

        try {
            setIsSaving(true);

            const response = await fetch(`http://localhost:8080/api/bookingOffer/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    // Ajouter ici les headers d'authentification nécessaire
                    // 'Autorization': `Bearer ${token}`
                },
                body: JSON.stringify(offer),
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => null);
                throw new Error(
                    errorData?.message || `Erreur ${response.status}: ${response.statusText}`
                );
            }

            router.push('/NosOffres');
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Erreur lors de la mise à jour');
            console.error('Erreur lors de la mise à jour:', err);
        } finally {
            setIsSaving(false);
        }
    };

    if (isLoading) {
        return <div className='p-4'>Chargement...</div>;
    }

    if (error) {
        return <div className='p-4 text-red-500'>Erreur: {error}</div>
    }

    if (!offer) {
        return <div className='p-4'>Offre non trouvée</div>;
    }

    return (
        <div className='max-w-2xl mx-auto p-4'>
            <h1 className='text-2xl font-bold mb-6'>Modifier l&apos;offre</h1>

            <form onSubmit={handleSubmit} className='space-y-4'>
                <div>
                    <label htmlFor='title' className='block mb-1'>Titre</label>
                    <input
                        type="text"
                        id="title"
                        name="title"
                        value={offer.title}
                        onChange={handleChange}
                        className='w-full px-3 py-2 border rounded'
                        required
                    />
                </div>

                <div>
                    <label htmlFor="price" className='block mb-1'>Prix</label>
                    <input
                        type='number'
                        id='price'
                        name='price'
                        value={offer.price}
                        onChange={handleChange}
                        className='w-full px-3 py-2 border rounded'
                        min="0"
                        step="0.01"
                        required
                    />
                </div>

                <div>
                    <label htmlFor='numberOfCustomers' className='block mb-1'>Nombre de clients</label>
                    <input
                        type="number"
                        id="numberOfCustomers"
                        name="numberOfCustomers"
                        value={offer.numberOfCustomers}
                        onChange={handleChange}
                        className='w-full px-3 py-2 border rounded'
                        min="0"
                        required
                    />
                </div>

                <div className='flex gap-4 pt-4'>
                    <button
                        type='submit'
                        className='px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:bg-blue-300'
                        disabled={isSaving}
                    >
                        {isSaving ? 'Enregistrement...' : 'Enregistrer'}
                    </button>
                </div>
            </form>
        </div>
    );
}