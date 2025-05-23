'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/app/lib/context/AuthContext';
import Input from '../ui/input';
import Button from '../ui/button';

export default function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const { user, login } = useAuth();
  const router = useRouter();

  // Log para depuração
  useEffect(() => {
    console.log("Login: Estado atual:", { user: user?.email });
    
    if (user) {
      console.log("Login: Usuário autenticado, redirecionando para dashboard");
      // Usando replace em vez de push para garantir que a navegação ocorra
      setTimeout(() => {
        router.replace('/dashboard');
      }, 100);
    }
  }, [user, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    console.log("Login: Tentando login com:", email);

    try {
      console.log("Login: Chamando função login...");
      await login(email, password);
      console.log("Login: Login bem-sucedido, aguardando atualização do estado");
      
      // Não fazemos redirecionamento aqui, aguardamos o efeito detectar o usuário
    } catch (err: any) {
      console.error("Login: Erro no login:", err);
      let errorMessage = 'Falha ao fazer login. Tente novamente.';
      
      // Tratando erros específicos do Firebase
      if (err.code === 'auth/user-not-found' || err.code === 'auth/wrong-password') {
        errorMessage = 'Email ou senha incorretos.';
      } else if (err.code === 'auth/too-many-requests') {
        errorMessage = 'Muitas tentativas de login. Tente novamente mais tarde.';
      }
      
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };
  
  // Função para redirecionamento manual
  const handleManualRedirect = () => {
    console.log("Redirecionando manualmente para o dashboard");
    window.location.href = "/dashboard";
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="card">
        <h2 className="text-2xl font-bold mb-6 text-center text-gray-900 dark:text-white">
          Entrar
        </h2>
        
        {error && (
          <div className="mb-4 p-3 rounded bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300 text-sm">
            {error}
          </div>
        )}
        
        <form onSubmit={handleSubmit}>
          <Input
            label="Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Seu email"
            required
          />
          
          <Input
            label="Senha"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Sua senha"
            required
          />
          
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center">
              <input
                id="remember"
                type="checkbox"
                className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
              />
              <label
                htmlFor="remember"
                className="ml-2 block text-sm text-gray-700 dark:text-gray-300"
              >
                Lembrar-me
              </label>
            </div>
            
            <Link
              href="/forgot-password"
              className="text-sm text-primary hover:text-primary-dark dark:text-primary-light dark:hover:text-primary"
            >
              Esqueceu a senha?
            </Link>
          </div>
          
          <Button
            type="submit"
            variant="primary"
            className="w-full"
            isLoading={isLoading}
            disabled={!email || !password}
          >
            Entrar
          </Button>
          
          {user && (
            <div>
              <div className="mt-4 p-3 rounded bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300 text-sm">
                Login realizado! Usuário: {user.email}
              </div>
              <button 
                onClick={handleManualRedirect}
                className="mt-4 w-full bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                type="button"
              >
                Ir para o Dashboard Manualmente
              </button>
            </div>
          )}
        </form>
        
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Não tem uma conta?{' '}
            <Link
              href="/signup"
              className="text-primary hover:text-primary-dark dark:text-primary-light dark:hover:text-primary"
            >
              Criar conta
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
} 