# La Noche Dorada II

Sitio del evento y votación de pronósticos. Next.js 16 (App Router) + Tailwind 4
en el front, Supabase en el back.

## Arranque

```bash
npm install
cp .env.example .env.local   # y rellena los valores del proyecto
npm run dev
```

El contenido editorial del cartel (peleadores, fotos, fichas, arte, fechas) vive
en `lib/evento.ts`. La votación vive en Supabase.

## La votación

Ocho combates, un voto por persona y combate, entrando con Google. Los
porcentajes son públicos: se ven sin iniciar sesión, y la cuenta solo se pide al
votar. El voto se puede cambiar o retirar hasta que el combate cierre.

**Proyecto de Supabase:** `noche-dorada` (`hokvyjamnbbaxqirfbww`, us-east-1).

### Tablas

| Tabla        | Qué guarda                                                                 |
| ------------ | -------------------------------------------------------------------------- |
| `peleadores` | Los 16 del cartel. `slug` es el mismo de `lib/evento.ts`.                    |
| `combates`   | Los 8 combates, la hora de cierre y el conteo público (`votos_a`, `votos_b`, `pct_a`). |
| `votos`      | Un voto por usuario y combate. La clave primaria compuesta es la regla.      |
| `perfiles`   | Nombre y foto que devuelve Google. Lo llena un trigger sobre `auth.users`.   |

`combates.numero` (`"01"`..`"08"`) es la clave con la que la web cruza cada
combate de `lib/evento.ts` con su conteo. **Renumerar es una operación de dos
lados:** si el número cambia aquí y no allá (o al revés), los porcentajes
quedan colgados del combate equivocado y nada avisa. La clave ajena de `votos`
lleva `on update cascade`, así que renombrar un `numero` se lleva sus votos
con él; lo que no se mueve solo es `lib/evento.ts`.

Cambiar de rival a alguien **no** es renumerar: el emparejamiento es otro, así
que sus votos dejan de significar lo que decían y hay que ponerle el conteo a
cero (`votos_a = 0, votos_b = 0` y borrar sus filas de `votos`). `pct_a` es
columna generada y se recalcula sola: nunca se escribe a mano.

### Reglas que vigila la base, no el cliente

- **Un voto por combate:** la clave primaria de `votos`. No hay forma de meter
  el segundo.
- **Cierre automático:** el trigger `votacion_abierta` rechaza cualquier voto,
  cambio o retirada pasada `combates.cierra_en`. Por defecto es el inicio del
  evento; se puede adelantar combate por combate.
- **Conteo:** el trigger `contar_votos` mantiene `votos_a` y `votos_b`. Así el
  visitante anónimo ve los porcentajes sin poder leer voto por voto.
- **RLS:** el cartel y el conteo son públicos; los votos y los perfiles, solo
  los propios. Nadie ve a quién votó otra persona, ni estando logueado.

### API

Dos funciones, ambas solo para usuarios con sesión. Devuelven el combate ya
recontado, así la barra queda al día en el mismo clic:

- `votar(p_combate, p_lado)` — vota o cambia el voto.
- `quitar_voto(p_combate)` — lo retira.

`combates` está en la publicación de Realtime: los porcentajes se mueven solos
en las pestañas abiertas. `votos` nunca se emite.

### Comentarios

Cada ficha de peleador tiene comentarios (tabla `comentarios`). Leerlos es
público; comentar pide sesión con Google. Las reglas viven en la base:

- **RLS:** cualquiera ve los comentarios no ocultos; cada usuario solo inserta y
  borra los suyos. No hay edición.
- **Trigger `preparar_comentario`:** fija el autor con `auth.uid()`, copia
  nombre y foto de `perfiles` (que no es pública), limpia el texto (1 a 500
  caracteres) y rechaza un segundo comentario del mismo usuario antes de 20 s.

Para moderar desde el SQL Editor de Supabase:

```sql
-- ocultar un comentario (deja de verse en la web, no se borra)
update public.comentarios set oculto = true where id = 123;

-- ver los últimos comentarios de un peleador
select id, autor_nombre, texto, creado_en from public.comentarios
 where peleador = 'canita' order by creado_en desc limit 50;
```

### Después de la velada

Para puntuar los pronósticos, se marca el resultado real:

```sql
update public.combates set ganador = 'a' where numero = '08';
```

Para cerrar un combate antes de tiempo, se adelanta su fecha:

```sql
update public.combates set cierra_en = now() where numero = '08';
```

### Regenerar los tipos

Tras cualquier cambio de esquema:

```bash
npx supabase gen types typescript --project-id hokvyjamnbbaxqirfbww > lib/supabase/tipos.ts
```

## Compartir pronósticos

El botón "Compartir" abre un modal con WhatsApp, Instagram, Facebook y X.
Ninguna red acepta una imagen desde la web: las tres primeras reciben un
**enlace** y son ellas las que van a buscar la imagen en las etiquetas Open
Graph de esa página. Para eso existe `/pronosticos/[codigo]`; sin una URL por
quiniela, todo el mundo compartiría la misma vista previa genérica.

`codigo` es la quiniela entera: un carácter por combate (`a`, `b`, o `0` si no
lo pronosticó), del "01" al "08". Es **posicional**, así que renumerar un
combate cambia lo que dicen los enlaces ya compartidos —el mismo cuidado que
pide la tabla `combates`—. El encode y el decode viven en `lib/compartir.ts`.

