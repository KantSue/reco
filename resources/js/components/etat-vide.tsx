import type { LucideIcon } from 'lucide-react';
import type { ReactNode } from 'react';

export default function EtatVide({
    icone: Icone,
    titre,
    children,
}: {
    icone: LucideIcon;
    titre: string;
    children?: ReactNode;
}) {
    return (
        <div className="carte flex flex-col items-center gap-2 px-6 py-10 text-center">
            <span className="mb-1 flex size-12 items-center justify-center rounded-xl bg-haze">
                <Icone className="size-6 text-plum" aria-hidden />
            </span>
            <p className="m-0 font-display text-lg font-bold">{titre}</p>
            {children && (
                <div className="max-w-md text-sm text-plum">{children}</div>
            )}
        </div>
    );
}
