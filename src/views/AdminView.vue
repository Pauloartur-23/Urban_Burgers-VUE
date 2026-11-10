<script setup>
import { computed, onMounted, reactive, ref } from 'vue';
import { useRouter } from 'vue-router';
import { getUsuarioAtual, isAutenticado, logout } from '@/services/usuario.js';
import { fetchCategorias, fetchItens } from '@/services/menu.js';
import {
    apagarCategoria, apagarItem, atualizarCategoria, atualizarItem,
    criarCategoria, criarItem, uploadImagem,
} from '@/services/admin.js';
import AdminPedidos from '@/components/admin/AdminPedidos.vue';

const router = useRouter();

const aba = ref('pedidos');
const carregando = ref(true);
const erro = ref('');
const aviso = ref('');
const categorias = ref([]);
const itens = ref([]);
const filtroCategoria = ref('');

const itemVazio = () => ({ id: null, nome: '', descricao: '', preco: '', categoria: '', imagemAtual: null });
const itemForm = reactive(itemVazio());
const arquivoImagem = ref(null);
const inputImagem = ref(null);
const salvando = ref(false);

const categoriaVazia = () => ({ id: null, nome: '', descricao: '' });
const categoriaForm = reactive(categoriaVazia());

const itensFiltrados = computed(() =>
    filtroCategoria.value
        ? itens.value.filter((i) => i.categoria === Number(filtroCategoria.value))
        : itens.value
);

function nomeCategoria(id) {
    return categorias.value.find((c) => c.id === id)?.nome ?? 'Sem categoria';
}

async function carregar() {
    [categorias.value, itens.value] = await Promise.all([fetchCategorias(), fetchItens()]);
}

onMounted(async () => {
    if (!isAutenticado()) return router.push('/login');
    try {
        const usuario = await getUsuarioAtual();
        if (!usuario.is_staff) return router.push('/conta');
        await carregar();
    } catch (e) {
        erro.value = e.message;
    } finally {
        carregando.value = false;
    }
});

function sair() {
    logout();
    window.location.href = '/';
}

function mostrarAviso(msg) {
    aviso.value = msg;
    setTimeout(() => { if (aviso.value === msg) aviso.value = ''; }, 3000);
}

async function executar(acao, msg) {
    erro.value = '';
    salvando.value = true;
    try {
        await acao();
        await carregar();
        mostrarAviso(msg);
        return true;
    } catch (e) {
        erro.value = e.message;
        return false;
    } finally {
        salvando.value = false;
    }
}

