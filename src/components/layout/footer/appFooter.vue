<script setup>
import AppLogo from '@/components/layout/logo/appLogo.vue';
import { LOJA, linkWhatsapp } from '@/config/loja.js';

const year = new Date().getFullYear();

const links = [
    { label: 'Cardápio', to: '/cardapio' },
    { label: 'Sobre', to: '/#sobre' },
    { label: 'Contato', to: '/#contato' },
    { label: 'Meus curtidos', to: '/curtidos' },
    { label: 'Minha conta', to: '/conta' },
];
</script>

<template>
    <footer class="footer">
        <div class="container footer-main">
            <div class="footer-brand">
                <AppLogo />
                <p>{{ LOJA.slogan }}</p>
                <ul class="footer-social">
                    <li v-for="rede in LOJA.redes" :key="rede.nome">
                        <a :href="rede.link" :aria-label="rede.nome" target="_blank" rel="noopener">
                            <span class="mdi" :class="rede.icone"></span>
                        </a>
                    </li>
                    <li>
                        <a :href="linkWhatsapp()" aria-label="WhatsApp" target="_blank" rel="noopener">
                            <span class="mdi mdi-whatsapp"></span>
                        </a>
                    </li>
                </ul>
            </div>

            <div>
                <h4>Navegação</h4>
                <ul class="footer-list">
                    <li v-for="l in links" :key="l.to"><router-link :to="l.to">{{ l.label }}</router-link></li>
                </ul>
            </div>

            <div>
                <h4>Contato</h4>
                <ul class="footer-list">
                    <li><span class="mdi mdi-map-marker-outline"></span> {{ LOJA.endereco }}</li>
                    <li><a :href="linkWhatsapp()" target="_blank" rel="noopener"><span class="mdi mdi-whatsapp"></span> {{ LOJA.telefone }}</a></li>
                    <li><a :href="`mailto:${LOJA.email}`"><span class="mdi mdi-email-outline"></span> {{ LOJA.email }}</a></li>
                </ul>
            </div>

            <div>
                <h4>Horário</h4>
                <ul class="footer-list">
                    <li v-for="h in LOJA.horario" :key="h.dias">{{ h.dias }} <strong>{{ h.horas }}</strong></li>
                </ul>
            </div>
        </div>

        <div class="container footer-bottom">
            <p>&copy; {{ year }} {{ LOJA.nome }}. Todos os direitos reservados.</p>
        </div>
    </footer>
</template>

<style scoped>
.footer {
    border-top: 1px solid var(--border-color);
    background-color: #050505;
    padding-top: 64px;
}

.footer-main {
    display: grid;
    grid-template-columns: 1.4fr 1fr 1.3fr 1fr;
    gap: 40px;
    padding-bottom: 48px;
}

.footer-brand :deep(div) {
    height: auto;
    justify-content: flex-start;
}

.footer-brand p {
    margin: 14px 0 20px;
    color: var(--text-secondary);
    font-size: var(--text-small);
}

h4 {
    margin-bottom: 18px;
    color: var(--text-primary);
    font-size: var(--text-small);
    font-weight: 700;
    letter-spacing: 0.12em;
    text-transform: uppercase;
}

.footer-list {
    list-style: none;
    display: flex;
    flex-direction: column;
    gap: 12px;
    color: var(--text-secondary);
    font-size: var(--text-small);
}

.footer-list li {
    display: flex;
    align-items: center;
    gap: 8px;
}

.footer-list strong {
    margin-left: auto;
    color: var(--text-primary);
    font-weight: 600;
}

.footer-list .mdi {
    color: var(--color-primary);
}

.footer-list a {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    color: inherit;
    text-decoration: none;
    transition: color 0.2s ease;
}

.footer-list a:hover {
    color: var(--color-primary);
}

.footer-social {
    list-style: none;
    display: flex;
    gap: 10px;
}

.footer-social a {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 40px;
    height: 40px;
    border: 1px solid var(--border-color);
    border-radius: var(--radius-full);
    color: var(--text-primary);
    font-size: 1.1rem;
    text-decoration: none;
    transition: background-color 0.2s ease, color 0.2s ease, border-color 0.2s ease, transform 0.15s ease;
}

.footer-social a:hover {
    border-color: var(--color-primary);
    background-color: var(--color-primary);
    color: var(--color-black);
    transform: translateY(-2px);
}

.footer-bottom {
    padding: 22px 0;
    border-top: 1px solid var(--border-color);
    color: var(--text-muted);
    font-size: 0.8rem;
    text-align: center;
}

@media (max-width: 900px) {
    .footer-main {
        grid-template-columns: 1fr 1fr;
    }
}

@media (max-width: 560px) {
    .footer-main {
        grid-template-columns: 1fr;
        gap: 32px;
    }
}
</style>
