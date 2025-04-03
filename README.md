# carousel-cutter

Arquitetura em alto nível
Front-end (Next.js / React)

Hospedado na Vercel (build automático a cada push no repositório).

Rotas e páginas que o usuário final acessa.

Chamadas de API para nosso back-end (que pode ser implementado com API Routes do Next.js ou separado, mas em um MVP normalmente basta usar as rotas serverless do próprio Next.js).

Back-end (API Routes Next.js)

Endpoints para:

Criação e gerenciamento de assinaturas (Stripe).

Geração de conteúdo com IA (chamadas a um serviço de geração de textos e/ou imagens).

Manipulação e armazenamento de dados no Firebase.

Webhook do Stripe para gerenciar eventos de pagamento (renovação, cancelamento, falha de pagamento, etc.).

Banco de dados e Autenticação (Firebase)

Firebase Auth para cadastro e login de usuários.

Cloud Firestore (ou Realtime Database) para armazenar dados simples como:

Perfis de usuário.

Status de assinatura (referência ao Customer ID do Stripe).

Registro dos carrosséis gerados.

Firebase Storage (opcional) para armazenar eventuais imagens geradas (se houver geração de imagens).

Integração com Stripe

Um endpoint de checkout para o usuário escolher o plano (mensal ou semanal).

Webhook para atualizar status de assinatura no banco Firebase sempre que houver um evento (pagamento recebido, falha, etc.).

Fluxo principal de geração do carrossel

Recebe entrada do usuário (tema, texto, propósito do post, etc.).

Usa API de IA para gerar o texto de cada “slide” do carrossel e possíveis sugestões de design (layout, cores).

Retorna ao front-end para o usuário revisar/editar.

(Opcional) Gerar imagens para cada slide e salvar em Firebase Storage ou retornar diretamente para o front-end.

Telas (Front-end)
Tela de Login / Cadastro

Autenticação via email/senha (Firebase Auth).

Botão “Esqueci minha senha” (opcional, mas recomendável).

Possibilidade de Social Login (Google, GitHub etc.) se quiser simplificar UX (também via Firebase Auth).

Tela de Escolha de Plano (Assinatura)

Listar planos disponíveis: semanal ou mensal.

Botão para iniciar o checkout do Stripe.

Ao concluir o pagamento, o usuário é redirecionado para o painel.

Tela de Painel / Dashboard

Exibe breve resumo do status de assinatura (ativa, data de renovação, etc.).

Botão para criar novo carrossel.

Lista de carrosséis anteriores já criados (com opção de editar ou visualizar).

Tela de Criação/Edição de Carrossel

Campo para o usuário informar o tema ou assunto do post.

Botão para “Gerar Carrossel” – que chama a API de IA no back-end.

Ao receber a resposta, exibe cada slide em uma interface básica, permitindo ao usuário:

Editar texto

(Opcional) Escolher entre alguns layouts ou templates prontos

Botão para “Salvar Carrossel” ou “Exportar”.

Tela de Perfil do Usuário

Dados do usuário (nome, email).

Status da assinatura.

Link para gerenciar/cancelar assinatura (redirecionamento para Stripe Customer Portal ou fluxo de cancelamento próprio).

Tela de Confirmação/Checagem de Pagamento (Callback do Stripe)

Mensagem de sucesso ou erro.

Redireciona para o Dashboard se tudo estiver correto.

Módulos do Back-end (API Routes)
Módulo de Autenticação

Pode ser bem simples se usando Firebase Auth no client.

Se precisar de rotas protegidas, utilizar tokens do Firebase (ID token) para autenticar no serverless.

Módulo de Pagamentos (Stripe)

POST /api/checkout: inicia o processo de checkout com Stripe, recebendo do front-end o plano escolhido (semanal ou mensal).

Cria a Checkout Session no Stripe e retorna a URL para redirecionar.

POST /api/webhook: endpoint para receber eventos do Stripe.

Evento de pagamento bem-sucedido → atualizar status de assinatura do usuário no Firebase.

Evento de cancelamento ou falha → atualizar status correspondente.

GET /api/portal: (opcional) retorna a URL do portal do cliente no Stripe para gerenciar assinatura.

Módulo de Geração de Conteúdo (IA)

POST /api/generateCarousel: recebe tema, objetivos, tom do texto etc.

Chama a API de IA (por exemplo, OpenAI ou outra).

Retorna o texto gerado para cada slide do carrossel ao front-end.

Se houver geração de imagens, um endpoint separado ou dentro do mesmo, usando alguma API de geração de imagens.

Módulo de Carrosséis (CRUD)

POST /api/carousels: salva carrossel no Firebase (texto, links de imagem, etc.).

GET /api/carousels: lista carrosséis do usuário logado.

GET /api/carousels/[id]: obtém detalhes de um carrossel específico.

PUT /api/carousels/[id]: atualiza texto/layout do carrossel.

DELETE /api/carousels/[id]: remove carrossel.

Estrutura de Dados no Firebase (Exemplo Simplificado)
Coleção users
uid (string)

email (string)

stripeCustomerId (string) - armazenar para relacionar com Stripe.

subscriptionStatus (string) - “active”, “cancelled”, “past_due”, etc.

plan (string) - “weekly” ou “monthly”.

Coleção carousels
id (gerado automaticamente)

userId (string) - referência ao users.uid.

title (string) - título ou assunto principal do carrossel.

slides (array de objetos):

text (string) - texto do slide.

imageUrl (string) - link para a imagem (caso armazenado em Firebase Storage).

createdAt (timestamp)

updatedAt (timestamp)

(Dependendo do nível de complexidade, pode-se guardar o histórico de versões ou apenas a versão atual.)

Passos para um MVP Enxuto
Configurar o Projeto no Firebase

Criar projeto, habilitar Authentication (usuários por email e senha ou redes sociais).

Habilitar Firestore Database.

Criar Projeto Next.js e Configuração Básica na Vercel

Instalar dependências do Firebase (SDK) e Stripe.

Criar .env com variáveis sensíveis (chaves do Stripe, credenciais do Firebase).

Implementar Autenticação no Front-end

Usar Firebase Auth.

Tela de Login/Cadastro.

Criar Fluxo de Pagamentos

Integração Stripe (checkout session).

Endpoint do webhook para atualizar status do usuário no Firebase.

Criar Módulo de Geração de Carrosséis

Rota de API para chamar o modelo de IA (por ex. GPT da OpenAI ou outro).

Retornar para o front-end o texto pronto (ou texto + imagens).

CRUD de Carrosséis

Criar coleções no Firestore.

Salvar, listar, editar e excluir.

Ajustar UI e Fluxos Essenciais

Dashboard para ver carrosséis.

Botão de novo carrossel.

Deploy

Deploy contínuo na Vercel (push para master/main → build na Vercel).

Considerações Finais
Escalabilidade: Para um MVP, a arquitetura com Next.js (serverless) + Firebase + Stripe é bem escalável na fase inicial.

Simplicidade: Manter a lógica de negócio dos carrosséis e assinaturas no back-end e deixar o front-end focado em exibir dados e permitir interações.

Segurança: Não esquecer de proteger as rotas de criação/edição de carrosséis para garantir que só o proprietário possa editar.

Gerenciamento de Estados: Se quiser simplicidade no front-end, usar algo como React Hooks. Se o projeto crescer, pode-se considerar Redux ou outra lib de gestão de estado.

Opções de IA: Para um MVP, usar OpenAI (GPT) costuma ser o mais rápido. Caso não queira dependência externa, seria preciso hospedar um modelo próprio, mas isso complica o MVP.

