import React, { useEffect, useState } from 'react';
import { getConfigHorarios, getMesas, getReservas } from '../../utils/reservas';

// Mismo formato de fecha que usa la página de reservas.
const fechaDeHoy = () => {
  const dias = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];
  const meses = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Set', 'Oct', 'Nov', 'Dic'];
  const hoy = new Date();
  return `${dias[hoy.getDay()]} ${hoy.getDate()} ${meses[hoy.getMonth()]}`;
};

export default function Dashboard() {
  const [reservas, setReservas] = useState([]);
  const [mesas, setMesas] = useState([]);
  const [config, setConfig] = useState(getConfigHorarios);

  useEffect(() => {
    setReservas(getReservas());
    setMesas(getMesas());
    setConfig(getConfigHorarios());
  }, []);

  const activas = reservas.filter((r) => r.estado !== 'Cancelada');
  const confirmadas = reservas.filter((r) => r.estado === 'Confirmada');
  const comensales = activas.reduce((total, r) => total + (Number(r.personas) || 0), 0);
  const adelantos = activas.reduce((total, r) => total + (Number(r.adelanto) || 0), 0);

  const hoy = fechaDeHoy();
  const reservasHoy = activas.filter((r) => r.fecha === hoy);
  const bloqueadas = JSON.parse(localStorage.getItem('configMesas') || '[]').filter(
    (m) => m.estado === 'ocupada'
  );

  // Una mesa está libre hoy si no tiene reserva activa ni bloqueo.
  const mesasLibresHoy = mesas.filter((mesa) => {
    const bloqueada = bloqueadas.some((b) => b.nombre === mesa.nombre);
    const ocupada = reservasHoy.some((r) => r.mesa === mesa.nombre);
    return !bloqueada && !ocupada;
  }).length;

  const recientes = [...reservas].reverse().slice(0, 5);

  const tarjetas = [
    { titulo: 'Reservas totales', valor: reservas.length, nota: 'Registradas en el sistema', color: '#bd5d38' },
    { titulo: 'Confirmadas', valor: confirmadas.length, nota: 'Mesas aseguradas', color: '#198754' },
    { titulo: 'Adelantos cobrados', valor: `S/ ${adelantos}.00`, nota: 'Pagos con tarjeta', color: '#bd5d38' },
    { titulo: 'Comensales', valor: comensales, nota: 'En reservas activas', color: '#2b2b2b' },
    { titulo: 'Reservas de hoy', valor: reservasHoy.length, nota: hoy, color: '#bd5d38' },
    { titulo: 'Mesas libres hoy', valor: `${mesasLibresHoy}/${mesas.length}`, nota: 'Sin reserva ni bloqueo', color: '#198754' },
  ];

  return (
    <div>
      {/* Tarjetas de resumen */}
      <div className="row g-3 mb-4">
        {tarjetas.map((t) => (
          <div className="col-12 col-sm-6 col-xl-4" key={t.titulo}>
            <div className="card border-0 shadow-sm rounded-4 p-3 bg-white h-100">
              <span className="small text-muted fw-bold text-uppercase">{t.titulo}</span>
              <h3 className="fw-bold mb-1 mt-2" style={{ color: t.color }}>{t.valor}</h3>
              <small className="text-muted">{t.nota}</small>
            </div>
          </div>
        ))}
      </div>

      <div className="row g-4">
        {/* Últimas reservas */}
        <div className="col-lg-8">
          <div className="card border-0 shadow-sm rounded-4 p-3 bg-white h-100">
            <div className="d-flex justify-content-between align-items-center mb-3">
              <h5 className="fw-bold mb-0" style={{ color: '#2b2b2b' }}>Últimas reservas</h5>
              <span className="badge bg-light text-dark border">{reservas.length} en total</span>
            </div>

            {recientes.length > 0 ? (
              <div className="table-responsive">
                <table className="table table-hover align-middle mb-0">
                  <thead className="table-light">
                    <tr>
                      <th className="py-2">Código</th>
                      <th className="py-2">Cliente</th>
                      <th className="py-2">Fecha</th>
                      <th className="py-2">Mesa</th>
                      <th className="py-2">Estado</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recientes.map((r) => (
                      <tr key={r.idReserva}>
                        <td className="py-2 fw-bold" style={{ color: '#bd5d38' }}>{r.idReserva}</td>
                        <td className="py-2">
                          <div className="fw-semibold">{r.nombre}</div>
                          <small className="text-muted">{r.telefono}</small>
                        </td>
                        <td className="py-2">
                          <div>{r.fecha}</div>
                          <small className="text-muted">{r.hora}</small>
                        </td>
                        <td className="py-2">
                          <span className="badge bg-light text-dark border">{r.mesa}</span>
                        </td>
                        <td className="py-2">
                          <span className={`badge ${r.estado === 'Confirmada' ? 'bg-success' : 'bg-danger'}`}>
                            {r.estado}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="text-center py-4 bg-light rounded-4">
                <p className="text-muted mb-0 small">Todavía no hay reservas registradas.</p>
              </div>
            )}
          </div>
        </div>

        {/* Horario actual */}
        <div className="col-lg-4">
          <div className="card border-0 shadow-sm rounded-4 p-4 bg-white h-100">
            <h5 className="fw-bold mb-3" style={{ color: '#2b2b2b' }}>Horario de atención</h5>

            <div className="d-flex justify-content-between py-2 border-bottom">
              <span className="text-muted">Almuerzo</span>
              <span className="fw-semibold">{config.almuerzoInicio} – {config.almuerzoFin}</span>
            </div>
            <div className="d-flex justify-content-between py-2 border-bottom">
              <span className="text-muted">Cena</span>
              <span className="fw-semibold">{config.cenaInicio} – {config.cenaFin}</span>
            </div>
            <div className="d-flex justify-content-between py-2">
              <span className="text-muted">Mesas</span>
              <span className="fw-semibold">{mesas.length} registradas</span>
            </div>

            <p className="small text-muted mt-3 mb-0">
              Este horario es el que se muestra en la página principal. Se cambia en la pestaña
              "Días y Horarios".
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
