import pg from 'pg';
const { Pool } = pg;

// Configuração padrão do PostgreSQL (comum nos computadores do curso/SENAI)
const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || 'senai',
  port: process.env.DB_PORT || 5432,
  database: 'sistema_tarefas'
};

let pool = null;
let modoMemoria = false;
let tarefasEmMemoria = [
  {
    id: 1,
    titulo: 'Estudar para a prova de Programação Web',
    descricao: 'Revisar conceitos de Node.js, Express e PostgreSQL.',
    categoria: 'Estudo',
    prioridade: 'Alta',
    status: 'Pendente',
    criado_em: new Date().toISOString()
  },
  {
    id: 2,
    titulo: 'Entregar trabalho de Banco de Dados',
    descricao: 'Finalizar os scripts de criação de tabelas e relacionamentos.',
    categoria: 'Escola',
    prioridade: 'Média',
    status: 'Pendente',
    criado_em: new Date().toISOString()
  },
  {
    id: 3,
    titulo: 'Organizar materiais escolares',
    descricao: 'Separar cadernos e materiais para as aulas da semana.',
    categoria: 'Pessoal',
    prioridade: 'Baixa',
    status: 'Concluída',
    criado_em: new Date().toISOString()
  }
];
let proximoIdMemoria = 4;

// Inicialização do Banco de Dados
export async function inicializarBanco() {
  try {
    // 1. Tenta conectar no banco padrão 'postgres' para garantir que 'sistema_tarefas' existe
    const adminPool = new Pool({
      ...dbConfig,
      database: 'postgres'
    });

    const checkDb = await adminPool.query(
      "SELECT 1 FROM pg_database WHERE datname = 'sistema_tarefas'"
    );

    if (checkDb.rowCount === 0) {
      await adminPool.query('CREATE DATABASE sistema_tarefas');
      console.log('📦 Banco de dados "sistema_tarefas" criado com sucesso!');
    }
    await adminPool.end();

    // 2. Conecta no banco 'sistema_tarefas'
    pool = new Pool(dbConfig);

    // 3. Cria a tabela de tarefas se não existir
    const queryTabela = `
      CREATE TABLE IF NOT EXISTS tarefas (
        id SERIAL PRIMARY KEY,
        titulo VARCHAR(120) NOT NULL,
        descricao TEXT,
        categoria VARCHAR(50) DEFAULT 'Estudo',
        prioridade VARCHAR(20) DEFAULT 'Média',
        status VARCHAR(20) DEFAULT 'Pendente',
        criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `;
    await pool.query(queryTabela);

    // 4. Insere tarefas de exemplo se a tabela estiver vazia
    const countRes = await pool.query('SELECT COUNT(*) FROM tarefas');
    if (parseInt(countRes.rows[0].count, 10) === 0) {
      const queryExemplo = `
        INSERT INTO tarefas (titulo, descricao, categoria, prioridade, status) VALUES
        ('Estudar para a prova de Programação Web', 'Revisar conceitos de Node.js, Express e PostgreSQL.', 'Estudo', 'Alta', 'Pendente'),
        ('Entregar trabalho de Banco de Dados', 'Finalizar os scripts de tabelas e chaves primárias.', 'Escola', 'Média', 'Pendente'),
        ('Organizar materiais escolares', 'Separar cadernos e materiais para a semana.', 'Pessoal', 'Baixa', 'Concluída');
      `;
      await pool.query(queryExemplo);
      console.log('📝 Tarefas de exemplo inseridas com sucesso!');
    }

    console.log('✅ PostgreSQL conectado com sucesso ao banco "sistema_tarefas"!');
    modoMemoria = false;
  } catch (error) {
    console.warn('⚠️ Não foi possível conectar ao PostgreSQL:', error.message);
    console.log('💡 Ativando modo de armazenamento local em memória para testes...');
    modoMemoria = true;
  }
}

// Funções do CRUD
export async function buscarTarefas() {
  if (!modoMemoria && pool) {
    const res = await pool.query('SELECT * FROM tarefas ORDER BY id DESC');
    return res.rows;
  }
  return [...tarefasEmMemoria].sort((a, b) => b.id - a.id);
}

export async function criarTarefa({ titulo, descricao, categoria, prioridade }) {
  const cat = categoria || 'Estudo';
  const prio = prioridade || 'Média';
  const desc = descricao || '';

  if (!modoMemoria && pool) {
    const query = `
      INSERT INTO tarefas (titulo, descricao, categoria, prioridade, status)
      VALUES ($1, $2, $3, $4, 'Pendente')
      RETURNING *;
    `;
    const res = await pool.query(query, [titulo, desc, cat, prio]);
    return res.rows[0];
  }

  const nova = {
    id: proximoIdMemoria++,
    titulo,
    descricao: desc,
    categoria: cat,
    prioridade: prio,
    status: 'Pendente',
    criado_em: new Date().toISOString()
  };
  tarefasEmMemoria.push(nova);
  return nova;
}

export async function atualizarStatusTarefa(id, status) {
  if (!modoMemoria && pool) {
    const query = 'UPDATE tarefas SET status = $1 WHERE id = $2 RETURNING *;';
    const res = await pool.query(query, [status, id]);
    return res.rows[0];
  }

  const tarefa = tarefasEmMemoria.find((t) => t.id === parseInt(id, 10));
  if (tarefa) {
    tarefa.status = status;
    return tarefa;
  }
  return null;
}

export async function deletarTarefa(id) {
  if (!modoMemoria && pool) {
    const res = await pool.query('DELETE FROM tarefas WHERE id = $1 RETURNING *;', [id]);
    return res.rowCount > 0;
  }

  const index = tarefasEmMemoria.findIndex((t) => t.id === parseInt(id, 10));
  if (index !== -1) {
    tarefasEmMemoria.splice(index, 1);
    return true;
  }
  return false;
}
