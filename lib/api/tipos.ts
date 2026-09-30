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

export type RespuestaError = { error: string };
