<script setup>
import AppButton from '@/components/buttons/appButton.vue';

const destaques = [
    { icone: 'mdi-leaf', titulo: 'Ingredientes frescos', texto: 'Selecionados todos os dias.' },
    { icone: 'mdi-fire', titulo: 'Feito na hora', texto: 'Na chapa só depois do seu pedido.' },
    { icone: 'mdi-crown-outline', titulo: 'Receitas da casa', texto: 'Blend e molhos exclusivos Urban.' },
];

function pedir() {
    document.getElementById('cardapio')?.scrollIntoView({ behavior: 'smooth' });
}
</script>

<template>
    <section id="sobre" class="about-section">
        <div class="container about-inner">
            <div v-reveal class="about-content">
                <p class="eyebrow">Sobre nós</p>
                <h2 class="section-title">Não é sobre um <span class="highlight">hambúrguer</span></h2>
                <p class="section-lead">É o encontro. É a fome. É aquela primeira mordida. É URBAN.</p>

                <ul class="about-destaques">
                    <li v-for="d in destaques" :key="d.titulo">
                        <span class="mdi" :class="d.icone" aria-hidden="true"></span>
                        <div>
                            <strong>{{ d.titulo }}</strong>
                            <small>{{ d.texto }}</small>
                        </div>
                    </li>
                </ul>

                <AppButton @click="pedir">
                    Fazer meu pedido
                    <span class="mdi mdi-arrow-right"></span>
                </AppButton>
            </div>
        </div>
    </section>
</template>

<style scoped>
.about-section {
    position: relative;
    display: flex;
    align-items: center;
    min-height: 80vh;
    padding-block: clamp(80px, 10vw, 120px);
    background: url("@/assets/images/home/about.webp") center / cover no-repeat;
    overflow: hidden;
}

.about-section::before {
    content: "";
    position: absolute;
    inset: 0;
    background:
        linear-gradient(270deg, rgba(8, 8, 8, 0.95) 0%, rgba(8, 8, 8, 0.75) 38%, rgba(8, 8, 8, 0.15) 70%, rgba(8, 8, 8, 0) 100%),
        linear-gradient(180deg, var(--background-primary) 0%, rgba(8, 8, 8, 0) 18%, rgba(8, 8, 8, 0) 82%, var(--background-secondary) 100%);
}

.about-inner {
    position: relative;
    z-index: 1;
    display: flex;
    justify-content: flex-end;
}

.about-content {
    max-width: 500px;
}

.about-content .section-lead {
    margin-bottom: 32px;
}

.about-destaques {
    display: grid;
    gap: 18px;
    list-style: none;
    margin-bottom: 36px;
}

.about-destaques li {
    display: flex;
    align-items: center;
    gap: 16px;
}

.about-destaques .mdi {
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
    width: 48px;
    height: 48px;
    border: 1px solid rgba(245, 169, 0, 0.4);
    border-radius: var(--radius);
    background-color: rgba(245, 169, 0, 0.08);
    color: var(--color-primary);
    font-size: 1.4rem;
}

.about-destaques strong {
    display: block;
    font-weight: 700;
}

.about-destaques small {
    color: var(--text-secondary);
    font-size: var(--text-small);
}

@media (max-width: 768px) {
    .about-section {
        min-height: auto;
    }

    .about-section::before {
        background: linear-gradient(180deg, rgba(8, 8, 8, 0.6) 0%, rgba(8, 8, 8, 0.85) 50%, var(--background-secondary) 100%);
    }

    .about-inner {
        justify-content: flex-start;
    }
}
</style>
