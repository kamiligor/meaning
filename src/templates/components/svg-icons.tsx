interface IconProps {
  color: string;
  size?: number;
}

export function ClockIcon({ color, size = 110 }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 90 90"
      fill="none"
    >
      <circle cx="45" cy="45" r="40" stroke={color} strokeWidth="2" opacity="0.3" />
      <circle cx="45" cy="45" r="32" stroke={color} strokeWidth="1.2" opacity="0.15" />
      <line x1="45" y1="45" x2="45" y2="22" stroke={color} strokeWidth="2.5" strokeLinecap="round" opacity="0.8" />
      <line x1="45" y1="45" x2="62" y2="45" stroke={color} strokeWidth="2" strokeLinecap="round" opacity="0.5" />
      <circle cx="45" cy="45" r="3.5" fill={color} opacity="0.7" />
      <circle cx="45" cy="10" r="2" fill={color} opacity="0.2" />
      <circle cx="80" cy="45" r="2" fill={color} opacity="0.2" />
      <circle cx="45" cy="80" r="2" fill={color} opacity="0.2" />
      <circle cx="10" cy="45" r="2" fill={color} opacity="0.2" />
    </svg>
  );
}

export function SunIcon({ color, size = 80 }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 70 70"
      fill="none"
    >
      <circle cx="35" cy="35" r="14" fill={color} opacity="0.25" />
      <circle cx="35" cy="35" r="8" fill={color} opacity="0.5" />
      <line x1="35" y1="8" x2="35" y2="15" stroke={color} strokeWidth="2" strokeLinecap="round" opacity="0.4" />
      <line x1="35" y1="55" x2="35" y2="62" stroke={color} strokeWidth="2" strokeLinecap="round" opacity="0.4" />
      <line x1="8" y1="35" x2="15" y2="35" stroke={color} strokeWidth="2" strokeLinecap="round" opacity="0.4" />
      <line x1="55" y1="35" x2="62" y2="35" stroke={color} strokeWidth="2" strokeLinecap="round" opacity="0.4" />
      <line x1="15.9" y1="15.9" x2="20.8" y2="20.8" stroke={color} strokeWidth="1.5" strokeLinecap="round" opacity="0.3" />
      <line x1="49.2" y1="49.2" x2="54.1" y2="54.1" stroke={color} strokeWidth="1.5" strokeLinecap="round" opacity="0.3" />
      <line x1="54.1" y1="15.9" x2="49.2" y2="20.8" stroke={color} strokeWidth="1.5" strokeLinecap="round" opacity="0.3" />
      <line x1="20.8" y1="49.2" x2="15.9" y2="54.1" stroke={color} strokeWidth="1.5" strokeLinecap="round" opacity="0.3" />
    </svg>
  );
}

export function BrainIcon({ color, size = 110 }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 90 90"
      fill="none"
    >
      <circle cx="35" cy="35" r="18" stroke={color} strokeWidth="1.5" opacity="0.3" />
      <circle cx="55" cy="35" r="18" stroke={color} strokeWidth="1.5" opacity="0.3" />
      <circle cx="35" cy="55" r="14" stroke={color} strokeWidth="1.5" opacity="0.2" />
      <circle cx="55" cy="55" r="14" stroke={color} strokeWidth="1.5" opacity="0.2" />
      <line x1="45" y1="20" x2="45" y2="70" stroke={color} strokeWidth="1.5" opacity="0.4" />
      <circle cx="45" cy="45" r="5" fill={color} opacity="0.5" />
    </svg>
  );
}

export function HeartIcon({ color, size = 110 }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 90 90"
      fill="none"
    >
      <path
        d="M45 75 C45 75 15 55 15 35 C15 22 25 15 35 15 C40 15 44 18 45 22 C46 18 50 15 55 15 C65 15 75 22 75 35 C75 55 45 75 45 75Z"
        stroke={color}
        strokeWidth="2"
        opacity="0.4"
        fill="none"
      />
      <path
        d="M45 65 C45 65 25 50 25 37 C25 28 32 23 38 23 C42 23 44.5 25.5 45 28 C45.5 25.5 48 23 52 23 C58 23 65 28 65 37 C65 50 45 65 45 65Z"
        fill={color}
        opacity="0.2"
      />
    </svg>
  );
}

export function LeafIcon({ color, size = 110 }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 90 90"
      fill="none"
    >
      <path
        d="M20 70 Q20 30 50 15 Q80 30 80 70"
        stroke={color}
        strokeWidth="2"
        opacity="0.3"
        fill="none"
      />
      <path
        d="M30 65 Q30 38 50 25 Q70 38 70 65"
        fill={color}
        opacity="0.15"
      />
      <line x1="50" y1="25" x2="50" y2="70" stroke={color} strokeWidth="1.5" opacity="0.4" />
      <line x1="50" y1="40" x2="38" y2="52" stroke={color} strokeWidth="1" opacity="0.3" />
      <line x1="50" y1="50" x2="62" y2="58" stroke={color} strokeWidth="1" opacity="0.3" />
    </svg>
  );
}

export const iconMap: Record<string, (props: IconProps) => React.ReactElement> = {
  clock: ClockIcon,
  sun: SunIcon,
  brain: BrainIcon,
  heart: HeartIcon,
  leaf: LeafIcon,
};
