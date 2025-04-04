'use client';

import './globals.css';
import { AuthProvider } from './lib/context/AuthContext';
import { useEffect } from 'react';
import { Inter } from 'next/font/google';

const inter = Inter({ subsets: ['latin'] });

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  useEffect(() => {
    console.log("Root Layout montado");
    
    // Se o usuário estiver na página de login e já tiver um usuário no localStorage,
    // tentar redirecioná-lo para o dashboard
    const savedUser = localStorage.getItem('authUser');
    if (savedUser && window.location.pathname === '/login') {
      console.log("Usuário já logado no localStorage, redirecionando para o dashboard");
      setTimeout(() => {
        window.location.href = '/dashboard';
      }, 500);
    }
  }, []);

  return (
    <html lang="pt-BR">
      <body className={`${inter.className} bg-gray-50 dark:bg-slate-900 text-gray-900 dark:text-white min-h-screen`}>
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
} 