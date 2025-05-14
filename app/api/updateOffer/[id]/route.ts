import { NextRequest, NextResponse } from 'next/server';

export async function PUT(
  request: NextRequest,
  context: { params: { id: string } }
) {
  try {
    // Attendre les paramètres avant de les utiliser
    const { id } = await context.params;
    
    // Récupérer le corps de la requête
    const body = await request.json();
    
    // Récupérer le token d'authentification
    const authHeader = request.headers.get('Authorization');
    
    // Appeler l'API Spring Boot
    const response = await fetch(`${process.env.API_BASE_URL}/api/bookingOffer/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': authHeader || ''
      },
      body: JSON.stringify(body)
    });

    // Si la réponse n'est pas OK
    if (!response.ok) {
      const errorData = await response.json().catch(() => 
        ({ message: `Erreur ${response.status}: ${response.statusText}` })
      );
      
      return NextResponse.json(
        errorData,
        { status: response.status }
      );
    }

    // Récupérer les données
    const data = await response.json();
    
    // Retourner les données
    return NextResponse.json(data);
    
  } catch (error) {
    console.error('Erreur proxy API update bookingOffer:', error);
    return NextResponse.json(
      { message: 'Erreur lors de la mise à jour' },
      { status: 500 }
    );
  }
}