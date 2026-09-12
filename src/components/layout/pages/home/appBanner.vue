<script setup>
import AppBorderButton from '@/components/buttons/appBorderButton.vue';
import AppButton from '@/components/buttons/appButton.vue';

</script>

<template>
  <section id="home" class="banner-section">
    <div class="banner-content">
      <p class="banner-eyebrow">Burguer <span>•</span> Friends <span>•</span> Good Times</p>
      <h1>Mais Que Um<br><span class="highlight">Lanche.</span></h1>
      <p class="banner-description">O melhor lanche da cidade, feito com ingredientes frescos e de qualidade.</p>
      <div class="banner-actions">
        <AppButton>Cardápio <span class="mdi mdi-arrow-right"></span></AppButton>
        <AppBorderButton>Carrinho <span class="mdi mdi-cart-outline"></span></AppBorderButton>
      </div>
    </div>

    <a href="#" class="banner-scroll-cue" aria-label="Rolar para baixo">
      <span class="mdi mdi-chevron-down"></span>
    </a>
  </section>
</template>

<style scoped>
section.banner-section {
  position: relative;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  min-height: 100vh;
  background-image: url("@/assets/images/home/banner.png");
  background-size: cover;
  background-position: center;
  overflow: hidden;
}

section.banner-section::before {
  content: "";
  position: absolute;
  inset: 0;
  background: linear-gradient(
    90deg,
    rgba(8, 8, 8, 0.92) 0%,
    rgba(8, 8, 8, 0.72) 30%,
    rgba(8, 8, 8, 0.25) 60%,
    rgba(8, 8, 8, 0.05) 100%
  ),
  linear-gradient(0deg, rgba(8, 8, 8, 0.6) 0%, rgba(8, 8, 8, 0) 30%);
}

.banner-content {
  position: relative;
  z-index: 1;
  max-width: 820px;
  padding: 0 200px;
  text-align: left;
  animation: banner-rise 0.7s ease both;
}

.banner-eyebrow {
  display: flex;
  align-items: center;
  gap: 10px;
  color: var(--text-secondary);
  font-size: var(--text-small);
  font-weight: var(--font-weight-bold);
  letter-spacing: 0.12em;
  text-transform: uppercase;
  margin-bottom: 16px;
}

.banner-eyebrow span {
  color: var(--color-primary);
}

section.banner-section h1 {
  font-family: 'Bebas Neue', var(--font-secondary);
  font-size: clamp(3rem, 8vw, 5.5rem);
  font-weight: var(--font-weight-bold);
  line-height: 0.95;
  letter-spacing: 0.01em;
  text-transform: uppercase;
  margin-bottom: 20px;
}

.banner-description {
  max-width: 42ch;
  color: var(--text-secondary);
  font-size: 1.05rem;
  line-height: 1.6;
  margin-bottom: 32px;
}

.banner-actions {
  display: flex;
  align-items: center;
  gap: 16px;
}

.banner-scroll-cue {
  position: absolute;
  left: 50%;
  bottom: 32px;
  transform: translateX(-50%);
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  border: 1.5px solid var(--border-light);
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
  .banner-content {
    animation: none;
  }

  .banner-scroll-cue {
    animation: none;
  }
}

@media (max-width: 640px) {
  section.banner-section::before {
    background: linear-gradient(180deg, rgba(8, 8, 8, 0.65) 0%, rgba(8, 8, 8, 0.78) 50%, rgba(8, 8, 8, 0.9) 100%);
  }

  .banner-content {
    padding: 0 24px;
  }

  .banner-actions {
    flex-direction: column;
    align-items: stretch;
  }

  .banner-actions > * {
    justify-content: center;
  }
}
</style>
