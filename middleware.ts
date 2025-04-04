import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Comentando todo o middleware temporariamente para verificar se é a causa do problema
export function middleware(request: NextRequest) {
  // O Firebase Auth gerencia a autenticação no lado do cliente
  // Não é necessário verificar cookies no middleware
  // A verificação de autenticação é feita nos componentes usando o contexto AuthContext
  
  // Apenas permitir todas as rotas por enquanto
  return NextResponse.next();
} 