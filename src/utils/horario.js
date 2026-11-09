// "Aberto agora" / "Fechado" a partir da tabela de funcionamento da loja.
// funcionamento: { [diaDaSemana 0=dom..6=sáb]: [horaAbre, horaFecha] } — horaFecha 24 = meia-noite.

const NOMES = ['domingo', 'segunda', 'terça', 'quarta', 'quinta', 'sexta', 'sábado']
const hora = (h) => `${h % 24}h`

export function statusLoja(funcionamento, agora = new Date()) {
  const dia = agora.getDay()
  const h = agora.getHours() + agora.getMinutes() / 60
  const hoje = funcionamento[dia]

  if (hoje && h >= hoje[0] && h < hoje[1]) {
    return { aberto: true, texto: `Aberto agora · fecha às ${hora(hoje[1])}` }
  }
  if (hoje && h < hoje[0]) {
    return { aberto: false, texto: `Fechado · abre hoje às ${hora(hoje[0])}` }
  }
  // procura o próximo dia com expediente
  for (let i = 1; i <= 7; i++) {
    const d = (dia + i) % 7
    if (funcionamento[d]) {
      const quando = i === 1 ? 'amanhã' : NOMES[d]
      return { aberto: false, texto: `Fechado · abre ${quando} às ${hora(funcionamento[d][0])}` }
    }
  }
  return { aberto: false, texto: 'Fechado' }
}
