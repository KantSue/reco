import { Head, Link, usePage } from '@inertiajs/react';
import {
    AlertTriangle,
    Check,
    ChevronRight,
    Clock,
    LockKeyhole,
    MessageCircle,
    Pencil,
    Trash2,
} from 'lucide-react';
import { useMemo, useState } from 'react';
import AvisController from '@/actions/App/Http/Controllers/AvisController';
import CoursController from '@/actions/App/Http/Controllers/CoursController';
import EnseignantController from '@/actions/App/Http/Controllers/EnseignantController';
import AvisCard from '@/components/avis-card';
import EtatVide from '@/components/etat-vide';
import ExigenceIndicateur from '@/components/exigence-indicateur';
import FormulaireAvis from '@/components/formulaire-avis';
import { Etoiles } from '@/components/note';
import SignalerAvis from '@/components/signaler-avis';
import { formatDate, formatNote, pluriel } from '@/lib/format';
import { login } from '@/routes';
import type { Avis, Cours, SuiteDonnee } from '@/types';

type Depot = {
    periode: string | null;
    periode_fin: string | null;
    suit_le_cours: boolean;
    possible: boolean;
    mon_avis: {
        id: number;
        note: number;
        commentaire: string;
        statut: string;
    } | null;
};

type Props = {
    cours: Cours;
    peutVoirAvis: boolean;
    avis: Avis[];
    repartition: Record<string, number> | null;
    avisSignales: number[];
    suites: SuiteDonnee[];
    depot: Depot | null;
};

type Tri = 'recents' | 'mieux' | 'moins';

