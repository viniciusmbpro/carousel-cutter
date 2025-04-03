import { NextRequest, NextResponse } from 'next/server';
import stripe from '@/app/lib/stripe/stripe-config';
import { db } from '@/app/lib/firebase/firebase-config';
import { doc, setDoc } from 'firebase/firestore';

// Definir os IDs dos preços no Stripe
const PRICE_IDS = {
  price_monthly: 'price_monthly_id_aqui', // Substitua pelos IDs reais do Stripe
  price_yearly: 'price_yearly_id_aqui',
};

export async function POST(request: NextRequest) {
  try {
    const { priceId, userId } = await request.json();
    
    // Verificar se o priceId é válido
    if (!priceId || !Object.keys(PRICE_IDS).includes(priceId)) {
      return NextResponse.json(
        { error: 'ID de preço inválido' },
        { status: 400 }
      );
    }

    // Verificar se o userId foi fornecido
    if (!userId) {
      return NextResponse.json(
        { error: 'ID de usuário não fornecido' },
        { status: 400 }
      );
    }

    // Verificar se o usuário já tem um customer_id no Stripe
    // Se não tiver, cria um novo cliente no Stripe
    let customerId;
    const userRef = doc(db, 'users', userId);
    
    // Iniciar a sessão de checkout
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      mode: 'subscription',
      line_items: [
        {
          price: PRICE_IDS[priceId as keyof typeof PRICE_IDS],
          quantity: 1,
        },
      ],
      customer: customerId,
      success_url: `${process.env.NEXTAUTH_URL}/dashboard?checkout_success=true`,
      cancel_url: `${process.env.NEXTAUTH_URL}/pricing?checkout_canceled=true`,
      metadata: {
        userId,
      },
    });

    // Salvar a referência da sessão no Firebase
    await setDoc(
      doc(db, 'stripe_sessions', session.id),
      {
        userId,
        priceId,
        status: 'pending',
        created: new Date().toISOString(),
      },
      { merge: true }
    );

    return NextResponse.json({ url: session.url });
  } catch (error) {
    console.error('Erro ao criar sessão de checkout:', error);
    return NextResponse.json(
      { error: 'Erro ao criar sessão de checkout' },
      { status: 500 }
    );
  }
} 