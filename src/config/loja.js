// Dados da hamburgueria usados no rodapé, na seção de contato e nos links de WhatsApp.
// Edite aqui para mudar em todo o site.
export const LOJA = {
  nome: 'Urban Burger',
  slogan: 'Good food, better people.',
  whatsapp: import.meta.env.VITE_WHATSAPP_NUMBER, // só dígitos, com DDI e DDD
  telefone: '(47) 99125-5265',
  email: 'contato@urbanburgers.com.br',
  endereco: 'Rua das Flores, 120 - Centro',
  horario: [
    { dias: 'Seg a Qui', horas: '18h às 23h' },
    { dias: 'Sex a Dom', horas: '18h às 00h' },
  ],
  // a mesma tabela em números, para o "Aberto agora / Fechado" (0 = domingo; 24 = meia-noite)
  funcionamento: { 1: [18, 23], 2: [18, 23], 3: [18, 23], 4: [18, 23], 5: [18, 24], 6: [18, 24], 0: [18, 24] },
  redes: [
    { nome: 'Instagram', icone: 'mdi-instagram', link: 'https://instagram.com/' },
    { nome: 'Facebook', icone: 'mdi-facebook', link: 'https://facebook.com/' },
  ],
}

export const linkWhatsapp = (texto = '') =>
  `https://wa.me/${LOJA.whatsapp}${texto ? `?text=${encodeURIComponent(texto)}` : ''}`
