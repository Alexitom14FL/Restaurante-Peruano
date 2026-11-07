import { useState } from 'react';

// Horarios de ejemplo (sin backend)
const almuerzo = ['12:00', '12:30', '13:00', '13:30', '14:00', '14:30'];
const cena = ['19:00', '19:30', '20:00', '20:30', '21:00', '21:30', '22:00'];
function localToday() {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}
const initial = { fecha: '', personas: '4', nombre: '', telefono: '', correo: '', comentarios: '' };

export default function Reservar() {
  const [form, setForm] = useState(initial);
  const [hora, setHora] = useState('');
  const [mensaje, setMensaje] = useState('');
  const update = (event) => {
    const { id, value } = event.target;
    setForm((prev) => ({ ...prev, [id]: value }));
    setMensaje('');
  };
  const slots = (horas) => horas.map((item) => (
    <button key={item} type="button" className={`slot ${hora === item ? 'selected' : ''}`} aria-pressed={hora === item} onClick={() => { setHora(item); setMensaje(''); }}>
      {item}
    </button>
  ));
  const confirmar = (event) => {
    event.preventDefault();
    if (!hora) { setMensaje('Selecciona un horario para continuar.'); return; }
    if (!event.currentTarget.reportValidity()) return;
    // Falta conectar un backend
    setMensaje('Formulario validado correctamente. Para registrar y confirmar la reserva, conecta un backend.');
  };
  const fechaFormateada = form.fecha ? new Date(`${form.fecha}T12:00:00`).toLocaleDateString('es-PE', { day: '2-digit', month: 'long', year: 'numeric' }) : '—';
  return (
    <main className="page-wrap">
      <h1>Reservar mesa</h1>
      <p className="subtitle">Completa los datos y elige un horario disponible.</p>
      <div className="reserva-grid">
        <form className="card" id="formReserva" onSubmit={confirmar}>
          <div className="form-row">
            <div className="field"><label htmlFor="fecha">Fecha</label><input type="date" id="fecha" min={localToday()} value={form.fecha} onChange={update} required /></div>
            <div className="field"><label htmlFor="personas">Número de personas</label><input type="number" id="personas" min="1" max="12" value={form.personas} onChange={update} required /></div>
          </div>
          <p className="slots-title">Horario — Almuerzo</p>
          <div className="slots" id="slotsAlmuerzo">{slots(almuerzo)}</div>
          <p className="slots-title">Horario — Cena</p>
          <div className="slots" id="slotsCena">{slots(cena)}</div>
          <div className="form-row">
            <div className="field"><label htmlFor="nombre">Nombre completo</label><input type="text" id="nombre" value={form.nombre} onChange={update} placeholder="Ej. Juan Pérez" required /></div>
            <div className="field"><label htmlFor="telefono">Teléfono</label><input type="tel" id="telefono" value={form.telefono} onChange={update} placeholder="+51 987 654 321" required /></div>
          </div>
          <div className="field"><label htmlFor="correo">Correo electrónico</label><input type="email" id="correo" value={form.correo} onChange={update} placeholder="correo@ejemplo.com" required /></div>
          <div className="field"><label htmlFor="comentarios">Comentarios (opcional)</label><textarea id="comentarios" value={form.comentarios} onChange={update} placeholder="Alergias, cumpleaños, silla para bebé…" /></div>
          <button type="submit" className="btn btn-primary btn-block">Confirmar reserva</button>
          <div className="mensaje" id="mensaje" role="status">{mensaje}</div>
        </form>
        <aside className="card resumen">
          <h2>Resumen de tu reserva</h2>
          <dl>
            <div><dt>Fecha</dt><dd>{fechaFormateada}</dd></div>
            <div><dt>Horario</dt><dd>{hora || '—'}</dd></div>
            <div><dt>Personas</dt><dd>{form.personas || '—'}</dd></div>
            <div><dt>Mesa</dt><dd>Se asigna automáticamente</dd></div>
          </dl>
          <div className="politicas"><h3>Políticas</h3><ul><li>Tolerancia de 15 minutos.</li><li>Cancelación gratuita hasta 2 horas antes.</li><li>Duración máxima por mesa: 2 horas.</li></ul></div>
          <p className="demo-note">Demostración: los horarios no representan disponibilidad en tiempo real.</p>
        </aside>
      </div>
    </main>
  );
}
