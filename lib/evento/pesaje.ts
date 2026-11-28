// Pesaje oficial del viernes 27 de noviembre. Se va llenando en vivo: a cada
// peleador que pasa por la balanza se le agrega su fila con `antes` (el peso
// que se manejaba) y `ahora` (lo que marcó la balanza). Quien no tiene fila
// sale como "Por pesar".
//
// `enVivo` en true muestra el "En vivo" en la sección y en el menú; al
// terminar el pesaje se pasa a false y queda como resultado final.
//
// El peso oficial reemplaza al de la ficha (`peso` del peleador) y le quita
// el asterisco de "dato no oficial".
export const PESAJE = {
  enVivo: true,
  dia: "Viernes 27 de noviembre",
} as const;

export const PESOS_OFICIALES: Record<
  string,
  { antes?: number; ahora: number }
> = {
  pepita: { antes: 48, ahora: 48.2 },
  pauchikita: { antes: 56, ahora: 52 },
};
