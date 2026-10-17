import { Link, usePage } from '@inertiajs/react';
import {
    BookOpen,
    GraduationCap,
    House,
    Library,
    LogIn,
    LogOut,
    MessagesSquare,
    ShieldCheck,
    UserRound,
} from 'lucide-react';
import type { ReactNode } from 'react';
import type { LienCoquille } from '@/components/coquille-app';
import CoquilleApp from '@/components/coquille-app';
import { useCurrentUrl } from '@/hooks/use-current-url';
import { home, login, logout } from '@/routes';
import { edit as compte } from '@/routes/compte';
import { index as cours } from '@/routes/cours';
import { index as enseignants } from '@/routes/enseignants';
import { index as mesCours } from '@/routes/mes-cours';
import { index as moderation } from '@/routes/admin/moderation';
import { index as retoursAnciens } from '@/routes/retours-anciens';
import type { Role } from '@/types';

type LienNavigation = Omit<LienCoquille, 'actif'> & { exact?: boolean };

function liensPourRole(role: Role | null): LienNavigation[] {
    const lienCours = { titre: 'Cours', url: cours().url, icone: BookOpen };
    const lienEnseignants = {
        titre: 'Enseignants',
        url: enseignants().url,
        icone: GraduationCap,
    };
    const lienAnciens = {
        titre: 'Retours des anciens',
        url: retoursAnciens().url,
        icone: MessagesSquare,
    };

    switch (role) {
        case 'etudiant':
            return [
                {
                    titre: 'Accueil',
                    url: home().url,
                    icone: House,
                    exact: true,
                },
                lienCours,
                lienEnseignants,
                lienAnciens,
            ];
        case 'enseignant':
            return [
                { titre: 'Mes cours', url: mesCours().url, icone: Library },
                { ...lienCours, titre: 'Tous les cours' },
            ];
        case 'ancien':
            return [lienAnciens, lienCours];
        case 'admin':
            return [
                {
                    titre: 'Administration',
                    url: moderation().url,
                    icone: ShieldCheck,
                },
                lienCours,
                lienEnseignants,
                lienAnciens,
            ];
        default:
            return [lienCours];
    }
}

const lienPied =
    'flex min-h-11 items-center gap-2.5 rounded-xl px-3.5 py-2 text-sm font-medium text-white/85 no-underline hover:bg-white/10 hover:text-white';

export default function RecoLayout({ children }: { children: ReactNode }) {
    const { auth } = usePage().props;
    const { isCurrentUrl, isCurrentOrParentUrl } = useCurrentUrl();

    const liens = liensPourRole(auth.user?.role ?? null).map(
        ({ exact, ...lien }) => ({
            ...lien,
            actif: exact
                ? isCurrentUrl(lien.url)
                : isCurrentOrParentUrl(lien.url),
        }),
    );

    return (
        <CoquilleApp
            sousTitre={auth.user?.role_label}
            navigationLabel="Navigation principale"
            liens={liens}
            pied={
                auth.user ? (
                    <>
                        <Link href={compte()} className={lienPied}>
                            <UserRound className="size-4.5" aria-hidden />
                            <span className="min-w-0 truncate">
                                {auth.user.nom_complet}
                            </span>
                        </Link>
                        <Link
                            href={logout()}
                            as="button"
                            className={`${lienPied} w-full cursor-pointer text-left`}
                        >
                            <LogOut className="size-4.5" aria-hidden />
                            Se déconnecter
                        </Link>
                    </>
                ) : (
                    <Link
                        href={login()}
                        className="flex min-h-11 items-center justify-center gap-2 rounded-xl bg-white px-4 font-bold text-ink no-underline hover:bg-lagon hover:text-ink"
                    >
                        <LogIn className="size-4.5" aria-hidden />
                        Se connecter
                    </Link>
                )
            }
        >
            <div className="flex-1">{children}</div>

            <footer className="px-2 text-center text-xs text-dusk">
                RECO · Les avis sont anonymes et réservés aux membres connectés.
            </footer>
        </CoquilleApp>
    );
}
