'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '@/app/lib/context/AuthContext';
import Button from '@/app/components/ui/button';
import { Carousel } from '@/app/lib/types/carousel';

export default function DashboardPage() {
  const { user } = useAuth();
  const [carousels, setCarousels] = useState<Carousel[]>([]);
  const [loading, setLoading] = useState(true);
  
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
        setCarousels(data);
      } catch (error) {
        console.error('Erro ao carregar carrosséis:', error);
      } finally {
        setLoading(false);
      }
    }
    
    fetchCarousels();
  }, [user]);
  
  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }
  
  return (
    <div>
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Olá, {user?.displayName || 'Usuário'}
          </h1>
          <p className="mt-1 text-gray-600 dark:text-gray-400">
            Bem-vindo ao seu dashboard do Carousel Cutter
          </p>
        </div>
        
        <div className="mt-4 md:mt-0 space-x-3">
          <Link href="/dashboard/editor">
            <Button variant="outline">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              Editor de Imagens
            </Button>
          </Link>
          
          <Link href="/dashboard/create">
            <Button variant="primary">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              Criar com IA
            </Button>
          </Link>
        </div>
      </div>
      
      {/* Nova funcionalidade */}
      <div className="mb-8 bg-gradient-to-r from-green-50 to-blue-50 dark:from-green-900/20 dark:to-blue-900/20 border border-green-200 dark:border-green-800 rounded-lg p-5">
        <div className="flex flex-col md:flex-row md:items-center">
          <div className="flex-shrink-0 mb-4 md:mb-0 md:mr-4">
            <div className="p-2 bg-green-100 dark:bg-green-800 rounded-full">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-green-600 dark:text-green-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">NOVA Funcionalidade: Editor de Imagens para Instagram</h3>
            <p className="mt-2 text-gray-700 dark:text-gray-300">
              Agora você pode fazer upload de suas próprias imagens, cortá-las nos tamanhos perfeitos para Instagram e criar carrosséis profissionais. 
              Escolha entre diversos formatos como quadrado (1:1), retrato (4:5), paisagem (16:9) e stories (9:16).
            </p>
            <div className="mt-4">
              <Link href="/dashboard/editor">
                <Button variant="primary" className="w-full md:w-auto bg-green-600 hover:bg-green-700">
                  Experimentar Agora
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
      
      {/* Plano gratuito */}
      <div className="mb-8 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
        <div className="flex items-start">
          <div className="flex-shrink-0 bg-blue-100 dark:bg-blue-800 rounded-full p-2">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-600 dark:text-blue-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div className="ml-3">
            <h3 className="text-sm font-medium text-blue-800 dark:text-blue-300">Você está no Plano Grátis</h3>
            <div className="mt-2 text-sm text-blue-700 dark:text-blue-400">
              <p>Você pode criar até 3 carrosséis com o plano gratuito. Aproveite para testar a plataforma!</p>
              <div className="mt-3">
                <Link href="/pricing" className="text-blue-600 dark:text-blue-300 hover:underline font-medium">
                  Ver planos premium →
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
        <div className="card border border-gray-200 dark:border-gray-700">
          <div className="flex items-center">
            <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center text-primary">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
              </svg>
            </div>
            <div className="ml-4">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">{carousels.length}</h2>
              <p className="text-gray-600 dark:text-gray-400">Carrosséis criados</p>
            </div>
          </div>
        </div>
        
        <div className="card border border-gray-200 dark:border-gray-700">
          <div className="flex items-center">
            <div className="h-12 w-12 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center text-green-600 dark:text-green-400">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
            </div>
            <div className="ml-4">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                {carousels.filter(c => c.isPublished).length}
              </h2>
              <p className="text-gray-600 dark:text-gray-400">Carrosséis publicados</p>
            </div>
          </div>
        </div>
        
        <div className="card border border-gray-200 dark:border-gray-700">
          <div className="flex items-center">
            <div className="h-12 w-12 rounded-full bg-yellow-100 dark:bg-yellow-900/30 flex items-center justify-center text-yellow-600 dark:text-yellow-400">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div className="ml-4">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                {carousels.length >= 3 ? 0 : 3 - carousels.length}
              </h2>
              <p className="text-gray-600 dark:text-gray-400">Carrosséis restantes (plano grátis)</p>
            </div>
          </div>
        </div>
      </div>
      
      <div className="mt-8">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Carrosséis recentes</h2>
        
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
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {carousels.slice(0, 3).map((carousel) => (
              <div
                key={carousel.id}
                className="card border border-gray-200 dark:border-gray-700 hover:border-primary/60 transition-colors"
              >
                <h3 className="font-medium text-gray-900 dark:text-white mb-2">{carousel.title}</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 line-clamp-2">
                  {carousel.description || 'Sem descrição'}
                </p>
                <div className="text-xs mb-3 inline-block px-2 py-1 rounded bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300">
                  {carousel.type === 'image-carousel' ? 'Carrossel de Imagens' : 'Carrossel de IA'}
                </div>
                
                <div className="flex justify-between items-center">
                  <div className="text-xs text-gray-500 dark:text-gray-400">
                    Criado em {new Date(carousel.createdAt).toLocaleDateString('pt-BR')}
                  </div>
                  
                  <Link href={`/dashboard/carousels/${carousel.id}`}>
                    <Button variant="outline" size="sm">
                      Editar
                    </Button>
                  </Link>
                </div>
              </div>
            ))}
            
            {carousels.length > 3 && (
              <div className="col-span-full mt-4 text-center">
                <Link href="/dashboard/carousels">
                  <Button variant="outline">Ver todos os carrosséis</Button>
                </Link>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
} 