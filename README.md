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
combate de `lib/evento.ts` con su conteo.

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

### Después de la velada

Para puntuar quinielas, se marca el resultado real:

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

## Pendiente: habilitar Google

El esquema está aplicado y probado, pero **el acceso con Google todavía hay que
configurarlo a mano** (no se puede desde código). Hasta entonces el botón de
entrar no lleva a ninguna parte.

**1. En Google Cloud** (<https://console.cloud.google.com>)

- Crea un proyecto y ve a *APIs y servicios → Pantalla de consentimiento de
  OAuth*. Tipo **Externo**, nombre "La Noche Dorada II", correo de soporte.
- **Publica la pantalla de consentimiento** (pasarla de *Testing* a
  *Producción*). Si se queda en pruebas, solo podrán entrar los correos que
  agregues a mano como testers.
- *Credenciales → Crear credenciales → ID de cliente de OAuth → Aplicación web*:
  - Orígenes de JavaScript autorizados: `http://localhost:3000` y el dominio
    real (`https://lanochedorada.pe`).
  - URI de redireccionamiento autorizado:
    `https://hokvyjamnbbaxqirfbww.supabase.co/auth/v1/callback`
- Copia el **Client ID** y el **Client secret**.

**2. En Supabase** (*Authentication*)

- *Sign In / Providers → Google*: habilítalo y pega el ID y el secret.
- *Sign In / Providers → Email*: **deshabilítalo**. Viene activo por defecto y
  es lo único que impide que alguien se registre con correo y contraseña en vez
  de con Google.
- *URL Configuration*:
  - Site URL: el dominio real.
  - Redirect URLs: `http://localhost:3000/**` y `https://lanochedorada.pe/**`.

**3. Al desplegar**

Las dos variables de `.env.local` van también en el hosting (en Vercel,
*Settings → Environment Variables*). Son claves públicas a propósito: viajan al
navegador y lo que se puede hacer con ellas lo decide la RLS. La `service_role`
no se usa en este proyecto y no debe acabar en ninguna variable `NEXT_PUBLIC_`.

## Apagar la votación

`PRONOSTICOS_ACTIVOS` en `lib/evento.ts`. En `false` la sección vuelve al estado
bloqueado —sin porcentajes, botones inertes— y no se habla con Supabase.
