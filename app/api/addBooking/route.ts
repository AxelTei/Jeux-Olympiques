import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    // Récupérer le corps de la requête
    const body = await request.json();
    
    // Appeler l'API Spring Boot
    const response = await fetch(`${process.env.API_BASE_URL}/api/booking`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(body)
    });

    // Si la réponse n'est pas OK, lancer une erreur
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