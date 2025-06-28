/* eslint-disable jsx-a11y/anchor-is-valid */
import { Link } from 'react-router-dom';
import 'materialize-css/dist/css/materialize.min.css';
import { useEffect } from "react";
import M from "materialize-css";

export default function NavBar() {

    useEffect(() => {
        const elems = document.querySelectorAll('.sidenav');
        M.Sidenav.init(elems);
    }, []);

    return (
        <>
            <nav className="purple lighten-2">
                <div className="nav-wrapper container">
                    <Link to="/" className="brand-logo">WB</Link>
                    <a href="#" data-target="mobile-menu" className="sidenav-trigger">
                        <i className="material-icons">menu</i>
                    </a>
                    <ul className="right hide-on-med-and-down">
                        <li><Link to="/clientes">Clientes</Link></li>
                        <li><Link to="/produtos">Produtos</Link></li>
                        <li><Link to="/servicos">Serviços</Link></li>
                        <li><Link to="/vendas">Vendas</Link></li>
                        <li><Link to="/relatorios">Relatórios</Link></li>
                    </ul>
                </div>
            </nav>

            <ul className="sidenav" id="mobile-menu">
                <li><Link to="/clientes">Clientes</Link></li>
                <li><Link to="/produtos">Produtos</Link></li>
                <li><Link to="/servicos">Serviços</Link></li>
                <li><Link to="/vendas">Vendas</Link></li>
            </ul>
        </>
    );
}