/* ---------- Itens ---------- */
function editarItem(item) {
    Object.assign(itemForm, {
        id: item.id, nome: item.nome, descricao: item.descricao, preco: item.preco,
        categoria: item.categoria ?? '', imagemAtual: item.imagem?.url ?? null,
    });
    arquivoImagem.value = null;
    if (inputImagem.value) inputImagem.value.value = '';
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

function limparItem() {
    Object.assign(itemForm, itemVazio());
    arquivoImagem.value = null;
    if (inputImagem.value) inputImagem.value.value = '';
}

async function salvarItem() {
    const ok = await executar(async () => {
        const dados = {
            nome: itemForm.nome,
            descricao: itemForm.descricao,
            preco: itemForm.preco,
            categoria: itemForm.categoria || null,
        };
        if (arquivoImagem.value) dados.imagem_attachment_key = await uploadImagem(arquivoImagem.value, itemForm.nome);
        await (itemForm.id ? atualizarItem(itemForm.id, dados) : criarItem(dados));
    }, itemForm.id ? 'Item atualizado!' : 'Item adicionado ao cardápio!');
    if (ok) limparItem();
}

async function removerItem(item) {
    if (!confirm(`Remover "${item.nome}" do cardápio?`)) return;
    await executar(() => apagarItem(item.id), 'Item removido.');
}

/* ---------- Categorias ---------- */
function editarCategoria(cat) {
    Object.assign(categoriaForm, cat);
}

async function salvarCategoria() {
    const dados = { nome: categoriaForm.nome, descricao: categoriaForm.descricao };
    const ok = await executar(
        () => (categoriaForm.id ? atualizarCategoria(categoriaForm.id, dados) : criarCategoria(dados)),
        categoriaForm.id ? 'Categoria atualizada!' : 'Categoria criada!'
    );
    if (ok) Object.assign(categoriaForm, categoriaVazia());
}

async function removerCategoria(cat) {
    if (!confirm(`Remover a categoria "${cat.nome}"?`)) return;
    const ok = await executar(() => apagarCategoria(cat.id), 'Categoria removida.');
    if (!ok) erro.value = 'Não foi possível remover. Remova ou mova os itens desta categoria antes.';
}
</script>

<template>
    <div class="page">
        <div class="admin-topo">
            <div>
                <p class="eyebrow">Painel do administrador</p>
                <h1>Painel da <span class="highlight">loja</span></h1>
            </div>
            <button type="button" class="btn btn-outline" @click="sair">
                <span class="mdi mdi-logout"></span> Sair da conta
            </button>
        </div>

        <p v-if="carregando">Carregando...</p>

        <template v-else>
            <div class="tabs">
                <button :class="{ 'is-active': aba === 'pedidos' }" @click="aba = 'pedidos'">
                    <span class="mdi mdi-receipt-text-outline"></span> Pedidos
                </button>
                <button :class="{ 'is-active': aba === 'itens' }" @click="aba = 'itens'">
                    <span class="mdi mdi-hamburger"></span> Itens ({{ itens.length }})
                </button>
                <button :class="{ 'is-active': aba === 'categorias' }" @click="aba = 'categorias'">
                    <span class="mdi mdi-shape"></span> Categorias ({{ categorias.length }})
                </button>
            </div>

            <p v-if="aviso" class="form-success">{{ aviso }}</p>
            <p v-if="erro" class="form-error">{{ erro }}</p>

            <AdminPedidos v-if="aba === 'pedidos'" />

            <!-- ITENS -->
            <section v-else-if="aba === 'itens'" class="admin-layout">
                <div class="card">
                    <h2>{{ itemForm.id ? 'Editar item' : 'Novo item' }}</h2>
                    <p v-if="categorias.length === 0" class="form-status">
                        Crie uma categoria primeiro (ex: Lanches, Bebidas, Combos).
                    </p>
                    <form class="form-grid" @submit.prevent="salvarItem">
                        <label class="full">Nome
                            <input v-model="itemForm.nome" required maxlength="100" />
                        </label>
                        <label>Preço (R$)
                            <input v-model="itemForm.preco" type="number" min="0" step="0.01" required />
                        </label>
                        <label>Categoria
                            <select v-model="itemForm.categoria" required>
                                <option value="" disabled>Selecione</option>
                                <option v-for="c in categorias" :key="c.id" :value="c.id">{{ c.nome }}</option>
                            </select>
                        </label>
                        <label class="full">Descrição
                            <textarea v-model="itemForm.descricao" rows="3" required></textarea>
                        </label>
                        <label class="full">Imagem (JPG ou PNG)
                            <input
                                ref="inputImagem"
                                type="file"
                                accept="image/png,image/jpeg"
                                @change="arquivoImagem = $event.target.files[0] ?? null"
                            />
                        </label>
                        <img v-if="itemForm.imagemAtual && !arquivoImagem" :src="itemForm.imagemAtual" class="preview full" alt="Imagem atual" />

                        <div class="form-actions full">
                            <button type="submit" class="btn btn-primary" :disabled="salvando">
                                {{ salvando ? 'Salvando...' : itemForm.id ? 'Salvar alterações' : 'Adicionar item' }}
                            </button>
                            <button v-if="itemForm.id" type="button" class="btn btn-outline" @click="limparItem">Cancelar</button>
                        </div>
                    </form>
                </div>

                <div class="card">
                    <div class="card-header">
                        <h2>Cardápio</h2>
                        <select v-model="filtroCategoria" aria-label="Filtrar por categoria">
                            <option value="">Todas as categorias</option>
                            <option v-for="c in categorias" :key="c.id" :value="c.id">{{ c.nome }}</option>
                        </select>
                    </div>
                    <p v-if="itensFiltrados.length === 0" class="form-status">Nenhum item.</p>
                    <ul class="lista">
                        <li v-for="item in itensFiltrados" :key="item.id">
                            <img v-if="item.imagem?.url" :src="item.imagem.url" alt="" class="thumb" />
                            <span v-else class="thumb thumb-vazio mdi mdi-image-off-outline"></span>
                            <div class="lista-info">
                                <strong>{{ item.nome }}</strong>
                                <small>{{ nomeCategoria(item.categoria) }} · R$ {{ Number(item.preco).toFixed(2) }}</small>
                            </div>
                            <button class="icon-btn" aria-label="Editar" @click="editarItem(item)"><span class="mdi mdi-pencil"></span></button>
                            <button class="icon-btn danger" aria-label="Remover" @click="removerItem(item)"><span class="mdi mdi-delete"></span></button>
                        </li>
                    </ul>
                </div>
            </section>

            <!-- CATEGORIAS -->
            <section v-else class="admin-layout">
                <div class="card">
                    <h2>{{ categoriaForm.id ? 'Editar categoria' : 'Nova categoria' }}</h2>
                    <form class="form-grid" @submit.prevent="salvarCategoria">
                        <label class="full">Nome
                            <input v-model="categoriaForm.nome" required maxlength="100" placeholder="Lanches, Bebidas, Combos..." />
                        </label>
                        <label class="full">Descrição
                            <textarea v-model="categoriaForm.descricao" rows="2"></textarea>
                        </label>
                        <div class="form-actions full">
                            <button type="submit" class="btn btn-primary" :disabled="salvando">
                                {{ categoriaForm.id ? 'Salvar alterações' : 'Criar categoria' }}
                            </button>
                            <button v-if="categoriaForm.id" type="button" class="btn btn-outline" @click="Object.assign(categoriaForm, categoriaVazia())">Cancelar</button>
                        </div>
                    </form>
                </div>

                <div class="card">
                    <h2>Categorias</h2>
                    <ul class="lista">
                        <li v-for="cat in categorias" :key="cat.id">
                            <div class="lista-info">
                                <strong>{{ cat.nome }}</strong>
                                <small>{{ itens.filter((i) => i.categoria === cat.id).length }} itens</small>
                            </div>
                            <button class="icon-btn" aria-label="Editar" @click="editarCategoria(cat)"><span class="mdi mdi-pencil"></span></button>
                            <button class="icon-btn danger" aria-label="Remover" @click="removerCategoria(cat)"><span class="mdi mdi-delete"></span></button>
                        </li>
                    </ul>
                </div>
            </section>
        </template>
    </div>
</template>

<style scoped>
.admin-topo {
    display: flex;
    flex-wrap: wrap;
    align-items: flex-end;
    justify-content: space-between;
    gap: 16px;
}

.admin-layout {
    display: grid;
    grid-template-columns: minmax(0, 1fr) minmax(0, 1.2fr);
    gap: 24px;
    align-items: start;
}

.preview {
    max-height: 140px;
    width: auto;
    border-radius: var(--radius);
}

@media (max-width: 900px) {
    .admin-layout {
        grid-template-columns: 1fr;
    }
}
</style>
