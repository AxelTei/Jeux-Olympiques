"use client";

import React, { useState, useEffect, useRef, useCallback } from 'react'; // Ajout de useCallback
import { Html5Qrcode } from 'html5-qrcode';

// Type pour les informations du ticket
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


const ScanQrCode: React.FC = () => {
  const [scanned, setScanned] = useState<boolean>(false);
  const [ticketInfo, setTicketInfo] = useState<TicketInfo | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const scannerRef = useRef<Html5Qrcode | null>(null);
  const scannerDivId = "qr-reader";

  // Utilisation de useCallback pour mémoriser la fonction
  const onScanSuccess = useCallback(async (decodedText: string) => {
    if (scanned) return;
    
    setScanned(true);
    setLoading(true);
    
    // Arrêter le scanner
    if (scannerRef.current && scannerRef.current.isScanning) {
      await scannerRef.current.stop();
    }
    
    try {
      // Extraire l'ID du ticket de l'URL scannée
      const ticketQrCodeKey = decodedText.split('/').pop();
      
      if (!ticketQrCodeKey) {
        throw new Error('QR code invalide');
      }
      
      // Récupérer tous les tickets
      const response = await fetch('/api/tickets');
      
      if (!response.ok) {
        throw new Error(`Erreur HTTP: ${response.status}`);
      }
      
      const tickets = await response.json();
      
      // Rechercher le ticket correspondant à l'ID
      const foundTicket = tickets.find((t: TicketInfo) => t.qrCodeKey === ticketQrCodeKey);
      
      if (!foundTicket) {
        throw new Error('Ticket introuvable');
      }
      
      setTicketInfo(foundTicket);
      setErrorMessage(null);
    } catch (err) {
      console.error('Erreur lors de la vérification du ticket:', err);
      setErrorMessage('QR code invalide ou ticket non reconnu');
      setTicketInfo(null);
    } finally {
      setLoading(false);
    }
  }, [scanned]); // Dépendances de useCallback: scanned

  const onScanFailure = () => {
    // Erreur silencieuse - ne rien faire ici
    // C'est normal d'avoir des échecs quand aucun QR code n'est présent
  };

  useEffect(() => {
    // Initialiser le scanner QR uniquement côté client
    if (typeof window !== 'undefined' && !scannerRef.current && !scanned) {
      const html5QrCode = new Html5Qrcode(scannerDivId);
      scannerRef.current = html5QrCode;

      const startScanning = async () => {
        try {
          await html5QrCode.start(
            { facingMode: "environment" },
            {
              fps: 10,
              qrbox: { width: 250, height: 250 },
            },
            onScanSuccess,
            onScanFailure
          );
        } catch (err) {
          console.error("Erreur lors du démarrage du scanner:", err);
          setErrorMessage("Impossible d'accéder à la caméra. Veuillez vérifier les permissions.");
        }
      };

      startScanning();
    }

    // Nettoyer le scanner lors du démontage du composant
    return () => {
      if (scannerRef.current && scannerRef.current.isScanning) {
        scannerRef.current.stop().catch(err => {
          console.error("Erreur lors de l'arrêt du scanner:", err);
        });
      }
    };
  }, [scanned, onScanSuccess]); // onScanSuccess est maintenant mémorisée

  const resetScan = async () => {
    setScanned(false);
    setTicketInfo(null);
    setErrorMessage(null);
    
    // Redémarrer le scanner si nécessaire
    if (scannerRef.current) {
      try {
        await scannerRef.current.start(
          { facingMode: "environment" },
          {
            fps: 10,
            qrbox: { width: 250, height: 250 },
          },
          onScanSuccess,
          onScanFailure
        );
      } catch (err) {
        console.error("Erreur lors du redémarrage du scanner:", err);
      }
    }
  };

  // Formater la date
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
    } catch {
      return dateString;
    }
  };

  return (
    <div className="max-w-md mx-auto p-4">
      <h1 className="text-2xl font-bold text-center mb-6">Scanner de QR Code E-Ticket</h1>
      
      {!scanned && !ticketInfo && (
        <div className="mb-4">
          <div id={scannerDivId} style={{ width: '100%', minHeight: '300px' }}></div>
          <p className="text-center mt-2 text-gray-600">Placez le QR code dans le cadre</p>
        </div>
      )}

      {loading && (
        <div className="text-center p-4">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500 mx-auto"></div>
          <p className="mt-2">Vérification du ticket...</p>
        </div>
      )}

      {errorMessage && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          <p>{errorMessage}</p>
          <button 
            onClick={resetScan}
            className="mt-2 bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
          >
            Réessayer
          </button>
        </div>
      )}

      {ticketInfo && (
        <div className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
          <h2 className="text-xl font-bold mb-4">{ticketInfo.eventName}</h2>
          
          <div className={`p-2 mb-4 rounded ${ticketInfo.used ? 'bg-green-100' : 'bg-red-100'}`}>
            <p className="font-bold">
              Statut: {ticketInfo.used ? 'Valide' : 'Invalide'}
            </p>
          </div>
          
          <div className="mb-4">
            <p><span className="font-semibold">Client:</span> {ticketInfo.username}</p>
            <p><span className="font-semibold">Réservation:</span> {formatDate(ticketInfo.offerTitle)}</p>
            <p><span className="font-semibold">Places:</span> {ticketInfo.numberOfGuests}</p>
            <p><span className="font-semibold">Prix:</span> {ticketInfo.ticketPrice}</p>
            <p><span className="font-semibold">Acheté le:</span> {formatDate(ticketInfo.purchaseDate)}</p>
            <p><span className="font-semibold">Clé QR code valide:</span> {ticketInfo.qrCodeKey}</p>
            <p><span className="font-semibold">ID:</span> {ticketInfo.ticketId}</p>
          </div>
          
          <div className="flex justify-between">
            <button
              onClick={resetScan}
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            >
              Scanner un autre ticket
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ScanQrCode;