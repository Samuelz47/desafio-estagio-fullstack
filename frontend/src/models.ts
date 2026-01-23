export interface Venda {
    id: number;
    nomeProduto: string;
    categoria: string;
    quantidade: number;
    valorTotal: number;
    dataVenda: string; // O JSON sempre devolve data como string
}

export interface FiltrosVenda {
    nome?: string;
    categoria?: string;
    dataInicio?: string;
    dataFim?: string;
}