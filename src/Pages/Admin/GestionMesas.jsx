import React, { useState, useEffect } from 'react';
import { getConfigHorarios, getMesas, guardarMesas, obtenerHorarios } from '../../utils/reservas';

const horaAMinutos = (horaStr) => {
  if (!horaStr) return 0;
  const [h, m] = horaStr.split(':').map(Number);
  return h * 60 + m;
};

// Dos turnos chocan si están a menos de 60 minutos
const turnosColisionan = (horaReserva, horaConsulta) => {
  const minReserva = horaAMinutos(horaReserva);
  const minConsulta = horaAMinutos(horaConsulta);
  return Math.abs(minReserva - minConsulta) < 60;
};

// Próximos 14 días
const obtenerProximos14Dias = () => {
  const lista = [];
  const nombresDias = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];
  const nombresMeses = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Set', 'Oct', 'Nov', 'Dic'];

  for (let i = 0; i < 14; i++) {
    const f = new Date();
    f.setDate(f.getDate() + i);
    lista.push(`${nombresDias[f.getDay()]} ${f.getDate()} ${nombresMeses[f.getMonth()]}`);
  }
  return lista;
};

export default function GestionMesas() {
  const listaFechas = obtenerProximos14Dias();

  const [fechaSeleccionada, setFechaSeleccionada] = useState(listaFechas[0]);
  const [turnoSeleccionado, setTurnoSeleccionado] = useState(
    () => obtenerHorarios(getConfigHorarios()).todos[0] || '12:00'
  );
  const [historialReservas, setHistorialReservas] = useState([]);
  const [bloqueosMantenimiento, setBloqueosMantenimiento] = useState([]);
  const [mensajeAlerta, setMensajeAlerta] = useState('');

  // La lista de mesas ahora vive en localStorage.
  const [mesas, setMesas] = useState(() => getMesas());
  const [turnos] = useState(() => obtenerHorarios(getConfigHorarios()).todos);

  const [mostrarForm, setMostrarForm] = useState(false);
  const [nuevaMesa, setNuevaMesa] = useState({ nombre: '', capacidad: '4', zona: 'Interior' });

  useEffect(() => {
    cargarDatos();
  }, []);

  const cargarDatos = () => {
    const reservasRaw = localStorage.getItem('historialReservas');
    const reservas = reservasRaw ? JSON.parse(reservasRaw) : [];
    setHistorialReservas(reservas);

    const configRaw = localStorage.getItem('configMesas');
    const config = configRaw ? JSON.parse(configRaw) : [];
    setBloqueosMantenimiento(config);

    setMesas(getMesas());
  };

  // Agrega una mesa nueva.
  const agregarMesa = (e) => {
    e.preventDefault();

    const capacidad = Number(nuevaMesa.capacidad);
    if (!capacidad || capacidad < 1) {
      alert('La capacidad debe ser mayor a cero.');
      return;
    }

    let nombre = nuevaMesa.nombre.trim();

    // Si no ponen nombre, uso el número más alto para que no se repita.
    if (!nombre) {
      const numeros = mesas.map((m) => Number(String(m.nombre).replace(/\D/g, '')) || 0);
      nombre = 'M' + (Math.max(0, ...numeros) + 1);
    }

    if (mesas.some((m) => m.nombre.toLowerCase() === nombre.toLowerCase())) {
      alert('Ya existe una mesa con ese nombre.');
      return;
    }

    const actualizadas = [
      ...mesas,
      { id: Date.now(), nombre, capacidad, tipo: 'cuadrada', zona: nuevaMesa.zona },
    ];

    guardarMesas(actualizadas);
    setMesas(actualizadas);
    setNuevaMesa({ nombre: '', capacidad: '4', zona: 'Interior' });
    setMostrarForm(false);
    setMensajeAlerta(`Mesa ${nombre} agregada.`);
    setTimeout(() => setMensajeAlerta(''), 3000);
  };

  // Elimina la mesa de la lista.
  const eliminarMesa = (id, nombre) => {
    if (!window.confirm(`¿Seguro que quieres eliminar la mesa ${nombre}?`)) return;

    const actualizadas = mesas.filter((m) => m.id !== id);
    guardarMesas(actualizadas);
    setMesas(actualizadas);

    // Si estaba bloqueada, también saco ese bloqueo.
    const bloqueos = bloqueosMantenimiento.filter((b) => b.nombre !== nombre);
    setBloqueosMantenimiento(bloqueos);
    localStorage.setItem('configMesas', JSON.stringify(bloqueos));

    setMensajeAlerta(`Mesa ${nombre} eliminada.`);
    setTimeout(() => setMensajeAlerta(''), 3000);
  };

  // Cancela y libera la mesa
  const cancelarReserva = (idReserva, mesaNombre) => {
    const confirmar = window.confirm(`¿Confirmas la cancelación de la reserva ${idReserva}? La mesa ${mesaNombre} quedará disponible.`);
    if (!confirmar) return;

    const actualizadas = historialReservas.map((r) => {
      if (r.idReserva === idReserva) {
        return { ...r, estado: 'Cancelada' };
      }
      return r;
    });

    setHistorialReservas(actualizadas);
    localStorage.setItem('historialReservas', JSON.stringify(actualizadas));

    setMensajeAlerta(`Reserva ${idReserva} cancelada. Mesa ${mesaNombre} liberada.`);
    setTimeout(() => setMensajeAlerta(''), 3000);
  };

  // Bloqueo por mantenimiento
  const alternarMantenimiento = (nombreMesa) => {
    const existe = bloqueosMantenimiento.find((m) => m.nombre === nombreMesa);
    let nuevoConfig = [];

    if (existe) {
      nuevoConfig = bloqueosMantenimiento.map((m) => {
        if (m.nombre === nombreMesa) {
          return { ...m, estado: m.estado === 'ocupada' ? 'disponible' : 'ocupada' };
        }
        return m;
      });
    } else {
      nuevoConfig = [...bloqueosMantenimiento, { nombre: nombreMesa, estado: 'ocupada' }];
    }

    setBloqueosMantenimiento(nuevoConfig);
    localStorage.setItem('configMesas', JSON.stringify(nuevoConfig));
  };

  // Estado de las mesas en el turno elegido
  const mesasEstadoTurno = mesas.map((mesa) => {
    const mantenimiento = bloqueosMantenimiento.find(
      (m) => m.nombre === mesa.nombre && m.estado === 'ocupada'
    );

    // Reserva activa en ese turno
    const reservaEnTurno = historialReservas.find((r) => {
      if (r.estado === 'Cancelada') return false;
      if (r.mesa !== mesa.nombre) return false;
      if (r.fecha !== fechaSeleccionada) return false;
      return turnosColisionan(r.hora, turnoSeleccionado);
    });

    const estaOcupada = Boolean(mantenimiento || reservaEnTurno);

    return {
      ...mesa,
      estado: estaOcupada ? 'ocupada' : 'disponible',
      reserva: reservaEnTurno || null,
      porMantenimiento: Boolean(mantenimiento)
    };
  });

  const ocupadasEnTurno = mesasEstadoTurno.filter((m) => m.estado === 'ocupada').length;
  const libresEnTurno = mesasEstadoTurno.length - ocupadasEnTurno;

  // Reservas activas
  const reservasActivas = historialReservas.filter((r) => r.estado !== 'Cancelada');

  return (
    <div className="card border-0 shadow-sm rounded-4 p-4 bg-white mb-4">

      {/* Encabezado */}
      <div className="border-bottom pb-3 mb-4">
        <h4 className="fw-bold mb-1 text-dark">
          Control de Mesas y Ocupación por Turno
        </h4>
        <p className="text-muted small mb-0">
          Consulta la disponibilidad en tiempo real según la fecha y hora seleccionada. El bloqueo se aplica durante el periodo de consumo (60 minutos) y la mesa queda libre para los turnos posteriores.
        </p>
      </div>

      {mensajeAlerta && (
        <div className="alert alert-success border-0 rounded-3 py-2 small mb-4">
          {mensajeAlerta}
        </div>
      )}

      {/* Fecha y turno */}
      <div className="row g-3 bg-light p-3 rounded-4 mb-4 align-items-end">
        <div className="col-md-5">
          <label className="form-label small fw-bold text-muted text-uppercase mb-1">
            Fecha de consulta
          </label>
          <select 
            className="form-select bg-white border"
            value={fechaSeleccionada}
            onChange={(e) => setFechaSeleccionada(e.target.value)}
          >
            {listaFechas.map((f) => (
              <option key={f} value={f}>{f}</option>
            ))}
          </select>
        </div>

        <div className="col-md-5">
          <label className="form-label small fw-bold text-muted text-uppercase mb-1">
            Turno / Hora
          </label>
          <select 
            className="form-select bg-white border"
            value={turnoSeleccionado}
            onChange={(e) => setTurnoSeleccionado(e.target.value)}
          >
            {turnos.map((t) => (
              <option key={t} value={t}>{t}</option>
            ))}
          </select>
        </div>

        <div className="col-md-2 text-md-end">
          <button
            type="button"
            onClick={cargarDatos}
            className="btn btn-outline-dark w-100 rounded-pill fw-bold"
          >
            Actualizar
          </button>
        </div>
      </div>

      {/* Totales del turno */}
      <div className="d-flex gap-4 mb-4 pb-2 border-bottom flex-wrap">
        <div>
          <span className="small text-muted d-block">Turno consultado</span>
          <span className="fs-6 fw-bold text-dark">{fechaSeleccionada} a las {turnoSeleccionado}</span>
        </div>
        <div className="border-start ps-4">
          <span className="small text-muted d-block">Mesas Libres</span>
          <span className="fs-6 fw-bold text-success">{libresEnTurno} disponibles</span>
        </div>
        <div className="border-start ps-4">
          <span className="small text-muted d-block">Mesas Ocupadas</span>
          <span className="fs-6 fw-bold text-danger">{ocupadasEnTurno} ocupadas</span>
        </div>
      </div>

      {/* Agregar / quitar mesas */}
      <div className="d-flex justify-content-between align-items-center mb-3 flex-wrap gap-2">
        <h6 className="fw-bold text-dark mb-0">Administrar mesas ({mesas.length})</h6>
        <button
          type="button"
          onClick={() => setMostrarForm(!mostrarForm)}
          className="btn btn-outline-dark btn-sm rounded-pill px-3 fw-bold"
        >
          {mostrarForm ? 'Cancelar' : '+ Agregar mesa'}
        </button>
      </div>

      {mostrarForm && (
        <form onSubmit={agregarMesa} className="row g-2 bg-light p-3 rounded-4 mb-4 align-items-end">
          <div className="col-md-3">
            <label className="small fw-bold text-muted">Nombre (opcional)</label>
            <input
              type="text"
              className="form-control"
              value={nuevaMesa.nombre}
              onChange={(e) => setNuevaMesa({ ...nuevaMesa, nombre: e.target.value })}
              placeholder="Ej. M11"
            />
          </div>
          <div className="col-md-3">
            <label className="small fw-bold text-muted">Capacidad</label>
            <input
              type="number"
              min="1"
              max="20"
              className="form-control"
              value={nuevaMesa.capacidad}
              onChange={(e) => setNuevaMesa({ ...nuevaMesa, capacidad: e.target.value })}
            />
          </div>
          <div className="col-md-3">
            <label className="small fw-bold text-muted">Zona</label>
            <select
              className="form-select"
              value={nuevaMesa.zona}
              onChange={(e) => setNuevaMesa({ ...nuevaMesa, zona: e.target.value })}
            >
              <option value="Interior">Interior</option>
              <option value="Terraza">Terraza</option>
              <option value="VIP">VIP</option>
              <option value="Salón Imperial">Salón Imperial</option>
            </select>
          </div>
          <div className="col-md-3">
            <button
              type="submit"
              className="btn text-white w-100 fw-bold rounded-pill"
              style={{ backgroundColor: '#bd5d38' }}
            >
              Guardar mesa
            </button>
          </div>
        </form>
      )}

      {/* Mesas del turno */}
      <h6 className="fw-bold text-dark mb-3">Estado de mesas en este horario:</h6>
      <div className="row g-3 mb-5">
        {mesasEstadoTurno.map((mesa) => {
          const estaOcupada = mesa.estado === 'ocupada';

          return (
            <div className="col-md-6 col-lg-4" key={mesa.id}>
              <div 
                className={`card border rounded-4 p-3 h-100 shadow-sm ${
                  estaOcupada ? 'border-danger bg-light' : 'border-success bg-white'
                }`}
              >
                <div className="d-flex justify-content-between align-items-center mb-2">
                  <div>
                    <span className="fw-bold fs-5" style={{ color: '#bd5d38' }}>{mesa.nombre}</span>
                    <span className="small text-muted ms-2">({mesa.zona})</span>
                  </div>
                  <span className={`badge rounded-pill px-3 py-2 fw-semibold ${
                    estaOcupada ? 'bg-danger text-white' : 'bg-success text-white'
                  }`}>
                    {mesa.porMantenimiento ? 'Mantenimiento' : (estaOcupada ? 'Ocupada' : 'Disponible')}
                  </span>
                </div>

                <div className="small text-muted mb-2">
                  Capacidad: Hasta {mesa.capacidad} personas
                </div>

                {mesa.reserva ? (
                  <div className="bg-white border rounded-3 p-2 mb-2 small text-dark">
                    <div><strong>Reserva:</strong> {mesa.reserva.idReserva}</div>
                    <div><strong>Cliente:</strong> {mesa.reserva.nombre} ({mesa.reserva.personas} pers.)</div>
                    <div><strong>Horario reservado:</strong> {mesa.reserva.hora}</div>
                    <button
                      type="button"
                      onClick={() => cancelarReserva(mesa.reserva.idReserva, mesa.nombre)}
                      className="btn btn-sm btn-outline-danger w-100 rounded-pill mt-2 py-1"
                    >
                      Cancelar reserva
                    </button>
                  </div>
                ) : (
                  <div className="py-2 mb-2">
                    <small className="text-muted">
                      {mesa.porMantenimiento ? 'Mesa inhabilitada por administración.' : 'Mesa libre en este turno.'}
                    </small>
                  </div>
                )}

                <div className="mt-auto pt-2 border-top d-flex justify-content-between align-items-center">
                  <button
                    type="button"
                    onClick={() => alternarMantenimiento(mesa.nombre)}
                    className="btn btn-link btn-sm text-muted text-decoration-none p-0"
                    style={{ fontSize: '11px' }}
                  >
                    {mesa.porMantenimiento ? 'Reactivar mesa' : 'Bloquear por mantenimiento'}
                  </button>
                  <button
                    type="button"
                    onClick={() => eliminarMesa(mesa.id, mesa.nombre)}
                    className="btn btn-link btn-sm text-danger text-decoration-none p-0"
                    style={{ fontSize: '11px' }}
                  >
                    Eliminar
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Reservas activas */}
      <div className="border-top pt-4">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h5 className="fw-bold text-dark mb-0">Todas las Reservas Activas Registradas</h5>
          <span className="badge bg-secondary rounded-pill px-3 py-2">
            {reservasActivas.length} reservas activas
          </span>
        </div>

        {reservasActivas.length > 0 ? (
          <div className="table-responsive">
            <table className="table table-hover align-middle mb-0 border">
              <thead className="table-light">
                <tr>
                  <th className="py-2 px-3">Código</th>
                  <th className="py-2">Cliente</th>
                  <th className="py-2">Fecha y Turno</th>
                  <th className="py-2">Mesa Asignada</th>
                  <th className="py-2">Comensales</th>
                  <th className="py-2 text-end px-3">Acción</th>
                </tr>
              </thead>
              <tbody>
                {reservasActivas.map((res) => (
                  <tr key={res.idReserva}>
                    <td className="py-2 px-3 fw-bold" style={{ color: '#bd5d38' }}>{res.idReserva}</td>
                    <td className="py-2">
                      <div className="fw-semibold">{res.nombre}</div>
                      <small className="text-muted">{res.telefono}</small>
                    </td>
                    <td className="py-2">
                      <div>{res.fecha}</div>
                      <small className="text-muted">{res.hora}</small>
                    </td>
                    <td className="py-2">
                      <span className="badge bg-light text-dark border">{res.mesa} • {res.zona}</span>
                    </td>
                    <td className="py-2">{res.personas} personas</td>
                    <td className="py-2 text-end px-3">
                      <button
                        type="button"
                        onClick={() => cancelarReserva(res.idReserva, res.mesa)}
                        className="btn btn-sm btn-outline-danger rounded-pill px-3"
                      >
                        Cancelar
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-4 bg-light rounded-4">
            <p className="text-muted mb-0 small">No hay reservas activas en el sistema actualmente.</p>
          </div>
        )}
      </div>

    </div>
  );
}
