import Stripe from 'stripe';

// Inicializa o cliente Stripe com a chave secreta
const stripe = new Stripe(
  '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', 
  {
    apiVersion: '2023-10-16', // A versão mais recente da API Stripe
  }
);

export default stripe; 