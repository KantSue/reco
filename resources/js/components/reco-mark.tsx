import type { SVGProps } from 'react';

/**
 * Pictogramme du logo RECO (lecteur, livre ouvert et bulle d'avis).
 * La variante « claire » est destinée aux fonds sombres.
 */
export default function RecoMark({
    variante = 'claire',
    ...props
}: SVGProps<SVGSVGElement> & { variante?: 'claire' | 'sombre' }) {
    const trait = variante === 'claire' ? '#FFFFFF' : '#23244F';
    const traitDroit = variante === 'claire' ? '#C7F3F6' : '#45477F';

    return (
        <svg viewBox="0 0 24 24" aria-hidden="true" {...props}>
            <circle cx="12" cy="4.2" r="2.6" fill={trait} />
            <path d="M7.4 8.2q4.6-2.4 9.2 0L12 11.4z" fill={trait} />
            <path
                d="M4.2 8.6v6.2a7 7 0 0 0 6.8 7"
                fill="none"
                stroke={trait}
                strokeWidth="2.2"
                strokeLinecap="round"
            />
            <path
                d="M19.8 8.6v6.2a7 7 0 0 1-6.8 7"
                fill="none"
                stroke={traitDroit}
                strokeWidth="2.2"
                strokeLinecap="round"
            />
            <path
                d="M11.3 11.6C10 10.6 8.5 10.2 6.8 10.2v7.2c1.7 0 3.2.5 4.5 1.4z"
                fill="#8077AB"
            />
            <path
                d="M12.7 11.6c1.3-1 2.8-1.4 4.5-1.4v7.2c-1.7 0-3.2.5-4.5 1.4z"
                fill="#FADCFE"
            />
            <path d="M11 21.6h2.4l-2.4 2.2z" fill="#8077AB" />
        </svg>
    );
}
