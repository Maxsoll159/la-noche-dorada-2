import type { ReactNode, SVGProps } from "react";

export type PropsIcono = Omit<SVGProps<SVGSVGElement>, "children"> & {
  size?: number;
};

const medidas = (size?: number) =>
  size === undefined ? {} : { width: size, height: size };

export function IconoTrazo({
  size,
  children,
  ...props
}: PropsIcono & { children: ReactNode }) {
  return (
    <svg
      aria-hidden
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      {...medidas(size)}
      {...props}
    >
      {children}
    </svg>
  );
}

export function IconoRelleno({
  size,
  children,
  ...props
}: PropsIcono & { children: ReactNode }) {
  return (
    <svg
      aria-hidden
      viewBox="0 0 24 24"
      fill="currentColor"
      {...medidas(size)}
      {...props}
    >
      {children}
    </svg>
  );
}

export function IconoLibre({
  size,
  children,
  ...props
}: PropsIcono & { children: ReactNode }) {
  return (
    <svg aria-hidden {...medidas(size)} {...props}>
      {children}
    </svg>
  );
}
