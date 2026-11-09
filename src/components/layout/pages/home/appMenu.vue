<script setup>
import { computed, onMounted, ref } from 'vue';
import { storeToRefs } from 'pinia';
import { useMenuStore } from '@/assets/data/menu.js';
import MenuCard from '@/components/menu/MenuCard.vue';

const menuStore = useMenuStore();
const { menu } = storeToRefs(menuStore);

const carregando = ref(true);
const erro = ref(false);
const selecionadaId = ref(null);

// mostra só categorias com itens; a primeira fica selecionada
const categorias = computed(() => menu.value.filter((c) => c.itens.length));
const categoriaAtual = computed(
    () => categorias.value.find((c) => c.id === selecionadaId.value) ?? categorias.value[0]
);

onMounted(async () => {
    try {
        await menuStore.garantirMenu();
    } catch {
        erro.value = true;
    } finally {
        carregando.value = false;
    }
});
</script>

<template>
    <section id="cardapio" class="section">
        <div class="container">
            <div v-reveal class="menu-header">
                <div>
                    <p class="eyebrow">Cardápio</p>
                    <h2 class="section-title">Escolha seu <span class="highlight">Urban</span></h2>
                </div>
                <div class="menu-header-lado">
                    <p class="section-lead">Monte seu pedido, escolha onde entregar e finalize direto pelo WhatsApp.</p>
                    <router-link to="/cardapio" class="menu-ver-tudo">
                        Ver cardápio completo <span class="mdi mdi-arrow-right"></span>
                    </router-link>
                </div>
            </div>

            <div v-if="categorias.length" class="menu-tabs" role="tablist" aria-label="Categorias do cardápio">
                <button
                    v-for="cat in categorias"
                    :key="cat.id"
                    type="button"
                    role="tab"
                    class="menu-tab"
                    :class="{ 'is-active': categoriaAtual?.id === cat.id }"
                    :aria-selected="categoriaAtual?.id === cat.id"
                    @click="selecionadaId = cat.id"
                >
                    {{ cat.name }} <span class="menu-tab-count">{{ cat.itens.length }}</span>
                </button>
            </div>

            <div v-if="carregando" class="menu-grid">
                <div v-for="n in 3" :key="n" class="menu-skeleton"></div>
            </div>

            <p v-else-if="erro" class="menu-aviso">
                <span class="mdi mdi-wifi-off"></span> Não foi possível carregar o cardápio agora. Tente novamente em instantes.
            </p>

            <p v-else-if="!categoriaAtual" class="menu-aviso">O cardápio ainda está vazio.</p>

            <div v-else class="menu-grid">
                <MenuCard v-for="(item, i) in categoriaAtual.itens" :key="item.id" v-reveal="i * 80" :item="item" />
            </div>
        </div>
    </section>
</template>

<style scoped>
.menu-header {
    display: flex;
    align-items: flex-end;
    justify-content: space-between;
    gap: 24px 48px;
    flex-wrap: wrap;
    margin-bottom: 36px;
}

.menu-ver-tudo {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    margin-top: 14px;
    color: var(--color-primary);
    font-size: var(--text-small);
    font-weight: 700;
    letter-spacing: 0.06em;
    text-transform: uppercase;
    text-decoration: none;
    transition: gap 0.2s ease, color 0.2s ease;
}

.menu-ver-tudo:hover {
    gap: 14px;
    color: var(--color-primary-hover);
}

.menu-header .section-lead {
    max-width: 38ch;
}

.menu-tabs {
    display: flex;
    gap: 10px;
    overflow-x: auto;
    padding-bottom: 4px;
    margin-bottom: 36px;
    scrollbar-width: none;
}

.menu-tab {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    flex-shrink: 0;
    padding: 10px 18px;
    border: 1px solid var(--border-color);
    border-radius: var(--radius-full);
    background: none;
    color: var(--text-secondary);
    font: inherit;
    font-size: var(--text-small);
    font-weight: 700;
    letter-spacing: 0.06em;
    text-transform: uppercase;
    cursor: pointer;
    transition: color 0.2s ease, border-color 0.2s ease, background-color 0.2s ease;
}

.menu-tab:hover {
    color: var(--text-primary);
    border-color: var(--color-gray-500);
}

.menu-tab.is-active {
    background-color: var(--color-primary);
    border-color: var(--color-primary);
    color: #111;
}

.menu-tab-count {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    min-width: 22px;
    height: 22px;
    padding: 0 6px;
    border-radius: var(--radius-full);
    background-color: rgba(255, 255, 255, 0.08);
    font-size: 0.72rem;
}

.menu-tab.is-active .menu-tab-count {
    background-color: rgba(0, 0, 0, 0.15);
}

.menu-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(min(100%, 270px), 1fr));
    gap: 28px;
}

.menu-skeleton {
    height: 420px;
    border-radius: var(--radius-lg);
    background: linear-gradient(100deg, #141414 30%, #1f1f1f 50%, #141414 70%) 0 0 / 300% 100%;
    animation: brilho 1.4s ease-in-out infinite;
}

.menu-aviso {
    padding: 40px;
    border: 1px dashed var(--border-color);
    border-radius: var(--radius-lg);
    color: var(--text-secondary);
    text-align: center;
}

@keyframes brilho {
    to {
        background-position: -150% 0;
    }
}

@media (prefers-reduced-motion: reduce) {
    .menu-skeleton {
        animation: none;
    }
}
</style>
