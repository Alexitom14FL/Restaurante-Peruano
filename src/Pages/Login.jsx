import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

export default function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState('admin@restreact.com');
  const [password, setPassword] = useState('123456');
  const [error, setError] = useState('');

  const manejarLogin = (e) => {
    e.preventDefault();

    // Credenciales de prueba
    if (email === 'admin@restreact.com' && password === '123456') {
      localStorage.setItem('adminAutenticado', 'true');
      navigate('/admin');
    } else {
      setError('Credenciales incorrectas. Usa: admin@restreact.com / 123456');
    }
  };

  return (
    <div className="container py-5">
      <div className="row justify-content-center my-4">
        <div className="col-md-6 col-lg-5">
          <div className="card shadow-lg border-0 rounded-4 overflow-hidden bg-white">
            
            {/* Encabezado */}
            <div className="p-4 text-center border-bottom bg-light">
              <div 
                className="rounded-circle d-flex align-items-center justify-content-center mx-auto mb-2" 
                style={{ width: '48px', height: '48px', backgroundColor: '#bd5d38' }}
              >
                <div className="rounded-circle bg-warning" style={{ width: '14px', height: '14px' }}></div>
              </div>
              <h4 className="fw-bold mb-1" style={{ color: '#2b2b2b' }}>Acceso Administrativo</h4>
              <p className="text-muted small mb-0">Gestión de reservas y mesas de RESTREACT XD</p>
            </div>

            <div className="card-body p-4 p-md-5">
              {error && (
                <div className="alert alert-danger py-2 small mb-4" role="alert">
                  {error}
                </div>
              )}

              <form onSubmit={manejarLogin}>
                <div className="mb-3">
                  <label className="form-label small fw-bold text-muted">CORREO ELECTRÓNICO</label>
                  <input 
                    type="email" 
                    className="form-control py-2" 
                    placeholder="correo@ejemplo.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>

                <div className="mb-4">
                  <label className="form-label small fw-bold text-muted">CONTRASEÑA</label>
                  <input 
                    type="password" 
                    className="form-control py-2" 
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                  <div className="form-text small mt-1">
                    Credenciales demo: <strong>admin@restreact.com</strong> / <strong>123456</strong>
                  </div>
                </div>

                <button 
                  type="submit" 
                  className="btn text-white w-100 py-3 fw-bold rounded-pill shadow-sm mb-3"
                  style={{ backgroundColor: '#bd5d38' }}
                >
                  Ingresar al Panel
                </button>

                <div className="text-center">
                  <Link to="/" className="text-muted text-decoration-none small">
                    ← Volver a la página principal
                  </Link>
                </div>
              </form>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
