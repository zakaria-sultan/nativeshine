import { useId } from 'react';

/** Scalable chrome lettering inspired by the client's supplied wordmark. */
export default function BrandWordmark({ className = '' }) {
  const id = useId().replace(/:/g, '');
  const url = name => `url(#${id}-${name})`;
  return (
    <svg className={`ns-wordmark ${className}`.trim()} viewBox="0 0 480 110"
      role="img" aria-label="NativeShine Ltd. Excellence is our standard!" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id={`${id}-chrome`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#a0b4bf" />
          <stop offset=".2" stopColor="#4a5a65" />
          <stop offset=".5" stopColor="#151e27" />
          <stop offset=".78" stopColor="#0c1219" />
          <stop offset="1" stopColor="#235871" />
        </linearGradient>
        <linearGradient id={`${id}-silver`} x1="0" y1="0" x2="0" y2="1">
          <stop stopColor="#ffffff" /><stop offset=".28" stopColor="#9eafb9" />
          <stop offset=".48" stopColor="#f5fdff" /><stop offset=".7" stopColor="#839eae" />
          <stop offset="1" stopColor="#edfaff" />
        </linearGradient>
        <linearGradient id={`${id}-ltd`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#8297a3" />
          <stop offset=".3" stopColor="#3e505c" />
          <stop offset=".7" stopColor="#151e25" />
          <stop offset="1" stopColor="#345a6a" />
        </linearGradient>
        <radialGradient id={`${id}-glow`}>
          <stop stopColor="#ffffff" /><stop offset=".22" stopColor="#b9f9ff" stopOpacity=".9" />
          <stop offset="1" stopColor="#06b9ef" stopOpacity="0" />
        </radialGradient>
        <linearGradient id={`${id}-blue`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#9fecff" />
          <stop offset=".25" stopColor="#049fd5" />
          <stop offset=".52" stopColor="#085d96" />
          <stop offset=".74" stopColor="#102539" />
          <stop offset=".9" stopColor="#08121f" />
          <stop offset="1" stopColor="#0b385b" />
        </linearGradient>
        <linearGradient id={`${id}-red`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#ff8070" /><stop offset=".35" stopColor="#ff342b" />
          <stop offset=".65" stopColor="#f52224" /><stop offset="1" stopColor="#d71920" />
        </linearGradient>
        <linearGradient id={`${id}-swoosh`}>
          <stop offset="0" stopColor="#111820" />
          <stop offset=".27" stopColor="#0b1219" />
          <stop offset=".46" stopColor="#143649" />
          <stop offset=".58" stopColor="#68cfe9" />
          <stop offset=".63" stopColor="#d1ecf5" />
          <stop offset=".67" stopColor="#2781a6" />
          <stop offset=".75" stopColor="#142b3e" />
          <stop offset="1" stopColor="#111820" />
        </linearGradient>
        <g id={`${id}-name`} fontFamily="Arial Black, Montserrat, Arial, sans-serif" fontWeight="900" fontStyle="italic" letterSpacing="-3">
          <text x="9" y="61" fontSize="61" textLength="209" lengthAdjust="spacingAndGlyphs" fill={url('chrome')}>NATIVE</text>
          <text x="216" y="61" fontSize="61" textLength="188" lengthAdjust="spacingAndGlyphs" fill={url('blue')}>SHINE</text>
          <text x="405" y="61" fontSize="40" textLength="65" lengthAdjust="spacingAndGlyphs" letterSpacing="-2" fill={url('ltd')}>Ltd.</text>
        </g>
        <path id={`${id}-star`} d="M0-9 1.8-2 9 0 1.8 1.8 0 9-1.8 1.8-9 0-1.8-2Z" />
      </defs>
      <g aria-hidden="true" strokeLinejoin="round" paintOrder="stroke fill">
        <use href={`#${id}-name`} stroke="#405762" strokeWidth="8.6" transform="translate(0 .8)" />
        <use href={`#${id}-name`} stroke={url('silver')} strokeWidth="7.4" />
        <use href={`#${id}-name`} stroke="#496875" strokeWidth=".55" />
        <text x="72" y="87" textLength="363" lengthAdjust="spacingAndGlyphs"
          fontFamily="Arial, sans-serif" fontWeight="900" fontStyle="italic" fontSize="25"
          fill={url('red')} stroke="#712b2b" strokeWidth=".45">Excellence is our standard</text>
        <g fill={url('blue')} stroke={url('silver')} strokeWidth="2.2">
          <path d="M445 69 459 68 449 89 440 89Z" />
          <ellipse cx="442" cy="97" rx="5.3" ry="4.8" transform="rotate(-12 442 97)" />
        </g>
        <path d="M64 92 Q237 105 432 96 Q272 117 64 92Z"
          fill={url('swoosh')} stroke="#1c3444" strokeWidth=".65" />
        <path d="M81 94 Q252 108 423 98" fill="none" stroke="#b7d2df" strokeWidth=".65" />
        <path d="M122 98 Q270 112 411 101" fill="none" stroke="#287c9f" strokeWidth=".6" />
        <g fill={url('glow')} opacity=".8">
          <circle cx="36" cy="17" r="14" /><circle cx="197" cy="15" r="15" />
          <circle cx="309" cy="18" r="12" /><circle cx="389" cy="21" r="13" />
          <ellipse cx="130" cy="99" rx="22" ry="6" />
          <ellipse cx="271" cy="103" rx="25" ry="7" />
          <ellipse cx="400" cy="101" rx="20" ry="6" />
        </g>
        <g fill="#efffff" stroke="#20a8d3" strokeWidth=".65">
          <use href={`#${id}-star`} transform="translate(36 17) scale(1.05)" />
          <use href={`#${id}-star`} transform="translate(197 15) scale(1.05)" />
          <use href={`#${id}-star`} transform="translate(309 18) scale(.9)" />
          <use href={`#${id}-star`} transform="translate(389 21) scale(.9)" />
          <use href={`#${id}-star`} transform="translate(130 99) scale(.65)" />
          <use href={`#${id}-star`} transform="translate(271 103) scale(.8)" />
          <use href={`#${id}-star`} transform="translate(400 101) scale(.65)" />
        </g>
      </g>
    </svg>
  );
}
