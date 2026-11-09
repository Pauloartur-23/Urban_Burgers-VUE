import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'
import { isAutenticado, usuarioLogado } from '@/services/usuario.js'
import { getMeusCurtidos, toggleCurtidoApi } from '@/services/curtidosApi.js'

function mapCurtidosDaApi(curtidos) {
  return curtidos.map((c) => ({
    id: c.item_detalhe.id,
    name: c.item_detalhe.nome,
    desc: c.item_detalhe.descricao,
    preco: Number(c.item_detalhe.preco),
    img: c.item_detalhe.imagem?.url ?? null,
  }))
}

export const useCurtidosStore = defineStore('curtidos', () => {
  const items = ref([]) // [{ id, name, desc, preco, img }]
  const router = useRouter()

  function isCurtido(id) {
    return items.value.some((item) => item.id === id)
  }

  async function hydrate() {
    if (!isAutenticado()) return
    try {
      items.value = mapCurtidosDaApi(await getMeusCurtidos())
    } catch {
      // se a API falhar, mantém os curtidos como estão
    }
  }

  // Curtir é só para quem tem conta: sem login vai para /login e volta para a mesma página depois.
  async function toggleCurtido(item) {
    if (usuarioLogado.value?.is_staff) return // admin não curte itens
    if (!isAutenticado()) {
      const atual = router.currentRoute.value
      router.push({ path: '/login', query: { next: atual.path === '/' ? '/#cardapio' : atual.fullPath, motivo: 'curtir' } })
      return
    }

    const existente = items.value.find((i) => i.id === item.id)
    if (existente) items.value = items.value.filter((i) => i.id !== item.id)
    else items.value.push(item)

    try {
      await toggleCurtidoApi(item.id)
    } catch {
      await hydrate() // não salvou: volta ao que está no servidor
    }
  }

  function removerCurtido(id) {
    const item = items.value.find((i) => i.id === id)
    if (item) toggleCurtido(item)
  }

  const totalCurtidos = computed(() => items.value.length)

  return { items, isCurtido, hydrate, toggleCurtido, removerCurtido, totalCurtidos }
})
