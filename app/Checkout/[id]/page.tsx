'use client';

import React, { ChangeEvent, useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';

interface BookingDetails {
    bookingId: string;
    bookingOfferTitle: string;
    price: number;
    userKey: string;
    numberOfGuests: number;
}

interface CheckoutFormProps {
    amount: number;
    id: string;
}

interface MockCardInputProps {
    cardNumber: string;
    setCardNumber: (value: string) => void;
    expiryDate : string;
    setExpiryDate: (value: string) => void;
    cvc: string;
    setCvc: (value: string) => void;
    cardNumberError: string | null;
    expiryDateError: string | null;
    cvcError: string | null;
}

const MockCardInput: React.FC<MockCardInputProps> = ({
    cardNumber,
    setCardNumber,
    expiryDate,
    setExpiryDate,
    cvc,
    setCvc,
    cardNumberError,
    expiryDateError,
    cvcError
}) => {

    // Formater le numéro de carte en groupes de 4 chiffres
    const handleCardNumberChange = (e: ChangeEvent<HTMLInputElement>) => {
        let value = e.target.value.replace(/\D/g, ''); // Enlever tous les caractères non numériques

        // Limiter à 16 chiffres maximum
        if (value.length > 16) {
            value = value.slice(0, 16);
        }

        //Ajout des espaces tous les 4 chiffres pour une meilleur lisibilité
        const formattedValue = value.replace(/(\d{4})(?=\d)/g, '$1 ');

        setCardNumber(formattedValue);
    };

    // Formater la date d'expiration (MM / YY)
    const handleExpiryDateChange = (e: ChangeEvent<HTMLInputElement>) => {
        let value = e.target.value.replace(/\D/g, ''); // Enlever tous les caractères non numériques

        // Limiter à 4 chiffres maximum
        if (value.length > 4) {
            value = value.slice(0, 4);
        }

        // Formater en MM / YY
        if (value.length > 2) {
            value = value.slice(0, 2) + ' / ' + value.slice(2);
        }

        setExpiryDate(value);
    };

    // Limiter le CVC à 3
    const handleCvcChange = (e: ChangeEvent<HTMLInputElement>) => {
        let value = e.target.value.replace(/\D/g, ''); // Enlever tous les caractères non numériques

        // Limiter à 3 chiffres maximum
        if (value.length > 3) {
            value = value.slice(0, 3);
        }

        setCvc(value);
    };

    return (
        <div className='mock-card-input'>
            <div className='mock-card-row'>
                <input
                    type='text'
                    placeholder='4242 4242 4242 4242'
                    className={`mock-card-number ${cardNumberError ? 'input-error' : ''}`}
                    value={cardNumber}
                    onChange={handleCardNumberChange}
                    required
                />
                {cardNumberError && <div className='input-error-message'>{cardNumberError}</div>}
            </div>
            <div className='mock-card-details'>
                <div className='expiry-container'>
                    <input
                        type='text'
                        placeholder='MM / YY'
                        className={`mock-card-expiry ${expiryDateError ? 'input-error' : ''}`}
                        value={expiryDate}
                        onChange={handleExpiryDateChange}
                        required
                    />
                    {expiryDateError && <div className='input-error-message'>{expiryDateError}</div>}
                </div>
                <div className='cvc-container'>
                    <input
                        type='text'
                        placeholder='CVC'
                        className={`mock-card-cvc ${cvcError ? 'input-error' : ''}`}
                        value={cvc}
                        onChange={handleCvcChange}
                        required
                    />
                    {cvcError && <div className='input-error-message'>{cvcError}</div>}
                </div>
            </div>
            <style jsx>{`
                .mock-card-input {
                    padding: 12px;
                    border: 1px solid #e6e6e6;
                    border-radius: 4px;
                    background: white;
                    margin-bottom: 16px;
                }
                .mock-card-row {
                    margin-bottom: 10px;
                }
                .mock-card-number {
                    width: 100%;
                    padding: 8px;
                    border: none;
                    font-size: 16px;
                    outline: none;
                }
                .mock-card-details {
                    display: flex;
                    gap: 16px;
                }
                .expiry-container, .cvc-container {
                    flex: 1;
                    position: relative;
                }
                .mock-card-expiry, .mock-card-cvc {
                    width: 100%;
                    padding: 8px;
                    border: none;
                    font-size: 16px;
                    outline: none;
                }
                .input-error {
                    border: 1px solid #df1b41 !important;
                    background-color: rgba(223, 27, 65, 0.05);
                }
                .input-error-message {
                    color: #df1b41;
                    font-size: 12px;
                    margin-top: 4px;
                    position: absolute;
                }
            `}</style>
        </div>
    );
};

const CheckoutForm: React.FC<CheckoutFormProps> = ({ amount, id }) => {
    const router = useRouter();
    const [loading, setLoading] = useState<boolean>(false);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    // États pour les champs du formulaire
    const [cardNumber, setCardNumber] = useState<string>('');
    const [expiryDate, setExpiryDate] = useState<string>('');
    const [cvc, setCvc] = useState<string>('');

    // États pour les erreurs de validation
    const [cardNumberError, setCardNumberError] = useState<string | null>(null);
    const [expiryDateError, setExpiryDateError] = useState<string | null>(null);
    const [cvcError, setCvcError] = useState<string | null>(null);

    //Fonction de validation du formulaire
    const validateForm = (): boolean => {
        let isValid = true;

        // Réinitialiser les erreurs
        setCardNumberError(null);
        setExpiryDateError(null);
        setCvcError(null);

        // Validation du numéro de carte
        const cardNumberDigits = cardNumber.replace(/\D/g, '');
        if (!cardNumberDigits) {
            setCardNumberError('Le numéro de carte est requis');
            isValid = false;
        } else if (cardNumberDigits.length < 16) {
            setCardNumberError('Le numéro de carte doit comporter 16 chiffres');
            isValid = false;
        } else {
            // Validation via l'algorithme de Luhn (vérification du checksum)
            let sum = 0;
            let shouldDouble = false;

            // Parcourir le numéro de droite à gauche
            for (let i = cardNumberDigits.length - 1; i >= 0; i--) {
                let digit = parseInt(cardNumberDigits.charAt(i));

                if (shouldDouble) {
                    digit *= 2;
                    if (digit > 9) {
                        digit -= 9;
                    }
                }

                sum += digit;
                shouldDouble = !shouldDouble;
            }

            if (sum % 10 !== 0) {
                setCardNumberError('Numéro de carte invalide');
                isValid = false;
            }
        }

        // Validation de la date d'expiration
        const expiryDigits = expiryDate.replace(/\D/g, '');
        if (!expiryDigits) {
            setExpiryDateError('La date d\'expiration est requise');
            isValid = false;
        } else {
            const month = parseInt(expiryDigits.substring(0, 2));
            const year = parseInt("20" + expiryDigits.substring(2, 4));

            const currentDate = new Date();
            const currentYear = currentDate.getFullYear();
            const currentMonth = currentDate.getMonth() + 1; // getMonth() retourne 0-11

            if (month < 1 || month > 12) {
                setExpiryDateError('Mois invalide');
                isValid = false;
            } else if (year < currentYear || (year === currentYear && month < currentMonth)) {
                setExpiryDateError('Carte expirée');
                isValid = false;
            }
        }

        // Validation du CVC
        if (!cvc) {
            setCvcError('Le code CVC est requis');
            isValid = false;
        } else if (cvc.length < 3) {
            setCvcError('Le CVC doit comporter 3 chiffres');
            isValid = false;
        }

        return isValid;
    };

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();

        // Valider le formulaire avant de le soumettre
        if (!validateForm()) {
            return;
        }


        setLoading(true);
        setErrorMessage(null);

        try {
            // Simuler la carte de test Stripe (pour rester cohérent avec l'environnement de test Stripe)
            // - 4242 4242 4242 4242 : Paiement réussi
            // - 4000 0000 0000 0002 : Paiement refusé
            const cardNumberDigits = cardNumber.replace(/\D/g, '');

            // Vérifier si c'est une carte à refus automatique
            if (cardNumberDigits === '4000000000000002') {
                setErrorMessage('Votre carte a été refusée. Veuillez essayer avec une autre carte.');
                setLoading(false);
                return;
            }

            // Créer le PaymentIntent simulé côté serveur
            const response = await fetch('/api/payment/create-payment-intent', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    amount: amount, // en centimes
                    currency: 'eur',
                    description: 'Achat de e-ticket pour les JO 2024'
                }),
            });

            const data = await response.json();

            if (data.error) {
                setErrorMessage(data.error);
                setLoading(false);
                return;
            }

            // Simuler un délai pour imiter le processus de paiement
            await new Promise(resolve => setTimeout(resolve, 1500));

            // Extraire le payment_intent_id du client_secret
            const paymentIntentId = data.clientSecret.split('_secret_')[0];

            // Confirmer le paiement avec notre mock backend
            const confirmResponse = await fetch('/api/payment/confirm-payment', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    paymentIntentId: paymentIntentId,
                    paymentMethodId: 'pm_mock_card'
                }),
            });

            const confirmData = await confirmResponse.json();

            if (confirmData && confirmData.status === 'succeeded') {
                // Paiement réussi - stocker les infos pour la page de succès
                localStorage.setItem('paymentInfo', JSON.stringify({
                    amount: amount,
                    date: new Date().toLocaleDateString()
                }));

                // Redirection vers la page succès
                router.push(`/Success/${id}`);
            } else {
                setErrorMessage('Une erreur est survenue lors de la communication avec le serveur');
            }
        } catch (err) {
            console.error(err);
            setErrorMessage('Une erreur est survenue lors de la communication avec le serveur');
        }

        setLoading(false);
    };

    return (
        <form onSubmit={handleSubmit} className='checkout-form'>
            <div className='form-row'>
                <label>
                    Carte de crédit
                    <MockCardInput
                        cardNumber={cardNumber}
                        setCardNumber={setCardNumber}
                        expiryDate={expiryDate}
                        setExpiryDate={setExpiryDate}
                        cvc={cvc}
                        setCvc={setCvc}
                        cardNumberError={cardNumberError}
                        expiryDateError={expiryDateError}
                        cvcError={cvcError}
                    />
                </label>
            </div>

            <button
                type='submit'
                disabled={loading}
                className='pay-button'
            >
                {loading ? 'Traitement...' : `Payer ${amount} €`}
            </button>

            {errorMessage && <div className='error-message'>{errorMessage}</div>}

            <style jsx>{`
                .checkout-form {
                    max-width: 500px;
                    margin: 0 auto;
                    padding: 20px;
                    border: 1px solid #e6e6e6;
                    border-radius: 8px;
                    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
                }
                .form-row {
                    margin-bottom: 20px;
                }
                label {
                    display: block;
                    margin-bottom: 10px;
                    font-weight: 500;
                }
                .pay-button {
                    background-color: #5469d4;
                    color: white;
                    border: none;
                    padding: 10px 16px;
                    border-radius: 4px;
                    font-size: 16px;
                    font-weight: 600;
                    cursor: pointer;
                    transition: all 0.2s ease;
                    width: 100%;
                }
                .pay-button:hover {
                    background-color: #4a5fc1;
                }
                .pay-button:disabled {
                    opacity: 0.5;
                    cursor: not-allowed;
                }
                .error-message {
                    color: #df1b41;
                    margin-top: 16px;
                    text-align: center;
                }
            `}</style>
        </form>
    );
};

