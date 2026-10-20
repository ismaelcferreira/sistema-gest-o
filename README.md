# 📋 Sistema de Gestão de Tarefas (Task Flow)

Um sistema completo e simples para gerenciamento e acompanhamento de tarefas e rotinas diárias, desenvolvido com **Node.js**, **Express**, **PostgreSQL** e **JavaScript Vanilla**.

Projeto desenvolvido para fins educacionais e acadêmicos (Ensino Médio / Curso Técnico).

---

## 🚀 Tecnologias Utilizadas

- **Back-end:**
  - [Node.js](https://nodejs.org/)
  - [Express](https://expressjs.com/) (servidor web e criação de APIs REST)
  - [pg](https://node-postgres.com/) (driver cliente para conexão com PostgreSQL)
  - [cors](https://www.npmjs.com/package/cors) (habilitação de requisições Cross-Origin)
  - [nodemon](https://nodemon.io/) (reinicialização automática em desenvolvimento)

- **Front-end:**
  - HTML5 Semântico
  - CSS3 Moderno (design responsivo, paleta temática e micro-interações)
  - JavaScript puro (ES6+ com Fetch API)

- **Banco de Dados:**
  - PostgreSQL (com inicialização automática da tabela)

---

## 📂 Estrutura de Pastas

```text
sistema_gestao_tarefas/
├── public/                 # Arquivos públicos servidos ao navegador
│   ├── index.html          # Estrutura visual da aplicação
│   ├── style.css           # Estilos e responsividade
│   └── script.js           # Lógica do cliente (consumo da API via fetch)
├── db.js                   # Configuração e conexão com o banco PostgreSQL
├── server.js               # Servidor Express com as rotas do CRUD
├── database.sql            # Script SQL com schema da tabela
├── package.json            # Metadados e dependências do projeto
├── .gitignore              # Arquivos e pastas ignorados pelo Git
└── README.md               # Documentação do projeto
```

---

## 🛠️ Como Executar o Projeto Localmente

### 1. Pré-requisitos
- Node.js instalado (v16 ou superior)
- PostgreSQL rodando localmente (usuário `postgres` e senha `senai`, ou configure via variáveis de ambiente)

### 2. Instalar as dependências
Abra o terminal na pasta do projeto e execute:
```bash
npm install
```

### 3. Iniciar o servidor
Para modo de desenvolvimento com recarregamento automático:
```bash
npm run dev
```

Ou para execução padrão:
```bash
npm start
```

O servidor iniciará em:
👉 **http://localhost:3000**

---

## 🗄️ Rotas da API REST

| Método | Endpoint             | Descrição                                 |
| :----- | :------------------- | :---------------------------------------- |
| `GET`  | `/api/tarefas`       | Retorna todas as tarefas cadastradas      |
| `POST` | `/api/tarefas`       | Cadastra uma nova tarefa                  |
| `PUT`  | `/api/tarefas/:id`   | Atualiza o status (`Pendente`/`Concluída`) |
| `DELETE`| `/api/tarefas/:id`  | Remove uma tarefa pelo ID                 |
| `GET`  | `/api/estatisticas`  | Resumo de tarefas totais, pendentes e concluídas |

---

## 👤 Autor

Desenvolvido por **Ismael Ferreira**  
Estudante de Ensino Médio / Técnico em Desenvolvimento de Sistemas.
