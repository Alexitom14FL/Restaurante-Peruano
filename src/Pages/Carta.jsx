import React, { useEffect, useState } from 'react';
import { IMAGEN_POR_DEFECTO, getPlatos } from '../utils/carta';


export default function Carta() {
  const [platos, setPlatos] = useState(() => getPlatos());

  // La carta se puede editar desde el panel, así que la leo al entrar.
  useEffect(() => {
    setPlatos(getPlatos());
  }, []);

  const platosDisponibles = platos;
  const [categoriaActual, setCategoriaActual] = useState('Todos');
  const [busqueda, setBusqueda] = useState('');

  // Filtra por categoría y texto
  const platosFiltrados = platosDisponibles.filter((plato) => {
    const coincideCategoria = categoriaActual === 'Todos' || plato.categoria === categoriaActual;
    const termino = busqueda.toLowerCase().trim();
    const coincideBusqueda = 
      termino === '' || 
      plato.nombre.toLowerCase().includes(termino) ||
      (plato.desc || '').toLowerCase().includes(termino);
    return coincideCategoria && coincideBusqueda;
  });

  const categorias = ['Todos', ...Array.from(new Set(platos.map((p) => p.categoria)))];

  return (
    <div className="container py-4 pb-5">
      
      {/* Buscador */}
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center gap-3 mb-4">
        <div>
          <h1 className="fw-bold display-6 mb-1" style={{ color: '#2b2b2b' }}>Nuestra Carta</h1>
          <p className="text-muted mb-0">
            Descubre nuestra propuesta gastronómica con los ingredientes más selectos y tradicionales.
          </p>
        </div>
        <div style={{ minWidth: '280px' }}>
          <input 
            type="text" 
            className="form-control bg-light border-0 py-2 rounded-pill px-3 shadow-sm" 
            placeholder="Buscar por plato o ingrediente..." 
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
          />
        </div>
      </div>

      {/* Categorías */}
      <div className="d-flex gap-2 mb-4 overflow-auto pb-2">
        {categorias.map((cat) => {
          const cantidadPorCat = cat === 'Todos' 
            ? platosDisponibles.length 
            : platosDisponibles.filter(p => p.categoria === cat).length;

          return (
            <button 
              key={cat}
              type="button"
              onClick={() => setCategoriaActual(cat)}
              className={`btn rounded-pill px-3 py-2 fw-bold d-flex align-items-center gap-2 ${
                categoriaActual === cat ? 'text-white' : 'btn-light border text-dark'
              }`}
              style={{ backgroundColor: categoriaActual === cat ? '#bd5d38' : undefined }}
            >
              <span>{cat}</span>
              <span 
                className={`badge rounded-pill ${
                  categoriaActual === cat ? 'bg-white text-dark' : 'bg-secondary bg-opacity-25 text-dark'
                }`}
                style={{ fontSize: '11px' }}
              >
                {cantidadPorCat}
              </span>
            </button>
          );
        })}
      </div>

      {/* Resultados */}
      <div className="d-flex justify-content-between align-items-center mb-3">
        <span className="text-muted small">
          Mostrando <strong>{platosFiltrados.length}</strong> {platosFiltrados.length === 1 ? 'opción' : 'opciones'}
        </span>
        {busqueda && (
          <button 
            type="button" 
            onClick={() => setBusqueda('')} 
            className="btn btn-link btn-sm text-decoration-none p-0"
            style={{ color: '#bd5d38' }}
          >
            Limpiar búsqueda
          </button>
        )}
      </div>

      {/* Platos */}
      {platosFiltrados.length === 0 ? (
        <div className="card border-0 shadow-sm p-5 text-center rounded-4 my-4 bg-light">
          <div className="py-4">
            <h5 className="fw-bold text-dark mb-2">No se encontraron opciones</h5>
            <p className="text-muted mb-3">No hay platos que coincidan con "{busqueda}" en esta categoría.</p>
            <button 
              type="button" 
              onClick={() => { setBusqueda(''); setCategoriaActual('Todos'); }}
              className="btn text-white rounded-pill px-4 fw-bold shadow-sm"
              style={{ backgroundColor: '#bd5d38' }}
            >
              Ver toda la carta
            </button>
          </div>
        </div>
      ) : (
        <div className="row g-4">
          {platosFiltrados.map((plato) => (
            <div className="col-sm-6 col-lg-4 col-xl-3" key={plato.id}>
              <div className="card border-0 shadow-sm rounded-4 overflow-hidden h-100 d-flex flex-column">
                
                {/* Imagen */}
                <div className="position-relative" style={{ height: '190px' }}>
                  <img 
                    src={plato.img || IMAGEN_POR_DEFECTO} 
                    alt={plato.nombre} 
                    className="w-100 h-100" 
                    style={{ objectFit: 'cover' }} 
                    loading="lazy"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = IMAGEN_POR_DEFECTO;
                    }}
                  />
                  {plato.popular && (
                    <span 
                      className="position-absolute top-0 start-0 m-2 badge bg-warning text-dark fw-bold px-2 py-1 shadow-sm" 
                      style={{ fontSize: '11px' }}
                    >
                      Destacado
                    </span>
                  )}
                  <span 
                    className="position-absolute top-0 end-0 m-2 badge bg-dark bg-opacity-75 text-white fw-medium px-2 py-1 shadow-sm"
                    style={{ fontSize: '11px' }}
                  >
                    {plato.categoria}
                  </span>
                </div>
                
                {/* Datos del plato */}
                <div className="card-body d-flex flex-column p-3 p-md-4">
                  <h5 className="fw-bold mb-2 text-dark" style={{ fontSize: '1.08rem' }}>
                    {plato.nombre}
                  </h5>
                  <p className="text-muted small mb-4 flex-grow-1" style={{ lineHeight: '1.5' }}>
                    {plato.desc}
                  </p>
                  
                  {/* Precio */}
                  <div className="d-flex justify-content-between align-items-center pt-2 border-top mt-auto">
                    <div>
                      <span className="text-muted small d-block" style={{ fontSize: '11px' }}>Precio</span>
                      <span className="fw-bold fs-5" style={{ color: '#bd5d38' }}>
                        S/ {Number(plato.precio).toFixed(2)}
                      </span>
                    </div>
                    <span 
                      className="badge rounded-pill bg-light text-secondary border px-3 py-2 fw-semibold"
                      style={{ fontSize: '11px' }}
                    >
                      Disponible
                    </span>
                  </div>
                </div>

              </div>
            </div>
          ))}
        </div>
      )}

    </div>
  );
}
