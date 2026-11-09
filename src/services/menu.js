import { API_URL } from "./api"

// A API pagina os resultados (page_size padrão: 10). Como o cardápio é uma
// lista pequena, pedimos o maior page_size permitido (100) para trazer tudo
// de uma vez, em vez de só a primeira página.
const PAGE_SIZE = 100

export async function fetchCategorias() {
  const res = await fetch(`${API_URL}/categorias/?page_size=${PAGE_SIZE}`)
  if (!res.ok) throw new Error('Não foi possível carregar as categorias')
  const data = await res.json()
  return data.results ?? data
}

export async function fetchItens() {
  const res = await fetch(`${API_URL}/itens/?page_size=${PAGE_SIZE}`)
  if (!res.ok) throw new Error('Não foi possível carregar os itens')
  const data = await res.json()
  return data.results ?? data
}
