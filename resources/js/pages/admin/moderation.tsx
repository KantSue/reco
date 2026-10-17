import { Head, Link } from '@inertiajs/react';
import { CheckCircle2, EyeOff } from 'lucide-react';
import type { ReactNode } from 'react';
import ModerationController from '@/actions/App/Http/Controllers/Admin/ModerationController';
import CoursController from '@/actions/App/Http/Controllers/CoursController';
import EtatVide from '@/components/etat-vide';
import { NotePastille } from '@/components/note';
import { EnTeteAdmin } from '@/layouts/admin-layout';
import { formatDate, ilYA, pluriel } from '@/lib/format';
import { cn } from '@/lib/utils';
import { index as periodes } from '@/routes/admin/periodes';
import { index as statistiques } from '@/routes/admin/statistiques';
import type { Avis } from '@/types';

type Props = {
    aTraiter: Avis[];
    masques: Avis[];
    compteurs: {
        a_traiter: number;
        masques_automatiquement: number;
        fiches_perimees: number;
    };
    periode: { libelle: string; date_fin: string } | null;
};

const bouton =
    'flex min-h-11 cursor-pointer items-center justify-center rounded-[10px] px-4 text-sm font-bold';

export default function Moderation({
    aTraiter,
    masques,
    compteurs,
    periode,
}: Props) {
    return (
        <>
            <Head title="Modération des avis" />

            <EnTeteAdmin
                titre="Modération des avis"
                description="Un avis signalé 3 fois est masqué automatiquement jusqu'à votre décision. L'auteur n'est jamais visible, même ici."
            />

            <div className="grid grid-cols-2 gap-3 sm:gap-4 xl:grid-cols-4">
                <Tuile
                    titre="À traiter"
                    valeur={compteurs.a_traiter}
                    teinte="teinte-dragee"
                />
                <Tuile
                    titre="Masqués automatiquement"
                    valeur={compteurs.masques_automatiquement}
                    teinte="teinte-lilas"
                />
                <Link
                    href={statistiques()}
                    className="text-ink no-underline hover:text-ink"
                >
                    <Tuile
                        titre="Fiches à mettre à jour"
                        valeur={compteurs.fiches_perimees}
                        teinte="teinte-ciel"
                    />
                </Link>
                <Link
                    href={periodes()}
                    className="bandeau px-5 py-4.5 text-white no-underline hover:text-white"
                >
                    <div className="text-[13px] font-semibold text-lavender">
                        Période en cours
                    </div>
                    {periode ? (
                        <>
                            <div className="mt-1.5 font-display text-lg leading-tight font-bold">
                                {periode.libelle}
                            </div>
                            <div className="text-[13px] text-lavender">
                                jusqu'au {formatDate(periode.date_fin)}
                            </div>
                        </>
                    ) : (
                        <div className="mt-1.5 font-display text-lg font-bold">
                            Aucune
                        </div>
                    )}
                </Link>
            </div>

            <section aria-labelledby="file" className="flex flex-col gap-3.5">
                <h2
                    id="file"
                    className="m-0 font-display text-[22px] font-bold"
                >
                    Avis signalés
                </h2>
                {aTraiter.length === 0 ? (
                    <EtatVide icone={CheckCircle2} titre="Rien à modérer">
                        Aucun avis signalé pour le moment.
                    </EtatVide>
                ) : (
                    aTraiter.map((avis) => (
                        <CarteModeration key={avis.id} avis={avis}>
                            <Link
                                href={ModerationController.destroy(avis.id)}
                                as="button"
                                preserveScroll
                                onBefore={() =>
                                    window.confirm(
                                        'Supprimer définitivement cet avis ?',
                                    )
                                }
                                className={cn(
                                    bouton,
                                    'border-[1.5px] border-lilac font-semibold text-plum hover:bg-mist',
                                )}
                            >
                                Supprimer
                            </Link>
                            <Link
                                href={ModerationController.update(avis.id)}
                                data={{ statut: 'masque' }}
                                as="button"
                                preserveScroll
                                className={cn(
                                    bouton,
                                    'bg-plum text-white hover:bg-ink',
                                )}
                            >
                                Masquer
                            </Link>
                            <Link
                                href={ModerationController.update(avis.id)}
                                data={{ statut: 'publie' }}
                                as="button"
                                preserveScroll
                                className={cn(
                                    bouton,
                                    'bg-ink text-white hover:bg-plum',
                                )}
                            >
                                Valider et republier
                            </Link>
                        </CarteModeration>
                    ))
                )}
            </section>

            <section
                aria-labelledby="masques"
                className="flex flex-col gap-3.5"
            >
                <h2
                    id="masques"
                    className="m-0 font-display text-[22px] font-bold"
                >
                    Avis masqués{' '}
                    <span className="text-base font-semibold text-plum">
                        · conservés pour l'historique
                    </span>
                </h2>
                {masques.length === 0 ? (
                    <EtatVide icone={EyeOff} titre="Aucun avis masqué" />
                ) : (
                    masques.map((avis) => (
                        <CarteModeration key={avis.id} avis={avis}>
                            <Link
                                href={ModerationController.destroy(avis.id)}
                                as="button"
                                preserveScroll
                                onBefore={() =>
                                    window.confirm(
                                        'Supprimer définitivement cet avis ?',
                                    )
                                }
                                className={cn(
                                    bouton,
                                    'border-[1.5px] border-lilac font-semibold text-plum hover:bg-mist',
                                )}
                            >
                                Supprimer
                            </Link>
                            <Link
                                href={ModerationController.update(avis.id)}
                                data={{ statut: 'publie' }}
                                as="button"
                                preserveScroll
                                className={cn(
                                    bouton,
                                    'bg-ink text-white hover:bg-plum',
                                )}
                            >
                                Rétablir
                            </Link>
                        </CarteModeration>
                    ))
                )}
            </section>
        </>
    );
}

