<script setup>
import { ref, computed, onMounted, onUnmounted, nextTick, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import AppBorderButton from '@/components/buttons/appBorderButton.vue';
import AppCicleButton from '@/components/buttons/appCircleButton.vue';
import AppLogo from '@/components/layout/logo/appLogo.vue';
import { useCartStore } from '@/stores/cart.js';
import { useCurtidosStore } from '@/stores/curtidos.js';
import { carregarUsuario, isAutenticado, logout, usuarioLogado } from '@/services/usuario.js';

const cart = useCartStore();
const curtidos = useCurtidosStore();
const router = useRouter();
const route = useRoute();

// admin não faz pedidos: o perfil dele leva direto ao painel e o carrinho some
const isStaff = computed(() => Boolean(usuarioLogado.value?.is_staff));
const primeiroNome = computed(() => {
    const u = usuarioLogado.value;
    return u ? (u.name || u.email).split(/[\s@]/)[0] : '';
});
const menuAberto = ref(false);
const logado = isAutenticado();
const totalCarrinho = computed(() => cart.totalPreco.toFixed(2).replace('.', ','));
const destinoPerfil = computed(() => (!logado ? '/login' : isStaff.value ? '/painel' : '/conta'));

// recarrega na home para carrinho, curtidos e header voltarem ao estado "deslogado"
function sair() {
    logout();
    window.location.href = '/';
}

function handleAuthClick() {
    router.push(destinoPerfil.value);
}

const navLinks = [
    { id: 'home', label: 'Home' },
    { id: 'cardapio', label: 'Cardápio', to: '/cardapio' }, // página própria
    { id: 'sobre', label: 'Sobre' },
    { id: 'contato', label: 'Contato' },
];

const isScrolled = ref(false);
const activeId = ref(navLinks[0].id);
const headerRef = ref(null);
const naHome = computed(() => route.path === '/');

let observer;

function handleScroll() {
    isScrolled.value = window.scrollY > 8;
}

function scrollToSection(id) {
    const section = document.getElementById(id);
    if (!section) return;

    const headerHeight = headerRef.value?.offsetHeight ?? 0;
    const top = section.getBoundingClientRect().top + window.scrollY - headerHeight;

    window.scrollTo({ top, behavior: 'smooth' });
}

async function goToSection(id) {
    menuAberto.value = false;
    if (route.path !== '/') {
        await router.push('/');
        await nextTick();
        setupScrollSpy();
    }

    scrollToSection(id);
}

function irPara(caminho) {
    menuAberto.value = false;
    router.push(caminho);
}

function setupScrollSpy(attempts = 0) {
    observer?.disconnect();
    const sections = navLinks
        .map((link) => document.getElementById(link.id))
        .filter(Boolean);

    if (sections.length < navLinks.length && attempts < 30) {
        requestAnimationFrame(() => setupScrollSpy(attempts + 1));
        return;
    }

    observer = new IntersectionObserver(
        (entries) => {
            const visible = entries
                .filter((entry) => entry.isIntersecting)
                .sort((a, b) => b.intersectionRatio - a.intersectionRatio);

            if (visible[0]) {
                activeId.value = visible[0].target.id;
            }
        },
        { rootMargin: '-35% 0px -55% 0px', threshold: [0, 0.25, 0.5, 0.75, 1] }
    );

    sections.forEach((section) => observer.observe(section));
}

// fecha o menu do celular ao trocar de página
watch(() => route.fullPath, () => { menuAberto.value = false; });

onMounted(() => {
    carregarUsuario();
    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    if (naHome.value) setupScrollSpy();
});

onUnmounted(() => {
    window.removeEventListener('scroll', handleScroll);
    observer?.disconnect();
});
</script>

<template>
    <header ref="headerRef" :class="{ 'is-scrolled': isScrolled || !naHome || menuAberto }">
        <div class="header-inner container">
            <a href="/" class="header-logo" aria-label="Urban Burger - Início" @click.prevent="goToSection('home')">
                <AppLogo />
            </a>

            <nav id="menu-principal" :class="{ 'is-open': menuAberto }" aria-label="Principal">
                <ul>
                    <li v-for="link in navLinks" :key="link.id">
                        <a
                            :href="link.to ?? `/#${link.id}`"
                            :class="{ 'is-active': (link.to && route.path.startsWith(link.to)) || (naHome && activeId === link.id) }"
                            @click.prevent="link.to ? irPara(link.to) : goToSection(link.id)"
                        >{{ link.label }}</a>
                    </li>
                    <li v-if="!isStaff" class="nav-mobile-only">
                        <a href="/curtidos" @click.prevent="irPara('/curtidos')">Curtidos</a>
                    </li>
                    <li class="nav-mobile-only">
                        <a :href="destinoPerfil" @click.prevent="irPara(destinoPerfil)">
                            {{ !logado ? 'Entrar' : isStaff ? 'Painel admin' : 'Minha conta' }}
                        </a>
                    </li>
                    <li v-if="logado" class="nav-mobile-only">
                        <a href="/" @click.prevent="sair">Sair da conta</a>
                    </li>
                </ul>
            </nav>

            <div class="header-actions">
                <ul class="header-icons">
                    <li v-if="!isStaff" class="header-cart hide-mobile">
                        <AppCicleButton aria-label="Favoritos" title="Curtidos" @click="router.push('/curtidos')">
                            <span class="mdi mdi-heart-outline"></span>
                        </AppCicleButton>
                        <span v-if="curtidos.totalCurtidos > 0" class="header-cart-badge">{{ curtidos.totalCurtidos }}</span>
                    </li>
                    <li v-if="!isStaff" class="header-cart">
                        <!-- com itens, o carrinho vira uma pílula amarela com o total do pedido -->
                        <button
                            type="button"
                            class="cart-btn"
                            :class="{ 'tem-itens': cart.totalItens > 0 }"
                            :aria-label="`Carrinho, ${cart.totalItens} itens`"
                            @click="cart.toggle"
                        >
                            <span class="mdi mdi-cart-outline"></span>
                            <span v-if="cart.totalItens > 0" class="cart-total">R$ {{ totalCarrinho }}</span>
                        </button>
                        <span v-if="cart.totalItens > 0" :key="cart.totalItens" class="header-cart-badge">{{ cart.totalItens }}</span>
                    </li>
                </ul>

                <span class="header-divider hide-mobile"></span>

                <button
                    v-if="logado"
                    type="button"
                    class="user-chip hide-mobile"
                    :title="isStaff ? 'Painel administrativo' : 'Minha conta'"
                    @click="handleAuthClick"
                >
                    <span class="user-avatar">
                        <span v-if="isStaff" class="mdi mdi-shield-crown-outline"></span>
                        <template v-else>{{ (primeiroNome || '?')[0].toUpperCase() }}</template>
                    </span>
                    <span class="user-nome">{{ isStaff ? 'Painel' : primeiroNome || 'Minha conta' }}</span>
                    <span class="mdi mdi-chevron-right"></span>
                </button>
                <button v-if="logado" type="button" class="sair-btn hide-mobile" title="Sair da conta" aria-label="Sair da conta" @click="sair">
                    <span class="mdi mdi-logout"></span>
                </button>
                <AppBorderButton v-else class="hide-mobile" @click="handleAuthClick">
                    Entrar
                    <span class="mdi mdi-login-variant"></span>
                </AppBorderButton>

                <button
                    type="button"
                    class="menu-toggle"
                    :aria-expanded="menuAberto"
                    aria-controls="menu-principal"
                    :aria-label="menuAberto ? 'Fechar menu' : 'Abrir menu'"
                    @click="menuAberto = !menuAberto"
                >
                    <span class="mdi" :class="menuAberto ? 'mdi-close' : 'mdi-menu'"></span>
                </button>
            </div>
        </div>
    </header>
</template>

<style scoped>
header {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    z-index: 100;
    background: linear-gradient(rgba(8, 8, 8, 0.7), rgba(8, 8, 8, 0));
    border-bottom: 1px solid transparent;
    transition: background-color 0.3s ease, border-color 0.3s ease, box-shadow 0.3s ease;
}

header.is-scrolled {
    background: rgba(8, 8, 8, 0.82);
    backdrop-filter: blur(14px);
    -webkit-backdrop-filter: blur(14px);
    border-bottom-color: var(--border-color);
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.3);
}

