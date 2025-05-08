export interface CreatePaymentIntentRequest {
    amount: number;
    currency: string;
    description: string;
}

export interface CreatePaymentIntentResponse {
    clientSecret: string;
    error?: string;
}

export interface PaymentIntent {
    id: string;
    amount: number;
    currency: string;
    status: string;
    clientSecret: string;
    createdAt: number;
}

const API_URL = 'http://localhost:8080/api';

export const paymentApi = {
    createPaymentIntent: async (data: CreatePaymentIntentRequest): Promise<CreatePaymentIntentResponse> => {
        try {
            const response = await fetch(`${API_URL}/payment/create-payment-intent`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Une erreur est survenue');
            }

            return await response.json();
        } catch (error) {
            if (error instanceof Error) {
                return { clientSecret: '', error: error.message};
            }
            return { clientSecret: '', error: 'Une erreur inconnue est survenue'};
        }
    },

    getPaymentIntent: async (id: string): Promise<PaymentIntent> => {
        try {
            const response = await fetch(`${API_URL}/payment/payment-intent/${id}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (!response.ok) {
                throw new Error('Impossible de récupérer les informations de paiement');
            }

            return await response.json();
        } catch (error) {
            throw error;
        }
    },
};
