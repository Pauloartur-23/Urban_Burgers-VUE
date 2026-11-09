<script setup>
// Layout das rotas de acesso (login, cadastro, senha): painel escuro do formulário + foto do burger.
// Ao trocar de página o painel desliza para o outro lado, crescendo até cobrir a tela no meio do caminho.
import { computed, ref, watch } from 'vue';
import { useRoute } from 'vue-router';

const route = useRoute();
const painelDireita = computed(() => route.meta.painelDireita === true);
const animacao = ref(''); // 'anim-esquerda' | 'anim-direita'

watch(painelDireita, (direita, antes) => {
    if (direita === antes) return;
    animacao.value = direita ? 'anim-direita' : 'anim-esquerda';
});
</script>

<template>
    <div class="auth" :class="{ 'panel-right': painelDireita }">
        <div class="auth-photo" aria-hidden="true"></div>

        <section class="auth-panel" :class="animacao" @animationend="animacao = ''">
            <span class="auth-stripes" aria-hidden="true"></span>

            <div class="auth-content">
                <router-link to="/" class="auth-logo" aria-label="Voltar para o início">
                    <img src="@/assets/images/logo/logo_urban_burger.png" alt="Urban Burger" />
                </router-link>

                <RouterView v-slot="{ Component }">
                    <Transition name="auth-troca" mode="out-in">
                        <component :is="Component" :key="route.path" />
                    </Transition>
                </RouterView>
            </div>
        </section>
    </div>
</template>

<style scoped>
.auth {
    --auth-yellow: #f5b800;
    --auth-painel: 44%;
    --auth-duracao: 0.8s;
    position: relative;
    display: flex;
    min-height: 100vh;
    min-height: 100dvh;
    overflow: hidden;
    background-color: #060606;
}

/* a foto fica do lado oposto ao painel; troca de lado só no meio da animação, quando está coberta */
.auth-photo {
    position: absolute;
    top: 0;
    bottom: 0;
    left: var(--auth-painel);
    width: calc(100% - var(--auth-painel));
    background: url('@/assets/images/auth/auth-bg.webp') left center / cover no-repeat;
    transition: left 0s linear calc(var(--auth-duracao) / 2);
}

.panel-right .auth-photo {
    left: 0;
}

.auth-panel {
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
    width: var(--auth-painel);
    min-width: 380px;
    margin-left: 0;
    padding: calc(var(--header-height) + 32px) 56px 80px;
    background-color: #070707;
    border-right: 2px solid var(--auth-yellow);
    border-radius: 0 28px 28px 0;
    z-index: 1;
}

.panel-right .auth-panel {
    margin-left: calc(100% - var(--auth-painel));
    border-right: none;
    border-left: 2px solid var(--auth-yellow);
    border-radius: 28px 0 0 28px;
}

/* direita -> esquerda (login -> cadastro / esqueci a senha) */
.auth-panel.anim-esquerda {
    animation: painel-para-esquerda var(--auth-duracao) cubic-bezier(0.7, 0, 0.3, 1);
}

/* esquerda -> direita (cadastro -> login) */
.auth-panel.anim-direita {
    animation: painel-para-direita var(--auth-duracao) cubic-bezier(0.7, 0, 0.3, 1);
}

@keyframes painel-para-esquerda {
    from {
        margin-left: calc(100% - var(--auth-painel));
        width: var(--auth-painel);
    }
    50% {
        margin-left: 0;
        width: 100%;
        border-radius: 0;
    }
    to {
        margin-left: 0;
        width: var(--auth-painel);
    }
}

@keyframes painel-para-direita {
    from {
        margin-left: 0;
        width: var(--auth-painel);
    }
    50% {
        margin-left: 0;
        width: 100%;
        border-radius: 0;
    }
    to {
        margin-left: calc(100% - var(--auth-painel));
        width: var(--auth-painel);
    }
}

/* conteúdo do formulário: sai rápido, entra depois que o painel abriu */
.auth-troca-leave-active {
    transition: opacity 0.2s ease, transform 0.2s ease;
}

.auth-troca-enter-active {
    transition: opacity 0.35s ease 0.25s, transform 0.35s ease 0.25s;
}

.auth-troca-enter-from {
    opacity: 0;
    transform: translateY(14px);
}

.auth-troca-leave-to {
    opacity: 0;
    transform: translateY(-10px);
}

@media (prefers-reduced-motion: reduce) {
    .auth-panel.anim-esquerda,
    .auth-panel.anim-direita {
        animation: none;
    }

    .auth-photo {
        transition: none;
    }
}

.auth-stripes {
    position: absolute;
    top: 0;
    right: 24px;
    width: 110px;
    height: 38px;
    background: repeating-linear-gradient(-60deg, var(--auth-yellow) 0 14px, transparent 14px 28px);
    clip-path: polygon(14% 0, 100% 0, 86% 100%, 0 100%);
}

.auth-content {
    position: relative;
    width: 100%;
    max-width: 520px;
    z-index: 1;
}

.auth-logo {
    display: block;
    width: fit-content;
    margin: 0 auto 8px;
}

.auth-logo img {
    width: 220px;
    height: auto;
}

.auth-logo img {
    transition: transform 0.3s ease;
}

.auth-logo:hover img {
    transform: scale(1.05) rotate(-2deg);
}

/* ---------- Conteúdo compartilhado dos formulários ---------- */
.auth-content :deep(h1) {
    font-family: inherit;
    font-size: clamp(2.2rem, 3.6vw, 3.2rem);
    font-weight: 800;
    letter-spacing: -0.01em;
    line-height: 1.1;
    margin-bottom: 8px;
}

