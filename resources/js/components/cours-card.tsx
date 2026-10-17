import { Link } from '@inertiajs/react';
import { Clock } from 'lucide-react';
import CoursController from '@/actions/App/Http/Controllers/CoursController';
import { Etoiles } from '@/components/note';
import { formatDateCourte, formatNote, pluriel } from '@/lib/format';
import type { Cours } from '@/types';

export default function CoursCard({
    cours,
    avecNotes = true,
}: {
    cours: Cours;
    avecNotes?: boolean;
}) {
    return (
        <Link
            href={CoursController.show(cours.id)}
            className="carte group flex flex-col gap-3.5 p-[22px] text-ink no-underline transition-shadow hover:text-ink hover:shadow-[0_8px_28px_rgba(27,14,32,0.08)]"
        >
            <div className="flex items-center justify-between gap-2">
                <span className="rounded-md bg-lavender px-2.5 py-1 text-xs font-bold tracking-[0.04em]">
                    UE {cours.code_ue}
                </span>
                <span className="text-xs text-plum">
                    {cours.filiere?.niveau} · S{cours.semestre}
                </span>
            </div>
            <div>
                <h3 className="m-0 mb-1 font-display text-[21px] leading-tight font-bold group-hover:underline">
                    {cours.intitule}
                </h3>
                <p className="m-0 text-sm text-plum">
                    {cours.enseignant?.nom_complet ?? 'Enseignant à désigner'}
                    {cours.filiere && ` · ${cours.filiere.nom}`}
                </p>
            </div>

            {avecNotes && cours.nb_avis !== undefined && (
                <div className="flex min-h-11 items-center gap-2.5">
                    {cours.moyenne != null ? (
                        <>
                            <span className="font-display text-3xl font-extrabold">
                                {formatNote(cours.moyenne)}
                            </span>
                            <div className="flex flex-col">
                                <Etoiles note={cours.moyenne} />
                                <span className="text-xs text-plum">
                                    {pluriel(cours.nb_avis, 'avis', 'avis')}
                                </span>
                            </div>
                        </>
                    ) : (
                        <span className="text-[13px] text-plum">
                            {pluriel(cours.nb_avis, 'avis', 'avis')} · moyenne
                            affichée dès 5 avis
                        </span>
                    )}
                </div>
            )}

            <div className="flex flex-wrap gap-1.5">
                <span className="rounded-full border border-lilac px-2.5 py-1 text-xs font-semibold">
                    Exigence : {cours.exigence.label.toLowerCase()}
                </span>
            </div>

            <p className="m-0 mt-auto flex items-center gap-1.5 border-t border-haze pt-3 text-xs text-plum">
                <Clock className="size-3.5" aria-hidden />
                {cours.est_perime
                    ? 'Fiche non mise à jour depuis plus de 12 mois'
                    : `Fiche mise à jour le ${formatDateCourte(cours.date_maj)}`}
            </p>
        </Link>
    );
}
