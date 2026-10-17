import { Form, Head, Link, usePage } from '@inertiajs/react';
import { CalendarDays, MessageCircle, Search } from 'lucide-react';
import CoursController from '@/actions/App/Http/Controllers/CoursController';
import AvisCard from '@/components/avis-card';
import CoursCard from '@/components/cours-card';
import EtatVide from '@/components/etat-vide';
import { formatDate } from '@/lib/format';
import { index as retoursAnciens } from '@/routes/retours-anciens';
import type { Avis, Cours } from '@/types';

type Props = {
    periode: { libelle: string; date_fin: string } | null;
    coursEnAttente: { id: number; code_ue: string; intitule: string }[];
    mieuxNotes: Cours[];
    derniersAvis: Avis[];
    filieres: string[];
    niveaux: string[];
};

export default function Accueil({
    periode,
    coursEnAttente,
    mieuxNotes,
    derniersAvis,
    filieres,
    niveaux,
}: Props) {
    const { auth } = usePage().props;
    const prenom = auth.user?.nom_complet.split(' ')[0];

    return (
        <>
            <Head title="Accueil" />

            <section className="bandeau px-4 pt-8 pb-[72px] text-white sm:px-6 sm:pt-10">
                <div className="mx-auto flex max-w-[1200px] flex-col gap-5">
                    <p className="m-0 text-sm font-semibold tracking-[0.08em] text-lagon uppercase">
                        Bonjour {prenom}
                    </p>
                    <h1 className="m-0 max-w-[760px] font-display text-[30px] leading-[1.08] font-bold sm:text-5xl">
                        Sachez à quoi vous attendre avant le premier cours.
                    </h1>
                    <p className="m-0 max-w-[620px] text-[17px] text-lavender">
                        Fiches officielles des UE, méthode d'enseignement,
                        niveau d'exigence et avis anonymes des étudiants qui les
                        ont suivies.
                    </p>

                    <Form
                        {...CoursController.index.form()}
                        role="search"
                        aria-label="Rechercher un cours"
                        className="mt-2 flex max-w-[980px] flex-wrap gap-2 rounded-2xl border border-white/40 bg-white/70 p-2.5 shadow-[0_16px_40px_-16px_rgba(0,0,0,0.35)] backdrop-blur-xl"
                    >
                        <label className="flex min-h-[52px] flex-[999_1_280px] items-center gap-2.5 rounded-[10px] bg-mist px-3.5">
                            <Search className="size-5 text-plum" aria-hidden />
                            <span className="sr-only">
                                Nom du cours, code UE ou enseignant
                            </span>
                            <input
                                type="search"
                                name="q"
                                placeholder="Nom du cours, code UE ou enseignant"
                                className="min-w-0 flex-1 border-0 bg-transparent text-base text-ink outline-none placeholder:text-dusk"
                            />
                        </label>
                        <label className="flex min-h-[52px] flex-[1_1_150px] flex-col justify-center rounded-[10px] bg-mist px-3.5 py-1 text-xs font-semibold text-plum">
                            Filière
                            <select
                                name="filiere"
                                defaultValue=""
                                className="border-0 bg-transparent p-0 text-[15px] text-ink outline-none"
                            >
                                <option value="">Toutes</option>
                                {filieres.map((filiere) => (
                                    <option key={filiere}>{filiere}</option>
                                ))}
                            </select>
                        </label>
                        <label className="flex min-h-[52px] flex-[1_1_110px] flex-col justify-center rounded-[10px] bg-mist px-3.5 py-1 text-xs font-semibold text-plum">
                            Niveau
                            <select
                                name="niveau"
                                defaultValue=""
                                className="border-0 bg-transparent p-0 text-[15px] text-ink outline-none"
                            >
                                <option value="">Tous</option>
                                {niveaux.map((niveau) => (
                                    <option key={niveau}>{niveau}</option>
                                ))}
                            </select>
                        </label>
                        <button
                            type="submit"
                            className="flex min-h-[52px] flex-auto cursor-pointer items-center justify-center rounded-[10px] bg-ink px-7 font-bold text-white hover:bg-plum sm:flex-none"
                        >
                            Rechercher
                        </button>
                    </Form>
                </div>
            </section>

            <main className="mx-auto -mt-10 flex max-w-[1200px] flex-col gap-10 px-4 pb-16 sm:px-6">
                {periode ? (
                    <div className="carte teinte-ciel flex flex-wrap items-center justify-between gap-4 px-5 py-5 sm:px-6">
                        <div className="flex items-center gap-4">
                            <span className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-ink">
                                <CalendarDays
                                    className="size-[22px] text-lilac"
                                    aria-hidden
                                />
                            </span>
                            <div>
                                <p className="m-0 text-base font-bold">
                                    {periode.libelle} : évaluations ouvertes
                                    jusqu'au {formatDate(periode.date_fin)}
                                </p>
                                <p className="m-0 text-sm text-plum">
                                    {coursEnAttente.length > 0
                                        ? `Votre avis compte maintenant, pendant le cours. ${coursEnAttente.length} cours ${coursEnAttente.length > 1 ? 'attendent' : 'attend'} votre avis.`
                                        : 'Merci : vous avez donné votre avis sur tous vos cours.'}
                                </p>
                            </div>
                        </div>
                        {coursEnAttente.length > 0 && (
                            <div className="flex flex-wrap gap-2">
                                {coursEnAttente.slice(0, 3).map((cours) => (
                                    <Link
                                        key={cours.id}
                                        href={CoursController.show(cours.id, {
                                            query: { avis: 1 },
                                        })}
                                        className="rounded-[10px] bg-ink px-4 py-3 text-sm font-bold text-white no-underline hover:bg-plum hover:text-white"
                                    >
                                        Donner mon avis · {cours.code_ue}
                                    </Link>
                                ))}
                            </div>
                        )}
                    </div>
                ) : (
                    <div className="carte flex items-center gap-4 px-6 py-5">
                        <CalendarDays
                            className="size-6 text-plum"
                            aria-hidden
                        />
                        <p className="m-0 text-sm text-plum">
                            Aucune période d'évaluation n'est ouverte pour le
                            moment. Vous pouvez consulter les fiches et les
                            avis.
                        </p>
                    </div>
                )}

                <section
                    aria-labelledby="mieux-notes"
                    className="flex flex-col gap-5"
                >
                    <div className="flex flex-wrap items-baseline justify-between gap-2">
                        <h2
                            id="mieux-notes"
                            className="m-0 font-display text-[28px] font-bold"
                        >
                            Cours les mieux notés
                        </h2>
                        <Link
                            href={CoursController.index({
                                query: { tri: 'note' },
                            })}
                            className="text-sm font-semibold"
                        >
                            Voir tous les cours
                        </Link>
                    </div>
                    {mieuxNotes.length > 0 ? (
                        <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
                            {mieuxNotes.map((cours) => (
                                <CoursCard key={cours.id} cours={cours} />
                            ))}
                        </div>
                    ) : (
                        <EtatVide
                            icone={MessageCircle}
                            titre="Pas encore de classement"
                        >
                            La moyenne d'un cours s'affiche à partir de 5 avis,
                            pour protéger l'anonymat des auteurs.
                        </EtatVide>
                    )}
                </section>

                <div className="flex flex-wrap items-start gap-6">
                    <section
                        aria-labelledby="derniers-avis"
                        className="flex min-w-0 flex-[999_1_560px] flex-col gap-4"
                    >
                        <h2
                            id="derniers-avis"
                            className="m-0 font-display text-[28px] font-bold"
                        >
                            Derniers avis
                        </h2>
                        {derniersAvis.length > 0 ? (
                            derniersAvis.map((avis) => (
                                <AvisCard
                                    key={avis.id}
                                    avis={avis}
                                    afficherCours
                                />
                            ))
                        ) : (
                            <EtatVide
                                icone={MessageCircle}
                                titre="Aucun avis pour l'instant"
                            />
                        )}
                    </section>

                    <aside
                        aria-labelledby="anciens"
                        className="bandeau flex flex-[1_1_320px] flex-col gap-3.5 p-6 text-white"
                    >
                        <p className="m-0 text-xs font-bold tracking-[0.08em] text-lagon uppercase">
                            Retours des anciens
                        </p>
                        <h2
                            id="anciens"
                            className="m-0 font-display text-2xl leading-tight font-bold"
                        >
                            « Ce que j'aurais aimé savoir avant »
                        </h2>
                        <p className="m-0 text-lavender">
                            Les diplômés de votre filière partagent leur
                            expérience du parcours : choix d'options, charge de
                            travail, débouchés.
                        </p>
                        <Link
                            href={retoursAnciens()}
                            className="self-start rounded-[10px] bg-lilac px-[18px] py-3 font-bold text-ink no-underline hover:bg-lavender hover:text-ink"
                        >
                            Lire les témoignages
                        </Link>
                    </aside>
                </div>
            </main>
        </>
    );
}
