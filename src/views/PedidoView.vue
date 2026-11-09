<script setup>
import { computed, onMounted, onUnmounted, ref } from 'vue';
import { useRoute } from 'vue-router';
import { apiFetch } from '@/services/api.js';
import { linkPedidoWhatsapp } from '@/composables/useWhatsappCheckout.js';
import { brl, formatarDataHora } from '@/utils/formato.js';

const route = useRoute();
const pedido = ref(null);
const erro = ref(false);
const novo = computed(() => route.query.novo === '1');

const ETAPAS = [
    { status: 'recebido', titulo: 'Pedido recebido', icone: 'mdi-receipt-text-check-outline' },
    { status: 'preparo', titulo: 'Em preparo', icone: 'mdi-grill-outline' },
    { status: 'entrega', titulo: 'Saiu para entrega', icone: 'mdi-moped-outline' },
    { status: 'concluido', titulo: 'Entregue', icone: 'mdi-check-circle-outline' },
];
const etapaAtual = computed(() => ETAPAS.findIndex((e) => e.status === pedido.value?.status));

async function carregar() {
    try {
        pedido.value = await apiFetch(`/carrinhos/${route.params.id}/`);
    } catch {
        erro.value = true;
    }
}

// atualiza o status sozinho enquanto o cliente está na página
let timer;
onMounted(() => {
    carregar();
    timer = setInterval(carregar, 30_000);
});
onUnmounted(() => clearInterval(timer));
</script>

<template>
    <div class="page">
        <div v-if="erro" class="empty-state">
            <span class="mdi mdi-receipt-text-remove-outline" aria-hidden="true"></span>
            <h2>Pedido não encontrado</h2>
            <p>Confira o número ou veja todos os seus pedidos na sua conta.</p>
            <router-link to="/conta" class="btn btn-primary">Minha conta</router-link>
        </div>

        <template v-else-if="pedido">
            <div v-if="novo" class="sucesso">
                <span class="mdi mdi-check-bold" aria-hidden="true"></span>
                <div>
                    <h1>Pedido <span class="highlight">#{{ pedido.id }}</span> enviado!</h1>
                    <p>Confirme o envio no WhatsApp que abriu. Se ele não abriu, use o botão abaixo.</p>
                    <a :href="linkPedidoWhatsapp(pedido)" target="_blank" rel="noopener" class="btn btn-primary whats">
                        <span class="mdi mdi-whatsapp"></span> Abrir WhatsApp com o pedido
                    </a>
                </div>
            </div>
            <template v-else>
                <router-link to="/conta" class="voltar"><span class="mdi mdi-arrow-left"></span> Meus pedidos</router-link>
                <h1>Pedido <span class="highlight">#{{ pedido.id }}</span></h1>
            </template>

            <div class="pedido-grid">
                <section class="card">
                    <h2>Acompanhe</h2>
                    <p v-if="pedido.status === 'cancelado'" class="form-error">Este pedido foi cancelado. Fale com a loja pelo WhatsApp se tiver dúvidas.</p>
                    <ol v-else class="linha-tempo">
                        <li
                            v-for="(etapa, i) in ETAPAS"
                            :key="etapa.status"
                            :class="{ feita: i < etapaAtual, atual: i === etapaAtual }"
                        >
                            <span class="mdi" :class="etapa.icone" aria-hidden="true"></span>
                            <span>{{ etapa.titulo }}</span>
                        </li>
                    </ol>
                    <p class="form-status">Feito em {{ formatarDataHora(pedido.finalizado_em) }} · atualiza sozinho</p>
                </section>

                <section class="card">
                    <h2>Itens</h2>
                    <ul class="itens">
                        <li v-for="ci in pedido.itens_detalhe" :key="ci.id">
                            <span><b>{{ ci.quantidade }}×</b> {{ ci.item_detalhe.nome }}</span>
                            <span>{{ brl(ci.preco_unitario * ci.quantidade) }}</span>
                        </li>
                    </ul>
                    <p class="total"><span>Total</span><strong>{{ brl(pedido.total) }}</strong></p>

                    <dl class="dados">
                        <dt>Entrega</dt>
                        <dd>{{ pedido.endereco_entrega }} <a v-if="pedido.link_mapa" :href="pedido.link_mapa" target="_blank" rel="noopener">ver no mapa</a></dd>
                        <dt>Pagamento</dt>
                        <dd>{{ pedido.pagamento }}{{ pedido.troco ? ` · troco para ${pedido.troco}` : '' }}</dd>
                        <template v-if="pedido.observacao">
                            <dt>Observação</dt>
                            <dd>{{ pedido.observacao }}</dd>
                        </template>
                    </dl>
                </section>
            </div>
        </template>

        <div v-else class="esqueleto"></div>
    </div>