export default function CoursShow({
    cours,
    peutVoirAvis,
    avis,
    repartition,
    avisSignales,
    suites,
    depot,
}: Props) {
    const page = usePage();
    const role = page.props.auth.user?.role;
    const [tri, setTri] = useState<Tri>('recents');
    const [formulaireOuvert, setFormulaireOuvert] = useState(() =>
        new URLSearchParams(page.url.split('?')[1] ?? '').has('avis'),
    );

    const avisTries = useMemo(() => {
        const copie = [...avis];

        if (tri === 'mieux') {
            copie.sort((a, b) => b.note - a.note);
        }

        if (tri === 'moins') {
            copie.sort((a, b) => a.note - b.note);
        }

        return copie;
    }, [avis, tri]);

    const peutSignaler = (unAvis: Avis) =>
        !unAvis.est_le_mien && (role === 'etudiant' || role === 'enseignant');

    return (
        <>
            <Head title={`${cours.intitule} (UE ${cours.code_ue})`} />

            <section className="bandeau px-4 pt-6 pb-20 text-white sm:px-6">
                <div className="mx-auto flex max-w-300 flex-col gap-4.5">
                    <nav
                        aria-label="Fil d'Ariane"
                        className="flex flex-wrap items-center gap-2 text-sm text-lavender"
                    >
                        <Link
                            href={CoursController.index()}
                            className="text-lavender hover:text-white"
                        >
                            Cours
                        </Link>
                        <ChevronRight className="size-3.5" aria-hidden />
                        {cours.filiere && (
                            <>
                                <Link
                                    href={CoursController.index({
                                        query: {
                                            filiere: cours.filiere.nom,
                                            niveau: cours.filiere.niveau,
                                        },
                                    })}
                                    className="text-lavender hover:text-white"
                                >
                                    {cours.filiere.nom} · {cours.filiere.niveau}
                                </Link>
                                <ChevronRight
                                    className="size-3.5"
                                    aria-hidden
                                />
                            </>
                        )}
                        <span className="text-white" aria-current="page">
                            UE {cours.code_ue}
                        </span>
                    </nav>
                    <div className="flex flex-wrap gap-2">
                        <span className="rounded-md bg-lilac px-2.5 py-1 text-xs font-bold tracking-[0.04em] text-ink">
                            UE {cours.code_ue}
                        </span>
                        <span className="rounded-md bg-white/15 px-2.5 py-1 text-xs font-semibold ring-1 ring-white/20">
                            Semestre {cours.semestre}
                        </span>
                        {cours.filiere && (
                            <span className="rounded-md bg-white/15 px-2.5 py-1 text-xs font-semibold ring-1 ring-white/20">
                                {cours.filiere.nom} · {cours.filiere.niveau}
                            </span>
                        )}
                    </div>
                    <h1 className="m-0 font-display text-[34px] leading-[1.08] font-bold sm:text-[46px]">
                        {cours.intitule}
                    </h1>
                    <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-lavender">
                        <span>
                            Enseignant :{' '}
                            {cours.enseignant ? (
                                role === 'etudiant' || role === 'admin' ? (
                                    <Link
                                        href={EnseignantController.show(
                                            cours.enseignant.id,
                                        )}
                                        className="font-semibold text-white underline-offset-4 hover:text-white"
                                    >
                                        {cours.enseignant.nom_complet}
                                    </Link>
                                ) : (
                                    <strong className="text-white">
                                        {cours.enseignant.nom_complet}
                                    </strong>
                                )
                            ) : (
                                'à désigner'
                            )}
                        </span>
                        <span className="flex items-center gap-1.5">
                            <Clock className="size-4 text-lagon" aria-hidden />
                            Fiche mise à jour le {formatDate(cours.date_maj)}
                        </span>
                    </div>
                    {cours.est_perime && (
                        <p className="m-0 flex items-center gap-2 self-start rounded-lg bg-white/15 px-3 py-2 text-sm ring-1 ring-white/20 backdrop-blur-md">
                            <AlertTriangle
                                className="size-4 text-lagon"
                                aria-hidden
                            />
                            Cette fiche n'a pas été mise à jour depuis plus de
                            12 mois : son contenu peut avoir changé.
                        </p>
                    )}
                </div>
            </section>

            <main className="mx-auto -mt-12 flex max-w-300 flex-wrap items-start gap-6 px-4 pb-16 sm:px-6">
                <div className="flex min-w-0 flex-[999_1_600px] flex-col gap-6">
                    <section
                        aria-labelledby="le-cours"
                        className="carte flex flex-col gap-6 p-6 sm:p-7"
                    >
                        <h2
                            id="le-cours"
                            className="m-0 font-display text-2xl font-bold"
                        >
                            Le cours
                        </h2>
                        {cours.contenu && (
                            <div>
                                <h3 className="etiquette-section m-0 mb-1.5">
                                    Contenu
                                </h3>
                                <p className="m-0 whitespace-pre-line">
                                    {cours.contenu}
                                </p>
                            </div>
                        )}
                        {cours.chapitres.length > 0 && (
                            <div>
                                <h3 className="etiquette-section m-0 mb-2.5">
                                    Chapitres
                                </h3>
                                <ol className="m-0 grid list-none gap-x-4 gap-y-2 p-0 sm:grid-cols-2">
                                    {cours.chapitres.map((chapitre, index) => (
                                        <li
                                            key={chapitre}
                                            className="flex items-baseline gap-2.5"
                                        >
                                            <span className="min-w-6 font-display text-lg font-extrabold text-iris">
                                                {String(index + 1).padStart(
                                                    2,
                                                    '0',
                                                )}
                                            </span>
                                            <span>{chapitre}</span>
                                        </li>
                                    ))}
                                </ol>
                            </div>
                        )}
                        <div className="flex flex-wrap gap-6">
                            {cours.outils.length > 0 && (
                                <div className="flex-[1_1_240px]">
                                    <h3 className="etiquette-section m-0 mb-2.5">
                                        Outils
                                    </h3>
                                    <div className="flex flex-wrap gap-1.5">
                                        {cours.outils.map((outil) => (
                                            <span
                                                key={outil}
                                                className="rounded-full bg-lavender px-3 py-1 text-[13px] font-semibold"
                                            >
                                                {outil}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            )}
                            {cours.evaluation && (
                                <div className="flex-[1_1_240px]">
                                    <h3 className="etiquette-section m-0 mb-2.5">
                                        Évaluation
                                    </h3>
                                    <p className="m-0 whitespace-pre-line">
                                        {cours.evaluation}
                                    </p>
                                </div>
                            )}
                        </div>
                    </section>

                    <section
                        aria-labelledby="methode"
                        className="carte flex flex-wrap gap-6 p-6 sm:p-7"
                    >
                        <div className="flex flex-[1_1_280px] flex-col gap-2">
                            <h2
                                id="methode"
                                className="m-0 font-display text-[22px] font-bold"
                            >
                                Méthode d'enseignement
                            </h2>
                            <p className="m-0 whitespace-pre-line">
                                {cours.methode ??
                                    "L'enseignant n'a pas encore décrit sa méthode."}
                            </p>
                        </div>
                        <div className="flex flex-[1_1_240px] flex-col gap-2.5 rounded-[14px] bg-mist p-5">
                            <h3 className="etiquette-section m-0">
                                Niveau d'exigence
                            </h3>
                            <ExigenceIndicateur exigence={cours.exigence} />
                            <p className="m-0 text-lg font-bold">
                                {cours.exigence.label} · {cours.exigence.niveau}{' '}
                                / 3
                            </p>
                        </div>
                    </section>

                    {suites.map((suite) => (
                        <section
                            key={suite.id}
                            aria-label="Suite donnée par l'administration"
                            className="bandeau flex items-start gap-4.5 px-6 py-6 text-white sm:px-7"
                        >
                            <span className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-lilac">
                                <Check
                                    className="size-5.5 text-ink"
                                    aria-hidden
                                />
                            </span>
                            <div className="flex flex-col gap-1.5">
                                <p className="m-0 text-xs font-bold tracking-[0.08em] text-lagon uppercase">
                                    Suite donnée par l'administration ·{' '}
                                    {formatDate(suite.date)}
                                </p>
                                <p className="m-0 font-display text-lg leading-snug font-bold">
                                    {suite.texte}
                                </p>
                            </div>
                        </section>
                    ))}

                    <section
                        aria-labelledby="avis"
                        className="flex flex-col gap-4"
                    >
                        <div className="flex flex-wrap items-center justify-between gap-3">
                            <h2
                                id="avis"
                                className="m-0 font-display text-[26px] font-bold"
                            >
                                Avis des étudiants
                            </h2>
                            {peutVoirAvis && avis.length > 1 && (
                                <label className="flex items-center gap-2 text-sm font-semibold">
                                    Trier
                                    <select
                                        value={tri}
                                        onChange={(event) =>
                                            setTri(event.target.value as Tri)
                                        }
                                        className="rounded-lg border border-lilac bg-white px-3 py-2 text-ink"
                                    >
                                        <option value="recents">
                                            Plus récents
                                        </option>
                                        <option value="mieux">
                                            Mieux notés
                                        </option>
                                        <option value="moins">
                                            Moins bien notés
                                        </option>
                                    </select>
                                </label>
                            )}
                        </div>

                        {!peutVoirAvis ? (
                            <EtatVide icone={LockKeyhole} titre="Avis réservés">
                                {page.props.auth.user ? (
                                    "Les avis de ce cours sont visibles par les étudiants, l'enseignant du cours et l'administration."
                                ) : (
                                    <>
                                        Les avis anonymes sont réservés aux
                                        membres de l'université.{' '}
                                        <Link
                                            href={login()}
                                            className="font-semibold"
                                        >
                                            Se connecter
                                        </Link>
                                    </>
                                )}
                            </EtatVide>
                        ) : avisTries.length === 0 ? (
                            <EtatVide
                                icone={MessageCircle}
                                titre="Aucun avis pour l'instant"
                            >
                                Les avis apparaîtront ici dès qu'un étudiant
                                aura partagé son expérience.
                            </EtatVide>
                        ) : (
                            avisTries.map((unAvis) => (
                                <AvisCard
                                    key={unAvis.id}
                                    avis={unAvis}
                                    actions={
                                        peutSignaler(unAvis) ? (
                                            <SignalerAvis
                                                avisId={unAvis.id}
                                                dejaSignale={avisSignales.includes(
                                                    unAvis.id,
                                                )}
                                            />
                                        ) : undefined
                                    }
                                />
                            ))
                        )}
                    </section>
                </div>

                <aside className="flex flex-[1_1_320px] flex-col gap-5 lg:sticky lg:top-6">
                    {peutVoirAvis && (
                        <section
                            aria-labelledby="note"
                            className="carte flex flex-col gap-4 p-6"
                        >
                            <h2 id="note" className="etiquette-section m-0">
                                Note moyenne
                            </h2>
                            {cours.moyenne != null ? (
                                <>
                                    <div className="flex items-end gap-3">
                                        <span className="font-display text-6xl leading-none font-extrabold">
                                            {formatNote(cours.moyenne)}
                                        </span>
                                        <div className="pb-1.5">
                                            <Etoiles note={cours.moyenne} />
                                            <div className="text-[13px] text-plum">
                                                {pluriel(
                                                    cours.nb_avis ?? 0,
                                                    'avis',
                                                    'avis',
                                                )}{' '}
                                                · sur 5
                                            </div>
                                        </div>
                                    </div>
                                    {repartition && (
                                        <div className="flex flex-col gap-1.5">
                                            {[5, 4, 3, 2, 1].map((note) => {
                                                const nombre =
                                                    repartition[note] ?? 0;
                                                const pourcentage =
                                                    cours.nb_avis
                                                        ? Math.round(
                                                              (100 * nombre) /
                                                                  cours.nb_avis,
                                                          )
                                                        : 0;

                                                return (
                                                    <div
                                                        key={note}
                                                        className="flex items-center gap-2.5 text-[13px]"
                                                    >
                                                        <span className="w-3.5">
                                                            {note}
                                                        </span>
                                                        <div className="h-2 flex-1 rounded-full bg-haze">
                                                            <div
                                                                className="h-2 rounded-full bg-iris"
                                                                style={{
                                                                    width: `${pourcentage}%`,
                                                                }}
                                                            />
                                                        </div>
                                                        <span className="w-6 text-right text-plum">
                                                            {nombre}
                                                        </span>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    )}
                                </>
                            ) : (
                                <p className="m-0 text-sm text-plum">
                                    {pluriel(
                                        cours.nb_avis ?? 0,
                                        'avis publié',
                                        'avis publiés',
                                    )}
                                    . La moyenne s'affiche à partir de 5 avis,
                                    pour qu'aucun auteur ne puisse être reconnu.
                                </p>
                            )}

                            {depot && (
                                <BlocDepot
                                    coursId={cours.id}
                                    depot={depot}
                                    ouvert={formulaireOuvert}
                                    setOuvert={setFormulaireOuvert}
                                />
                            )}
                        </section>
                    )}

                    {cours.enseignant &&
                        (role === 'etudiant' || role === 'admin') && (
                            <Link
                                href={EnseignantController.show(
                                    cours.enseignant.id,
                                )}
                                className="carte flex items-center gap-3.5 px-6 py-5 text-ink no-underline hover:text-ink hover:shadow-[0_8px_28px_rgba(27,14,32,0.08)]"
                            >
                                <span className="flex size-13 items-center justify-center rounded-full bg-iris font-display text-xl font-bold text-white">
                                    {cours.enseignant.nom_complet
                                        .split(' ')
                                        .pop()
                                        ?.charAt(0)}
                                </span>
                                <span className="flex flex-1 flex-col">
                                    <strong>
                                        {cours.enseignant.nom_complet}
                                    </strong>
                                    <span className="text-[13px] text-plum">
                                        Voir la fiche et les recommandations
                                    </span>
                                </span>
                                <ChevronRight
                                    className="size-4.5 text-plum"
                                    aria-hidden
                                />
                            </Link>
                        )}
                </aside>
            </main>
        </>
    );
}

function BlocDepot({
    coursId,
    depot,
    ouvert,
    setOuvert,
}: {
    coursId: number;
    depot: Depot;
    ouvert: boolean;
    setOuvert: (ouvert: boolean) => void;
}) {
    if (!depot.suit_le_cours) {
        return (
            <p className="m-0 rounded-lg bg-mist px-4 py-3 text-center text-[13px] text-plum">
                Vous ne suivez pas ce cours : vous pouvez lire les avis, mais
                pas en déposer.
            </p>
        );
    }

    if (!depot.periode) {
        return (
            <p className="m-0 rounded-lg bg-mist px-4 py-3 text-center text-[13px] text-plum">
                Évaluations fermées : vous pourrez donner votre avis lors de la
                prochaine période d'évaluation.
            </p>
        );
    }

    if (depot.mon_avis) {
        return (
            <div className="flex flex-col gap-3 border-t border-haze pt-4">
                {ouvert ? (
                    <FormulaireAvis
                        coursId={coursId}
                        avisExistant={depot.mon_avis}
                        onAnnuler={() => setOuvert(false)}
                    />
                ) : (
                    <>
                        <p className="m-0 flex items-center gap-2 text-sm font-semibold">
                            <Check className="size-4 text-iris" aria-hidden />
                            Vous avez donné votre avis ({depot.mon_avis.note} /
                            5)
                        </p>
                        {depot.mon_avis.statut !== 'publie' && (
                            <p className="m-0 text-[13px] text-plum">
                                Votre avis est en attente de modération.
                            </p>
                        )}
                        <div className="flex flex-wrap gap-2">
                            {depot.mon_avis.statut === 'publie' && (
                                <button
                                    type="button"
                                    onClick={() => setOuvert(true)}
                                    className="flex min-h-11 flex-1 cursor-pointer items-center justify-center gap-2 rounded-[10px] border-[1.5px] border-lilac px-4 font-semibold text-ink hover:bg-mist"
                                >
                                    <Pencil className="size-4" aria-hidden />
                                    Modifier
                                </button>
                            )}
                            <Link
                                href={AvisController.destroy(depot.mon_avis.id)}
                                as="button"
                                preserveScroll
                                onBefore={() =>
                                    window.confirm(
                                        'Supprimer définitivement votre avis ?',
                                    )
                                }
                                className="flex min-h-11 cursor-pointer items-center justify-center gap-2 rounded-[10px] px-4 font-semibold text-plum hover:bg-mist"
                            >
                                <Trash2 className="size-4" aria-hidden />
                                Supprimer
                            </Link>
                        </div>
                    </>
                )}
            </div>
        );
    }

    return (
        <div className="flex flex-col gap-3 border-t border-haze pt-4">
            {ouvert ? (
                <FormulaireAvis
                    coursId={coursId}
                    onAnnuler={() => setOuvert(false)}
                />
            ) : (
                <>
                    <button
                        type="button"
                        onClick={() => setOuvert(true)}
                        className="min-h-13 cursor-pointer rounded-[10px] bg-ink text-base font-bold text-white hover:bg-plum"
                    >
                        Donner mon avis
                    </button>
                    <p className="m-0 text-center text-xs text-plum">
                        Vous suivez ce cours · {depot.periode} ouverte jusqu'au{' '}
                        {depot.periode_fin && formatDate(depot.periode_fin)}
                    </p>
                </>
            )}
        </div>
    );
}
