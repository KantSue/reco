import { Form, Head, Link } from '@inertiajs/react';
import { Check, ThumbsUp } from 'lucide-react';
import { useState } from 'react';
import CoursController from '@/actions/App/Http/Controllers/CoursController';
import RecommandationController from '@/actions/App/Http/Controllers/RecommandationController';
import EtatVide from '@/components/etat-vide';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { formatDateCourte, formatMoisAnnee } from '@/lib/format';
import type { Cours } from '@/types';

type Props = {
    enseignant: { id: number; nom_complet: string; initiale: string };
    cours: Cours[];
    recommandations: { id: number; commentaire: string; date: string }[];
    peutRecommander: boolean;
    dejaRecommande: boolean;
};

export default function EnseignantShow({
    enseignant,
    cours,
    recommandations,
    peutRecommander,
    dejaRecommande,
}: Props) {
    const [formulaireOuvert, setFormulaireOuvert] = useState(false);

    return (
        <>
            <Head title={enseignant.nom_complet} />

            <section className="bandeau px-4 pt-8 pb-22 text-white sm:px-6">
                <div className="mx-auto flex max-w-300 flex-wrap items-center gap-7">
                    <span className="flex size-28 items-center justify-center rounded-[28px] bg-iris font-display text-[44px] font-extrabold">
                        {enseignant.initiale}
                    </span>
                    <div className="flex flex-[1_1_320px] flex-col gap-2">
                        <p className="m-0 text-[13px] font-bold tracking-[0.08em] text-lagon uppercase">
                            Enseignant
                        </p>
                        <h1 className="m-0 font-display text-4xl leading-tight font-bold sm:text-[44px]">
                            {enseignant.nom_complet}
                        </h1>
                    </div>
                    <div className="flex flex-wrap gap-3">
                        <div className="flex flex-col rounded-[14px] bg-white/15 px-5 py-3.5 ring-1 ring-white/20 backdrop-blur-md">
                            <span className="font-display text-3xl leading-tight font-extrabold">
                                {recommandations.length}
                            </span>
                            <span className="text-[13px] text-lavender">
                                recommandations
                            </span>
                        </div>
                        <div className="flex flex-col rounded-[14px] bg-white/15 px-5 py-3.5 ring-1 ring-white/20 backdrop-blur-md">
                            <span className="font-display text-3xl leading-tight font-extrabold">
                                {cours.length}
                            </span>
                            <span className="text-[13px] text-lavender">
                                cours assurés
                            </span>
                        </div>
                    </div>
                </div>
            </section>

            <main className="mx-auto -mt-13 flex max-w-300 flex-wrap items-start gap-6 px-4 pb-16 sm:px-6">
                <section
                    aria-labelledby="cours"
                    className="carte flex flex-[1_1_340px] flex-col gap-3 p-6"
                >
                    <h2
                        id="cours"
                        className="m-0 mb-1 font-display text-[22px] font-bold"
                    >
                        Cours assurés
                    </h2>
                    {cours.length === 0 && (
                        <p className="m-0 text-sm text-plum">
                            Aucun cours pour le moment.
                        </p>
                    )}
                    {cours.map((unCours) => (
                        <Link
                            key={unCours.id}
                            href={CoursController.show(unCours.id)}
                            className="flex flex-col gap-1 rounded-xl bg-mist px-4 py-3.5 text-ink no-underline hover:bg-haze hover:text-ink"
                        >
                            <span className="text-xs font-bold tracking-[0.04em] text-plum">
                                UE {unCours.code_ue} · {unCours.filiere?.niveau}{' '}
                                · S{unCours.semestre}
                            </span>
                            <strong className="text-base">
                                {unCours.intitule}
                            </strong>
                            <span className="text-[13px] text-plum">
                                {unCours.est_perime
                                    ? 'Fiche non mise à jour depuis plus de 12 mois'
                                    : `Fiche mise à jour le ${formatDateCourte(unCours.date_maj)}`}
                            </span>
                        </Link>
                    ))}
                </section>

                <section
                    aria-labelledby="reco"
                    className="flex min-w-0 flex-[999_1_560px] flex-col gap-4"
                >
                    <div className="carte flex flex-col gap-4 p-6">
                        <div className="flex flex-wrap items-center justify-between gap-3">
                            <div>
                                <h2
                                    id="reco"
                                    className="m-0 font-display text-2xl font-bold"
                                >
                                    Recommandations
                                </h2>
                                <p className="m-0 text-sm text-plum">
                                    Les étudiants recommandent un enseignant,
                                    sans note publique ni nom d'auteur.
                                </p>
                            </div>
                            {peutRecommander && !formulaireOuvert && (
                                <button
                                    type="button"
                                    onClick={() => setFormulaireOuvert(true)}
                                    className="flex min-h-12 cursor-pointer items-center gap-2 rounded-[10px] bg-ink px-5.5 font-bold text-white hover:bg-plum"
                                >
                                    <ThumbsUp
                                        className="size-4.5 text-lilac"
                                        aria-hidden
                                    />
                                    Recommander
                                </button>
                            )}
                            {dejaRecommande && (
                                <span className="flex items-center gap-2 rounded-full bg-haze px-3 py-1.5 text-sm font-semibold">
                                    <Check
                                        className="size-4 text-iris"
                                        aria-hidden
                                    />
                                    Vous l'avez recommandé
                                </span>
                            )}
                        </div>

                        {formulaireOuvert && (
                            <Form
                                {...RecommandationController.store.form(
                                    enseignant.id,
                                )}
                                options={{ preserveScroll: true }}
                                onSuccess={() => setFormulaireOuvert(false)}
                                className="flex flex-col gap-3 border-t border-haze pt-4"
                            >
                                {({ errors, processing }) => (
                                    <>
                                        <label
                                            htmlFor="commentaire"
                                            className="text-sm font-semibold"
                                        >
                                            Pourquoi le recommandez-vous ?
                                        </label>
                                        <textarea
                                            id="commentaire"
                                            name="commentaire"
                                            rows={3}
                                            required
                                            minLength={10}
                                            maxLength={1000}
                                            placeholder="Clarté des explications, disponibilité, exemples concrets…"
                                            className="champ resize-y"
                                        />
                                        <InputError
                                            message={errors.commentaire}
                                        />
                                        <div className="flex justify-end gap-2">
                                            <Button
                                                type="button"
                                                variant="outline"
                                                onClick={() =>
                                                    setFormulaireOuvert(false)
                                                }
                                            >
                                                Annuler
                                            </Button>
                                            <Button
                                                type="submit"
                                                disabled={processing}
                                                className="font-bold"
                                            >
                                                Publier ma recommandation
                                            </Button>
                                        </div>
                                    </>
                                )}
                            </Form>
                        )}
                    </div>

                    {recommandations.length === 0 ? (
                        <EtatVide
                            icone={ThumbsUp}
                            titre="Aucune recommandation pour l'instant"
                        />
                    ) : (
                        recommandations.map((recommandation) => (
                            <article
                                key={recommandation.id}
                                className="carte flex gap-3.5 px-5.5 py-5"
                            >
                                <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-lavender">
                                    <ThumbsUp
                                        className="size-4.5 text-ink"
                                        aria-hidden
                                    />
                                </span>
                                <div className="flex flex-col gap-1.5">
                                    <p className="m-0 whitespace-pre-line">
                                        {recommandation.commentaire}
                                    </p>
                                    <span className="text-[13px] text-plum">
                                        Étudiant anonyme ·{' '}
                                        {formatMoisAnnee(recommandation.date)}
                                    </span>
                                </div>
                            </article>
                        ))
                    )}
                </section>
            </main>
        </>
    );
}
