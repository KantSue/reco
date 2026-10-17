import { Form, Head, Link } from '@inertiajs/react';
import { Megaphone, Trash2 } from 'lucide-react';
import SuiteDonneeController from '@/actions/App/Http/Controllers/Admin/SuiteDonneeController';
import CoursController from '@/actions/App/Http/Controllers/CoursController';
import Champ from '@/components/champ';
import EtatVide from '@/components/etat-vide';
import { Button } from '@/components/ui/button';
import { EnTeteAdmin } from '@/layouts/admin-layout';
import { formatDate, pluriel } from '@/lib/format';

type Props = {
    cours: { id: number; libelle: string; nb_avis: number }[];
    suites: {
        id: number;
        texte: string;
        date: string;
        cours: { id: number; libelle: string };
    }[];
};

export default function Suites({ cours, suites }: Props) {
    return (
        <>
            <Head title="Suite donnée" />

            <EnTeteAdmin
                titre="Suite donnée"
                description="Montrez aux étudiants ce qui change grâce à leurs avis : le retour s'affiche sur la fiche du cours."
            />

            <div className="flex flex-wrap items-start gap-5">
                <Form
                    {...SuiteDonneeController.store.form()}
                    resetOnSuccess={['texte']}
                    options={{ preserveScroll: true }}
                    className="carte flex flex-[1_1_360px] flex-col gap-4 p-6"
                >
                    {({ errors, processing }) => (
                        <>
                            <h2 className="m-0 font-display text-xl font-bold">
                                Publier une suite donnée
                            </h2>
                            <Champ
                                label="Cours"
                                htmlFor="cours_id"
                                erreur={errors.cours_id}
                            >
                                <select
                                    id="cours_id"
                                    name="cours_id"
                                    className="champ"
                                >
                                    {cours.map((unCours) => (
                                        <option
                                            key={unCours.id}
                                            value={unCours.id}
                                        >
                                            {unCours.libelle} (
                                            {pluriel(
                                                unCours.nb_avis,
                                                'avis',
                                                'avis',
                                            )}
                                            )
                                        </option>
                                    ))}
                                </select>
                            </Champ>
                            <Champ
                                label="Ce qui change grâce aux avis"
                                htmlFor="texte"
                                erreur={errors.texte}
                            >
                                <textarea
                                    id="texte"
                                    name="texte"
                                    rows={4}
                                    required
                                    maxLength={1000}
                                    placeholder="Ex. : les sujets de TP sont publiés une semaine à l'avance."
                                    className="champ resize-y"
                                />
                            </Champ>
                            <Button
                                type="submit"
                                disabled={processing}
                                className="min-h-11 self-end px-5 font-bold"
                            >
                                Publier sur la fiche
                            </Button>
                        </>
                    )}
                </Form>

                <section
                    aria-labelledby="publiees"
                    className="flex flex-[999_1_480px] flex-col gap-3"
                >
                    <h2
                        id="publiees"
                        className="m-0 font-display text-xl font-bold"
                    >
                        Suites publiées
                    </h2>
                    {suites.length === 0 ? (
                        <EtatVide
                            icone={Megaphone}
                            titre="Aucune suite donnée publiée"
                        />
                    ) : (
                        suites.map((suite) => (
                            <article
                                key={suite.id}
                                className="carte flex flex-col gap-2 px-5 py-4"
                            >
                                <div className="flex flex-wrap items-center justify-between gap-2">
                                    <Link
                                        href={CoursController.show(
                                            suite.cours.id,
                                        )}
                                        className="font-bold text-ink"
                                    >
                                        {suite.cours.libelle}
                                    </Link>
                                    <span className="text-[13px] text-plum">
                                        {formatDate(suite.date)}
                                    </span>
                                </div>
                                <p className="m-0 whitespace-pre-line">
                                    {suite.texte}
                                </p>
                                <div className="flex justify-end">
                                    <Link
                                        href={SuiteDonneeController.destroy(
                                            suite.id,
                                        )}
                                        as="button"
                                        preserveScroll
                                        onBefore={() =>
                                            window.confirm(
                                                'Retirer cette suite donnée de la fiche ?',
                                            )
                                        }
                                        className="flex min-h-11 cursor-pointer items-center gap-1.5 rounded-lg px-2 text-[13px] font-semibold text-plum hover:bg-haze"
                                    >
                                        <Trash2
                                            className="size-3.5"
                                            aria-hidden
                                        />
                                        Retirer
                                    </Link>
                                </div>
                            </article>
                        ))
                    )}
                </section>
            </div>
        </>
    );
}
