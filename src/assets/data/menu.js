import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import { fetchCategorias, fetchItens } from '@/services/menu.js'

export const useMenuStore = defineStore('menu', () => {
  // Os dados do cardápio vêm do banco de dados (API Django).
  const menu = ref([]) // [{ id, name, itens: [{ id, name, desc, preco, img, categoriaId, categoria }] }]
  let carregando = null

  async function fetchMenu() {
    const [categorias, itens] = await Promise.all([fetchCategorias(), fetchItens()])

    // ordem de criação no painel (Burgers antes de Bebidas), não alfabética
    menu.value = [...categorias].sort((a, b) => a.id - b.id).map((categoria) => ({
      id: categoria.id,
      name: categoria.nome,
      itens: itens
        .filter((item) => item.categoria === categoria.id)
        .map((item) => ({
          id: item.id,
          name: item.nome,
          desc: item.descricao,
          preco: Number(item.preco),
          img: item.imagem?.url ?? null,
          categoriaId: categoria.id,
          categoria: categoria.nome,
        })),
    }))
  }

  // carrega uma vez só (home, página do cardápio e página do item dividem os dados)
  function garantirMenu() {
    if (menu.value.length) return Promise.resolve()
    carregando ??= fetchMenu().finally(() => { carregando = null })
    return carregando
  }

  const todosItens = computed(() => menu.value.flatMap((c) => c.itens))
  const buscarItem = (id) => todosItens.value.find((i) => i.id === Number(id))

  return { menu, fetchMenu, garantirMenu, todosItens, buscarItem }
})
