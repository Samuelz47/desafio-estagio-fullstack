import express from 'express';
import cors from 'cors';
import { PrismaClient } from '@prisma/client';

const app = express();
const prisma = new PrismaClient();

app.use(cors());
app.use(express.json());

app.get('/relatorio', async (req, res) => {
    try {
        const { nome, categoria, dataInicio, dataFim } = req.query;
        const filtros: any = {};

        if (nome) filtros.nomeProduto = { contains: String(nome) };
        if (categoria) filtros.categoria = { equals: String(categoria) };
        if (dataInicio || dataFim) {
            filtros.dataVenda = {};
            if (dataInicio) filtros.dataVenda.gte = new Date(String(dataInicio));
            if (dataFim) filtros.dataVenda.lte = new Date(String(dataFim));
        }

        const vendas = await prisma.venda.findMany({
            where: filtros,
            orderBy: { dataVenda: 'desc' }
        });

        res.json(vendas);
    } catch (error) {
        console.error("Erro:", error);
        res.status(500).json({ error: "Erro interno" });
    }
});

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`🚀 Servidor rodando em http://localhost:${PORT}`);
});