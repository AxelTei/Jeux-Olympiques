'use client';

import Head from "next/head";
import { useRouter, useSearchParams } from "next/navigation";
import React, { useState, useEffect } from "react";

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

const VerifyTicket: React.FC = () => {
    const router = useRouter();
    const searchParams = useSearchParams();
    const qrCodeKey = typeof window !== 'undefined'
        ? window.location.pathname.split('/').pop()
        : searchParams?.get('id');

    const [ticket, setTicket] = useState<TicketInfo | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [, setVerificationStatus] = useState<'idle' | 'success' | 'error'>('idle');

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
    } catch (e) {
      return dateString;
    }
  };

   useEffect(() => {
    // Vérifier le ticket
    const verifyTicket = async () => {
      if (!qrCodeKey) return;
      
      setLoading(true);
      
      try {
        // Récupérer tous les tickets
        const response = await fetch(`http://localhost:8080/api/ticket/${qrCodeKey}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });
        
        if (!response.ok) {
          throw new Error(`Erreur HTTP: ${response.status}`);
        }
        
        const ticket = await response.json();
        
        
        if (!ticket) {
          setVerificationStatus('error');
          throw new Error('Ticket introuvable');
        }
        
        // Ajouter la propriété valid (pourrait venir de l'API dans un cas réel)
        const ticketWithValidity = {
          ...ticket,
          used: "Valide" // Dans un cas réel, cette valeur pourrait être déterminée par d'autres facteurs
        };
        
        setTicket(ticketWithValidity);
        setVerificationStatus('success');
        setError(null);
      } catch (err: any) {
        console.error('Erreur lors de la vérification du ticket:', err);
        setVerificationStatus('error');
        setError(err.message || 'Impossible de vérifier le ticket');
      } finally {
        setLoading(false);
      }
    };

    verifyTicket();
  }, [qrCodeKey]);

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
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd"></path>
            </svg>
          </div>
          <div>
            <p className="font-bold">Erreur</p>
            <p>{error}</p>
          </div>
        </div>
      </div>
      <button
        onClick={() => router.back()}
        className="mt-4 bg-indigo-500 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded"
      >
        Retour
      </button>
    </div>
  );
  
  if (!ticket) return (
    <div className="flex flex-col items-center justify-center h-screen">
      <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4 max-w-md">
        <p className="font-bold">Ticket non trouvé</p>
        <p>Ce ticket n&apos;a pas pu être vérifié.</p>
      </div>
      <button
        onClick={() => router.back()}
        className="mt-4 bg-indigo-500 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded"
      >
        Retour
      </button>
    </div>
  );

  return (
    <>
      <Head>
        <title>Vérification Ticket | {ticket.eventName}</title>
        <meta name="description" content={`Vérification du ticket pour ${ticket.eventName}`} />
      </Head>
      
      <div className="min-h-screen bg-gray-100 py-10">
        <div className="max-w-md mx-auto bg-white rounded-xl shadow-lg overflow-hidden">
          <div className={`p-4 ${ticket.used ? 'bg-green-100' : 'bg-red-100'} flex items-center justify-center`}>
            <div className={`rounded-full p-2 ${ticket.used ? 'bg-green-500' : 'bg-red-500'} text-white mr-4`}>
              {ticket.used ? (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              )}
            </div>
            <h2 className="text-xl font-bold">
              {ticket.used ? 'Ticket Valide' : 'Ticket Invalide'}
            </h2>
          </div>
          
          <div className="p-6">
            <h1 className="text-2xl font-bold text-center mb-6">{ticket.eventName}</h1>
            
            <div className="border-b pb-4 mb-4">
              <div className="flex justify-between mb-2">
                <span className="font-semibold">Client:</span>
                <span>{ticket.username}</span>
              </div>
              <div className="flex justify-between mb-2">
                <span className="font-semibold">Titre:</span>
                <span>{formatDate(ticket.offerTitle)}</span>
              </div>
              <div className="flex justify-between mb-2">
                <span className="font-semibold">Places:</span>
                <span>{ticket.numberOfGuests}</span>
              </div>
              <div className="flex justify-between mb-2">
                <span className="font-semibold">Prix:</span>
                <span>{ticket.ticketPrice}</span>
              </div>
              <div className="flex justify-between mb-2">
                <span className="font-semibold">Acheté le:</span>
                <span>{formatDate(ticket.purchaseDate)}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-semibold">ID:</span>
                <span className="text-gray-500 text-sm">{ticket.ticketId}</span>
              </div>
            </div>
            
            <div className="text-center">
              <div className={`inline-block py-2 px-4 rounded-full text-sm ${ticket.used ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                {ticket.used ? 'Ce ticket est valide et peut être accepté' : 'Ce ticket n\'est pas valide'}
              </div>
            </div>
            
            <div className="mt-6 flex justify-center">
              <button
                onClick={() => router.back()}
                className="bg-indigo-500 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded"
              >
                Retour
              </button>
            </div>
          </div>
          
          <div className="p-4 bg-gray-50 border-t">
            <div className="text-center">
              <p className="text-sm text-gray-500">
                Scanné le {new Date().toLocaleDateString('fr-FR', { 
                  day: '2-digit', 
                  month: '2-digit', 
                  year: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default VerifyTicket;