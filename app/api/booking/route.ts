import { NextResponse } from 'next/server';

export async function GET() {
  try {
    // Appeler l'API Spring Boot
    const response = await fetch(`${process.env.API_BASE_URL}/api/booking`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    });

    // Si la réponse n'est pas OK
    if (!response.ok) {
      return NextResponse.json(
        { error: `Erreur: ${response.status}` },
        { status: response.status }
      );
    }

    // Récupérer les données
    const data = await response.json();
    
    // Retourner les données
    return NextResponse.json(data);
    
  } catch (error) {
    console.error('Erreur proxy API booking:', error);
    return NextResponse.json(
      { error: 'Erreur de connexion au serveur' },
      { status: 500 }
    );
  }
}