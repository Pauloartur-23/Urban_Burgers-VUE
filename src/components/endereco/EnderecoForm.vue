<script setup>
import { reactive, ref } from 'vue';
import { enderecoPorCep, enderecoPorCoordenadas, obterPosicao } from '@/composables/useLocalizacao.js';

const props = defineProps({
    submitLabel: { type: String, default: 'Salvar endereço' },
    showApelido: { type: Boolean, default: true },
});
const emit = defineEmits(['submit']);

const vazio = () => ({
    apelido: '', rua: '', numero_da_casa: '', bairro: '', complemento: '',
    cidade: '', cep: '', latitude: null, longitude: null,
});
const form = reactive(vazio());
const status = ref('');
const erro = ref('');
const buscando = ref(false);

async function usarMinhaLocalizacao() {
    erro.value = '';
    status.value = 'Obtendo sua localização...';
    buscando.value = true;
    try {
        const { latitude, longitude } = await obterPosicao();
        // a API guarda 6 casas decimais
        form.latitude = Number(latitude.toFixed(6));
        form.longitude = Number(longitude.toFixed(6));
        status.value = 'Localização obtida! Buscando endereço...';
        try {
            const end = await enderecoPorCoordenadas(latitude, longitude);
            Object.entries(end).forEach(([k, v]) => { if (v) form[k] = v; });
            status.value = 'Endereço preenchido pela localização. Confira o número e o complemento.';
        } catch {
            status.value = 'Localização obtida. Preencha o endereço manualmente.';
        }
    } catch (e) {
        status.value = '';
        erro.value = e.message;
    } finally {
        buscando.value = false;
    }
}

async function buscarCep() {
    if (!form.cep) return;
    erro.value = '';
    try {
        Object.assign(form, await enderecoPorCep(form.cep));
    } catch (e) {
        erro.value = e.message;
    }
}

function handleSubmit() {
    emit('submit', { ...form });
    Object.assign(form, vazio());
    status.value = '';
}
</script>

<template>
    <form class="form-grid" @submit.prevent="handleSubmit">
        <button type="button" class="btn btn-outline full" :disabled="buscando" @click="usarMinhaLocalizacao">
            <span class="mdi mdi-crosshairs-gps"></span>
            {{ buscando ? 'Localizando...' : 'Usar minha localização atual' }}
        </button>
        <p v-if="status" class="form-status full">{{ status }}</p>
        <p v-if="form.latitude" class="form-status full">
            <span class="mdi mdi-map-marker-check"></span> GPS: {{ form.latitude }}, {{ form.longitude }}
        </p>

        <label v-if="props.showApelido">Apelido
            <input v-model="form.apelido" placeholder="Casa, Trabalho..." />
        </label>
        <label>CEP
            <input v-model="form.cep" placeholder="00000-000" @blur="buscarCep" />
        </label>
        <label class="full">Rua
            <input v-model="form.rua" required />
        </label>
        <label>Número
            <input v-model="form.numero_da_casa" required />
        </label>
        <label>Bairro
            <input v-model="form.bairro" />
        </label>
        <label>Cidade
            <input v-model="form.cidade" required />
        </label>
        <label>Complemento / referência
            <input v-model="form.complemento" placeholder="Apto, bloco, ponto de referência" />
        </label>

        <p v-if="erro" class="form-error full">{{ erro }}</p>

        <button type="submit" class="btn btn-primary full">{{ props.submitLabel }}</button>
    </form>
</template>
