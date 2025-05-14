import { NextResponse } from 'next/server';

export async function GET() {
  try {
    // Appeler l'API Spring Boot
    const response = await fetch(`${process.env.API_BASE_URL}/api/bookingOffer`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    });

    // Si la réponse n'est pas OK, lancer une erreur
    if (!response.ok) {
      return NextResponse.json(
        { error: 'Erreur lors de la récupération des offres' },
        { status: response.status }
      );
    }

    // Récupérer les données
    const data = await response.json();
    
    // Retourner les données
    return NextResponse.json(data);
    
  } catch (error) {
    console.error('Erreur proxy API bookingOffer:', error);
    return NextResponse.json(
      { error: 'Erreur de connexion au serveur' },
      { status: 500 }
    );
  }
}