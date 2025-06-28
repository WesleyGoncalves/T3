import { useEffect, useState } from 'react';
import { Cliente } from '../types/Cliente';
import { Venda } from '../types/Venda';
import { getClientes } from '../services/clienteService';
import { getVendas } from '../services/vendaService';

export default function Relatorios() {
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [vendas, setVendas] = useState<Venda[]>([]);

  useEffect(() => {
    setClientes(getClientes());
    setVendas(getVendas());
  }, []);

  // Helper: consumo por cliente
  const consumoPorCliente = clientes.map(cliente => {
    const vendasCliente = vendas.filter(v => v.cliente.id === cliente.id);
    const total = vendasCliente.reduce((acc, v) => acc + v.total, 0);
    const quantidade = vendasCliente.reduce(
      (acc, v) => acc + v.itens.reduce((a, i) => a + i.quantidade, 0),
      0
    );
    return { cliente, total, quantidade };
  });

  const top10Quantidade = [...consumoPorCliente].sort((a, b) => b.quantidade - a.quantidade).slice(0, 10);
  const top5Valor = [...consumoPorCliente].sort((a, b) => b.total - a.total).slice(0, 5);
  const bottom10Quantidade = [...consumoPorCliente].sort((a, b) => a.quantidade - b.quantidade).slice(0, 10);

  // Produtos/Serviços mais consumidos (geral)
  const consumoTotalItens: { nome: string; quantidade: number }[] = [];
  vendas.forEach(v => {
    v.itens.forEach(item => {
      const nome = item.produtoOuServico.nome;
      const existente = consumoTotalItens.find(i => i.nome === nome);
      if (existente) {
        existente.quantidade += item.quantidade;
      } else {
        consumoTotalItens.push({ nome, quantidade: item.quantidade });
      }
    });
  });
  consumoTotalItens.sort((a, b) => b.quantidade - a.quantidade);

  // Mais consumidos por gênero
  const consumoPorGenero: Record<string, Record<string, number>> = {};
  vendas.forEach(venda => {
    const genero = venda.cliente.genero;
    if (!consumoPorGenero[genero]) consumoPorGenero[genero] = {};
    venda.itens.forEach(item => {
      const nome = item.produtoOuServico.nome;
      consumoPorGenero[genero][nome] = (consumoPorGenero[genero][nome] || 0) + item.quantidade;
    });
  });

  return (
    <div className="container">
      <h4 className="center-align">Relatórios</h4>

      <section>
        <h5>1. Top 10 Clientes que mais consumiram (quantidade)</h5>
        <ul>
          {top10Quantidade.map(({ cliente, quantidade }) => (
            <li key={cliente.id}>{cliente.nome} - {quantidade} itens</li>
          ))}
        </ul>
      </section>

      <section>
        <h5>2. Top 5 Clientes que mais gastaram (valor)</h5>
        <ul>
          {top5Valor.map(({ cliente, total }) => (
            <li key={cliente.id}>{cliente.nome} - R$ {total.toFixed(2)}</li>
          ))}
        </ul>
      </section>

      <section>
        <h5>3. Top 10 Clientes que menos consumiram (quantidade)</h5>
        <ul>
          {bottom10Quantidade.map(({ cliente, quantidade }) => (
            <li key={cliente.id}>{cliente.nome} - {quantidade} itens</li>
          ))}
        </ul>
      </section>

      <section>
        <h5>4. Produtos/Serviços mais consumidos</h5>
        <ul>
          {consumoTotalItens.map((item, idx) => (
            <li key={idx}>{item.nome} - {item.quantidade} unidades</li>
          ))}
        </ul>
      </section>

      <section>
        <h5>5. Consumo por Gênero</h5>
        {Object.entries(consumoPorGenero).map(([genero, itens]) => (
          <div key={genero}>
            <strong>{genero}</strong>
            <ul>
              {Object.entries(itens).map(([nome, quantidade]) => (
                <li key={nome}>{nome} - {quantidade} unidades</li>
              ))}
            </ul>
          </div>
        ))}
      </section>
    </div>
  );
}