La imagen la dibuja `app/pronosticos/[codigo]/opengraph-image.tsx` con
`ImageResponse`. Tres cosas que conviene saber antes de tocarla:

- El rasterizador solo entiende PNG y JPEG, y todo el arte del sitio es WebP.
  Por eso `sharp` está en `dependencies`: convierte al vuelo el logo y las
  caras, que salen de `cuerpo-<slug>.webp` recortadas a la cabeza. **No** de
  `<slug>.webp`: ese, pese al nombre, es un plano del arte tan cerrado que
  encuadra medio rostro, y en un recuadro de 58 px no se ve una cara sino un
  ojo.
- Satori llama a `.trim()` sobre cada valor de estilo, así que una sola
  propiedad con `undefined` tumba la imagen entera. Nada de
  `left: x === "left" ? 20 : undefined`.
- Las fuentes van en `assets/` y en TTF, que es lo que `ImageResponse` admite
  (no lee el WOFF2 que sirve `next/font`).

Instagram no deja publicar desde la web ni con enlace, así que es el único caso
donde hace falta el archivo: se pasa a la hoja nativa del móvil con
`navigator.share({ files })` y, en escritorio, se descarga el PNG.

La página y la imagen no se prerrenderizan en el build (`generateStaticParams`
vacío): cada código se genera la primera vez que se abre y queda cacheado una
semana. Van con `noindex, follow`, que para eso son enlaces de chat y no
páginas de buscador.

## Pendiente: habilitar Google

El esquema está aplicado y probado, pero **el acceso con Google todavía hay que
configurarlo a mano** (no se puede desde código). Hasta entonces el botón de
entrar no lleva a ninguna parte.

**1. En Google Cloud** (<https://console.cloud.google.com>)

- Crea un proyecto y ve a *APIs y servicios → Pantalla de consentimiento de
  OAuth*. Tipo **Externo**, nombre "La Noche Dorada II", correo de soporte.
  (Este paso ya está hecho: Google devuelve el código correctamente.)
- **Publica la pantalla de consentimiento** (pasarla de *Testing* a
  *Producción*). Si se queda en pruebas, solo podrán entrar los correos que
  agregues a mano como testers.
- *Credenciales → Crear credenciales → ID de cliente de OAuth → Aplicación web*.
  El único valor que importa es el URI de redireccionamiento autorizado, que
  apunta a Supabase y no al sitio (el intercambio lo hace Supabase, no la web):
  `https://hokvyjamnbbaxqirfbww.supabase.co/auth/v1/callback`
- Copia el **Client ID** y el **Client secret**.

**2. En Supabase** (*Authentication*)

- *Sign In / Providers → Google*: habilítalo y pega el ID y el secret.
- *Sign In / Providers → Email*: **deshabilítalo**. Viene activo por defecto y
  es lo único que impide que alguien se registre con correo y contraseña en vez
  de con Google.
- *URL Configuration*. Ojo aquí: si la URL de vuelta no está en la lista,
  Supabase **no da error** — manda el `code` al Site URL y el acceso se pierde.
  Acabar en `http://localhost:3000/?code=...` desde producción es exactamente
  ese síntoma.
  - Site URL: `https://la-noche-dorada-2.vercel.app`. Es solo el respaldo, pero
    si se queda en `http://localhost:3000` cualquier hueco en la lista de abajo
    despacha a los usuarios a su propia máquina.
  - Redirect URLs, con la **ruta exacta**, una por entorno:
    - `https://la-noche-dorada-2.vercel.app/auth/callback`
    - `http://localhost:3000/auth/callback`
    - `https://la-noche-dorada-2-*.vercel.app/auth/callback` (deploys de
      preview de Vercel)

  La comparación es sobre la URL entera, query incluida. Por eso `redirectTo`
  no lleva parámetros: así basta la ruta exacta y no hace falta un comodín
  `/**`, que la propia documentación de Supabase desaconseja en producción.

**3. Al desplegar**

Las dos variables de `.env.local` van también en el hosting (en Vercel,
*Settings → Environment Variables*). Son claves públicas a propósito: viajan al
navegador y lo que se puede hacer con ellas lo decide la RLS. La `service_role`
no se usa en este proyecto y no debe acabar en ninguna variable `NEXT_PUBLIC_`.

El dominio público sale de `lib/sitio.ts`: manda `NEXT_PUBLIC_SITIO` si está puesta;
si no, el dominio de producción que Vercel inyecta en cada build; y como último
respaldo `https://la-noche-dorada-2.vercel.app`. De ahí salen el canónico, el
`sitemap.xml` y el `robots.txt`.

## Google Search Console

La propiedad es `https://la-noche-dorada-2.vercel.app` (prefijo de URL),
verificada con la etiqueta `google-site-verification` que va en
`metadata.verification` de `app/layout.tsx`. No la quites: si desaparece,
Search Console pierde la verificación. Si el sitio cambia de dominio, hay que
crear una propiedad nueva para ese dominio.

## Apagar la votación

`PRONOSTICOS_ACTIVOS` en `lib/evento.ts`. En `false` la sección vuelve al estado
bloqueado —sin porcentajes, botones inertes— y no se habla con Supabase.
