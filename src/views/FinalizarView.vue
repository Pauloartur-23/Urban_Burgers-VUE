<script setup>
import { computed, onMounted, reactive, ref } from 'vue';
import { useRouter } from 'vue-router';
import { useCartStore } from '@/stores/cart.js';
import { getUsuarioAtual } from '@/services/usuario.js';
import { atualizarCliente, criarEndereco, getCliente, listarEnderecos } from '@/services/enderecos.js';
import { formatarEndereco, linkMapa } from '@/composables/useLocalizacao.js';
import { linkPedidoWhatsapp } from '@/composables/useWhatsappCheckout.js';
import { useStatusLoja } from '@/composables/useStatusLoja.js';
import { brl } from '@/utils/formato.js';
import EnderecoForm from '@/components/endereco/EnderecoForm.vue';

const cart = useCartStore();
const router = useRouter();
const statusLoja = useStatusLoja();

const PAGAMENTOS = [
    { valor: 'Pix', icone: 'mdi-qrcode' },
    { valor: 'Cartão de crédito', icone: 'mdi-credit-card-outline' },
    { valor: 'Cartão de débito', icone: 'mdi-credit-card-chip-outline' },
    { valor: 'Dinheiro', icone: 'mdi-cash' },
];

const carregando = ref(true);
const enviando = ref(false);
const erro = ref('');
const enderecos = ref([]);
const enderecoId = ref(null);
const novoEndereco = ref(false);
const dados = reactive({ nome: '', telefone: '', pagamento: 'Pix', troco: '', observacao: '' });

let telefoneSalvo = '';
const endereco = computed(() => enderecos.value.find((e) => e.id === enderecoId.value) ?? null);

onMounted(async () => {
    try {
        await cart.hydrate();
        const [usuario, cliente, ends] = await Promise.all([getUsuarioAtual(), getCliente(), listarEnderecos()]);
        dados.nome = usuario.name ?? '';
        dados.telefone = telefoneSalvo = cliente.telefone ?? '';
        enderecos.value = ends;
        enderecoId.value = ends.at(-1)?.id ?? null;
        novoEndereco.value = ends.length === 0;
    } catch (e) {
        erro.value = e.message;
    } finally {
        carregando.value = false;
    }
});

async function salvarEndereco(novo) {
    erro.value = '';
    try {
        const salvo = await criarEndereco(novo);
        enderecos.value.push(salvo);
        enderecoId.value = salvo.id;
        novoEndereco.value = false;
    } catch {
        erro.value = 'Não foi possível salvar o endereço. Confira os campos e tente de novo.';
    }
}

async function enviar() {
    erro.value = '';
    if (!dados.nome.trim()) return (erro.value = 'Informe seu nome.');
    if (!endereco.value) return (erro.value = 'Escolha ou cadastre o endereço de entrega.');

    // a aba do WhatsApp precisa abrir no clique, senão o navegador bloqueia como pop-up
    const aba = window.open('', '_blank');
    enviando.value = true;
    try {
        const pedido = await cart.finalizar({
            nome_cliente: dados.nome.trim(),
            telefone: dados.telefone.trim(),
            endereco_entrega: formatarEndereco(endereco.value),
            link_mapa: endereco.value.latitude ? linkMapa(endereco.value.latitude, endereco.value.longitude) : '',
            pagamento: dados.pagamento,
            troco: dados.pagamento === 'Dinheiro' ? dados.troco.trim() : '',
            observacao: dados.observacao.trim(),
        });
        if (aba) {
            aba.opener = null;
            aba.location.href = linkPedidoWhatsapp(pedido);
        }
        // telefone novo vira o da conta (não atrapalha o pedido se falhar)
        if (dados.telefone.trim() && dados.telefone.trim() !== telefoneSalvo) {
            atualizarCliente({ telefone: dados.telefone.trim() }).catch(() => {});
        }
        router.push({ path: `/pedidos/${pedido.id}`, query: { novo: 1 } });
    } catch (e) {
        aba?.close();
        erro.value = e.message.includes('vazio') ? 'Seu carrinho está vazio.' : 'Não foi possível enviar o pedido. Tente de novo.';
    } finally {
        enviando.value = false;
    }
}
</script>

