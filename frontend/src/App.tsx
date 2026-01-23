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
import { Printer, Search, Filter, CalendarDays } from 'lucide-react';

// Categorias fixas (baseadas no nosso Seed do banco)
const CATEGORIAS = [
  "Eletrônicos",
  "Periféricos",
  "Móveis",
  "Áudio",
  "Acessórios"
];

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

  const handlePrint = useReactToPrint({
    contentRef: componentRef,
    documentTitle: 'Relatorio_Vendas'
  });

  const fetchData = async () => {
    try {
      const resultado = await getRelatorio(filtros);
      setData(resultado);
    } catch (error) {
      console.error("Erro ao buscar dados", error);
      alert("Erro ao conectar com o servidor!");
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <div className="min-h-screen bg-gray-50 p-8 font-sans text-gray-800">
      <div className="max-w-6xl mx-auto bg-white shadow-lg rounded-xl overflow-hidden">
        
        {/* Cabeçalho */}
        <header className="bg-blue-600 p-6 text-white flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold">Relatório de Vendas</h1>
            <p className="text-blue-100 text-sm">Painel de Controle Full Stack</p>
          </div>
          <button 
            onClick={() => handlePrint && handlePrint()}
            className="flex items-center gap-2 bg-white text-blue-600 px-4 py-2 rounded-lg font-bold hover:bg-blue-50 transition shadow-sm"
          >
            <Printer size={20} />
            Exportar PDF
          </button>
        </header>

        {/* Filtros */}
        <div className="p-6 border-b border-gray-100 bg-gray-50/50">
          <p className="text-xs font-semibold text-gray-500 mb-3 uppercase tracking-wide">Filtros de Busca</p>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4 items-end">
            
            {/* Filtro Produto */}
            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium text-gray-600">Produto</label>
              <div className="flex items-center bg-white border border-gray-300 rounded-lg px-3 py-2 focus-within:ring-2 ring-blue-500 focus-within:border-transparent">
                <Search size={18} className="text-gray-400 mr-2" />
                <input 
                  placeholder="Ex: Mouse" 
                  className="bg-transparent outline-none w-full text-sm"
                  onChange={e => setFiltros({...filtros, nome: e.target.value})}
                />
              </div>
            </div>

            {/* Filtro Categoria (SELECT) */}
            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium text-gray-600">Categoria</label>
              <div className="flex items-center bg-white border border-gray-300 rounded-lg px-3 py-2 focus-within:ring-2 ring-blue-500 focus-within:border-transparent">
                <Filter size={18} className="text-gray-400 mr-2" />
                <select 
                  className="bg-transparent outline-none w-full text-sm appearance-none cursor-pointer"
                  onChange={e => setFiltros({...filtros, categoria: e.target.value})}
                  value={filtros.categoria || ""}
                >
                  <option value="">Todas</option>
                  {CATEGORIAS.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Filtro Data Inicial */}
            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium text-gray-600">De (Data Inicial)</label>
              <div className="flex items-center bg-white border border-gray-300 rounded-lg px-3 py-2 focus-within:ring-2 ring-blue-500 focus-within:border-transparent">
                <CalendarDays size={18} className="text-gray-400 mr-2" />
                <input 
                  type="date"
                  className="bg-transparent outline-none w-full text-sm text-gray-600"
                  onChange={e => setFiltros({...filtros, dataInicio: e.target.value})}
                />
              </div>
            </div>

            {/* Filtro Data Final */}
            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium text-gray-600">Até (Data Final)</label>
              <div className="flex items-center bg-white border border-gray-300 rounded-lg px-3 py-2 focus-within:ring-2 ring-blue-500 focus-within:border-transparent">
                <CalendarDays size={18} className="text-gray-400 mr-2" />
                <input 
                  type="date"
                  className="bg-transparent outline-none w-full text-sm text-gray-600"
                  onChange={e => setFiltros({...filtros, dataFim: e.target.value})}
                />
              </div>
            </div>

            {/* Botão Filtrar */}
            <button 
              onClick={fetchData}
              className="bg-blue-600 text-white font-semibold rounded-lg h-[42px] hover:bg-blue-700 transition shadow-md active:transform active:scale-95"
            >
              Filtrar
            </button>
          </div>
        </div>

        {/* Tabela (Área de Impressão) */}
        <div ref={componentRef} className="p-6 print:p-8 min-h-[400px]">
          {/* Cabeçalho visível apenas no PDF */}
          <div className="hidden print:block mb-8 border-b pb-4">
             <div className="flex justify-between items-end">
               <div>
                 <h1 className="text-3xl font-bold text-gray-800">Relatório de Vendas</h1>
                 <p className="text-gray-500 mt-1">Exportação oficial do sistema</p>
               </div>
               <div className="text-right">
                 <p className="text-sm text-gray-400">Gerado em</p>
                 <p className="font-mono font-bold text-gray-600">{new Date().toLocaleString()}</p>
               </div>
             </div>
          </div>

          <div className="overflow-x-auto rounded-lg border border-gray-200 shadow-sm">
            <table className="w-full text-left text-sm">
              <thead className="bg-gray-100 text-gray-600 uppercase font-bold text-xs tracking-wider">
                {table.getHeaderGroups().map(headerGroup => (
                  <tr key={headerGroup.id}>
                    {headerGroup.headers.map(header => (
                      <th key={header.id} className="px-6 py-4 border-b border-gray-200">
                        {flexRender(header.column.columnDef.header, header.getContext())}
                      </th>
                    ))}
                  </tr>
                ))}
              </thead>
              <tbody className="divide-y divide-gray-200 bg-white">
                {table.getRowModel().rows.length > 0 ? (
                  table.getRowModel().rows.map(row => (
                    <tr key={row.id} className="hover:bg-blue-50 transition-colors">
                      {row.getVisibleCells().map(cell => (
                        <td key={cell.id} className="px-6 py-4 text-gray-700 whitespace-nowrap">
                          {flexRender(cell.column.columnDef.cell, cell.getContext())}
                        </td>
                      ))}
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5} className="text-center py-12 text-gray-400 italic">
                      Nenhum registro encontrado para os filtros selecionados.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Rodapé */}
        <div className="p-4 bg-gray-50 border-t border-gray-200 text-center text-xs text-gray-500">
          Desenvolvido por <strong className="text-gray-700">Samuel Gomes</strong> • Desafio Técnico 2026
        </div>

      </div>
    </div>
  );
}

export default App;