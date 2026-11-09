const moeda = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' })

// 65.8 -> "R$ 65,80" (o mesmo formato no site todo)
export const brl = (valor) => moeda.format(Number(valor) || 0).replace(/ /g, ' ')

const dataHora = new Intl.DateTimeFormat('pt-BR', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' })
export const formatarDataHora = (iso) => (iso ? dataHora.format(new Date(iso)) : '')
