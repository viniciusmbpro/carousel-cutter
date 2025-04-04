import { NextRequest, NextResponse } from 'next/server';
import { db, auth } from '@/app/lib/firebase/firebase-config';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { v4 as uuidv4 } from 'uuid';

// Usando o sharp para manipulação de imagens
import sharp from 'sharp';

// Tamanhos padrão para o Instagram
const INSTAGRAM_SIZES = {
  square: { width: 1080, height: 1080 },
  portrait: { width: 1080, height: 1350 },
  landscape: { width: 1080, height: 608 },
  story: { width: 1080, height: 1920 },
};

export async function POST(request: NextRequest) {
  try {
    // Verificar autenticação
    const authHeader = request.headers.get('Authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
    }
    
    // Obter o formData com a imagem
    const formData = await request.formData();
    const imageFile = formData.get('image') as File;
    const aspectRatio = formData.get('aspectRatio') as keyof typeof INSTAGRAM_SIZES || 'square';
    const cropData = formData.get('cropData') ? JSON.parse(formData.get('cropData') as string) : null;
    
    if (!imageFile) {
      return NextResponse.json({ error: 'Nenhuma imagem fornecida' }, { status: 400 });
    }

    // Extrair userId do token
    // Nota: Em uma implementação real, você deve verificar o token JWT
    const token = authHeader.split('Bearer ')[1];
    const userId = "user-id"; // Substitua por verificação real do token
    
    // Converter File para Buffer
    const arrayBuffer = await imageFile.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    
    // Redimensionar e processar a imagem
    let processedImage;
    
    if (cropData) {
      // Aplicar corte personalizado
      processedImage = await sharp(buffer)
        .extract({
          left: Math.round(cropData.x),
          top: Math.round(cropData.y),
          width: Math.round(cropData.width),
          height: Math.round(cropData.height),
        })
        .resize({
          width: INSTAGRAM_SIZES[aspectRatio].width,
          height: INSTAGRAM_SIZES[aspectRatio].height,
          fit: 'cover',
        })
        .jpeg({ quality: 90 })
        .toBuffer();
    } else {
      // Redimensionar para o tamanho adequado do Instagram
      processedImage = await sharp(buffer)
        .resize({
          width: INSTAGRAM_SIZES[aspectRatio].width,
          height: INSTAGRAM_SIZES[aspectRatio].height,
          fit: 'cover',
        })
        .jpeg({ quality: 90 })
        .toBuffer();
    }
    
    // Fazer upload da imagem processada para o Firebase Storage
    const storage = getStorage();
    const imageId = uuidv4();
    const storageRef = ref(storage, `processed-images/${userId}/${imageId}.jpg`);
    
    await uploadBytes(storageRef, processedImage);
    const downloadUrl = await getDownloadURL(storageRef);
    
    return NextResponse.json({
      success: true,
      imageUrl: downloadUrl,
      imageId,
      aspectRatio,
      dimensions: INSTAGRAM_SIZES[aspectRatio],
    });
  } catch (error) {
    console.error('Erro ao processar imagem:', error);
    return NextResponse.json(
      { error: 'Falha ao processar imagem' },
      { status: 500 }
    );
  }
} 