</template>

<style scoped>
.page .voltar {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    margin-bottom: 18px;
    color: var(--text-secondary);
    font-size: var(--text-small);
    text-decoration: none;
}

.sucesso {
    display: flex;
    align-items: flex-start;
    gap: 22px;
    margin-bottom: 32px;
}

.sucesso > .mdi {
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
    width: 64px;
    height: 64px;
    border-radius: var(--radius-full);
    background-color: #25d366;
    color: #fff;
    font-size: 2rem;
    animation: pop 0.5s cubic-bezier(0.3, 1.6, 0.5, 1) both;
}

.sucesso p {
    color: var(--text-secondary);
}

.page .whats {
    background-color: #25d366;
    border-color: #25d366;
    color: #fff;
}

.pedido-grid {
    display: grid;
    grid-template-columns: minmax(0, 1fr) minmax(0, 1.2fr);
    gap: 24px;
    align-items: start;
}

.linha-tempo {
    list-style: none;
    margin-bottom: 16px;
}

.linha-tempo li {
    position: relative;
    display: flex;
    align-items: center;
    gap: 14px;
    padding: 10px 0;
    color: var(--text-muted);
}

/* traço ligando as etapas */
.linha-tempo li:not(:last-child)::after {
    content: '';
    position: absolute;
    left: 19px;
    top: 48px;
    width: 2px;
    height: calc(100% - 38px);
    background-color: var(--border-color);
}

.linha-tempo .mdi {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 40px;
    height: 40px;
    border: 1px solid var(--border-color);
    border-radius: var(--radius-full);
    font-size: 1.2rem;
}

.linha-tempo li.feita {
    color: var(--text-secondary);
}

.linha-tempo li.feita .mdi {
    border-color: var(--color-primary);
    color: var(--color-primary);
}

.linha-tempo li.feita::after {
    background-color: var(--color-primary);
}

.linha-tempo li.atual {
    color: var(--text-primary);
    font-weight: 700;
}

.linha-tempo li.atual .mdi {
    border-color: var(--color-primary);
    background-color: var(--color-primary);
    color: #111;
}

.itens {
    list-style: none;
}

.itens li {
    display: flex;
    justify-content: space-between;
    gap: 12px;
    padding: 8px 0;
    color: var(--text-secondary);
}

.itens b {
    color: var(--text-primary);
}

.total {
    display: flex;
    justify-content: space-between;
    padding-top: 14px;
    margin-top: 6px;
    border-top: 1px solid var(--border-color);
    font-weight: 700;
}

.total strong {
    font-size: 1.4rem;
    color: var(--color-primary);
}

.dados {
    display: grid;
    grid-template-columns: auto 1fr;
    gap: 8px 18px;
    margin-top: 18px;
    font-size: var(--text-small);
}

.dados dt {
    color: var(--text-muted);
}

.esqueleto {
    height: 420px;
    border-radius: var(--radius-lg);
    background: #141414;
}

@keyframes pop {
    from {
        transform: scale(0.4);
        opacity: 0;
    }
}

@media (max-width: 860px) {
    .pedido-grid {
        grid-template-columns: 1fr;
    }

    .sucesso {
        flex-direction: column;
    }
}
</style>
