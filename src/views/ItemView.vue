<script setup>
import { computed, ref, watch } from 'vue';
import { useRoute } from 'vue-router';
import { useMenuStore } from '@/assets/data/menu.js';
import { useCartStore } from '@/stores/cart.js';
import { useCurtidosStore } from '@/stores/curtidos.js';
import MenuCard from '@/components/menu/MenuCard.vue';
import { usuarioLogado } from '@/services/usuario.js';

const route = useRoute();
const menuStore = useMenuStore();
const cart = useCartStore();
const curtidos = useCurtidosStore();
const ehAdmin = computed(() => Boolean(usuarioLogado.value?.is_staff));

const carregando = ref(true);
const erro = ref(false);
const qtd = ref(1);
const adicionado = ref(false);

const item = computed(() => menuStore.buscarItem(route.params.id));
const curtido = computed(() => item.value && curtidos.isCurtido(item.value.id));
const noCarrinho = computed(() => cart.items.find((i) => i.id === item.value?.id)?.qtd ?? 0);
const relacionados = computed(() =>
    menuStore.todosItens.filter((i) => i.categoriaId === item.value?.categoriaId && i.id !== item.value?.id).slice(0, 4)
);

const brl = (v) => v.toFixed(2).replace('.', ',');

// ao trocar de item (clicando num relacionado) volta a quantidade para 1
watch(
    () => route.params.id,
    async () => {
        qtd.value = 1;
        adicionado.value = false;
        try {
            await menuStore.garantirMenu();
            if (item.value) document.title = `${item.value.name} | Urban Burger`;
        } catch {
            erro.value = true;
        } finally {
            carregando.value = false;
        }
    },
    { immediate: true }
);

async function adicionar() {
    await cart.addItem(item.value, qtd.value);
    if (noCarrinho.value) {
        adicionado.value = true;
        setTimeout(() => { adicionado.value = false; }, 2500);
    }
}
</script>

<template>
    <div class="page">
        <nav class="trilha" aria-label="Você está em">
            <router-link to="/cardapio">Cardápio</router-link>
            <template v-if="item">
                <span class="mdi mdi-chevron-right" aria-hidden="true"></span>
                <router-link :to="{ path: '/cardapio', query: { categoria: item.categoriaId } }">{{ item.categoria }}</router-link>
                <span class="mdi mdi-chevron-right" aria-hidden="true"></span>
                <span aria-current="page">{{ item.name }}</span>
            </template>
        </nav>

        <div v-if="carregando" class="item-layout">
            <div class="esqueleto foto"></div>
            <div class="esqueleto texto"></div>
        </div>

        <div v-else-if="erro || !item" class="empty-state">
            <span class="mdi mdi-hamburger-remove" aria-hidden="true"></span>
            <h2>{{ erro ? 'Não foi possível carregar este item' : 'Item não encontrado' }}</h2>
            <p>{{ erro ? 'Tente de novo em instantes.' : 'Ele pode ter saído do cardápio.' }}</p>
            <router-link to="/cardapio" class="btn btn-primary">Ver cardápio <span class="mdi mdi-arrow-right"></span></router-link>
        </div>

        <template v-else>
            <article class="item-layout">
                <div class="item-foto">
                    <img v-if="item.img" :src="item.img" :alt="item.name" />
                    <span v-else class="mdi mdi-hamburger" aria-hidden="true"></span>
                </div>

                <div class="item-info">
                    <router-link :to="{ path: '/cardapio', query: { categoria: item.categoriaId } }" class="item-categoria">
                        {{ item.categoria }}
                    </router-link>
                    <h1>{{ item.name }}</h1>
                    <p class="item-preco"><small>R$</small> {{ brl(item.preco) }}</p>
                    <p class="item-desc">{{ item.desc }}</p>

                    <p v-if="ehAdmin" class="item-admin">
                        <span class="mdi mdi-shield-crown-outline"></span>
                        Você está como administrador e não faz pedidos.
                        <router-link to="/painel" class="btn btn-outline">Editar no painel</router-link>
                    </p>

                    <div v-else class="item-acoes">
                        <div class="qtd" role="group" aria-label="Quantidade">
                            <button type="button" aria-label="Diminuir" :disabled="qtd <= 1" @click="qtd--">
                                <span class="mdi mdi-minus"></span>
                            </button>
                            <span aria-live="polite">{{ qtd }}</span>
                            <button type="button" aria-label="Aumentar" :disabled="qtd >= 20" @click="qtd++">
                                <span class="mdi mdi-plus"></span>
                            </button>
                        </div>

                        <button type="button" class="btn btn-primary adicionar" @click="adicionar">
                            <span class="mdi mdi-cart-plus"></span>
                            Adicionar · R$ {{ brl(item.preco * qtd) }}
                        </button>

                        <button
                            type="button"
                            class="curtir"
                            :class="{ 'is-curtido': curtido }"
                            :aria-pressed="curtido"
                            :aria-label="curtido ? 'Descurtir' : 'Curtir'"
                            @click="curtidos.toggleCurtido(item)"
                        >
                            <span class="mdi" :class="curtido ? 'mdi-heart' : 'mdi-heart-outline'"></span>
                        </button>
                    </div>

                    <Transition v-if="!ehAdmin" name="aviso" mode="out-in">
                        <p v-if="adicionado" class="item-aviso">
                            <span class="mdi mdi-check-circle"></span> Adicionado! Você tem {{ noCarrinho }} no carrinho.
                            <button type="button" @click="cart.open">Ver pedido</button>
                        </p>
                        <p v-else-if="noCarrinho" class="item-no-carrinho">
                            <span class="mdi mdi-cart-outline"></span> {{ noCarrinho }} no seu carrinho
                        </p>
                    </Transition>

                    <ul class="item-extras">
                        <li><span class="mdi mdi-moped-outline"></span> Entrega na sua casa</li>
                        <li><span class="mdi mdi-whatsapp"></span> Pedido finalizado pelo WhatsApp</li>
                    </ul>
                </div>
            </article>

            <section v-if="relacionados.length" class="relacionados">
                <h2>Você também vai <span class="highlight">gostar</span></h2>
                <div class="grade">
                    <MenuCard v-for="r in relacionados" :key="r.id" :item="r" />
                </div>
            </section>
        </template>
    </div>
