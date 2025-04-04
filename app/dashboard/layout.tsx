'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/app/lib/context/AuthContext';
import DashboardHeader from '@/app/components/layout/dashboard-header';
import DashboardSidebar from '@/app/components/layout/dashboard-sidebar';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    console.log("Dashboard: Efeito isClient executado");
    setIsClient(true);
  }, []);

  useEffect(() => {
    console.log("Dashboard: Verificando autenticação", { user: user?.email, loading, isClient });
    
    // Verifica se o usuário está autenticado
    if (isClient && !loading && !user) {
      console.log("Dashboard: Usuário não autenticado, redirecionando para login");
      router.push('/login');
    } else if (isClient && !loading && user) {
      console.log("Dashboard: Usuário autenticado, permitindo acesso");
    }
  }, [user, loading, isClient, router]);

  if (loading || !isClient) {
    console.log("Dashboard: Exibindo loader", { loading, isClient });
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  // Se o usuário não estiver autenticado, não renderize o layout
  if (!user) {
    console.log("Dashboard: Usuário não autenticado, retornando null");
    return null;
  }

  console.log("Dashboard: Renderizando layout completo para", user?.email);
  return (
    <div className="flex h-screen bg-gray-100 dark:bg-gray-900">
      <DashboardSidebar />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <DashboardHeader />
        
        <main className="flex-1 overflow-y-auto p-4 md:p-6">
          <div className="container mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
} 