import React, { useState, useEffect } from 'react';

export default function GestionReservas() {
  const [reservas, setReservas] = useState([]);
  const [reservaEditando, setReservaEditando] = useState(null);
  const [mostrarModal, setMostrarModal] = useState(false);
  const [filtroEstado, setFiltroEstado] = useState('Todos');

  // Reservas guardadas
  useEffect(() => {
    cargarReservas();
  }, []);

  const cargarReservas = () => {
    const datos = localStorage.getItem('historialReservas');
    if (datos) {
      setReservas(JSON.parse(datos));
    } else {
      setReservas([]);
    }
  };

  // Edición
  const abrirEdicion = (reserva) => {
    setReservaEditando({ ...reserva });
    setMostrarModal(true);
  };

  // Guarda los cambios
  const guardarCambios = (e) => {
    e.preventDefault();
    if (!reservaEditando) return;

    const listaActualizada = reservas.map((item) => {
      if (item.idReserva === reservaEditando.idReserva) {
        return reservaEditando;
      }
      return item;
    });

    setReservas(listaActualizada);
    localStorage.setItem('historialReservas', JSON.stringify(listaActualizada));

    // Si se cancela, libera la mesa
    if (reservaEditando.estado === 'Cancelada') {
      const mesasGuardadas = localStorage.getItem('configMesas');
      if (mesasGuardadas) {
        const lista = JSON.parse(mesasGuardadas);
        const liberadas = lista.map((m) => {
          if (m.nombre === reservaEditando.mesa) {
            return { ...m, estado: 'disponible' };
          }
          return m;
        });
        localStorage.setItem('configMesas', JSON.stringify(liberadas));
      }
    }

    setMostrarModal(false);
    alert('¡Reserva ' + reservaEditando.idReserva + ' actualizada con éxito!');
  };

  // Elimina la reserva
  const eliminarReserva = (idReserva) => {
    const confirmar = window.confirm('¿Deseas eliminar la reserva ' + idReserva + '?');
    if (confirmar) {
      const reservaAEliminar = reservas.find((item) => item.idReserva === idReserva);
      const listaFiltrada = reservas.filter((item) => item.idReserva !== idReserva);
      setReservas(listaFiltrada);
      localStorage.setItem('historialReservas', JSON.stringify(listaFiltrada));

      // Libera la mesa
      if (reservaAEliminar) {
        const mesasGuardadas = localStorage.getItem('configMesas');
        if (mesasGuardadas) {
          const lista = JSON.parse(mesasGuardadas);
          const liberadas = lista.map((m) => {
            if (m.nombre === reservaAEliminar.mesa) {
              return { ...m, estado: 'disponible' };
            }
            return m;
          });
          localStorage.setItem('configMesas', JSON.stringify(liberadas));
        }
      }
    }
  };

  // Métricas
  const totalReservas = reservas.length;
  let totalComensales = 0;
  let confirmadas = 0;
  for (let i = 0; i < reservas.length; i++) {
    totalComensales += Number(reservas[i].personas) || 0;
    if (reservas[i].estado === 'Confirmada') confirmadas++;
  }

  // Filtro por estado
  const reservasFiltradas = reservas.filter((r) => {
    if (filtroEstado === 'Todos') return true;
    return r.estado === filtroEstado;
  });

  return (
    <div>
      
      {/* Métricas */}
      <div className="row g-3 mb-4">
        <div className="col-md-4">
          <div className="card border-0 shadow-sm rounded-4 p-3 bg-white">
            <span className="small text-muted fw-bold text-uppercase">Total Reservas</span>
            <h3 className="fw-bold mb-0 mt-2" style={{ color: '#bd5d38' }}>{totalReservas}</h3>
            <small className="text-muted">Registradas en el sistema</small>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card border-0 shadow-sm rounded-4 p-3 bg-white">
            <span className="small text-muted fw-bold text-uppercase">Confirmadas</span>
            <h3 className="fw-bold mb-0 mt-2 text-success">{confirmadas}</h3>
            <small className="text-muted">Mesas aseguradas</small>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card border-0 shadow-sm rounded-4 p-3 bg-white">
            <span className="small text-muted fw-bold text-uppercase">Total Comensales</span>
            <h3 className="fw-bold mb-0 mt-2 text-dark">{totalComensales}</h3>
            <small className="text-muted">Personas esperadas</small>
          </div>
        </div>
      </div>

      {/* Filtros */}
      <div className="d-flex justify-content-between align-items-center mb-3">
        <div className="d-flex gap-2">
          {['Todos', 'Confirmada', 'Pendiente', 'Cancelada'].map((est) => (
            <button
              key={est}
              type="button"
              onClick={() => setFiltroEstado(est)}
              className={`btn btn-sm rounded-pill px-3 fw-bold ${
                filtroEstado === est ? 'btn-dark' : 'btn-white bg-white border text-muted'
              }`}
            >
              {est}
            </button>
          ))}
        </div>

        <button 
          type="button"
          onClick={cargarReservas}
          className="btn btn-sm btn-light border rounded-pill px-3"
        >
          🔄 Refrescar
        </button>
      </div>

      {/* Tabla */}
      <div className="card border-0 shadow-sm rounded-4 overflow-hidden bg-white mb-5">
        <div className="table-responsive">
          <table className="table table-hover align-middle mb-0">
            <thead className="table-light">
              <tr>
                <th className="py-3 px-4">Código</th>
                <th className="py-3">Cliente</th>
                <th className="py-3">Fecha y Turno</th>
                <th className="py-3">Mesa / Zona</th>
                <th className="py-3">Personas</th>
                <th className="py-3">Estado</th>
                <th className="py-3 text-end px-4">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {reservasFiltradas.length > 0 ? (
                reservasFiltradas.map((r) => (
                  <tr key={r.idReserva}>
                    <td className="py-3 px-4 fw-bold" style={{ color: '#bd5d38' }}>
                      {r.idReserva}
                    </td>
                    <td className="py-3">
                      <div className="fw-bold">{r.nombre}</div>
                      <small className="text-muted">{r.telefono}</small>
                    </td>
                    <td className="py-3">
                      <div>{r.fecha}</div>
                      <small className="text-muted">{r.hora}</small>
                    </td>
                    <td className="py-3">
                      <span className="badge bg-light text-dark border px-2 py-1">
                        {r.mesa || 'M1'} • {r.zona || 'Interior'}
                      </span>
                    </td>
                    <td className="py-3">
                      {r.personas} personas
                    </td>
                    <td className="py-3">
                      <span className={`badge px-3 py-2 rounded-pill ${
                        r.estado === 'Confirmada' ? 'bg-success-subtle text-success border border-success-subtle' :
                        r.estado === 'Pendiente' ? 'bg-warning-subtle text-warning-emphasis border border-warning-subtle' :
                        'bg-danger-subtle text-danger border border-danger-subtle'
                      }`}>
                        ● {r.estado}
                      </span>
                    </td>
                    <td className="py-3 text-end px-4">
                      <div className="d-flex gap-2 justify-content-end">
                        <button
                          type="button"
                          onClick={() => abrirEdicion(r)}
                          className="btn btn-sm btn-outline-primary rounded-pill px-3"
                        >
                          Editar
                        </button>
                        <button
                          type="button"
                          onClick={() => eliminarReserva(r.idReserva)}
                          className="btn btn-sm btn-outline-danger rounded-pill px-2"
                        >
                          Eliminar
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" className="text-center py-5 text-muted">
                    No hay reservas registradas por el momento. Empieza en 0.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal de edición */}
      {mostrarModal && reservaEditando && (
        <div 
          className="position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center p-3" 
          style={{ backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 1050 }}
        >
          <div className="card border-0 shadow-lg rounded-4 p-4 bg-white" style={{ maxWidth: '520px', width: '100%' }}>
            
            <div className="d-flex justify-content-between align-items-center border-bottom pb-3 mb-3">
              <div>
                <h5 className="fw-bold mb-0">Editar Reserva</h5>
                <small className="text-muted">Código: {reservaEditando.idReserva}</small>
              </div>
              <button 
                type="button" 
                onClick={() => setMostrarModal(false)}
                className="btn-close shadow-none"
              ></button>
            </div>

            <form onSubmit={guardarCambios}>
              <div className="mb-3">
                <label className="form-label small fw-bold text-muted">CLIENTE</label>
                <input 
                  type="text" 
                  className="form-control" 
                  value={reservaEditando.nombre}
                  onChange={(e) => setReservaEditando({ ...reservaEditando, nombre: e.target.value })}
                  required
                />
              </div>

              <div className="row g-3 mb-3">
                <div className="col-md-6">
                  <label className="form-label small fw-bold text-muted">TELÉFONO</label>
                  <input 
                    type="text" 
                    className="form-control" 
                    value={reservaEditando.telefono}
                    onChange={(e) => setReservaEditando({ ...reservaEditando, telefono: e.target.value })}
                    required
                  />
                </div>
                <div className="col-md-6">
                  <label className="form-label small fw-bold text-muted">COMENSALES</label>
                  <input 
                    type="number" 
                    className="form-control" 
                    min="1"
                    max="12"
                    value={reservaEditando.personas}
                    onChange={(e) => setReservaEditando({ ...reservaEditando, personas: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div className="row g-3 mb-3">
                <div className="col-md-6">
                  <label className="form-label small fw-bold text-muted">FECHA</label>
                  <input 
                    type="text" 
                    className="form-control" 
                    value={reservaEditando.fecha}
                    onChange={(e) => setReservaEditando({ ...reservaEditando, fecha: e.target.value })}
                    required
                  />
                </div>
                <div className="col-md-6">
                  <label className="form-label small fw-bold text-muted">HORA</label>
                  <input 
                    type="text" 
                    className="form-control" 
                    value={reservaEditando.hora}
                    onChange={(e) => setReservaEditando({ ...reservaEditando, hora: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div className="row g-3 mb-4">
                <div className="col-md-6">
                  <label className="form-label small fw-bold text-muted">MESA ASIGNADA</label>
                  <select 
                    className="form-select"
                    value={reservaEditando.mesa}
                    onChange={(e) => setReservaEditando({ ...reservaEditando, mesa: e.target.value })}
                  >
                    {['M1', 'M2', 'M3', 'M4', 'M5', 'M6', 'M7', 'M8', 'M9', 'M10 Especial'].map((m) => (
                      <option key={m} value={m}>{m}</option>
                    ))}
                  </select>
                </div>
                <div className="col-md-6">
                  <label className="form-label small fw-bold text-muted">ESTADO</label>
                  <select 
                    className="form-select"
                    value={reservaEditando.estado}
                    onChange={(e) => setReservaEditando({ ...reservaEditando, estado: e.target.value })}
                  >
                    <option value="Confirmada">Confirmada</option>
                    <option value="Pendiente">Pendiente</option>
                    <option value="Cancelada">Cancelada</option>
                  </select>
                </div>
              </div>

              <div className="d-flex gap-2">
                <button 
                  type="button" 
                  onClick={() => setMostrarModal(false)}
                  className="btn btn-light w-50 py-2 rounded-pill"
                >
                  Cancelar
                </button>
                <button 
                  type="submit" 
                  className="btn text-white w-50 py-2 rounded-pill fw-bold"
                  style={{ backgroundColor: '#bd5d38' }}
                >
                  Guardar Cambios
                </button>
              </div>
            </form>

          </div>
        </div>
      )}

    </div>
  );
}