</template>

<style scoped>
.trilha {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: 6px;
    margin-bottom: 28px;
    color: var(--text-muted);
    font-size: var(--text-small);
}

.page .trilha a {
    color: var(--text-secondary);
    text-decoration: none;
    transition: color 0.2s ease;
}

.page .trilha a:hover {
    color: var(--color-primary);
}

.trilha [aria-current] {
    color: var(--text-primary);
}

.item-layout {
    display: grid;
    grid-template-columns: minmax(0, 1.1fr) minmax(0, 1fr);
    gap: 56px;
    align-items: center;
}

.item-foto {
    position: relative;
    aspect-ratio: 1;
    border-radius: var(--radius-lg);
    border: 1px solid var(--border-color);
    background-color: var(--background-card);
    overflow: hidden;
    display: flex;
    align-items: center;
    justify-content: center;
    animation: entra-foto 0.6s cubic-bezier(0.2, 0.7, 0.2, 1) both;
}

.item-foto img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform 0.6s ease;
}

.item-foto:hover img {
    transform: scale(1.05);
}

.item-foto > .mdi {
    font-size: 6rem;
    color: var(--color-gray-500);
}

.item-info {
    animation: entra-info 0.6s cubic-bezier(0.2, 0.7, 0.2, 1) 0.1s both;
}

.page .item-categoria {
    display: inline-block;
    margin-bottom: 14px;
    padding: 6px 14px;
    border: 1px solid var(--border-color);
    border-radius: var(--radius-full);
    color: var(--text-secondary);
    font-size: 0.75rem;
    font-weight: 700;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    text-decoration: none;
    transition: border-color 0.2s ease, color 0.2s ease;
}

.page .item-categoria:hover {
    border-color: var(--color-primary);
    color: var(--color-primary);
}

.page .item-info h1 {
    font-size: clamp(3rem, 6vw, 4.5rem);
    margin-bottom: 12px;
}

.item-preco {
    font-size: 2rem;
    font-weight: 800;
    color: var(--color-primary);
}

