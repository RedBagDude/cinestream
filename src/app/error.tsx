'use client';

import { AlertTriangle } from 'lucide-react';

export default function Error({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <main className="flex min-h-[60vh] flex-col items-center justify-center gap-3 px-4 text-center">
      <AlertTriangle className="h-12 w-12 text-amber-500" />
      <h1 className="text-2xl font-extrabold text-zinc-100">
        Algo salió mal
      </h1>
      <p className="max-w-md text-sm text-zinc-400">
        No pudimos cargar el contenido. Comprueba tu conexión y vuelve a
        intentarlo.
      </p>
      <button
        onClick={reset}
        className="mt-2 rounded-lg bg-red-600 px-5 py-2.5 text-sm font-semibold text-white transition-transform hover:scale-105"
      >
        Reintentar
      </button>
    </main>
  );
}
