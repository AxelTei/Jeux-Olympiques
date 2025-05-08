'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
// import { PaymentIntent } from '../services/api';

const SuccessPage: React.FC = () => {
    const router = useRouter();
    const [paymentInfo, setPaymentInfo] = useState<{
        amount: number;
        date: string;
    } | null>(null);

    useEffect(() => {
        const storedPaymentInfo = localStorage.getItem('paymentInfo');
        if (storedPaymentInfo) {
            setPaymentInfo(JSON.parse(storedPaymentInfo));
        } else {
            setTimeout(() => {
                router.push('/');
            }, 5000);
        }
    }, [router]);

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

                {paymentInfo ? (
                    <div className='payment-details'>
                        <p>Montant: <span>{(paymentInfo.amount / 100).toFixed(2)} €</span></p>
                        <p>Date: <span>{paymentInfo.date}</span></p>
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
                    <Link href='/Tickets'>
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