<script setup>
import { reactive } from 'vue';
import AppButton from '@/components/buttons/appButton.vue';
import { LOJA, linkWhatsapp } from '@/config/loja.js';

const form = reactive({ nome: '', mensagem: '' });

// a mensagem vai direto para o WhatsApp da loja (não há caixa de e-mail no backend)
function enviar() {
    const texto = `*Contato pelo site - ${LOJA.nome}*\n\n*Nome:* ${form.nome}\n\n${form.mensagem}`;
    window.open(linkWhatsapp(texto), '_blank', 'noopener');
    form.nome = '';
    form.mensagem = '';
}

const info = [
    { icon: 'mdi-map-marker-outline', titulo: 'Endereço', text: LOJA.endereco },
    { icon: 'mdi-whatsapp', titulo: 'WhatsApp', text: LOJA.telefone, link: linkWhatsapp() },
    { icon: 'mdi-email-outline', titulo: 'E-mail', text: LOJA.email, link: `mailto:${LOJA.email}` },
];
</script>

<template>
    <section id="contato" class="section section-alt">
        <div class="container contato-grid">
            <div v-reveal class="contato-info">
                <p class="eyebrow">Fale conosco</p>
                <h2 class="section-title">Vamos <span class="highlight">conversar?</span></h2>
                <p class="section-lead">
                    Dúvidas, sugestões ou só quer elogiar o burger? Manda um recado que a gente responde rapidinho.
                </p>

                <ul class="contato-list">
                    <li v-for="item in info" :key="item.titulo">
                        <span class="mdi" :class="item.icon" aria-hidden="true"></span>
                        <div>
                            <small>{{ item.titulo }}</small>
                            <a v-if="item.link" :href="item.link" target="_blank" rel="noopener">{{ item.text }}</a>
                            <span v-else>{{ item.text }}</span>
                        </div>
                    </li>
                </ul>

                <div class="contato-horario">
                    <h3><span class="mdi mdi-clock-outline"></span> Horário de funcionamento</h3>
                    <p v-for="h in LOJA.horario" :key="h.dias"><span>{{ h.dias }}</span><strong>{{ h.horas }}</strong></p>
                </div>
            </div>

            <form v-reveal="150" class="contato-form" @submit.prevent="enviar">
                <h3>Mande uma mensagem</h3>
                <p class="contato-form-sub">Ela abre no WhatsApp já escrita, é só tocar em enviar.</p>
                <label class="form-field">
                    <span>Nome</span>
                    <input v-model="form.nome" type="text" placeholder="Seu nome" autocomplete="name" required />
                </label>
                <label class="form-field">
                    <span>Mensagem</span>
                    <textarea v-model="form.mensagem" rows="5" placeholder="Escreva sua mensagem..." required></textarea>
                </label>
                <AppButton type="submit">
                    Enviar pelo WhatsApp
                    <span class="mdi mdi-whatsapp"></span>
                </AppButton>
            </form>
        </div>
    </section>
</template>

<style scoped>
.contato-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 48px 72px;
    align-items: start;
}

.contato-info .section-lead {
    margin-bottom: 32px;
}

.contato-list {
    list-style: none;
    display: flex;
    flex-direction: column;
    gap: 18px;
    margin-bottom: 32px;
}

.contato-list li {
    display: flex;
    align-items: center;
    gap: 14px;
}

.contato-list li > .mdi {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
    width: 44px;
    height: 44px;
    border-radius: var(--radius);
    border: 1px solid var(--border-color);
    background-color: var(--background-card);
    color: var(--color-primary);
    font-size: 1.2rem;
}

.contato-list small {
    display: block;
    color: var(--text-muted);
    font-size: 0.75rem;
    text-transform: uppercase;
    letter-spacing: 0.08em;
}

.contato-list a,
.contato-list span {
    color: var(--text-primary);
    text-decoration: none;
}

.contato-list a:hover {
    color: var(--color-primary);
}

.contato-horario {
    padding: 20px 22px;
    border: 1px solid var(--border-color);
    border-radius: var(--radius-lg);
    background-color: var(--background-card);
}

.contato-horario h3 {
    display: flex;
    align-items: center;
    gap: 8px;
    margin-bottom: 12px;
    font-size: 1rem;
}

.contato-horario h3 .mdi {
    color: var(--color-primary);
}

.contato-horario p {
    display: flex;
    justify-content: space-between;
    padding: 6px 0;
    color: var(--text-secondary);
}

.contato-horario p + p {
    border-top: 1px solid var(--border-color);
}

.contato-horario strong {
    color: var(--text-primary);
}

.contato-form {
    display: flex;
    flex-direction: column;
    gap: 18px;
    padding: 32px;
    border: 1px solid var(--border-color);
    border-radius: var(--radius-lg);
    background-color: var(--background-primary);
}

.contato-form h3 {
    font-family: 'Bebas Neue', sans-serif;
    font-size: 1.9rem;
    font-weight: 400;
    letter-spacing: 0.02em;
}

.contato-form-sub {
    margin-top: -14px;
    color: var(--text-secondary);
    font-size: var(--text-small);
}

.form-field {
    display: flex;
    flex-direction: column;
    gap: 8px;
}

.form-field > span {
    color: var(--text-secondary);
    font-size: var(--text-small);
    font-weight: var(--font-weight-bold);
}

.form-field input,
.form-field textarea {
    background-color: var(--background-card);
    border: 1px solid var(--border-color);
    border-radius: var(--radius);
    padding: 13px 16px;
    color: var(--text-primary);
    font: inherit;
    resize: vertical;
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
}

@media (max-width: 900px) {
    .contato-grid {
        grid-template-columns: 1fr;
    }

    .contato-form {
        padding: 24px;
    }
}
</style>