function Tuile({
    titre,
    valeur,
    teinte,
}: {
    titre: string;
    valeur: number;
    teinte: string;
}) {
    return (
        <div className={`carte ${teinte} h-full px-4 py-4 sm:px-5 sm:py-4.5`}>
            <div className="text-[13px] font-semibold text-plum">{titre}</div>
            <div className="font-display text-[28px] font-extrabold sm:text-[34px]">
                {valeur}
            </div>
        </div>
    );
}

function CarteModeration({
    avis,
    children,
}: {
    avis: Avis;
    children: ReactNode;
}) {
    const masqueAuto = avis.statut?.value === 'signale';

    return (
        <article className="carte flex flex-col gap-3 px-5.5 py-5">
            <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex flex-wrap items-center gap-2">
                    {avis.cours && (
                        <Link
                            href={CoursController.show(avis.cours.id)}
                            className="font-bold text-ink"
                        >
                            UE {avis.cours.code_ue} · {avis.cours.intitule}
                        </Link>
                    )}
                    <NotePastille note={avis.note} className="text-xs" />
                </div>
                <span
                    className={cn(
                        'rounded-full px-2.5 py-1 text-xs font-bold',
                        masqueAuto
                            ? 'bg-ink text-lilac'
                            : 'bg-lavender text-ink',
                    )}
                >
                    {avis.statut?.value === 'masque'
                        ? "Masqué par l'administration"
                        : `Signalé ${pluriel(avis.nb_signalements ?? 0, 'fois', 'fois')}${masqueAuto ? ' · masqué automatiquement' : ''}`}
                </span>
            </div>
            <p className="m-0 whitespace-pre-line">{avis.commentaire}</p>
            <p className="m-0 text-[13px] text-plum">
                {avis.motifs && avis.motifs.length > 0 && (
                    <>Motifs : {[...new Set(avis.motifs)].join(' · ')} · </>
                )}
                Déposé {ilYA(avis.date)} · Auteur masqué
            </p>
            <div className="flex flex-wrap justify-end gap-2">{children}</div>
        </article>
    );
}
