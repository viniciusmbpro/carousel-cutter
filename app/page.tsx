import Link from 'next/link';
import Image from 'next/image';

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Header/Nav */}
      <header className="bg-white dark:bg-slate-900 shadow-sm">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center">
            <h1 className="text-2xl font-bold text-primary">Carousel Cutter</h1>
          </div>
          <nav>
            <ul className="flex space-x-6">
              <li>
                <Link href="/login" className="text-gray-600 hover:text-primary dark:text-gray-300 dark:hover:text-primary-light">
                  Login
                </Link>
              </li>
              <li>
                <Link href="/signup" className="btn-primary">
                  Começar Agora
                </Link>
              </li>
            </ul>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="flex-grow bg-gradient-to-b from-white to-gray-100 dark:from-slate-900 dark:to-slate-800 py-20">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="md:w-1/2 mb-10 md:mb-0">
              <h2 className="text-4xl md:text-5xl font-bold mb-6 text-gray-900 dark:text-white">
                Crie carrosséis <span className="text-primary">profissionais</span> com IA
              </h2>
              <p className="text-xl mb-8 text-gray-600 dark:text-gray-300">
                Transforme suas ideias em carrosséis incríveis para Instagram, LinkedIn e Facebook com a ajuda da nossa IA.
              </p>
              <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
                <Link href="/signup" className="btn-primary text-center">
                  Começar Gratuitamente
                </Link>
                <Link href="/pricing" className="btn-secondary text-center">
                  Ver Planos
                </Link>
              </div>
            </div>
            <div className="md:w-1/2">
              <div className="relative h-[400px] w-full">
                {/* Placeholder for hero image - in a real app you'd add an actual image */}
                <div className="absolute inset-0 bg-gray-200 dark:bg-slate-700 rounded-lg flex items-center justify-center">
                  <p className="text-gray-500 dark:text-gray-400">Imagem de carrosséis</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white dark:bg-slate-900">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12 text-gray-900 dark:text-white">
            Por que escolher o Carousel Cutter?
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="card">
              <div className="h-12 w-12 bg-primary/10 rounded-lg flex items-center justify-center mb-6">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-3 text-gray-900 dark:text-white">Rápido e Simples</h3>
              <p className="text-gray-600 dark:text-gray-300">
                Crie carrosséis em minutos, não em horas. Nossa IA faz o trabalho pesado por você.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="card">
              <div className="h-12 w-12 bg-primary/10 rounded-lg flex items-center justify-center mb-6">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-3 text-gray-900 dark:text-white">Conteúdo de Qualidade</h3>
              <p className="text-gray-600 dark:text-gray-300">
                Textos profissionais e envolventes, otimizados para maior engajamento nas redes sociais.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="card">
              <div className="h-12 w-12 bg-primary/10 rounded-lg flex items-center justify-center mb-6">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-3 text-gray-900 dark:text-white">Personalizável</h3>
              <p className="text-gray-600 dark:text-gray-300">
                Edite facilmente o conteúdo gerado para atender às suas necessidades específicas.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-primary">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-6 text-white">
            Pronto para revolucionar seus carrosséis?
          </h2>
          <p className="text-xl mb-8 text-white/80 max-w-2xl mx-auto">
            Junte-se a milhares de criadores de conteúdo que economizam tempo e aumentam o engajamento com o Carousel Cutter.
          </p>
          <Link href="/signup" className="bg-white text-primary hover:bg-gray-100 font-bold py-3 px-8 rounded-lg text-lg transition-colors">
            Começar Agora
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-300 py-12">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-xl font-bold mb-4 text-white">Carousel Cutter</h3>
              <p className="mb-4">
                Transforme suas ideias em carrosséis incríveis com a ajuda da nossa IA.
              </p>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4 text-white">Recursos</h4>
              <ul className="space-y-2">
                <li><Link href="/features" className="hover:text-primary-light">Funcionalidades</Link></li>
                <li><Link href="/pricing" className="hover:text-primary-light">Preços</Link></li>
                <li><Link href="/blog" className="hover:text-primary-light">Blog</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4 text-white">Empresa</h4>
              <ul className="space-y-2">
                <li><Link href="/about" className="hover:text-primary-light">Sobre Nós</Link></li>
                <li><Link href="/contact" className="hover:text-primary-light">Contato</Link></li>
                <li><Link href="/terms" className="hover:text-primary-light">Termos de Uso</Link></li>
                <li><Link href="/privacy" className="hover:text-primary-light">Política de Privacidade</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4 text-white">Siga-nos</h4>
              <div className="flex space-x-4">
                <a href="#" className="text-gray-400 hover:text-white">
                  <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z" />
                  </svg>
                </a>
                <a href="#" className="text-gray-400 hover:text-white">
                  <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                  </svg>
                </a>
                <a href="#" className="text-gray-400 hover:text-white">
                  <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M4.98 3.5c0 1.381-1.11 2.5-2.48 2.5s-2.48-1.119-2.48-2.5c0-1.38 1.11-2.5 2.48-2.5s2.48 1.12 2.48 2.5zm.02 4.5h-5v16h5v-16zm7.982 0h-4.968v16h4.969v-8.399c0-4.67 6.029-5.052 6.029 0v8.399h4.988v-10.131c0-7.88-8.922-7.593-11.018-3.714v-2.155z" />
                  </svg>
                </a>
              </div>
            </div>
          </div>
          <div className="mt-12 pt-8 border-t border-gray-800 text-center">
            <p>© {new Date().getFullYear()} Carousel Cutter. Todos os direitos reservados.</p>
          </div>
        </div>
      </footer>
    </div>
  );
} 