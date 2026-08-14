import Link from 'next/link';
import { Film } from 'lucide-react';

export default function NotFound() {
  return (
    <main className="flex min-h-[60vh] flex-col items-center justify-center gap-3 px-4 text-center">
      <Film className="h-12 w-12 text-zinc-600" />
      <h1 className="text-4xl font-extrabold text-zinc-100">404</h1>
      <p className="text-lg text-zinc-300">Página no encontrada</p>
      <p className="max-w-sm text-sm text-zinc-400">
        El contenido que buscas no existe o fue eliminado.
      </p>
      <Link
        href="/"
        className="mt-2 rounded-lg bg-red-600 px-5 py-2.5 text-sm font-semibold text-white transition-transform hover:scale-105"
      >
        Volver al inicio
      </Link>
    </main>
  );
}
