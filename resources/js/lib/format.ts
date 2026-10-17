const dateLongue = new Intl.DateTimeFormat('fr-FR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
});

const dateCourte = new Intl.DateTimeFormat('fr-FR', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
});

const moisAnnee = new Intl.DateTimeFormat('fr-FR', {
    month: 'short',
    year: 'numeric',
});

const relatif = new Intl.RelativeTimeFormat('fr-FR', { numeric: 'auto' });

/** « 2 septembre 2026 » */
export function formatDate(iso: string): string {
    return dateLongue.format(new Date(iso));
}

/** « 2 sept. 2026 » */
export function formatDateCourte(iso: string): string {
    return dateCourte.format(new Date(iso));
}

/** « oct. 2026 » : volontairement imprécis pour ne pas aider à identifier un auteur. */
export function formatMoisAnnee(iso: string): string {
    return moisAnnee.format(new Date(iso));
}

/** « il y a 3 jours », « hier »… */
export function ilYA(iso: string): string {
    const secondes = (new Date(iso).getTime() - Date.now()) / 1000;
    const unites: [Intl.RelativeTimeFormatUnit, number][] = [
        ['year', 31_536_000],
        ['month', 2_592_000],
        ['week', 604_800],
        ['day', 86_400],
        ['hour', 3_600],
        ['minute', 60],
    ];

    for (const [unite, duree] of unites) {
        if (Math.abs(secondes) >= duree) {
            return relatif.format(Math.round(secondes / duree), unite);
        }
    }

    return "à l'instant";
}

/** 4.6 → « 4,6 » */
export function formatNote(note: number): string {
    return note.toLocaleString('fr-FR', {
        minimumFractionDigits: 1,
        maximumFractionDigits: 1,
    });
}

export function pluriel(
    nombre: number,
    singulier: string,
    pluriel?: string,
): string {
    return `${nombre} ${nombre > 1 ? (pluriel ?? `${singulier}s`) : singulier}`;
}
