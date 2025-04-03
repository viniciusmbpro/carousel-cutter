import { NextRequest, NextResponse } from 'next/server';
import stripe from '@/app/lib/stripe/stripe-config';
import { db } from '@/app/lib/firebase/firebase-config';
import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';

export async function POST(request: NextRequest) {
  const sig = request.headers.get('stripe-signature') as string;
  const body = await request.text();
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  let event;

  try {
    event = stripe.webhooks.constructEvent(body, sig, webhookSecret as string);
  } catch (err) {
    console.error('Erro ao verificar webhook:', err);
    return NextResponse.json(
      { error: 'Evento de webhook inválido' },
      { status: 400 }
    );
  }

  // Processar o evento
  switch (event.type) {
    case 'checkout.session.completed': {
      const session = event.data.object;
      const userId = session.metadata.userId;

      // Buscar usuário no banco de dados
      const userRef = doc(db, 'users', userId);
      const userDoc = await getDoc(userRef);

      if (userDoc.exists()) {
        // Atualizar usuário com informações da assinatura
        await updateDoc(userRef, {
          stripeCustomerId: session.customer,
          subscriptionStatus: 'active',
          subscriptionId: session.subscription,
          plan: session.metadata.priceId === 'price_monthly' ? 'monthly' : 'yearly',
          updatedAt: new Date().toISOString(),
        });

        // Atualizar a sessão do stripe
        const sessionRef = doc(db, 'stripe_sessions', session.id);
        await setDoc(
          sessionRef,
          {
            status: 'completed',
            completedAt: new Date().toISOString(),
          },
          { merge: true }
        );
      }
      break;
    }

    case 'invoice.payment_succeeded': {
      const invoice = event.data.object;
      const subscriptionId = invoice.subscription;
      const customerId = invoice.customer;

      // Buscar usuário pelo customerId
      // Aqui teríamos que consultar onde o customerId é igual ao valor
      // Em um banco real, idealmente teríamos um índice para esta busca
      
      // Atualizar status da assinatura
      // Exemplo: await updateDoc(userRef, { subscriptionStatus: 'active' });
      break;
    }

    case 'customer.subscription.updated': {
      const subscription = event.data.object;
      // Atualizar informações de assinatura
      break;
    }

    case 'customer.subscription.deleted': {
      const subscription = event.data.object;
      // Marcar assinatura como cancelada
      break;
    }

    default:
      console.log(`Evento não manipulado: ${event.type}`);
  }

  return NextResponse.json({ received: true });
} 