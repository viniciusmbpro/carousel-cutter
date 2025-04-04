'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '@/app/lib/context/AuthContext';
import Button from '@/app/components/ui/button';
import { Carousel } from '@/app/lib/types/carousel';

export default function CarouselsPage() {
  const { user } = useAuth();
  const [carousels, setCarousels] = useState<Carousel[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  useEffect(() => {
    async function fetchCarousels() {
      if (!user) return;
      
      try {
        setLoading(true);
        const response = await fetch(`/api/carousels?userId=${user.uid}`);
        
        if (!response.ok) {
          throw new Error('Falha ao carregar carrosséis');
        }
        
        const data = await response.json();
        console.log('Carrosséis carregados:', data);
        setCarousels(data);
      } catch (error) {
        console.error('Erro ao carregar carrosséis:', error);
        setError('Não foi possível carregar seus carrosséis. Por favor, tente novamente.');
      } finally {
        setLoading(false);
      }
    }
    
    fetchCarousels();
  }, [user]);
  
  const handleDelete = async (id: string) => {
    if (!confirm('Tem certeza que deseja excluir este carrossel?')) {
      return;
    }
    
    try {
      const response = await fetch(`/api/carousels/${id}`, {
        method: 'DELETE',
      });
      
      if (!response.ok) {
        throw new Error('Falha ao excluir carrossel');
      }
      
      // Atualizar a lista de carrosséis removendo o que foi excluído
      setCarousels(carousels.filter(carousel => carousel.id !== id));
    } catch (error) {
      console.error('Erro ao excluir carrossel:', error);
      setError('Não foi possível excluir o carrossel. Por favor, tente novamente.');
    }
  };
  
  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }
  
  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Meus Carrosséis</h1>
          <p className="mt-1 text-gray-600 dark:text-gray-400">
            Gerencie todos os seus carrosséis criados
          </p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-3">
          <Link href="/dashboard/editor" className="order-2 sm:order-1">
            <Button variant="outline" className="w-full sm:w-auto">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              Criar com Imagens
            </Button>
          </Link>
          
          <Link href="/dashboard/create" className="order-1 sm:order-2">
            <Button variant="primary" className="w-full sm:w-auto">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              Criar com IA
            </Button>
          </Link>
        </div>
      </div>
      
      {/* Filtros e estatísticas */}
      <div className="mb-6 flex flex-col sm:flex-row justify-between items-center bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
        <div className="flex items-center space-x-8 mb-4 sm:mb-0">
          <div className="text-center sm:text-left">
            <div className="text-2xl font-bold text-gray-900 dark:text-white">{carousels.length}</div>
            <div className="text-xs text-gray-500 dark:text-gray-400">Total</div>
          </div>
          
          <div className="text-center sm:text-left">
            <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
              {carousels.filter(c => c.isPublished).length}
            </div>
            <div className="text-xs text-gray-500 dark:text-gray-400">Publicados</div>
          </div>
          
          <div className="text-center sm:text-left">
            <div className="text-2xl font-bold text-green-600 dark:text-green-400">
              {carousels.filter(c => c.type === 'image-carousel').length}
            </div>
            <div className="text-xs text-gray-500 dark:text-gray-400">Imagens</div>
          </div>
          
          <div className="text-center sm:text-left">
            <div className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">
              {carousels.filter(c => c.type !== 'image-carousel').length}
            </div>
            <div className="text-xs text-gray-500 dark:text-gray-400">IA</div>
          </div>
        </div>
        
        {/* Adicionar filtros futuros aqui */}
      </div>
      
      {error && (
        <div className="mb-6 p-4 rounded-lg bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300">
          {error}
        </div>
      )}
      
      {carousels.length === 0 ? (
        <div className="card border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-slate-800/50 text-center py-12">
          <h3 className="font-medium text-gray-900 dark:text-white mb-2">Você ainda não criou nenhum carrossel</h3>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            Comece agora a criar carrosséis incríveis para suas redes sociais
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link href="/dashboard/editor">
              <Button variant="outline">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                Criar com Imagens
              </Button>
            </Link>
            <Link href="/dashboard/create">
              <Button variant="primary">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
                Criar com IA
              </Button>
            </Link>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {carousels.map((carousel) => (
            <div
              key={carousel.id}
              className="card border border-gray-200 dark:border-gray-700 hover:border-primary/60 transition-colors overflow-hidden"
            >
              {/* Preview Image */}
              {carousel.type === 'image-carousel' && carousel.slides && carousel.slides.length > 0 && carousel.slides[0].imageUrl ? (
                <div className="aspect-[4/3] relative bg-gray-100 dark:bg-gray-800 mb-4 overflow-hidden group">
                  <img 
                    src={carousel.slides[0].imageUrl} 
                    alt={carousel.title}
                    className="w-full h-full object-cover transition-transform group-hover:scale-105"
                  />
                  <div className="absolute top-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded-full">
                    {carousel.slides.length} {carousel.slides.length === 1 ? 'slide' : 'slides'}
                  </div>
                  {carousel.aspectRatio && (
                    <div className="absolute bottom-2 left-2 bg-black/70 text-white text-xs px-2 py-1 rounded-full">
                      {carousel.aspectRatio === 'square' ? '1:1' :
                       carousel.aspectRatio === 'portrait' ? '4:5' :
                       carousel.aspectRatio === 'landscape' ? '16:9' :
                       carousel.aspectRatio === 'story' ? '9:16' : 
                       carousel.aspectRatio}
                    </div>
                  )}
                </div>
              ) : (
                <div className="aspect-[4/3] bg-gray-100 dark:bg-gray-800 mb-4 flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                  </svg>
                </div>
              )}
              
              <div className="p-4">
                {/* Type Badge */}
                <div className="flex justify-between items-start mb-2">
                  <span className={`text-xs font-medium px-2.5 py-0.5 rounded ${
                    carousel.type === 'image-carousel' 
                      ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' 
                      : 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-400'
                  }`}>
                    {carousel.type === 'image-carousel' ? 'Imagens' : 'IA'}
                  </span>
                  
                  <span className={`text-xs font-medium px-2.5 py-0.5 rounded ${
                    carousel.isPublished
                      ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400'
                      : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400'
                  }`}>
                    {carousel.isPublished ? 'Publicado' : 'Rascunho'}
                  </span>
                </div>
                
                <h3 className="font-medium text-gray-900 dark:text-white text-lg mb-1 line-clamp-1">
                  {carousel.title}
                </h3>
                
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 line-clamp-2">
                  {carousel.description || 'Sem descrição'}
                </p>
                
                <div className="flex justify-between items-center pt-2 border-t border-gray-100 dark:border-gray-800">
                  <div className="text-xs text-gray-500 dark:text-gray-400">
                    {new Date(carousel.createdAt).toLocaleDateString('pt-BR')}
                  </div>
                  
                  <div className="flex space-x-2">
                    <Link href={`/dashboard/carousels/${carousel.id}`}>
                      <Button variant="outline" size="sm">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                          <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                        </svg>
                        Editar
                      </Button>
                    </Link>
                    
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDelete(carousel.id)}
                      className="text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                      </svg>
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
} 