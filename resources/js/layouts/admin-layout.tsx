import { Link, usePage } from '@inertiajs/react';
import {
    BarChart3,
    BookOpen,
    CalendarRange,
    ExternalLink,
    LogOut,
    MessageSquareWarning,
    Megaphone,
    Users,
} from 'lucide-react';
import type { ReactNode } from 'react';
import CoquilleApp from '@/components/coquille-app';
import { useCurrentUrl } from '@/hooks/use-current-url';
import { logout } from '@/routes';
import { index as comptes } from '@/routes/admin/comptes';
import { index as coursAdmin } from '@/routes/admin/cours';
import { index as moderation } from '@/routes/admin/moderation';
import { index as periodes } from '@/routes/admin/periodes';
import { index as statistiques } from '@/routes/admin/statistiques';
import { index as suites } from '@/routes/admin/suites';
import { index as cours } from '@/routes/cours';

const LIENS = [
    { titre: 'Modération', url: moderation().url, icone: MessageSquareWarning },
    {
        titre: "Périodes d'évaluation",
        url: periodes().url,
        icone: CalendarRange,
    },
    { titre: 'Suite donnée', url: suites().url, icone: Megaphone },
    { titre: 'Comptes', url: comptes().url, icone: Users },
    { titre: 'Cours et filières', url: coursAdmin().url, icone: BookOpen },
    { titre: 'Statistiques', url: statistiques().url, icone: BarChart3 },
];

const lienPied =
    'flex min-h-11 items-center gap-2.5 rounded-xl px-3.5 py-2 text-sm font-medium text-white/85 no-underline hover:bg-white/10 hover:text-white';

export default function AdminLayout({ children }: { children: ReactNode }) {
    const { auth, avisATraiter } = usePage().props;
    const { isCurrentOrParentUrl } = useCurrentUrl();

    return (
        <CoquilleApp
            sousTitre="Administration"
            navigationLabel="Administration"
            liens={LIENS.map((lien) => ({
                ...lien,
                actif: isCurrentOrParentUrl(lien.url),
                badge: lien.url === moderation().url ? avisATraiter : undefined,
            }))}
            pied={
                <>
                    <Link href={cours()} className={lienPied}>
                        <ExternalLink className="size-4.5" aria-hidden />
                        Voir le site
                    </Link>
                    <p className="m-0 truncate px-3.5 text-xs text-lagon">
                        {auth.user?.nom_complet}
                    </p>
                    <Link
                        href={logout()}
                        as="button"
                        className={`${lienPied} w-full cursor-pointer text-left`}
                    >
                        <LogOut className="size-4.5" aria-hidden />
                        Se déconnecter
                    </Link>
                </>
            }
        >
            <main className="mx-auto flex w-full max-w-275 flex-col gap-6">
                {children}
            </main>
        </CoquilleApp>
    );
}

export function EnTeteAdmin({
    titre,
    description,
    actions,
}: {
    titre: string;
    description?: ReactNode;
    actions?: ReactNode;
}) {
    return (
        <div className="flex flex-wrap items-end justify-between gap-3">
            <div className="min-w-0">
                <h1 className="m-0 font-display text-[28px] leading-tight font-bold sm:text-4xl">
                    {titre}
                </h1>
                {description && (
                    <p className="mt-1 mb-0 max-w-170 text-sm text-plum sm:text-base">
                        {description}
                    </p>
                )}
            </div>
            {actions}
        </div>
    );
}
