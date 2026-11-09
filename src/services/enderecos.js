import { apiFetch } from './api'

export async function listarEnderecos() {
  const data = await apiFetch('/enderecos/?page_size=100')
  return data.results ?? data
}

export const criarEndereco = (dados) =>
  apiFetch('/enderecos/', { method: 'POST', body: JSON.stringify(dados) })

export const apagarEndereco = (id) => apiFetch(`/enderecos/${id}/`, { method: 'DELETE' })

export const getCliente = () => apiFetch('/clientes/meu/')

export const atualizarCliente = (dados) =>
  apiFetch('/clientes/meu/', { method: 'PATCH', body: JSON.stringify(dados) })
