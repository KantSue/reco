import type { ReactNode } from 'react';

/** Icône au trait (tracés Lucide, grille 24×24) placée dans l'illustration. */
function Icone({
    x,
    y,
    taille,
    couleur,
    traces,
}: {
    x: number;
    y: number;
    taille: number;
    couleur: string;
    traces: string[];
}) {
    return (
        <g
            transform={`translate(${x} ${y}) scale(${taille / 24})`}
            fill="none"
            stroke={couleur}
            strokeWidth={1.6}
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            {traces.map((trace) => (
                <path key={trace} d={trace} />
            ))}
        </g>
    );
}

const BULLE_QUESTION = [
    'M7.9 20A9 9 0 1 0 4 16.1L2 22Z',
    'M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3',
    'M12 17h.01',
];
const LIVRE = [
    'M12 7v14',
    'M3 18a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1h5a4 4 0 0 1 4 4 4 4 0 0 1 4-4h5a1 1 0 0 1 1 1v13a1 1 0 0 1-1 1h-6a3 3 0 0 0-3 3 3 3 0 0 0-3-3z',
];
const ETOILE = [
    'M11.525 2.295a.53.53 0 0 1 .95 0l2.31 4.679a2.123 2.123 0 0 0 1.595 1.16l5.166.756a.53.53 0 0 1 .294.904l-3.736 3.638a2.123 2.123 0 0 0-.611 1.878l.882 5.14a.53.53 0 0 1-.771.56l-4.618-2.428a2.122 2.122 0 0 0-1.973 0L6.396 21.01a.53.53 0 0 1-.77-.56l.881-5.139a2.122 2.122 0 0 0-.611-1.879L2.16 9.795a.53.53 0 0 1 .294-.906l5.165-.755a2.122 2.122 0 0 0 1.597-1.16z',
];
const AMPOULE = [
    'M15 14c.2-1 .7-1.7 1.5-2.5 1-.9 1.5-2.2 1.5-3.5A6 6 0 0 0 6 8c0 1 .2 2.2 1.5 3.5.7.7 1.3 1.5 1.5 2.5',
    'M9 18h6',
    'M10 22h4',
];
const TOQUE = [
    'M21.42 10.922a1 1 0 0 0-.019-1.838L12.83 5.18a2 2 0 0 0-1.66 0L2.6 9.08a1 1 0 0 0 0 1.832l8.57 3.908a2 2 0 0 0 1.66 0z',
    'M22 10v6',
    'M6 12.5V16a6 3 0 0 0 12 0v-3.5',
];
const PLUS = ['M12 5v14', 'M5 12h14'];

/** [x, y] des étoiles reliées en constellations. */
const CONSTELLATIONS: [number, number][][] = [
    [
        [250, 190],
        [340, 152],
        [442, 204],
        [492, 274],
    ],
    [
        [536, 680],
        [602, 626],
        [640, 700],
    ],
    [
        [134, 520],
        [96, 598],
    ],
];

