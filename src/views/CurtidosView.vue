<script setup>
import { useCurtidosStore } from '@/stores/curtidos.js';
import MenuCard from '@/components/menu/MenuCard.vue';

const curtidos = useCurtidosStore();
</script>

<template>
    <div class="page">
        <p class="eyebrow">Seus favoritos</p>
        <h1>Meus <span class="highlight">curtidos</span></h1>

        <div v-if="curtidos.items.length === 0" class="empty-state">
            <span class="mdi mdi-heart-outline" aria-hidden="true"></span>
            <h2>Nenhum item curtido ainda</h2>
            <p>Toque no coração dos lanches no cardápio para guardar seus favoritos aqui.</p>
            <router-link to="/#cardapio" class="btn btn-primary">Ver cardápio <span class="mdi mdi-arrow-right"></span></router-link>
        </div>

        <div v-else class="curtidos-grid">
            <MenuCard v-for="item in curtidos.items" :key="item.id" :item="item" />
        </div>
    </div>
</template>

<style scoped>
.curtidos-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(min(100%, 270px), 1fr));
    gap: 28px;
    margin-top: 32px;
}
</style>
