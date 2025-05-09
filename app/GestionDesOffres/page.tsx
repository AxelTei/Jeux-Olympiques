'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Head from 'next/head';
import { getAuthToken } from '../services/authService';

export default function Page() {
    const router = useRouter();
    const [isSubmitting, setIsSubmitting]= useState(false);
    const [error, setError]= useState('');
    const [formData, setFormData]= useState({
        title: '',
        price: '',
        numberOfCustomers: '',
    });
    const token = getAuthToken();
    console.log(token);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        setError('');

        try {
            const offerData = {
                ...formData,
                price: parseFloat(formData.price),
                numberOfCustomers: parseInt(formData.numberOfCustomers, 10)
            };

            const response = await fetch('http://localhost:8080/api/bookingOffer', {
                method: 'POST',
                body: JSON.stringify(offerData),
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + token
                },
                credentials: 'include'
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Une erreur est survenue lors de la création de votre offre')
            }

            router.push('/NosOffres');
        } catch (err) {
            console.error('Erreur lors de la soumission:', err);
            setError('Une erreur est survenue, veuillez réessayer');
        } finally {
            setIsSubmitting(false);
        }
    }

    return (
        <div className='max-w-2xl mx-auto p-6'>
            <Head>
                <title>Créer une nouvelle offre</title>
            </Head>

            <h1 className="text-2xl font-bold mb-6">Créer une nouvelle offre</h1>

            {error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                    {error}
                </div>
            )}

            <form onSubmit={handleSubmit} className='space-y-4'>
                <div>
                    <label htmlFor='title' className='block text-sm font-medium text-gray-700'>
                        Titre de l&apos;offre *
                    </label>
                    <input 
                        type="text"
                        id="title"
                        name="title"
                        value={formData.title}
                        onChange={handleChange}
                        required
                        className='mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500'
                    />
                </div>

                <div>
                    <label htmlFor='price' className='block text-sm font-medium text-gray-700'>
                        Prix *
                    </label>
                    <div className='mt-1 relative rounded-md shadow-sm'>
                        <span className='absolute inset-y-0 left-y-0 pl-3 flex items-center text-gray-500'>
                            €
                        </span>
                        <input
                            type="number"
                            id="price"
                            name="price"
                            value={formData.price}
                            onChange={handleChange}
                            required
                            min="0"
                            step="0.01"
                            className='pl-7 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500'
                        />
                    </div>
                </div>

                <div>
                    <label htmlFor='numberOfCustomers' className='block text-sm font-medium text-gray-700'>
                        Nombre de clients *
                    </label>
                    <input
                        type="number"
                        id="numberOfCustomers"
                        name='numberOfCustomers'
                        value={formData.numberOfCustomers}
                        onChange={handleChange}
                        required
                        min="0"
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                    />
                    <div className='flex justify-end pt-5'>
                        <p className='text-gray-500'>Vous pouvez supprimer ou modifier l&apos;offre directement sur la page de détails de l&apos;offre.</p>
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className='py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-indigo-300'
                        >
                            {isSubmitting ? 'Enregistrement...' : 'Enregistrer'}
                        </button>
                    </div>
                </div>
            </form>
        </div>
    );
};
