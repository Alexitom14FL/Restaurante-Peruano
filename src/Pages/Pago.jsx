import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  ADELANTO,
  getBorradorPago,
  getReservas,
  guardarReservas,
  limpiarBorradorPago,
  reservaChoca,
} from '../utils/reservas';
import {
  formatearNumero,
  formatearVencimiento,
  marcaTarjeta,
  numeroValido,
  soloDigitos,
  vencimientoValido,
} from '../utils/tarjeta';

export default function Pago() {
  const navigate = useNavigate();

  const [borrador, setBorrador] = useState(null);
  const [reserva, setReserva] = useState(null);
  const [cargando, setCargando] = useState(false);
  const [errores, setErrores] = useState({});

  const [pago, setPago] = useState({
    numero: '',
    titular: '',
    vencimiento: '',
    cvv: '',
  });

  useEffect(() => {
    setBorrador(getBorradorPago());
  }, []);

  const cambiar = (e) => {
    const { name, value } = e.target;
    let texto = value;

    if (name === 'numero') texto = formatearNumero(value);
    if (name === 'vencimiento') texto = formatearVencimiento(value);
    if (name === 'cvv') texto = soloDigitos(value).slice(0, 4);

    setPago({ ...pago, [name]: texto });
    setErrores({ ...errores, [name]: '' });
  };

  const validar = () => {
    const fallos = {};

    if (!numeroValido(pago.numero)) {
      fallos.numero = 'Escribe al menos 4 números de tarjeta.';
    }
    if (pago.titular.trim().length < 4) {
      fallos.titular = 'Escribe el nombre del titular.';
    }
    if (!vencimientoValido(pago.vencimiento)) {
      fallos.vencimiento = 'Revisa el vencimiento (MM/AA).';
    }
    if (soloDigitos(pago.cvv).length < 3) {
      fallos.cvv = 'El CVV tiene 3 o 4 números.';
    }

    setErrores(fallos);
    return Object.keys(fallos).length === 0;
  };

  const cobrar = (e) => {
    e.preventDefault();
    if (!validar()) return;

    setCargando(true);

    // Simulo la pasarela con un pequeño retraso.
    setTimeout(() => {
      // Por si alguien más reservó la misma mesa mientras llenabas los datos.
      if (reservaChoca(borrador)) {
        limpiarBorradorPago();
        setCargando(false);
        alert('Esa mesa acaba de ocuparse en ese turno. Elige otra, por favor.');
        navigate('/elegir-mesa');
        return;
      }

      const codigo = 'RES-' + Math.floor(1000 + Math.random() * 9000);

      const nuevaReserva = {
        ...borrador,
        idReserva: codigo,
        estado: 'Confirmada',
        fechaCreacion: new Date().toLocaleDateString(),
        adelanto: ADELANTO,
        tarjeta: soloDigitos(pago.numero).slice(-4),
        titularTarjeta: pago.titular.trim().toUpperCase(),
      };

      guardarReservas([...getReservas(), nuevaReserva]);
      limpiarBorradorPago();

      setReserva(nuevaReserva);
      setCargando(false);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }, 1500);
  };

  // Si entran directo sin haber elegido mesa.
  if (!borrador && !reserva) {
    return (
      <div className="container py-5">
        <div className="row justify-content-center">
          <div className="col-lg-7">
            <div className="card border rounded-4 shadow-sm p-4 p-md-5 bg-white text-center">
              <div className="fs-1 mb-2">💳</div>
              <h3 className="fw-bold mb-2" style={{ color: '#2b2b2b' }}>
                Todavía no hay una reserva para cobrar
              </h3>
              <p className="text-muted mb-4">
                Primero elige tu fecha, tu mesa y después pasas al pago del adelanto.
              </p>
              <Link
                to="/reservar"
                className="btn text-white fw-bold px-4 py-2 rounded-pill shadow-sm align-self-center"
                style={{ backgroundColor: '#bd5d38' }}
              >
                Ir a reservar
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Pantalla final con el código.
  if (reserva) {
    return (
      <div className="container py-5">
        <div className="row justify-content-center">
          <div className="col-lg-7">
            <div className="card border rounded-4 shadow-sm p-4 p-md-5 bg-white text-center">
              <div
                className="rounded-circle d-flex align-items-center justify-content-center mx-auto mb-3 text-white fw-bold"
                style={{ width: '72px', height: '72px', backgroundColor: '#198754', fontSize: '34px' }}
              >
                ✓
              </div>

              <h2 className="fw-bold mb-2" style={{ color: '#2b2b2b' }}>
                Pago realizado
              </h2>
              <p className="text-muted mb-4">
                Se registró el adelanto de S/ {ADELANTO}.00 (pago de prueba) con la tarjeta terminada
                en {reserva.tarjeta}. Tu mesa ya está asegurada.
              </p>

              <div className="bg-light p-3 rounded-3 mb-4">
                <div className="small text-uppercase text-muted mb-1">Código de reserva</div>
                <div className="fs-3 fw-bold" style={{ color: '#bd5d38' }}>
                  {reserva.idReserva}
                </div>
              </div>

              <div className="bg-light p-3 rounded-3 text-start mb-4">
                <p className="mb-1"><strong>Cliente:</strong> {reserva.nombre}</p>
                <p className="mb-1"><strong>Fecha y turno:</strong> {reserva.fecha} a las {reserva.hora}</p>
                <p className="mb-1"><strong>Comensales:</strong> {reserva.personas} personas</p>
                <p className="mb-1">
                  <strong>Mesa asignada:</strong>{' '}
                  <span className="badge bg-dark text-white ms-1">
                    {reserva.mesa} ({reserva.zona})
                  </span>
                </p>
                <p className="mb-0">
                  <strong>Adelanto pagado:</strong>{' '}
                  <span className="badge bg-success ms-1">S/ {ADELANTO}.00</span>
                </p>
              </div>

              <p className="small text-muted">
                Presenta tu código al llegar. El adelanto se descuenta del consumo.
              </p>

              <div className="d-flex flex-column flex-md-row gap-2 justify-content-center">
                <button
                  type="button"
                  className="btn btn-outline-dark rounded-pill px-4 fw-bold"
                  onClick={() => window.print()}
                >
                  Imprimir comprobante
                </button>
                <button
                  type="button"
                  className="btn text-white rounded-pill px-4 fw-bold"
                  style={{ backgroundColor: '#bd5d38' }}
                  onClick={() => navigate('/mis-reservas')}
                >
                  Ver mis reservas
                </button>
                <Link to="/" className="btn btn-outline-secondary rounded-pill px-4 fw-bold">
                  Ir al inicio
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-5">
      <div className="mb-4">
        <span
          className="badge px-3 py-2 mb-2 fw-bold text-uppercase"
          style={{ backgroundColor: '#f5e8d8', color: '#bd5d38', fontSize: '11px', letterSpacing: '1px' }}
        >
          PAGO SEGURO
        </span>
        <h1 className="fw-bold display-6 mb-2" style={{ color: '#2b2b2b' }}>
          Pantalla de cobro
        </h1>
        <p className="text-muted mb-0">
          Paga el adelanto de S/ {ADELANTO}.00 con tarjeta y deja tu mesa reservada. Es un cobro
          simulado, no se descuenta dinero real.
        </p>
      </div>

      <div className="row g-4 align-items-start">
        {/* Formulario de tarjeta */}
        <div className="col-lg-7">
          <div className="card border rounded-4 shadow-sm bg-white" style={{ borderColor: '#f0f0f0' }}>
            <div className="card-header bg-dark text-white rounded-top-4 d-flex justify-content-between align-items-center py-3">
              <h5 className="mb-0 fw-bold">Datos de la tarjeta</h5>
              <span className="badge bg-light text-dark">S/ {ADELANTO}.00</span>
            </div>

            <div className="card-body p-4">
              {/* Vista previa de la tarjeta */}
              <div
                className="rounded-4 p-3 mb-4 text-white"
                style={{
                  background: 'linear-gradient(135deg, #bd5d38 0%, #7d3a22 100%)',
                  minHeight: '170px',
                }}
              >
                <div className="d-flex justify-content-between align-items-start mb-4">
                  <div
                    className="rounded-2"
                    style={{ width: '42px', height: '30px', backgroundColor: '#e9c46a' }}
                  />
                  <span className="fw-bold small">{marcaTarjeta(pago.numero)}</span>
                </div>

                <div className="fs-5 fw-bold mb-4" style={{ letterSpacing: '2px' }}>
                  {pago.numero || '•••• •••• •••• ••••'}
                </div>

                <div className="d-flex justify-content-between small">
                  <div>
                    <div style={{ opacity: 0.75, fontSize: '10px' }}>TITULAR</div>
                    <div className="text-uppercase">{pago.titular || 'NOMBRE DEL TITULAR'}</div>
                  </div>
                  <div className="text-end">
                    <div style={{ opacity: 0.75, fontSize: '10px' }}>VENCE</div>
                    <div>{pago.vencimiento || 'MM/AA'}</div>
                  </div>
                </div>
              </div>

              <form onSubmit={cobrar} noValidate>
                <div className="mb-3">
                  <label className="form-label small fw-bold text-muted">NÚMERO DE TARJETA</label>
                  <input
                    type="text"
                    name="numero"
                    inputMode="numeric"
                    autoComplete="cc-number"
                    className={`form-control bg-light border-0 py-2 ${errores.numero ? 'is-invalid' : ''}`}
                    value={pago.numero}
                    onChange={cambiar}
                    placeholder="4111 1111 1111 1111"
                  />
                  {errores.numero ? (
                    <div className="invalid-feedback">{errores.numero}</div>
                  ) : (
                    <div className="form-text small">
                      Es de prueba: puedes escribir cualquier número, real o inventado.
                    </div>
                  )}
                </div>

                <div className="mb-3">
                  <label className="form-label small fw-bold text-muted">NOMBRE DEL TITULAR</label>
                  <input
                    type="text"
                    name="titular"
                    autoComplete="cc-name"
                    className={`form-control bg-light border-0 py-2 ${errores.titular ? 'is-invalid' : ''}`}
                    value={pago.titular}
                    onChange={cambiar}
                    placeholder="Como sale en la tarjeta"
                  />
                  {errores.titular && <div className="invalid-feedback">{errores.titular}</div>}
                </div>

                <div className="row g-3 mb-4">
                  <div className="col-6">
                    <label className="form-label small fw-bold text-muted">VENCIMIENTO</label>
                    <input
                      type="text"
                      name="vencimiento"
                      inputMode="numeric"
                      autoComplete="cc-exp"
                      className={`form-control bg-light border-0 py-2 ${errores.vencimiento ? 'is-invalid' : ''}`}
                      value={pago.vencimiento}
                      onChange={cambiar}
                      placeholder="MM/AA"
                    />
                    {errores.vencimiento && (
                      <div className="invalid-feedback">{errores.vencimiento}</div>
                    )}
                  </div>

                  <div className="col-6">
                    <label className="form-label small fw-bold text-muted">CVV</label>
                    <input
                      type="password"
                      name="cvv"
                      inputMode="numeric"
                      autoComplete="cc-csc"
                      className={`form-control bg-light border-0 py-2 ${errores.cvv ? 'is-invalid' : ''}`}
                      value={pago.cvv}
                      onChange={cambiar}
                      placeholder="123"
                    />
                    {errores.cvv && <div className="invalid-feedback">{errores.cvv}</div>}
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={cargando}
                  className="btn text-white w-100 py-3 fw-bold rounded-pill shadow-sm"
                  style={{ backgroundColor: '#bd5d38' }}
                >
                  {cargando ? (
                    <>
                      <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true" />
                      Procesando pago...
                    </>
                  ) : (
                    <>Pagar S/ {ADELANTO}.00</>
                  )}
                </button>

                <div className="text-center mt-3">
                  <Link to="/elegir-mesa" className="small text-muted text-decoration-none">
                    Volver a elegir la mesa
                  </Link>
                </div>

                <p className="text-center text-muted small mt-3 mb-0">
                  Pago de prueba, no se cobra dinero real.
                </p>
              </form>
            </div>
          </div>
        </div>

        {/* Resumen */}
        <div className="col-lg-5">
          <div className="card border rounded-4 shadow-sm p-4 bg-white mb-3" style={{ borderColor: '#f0f0f0' }}>
            <h5 className="fw-bold mb-3" style={{ color: '#2b2b2b' }}>
              Tu reserva
            </h5>

            <div className="d-flex justify-content-between py-2 border-bottom">
              <span className="text-muted">Cliente</span>
              <span className="fw-semibold text-end">{borrador.nombre}</span>
            </div>
            <div className="d-flex justify-content-between py-2 border-bottom">
              <span className="text-muted">Teléfono</span>
              <span className="fw-semibold">{borrador.telefono}</span>
            </div>
            <div className="d-flex justify-content-between py-2 border-bottom">
              <span className="text-muted">Fecha</span>
              <span className="fw-semibold">{borrador.fecha}</span>
            </div>
            <div className="d-flex justify-content-between py-2 border-bottom">
              <span className="text-muted">Turno</span>
              <span className="fw-semibold">{borrador.hora}</span>
            </div>
            <div className="d-flex justify-content-between py-2 border-bottom">
              <span className="text-muted">Personas</span>
              <span className="fw-semibold">{borrador.personas}</span>
            </div>
            <div className="d-flex justify-content-between py-2 border-bottom">
              <span className="text-muted">Mesa</span>
              <span className="fw-semibold">{borrador.mesa} · {borrador.zona}</span>
            </div>

            <div className="d-flex justify-content-between align-items-center pt-3">
              <span className="fw-bold">Adelanto a pagar</span>
              <span className="fs-4 fw-bold" style={{ color: '#bd5d38' }}>
                S/ {ADELANTO}.00
              </span>
            </div>
          </div>

          <div className="card border rounded-4 p-3 bg-light">
            <p className="small text-muted mb-2">
              El adelanto se descuenta del total de tu consumo ese día.
            </p>
            <p className="small text-muted mb-0">
              Si quieres cambiar la fecha o la mesa, usa el enlace de abajo; no se borra nada.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
