import { Form, Head, Link } from '@inertiajs/react';
import { GraduationCap, Trash2 } from 'lucide-react';
import { useState } from 'react';
import RetourAncienController from '@/actions/App/Http/Controllers/RetourAncienController';
import Champ from '@/components/champ';
import EtatVide from '@/components/etat-vide';
import { Button } from '@/components/ui/button';
import { formatMoisAnnee } from '@/lib/format';
import { cn } from '@/lib/utils';

type Retour = {
    id: number;
    texte: string;
    date: string;
    filiere: string;
    annee_diplome: number | null;
    peut_supprimer: boolean;
};

type Props = {
    retours: Retour[];
    filiereActive: string;
    filieres: string[];
    filieresPublication: { id: number; libelle: string }[];
    peutPublier: boolean;
};

export default function RetoursAnciens({
    retours,
    filiereActive,
    filieres,
    filieresPublication,
    peutPublier,
}: Props) {
    const [formulaireOuvert, setFormulaireOuvert] = useState(false);

    return (
        <>
            <Head title="Retours des anciens" />

            <section className="bandeau px-4 pt-10 pb-14 text-white sm:px-6">
                <div className="mx-auto flex max-w-300 flex-wrap items-end justify-between gap-6">
                    <div className="flex flex-[1_1_520px] flex-col gap-3">
                        <p className="m-0 text-[13px] font-bold tracking-[0.08em] text-lagon uppercase">
                            Retours des anciens
                        </p>
                        <h1 className="m-0 font-display text-4xl leading-tight font-bold sm:text-[44px]">
                            Ceux qui sont passés avant vous.
                        </h1>
                        <p className="m-0 max-w-150 text-[17px] text-lavender">
                            Des diplômés racontent leur parcours dans la filière
                            : ce qui les a aidés, ce qu'ils referaient
                            autrement.
                        </p>
                    </div>
                    {peutPublier && !formulaireOuvert && (
                        <button
                            type="button"
                            onClick={() => setFormulaireOuvert(true)}
                            className="cursor-pointer rounded-[10px] bg-lilac px-5 py-3.5 font-bold text-ink hover:bg-lavender"
                        >
                            Publier un retour d'expérience
                        </button>
                    )}
                </div>
            </section>

            <main className="mx-auto flex max-w-300 flex-col gap-6 px-4 pt-7 pb-16 sm:px-6">
                {formulaireOuvert && (
                    <Form
                        {...RetourAncienController.store.form()}
                        onSuccess={() => setFormulaireOuvert(false)}
                        className="carte flex flex-col gap-4 p-6"
                    >
                        {({ errors, processing }) => (
                            <>
                                <h2 className="m-0 font-display text-xl font-bold">
                                    Votre retour d'expérience
                                </h2>
                                <Champ
                                    label="Filière concernée"
                                    htmlFor="filiere_id"
                                    erreur={errors.filiere_id}
                                >
                                    <select
                                        id="filiere_id"
                                        name="filiere_id"
                                        className="champ"
                                    >
                                        {filieresPublication.map((filiere) => (
                                            <option
                                                key={filiere.id}
                                                value={filiere.id}
                                            >
                                                {filiere.libelle}
                                            </option>
                                        ))}
                                    </select>
                                </Champ>
                                <Champ
                                    label="Votre témoignage"
                                    htmlFor="texte"
                                    erreur={errors.texte}
                                    aide="Conseils, charge de travail, choix d'options, débouchés… Pas de note : les anciens partagent leur expérience."
                                >
                                    <textarea
                                        id="texte"
                                        name="texte"
                                        rows={5}
                                        required
                                        minLength={20}
                                        maxLength={2000}
                                        className="champ resize-y"
                                    />
                                </Champ>
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
                                        Publier
                                    </Button>
                                </div>
                            </>
                        )}
                    </Form>
                )}

                <div
                    role="group"
                    aria-label="Filtrer par filière"
                    className="flex flex-wrap gap-2"
                >
                    {['', ...filieres].map((filiere) => {
                        const actif = filiere === filiereActive;

                        return (
                            <Link
                                key={filiere || 'toutes'}
                                href={RetourAncienController.index({
                                    query: filiere ? { filiere } : {},
                                })}
                                preserveScroll
                                aria-current={actif ? 'true' : undefined}
                                className={cn(
                                    'flex min-h-11 items-center rounded-full border-[1.5px] px-4.5 text-sm font-semibold no-underline',
                                    actif
                                        ? 'border-ink bg-ink text-white hover:text-white'
                                        : 'border-lilac bg-white text-ink hover:border-iris hover:text-ink',
                                )}
                            >
                                {filiere || 'Toutes'}
                            </Link>
                        );
                    })}
                </div>

                {retours.length === 0 ? (
                    <EtatVide
                        icone={GraduationCap}
                        titre="Pas encore de témoignage pour cette filière"
                    />
                ) : (
                    <div className="grid gap-5 md:grid-cols-2">
                        {retours.map((retour) => (
                            <article
                                key={retour.id}
                                className="carte flex flex-col gap-3.5 p-6.5"
                            >
                                <span
                                    aria-hidden
                                    className="h-6.5 font-display text-[56px] leading-[0.6] text-lilac"
                                >
                                    “
                                </span>
                                <p className="m-0 flex-1 whitespace-pre-line">
                                    {retour.texte}
                                </p>
                                <div className="flex flex-wrap items-center gap-2 border-t border-haze pt-3.5">
                                    <span className="rounded-md bg-lavender px-2.5 py-1 text-xs font-bold">
                                        {retour.filiere}
                                    </span>
                                    <span className="text-[13px] text-plum">
                                        Ancien étudiant
                                        {retour.annee_diplome &&
                                            ` · diplômé en ${retour.annee_diplome}`}{' '}
                                        · {formatMoisAnnee(retour.date)}
                                    </span>
                                    {retour.peut_supprimer && (
                                        <Link
                                            href={RetourAncienController.destroy(
                                                retour.id,
                                            )}
                                            as="button"
                                            preserveScroll
                                            onBefore={() =>
                                                window.confirm(
                                                    'Supprimer ce témoignage ?',
                                                )
                                            }
                                            className="ml-auto flex min-h-11 cursor-pointer items-center gap-1.5 rounded-lg px-2 text-[13px] font-semibold text-plum hover:bg-haze"
                                        >
                                            <Trash2
                                                className="size-3.5"
                                                aria-hidden
                                            />
                                            Supprimer
                                        </Link>
                                    )}
                                </div>
                            </article>
                        ))}
                    </div>
                )}
            </main>
        </>
    );
}
