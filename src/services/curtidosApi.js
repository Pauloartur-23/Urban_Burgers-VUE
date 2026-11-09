import { apiFetch } from "./api"

export async function getMeusCurtidos() {
  return apiFetch('/curtidos/meus/')
}

export async function toggleCurtidoApi(itemId) {
  return apiFetch('/curtidos/toggle/', {
    method: 'POST',
    body: JSON.stringify({ item: itemId }),
  })
}
