import { ref } from "vue"
import { apiFetch, getAccessToken, limparTokens } from "./api"

export async function getUsuarioAtual() {
  return apiFetch('/usuarios/me/')
}

export const logout = limparTokens

export function isAutenticado() {
  return Boolean(getAccessToken())
}

// Usuário logado, buscado uma vez e compartilhado (header, rotas, cardápio).
export const usuarioLogado = ref(null)
let buscando = null
export function carregarUsuario() {
  if (!isAutenticado()) return Promise.resolve(null)
  buscando ??= getUsuarioAtual()
    .then((u) => (usuarioLogado.value = u))
    .catch(() => null)
  return buscando
}
