import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/app/lib/firebase/firebase-config';
import { collection, addDoc, query, where, getDocs, orderBy } from 'firebase/firestore';
import { v4 as uuidv4 } from 'uuid';

export async function GET(request: NextRequest) {
  try {
    const url = new URL(request.url);
    const userId = url.searchParams.get('userId');
    
    if (!userId) {
      return NextResponse.json(
        { error: 'ID do usuário é obrigatório' },
        { status: 400 }
      );
    }

    // Buscar carrosséis do usuário
    const carouselsRef = collection(db, 'carousels');
    const q = query(
      carouselsRef,
      where('userId', '==', userId),
      orderBy('createdAt', 'desc')
    );
    
    const querySnapshot = await getDocs(q);
    const carousels: any[] = [];
    
    querySnapshot.forEach((doc) => {
      carousels.push({
        id: doc.id,
        ...doc.data()
      });
    });
    
    return NextResponse.json(carousels);
  } catch (error) {
    console.error('Erro ao buscar carrosséis:', error);
    return NextResponse.json(
      { error: 'Erro ao buscar carrosséis' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { title, description, slides, userId, status } = body;
    
    // Validar dados obrigatórios
    if (!title || !slides || !userId) {
      return NextResponse.json(
        { error: 'Dados incompletos' },
        { status: 400 }
      );
    }
    
    // Validar se usuário tem limite disponível
    // Em um ambiente de produção, verificaríamos o plano do usuário
    // e quantos carrosséis ele já criou no mês
    
    // Preparar dados para salvar
    const now = new Date().toISOString();
    const carousel = {
      id: uuidv4(),
      userId,
      title,
      description: description || '',
      slides,
      createdAt: now,
      updatedAt: now,
      status: status || 'draft',
    };
    
    // Salvar no Firestore
    const docRef = await addDoc(collection(db, 'carousels'), carousel);
    
    // Retornar dados salvos com ID
    return NextResponse.json({
      id: docRef.id,
      ...carousel
    });
  } catch (error) {
    console.error('Erro ao criar carrossel:', error);
    return NextResponse.json(
      { error: 'Erro ao criar carrossel' },
      { status: 500 }
    );
  }
} 