import { useEffect, useState } from "react";
import { Cliente } from "../types/Cliente";
import { Produto } from "../types/Produto";
import { Venda, Item } from "../types/Venda";
import { getClientes } from "../services/clienteService";
import { getProdutos } from "../services/produtoService";
import { getVendas, saveVendas } from "../services/vendaService";

export default function Vendas() {
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [produtos, setProdutos] = useState<Produto[]>([]);
  const [vendas, setVendas] = useState<Venda[]>([]);
  const [clienteSelecionado, setClienteSelecionado] = useState<Cliente | null>(null);
  const [produtoSelecionado, setProdutoSelecionado] = useState<Produto | null>(null);
  const [quantidade, setQuantidade] = useState(1);
  const [itens, setItens] = useState<Item[]>([]);
  const [editId, setEditId] = useState<number | null>(null);

  useEffect(() => {
    setClientes(getClientes());
    setProdutos(getProdutos());
    setVendas(getVendas());
  }, []);

  const adicionarItem = () => {
    if (!produtoSelecionado) return;
    const subTotal = produtoSelecionado.valor * quantidade;

    const novoItem: Item = {
      produtoOuServico: produtoSelecionado,
      quantidade,
      subTotal,
    };

    setItens([...itens, novoItem]);
    setProdutoSelecionado(null);
    setQuantidade(1);
  };

  const salvarVenda = (e: React.FormEvent) => {
    e.preventDefault();
    if (!clienteSelecionado || itens.length === 0) return;

    const total = itens.reduce((acc, item) => acc + item.subTotal, 0);
    let novaLista = [...vendas];

    if (editId === null) {
      const novaVenda: Venda = {
        id: Date.now(),
        cliente: clienteSelecionado,
        itens,
        total,
      };
      novaLista.push(novaVenda);
    } else {
      novaLista = novaLista.map(v =>
        v.id === editId
          ? { ...v, cliente: clienteSelecionado, itens, total }
          : v
      );
    }

    setVendas(novaLista);
    saveVendas(novaLista);
    limparFormulario();
  };

  const editarVenda = (venda: Venda) => {
    setClienteSelecionado(venda.cliente);
    setItens(venda.itens);
    setEditId(venda.id);
  };

  const excluirVenda = (id: number) => {
    const novaLista = vendas.filter(v => v.id !== id);
    setVendas(novaLista);
    saveVendas(novaLista);
  };

  const limparFormulario = () => {
    setClienteSelecionado(null);
    setItens([]);
    setEditId(null);
  };

  return (
    <div className="container">
      <h4 className="center-align">Gerenciar Vendas</h4>

      <form onSubmit={salvarVenda} className="row">
        <div className="input-field col s12">
          <select
            className="browser-default"
            value={clienteSelecionado?.id || ""}
            onChange={(e) =>
              setClienteSelecionado(
                clientes.find((c) => c.id === parseInt(e.target.value)) || null
              )
            }
          >
            <option value="" disabled>
              Selecione um Cliente
            </option>
            {clientes.map((c) => (
              <option key={c.id} value={c.id}>
                {c.nome}
              </option>
            ))}
          </select>
        </div>

        <div className="input-field col s7">
          <select
            className="browser-default"
            value={produtoSelecionado?.id || ""}
            onChange={(e) =>
              setProdutoSelecionado(
                produtos.find((p) => p.id === parseInt(e.target.value)) || null
              )
            }
          >
            <option value="" disabled>
              Selecione um Produto
            </option>
            {produtos.map((p) => (
              <option key={p.id} value={p.id}>
                {p.nome} - R$ {p.valor.toFixed(2)}
              </option>
            ))}
          </select>
        </div>

        <div className="input-field col s1">
          <input
            type="number"
            min={1}
            value={quantidade}
            onChange={(e) => setQuantidade(parseInt(e.target.value))}
          />
        </div>

        <div className="input-field col s3">
          <button type="button" className="btn blue" onClick={adicionarItem}>
            Adicionar Item
          </button>
        </div>

        <div className="col s12">
          <h6>Itens da Venda:</h6>
          <ul className="collection">
            {itens.map((item, index) => (
              <li className="collection-item" key={index}>
                {item.produtoOuServico.nome} - {item.quantidade}x R$ {item.produtoOuServico.valor.toFixed(2)} = R$ {item.subTotal.toFixed(2)}
              </li>
            ))}
            {itens.length === 0 && <li className="collection-item">Nenhum item</li>}
          </ul>
        </div>

        <div className="col s12">
          <button type="submit" className="btn green">
            {editId ? "Atualizar Venda" : "Finalizar Venda"}
          </button>
          {editId && (
            <button
              type="button"
              className="btn grey right"
              onClick={limparFormulario}
            >
              Cancelar
            </button>
          )}
        </div>
      </form>

      <h5 className="center-align">Histórico de Vendas</h5>
      <table className="highlight responsive-table">
        <thead>
          <tr>
            <th>Cliente</th>
            <th>Total</th>
            <th>Itens</th>
            <th>Ações</th>
          </tr>
        </thead>
        <tbody>
          {vendas.map((venda) => (
            <tr key={venda.id}>
              <td>{venda.cliente.nome}</td>
              <td>R$ {venda.total.toFixed(2)}</td>
              <td>
                {venda.itens.map((item, i) => (
                  <div key={i}>
                    {item.produtoOuServico.nome} - {item.quantidade}x
                  </div>
                ))}
              </td>
              <td>
                <button
                  className="btn-small orange"
                  onClick={() => editarVenda(venda)}
                >
                  Editar
                </button>{" "}
                <button
                  className="btn-small red"
                  onClick={() => excluirVenda(venda.id)}
                >
                  Excluir
                </button>
              </td>
            </tr>
          ))}
          {vendas.length === 0 && (
            <tr>
              <td colSpan={4} className="center-align">
                Nenhuma venda registrada
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
