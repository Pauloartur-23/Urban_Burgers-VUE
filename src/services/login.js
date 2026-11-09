import { API_URL, salvarTokens } from "./api"

// Para onde ir depois de entrar: ?next=/caminho (só caminhos internos, evita redirecionar para outro site)
export function destinoPosLogin() {
  const next = new URLSearchParams(window.location.search).get('next') ?? ''
  return next.startsWith('/') && !next.startsWith('//') ? next : '/conta'
}

export async function login(email, password) {
  const res = await fetch(`${API_URL}/token/`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  })
  if (!res.ok) throw new Error('E-mail ou senha incorretos.')
  const data = await res.json()
  // data.access  -> token de acesso (validade: 3h)
  // data.refresh -> token de renovação (validade: 1 dia)
  salvarTokens(data)
  return data
}

// credential = ID token devolvido pelo botão do Google; o backend valida e devolve nossos JWT
export async function loginGoogle(credential) {
  const res = await fetch(`${API_URL}/token/google/`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ credential }),
  })
  if (!res.ok) throw new Error('Não foi possível entrar com o Google')
  const data = await res.json()
  salvarTokens(data)
  return data
}