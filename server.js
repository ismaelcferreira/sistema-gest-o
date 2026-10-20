import express from 'express';
import cors from 'cors';
import {
  inicializarBanco,
  buscarTarefas,
  criarTarefa,
  atualizarStatusTarefa,
  deletarTarefa
} from './db.js';

const app = express();
const PORT = process.env.PORT || 3000;

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.static('./public'));

// Rota 1: Listar todas as tarefas
app.get('/api/tarefas', async (req, res) => {
  try {
    const tarefas = await buscarTarefas();
    res.json(tarefas);
  } catch (error) {
    console.error('Erro ao buscar tarefas:', error);
    res.status(500).json({ erro: 'Não foi possível buscar as tarefas.' });
  }
});

// Rota 2: Cadastrar uma nova tarefa
app.post('/api/tarefas', async (req, res) => {
  try {
    const { titulo, descricao, categoria, prioridade } = req.body;

    if (!titulo || titulo.trim() === '') {
      return res.status(400).json({ erro: 'O título da tarefa é obrigatório!' });
    }

    const novaTarefa = await criarTarefa({
      titulo: titulo.trim(),
      descricao: descricao ? descricao.trim() : '',
      categoria: categoria || 'Estudo',
      prioridade: prioridade || 'Média'
    });

    res.status(201).json(novaTarefa);
  } catch (error) {
    console.error('Erro ao cadastrar tarefa:', error);
    res.status(500).json({ erro: 'Não foi possível salvar a tarefa.' });
  }
});

// Rota 3: Atualizar status da tarefa (Pendente <-> Concluída)
app.put('/api/tarefas/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!status) {
      return res.status(400).json({ erro: 'O novo status deve ser informado!' });
    }

    const tarefaAtualizada = await atualizarStatusTarefa(id, status);
    if (!tarefaAtualizada) {
      return res.status(404).json({ erro: 'Tarefa não encontrada.' });
    }

    res.json(tarefaAtualizada);
  } catch (error) {
    console.error('Erro ao atualizar tarefa:', error);
    res.status(500).json({ erro: 'Não foi possível atualizar a tarefa.' });
  }
});

// Rota 4: Excluir uma tarefa por ID
app.delete('/api/tarefas/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const sucesso = await deletarTarefa(id);

    if (!sucesso) {
      return res.status(404).json({ erro: 'Tarefa não encontrada para exclusão.' });
    }

    res.json({ mensagem: 'Tarefa excluída com sucesso!' });
  } catch (error) {
    console.error('Erro ao excluir tarefa:', error);
    res.status(500).json({ erro: 'Não foi possível excluir a tarefa.' });
  }
});

// Rota 5: Estatísticas simples (Total, Pendentes e Concluídas)
app.get('/api/estatisticas', async (req, res) => {
  try {
    const tarefas = await buscarTarefas();
    const total = tarefas.length;
    const pendentes = tarefas.filter((t) => t.status === 'Pendente').length;
    const concluidas = tarefas.filter((t) => t.status === 'Concluída').length;

    res.json({ total, pendentes, concluidas });
  } catch (error) {
    console.error('Erro ao obter estatísticas:', error);
    res.status(500).json({ erro: 'Erro ao calcular estatísticas.' });
  }
});

// Iniciar servidor
app.listen(PORT, async () => {
  await inicializarBanco();
  console.log(`🚀 Servidor rodando com sucesso em http://localhost:${PORT}`);
});
