import { Form, Head, Link, usePage } from '@inertiajs/react';
import { SearchX, Search } from 'lucide-react';
import CoursController from '@/actions/App/Http/Controllers/CoursController';
import CoursCard from '@/components/cours-card';
import EtatVide from '@/components/etat-vide';
import { pluriel } from '@/lib/format';
import { login } from '@/routes';
import type { Cours } from '@/types';

type Props = {
    cours: Cours[];
    filtres: { q: string; filiere: string; niveau: string; tri: string };
    filieres: string[];
    niveaux: string[];
    avecNotes: boolean;
};

export default function CoursIndex({
    cours,
    filtres,
    filieres,
    niveaux,
    avecNotes,
}: Props) {
    const { auth } = usePage().props;
    const filtreActif = Boolean(filtres.q || filtres.filiere || filtres.niveau);

    return (
        <>
            <Head title="Cours" />

            <section className="bandeau px-4 pt-8 pb-16 text-white sm:px-6">
                <div className="mx-auto flex max-w-300 flex-col gap-4">
                    <p className="m-0 text-[13px] font-bold tracking-[0.08em] text-lagon uppercase">
                        Catalogue des UE
                    </p>
                    <h1 className="m-0 font-display text-4xl leading-tight font-bold sm:text-[44px]">
                        Trouver un cours
                    </h1>
                    <p className="m-0 max-w-155 text-lavender">
                        Recherchez par nom, code UE ou enseignant, puis filtrez
                        par filière et niveau.
                        {!auth.user && (
                            <>
                                {' '}
                                Vous consultez les fiches officielles sans
                                compte :{' '}
                                <Link
                                    href={login()}
                                    className="font-semibold text-white underline"
                                >
                                    connectez-vous
                                </Link>{' '}
                                pour lire les avis.
                            </>
                        )}
                    </p>
                </div>
            </section>

            <main className="mx-auto -mt-10 flex max-w-300 flex-col gap-6 px-4 pb-16 sm:px-6">
                <Form
                    {...CoursController.index.form()}
                    role="search"
                    aria-label="Rechercher un cours"
                    className="carte flex flex-wrap items-end gap-3 p-3 shadow-[0_8px_28px_rgba(27,14,32,0.06)]"
                >
                    <label className="flex flex-[999_1_260px] flex-col gap-1 text-xs font-semibold text-plum">
                        Recherche
                        <span className="flex min-h-12 items-center gap-2 rounded-[10px] bg-mist px-3">
                            <Search className="size-4.5" aria-hidden />
                            <input
                                type="search"
                                name="q"
                                defaultValue={filtres.q}
                                placeholder="Algorithmique, INF101, Rasoanaivo…"
                                className="min-w-0 flex-1 border-0 bg-transparent text-[15px] text-ink outline-none"
                            />
                        </span>
                    </label>
                    <label className="flex flex-[1_1_150px] flex-col gap-1 text-xs font-semibold text-plum">
                        Filière
                        <select
                            name="filiere"
                            defaultValue={filtres.filiere}
                            className="min-h-12 rounded-[10px] border-0 bg-mist px-3 text-[15px] text-ink"
                        >
                            <option value="">Toutes</option>
                            {filieres.map((filiere) => (
                                <option key={filiere}>{filiere}</option>
                            ))}
                        </select>
                    </label>
                    <label className="flex flex-[1_1_110px] flex-col gap-1 text-xs font-semibold text-plum">
                        Niveau
                        <select
                            name="niveau"
                            defaultValue={filtres.niveau}
                            className="min-h-12 rounded-[10px] border-0 bg-mist px-3 text-[15px] text-ink"
                        >
                            <option value="">Tous</option>
                            {niveaux.map((niveau) => (
                                <option key={niveau}>{niveau}</option>
                            ))}
                        </select>
                    </label>
                    <label className="flex flex-[1_1_160px] flex-col gap-1 text-xs font-semibold text-plum">
                        Trier par
                        <select
                            name="tri"
                            defaultValue={filtres.tri}
                            className="min-h-12 rounded-[10px] border-0 bg-mist px-3 text-[15px] text-ink"
                        >
                            <option value="nom">Nom</option>
                            {avecNotes && (
                                <option value="note">Note moyenne</option>
                            )}
                            <option value="recent">Mise à jour récente</option>
                        </select>
                    </label>
                    <button
                        type="submit"
                        className="min-h-12 flex-auto cursor-pointer rounded-[10px] bg-ink px-6 font-bold text-white hover:bg-plum sm:flex-none"
                    >
                        Rechercher
                    </button>
                </Form>

                <div className="flex flex-wrap items-center justify-between gap-2">
                    <p className="m-0 font-semibold" aria-live="polite">
                        {pluriel(cours.length, 'cours', 'cours')}
                        {filtreActif && ' trouvés'}
                    </p>
                    {filtreActif && (
                        <Link
                            href={CoursController.index()}
                            className="text-sm font-semibold"
                        >
                            Effacer les filtres
                        </Link>
                    )}
                </div>

                {cours.length > 0 ? (
                    <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
                        {cours.map((unCours) => (
                            <CoursCard
                                key={unCours.id}
                                cours={unCours}
                                avecNotes={avecNotes}
                            />
                        ))}
                    </div>
                ) : (
                    <EtatVide icone={SearchX} titre="Aucun cours ne correspond">
                        Essayez un autre mot-clé ou retirez un filtre.
                    </EtatVide>
                )}
            </main>
        </>
    );
}
