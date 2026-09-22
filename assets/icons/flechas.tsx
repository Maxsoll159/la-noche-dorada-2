import { IconoTrazo, type PropsIcono } from "./base";

export function IconoFlechaDerecha(props: PropsIcono) {
  return (
    <IconoTrazo {...props}>
      <path d="M5 12h14M13 6l6 6-6 6" />
    </IconoTrazo>
  );
}

export function IconoFlechaIzquierda(props: PropsIcono) {
  return (
    <IconoTrazo {...props}>
      <path d="M19 12H5M11 6l-6 6 6 6" />
    </IconoTrazo>
  );
}

export function IconoFlechaAbajo(props: PropsIcono) {
  return (
    <IconoTrazo {...props}>
      <path d="M12 5v14m-6-6 6 6 6-6" />
    </IconoTrazo>
  );
}

export function IconoExterno(props: PropsIcono) {
  return (
    <IconoTrazo {...props}>
      <path d="M7 17 17 7M9 7h8v8" />
    </IconoTrazo>
  );
}

export function IconoChevronIzquierda(props: PropsIcono) {
  return (
    <IconoTrazo {...props}>
      <path d="m14 6-6 6 6 6" />
    </IconoTrazo>
  );
}

export function IconoChevronAbajo(props: PropsIcono) {
  return (
    <IconoTrazo {...props}>
      <path d="m6 9 6 6 6-6" />
    </IconoTrazo>
  );
}

export function IconoRecargar(props: PropsIcono) {
  return (
    <IconoTrazo {...props}>
      <path d="M3 12a9 9 0 1 0 3-6.7M3 4v4h4" />
    </IconoTrazo>
  );
}
