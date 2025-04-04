import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/app/lib/firebase/firebase-config';
import { doc, getDoc } from 'firebase/firestore';
import { v4 as uuidv4 } from 'uuid';
import JSZip from 'jszip';
import { getStorage, ref, getDownloadURL } from 'firebase/storage';
import https from 'https';

// Definindo interface para o objeto carousel
interface CarouselData {
  id: string;
  title: string;
  description?: string;
  slides: {
    id: string;
    order: number;
    imageUrl?: string;
    text?: string;
    caption?: string;
  }[];
  createdAt: string;
  type?: string;
  aspectRatio?: string;
}

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;

    // Buscar carrossel no Firestore
    const carouselRef = doc(db, 'carousels', id);
    const carouselSnap = await getDoc(carouselRef);

    if (!carouselSnap.exists()) {
      return NextResponse.json(
        { error: 'Carrossel não encontrado' },
        { status: 404 }
      );
    }

    const carousel = { id: carouselSnap.id, ...carouselSnap.data() } as CarouselData;
    
    // Verificar se é um carrossel de imagens
    if (carousel.type !== 'image-carousel' || !carousel.slides || carousel.slides.length === 0) {
      return NextResponse.json(
        { error: 'Carrossel não contém imagens para download' },
        { status: 400 }
      );
    }

    // Criar um arquivo ZIP com as imagens
    const zip = new JSZip();
    
    // Função auxiliar para baixar uma imagem e adicioná-la ao ZIP
    const downloadImageAndAddToZip = (imageUrl: string, fileName: string): Promise<void> => {
      return new Promise((resolve, reject) => {
        https.get(imageUrl, (response) => {
          if (response.statusCode !== 200) {
            reject(new Error(`Falha ao baixar imagem: ${response.statusCode}`));
            return;
          }

          const chunks: Buffer[] = [];
          response.on('data', (chunk) => chunks.push(Buffer.from(chunk)));
          response.on('end', () => {
            const buffer = Buffer.concat(chunks);
            zip.file(fileName, buffer);
            resolve();
          });
          response.on('error', reject);
        });
      });
    };

    // Adicionar cada imagem ao ZIP
    const downloadPromises = carousel.slides
      .sort((a, b) => a.order - b.order)
      .map((slide, index) => {
        if (!slide.imageUrl) return Promise.resolve();
        
        const fileName = `slide_${index + 1}.jpg`;
        return downloadImageAndAddToZip(slide.imageUrl, fileName);
      });

    // Aguardar o download de todas as imagens
    await Promise.all(downloadPromises);

    // Adicionar arquivo README.txt com informações sobre o carrossel
    const readmeContent = `Carrossel: ${carousel.title}
Descrição: ${carousel.description || 'Sem descrição'}
Data de criação: ${new Date(carousel.createdAt).toLocaleDateString('pt-BR')}
Número de slides: ${carousel.slides.length}
Formato: ${carousel.aspectRatio || 'Não especificado'}

Gerado por Carousel Cutter - A melhor ferramenta para criar carrosséis para Instagram!
`;
    zip.file('README.txt', readmeContent);

    // Gerar o arquivo ZIP
    const zipBuffer = await zip.generateAsync({ type: 'nodebuffer' });

    // Configurar headers para download
    const headers = new Headers();
    headers.set('Content-Type', 'application/zip');
    headers.set('Content-Disposition', `attachment; filename="carousel_${id}.zip"`);

    return new NextResponse(zipBuffer, {
      status: 200,
      headers,
    });
  } catch (error) {
    console.error('Erro ao baixar carrossel:', error);
    return NextResponse.json(
      { error: 'Falha ao baixar carrossel' },
      { status: 500 }
    );
  }
} 