.header-inner {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 24px;
    height: var(--header-height);
    transition: height 0.3s ease;
}

/* ao rolar a página o header fica mais baixo */
header.is-scrolled .header-inner {
    height: 64px;
}

.header-logo {
    display: flex;
    align-items: center;
    line-height: 0;
}

.header-logo :deep(img) {
    transition: transform 0.3s ease, width 0.3s ease;
}

header.is-scrolled .header-logo :deep(img) {
    width: 112px;
}

.header-logo:hover :deep(img) {
    transform: scale(1.05) rotate(-2deg);
}

/* carrinho */
.cart-btn {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    min-width: 40px;
    height: 40px;
    padding: 0 11px;
    border: 1.5px solid var(--border-color);
    border-radius: var(--radius-full);
    background: none;
    color: var(--text-primary);
    font: inherit;
    font-size: 1.05rem;
    cursor: pointer;
    transition: background-color 0.2s ease, border-color 0.2s ease, color 0.2s ease, transform 0.15s ease;
}

.cart-btn:hover {
    border-color: var(--color-primary);
    color: var(--color-primary);
    transform: translateY(-1px);
}

.cart-btn.tem-itens {
    padding: 0 16px 0 13px;
    background-color: var(--color-primary);
    border-color: var(--color-primary);
    color: #111;
}

.cart-btn.tem-itens:hover {
    background-color: var(--color-primary-hover);
    color: #111;
}

