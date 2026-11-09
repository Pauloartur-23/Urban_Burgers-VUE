import { apiFetch, getAccessToken, limparTokens } from "./api"

export async function getUsuarioAtual() {
  return apiFetch('/usuarios/me/')
}

export const logout = limparTokens

export function isAutenticado() {
  return Boolean(getAccessToken())
}
