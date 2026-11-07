// Todo se guarda en el navegador porque el proyecto es visual.
// Si borras los datos del navegador, vuelve a empezar de cero.

const KEY_RESERVAS = 'historialReservas';
const KEY_MESAS = 'listaMesas';
const KEY_CONFIG = 'configHorarios';
const KEY_BORRADOR = 'borradorReserva';

export const ADELANTO = 100;

export const CONFIG_DEFAULT = {
  diasLaborables: [
    { dia: 'Lunes', activo: true },
    { dia: 'Martes', activo: true },
    { dia: 'Miércoles', activo: true },
    { dia: 'Jueves', activo: true },
    { dia: 'Viernes', activo: true },
    { dia: 'Sábado', activo: true },
    { dia: 'Domingo', activo: true },
  ],
  almuerzoInicio: '12:00',
  almuerzoFin: '15:00',
  cenaInicio: '19:00',
  cenaFin: '23:00',
  duracionTurno: '2 horas',
  toleranciaMinutos: 15,
};

export const MESAS_DEFAULT = [
  { id: 1, nombre: 'M1', capacidad: 2, tipo: 'redonda', zona: 'Interior' },
  { id: 2, nombre: 'M2', capacidad: 2, tipo: 'redonda', zona: 'Interior' },
  { id: 3, nombre: 'M3', capacidad: 4, tipo: 'redonda', zona: 'Interior' },
  { id: 4, nombre: 'M4', capacidad: 4, tipo: 'redonda', zona: 'Interior' },
  { id: 5, nombre: 'M5', capacidad: 2, tipo: 'redonda', zona: 'Terraza' },
  { id: 6, nombre: 'M6', capacidad: 4, tipo: 'cuadrada', zona: 'Terraza' },
  { id: 7, nombre: 'M7', capacidad: 6, tipo: 'rectangular', zona: 'Interior' },
  { id: 8, nombre: 'M8', capacidad: 4, tipo: 'cuadrada', zona: 'Interior' },
  { id: 9, nombre: 'M9', capacidad: 8, tipo: 'rectangular', zona: 'VIP' },
  { id: 10, nombre: 'M10 Especial', capacidad: 12, tipo: 'especial', zona: 'Salón Imperial' },
];

const leer = (clave, porDefecto) => {
  try {
    const guardado = localStorage.getItem(clave);
    return guardado ? JSON.parse(guardado) : porDefecto;
  } catch (error) {
    return porDefecto;
  }
};

// ---------- Horarios ----------
export const getConfigHorarios = () => {
  const guardada = leer(KEY_CONFIG, null);
  return guardada ? { ...CONFIG_DEFAULT, ...guardada } : { ...CONFIG_DEFAULT };
};

export const guardarConfigHorarios = (config) => {
  localStorage.setItem(KEY_CONFIG, JSON.stringify(config));
};

// Arma los turnos cada 1 hora dentro de cada franja (son menos opciones).
function generarTurnos(inicio, fin) {
  const turnos = [];
  if (!inicio || !fin) return turnos;

  const [hI, mI] = inicio.split(':').map(Number);
  const [hF, mF] = fin.split(':').map(Number);
  let actual = hI * 60 + mI;
  const limite = hF * 60 + mF;

  while (actual < limite) {
    const h = String(Math.floor(actual / 60)).padStart(2, '0');
    const m = String(actual % 60).padStart(2, '0');
    turnos.push(`${h}:${m}`);
    actual += 60;
  }

  return turnos;
}

export const obtenerHorarios = (config = getConfigHorarios()) => {
  const almuerzo = generarTurnos(config.almuerzoInicio, config.almuerzoFin);
  const cena = generarTurnos(config.cenaInicio, config.cenaFin);
  return { almuerzo, cena, todos: [...almuerzo, ...cena] };
};

export const horaAMinutos = (hora) => {
  if (!hora) return 0;
  const [h, m] = hora.split(':').map(Number);
  return h * 60 + m;
};

// ---------- Mesas ----------
export const getMesas = () => {
  const mesas = leer(KEY_MESAS, null);
  if (!mesas) {
    localStorage.setItem(KEY_MESAS, JSON.stringify(MESAS_DEFAULT));
    return [...MESAS_DEFAULT];
  }
  return mesas;
};

export const guardarMesas = (mesas) => {
  localStorage.setItem(KEY_MESAS, JSON.stringify(mesas));
};

// ---------- Reservas ----------
export const getReservas = () => leer(KEY_RESERVAS, []);

export const guardarReservas = (reservas) => {
  localStorage.setItem(KEY_RESERVAS, JSON.stringify(reservas));
};

// Dos reservas chocan si son la misma mesa, el mismo día y están a menos de 1 hora.
export const reservaChoca = (datos, reservas = getReservas()) => {
  return reservas.some((r) => {
    if (r.estado === 'Cancelada') return false;
    if (r.mesa !== datos.mesa) return false;
    if (r.fecha !== datos.fecha) return false;
    return Math.abs(horaAMinutos(r.hora) - horaAMinutos(datos.hora)) < 60;
  });
};

// ---------- Borrador para el pago ----------
export const getBorradorPago = () => leer(KEY_BORRADOR, null);

export const guardarBorradorPago = (datos) => {
  localStorage.setItem(KEY_BORRADOR, JSON.stringify(datos));
};

export const limpiarBorradorPago = () => {
  localStorage.removeItem(KEY_BORRADOR);
};
