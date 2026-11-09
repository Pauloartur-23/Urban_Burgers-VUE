import { apiFetch } from "./api"

export async function getCarrinho() {
  return apiFetch('/carrinhos/meu/')
}

export async function adicionarItemCarrinho(itemId, quantidade = 1) {
  return apiFetch('/carrinhos/meu/adicionar/', {
    method: 'POST',
    body: JSON.stringify({ item: itemId, quantidade }),
  })
}

export async function removerItemCarrinho(itemId, quantidade = 1) {
  return apiFetch('/carrinhos/meu/remover/', {
    method: 'POST',
    body: JSON.stringify({ item: itemId, quantidade }),
  })
}

export async function limparCarrinho() {
  return apiFetch('/carrinhos/meu/limpar/', { method: 'POST' })
}

// transforma o carrinho em pedido; devolve o pedido com número (id) e total calculado no servidor
export async function finalizarPedido(dados) {
  return apiFetch('/carrinhos/meu/finalizar/', { method: 'POST', body: JSON.stringify(dados) })
}

export async function listarPedidos() {
  return apiFetch('/carrinhos/pedidos/')
}

export async function mudarStatusPedido(id, status) {
  return apiFetch(`/carrinhos/${id}/status/`, { method: 'POST', body: JSON.stringify({ status }) })
}
