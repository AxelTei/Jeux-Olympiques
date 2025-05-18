import { NextRequest, NextResponse } from 'next/server';

interface RouteContext {
  params : {
    id : string;
  }
}

export async function DELETE(
  request: NextRequest,
  context: RouteContext
) {
  try {
    const id = context.params.id;
    
    // Appeler l'API Spring Boot
    const response = await fetch(`${process.env.API_BASE_URL}/api/booking/${id}`, {
      method: 'DELETE',
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

    // Retourner un succès
    return NextResponse.json({ success: true });
    
  } catch (error) {
    console.error('Erreur proxy API deleteBooking:', error);
    return NextResponse.json(
      { error: 'Erreur de connexion au serveur' },
      { status: 500 }
    );
  }
}