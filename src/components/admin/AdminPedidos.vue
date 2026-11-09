<script setup>
// Aba "Pedidos" do painel: a loja acompanha os pedidos e muda o status (o cliente vê na hora).
import { computed, onMounted, onUnmounted, ref } from 'vue';
import { listarPedidos, mudarStatusPedido } from '@/services/carrinho.js';
import { brl, formatarDataHora } from '@/utils/formato.js';

const STATUS = [
    { valor: 'recebido', rotulo: 'Recebido' },
    { valor: 'preparo', rotulo: 'Em preparo' },
    { valor: 'entrega', rotulo: 'Saiu p/ entrega' },
    { valor: 'concluido', rotulo: 'Entregue' },
    { valor: 'cancelado', rotulo: 'Cancelar' },
];

const pedidos = ref([]);
const filtro = ref('abertos');
const erro = ref('');
const carregando = ref(true);

const ABERTOS = ['recebido', 'preparo', 'entrega'];
const visiveis = computed(() =>
    filtro.value === 'abertos' ? pedidos.value.filter((p) => ABERTOS.includes(p.status)) : pedidos.value
);
const qtdAbertos = computed(() => pedidos.value.filter((p) => ABERTOS.includes(p.status)).length);
const somenteDigitos = (t) => (t || '').replace(/\D/g, '');

async function carregar() {
    try {
        pedidos.value = await listarPedidos();
        erro.value = '';
    } catch (e) {
        erro.value = e.message;
    } finally {
        carregando.value = false;
    }
}

async function mudar(pedido, status) {
    if (status === 'cancelado' && !confirm(`Cancelar o pedido #${pedido.id}?`)) return;
    const anterior = pedido.status;
    pedido.status = status;
    try {
        Object.assign(pedido, await mudarStatusPedido(pedido.id, status));
    } catch (e) {
        pedido.status = anterior;
        erro.value = e.message;
    }
}

// novos pedidos aparecem sozinhos
let timer;
onMounted(() => {
    carregar();
    timer = setInterval(carregar, 20_000);
});
onUnmounted(() => clearInterval(timer));
</script>

<template>
    <section>
        <div class="topo">
            <div class="filtros">
                <button :class="{ 'is-active': filtro === 'abertos' }" @click="filtro = 'abertos'">Em andamento ({{ qtdAbertos }})</button>
                <button :class="{ 'is-active': filtro === 'todos' }" @click="filtro = 'todos'">Todos</button>
            </div>
            <button class="btn btn-outline" @click="carregar"><span class="mdi mdi-refresh"></span> Atualizar</button>
        </div>

        <p v-if="erro" class="form-error">{{ erro }}</p>
        <p v-if="carregando" class="form-status">Carregando pedidos...</p>

        <div v-else-if="visiveis.length === 0" class="empty-state">
            <span class="mdi mdi-receipt-text-outline" aria-hidden="true"></span>
            <h2>{{ filtro === 'abertos' ? 'Nenhum pedido em andamento' : 'Nenhum pedido ainda' }}</h2>
            <p>Os pedidos feitos pelo site aparecem aqui automaticamente.</p>
        </div>

        <div v-else class="pedidos">
            <article v-for="p in visiveis" :key="p.id" class="card pedido" :class="p.status">
                <header>
                    <span class="num">#{{ p.id }}</span>
                    <span class="quando">{{ formatarDataHora(p.finalizado_em) }}</span>
                    <strong class="total">{{ brl(p.total) }}</strong>
                </header>

                <p class="cliente">
                    <strong>{{ p.nome_cliente }}</strong>
                    <a v-if="p.telefone" :href="`https://wa.me/55${somenteDigitos(p.telefone)}`" target="_blank" rel="noopener">
                        <span class="mdi mdi-whatsapp"></span> {{ p.telefone }}
                    </a>
                </p>
                <p class="endereco">
                    <span class="mdi mdi-map-marker-outline"></span> {{ p.endereco_entrega }}
                    <a v-if="p.link_mapa" :href="p.link_mapa" target="_blank" rel="noopener">mapa</a>
                </p>

                <ul class="itens">
                    <li v-for="ci in p.itens_detalhe" :key="ci.id"><b>{{ ci.quantidade }}×</b> {{ ci.item_detalhe.nome }}</li>
                </ul>

                <p class="pagto">
                    <span class="mdi mdi-cash-register"></span> {{ p.pagamento }}{{ p.troco ? ` · troco p/ ${p.troco}` : '' }}
                </p>
                <p v-if="p.observacao" class="obs"><span class="mdi mdi-note-text-outline"></span> {{ p.observacao }}</p>

                <div class="status-botoes" role="group" :aria-label="`Status do pedido ${p.id}`">
                    <button
                        v-for="s in STATUS"
                        :key="s.valor"
                        type="button"
                        :class="[s.valor, { 'is-active': p.status === s.valor }]"
                        :aria-pressed="p.status === s.valor"
                        @click="mudar(p, s.valor)"
                    >{{ s.rotulo }}</button>
                </div>
            </article>
        </div>
    </section>
