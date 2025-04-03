import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function middleware(request: NextRequest) {
  // Lista de rotas protegidas que requerem autenticação
  const protectedRoutes = ['/dashboard', '/create-carousel', '/profile', '/carousels'];
  
  // Verificar se a rota atual está na lista de rotas protegidas
  const isProtectedRoute = protectedRoutes.some(route => 
    request.nextUrl.pathname.startsWith(route)
  );

  if (isProtectedRoute) {
    // Verificar a sessão/cookie de autenticação do usuário
    // Como estamos usando Firebase Auth, as verificações mais complexas serão
    // feitas no Client Component usando o contexto de autenticação
    
    // Para simplificar, o middleware verifica apenas a existência de um cookie específico
    const session = request.cookies.get('auth-session');
    
    if (!session) {
      // Se não houver sessão, redirecionar para login
      const url = new URL('/login', request.url);
      url.searchParams.set('redirect', request.nextUrl.pathname);
      return NextResponse.redirect(url);
    }
  }
  
  return NextResponse.next();
} 