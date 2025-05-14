import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    // Récupérer le corps de la requête
    const body = await request.json();
    
    // Appeler l'API Spring Boot
    const response = await fetch(`${process.env.API_BASE_URL}/api/ticket`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(body)
    });

    // Si la réponse n'est pas OK
    if (!response.ok) {
      return NextResponse.json(
        { error: `Erreur lors de la création du eticket (${response.status})` },
        { status: response.status }
      );
    }

    // Récupérer les données
    const data = await response.json();
    
    // Retourner les données
    return NextResponse.json(data);
    
  } catch (error) {
    console.error('Erreur proxy API create ticket:', error);
    return NextResponse.json(
      { error: "Une erreur est survenue lors de la création du ticket" },
      { status: 500 }
    );
  }
}