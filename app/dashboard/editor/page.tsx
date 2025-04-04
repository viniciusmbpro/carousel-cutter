'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/app/lib/context/AuthContext';
import Button from '@/app/components/ui/button';
import { v4 as uuidv4 } from 'uuid';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db } from '@/app/lib/firebase/firebase-config';
import Image from 'next/image';
import ReactCrop, { Crop, PixelCrop, centerCrop, makeAspectCrop } from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';

// Definição de tamanhos comuns para o Instagram
const ASPECT_RATIOS = {
  square: { label: 'Quadrado (1:1)', width: 1080, height: 1080, aspect: 1 },
  portrait: { label: 'Retrato (4:5)', width: 1080, height: 1350, aspect: 4/5 },
  landscape: { label: 'Paisagem (16:9)', width: 1080, height: 608, aspect: 16/9 },
  story: { label: 'Story (9:16)', width: 1080, height: 1920, aspect: 9/16 },
};

interface ImageSlide {
  id: string;
  order: number;
  imageUrl?: string;
  imageFile?: File;
  caption: string;
  croppedArea?: { x: number; y: number; width: number; height: number };
}

// Função para centralizar o crop
function centerAspectCrop(
  mediaWidth: number,
  mediaHeight: number,
  aspect: number,
) {
  return centerCrop(
    makeAspectCrop(
      {
        unit: '%',
        width: 90,
      },
      aspect,
      mediaWidth,
      mediaHeight,
    ),
    mediaWidth,
    mediaHeight,
  )
}

