'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/app/lib/context/AuthContext';
import Input from '@/app/components/ui/input';
import Button from '@/app/components/ui/button';
import { Slide } from '@/app/lib/types/carousel';
import { v4 as uuidv4 } from 'uuid';

export default function CreateCarouselPage() {
  const router = useRouter();
  const { user } = useAuth();
  
  const [topic, setTopic] = useState('');
  const [target, setTarget] = useState('Instagram');
  const [tone, setTone] = useState('profissional');
  const [slideCount, setSlideCount] = useState(5);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState('');
  const [generatedSlides, setGeneratedSlides] = useState<Slide[]>([]);
  const [carouselTitle, setCarouselTitle] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  
  // Opções para os campos de seleção
  const targetOptions = ['Instagram', 'LinkedIn', 'Facebook', 'Twitter'];
  const toneOptions = ['profissional', 'casual', 'humorístico', 'informativo', 'motivacional'];
  const slideCountOptions = [3, 5, 7, 10];

  const handleGenerate = async () => {
    if (!topic.trim()) {
      setError('Por favor, insira um tópico para o carrossel.');
      return;
    }
    
    setError('');
    setIsGenerating(true);
    setGeneratedSlides([]);
    
    try {
      const response = await fetch('/api/generate-carousel', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          topic,
          target,
          tone,
          slideCount,
        }),
      });
      
      if (!response.ok) {
        throw new Error('Falha ao gerar o carrossel');
      }
      
      const data = await response.json();
      
      // Transformar a resposta da API em slides
      const slides: Slide[] = data.slides.map((text: string, index: number) => ({
        id: uuidv4(),
        text,
        order: index + 1,
      }));
      
      setGeneratedSlides(slides);
      setCarouselTitle(data.title || `Carrossel sobre ${topic}`);
    } catch (error) {
      console.error('Erro ao gerar carrossel:', error);
      setError('Ocorreu um erro ao gerar o carrossel. Por favor, tente novamente.');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSaveCarousel = async () => {
    if (generatedSlides.length === 0) {
      setError('Não há slides para salvar. Por favor, gere o conteúdo primeiro.');
      return;
    }
    
    setError('');
    setIsSaving(true);
    
    try {
      const response = await fetch('/api/carousels', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: carouselTitle,
          description: `Carrossel sobre ${topic} para ${target} com tom ${tone}`,
          slides: generatedSlides,
          userId: user?.uid,
          status: 'draft',
        }),
      });
      
      if (!response.ok) {
        throw new Error('Falha ao salvar o carrossel');
      }
      
      const data = await response.json();
      router.push(`/dashboard/carousels/${data.id}`);
    } catch (error) {
      console.error('Erro ao salvar carrossel:', error);
      setError('Ocorreu um erro ao salvar o carrossel. Por favor, tente novamente.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleSlideChange = (id: string, newText: string) => {
    setGeneratedSlides(prevSlides =>
      prevSlides.map(slide =>
        slide.id === id ? { ...slide, text: newText } : slide
      )
    );
  };

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Criar novo carrossel</h1>
        <p className="mt-1 text-gray-600 dark:text-gray-400">
          Preencha o formulário abaixo para gerar conteúdo com nossa IA
        </p>
      </div>
      
      {error && (
        <div className="mb-6 p-4 rounded-lg bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300">
          {error}
        </div>
      )}
      
      <div className="card border border-gray-200 dark:border-gray-700 mb-8">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Informações do carrossel</h2>
        
        <div className="space-y-6">
          <Input
            label="Tópico do carrossel"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            placeholder="Ex: Dicas de produtividade para profissionais"
            required
          />
          
          <div>
            <label className="block text-gray-700 dark:text-gray-300 text-sm font-medium mb-1">
              Rede social
            </label>
            <select
              value={target}
              onChange={(e) => setTarget(e.target.value)}
              className="input w-full"
            >
              {targetOptions.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </div>
          
          <div>
            <label className="block text-gray-700 dark:text-gray-300 text-sm font-medium mb-1">
              Tom do conteúdo
            </label>
            <select
              value={tone}
              onChange={(e) => setTone(e.target.value)}
              className="input w-full"
            >
              {toneOptions.map((option) => (
                <option key={option} value={option}>
                  {option.charAt(0).toUpperCase() + option.slice(1)}
                </option>
              ))}
            </select>
          </div>
          
          <div>
            <label className="block text-gray-700 dark:text-gray-300 text-sm font-medium mb-1">
              Número de slides
            </label>
            <select
              value={slideCount}
              onChange={(e) => setSlideCount(Number(e.target.value))}
              className="input w-full"
            >
              {slideCountOptions.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </div>
          
          <div className="flex justify-end">
            <Button
              onClick={handleGenerate}
              isLoading={isGenerating}
              disabled={!topic.trim()}
            >
              Gerar carrossel
            </Button>
          </div>
        </div>
      </div>
      
      {generatedSlides.length > 0 && (
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">Resultado</h2>
            <Button
              onClick={handleSaveCarousel}
              isLoading={isSaving}
              variant="primary"
            >
              Salvar carrossel
            </Button>
          </div>
          
          <Input
            label="Título do carrossel"
            value={carouselTitle}
            onChange={(e) => setCarouselTitle(e.target.value)}
            placeholder="Digite um título para o carrossel"
            className="mb-4"
          />
          
          <div className="space-y-4 mb-8">
            {generatedSlides.map((slide) => (
              <div key={slide.id} className="card border border-gray-200 dark:border-gray-700">
                <div className="flex items-center mb-2">
                  <div className="h-6 w-6 rounded-full bg-primary text-white flex items-center justify-center text-sm font-medium mr-2">
                    {slide.order}
                  </div>
                  <h3 className="font-medium text-gray-900 dark:text-white">Slide {slide.order}</h3>
                </div>
                
                <textarea
                  value={slide.text}
                  onChange={(e) => handleSlideChange(slide.id, e.target.value)}
                  className="input w-full h-32 resize-none"
                />
              </div>
            ))}
          </div>
          
          <div className="flex justify-end">
            <Button
              onClick={handleSaveCarousel}
              isLoading={isSaving}
              variant="primary"
            >
              Salvar carrossel
            </Button>
          </div>
        </div>
      )}
    </div>
  );
} 