'use client';

import React, { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { getAlias } from '@/app/services/authService';

interface BookingDetails {
    bookingId: string;
    bookingOfferTitle: string;
    price: number;
    userKey: string;
    numberOfGuests: number;
}

const SuccessPage: React.FC = () => {
    const router = useRouter();
    const params = useParams(); // Récupère les paramètres de l'URL
    const bookingId = params.id as string; // Récupération de l'id depuis l'URL
    // Récupération de la réservation
    const [bookingDetails, setBookingDetails] = useState<BookingDetails| null>(null);
    // État de chargement
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!bookingId) return;
        const fetchOfferDetail = async () => {
            try {
                const response = await fetch(`/api/checkout/${bookingId}`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                });

                if (!response.ok) {
                    throw new Error(`Erreur lors de la récupération de la réservation (${response.status})`);
                }

                const data = await response.json();
                // Mettre à jour l'état avec les détails de l'offre
                setBookingDetails({
                    bookingId: data.bookingId,
                    bookingOfferTitle: data.bookingOfferTitle,
                    price: data.price,
                    userKey: data.userKey,
                    numberOfGuests: data.numberOfGuests
                });
            } catch (err) {
                console.error('Erreur lors du chargement des détails de la réservation:', err);
                setError(err instanceof Error ? err.message : "Erreur inconnue lors du chargement de la réservation");
            } finally {
                setLoading(false);
            }
        };

        fetchOfferDetail();
    }, [bookingId]);

    // Flag statique pour garantir une seule création de ticket
    const hasCreatedTicket = React.useRef(false);

    // Création du ticket une seule fois quand bookingDetails est disponible
    useEffect(() => {
        // Ne s'exécute que si bookingDetails est disponible et que le ticket n'a pas encore été créé
        if (!bookingDetails || hasCreatedTicket.current) return;
        
        // Marquer que le ticket a été créé AVANT de lancer la création
        hasCreatedTicket.current = true;
        
        const createTicket = async () => {
            try {
                const alias = getAlias();
                
                const response = await fetch('/api/success', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        username: alias,
                        offerTitle: bookingDetails.bookingOfferTitle,
                        ticketPrice: bookingDetails.price,
                        numberOfGuests: bookingDetails.numberOfGuests,
                        userKey: bookingDetails.userKey
                    })
                });

                if (!response.ok) {
                    throw new Error(`Erreur lors de la création du eticket (${response.status})`);
                }
            } catch (err) {
                console.error('Erreur lors de la création du ticket:', err);
            }
        };

        createTicket();
    }, [bookingDetails]);

    if (loading) {
        return (
            <div className='container loading-container'>
                <div className='loading-spinner'></div>
                <p>Chargement des détails de votre paiement...</p>

                <style jsx>{`
                    .loading-container {
                        display: flex;
                        flex-direction: column;
                        align-items: center;
                        justify-content: center;
                        height: 60vh;
                    }
                    .loading-spinner {
                        border: 4px solid rgba(0, 0, 0, 0.1);
                        border-radius: 50%;
                        border-top: 4px solid #5469d4;
                        width: 40px;
                        height: 40px;
                        margin-bottom: 20px;
                        animation: spin 1s linear infinite;
                    }
                    @keyframes spin {
                        0% { transform: rotate(0deg); }
                        100% { transform: rotate(360deg); }
                    }
                `}</style>
            </div>
        );
    }

    if (error || !bookingDetails) {
        return (
            <div className='container error-container'>
                <div className='error-icon'>⚠️</div>
                <h2>Impossible de charger les détails de votre paiement</h2>
                <p>{error || "Réservation non trouvée"}</p>
                <button
                    onClick={() => router.push("/Panier")}
                    className='back-button'
                >
                    Retour
                </button>

                <style jsx>{`
                    .error-container {
                        text-align: center;
                        padding: 40px 20px;
                    }
                    .error-icon {
                        font-size: 48px;
                        margin-bottom: 20px;
                    }
                    .back-button {
                        background-color: #5469d4;
                        color: white;
                        border: none;
                        padding: 10px 16px;
                        border-radius: 4px;
                        font-size: 16px;
                        font-weight: 600;
                        cursor: pointer;
                        margin-top: 20px;
                    }
                `}</style>
            </div>
        );
    }

    const date = new Date();
    const dateFormat = `0${date.getDate()}/0${date.getMonth() + 1}/${date.getFullYear()}`;

    return (
        <div className='success-container'>
            <div className='success-card'>
                <div className='success-icon'>
                    <svg width="64" height="64" viewBox='0 0 64 64' fill='none' xmlns='http://www.w3.org/2000/svg'>
                        <circle cx="32" cy="32" r="32" fill='#4CAF50' fillOpacity="0.2" />
                        <path d='M18 32L28 42L46 24' stroke='#4CAF50' strokeWidth="4" strokeLinecap='round' strokeLinejoin='round' />
                    </svg>
                </div>

                <h1>Paiement réussi!</h1>

                {bookingDetails ? (
                    <div className='payment-details'>
                        <p>Montant: <span>{bookingDetails.price} €</span></p>
                        <p>Date: <span>{dateFormat}</span></p>
                        <p>Référence: <span>REF-{Math.random().toString(36).substring(2, 10).toUpperCase()}</span></p>
                    </div>
                ) : (
                    <p>Traitement de votre commande...</p>
                )}

                <p className='success-message'>
                    Merci pour votre achat !
                </p>

                <div className='action-buttons'>
                    <Link href="/">
                        <div className='primary-button'>Retour à l&apos;accueil</div>
                    </Link>
                    <Link href='/MesTickets'>
                        <div className='secondary-button'>Votre Portefeuille de Tickets</div>
                    </Link>
                </div>
            </div>

            <style jsx>{`
                .success-container {
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    min-height: 100vh;
                    padding: 20px;
                    background-color: #f9f9f9;
                }
                
                .success-card {
                    background: white;
                    border-radius: 12px;
                    box-shadow: 0 8px 30px rgba(0, 0, 0, 0.12);
                    padding: 40px;
                    width: 100%;
                    max-width: 600px;
                    text-align: center;
                }

                .success-icon {
                    margin: 0 auto 30px;
                    width: 64px;
                    height:64px;
                }

                h1 {
                    margin-bottom: 30px;
                    color: #333;
                    font-size: 28px;
                }

                .payment-details {
                    background-color: #f7f9fc;
                    border: 1px solid #e6ebf5;
                    border-radius: 8px;
                    padding: 20px;
                    margin-bottom: 30px;
                    text-align: left;
                }

                .payment-details p {
                    display: flex;
                    justify-content: space-between;
                    margin: 10px 0;
                    color: #666;
                }

                .payment-details span {
                    font-weight: 600;
                    color: #333;
                }

                .success-message {
                    margin-bottom: 30px;
                    color: #4CAF50;
                    font-size: 18px;
                }

                .action-buttons {
                    display: flex;
                    flex-direction: column;
                    gap: 12px;
                }

                .primary-button {
                    display: block;
                    padding: 12px 24px;
                    background-color: #5469d4;
                    color: white;
                    border-radius: 4px;
                    font-weight: 600;
                    transition: all 0.2s ease;
                }

                .primary-button:hover {
                    background-color: #4a5fc1;
                }

                .secondary-button {
                    display: block;
                    padding: 12px 24px;
                    background-color: transparent;
                    color: #5469d4;
                    border: 1px solid #5469d4;
                    border-radius: 4px;
                    font-weight: 600;
                    transition: all 0.2s ease;
                }

                .secondary-button:hover {
                    background-color: rgba(84, 105, 212, 0.1);
                }

                @media (min-width: 640px) {
                    .action-buttons {
                        flex-direction: row;
                        justify-content: center;
                    }

                    .primary-button, .secondary-button {
                        min-width: 200px;
                    }
                }
            `}</style>
        </div>
    );
};

export default SuccessPage;