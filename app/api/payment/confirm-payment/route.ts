// app/api/payment/confirm-payment/route.ts
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    // Récupérer le corps de la requête
    const body = await request.json();
    
    // Appeler l'API Spring Boot
    const response = await fetch(`${process.env.API_BASE_URL}/api/payment/confirm-payment`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(body)
    });

    // Si la réponse n'est pas OK
    if (!response.ok) {
      const errorData = await response.json();
      return NextResponse.json(
        { error: errorData.error || `Erreur: ${response.status}` },
        { status: response.status }
      );
    }

    // Récupérer les données
    const data = await response.json();
    
    // Retourner les données
    return NextResponse.json(data);
    
  } catch (error) {
    console.error('Erreur proxy API confirm-payment:', error);
    return NextResponse.json(
      { error: "Une erreur est survenue lors de la communication avec le serveur" },
      { status: 500 }
    );
  }
}