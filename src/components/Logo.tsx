interface LogoProps {
  size?: number;
  className?: string;
  showBackground?: boolean;
}

export function Logo({ size = 32, className = "", showBackground = true }: LogoProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden
    >
      {showBackground && (
        <>
          <rect width="32" height="32" rx="8" fill="#0d1117" />
          <rect
            x="0.5"
            y="0.5"
            width="31"
            height="31"
            rx="7.5"
            stroke="#00d4aa"
            strokeOpacity="0.25"
          />
        </>
      )}
      {/* Pattern graph nodes */}
      <circle cx="16" cy="7" r="2.25" fill="#00d4aa" />
      <circle cx="9" cy="23" r="2" fill="#00d4aa" fillOpacity="0.85" />
      <circle cx="23" cy="23" r="2" fill="#00d4aa" fillOpacity="0.85" />
      <circle cx="16" cy="17" r="1.75" fill="#6366f1" />
      {/* Connections — algorithm / pattern links */}
      <path
        d="M16 9.2 L9.8 21.2 M16 9.2 L22.2 21.2 M9.8 21.2 L16 18.6 L22.2 21.2"
        stroke="#00d4aa"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
        opacity="0.9"
      />
      {/* A crossbar */}
      <path
        d="M11.5 17.5 H20.5"
        stroke="#0d1117"
        strokeWidth="2.2"
        strokeLinecap="round"
      />
      <path
        d="M11.5 17.5 H20.5"
        stroke="#00d4aa"
        strokeWidth="1.2"
        strokeLinecap="round"
        opacity="0.55"
      />
    </svg>
  );
}

export function LogoMark({ size = 32, className = "" }: Omit<LogoProps, "showBackground">) {
  return <Logo size={size} className={className} showBackground={false} />;
}
