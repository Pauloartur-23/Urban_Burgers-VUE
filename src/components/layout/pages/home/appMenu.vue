<script setup>
import { ref } from 'vue';
import { useMenuStore } from '@/assets/data/menu.js';
import AppCircleButton from '@/components/buttons/appCircleButton.vue';

const { menu } = useMenuStore();

const selectedPartId = ref(1);

function clickmenu(id) {
    selectedPartId.value = id;
}

function menuImage(img) {
    return new URL(`../../../../assets/images/menu/${img}`, import.meta.url).href;
}

function hideBrokenImage(event) {
    event.target.style.display = 'none';
}
</script>

<template>
    <section id="cardapio" class="menu-section">
        <div class="menu-header">
            <div>
                <p class="menu-eyebrow"><span class="menu-eyebrow-line"></span>CARDÁPIO</p>
                <h2>ESCOLHA SEU <span class="highlight">URBAN</span></h2>
            </div>
            <a href="#" class="menu-see-all">
                Ver Cardápio completo
                <span class="mdi mdi-arrow-right"></span>
            </a>
        </div>

        <ul class="menu-tabs">
            <li v-for="part in menu" :key="part.id">
                <a
                    :href="part.link"
                    class="menu-tab"
                    :class="{ 'is-active': selectedPartId === part.id }"
                    @click.prevent="clickmenu(part.id)"
                >{{ part.name }}</a>
            </li>
        </ul>

        <div>
            <div v-for="part in menu" :key="part.id" v-show="selectedPartId === part.id" class="menu-grid">
                <a v-for="item in part.itens" :key="item.id" :href="item.link" class="menu-card">
                    <div class="menu-card-image">
                        <img :src="menuImage(item.img)" :alt="item.name" @error="hideBrokenImage" />
                    </div>
                    <div class="menu-card-body">
                        <h3>{{ item.name }}</h3>
                        <p class="menu-card-desc">{{ item.desc }}</p>
                        <div class="menu-card-footer">
                            <p class="menu-card-price">R$ {{ item.preco.toFixed(2) }}</p>
                            <div class="menu-card-actions">
                                <AppCircleButton aria-label="Favoritar" @click.prevent>
                                    <span class="mdi mdi-heart"></span>
                                </AppCircleButton>
                                <AppCircleButton aria-label="Adicionar" @click.prevent>
                                    <span class="mdi mdi-plus"></span>
                                </AppCircleButton>
                            </div>
                        </div>
                    </div>
                </a>
            </div>
        </div>
    </section>
</template>

<style scoped>
section.menu-section {
    padding: 100px 200px;
}

.menu-header {
    display: flex;
    align-items: flex-end;
    justify-content: space-between;
    gap: 24px;
    margin-bottom: 40px;
}

.menu-eyebrow {
    display: flex;
    align-items: center;
    gap: 14px;
    color: var(--text-secondary);
    font-size: var(--text-small);
    font-weight: var(--font-weight-bold);
    letter-spacing: 0.12em;
    text-transform: uppercase;
    margin-bottom: 16px;
}

.menu-eyebrow-line {
    width: 32px;
    height: 2px;
    background-color: var(--color-primary);
}

.menu-header h2 {
    font-family: 'Bebas Neue', var(--font-secondary);
    font-size: clamp(2.5rem, 5vw, 3.5rem);
    font-weight: var(--font-weight-bold);
    line-height: 1;
    letter-spacing: 0.01em;
    text-transform: uppercase;
}

.menu-see-all {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    flex-shrink: 0;
    color: var(--color-primary);
    font-size: var(--text-small);
    font-weight: var(--font-weight-bold);
    text-transform: uppercase;
    letter-spacing: 0.04em;
    text-decoration: none;
    padding-bottom: 6px;
    transition: gap 0.2s ease, color 0.2s ease;
}

.menu-see-all:hover {
    gap: 12px;
    color: var(--color-primary-hover);
}

.menu-tabs {
    display: flex;
    flex-wrap: wrap;
    gap: 36px;
    list-style: none;
    border-bottom: 1px solid var(--border-color);
    padding-bottom: 24px;
    margin-bottom: 40px;
}

.menu-tab {
    position: relative;
    display: inline-block;
    padding-bottom: 6px;
    color: var(--text-secondary);
    font-size: var(--text-small);
    font-weight: var(--font-weight-bold);
    text-transform: uppercase;
    letter-spacing: 0.03em;
    text-decoration: none;
    transition: color 0.2s ease;
}

.menu-tab::after {
    content: "";
    position: absolute;
    left: 0;
    bottom: 0;
    width: 0;
    height: 2px;
    background-color: var(--color-primary);
    transition: width 0.25s ease;
}

.menu-tab:hover,
.menu-tab:focus-visible {
    color: var(--color-primary);
}

.menu-tab:hover::after,
.menu-tab:focus-visible::after {
    width: 100%;
}

.menu-tab.is-active {
    color: var(--color-primary);
}

.menu-tab.is-active::after {
    width: 100%;
}

.menu-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
    gap: 24px;
}

.menu-card {
    display: flex;
    flex-direction: column;
    background-color: var(--background-card);
    border: 1px solid var(--border-color);
    border-radius: var(--radius);
    overflow: hidden;
    text-decoration: none;
    color: var(--text-primary);
    transition: transform 0.25s ease, border-color 0.25s ease, box-shadow 0.25s ease;
}

.menu-card:hover {
    transform: translateY(-6px);
    border-color: var(--color-primary);
    box-shadow: var(--shadow);
}

.menu-card-image {
    position: relative;
    aspect-ratio: 4 / 3;
    background-color: var(--background-secondary);
    overflow: hidden;
}

.menu-card-image img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform 0.35s ease;
}

.menu-card:hover .menu-card-image img {
    transform: scale(1.06);
}

.menu-card-body {
    display: flex;
    flex-direction: column;
    flex: 1;
    padding: 20px;
}

.menu-card-body h3 {
    font-family: 'Bebas Neue', var(--font-secondary);
    font-size: 1.4rem;
    letter-spacing: 0.02em;
    text-transform: uppercase;
    margin-bottom: 8px;
}

.menu-card-desc {
    flex: 1;
    color: var(--text-secondary);
    font-size: var(--text-small);
    line-height: 1.5;
    margin-bottom: 20px;
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
    font-size: 1.15rem;
    font-weight: var(--font-weight-bold);
    color: var(--color-primary);
}

.menu-card-actions {
    display: flex;
    gap: 10px;
}

@media (max-width: 1024px) {
    section.menu-section {
        padding: 80px 24px;
    }
}

@media (max-width: 640px) {
    .menu-header {
        flex-direction: column;
        align-items: flex-start;
    }

    .menu-grid {
        grid-template-columns: 1fr;
    }
}
</style>
