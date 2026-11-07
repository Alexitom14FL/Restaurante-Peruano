import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getConfigHorarios, getMesas, obtenerHorarios } from '../utils/reservas';

// Próximos 14 días
const obtenerProximos14Dias = () => {
  const listaDias = [];
  const nombresDias = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];
  const nombresMeses = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Set', 'Oct', 'Nov', 'Dic'];

  for (let i = 0; i < 14; i++) {
    const fecha = new Date();
    fecha.setDate(fecha.getDate() + i);

    listaDias.push({
      diaSemana: nombresDias[fecha.getDay()],
      numero: fecha.getDate(),
      mes: nombresMeses[fecha.getMonth()],
      textoCompleto: `${nombresDias[fecha.getDay()]} ${fecha.getDate()} ${nombresMeses[fecha.getMonth()]}`
    });
  }

  return listaDias;
};

export default function Reservar() {
  const navigate = useNavigate();

  const listaFechas = obtenerProximos14Dias();

  // El horario sale de la configuración del admin.
  const [config] = useState(() => getConfigHorarios());
  const { almuerzo: horariosAlmuerzo, cena: horariosCena } = obtenerHorarios(config);
  const [totalMesas] = useState(() => getMesas().length);

  // Datos del formulario
  const [fechaSeleccionada, setFechaSeleccionada] = useState(listaFechas[0]);
  const [personas, setPersonas] = useState(4);
  const [hora, setHora] = useState(() => horariosCena[0] || horariosAlmuerzo[0] || '12:00');
  const [nombre, setNombre] = useState('');
  const [telefono, setTelefono] = useState('');
  const [notas, setNotas] = useState('');

  // Comensales
  const restarPersonas = () => {
    if (personas > 1) {
      setPersonas(personas - 1);
    }
  };

  const sumarPersonas = () => {
    if (personas < 12) {
      setPersonas(personas + 1);
    }
  };

  // Pasa al plano de mesas
  const irAElegirMesa = () => {
    if (!nombre.trim() || !telefono.trim()) {
      alert('Por favor ingresa tu nombre y teléfono para continuar.');
      return;
    }

    const datosReserva = {
      fecha: fechaSeleccionada.textoCompleto,
      personas: personas,
      hora: hora,
      nombre: nombre,
      telefono: telefono,
      notas: notas
    };

    localStorage.setItem('reservaActual', JSON.stringify(datosReserva));
    navigate('/elegir-mesa');
  };

  return (
    <div className="container py-5">
      
      {/* Encabezado */}
      <div className="mb-4">
        <span 
          className="badge px-3 py-2 mb-2 fw-bold text-uppercase" 
          style={{ backgroundColor: '#f5e8d8', color: '#bd5d38', fontSize: '11px', letterSpacing: '1px' }}
        >
          RESERVAS EN LÍNEA
        </span>
        <h1 className="fw-bold display-5 mb-2" style={{ color: '#2b2b2b' }}>
          Reserva tu mesa en menos de un minuto
        </h1>
        <p className="text-muted">
          Elige fecha (hasta 2 semanas adelante), número de personas y horario. Te confirmamos al instante.
        </p>
      </div>

      <div className="row g-5 align-items-start">
        
        {/* Info del local */}
        <div className="col-lg-5">
          <div className="d-flex gap-4 mb-4">
            <div>
              <h3 className="fw-bold mb-0" style={{ color: '#bd5d38' }}>{config.almuerzoInicio}</h3>
              <small className="text-muted">Apertura</small>
            </div>
            <div className="border-start ps-4">
              <h3 className="fw-bold mb-0" style={{ color: '#bd5d38' }}>{config.cenaFin}</h3>
              <small className="text-muted">Último turno</small>
            </div>
            <div className="border-start ps-4">
              <h3 className="fw-bold mb-0" style={{ color: '#bd5d38' }}>{totalMesas}</h3>
              <small className="text-muted">Mesas</small>
            </div>
          </div>

          <div className="position-relative rounded-4 overflow-hidden shadow-sm" style={{ height: '340px' }}>
            <img 
              src="https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=800&q=80" 
              alt="Ambiente del restaurante" 
              className="w-100 h-100"
              style={{ objectFit: 'cover' }}
            />
            <div className="position-absolute bottom-0 start-0 m-3 bg-white px-3 py-2 rounded-pill shadow-sm d-flex align-items-center gap-2">
              <span className="rounded-circle bg-success" style={{ width: '8px', height: '8px' }}></span>
              <span className="small fw-bold text-dark">
                Abierto hoy - {config.almuerzoInicio} a {config.cenaFin}
              </span>
            </div>
          </div>
        </div>

        {/* Formulario */}
        <div className="col-lg-7">
          <div className="card border rounded-4 shadow-sm p-4 bg-white" style={{ borderColor: '#f0f0f0' }}>
            <h3 className="fs-4 fw-bold mb-4" style={{ color: '#2b2b2b' }}>Detalles de la reserva</h3>

            {/* Fecha */}
            <div className="d-flex justify-content-between align-items-center mb-2">
              <label className="small fw-bold text-muted text-uppercase">Fecha (Próximos 14 días)</label>
              <small className="text-muted">Desliza para ver más días →</small>
            </div>
            
            <div className="d-flex gap-2 mb-4 overflow-auto pb-2" style={{ scrollBehavior: 'smooth' }}>
              {listaFechas.map((f, index) => {
                const esActivo = fechaSeleccionada.textoCompleto === f.textoCompleto;
                return (
                  <button
                    key={index}
                    type="button"
                    onClick={() => setFechaSeleccionada(f)}
                    className={`btn text-center p-3 rounded-3 flex-shrink-0 border ${
                      esActivo ? 'text-white border-0 shadow-sm' : 'bg-white text-dark border-light shadow-sm'
                    }`}
                    style={{ 
                      backgroundColor: esActivo ? '#bd5d38' : '#fff', 
                      minWidth: '72px' 
                    }}
                  >
                    <div className="small text-uppercase mb-1" style={{ fontSize: '11px', opacity: 0.9 }}>{f.diaSemana}</div>
                    <div className="fs-5 fw-bold">{f.numero}</div>
                    <div style={{ fontSize: '10px', opacity: 0.8 }}>{f.mes}</div>
                  </button>
                );
              })}
            </div>

            {/* Personas */}
            <div className="bg-light p-3 rounded-3 d-flex justify-content-between align-items-center mb-4">
              <span className="fw-bold small text-muted text-uppercase">Número de comensales</span>
              <div className="d-flex align-items-center gap-3">
                <button 
                  type="button" 
                  className="btn btn-white border rounded-circle fw-bold shadow-sm d-flex align-items-center justify-content-center" 
                  style={{ width: '36px', height: '36px', backgroundColor: '#fff' }}
                  onClick={restarPersonas}
                >
                  -
                </button>
                <span className="fw-bold fs-5 px-2">{personas} personas</span>
                <button 
                  type="button" 
                  className="btn rounded-circle fw-bold text-white d-flex align-items-center justify-content-center shadow-sm" 
                  style={{ width: '36px', height: '36px', backgroundColor: '#bd5d38' }}
                  onClick={sumarPersonas}
                >
                  +
                </button>
              </div>
            </div>

            {/* Almuerzo */}
            {horariosAlmuerzo.length > 0 && (
              <div className="mb-3">
                <label className="small fw-bold text-muted d-block mb-2">HORARIO — ALMUERZO</label>
                <div className="d-flex flex-wrap gap-2">
                  {horariosAlmuerzo.map((h) => (
                    <button
                      key={h}
                      type="button"
                      onClick={() => setHora(h)}
                      className={`btn btn-sm px-3 py-2 rounded-2 border ${
                        hora === h ? 'text-white border-0' : 'bg-white text-dark border-light shadow-sm'
                      }`}
                      style={{ backgroundColor: hora === h ? '#bd5d38' : '#fff' }}
                    >
                      {h}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Cena */}
            {horariosCena.length > 0 && (
              <div className="mb-4">
                <label className="small fw-bold text-muted d-block mb-2">HORARIO — CENA</label>
                <div className="d-flex flex-wrap gap-2">
                  {horariosCena.map((h) => (
                    <button
                      key={h}
                      type="button"
                      onClick={() => setHora(h)}
                      className={`btn btn-sm px-3 py-2 rounded-2 border ${
                        hora === h ? 'text-white border-0' : 'bg-white text-dark border-light shadow-sm'
                      }`}
                      style={{ backgroundColor: hora === h ? '#bd5d38' : '#fff' }}
                    >
                      {h}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Datos del cliente */}
            <div className="row g-3 mb-3">
              <div className="col-md-6">
                <label className="form-label small fw-bold text-muted">NOMBRE COMPLETO</label>
                <input 
                  type="text" 
                  className="form-control bg-light border-0 py-2" 
                  value={nombre}
                  onChange={(e) => setNombre(e.target.value)}
                  placeholder="Ej. Juan Pérez"
                />
              </div>
              <div className="col-md-6">
                <label className="form-label small fw-bold text-muted">TELÉFONO O CELULAR</label>
                <input 
                  type="tel" 
                  className="form-control bg-light border-0 py-2" 
                  value={telefono}
                  onChange={(e) => setTelefono(e.target.value)}
                  placeholder="+51 987 654 321"
                />
              </div>
            </div>

            <div className="mb-4">
              <label className="form-label small fw-bold text-muted">COMENTARIOS O PREFERENCIAS (OPCIONAL)</label>
              <input 
                type="text" 
                className="form-control bg-light border-0 py-2" 
                placeholder="Cumpleaños, mesa cerca a ventana, alergias..." 
                value={notas}
                onChange={(e) => setNotas(e.target.value)}
              />
            </div>

            {/* Resumen */}
            <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center pt-3 border-top gap-3">
              <div>
                <span className="small text-muted d-block">Resumen</span>
                <span className="fw-bold" style={{ color: '#2b2b2b' }}>
                  {fechaSeleccionada.textoCompleto} • {hora} • {personas} personas
                </span>
              </div>
              <button 
                type="button" 
                onClick={irAElegirMesa}
                className="btn text-white fw-bold px-4 py-2 rounded-pill shadow-sm"
                style={{ backgroundColor: '#bd5d38' }}
              >
                Elegir mesa
              </button>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
}