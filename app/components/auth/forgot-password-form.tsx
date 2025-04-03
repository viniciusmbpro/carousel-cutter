'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/app/lib/context/AuthContext';
import Input from '../ui/input';
import Button from '../ui/button';

export default function ForgotPasswordForm() {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  const { resetPassword } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess(false);
    setIsLoading(true);

    try {
      await resetPassword(email);
      setSuccess(true);
    } catch (err: any) {
      let errorMessage = 'Não foi possível enviar o email de recuperação. Tente novamente.';
      
      // Tratando erros específicos do Firebase
      if (err.code === 'auth/user-not-found') {
        errorMessage = 'Não encontramos um usuário com esse email.';
      } else if (err.code === 'auth/invalid-email') {
        errorMessage = 'Email inválido.';
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
          Recuperar Senha
        </h2>
        
        {success ? (
          <div className="text-center">
            <div className="mb-6 p-4 rounded-lg bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300">
              <p>Um email de recuperação foi enviado para <strong>{email}</strong>.</p>
              <p className="mt-2">Verifique sua caixa de entrada e siga as instruções para redefinir sua senha.</p>
            </div>
            <Link 
              href="/login"
              className="text-primary hover:text-primary-dark dark:text-primary-light dark:hover:text-primary"
            >
              Voltar para login
            </Link>
          </div>
        ) : (
          <>
            {error && (
              <div className="mb-4 p-3 rounded bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300 text-sm">
                {error}
              </div>
            )}
            
            <p className="mb-6 text-gray-600 dark:text-gray-400">
              Digite seu email para receber um link de recuperação de senha.
            </p>
            
            <form onSubmit={handleSubmit}>
              <Input
                label="Email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Seu email"
                required
              />
              
              <Button
                type="submit"
                variant="primary"
                className="w-full mt-2"
                isLoading={isLoading}
                disabled={!email}
              >
                Enviar link de recuperação
              </Button>
            </form>
            
            <div className="mt-6 text-center">
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Lembrou sua senha?{' '}
                <Link
                  href="/login"
                  className="text-primary hover:text-primary-dark dark:text-primary-light dark:hover:text-primary"
                >
                  Voltar para login
                </Link>
              </p>
            </div>
          </>
        )}
      </div>
    </div>
  );
} 