export default function ImageEditorPage() {
  const { user } = useAuth();
  const router = useRouter();
  
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [selectedAspectRatio, setSelectedAspectRatio] = useState<keyof typeof ASPECT_RATIOS>('square');
  const [slides, setSlides] = useState<ImageSlide[]>([]);
  const [currentSlide, setCurrentSlide] = useState<number>(0);
  const [isUploading, setIsUploading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState('');
  const [crop, setCrop] = useState<Crop>();
  const [completedCrop, setCompletedCrop] = useState<PixelCrop>();
  const [imgSrc, setImgSrc] = useState('');
  const [imgElement, setImgElement] = useState<HTMLImageElement | null>(null);
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  // Atualizar crop quando mudar o aspect ratio
  useEffect(() => {
    if (imgElement && selectedAspectRatio) {
      const { naturalWidth, naturalHeight } = imgElement;
      const crop = centerAspectCrop(
        naturalWidth, 
        naturalHeight, 
        ASPECT_RATIOS[selectedAspectRatio].aspect
      );
      setCrop(crop);
    }
  }, [imgElement, selectedAspectRatio]);
  
  // Atualizar imagem quando mudar o slide atual
  useEffect(() => {
    if (slides.length === 0 || currentSlide >= slides.length) return;
    
    const slide = slides[currentSlide];
    if (slide.imageFile) {
      const reader = new FileReader();
      reader.addEventListener('load', () => {
        setImgSrc(reader.result?.toString() || '');
      });
      reader.readAsDataURL(slide.imageFile);
    } else if (slide.imageUrl) {
      setImgSrc(slide.imageUrl);
    }
  }, [currentSlide, slides]);
  
  // Função para adicionar novas imagens
  const handleAddImages = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    
    const newSlides: ImageSlide[] = [];
    
    Array.from(e.target.files).forEach((file, index) => {
      // Verificar se é uma imagem
      if (!file.type.startsWith('image/')) return;
      
      // Criar um novo slide
      newSlides.push({
        id: uuidv4(),
        order: slides.length + index + 1,
        imageFile: file,
        caption: '',
        croppedArea: { x: 0, y: 0, width: 100, height: 100 },
      });
    });
    
    // Adicionar os novos slides à lista existente
    setSlides([...slides, ...newSlides]);
    
    // Selecionar o primeiro novo slide
    if (slides.length === 0 && newSlides.length > 0) {
      setCurrentSlide(0);
    }
    
    // Limpar o input para permitir selecionar os mesmos arquivos novamente
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };
  
  // Função para remover um slide
  const handleRemoveSlide = (id: string) => {
    const newSlides = slides.filter(slide => slide.id !== id);
    
    // Reordenar slides
    newSlides.forEach((slide, index) => {
      slide.order = index + 1;
    });
    
    setSlides(newSlides);
    
    // Ajustar o slide atual se necessário
    if (currentSlide >= newSlides.length && newSlides.length > 0) {
      setCurrentSlide(newSlides.length - 1);
    } else if (newSlides.length === 0) {
      setImgSrc('');
    }
  };
  
  // Função para atualizar a legenda de um slide
  const handleCaptionChange = (id: string, caption: string) => {
    const newSlides = slides.map(slide => 
      slide.id === id ? { ...slide, caption } : slide
    );
    setSlides(newSlides);
  };
  
  // Função para alterar a ordem dos slides (arrastar e soltar)
  const handleReorderSlides = (startIndex: number, endIndex: number) => {
    const result = Array.from(slides);
    const [removed] = result.splice(startIndex, 1);
    result.splice(endIndex, 0, removed);
    
    // Atualizar a ordem
    const newSlides = result.map((slide, index) => ({
      ...slide,
      order: index + 1
    }));
    
    setSlides(newSlides);
    setCurrentSlide(endIndex);
  };
  
  // Função para processar a imagem com o crop atual
  const processImage = async (
    image: HTMLImageElement,
    crop: PixelCrop,
    fileName: string,
  ): Promise<Blob> => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    
    if (!ctx) {
      throw new Error('No 2d context');
    }
    
    // Definir as dimensões do canvas para o tamanho final desejado
    const targetWidth = ASPECT_RATIOS[selectedAspectRatio].width;
    const targetHeight = ASPECT_RATIOS[selectedAspectRatio].height;
    
    canvas.width = targetWidth;
    canvas.height = targetHeight;
    
    // Calcular o fator de escala
    const scaleX = image.naturalWidth / image.width;
    const scaleY = image.naturalHeight / image.height;
    
    // Calcular as dimensões reais do crop
    const cropX = crop.x * scaleX;
    const cropY = crop.y * scaleY;
    const cropWidth = crop.width * scaleX;
    const cropHeight = crop.height * scaleY;
    
    // Desenhar a imagem recortada no canvas
    ctx.drawImage(
      image,
      cropX,
      cropY,
      cropWidth,
      cropHeight,
      0,
      0,
      targetWidth,
      targetHeight
    );
    
    // Converter o canvas para blob
    return new Promise((resolve, reject) => {
      canvas.toBlob(
        (blob) => {
          if (!blob) {
            reject(new Error('Canvas is empty'));
            return;
          }
          resolve(blob);
        },
        'image/jpeg',
        0.95
      );
    });
  };
  
  // Função para fazer o upload das imagens para o Firebase Storage
  const uploadImagesToFirebase = async (): Promise<ImageSlide[]> => {
    if (!user) throw new Error('Usuário não autenticado');
    if (!completedCrop || !imgElement) throw new Error('Nenhuma imagem selecionada');
    
    const storage = getStorage();
    const updatedSlides = [...slides];
    
    for (let i = 0; i < updatedSlides.length; i++) {
      const slide = updatedSlides[i];
      
      if (slide.imageFile) {
        // Processar a imagem apenas se estivermos no slide atual
        if (i === currentSlide) {
          // Processar a imagem com o crop atual
          const processedBlob = await processImage(
            imgElement,
            completedCrop,
            slide.imageFile.name
          );
          
          // Fazer upload da imagem processada
          const storageRef = ref(storage, `carousels/${user.uid}/${uuidv4()}.jpg`);
          await uploadBytes(storageRef, processedBlob);
          const downloadUrl = await getDownloadURL(storageRef);
          
          // Atualizar o slide com a URL da imagem
          updatedSlides[i] = {
            ...slide,
            imageUrl: downloadUrl,
            imageFile: undefined, // Remover o arquivo após o upload
            croppedArea: {
              x: completedCrop.x,
              y: completedCrop.y,
              width: completedCrop.width,
              height: completedCrop.height
            }
          };
        } else {
          // Para os outros slides, fazer upload sem processamento (temporário)
          // Em uma implementação completa, seria necessário processar todos
          const storageRef = ref(storage, `carousels/${user.uid}/${uuidv4()}`);
          await uploadBytes(storageRef, slide.imageFile);
          const downloadUrl = await getDownloadURL(storageRef);
          
          updatedSlides[i] = {
            ...slide,
            imageUrl: downloadUrl,
            imageFile: undefined // Remover o arquivo após o upload
          };
        }
      }
    }
    
    return updatedSlides;
  };
  
  // Função para salvar o carrossel
  const handleSaveCarousel = async () => {
    if (!title.trim() || slides.length === 0) {
      setError('Por favor, adicione um título e pelo menos uma imagem.');
      return;
    }
    
    if (!completedCrop || !imgElement) {
      setError('Por favor, ajuste o corte da imagem antes de salvar.');
      return;
    }
    
    setIsSaving(true);
    setError('');
    
    try {
      // Fazer upload das imagens
      setIsUploading(true);
      const updatedSlides = await uploadImagesToFirebase();
      setIsUploading(false);
      
      // Salvar carrossel no Firestore
      const response = await fetch('/api/carousels', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title,
          description,
          slides: updatedSlides.map(slide => ({
            id: slide.id,
            order: slide.order,
            imageUrl: slide.imageUrl,
            caption: slide.caption,
            croppedArea: slide.croppedArea
          })),
          userId: user?.uid,
          type: 'image-carousel',
          aspectRatio: selectedAspectRatio
        }),
      });
      
      if (!response.ok) {
        const data = await response.json();
        if (response.status === 403) {
          // Limite do plano gratuito atingido
          setError(data.message || 'Limite de carrosséis atingido. Faça upgrade para um plano premium.');
          return;
        }
        throw new Error(data.error || 'Falha ao salvar carrossel');
      }
      
      const data = await response.json();
      console.log('Carrossel salvo com sucesso:', data);
      
      // Redirecionar para a página de detalhes do carrossel
      // usando o ID gerado pelo Firestore
      router.push(`/dashboard/carousels/${data.id}`);
    } catch (error) {
      console.error('Erro ao salvar carrossel:', error);
      setError('Não foi possível salvar o carrossel. Por favor, tente novamente.');
    } finally {
      setIsSaving(false);
    }
  };
  
  // Função para fazer preview do carrossel
  const handlePreviewCarousel = () => {
    // Implementar visualização do carrossel
  };
  
  // Função para ajustar a área de corte
  const onImageLoad = (e: React.SyntheticEvent<HTMLImageElement>) => {
    const { naturalWidth, naturalHeight } = e.currentTarget;
    
    // Inicializar o crop com o aspect ratio correto
    const crop = centerAspectCrop(
      naturalWidth, 
      naturalHeight, 
      ASPECT_RATIOS[selectedAspectRatio].aspect
    );
    
    setCrop(crop);
    setImgElement(e.currentTarget);
  };
  
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <Link href="/dashboard" className="text-primary hover:text-primary-dark flex items-center mb-2">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
              Voltar para o Dashboard
            </Link>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Editor de Carrossel de Imagens</h1>
          </div>
        </div>
        
        {error && (
          <div className="mb-6 p-4 rounded-lg bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300">
            {error}
          </div>
        )}
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Painel de controle */}
          <div className="md:col-span-1 space-y-6">
            <div className="card border border-gray-200 dark:border-gray-700 p-4">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Informações</h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-gray-700 dark:text-gray-300 text-sm font-medium mb-1">
                    Título do carrossel*
                  </label>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Digite um título para seu carrossel"
                    className="input w-full"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-gray-700 dark:text-gray-300 text-sm font-medium mb-1">
                    Descrição (opcional)
                  </label>
                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Digite uma descrição para seu carrossel"
                    className="input w-full h-20 resize-none"
                  />
                </div>
                
                <div>
                  <label className="block text-gray-700 dark:text-gray-300 text-sm font-medium mb-1">
                    Proporção (Aspect Ratio)
                  </label>
                  <select
                    value={selectedAspectRatio}
                    onChange={(e) => setSelectedAspectRatio(e.target.value as keyof typeof ASPECT_RATIOS)}
                    className="input w-full"
                  >
                    {Object.entries(ASPECT_RATIOS).map(([key, { label }]) => (
                      <option key={key} value={key}>
                        {label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
            
            <div className="card border border-gray-200 dark:border-gray-700 p-4">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Imagens</h2>
              
              <div className="space-y-4">
                <div>
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleAddImages}
                    ref={fileInputRef}
                    className="hidden"
                    id="image-upload"
                  />
                  <label
                    htmlFor="image-upload"
                    className="button-primary w-full flex items-center justify-center cursor-pointer py-2 px-4 border border-transparent rounded-md shadow-sm text-white bg-primary hover:bg-primary-dark"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM6.293 6.707a1 1 0 010-1.414l3-3a1 1 0 011.414 0l3 3a1 1 0 01-1.414 1.414L11 5.414V13a1 1 0 11-2 0V5.414L7.707 6.707a1 1 0 01-1.414 0z" clipRule="evenodd" />
                    </svg>
                    Adicionar Imagens
                  </label>
                </div>
                
                <div className="border border-gray-200 dark:border-gray-700 rounded-md p-2 max-h-80 overflow-y-auto">
                  {slides.length === 0 ? (
                    <div className="text-center p-4 text-gray-500 dark:text-gray-400">
                      Nenhuma imagem adicionada. Clique em "Adicionar Imagens" para começar.
                    </div>
                  ) : (
                    <ul className="space-y-2">
                      {slides.map((slide, index) => (
                        <li
                          key={slide.id}
                          className={`flex items-center justify-between p-2 rounded-md cursor-pointer ${
                            index === currentSlide ? 'bg-blue-100 dark:bg-blue-900/30' : 'hover:bg-gray-100 dark:hover:bg-gray-800/50'
                          }`}
                          onClick={() => setCurrentSlide(index)}
                        >
                          <div className="flex items-center">
                            <div className="flex-shrink-0 w-10 h-10 bg-gray-200 dark:bg-gray-700 rounded-md overflow-hidden mr-3">
                              {(slide.imageUrl || slide.imageFile) && (
                                <div className="relative w-10 h-10">
                                  <Image
                                    src={slide.imageUrl || URL.createObjectURL(slide.imageFile!)}
                                    alt={`Slide ${slide.order}`}
                                    fill
                                    className="object-cover"
                                  />
                                </div>
                              )}
                            </div>
                            <span>Slide {slide.order}</span>
                          </div>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleRemoveSlide(slide.id);
                            }}
                            className="text-red-500 hover:text-red-700"
                            aria-label="Remover slide"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                              <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                            </svg>
                          </button>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>
            </div>
            
            <div className="card border border-gray-200 dark:border-gray-700 p-4">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Ações</h2>
              
              <div className="space-y-3">
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={handlePreviewCarousel}
                  disabled={slides.length === 0}
                >
                  Pré-visualizar
                </Button>
                
                <Button
                  variant="primary"
                  className="w-full"
                  onClick={handleSaveCarousel}
                  isLoading={isSaving || isUploading}
                  disabled={slides.length === 0 || !title || isSaving || isUploading || !completedCrop}
                >
                  {isUploading ? 'Fazendo upload...' : isSaving ? 'Salvando...' : 'Salvar Carrossel'}
                </Button>
              </div>
            </div>
          </div>
          
          {/* Área de edição */}
          <div className="md:col-span-2">
            <div className="card border border-gray-200 dark:border-gray-700 p-4">
              {slides.length === 0 ? (
                <div className="flex flex-col items-center justify-center p-8 text-center">
                  <div className="w-24 h-24 mb-4 text-gray-400">
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-full h-full" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">Nenhuma imagem selecionada</h3>
                  <p className="text-gray-500 dark:text-gray-400 mb-4">
                    Adicione imagens para começar a criar seu carrossel para o Instagram.
                  </p>
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleAddImages}
                    className="hidden"
                    id="image-upload-main"
                  />
                  <label
                    htmlFor="image-upload-main"
                    className="button-primary cursor-pointer py-2 px-4 border border-transparent rounded-md shadow-sm text-white bg-primary hover:bg-primary-dark"
                  >
                    Adicionar Imagens
                  </label>
                </div>
              ) : (
                <div>
                  <div className="mb-4">
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                      Editando Slide {currentSlide + 1} de {slides.length}
                    </h3>
                    
                    {/* Instruções de uso */}
                    <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-md mb-4 text-sm text-blue-800 dark:text-blue-300">
                      <p>
                        <span className="font-medium">Dica:</span> Arraste para ajustar o recorte da imagem. A proporção {ASPECT_RATIOS[selectedAspectRatio].aspect} será mantida.
                      </p>
                    </div>
                    
                    {/* Área de edição da imagem com ReactCrop */}
                    <div 
                      className="relative w-full overflow-hidden bg-gray-200 dark:bg-gray-800 rounded-lg"
                      style={{
                        width: '100%',
                        background: 'repeating-conic-gradient(#888 0% 25%, #aaa 0% 50%) 50% / 20px 20px',
                      }}
                    >
                      {imgSrc && (
                        <ReactCrop
                          crop={crop}
                          onChange={(c) => setCrop(c)}
                          onComplete={(c) => setCompletedCrop(c)}
                          aspect={ASPECT_RATIOS[selectedAspectRatio].aspect}
                          className="max-h-96 mx-auto"
                        >
                          <img
                            alt="Crop me"
                            src={imgSrc}
                            onLoad={onImageLoad}
                            style={{ maxHeight: '400px', maxWidth: '100%' }}
                          />
                        </ReactCrop>
                      )}
                    </div>
                  </div>
                  
                  {/* Controles de edição */}
                  <div className="space-y-4">
                    <div>
                      <label className="block text-gray-700 dark:text-gray-300 text-sm font-medium mb-1">
                        Legenda (opcional)
                      </label>
                      <textarea
                        value={slides[currentSlide]?.caption || ''}
                        onChange={(e) => handleCaptionChange(slides[currentSlide].id, e.target.value)}
                        placeholder="Adicione uma legenda para esta imagem..."
                        className="input w-full h-20 resize-none"
                      />
                    </div>
                    
                    <div className="flex justify-between">
                      <Button
                        variant="outline"
                        onClick={() => setCurrentSlide(Math.max(0, currentSlide - 1))}
                        disabled={currentSlide === 0}
                      >
                        Anterior
                      </Button>
                      
                      <Button
                        variant="outline"
                        onClick={() => setCurrentSlide(Math.min(slides.length - 1, currentSlide + 1))}
                        disabled={currentSlide === slides.length - 1}
                      >
                        Próximo
                      </Button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 