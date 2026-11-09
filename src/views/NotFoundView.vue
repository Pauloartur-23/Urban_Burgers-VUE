<script setup>
import { useRoute } from 'vue-router';
import TelaBurger from '@/components/layout/TelaBurger.vue';

const route = useRoute();
</script>

<template>
    <TelaBurger codigo="404">
        <p class="eyebrow">Endereço não encontrado</p>
        <h1>Esse lanche saiu do <span class="highlight">cardápio</span></h1>
        <p>
            Não existe nada em <code>{{ route.path }}</code>. O link pode estar errado ou a página mudou de lugar.
        </p>
        <div class="acoes">
            <router-link to="/cardapio" class="btn btn-primary">Ver cardápio <span class="mdi mdi-arrow-right"></span></router-link>
            <router-link to="/" class="btn btn-outline">Voltar para o início</router-link>
        </div>
    </TelaBurger>
</template>

<style scoped>
code {
    padding: 2px 8px;
    border-radius: 6px;
    background-color: rgba(255, 255, 255, 0.08);
    color: var(--text-primary);
    font-size: 0.95em;
    word-break: break-all;
}
</style>
