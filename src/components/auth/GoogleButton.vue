<script setup>
// Botão oficial "Continuar com Google" (Google Identity Services).
// Só aparece quando VITE_GOOGLE_CLIENT_ID está configurado.
import { onMounted, ref } from 'vue';
import { destinoPosLogin, loginGoogle } from '@/services/login.js';

const props = defineProps({
    divisor: { type: String, default: 'ou entre com' },
});

const CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID;
const alvo = ref(null);
const erro = ref('');

let scriptGoogle;
function carregarScript() {
    scriptGoogle ??= new Promise((resolve, reject) => {
        const s = document.createElement('script');
        s.src = 'https://accounts.google.com/gsi/client';
        s.async = true;
        s.onload = resolve;
        s.onerror = () => reject(new Error('Não foi possível carregar o login do Google.'));
        document.head.appendChild(s);
    });
    return scriptGoogle;
}

async function aoReceberCredencial({ credential }) {
    erro.value = '';
    try {
        await loginGoogle(credential);
        window.location.href = destinoPosLogin();
    } catch (e) {
        erro.value = e.message;
    }
}

onMounted(async () => {
    if (!CLIENT_ID) return;
    try {
        await carregarScript();
        window.google.accounts.id.initialize({ client_id: CLIENT_ID, callback: aoReceberCredencial });
        window.google.accounts.id.renderButton(alvo.value, {
            theme: 'filled_black',
            size: 'large',
            shape: 'rectangular',
            text: 'continue_with',
            logo_alignment: 'center',
            width: Math.min(alvo.value.offsetWidth || 400, 400),
            locale: 'pt-BR',
        });
    } catch (e) {
        erro.value = e.message;
    }
});
</script>

<template>
    <div v-if="CLIENT_ID" class="google">
        <p class="google-divisor"><span>{{ props.divisor }}</span></p>
        <div ref="alvo" class="google-botao"></div>
        <p v-if="erro" class="auth-msg erro">{{ erro }}</p>
    </div>
</template>

<style scoped>
.google-divisor {
    display: flex;
    align-items: center;
    gap: 16px;
    margin: 24px 0 18px;
    color: #cfcfcf;
}

.google-divisor::before,
.google-divisor::after {
    content: '';
    flex: 1;
    height: 1px;
    background-color: #5a5a5a;
}

.google-botao {
    display: flex;
    justify-content: center;
    min-height: 44px;
}
</style>
