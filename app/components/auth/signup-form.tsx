'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/app/lib/context/AuthContext';
import Input from '../ui/input';
import Button from '../ui/button';

export default function SignupForm() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const { signup } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Validações básicas
    if (password !== confirmPassword) {
      setError('As senhas não conferem.');
      return;
    }

    if (password.length < 6) {
      setError('A senha deve ter pelo menos 6 caracteres.');
      return;
    }

    setIsLoading(true);

    try {
      await signup(email, password, name);
      router.push('/dashboard'); // Redireciona diretamente para o dashboard - plano grátis
    } catch (err: any) {
      let errorMessage = 'Falha ao criar conta. Tente novamente.';
      
      // Tratando erros específicos do Firebase
      if (err.code === 'auth/email-already-in-use') {
        errorMessage = 'Este email já está em uso.';
      } else if (err.code === 'auth/invalid-email') {
        errorMessage = 'Email inválido.';
      } else if (err.code === 'auth/weak-password') {
        errorMessage = 'A senha é muito fraca.';
      }
      
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="card">
        <h2 className="text-2xl font-bold mb-6 text-center text-gray-900 dark:text-white">
          Criar uma conta
        </h2>
        
        {error && (
          <div className="mb-4 p-3 rounded bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300 text-sm">
            {error}
          </div>
        )}
        
        <form onSubmit={handleSubmit}>
          <Input
            label="Nome"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Seu nome"
            required
          />
          
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
          
          <Input
            label="Confirmar senha"
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="Confirme sua senha"
            required
          />
          
          <div className="mb-6">
            <div className="flex items-center">
              <input
                id="terms"
                type="checkbox"
                className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
                required
              />
              <label
                htmlFor="terms"
                className="ml-2 block text-sm text-gray-700 dark:text-gray-300"
              >
                Eu concordo com os{' '}
                <Link
                  href="/terms"
                  className="text-primary hover:text-primary-dark dark:text-primary-light dark:hover:text-primary"
                >
                  Termos de Serviço
                </Link>{' '}
                e{' '}
                <Link
                  href="/privacy"
                  className="text-primary hover:text-primary-dark dark:text-primary-light dark:hover:text-primary"
                >
                  Política de Privacidade
                </Link>
              </label>
            </div>
          </div>
          
          <Button
            type="submit"
            variant="primary"
            className="w-full"
            isLoading={isLoading}
            disabled={!name || !email || !password || !confirmPassword}
          >
            Criar Conta
          </Button>
        </form>
        
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Já tem uma conta?{' '}
            <Link
              href="/login"
              className="text-primary hover:text-primary-dark dark:text-primary-light dark:hover:text-primary"
            >
              Entrar
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
} 