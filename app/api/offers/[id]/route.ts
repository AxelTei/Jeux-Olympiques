import { NextRequest, NextResponse } from 'next/server';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id;
    
    // Appeler l'API Spring Boot
    const response = await fetch(`${process.env.API_BASE_URL}/api/bookingOffer/${id}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    });

    // Si l'offre n'est pas trouvée
    if (response.status === 404) {
      return NextResponse.json(
        { error: "Offre non trouvée" },
        { status: 404 }
      );
    }

    // Si la réponse n'est pas OK
    if (!response.ok) {
      return NextResponse.json(
        { error: "Erreur lors de la récupération de l'offre" },
        { status: response.status }
      );
    }

    // Récupérer les données
    const data = await response.json();
    
    // Retourner les données
    return NextResponse.json(data);
    
  } catch (error) {
    console.error('Erreur proxy API bookingOffer detail:', error);
    return NextResponse.json(
      { error: "Une erreur est survenue" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id;
    
    // Récupérer le token d'authentification
    const authHeader = request.headers.get('Authorization');
    
    // Appeler l'API Spring Boot
    const response = await fetch(`${process.env.API_BASE_URL}/api/bookingOffer/${id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': authHeader || ''
      }
    });

    // Si la réponse n'est pas OK
    if (!response.ok) {
      return NextResponse.json(
        { error: `Error: ${response.status}` },
        { status: response.status }
      );
    }

    // Retourner un succès
    return NextResponse.json({ success: true });
    
  } catch (error) {
    console.error('Erreur proxy API deleteOffer:', error);
    return NextResponse.json(
      { error: "Une erreur est survenue" },
      { status: 500 }
    );
  }
}