.auth-content :deep(h1 span) {
    color: var(--auth-yellow);
}

.auth-content :deep(.auth-sub) {
    color: #bdbdbd;
    font-size: 1.05rem;
    margin-bottom: 28px;
}

.auth-content :deep(.auth-field) {
    position: relative;
    display: flex;
    align-items: center;
    margin-bottom: 14px;
    border: 1px solid #4a4a4a;
    border-radius: 10px;
    background-color: #0d0d0d;
    transition: border-color 0.2s ease, background-color 0.2s ease, box-shadow 0.2s ease;
}

.auth-content :deep(.auth-field:hover) {
    border-color: #7a7a7a;
    background-color: #111;
}

.auth-content :deep(.auth-field:focus-within) {
    border-color: var(--auth-yellow);
    box-shadow: 0 0 0 3px rgba(245, 184, 0, 0.15);
}

.auth-content :deep(.auth-field > .mdi) {
    padding: 0 6px 0 18px;
    font-size: 1.35rem;
    color: #cfcfcf;
    transition: color 0.2s ease;
}

.auth-content :deep(.auth-field:focus-within > .mdi) {
    color: var(--auth-yellow);
}

.auth-content :deep(.auth-field input) {
    flex: 1;
    min-width: 0;
    padding: 15px 12px;
    border: none;
    background: none;
    color: #fff;
    font: inherit;
    font-size: 1rem;
    outline: none;
}

.auth-content :deep(.auth-field input::placeholder) {
    color: #a5a5a5;
}

.auth-content :deep(.auth-eye) {
    padding: 0 16px;
    background: none;
    border: none;
    color: #cfcfcf;
    font-size: 1.3rem;
    cursor: pointer;
    transition: color 0.2s ease, transform 0.2s ease;
}

.auth-content :deep(.auth-eye:hover) {
    color: var(--auth-yellow);
    transform: scale(1.12);
}

.auth-content :deep(.auth-link-right) {
    display: block;
    width: fit-content;
    margin: -2px 0 18px auto;
    color: var(--auth-yellow);
    font-weight: 700;
    text-decoration: none;
}

/* sublinhado que cresce no hover */
.auth-content :deep(.auth-link-right),
.auth-content :deep(.auth-footer a) {
    background: linear-gradient(currentColor, currentColor) left bottom / 0 2px no-repeat;
    transition: background-size 0.25s ease;
}

.auth-content :deep(.auth-link-right:hover),
.auth-content :deep(.auth-footer a:hover) {
    background-size: 100% 2px;
}

.auth-content :deep(.auth-submit) {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 14px;
    width: 100%;
    margin-top: 8px;
    padding: 16px;
    border: none;
    border-radius: 12px;
    background-color: var(--auth-yellow);
    color: #111;
    font: inherit;
    font-size: 1.2rem;
    font-weight: 800;
    cursor: pointer;
    transition: filter 0.2s ease, transform 0.2s ease, box-shadow 0.2s ease;
}

.auth-content :deep(.auth-submit:hover:not(:disabled)) {
    filter: brightness(1.08);
    transform: translateY(-2px);
    box-shadow: 0 10px 24px rgba(0, 0, 0, 0.45);
}

.auth-content :deep(.auth-submit .mdi) {
    transition: transform 0.25s ease;
}

.auth-content :deep(.auth-submit:hover:not(:disabled) .mdi) {
    transform: translateX(5px);
}

.auth-content :deep(.auth-submit:disabled) {
    opacity: 0.6;
    cursor: not-allowed;
    transform: none;
}

.auth-content :deep(.auth-footer) {
    margin-top: 28px;
    text-align: center;
    color: #e5e5e5;
}

.auth-content :deep(.auth-footer a) {
    margin-left: 10px;
    color: var(--auth-yellow);
    font-weight: 800;
    text-decoration: none;
}

.auth-content :deep(.auth-msg) {
    margin: 4px 0 12px;
    padding: 10px 14px;
    border-radius: 8px;
    font-size: 0.9rem;
}

.auth-content :deep(.auth-msg.erro) {
    background-color: rgba(220, 53, 69, 0.15);
    border: 1px solid rgba(220, 53, 69, 0.5);
    color: #ff8a95;
}

.auth-content :deep(.auth-msg.aviso) {
    display: flex;
    align-items: center;
    gap: 8px;
    margin-bottom: 20px;
    border: 1px solid rgba(245, 184, 0, 0.5);
    color: var(--auth-yellow);
}

.auth-content :deep(.auth-msg.ok) {
    background-color: rgba(37, 211, 102, 0.12);
    border: 1px solid rgba(37, 211, 102, 0.45);
    color: #6ee7a0;
}

@media (max-width: 860px) {
    /* no celular a foto vira fundo atrás do painel, sem deslizar */
    .auth-photo,
    .panel-right .auth-photo {
        left: 0;
        width: 100%;
        background-position: 20% center;
        filter: brightness(0.35);
        transition: none;
    }

    .auth-panel,
    .panel-right .auth-panel {
        width: 100%;
        min-width: 0;
        margin-left: 0;
        padding: calc(var(--header-height) + 24px) 20px 64px;
        border: none;
        border-radius: 0;
        background: linear-gradient(rgba(7, 7, 7, 0.75), rgba(7, 7, 7, 0.92));
    }

    .auth-panel.anim-esquerda,
    .auth-panel.anim-direita {
        animation: none;
    }

    .auth-logo img {
        width: 170px;
    }
}
</style>
