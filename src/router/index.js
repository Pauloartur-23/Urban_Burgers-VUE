import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import NotFoundView from '../views/NotFoundView.vue'
import LoginView from '../views/LoginView.vue'
import RegistroView from '../views/RegistroView.vue'
import EsqueciSenhaView from '../views/EsqueciSenhaView.vue'
import RedefinirSenhaView from '../views/RedefinirSenhaView.vue'
import UsuarioView from '../views/UsuarioView.vue'
import CurtidosView from '../views/CurtidosView.vue'
import AdminView from '../views/AdminView.vue'
import AuthLayout from '../components/auth/AuthLayout.vue'
import CardapioView from '../views/CardapioView.vue'
import ItemView from '../views/ItemView.vue'
import FinalizarView from '../views/FinalizarView.vue'
import PedidoView from '../views/PedidoView.vue'
import ErroView from '../views/ErroView.vue'
import { carregarUsuario, isAutenticado } from '../services/usuario.js'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  // toda página nova abre no topo (voltar/avançar mantém a posição)
  // (só mudou o ?filtro da mesma página: não rola)
  scrollBehavior: (to, from, salvo) => {
    if (salvo) return salvo
    if (to.hash) return { el: to.hash, top: 76, behavior: 'smooth' }
    return to.path === from.path ? false : { top: 0 }
  },
  routes: [
    {
      path: '/cardapio',
      name: 'cardapio',
      component: CardapioView,
    },
    {
      path: '/cardapio/:id(\\d+)',
      name: 'item',
      component: ItemView,
    },
    {
      path: '/',
      name: 'home',
      component: HomeView,
    },
    {
      // Login, cadastro e senha dividem o mesmo layout: assim o painel escuro
      // pode deslizar de um lado para o outro ao trocar de página.
      path: '/acesso',
      component: AuthLayout,
      redirect: '/login',
      children: [
        { path: '/login', name: 'login', component: LoginView, meta: { painelDireita: true } },
        { path: '/registro', name: 'registro', component: RegistroView, meta: { painelDireita: false } },
        { path: '/esqueci-senha', name: 'esqueci-senha', component: EsqueciSenhaView, meta: { painelDireita: false } },
        { path: '/redefinir-senha', name: 'redefinir-senha', component: RedefinirSenhaView, meta: { painelDireita: false } },
      ],
    },
    {
      path: '/conta',
      name: 'conta',
      component: UsuarioView,
      meta: { requerLogin: true },
    },
    {
      path: '/finalizar',
      name: 'finalizar',
      component: FinalizarView,
      meta: { requerLogin: true },
    },
    {
      path: '/pedidos/:id(\\d+)',
      name: 'pedido',
      component: PedidoView,
      meta: { requerLogin: true },
    },
    {
      path: '/curtidos',
      name: 'curtidos',
      component: CurtidosView,
      meta: { requerLogin: true, motivo: 'curtir' },
    },
    {
      path: '/painel',
      name: 'painel',
      component: AdminView,
      meta: { requerLogin: true },
    },
    {
      path: '/erro',
      name: 'erro',
      component: ErroView,
    },
    {
      path: '/:pathMatch(.*)*',
      name: 'not-found',
      component: NotFoundView
    }
  ],
})

// páginas da conta: sem login vai para /login e volta depois de entrar
// páginas de cliente (conta, pedido, curtidos): o admin não faz pedidos, então vai para o painel
const SO_CLIENTE = ['conta', 'finalizar', 'pedido', 'curtidos']

router.beforeEach(async (to) => {
  if (to.meta.requerLogin && !isAutenticado()) {
    return { path: '/login', query: { next: to.fullPath, ...(to.meta.motivo && { motivo: to.meta.motivo }) } }
  }
  if (SO_CLIENTE.includes(to.name) && (await carregarUsuario())?.is_staff) return { path: '/painel' }
  // já logado não precisa ver login/cadastro
  if (['login', 'registro'].includes(to.name) && isAutenticado()) return { path: '/conta' }
})

// título da aba por página
const TITULOS = {
  cardapio: 'Cardápio', item: 'Cardápio', login: 'Entrar', registro: 'Criar conta', conta: 'Minha conta',
  finalizar: 'Finalizar pedido', pedido: 'Pedido', curtidos: 'Curtidos', painel: 'Painel', 'not-found': 'Página não encontrada', erro: 'Algo deu errado',
}
router.afterEach((to) => {
  document.title = TITULOS[to.name] ? `${TITULOS[to.name]} | Urban Burger` : 'Urban Burger | Burgers artesanais com delivery'
})

export default router
