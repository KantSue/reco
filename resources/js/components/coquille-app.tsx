import { Link } from '@inertiajs/react';
import type { LucideIcon } from 'lucide-react';
import { Menu, X } from 'lucide-react';
import type { ReactNode } from 'react';
import { useEffect, useState } from 'react';
import RecoMark from '@/components/reco-mark';
import { cn } from '@/lib/utils';
import { home } from '@/routes';

export type LienCoquille = {
    titre: string;
    url: string;
    icone: LucideIcon;
    actif: boolean;
    badge?: number | null;
};

type Props = {
    sousTitre?: string;
    navigationLabel: string;
    liens: LienCoquille[];
    pied: ReactNode;
    children: ReactNode;
};

const fondBarre =
    'bg-linear-to-b from-[#6F5FC8] via-[#5F66B8] to-[#464C98] text-white';

function Marque({ sousTitre }: { sousTitre?: string }) {
    return (
        <Link
            href={home()}
            className="flex items-center gap-2.5 text-white no-underline hover:text-white"
        >
            <RecoMark className="size-9" />
            <span className="flex flex-col leading-tight">
                <span className="font-display text-xl font-bold tracking-[0.04em]">
                    RECO
                </span>
                {sousTitre && (
                    <span className="text-xs font-semibold text-lagon">
                        {sousTitre}
                    </span>
                )}
            </span>
        </Link>
    );
}

function Navigation({
    label,
    liens,
    onNaviguer,
}: {
    label: string;
    liens: LienCoquille[];
    onNaviguer?: () => void;
}) {
    return (
        <nav aria-label={label} className="flex flex-col gap-1">
            {liens.map((lien) => (
                <Link
                    key={lien.url}
                    href={lien.url}
                    onClick={onNaviguer}
                    aria-current={lien.actif ? 'page' : undefined}
                    className={cn(
                        'flex min-h-11 items-center gap-3 rounded-xl px-3.5 py-2.5 no-underline transition-colors',
                        lien.actif
                            ? 'bg-white/20 font-semibold text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.25),0_6px_18px_-8px_rgba(20,20,60,0.5)] ring-1 ring-white/25 hover:text-white'
                            : 'font-medium text-white/80 hover:bg-white/10 hover:text-white',
                    )}
                >
                    <lien.icone className="size-4.5 shrink-0" aria-hidden />
                    <span className="flex-1">{lien.titre}</span>
                    {!!lien.badge && (
                        <span className="rounded-full bg-dragee px-2 text-xs font-extrabold text-ink">
                            {lien.badge}
                        </span>
                    )}
                </Link>
            ))}
        </nav>
    );
}

export default function CoquilleApp({
    sousTitre,
    navigationLabel,
    liens,
    pied,
    children,
}: Props) {
    const [tiroirOuvert, setTiroirOuvert] = useState(false);

    useEffect(() => {
        if (!tiroirOuvert) {
            return;
        }

        const fermerSurEchap = (evenement: KeyboardEvent) => {
            if (evenement.key === 'Escape') {
                setTiroirOuvert(false);
            }
        };

        document.addEventListener('keydown', fermerSurEchap);
        document.body.style.overflow = 'hidden';

        return () => {
            document.removeEventListener('keydown', fermerSurEchap);
            document.body.style.overflow = '';
        };
    }, [tiroirOuvert]);

    return (
        <div className="min-h-screen text-ink lg:p-4">
            <a
                href="#contenu"
                className="sr-only z-50 rounded-md bg-white px-4 py-2 focus:not-sr-only focus:fixed focus:top-2 focus:left-2"
            >
                Aller au contenu
            </a>

            <div className="lg:flex lg:min-h-[calc(100vh-2rem)] lg:overflow-clip lg:rounded-[28px] lg:border lg:border-white/60 lg:bg-white/25 lg:shadow-[0_30px_80px_-30px_rgba(70,76,152,0.55)] lg:backdrop-blur-2xl">
                <aside
                    className={cn(
                        'hidden w-64 shrink-0 flex-col gap-8 px-4 py-6 lg:sticky lg:top-4 lg:flex lg:h-[calc(100vh-2rem)]',
                        fondBarre,
                    )}
                >
                    <div className="px-2">
                        <Marque sousTitre={sousTitre} />
                    </div>
                    <div className="-mx-1 flex-1 overflow-y-auto px-1">
                        <Navigation label={navigationLabel} liens={liens} />
                    </div>
                    <div className="flex flex-col gap-1 border-t border-white/15 pt-4">
                        {pied}
                    </div>
                </aside>

                <header
                    className={cn(
                        'sticky top-0 z-40 flex items-center justify-between gap-3 px-4 py-3 shadow-[0_8px_24px_-12px_rgba(70,76,152,0.7)] lg:hidden',
                        fondBarre,
                        'bg-linear-to-r',
                    )}
                >
                    <Marque sousTitre={sousTitre} />
                    <button
                        type="button"
                        className="flex size-11 cursor-pointer items-center justify-center rounded-xl text-white hover:bg-white/10"
                        aria-expanded={tiroirOuvert}
                        aria-controls="tiroir-navigation"
                        aria-label="Ouvrir le menu"
                        onClick={() => setTiroirOuvert(true)}
                    >
                        <Menu />
                    </button>
                </header>

                {tiroirOuvert && (
                    <div className="fixed inset-0 z-50 lg:hidden">
                        <button
                            type="button"
                            aria-label="Fermer le menu"
                            className="absolute inset-0 size-full cursor-default bg-ink/40 backdrop-blur-sm"
                            onClick={() => setTiroirOuvert(false)}
                        />
                        <div
                            id="tiroir-navigation"
                            role="dialog"
                            aria-modal="true"
                            aria-label="Menu"
                            className={cn(
                                'absolute inset-y-0 left-0 flex w-[min(20rem,86vw)] flex-col gap-6 overflow-y-auto rounded-r-[28px] px-4 py-5 shadow-2xl',
                                fondBarre,
                            )}
                        >
                            <div className="flex items-center justify-between gap-3 px-2">
                                <Marque sousTitre={sousTitre} />
                                <button
                                    type="button"
                                    aria-label="Fermer le menu"
                                    className="flex size-11 cursor-pointer items-center justify-center rounded-xl text-white hover:bg-white/10"
                                    onClick={() => setTiroirOuvert(false)}
                                >
                                    <X />
                                </button>
                            </div>
                            <Navigation
                                label={navigationLabel}
                                liens={liens}
                                onNaviguer={() => setTiroirOuvert(false)}
                            />
                            <div
                                className="mt-auto flex flex-col gap-1 border-t border-white/15 pt-4"
                                onClick={() => setTiroirOuvert(false)}
                            >
                                {pied}
                            </div>
                        </div>
                    </div>
                )}

                <div
                    id="contenu"
                    className="flex min-w-0 flex-1 flex-col gap-6 p-3 sm:p-5 lg:p-6"
                >
                    {children}
                </div>
            </div>
        </div>
    );
}
