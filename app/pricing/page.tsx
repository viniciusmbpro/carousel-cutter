import Link from 'next/link';
import PricingCard from '../components/pricing/pricing-card';

export default function PricingPage() {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-slate-900">
      {/* Header */}
      <header className="bg-white dark:bg-slate-900 shadow-sm border-b border-gray-200 dark:border-gray-800">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center">
            <Link href="/" className="text-2xl font-bold text-primary">
              Carousel Cutter
            </Link>
          </div>
        </div>
      </header>
      
      {/* Main Content */}
      <main className="flex-grow">
        <div className="max-w-7xl mx-auto px-4 py-16 sm:py-24">
          <div className="text-center mb-16">
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-6">
              Escolha o plano ideal para suas necessidades
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Todos os planos incluem acesso total à nossa IA para geração de carrosséis e suporte ao cliente.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {/* Plano Mensal */}
            <PricingCard
              title="Mensal"
              price="29,90"
              period="mês"
              description="Perfeito para quem quer experimentar o serviço."
              features={[
                'Até 15 carrosséis por mês',
                'Edição ilimitada dos carrosséis',
                'Armazenamento em nuvem',
                'Acesso a todos os templates',
                'Suporte por email'
              ]}
              buttonText="Assinar plano mensal"
              priceId="price_monthly"
            />
            
            {/* Plano Anual */}
            <PricingCard
              title="Anual"
              price="19,90"
              period="mês"
              description="Economize mais de 30% pagando anualmente."
              features={[
                'Até 30 carrosséis por mês',
                'Edição ilimitada dos carrosséis',
                'Armazenamento em nuvem',
                'Acesso a todos os templates',
                'Suporte prioritário',
                'Acesso antecipado a novos recursos'
              ]}
              buttonText="Assinar plano anual"
              priceId="price_yearly"
              popular
            />
          </div>
          
          <div className="mt-12 text-center">
            <p className="text-gray-600 dark:text-gray-400">
              Tem dúvidas sobre qual plano escolher?{' '}
              <Link
                href="/contact"
                className="text-primary hover:text-primary-dark dark:text-primary-light dark:hover:text-primary"
              >
                Entre em contato
              </Link>{' '}
              com nosso time.
            </p>
          </div>
        </div>
      </main>
      
      {/* Footer */}
      <footer className="bg-white dark:bg-slate-800 border-t border-gray-200 dark:border-gray-700 py-6">
        <div className="container mx-auto px-4 text-center text-gray-600 dark:text-gray-400">
          <p>© {new Date().getFullYear()} Carousel Cutter. Todos os direitos reservados.</p>
        </div>
      </footer>
    </div>
  );
} 