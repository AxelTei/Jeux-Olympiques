import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  // Récupérer le token depuis les en-têtes de la requête
  const authHeader = request.headers.get('Authorization') || '';
  
  try {
    const response = await fetch(`${process.env.API_BASE_URL}/api/sellsByOffer`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': authHeader // Transmettre le token à l'API Spring Boot
      },
    });

    if (!response.ok) {
      throw new Error(`Erreur: ${response.status}`);
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Erreur proxy API:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la récupération des données' },
      { status: 500 }
    );
  }
}
