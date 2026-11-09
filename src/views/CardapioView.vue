<script setup>
import { computed, onMounted, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { storeToRefs } from 'pinia';
import { useMenuStore } from '@/assets/data/menu.js';
import MenuCard from '@/components/menu/MenuCard.vue';

const route = useRoute();
const router = useRouter();
const menuStore = useMenuStore();
const { menu } = storeToRefs(menuStore);

const carregando = ref(true);
const erro = ref(false);
const busca = ref('');
const ordem = ref('padrao');

// a categoria escolhida fica na URL (?categoria=2) para dar para compartilhar o link
const categoriaId = computed(() => Number(route.query.categoria) || null);
function escolherCategoria(id) {
    router.replace({ query: id ? { categoria: id } : {} });
}

const normalizar = (t) => t.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();

const secoes = computed(() => {
    const termo = normalizar(busca.value.trim());
    const ordenar = (itens) => {
        if (ordem.value === 'menor') return [...itens].sort((a, b) => a.preco - b.preco);
        if (ordem.value === 'maior') return [...itens].sort((a, b) => b.preco - a.preco);
        return itens;
    };
    return menu.value
        .filter((c) => !categoriaId.value || c.id === categoriaId.value)
        .map((c) => ({
            ...c,
            itens: ordenar(c.itens.filter((i) => !termo || normalizar(`${i.name} ${i.desc}`).includes(termo))),
        }))
        .filter((c) => c.itens.length);
});

const totalEncontrado = computed(() => secoes.value.reduce((n, c) => n + c.itens.length, 0));

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
    <div class="page">
        <p class="eyebrow">Cardápio completo</p>
        <h1>Nossos <span class="highlight">lanches</span></h1>
        <p class="section-lead">Burgers, combos, porções e bebidas. Toque em um item para ver os detalhes.</p>

        <div class="filtros">
            <label class="busca">
                <span class="mdi mdi-magnify" aria-hidden="true"></span>
                <input v-model="busca" type="search" placeholder="Buscar: bacon, cheddar, batata..." aria-label="Buscar no cardápio" />
                <button v-if="busca" type="button" class="busca-limpar" aria-label="Limpar busca" @click="busca = ''">
                    <span class="mdi mdi-close"></span>
                </button>
            </label>

            <select v-model="ordem" aria-label="Ordenar por">
                <option value="padrao">Ordem do cardápio</option>
                <option value="menor">Menor preço</option>
                <option value="maior">Maior preço</option>
            </select>
        </div>

        <div class="chips" role="tablist" aria-label="Categorias">
            <button type="button" role="tab" class="chip" :class="{ 'is-active': !categoriaId }" :aria-selected="!categoriaId" @click="escolherCategoria(null)">
                Tudo
            </button>
            <button
                v-for="c in menu"
                :key="c.id"
                type="button"
                role="tab"
                class="chip"
                :class="{ 'is-active': categoriaId === c.id }"
                :aria-selected="categoriaId === c.id"
                @click="escolherCategoria(c.id)"
            >
                {{ c.name }} <span class="chip-count">{{ c.itens.length }}</span>
            </button>
        </div>

        <div v-if="carregando" class="grade">
            <div v-for="n in 4" :key="n" class="esqueleto"></div>
        </div>

        <div v-else-if="erro" class="empty-state">
            <span class="mdi mdi-wifi-off" aria-hidden="true"></span>
            <h2>Não foi possível carregar o cardápio</h2>
            <p>Verifique sua conexão e tente de novo em instantes.</p>
        </div>

        <div v-else-if="totalEncontrado === 0" class="empty-state">
            <span class="mdi mdi-food-off-outline" aria-hidden="true"></span>
            <h2>Nada encontrado</h2>
            <p>Nenhum item com "{{ busca }}"{{ categoriaId ? ' nesta categoria' : '' }}.</p>
            <button type="button" class="btn btn-outline" @click="busca = ''; escolherCategoria(null)">Ver tudo</button>
        </div>

        <template v-else>
            <p v-if="busca" class="resultado">{{ totalEncontrado }} {{ totalEncontrado === 1 ? 'item encontrado' : 'itens encontrados' }}</p>

            <section v-for="secao in secoes" :key="secao.id" class="secao">
                <h2 class="secao-titulo">{{ secao.name }} <small>{{ secao.itens.length }}</small></h2>
                <div class="grade">
                    <MenuCard v-for="item in secao.itens" :key="item.id" :item="item" />
                </div>
            </section>
        </template>
    </div>
</template>

<style scoped>
.section-lead {
    margin-bottom: 32px;
}

.filtros {
    display: flex;
    flex-wrap: wrap;
    gap: 12px;
    margin-bottom: 18px;
}

.busca {
    position: relative;
    flex: 1 1 320px;
    display: flex;
    flex-direction: row;
    align-items: center;
    gap: 0;
    margin: 0;
    border: 1px solid var(--border-color);
    border-radius: var(--radius-full);
    background-color: var(--background-card);
    transition: border-color 0.2s ease;
}

.busca:hover {
    border-color: var(--color-gray-500);
}

.busca:focus-within {
    border-color: var(--color-primary);
}

.busca > .mdi {
    padding-left: 18px;
    font-size: 1.3rem;
    color: var(--text-muted);
}

.page .busca input {
    flex: 1;
    border: none;
    background: none;
    padding: 13px 14px;
    outline: none;
}

.busca input::-webkit-search-cancel-button {
    display: none;
}

.busca-limpar {
    margin-right: 8px;
    width: 32px;
    height: 32px;
    border: none;
    border-radius: var(--radius-full);
    background: rgba(255, 255, 255, 0.06);
    color: var(--text-primary);
    cursor: pointer;
}

.page .filtros select {
    width: auto;
    flex: 0 0 auto;
    border-radius: var(--radius-full);
    padding: 12px 18px;
    cursor: pointer;
}

.chips {
    display: flex;
    gap: 10px;
    overflow-x: auto;
    padding-bottom: 6px;
    margin-bottom: 40px;
    scrollbar-width: none;
}

.chip {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    flex-shrink: 0;
    padding: 9px 18px;
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

.chip:hover {
    color: var(--text-primary);
    border-color: var(--color-gray-500);
}

.chip.is-active {
    background-color: var(--color-primary);
    border-color: var(--color-primary);
    color: #111;
}

.chip-count {
    min-width: 22px;
    padding: 1px 6px;
    border-radius: var(--radius-full);
    background-color: rgba(255, 255, 255, 0.08);
    font-size: 0.72rem;
    text-align: center;
}

.chip.is-active .chip-count {
    background-color: rgba(0, 0, 0, 0.15);
}

.resultado {
    color: var(--text-secondary);
    margin-bottom: 24px;
}

.secao + .secao {
    margin-top: 56px;
}

.page .secao-titulo {
    display: flex;
    align-items: baseline;
    gap: 12px;
    font-size: 2.2rem;
    margin-bottom: 24px;
    padding-bottom: 12px;
    border-bottom: 1px solid var(--border-color);
}

.secao-titulo small {
    font-family: 'Inter', sans-serif;
    font-size: var(--text-small);
    color: var(--text-muted);
}

.grade {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(min(100%, 260px), 1fr));
    gap: 28px;
}

.esqueleto {
    height: 420px;
    border-radius: var(--radius-lg);
    background: linear-gradient(100deg, #141414 30%, #1f1f1f 50%, #141414 70%) 0 0 / 300% 100%;
    animation: brilho 1.4s ease-in-out infinite;
}

@keyframes brilho {
    to {
        background-position: -150% 0;
    }
}

@media (prefers-reduced-motion: reduce) {
    .esqueleto {
        animation: none;
    }
}
</style>
