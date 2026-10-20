// ==========================================================
// SISTEMA DE GESTÃO DE TAREFAS - JAVASCRIPT CLIENTE (FETCH API)
// ==========================================================

let todasTarefas = [];
let filtroAtual = 'todos';

// Elementos do DOM
const formTarefa = document.getElementById('form-tarefa');
const inputTitulo = document.getElementById('titulo');
const inputDescricao = document.getElementById('descricao');
const selectCategoria = document.getElementById('categoria');
const selectPrioridade = document.getElementById('prioridade');
const containerLista = document.getElementById('lista-tarefas');

const statTotal = document.getElementById('stat-total');
const statPendentes = document.getElementById('stat-pendentes');
const statConcluidas = document.getElementById('stat-concluidas');

const tabBotoes = document.querySelectorAll('.tab-btn');

// Ao carregar a página no navegador
document.addEventListener('DOMContentLoaded', () => {
  carregarTarefas();
  configurarEventos();
});

// Configura os ouvintes de eventos da página
function configurarEventos() {
  // Envio do formulário para salvar tarefa
  formTarefa.addEventListener('submit', salvarTarefa);

  // Botões de filtro (Todas, Pendentes, Concluídas)
  tabBotoes.forEach((btn) => {
    btn.addEventListener('click', () => {
      tabBotoes.forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');
      filtroAtual = btn.getAttribute('data-filtro');
      renderizarTarefas();
    });
  });
}

// 1. Função para carregar tarefas da API (GET)
async function carregarTarefas() {
  try {
    const resposta = await fetch('/api/tarefas');
    if (!resposta.ok) {
      throw new Error('Erro ao buscar tarefas do servidor');
    }
    todasTarefas = await resposta.json();
    renderizarTarefas();
    atualizarEstatisticas();
  } catch (error) {
    console.error('Falha ao carregar tarefas:', error);
    containerLista.innerHTML = `
      <div class="empty-state">
        <div class="empty-icon">⚠️</div>
        <p>Não foi possível carregar as tarefas.</p>
        <button class="btn btn-primary" onclick="carregarTarefas()" style="margin-top:12px">Tentar Novamente</button>
      </div>
    `;
  }
}

// 2. Função para salvar nova tarefa (POST)
async function salvarTarefa(evento) {
  evento.preventDefault();

  const titulo = inputTitulo.value.trim();
  const descricao = inputDescricao.value.trim();
  const categoria = selectCategoria.value;
  const prioridade = selectPrioridade.value;

  if (!titulo) {
    alert('Por favor, informe o título da tarefa!');
    return;
  }

  const novaTarefa = {
    titulo,
    descricao,
    categoria,
    prioridade
  };

  try {
    const resposta = await fetch('/api/tarefas', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(novaTarefa)
    });

    if (!resposta.ok) {
      throw new Error('Erro ao salvar tarefa');
    }

    // Limpar o formulário
    formTarefa.reset();
    inputTitulo.focus();

    // Recarregar a lista
    await carregarTarefas();
  } catch (error) {
    console.error('Erro ao adicionar tarefa:', error);
    alert('Erro ao cadastrar a tarefa. Tente novamente.');
  }
}

// 3. Função para alternar status entre Pendente e Concluída (PUT)
async function alternarStatus(id, statusAtual) {
  const novoStatus = statusAtual === 'Pendente' ? 'Concluída' : 'Pendente';

  try {
    const resposta = await fetch(`/api/tarefas/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ status: novoStatus })
    });

    if (!resposta.ok) {
      throw new Error('Erro ao atualizar status');
    }

    await carregarTarefas();
  } catch (error) {
    console.error('Erro ao atualizar status da tarefa:', error);
    alert('Erro ao atualizar o status da tarefa.');
  }
}

// 4. Função para excluir tarefa (DELETE)
async function excluirTarefa(id) {
  const confirmou = confirm('Tem certeza que deseja excluir esta tarefa?');
  if (!confirmou) return;

  try {
    const resposta = await fetch(`/api/tarefas/${id}`, {
      method: 'DELETE'
    });

    if (!resposta.ok) {
      throw new Error('Erro ao excluir tarefa');
    }

    await carregarTarefas();
  } catch (error) {
    console.error('Erro ao excluir tarefa:', error);
    alert('Erro ao excluir a tarefa.');
  }
}

// 5. Renderizar tarefas na tela com base no filtro selecionado
function renderizarTarefas() {
  let tarefasFiltradas = todasTarefas;

  if (filtroAtual !== 'todos') {
    tarefasFiltradas = todasTarefas.filter((t) => t.status === filtroAtual);
  }

  if (tarefasFiltradas.length === 0) {
    containerLista.innerHTML = `
      <div class="empty-state">
        <div class="empty-icon">📭</div>
        <p>Nenhuma tarefa encontrada neste filtro.</p>
      </div>
    `;
    return;
  }

  containerLista.innerHTML = tarefasFiltradas
    .map((tarefa) => {
      const isConcluida = tarefa.status === 'Concluída';
      const classeConcluida = isConcluida ? 'concluida' : '';

      // Classe CSS de prioridade
      let prioClass = 'badge-prio-media';
      if (tarefa.prioridade === 'Alta') prioClass = 'badge-prio-alta';
      if (tarefa.prioridade === 'Baixa') prioClass = 'badge-prio-baixa';

      // Data formatada
      const dataCriacao = tarefa.criado_em 
        ? new Date(tarefa.criado_em).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric' })
        : 'Hoje';

      return `
        <div class="task-item ${classeConcluida}">
          <div class="task-left">
            <button 
              class="custom-checkbox" 
              title="${isConcluida ? 'Reabrir tarefa' : 'Concluir tarefa'}"
              onclick="alternarStatus(${tarefa.id}, '${tarefa.status}')"
            >
              <span class="custom-checkbox-icon">✓</span>
            </button>

            <div class="task-details">
              <span class="task-title">${escapeHTML(tarefa.titulo)}</span>
              ${tarefa.descricao ? `<p class="task-desc">${escapeHTML(tarefa.descricao)}</p>` : ''}
              
              <div class="task-meta">
                <span class="badge badge-cat">${escapeHTML(tarefa.categoria || 'Geral')}</span>
                <span class="badge ${prioClass}">Prioridade ${escapeHTML(tarefa.prioridade || 'Média')}</span>
                <span class="task-date">📅 ${dataCriacao}</span>
              </div>
            </div>
          </div>

          <div class="task-actions">
            <button 
              class="btn-icon btn-delete" 
              title="Excluir tarefa"
              onclick="excluirTarefa(${tarefa.id})"
            >
              🗑️
            </button>
          </div>
        </div>
      `;
    })
    .join('');
}

// 6. Atualizar os números do painel de estatísticas
function atualizarEstatisticas() {
  const total = todasTarefas.length;
  const pendentes = todasTarefas.filter((t) => t.status === 'Pendente').length;
  const concluidas = todasTarefas.filter((t) => t.status === 'Concluída').length;

  statTotal.textContent = total;
  statPendentes.textContent = pendentes;
  statConcluidas.textContent = concluidas;
}

// Função auxiliar para evitar injeção de HTML acidental
function escapeHTML(texto) {
  if (!texto) return '';
  const div = document.createElement('div');
  div.innerText = texto;
  return div.innerHTML;
}
