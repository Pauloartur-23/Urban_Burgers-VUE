<script setup>
import { ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { redefinirSenha } from '@/services/senha.js';

const route = useRoute();
const router = useRouter();

const uid = route.query.uid ?? '';
const token = route.query.token ?? '';

const novaSenha = ref('');
const mostrarSenha = ref(false);
const erro = ref('');
const sucesso = ref(false);
const carregando = ref(false);

async function handleSubmit() {
    erro.value = '';
    carregando.value = true;

    try {
        await redefinirSenha(uid, token, novaSenha.value);
        sucesso.value = true;
        setTimeout(() => router.push('/login'), 1500);
    } catch (e) {
        erro.value = e.message;
    } finally {
        carregando.value = false;
    }
}
</script>

<template>
    <div>
        <h1>Nova <span>senha</span></h1>

        <p v-if="!uid || !token" class="auth-msg erro">Link inválido. Solicite a recuperação de senha novamente.</p>

        <form v-else-if="!sucesso" @submit.prevent="handleSubmit">
            <p class="auth-sub">Escolha uma nova senha com pelo menos 8 caracteres.</p>
            <label class="auth-field">
                <span class="mdi mdi-lock-outline" aria-hidden="true"></span>
                <input
                    v-model="novaSenha"
                    :type="mostrarSenha ? 'text' : 'password'"
                    placeholder="Nova senha"
                    aria-label="Nova senha"
                    autocomplete="new-password"
                    minlength="8"
                    required
                />
                <button type="button" class="auth-eye" :aria-label="mostrarSenha ? 'Ocultar senha' : 'Mostrar senha'" @click="mostrarSenha = !mostrarSenha">
                    <span class="mdi" :class="mostrarSenha ? 'mdi-eye-outline' : 'mdi-eye-off-outline'"></span>
                </button>
            </label>

            <p v-if="erro" class="auth-msg erro">{{ erro }}</p>

            <button type="submit" class="auth-submit" :disabled="carregando">
                {{ carregando ? 'Salvando...' : 'Redefinir senha' }}
                <span class="mdi mdi-arrow-right"></span>
            </button>
        </form>

        <p v-else class="auth-msg ok">Senha redefinida com sucesso! Redirecionando para o login...</p>

        <p class="auth-footer">
            <router-link to="/esqueci-senha">Pedir um novo link</router-link>
        </p>
    </div>
</template>
