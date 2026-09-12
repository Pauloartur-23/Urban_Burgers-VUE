<script setup>
import AppLogo from '@/components/layout/logo/appLogo.vue';

const year = new Date().getFullYear();

const social = [
    { name: 'Instagram', icon: 'mdi-instagram', link: '#' },
    { name: 'Facebook', icon: 'mdi-facebook', link: '#' },
    { name: 'WhatsApp', icon: 'mdi-whatsapp', link: '#' },
    { name: 'X', icon: 'mdi-twitter', link: '#' },
];
</script>

<template>
    <footer class="footer">
        <div class="footer-main">
            <div class="footer-brand">
                <AppLogo />
            </div>

            <div class="footer-social">
                <h4>Redes Sociais</h4>
                <ul>
                    <li v-for="item in social" :key="item.name">
                        <a :href="item.link" :aria-label="item.name">
                            <span class="mdi" :class="item.icon"></span>
                        </a>
                    </li>
                </ul>
            </div>
        </div>

        <div class="footer-bottom">
            <p>&copy; {{ year }} Urban Burgers. Todos os direitos reservados.</p>
        </div>
    </footer>
</template>

<style scoped>
.footer {
    border-top: 1px solid var(--border-color);
    background-color: var(--background-secondary);
    padding: 48px 200px 32px;
}

.footer-main {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 24px;
    padding-bottom: 32px;
    border-bottom: 1px solid var(--border-color);
    margin-bottom: 24px;
}

.footer-brand :deep(div) {
    justify-content: flex-start;
}

.footer-social h4 {
    color: var(--text-secondary);
    font-size: var(--text-small);
    font-weight: var(--font-weight-bold);
    text-transform: uppercase;
    letter-spacing: 0.08em;
    margin-bottom: 16px;
}

.footer-social ul {
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
    border: 1.5px solid var(--border-color);
    border-radius: var(--radius-full);
    color: var(--text-primary);
    font-size: 1.05rem;
    transition: background-color 0.2s ease, color 0.2s ease, border-color 0.2s ease, transform 0.15s ease;
}

.footer-social a:hover {
    border-color: var(--color-primary);
    background-color: var(--color-primary);
    color: var(--color-black);
    transform: translateY(-2px);
}

.footer-bottom {
    text-align: center;
    color: var(--text-muted);
    font-size: var(--text-small);
}

@media (max-width: 1024px) {
    .footer {
        padding: 40px 24px 24px;
    }
}

@media (max-width: 640px) {
    .footer-main {
        flex-direction: column;
        align-items: flex-start;
        gap: 20px;
    }
}
</style>
