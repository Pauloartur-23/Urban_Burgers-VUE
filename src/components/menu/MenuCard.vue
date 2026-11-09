<script setup>
// Card de um item do cardápio (usado na home e em "Meus curtidos").
import { computed } from 'vue';
import { useCartStore } from '@/stores/cart.js';
import { useCurtidosStore } from '@/stores/curtidos.js';
import { usuarioLogado } from '@/services/usuario.js';

const props = defineProps({
    item: { type: Object, required: true }, // { id, name, desc, preco, img }
});

const cart = useCartStore();
const curtidos = useCurtidosStore();

const qtd = computed(() => cart.items.find((i) => i.id === props.item.id)?.qtd ?? 0);
const curtido = computed(() => curtidos.isCurtido(props.item.id));
const preco = computed(() => props.item.preco.toFixed(2).replace('.', ','));
// admin só vê o cardápio: não curte nem adiciona ao carrinho
const ehAdmin = computed(() => Boolean(usuarioLogado.value?.is_staff));
</script>

<template>
    <article class="menu-card">
        <div class="menu-card-image">
            <!-- foto e nome levam para a página do item (o nome é o link acessível; a foto é atalho para o mouse) -->
            <router-link :to="`/cardapio/${item.id}`" class="menu-card-foto" tabindex="-1" aria-hidden="true">
                <img v-if="item.img" :src="item.img" alt="" loading="lazy" />
                <span v-else class="mdi mdi-hamburger menu-card-placeholder"></span>
                <span class="menu-card-ver">Ver detalhes <span class="mdi mdi-arrow-right"></span></span>
            </router-link>
            <button
                v-if="!ehAdmin"
                type="button"
                class="menu-card-like"
                :class="{ 'is-curtido': curtido }"
                :aria-label="curtido ? `Descurtir ${item.name}` : `Curtir ${item.name}`"
                :aria-pressed="curtido"
                @click="curtidos.toggleCurtido(item)"
            >
                <span class="mdi" :class="curtido ? 'mdi-heart' : 'mdi-heart-outline'"></span>
            </button>
        </div>

        <div class="menu-card-body">
            <h3><router-link :to="`/cardapio/${item.id}`">{{ item.name }}</router-link></h3>
            <p class="menu-card-desc">{{ item.desc }}</p>

            <div class="menu-card-footer">
                <p class="menu-card-price"><small>R$</small> {{ preco }}</p>

                <template v-if="ehAdmin"></template>
                <button v-else-if="qtd === 0" type="button" class="menu-card-add" @click="cart.addItem(item)">
                    <span class="mdi mdi-plus"></span> Adicionar
                </button>

                <div v-else class="qty-stepper" role="group" :aria-label="`Quantidade de ${item.name}`">
                    <button type="button" aria-label="Diminuir quantidade" @click="cart.decreaseItem(item.id)">
                        <span class="mdi mdi-minus"></span>
                    </button>
                    <span class="qty-value" aria-live="polite">{{ qtd }}</span>
                    <button type="button" aria-label="Aumentar quantidade" @click="cart.addItem(item)">
                        <span class="mdi mdi-plus"></span>
                    </button>
                </div>
            </div>
        </div>
    </article>
</template>

<style scoped>
.menu-card {
    display: flex;
    flex-direction: column;
    background-color: var(--background-card);
    border: 1px solid var(--border-color);
    border-radius: var(--radius-lg);
    overflow: hidden;
    transition: transform 0.25s ease, border-color 0.25s ease, box-shadow 0.25s ease;
}

.menu-card:hover {
    transform: translateY(-6px);
    border-color: rgba(245, 169, 0, 0.6);
    box-shadow: var(--shadow);
}

.menu-card-image {
    position: relative;
    aspect-ratio: 4 / 3;
    background: radial-gradient(circle at 50% 40%, #222, #0d0d0d);
    overflow: hidden;
}

.menu-card-image img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform 0.4s ease;
}

.menu-card:hover .menu-card-image img {
    transform: scale(1.06);
}

.menu-card-foto {
    position: absolute;
    inset: 0;
    display: block;
}

/* faixa "Ver detalhes" que sobe no hover */
.menu-card-ver {
    position: absolute;
    left: 0;
    right: 0;
    bottom: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 6px;
    padding: 12px;
    background: linear-gradient(transparent, rgba(8, 8, 8, 0.85));
    color: #fff;
    font-size: var(--text-small);
    font-weight: 700;
    opacity: 0;
    transform: translateY(10px);
    transition: opacity 0.25s ease, transform 0.25s ease;
}

.menu-card:hover .menu-card-ver {
    opacity: 1;
    transform: none;
}

.menu-card-body h3 a {
    color: inherit;
    text-decoration: none;
    transition: color 0.2s ease;
}

.menu-card-body h3 a:hover {
    color: var(--color-primary);
}

.menu-card-placeholder {
    position: absolute;
    inset: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 3.5rem;
    color: var(--color-gray-500);
}

.menu-card-like {
    position: absolute;
    top: 12px;
    right: 12px;
    width: 40px;
    height: 40px;
    display: flex;
    align-items: center;
    justify-content: center;
    border: none;
    border-radius: var(--radius-full);
    background: rgba(8, 8, 8, 0.65);
    backdrop-filter: blur(6px);
    color: #fff;
    font-size: 1.2rem;
    cursor: pointer;
    transition: transform 0.15s ease, color 0.2s ease;
}

.menu-card-like:hover {
    transform: scale(1.1);
}

.menu-card-like.is-curtido {
    color: #ff4d6d;
}

.menu-card-body {
    display: flex;
    flex-direction: column;
    flex: 1;
    padding: 20px;
}

.menu-card-body h3 {
    font-family: 'Bebas Neue', sans-serif;
    font-size: 1.6rem;
    font-weight: 400;
    letter-spacing: 0.02em;
    line-height: 1.1;
    margin-bottom: 6px;
}

.menu-card-desc {
    flex: 1;
    color: var(--text-secondary);
    font-size: var(--text-small);
    line-height: 1.55;
    margin-bottom: 18px;
}

.menu-card-footer {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
    padding-top: 16px;
    border-top: 1px solid var(--border-color);
}

.menu-card-price {
    white-space: nowrap;
    font-size: 1.35rem;
    font-weight: 800;
    color: var(--color-primary);
}

.menu-card-price small {
    font-size: 0.8rem;
    font-weight: 700;
}

.menu-card-add {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    padding: 9px 16px;
    border: none;
    border-radius: var(--radius-full);
    background-color: var(--color-primary);
    color: #111;
    font: inherit;
    font-size: var(--text-small);
    font-weight: 700;
    cursor: pointer;
    transition: background-color 0.2s ease, transform 0.15s ease;
}

.menu-card-add:hover {
    background-color: var(--color-primary-hover);
    transform: translateY(-1px);
}

.qty-stepper {
    display: flex;
    align-items: center;
    gap: 4px;
    padding: 3px;
    border: 1px solid var(--color-primary);
    border-radius: var(--radius-full);
}

.qty-stepper button {
    width: 32px;
    height: 32px;
    border: none;
    border-radius: var(--radius-full);
    background: none;
    color: var(--text-primary);
    font-size: 1rem;
    cursor: pointer;
}

.qty-stepper button:hover {
    background-color: var(--color-primary);
    color: #111;
}

.qty-value {
    min-width: 1.6em;
    text-align: center;
    font-weight: 700;
}
</style>
