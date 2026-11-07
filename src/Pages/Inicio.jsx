import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getConfigHorarios, getMesas } from '../utils/reservas';

export default function Inicio() {
  const [config, setConfig] = useState(() => getConfigHorarios());
  const [totalMesas, setTotalMesas] = useState(() => getMesas().length);
  const [capacidadMax, setCapacidadMax] = useState(12);

  // Vuelvo a leer los datos cada vez que se entra a la portada.
  useEffect(() => {
    setConfig(getConfigHorarios());

    const mesas = getMesas();
    setTotalMesas(mesas.length);

    const mayor = mesas.reduce((max, mesa) => (mesa.capacidad > max ? mesa.capacidad : max), 0);
    setCapacidadMax(mayor || 12);
  }, []);

  return (
    <div className="pb-5">
      
      {/* Portada */}
      <section className="bg-light py-5 border-bottom">
        <div className="container py-4">
          <div className="row align-items-center g-5">
            <div className="col-lg-7">
              <span 
                className="badge px-3 py-2 mb-3 fw-bold text-uppercase" 
                style={{ backgroundColor: '#f5e8d8', color: '#bd5d38', fontSize: '11px', letterSpacing: '1px' }}
              >
                Restaurante Restreact
              </span>
              <h1 className="display-4 fw-bold mb-3 text-dark" style={{ lineHeight: '1.2' }}>
                Tradición, sabor criollo y cocina de autor
              </h1>
              <p className="lead text-muted mb-4" style={{ fontSize: '1.1rem' }}>
                Disfruta de nuestros clásicos lomos saltados al wok, ceviches del día, arroces con mariscos y postres tradicionales. Elige tu mesa en línea para almuerzos o cenas.
              </p>
              
              <div className="d-flex gap-3 flex-wrap">
                <Link to="/reservar" className="btn px-4 py-3 fw-bold rounded-pill text-white" style={{ backgroundColor: '#bd5d38' }}>
                  Reservar mesa
                </Link>
                <Link to="/carta" className="btn btn-outline-dark px-4 py-3 fw-bold rounded-pill">
                  Ver carta completa
                </Link>
              </div>

              <p className="small text-muted mt-3 mb-0">
                Reserva con S/ 100 de adelanto (pago con tarjeta).
              </p>
            </div>
            
            <div className="col-lg-5">
              <div className="card border-0 shadow-sm rounded-4 overflow-hidden" style={{ height: '380px' }}>
                <img 
                  src="https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=800&q=80" 
                  alt="Comedor del restaurante" 
                  className="w-100 h-100"
                  style={{ objectFit: 'cover' }}
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Datos rápidos */}
      <section className="py-4 bg-white border-bottom">
        <div className="container">
          <div className="row text-center g-4">
            <div className="col-6 col-md-3">
              <h4 className="fw-bold mb-1" style={{ color: '#bd5d38' }}>
                {config.almuerzoInicio} – {config.almuerzoFin}
              </h4>
              <span className="text-muted small">Turno de Almuerzo</span>
            </div>
            <div className="col-6 col-md-3">
              <h4 className="fw-bold mb-1" style={{ color: '#bd5d38' }}>
                {config.cenaInicio} – {config.cenaFin}
              </h4>
              <span className="text-muted small">Turno de Cena</span>
            </div>
            <div className="col-6 col-md-3">
              <h4 className="fw-bold mb-1" style={{ color: '#bd5d38' }}>{totalMesas} Mesas</h4>
              <span className="text-muted small">Interior, Terraza y VIP</span>
            </div>
            <div className="col-6 col-md-3">
              <h4 className="fw-bold mb-1" style={{ color: '#bd5d38' }}>Hasta {capacidadMax} personas</h4>
              <span className="text-muted small">Capacidad en Salón Imperial</span>
            </div>
          </div>
        </div>
      </section>

      {/* Propuesta culinaria */}
      <section className="py-5">
        <div className="container py-3">
          <div className="row align-items-center g-5">
            <div className="col-lg-6">
              <img 
                src="https://images.unsplash.com/photo-1577219491135-ce391730fb2c?auto=format&fit=crop&w=700&q=80" 
                alt="Cocina del restaurante" 
                className="rounded-4 shadow-sm w-100" 
                style={{ height: '360px', objectFit: 'cover' }}
              />
            </div>

            <div className="col-lg-6">
              <span className="text-uppercase fw-bold small text-muted">
                Cocina Criolla y Marina
              </span>
              <h2 className="fw-bold mb-3 text-dark">
                Ingredientes seleccionados y preparación al momento
              </h2>
              <p className="text-muted mb-4">
                Nuestra carta reúne los platos más representativos de la cocina peruana. Trabajamos con pescado fresco del día, cortes de lomo fino y aderezos tradicionales preparados desde temprano para conservar la sazón de cada preparación.
              </p>
              
              <div className="row g-3">
                <div className="col-sm-6">
                  <div className="p-3 border rounded-3 bg-light h-100">
                    <h6 className="fw-bold mb-1 text-dark">Pescados y Mariscos</h6>
                    <small className="text-muted">Ceviches, tiraditos y arroces marineros elaborados con pesca fresca del litoral.</small>
                  </div>
                </div>
                <div className="col-sm-6">
                  <div className="p-3 border rounded-3 bg-light h-100">
                    <h6 className="fw-bold mb-1 text-dark">Salteados y Fondos</h6>
                    <small className="text-muted">Lomo saltado a fuego vivo, seco norteño con frijoles y ají de gallina criollo.</small>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Platos recomendados */}
      <section className="py-5 bg-light">
        <div className="container py-3">
          <div className="d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-end mb-4 gap-3">
            <div>
              <span className="text-uppercase fw-bold small text-muted">
                Nuestra Carta
              </span>
              <h2 className="fw-bold mb-1 text-dark">Platos recomendados</h2>
              <p className="text-muted mb-0">Una muestra de nuestras preparaciones más solicitadas</p>
            </div>
            <Link to="/carta" className="btn btn-outline-dark rounded-pill px-4 fw-bold">
              Ver carta completa
            </Link>
          </div>

          <div className="row g-4">
            <div className="col-md-6 col-lg-3">
              <div className="card border-0 shadow-sm rounded-4 overflow-hidden h-100 bg-white">
                <img 
                  src="https://images.unsplash.com/photo-1535399831218-d5bd36d1a6b3?auto=format&fit=crop&w=600&q=80" 
                  alt="Ceviche clásico" 
                  className="w-100" 
                  style={{ height: '180px', objectFit: 'cover' }}
                />
                <div className="p-4 d-flex flex-column flex-grow-1">
                  <span className="badge bg-light text-dark border align-self-start mb-2" style={{ fontSize: '11px' }}>
                    Entrada
                  </span>
                  <h5 className="fw-bold text-dark mb-1">Ceviche Clásico</h5>
                  <p className="text-muted small mb-3 flex-grow-1">Pesca del día en leche de tigre con camote glaseado y choclo.</p>
                  <div className="d-flex justify-content-between align-items-center pt-2 border-top">
                    <span className="fw-bold fs-5" style={{ color: '#bd5d38' }}>S/ 38.00</span>
                    <small className="text-muted">Disponible</small>
                  </div>
                </div>
              </div>
            </div>

            <div className="col-md-6 col-lg-3">
              <div className="card border-0 shadow-sm rounded-4 overflow-hidden h-100 bg-white">
                <img 
                  src="https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=600&q=80" 
                  alt="Lomo saltado criollo" 
                  className="w-100" 
                  style={{ height: '180px', objectFit: 'cover' }}
                />
                <div className="p-4 d-flex flex-column flex-grow-1">
                  <span className="badge bg-light text-dark border align-self-start mb-2" style={{ fontSize: '11px' }}>
                    Fondo
                  </span>
                  <h5 className="fw-bold text-dark mb-1">Lomo Saltado Criollo</h5>
                  <p className="text-muted small mb-3 flex-grow-1">Lomo fino salteado al wok con cebolla, tomate, papas fritas y arroz.</p>
                  <div className="d-flex justify-content-between align-items-center pt-2 border-top">
                    <span className="fw-bold fs-5" style={{ color: '#bd5d38' }}>S/ 44.00</span>
                    <small className="text-muted">Disponible</small>
                  </div>
                </div>
              </div>
            </div>

            <div className="col-md-6 col-lg-3">
              <div className="card border-0 shadow-sm rounded-4 overflow-hidden h-100 bg-white">
                <img 
                  src="https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?auto=format&fit=crop&w=600&q=80" 
                  alt="Arroz con mariscos" 
                  className="w-100" 
                  style={{ height: '180px', objectFit: 'cover' }}
                />
                <div className="p-4 d-flex flex-column flex-grow-1">
                  <span className="badge bg-light text-dark border align-self-start mb-2" style={{ fontSize: '11px' }}>
                    Fondo
                  </span>
                  <h5 className="fw-bold text-dark mb-1">Arroz con Mariscos</h5>
                  <p className="text-muted small mb-3 flex-grow-1">Arroz criollo con mariscos surtidos, aderezo de ají amarillo y salsa criolla.</p>
                  <div className="d-flex justify-content-between align-items-center pt-2 border-top">
                    <span className="fw-bold fs-5" style={{ color: '#bd5d38' }}>S/ 42.00</span>
                    <small className="text-muted">Disponible</small>
                  </div>
                </div>
              </div>
            </div>

            <div className="col-md-6 col-lg-3">
              <div className="card border-0 shadow-sm rounded-4 overflow-hidden h-100 bg-white">
                <img 
                  src="https://images.unsplash.com/photo-1551024709-8f23befc6f87?auto=format&fit=crop&w=600&q=80" 
                  alt="Suspiro a la limeña" 
                  className="w-100" 
                  style={{ height: '180px', objectFit: 'cover' }}
                />
                <div className="p-4 d-flex flex-column flex-grow-1">
                  <span className="badge bg-light text-dark border align-self-start mb-2" style={{ fontSize: '11px' }}>
                    Postre
                  </span>
                  <h5 className="fw-bold text-dark mb-1">Suspiro a la Limeña</h5>
                  <p className="text-muted small mb-3 flex-grow-1">Manjar blanco tradicional de yemas con merengue al oporto y canela molida.</p>
                  <div className="d-flex justify-content-between align-items-center pt-2 border-top">
                    <span className="fw-bold fs-5" style={{ color: '#bd5d38' }}>S/ 18.00</span>
                    <small className="text-muted">Disponible</small>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Ambientes */}
      <section className="py-5">
        <div className="container py-3">
          <div className="text-center mb-5">
            <span className="text-uppercase fw-bold small text-muted">
              Ambientes
            </span>
            <h2 className="fw-bold text-dark">Distribución de salones</h2>
            <p className="text-muted">Selecciona tu zona preferida al momento de realizar la reserva</p>
          </div>

          <div className="row g-4">
            <div className="col-md-6 col-lg-3">
              <div className="card border rounded-4 p-4 h-100 bg-white">
                <h5 className="fw-bold text-dark mb-2">Salón Interior</h5>
                <p className="text-muted small mb-3">Espacio principal con mesas para 2, 4 y 6 personas en ambiente climatizado.</p>
                <span className="badge bg-light text-dark border align-self-start mt-auto">Mesas M1 a M4, M7 y M8</span>
              </div>
            </div>

            <div className="col-md-6 col-lg-3">
              <div className="card border rounded-4 p-4 h-100 bg-white">
                <h5 className="fw-bold text-dark mb-2">Terraza</h5>
                <p className="text-muted small mb-3">Mesas al aire libre con ventilación natural para 2 y 4 personas.</p>
                <span className="badge bg-light text-dark border align-self-start mt-auto">Mesas M5 y M6</span>
              </div>
            </div>

            <div className="col-md-6 col-lg-3">
              <div className="card border rounded-4 p-4 h-100 bg-white">
                <h5 className="fw-bold text-dark mb-2">Zona VIP</h5>
                <p className="text-muted small mb-3">Mesa amplia para grupos de hasta 8 personas, adecuada para almuerzos de trabajo.</p>
                <span className="badge bg-light text-dark border align-self-start mt-auto">Mesa M9</span>
              </div>
            </div>

            <div className="col-md-6 col-lg-3">
              <div className="card border rounded-4 p-4 h-100 bg-white">
                <h5 className="fw-bold text-dark mb-2">Salón Imperial</h5>
                <p className="text-muted small mb-3">Nuestra mesa más grande, acondicionada exclusivamente para reuniones de 10 a 12 personas.</p>
                <span className="badge bg-light text-dark border align-self-start mt-auto">Mesa M10 Especial</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Cómo reservar */}
      <section className="py-5 bg-light">
        <div className="container py-3">
          <div className="text-center mb-5">
            <span className="text-uppercase fw-bold small text-muted">
              Pasos para reservar
            </span>
            <h2 className="fw-bold text-dark">Cómo reservar tu mesa</h2>
          </div>

          <div className="row g-4 text-center">
            <div className="col-md-4">
              <div className="card border-0 shadow-sm rounded-4 p-4 h-100 bg-white">
                <div 
                  className="rounded-circle d-flex align-items-center justify-content-center mx-auto mb-3 text-white fw-bold fs-5"
                  style={{ width: '48px', height: '48px', backgroundColor: '#bd5d38' }}
                >
                  1
                </div>
                <h5 className="fw-bold text-dark mb-2">Fecha y personas</h5>
                <p className="text-muted small mb-0">Indica el día, turno de atención y cantidad de asistentes a la mesa.</p>
              </div>
            </div>

            <div className="col-md-4">
              <div className="card border-0 shadow-sm rounded-4 p-4 h-100 bg-white">
                <div 
                  className="rounded-circle d-flex align-items-center justify-content-center mx-auto mb-3 text-white fw-bold fs-5"
                  style={{ width: '48px', height: '48px', backgroundColor: '#bd5d38' }}
                >
                  2
                </div>
                <h5 className="fw-bold text-dark mb-2">Elección de mesa</h5>
                <p className="text-muted small mb-0">Revisa la disponibilidad en el plano y elige la mesa que mejor se acomode a tu grupo.</p>
              </div>
            </div>

            <div className="col-md-4">
              <div className="card border-0 shadow-sm rounded-4 p-4 h-100 bg-white">
                <div 
                  className="rounded-circle d-flex align-items-center justify-content-center mx-auto mb-3 text-white fw-bold fs-5"
                  style={{ width: '48px', height: '48px', backgroundColor: '#bd5d38' }}
                >
                  3
                </div>
                <h5 className="fw-bold text-dark mb-2">Pago y confirmación</h5>
                <p className="text-muted small mb-0">Paga S/ 100 de adelanto con tarjeta y recibe tu código de reserva al instante.</p>
              </div>
            </div>
          </div>

          <div className="text-center mt-5">
            <Link to="/reservar" className="btn px-5 py-3 fw-bold rounded-pill text-white" style={{ backgroundColor: '#bd5d38' }}>
              Iniciar reserva
            </Link>
          </div>
        </div>
      </section>

      {/* Contacto y horarios */}
      <section className="py-5 bg-white border-top">
        <div className="container">
          <div className="row g-4">
            <div className="col-md-4">
              <div className="card border rounded-4 p-4 h-100 bg-light">
                <h6 className="fw-bold text-dark mb-2">Horarios de atención</h6>
                <p className="mb-1 text-dark">Lunes a Domingo</p>
                <p className="text-muted small mb-1">
                  Almuerzo: {config.almuerzoInicio} a {config.almuerzoFin}
                </p>
                <p className="text-muted small mb-0">
                  Cena: {config.cenaInicio} a {config.cenaFin}
                </p>
              </div>
            </div>

            <div className="col-md-4">
              <div className="card border rounded-4 p-4 h-100 bg-light">
                <h6 className="fw-bold text-dark mb-2">Dirección</h6>
                <p className="mb-1 text-dark">Av. La Marina 2810</p>
                <p className="text-muted small mb-0">San Miguel, Lima - Perú. Estacionamiento disponible para clientes.</p>
              </div>
            </div>

            <div className="col-md-4">
              <div className="card border rounded-4 p-4 h-100 bg-light">
                <h6 className="fw-bold text-dark mb-2">Contacto</h6>
                <p className="mb-1 text-dark">+51 987 654 321</p>
                <p className="text-muted small mb-0">contacto@restreact.com</p>
              </div>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}
