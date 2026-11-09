<script setup>
import { onMounted, onUnmounted, watch } from 'vue';
import { useRouter } from 'vue-router';
import { useCartStore } from '@/stores/cart.js';
import { brl } from '@/utils/formato.js';

const cart = useCartStore();
const router = useRouter();

function finalizar() {
    cart.close();
    router.push('/finalizar');
}

function verCardapio() {
    cart.close();
    router.push('/cardapio');
}

const aoTeclar = (e) => { if (e.key === 'Escape') cart.close(); };
onMounted(() => window.addEventListener('keydown', aoTeclar));
onUnmounted(() => window.removeEventListener('keydown', aoTeclar));

// com o carrinho aberto a página de trás não rola
watch(() => cart.isOpen, (aberto) => { document.body.style.overflow = aberto ? 'hidden' : ''; });
</script>

<template>
    <Transition name="cart">
        <div v-if="cart.isOpen" class="cart-overlay" @click.self="cart.close">
            <aside class="cart-panel" role="dialog" aria-modal="true" aria-labelledby="cart-titulo">
                <header class="cart-header">
                    <h3 id="cart-titulo">Seu pedido <small v-if="cart.totalItens">{{ cart.totalItens }} {{ cart.totalItens === 1 ? 'item' : 'itens' }}</small></h3>
                    <button class="cart-fechar" type="button" aria-label="Fechar carrinho" @click="cart.close">
                        <span class="mdi mdi-close"></span>
                    </button>
                </header>

                <div v-if="cart.items.length === 0" class="cart-vazio">
                    <span class="mdi mdi-cart-outline" aria-hidden="true"></span>
                    <p><strong>Seu carrinho está vazio</strong></p>
                    <p>Escolha um burger e ele aparece aqui.</p>
                    <button type="button" class="btn btn-primary" @click="verCardapio">Ver cardápio</button>
                </div>

                <TransitionGroup v-else tag="ul" name="linha" class="cart-itens">
                    <li v-for="item in cart.items" :key="item.id" class="cart-item">
                        <img v-if="item.img" :src="item.img" :alt="item.name" class="cart-foto" />
                        <span v-else class="cart-foto cart-foto-vazia mdi mdi-hamburger" aria-hidden="true"></span>

                        <div class="cart-info">
                            <p class="cart-nome">{{ item.name }}</p>
                            <p class="cart-unit">{{ brl(item.preco) }} cada</p>
                            <div class="cart-qtd" role="group" :aria-label="`Quantidade de ${item.name}`">
                                <button type="button" aria-label="Diminuir" @click="cart.decreaseItem(item.id)">
                                    <span class="mdi" :class="item.qtd === 1 ? 'mdi-trash-can-outline' : 'mdi-minus'"></span>
                                </button>
                                <span>{{ item.qtd }}</span>
                                <button type="button" aria-label="Aumentar" @click="cart.addItem(item)">
                                    <span class="mdi mdi-plus"></span>
                                </button>
                            </div>
                        </div>

                        <p class="cart-preco">{{ brl(item.preco * item.qtd) }}</p>
                    </li>
                </TransitionGroup>

                <footer v-if="cart.items.length" class="cart-rodape">
                    <div class="cart-linha"><span>Subtotal</span><span>{{ brl(cart.totalPreco) }}</span></div>
                    <div class="cart-linha cart-linha-obs"><span>Entrega</span><span>combinada no WhatsApp</span></div>
                    <button class="btn btn-primary cart-finalizar" type="button" @click="finalizar">
                        Finalizar pedido · {{ brl(cart.totalPreco) }}
                        <span class="mdi mdi-arrow-right"></span>
                    </button>
                    <button type="button" class="cart-continuar" @click="cart.close">Continuar comprando</button>
                </footer>
            </aside>
        </div>
    </Transition>
</template>

<style scoped>
.cart-overlay {
    position: fixed;
    inset: 0;
    z-index: 200;
    display: flex;
    justify-content: flex-end;
    background-color: rgba(0, 0, 0, 0.6);
    backdrop-filter: blur(2px);
}

.cart-panel {
    display: flex;
    flex-direction: column;
    width: min(420px, 100%);
    height: 100%;
    background-color: var(--background-secondary);
    border-left: 1px solid var(--border-color);
}

/* entrada: fundo escurece e o painel desliza da direita */
.cart-enter-active,
.cart-leave-active {
    transition: opacity 0.25s ease;
}

