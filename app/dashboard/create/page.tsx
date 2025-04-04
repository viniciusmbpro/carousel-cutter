'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/app/lib/context/AuthContext';
import Input from '@/app/components/ui/input';
import Button from '@/app/components/ui/button';
import { v4 as uuidv4 } from 'uuid';

export default function CreateCarouselPage() {
  const { user } = useAuth();
  const router = useRouter();
  
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [topic, setTopic] = useState('');
  const [generatedSlides, setGeneratedSlides] = useState<any[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState('');
  const [limitReached, setLimitReached] = useState(false);
  
  const handleGenerateSlides = async () => {
    if (!topic) {
      setError('Por favor, informe um tópico para gerar slides.');
      return;
    }
    
    setIsGenerating(true);
    setError('');
    
    try {
      const response = await fetch('/api/generate-carousel', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ topic }),
      });
      
      if (!response.ok) {
        throw new Error('Falha ao gerar carrossel');
      }
      
      const data = await response.json();
      
      const formattedSlides = data.slides.map((text: string, index: number) => ({
        id: uuidv4(),
        text,
        order: index + 1,
      }));
      
      setGeneratedSlides(formattedSlides);
      if (!title && data.title) {
        setTitle(data.title);
      }
      if (!description && data.description) {
        setDescription(data.description);
      }
    } catch (error) {
      console.error('Erro ao gerar carrossel:', error);
      setError('Não foi possível gerar os slides. Por favor, tente novamente.');
    } finally {
      setIsGenerating(false);
    }
  };
  
  const handleSaveCarousel = async () => {
    if (!title.trim() || generatedSlides.length === 0) {
      setError('Por favor, adicione um título e gere slides para o carrossel.');
      return;
    }
    
    setIsSaving(true);
    setError('');
    
    try {
      const response = await fetch('/api/carousels', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title,
          description,
          slides: generatedSlides,
          userId: user?.uid,
        }),
      });
      
      if (response.status === 403) {
        // Limite do plano gratuito atingido
        const data = await response.json();
        setError(data.message || 'Limite de carrosséis atingido. Faça upgrade para um plano premium.');
        setLimitReached(true);
        return;
      }
      
      if (!response.ok) {
        throw new Error('Falha ao salvar carrossel');
      }
      
      const data = await response.json();
      router.push(`/dashboard/carousels/${data.id}`);
    } catch (error) {
      console.error('Erro ao salvar carrossel:', error);
      setError('Não foi possível salvar o carrossel. Por favor, tente novamente.');
    } finally {
      setIsSaving(false);
    }
  };
  
  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <Link href="/dashboard/carousels" className="text-primary hover:text-primary-dark flex items-center mb-2">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
            Voltar para carrosséis
          </Link>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Criar Novo Carrossel</h1>
        </div>
      </div>
      
      {error && (
        <div className="mb-6 p-4 rounded-lg bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300">
          {error}
        </div>
      )}
      
      {limitReached ? (
        <div className="card border border-gray-200 dark:border-gray-700 p-6 text-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto text-yellow-500 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
          <h2 className="text-xl font-bold mb-4">Limite do Plano Gratuito Atingido</h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            Você já criou 3 carrosséis, que é o limite do plano gratuito. Para criar mais carrosséis, considere fazer upgrade para um plano premium.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link href="/dashboard/carousels">
              <Button variant="outline">Gerenciar Carrosséis Existentes</Button>
            </Link>
            <Link href="/pricing">
              <Button variant="primary">Ver Planos Premium</Button>
            </Link>
          </div>
        </div>
      ) : (
        <>
          <div className="card border border-gray-200 dark:border-gray-700 mb-8">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Informações do carrossel</h2>
            
            <div className="space-y-6">
              <Input
                label="Título do carrossel"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Digite um título para o carrossel"
                required
              />
              
              <div>
                <label className="block text-gray-700 dark:text-gray-300 text-sm font-medium mb-1">
                  Descrição (opcional)
                </label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Digite uma descrição para o carrossel"
                  className="input w-full h-20 resize-none"
                />
              </div>
            </div>
          </div>
          
          <div className="card border border-gray-200 dark:border-gray-700 mb-8">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Gerar slides com IA</h2>
            
            <div className="space-y-6">
              <div>
                <label className="block text-gray-700 dark:text-gray-300 text-sm font-medium mb-1">
                  Sobre qual tópico você quer criar um carrossel?
                </label>
                <input
                  type="text"
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                  placeholder="Ex: 10 dicas de marketing digital, Os benefícios da meditação, etc."
                  className="input w-full"
                />
              </div>
              
              <Button
                onClick={handleGenerateSlides}
                isLoading={isGenerating}
                disabled={!topic || isGenerating}
              >
                {isGenerating ? 'Gerando slides...' : 'Gerar slides com IA'}
              </Button>
            </div>
          </div>
          
          {generatedSlides.length > 0 && (
            <>
              <div className="mb-6 flex items-center justify-between">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">Slides Gerados ({generatedSlides.length})</h2>
              </div>
              
              <div className="space-y-4 mb-8">
                {generatedSlides.map((slide) => (
                  <div key={slide.id} className="card border border-gray-200 dark:border-gray-700">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center">
                        <div className="h-6 w-6 rounded-full bg-primary text-white flex items-center justify-center text-sm font-medium mr-2">
                          {slide.order}
                        </div>
                        <h3 className="font-medium text-gray-900 dark:text-white">Slide {slide.order}</h3>
                      </div>
                    </div>
                    
                    <textarea
                      value={slide.text}
                      onChange={(e) => {
                        const updatedSlides = generatedSlides.map(s =>
                          s.id === slide.id ? { ...s, text: e.target.value } : s
                        );
                        setGeneratedSlides(updatedSlides);
                      }}
                      className="input w-full h-32 resize-none"
                      placeholder={`Conteúdo do slide ${slide.order}...`}
                    />
                  </div>
                ))}
              </div>
              
              <div className="flex justify-end">
                <Button
                  variant="primary"
                  onClick={handleSaveCarousel}
                  isLoading={isSaving}
                  disabled={isSaving || !title || generatedSlides.length === 0}
                >
                  Salvar carrossel
                </Button>
              </div>
            </>
          )}
        </>
      )}
    </div>
  );
} 