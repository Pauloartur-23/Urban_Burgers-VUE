import { API_URL } from "./api"

export async function registrar(email, name, password) {
  const res = await fetch(`${API_URL}/registro/`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, name, password }),
  })
  if (!res.ok) {
    // mensagem clara para os casos comuns, em vez de um erro genérico
    const erros = await res.json().catch(() => ({}))
    if (erros.email) throw new Error('Já existe uma conta com este e-mail. Tente entrar ou recuperar a senha.')
    if (erros.password) throw new Error('Escolha uma senha mais forte (mínimo de 8 caracteres).')
    throw new Error('Não foi possível concluir o cadastro. Tente novamente.')
  }
  return res.json()
}
