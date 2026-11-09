import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import { isAutenticado } from '@/services/usuario.js'
import { useRouter } from 'vue-router'
import {
  adicionarItemCarrinho,
  finalizarPedido,
  getCarrinho,
  limparCarrinho,
  removerItemCarrinho,
} from '@/services/carrinho.js'

function mapCarrinhoDaApi(carrinho) {
  return carrinho.itens_detalhe.map((ci) => ({
    id: ci.item_detalhe.id,
    name: ci.item_detalhe.nome,
    preco: Number(ci.item_detalhe.preco),
    img: ci.item_detalhe.imagem?.url ?? null,
    qtd: ci.quantidade,
  }))
}

export const useCartStore = defineStore('cart', () => {
  const items = ref([]) // [{ id, name, preco, img, qtd }]
  const isOpen = ref(false)
  // via inject (e não import): importar o router aqui criava um ciclo router -> páginas -> carrinho -> router
  const router = useRouter()

  // Carrinho é só para quem está logado: sem login, manda para /login e volta para cá depois.
  function exigirLogin() {
    if (isAutenticado()) return true
    const atual = router.currentRoute.value
    router.push({ path: '/login', query: { next: atual.path === '/' ? '/#cardapio' : atual.fullPath, motivo: 'carrinho' } })
    return false
  }

  function open() {
    if (exigirLogin()) isOpen.value = true
  }

  function close() {
    isOpen.value = false
  }

  function toggle() {
    if (isOpen.value) close()
    else open()
  }

  async function hydrate() {
    if (!isAutenticado()) return
    try {
      items.value = mapCarrinhoDaApi(await getCarrinho())
    } catch {
      // se a API falhar, mantém o carrinho local como está
    }
  }

  // mudanças aparecem na hora; se a API falhar, recarrega do servidor para não mostrar algo que não foi salvo
  async function sincronizar(chamada) {
    try {
      await chamada()
    } catch {
      await hydrate()
    }
  }

  async function addItem(item, qtd = 1) {
    if (!exigirLogin()) return
    const existing = items.value.find((i) => i.id === item.id)
    if (existing) existing.qtd += qtd
    else items.value.push({ id: item.id, name: item.name, preco: item.preco, img: item.img ?? null, qtd })
    await sincronizar(() => adicionarItemCarrinho(item.id, qtd))
  }

  async function decreaseItem(id) {
    const existing = items.value.find((i) => i.id === id)
    if (!existing) return
    existing.qtd -= 1
    if (existing.qtd <= 0) items.value = items.value.filter((i) => i.id !== id)
    await sincronizar(() => removerItemCarrinho(id, 1))
  }

  async function removeItem(id) {
    const existing = items.value.find((i) => i.id === id)
    if (!existing) return
    items.value = items.value.filter((i) => i.id !== id)
    await sincronizar(() => removerItemCarrinho(id, existing.qtd))
  }

  async function clear() {
    items.value = []
    await sincronizar(limparCarrinho)
  }

  // envia o pedido para o servidor; o carrinho fica vazio e o pedido volta com número
  async function finalizar(dados) {
    const pedido = await finalizarPedido(dados)
    items.value = []
    return pedido
  }

  const totalItens = computed(() => items.value.reduce((acc, item) => acc + item.qtd, 0))
  const totalPreco = computed(() => items.value.reduce((acc, item) => acc + item.qtd * item.preco, 0))

  return {
    items,
    isOpen,
    open,
    close,
    toggle,
    hydrate,
    addItem,
    removeItem,
    decreaseItem,
    clear,
    finalizar,
    totalItens,
    totalPreco,
  }
})
