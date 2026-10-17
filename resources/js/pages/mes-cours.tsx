import { Form, Head, Link } from '@inertiajs/react';
import {
    AlertTriangle,
    BookOpen,
    ExternalLink,
    MessageCircle,
} from 'lucide-react';
import { useState } from 'react';
import CoursController from '@/actions/App/Http/Controllers/CoursController';
import MesCoursController from '@/actions/App/Http/Controllers/MesCoursController';
import ReponseController from '@/actions/App/Http/Controllers/ReponseController';
import AvisCard from '@/components/avis-card';
import Champ from '@/components/champ';
import EtatVide from '@/components/etat-vide';
import InputError from '@/components/input-error';
import SignalerAvis from '@/components/signaler-avis';
import { Button } from '@/components/ui/button';
import { formatDateCourte, formatNote, pluriel } from '@/lib/format';
import { cn } from '@/lib/utils';
import type { Avis, Cours, Option } from '@/types';

type MonCours = Cours & { nb_sans_reponse: number };

type Props = {
    mesCours: MonCours[];
    coursSelectionne: Cours | null;
    avis: Avis[];
    avisSignales: number[];
    exigences: Option[];
};

export default function MesCours({
    mesCours,
    coursSelectionne,
    avis,
    avisSignales,
    exigences,
}: Props) {
    const perimes = mesCours.filter((cours) => cours.est_perime);

    return (
        <>
            <Head title="Mes cours" />

            <main className="mx-auto flex max-w-300 flex-col gap-6 px-4 pt-8 pb-16 sm:px-6">
                <div>
                    <h1 className="m-0 font-display text-[38px] leading-tight font-bold">
                        Mes cours
                    </h1>
                    <p className="mt-1 mb-0 text-plum">
                        Tenez vos fiches à jour et répondez aux avis reçus. Les
                        auteurs des avis restent toujours anonymes.
                    </p>
                </div>

                {perimes.map((cours) => (
                    <div
                        key={cours.id}
                        role="alert"
                        className="flex flex-wrap items-center gap-x-4 gap-y-3 rounded-[14px] border-[1.5px] border-iris bg-white/55 px-5 py-4 backdrop-blur-xl"
                    >
                        <AlertTriangle
                            className="size-5.5 text-plum"
                            aria-hidden
                        />
                        <span className="flex-[1_1_300px]">
                            <strong>
                                {cours.intitule} (UE {cours.code_ue})
                            </strong>{' '}
                            n'a pas été mise à jour depuis plus de 12 mois.
                            L'administration a été prévenue.
                        </span>
                        <Link
                            href={MesCoursController.index({
                                query: { cours: cours.id },
                            })}
                            className="font-bold"
                        >
                            Mettre à jour
                        </Link>
                    </div>
                ))}

                {mesCours.length === 0 || !coursSelectionne ? (
                    <EtatVide
                        icone={BookOpen}
                        titre="Aucun cours ne vous est attribué"
                    >
                        Contactez l'administration pour être désigné enseignant
                        d'une UE.
                    </EtatVide>
                ) : (
                    <div className="flex flex-wrap items-start gap-6">
                        <nav
                            aria-label="Mes cours"
                            className="flex flex-[1_1_260px] flex-col gap-2"
                        >
                            {mesCours.map((cours) => {
                                const actif = cours.id === coursSelectionne.id;

                                return (
                                    <Link
                                        key={cours.id}
                                        href={MesCoursController.index({
                                            query: { cours: cours.id },
                                        })}
                                        preserveScroll
                                        aria-current={
                                            actif ? 'page' : undefined
                                        }
                                        className={cn(
                                            'flex flex-col gap-0.5 rounded-xl border-[1.5px] px-4 py-3.5 no-underline',
                                            actif
                                                ? 'border-ink bg-ink text-white hover:text-white'
                                                : 'border-line bg-white text-ink hover:border-lilac hover:text-ink',
                                        )}
                                    >
                                        <span className="text-xs font-bold tracking-[0.04em]">
                                            UE {cours.code_ue} ·{' '}
                                            {cours.filiere?.niveau}
                                        </span>
                                        <span className="text-[15px] font-bold">
                                            {cours.intitule}
                                        </span>
                                        <span className="text-xs">
                                            {cours.est_perime
                                                ? 'À mettre à jour'
                                                : `${pluriel(cours.nb_avis ?? 0, 'avis', 'avis')}${cours.nb_sans_reponse ? ` · ${cours.nb_sans_reponse} sans réponse` : ''}`}
                                        </span>
                                    </Link>
                                );
                            })}
                        </nav>

                        <div className="flex min-w-0 flex-[999_1_600px] flex-col gap-6">
                            <FicheFormulaire
                                key={coursSelectionne.id}
                                cours={coursSelectionne}
                                exigences={exigences}
                            />

                            <section
                                aria-labelledby="recus"
                                className="flex flex-col gap-3.5"
                            >
                                <div className="flex flex-wrap items-baseline justify-between gap-2">
                                    <h2
                                        id="recus"
                                        className="m-0 font-display text-2xl font-bold"
                                    >
                                        Avis reçus{' '}
                                        <span className="text-base font-semibold text-plum">
                                            · auteurs toujours anonymes
                                        </span>
                                    </h2>
                                    {coursSelectionne.moyenne != null && (
                                        <span className="text-sm font-semibold">
                                            Moyenne :{' '}
                                            {formatNote(
                                                coursSelectionne.moyenne,
                                            )}{' '}
                                            / 5
                                        </span>
                                    )}
                                </div>
                                {avis.length === 0 ? (
                                    <EtatVide
                                        icone={MessageCircle}
                                        titre="Aucun avis sur ce cours pour l'instant"
                                    />
                                ) : (
                                    avis.map((unAvis) => (
                                        <AvisCard
                                            key={unAvis.id}
                                            avis={unAvis}
                                            actions={
                                                <SignalerAvis
                                                    avisId={unAvis.id}
                                                    dejaSignale={avisSignales.includes(
                                                        unAvis.id,
                                                    )}
                                                />
                                            }
                                        >
                                            {!unAvis.reponse && (
                                                <FormulaireReponse
                                                    avisId={unAvis.id}
                                                />
                                            )}
                                        </AvisCard>
                                    ))
                                )}
                            </section>
                        </div>
                    </div>
                )}
            </main>
        </>
    );
}

