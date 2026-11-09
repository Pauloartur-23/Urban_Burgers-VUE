<script setup>
import AppBorderButton from '@/components/buttons/appBorderButton.vue';
import AppButton from '@/components/buttons/appButton.vue';
import { useCartStore } from '@/stores/cart.js';
import { useStatusLoja } from '@/composables/useStatusLoja.js';
import { brl } from '@/utils/formato.js';

const cart = useCartStore();
const statusLoja = useStatusLoja();

const rolarPara = (id) => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
</script>

<template>
  <section id="home" class="banner-section">
    <div class="banner-content container">
      <p class="banner-status" :class="{ fechada: !statusLoja.aberto }"><span class="ponto"></span>{{ statusLoja.texto }}</p>
      <h1>Mais que um<br><span class="highlight">lanche.</span></h1>
      <p class="banner-description">
        Burgers artesanais com blend da casa, pão brioche e muito queijo. Peça pelo site e receba em casa.
      </p>
      <div class="banner-actions">
        <AppButton @click="rolarPara('cardapio')">Ver cardápio <span class="mdi mdi-arrow-right"></span></AppButton>
        <AppBorderButton v-if="cart.totalItens" @click="cart.open">
          Meu pedido · {{ brl(cart.totalPreco) }} <span class="mdi mdi-cart-outline"></span>
        </AppBorderButton>
        <AppBorderButton v-else @click="rolarPara('como-funciona')">Como funciona</AppBorderButton>
      </div>

      <ul class="banner-perks">
        <li><span class="mdi mdi-moped-outline"></span> Entrega na sua casa</li>
        <li><span class="mdi mdi-whatsapp"></span> Pedido confirmado no WhatsApp</li>
        <li><span class="mdi mdi-cash-multiple"></span> Pix, cartão ou dinheiro na entrega</li>
      </ul>
    </div>

    <a href="#cardapio" class="banner-scroll-cue" aria-label="Ir para o cardápio" @click.prevent="rolarPara('cardapio')">
      <span class="mdi mdi-chevron-down"></span>
    </a>
  </section>
</template>

<style scoped>
section.banner-section {
  position: relative;
  display: flex;
  align-items: center;
  min-height: 100vh;
  min-height: 100svh;
  padding: calc(var(--header-height) + 24px) 0 96px;
  background-image: url("@/assets/images/home/banner.webp");
  background-size: cover;
  background-position: 35% center;
  overflow: hidden;
}

section.banner-section::before {
  content: "";
  position: absolute;
  inset: 0;
  background:
    linear-gradient(90deg, rgba(8, 8, 8, 0.95) 0%, rgba(8, 8, 8, 0.75) 32%, rgba(8, 8, 8, 0.2) 62%, rgba(8, 8, 8, 0) 100%),
    linear-gradient(0deg, var(--background-primary) 0%, rgba(8, 8, 8, 0) 28%);
}

.banner-content {
  position: relative;
  z-index: 1;
  animation: banner-rise 0.7s ease both;
}

/* "● Aberto agora · fecha às 23h" */
.banner-status {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 20px;
  padding: 7px 14px;
  border: 1px solid rgba(37, 211, 102, 0.35);
  border-radius: var(--radius-full);
  background-color: rgba(8, 8, 8, 0.5);
  color: #6ee7a0;
  font-size: var(--text-small);
  font-weight: 700;
}

.banner-status .ponto {
  width: 8px;
  height: 8px;
  border-radius: var(--radius-full);
  background-color: currentColor;
  animation: piscar 2s ease-in-out infinite;
}

.banner-status.fechada {
  border-color: rgba(220, 53, 69, 0.4);
  color: #ff8a95;
}

.banner-status.fechada .ponto {
  animation: none;
}

@keyframes piscar {
  50% {
    opacity: 0.35;
  }
}

section.banner-section h1 {
  font-family: 'Bebas Neue', sans-serif;
  font-size: clamp(3.4rem, 9vw, 7rem);
  font-weight: 400;
  line-height: 0.92;
  letter-spacing: 0.01em;
  text-transform: uppercase;
  margin-bottom: 22px;
}

.banner-description {
  max-width: 44ch;
  color: var(--text-secondary);
  font-size: 1.1rem;
  line-height: 1.6;
  margin-bottom: 32px;
}

.banner-actions {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 14px;
  margin-bottom: 40px;
}

.banner-perks {
  display: flex;
  flex-wrap: wrap;
  gap: 12px 28px;
  list-style: none;
  color: var(--text-secondary);
  font-size: var(--text-small);
}

.banner-perks li {
  display: flex;
  align-items: center;
  gap: 8px;
}

.banner-perks .mdi {
  color: var(--color-primary);
  font-size: 1.15rem;
}

.banner-scroll-cue {
  position: absolute;
  left: 50%;
  bottom: 28px;
  transform: translateX(-50%);
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  border: 1.5px solid rgba(255, 255, 255, 0.4);
  border-radius: var(--radius-full);
  color: var(--text-primary);
  font-size: 1.3rem;
  z-index: 1;
  animation: banner-bounce 2s ease-in-out infinite;
  transition: border-color 0.2s ease, color 0.2s ease;
}

.banner-scroll-cue:hover {
  border-color: var(--color-primary);
  color: var(--color-primary);
}

@keyframes banner-rise {
  from {
    opacity: 0;
    transform: translateY(24px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes banner-bounce {
  0%, 100% {
    transform: translate(-50%, 0);
  }
  50% {
    transform: translate(-50%, 6px);
  }
}

@media (prefers-reduced-motion: reduce) {
  .banner-content,
  .banner-scroll-cue,
  .banner-status .ponto {
    animation: none;
  }
}

@media (max-width: 640px) {
  section.banner-section {
    align-items: flex-end;
    background-position: 65% center;
  }

  section.banner-section::before {
    background: linear-gradient(180deg, rgba(8, 8, 8, 0.35) 0%, rgba(8, 8, 8, 0.7) 45%, rgba(8, 8, 8, 0.97) 100%);
  }

  .banner-actions {
    flex-direction: column;
    align-items: stretch;
  }

  .banner-actions > * {
    flex: 1;
    justify-content: center;
  }

  .banner-scroll-cue {
    display: none;
  }
}
</style>
