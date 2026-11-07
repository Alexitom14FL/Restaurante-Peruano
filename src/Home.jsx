import { Link } from 'react-router-dom';

export default function Home() {
  return (
    <main>
      <section className="hero">
        <div>
          <h1>Reserva tu mesa en nuestro restaurante</h1>
          <p>Elige fecha, hora y número de personas. Te confirmamos tu reserva en minutos.</p>
          <div className="hero-actions">
            <Link to="/reservar" className="btn btn-primary">Reservar mesa</Link>
            <a href="#" className="btn btn-outline" onClick={(e) => e.preventDefault()} title="Próximamente">Ver carta</a>
          </div>
        </div>
        <div className="hero-img">Imagen del restaurante</div>
      </section>
      <section className="info">
        <div className="info-card"><h3>Horario de atención</h3><p>Lunes a domingo</p><p>12:00 – 15:00 y 19:00 – 23:00</p></div>
        <div className="info-card"><h3>Ubicación</h3><p>Av. Ejemplo 123</p><p>Lima, Perú</p></div>
        <div className="info-card"><h3>Contacto</h3><p>+51 987 654 321</p><p>reservas@restreact.com</p></div>
      </section>
    </main>
  );
}
