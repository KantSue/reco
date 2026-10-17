import { Form, Head, Link } from '@inertiajs/react';
import { Search, ThumbsUp, UserRoundX } from 'lucide-react';
import EnseignantController from '@/actions/App/Http/Controllers/EnseignantController';
import EtatVide from '@/components/etat-vide';
import { pluriel } from '@/lib/format';

type Enseignant = {
    id: number;
    nom_complet: string;
    nb_cours: number;
    nb_recommandations: number;
    cours: { id: number; code_ue: string; intitule: string }[];
};

export default function EnseignantsIndex({
    enseignants,
    q,
}: {
    enseignants: Enseignant[];
    q: string;
}) {
    return (
        <>
            <Head title="Enseignants" />

            <section className="bandeau px-4 pt-8 pb-16 text-white sm:px-6">
                <div className="mx-auto flex max-w-300 flex-col gap-4">
                    <p className="m-0 text-[13px] font-bold tracking-[0.08em] text-lagon uppercase">
                        Enseignants
                    </p>
                    <h1 className="m-0 font-display text-4xl leading-tight font-bold sm:text-[44px]">
                        Qui enseigne quoi ?
                    </h1>
                    <p className="m-0 max-w-155 text-lavender">
                        Les cours assurés par chaque enseignant et les
                        recommandations des étudiants. Pas de note publique, pas
                        de nom d'auteur.
                    </p>
                </div>
            </section>

            <main className="mx-auto -mt-10 flex max-w-300 flex-col gap-6 px-4 pb-16 sm:px-6">
                <Form
                    {...EnseignantController.index.form()}
                    role="search"
                    className="carte flex flex-wrap gap-3 p-3 shadow-[0_8px_28px_rgba(27,14,32,0.06)]"
                >
                    <label className="flex min-h-12 flex-[999_1_260px] items-center gap-2 rounded-[10px] bg-mist px-3">
                        <Search className="size-4.5 text-plum" aria-hidden />
                        <span className="sr-only">Nom de l'enseignant</span>
                        <input
                            type="search"
                            name="q"
                            defaultValue={q}
                            placeholder="Nom de l'enseignant"
                            className="min-w-0 flex-1 border-0 bg-transparent text-[15px] outline-none"
                        />
                    </label>
                    <button
                        type="submit"
                        className="min-h-12 flex-auto cursor-pointer rounded-[10px] bg-ink px-6 font-bold text-white hover:bg-plum sm:flex-none"
                    >
                        Rechercher
                    </button>
                </Form>

                {enseignants.length === 0 ? (
                    <EtatVide
                        icone={UserRoundX}
                        titre="Aucun enseignant trouvé"
                    />
                ) : (
                    <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
                        {enseignants.map((enseignant) => (
                            <Link
                                key={enseignant.id}
                                href={EnseignantController.show(enseignant.id)}
                                className="carte flex flex-col gap-4 p-5.5 text-ink no-underline hover:text-ink hover:shadow-[0_8px_28px_rgba(27,14,32,0.08)]"
                            >
                                <div className="flex items-center gap-3.5">
                                    <span className="flex size-13 shrink-0 items-center justify-center rounded-2xl bg-iris font-display text-xl font-bold text-white">
                                        {enseignant.nom_complet
                                            .split(' ')
                                            .pop()
                                            ?.charAt(0)}
                                    </span>
                                    <div className="flex flex-col">
                                        <strong className="font-display text-lg">
                                            {enseignant.nom_complet}
                                        </strong>
                                        <span className="flex items-center gap-1.5 text-[13px] text-plum">
                                            <ThumbsUp
                                                className="size-3.5"
                                                aria-hidden
                                            />
                                            {pluriel(
                                                enseignant.nb_recommandations,
                                                'recommandation',
                                            )}
                                        </span>
                                    </div>
                                </div>
                                <ul className="m-0 flex list-none flex-col gap-1.5 p-0">
                                    {enseignant.cours.map((cours) => (
                                        <li
                                            key={cours.id}
                                            className="rounded-lg bg-mist px-3 py-2 text-sm"
                                        >
                                            <span className="font-bold text-plum">
                                                {cours.code_ue}
                                            </span>{' '}
                                            · {cours.intitule}
                                        </li>
                                    ))}
                                </ul>
                            </Link>
                        ))}
                    </div>
                )}
            </main>
        </>
    );
}
