"use client";

import { useEffect } from "react";

export default function Error({
  error,
  unstable_retry,
}: {
  error: Error & { digest?: string };
  unstable_retry: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <main>
      <h1>Ocurrió un error</h1>
      <p>Intenta de nuevo en unos segundos.</p>
      <button type="button" onClick={() => unstable_retry()}>
        Reintentar
      </button>
    </main>
  );
}
