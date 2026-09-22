import { IconoRelleno, IconoTrazo, type PropsIcono } from "./base";

export function IconoCalendario(props: PropsIcono) {
  return (
    <IconoTrazo {...props}>
      <rect x="3" y="5" width="18" height="16" rx="2" />
      <path d="M8 3v4M16 3v4M3 11h18" />
    </IconoTrazo>
  );
}

export function IconoReloj(props: PropsIcono) {
  return (
    <IconoTrazo {...props}>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l3 2" />
    </IconoTrazo>
  );
}

export function IconoPin(props: PropsIcono) {
  return (
    <IconoTrazo {...props}>
      <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 1 1 16 0Z" />
      <circle cx="12" cy="10" r="3" />
    </IconoTrazo>
  );
}

export function IconoPersonas(props: PropsIcono) {
  return (
    <IconoTrazo {...props}>
      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
    </IconoTrazo>
  );
}

export function IconoBanderin(props: PropsIcono) {
  return (
    <IconoTrazo {...props}>
      <path d="M4 21V4M4 5h12l-2 4 2 4H4" />
    </IconoTrazo>
  );
}

export function IconoSenal(props: PropsIcono) {
  return (
    <IconoTrazo {...props}>
      <path d="M5 12a7 7 0 0 1 7-7M5 17a12 12 0 0 1 12-12" />
      <circle cx="6" cy="18" r="1.4" fill="currentColor" />
    </IconoTrazo>
  );
}

export function IconoCandado(props: PropsIcono) {
  return (
    <IconoTrazo strokeWidth={1.8} {...props}>
      <rect x="4" y="11" width="16" height="10" rx="2" />
      <path d="M8 11V7a4 4 0 0 1 8 0v4" />
    </IconoTrazo>
  );
}

export function IconoTrofeo(props: PropsIcono) {
  return (
    <IconoTrazo strokeWidth={1.7} {...props}>
      <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6M18 9h1.5a2.5 2.5 0 0 0 0-5H18" />
      <path d="M6 4h12v5a6 6 0 0 1-12 0V4Z" />
      <path d="M9 21h6M12 15v6" />
    </IconoTrazo>
  );
}

export function IconoVoto(props: PropsIcono) {
  return (
    <IconoTrazo {...props}>
      <path d="m9 12 2 2 4-4" />
      <path d="M3 17V9l9-6 9 6v8l-9 4-9-4Z" />
    </IconoTrazo>
  );
}

export function IconoDescargar(props: PropsIcono) {
  return (
    <IconoTrazo {...props}>
      <path d="M12 3v12m-5-5 5 5 5-5M4 20h16" />
    </IconoTrazo>
  );
}

export function IconoEnlace(props: PropsIcono) {
  return (
    <IconoTrazo {...props}>
      <path d="M10 13a5 5 0 0 0 7.5.5l2-2A5 5 0 0 0 12.5 4.5l-1 1" />
      <path d="M14 11a5 5 0 0 0-7.5-.5l-2 2A5 5 0 0 0 11.5 19.5l1-1" />
    </IconoTrazo>
  );
}

export function IconoCompartir(props: PropsIcono) {
  return (
    <IconoTrazo {...props}>
      <circle cx="18" cy="5" r="3" />
      <circle cx="6" cy="12" r="3" />
      <circle cx="18" cy="19" r="3" />
      <path d="m8.6 10.5 6.8-4M8.6 13.5l6.8 4" />
    </IconoTrazo>
  );
}

export function IconoCerrar(props: PropsIcono) {
  return (
    <IconoTrazo {...props}>
      <path d="M6 6l12 12M18 6 6 18" />
    </IconoTrazo>
  );
}

export function IconoComentario(props: PropsIcono) {
  return (
    <IconoTrazo {...props}>
      <path d="M21 12a8 8 0 0 1-11.6 7.1L4 20.5l1.4-4.6A8 8 0 1 1 21 12Z" />
      <path d="M8.5 10.5h7M8.5 13.5h4.5" />
    </IconoTrazo>
  );
}

export function IconoEnviar(props: PropsIcono) {
  return (
    <IconoTrazo {...props}>
      <path d="M21 3 10 14" />
      <path d="m21 3-7 18-4-7-7-4 18-7Z" />
    </IconoTrazo>
  );
}

export function IconoMas(props: PropsIcono) {
  return (
    <IconoTrazo {...props}>
      <path d="M12 5v14M5 12h14" />
    </IconoTrazo>
  );
}

export function IconoPlay(props: PropsIcono) {
  return (
    <IconoRelleno {...props}>
      <path d="M8 5.5v13l11-6.5z" />
    </IconoRelleno>
  );
}
