// Contrato entre el navegador y el BFF (`app/api/*`). Es lo único que cruza la
// red: ni la URL ni la clave de Supabase llegan al cliente.
import type { Conteo, Lado, Metodo } from "@/lib/conteo";

export type Usuario = {
  id: string;
  nombre: string;
  avatar: string | null;
};

export type RespuestaYo = { usuario: Usuario | null };

export type RespuestaConteos = { conteos: Record<string, Conteo> };

export type RespuestaVotos = {
  votos: Record<string, Lado>;
  metodos: Record<string, Metodo>;
};

export type RespuestaConteo = { conteo: Conteo };

export const COMENTARIOS_POR_PAGINA = 20;
export const MAX_COMENTARIO = 500;

export type Comentario = {
  id: number;
  autor_nombre: string;
  autor_avatar: string | null;
  texto: string;
  creado_en: string;
  propio: boolean;
};

export type RespuestaComentarios = {
  comentarios: Comentario[];
  total: number;
  hayMas: boolean;
};

export type RespuestaComentario = { comentario: Comentario };

// Comunidad: pronósticos publicados, uno por persona.
export const COMUNIDAD_POR_PAGINA = 12;
export const MAX_DESCRIPCION = 280;

export type Reaccion = "gusta" | "no_gusta";

export const ORDENES_COMUNIDAD = [
  "recientes",
  "populares",
  "comentados",
] as const;
export type OrdenComunidad = (typeof ORDENES_COMUNIDAD)[number];

export type PronosticoPublico = {
  id: number;
  codigo: string;
  descripcion: string | null;
  autor_nombre: string;
  autor_avatar: string | null;
  meGusta: number;
  noMeGusta: number;
  comentarios: number;
  creado_en: string;
  actualizado_en: string;
  propio: boolean;
  reaccion: Reaccion | null;
};

export type RespuestaComunidad = {
  pronosticos: PronosticoPublico[];
  total: number;
  hayMas: boolean;
};

export type RespuestaPronostico = { pronostico: PronosticoPublico | null };

export type RespuestaReaccion = {
  meGusta: number;
  noMeGusta: number;
  reaccion: Reaccion | null;
};

export type RespuestaError = { error: string };
