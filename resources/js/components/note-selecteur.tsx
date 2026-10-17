import { Star } from 'lucide-react';
import { useState } from 'react';
import { cn } from '@/lib/utils';

const LIBELLES = [
    '',
    'Très décevant',
    'Décevant',
    'Correct',
    'Bien',
    'Excellent',
];

export default function NoteSelecteur({
    valeurInitiale,
    invalide,
}: {
    valeurInitiale?: number;
    invalide?: boolean;
}) {
    const [note, setNote] = useState(valeurInitiale ?? 0);
    const [survol, setSurvol] = useState(0);
    const affichee = survol || note;

    return (
        <fieldset aria-invalid={invalide} className="flex flex-col gap-1.5">
            <legend className="mb-1.5 text-sm font-semibold">Votre note</legend>
            <div className="flex items-center gap-3">
                <div className="flex" onMouseLeave={() => setSurvol(0)}>
                    {[1, 2, 3, 4, 5].map((valeur) => (
                        <label
                            key={valeur}
                            className="flex size-11 cursor-pointer items-center justify-center rounded-lg has-focus-visible:outline-2 has-focus-visible:outline-iris"
                            onMouseEnter={() => setSurvol(valeur)}
                        >
                            <input
                                type="radio"
                                name="note"
                                value={valeur}
                                checked={note === valeur}
                                onChange={() => setNote(valeur)}
                                className="sr-only"
                            />
                            <span className="sr-only">
                                {valeur} sur 5 : {LIBELLES[valeur]}
                            </span>
                            <Star
                                aria-hidden
                                strokeWidth={1.6}
                                className={cn(
                                    'size-8 transition-colors',
                                    valeur <= affichee
                                        ? 'fill-iris text-iris'
                                        : 'text-lilac',
                                )}
                            />
                        </label>
                    ))}
                </div>
                <span
                    className="text-sm font-semibold text-plum"
                    aria-live="polite"
                >
                    {affichee > 0
                        ? `${affichee} / 5 · ${LIBELLES[affichee]}`
                        : ''}
                </span>
            </div>
        </fieldset>
    );
}
