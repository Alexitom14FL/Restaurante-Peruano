import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

export default function MisReservas() {
  const [reservas, setReservas] = useState([]);

  // Reservas guardadas en el navegador
  useEffect(() => {
    cargarReservas();
  }, []);

  const cargarReservas = () => {
    const datosGuardados = localStorage.getItem('historialReservas');
    if (datosGuardados) {
      setReservas(JSON.parse(datosGuardados));
    } else {
      setReservas([]);
    }
  };

  // Cancela y libera la mesa
  const cancelarReserva = (idReserva) => {
    const confirmar = window.confirm('¿Seguro que deseas cancelar esta reserva?');
    if (confirmar) {
      let mesaLiberar = '';
      const actualizadas = reservas.map((r) => {
        if (r.idReserva === idReserva) {
          mesaLiberar = r.mesa;
          return { ...r, estado: 'Cancelada' };
        }
        return r;
      });

      setReservas(actualizadas);
      localStorage.setItem('historialReservas', JSON.stringify(actualizadas));

      // La mesa vuelve a quedar libre
      if (mesaLiberar) {
        const mesasGuardadas = localStorage.getItem('configMesas');
        if (mesasGuardadas) {
          const lista = JSON.parse(mesasGuardadas);
          const liberadas = lista.map((m) => {
            if (m.nombre === mesaLiberar) {
              return { ...m, estado: 'disponible' };
            }
            return m;
          });
          localStorage.setItem('configMesas', JSON.stringify(liberadas));
        }
      }
    }
  };

  return (
    <div className="container py-5">
      
      {/* Título */}
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center gap-3 mb-4">
        <div>
          <h1 className="fw-bold display-6 mb-1" style={{ color: '#2b2b2b' }}>
            Mis Reservas
          </h1>
          <p className="text-muted mb-0">
            Revisa el estado de tus reservas y los detalles de tu mesa asignada
          </p>
        </div>
        <Link 
          to="/reservar" 
          className="btn text-white fw-bold px-4 py-2 rounded-pill shadow-sm"
          style={{ backgroundColor: '#bd5d38' }}
        >
          + Nueva Reserva
        </Link>
      </div>

      {/* Reservas */}
      {reservas.length > 0 ? (
        <div className="card border-0 shadow-sm rounded-4 overflow-hidden bg-white">
          <div className="table-responsive">
            <table className="table table-hover align-middle mb-0">
              <thead className="table-light">
                <tr>
                  <th className="py-3 px-4">Código</th>
                  <th className="py-3">Cliente</th>
                  <th className="py-3">Fecha y Hora</th>
                  <th className="py-3">Mesa / Zona</th>
                  <th className="py-3">Personas</th>
                  <th className="py-3">Estado</th>
                  <th className="py-3 text-end px-4">Acción</th>
                </tr>
              </thead>
              <tbody>
                {reservas.map((reserva) => (
                  <tr key={reserva.idReserva}>
                    <td className="py-3 px-4 fw-bold" style={{ color: '#bd5d38' }}>
                      {reserva.idReserva}
                    </td>
                    <td className="py-3">
                      <div className="fw-semibold">{reserva.nombre}</div>
                      <small className="text-muted">{reserva.telefono}</small>
                    </td>
                    <td className="py-3">
                      <div>{reserva.fecha}</div>
                      <small className="text-muted">{reserva.hora}</small>
                    </td>
                    <td className="py-3">
                      <span className="badge bg-light text-dark border px-2 py-1">
                        {reserva.mesa} • {reserva.zona}
                      </span>
                    </td>
                    <td className="py-3">
                      {reserva.personas} personas
                    </td>
                    <td className="py-3">
                      <span className={`badge px-3 py-2 rounded-pill ${
                        reserva.estado === 'Confirmada' ? 'bg-success-subtle text-success border border-success-subtle' :
                        reserva.estado === 'Pendiente' ? 'bg-warning-subtle text-warning-emphasis border border-warning-subtle' :
                        'bg-danger-subtle text-danger border border-danger-subtle'
                      }`}>
                        ● {reserva.estado}
                      </span>
                    </td>
                    <td className="py-3 text-end px-4">
                      {reserva.estado !== 'Cancelada' ? (
                        <button
                          type="button"
                          onClick={() => cancelarReserva(reserva.idReserva)}
                          className="btn btn-sm btn-outline-danger rounded-pill px-3"
                        >
                          Cancelar
                        </button>
                      ) : (
                        <span className="text-muted small">Cancelada</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="card border-0 shadow-sm rounded-4 p-5 text-center bg-white my-4">
          <div className="fs-1 mb-2">📅</div>
          <h4 className="fw-bold mb-2">No tienes reservas activas</h4>
          <p className="text-muted mb-4">
            Aún no has realizado ninguna reserva. Elige tu fecha y mesa favorita en simples pasos.
          </p>
          <div>
            <Link 
              to="/reservar" 
              className="btn text-white fw-bold px-4 py-2 rounded-pill shadow-sm"
              style={{ backgroundColor: '#bd5d38' }}
            >
              Reservar una mesa ahora
            </Link>
          </div>
        </div>
      )}

    </div>
  );
}