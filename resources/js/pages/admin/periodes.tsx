import { Form, Head, Link } from '@inertiajs/react';
import { CalendarRange, Trash2 } from 'lucide-react';
import PeriodeEvaluationController from '@/actions/App/Http/Controllers/Admin/PeriodeEvaluationController';
import Champ from '@/components/champ';
import EtatVide from '@/components/etat-vide';
import { Button } from '@/components/ui/button';
import { EnTeteAdmin } from '@/layouts/admin-layout';
import { formatDate, pluriel } from '@/lib/format';
import { cn } from '@/lib/utils';

type Periode = {
    id: number;
    libelle: string;
    date_debut: string;
    date_fin: string;
    etat: 'ouverte' | 'programmee' | 'terminee';
    nb_avis: number;
};

const ETATS: Record<Periode['etat'], { libelle: string; style: string }> = {
    ouverte: { libelle: 'Ouverte', style: 'border-ink bg-ink text-white' },
    programmee: {
        libelle: 'Programmée',
        style: 'border-lilac bg-white text-ink',
    },
    terminee: { libelle: 'Terminée', style: 'border-line bg-haze text-plum' },
};

export default function Periodes({ periodes }: { periodes: Periode[] }) {
    return (
        <>
            <Head title="Périodes d'évaluation" />

            <EnTeteAdmin
                titre="Périodes d'évaluation"
                description="Les étudiants ne peuvent déposer un avis que pendant une période ouverte : à mi-semestre, quand il est encore temps d'améliorer le cours, et en fin de semestre."
            />

            <div className="flex flex-wrap items-start gap-5">
                <section
                    aria-labelledby="liste"
                    className="carte flex flex-[999_1_480px] flex-col gap-3 p-6"
                >
                    <h2
                        id="liste"
                        className="m-0 font-display text-xl font-bold"
                    >
                        Calendrier
                    </h2>
                    {periodes.length === 0 ? (
                        <EtatVide
                            icone={CalendarRange}
                            titre="Aucune période"
                        />
                    ) : (
                        periodes.map((periode) => (
                            <div
                                key={periode.id}
                                className="flex flex-wrap items-center justify-between gap-3 rounded-xl bg-mist px-4 py-3"
                            >
                                <span>
                                    <strong>{periode.libelle}</strong>
                                    <br />
                                    <span className="text-[13px] text-plum">
                                        {formatDate(periode.date_debut)} →{' '}
                                        {formatDate(periode.date_fin)} ·{' '}
                                        {pluriel(
                                            periode.nb_avis,
                                            'avis',
                                            'avis',
                                        )}
                                    </span>
                                </span>
                                <span className="flex items-center gap-2">
                                    <span
                                        className={cn(
                                            'rounded-full border-[1.5px] px-3.5 py-2 text-[13px] font-bold',
                                            ETATS[periode.etat].style,
                                        )}
                                    >
                                        {ETATS[periode.etat].libelle}
                                    </span>
                                    {periode.nb_avis === 0 && (
                                        <Link
                                            href={PeriodeEvaluationController.destroy(
                                                periode.id,
                                            )}
                                            as="button"
                                            preserveScroll
                                            onBefore={() =>
                                                window.confirm(
                                                    'Supprimer cette période ?',
                                                )
                                            }
                                            aria-label={`Supprimer ${periode.libelle}`}
                                            className="flex size-11 cursor-pointer items-center justify-center rounded-lg text-plum hover:bg-haze"
                                        >
                                            <Trash2 className="size-4" />
                                        </Link>
                                    )}
                                </span>
                            </div>
                        ))
                    )}
                </section>

                <Form
                    {...PeriodeEvaluationController.store.form()}
                    resetOnSuccess
                    options={{ preserveScroll: true }}
                    className="carte flex flex-[1_1_320px] flex-col gap-4 p-6"
                >
                    {({ errors, processing }) => (
                        <>
                            <h2 className="m-0 font-display text-xl font-bold">
                                Ouvrir une période
                            </h2>
                            <Champ
                                label="Libellé"
                                htmlFor="libelle"
                                erreur={errors.libelle}
                            >
                                <input
                                    id="libelle"
                                    name="libelle"
                                    required
                                    placeholder="Fin de semestre S1 2026-2027"
                                    className="champ"
                                />
                            </Champ>
                            <div className="flex flex-wrap gap-3">
                                <Champ
                                    label="Début"
                                    htmlFor="date_debut"
                                    erreur={errors.date_debut}
                                    className="flex-[1_1_140px]"
                                >
                                    <input
                                        id="date_debut"
                                        name="date_debut"
                                        type="date"
                                        required
                                        className="champ"
                                    />
                                </Champ>
                                <Champ
                                    label="Fin"
                                    htmlFor="date_fin"
                                    erreur={errors.date_fin}
                                    className="flex-[1_1_140px]"
                                >
                                    <input
                                        id="date_fin"
                                        name="date_fin"
                                        type="date"
                                        required
                                        className="champ"
                                    />
                                </Champ>
                            </div>
                            <Button
                                type="submit"
                                disabled={processing}
                                className="min-h-11 self-end px-5 font-bold"
                            >
                                Enregistrer la période
                            </Button>
                        </>
                    )}
                </Form>
            </div>
        </>
    );
}
