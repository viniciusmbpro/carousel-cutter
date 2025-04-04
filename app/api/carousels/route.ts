import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/app/lib/firebase/firebase-config';
import { collection, addDoc, query, where, getDocs, orderBy } from 'firebase/firestore';
import { v4 as uuidv4 } from 'uuid';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    if (!userId) {
      return NextResponse.json(
        { error: 'ID do usuário não fornecido' },
        { status: 400 }
      );
    }

    // Buscar carrosséis do usuário - sem orderBy para evitar erro de índice
    const carouselsRef = collection(db, 'carousels');
    
    // Remover temporariamente o orderBy para funcionar sem índice
    const q = query(
      carouselsRef,
      where('userId', '==', userId)
      // orderBy removido temporariamente
    );

    const querySnapshot = await getDocs(q);
    const carousels = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));

    // Ordenar no cliente
    carousels.sort((a: any, b: any) => {
      // Ordenar por data decrescente (mais recente primeiro)
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });

    return NextResponse.json(carousels);
  } catch (error) {
    console.error('Erro ao buscar carrosséis:', error);
    return NextResponse.json(
      { error: 'Falha ao buscar carrosséis' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { title, description, slides, userId } = body;

    if (!title || !slides || !userId) {
      return NextResponse.json(
        { error: 'Título, slides e ID do usuário são obrigatórios' },
        { status: 400 }
      );
    }

    // Verificar quantos carrosséis o usuário já criou (limite do plano gratuito)
    const carouselsRef = collection(db, 'carousels');
    const q = query(carouselsRef, where('userId', '==', userId));
    const snapshot = await getDocs(q);
    
    // No plano gratuito, o usuário pode criar até 3 carrosséis
    if (snapshot.size >= 3) {
      return NextResponse.json(
        { 
          error: 'Limite de carrosséis do plano gratuito atingido', 
          message: 'Você atingiu o limite de 3 carrosséis do plano gratuito. Considere fazer upgrade para um plano premium.'
        },
        { status: 403 }
      );
    }

    // Criar novo carrossel
    const carousel = {
      id: uuidv4(),
      userId,
      title,
      description: description || '',
      slides,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      isPublished: false
    };

    // Salvar no Firestore
    const docRef = await addDoc(carouselsRef, carousel);

    // Retornar dados salvos
    return NextResponse.json({
      ...carousel,
      id: docRef.id
    });
  } catch (error) {
    console.error('Erro ao criar carrossel:', error);
    return NextResponse.json(
      { error: 'Falha ao criar carrossel' },
      { status: 500 }
    );
  }
} 