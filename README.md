# 📊 Desafio Full Stack - Relatório de Vendas

Este projeto é uma aplicação Full Stack desenvolvida como parte de um desafio técnico. O objetivo é fornecer um painel de visualização de vendas com capacidade de filtragem avançada e exportação de relatórios em PDF.

## 🚀 Tecnologias Utilizadas

### Frontend
- **React.js** com **TypeScript** (Vite)
- **Tailwind CSS** (Estilização moderna e responsiva)
- **TanStack Table** (Tabelas headless para alta performance)
- **React-to-Print** (Geração de PDF do relatório)
- **Axios** (Integração com API)
- **Lucide React** (Ícones)

### Backend
- **Node.js** com **Express**
- **TypeScript**
- **Prisma ORM** (Gerenciamento de banco de dados e Type Safety)
- **SQLite** (Banco de dados leve para desenvolvimento local)

---

## ⚙️ Funcionalidades

- ✅ **Listagem de Vendas:** Visualização clara de produtos, categorias, quantidades e valores.
- 🔍 **Filtros Avançados:**
  - Busca por **Nome do Produto**.
  - Filtro por **Categoria** (Select dinâmico).
  - Intervalo de **Datas** (Data Inicial e Final).
- 🖨️ **Exportação PDF:** Botão dedicado para imprimir ou salvar o relatório filtrado em PDF.
- 📱 **Responsividade:** Interface adaptada para diferentes tamanhos de tela.

---

## 🛠️ Como Rodar o Projeto

Pré-requisitos: Você precisa ter o **Node.js** instalado na sua máquina.

### 1. Configurando o Backend (API)

Abra um terminal, acesse a pasta do backend e instale as dependências:

```bash
cd backend
npm install

# Cria as tabelas no banco
npx prisma migrate dev --name init

# Popula o banco com vendas fictícias para teste
npx prisma db seed

# Roda o backend
npx ts-node src/server.ts
```

### 2.  Configurando o Frontend

```bash
cd frontend
npm install

# Inicia a aplicação
npm run dev
```
Acesse o link gerado no terminal (geralmente http://localhost:5173) para ver o projeto funcionando!

## 👨‍💻 Autor
Desenvolvido por Samuel Gomes.
