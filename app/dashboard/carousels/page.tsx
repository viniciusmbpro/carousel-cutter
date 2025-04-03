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
        
        <Link href="/dashboard/create">
          <Button variant="primary">Criar novo carrossel</Button>
        </Link>
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
          <Link href="/dashboard/create">
            <Button variant="primary">Criar primeiro carrossel</Button>
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {carousels.map((carousel) => (
            <div
              key={carousel.id}
              className="card border border-gray-200 dark:border-gray-700 hover:border-primary/60 transition-colors"
            >
              <h3 className="font-medium text-gray-900 dark:text-white mb-2">{carousel.title}</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 line-clamp-2">
                {carousel.description || 'Sem descrição'}
              </p>
              
              <div className="flex justify-between items-center">
                <div className="text-xs text-gray-500 dark:text-gray-400">
                  Criado em {new Date(carousel.createdAt).toLocaleDateString('pt-BR')}
                </div>
                
                <div className="flex space-x-2">
                  <Link href={`/dashboard/carousels/${carousel.id}`}>
                    <Button variant="outline" size="sm">
                      Editar
                    </Button>
                  </Link>
                  
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDelete(carousel.id)}
                  >
                    Excluir
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
} 