.cart-enter-active .cart-panel,
.cart-leave-active .cart-panel {
    transition: transform 0.3s cubic-bezier(0.2, 0.7, 0.2, 1);
}

.cart-enter-from,
.cart-leave-to {
    opacity: 0;
}

.cart-enter-from .cart-panel,
.cart-leave-to .cart-panel {
    transform: translateX(100%);
}

.cart-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 20px 24px;
    border-bottom: 1px solid var(--border-color);
}

.cart-header h3 {
    font-family: 'Bebas Neue', sans-serif;
    font-size: 1.8rem;
    font-weight: 400;
    letter-spacing: 0.02em;
}

.cart-header small {
    margin-left: 6px;
    font-family: 'Inter', sans-serif;
    font-size: var(--text-small);
    color: var(--text-muted);
    letter-spacing: 0;
}

.cart-fechar {
    width: 38px;
    height: 38px;
    border: 1px solid var(--border-color);
    border-radius: var(--radius-full);
    background: none;
    color: var(--text-primary);
    font-size: 1.2rem;
    cursor: pointer;
    transition: border-color 0.2s ease, transform 0.2s ease;
}

.cart-fechar:hover {
    border-color: var(--text-secondary);
    transform: rotate(90deg);
}

.cart-vazio {
    display: flex;
    flex: 1;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 6px;
    padding: 24px;
    color: var(--text-secondary);
    text-align: center;
}

.cart-vazio > .mdi {
    font-size: 3rem;
    color: var(--color-gray-500);
}

.cart-vazio strong {
    color: var(--text-primary);
}

.cart-vazio .btn {
    margin-top: 14px;
}

.cart-itens {
    flex: 1;
    overflow-y: auto;
    list-style: none;
    padding: 8px 24px;
}

.cart-item {
    display: grid;
    grid-template-columns: 64px 1fr auto;
    gap: 14px;
    align-items: start;
    padding: 16px 0;
    border-bottom: 1px solid var(--border-color);
}

.cart-foto {
    width: 64px;
    height: 64px;
    border-radius: var(--radius);
    object-fit: cover;
}

.cart-foto-vazia {
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: var(--background-card);
    color: var(--color-gray-500);
    font-size: 1.6rem;
}

.cart-nome {
    font-weight: 700;
    line-height: 1.3;
}

.cart-unit {
    margin: 2px 0 10px;
    color: var(--text-muted);
    font-size: 0.8rem;
}

.cart-qtd {
    display: inline-flex;
    align-items: center;
    gap: 2px;
    padding: 2px;
    border: 1px solid var(--border-color);
    border-radius: var(--radius-full);
}

.cart-qtd span {
    min-width: 24px;
    text-align: center;
    font-size: var(--text-small);
    font-weight: 700;
}

.cart-qtd button {
    width: 30px;
    height: 30px;
    border: none;
    border-radius: var(--radius-full);
    background: none;
    color: var(--text-primary);
    cursor: pointer;
    transition: background-color 0.2s ease, color 0.2s ease;
}

.cart-qtd button:hover {
    background-color: var(--color-primary);
    color: #111;
}

.cart-preco {
    font-weight: 800;
    white-space: nowrap;
}

/* item entrando/saindo da lista */
.linha-enter-active,
.linha-leave-active {
    transition: opacity 0.25s ease, transform 0.25s ease;
}

.linha-enter-from,
.linha-leave-to {
    opacity: 0;
    transform: translateX(20px);
}

.cart-rodape {
    display: flex;
    flex-direction: column;
    gap: 10px;
    padding: 20px 24px 24px;
    border-top: 1px solid var(--border-color);
    background-color: var(--background-primary);
}

.cart-linha {
    display: flex;
    justify-content: space-between;
    font-weight: 700;
}

.cart-linha-obs {
    color: var(--text-muted);
    font-size: var(--text-small);
    font-weight: 400;
}

.cart-finalizar {
    width: 100%;
    margin-top: 6px;
    padding-block: 15px;
    font-size: 1rem;
}

.cart-continuar {
    padding: 6px;
    border: none;
    background: none;
    color: var(--text-secondary);
    font: inherit;
    font-size: var(--text-small);
    cursor: pointer;
}

.cart-continuar:hover {
    color: var(--text-primary);
    text-decoration: underline;
}

@media (prefers-reduced-motion: reduce) {
    .cart-enter-active,
    .cart-leave-active,
    .cart-enter-active .cart-panel,
    .cart-leave-active .cart-panel {
        transition: none;
    }
}
</style>
