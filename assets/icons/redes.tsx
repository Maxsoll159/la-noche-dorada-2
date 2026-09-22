import { IconoRelleno, IconoTrazo, type PropsIcono } from "./base";
import { IconoExterno } from "./flechas";

export function IconoTikTok(props: PropsIcono) {
  return (
    <IconoRelleno {...props}>
      <path d="M16.5 2h-3v13a2.5 2.5 0 1 1-2.5-2.5c.3 0 .5 0 .8.1V9.5a5.6 5.6 0 1 0 4.7 5.5V8.6c1 .7 2.2 1.1 3.5 1.2V6.6c-2-.2-3.5-1.9-3.5-4Z" />
    </IconoRelleno>
  );
}

export function IconoInstagram(props: PropsIcono) {
  return (
    <IconoTrazo {...props}>
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.5" cy="6.5" r="1.2" fill="currentColor" stroke="none" />
    </IconoTrazo>
  );
}

export function IconoYouTube(props: PropsIcono) {
  return (
    <IconoRelleno {...props}>
      <path d="M22 12s0-3.2-.4-4.7a2.5 2.5 0 0 0-1.7-1.7C18.4 5.2 12 5.2 12 5.2s-6.4 0-7.9.4A2.5 2.5 0 0 0 2.4 7.3C2 8.8 2 12 2 12s0 3.2.4 4.7a2.5 2.5 0 0 0 1.7 1.7c1.5.4 7.9.4 7.9.4s6.4 0 7.9-.4a2.5 2.5 0 0 0 1.7-1.7C22 15.2 22 12 22 12ZM10 15V9l5.2 3L10 15Z" />
    </IconoRelleno>
  );
}

export function IconoKick(props: PropsIcono) {
  return (
    <IconoRelleno {...props}>
      <path d="M1.333 0h8v5.333H12V2.667h2.667V0h8v8H20v2.667h-2.667v2.666H20V16h2.667v8h-8v-2.667H12v-2.666H9.333V24h-8Z" />
    </IconoRelleno>
  );
}

export function IconoX(props: PropsIcono) {
  return (
    <IconoRelleno {...props}>
      <path d="M17.53 3h3.18l-6.95 7.95L22 21h-6.4l-5.01-6.55L4.85 21H1.66l7.43-8.5L2 3h6.56l4.53 5.99L17.53 3Zm-1.12 16.06h1.76L7.67 4.84H5.78l10.63 14.22Z" />
    </IconoRelleno>
  );
}

export function IconoFacebook(props: PropsIcono) {
  return (
    <IconoRelleno {...props}>
      <path d="M22 12.06C22 6.5 17.52 2 12 2S2 6.5 2 12.06c0 5.02 3.66 9.18 8.44 9.94v-7.03H7.9v-2.91h2.54V9.85c0-2.52 1.49-3.91 3.77-3.91 1.09 0 2.24.2 2.24.2v2.46h-1.26c-1.24 0-1.63.78-1.63 1.57v1.89h2.78l-.45 2.91h-2.33V22c4.78-.76 8.44-4.92 8.44-9.94Z" />
    </IconoRelleno>
  );
}

export function IconoWhatsApp(props: PropsIcono) {
  return (
    <IconoRelleno {...props}>
      <path d="M12.04 2C6.6 2 2.18 6.42 2.18 11.86c0 1.74.46 3.44 1.33 4.94L2 22l5.34-1.4a9.9 9.9 0 0 0 4.7 1.19h.01c5.43 0 9.85-4.42 9.85-9.86 0-2.63-1.03-5.11-2.89-6.97A9.78 9.78 0 0 0 12.04 2Zm0 1.82c2.15 0 4.17.84 5.69 2.36a7.98 7.98 0 0 1 2.35 5.68c0 4.44-3.6 8.04-8.05 8.04a8.03 8.03 0 0 1-4.1-1.12l-.3-.18-3.04.8.81-2.96-.19-.3a8 8 0 0 1-1.23-4.28c0-4.43 3.61-8.04 8.06-8.04Zm-2.5 4.02c-.16 0-.42.06-.64.3-.22.24-.84.82-.84 2s.86 2.32.98 2.48c.12.16 1.68 2.56 4.07 3.59.57.24 1.01.39 1.36.5.57.18 1.09.15 1.5.09.46-.07 1.42-.58 1.62-1.14.2-.56.2-1.03.14-1.13-.06-.1-.22-.16-.46-.28-.24-.12-1.42-.7-1.64-.78-.22-.08-.38-.12-.54.12-.16.24-.62.78-.76.94-.14.16-.28.18-.52.06-.24-.12-1.01-.37-1.92-1.19-.71-.63-1.19-1.41-1.33-1.65-.14-.24-.02-.37.1-.49.11-.11.24-.28.36-.42.12-.14.16-.24.24-.4.08-.16.04-.3-.02-.42-.06-.12-.54-1.3-.74-1.77-.19-.46-.38-.4-.53-.41h-.46Z" />
    </IconoRelleno>
  );
}

export function IconoRed({
  plataforma,
  ...props
}: PropsIcono & { plataforma: string }) {
  const p = plataforma.toLowerCase();
  if (p.includes("tiktok")) return <IconoTikTok {...props} />;
  if (p.includes("instagram")) return <IconoInstagram {...props} />;
  if (p.includes("youtube")) return <IconoYouTube {...props} />;
  if (p.includes("kick")) return <IconoKick {...props} />;
  if (p === "x" || p.includes("twitter")) return <IconoX {...props} />;
  return <IconoExterno strokeWidth={2.2} {...props} />;
}
