// Geolocalização do navegador + busca de endereço (OpenStreetMap/Nominatim e ViaCEP, gratuitos e sem chave).

export function obterPosicao() {
  return new Promise((resolve, reject) => {
    if (!('geolocation' in navigator)) {
      reject(new Error('Seu navegador não suporta geolocalização.'))
      return
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => resolve({ latitude: pos.coords.latitude, longitude: pos.coords.longitude }),
      (err) =>
        reject(
          new Error(
            err.code === err.PERMISSION_DENIED
              ? 'Permissão de localização negada. Libere no navegador ou digite o endereço.'
              : 'Não foi possível obter sua localização.'
          )
        ),
      { enableHighAccuracy: true, timeout: 15000 }
    )
  })
}

export async function enderecoPorCoordenadas(latitude, longitude) {
  const url = `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${latitude}&lon=${longitude}&accept-language=pt-BR`
  const res = await fetch(url)
  if (!res.ok) throw new Error('Não foi possível descobrir o endereço da sua localização.')
  const a = (await res.json()).address ?? {}
  return {
    rua: a.road ?? '',
    numero_da_casa: a.house_number ?? '',
    bairro: a.suburb ?? a.neighbourhood ?? a.quarter ?? '',
    cidade: a.city ?? a.town ?? a.village ?? a.municipality ?? '',
    cep: a.postcode ?? '',
  }
}

export async function enderecoPorCep(cep) {
  const digitos = cep.replace(/\D/g, '')
  if (digitos.length !== 8) throw new Error('CEP deve ter 8 dígitos.')
  const res = await fetch(`https://viacep.com.br/ws/${digitos}/json/`)
  const data = await res.json()
  if (!res.ok || data.erro) throw new Error('CEP não encontrado.')
  return { rua: data.logradouro, bairro: data.bairro, cidade: data.localidade, cep: data.cep }
}

export function linkMapa(latitude, longitude) {
  return `https://www.google.com/maps?q=${latitude},${longitude}`
}

export function formatarEndereco(e) {
  const linha1 = [e.rua, e.numero_da_casa].filter(Boolean).join(', ')
  const linha2 = [e.bairro, e.cidade].filter(Boolean).join(' - ')
  return [linha1, e.complemento, linha2, e.cep && `CEP ${e.cep}`].filter(Boolean).join(' | ')
}
