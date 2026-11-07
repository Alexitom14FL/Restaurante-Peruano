// Cosas simples de la tarjeta: formato, marca y validación.

export const soloDigitos = (valor) => valor.replace(/\D/g, '');

export const formatearNumero = (valor) =>
  soloDigitos(valor)
    .slice(0, 16)
    .replace(/(.{4})/g, '$1 ')
    .trim();

export const formatearVencimiento = (valor) => {
  const numeros = soloDigitos(valor).slice(0, 4);
  return numeros.length > 2 ? `${numeros.slice(0, 2)}/${numeros.slice(2)}` : numeros;
};

export const marcaTarjeta = (numero) => {
  const n = soloDigitos(numero);
  if (/^4/.test(n)) return 'VISA';
  if (/^(5[1-5]|2[2-7])/.test(n)) return 'MASTERCARD';
  if (/^3[47]/.test(n)) return 'AMEX';
  return 'TARJETA';
};

// Pago de prueba: acepto cualquier número, no valido si existe de verdad.
export const numeroValido = (numero) => soloDigitos(numero).length >= 4;

export const vencimientoValido = (valor) => {
  const partes = /^(\d{2})\/(\d{2})$/.exec(valor);
  if (!partes) return false;

  // Solo reviso que el mes exista, no que la tarjeta esté vigente.
  const mes = Number(partes[1]);
  return mes >= 1 && mes <= 12;
};
