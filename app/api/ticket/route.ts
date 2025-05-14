import { NextResponse } from 'next/server';

export async function GET() {
  try {
    // Appeler l'API Spring Boot
    const response = await fetch(`${process.env.API_BASE_URL}/api/ticket`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    });

    // Si la réponse n'est pas OK, lancer une erreur
    if (!response.ok) {
      return NextResponse.json(
        { error: `Erreur HTTP: ${response.status}` },
        { status: response.status }
      );
    }

    // Récupérer les données
    const data = await response.json();
    
    // Retourner les données
    return NextResponse.json(data);
    
  } catch (error) {
    console.error('Erreur proxy API tickets:', error);
    return NextResponse.json(
      { error: 'Erreur de connexion au serveur' },
      { status: 500 }
    );
  }
}