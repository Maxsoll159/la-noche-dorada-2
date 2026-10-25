import Image from "next/image";

// Foto de Google o Discord; si no hay, la inicial sobre un degradado dorado.
export function AvatarUsuario({
  nombre,
  url,
  className = "size-11",
}: {
  nombre: string;
  url: string | null | undefined;
  className?: string;
}) {
  if (url) {
    return (
      <Image
        src={url}
        alt=""
        width={48}
        height={48}
        unoptimized
        referrerPolicy="no-referrer"
        className={`${className} shrink-0 rounded-full object-cover ring-2 ring-oro-profundo ring-offset-2 ring-offset-carbon`}
      />
    );
  }
  return (
    <span
      aria-hidden
      className={`${className} grid shrink-0 place-items-center rounded-full bg-gradient-to-br from-oro-claro to-oro-profundo font-display text-[18px] text-noche uppercase ring-2 ring-oro-profundo ring-offset-2 ring-offset-carbon`}
    >
      {nombre.charAt(0)}
    </span>
  );
}
