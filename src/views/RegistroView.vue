<script setup>
import { ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { registrar } from '@/services/registro.js';
import { destinoPosLogin, login } from '@/services/login.js';
import GoogleButton from '@/components/auth/GoogleButton.vue';

const router = useRouter();
const route = useRoute();

const name = ref('');
const email = ref('');
const password = ref('');
const confirmacao = ref('');
const mostrarSenha = ref(false);
const mostrarConfirmacao = ref(false);
const erro = ref('');
const sucesso = ref(false);
const carregando = ref(false);

async function handleSubmit() {
    erro.value = '';
    if (password.value !== confirmacao.value) {
        erro.value = 'As senhas não conferem.';
        return;
    }
    carregando.value = true;

    try {
        await registrar(email.value, name.value, password.value);
        sucesso.value = true;
        // já entra direto: ninguém quer digitar e-mail e senha de novo logo depois de criar a conta
        try {
            await login(email.value, password.value);
            window.location.href = destinoPosLogin();
        } catch {
            router.push({ path: '/login', query: route.query });
        }
    } catch (e) {
        erro.value = e.message;
    } finally {
        carregando.value = false;
    }
}
</script>

<template>
    <div>
        <h1>Crie sua <span>conta</span></h1>
        <p class="auth-sub">Faça seu cadastro e comece a pedir seus burgers favoritos agora mesmo.</p>

        <form @submit.prevent="handleSubmit">
            <label class="auth-field">
                <span class="mdi mdi-account-outline" aria-hidden="true"></span>
                <input v-model="name" type="text" placeholder="Nome completo" aria-label="Nome completo" autocomplete="name" required />
            </label>

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
                    title="Mínimo de 8 caracteres"
                    aria-label="Senha"
                    autocomplete="new-password"
                    minlength="8"
                    required
                />
                <button type="button" class="auth-eye" :aria-label="mostrarSenha ? 'Ocultar senha' : 'Mostrar senha'" @click="mostrarSenha = !mostrarSenha">
                    <span class="mdi" :class="mostrarSenha ? 'mdi-eye-outline' : 'mdi-eye-off-outline'"></span>
                </button>
            </label>

            <label class="auth-field">
                <span class="mdi mdi-lock-outline" aria-hidden="true"></span>
                <input
                    v-model="confirmacao"
                    :type="mostrarConfirmacao ? 'text' : 'password'"
                    placeholder="Confirmar senha"
                    aria-label="Confirmar senha"
                    autocomplete="new-password"
                    minlength="8"
                    required
                />
                <button
                    type="button"
                    class="auth-eye"
                    :aria-label="mostrarConfirmacao ? 'Ocultar senha' : 'Mostrar senha'"
                    @click="mostrarConfirmacao = !mostrarConfirmacao"
                >
                    <span class="mdi" :class="mostrarConfirmacao ? 'mdi-eye-outline' : 'mdi-eye-off-outline'"></span>
                </button>
            </label>

            <p v-if="erro" class="auth-msg erro">{{ erro }}</p>
            <p v-if="sucesso" class="auth-msg ok">Conta criada! Entrando...</p>

            <button type="submit" class="auth-submit" :disabled="carregando || sucesso">
                {{ carregando ? 'Cadastrando...' : 'Cadastrar conta' }}
                <span class="mdi mdi-arrow-right"></span>
            </button>
        </form>

        <GoogleButton divisor="ou cadastre-se com" />

        <p class="auth-footer">
            Já tem uma conta?<router-link :to="{ path: '/login', query: route.query }">Entrar</router-link>
        </p>
    </div>
</template>
