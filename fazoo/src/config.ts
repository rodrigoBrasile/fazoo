// Dados da marca e canais de contato.
// Para ativar um marketplace, cole o link da loja no campo "url".

export const site = {
  nome: 'Fazoo',
  slogan: 'Feito do seu jeito',
  descricao:
    'A Fazoo cria peças em impressão 3D e bottons personalizados. Conheça os produtos e peça o seu pelo WhatsApp.',
  // O número não aparece escrito no site: os botões abrem a conversa direto no WhatsApp.
  whatsapp: {
    numero: '5511952366025',
  },
  instagram: {
    usuario: 'fazoo3d',
    url: 'https://www.instagram.com/fazoo3d/',
  },
  marketplaces: [
    { id: 'mercado-livre', nome: 'Mercado Livre', url: '' },
    { id: 'shopee', nome: 'Shopee', url: '' },
    { id: 'amazon', nome: 'Amazon', url: '' },
  ],
};

export const categorias = {
  'impressao-3d': {
    nome: 'Impressão 3D',
    descricao: 'Decoração, organização e miniaturas impressas camada por camada.',
  },
  bottons: {
    nome: 'Bottons',
    descricao: 'Bottons para mochila, jaqueta, eventos e presentes.',
  },
  personalizados: {
    nome: 'Personalizados',
    descricao: 'Peças com o seu nome, a sua arte ou a marca da sua empresa.',
  },
  natal: {
    nome: 'Natal',
    descricao: 'Decoração e presentes para deixar o fim de ano mais mágico.',
  },
} as const;

export type Categoria = keyof typeof categorias;

export function linkWhatsApp(mensagem = 'Olá! Vim pelo site da Fazoo e gostaria de mais informações.') {
  return `https://wa.me/${site.whatsapp.numero}?text=${encodeURIComponent(mensagem)}`;
}
