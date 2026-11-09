<script setup>
import { ref } from 'vue';
import { useRoute } from 'vue-router';
import { destinoPosLogin, login } from '@/services/login.js';
import GoogleButton from '@/components/auth/GoogleButton.vue';

const route = useRoute();

const email = ref('');
const password = ref('');
const mostrarSenha = ref(false);
const erro = ref('');
const carregando = ref(false);

async function handleSubmit() {
    erro.value = '';
    carregando.value = true;

    try {
        await login(email.value, password.value);
        window.location.href = destinoPosLogin();
    } catch (e) {
        erro.value = e.message;
    } finally {
        carregando.value = false;
    }
}
</script>

<template>
    <div>
        <h1>Acesse <span>sua conta</span></h1>
        <p class="auth-sub">Entre com seus dados para fazer pedidos, acompanhar promoções e muito mais.</p>

        <p v-if="route.query.motivo === 'carrinho'" class="auth-msg aviso">
            <span class="mdi mdi-cart-outline"></span> Entre ou crie uma conta para montar seu pedido.
        </p>
        <p v-else-if="route.query.motivo === 'curtir'" class="auth-msg aviso">
            <span class="mdi mdi-heart-outline"></span> Entre ou crie uma conta para guardar seus favoritos.
        </p>

        <form @submit.prevent="handleSubmit">
            <label class="auth-field">
                <span class="mdi mdi-email-outline" aria-hidden="true"></span>
                <input v-model="email" type="email" placeholder="E-mail" aria-label="E-mail" autocomplete="email" required />
            </label>

            <label class="auth-field">
                <span class="mdi mdi-lock-outline" aria-hidden="true"></span>
                <input
                    v-model="password"
                    :type="mostrarSenha ? 'text' : 'password'"
                    placeholder="Senha"
                    aria-label="Senha"
                    autocomplete="current-password"
                    required
                />
                <button
                    type="button"
                    class="auth-eye"
                    :aria-label="mostrarSenha ? 'Ocultar senha' : 'Mostrar senha'"
                    @click="mostrarSenha = !mostrarSenha"
                >
                    <span class="mdi" :class="mostrarSenha ? 'mdi-eye-outline' : 'mdi-eye-off-outline'"></span>
                </button>
            </label>

            <router-link to="/esqueci-senha" class="auth-link-right">Esqueceu sua senha?</router-link>

            <p v-if="erro" class="auth-msg erro">{{ erro }}</p>

            <button type="submit" class="auth-submit" :disabled="carregando">
                {{ carregando ? 'Entrando...' : 'Entrar na conta' }}
                <span class="mdi mdi-arrow-right"></span>
            </button>
        </form>

        <GoogleButton />

        <p class="auth-footer">
            Ainda não tem uma conta?<router-link :to="{ path: '/registro', query: route.query }">Cadastre-se</router-link>
        </p>
    </div>
</template>
