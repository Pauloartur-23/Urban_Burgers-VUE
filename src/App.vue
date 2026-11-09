<script setup>
import { onMounted } from 'vue';
import { RouterView, useRoute } from 'vue-router'
import AppHeader from '@/components/layout/header/appHeader.vue';
import AppFooter from '@/components/layout/footer/appFooter.vue';
import AppCart from '@/components/cart/appCart.vue';
import { useCartStore } from '@/stores/cart.js';
import { useCurtidosStore } from '@/stores/curtidos.js';
import { linkWhatsapp } from '@/config/loja.js';

const rotaAtual = useRoute();
const cart = useCartStore();
const curtidos = useCurtidosStore();

onMounted(() => {
    cart.hydrate();
    curtidos.hydrate();
});
</script>

<template>
  <AppHeader />
  <main>
    <!-- a chave é a rota de 1º nível: login/cadastro/senha dividem o mesmo layout e animam lá dentro -->
    <RouterView v-slot="{ Component, route }">
      <Transition name="pagina" mode="out-in">
        <component :is="Component" :key="route.matched[0]?.path" />
      </Transition>
    </RouterView>
  </main>
  <AppFooter />
  <AppCart />
  <!-- no checkout ele ficaria por cima do botão de enviar no celular -->
  <a
    v-if="rotaAtual.name !== 'finalizar'"
    class="whats-flutuante"
    :href="linkWhatsapp('Olá! Vim pelo site da Urban Burger.')"
    target="_blank"
    rel="noopener"
    aria-label="Falar com a loja no WhatsApp"
  >
    <span class="mdi mdi-whatsapp"></span>
    <span class="whats-texto">Dúvidas? Fale com a gente</span>
  </a>
</template>

<style>
.pagina-enter-active,
.pagina-leave-active {
  transition: opacity 0.25s ease, transform 0.25s ease;
}

.pagina-enter-from {
  opacity: 0;
  transform: translateY(12px);
}

.pagina-leave-to {
  opacity: 0;
}

/* botão do WhatsApp: só o ícone; o texto aparece ao passar o mouse */
.whats-flutuante {
  position: fixed;
  right: 20px;
  bottom: 20px;
  z-index: 150;
  display: flex;
  align-items: center;
  gap: 0;
  height: 56px;
  padding: 0 16px;
  border-radius: 9999px;
  background-color: #25d366;
  color: #fff;
  font-weight: 700;
  font-size: 0.9rem;
  text-decoration: none;
  box-shadow: 0 10px 28px rgba(0, 0, 0, 0.45);
  transition: transform 0.2s ease, gap 0.3s ease;
}

.whats-flutuante .mdi {
  font-size: 1.6rem;
}

.whats-texto {
  max-width: 0;
  overflow: hidden;
  white-space: nowrap;
  transition: max-width 0.35s ease;
}

.whats-flutuante:hover {
  gap: 10px;
  transform: translateY(-2px);
}

.whats-flutuante:hover .whats-texto,
.whats-flutuante:focus-visible .whats-texto {
  max-width: 220px;
}

@media (prefers-reduced-motion: reduce) {
  .pagina-enter-active,
  .pagina-leave-active {
    transition: none;
  }
}
</style>