const CheckoutPage: React.FC = () => {
    const router = useRouter();
    const params = useParams(); // Récupère les paramètres de l'URL
    const bookingId = params.id as string; // Récupération de l'id depuis l'URL
    // Récupération de la réservation
    const [bookingDetails, setBookingDetails] = useState<BookingDetails| null>(null);

    // État de chargement
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchOfferDetail = async () => {
            if (!bookingId) {
                setError("Aucune réservation spécifiée");
                setLoading(false);
                return;
            }

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

    if (loading) {
        return (
            <div className='container loading-container'>
                <div className='loading-spinner'></div>
                <p>Chargement des détails de la réservation...</p>

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
                        border-top: 4px solid #5469d4
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
                <h2>Impossible de charger les détails de la réservation</h2>
                <p>{error || "Réservation non trouvée"}</p>
                <button
                    onClick={() => router.back()}
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

    return (
        <div className='container'>
            <h1>Paiement du service</h1>
            <p className='card-paragraph'>Pour un paiement réussi : inscrire 4242 4242 4242 4242 avec une date d&apos;expiration et un CVC valide.</p>
            <p className='card-paragraph'>Pour un paiement refusé : inscrire 4000 0000 0000 0002 avec une date d&apos;expiration et un CVC valide.</p>
            <p className='card-paragraph'>Veuillez compléter les informations de paiement ci-dessous.</p>

            <div className='booking-details'>
                <h2>{bookingDetails.bookingOfferTitle}</h2>
                <p className='booking-customers'>Nombre de participants: {bookingDetails.numberOfGuests}</p>
                <div className='booking-price'>
                    <span>Montant: </span>
                    <span className='price-value'>{bookingDetails.price} €</span>
                </div>
            </div>

            <CheckoutForm amount={bookingDetails.price} id={bookingDetails.bookingId}/>

            <style jsx>{`
                .container {
                    max-width: 800px;
                    margin: 40px auto;
                    padding: 0 20px;
                }
                h1 {
                    text-align: center;
                    margin-bottom: 30px;
                    font-size: 20px;
                }
                .booking-details {
                    margin-bottom: 30px;
                    padding: 20px;
                    border-radius: 8px;
                    background-color: #f7f9fc;
                    border: 1px solid #e6ebf5;
                }
                h2 {
                    margin-top: 0;
                    color: #333;
                    font-size: 20px;
                }
                .booking-customers {
                    color: #666;
                    margin-bottom: 20px;
                }
                .booking-price {
                    display: flex;
                    justify-content: space-between;
                    padding-top: 15px;
                    border-top: 1px solid #e6ebf5;
                    font-weight: 600;
                }
                .price-value {
                    color: #5469d4;
                    font-size: 18px;
                }
                .card-paragraph {
                    text-align: center;
                    margin-bottom: 30px;
                    color: #666;
                }
            `}</style>
        </div>
    );
};

export default CheckoutPage;