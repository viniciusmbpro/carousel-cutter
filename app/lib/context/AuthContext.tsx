'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { 
  User,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  sendPasswordResetEmail,
  updateProfile,
  setPersistence,
  browserLocalPersistence,
  UserCredential
} from 'firebase/auth';
import { auth } from '../firebase/firebase-config';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signup: (email: string, password: string, name: string) => Promise<void>;
  login: (email: string, password: string) => Promise<UserCredential>;
  logout: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  getRedirectResult: () => Promise<User | null>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Configurar persistência local para manter o usuário logado
  useEffect(() => {
    console.log("AuthContext: Configurando persistência local");
    try {
      setPersistence(auth, browserLocalPersistence)
        .then(() => console.log("Persistência configurada com sucesso"))
        .catch(err => console.error("Erro ao configurar persistência:", err));
    } catch (error) {
      console.error("Erro ao configurar persistência:", error);
    }
  }, []);

  useEffect(() => {
    console.log("AuthContext: Configurando listener de autenticação");
    
    // Verificar localStorage primeiro (redundância)
    const savedUser = localStorage.getItem('authUser');
    if (savedUser) {
      try {
        console.log("AuthContext: Usuário encontrado no localStorage");
        const parsedUser = JSON.parse(savedUser);
        // Não definimos o estado aqui, apenas para depuração
      } catch (e) {
        console.error("Erro ao analisar usuário do localStorage:", e);
      }
    }
    
    const unsubscribe = onAuthStateChanged(auth, (authUser) => {
      console.log("AuthContext: Status de autenticação mudou:", authUser ? "Autenticado" : "Não autenticado");
      
      if (authUser) {
        // Salvar usuário no localStorage também para redundância
        localStorage.setItem('authUser', JSON.stringify({
          uid: authUser.uid,
          email: authUser.email,
          displayName: authUser.displayName
        }));
      } else {
        localStorage.removeItem('authUser');
      }
      
      setUser(authUser);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const signup = async (email: string, password: string, name: string) => {
    try {
      console.log("AuthContext: Tentando criar usuário:", email);
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      
      // Update user profile with name
      if (userCredential.user) {
        console.log("AuthContext: Usuário criado, atualizando perfil");
        await updateProfile(userCredential.user, {
          displayName: name
        });
        console.log("AuthContext: Perfil atualizado com sucesso");
      }
    } catch (error) {
      console.error('AuthContext: Erro ao criar conta:', error);
      throw error;
    }
  };

  const login = async (email: string, password: string): Promise<UserCredential> => {
    try {
      console.log("AuthContext: Tentando login com:", email);
      const result = await signInWithEmailAndPassword(auth, email, password);
      console.log("AuthContext: Login bem-sucedido:", result.user.email);
      
      // Atualizar o estado localmente para garantir
      setUser(result.user);
      
      // Salvar no localStorage também
      localStorage.setItem('authUser', JSON.stringify({
        uid: result.user.uid,
        email: result.user.email,
        displayName: result.user.displayName
      }));
      
      return result;
    } catch (error) {
      console.error('AuthContext: Erro ao fazer login:', error);
      throw error;
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
      console.log("AuthContext: Logout realizado com sucesso");
      
      // Limpar localStorage
      localStorage.removeItem('authUser');
      
      // Garantir que o estado seja limpo
      setUser(null);
    } catch (error) {
      console.error('AuthContext: Erro ao fazer logout:', error);
      throw error;
    }
  };

  const resetPassword = async (email: string) => {
    try {
      await sendPasswordResetEmail(auth, email);
    } catch (error) {
      console.error('AuthContext: Erro ao resetar senha:', error);
      throw error;
    }
  };
  
  const getRedirectResult = async (): Promise<User | null> => {
    // Esta função é apenas para compatibilidade
    // Na implementação atual, apenas retorna o usuário atual
    return user;
  };

  const value = {
    user,
    loading,
    signup,
    login,
    logout,
    resetPassword,
    getRedirectResult
  };

  console.log("AuthContext: Estado atual:", { user: user?.email, loading });

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
} 