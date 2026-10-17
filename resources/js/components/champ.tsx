import type { ReactNode } from 'react';
import InputError from '@/components/input-error';
import { cn } from '@/lib/utils';

/** Libellé + champ + message d'erreur, au style RECO. */
export default function Champ({
    label,
    htmlFor,
    erreur,
    aide,
    className,
    children,
}: {
    label: ReactNode;
    htmlFor?: string;
    erreur?: string;
    aide?: ReactNode;
    className?: string;
    children: ReactNode;
}) {
    return (
        <div className={cn('flex flex-col gap-1.5', className)}>
            <label htmlFor={htmlFor} className="text-sm font-semibold text-ink">
                {label}
            </label>
            {children}
            {aide && !erreur && <p className="text-[13px] text-dusk">{aide}</p>}
            <InputError message={erreur} />
        </div>
    );
}