.cart-total {
    font-size: var(--text-small);
    font-weight: 800;
    white-space: nowrap;
}

/* usuário logado */
.sair-btn {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 40px;
    height: 40px;
    border: 1.5px solid var(--border-color);
    border-radius: var(--radius-full);
    background: none;
    color: var(--text-secondary);
    font-size: 1.1rem;
    cursor: pointer;
    transition: border-color 0.2s ease, color 0.2s ease;
}

.sair-btn:hover {
    border-color: #dc3545;
    color: #ff8a95;
}

.user-chip {
    display: inline-flex;
    align-items: center;
    gap: 10px;
    height: 40px;
    padding: 0 10px 0 4px;
    border: 1.5px solid var(--border-color);
    border-radius: var(--radius-full);
    background: none;
    color: var(--text-primary);
    font: inherit;
    font-size: var(--text-small);
    font-weight: 700;
    cursor: pointer;
    transition: border-color 0.2s ease, background-color 0.2s ease;
}

.user-chip:hover {
    border-color: var(--color-primary);
    background-color: rgba(255, 255, 255, 0.04);
}

.user-chip .mdi {
    color: var(--text-muted);
    transition: transform 0.2s ease, color 0.2s ease;
}

.user-chip:hover .mdi {
    color: var(--color-primary);
    transform: translateX(2px);
}

.user-avatar {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 30px;
    height: 30px;
    border-radius: var(--radius-full);
    background-color: var(--color-primary);
    color: #111;
    font-weight: 800;
}

.user-nome {
    max-width: 110px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
}

/* Nav */
nav ul {
    display: flex;
    list-style: none;
    gap: 36px;
}

nav ul li a {
    position: relative;
    display: inline-block;
    padding: 6px 0;
    text-decoration: none;
    color: var(--text-primary);
    font-size: var(--text-small);
    font-weight: var(--font-weight-bold);
    letter-spacing: 0.06em;
    text-transform: uppercase;
    transition: color 0.2s ease;
}

nav ul li a::after {
    content: "";
    position: absolute;
    left: 0;
    bottom: 0;
    width: 0;
    height: 2px;
    background-color: var(--color-primary);
    transition: width 0.25s ease;
}

nav ul li a:hover,
nav ul li a:focus-visible,
nav ul li a.is-active {
    color: var(--color-primary);
}

nav ul li a:hover::after,
nav ul li a:focus-visible::after,
nav ul li a.is-active::after {
    width: 100%;
}

.nav-mobile-only {
    display: none;
}

/* Actions */
.header-actions {
    display: flex;
    align-items: center;
    gap: 16px;
}

.header-icons {
    display: flex;
    list-style: none;
    align-items: center;
    gap: 10px;
}

.header-cart {
    position: relative;
}

.header-cart-badge {
    position: absolute;
    top: -4px;
    right: -4px;
    min-width: 18px;
    height: 18px;
    padding: 0 4px;
    border-radius: var(--radius-full);
    background-color: var(--color-primary);
    color: #111;
    border: 2px solid var(--background-primary, #000);
    font-size: 0.65rem;
    font-weight: var(--font-weight-bold);
    display: flex;
    align-items: center;
    justify-content: center;
    pointer-events: none;
    animation: badge-pulo 0.35s ease;
}

/* o contador "pula" a cada item adicionado (a :key muda e recria o elemento) */
@keyframes badge-pulo {
    40% {
        transform: scale(1.35);
    }
}

.cart-btn.tem-itens + .header-cart-badge {
    background-color: #fff;
}

.header-divider {
    width: 1px;
    height: 24px;
    background-color: var(--border-color);
}

.menu-toggle {
    display: none;
    width: 40px;
    height: 40px;
    border: 1.5px solid var(--border-color);
    border-radius: var(--radius);
    background: none;
    color: var(--text-primary);
    font-size: 1.4rem;
    cursor: pointer;
}

@media (max-width: 900px) {
    .menu-toggle {
        display: inline-flex;
        align-items: center;
        justify-content: center;
    }

    .hide-mobile {
        display: none;
    }

    nav {
        position: absolute;
        top: 100%;
        left: 0;
        right: 0;
        background: rgba(8, 8, 8, 0.97);
        border-bottom: 1px solid var(--border-color);
        transform: translateY(-8px);
        opacity: 0;
        visibility: hidden;
        transition: opacity 0.2s ease, transform 0.2s ease, visibility 0.2s;
    }

    nav.is-open {
        transform: none;
        opacity: 1;
        visibility: visible;
    }

    nav ul {
        flex-direction: column;
        gap: 0;
        width: min(var(--container), 100% - 48px);
        margin: 0 auto;
        padding: 8px 0 16px;
    }

    nav ul li a {
        display: block;
        padding: 14px 0;
        font-size: 1rem;
        border-bottom: 1px solid var(--border-color);
    }

    nav ul li a::after {
        display: none;
    }

    .nav-mobile-only {
        display: block;
    }
}
</style>
