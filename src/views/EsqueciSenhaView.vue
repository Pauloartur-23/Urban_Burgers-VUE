<script setup>
import { ref } from 'vue';
import { solicitarRecuperacaoSenha } from '@/services/senha.js';

const email = ref('');
const erro = ref('');
const enviado = ref(false);
const carregando = ref(false);

async function handleSubmit() {
    erro.value = '';
    carregando.value = true;

    try {
        await solicitarRecuperacaoSenha(email.value);
        enviado.value = true;
    } catch (e) {
        erro.value = e.message;
    } finally {
        carregando.value = false;
    }
}
</script>

<template>
    <div>
        <h1>Esqueceu <span>a senha?</span></h1>
        <p class="auth-sub">Informe seu e-mail e enviaremos um link para você criar uma nova senha.</p>

        <form v-if="!enviado" @submit.prevent="handleSubmit">
            <label class="auth-field">
                <span class="mdi mdi-email-outline" aria-hidden="true"></span>
                <input v-model="email" type="email" placeholder="E-mail" aria-label="E-mail" autocomplete="email" required />
            </label>

            <p v-if="erro" class="auth-msg erro">{{ erro }}</p>

            <button type="submit" class="auth-submit" :disabled="carregando">
                {{ carregando ? 'Enviando...' : 'Enviar link' }}
                <span class="mdi mdi-arrow-right"></span>
            </button>
        </form>

        <p v-else class="auth-msg ok">
            Se o e-mail informado estiver cadastrado, você receberá um link para redefinir sua senha.
        </p>

        <p class="auth-footer">
            Lembrou a senha?<router-link to="/login">Entrar</router-link>
        </p>
    </div>
</template>
