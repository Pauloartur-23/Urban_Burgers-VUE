import { linkWhatsapp } from '@/config/loja.js'
import { brl } from '@/utils/formato.js'

// Mensagem que chega no WhatsApp da loja, montada a partir do pedido salvo no servidor.
export function montarMensagem(pedido) {
  const linhas = pedido.itens_detalhe.map(
    (ci) => `• ${ci.quantidade}x ${ci.item_detalhe.nome} — ${brl(ci.preco_unitario * ci.quantidade)}`
  )

  return [
    // sem emoji: o redirecionamento do wa.me estraga emojis e eles chegam como "?"
    `*Pedido #${pedido.id} - Urban Burger*`,
    '',
    `*Cliente:* ${pedido.nome_cliente}`,
    pedido.telefone ? `*Telefone:* ${pedido.telefone}` : null,
    '',
    '*Itens:*',
    ...linhas,
    '',
    `*Total: ${brl(pedido.total)}*`,
    '',
    '*Entrega:*',
    pedido.endereco_entrega,
    pedido.link_mapa ? `Localização: ${pedido.link_mapa}` : null,
    '',
    `*Pagamento:* ${pedido.pagamento}${pedido.troco ? ` (troco para ${pedido.troco})` : ''}`,
    pedido.observacao ? `*Observação:* ${pedido.observacao}` : null,
  ]
    .filter((l) => l !== null) // '' fica: é linha em branco
    .join('\n')
}

export const linkPedidoWhatsapp = (pedido) => linkWhatsapp(montarMensagem(pedido))
