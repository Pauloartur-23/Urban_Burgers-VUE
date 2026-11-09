<script setup>
// Tela cheia com a foto do burger ao fundo (página 404 e página de erro).
defineProps({
    codigo: { type: String, default: '' }, // número grande "vazado" atrás do texto (ex: 404)
});
</script>

<template>
    <section class="tela-burger">
        <span v-if="codigo" class="codigo" aria-hidden="true">{{ codigo }}</span>
        <div class="conteudo">
            <slot />
        </div>
    </section>
</template>

<style scoped>
.tela-burger {
    position: relative;
    display: flex;
    align-items: center;
    min-height: 100vh;
    min-height: 100svh;
    padding: calc(var(--header-height) + 40px) 0 64px;
    overflow: hidden;
    /* burger à direita, texto à esquerda (mesma foto do topo da home) */
    background:
        linear-gradient(90deg, rgba(8, 8, 8, 0.97) 0%, rgba(8, 8, 8, 0.85) 32%, rgba(8, 8, 8, 0.2) 62%, rgba(8, 8, 8, 0) 100%),
        linear-gradient(0deg, var(--background-primary) 0%, rgba(8, 8, 8, 0) 25%),
        url('/fundo-burger-lado.webp') 35% center / cover no-repeat;
}

/* número grande "vazado" encostado no topo, atrás do burger */
.codigo {
    position: absolute;
    right: 4%;
    top: calc(var(--header-height) - 0.08em);
    font-family: 'Bebas Neue', sans-serif;
    font-size: clamp(10rem, 22vw, 20rem);
    line-height: 1;
    color: transparent;
    -webkit-text-stroke: 2px rgba(245, 169, 0, 0.35);
    pointer-events: none;
    user-select: none;
}

.conteudo {
    position: relative;
    width: min(var(--container), 100% - 48px);
    margin: 0 auto;
    animation: sobe 0.6s cubic-bezier(0.2, 0.7, 0.2, 1) both;
}

.conteudo :deep(h1) {
    max-width: 12ch;
    margin-bottom: 18px;
    font-family: 'Bebas Neue', sans-serif;
    font-size: clamp(3.2rem, 8vw, 6rem);
    font-weight: 400;
    line-height: 0.92;
    text-transform: uppercase;
}

.conteudo :deep(p) {
    max-width: 44ch;
    margin-bottom: 28px;
    color: var(--text-secondary);
    font-size: 1.1rem;
    line-height: 1.6;
}

.conteudo :deep(.acoes) {
    display: flex;
    flex-wrap: wrap;
    gap: 12px;
}

@keyframes sobe {
    from {
        opacity: 0;
        transform: translateY(24px);
    }
}

@media (max-width: 700px) {
    .tela-burger {
        align-items: flex-end;
        background:
            linear-gradient(180deg, rgba(8, 8, 8, 0.45) 0%, rgba(8, 8, 8, 0.85) 50%, rgba(8, 8, 8, 0.98) 100%),
            url('/fundo-burger-lado.webp') 62% center / cover no-repeat;
    }

    .codigo {
        right: 50%;
        top: 90px;
        transform: translateX(50%);
        font-size: 9rem;
    }
}

@media (prefers-reduced-motion: reduce) {
    .conteudo {
        animation: none;
    }
}
</style>
