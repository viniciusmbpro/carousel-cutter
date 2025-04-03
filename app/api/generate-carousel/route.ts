import { NextRequest, NextResponse } from 'next/server';

interface GenerateCarouselRequest {
  topic: string;
  target: string;
  tone: string;
  slideCount: number;
}

export async function POST(request: NextRequest) {
  try {
    const body: GenerateCarouselRequest = await request.json();
    const { topic, target, tone, slideCount } = body;
    
    // Validar dados de entrada
    if (!topic || !target || !tone || !slideCount) {
      return NextResponse.json(
        { error: 'Parâmetros incompletos' },
        { status: 400 }
      );
    }
    
    if (slideCount < 1 || slideCount > 10) {
      return NextResponse.json(
        { error: 'Número de slides deve estar entre 1 e 10' },
        { status: 400 }
      );
    }
    
    // Em um ambiente de produção, aqui chamaríamos um modelo de IA como OpenAI
    // Para esta demonstração, vamos gerar conteúdo mock
    
    const title = `${getTopicTitle(topic)} para ${target}`;
    
    // Gerar slides com conteúdo fictício baseado no tópico, rede e tom
    const slides = generateMockSlides(topic, target, tone, slideCount);
    
    return NextResponse.json({
      title,
      slides,
    });
  } catch (error) {
    console.error('Erro ao gerar carrossel:', error);
    return NextResponse.json(
      { error: 'Erro ao processar a solicitação' },
      { status: 500 }
    );
  }
}

// Função para gerar um título com base no tópico
function getTopicTitle(topic: string): string {
  return topic.charAt(0).toUpperCase() + topic.slice(1);
}

// Função para gerar slides mock
function generateMockSlides(topic: string, target: string, tone: string, count: number): string[] {
  const slides: string[] = [];
  
  // Slide 1: Introdução
  slides.push(`Você sabia que ${topic} é essencial para o sucesso? Neste carrossel, vamos explorar ${count} pontos importantes sobre ${topic} que você precisa conhecer.`);
  
  // Slides de conteúdo
  for (let i = 1; i < count; i++) {
    if (i === 1) {
      slides.push(`${i}. A primeira coisa a se entender sobre ${topic} é como ele impacta seu cotidiano. Estudos mostram que dedicar tempo a isso pode melhorar sua performance em até 30%.`);
    } else if (i === 2) {
      slides.push(`${i}. Um equívoco comum sobre ${topic} é pensar que é complicado. Na verdade, começar é simples: basta dedicar 15 minutos por dia e você verá resultados.`);
    } else if (i === count - 1) {
      slides.push(`${i}. Lembre-se que a consistência é chave para dominar ${topic}. Estabeleça uma rotina e mantenha-se nela, mesmo quando não sentir motivação.`);
    } else {
      slides.push(`${i}. Ao incorporar ${topic} na sua rotina, você descobrirá novos níveis de eficiência e satisfação. Muitos profissionais relatam melhoras significativas após apenas 30 dias.`);
    }
  }
  
  // Último slide: Conclusão e CTA
  slides.push(`E aí, o que achou dessas dicas sobre ${topic}? Coloque em prática a partir de hoje e compartilhe seus resultados nos comentários! Curta e salve este carrossel para consultar depois.`);
  
  return slides;
} 