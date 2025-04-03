'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '@/app/lib/context/AuthContext';
import { db } from '@/app/lib/firebase/firebase-config';
import { collection, getDocs, query, where, orderBy, limit } from 'firebase/firestore';

export default function Dashboard() {
  const { user } = useAuth();
  const [carousels, setCarousels] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalCarousels: 0,
    monthlyCarousels: 0,
    maxCarousels: 15, // Valor padrão para plano mensal
  });

  useEffect(() => {
    async function fetchData() {
      if (!user) return;

      try {
        // Buscar dados do usuário
        // Aqui você buscaria o perfil completo do usuário para obter informações sobre a assinatura
        
        // Buscar carrosséis recentes
        const carouselsRef = collection(db, 'carousels');
        const q = query(
          carouselsRef,
          where('userId', '==', user.uid),
          orderBy('createdAt', 'desc'),
          limit(3)
        );
        
        const querySnapshot = await getDocs(q);
        const carouselsList: any[] = [];
        
        querySnapshot.forEach((doc) => {
          carouselsList.push({ id: doc.id, ...doc.data() });
        });
        
        setCarousels(carouselsList);
        setStats({
          totalCarousels: carouselsList.length, // Este valor deve ser substituído pela contagem real
          monthlyCarousels: carouselsList.length, // Este valor deve ser substituído pelo uso mensal
          maxCarousels: 15, // Este valor deve vir do tipo de assinatura
        });
      } catch (error) {
        console.error('Erro ao carregar dados:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
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
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Bem-vindo ao seu Dashboard, {user?.displayName}</h1>
        <p className="mt-1 text-gray-600 dark:text-gray-400">
          Aqui você pode gerenciar seus carrosséis e sua assinatura
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="card border border-gray-200 dark:border-gray-700">
          <div className="flex flex-col">
            <div className="text-gray-500 dark:text-gray-400 text-sm font-medium">Total de Carrosséis</div>
            <div className="text-3xl font-bold text-gray-900 dark:text-white mt-2">{stats.totalCarousels}</div>
            <div className="mt-2 text-sm text-gray-600 dark:text-gray-400">
              Carrosséis criados desde que você se cadastrou
            </div>
          </div>
        </div>

        <div className="card border border-gray-200 dark:border-gray-700">
          <div className="flex flex-col">
            <div className="text-gray-500 dark:text-gray-400 text-sm font-medium">Carrosséis este mês</div>
            <div className="text-3xl font-bold text-gray-900 dark:text-white mt-2">{stats.monthlyCarousels}</div>
            <div className="mt-2 text-sm text-gray-600 dark:text-gray-400">
              De {stats.maxCarousels} disponíveis no seu plano
            </div>
          </div>
        </div>

        <div className="card border border-gray-200 dark:border-gray-700">
          <div className="flex flex-col">
            <div className="text-gray-500 dark:text-gray-400 text-sm font-medium">Plano atual</div>
            <div className="text-3xl font-bold text-gray-900 dark:text-white mt-2">Mensal</div>
            <div className="mt-2 text-sm text-gray-600 dark:text-gray-400">
              <Link href="/dashboard/subscription" className="text-primary hover:text-primary-dark">
                Gerenciar assinatura
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="mb-8">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Ações rápidas</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Link href="/dashboard/create" className="card border border-gray-200 dark:border-gray-700 hover:border-primary/60 transition-colors">
            <div className="flex items-center">
              <div className="h-10 w-10 bg-primary/10 rounded-lg flex items-center justify-center text-primary mr-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
              </div>
              <div>
                <h3 className="font-medium text-gray-900 dark:text-white">Criar novo carrossel</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">Gere conteúdo com nossa IA</p>
              </div>
            </div>
          </Link>

          <Link href="/dashboard/carousels" className="card border border-gray-200 dark:border-gray-700 hover:border-primary/60 transition-colors">
            <div className="flex items-center">
              <div className="h-10 w-10 bg-primary/10 rounded-lg flex items-center justify-center text-primary mr-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                </svg>
              </div>
              <div>
                <h3 className="font-medium text-gray-900 dark:text-white">Ver meus carrosséis</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">Acesse todos os seus carrosséis</p>
              </div>
            </div>
          </Link>
        </div>
      </div>

      {/* Recent Carousels */}
      <div>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">Carrosséis recentes</h2>
          <Link href="/dashboard/carousels" className="text-sm text-primary hover:text-primary-dark">
            Ver todos
          </Link>
        </div>

        {carousels.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {carousels.map((carousel) => (
              <Link 
                key={carousel.id} 
                href={`/dashboard/carousels/${carousel.id}`}
                className="card border border-gray-200 dark:border-gray-700 hover:border-primary/60 transition-colors"
              >
                <h3 className="font-medium text-gray-900 dark:text-white mb-2">{carousel.title}</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 line-clamp-2">
                  {carousel.description || 'Sem descrição'}
                </p>
                <div className="text-xs text-gray-500 dark:text-gray-400">
                  Criado em {new Date(carousel.createdAt).toLocaleDateString('pt-BR')}
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="card border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-slate-800/50 text-center py-12">
            <h3 className="font-medium text-gray-900 dark:text-white mb-2">Você ainda não criou nenhum carrossel</h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Comece agora a criar carrosséis incríveis para suas redes sociais
            </p>
            <Link href="/dashboard/create" className="btn-primary inline-flex">
              Criar primeiro carrossel
            </Link>
          </div>
        )}
      </div>
    </div>
  );
} 