</template>

<style scoped>
.topo {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
    margin-bottom: 20px;
}

.filtros {
    display: flex;
    gap: 8px;
}

.filtros button {
    padding: 9px 16px;
    border: 1px solid var(--border-color);
    border-radius: var(--radius-full);
    background: none;
    color: var(--text-secondary);
    font: inherit;
    font-size: var(--text-small);
    font-weight: 700;
    cursor: pointer;
}

.filtros button.is-active {
    border-color: var(--color-primary);
    background-color: var(--color-primary);
    color: #111;
}

.pedidos {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(min(100%, 340px), 1fr));
    gap: 18px;
}

.pedido {
    margin: 0;
    border-left: 4px solid var(--color-primary);
}

.pedido.concluido {
    border-left-color: #25d366;
    opacity: 0.75;
}

.pedido.cancelado {
    border-left-color: #dc3545;
    opacity: 0.6;
}

.pedido header {
    display: flex;
    align-items: baseline;
    gap: 10px;
    margin-bottom: 10px;
}

.num {
    font-family: 'Bebas Neue', sans-serif;
    font-size: 1.8rem;
    color: var(--color-primary);
}

.quando {
    color: var(--text-muted);
    font-size: var(--text-small);
}

.total {
    margin-left: auto;
    font-size: 1.1rem;
}

.pedido p {
    margin-bottom: 8px;
    font-size: var(--text-small);
}

.cliente {
    display: flex;
    flex-wrap: wrap;
    gap: 6px 12px;
}

.page .cliente a {
    color: #6ee7a0;
    text-decoration: none;
}

.endereco,
.pagto,
.obs {
    color: var(--text-secondary);
}

.endereco .mdi,
.pagto .mdi,
.obs .mdi {
    color: var(--color-primary);
}

.itens {
    list-style: none;
    margin: 10px 0;
    padding: 10px 0;
    border-block: 1px solid var(--border-color);
    font-size: var(--text-small);
}

.status-botoes {
    display: flex;
    flex-wrap: wrap;
    gap: 6px;
    margin-top: 12px;
}

.status-botoes button {
    padding: 6px 10px;
    border: 1px solid var(--border-color);
    border-radius: var(--radius-full);
    background: none;
    color: var(--text-secondary);
    font: inherit;
    font-size: 0.75rem;
    font-weight: 700;
    cursor: pointer;
    transition: border-color 0.2s ease, color 0.2s ease;
}

.status-botoes button:hover {
    border-color: var(--text-secondary);
    color: var(--text-primary);
}

.status-botoes button.is-active {
    border-color: var(--color-primary);
    background-color: var(--color-primary);
    color: #111;
}

.status-botoes button.cancelado:hover,
.status-botoes button.cancelado.is-active {
    border-color: #dc3545;
    background-color: transparent;
    color: #ff8a95;
}
</style>
