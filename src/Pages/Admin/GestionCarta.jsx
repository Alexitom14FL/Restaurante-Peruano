import React, { useEffect, useState } from 'react';
import {
  CATEGORIAS,
  IMAGEN_POR_DEFECTO,
  getPlatos,
  guardarPlatos,
  nuevoIdPlato,
  restaurarCarta,
} from '../../utils/carta';

// Datos vacíos para el formulario de un plato nuevo.
const FORM_VACIO = {
  nombre: '',
  desc: '',
  precio: '',
  categoria: 'Entradas',
  img: '',
  popular: false,
};

export default function GestionCarta() {
  const [platos, setPlatos] = useState(() => getPlatos());
  const [busqueda, setBusqueda] = useState('');
  const [categoriaFiltro, setCategoriaFiltro] = useState('Todas');
  const [formulario, setFormulario] = useState(null);
  const [editandoId, setEditandoId] = useState(null);
  const [mensaje, setMensaje] = useState('');
  const [error, setError] = useState('');

  // Al entrar al módulo siempre leo la carta guardada.
  useEffect(() => {
    setPlatos(getPlatos());
  }, []);

  const avisar = (texto) => {
    setMensaje(texto);
    setTimeout(() => setMensaje(''), 3000);
  };

  const abrirNuevo = () => {
    setFormulario({ ...FORM_VACIO });
    setEditandoId(null);
    setError('');
  };

  const abrirEdicion = (plato) => {
    setFormulario({ ...plato });
    setEditandoId(plato.id);
    setError('');
  };

  const cancelar = () => {
    setFormulario(null);
    setEditandoId(null);
    setError('');
  };

  const cambiarCampo = (campo, valor) => {
    setFormulario((anterior) => ({ ...anterior, [campo]: valor }));
  };

  const guardar = (e) => {
    e.preventDefault();
    if (!formulario) return;

    const nombre = formulario.nombre.trim();
    const desc = formulario.desc.trim();
    const precio = Number(formulario.precio);

    if (!nombre) {
      setError('Escribe el nombre del plato.');
      return;
    }
    if (!desc) {
      setError('Escribe una descripción corta.');
      return;
    }
    if (!Number.isFinite(precio) || precio <= 0) {
      setError('El precio debe ser mayor a cero.');
      return;
    }
    if (!formulario.categoria) {
      setError('Elige una categoría.');
      return;
    }

    // Armo el plato con los datos limpios del formulario.
    const plato = {
      ...formulario,
      id: editandoId || nuevoIdPlato(platos),
      nombre,
      desc,
      precio,
      img: (formulario.img || '').trim() || IMAGEN_POR_DEFECTO,
      popular: !!formulario.popular,
    };

    let lista;
    if (editandoId) {
      lista = platos.map((item) => (item.id === editandoId ? plato : item));
    } else {
      lista = [...platos, plato];
    }

    guardarPlatos(lista);
    setPlatos(lista);
    avisar(editandoId ? 'Plato actualizado correctamente.' : 'Plato agregado a la carta.');
    cancelar();
  };

  const eliminar = (plato) => {
    const confirmar = window.confirm(`¿Eliminar "${plato.nombre}" de la carta?`);
    if (!confirmar) return;

    const lista = platos.filter((item) => item.id !== plato.id);
    guardarPlatos(lista);
    setPlatos(lista);

    // Si estaba editando ese mismo plato, cierro el formulario.
    if (editandoId === plato.id) cancelar();

    avisar('Plato eliminado de la carta.');
  };

  const restaurar = () => {
    const confirmar = window.confirm('¿Restaurar la carta original? Se perderán los cambios.');
    if (!confirmar) return;

    const lista = restaurarCarta();
    setPlatos(lista);
    cancelar();
    avisar('Carta original restaurada.');
  };

  const categorias = [
    'Todas',
    ...new Set([...CATEGORIAS, ...platos.map((p) => p.categoria).filter(Boolean)]),
  ];

  const termino = busqueda.toLowerCase().trim();
  const filtrados = platos.filter((plato) => {
    const coincideCategoria = categoriaFiltro === 'Todas' || plato.categoria === categoriaFiltro;
    const coincideTexto =
      termino === '' ||
      plato.nombre.toLowerCase().includes(termino) ||
      (plato.desc || '').toLowerCase().includes(termino);

    return coincideCategoria && coincideTexto;
  });

  const destacados = platos.filter((plato) => plato.popular).length;

  return (
    <div>
      {/* Encabezado */}
      <div className="d-flex justify-content-between align-items-start flex-wrap gap-3 mb-4">
        <div>
          <h4 className="fw-bold mb-1">Carta del restaurante</h4>
          <p className="text-muted small mb-0">
            Agrega, edita o elimina platos. Los cambios se ven al instante en la página Carta.
          </p>
        </div>
        <div className="d-flex gap-2 flex-wrap">
          <button
            type="button"
            className="btn btn-outline-secondary rounded-pill px-3"
            onClick={restaurar}
          >
            ↺ Restaurar carta
          </button>
          <button
            type="button"
            className="btn text-white rounded-pill px-3 fw-semibold"
            style={{ backgroundColor: '#bd5d38' }}
            onClick={abrirNuevo}
          >
            + Agregar plato
          </button>
        </div>
      </div>

      {/* Resumen rápido */}
      <div className="row g-3 mb-4">
        <div className="col-6 col-md-4">
          <div className="card border-0 shadow-sm rounded-4 p-3 h-100 bg-white">
            <span className="text-muted small">Platos en la carta</span>
            <span className="fs-3 fw-bold" style={{ color: '#bd5d38' }}>{platos.length}</span>
          </div>
        </div>
        <div className="col-6 col-md-4">
          <div className="card border-0 shadow-sm rounded-4 p-3 h-100 bg-white">
            <span className="text-muted small">Categorías</span>
            <span className="fs-3 fw-bold" style={{ color: '#bd5d38' }}>
              {new Set(platos.map((p) => p.categoria).filter(Boolean)).size}
            </span>
          </div>
        </div>
        <div className="col-12 col-md-4">
          <div className="card border-0 shadow-sm rounded-4 p-3 h-100 bg-white">
            <span className="text-muted small">Platos destacados</span>
            <span className="fs-3 fw-bold" style={{ color: '#bd5d38' }}>{destacados}</span>
          </div>
        </div>
      </div>

      {mensaje && (
        <div className="alert alert-success border-0 rounded-4 py-2 small mb-3">
          ✓ {mensaje}
        </div>
      )}

      {/* Formulario para crear o editar */}
      {formulario && (
        <div className="card border-0 shadow-sm rounded-4 p-4 bg-white mb-4">
          <h5 className="fw-bold mb-3">
            {editandoId ? 'Editar plato' : 'Nuevo plato'}
          </h5>

          <form onSubmit={guardar} className="row g-3">
            <div className="col-md-6">
              <label className="form-label small fw-semibold">Nombre del plato</label>
              <input
                type="text"
                name="nombre"
                className="form-control"
                value={formulario.nombre}
                onChange={(e) => cambiarCampo('nombre', e.target.value)}
                placeholder="Ejemplo: Lomo saltado"
              />
            </div>

            <div className="col-md-3">
              <label className="form-label small fw-semibold">Precio (S/)</label>
              <input
                type="number"
                name="precio"
                className="form-control"
                min="0.01"
                step="0.01"
                value={formulario.precio}
                onChange={(e) => cambiarCampo('precio', e.target.value)}
                placeholder="0.00"
              />
            </div>

            <div className="col-md-3">
              <label className="form-label small fw-semibold">Categoría</label>
              <select
                name="categoria"
                className="form-select"
                value={formulario.categoria}
                onChange={(e) => cambiarCampo('categoria', e.target.value)}
              >
                {CATEGORIAS.map((categoria) => (
                  <option key={categoria} value={categoria}>{categoria}</option>
                ))}
              </select>
            </div>

            <div className="col-12">
              <label className="form-label small fw-semibold">Descripción</label>
              <textarea
                name="descripcion"
                className="form-control"
                rows="2"
                value={formulario.desc}
                onChange={(e) => cambiarCampo('desc', e.target.value)}
                placeholder="Ingredientes o preparación del plato"
              />
            </div>

            <div className="col-md-9">
              <label className="form-label small fw-semibold">Imagen (enlace opcional)</label>
              <input
                type="text"
                name="imagen"
                className="form-control"
                value={formulario.img}
                onChange={(e) => cambiarCampo('img', e.target.value)}
                placeholder="https://..."
              />
              <div className="form-text">Si lo dejas vacío se usa una imagen por defecto.</div>
            </div>

            <div className="col-md-3 d-flex align-items-end">
              <div className="form-check mb-2">
                <input
                  type="checkbox"
                  name="popular"
                  className="form-check-input"
                  id="platoPopular"
                  checked={!!formulario.popular}
                  onChange={(e) => cambiarCampo('popular', e.target.checked)}
                />
                <label className="form-check-label small" htmlFor="platoPopular">
                  Marcar como destacado
                </label>
              </div>
            </div>

            {error && (
              <div className="col-12">
                <div className="alert alert-danger border-0 rounded-4 py-2 mb-0 small">{error}</div>
              </div>
            )}

            <div className="col-12 d-flex gap-2">
              <button
                type="submit"
                className="btn text-white rounded-pill px-4 fw-semibold"
                style={{ backgroundColor: '#bd5d38' }}
              >
                Guardar plato
              </button>
              <button type="button" className="btn btn-light border rounded-pill px-4" onClick={cancelar}>
                Cancelar
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Listado */}
      <div className="card border-0 shadow-sm rounded-4 p-3 p-md-4 bg-white">
        <div className="row g-2 align-items-center mb-3">
          <div className="col-md-7">
            <input
              type="text"
              className="form-control bg-light border-0 rounded-pill px-3"
              placeholder="Buscar plato por nombre o descripción..."
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
            />
          </div>
          <div className="col-md-5 d-flex justify-content-md-end">
            <select
              className="form-select bg-light border-0 rounded-pill"
              style={{ maxWidth: '260px' }}
              value={categoriaFiltro}
              onChange={(e) => setCategoriaFiltro(e.target.value)}
            >
              {categorias.map((categoria) => (
                <option key={categoria} value={categoria}>{categoria}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="d-flex justify-content-between align-items-center mb-2">
          <span className="text-muted small">
            Mostrando <strong>{filtrados.length}</strong> de <strong>{platos.length}</strong> platos
          </span>
          {busqueda && (
            <button type="button" className="btn btn-link btn-sm p-0 text-decoration-none" onClick={() => setBusqueda('')}>
              Limpiar búsqueda
            </button>
          )}
        </div>

        {filtrados.length === 0 ? (
          <div className="text-center py-5 text-muted">
            <div className="fs-3 mb-2">🍽️</div>
            <p className="mb-0">No hay platos que coincidan con la búsqueda.</p>
          </div>
        ) : (
          <div className="table-responsive">
            <table className="table align-middle mb-0">
              <thead>
                <tr className="text-muted small">
                  <th style={{ width: '70px' }}>Foto</th>
                  <th>Plato</th>
                  <th>Categoría</th>
                  <th>Precio</th>
                  <th>Destacado</th>
                  <th className="text-end">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {filtrados.map((plato) => (
                  <tr key={plato.id}>
                    <td>
                      <img
                        src={plato.img || IMAGEN_POR_DEFECTO}
                        alt={plato.nombre}
                        className="rounded-3"
                        style={{ width: '56px', height: '46px', objectFit: 'cover' }}
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = IMAGEN_POR_DEFECTO;
                        }}
                      />
                    </td>
                    <td>
                      <div className="fw-semibold">{plato.nombre}</div>
                      <div className="text-muted small" style={{ maxWidth: '380px' }}>{plato.desc}</div>
                    </td>
                    <td>
                      <span className="badge bg-light text-dark border">{plato.categoria}</span>
                    </td>
                    <td className="fw-bold" style={{ color: '#bd5d38' }}>
                      S/ {Number(plato.precio).toFixed(2)}
                    </td>
                    <td>
                      {plato.popular ? (
                        <span className="badge bg-warning text-dark">Sí</span>
                      ) : (
                        <span className="text-muted small">—</span>
                      )}
                    </td>
                    <td className="text-end">
                      <button
                        type="button"
                        className="btn btn-sm btn-outline-dark rounded-pill me-1"
                        onClick={() => abrirEdicion(plato)}
                      >
                        Editar
                      </button>
                      <button
                        type="button"
                        className="btn btn-sm btn-outline-danger rounded-pill"
                        onClick={() => eliminar(plato)}
                      >
                        Eliminar
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
