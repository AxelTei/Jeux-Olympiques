// pages/api/booking/[id].ts
import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // Extraire l'ID de la réservation
  const { id } = req.query;
  
  // Vérifier si l'ID est une chaîne
  if (typeof id !== 'string') {
    return res.status(400).json({ error: 'ID invalide' });
  }
  
  // Vérifier la méthode HTTP
  if (req.method === 'DELETE') {
    try {
      // Appeler l'API Spring Boot
      const apiBaseUrl = process.env.API_BASE_URL;
      const response = await fetch(`${apiBaseUrl}/api/booking/${id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json'
        }
      });
      
      // Si la réponse n'est pas OK
      if (!response.ok) {
        return res.status(response.status).json({ error: `Erreur: ${response.status}` });
      }
      
      // Retourner un succès
      return res.status(200).json({ success: true });
    } catch (error) {
      console.error('Erreur proxy API deleteBooking:', error);
      return res.status(500).json({ error: 'Erreur de connexion au serveur' });
    }
  } else {
    // Méthode non supportée
    res.setHeader('Allow', ['DELETE']);
    return res.status(405).json({ error: `Méthode ${req.method} non autorisée` });
  }
}