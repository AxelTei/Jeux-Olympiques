'use client';

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { getAlias } from "../services/authService";
import QRCode from "react-qr-code";

interface TicketInfo {
    ticketId: string;
    username: string;
    offerTitle: string;
    eventName: string;
    ticketPrice: number;
    numberOfGuests: number;
    purchaseDate: string;
    paymentKey: string;
    qrCodeKey: string;
    used: string;
}

const Page: React.FC = () => {
    const router = useRouter();
    const [, setTickets] = useState<TicketInfo[]>([]);
    const [filteredTickets, setFilteredTickets] = useState<TicketInfo[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const currentUser = getAlias();

        const fetchTickets = async () => {
            try {
                setLoading(true);
                const response = await fetch('/api/ticket', {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                });

                if (!response.ok) {
                    throw new Error(`Erreur HTTP: ${response.status}`);
                }

                const data = await response.json();
                setTickets(data);

                if (currentUser) {
                    const userTickets = data.filter((ticket: TicketInfo) =>
                    ticket.username.toLowerCase() === currentUser.toLowerCase()
                    );
                    setFilteredTickets(userTickets);
                } else {
                    setFilteredTickets([]);
                }

                setError(null);
            } catch (err) {
                console.error('Erreur lors de la récupération des tickets:', err);
                setError('Impossible de récupérer les tickets');
            } finally {
                setLoading(false);
            }
        };

        fetchTickets();
    }, []);

    const formatDate = (dateString: string) => {
        try {
            const date = new Date(dateString);
            return new Intl.DateTimeFormat('fr-FR', {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
            }).format(date);
        } catch (err) {
            console.error('Impossible de formater la date des Tickets:', err);
            return dateString;
        }
    };

    if (loading) return (
        <div className="flex justify-center items-center h-screen">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
        </div>
    );

    if (error) return (
        <div className="flex flex-col items-center justify-center h-screen">
            <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 max-w-md">
                <div className="flex">
                    <div className="py-1">
                        <svg className="w-6 h-6 mr-4" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                        </svg>
                    </div>
                    <div>
                        <p className="font-bold">Erreur</p>
                        <p>{error}</p>
                    </div>
                </div>
            </div>
            <button
                onClick={() => router.push('/')}
                className="mt-4 bg-indigo-500 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded"
            >
                Retour à l&apos;accueil
            </button>
        </div>
    );

    if (filteredTickets.length === 0) return (
        <div className="flex flex-col items-center justify-center h-screen">
            <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4 max-w-md">
                <p className="font-bold">Aucun ticket trouvé</p>
                <p>Vous n&apos;avez pas de tickets disponibles.</p>
            </div>
            <button
                onClick={() => router.push('/')}
                className="mt-4 bg-indigo-500 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded"
            >
                Retour à l&apos;accueil
            </button>
        </div>
    );

    return(
        <div className="min-h-screen bg-gray-100 py-6">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center">
                    <h1 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
                        Mes Tickets
                    </h1>
                    <p className="mt-3 max-w-2xl mx-auto text-xl text-gray-500 sm:mt-4">
                        Voici tous vos e-tickets disponibles
                    </p>
                </div>

                <div className="mt-12 grid gap-5 max-w-lg mx-auto lg:grid-cols-3 lg:max-w-none">
                    {filteredTickets.map((ticket) => (
                        <div
                            key={ticket.ticketId}
                            className="flex flex-col rounded-lg shadow-lg overflow-hidden bg-white hover:shadow-xl transition-shadow duration-300"
                        >
                            <div className="flex-1 p-6 flex flex-col justify-between">
                                <div className="flex-1">
                                    <div className="block">
                                        <p className="text-xl font-semibold text-gray-900">{ticket.eventName}</p>
                                    </div>
                                </div>

                                <div className="mt-4 flex justify-center">
                                    <div>
                                        <QRCode
                                            value={`https://jeux-olympiques-79sb.vercel.app/verify-ticket/${ticket.qrCodeKey}` || window.location.origin}
                                            size={150}
                                            level="H"
                                        />
                                    </div>
                                </div>

                                <div className="mt-4">
                                    <p className="text-sm text-gray-500"><span className="font-semibold">Ticket: </span>{ticket.offerTitle}</p>
                                    <p className="text-sm text-gray-500"><span className="font-semibold">Places: </span>{ticket.numberOfGuests}</p>
                                    <p className="text-sm text-gray-500"><span className="font-semibold">Prix payé: </span>{ticket.ticketPrice} €</p>
                                    <p className="text-sm text-gray-500 mt-2"><span className="font-semibold">Acheté le: </span>{formatDate(ticket.purchaseDate)}</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Page;