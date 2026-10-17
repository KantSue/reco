import { Link } from '@inertiajs/react';
import { LockKeyhole, MessageSquareReply } from 'lucide-react';
import type { ReactNode } from 'react';
import CoursController from '@/actions/App/Http/Controllers/CoursController';
import { NotePastille } from '@/components/note';
import { formatDateCourte, ilYA } from '@/lib/format';
import { cn } from '@/lib/utils';
import type { Avis } from '@/types';

export default function AvisCard({
    avis,
    afficherCours = false,
    actions,
    children,
    className,
}: {
    avis: Avis;
    afficherCours?: boolean;
    actions?: ReactNode;
    children?: ReactNode;
    className?: string;
}) {
    return (
        <article
            className={cn(
                'carte flex flex-col gap-3 p-5 sm:p-[22px]',
                className,
            )}
        >
            <div className="flex flex-wrap items-center justify-between gap-2">
                {afficherCours && avis.cours ? (
                    <Link
                        href={CoursController.show(avis.cours.id)}
                        className="font-bold text-ink no-underline hover:underline"
                    >
                        {avis.cours.intitule} · UE {avis.cours.code_ue}
                    </Link>
                ) : (
                    <div className="flex items-center gap-2.5">
                        <span className="flex size-9 items-center justify-center rounded-full bg-haze">
                            <LockKeyhole
                                className="size-4 text-plum"
                                aria-hidden
                            />
                        </span>
                        <div className="flex flex-col leading-tight">
                            <strong className="text-sm">
                                {avis.est_le_mien
                                    ? 'Votre avis (anonyme pour les autres)'
                                    : 'Étudiant anonyme'}
                            </strong>
                            <span className="text-xs text-plum">
                                {[avis.periode, ilYA(avis.date)]
                                    .filter(Boolean)
                                    .join(' · ')}
                                {avis.modifie && ' · modifié'}
                            </span>
                        </div>
                    </div>
                )}
                <NotePastille note={avis.note} />
            </div>

            <p className="m-0 break-words whitespace-pre-line text-ink">
                {avis.commentaire}
            </p>

            {afficherCours && (
                <div className="flex items-center gap-2 text-[13px] text-plum">
                    <LockKeyhole className="size-4" aria-hidden />
                    <span>Étudiant anonyme · {ilYA(avis.date)}</span>
                </div>
            )}

            {avis.reponse && (
                <div className="ml-0 flex flex-col gap-1 rounded-xl bg-mist px-4 py-3.5 sm:ml-4">
                    <strong className="flex items-center gap-1.5 text-[13px]">
                        <MessageSquareReply
                            className="size-4 text-iris"
                            aria-hidden
                        />
                        Réponse de l'enseignant
                        {avis.reponse.enseignant &&
                            ` · ${avis.reponse.enseignant}`}
                        <span className="font-normal text-plum">
                            · {formatDateCourte(avis.reponse.date)}
                        </span>
                    </strong>
                    <p className="m-0 text-sm whitespace-pre-line">
                        {avis.reponse.texte}
                    </p>
                </div>
            )}

            {children}

            {actions && (
                <div className="flex flex-wrap justify-end gap-1">
                    {actions}
                </div>
            )}
        </article>
    );
}
