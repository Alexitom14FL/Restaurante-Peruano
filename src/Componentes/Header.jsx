import React from 'react';
import { Link, useLocation } from 'react-router-dom';

export default function Header() {
  const location = useLocation();

  // Marca el enlace de la ruta actual
  const estaActivo = (ruta) => {
    return location.pathname === ruta ? 'fw-bold' : 'text-secondary';
  };

  // El panel admin tiene su propio header
  if (location.pathname === '/admin') {
    return null;
  }

  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-white border-bottom shadow-sm py-3 px-4 sticky-top">
      <div className="container-fluid">
        
        {/* Logo */}
        <Link to="/" className="navbar-brand d-flex align-items-center gap-2 text-decoration-none fw-bold">
          <div 
            className="rounded-circle d-flex align-items-center justify-content-center" 
            style={{ width: '32px', height: '32px', backgroundColor: '#bd5d38' }}
          >
            <div className="rounded-circle bg-warning" style={{ width: '10px', height: '10px' }}></div>
          </div>
          <span style={{ color: '#bd5d38' }}>RESTREACT XD</span>
        </Link>

        {/* Menú móvil */}
        <button 
          className="navbar-toggler border-0 shadow-none" 
          type="button" 
          data-bs-toggle="collapse" 
          data-bs-target="#navbarSupportedContent"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        {/* Enlaces */}
        <div className="collapse navbar-collapse" id="navbarSupportedContent">
          <ul className="navbar-nav me-auto mb-2 mb-lg-0 gap-lg-3 align-items-lg-center">
            <li className="nav-item">
              <Link 
                to="/" 
                className={`nav-link ${estaActivo('/')}`} 
                style={{ color: location.pathname === '/' ? '#bd5d38' : undefined }}
              >
                Inicio
              </Link>
            </li>
            <li className="nav-item">
              <Link 
                to="/carta" 
                className={`nav-link ${estaActivo('/carta')}`} 
                style={{ color: location.pathname === '/carta' ? '#bd5d38' : undefined }}
              >
                Carta
              </Link>
            </li>
            <li className="nav-item">
              <Link 
                to="/reservar" 
                className={`nav-link ${estaActivo('/reservar')}`} 
                style={{ color: location.pathname === '/reservar' ? '#bd5d38' : undefined }}
              >
                Reservar
              </Link>
            </li>
            <li className="nav-item">
              <Link 
                to="/mis-reservas" 
                className={`nav-link ${estaActivo('/mis-reservas')}`} 
                style={{ color: location.pathname === '/mis-reservas' ? '#bd5d38' : undefined }}
              >
                Mis reservas
              </Link>
            </li>
          </ul>

          {/* Acceso admin */}
          <div className="d-flex ms-lg-3 mt-3 mt-lg-0">
            <Link 
              to="/login"
              className="btn rounded-pill px-4 py-2 fw-bold text-decoration-none" 
              style={{ border: '1px solid #bd5d38', color: '#bd5d38', backgroundColor: 'transparent' }}
            >
              Iniciar sesión
            </Link>
          </div>

        </div>
      </div>
    </nav>
  );
}