function FicheFormulaire({
    cours,
    exigences,
}: {
    cours: Cours;
    exigences: Option[];
}) {
    return (
        <Form
            {...MesCoursController.update.form(cours.id)}
            options={{ preserveScroll: true }}
            aria-labelledby="fiche"
            className="carte flex flex-col gap-4.5 p-6 sm:p-7"
        >
            {({ errors, processing }) => (
                <>
                    <div className="flex flex-wrap items-center justify-between gap-2">
                        <h2
                            id="fiche"
                            className="m-0 font-display text-2xl font-bold"
                        >
                            Fiche · {cours.intitule}
                        </h2>
                        <span className="rounded-full bg-haze px-3 py-1 text-[13px] font-semibold">
                            Dernière mise à jour :{' '}
                            {formatDateCourte(cours.date_maj)}
                        </span>
                    </div>

                    <Champ
                        label="Contenu"
                        htmlFor="contenu"
                        erreur={errors.contenu}
                    >
                        <textarea
                            id="contenu"
                            name="contenu"
                            rows={3}
                            defaultValue={cours.contenu ?? ''}
                            className="champ resize-y"
                        />
                    </Champ>
                    <Champ
                        label="Chapitres (un par ligne)"
                        htmlFor="chapitres"
                        erreur={errors.chapitres}
                    >
                        <textarea
                            id="chapitres"
                            name="chapitres"
                            rows={5}
                            defaultValue={cours.chapitres.join('\n')}
                            className="champ resize-y"
                        />
                    </Champ>
                    <div className="flex flex-wrap gap-4">
                        <Champ
                            label="Outils (séparés par des virgules)"
                            htmlFor="outils"
                            erreur={errors.outils}
                            className="flex-[1_1_240px]"
                        >
                            <input
                                id="outils"
                                name="outils"
                                type="text"
                                defaultValue={cours.outils.join(', ')}
                                className="champ"
                            />
                        </Champ>
                        <Champ
                            label="Niveau d'exigence"
                            htmlFor="exigence"
                            erreur={errors.exigence}
                            className="flex-[1_1_200px]"
                        >
                            <select
                                id="exigence"
                                name="exigence"
                                defaultValue={cours.exigence.value}
                                className="champ"
                            >
                                {exigences.map((exigence) => (
                                    <option
                                        key={exigence.value}
                                        value={exigence.value}
                                    >
                                        {exigence.label}
                                    </option>
                                ))}
                            </select>
                        </Champ>
                    </div>
                    <Champ
                        label="Méthode d'enseignement"
                        htmlFor="methode"
                        erreur={errors.methode}
                    >
                        <textarea
                            id="methode"
                            name="methode"
                            rows={3}
                            defaultValue={cours.methode ?? ''}
                            className="champ resize-y"
                        />
                    </Champ>
                    <Champ
                        label="Évaluation"
                        htmlFor="evaluation"
                        erreur={errors.evaluation}
                        aide="Par exemple : projet en binôme (40 %), examen final (60 %)."
                    >
                        <textarea
                            id="evaluation"
                            name="evaluation"
                            rows={2}
                            defaultValue={cours.evaluation ?? ''}
                            className="champ resize-y"
                        />
                    </Champ>

                    <div className="flex flex-wrap items-center justify-end gap-3">
                        <Link
                            href={CoursController.show(cours.id)}
                            className="flex items-center gap-1.5 text-sm font-semibold"
                        >
                            <ExternalLink className="size-4" aria-hidden />
                            Voir la fiche publique
                        </Link>
                        <Button
                            type="submit"
                            disabled={processing}
                            className="min-h-12 px-6 font-bold"
                        >
                            Enregistrer
                        </Button>
                    </div>
                </>
            )}
        </Form>
    );
}

function FormulaireReponse({ avisId }: { avisId: number }) {
    const [ouvert, setOuvert] = useState(false);

    if (!ouvert) {
        return (
            <div className="flex">
                <button
                    type="button"
                    onClick={() => setOuvert(true)}
                    className="min-h-11 cursor-pointer rounded-[10px] bg-plum px-5 text-sm font-bold text-white hover:bg-ink"
                >
                    Répondre
                </button>
            </div>
        );
    }

    return (
        <Form
            {...ReponseController.store.form(avisId)}
            options={{ preserveScroll: true }}
            className="flex flex-col gap-2"
        >
            {({ errors, processing }) => (
                <>
                    <label
                        htmlFor={`reponse-${avisId}`}
                        className="text-sm font-semibold"
                    >
                        Répondre (une seule réponse par avis)
                    </label>
                    <textarea
                        id={`reponse-${avisId}`}
                        name="texte"
                        rows={2}
                        required
                        maxLength={1000}
                        className="champ resize-y"
                    />
                    <InputError message={errors.texte} />
                    <div className="flex justify-end gap-2">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => setOuvert(false)}
                        >
                            Annuler
                        </Button>
                        <Button
                            type="submit"
                            disabled={processing}
                            className="font-bold"
                        >
                            Publier la réponse
                        </Button>
                    </div>
                </>
            )}
        </Form>
    );
}
