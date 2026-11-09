<script setup>
import { linkWhatsapp } from '@/config/loja.js';
import TelaBurger from '@/components/layout/TelaBurger.vue';

// recarrega do zero (limpa o estado que quebrou)
const tentarDeNovo = () => window.location.assign('/');
</script>

<template>
    <TelaBurger codigo="Ops">
        <p class="eyebrow">Algo deu errado</p>
        <h1>Queimamos esse <span class="highlight">pedido</span></h1>
        <p>
            Tivemos um problema para carregar esta página. Tente de novo em alguns segundos.
            Se continuar, chame a gente no WhatsApp que você faz o pedido por lá.
        </p>
        <div class="acoes">
            <button type="button" class="btn btn-primary" @click="tentarDeNovo">
                <span class="mdi mdi-refresh"></span> Tentar de novo
            </button>
            <a :href="linkWhatsapp('Olá! O site deu erro, quero fazer um pedido.')" target="_blank" rel="noopener" class="btn btn-outline">
                <span class="mdi mdi-whatsapp"></span> Pedir pelo WhatsApp
            </a>
        </div>
    </TelaBurger>
</template>
