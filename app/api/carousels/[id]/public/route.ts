import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/app/lib/firebase/firebase-config';
import { doc, getDoc } from 'firebase/firestore';

interface RouteParams {
  params: {
    id: string;
  };
}

export async function GET(
  request: NextRequest,
  { params }: RouteParams
) {
  try {
    const { id } = params;

    if (!id) {
      return NextResponse.json(
        { error: 'ID do carrossel não fornecido' },
        { status: 400 }
      );
    }

    // Obter o carrossel do Firestore
    const carouselRef = doc(db, 'carousels', id);
    const carouselSnap = await getDoc(carouselRef);

    // Verificar se o carrossel existe
    if (!carouselSnap.exists()) {
      return NextResponse.json(
        { error: 'Carrossel não encontrado' },
        { status: 404 }
      );
    }

    const carouselData = carouselSnap.data();
    
    // Verificar se o carrossel está publicado
    if (!carouselData.isPublished) {
      return NextResponse.json(
        { error: 'Este carrossel não está disponível para visualização pública' },
        { status: 403 }
      );
    }

    // Não retornar dados sensíveis ou desnecessários
    const carousel = {
      id: carouselSnap.id,
      title: carouselData.title,
      description: carouselData.description,
      slides: carouselData.slides,
      createdAt: carouselData.createdAt,
      updatedAt: carouselData.updatedAt,
    };

    return NextResponse.json(carousel);
  } catch (error) {
    console.error('Erro ao obter carrossel público:', error);
    return NextResponse.json(
      { error: 'Falha ao recuperar o carrossel' },
      { status: 500 }
    );
  }
} 