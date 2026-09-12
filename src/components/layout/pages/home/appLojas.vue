<script setup>
const lojas = [
    {
        id: 1,
        nome: 'URBAN Centro',
        endereco: 'Rua das Flores, 120 - Centro',
        horario: 'Seg a Dom, 11h às 23h',
        telefone: '(11) 4002-8922',
    },
    {
        id: 2,
        nome: 'URBAN Shopping Vila',
        endereco: 'Av. Paulista, 900 - Bela Vista',
        horario: 'Seg a Dom, 11h às 22h',
        telefone: '(11) 4002-8933',
    },
    {
        id: 3,
        nome: 'URBAN Beira Mar',
        endereco: 'Av. Atlântica, 450 - Orla',
        horario: 'Seg a Dom, 12h às 00h',
        telefone: '(11) 4002-8944',
    },
];
</script>

<template>
    <section id="lojas" class="lojas-section">
        <div class="lojas-header">
            <p class="lojas-eyebrow">ONDE ESTAMOS<span class="lojas-eyebrow-line"></span></p>
            <h2>ENCONTRE UMA <span class="lojas-highlight">LOJA</span></h2>
        </div>

        <div class="lojas-grid">
            <div v-for="loja in lojas" :key="loja.id" class="loja-card">
                <span class="mdi mdi-map-marker loja-icon"></span>
                <h3>{{ loja.nome }}</h3>
                <p class="loja-endereco">{{ loja.endereco }}</p>
                <div class="loja-info">
                    <p><span class="mdi mdi-clock-outline"></span>{{ loja.horario }}</p>
                    <p><span class="mdi mdi-phone"></span>{{ loja.telefone }}</p>
                </div>
            </div>
        </div>
    </section>
</template>

<style scoped>
.lojas-section {
    padding: 100px 200px;
}

.lojas-header {
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    text-align: right;
    margin-bottom: 40px;
}

.lojas-eyebrow {
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

.lojas-eyebrow-line {
    width: 32px;
    height: 2px;
    background-color: var(--color-primary);
}

.lojas-header h2 {
    font-family: 'Bebas Neue', var(--font-secondary);
    font-size: clamp(2.5rem, 5vw, 3.5rem);
    font-weight: var(--font-weight-bold);
    line-height: 1;
    letter-spacing: 0.01em;
    text-transform: uppercase;
}

.lojas-highlight {
    color: var(--color-primary);
}

.lojas-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
    gap: 24px;
}

.loja-card {
    background-color: var(--background-card);
    border: 1px solid var(--border-color);
    border-radius: var(--radius);
    padding: 28px;
    transition: transform 0.25s ease, border-color 0.25s ease, box-shadow 0.25s ease;
}

.loja-card:hover {
    transform: translateY(-6px);
    border-color: var(--color-primary);
    box-shadow: var(--shadow);
}

.loja-icon {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 48px;
    height: 48px;
    border-radius: var(--radius-full);
    background-color: var(--background-secondary);
    color: var(--color-primary);
    font-size: 1.3rem;
    margin-bottom: 20px;
}

.loja-card h3 {
    font-family: 'Bebas Neue', var(--font-secondary);
    font-size: 1.4rem;
    letter-spacing: 0.02em;
    text-transform: uppercase;
    margin-bottom: 8px;
}

.loja-endereco {
    color: var(--text-secondary);
    font-size: var(--text-small);
    line-height: 1.5;
    margin-bottom: 20px;
}

.loja-info {
    display: flex;
    flex-direction: column;
    gap: 10px;
    padding-top: 16px;
    border-top: 1px solid var(--border-color);
}

.loja-info p {
    display: flex;
    align-items: center;
    gap: 10px;
    color: var(--text-primary);
    font-size: var(--text-small);
}

.loja-info .mdi {
    color: var(--color-primary);
    font-size: 1.05rem;
}

@media (max-width: 1024px) {
    .lojas-section {
        padding: 80px 24px;
    }
}
</style>
