import axios from 'axios';
import type { Venda, FiltrosVenda } from '../models';

const api = axios.create({
    baseURL: 'http://localhost:3000',
});

export const getRelatorio = async (filtros?: FiltrosVenda) => {

    const response = await api.get<Venda[]>('/relatorio', { 
        params: filtros 
    });
    return response.data;
};