/** Illustration du panneau de connexion, en verre sombre aux couleurs de la palette. */
function Illustration() {
    return (
        <aside
            aria-hidden="true"
            className="bandeau relative m-4 ml-0 hidden flex-1 overflow-hidden rounded-[32px] border border-white/20 shadow-[0_30px_80px_-30px_rgba(35,36,79,0.8)] lg:block"
        >
            <div
                className="absolute inset-0 opacity-60"
                style={{
                    backgroundImage:
                        'linear-gradient(rgb(255 255 255 / 0.04) 1px, transparent 1px), linear-gradient(90deg, rgb(255 255 255 / 0.04) 1px, transparent 1px)',
                    backgroundSize: '56px 56px',
                }}
            />
            <svg
                viewBox="0 0 720 820"
                preserveAspectRatio="xMidYMid slice"
                className="absolute inset-0 size-full"
            >
                <defs>
                    <filter
                        id="lueur"
                        x="-50%"
                        y="-50%"
                        width="200%"
                        height="200%"
                    >
                        <feGaussianBlur stdDeviation="14" result="flou" />
                        <feMerge>
                            <feMergeNode in="flou" />
                            <feMergeNode in="SourceGraphic" />
                        </feMerge>
                    </filter>
                </defs>

                {CONSTELLATIONS.map((points) => (
                    <g key={points.join()}>
                        <polyline
                            points={points
                                .map((point) => point.join(','))
                                .join(' ')}
                            fill="none"
                            stroke="#838BCC"
                            strokeOpacity="0.55"
                            strokeWidth="1.2"
                        />
                        {points.map(([x, y]) => (
                            <circle
                                key={`${x}-${y}`}
                                cx={x}
                                cy={y}
                                r="3.2"
                                fill="#838BCC"
                            />
                        ))}
                    </g>
                ))}

                <Icone
                    x={232}
                    y={56}
                    taille={64}
                    couleur="#B8AEE3"
                    traces={BULLE_QUESTION}
                />
                <Icone
                    x={560}
                    y={96}
                    taille={66}
                    couleur="#FADCFE"
                    traces={LIVRE}
                />
                <Icone
                    x={330}
                    y={112}
                    taille={30}
                    couleur="#FEDF99"
                    traces={ETOILE}
                />
                <Icone
                    x={598}
                    y={312}
                    taille={44}
                    couleur="#FEDF99"
                    traces={AMPOULE}
                />
                <Icone
                    x={566}
                    y={560}
                    taille={50}
                    couleur="#FADCFE"
                    traces={ETOILE}
                />
                <Icone
                    x={200}
                    y={618}
                    taille={62}
                    couleur="#B8AEE3"
                    traces={TOQUE}
                />
                {[
                    [140, 80, '#C7F3F6'],
                    [652, 236, '#FEDF99'],
                    [280, 258, '#C7F3F6'],
                    [192, 430, '#C7F3F6'],
                    [600, 480, '#C7F3F6'],
                    [436, 660, '#FADCFE'],
                ].map(([x, y, couleur]) => (
                    <Icone
                        key={`${x}-${y}`}
                        x={Number(x)}
                        y={Number(y)}
                        taille={20}
                        couleur={String(couleur)}
                        traces={PLUS}
                    />
                ))}

                <g
                    transform="translate(70 0)"
                    filter="url(#lueur)"
                    fill="none"
                    stroke="#F4F2FF"
                    strokeWidth="20"
                    strokeLinecap="round"
                >
                    <path d="M310 340 A 82 82 0 1 1 438 404 C 404 426 392 446 392 482 L 392 500" />
                    <path d="M392 570 h.01" strokeWidth="24" />
                </g>

                {[
                    [34, 520, 46],
                    [84, 466, 38],
                    [124, 422, 30],
                    [156, 386, 23],
                    [178, 360, 16],
                    [194, 342, 10],
                ].map(([x, y, r]) => (
                    <g key={`${x}-${y}`}>
                        <circle cx={x + 5} cy={y + 7} r={r} fill="#B8AEE3" />
                        <circle cx={x} cy={y} r={r} fill="#FFFFFF" />
                    </g>
                ))}
                <g transform="translate(176 216) scale(5)">
                    <g
                        className="motion-safe:animate-[flotter_6s_ease-in-out_infinite]"
                        stroke="#23244F"
                        strokeWidth="0.55"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    >
                        <path
                            d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z"
                            fill="#FADCFE"
                        />
                        <path
                            d="M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0z"
                            fill="#838BCC"
                        />
                        <path
                            d="M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5z"
                            fill="#838BCC"
                        />
                        <path
                            d="m12 15-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z"
                            fill="#F4F2FF"
                        />
                        <circle cx="16.4" cy="7.6" r="1.7" fill="#A4C6E9" />
                    </g>
                </g>
            </svg>

            <div className="absolute right-10 bottom-10 left-10 max-w-[460px] rounded-3xl border border-white/20 bg-white/10 p-6 shadow-[inset_0_1px_0_rgba(255,255,255,0.25)] backdrop-blur-xl">
                <p className="m-0 mb-2 text-xs font-bold tracking-[0.14em] text-lagon uppercase">
                    Avis anonymes · Fiches à jour
                </p>
                <p className="m-0 font-display text-[28px] leading-tight font-bold text-white">
                    L'expérience des étudiants, avant de choisir vos cours.
                </p>
            </div>
        </aside>
    );
}

export default function AuthLayout({ children }: { children: ReactNode }) {
    return (
        <div className="flex min-h-screen text-ink">
            <main className="flex w-full flex-col gap-6 px-4 pt-8 pb-6 sm:px-10 lg:w-[46%] lg:max-w-[640px] lg:min-w-[460px] lg:px-12">
                <div className="flex flex-1 items-center justify-center">
                    <div className="carte w-full max-w-[440px] p-7 sm:p-9">
                        {children}
                    </div>
                </div>
                <footer className="text-center text-xs text-dusk">
                    © 2026 RECO · Plateforme interne de l'université
                </footer>
            </main>
            <Illustration />
        </div>
    );
}
