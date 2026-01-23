import { useEffect, useState, useRef } from 'react';
import { useReactToPrint } from 'react-to-print';
import { getRelatorio } from './services/api';
import type { Venda, FiltrosVenda } from './models';
import { 
  useReactTable, 
  getCoreRowModel, 
  flexRender, 
  createColumnHelper 
} from '@tanstack/react-table';
import { Printer, Search, Calendar, Filter } from 'lucide-react';

// Helper para criar as colunas da tabela de forma tipada
const columnHelper = createColumnHelper<Venda>();

const columns = [
  columnHelper.accessor('nomeProduto', { header: 'Produto' }),
  columnHelper.accessor('categoria', { header: 'Categoria' }),
  columnHelper.accessor('quantidade', { header: 'Qtd.' }),
  columnHelper.accessor('valorTotal', { 
    header: 'Total (R$)',
    cell: info => info.getValue().toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
  }),
  columnHelper.accessor('dataVenda', { 
    header: 'Data',
    cell: info => new Date(info.getValue()).toLocaleDateString('pt-BR')
  }),
];

function App() {
  const [data, setData] = useState<Venda[]>([]);
  const [filtros, setFiltros] = useState<FiltrosVenda>({});
  const componentRef = useRef<HTMLDivElement>(null);

  // Hook para imprimir o PDF
  const handlePrint = useReactToPrint({
    contentRef: componentRef,
    documentTitle: 'Relatorio_Vendas'
  });

  // Busca os dados na API
  const fetchData = async () => {
    try {
      const resultado = await getRelatorio(filtros);
      setData(resultado);
    } catch (error) {
      console.error("Erro ao buscar dados", error);
      alert("Erro ao conectar com o servidor!");
    }
  };

  // Busca inicial
  useEffect(() => {
    fetchData();
  }, []); // Array vazio = roda só ao abrir a tela

  // Configuração da Tabela TanStack
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <div className="min-h-screen bg-gray-50 p-8 font-sans text-gray-800">
      <div className="max-w-5xl mx-auto bg-white shadow-lg rounded-xl overflow-hidden">
        
        {/* Cabeçalho */}
        <header className="bg-blue-600 p-6 text-white flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold">Relatório de Vendas</h1>
            <p className="text-blue-100 text-sm">Desafio Técnico Full Stack</p>
          </div>
          <button 
            onClick={() => handlePrint && handlePrint()}
            className="flex items-center gap-2 bg-white text-blue-600 px-4 py-2 rounded-lg font-bold hover:bg-blue-50 transition"
          >
            <Printer size={20} />
            Exportar PDF
          </button>
        </header>

        {/* Filtros */}
        <div className="p-6 border-b border-gray-100 bg-gray-50/50 grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="flex items-center bg-white border border-gray-300 rounded-lg px-3 py-2">
            <Search size={18} className="text-gray-400 mr-2" />
            <input 
              placeholder="Buscar produto..." 
              className="bg-transparent outline-none w-full text-sm"
              onChange={e => setFiltros({...filtros, nome: e.target.value})}
            />
          </div>

          <div className="flex items-center bg-white border border-gray-300 rounded-lg px-3 py-2">
            <Filter size={18} className="text-gray-400 mr-2" />
            <input 
              placeholder="Categoria..." 
              className="bg-transparent outline-none w-full text-sm"
              onChange={e => setFiltros({...filtros, categoria: e.target.value})}
            />
          </div>

          <div className="flex items-center bg-white border border-gray-300 rounded-lg px-3 py-2">
            <Calendar size={18} className="text-gray-400 mr-2" />
            <input 
              type="date"
              className="bg-transparent outline-none w-full text-sm text-gray-500"
              onChange={e => setFiltros({...filtros, dataInicio: e.target.value})}
            />
          </div>

          <button 
            onClick={fetchData}
            className="bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition"
          >
            Filtrar Resultados
          </button>
        </div>

        {/* Tabela (Área de Impressão) */}
        <div ref={componentRef} className="p-6 print:p-8">
          {/* Cabeçalho visível apenas no PDF */}
          <div className="hidden print:block mb-6 border-b pb-4">
             <h1 className="text-3xl font-bold text-gray-800">Relatório de Vendas</h1>
             <p className="text-gray-500">Gerado em: {new Date().toLocaleString()}</p>
          </div>

          <div className="overflow-x-auto rounded-lg border border-gray-200">
            <table className="w-full text-left text-sm">
              <thead className="bg-gray-100 text-gray-600 uppercase font-bold">
                {table.getHeaderGroups().map(headerGroup => (
                  <tr key={headerGroup.id}>
                    {headerGroup.headers.map(header => (
                      <th key={header.id} className="px-6 py-3 border-b border-gray-200">
                        {flexRender(header.column.columnDef.header, header.getContext())}
                      </th>
                    ))}
                  </tr>
                ))}
              </thead>
              <tbody className="divide-y divide-gray-200">
                {table.getRowModel().rows.length > 0 ? (
                  table.getRowModel().rows.map(row => (
                    <tr key={row.id} className="hover:bg-gray-50">
                      {row.getVisibleCells().map(cell => (
                        <td key={cell.id} className="px-6 py-3">
                          {flexRender(cell.column.columnDef.cell, cell.getContext())}
                        </td>
                      ))}
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5} className="text-center py-8 text-gray-500">
                      Nenhum registro encontrado.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Rodapé */}
        <div className="p-4 bg-gray-50 border-t border-gray-200 text-center text-xs text-gray-400">
          Desenvolvido para Desafio de Estágio • 2026
        </div>

      </div>
    </div>
  );
}

export default App;