import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import NavBar from './componentes/NavBar';
import Clientes from './pages/Clientes';
import Produtos from './pages/Produtos'
import Servicos from './pages/Servicos'
import Vendas from './pages/Vendas'
import Relatorios from './pages/Relatorios'

export default function App() {
    return (
        <Router>
            <NavBar />
            <Routes>
                <Route path="/" element={<Navigate to="/clientes" />} />
                <Route path="/clientes" element={<Clientes />} />
                <Route path="/produtos" element={<Produtos />} />
                <Route path="/servicos" element={<Servicos />} />
                <Route path="/vendas" element={<Vendas />} />
                <Route path="/relatorios" element={<Relatorios />} />
            </Routes>
        </Router>
    );
}
