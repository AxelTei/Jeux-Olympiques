import { NextRequest, NextResponse } from 'next/server';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id;
    
    // Appeler l'API Spring Boot
    const response = await fetch(`${process.env.API_BASE_URL}/api/booking/${id}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    });

    // Si la réponse n'est pas OK
    if (!response.ok) {
      return NextResponse.json(
        { error: `Erreur lors de la récupération de la réservation (${response.status})` },
        { status: response.status }
      );
    }

    // Récupérer les données
    const data = await response.json();
    
    // Retourner les données
    return NextResponse.json(data);
    
  } catch (error) {
    console.error('Erreur proxy API booking detail:', error);
    return NextResponse.json(
      { error: "Erreur inconnue lors du chargement de la réservation" },
      { status: 500 }
    );
  }
}