// src/services/api.js
export const API_URL = import.meta.env.VITE_API_URL

// Chaves com prefixo: em localhost vários projetos dividem o mesmo localStorage,
// e um "access_token" de outro projeto fazia o site achar que o cliente estava logado.
const CHAVE_ACCESS = 'urban:access_token'
const CHAVE_REFRESH = 'urban:refresh_token'

export const getAccessToken = () => localStorage.getItem(CHAVE_ACCESS)

export function salvarTokens({ access, refresh }) {
  localStorage.setItem(CHAVE_ACCESS, access)
  if (refresh) localStorage.setItem(CHAVE_REFRESH, refresh)
}

export function limparTokens() {
  localStorage.removeItem(CHAVE_ACCESS)
  localStorage.removeItem(CHAVE_REFRESH)
}

// O access token vale 3h. Quando vence, tenta renovar com o refresh (1 dia) uma vez só.
let renovando = null
async function renovarToken() {
  const refresh = localStorage.getItem(CHAVE_REFRESH)
  if (!refresh) return false
  renovando ??= fetch(`${API_URL}/token/refresh/`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ refresh }),
  })
    .then(async (res) => {
      if (!res.ok) return false
      salvarTokens(await res.json())
      return true
    })
    .catch(() => false)
    .finally(() => { renovando = null })
  return renovando
}

function sessaoExpirou() {
  limparTokens()
  // recarrega para o header, carrinho e curtidos voltarem ao estado "deslogado"
  window.location.reload()
}

export async function apiFetch(path, options = {}, tentouRenovar = false) {
  const token = getAccessToken()
  const isForm = options.body instanceof FormData
  const res = await fetch(`${API_URL}${path}`, {
    ...options,
    headers: {
      // FormData define o próprio Content-Type (com boundary)
      ...(isForm ? {} : { 'Content-Type': 'application/json' }),
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    },
  })
  if (res.status === 401 && token) {
    if (!tentouRenovar && (await renovarToken())) return apiFetch(path, options, true)
    sessaoExpirou()
    throw new Error('Sua sessão expirou. Entre novamente.')
  }
  if (!res.ok) {
    const detalhe = await res.text().catch(() => '')
    throw new Error(`Erro na API (${res.status})${detalhe ? `: ${detalhe.slice(0, 200)}` : ''}`)
  }
  return res.status === 204 ? null : res.json()
}
