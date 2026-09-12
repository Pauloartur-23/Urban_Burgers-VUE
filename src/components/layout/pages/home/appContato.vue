<script setup>
import { reactive } from 'vue';
import AppButton from '@/components/buttons/appButton.vue';

const form = reactive({
    nome: '',
    email: '',
    mensagem: '',
});

function enviar() {
    console.log('Enviar contato', { ...form });
}

const info = [
    { icon: 'mdi-map-marker', text: 'Rua das Flores, 120 - Centro' },
    { icon: 'mdi-phone', text: '(11) 4002-8922' },
    { icon: 'mdi-email-outline', text: 'contato@urbanburgers.com.br' },
];
</script>

<template>
    <section id="contato" class="contato-section">
        <div class="contato-info">
            <p class="contato-eyebrow"><span class="contato-eyebrow-line"></span>FALE CONOSCO</p>
            <h2>VAMOS <span class="highlight">CONVERSAR?</span></h2>
            <p class="contato-description">
                Dúvidas, sugestões ou só quer elogiar o burger? Manda um recado que a gente responde rapidinho.
            </p>
            <ul class="contato-list">
                <li v-for="item in info" :key="item.text">
                    <span class="mdi" :class="item.icon"></span>
                    {{ item.text }}
                </li>
            </ul>
        </div>

        <form class="contato-form" @submit.prevent="enviar">
            <div class="form-field">
                <label for="contato-nome">Nome</label>
                <input id="contato-nome" v-model="form.nome" type="text" placeholder="Seu nome" required />
            </div>
            <div class="form-field">
                <label for="contato-email">E-mail</label>
                <input id="contato-email" v-model="form.email" type="email" placeholder="seu@email.com" required />
            </div>
            <div class="form-field">
                <label for="contato-mensagem">Mensagem</label>
                <textarea id="contato-mensagem" v-model="form.mensagem" rows="4" placeholder="Escreva sua mensagem..." required></textarea>
            </div>
            <AppButton type="submit">
                Enviar mensagem
                <span class="mdi mdi-send-variant-outline"></span>
            </AppButton>
        </form>
    </section>
</template>

<style scoped>
.contato-section {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 0;
    background-color: var(--background-secondary);
}

.contato-info {
    padding: 100px 80px 100px 200px;
}

.contato-eyebrow {
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

.contato-eyebrow-line {
    width: 32px;
    height: 2px;
    background-color: var(--color-primary);
}

.contato-info h2 {
    font-family: 'Bebas Neue', var(--font-secondary);
    font-size: clamp(2.5rem, 5vw, 3.5rem);
    font-weight: var(--font-weight-bold);
    line-height: 1;
    letter-spacing: 0.01em;
    text-transform: uppercase;
    margin-bottom: 20px;
}

.contato-description {
    max-width: 42ch;
    color: var(--text-secondary);
    line-height: 1.6;
    margin-bottom: 32px;
}

.contato-list {
    list-style: none;
    display: flex;
    flex-direction: column;
    gap: 16px;
}

.contato-list li {
    display: flex;
    align-items: center;
    gap: 14px;
    color: var(--text-primary);
    font-size: var(--text-small);
}

.contato-list .mdi {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 36px;
    height: 36px;
    border-radius: var(--radius-full);
    border: 1.5px solid var(--border-color);
    color: var(--color-primary);
    font-size: 1rem;
    flex-shrink: 0;
}

.contato-form {
    display: flex;
    flex-direction: column;
    gap: 20px;
    padding: 100px 200px 100px 80px;
    background-color: var(--background-primary);
    border-left: 1px solid var(--border-color);
}

.form-field {
    display: flex;
    flex-direction: column;
    gap: 8px;
}

.form-field label {
    color: var(--text-secondary);
    font-size: var(--text-small);
    font-weight: var(--font-weight-bold);
    text-transform: uppercase;
    letter-spacing: 0.06em;
}

.form-field input,
.form-field textarea {
    background-color: var(--background-card);
    border: 1.5px solid var(--border-color);
    border-radius: var(--radius);
    padding: 12px 16px;
    color: var(--text-primary);
    font-family: inherit;
    font-size: var(--text);
    resize: none;
    transition: border-color 0.2s ease;
}

.form-field input:focus,
.form-field textarea:focus {
    outline: none;
    border-color: var(--color-primary);
}

.form-field input::placeholder,
.form-field textarea::placeholder {
    color: var(--text-muted);
}

.contato-form button {
    align-self: flex-start;
    margin-top: 8px;
}

@media (max-width: 1024px) {
    .contato-section {
        grid-template-columns: 1fr;
    }

    .contato-info {
        padding: 80px 24px 60px;
    }

    .contato-form {
        padding: 60px 24px 80px;
        border-left: none;
        border-top: 1px solid var(--border-color);
    }
}
</style>
