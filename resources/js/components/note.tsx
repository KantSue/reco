import { Star } from 'lucide-react';
import { cn } from '@/lib/utils';

/** Pastille « 4 / 5 » d'un avis. */
export function NotePastille({
    note,
    className,
}: {
    note: number;
    className?: string;
}) {
    return (
        <span
            className={cn(
                'inline-flex shrink-0 items-center rounded-full bg-ink px-3 py-1 text-[13px] font-bold text-white',
                className,
            )}
        >
            {note} / 5
        </span>
    );
}

/** Cinq étoiles remplies selon une note sur 5 (arrondie à la demi-étoile). */
export function Etoiles({
    note,
    taille = 15,
    className,
}: {
    note: number;
    taille?: number;
    className?: string;
}) {
    return (
        <span
            className={cn('inline-flex gap-0.5', className)}
            role="img"
            aria-label={`${note.toLocaleString('fr-FR')} sur 5`}
        >
            {[1, 2, 3, 4, 5].map((position) => {
                const remplissage = Math.max(
                    0,
                    Math.min(1, note - position + 1),
                );

                return (
                    <span
                        key={position}
                        className="relative inline-block"
                        style={{ width: taille, height: taille }}
                    >
                        <Star
                            className="absolute inset-0 text-lilac"
                            style={{ width: taille, height: taille }}
                            strokeWidth={1.5}
                        />
                        <span
                            className="absolute inset-0 overflow-hidden"
                            style={{ width: `${remplissage * 100}%` }}
                        >
                            <Star
                                className="fill-iris text-iris"
                                style={{ width: taille, height: taille }}
                                strokeWidth={1.5}
                            />
                        </span>
                    </span>
                );
            })}
        </span>
    );
}
