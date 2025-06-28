import { useEffect, useState } from "react";
import { Servico } from "../types/Servico"
import { getServicos, saveServicos } from "../services/servicoService"

export default function Servicos() {
  const [servicos, setServicos] = useState<Servico[]>([]);
  const [filtro, setFiltro] = useState("");
  const [form, setForm] = useState<Omit<Servico, "id">>({ nome: "", valor: 0 });
  const [editId, setEditId] = useState<number | null>(null);

  useEffect(() => {
    setServicos(getServicos());
  }, []);

  const salvar = (e: React.FormEvent) => {
    e.preventDefault();
    let lista = [...servicos];

    if (editId === null) {
      const novo: Servico = {
        id: Date.now(),
        ...form,
      };
      lista.push(novo);
    } else {
      lista = lista.map((p) =>
        p.id === editId ? { ...p, ...form } : p
      );
    }

    setServicos(lista);
    saveServicos(lista);
    setForm({ nome: "", valor: 0 });
    setEditId(null);
  };

  const editar = (servico: Servico) => {
    setForm({ nome: servico.nome, valor: servico.valor });
    setEditId(servico.id);
  };

  const excluir = (id: number) => {
    const lista = servicos.filter((p) => p.id !== id);
    setServicos(lista);
    saveServicos(lista);
  };

  const listaFiltrada = servicos.filter((p) =>
    p.nome.toLowerCase().includes(filtro.toLowerCase())
  );

  return (
    <div className="container">
      <h4 className="center-align">Gerenciar Servicos</h4>

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
            Nome do Servico
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
            Buscar Servico
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
          {listaFiltrada.map((servico) => (
            <tr key={servico.id}>
              <td>{servico.nome}</td>
              <td>R$ {servico.valor.toFixed(2)}</td>
              <td>
                <button
                  className="btn-small orange"
                  onClick={() => editar(servico)}
                >
                  Editar
                </button>{" "}
                <button
                  className="btn-small red"
                  onClick={() => excluir(servico.id)}
                >
                  Excluir
                </button>
              </td>
            </tr>
          ))}
          {listaFiltrada.length === 0 && (
            <tr>
              <td colSpan={3} className="center-align">
                Nenhum servico encontrado
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
