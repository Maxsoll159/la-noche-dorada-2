import { IconoLibre, IconoRelleno, type PropsIcono } from "./base";

export function EscudoEcuador(props: PropsIcono) {
  return (
    <IconoLibre viewBox="0 0 20 26" {...props}>
      <ellipse cx="10" cy="15.5" rx="8" ry="9.5" fill="#f7f1d8" />
      <path d="M10 1.5 3 5.5l7 1.8 7-1.8Z" fill="#2b2418" />
      <path d="M10 9.5 4.5 20h11Z" fill="#2f5aa8" />
      <path d="M4.5 20h11l-1.6 3h-7.8Z" fill="#f2c200" />
    </IconoLibre>
  );
}

export function IconoEstrella(props: PropsIcono) {
  return (
    <IconoRelleno {...props}>
      <path d="M12 2l2.9 6.6 7.1.7-5.4 4.8 1.6 7L12 17.4 5.8 21.1l1.6-7L2 9.3l7.1-.7z" />
    </IconoRelleno>
  );
}
