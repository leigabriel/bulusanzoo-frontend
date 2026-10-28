import '@fontsource/fredoka/latin-600.css';
import '@fontsource/fredoka/latin-700.css';
import { PARK } from '../../config/park-theme';

const WAVES = {
    a: 'M0 80V44C120 12 240 0 380 16C540 36 620 72 800 64C980 56 1080 10 1240 8C1330 7 1396 24 1440 44V80Z',
    b: 'M0 80V30C140 62 260 74 420 52C580 30 660 0 840 10C1020 20 1120 66 1270 62C1350 60 1410 44 1440 30V80Z',
};

// Soft wavy edge that rises out of a section into the one above it.
export const Wave = ({ fill, variant = 'a', className = '' }) => (
    <svg viewBox="0 0 1440 80" preserveAspectRatio="none" aria-hidden="true" focusable="false" className={`block h-10 w-full sm:h-16 lg:h-20 ${className}`}>
        <path d={WAVES[variant] || WAVES.a} fill={fill} />
    </svg>
);

export const Leaf = ({ className = '', fill = PARK.green, style }) => (
    <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false" className={`pointer-events-none absolute hidden xl:block ${className}`} style={style}>
        <path d="M12 2C6 6 3.5 12 6 21c8-.5 14.500-7 12.500-18.500C16 2 14 2.500 12 2Z" fill={fill} />
        <path d="M12 6c-1 4-1.500 8-1 13" stroke="rgba(255,255,255,.55)" strokeWidth="1" fill="none" strokeLinecap="round" />
    </svg>
);

export const Chevron = ({ className = 'h-4 w-4' }) => (
    <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false" className={className} fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="m9 6 6 6-6 6" />
    </svg>
);

export const ArrowUpRight = ({ className = 'h-4 w-4' }) => (
    <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false" className={className} fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M7 17 17 7M8 7h9v9" />
    </svg>
);

export const PlayIcon = ({ className = 'h-4 w-4' }) => (
    <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false" className={className} fill="currentColor">
        <path d="M8 5.500v13a1 1 0 0 0 1.500.86l11-6.500a1 1 0 0 0 0-1.720l-11-6.500A1 1 0 0 0 8 5.500Z" />
    </svg>
);

// Rounded pill label used above section headings.
export const Eyebrow = ({ children, tone = 'light' }) => (
    <p className={`inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-[11px] font-semibold uppercase tracking-[0.18em] sm:text-xs ${tone === 'light' ? 'bg-white/80 text-[#1d4a2e]' : 'bg-white/15 text-[#c6fe69]'}`}>
        <span className="h-2 w-2 rounded-full bg-[#4ade80]" aria-hidden="true" />
        {children}
    </p>
);

const TITLE_SIZES = {
    xl: 'text-[clamp(2.6rem,7vw,5.5rem)]',
    lg: 'text-[clamp(2.3rem,5.5vw,4.5rem)]',
    md: 'text-[clamp(1.9rem,4vw,3.2rem)]',
};
const TITLE_SHADOWS = {
    xl: '[text-shadow:3px_3px_0_var(--shadow-color)]',
    lg: '[text-shadow:3px_3px_0_var(--shadow-color)]',
    md: '[text-shadow:2px_2px_0_var(--shadow-color)]',
};

export const SectionTitle = ({ id, eyebrow, children, tone = 'light', size = 'lg', center = false }) => (
    <div className={center ? 'flex flex-col items-center text-center' : ''}>
        {eyebrow && <Eyebrow tone={tone}>{eyebrow}</Eyebrow>}
        <h2
            id={id}
            className={`font-display font-semibold leading-[1] tracking-tight ${eyebrow ? 'mt-5' : ''} ${TITLE_SIZES[size]} ${TITLE_SHADOWS[size]} ${tone === 'light'
                ? 'text-[#1f7a3e] [--shadow-color:#c6fe69]'
                : 'text-white [--shadow-color:rgba(0,0,0,.28)]'}`}
        >
            {children}
        </h2>
    </div>
);

// A page band: coloured section with a wavy top edge, clipped decorations and a centred container.
export const Band = ({ id, labelledBy, bg, wave = true, waveVariant = 'a', dropWave = false, decor = null, className = '', innerClassName = '', children }) => (
    <section id={id} aria-labelledby={labelledBy} className={`relative ${className}`} style={{ backgroundColor: bg }}>
        {wave && <Wave fill={bg} variant={waveVariant} className="absolute inset-x-0 bottom-full -mb-px" />}
        {/* Last band only: lets the colour spill into the dark footer below with the same wavy edge. */}
        {dropWave && <Wave fill={bg} variant="b" className="absolute inset-x-0 top-full -mt-px rotate-180" />}
        <div className="relative overflow-hidden">
            {decor}
            <div className={`relative mx-auto max-w-[1280px] px-4 py-16 sm:px-6 sm:py-24 lg:px-10 ${innerClassName}`}>{children}</div>
        </div>
    </section>
);

// Big outlined words drifting behind a section, like the "POPULARITY" band in the reference.
export const Marquee = ({ words }) => (
    <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 top-1/2 -translate-y-1/2 select-none overflow-hidden">
        <div className="animate-marquee flex w-max whitespace-nowrap font-display text-[clamp(6rem,18vw,14rem)] font-bold uppercase leading-none text-transparent [-webkit-text-stroke:2px_rgba(31,122,62,0.16)]">
            {[0, 1].map((copy) => <span key={copy} className="px-8">{words}</span>)}
        </div>
    </div>
);

// Compact hero shared by the listing pages: the same painted-green wash over a blurred photo as
// Home/About, so the transparent Header stays readable on the light top edge.
export const PageHero = ({ id, photo, children, className = '' }) => (
    <section aria-labelledby={id} className={`relative isolate flex min-h-[46svh] flex-col overflow-hidden bg-[#2f7d3a] sm:min-h-[52svh] ${className}`}>
        <img src={photo} alt="" aria-hidden="true" decoding="async" className="absolute inset-0 -z-20 h-full w-full scale-110 object-cover blur-[3px]" />
        <div
            aria-hidden="true"
            className="absolute inset-0 -z-10 bg-[linear-gradient(to_bottom,rgba(196,236,124,0.94)_0%,rgba(110,196,80,0.86)_9%,rgba(40,134,56,0.88)_30%,rgba(24,104,50,0.92)_100%)]"
        />
        <div className="relative mx-auto flex w-full max-w-[1280px] flex-1 items-center justify-center px-4 pb-24 pt-28 text-center sm:px-6">
            <h1
                id={id}
                className="hero-rise font-display text-[clamp(2.75rem,10vw,7rem)] font-bold uppercase leading-[0.9] tracking-tight text-white [text-shadow:0_6px_0_rgba(16,70,34,0.38)]"
            >
                {children}
            </h1>
        </div>
    </section>
);
