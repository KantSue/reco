import type { Exigence } from '@/types';
import { cn } from '@/lib/utils';

/** Barres de niveau d'exigence (3 niveaux : faible, moyenne, élevée). */
export default function ExigenceIndicateur({
    exigence,
    className,
}: {
    exigence: Exigence;
    className?: string;
}) {
    return (
        <div
            className={cn('flex gap-1.5', className)}
            role="img"
            aria-label={`Exigence ${exigence.label.toLowerCase()} (${exigence.niveau} sur 3)`}
        >
            {[1, 2, 3].map((niveau) => (
                <span
                    key={niveau}
                    className={cn(
                        'h-2.5 flex-1 rounded',
                        niveau <= exigence.niveau ? 'bg-ink' : 'bg-lilac',
                    )}
                />
            ))}
        </div>
    );
}
