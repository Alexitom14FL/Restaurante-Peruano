import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import './App.css';

// Navegación
import Header from './Componentes/Header';

// Páginas del cliente
import Inicio from './Pages/Inicio';
import Carta from './Pages/Carta';
import Reservar from './Pages/Reservar';
import ElegirMesa from './Pages/ElegirMesa';
import Pago from './Pages/Pago';
import MisReservas from './Pages/MisReservas';

// Administración
import Login from './Pages/Login';
import AdminPanel from './Pages/AdminPanel';

function App() {
  return (
    <Router>
      {/* En /admin el Header no se muestra */}
      <Header />

      <Routes>
        {/* Rutas del cliente */}
        <Route path="/" element={<Inicio />} />
        <Route path="/carta" element={<Carta />} />
        <Route path="/reservar" element={<Reservar />} />
        <Route path="/elegir-mesa" element={<ElegirMesa />} />
        <Route path="/pago" element={<Pago />} />
        <Route path="/mis-reservas" element={<MisReservas />} />

        {/* Rutas de administración */}
        <Route path="/login" element={<Login />} />
        <Route path="/admin" element={<AdminPanel />} />
      </Routes>
    </Router>
  );
}

export default App;
