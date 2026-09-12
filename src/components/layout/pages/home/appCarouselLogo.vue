<script setup>
import AppLogo from '@/components/layout/logo/appLogo.vue';

const items = Array.from({ length: 8 });
</script>

<template>
    <section class="app-carousel-logo">
        <div class="carousel-track">
            <div class="carousel-group">
                <template v-for="n in items" :key="`a-${n}`">
                    <AppLogo />
                    <span class="carousel-dot">•</span>
                </template>
            </div>
            <div class="carousel-group" aria-hidden="true">
                <template v-for="n in items" :key="`b-${n}`">
                    <AppLogo />
                    <span class="carousel-dot">•</span>
                </template>
            </div>
        </div>
    </section>
</template>

<style scoped>
.app-carousel-logo {
    overflow: hidden;
    background-color: var(--background-secondary);
    border-top: 1px solid var(--border-color);
    border-bottom: 1px solid var(--border-color);
    padding: 28px 0;
    -webkit-mask-image: linear-gradient(90deg, transparent 0%, #000 8%, #000 92%, transparent 100%);
    mask-image: linear-gradient(90deg, transparent 0%, #000 8%, #000 92%, transparent 100%);
}

.carousel-track {
    display: flex;
    width: max-content;
    animation: carousel-scroll 28s linear infinite;
}

.carousel-group {
    display: flex;
    align-items: center;
    flex-shrink: 0;
}

.carousel-group :deep(img) {
    width: 110px;
    opacity: 0.7;
    transition: opacity 0.2s ease;
}

.carousel-group :deep(img):hover {
    opacity: 1;
}

.carousel-dot {
    color: var(--color-primary);
    font-size: 1.5rem;
    margin: 0 36px;
    line-height: 0;
}

@keyframes carousel-scroll {
    from {
        transform: translateX(0);
    }
    to {
        transform: translateX(-50%);
    }
}

@media (prefers-reduced-motion: reduce) {
    .carousel-track {
        animation: none;
    }
}
</style>