.item-preco small {
    font-size: 1rem;
}

.item-desc {
    max-width: 48ch;
    margin: 16px 0 32px;
    color: var(--text-secondary);
    font-size: 1.1rem;
    line-height: 1.65;
}

.item-admin {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: 10px 14px;
    padding: 14px 16px;
    border: 1px solid var(--border-color);
    border-radius: var(--radius);
    background-color: var(--background-card);
    color: var(--text-secondary);
}

.item-admin > .mdi {
    color: var(--color-primary);
    font-size: 1.3rem;
}

.item-acoes {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: 12px;
}

.qtd {
    display: flex;
    align-items: center;
    gap: 6px;
    padding: 4px;
    border: 1px solid var(--border-color);
    border-radius: var(--radius-full);
}

.qtd span {
    min-width: 2ch;
    text-align: center;
    font-weight: 800;
    font-size: 1.1rem;
}

.qtd button,
.curtir {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 40px;
    height: 40px;
    border: none;
    border-radius: var(--radius-full);
    background: none;
    color: var(--text-primary);
    font-size: 1.15rem;
    cursor: pointer;
    transition: background-color 0.2s ease, color 0.2s ease, transform 0.15s ease;
}

.qtd button:hover:not(:disabled) {
    background-color: var(--color-primary);
    color: #111;
}

.qtd button:disabled {
    opacity: 0.35;
    cursor: not-allowed;
}

.adicionar {
    flex: 1;
    min-width: 220px;
    padding-block: 14px;
    font-size: 1rem;
}

.curtir {
    width: 50px;
    height: 50px;
    border: 1px solid var(--border-color);
    font-size: 1.4rem;
}

.curtir:hover {
    border-color: #ff4d6d;
    transform: scale(1.06);
}

.curtir.is-curtido {
    color: #ff4d6d;
    border-color: #ff4d6d;
}

.item-aviso,
.item-no-carrinho {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: 8px;
    margin-top: 16px;
    font-size: var(--text-small);
}

.item-aviso {
    color: #6ee7a0;
}

.item-aviso button {
    border: none;
    background: none;
    color: var(--color-primary);
    font: inherit;
    font-weight: 700;
    text-decoration: underline;
    cursor: pointer;
}

.item-no-carrinho {
    color: var(--text-secondary);
}

.aviso-enter-active,
.aviso-leave-active {
    transition: opacity 0.25s ease, transform 0.25s ease;
}

.aviso-enter-from,
.aviso-leave-to {
    opacity: 0;
    transform: translateY(-6px);
}

.item-extras {
    display: flex;
    flex-wrap: wrap;
    gap: 10px 24px;
    list-style: none;
    margin-top: 28px;
    padding-top: 22px;
    border-top: 1px solid var(--border-color);
    color: var(--text-secondary);
    font-size: var(--text-small);
}

.item-extras .mdi {
    color: var(--color-primary);
    margin-right: 6px;
}

.relacionados {
    margin-top: 88px;
}

.page .relacionados h2 {
    font-size: clamp(2rem, 4vw, 2.75rem);
    margin-bottom: 28px;
}

.grade {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(min(100%, 250px), 1fr));
    gap: 28px;
}

.esqueleto {
    border-radius: var(--radius-lg);
    background: linear-gradient(100deg, #141414 30%, #1f1f1f 50%, #141414 70%) 0 0 / 300% 100%;
    animation: brilho 1.4s ease-in-out infinite;
}

.esqueleto.foto {
    aspect-ratio: 1;
}

.esqueleto.texto {
    height: 320px;
}

@keyframes brilho {
    to {
        background-position: -150% 0;
    }
}

@keyframes entra-foto {
    from {
        opacity: 0;
        transform: scale(0.96);
    }
}

@keyframes entra-info {
    from {
        opacity: 0;
        transform: translateX(24px);
    }
}

@media (max-width: 860px) {
    .item-layout {
        grid-template-columns: 1fr;
        gap: 28px;
    }

    .item-foto {
        aspect-ratio: 4 / 3;
    }
}

@media (prefers-reduced-motion: reduce) {
    .item-foto,
    .item-info,
    .esqueleto {
        animation: none;
    }
}
</style>
