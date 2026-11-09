<script setup>
import { onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';
import { getUsuarioAtual, logout } from '@/services/usuario.js';
import { apagarEndereco, atualizarCliente, criarEndereco, getCliente, listarEnderecos } from '@/services/enderecos.js';
import { listarPedidos } from '@/services/carrinho.js';
import { formatarEndereco, linkMapa } from '@/composables/useLocalizacao.js';
import { useCartStore } from '@/stores/cart.js';
import { brl, formatarDataHora } from '@/utils/formato.js';
import EnderecoForm from '@/components/endereco/EnderecoForm.vue';

const router = useRouter();
const cart = useCartStore();

const usuario = ref(null);
const telefone = ref('');
const enderecos = ref([]);
const pedidos = ref([]);
const erro = ref('');
const aviso = ref('');
const carregando = ref(true);
const mostrarForm = ref(false);

onMounted(async () => {
    try {
        const [u, cliente, ends, peds] = await Promise.all([getUsuarioAtual(), getCliente(), listarEnderecos(), listarPedidos()]);
        usuario.value = u;
        telefone.value = cliente.telefone;
        enderecos.value = ends;
        pedidos.value = peds;
    } catch (e) {
        erro.value = e.message;
    } finally {
        carregando.value = false;
    }
});

function avisar(msg) {
    aviso.value = msg;
    setTimeout(() => { if (aviso.value === msg) aviso.value = ''; }, 3000);
}

async function salvarTelefone() {
    erro.value = '';
    try {
        await atualizarCliente({ telefone: telefone.value });
        avisar('Telefone salvo!');
    } catch (e) {
        erro.value = e.message;
    }
}

async function adicionarEndereco(dados) {
    erro.value = '';
    try {
        enderecos.value.push(await criarEndereco(dados));
        mostrarForm.value = false;
        avisar('Endereço salvo!');
    } catch {
        erro.value = 'Não foi possível salvar o endereço. Confira os campos.';
    }
}

async function removerEndereco(end) {
    if (!confirm('Remover este endereço?')) return;
    try {
        await apagarEndereco(end.id);
        enderecos.value = enderecos.value.filter((e) => e.id !== end.id);
    } catch (e) {
        erro.value = e.message;
    }
}

// coloca os mesmos itens no carrinho (com o preço de hoje) e abre o carrinho
async function pedirDeNovo(pedido) {
    for (const ci of pedido.itens_detalhe) {
        const i = ci.item_detalhe;
        await cart.addItem({ id: i.id, name: i.nome, preco: Number(i.preco), img: i.imagem?.url ?? null }, ci.quantidade);
    }
    cart.open();
}

function handleLogout() {
    logout();
    window.location.href = '/';
}
</script>

<template>
    <div class="page">
        <p class="eyebrow">Minha conta</p>
        <h1>Olá, <span class="highlight">{{ usuario?.name?.split(' ')[0] || 'cliente' }}</span></h1>

        <div v-if="carregando" class="esqueleto"></div>

        <template v-else>
            <p v-if="aviso" class="form-success" role="status">{{ aviso }}</p>
            <p v-if="erro" class="form-error" role="alert">{{ erro }}</p>

            <div class="account-grid">
                <section class="card pedidos">
                    <h2>Meus pedidos</h2>

                    <div v-if="pedidos.length === 0" class="vazio">
                        <span class="mdi mdi-receipt-text-outline" aria-hidden="true"></span>
                        <p>Você ainda não fez nenhum pedido.</p>
                        <router-link to="/cardapio" class="btn btn-primary">Fazer o primeiro</router-link>
                    </div>

                    <ul v-else class="pedidos-lista">
                        <li v-for="p in pedidos" :key="p.id">
                            <router-link :to="`/pedidos/${p.id}`" class="pedido-link">
                                <span class="pedido-num">#{{ p.id }}</span>
                                <span class="pedido-info">
                                    <strong>{{ p.itens_detalhe.map((ci) => `${ci.quantidade}× ${ci.item_detalhe.nome}`).join(', ') }}</strong>
                                    <small>{{ formatarDataHora(p.finalizado_em) }} · {{ brl(p.total) }}</small>
                                </span>
                                <span class="status" :class="p.status">{{ p.status_display }}</span>
                            </router-link>
                            <button type="button" class="de-novo" title="Colocar os mesmos itens no carrinho" @click="pedirDeNovo(p)">
                                <span class="mdi mdi-refresh"></span> Pedir de novo
                            </button>
                        </li>
                    </ul>
                </section>

                <div class="lateral">
                    <section class="card">
                        <h2>Meus dados</h2>
                        <p class="email"><span class="mdi mdi-email-outline"></span> {{ usuario?.email }}</p>
                        <form class="telefone" @submit.prevent="salvarTelefone">
                            <label>WhatsApp / telefone
                                <input v-model="telefone" type="tel" autocomplete="tel" placeholder="(47) 99999-9999" />
                            </label>
                            <button type="submit" class="btn btn-outline">Salvar</button>
                        </form>

                        <div class="form-actions">
                            <router-link to="/curtidos" class="btn btn-outline"><span class="mdi mdi-heart-outline"></span> Curtidos</router-link>
                            <router-link v-if="usuario?.is_staff" to="/painel" class="btn btn-outline">
                                <span class="mdi mdi-cog-outline"></span> Painel
                            </router-link>
                            <button type="button" class="btn btn-outline" @click="handleLogout">
                                <span class="mdi mdi-logout"></span> Sair
                            </button>
                        </div>
                    </section>

                    <section class="card">
                        <div class="card-header">
                            <h2>Endereços</h2>
                            <button v-if="!mostrarForm" class="btn btn-outline btn-sm" @click="mostrarForm = true">
                                <span class="mdi mdi-plus"></span> Novo
                            </button>
                        </div>

                        <template v-if="mostrarForm">
                            <EnderecoForm @submit="adicionarEndereco" />
                            <button class="btn btn-link" @click="mostrarForm = false">Cancelar</button>
                        </template>

                        <p v-else-if="enderecos.length === 0" class="form-status">
                            Nenhum endereço salvo. Ele também pode ser cadastrado na hora do pedido.
                        </p>

                        <ul class="lista">
                            <li v-for="end in enderecos" :key="end.id">
                                <span class="mdi mdi-map-marker-outline thumb thumb-vazio"></span>
                                <div class="lista-info">
                                    <strong>{{ end.apelido || 'Endereço' }}</strong>
                                    <small>{{ formatarEndereco(end) }}</small>
                                    <a v-if="end.latitude" :href="linkMapa(end.latitude, end.longitude)" target="_blank" rel="noopener">Ver no mapa</a>
                                </div>
                                <button class="icon-btn danger" aria-label="Remover endereço" @click="removerEndereco(end)">
                                    <span class="mdi mdi-trash-can-outline"></span>
                                </button>
                            </li>
                        </ul>
                    </section>
                </div>
            </div>
        </template>
    </div>
</template>

<style scoped>
.account-grid {
    display: grid;
    grid-template-columns: minmax(0, 1.5fr) minmax(0, 1fr);
    gap: 24px;
    align-items: start;
}

.vazio {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 6px;
    padding: 32px 0;
    color: var(--text-secondary);
    text-align: center;
}

.vazio .mdi {
    font-size: 2.6rem;
    color: var(--color-gray-500);
}

.pedidos-lista {
    list-style: none;
}

.pedidos-lista li {
    display: flex;
    align-items: center;
    gap: 10px;
    border-bottom: 1px solid var(--border-color);
}

.page .pedido-link {
    display: flex;
    flex: 1;
    align-items: center;
    gap: 14px;
    min-width: 0;
    padding: 14px 10px;
    margin-left: -10px;
    border-radius: var(--radius);
    color: var(--text-primary);
    text-decoration: none;
    transition: background-color 0.2s ease;
}

.page .pedido-link:hover {
    background-color: rgba(255, 255, 255, 0.04);
}

.pedido-num {
    font-family: 'Bebas Neue', sans-serif;
    font-size: 1.5rem;
    color: var(--color-primary);
}

.pedido-info {
    display: flex;
    flex: 1;
    flex-direction: column;
    min-width: 0;
}

.pedido-info strong {
    overflow: hidden;
    font-weight: 600;
    white-space: nowrap;
    text-overflow: ellipsis;
}

.pedido-info small {
    color: var(--text-muted);
}

.status {
    flex-shrink: 0;
    padding: 4px 10px;
    border-radius: var(--radius-full);
    background-color: rgba(245, 169, 0, 0.12);
    color: var(--color-primary);
    font-size: 0.75rem;
    font-weight: 700;
}

.status.concluido {
    background-color: rgba(37, 211, 102, 0.12);
    color: #6ee7a0;
}

.status.cancelado {
    background-color: rgba(220, 53, 69, 0.15);
    color: #ff8a95;
}

.de-novo {
    display: inline-flex;
    align-items: center;
    gap: 4px;
    flex-shrink: 0;
    padding: 8px 12px;
    border: 1px solid var(--border-color);
    border-radius: var(--radius-full);
    background: none;
    color: var(--text-primary);
    font: inherit;
    font-size: 0.8rem;
    font-weight: 600;
    cursor: pointer;
    transition: border-color 0.2s ease, color 0.2s ease;
}

.de-novo:hover {
    border-color: var(--color-primary);
    color: var(--color-primary);
}

.lateral {
    display: flex;
    flex-direction: column;
}

.email {
    display: flex;
    align-items: center;
    gap: 8px;
    color: var(--text-secondary);
}

.telefone {
    display: flex;
    align-items: flex-end;
    gap: 10px;
}

.telefone label {
    flex: 1;
}

.page .telefone .btn {
    margin-bottom: 14px;
}

.page .btn-sm {
    padding: 8px 14px;
}

.esqueleto {
    height: 360px;
    border-radius: var(--radius-lg);
    background: #141414;
}

@media (max-width: 900px) {
    .account-grid {
        grid-template-columns: 1fr;
    }
}

@media (max-width: 520px) {
    .pedidos-lista li {
        flex-wrap: wrap;
        padding-bottom: 12px;
    }

    .de-novo {
        margin-left: auto;
    }
}
</style>
