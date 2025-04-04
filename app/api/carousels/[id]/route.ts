import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/app/lib/firebase/firebase-config';
import { doc, getDoc, updateDoc, deleteDoc } from 'firebase/firestore';

interface RouteParams {
  params: {
    id: string;
  };
}

export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = params;
    
    if (!id) {
      return NextResponse.json(
        { error: 'ID do carrossel é obrigatório' },
        { status: 400 }
      );
    }
    
    console.log('Buscando carrossel com ID:', id);
    
    // Buscar documento no Firestore
    const carouselRef = doc(db, 'carousels', id);
    const carouselDoc = await getDoc(carouselRef);
    
    console.log('Documento existe?', carouselDoc.exists());
    
    if (!carouselDoc.exists()) {
      console.log('Carrossel não encontrado para o ID:', id);
      return NextResponse.json(
        { error: 'Carrossel não encontrado' },
        { status: 404 }
      );
    }
    
    const data = {
      id: carouselDoc.id,
      ...carouselDoc.data()
    };
    
    console.log('Dados do carrossel recuperados:', {
      id: data.id,
      title: data.title,
      slidesCount: data.slides?.length || 0
    });
    
    // Retornar dados do carrossel
    return NextResponse.json(data);
  } catch (error) {
    console.error('Erro ao buscar carrossel:', error);
    return NextResponse.json(
      { error: 'Erro ao buscar carrossel' },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = params;
    const body = await request.json();
    
    if (!id) {
      return NextResponse.json(
        { error: 'ID do carrossel é obrigatório' },
        { status: 400 }
      );
    }
    
    // Verificar se o carrossel existe
    const carouselRef = doc(db, 'carousels', id);
    const carouselDoc = await getDoc(carouselRef);
    
    if (!carouselDoc.exists()) {
      return NextResponse.json(
        { error: 'Carrossel não encontrado' },
        { status: 404 }
      );
    }
    
    // Verificar se o usuário tem permissão para editar
    // (Em um ambiente de produção, verificaríamos se o userId do token corresponde ao userId do carrossel)
    
    // Preparar dados para atualização
    const updatedData = {
      ...body,
      updatedAt: new Date().toISOString()
    };
    
    // Remover campos que não podem ser atualizados
    delete updatedData.id;
    delete updatedData.userId;
    delete updatedData.createdAt;
    
    // Atualizar no Firestore
    await updateDoc(carouselRef, updatedData);
    
    // Retornar dados atualizados
    return NextResponse.json({
      id,
      ...carouselDoc.data(),
      ...updatedData
    });
  } catch (error) {
    console.error('Erro ao atualizar carrossel:', error);
    return NextResponse.json(
      { error: 'Erro ao atualizar carrossel' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = params;
    
    if (!id) {
      return NextResponse.json(
        { error: 'ID do carrossel é obrigatório' },
        { status: 400 }
      );
    }
    
    // Verificar se o carrossel existe
    const carouselRef = doc(db, 'carousels', id);
    const carouselDoc = await getDoc(carouselRef);
    
    if (!carouselDoc.exists()) {
      return NextResponse.json(
        { error: 'Carrossel não encontrado' },
        { status: 404 }
      );
    }
    
    // Verificar se o usuário tem permissão para excluir
    // (Em um ambiente de produção, verificaríamos se o userId do token corresponde ao userId do carrossel)
    
    // Excluir do Firestore
    await deleteDoc(carouselRef);
    
    return NextResponse.json({
      id,
      deleted: true
    });
  } catch (error) {
    console.error('Erro ao excluir carrossel:', error);
    return NextResponse.json(
      { error: 'Erro ao excluir carrossel' },
      { status: 500 }
    );
  }
} 