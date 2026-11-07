import React, { useState, useEffect } from 'react';
import { CONFIG_DEFAULT, guardarConfigHorarios } from '../../utils/reservas';

export default function GestionHorarios() {
  const [config, setConfig] = useState(CONFIG_DEFAULT);
  const [mensajeExito, setMensajeExito] = useState('');
  const [mensajeError, setMensajeError] = useState('');

  // Configuración guardada
  useEffect(() => {
    const guardada = localStorage.getItem('configHorarios');
    if (guardada) {
      setConfig({ ...CONFIG_DEFAULT, ...JSON.parse(guardada) });
    }
  }, []);

  // Activa o desactiva un día
  const cambiarDia = (indice) => {
    const nuevosDias = [...config.diasLaborables];
    nuevosDias[indice].activo = !nuevosDias[indice].activo;
    setConfig({ ...config, diasLaborables: nuevosDias });
  };

  // Guarda los cambios
  const guardarHorarios = (e) => {
    e.preventDefault();

    // El cierre siempre tiene que ser después de la apertura.
    if (config.almuerzoFin <= config.almuerzoInicio) {
      setMensajeError('En el almuerzo, el cierre debe ser mayor que la apertura.');
      return;
    }
    if (config.cenaFin <= config.cenaInicio) {
      setMensajeError('En la cena, el cierre debe ser mayor que la apertura.');
      return;
    }

    guardarConfigHorarios(config);
    setMensajeError('');
    setMensajeExito('¡Horarios y días de atención actualizados con éxito!');
    setTimeout(() => setMensajeExito(''), 3000);
  };

  return (
    <div className="card border-0 shadow-sm rounded-4 p-4 bg-white mb-4">
      
      {/* Encabezado */}
      <div className="border-bottom pb-3 mb-4">
        <h4 className="fw-bold mb-1" style={{ color: '#2b2b2b' }}>
          Gestión de Días Laborables y Horarios
        </h4>
        <p className="text-muted small mb-0">
          Modifica los días de trabajo del restaurante y las franjas horarias de Almuerzo y Cena
        </p>
      </div>

      {mensajeExito && (
        <div className="alert alert-success border-0 rounded-4 py-2 small mb-4">
          ✓ {mensajeExito}
        </div>
      )}

      {mensajeError && (
        <div className="alert alert-danger border-0 rounded-4 py-2 small mb-4">
          {mensajeError}
        </div>
      )}

      <form onSubmit={guardarHorarios}>
        
        {/* Días */}
        <div className="mb-4">
          <label className="form-label small fw-bold text-muted text-uppercase d-block mb-3">
            Días de Atención al Público
          </label>
          <div className="d-flex flex-wrap gap-2">
            {config.diasLaborables.map((item, index) => (
              <button
                key={item.dia}
                type="button"
                onClick={() => cambiarDia(index)}
                className={`btn btn-sm px-3 py-2 rounded-pill fw-bold border ${
                  item.activo ? 'btn-success text-white' : 'btn-light text-muted'
                }`}
              >
                {item.activo ? '✓ ' : '✕ '} {item.dia}
              </button>
            ))}
          </div>
          <small className="text-muted mt-2 d-block">
            Haz clic en un día para habilitarlo (verde) o deshabilitarlo (gris).
          </small>
        </div>

        {/* Turnos */}
        <div className="row g-4 mb-4">
          
          {/* Almuerzo */}
          <div className="col-md-6">
            <div className="border rounded-4 p-3 bg-light">
              <h6 className="fw-bold mb-3" style={{ color: '#bd5d38' }}>
                Turno — Almuerzo
              </h6>
              <div className="row g-2">
                <div className="col-6">
                  <label className="small text-muted fw-bold">Apertura</label>
                  <input 
                    type="time" 
                    className="form-control"
                    value={config.almuerzoInicio}
                    onChange={(e) => setConfig({ ...config, almuerzoInicio: e.target.value })}
                  />
                </div>
                <div className="col-6">
                  <label className="small text-muted fw-bold">Cierre</label>
                  <input 
                    type="time" 
                    className="form-control"
                    value={config.almuerzoFin}
                    onChange={(e) => setConfig({ ...config, almuerzoFin: e.target.value })}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Cena */}
          <div className="col-md-6">
            <div className="border rounded-4 p-3 bg-light">
              <h6 className="fw-bold mb-3" style={{ color: '#bd5d38' }}>
                Turno — Cena
              </h6>
              <div className="row g-2">
                <div className="col-6">
                  <label className="small text-muted fw-bold">Apertura</label>
                  <input 
                    type="time" 
                    className="form-control"
                    value={config.cenaInicio}
                    onChange={(e) => setConfig({ ...config, cenaInicio: e.target.value })}
                  />
                </div>
                <div className="col-6">
                  <label className="small text-muted fw-bold">Cierre</label>
                  <input 
                    type="time" 
                    className="form-control"
                    value={config.cenaFin}
                    onChange={(e) => setConfig({ ...config, cenaFin: e.target.value })}
                  />
                </div>
              </div>
            </div>
          </div>

        </div>

        {/* Políticas */}
        <div className="row g-3 mb-4">
          <div className="col-md-6">
            <label className="form-label small fw-bold text-muted">DURACIÓN MÁXIMA POR MESA</label>
            <input 
              type="text" 
              className="form-control"
              value={config.duracionTurno}
              onChange={(e) => setConfig({ ...config, duracionTurno: e.target.value })}
            />
          </div>
          <div className="col-md-6">
            <label className="form-label small fw-bold text-muted">TOLERANCIA DE ESPERA (MINUTOS)</label>
            <input 
              type="number" 
              className="form-control"
              value={config.toleranciaMinutos}
              onChange={(e) => setConfig({ ...config, toleranciaMinutos: e.target.value })}
            />
          </div>
        </div>

        <button 
          type="submit" 
          className="btn text-white px-4 py-2 rounded-pill fw-bold shadow-sm"
          style={{ backgroundColor: '#bd5d38' }}
        >
          Guardar Configuración de Horarios
        </button>

        <p className="small text-muted mt-3 mb-0">
          Este horario se muestra en la página principal y también limita las horas disponibles al
          reservar.
        </p>
      </form>

    </div>
  );
}
