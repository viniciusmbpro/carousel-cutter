'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/app/lib/context/AuthContext';
import Input from '@/app/components/ui/input';
import Button from '@/app/components/ui/button';
import { Carousel, Slide } from '@/app/lib/types/carousel';
import { v4 as uuidv4 } from 'uuid';

interface PageProps {
  params: {
    id: string;
  };
}

export default function CarouselEditPage({ params }: PageProps) {
  const { id } = params;
  const router = useRouter();
  const { user } = useAuth();
  
  const [carousel, setCarousel] = useState<Carousel | null>(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [slides, setSlides] = useState<Slide[]>([]);
  const [isPublished, setIsPublished] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isDownloading, setIsDownloading] = useState(false);
  
  useEffect(() => {
    async function fetchCarousel() {
      if (!user || !id) return;
      
      try {
        setLoading(true);
        console.log('Buscando carrossel com ID:', id);
        const response = await fetch(`/api/carousels/${id}`);
        
        if (!response.ok) {
          console.error('Resposta não-OK ao buscar carrossel:', response.status, response.statusText);
          throw new Error('Falha ao carregar carrossel');
        }
        
        const data = await response.json();
        console.log('Carrossel carregado:', data);
        
        setCarousel(data);
        setTitle(data.title);
        setDescription(data.description || '');
        setSlides(data.slides || []);
        setIsPublished(data.isPublished || false);
      } catch (error) {
        console.error('Erro ao carregar carrossel:', error);
        setError('Não foi possível carregar o carrossel. Por favor, tente novamente.');
      } finally {
        setLoading(false);
      }
    }
    
    fetchCarousel();
  }, [id, user]);
  
  const handleSave = async () => {
    if (!id || !title.trim() || slides.length === 0) {
      setError('Por favor, preencha o título e adicione pelo menos um slide.');
      return;
    }
    
    setSaving(true);
    setError('');
    setSuccess('');
    
    try {
      const response = await fetch(`/api/carousels/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title,
          description,
          slides,
          isPublished,
        }),
      });
      
      if (!response.ok) {
        throw new Error('Falha ao salvar carrossel');
      }
      
      setSuccess('Carrossel salvo com sucesso!');
      
      // Limpar a mensagem de sucesso após 3 segundos
      setTimeout(() => setSuccess(''), 3000);
    } catch (error) {
      console.error('Erro ao salvar carrossel:', error);
      setError('Não foi possível salvar o carrossel. Por favor, tente novamente.');
    } finally {
      setSaving(false);
    }
  };
  
  const handleSlideChange = (id: string, newText: string) => {
    setSlides(prevSlides =>
      prevSlides.map(slide =>
        slide.id === id ? { ...slide, text: newText } : slide
      )
    );
  };
  
  const handleAddSlide = () => {
    const newSlide: Slide = {
      id: uuidv4(),
      text: '',
      order: slides.length + 1,
    };
    
    setSlides([...slides, newSlide]);
  };
  
  const handleRemoveSlide = (id: string) => {
    // Remover o slide
    const updatedSlides = slides.filter(slide => slide.id !== id);
    
    // Reordenar os slides restantes
    const reorderedSlides = updatedSlides.map((slide, index) => ({
      ...slide,
      order: index + 1,
    }));
    
    setSlides(reorderedSlides);
  };
  
  // Função para baixar o carrossel
  const handleDownloadCarousel = async () => {
    if (!id) return;
    
    setIsDownloading(true);
    
    try {
      // Verificar se o carrossel é do tipo image-carousel
      const isImageCarousel = carousel?.type === 'image-carousel';
      
      if (isImageCarousel) {
        // Para carrosséis de imagem, use nossa API específica
        window.location.href = `/api/carousels/${id}/download`;
      } else {
        // Para carrosséis de texto, podemos gerar um PDF ou outro formato
        // Por enquanto, apenas disponibilizamos para carrosséis de imagem
        setError('Download disponível apenas para carrosséis de imagem.');
      }
    } catch (error) {
      console.error('Erro ao baixar carrossel:', error);
      setError('Não foi possível baixar o carrossel. Por favor, tente novamente.');
    } finally {
      setIsDownloading(false);
    }
  };
  
  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }
  
  if (!carousel) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Carrossel não encontrado</h2>
        <p className="text-gray-600 dark:text-gray-400 mb-6">
          O carrossel que você está procurando não foi encontrado ou você não tem permissão para acessá-lo.
        </p>
        <Link href="/dashboard/carousels">
          <Button variant="primary">Voltar para meus carrosséis</Button>
        </Link>
      </div>
    );
  }
  
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
          <div className="flex items-center">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Editar Carrossel</h1>
            {carousel.type && (
              <span className={`ml-3 text-xs font-medium px-2.5 py-1 rounded ${
                carousel.type === 'image-carousel' 
                  ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' 
                  : 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-400'
              }`}>
                {carousel.type === 'image-carousel' ? 'Carrossel de Imagens' : 'Carrossel de IA'}
              </span>
            )}
          </div>
        </div>
        
        <div className="flex items-center space-x-4">
          {carousel.type === 'image-carousel' && (
            <Button
              variant="primary"
              onClick={handleDownloadCarousel}
              isLoading={isDownloading}
              className="flex items-center bg-green-600 hover:bg-green-700"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
              Baixar para Instagram
            </Button>
          )}
          
          {isPublished && (
            <Link 
              href={`/carousels/${id}`} 
              target="_blank"
              className="text-primary hover:text-primary-dark flex items-center"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
              </svg>
              Visualizar
            </Link>
          )}
          
          <Button
            variant="primary"
            onClick={handleSave}
            isLoading={saving}
          >
            Salvar alterações
          </Button>
        </div>
      </div>
      
      {error && (
        <div className="mb-6 p-4 rounded-lg bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300">
          {error}
        </div>
      )}
      
      {success && (
        <div className="mb-6 p-4 rounded-lg bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300">
          {success}
        </div>
      )}
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="md:col-span-2">
          <div className="card border border-gray-200 dark:border-gray-700 mb-6">
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
              
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="isPublished"
                  checked={isPublished}
                  onChange={(e) => setIsPublished(e.target.checked)}
                  className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
                />
                <label htmlFor="isPublished" className="ml-2 block text-gray-700 dark:text-gray-300">
                  Publicar carrossel (disponível publicamente)
                </label>
              </div>

              {carousel.type === 'image-carousel' && (
                <div className="p-4 rounded-lg bg-green-50 dark:bg-green-900/20 text-green-800 dark:text-green-300">
                  <div className="flex items-start">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 mt-0.5 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <div>
                      <p className="font-medium mb-1">Carrossel de imagens otimizado para Instagram</p>
                      <p className="text-sm">
                        Você pode baixar todas as imagens no formato correto clicando no botão "Baixar para Instagram".
                      </p>
                      {carousel.aspectRatio && (
                        <p className="text-sm mt-2">
                          <span className="font-medium">Formato:</span> {
                            carousel.aspectRatio === 'square' ? 'Quadrado (1:1)' :
                            carousel.aspectRatio === 'portrait' ? 'Retrato (4:5)' :
                            carousel.aspectRatio === 'landscape' ? 'Paisagem (16:9)' :
                            carousel.aspectRatio === 'story' ? 'Story (9:16)' :
                            carousel.aspectRatio
                          }
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              )}
              
              {isPublished && (
                <div className="p-4 rounded-lg bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300">
                  <p className="flex items-start">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 mt-0.5 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                    </svg>
                    <span>
                      Seu carrossel está publicado e pode ser acessado por qualquer pessoa com o link:
                      <br />
                      <a 
                        href={`${window.location.origin}/carousels/${id}`}
                        target="_blank"
                        className="text-blue-600 dark:text-blue-400 hover:underline break-all"
                      >
                        {`${window.location.origin}/carousels/${id}`}
                      </a>
                    </span>
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
        
        <div className="md:col-span-1">
          <div className="card border border-gray-200 dark:border-gray-700 mb-6">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Detalhes</h2>
            
            <div className="space-y-3 text-sm">
              <div className="flex justify-between py-2 border-b border-gray-100 dark:border-gray-800">
                <span className="text-gray-600 dark:text-gray-400">Tipo</span>
                <span className="font-medium text-gray-900 dark:text-white">{carousel.type === 'image-carousel' ? 'Carrossel de Imagens' : 'Carrossel de IA'}</span>
              </div>
              
              <div className="flex justify-between py-2 border-b border-gray-100 dark:border-gray-800">
                <span className="text-gray-600 dark:text-gray-400">Data de criação</span>
                <span className="font-medium text-gray-900 dark:text-white">{new Date(carousel.createdAt).toLocaleDateString('pt-BR')}</span>
              </div>
              
              <div className="flex justify-between py-2 border-b border-gray-100 dark:border-gray-800">
                <span className="text-gray-600 dark:text-gray-400">Última atualização</span>
                <span className="font-medium text-gray-900 dark:text-white">{new Date(carousel.updatedAt).toLocaleDateString('pt-BR')}</span>
              </div>
              
              <div className="flex justify-between py-2 border-b border-gray-100 dark:border-gray-800">
                <span className="text-gray-600 dark:text-gray-400">Número de slides</span>
                <span className="font-medium text-gray-900 dark:text-white">{slides.length}</span>
              </div>
              
              <div className="flex justify-between py-2">
                <span className="text-gray-600 dark:text-gray-400">Status</span>
                <span className={`font-medium ${isPublished ? 'text-green-600 dark:text-green-400' : 'text-yellow-600 dark:text-yellow-400'}`}>
                  {isPublished ? 'Publicado' : 'Rascunho'}
                </span>
              </div>
            </div>
          </div>
          
          {carousel.type === 'image-carousel' && slides.length > 0 && slides[0].imageUrl && (
            <div className="card border border-gray-200 dark:border-gray-700 mb-6">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Prévia</h2>
              
              <div className="aspect-square bg-gray-100 dark:bg-gray-800 rounded-lg overflow-hidden mb-3">
                <img
                  src={slides[0].imageUrl}
                  alt={title}
                  className="w-full h-full object-cover"
                />
              </div>
              
              <p className="text-center text-xs text-gray-500 dark:text-gray-400">
                Visualização do primeiro slide
              </p>
            </div>
          )}
        </div>
      </div>
      
      <div className="mb-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">Slides do carrossel</h2>
          <Button
            variant="outline"
            onClick={handleAddSlide}
            className="flex items-center justify-center"
            size="sm"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
            </svg>
            Adicionar slide
          </Button>
        </div>
        
        {slides.length === 0 ? (
          <div className="card border border-dashed border-gray-300 dark:border-gray-700 p-8 text-center">
            <div className="mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">Nenhum slide adicionado</h3>
            <p className="text-gray-500 dark:text-gray-400 mb-4">
              Adicione slides para começar a criar seu carrossel
            </p>
            <Button
              variant="primary"
              onClick={handleAddSlide}
            >
              Adicionar primeiro slide
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {slides.map((slide) => (
              <div key={slide.id} className="card border border-gray-200 dark:border-gray-700 hover:border-primary/50 transition-all">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center">
                    <div className="h-6 w-6 rounded-full bg-primary text-white flex items-center justify-center text-sm font-medium mr-2">
                      {slide.order}
                    </div>
                    <h3 className="font-medium text-gray-900 dark:text-white">Slide {slide.order}</h3>
                  </div>
                  
                  <div className="flex items-center">
                    <button
                      onClick={() => handleRemoveSlide(slide.id)}
                      className="text-red-500 hover:text-red-700 p-1"
                      aria-label="Remover slide"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                      </svg>
                    </button>
                  </div>
                </div>
                
                {carousel.type === 'image-carousel' && slide.imageUrl && (
                  <div className="mb-3 relative aspect-[4/3] bg-gray-100 dark:bg-gray-800 rounded overflow-hidden">
                    <img
                      src={slide.imageUrl}
                      alt={`Slide ${slide.order}`}
                      className="w-full h-full object-contain"
                    />
                  </div>
                )}
                
                <textarea
                  value={slide.text || ''}
                  onChange={(e) => handleSlideChange(slide.id, e.target.value)}
                  className="input w-full resize-none"
                  style={{ height: carousel.type === 'image-carousel' ? '80px' : '120px' }}
                  placeholder={`${carousel.type === 'image-carousel' ? 'Legenda' : 'Conteúdo'} do slide ${slide.order}...`}
                />
              </div>
            ))}
          </div>
        )}
      </div>
      
      {slides.length > 0 && (
        <div className="flex justify-end mb-8">
          <Button
            variant="primary"
            onClick={handleSave}
            isLoading={saving}
          >
            Salvar alterações
          </Button>
        </div>
      )}
    </div>
  );
} 