'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Button from '../ui/button';
import { useAuth } from '@/app/lib/context/AuthContext';

interface PricingCardProps {
  title: string;
  price: string;
  period: string;
  description: string;
  features: string[];
  buttonText: string;
  priceId: string;
  popular?: boolean;
}

export default function PricingCard({
  title,
  price,
  period,
  description,
  features,
  buttonText,
  priceId,
  popular = false
}: PricingCardProps) {
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useAuth();
  const router = useRouter();

  const handleSubscribe = async () => {
    setIsLoading(true);
    
    try {
      if (!user) {
        // Se não estiver autenticado, redirecionar para login
        router.push(`/login?redirect=/pricing&plan=${priceId}`);
        return;
      }
      
      // Chamar a API para criar uma sessão de checkout
      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          priceId,
          userId: user.uid,
        }),
      });
      
      const data = await response.json();
      
      if (data.url) {
        // Redirecionar para a página de checkout do Stripe
        window.location.href = data.url;
      } else {
        throw new Error('Não foi possível criar a sessão de checkout');
      }
    } catch (error) {
      console.error('Erro ao iniciar o checkout:', error);
      alert('Ocorreu um erro ao processar sua solicitação. Por favor, tente novamente.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={`card border ${popular ? 'border-primary/60 ring-1 ring-primary/20' : 'border-gray-200 dark:border-gray-700'} relative`}>
      {popular && (
        <div className="absolute -top-4 left-0 w-full flex justify-center">
          <span className="bg-primary text-white px-4 py-1 rounded-full text-sm font-medium">
            Mais popular
          </span>
        </div>
      )}
      
      <div className="text-center mb-6">
        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-1">
          {title}
        </h3>
        <div className="flex justify-center items-baseline my-4">
          <span className="text-4xl font-extrabold text-gray-900 dark:text-white">
            R$ {price}
          </span>
          <span className="text-gray-500 dark:text-gray-400 ml-1">
            /{period}
          </span>
        </div>
        <p className="text-gray-600 dark:text-gray-400">
          {description}
        </p>
      </div>
      
      <ul className="mb-6 space-y-3">
        {features.map((feature, index) => (
          <li key={index} className="flex items-center">
            <svg
              className="h-5 w-5 text-primary flex-shrink-0"
              fill="currentColor"
              viewBox="0 0 20 20"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                clipRule="evenodd"
              />
            </svg>
            <span className="ml-2 text-gray-700 dark:text-gray-300">{feature}</span>
          </li>
        ))}
      </ul>
      
      <Button
        variant={popular ? 'primary' : 'outline'}
        className="w-full"
        onClick={handleSubscribe}
        isLoading={isLoading}
      >
        {buttonText}
      </Button>
    </div>
  );
} 