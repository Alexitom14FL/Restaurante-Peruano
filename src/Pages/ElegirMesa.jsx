import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ADELANTO,
  getConfigHorarios,
  getMesas,
  guardarBorradorPago,
  horaAMinutos,
  obtenerHorarios,
} from '../utils/reservas';

// Dos turnos chocan si están a menos de 60 minutos.
const turnosColisionan = (horaReserva, horaConsulta) => {
  return Math.abs(horaAMinutos(horaReserva) - horaAMinutos(horaConsulta)) < 60;
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

export default function ElegirMesa() {
  const navigate = useNavigate();

  // Las mesas y el horario salen del panel de administración.
  const [mesasBase] = useState(() => getMesas());
  const [config] = useState(() => getConfigHorarios());

  const [mesas, setMesas] = useState([]);
  const [datosReserva, setDatosReserva] = useState(null);
  const [mesaSeleccionada, setMesaSeleccionada] = useState(null);
  const [zonaFiltro, setZonaFiltro] = useState('Todas');
  const [sugerenciasAlternativas, setSugerenciasAlternativas] = useState([]);

  useEffect(() => {
    const guardado = localStorage.getItem('reservaActual');
    if (!guardado) {
      navigate('/reservar');
      return;
    }

    const datos = JSON.parse(guardado);
    setDatosReserva(datos);
    evaluarDisponibilidad(datos);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Revisa qué mesas están libres en ese turno.
  const evaluarDisponibilidad = (datos) => {
    const historial = JSON.parse(localStorage.getItem('historialReservas') || '[]');
    const bloqueos = JSON.parse(localStorage.getItem('configMesas') || '[]');

    const mesasEvaluadas = mesasBase.map((mesa) => {
      // Bloqueo por mantenimiento desde el panel.
      const bloqueada = bloqueos.find(
        (b) => b.nombre === mesa.nombre && b.estado === 'ocupada'
      );

      // Reserva activa en la misma fecha y turno.
      const reservaEnConflicto = historial.find((r) => {
        if (r.estado === 'Cancelada') return false;
        if (r.mesa !== mesa.nombre) return false;
        if (r.fecha !== datos.fecha) return false;
        return turnosColisionan(r.hora, datos.hora);
      });

      return {
        ...mesa,
        estado: bloqueada || reservaEnConflicto ? 'ocupada' : 'disponible',
      };
    });

    setMesas(mesasEvaluadas);

    const aptas = mesasEvaluadas.filter(
      (m) => m.capacidad >= datos.personas && m.estado === 'disponible'
    );

    setMesaSeleccionada(aptas.length > 0 ? aptas[0] : null);

    if (aptas.length === 0) {
      buscarAlternativas(datos, historial, bloqueos);
    } else {
      setSugerenciasAlternativas([]);
    }
  };

  // Propone otros turnos donde sí hay mesa.
  const buscarAlternativas = (datos, historial, bloqueos) => {
    const proximasFechas = obtenerProximos14Dias();
    const turnos = obtenerHorarios(config).todos;
    const alternativas = [];

    for (let f = 0; f < proximasFechas.length && alternativas.length < 4; f++) {
      for (let h = 0; h < turnos.length && alternativas.length < 4; h++) {
        const fecha = proximasFechas[f];
        const hora = turnos[h];

        if (fecha === datos.fecha && hora === datos.hora) continue;

        const hayMesaLibre = mesasBase.some((mesa) => {
          if (mesa.capacidad < datos.personas) return false;

          const bloqueada = bloqueos.some(
            (b) => b.nombre === mesa.nombre && b.estado === 'ocupada'
          );
          if (bloqueada) return false;

          const ocupada = historial.some(
            (r) =>
              r.mesa === mesa.nombre &&
              r.fecha === fecha &&
              r.estado !== 'Cancelada' &&
              turnosColisionan(r.hora, hora)
          );

          return !ocupada;
        });

        if (hayMesaLibre) {
          alternativas.push({ fecha, hora });
        }
      }
    }

    setSugerenciasAlternativas(alternativas);
  };

  // Aplica el turno sugerido.
  const aplicarAlternativa = (alt) => {
    const nuevosDatos = { ...datosReserva, fecha: alt.fecha, hora: alt.hora };
    setDatosReserva(nuevosDatos);
    localStorage.setItem('reservaActual', JSON.stringify(nuevosDatos));
    evaluarDisponibilidad(nuevosDatos);
  };

  // Elige una mesa del plano.
  const seleccionarMesa = (mesa) => {
    if (mesa.estado === 'ocupada') {
      alert(`La mesa ${mesa.nombre} está ocupada para el turno de las ${datosReserva?.hora}.`);
      return;
    }

    if (datosReserva && datosReserva.personas > mesa.capacidad) {
      alert(
        `La mesa ${mesa.nombre} solo tiene capacidad para ${mesa.capacidad} personas. Tu reserva es de ${datosReserva.personas} personas.`
      );
      return;
    }

    setMesaSeleccionada(mesa);
  };

  // Guarda lo elegido y se va a la pantalla de cobro.
  const irAPago = () => {
    if (!mesaSeleccionada) {
      alert('Por favor selecciona una mesa disponible.');
      return;
    }

    if (mesaSeleccionada.estado === 'ocupada') {
      alert('Esta mesa ya no está disponible para ese horario.');
      return;
    }

    if (mesaSeleccionada.capacidad < datosReserva.personas) {
      alert('La capacidad de la mesa no alcanza para tu grupo.');
      return;
    }

    guardarBorradorPago({
      ...datosReserva,
      mesa: mesaSeleccionada.nombre,
      zona: mesaSeleccionada.zona,
      capacidadMesa: mesaSeleccionada.capacidad,
    });

    navigate('/pago');
  };

  const zonas = ['Todas', ...new Set(mesasBase.map((m) => m.zona))];
  const sinMesasAptas =
    mesas.length > 0 &&
    mesas.filter((m) => m.capacidad >= (datosReserva?.personas || 1)).every((m) => m.estado === 'ocupada');

  return (
    <div className="container py-4 pb-5">
      {/* Cabecera */}
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center gap-3 mb-4">
        <div>
          <h1 className="fw-bold display-6 mb-1 text-dark">Elige tu mesa</h1>
          <p className="text-muted mb-0">
            Disponibilidad para el turno de {datosReserva?.fecha} a las {datosReserva?.hora}
          </p>
        </div>

        {datosReserva && (
          <div className="badge bg-white border text-dark p-3 rounded-pill shadow-sm">
            <span className="fw-semibold">
              Turno: {datosReserva.fecha} • {datosReserva.hora} • {datosReserva.personas} personas
            </span>
          </div>
        )}
      </div>

      {/* Otros turnos disponibles */}
      {sinMesasAptas && (
        <div className="card border rounded-4 p-4 mb-4 bg-white shadow-sm">
          <h6 className="fw-bold text-dark mb-1">
            Turno completo para {datosReserva?.personas} personas
          </h6>
          <p className="text-muted small mb-3">
            Para las {datosReserva?.hora} las mesas que alcanzan para tu grupo están ocupadas. Te
            ofrecemos estos turnos cercanos:
          </p>

          <div className="d-flex flex-wrap gap-2">
            {sugerenciasAlternativas.length > 0 ? (
              sugerenciasAlternativas.map((alt, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => aplicarAlternativa(alt)}
                  className="btn btn-outline-dark btn-sm rounded-pill px-3 py-2 fw-semibold"
                >
                  {alt.fecha} — {alt.hora}
                </button>
              ))
            ) : (
              <span className="text-muted small">Revisando disponibilidad...</span>
            )}
          </div>
        </div>
      )}

      {/* Zonas */}
      <div className="d-flex gap-2 mb-4 flex-wrap">
        {zonas.map((zona) => (
          <button
            key={zona}
            type="button"
            onClick={() => setZonaFiltro(zona)}
            className={`btn rounded-pill px-4 btn-sm fw-bold ${
              zonaFiltro === zona ? 'text-white' : 'btn-light border text-dark'
            }`}
            style={{ backgroundColor: zonaFiltro === zona ? '#bd5d38' : undefined }}
          >
            {zona}
          </button>
        ))}
      </div>

      <div className="row g-4 align-items-start">
        {/* Plano */}
        <div className="col-lg-8">
          <div className="card border rounded-4 p-4 p-md-5 bg-white text-center shadow-sm">
            <div className="small fw-bold text-muted mb-4 text-uppercase">
              Plano de mesas — {datosReserva?.hora}
            </div>

            <div className="row g-4 justify-content-center align-items-center my-3">
              {mesas.map((mesa) => {
                if (zonaFiltro !== 'Todas' && mesa.zona !== zonaFiltro) {
                  return null;
                }

                const esSeleccionada = mesaSeleccionada && mesaSeleccionada.nombre === mesa.nombre;
                const esOcupada = mesa.estado === 'ocupada';
                const esEspecial = mesa.tipo === 'especial';
                const capacidadInsuficiente = datosReserva ? mesa.capacidad < datosReserva.personas : false;
                const bloqueada = esOcupada || capacidadInsuficiente;

                let colorFondo = '#fff';
                let colorTexto = '#2b2b2b';
                let borde = '2px solid #e0e0e0';

                if (esSeleccionada) {
                  colorFondo = '#bd5d38';
                  colorTexto = '#fff';
                  borde = '2px solid #bd5d38';
                } else if (esOcupada) {
                  colorFondo = '#f8f9fa';
                  colorTexto = '#888';
                  borde = '2px dashed #dc3545';
                } else if (capacidadInsuficiente) {
                  colorFondo = '#fafafa';
                  colorTexto = '#bbb';
                  borde = '1px solid #e5e5e5';
                } else if (esEspecial) {
                  colorFondo = '#fffdf9';
                  borde = '2px solid #d4a373';
                }

                return (
                  <div
                    className={`${esEspecial ? 'col-12 col-md-6' : 'col-4 col-md-3'} d-flex justify-content-center`}
                    key={mesa.id}
                  >
                    <button
                      type="button"
                      onClick={() => seleccionarMesa(mesa)}
                      disabled={bloqueada}
                      className="btn shadow-sm d-flex flex-column align-items-center justify-content-center transition p-2 position-relative"
                      style={{
                        width: esEspecial ? '220px' : mesa.tipo === 'rectangular' ? '120px' : '84px',
                        height: '84px',
                        backgroundColor: colorFondo,
                        color: colorTexto,
                        border: borde,
                        borderRadius: mesa.tipo === 'redonda' ? '50%' : '14px',
                        cursor: bloqueada ? 'not-allowed' : 'pointer',
                        opacity: bloqueada ? (esOcupada ? 0.75 : 0.45) : 1,
                      }}
                      title={
                        esOcupada
                          ? `Ocupada en el turno de las ${datosReserva?.hora}`
                          : capacidadInsuficiente
                          ? `Capacidad para ${mesa.capacidad} personas`
                          : `Disponible para ${mesa.capacidad} personas`
                      }
                    >
                      <span className="fw-bold fs-6">{mesa.nombre}</span>
                      <small style={{ fontSize: '11px', opacity: 0.9 }}>
                        {esOcupada
                          ? 'Ocupada'
                          : capacidadInsuficiente
                          ? `Cap. ${mesa.capacidad}`
                          : `${mesa.capacidad} pers`}
                      </small>
                    </button>
                  </div>
                );
              })}
            </div>

            {mesas.length === 0 && (
              <p className="text-muted mb-0">No hay mesas registradas. Agrégalas desde el panel.</p>
            )}

            {/* Leyenda */}
            <div className="d-flex justify-content-center gap-4 mt-5 pt-3 border-top flex-wrap">
              <div className="d-flex align-items-center gap-2">
                <div className="border rounded-circle" style={{ width: '14px', height: '14px', backgroundColor: '#fff', borderColor: '#ccc' }} />
                <small className="text-muted">Disponible</small>
              </div>
              <div className="d-flex align-items-center gap-2">
                <div className="rounded-circle" style={{ width: '14px', height: '14px', backgroundColor: '#bd5d38' }} />
                <small className="text-muted">Seleccionada</small>
              </div>
              <div className="d-flex align-items-center gap-2">
                <div className="border rounded-circle" style={{ width: '14px', height: '14px', backgroundColor: '#f8f9fa', borderColor: '#dc3545' }} />
                <small className="text-muted">Ocupada en este turno</small>
              </div>
              <div className="d-flex align-items-center gap-2">
                <div className="border rounded-circle" style={{ width: '14px', height: '14px', backgroundColor: '#fafafa', opacity: 0.5 }} />
                <small className="text-muted">Capacidad insuficiente</small>
              </div>
            </div>
          </div>
        </div>

        {/* Detalle */}
        <div className="col-lg-4">
          <div className="card border rounded-4 p-4 bg-white shadow-sm">
            <h5 className="fw-bold mb-3 text-dark">Detalle de la mesa</h5>

            {mesaSeleccionada ? (
              <div>
                <div className="d-flex justify-content-between py-2 border-bottom">
                  <span className="text-muted">Mesa asignada</span>
                  <span className="fw-bold" style={{ color: '#bd5d38' }}>{mesaSeleccionada.nombre}</span>
                </div>
                <div className="d-flex justify-content-between py-2 border-bottom">
                  <span className="text-muted">Capacidad</span>
                  <span className="fw-semibold">Hasta {mesaSeleccionada.capacidad} personas</span>
                </div>
                <div className="d-flex justify-content-between py-2 border-bottom">
                  <span className="text-muted">Zona</span>
                  <span className="fw-semibold">{mesaSeleccionada.zona}</span>
                </div>
                <div className="d-flex justify-content-between py-2 border-bottom">
                  <span className="text-muted">Disponibilidad</span>
                  <span className="fw-bold text-success">Libre a las {datosReserva?.hora}</span>
                </div>

                {datosReserva && (
                  <div className="bg-light p-3 rounded-3 mt-4">
                    <span className="small fw-bold text-muted d-block mb-1">DATOS DE LA RESERVA</span>
                    <p className="small mb-1"><strong>Fecha:</strong> {datosReserva.fecha}</p>
                    <p className="small mb-1"><strong>Turno:</strong> {datosReserva.hora}</p>
                    <p className="small mb-1"><strong>Comensales:</strong> {datosReserva.personas} personas</p>
                    <p className="small mb-0"><strong>Titular:</strong> {datosReserva.nombre} ({datosReserva.telefono})</p>
                  </div>
                )}

                <div className="alert alert-warning small mt-3 mb-0 py-2">
                  Se cobra un adelanto de S/ {ADELANTO}.00 con tarjeta para confirmar.
                </div>

                <button
                  type="button"
                  onClick={irAPago}
                  className="btn text-white w-100 py-3 fw-bold rounded-pill shadow-sm mt-3"
                  style={{ backgroundColor: '#bd5d38' }}
                >
                  Continuar al pago
                </button>
              </div>
            ) : (
              <div className="text-center py-4">
                <h6 className="fw-bold text-dark">Selecciona una mesa disponible</h6>
                <p className="text-muted small mb-0">
                  Haz clic en una mesa libre del plano para continuar.
                </p>
              </div>
            )}

            <button
              type="button"
              onClick={() => navigate('/reservar')}
              className="btn btn-link text-muted text-decoration-none w-100 mt-2 small"
            >
              Modificar fecha u horario
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