<template>
    <div class="page">
        <router-link to="/cardapio" class="voltar"><span class="mdi mdi-arrow-left"></span> Continuar comprando</router-link>
        <h1>Finalizar <span class="highlight">pedido</span></h1>

        <div v-if="carregando" class="checkout">
            <div class="esqueleto" style="height: 520px"></div>
            <div class="esqueleto" style="height: 360px"></div>
        </div>

        <div v-else-if="cart.items.length === 0" class="empty-state">
            <span class="mdi mdi-cart-outline" aria-hidden="true"></span>
            <h2>Seu carrinho está vazio</h2>
            <p>Escolha seus burgers no cardápio e volte aqui para finalizar.</p>
            <router-link to="/cardapio" class="btn btn-primary">Ver cardápio <span class="mdi mdi-arrow-right"></span></router-link>
        </div>

        <form v-else class="checkout" novalidate @submit.prevent="enviar">
            <div class="etapas">
                <section class="card etapa">
                    <h2><span class="etapa-num">1</span> Seus dados</h2>
                    <div class="form-grid">
                        <label>Nome
                            <input v-model="dados.nome" autocomplete="name" required />
                        </label>
                        <label>WhatsApp / telefone
                            <input v-model="dados.telefone" type="tel" autocomplete="tel" placeholder="(47) 99999-9999" />
                        </label>
                    </div>
                </section>

                <section class="card etapa">
                    <h2><span class="etapa-num">2</span> Entrega</h2>

                    <div v-if="enderecos.length" class="opcoes" role="radiogroup" aria-label="Endereço de entrega">
                        <label v-for="e in enderecos" :key="e.id" class="opcao" :class="{ 'is-ativa': enderecoId === e.id && !novoEndereco }">
                            <input v-model="enderecoId" type="radio" name="endereco" :value="e.id" @change="novoEndereco = false" />
                            <span class="mdi mdi-map-marker-outline opcao-icone" aria-hidden="true"></span>
                            <span class="opcao-texto">
                                <strong>{{ e.apelido || 'Endereço' }}</strong>
                                <small>{{ formatarEndereco(e) }}</small>
                            </span>
                            <span v-if="e.latitude" class="opcao-tag" title="Tem localização GPS">GPS</span>
                        </label>
                    </div>

                    <button v-if="!novoEndereco" type="button" class="adicionar-endereco" @click="novoEndereco = true">
                        <span class="mdi mdi-plus"></span> Entregar em outro endereço
                    </button>

                    <div v-else class="novo-endereco">
                        <p class="form-status">O endereço fica salvo na sua conta para os próximos pedidos.</p>
                        <EnderecoForm submit-label="Salvar e usar este endereço" @submit="salvarEndereco" />
                        <button v-if="enderecos.length" type="button" class="btn btn-link" @click="novoEndereco = false">Cancelar</button>
                    </div>
                </section>

                <section class="card etapa">
                    <h2><span class="etapa-num">3</span> Pagamento na entrega</h2>
                    <div class="pagamentos" role="radiogroup" aria-label="Forma de pagamento">
                        <label v-for="p in PAGAMENTOS" :key="p.valor" class="pagamento" :class="{ 'is-ativa': dados.pagamento === p.valor }">
                            <input v-model="dados.pagamento" type="radio" name="pagamento" :value="p.valor" />
                            <span class="mdi" :class="p.icone" aria-hidden="true"></span>
                            {{ p.valor }}
                        </label>
                    </div>
                    <label v-if="dados.pagamento === 'Dinheiro'" class="troco">Precisa de troco para quanto?
                        <input v-model="dados.troco" inputmode="decimal" placeholder="Ex: R$ 100,00 (deixe vazio se não precisar)" />
                    </label>
                    <label class="obs">Observação para a cozinha ou entregador
                        <textarea v-model="dados.observacao" rows="2" maxlength="500" placeholder="Sem cebola, ponto da carne, campainha quebrada..."></textarea>
                    </label>
                </section>
            </div>

            <aside class="resumo">
                <div class="card resumo-card">
                    <h2>Resumo</h2>
                    <ul class="resumo-itens">
                        <li v-for="item in cart.items" :key="item.id">
                            <img v-if="item.img" :src="item.img" alt="" />
                            <span class="resumo-nome"><b>{{ item.qtd }}×</b> {{ item.name }}</span>
                            <span>{{ brl(item.preco * item.qtd) }}</span>
                        </li>
                    </ul>
                    <div class="resumo-total"><span>Total</span><strong>{{ brl(cart.totalPreco) }}</strong></div>
                    <p class="resumo-obs">A taxa de entrega, se houver, é confirmada pela loja no WhatsApp.</p>

                    <p class="loja-status" :class="{ fechada: !statusLoja.aberto }">
                        <span class="ponto"></span> {{ statusLoja.texto }}
                    </p>
                    <p v-if="!statusLoja.aberto" class="resumo-obs">Você pode enviar agora: o pedido entra na fila e a loja confirma quando abrir.</p>

                    <p v-if="erro" class="form-error" role="alert">{{ erro }}</p>

                    <button type="submit" class="btn btn-primary enviar" :disabled="enviando">
                        <span class="mdi" :class="enviando ? 'mdi-loading mdi-spin' : 'mdi-whatsapp'"></span>
                        {{ enviando ? 'Enviando...' : 'Enviar pedido pelo WhatsApp' }}
                    </button>
                    <p class="resumo-obs centro">O WhatsApp abre com a mensagem pronta, é só tocar em enviar.</p>
                </div>
            </aside>
        </form>
    </div>
</template>

<style scoped>
.voltar {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    margin-bottom: 18px;
    font-size: var(--text-small);
    text-decoration: none;
}

.page .voltar {
    color: var(--text-secondary);
}

.page .voltar:hover {
    color: var(--color-primary);
}

