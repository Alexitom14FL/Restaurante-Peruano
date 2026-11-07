import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

// Módulos del panel
import Dashboard from './Admin/Dashboard';
import GestionReservas from './Admin/GestionReservas';
import GestionMesas from './Admin/GestionMesas';
import GestionCarta from './Admin/GestionCarta';
import GestionHorarios from './Admin/GestionHorarios';

export default function AdminPanel() {
  const navigate = useNavigate();

  const [seccionActiva, setSeccionActiva] = useState('dashboard');

  const cerrarSesion = () => {
    localStorage.removeItem('adminAutenticado');
    navigate('/login');
  };

  return (
    <div style={{ backgroundColor: '#f4f6f9', minHeight: '100vh' }}>
      
      {/* Barra superior */}
      <nav className="navbar navbar-dark bg-dark px-4 py-3 shadow-sm sticky-top">
        <div className="container-fluid">
          <div className="d-flex align-items-center gap-3">
            <div 
              className="rounded-circle d-flex align-items-center justify-content-center" 
              style={{ width: '32px', height: '32px', backgroundColor: '#bd5d38' }}
            >
              <div className="rounded-circle bg-warning" style={{ width: '10px', height: '10px' }}></div>
            </div>
            <span className="navbar-brand mb-0 h1 fw-bold fs-5">
              Panel Administrativo <span className="badge bg-secondary ms-2 fs-6">Admin</span>
            </span>
          </div>

          <div className="d-flex align-items-center gap-3">
            <Link to="/" className="btn btn-outline-light btn-sm rounded-pill px-3">
              Ver Sitio Web
            </Link>
            <button 
              type="button" 
              onClick={cerrarSesion}
              className="btn btn-danger btn-sm rounded-pill px-3 fw-bold"
            >
              Cerrar Sesión
            </button>
          </div>
        </div>
      </nav>

      <div className="container py-4">

        {/* Encabezado */}
        <div className="mb-4">
          <h2 className="fw-bold mb-1" style={{ color: '#2b2b2b' }}>
            Administración del Restaurante
          </h2>
          <p className="text-muted mb-3">
            Control de reservas, disponibilidad de mesas, carta y horarios de atención al cliente
          </p>

          {/* Módulos */}
          <div className="d-flex gap-2 flex-wrap">
            <button
              type="button"
              onClick={() => setSeccionActiva('dashboard')}
              className={`btn rounded-pill px-4 py-2 fw-bold shadow-sm ${
                seccionActiva === 'dashboard' ? 'text-white' : 'btn-white bg-white border text-dark'
              }`}
              style={{ backgroundColor: seccionActiva === 'dashboard' ? '#bd5d38' : undefined }}
            >
              📊 Resumen
            </button>

            <button
              type="button"
              onClick={() => setSeccionActiva('reservas')}
              className={`btn rounded-pill px-4 py-2 fw-bold shadow-sm ${
                seccionActiva === 'reservas' ? 'text-white' : 'btn-white bg-white border text-dark'
              }`}
              style={{ backgroundColor: seccionActiva === 'reservas' ? '#bd5d38' : undefined }}
            >
              📋 Gestionar Reservas
            </button>

            <button
              type="button"
              onClick={() => setSeccionActiva('mesas')}
              className={`btn rounded-pill px-4 py-2 fw-bold shadow-sm ${
                seccionActiva === 'mesas' ? 'text-white' : 'btn-white bg-white border text-dark'
              }`}
              style={{ backgroundColor: seccionActiva === 'mesas' ? '#bd5d38' : undefined }}
            >
              🪑 Gestionar Mesas (Libres / Ocupadas)
            </button>

            <button
              type="button"
              onClick={() => setSeccionActiva('carta')}
              className={`btn rounded-pill px-4 py-2 fw-bold shadow-sm ${
                seccionActiva === 'carta' ? 'text-white' : 'btn-white bg-white border text-dark'
              }`}
              style={{ backgroundColor: seccionActiva === 'carta' ? '#bd5d38' : undefined }}
            >
              🍽️ Gestionar Carta
            </button>

            <button
              type="button"
              onClick={() => setSeccionActiva('horarios')}
              className={`btn rounded-pill px-4 py-2 fw-bold shadow-sm ${
                seccionActiva === 'horarios' ? 'text-white' : 'btn-white bg-white border text-dark'
              }`}
              style={{ backgroundColor: seccionActiva === 'horarios' ? '#bd5d38' : undefined }}
            >
              ⏰ Días y Horarios de Trabajo
            </button>
          </div>
        </div>

        {/* Contenido del módulo */}
        {seccionActiva === 'dashboard' && <Dashboard />}
        {seccionActiva === 'reservas' && <GestionReservas />}
        {seccionActiva === 'mesas' && <GestionMesas />}
        {seccionActiva === 'carta' && <GestionCarta />}
        {seccionActiva === 'horarios' && <GestionHorarios />}

      </div>

    </div>
  );
}