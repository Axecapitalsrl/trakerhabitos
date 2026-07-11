import Link from "next/link";

export function LogoMark({ className = "h-9 w-9" }: { className?: string }) {
  return (
    <svg viewBox="0 0 100 100" className={className} aria-hidden="true">
      <defs>
        <linearGradient
          id="rachas-g"
          x1="18"
          y1="14"
          x2="82"
          y2="92"
          gradientUnits="userSpaceOnUse"
        >
          <stop offset="0" stopColor="#40d37f" />
          <stop offset="1" stopColor="#0d9b50" />
        </linearGradient>
      </defs>
      {/* anillo de racha, con hueco arriba a la derecha */}
      <path
        d="M78 38 A32 32 0 1 1 58 23"
        fill="none"
        stroke="url(#rachas-g)"
        strokeWidth="11"
        strokeLinecap="round"
      />
      {/* llama */}
      <path
        d="M69 6 C 61 19, 80 23, 74 37 C 71 43, 62 43, 59 36 C 56 29, 63 25, 62 18 C 65 22, 68 20, 66 13 C 66 10, 68 8, 69 6 Z"
        fill="url(#rachas-g)"
      />
      {/* check */}
      <path
        d="M34 54 L45 66 L67 40"
        fill="none"
        stroke="#12241c"
        strokeWidth="10.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function Logo({ href = "/" }: { href?: string }) {
  return (
    <Link href={href} className="flex items-center gap-2 sm:gap-2.5">
      <LogoMark className="h-7 w-7 sm:h-8 sm:w-8" />
      <span className="leading-none">
        <span className="block whitespace-nowrap text-[13px] font-extrabold tracking-tight sm:text-[15px]">
          Hábitos Tracker<span className="text-brand">.</span>
        </span>
        <span className="mt-0.5 block text-[9px] font-semibold uppercase tracking-wide text-muted sm:text-[10px]">
          por Rachas
        </span>
      </span>
    </Link>
  );
}
