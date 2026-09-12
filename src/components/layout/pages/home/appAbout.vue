<script setup>
import AppBorderButton from '@/components/buttons/appBorderButton.vue';

</script>

<template>
    <section id="sobre" class="about-section">
        <div class="about-content">
            <p class="about-eyebrow"><span class="about-eyebrow-line"></span>Sobre Nós</p>
            <h2>Não É Sobre Um <span class="highlight">Hambúrguer</span></h2>
            <p class="about-description">É o encontro. É a fome. É aquela primeira mordida. É URBAN.</p>
            <AppBorderButton>
                Saiba mais
                <span class="mdi mdi-arrow-right"></span>
            </AppBorderButton>
        </div>
    </section>
</template>

<style scoped>
.about-section {
    position: relative;
    display: flex;
    align-items: center;
    justify-content: flex-end;
    min-height: 80vh;
    padding: 80px 0;
    background-image: url("@/assets/images/home/about.png");
    background-size: cover;
    background-position: center;
    overflow: hidden;
}

.about-section::before {
    content: "";
    position: absolute;
    inset: 0;
    background: linear-gradient(
        270deg,
        rgba(8, 8, 8, 0.9) 0%,
        rgba(8, 8, 8, 0.68) 35%,
        rgba(8, 8, 8, 0.2) 65%,
        rgba(8, 8, 8, 0.05) 100%
    );
}

.about-content {
    position: relative;
    z-index: 1;
    max-width: 560px;
    width: 100%;
    padding: 0 40px;
    text-align: left;
}

.about-eyebrow {
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

.about-eyebrow-line {
    width: 32px;
    height: 2px;
    background-color: var(--color-primary);
}

.about-section h2 {
    font-family: 'Bebas Neue', var(--font-secondary);
    font-size: clamp(2.5rem, 5vw, 4rem);
    font-weight: var(--font-weight-bold);
    line-height: 1;
    letter-spacing: 0.01em;
    text-transform: uppercase;
    margin-bottom: 20px;
}

.about-description {
    max-width: 42ch;
    color: var(--text-secondary);
    font-size: 1.05rem;
    line-height: 1.6;
    margin-bottom: 32px;
}

@media (max-width: 768px) {
    .about-section {
        justify-content: center;
        min-height: auto;
        padding: 96px 0;
    }

    .about-section::before {
        background: linear-gradient(180deg, rgba(8, 8, 8, 0.55) 0%, rgba(8, 8, 8, 0.8) 60%, rgba(8, 8, 8, 0.92) 100%);
    }

    .about-content {
        max-width: 480px;
        padding: 0 24px;
        text-align: center;
    }

    .about-eyebrow {
        justify-content: center;
    }
}
</style>
