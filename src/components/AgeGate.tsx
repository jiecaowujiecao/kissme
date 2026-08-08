import * as React from "react";
import { siteConfig } from "@/config/site";

const STORAGE_KEY = "age-verified";

export function AgeGate() {
  const [open, setOpen] = React.useState(false);

  React.useEffect(() => {
    try {
      if (localStorage.getItem(STORAGE_KEY) !== "1") setOpen(true);
    } catch {
      setOpen(true);
    }
  }, []);

  if (!open) return null;

  const accept = () => {
    try {
      localStorage.setItem(STORAGE_KEY, "1");
    } catch {}
    setOpen(false);
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="age-gate-title"
      className="fixed inset-0 z-50 flex items-center justify-center px-6"
    >
      <div className="absolute inset-0 bg-background/60 backdrop-blur-sm" />
      <div className="relative w-full max-w-sm rounded-3xl border border-border bg-card/80 p-7 text-center shadow-2xl backdrop-blur-xl">
        <h2 id="age-gate-title" className="text-lg font-semibold text-card-foreground">
          Verificación de edad
        </h2>
        <p className="mt-3 text-sm text-muted-foreground">
          Este contenido es solo para mayores de 18 años. Confirma que eres mayor de edad
          para continuar en {siteConfig.appName}.
        </p>
        <button
          type="button"
          onClick={accept}
          className="mt-6 w-full rounded-full border-2 border-white/80 px-6 py-3 text-sm font-semibold text-white transition-transform hover:scale-[1.02]"
          style={{ background: "var(--gradient-button)" }}
        >
          Tengo 18 años o más
        </button>
        <p className="mt-3 text-xs text-muted-foreground/80">
          Si eres menor de 18 años, por favor cierra esta página.
        </p>
      </div>
    </div>
  );
}