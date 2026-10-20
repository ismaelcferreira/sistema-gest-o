-- Script SQL para criação do banco de dados e tabela de tarefas

-- Se desejar criar um banco de dados novo:
-- CREATE DATABASE sistema_tarefas;

-- Conecte-se ao banco de dados e execute:
CREATE TABLE IF NOT EXISTS tarefas (
    id SERIAL PRIMARY KEY,
    titulo VARCHAR(120) NOT NULL,
    descricao TEXT,
    categoria VARCHAR(50) DEFAULT 'Estudo',
    prioridade VARCHAR(20) DEFAULT 'Média',
    status VARCHAR(20) DEFAULT 'Pendente',
    criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Exemplos de tarefas iniciais para teste (opcional):
INSERT INTO tarefas (titulo, descricao, categoria, prioridade, status) VALUES
('Estudar para a prova de Matemática', 'Revisar fórmulas de trigonometria e exercícios da página 45.', 'Estudo', 'Alta', 'Pendente'),
('Entregar trabalho de História', 'Pesquisar sobre a Revolução Industrial e formatar em PDF.', 'Escola', 'Média', 'Pendente'),
('Organizar o quarto', 'Guardar livros e arrumar a mesa de estudos.', 'Pessoal', 'Baixa', 'Concluída');
