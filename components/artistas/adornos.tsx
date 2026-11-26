import type { CSSProperties } from "react";

export function IconoPlay({ className = "" }: { className?: string }) {
  return (
    <svg
      aria-hidden
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
    >
      <path d="M7 4.5v15a1 1 0 0 0 1.5.86l12.5-7.5a1 1 0 0 0 0-1.72L8.5 3.64A1 1 0 0 0 7 4.5z" />
    </svg>
  );
}

// Barras de ecualizador; cada una con su ritmo para que no suban a la vez.
const BARRAS = [0.8, 1.1, 0.7, 1.3, 0.9, 1.05, 0.75];

export function Ecualizador({ className = "" }: { className?: string }) {
  return (
    <span aria-hidden className={`flex items-end gap-[3px] ${className}`}>
      {BARRAS.map((dur, i) => (
        <span
          key={i}
          className="w-[4px] ecualizador rounded-full bg-gradient-to-t from-oro-profundo via-oro to-oro-claro"
          style={
            {
              height: "100%",
              "--dur": `${dur}s`,
              animationDelay: `${-i * 0.17}s`,
            } as CSSProperties
          }
        />
      ))}
    </span>
  );
}

export function IconoSpotify({ className = "" }: { className?: string }) {
  return (
    <svg
      aria-hidden
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
    >
      <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.52 17.34c-.24.36-.66.48-1.02.24-2.82-1.74-6.36-2.1-10.56-1.14-.42.12-.78-.18-.9-.54-.12-.42.18-.78.54-.9 4.56-1.02 8.52-.6 11.64 1.32.42.18.48.66.3 1.02zm1.44-3.3c-.3.42-.84.6-1.26.3-3.24-1.98-8.16-2.58-11.94-1.38-.48.12-1.02-.12-1.14-.6-.12-.48.12-1.02.6-1.14C9.6 9.9 15 10.56 18.72 12.84c.36.18.54.78.24 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.3c-.6.18-1.2-.18-1.38-.72-.18-.6.18-1.2.72-1.38 4.26-1.26 11.28-1.02 15.72 1.62.54.3.72 1.02.42 1.56-.3.42-1.02.6-1.56.3z" />
    </svg>
  );
}
