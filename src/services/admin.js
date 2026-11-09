import { apiFetch } from './api'

const json = (method, body) => ({ method, body: JSON.stringify(body) })

export const criarCategoria = (dados) => apiFetch('/categorias/', json('POST', dados))
export const atualizarCategoria = (id, dados) => apiFetch(`/categorias/${id}/`, json('PATCH', dados))
export const apagarCategoria = (id) => apiFetch(`/categorias/${id}/`, { method: 'DELETE' })

export const criarItem = (dados) => apiFetch('/itens/', json('POST', dados))
export const atualizarItem = (id, dados) => apiFetch(`/itens/${id}/`, json('PATCH', dados))
export const apagarItem = (id) => apiFetch(`/itens/${id}/`, { method: 'DELETE' })

// Envia a imagem e devolve a attachment_key para vincular ao item
export async function uploadImagem(arquivo, descricao = '') {
  const form = new FormData()
  form.append('file', arquivo)
  form.append('description', descricao)
  const img = await apiFetch('/media/images/', { method: 'POST', body: form })
  return img.attachment_key
}
