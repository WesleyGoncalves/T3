import { useState, useEffect } from 'react';
import { Cliente } from '../types/Cliente';
import { getClientes, saveClientes } from '../services/clienteService';

export default function Clientes() {
    const [clientes, setClientes] = useState<Cliente[]>([]);
    const [filtro, setFiltro] = useState('');
    const [form, setForm] = useState<Omit<Cliente, 'id'>>({ nome: '', nomeSocial: '', genero: '', email: '', cpf: '', rg: '' });
    const [editId, setEditId] = useState<number | null>(null);

    useEffect(() => {
        setClientes(getClientes());
    }, []);

    const salvar = (e: React.FormEvent) => {
        e.preventDefault();
        let lista = [...clientes];

        if (editId === null) {
            const novo: Cliente = {
                id: Date.now(),
                ...form
            };
            lista.push(novo);
        } else {
            lista = lista.map(c => c.id === editId ? { ...c, ...form } : c);
        }

        setClientes(lista);
        saveClientes(lista);
        setForm({ nome: '', nomeSocial: '', genero: '', email: '', cpf: '', rg: '' });
        setEditId(null);
    };

    const editar = (cliente: Cliente) => {
        setForm({ nome: cliente.nome, nomeSocial: cliente.nomeSocial, genero: cliente.genero, email: cliente.email, cpf: cliente.cpf, rg: cliente.rg });
        setEditId(cliente.id);
    };

    const excluir = (id: number) => {
        const lista = clientes.filter(c => c.id !== id);
        setClientes(lista);
        saveClientes(lista);
    };

    const listaFiltrada = clientes.filter(c =>
        c.nome.toLowerCase().includes(filtro.toLowerCase()) ||
        c.nomeSocial.toLowerCase().includes(filtro.toLowerCase()) ||
        c.email.toLowerCase().includes(filtro.toLowerCase())
    );

    return (
        <div className="container">
            <h4 className="center-align">Gerenciar Clientes</h4>

            <form onSubmit={salvar} className="row">
                <div className="input-field col s6">
                    <input value={form.nome} onChange={e => setForm({ ...form, nome: e.target.value })} id="nome" type="text" required />
                    <label htmlFor="nome" className={form.nome ? 'active' : ''}>Nome</label>
                </div>
                <div className="input-field col s6">
                    <input value={form.nomeSocial} onChange={e => setForm({ ...form, nomeSocial: e.target.value })} id="nomeSocial" type="text" required />
                    <label htmlFor="nomeSocial" className={form.nomeSocial ? 'active' : ''}>Nome Social</label>
                </div>
                <div className="input-field col s6">
                    <input value={form.genero} onChange={e => setForm({ ...form, genero: e.target.value })} id="genero" type="text" required />
                    <label htmlFor="genero" className={form.genero ? 'active' : ''}>Gênero</label>
                </div>
                <div className="input-field col s6">
                    <input value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} id="email" type="email" required />
                    <label htmlFor="email" className={form.email ? 'active' : ''}>Email</label>
                </div>
                <div className="input-field col s6">
                    <input value={form.cpf} onChange={e => setForm({ ...form, cpf: e.target.value })} id="cpf" type="text" required />
                    <label htmlFor="cpf" className={form.cpf ? 'active' : ''}>CPF</label>
                </div>
                <div className="input-field col s6">
                    <input value={form.rg} onChange={e => setForm({ ...form, rg: e.target.value })} id="rg" type="text" required />
                    <label htmlFor="rg" className={form.rg ? 'active' : ''}>RG</label>
                </div>
                <div className="col s12">
                    <button type="submit" className="btn green">
                        {editId ? 'Atualizar' : 'Cadastrar'}
                    </button>
                </div>
            </form>

            <div className="row">
                <div className="input-field col s12">
                    <input value={filtro} onChange={e => setFiltro(e.target.value)} id="filtro" type="text" />
                    <label htmlFor="filtro" className={filtro ? 'active' : ''}>Buscar Cliente</label>
                </div>
            </div>

            <table className="highlight responsive-table">
                <thead>
                    <tr>
                        <th>Nome</th>
                        <th>Nome Social</th>
                        <th>Gênero</th>
                        <th>Email</th>
                        <th>CPF</th>
                        <th>RG</th>
                        <th>Ações</th>
                    </tr>
                </thead>
                <tbody>
                    {listaFiltrada.map(cliente => (
                        <tr key={cliente.id}>
                            <td>{cliente.nome}</td>
                            <td>{cliente.nomeSocial}</td>
                            <td>{cliente.genero}</td>
                            <td>{cliente.email}</td>
                            <td>{cliente.cpf}</td>
                            <td>{cliente.rg}</td>
                            <td>
                                <button className="btn-small orange" onClick={() => editar(cliente)}>Editar</button>{' '}
                                <button className="btn-small red" onClick={() => excluir(cliente.id)}>Excluir</button>
                            </td>
                        </tr>
                    ))}
                    {listaFiltrada.length === 0 && (
                        <tr>
                            <td colSpan={5} className="center-align">Nenhum cliente encontrado</td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
}
