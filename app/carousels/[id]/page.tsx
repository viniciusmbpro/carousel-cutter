'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Carousel, Slide } from '@/app/lib/types/carousel';
import { formatDate } from '@/app/lib/utils';

interface PageProps {
  params: {
    id: string;
  };
}

export default function PublicCarouselPage({ params }: PageProps) {
  const { id } = params;
  
  const [carousel, setCarousel] = useState<Carousel | null>(null);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  useEffect(() => {
    async function fetchCarousel() {
      if (!id) return;
      
      try {
        setLoading(true);
        const response = await fetch(`/api/carousels/${id}/public`);
        
        if (!response.ok) {
          throw new Error('Falha ao carregar carrossel');
        }
        
        const data = await response.json();
        
        setCarousel(data);
      } catch (error) {
        console.error('Erro ao carregar carrossel:', error);
        setError('Não foi possível carregar o carrossel. Por favor, tente novamente.');
      } finally {
        setLoading(false);
      }
    }
    
    fetchCarousel();
  }, [id]);
  
  const nextSlide = () => {
    if (!carousel || !carousel.slides) return;
    
    setCurrentSlide((prev) => (prev === carousel.slides.length - 1 ? 0 : prev + 1));
  };
  
  const prevSlide = () => {
    if (!carousel || !carousel.slides) return;
    
    setCurrentSlide((prev) => (prev === 0 ? carousel.slides.length - 1 : prev - 1));
  };
  
  const goToSlide = (index: number) => {
    setCurrentSlide(index);
  };
  
  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-50 dark:bg-gray-900">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }
  
  if (error || !carousel) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-gray-50 dark:bg-gray-900 p-4">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
          Carrossel não encontrado
        </h2>
        <p className="text-gray-600 dark:text-gray-400 mb-6 text-center max-w-md">
          {error || 'O carrossel que você está procurando não foi encontrado ou foi removido.'}
        </p>
        <Link href="/" className="text-primary hover:underline">
          Voltar para a página inicial
        </Link>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-4">
      <div className="max-w-4xl mx-auto">
        <header className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            {carousel.title}
          </h1>
          {carousel.description && (
            <p className="text-gray-600 dark:text-gray-400 mb-2">
              {carousel.description}
            </p>
          )}
          <p className="text-sm text-gray-500 dark:text-gray-500">
            Criado em {formatDate(carousel.createdAt)}
          </p>
        </header>
        
        <div className="relative bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden mb-6">
          {/* Container do slide */}
          <div className="aspect-video flex items-center justify-center p-8 md:p-12">
            <div className="max-w-full text-center">
              <p className="text-xl md:text-2xl text-gray-900 dark:text-white font-medium">
                {carousel.slides && carousel.slides[currentSlide]?.text}
              </p>
            </div>
          </div>
          
          {/* Navegação */}
          <div className="absolute inset-y-0 left-0 flex items-center">
            <button
              onClick={prevSlide}
              className="bg-black/30 hover:bg-black/50 text-white p-2 rounded-r-lg"
              aria-label="Slide anterior"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
          </div>
          
          <div className="absolute inset-y-0 right-0 flex items-center">
            <button
              onClick={nextSlide}
              className="bg-black/30 hover:bg-black/50 text-white p-2 rounded-l-lg"
              aria-label="Próximo slide"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
          
          {/* Indicadores */}
          <div className="absolute bottom-4 left-0 right-0">
            <div className="flex justify-center space-x-2">
              {carousel.slides && carousel.slides.map((_, index) => (
                <button
                  key={index}
                  onClick={() => goToSlide(index)}
                  className={`h-2 w-2 rounded-full transition-colors ${
                    currentSlide === index
                      ? 'bg-primary'
                      : 'bg-gray-300 dark:bg-gray-600'
                  }`}
                  aria-label={`Ir para slide ${index + 1}`}
                />
              ))}
            </div>
          </div>
        </div>
        
        {/* Contador de slides */}
        <div className="text-center mb-8">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Slide {currentSlide + 1} de {carousel.slides ? carousel.slides.length : 0}
          </p>
        </div>
        
        <div className="text-center">
          <p className="text-sm text-gray-500 dark:text-gray-500 mb-2">
            Criado com Carousel Cutter
          </p>
          <Link href="/" className="text-primary hover:underline text-sm">
            Crie seu próprio carrossel gratuitamente
          </Link>
        </div>
      </div>
    </div>
  );
} 