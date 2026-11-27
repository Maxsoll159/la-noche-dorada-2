// Artistas que tocan en la noche del evento (página /artistas). Los que aún
// no se anuncian van con `nombre: null` y se muestran como incógnito; al
// revelarlos basta con poner su nombre y foto aquí.
// `spotify` es el id del artista en open.spotify.com/artist/<id>; con él la
// ficha /artistas/<slug> muestra su reproductor.
export type Artista = {
  nombre: string | null;
  slug?: string;
  foto?: string;
  genero?: string;
  spotify?: string;
};

export const ARTISTAS: readonly Artista[] = [
  {
    nombre: "Bareto",
    slug: "bareto",
    foto: "/artistas/bareto.webp",
    genero: "Cumbia peruana",
    spotify: "5piEbDj9Q4qiZvNO8Gktv7",
  },
  {
    nombre: "Hermanos Yaipén",
    slug: "hermanos-yaipen",
    foto: "/artistas/hermanos-yaipen.webp",
    genero: "Cumbia peruana",
    // Perfil oficial "Hnos Yaipén"; hay otro "Hermanos Yaipen" casi vacío.
    spotify: "1MD1SEYZh3dbCa2M7YVjPg",
  },
  { nombre: null },
  { nombre: null },
  { nombre: null },
];

export function artistaDe(slug: string) {
  return ARTISTAS.find((a) => a.slug === slug && a.nombre);
}
