// Pesaje oficial del viernes 27 de noviembre (página /pesaje). Se va llenando
// en vivo: a cada peleador que pasa por la balanza se le agrega su fila con
// `antes` (el peso que se manejaba) y `ahora` (lo que marcó la balanza).
// Quien no tiene fila sale como "Por pesar".
//
// `enVivo` en true muestra el "En vivo" en la página, la portada y el menú;
// al terminar el pesaje se pasa a false y queda como resultado final.
// `youtube` es el id del video (youtube.com/watch?v=<id>); en null la página
// manda a Kick.
//
// El peso oficial reemplaza al de la ficha (`peso` del peleador) y le quita
// el asterisco de "dato no oficial".
export const PESAJE = {
  enVivo: true,
  dia: "Viernes 27 de noviembre",
  youtube: null as string | null,
} as const;

export const PESOS_OFICIALES: Record<
  string,
  { antes?: number; ahora: number }
> = {
  pepita: { antes: 48, ahora: 48.2 },
  pauchikita: { antes: 56, ahora: 52 },
  jeque: { antes: 78, ahora: 77.4 },
  jota: { antes: 81, ahora: 77.9 },
  sacha: { antes: 85, ahora: 74 },
  neutro: { antes: 81, ahora: 73 },
  emetsuki: { antes: 55, ahora: 55 },
  daniela: { antes: 53, ahora: 55 },
};
