// Verificação rápida da regra "aberto/fechado": node scripts/check-horario.mjs
import assert from 'node:assert/strict'
import { statusLoja } from '../src/utils/horario.js'

const f = { 1: [18, 23], 2: [18, 23], 3: [18, 23], 4: [18, 23], 5: [18, 24], 6: [18, 24], 0: [18, 24] }
const em = (iso) => statusLoja(f, new Date(iso))

// 2026-11-09 é segunda-feira
assert.deepEqual(em('2026-11-09T19:00'), { aberto: true, texto: 'Aberto agora · fecha às 23h' })
assert.deepEqual(em('2026-11-09T10:00'), { aberto: false, texto: 'Fechado · abre hoje às 18h' })
assert.deepEqual(em('2026-11-09T23:30'), { aberto: false, texto: 'Fechado · abre amanhã às 18h' })
assert.deepEqual(em('2026-11-13T23:30'), { aberto: true, texto: 'Aberto agora · fecha às 0h' }) // sexta
assert.equal(statusLoja({ 3: [18, 22] }, new Date('2026-11-09T19:00')).texto, 'Fechado · abre quarta às 18h')
assert.equal(statusLoja({}, new Date()).texto, 'Fechado')
console.log('horario ok')
