// backend/prisma/seed.ts

import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('Iniciando o seed do banco de dados...')

  await prisma.venda.deleteMany()

  await prisma.venda.createMany({
    data: [
      { nomeProduto: "Notebook Gamer", categoria: "Eletrônicos", quantidade: 1, valorTotal: 4500.00, dataVenda: new Date("2023-01-10") },
      { nomeProduto: "Mouse Sem Fio", categoria: "Periféricos", quantidade: 3, valorTotal: 150.00, dataVenda: new Date("2023-01-12") },
      { nomeProduto: "Teclado Mecânico", categoria: "Periféricos", quantidade: 1, valorTotal: 350.00, dataVenda: new Date("2023-01-15") },
      { nomeProduto: "Monitor 24pol", categoria: "Eletrônicos", quantidade: 2, valorTotal: 1200.00, dataVenda: new Date("2023-02-01") },
      { nomeProduto: "Cadeira Ergonômica", categoria: "Móveis", quantidade: 1, valorTotal: 800.00, dataVenda: new Date("2023-02-05") },
      { nomeProduto: "Headset USB", categoria: "Áudio", quantidade: 5, valorTotal: 500.00, dataVenda: new Date("2023-02-10") },
      { nomeProduto: "Mesa de Escritório", categoria: "Móveis", quantidade: 1, valorTotal: 450.00, dataVenda: new Date("2023-03-01") },
      { nomeProduto: "Webcam HD", categoria: "Eletrônicos", quantidade: 2, valorTotal: 300.00, dataVenda: new Date("2023-03-05") },
      { nomeProduto: "Suporte p/ Notebook", categoria: "Acessórios", quantidade: 4, valorTotal: 200.00, dataVenda: new Date("2023-03-10") },
      { nomeProduto: "Hub USB-C", categoria: "Acessórios", quantidade: 2, valorTotal: 180.00, dataVenda: new Date("2023-03-15") },
      { nomeProduto: "Cabo HDMI 2m", categoria: "Acessórios", quantidade: 10, valorTotal: 100.00, dataVenda: new Date("2023-03-20") },
    ]
  })

  console.log('Seed finalizado com sucesso!')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })