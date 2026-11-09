import { API_URL } from "./api"

export async function solicitarRecuperacaoSenha(email) {
  const res = await fetch(`${API_URL}/senha/recuperar/`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email }),
  })
  if (!res.ok) throw new Error('Não foi possível solicitar a recuperação de senha')
  return res.json()
}

export async function redefinirSenha(uid, token, new_password) {
  const res = await fetch(`${API_URL}/senha/redefinir/`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ uid, token, new_password }),
  })
  if (!res.ok) throw new Error('Não foi possível redefinir a senha. O link pode ter expirado.')
  return res.json()
}
