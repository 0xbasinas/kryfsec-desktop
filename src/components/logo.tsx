export function Logo({ size = 22 }: { size?: number }): React.JSX.Element {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" fill="none" aria-hidden>
      <defs>
        <linearGradient id="cj-g" x1="4" y1="2" x2="28" y2="30" gradientUnits="userSpaceOnUse">
          <stop stopColor="var(--accent)" />
          <stop offset="1" stopColor="var(--accent-2)" />
        </linearGradient>
      </defs>
      <path d="M16 2.5 4.5 7v8.2c0 7 4.9 12.6 11.5 14.3 6.6-1.7 11.5-7.3 11.5-14.3V7L16 2.5Z" fill="url(#cj-g)" fillOpacity=".14" stroke="url(#cj-g)" strokeWidth="2" strokeLinejoin="round" />
      <path d="m11 12.5 3.5 3.2-3.5 3.3" stroke="url(#cj-g)" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M17 19.5h4.5" stroke="url(#cj-g)" strokeWidth="2.2" strokeLinecap="round" />
    </svg>
  )
}
