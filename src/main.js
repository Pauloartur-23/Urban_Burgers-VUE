import './assets/css/main.css'
import './assets/css/theme.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'
import { reveal } from './directives/reveal.js'

const app = createApp(App)

app.directive('reveal', reveal)

app.use(createPinia())
app.use(router)

// Erro inesperado na tela: mostra a página de erro em vez de deixar o site quebrado/em branco
app.config.errorHandler = (erro) => {
  console.error(erro)
  if (router.currentRoute.value.name !== 'erro') router.replace({ name: 'erro' })
}
router.onError((erro) => {
  console.error(erro)
  router.replace({ name: 'erro' })
})

// Tela de carregamento (em index.html): sai depois que a primeira página está pronta.
// Fica no mínimo 600ms para não "piscar" quando o site carrega rápido.
const inicio = performance.now()
router.isReady().then(() => {
  app.mount('#app')
  const splash = document.getElementById('splash')
  if (!splash) return
  const espera = Math.max(0, 600 - (performance.now() - inicio))
  setTimeout(() => {
    splash.classList.add('saindo')
    setTimeout(() => splash.remove(), 700) // depois do fade de 0,5s
  }, espera)
})
