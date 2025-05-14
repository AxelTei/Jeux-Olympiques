import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    // Récupérer le corps de la requête et l'en-tête d'autorisation
    const body = await request.json();
    const authHeader = request.headers.get('Authorization');
    
    // Faire la requête à l'API Spring Boot
    const response = await fetch(`${process.env.API_BASE_URL}/api/bookingOffer`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': authHeader || ''
      },
      body: JSON.stringify(body)
    });

    // Récupérer la réponse
    const data = await response.json();
    
    // Retourner la réponse avec le même statut
    return NextResponse.json(data, { status: response.status });
    
  } catch (error) {
    console.error('Erreur proxy API:', error);
    return NextResponse.json(
      { message: 'Erreur de connexion au serveur' },
      { status: 500 }
    );
  }
}