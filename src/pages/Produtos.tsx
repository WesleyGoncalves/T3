import { useEffect, useState } from "react";
import { Produto } from "../types/Produto";
import { getProdutos, saveProdutos } from "../services/produtoService";

export default function Produtos() {
  const [produtos, setProdutos] = useState<Produto[]>([]);
  const [filtro, setFiltro] = useState("");
  const [form, setForm] = useState<Omit<Produto, "id">>({ nome: "", valor: 0 });
  const [editId, setEditId] = useState<number | null>(null);

  useEffect(() => {
    setProdutos(getProdutos());
  }, []);

  const salvar = (e: React.FormEvent) => {
    e.preventDefault();
    let lista = [...produtos];

    if (editId === null) {
      const novo: Produto = {
        id: Date.now(),
        ...form,
      };
      lista.push(novo);
    } else {
      lista = lista.map((p) =>
        p.id === editId ? { ...p, ...form } : p
      );
    }

    setProdutos(lista);
    saveProdutos(lista);
    setForm({ nome: "", valor: 0 });
    setEditId(null);
  };

  const editar = (produto: Produto) => {
    setForm({ nome: produto.nome, valor: produto.valor });
    setEditId(produto.id);
  };

  const excluir = (id: number) => {
    const lista = produtos.filter((p) => p.id !== id);
    setProdutos(lista);
    saveProdutos(lista);
  };

  const listaFiltrada = produtos.filter((p) =>
    p.nome.toLowerCase().includes(filtro.toLowerCase())
  );

  return (
    <div className="container">
      <h4 className="center-align">Gerenciar Produtos</h4>

      <form onSubmit={salvar} className="row">
        <div className="input-field col s8">
          <input
            value={form.nome}
            onChange={(e) => setForm({ ...form, nome: e.target.value })}
            id="nome"
            type="text"
            required
          />
          <label htmlFor="nome" className={form.nome ? "active" : ""}>
            Nome do Produto
          </label>
        </div>
        <div className="input-field col s4">
          <input
            value={form.valor}
            onChange={(e) =>
              setForm({ ...form, valor: parseFloat(e.target.value) })
            }
            id="valor"
            type="number"
            step="0.01"
            required
          />
          <label htmlFor="valor" className={form.valor ? "active" : ""}>
            Valor (R$)
          </label>
        </div>
        <div className="col s12">
          <button type="submit" className="btn green">
            {editId ? "Atualizar" : "Cadastrar"}
          </button>
        </div>
      </form>

      <div className="row">
        <div className="input-field col s12">
          <input
            value={filtro}
            onChange={(e) => setFiltro(e.target.value)}
            id="filtro"
            type="text"
          />
          <label htmlFor="filtro" className={filtro ? "active" : ""}>
            Buscar Produto
          </label>
        </div>
      </div>

      <table className="highlight responsive-table">
        <thead>
          <tr>
            <th>Nome</th>
            <th>Valor</th>
            <th>Ações</th>
          </tr>
        </thead>
        <tbody>
          {listaFiltrada.map((produto) => (
            <tr key={produto.id}>
              <td>{produto.nome}</td>
              <td>R$ {produto.valor.toFixed(2)}</td>
              <td>
                <button
                  className="btn-small orange"
                  onClick={() => editar(produto)}
                >
                  Editar
                </button>{" "}
                <button
                  className="btn-small red"
                  onClick={() => excluir(produto.id)}
                >
                  Excluir
                </button>
              </td>
            </tr>
          ))}
          {listaFiltrada.length === 0 && (
            <tr>
              <td colSpan={3} className="center-align">
                Nenhum produto encontrado
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
