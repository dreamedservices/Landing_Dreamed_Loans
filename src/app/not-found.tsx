import Link from "next/link";

export default function NotFound() {
  return (
    <main>
      <h1>Página no encontrada</h1>
      <p>El contenido que buscas no existe o fue movido.</p>
      <Link href="/">Volver al inicio</Link>
    </main>
  );
}