.checkout {
    display: grid;
    grid-template-columns: minmax(0, 1fr) 380px;
    gap: 28px;
    align-items: start;
}

.etapa h2 {
    display: flex;
    align-items: center;
    gap: 12px;
}

.etapa-num {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 30px;
    height: 30px;
    border-radius: var(--radius-full);
    background-color: var(--color-primary);
    color: #111;
    font-family: 'Inter', sans-serif;
    font-size: 0.9rem;
    font-weight: 800;
}

.opcoes {
    display: grid;
    gap: 10px;
    margin-bottom: 14px;
}

/* cartões de escolha (endereço e pagamento): o input fica escondido, o cartão inteiro é clicável */
.page .opcao,
.page .pagamento {
    position: relative;
    flex-direction: row;
    align-items: center;
    gap: 12px;
    margin: 0;
    padding: 14px 16px;
    border: 1px solid var(--border-color);
    border-radius: var(--radius);
    background-color: var(--background-secondary);
    color: var(--text-primary);
    cursor: pointer;
    transition: border-color 0.2s ease, background-color 0.2s ease;
}

.page .opcao:hover,
.page .pagamento:hover {
    border-color: var(--color-gray-500);
}

.page .opcao.is-ativa,
.page .pagamento.is-ativa {
    border-color: var(--color-primary);
    background-color: rgba(245, 169, 0, 0.07);
}

.page .opcao input,
.page .pagamento input {
    position: absolute;
    opacity: 0;
    pointer-events: none;
}

.opcao:has(input:focus-visible),
.pagamento:has(input:focus-visible) {
    outline: 2px solid var(--color-primary);
    outline-offset: 2px;
}

.opcao-icone {
    font-size: 1.4rem;
    color: var(--color-primary);
}

.opcao-texto {
    display: flex;
    flex: 1;
    flex-direction: column;
    min-width: 0;
}

.opcao-texto small {
    color: var(--text-secondary);
}

.opcao-tag {
    padding: 2px 8px;
    border-radius: var(--radius-full);
    background-color: rgba(37, 211, 102, 0.15);
    color: #6ee7a0;
    font-size: 0.7rem;
    font-weight: 700;
}

.adicionar-endereco {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    padding: 10px 0;
    border: none;
    background: none;
    color: var(--color-primary);
    font: inherit;
    font-weight: 700;
    cursor: pointer;
}

.adicionar-endereco:hover {
    text-decoration: underline;
}

.novo-endereco {
    padding-top: 6px;
}

.pagamentos {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 10px;
    margin-bottom: 16px;
}

.page .pagamento {
    font-weight: 600;
}

.pagamento .mdi {
    font-size: 1.3rem;
    color: var(--color-primary);
}

.troco,
.obs {
    margin-bottom: 0;
}

.troco {
    margin-bottom: 14px;
}

.resumo {
    position: sticky;
    top: calc(var(--header-height) + 16px);
}

.resumo-itens {
    list-style: none;
    margin-bottom: 16px;
}

.resumo-itens li {
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 8px 0;
    font-size: var(--text-small);
}

.resumo-itens img {
    width: 40px;
    height: 40px;
    border-radius: 8px;
    object-fit: cover;
}

.resumo-nome {
    flex: 1;
    color: var(--text-secondary);
}

.resumo-nome b {
    color: var(--text-primary);
}

.resumo-total {
    display: flex;
    justify-content: space-between;
    align-items: baseline;
    padding-top: 16px;
    border-top: 1px solid var(--border-color);
    font-weight: 700;
}

.resumo-total strong {
    font-size: 1.6rem;
    color: var(--color-primary);
}

.resumo-obs {
    margin: 8px 0 0;
    color: var(--text-muted);
    font-size: 0.8rem;
    line-height: 1.5;
}

.resumo-obs.centro {
    text-align: center;
}

.loja-status {
    display: flex;
    align-items: center;
    gap: 8px;
    margin: 18px 0 0;
    font-size: var(--text-small);
    font-weight: 700;
    color: #6ee7a0;
}

.loja-status .ponto {
    width: 8px;
    height: 8px;
    border-radius: var(--radius-full);
    background-color: currentColor;
}

.loja-status.fechada {
    color: #ff8a95;
}

.resumo-card .form-error {
    margin: 16px 0 0;
}

.enviar {
    width: 100%;
    margin-top: 18px;
    padding-block: 16px;
    font-size: 1rem;
    background-color: #25d366;
    border-color: #25d366;
    color: #fff;
}

.esqueleto {
    border-radius: var(--radius-lg);
    background: linear-gradient(100deg, #141414 30%, #1f1f1f 50%, #141414 70%) 0 0 / 300% 100%;
    animation: brilho 1.4s ease-in-out infinite;
}

@keyframes brilho {
    to {
        background-position: -150% 0;
    }
}

@media (max-width: 960px) {
    .checkout {
        grid-template-columns: 1fr;
    }

    .resumo {
        position: static;
    }
}

@media (max-width: 480px) {
    .pagamentos {
        grid-template-columns: 1fr;
    }
}
</style>
