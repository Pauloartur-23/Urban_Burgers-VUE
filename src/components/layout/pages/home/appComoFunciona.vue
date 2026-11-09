<script setup>
const passos = [
    { titulo: 'Monte o pedido', texto: 'Escolha seus burgers, combos e bebidas no cardápio.', icone: 'mdi-hamburger' },
    { titulo: 'Diga onde entregar', texto: 'Use sua localização ou digite o endereço. Fica salvo para a próxima.', icone: 'mdi-map-marker-radius-outline' },
    { titulo: 'Confirme no WhatsApp', texto: 'A mensagem vai pronta para a loja. Você acompanha o status pelo site.', icone: 'mdi-whatsapp' },
];
</script>

<template>
    <section id="como-funciona" class="section">
        <div class="container">
            <div v-reveal class="cabecalho">
                <p class="eyebrow">Como funciona</p>
                <h2 class="section-title">Do clique à sua <span class="highlight">porta</span></h2>
            </div>

            <ol class="passos">
                <li v-for="(p, i) in passos" :key="p.titulo" v-reveal="i * 120" class="passo">
                    <span class="numero">{{ String(i + 1).padStart(2, '0') }}</span>
                    <span class="mdi icone" :class="p.icone" aria-hidden="true"></span>
                    <h3>{{ p.titulo }}</h3>
                    <p>{{ p.texto }}</p>
                </li>
            </ol>
        </div>
    </section>
</template>

<style scoped>
.cabecalho {
    margin-bottom: 44px;
}

.passos {
    display: grid;
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: 20px;
    list-style: none;
    counter-reset: passo;
}

.passo {
    position: relative;
    padding: 28px 26px 30px;
    border: 1px solid var(--border-color);
    border-radius: var(--radius-lg);
    background-color: var(--background-card);
    overflow: hidden;
    transition: border-color 0.25s ease, transform 0.25s ease;
}

.passo:hover {
    border-color: rgba(245, 169, 0, 0.6);
    transform: translateY(-4px);
}

/* número grande "vazado" no canto */
.numero {
    position: absolute;
    top: -10px;
    right: 14px;
    font-family: 'Bebas Neue', sans-serif;
    font-size: 6rem;
    line-height: 1;
    color: transparent;
    -webkit-text-stroke: 1px rgba(255, 255, 255, 0.12);
    transition: -webkit-text-stroke-color 0.25s ease;
}

.passo:hover .numero {
    -webkit-text-stroke-color: rgba(245, 169, 0, 0.5);
}

.icone {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 52px;
    height: 52px;
    margin-bottom: 22px;
    border-radius: var(--radius);
    background-color: var(--color-primary);
    color: #111;
    font-size: 1.6rem;
}

.passo h3 {
    margin-bottom: 8px;
    font-family: 'Bebas Neue', sans-serif;
    font-size: 1.7rem;
    font-weight: 400;
    letter-spacing: 0.02em;
}

.passo p {
    max-width: 32ch;
    color: var(--text-secondary);
    line-height: 1.6;
}

@media (max-width: 860px) {
    .passos {
        grid-template-columns: 1fr;
    }
}
</style>
