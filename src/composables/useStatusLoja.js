import { onUnmounted, ref } from 'vue'
import { LOJA } from '@/config/loja.js'
import { statusLoja } from '@/utils/horario.js'

// status "Aberto agora / Fechado" que se atualiza sozinho a cada minuto
export function useStatusLoja() {
  const status = ref(statusLoja(LOJA.funcionamento))
  const timer = setInterval(() => { status.value = statusLoja(LOJA.funcionamento) }, 60_000)
  onUnmounted(() => clearInterval(timer))
  return status
}
