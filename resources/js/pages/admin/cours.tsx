import { Form, Head, Link } from '@inertiajs/react';
import { AlertTriangle, BookOpen, Pencil, Plus, Trash2 } from 'lucide-react';
import { useState } from 'react';
import CoursAdminController from '@/actions/App/Http/Controllers/Admin/CoursController';
import CoursController from '@/actions/App/Http/Controllers/CoursController';
import Champ from '@/components/champ';
import EtatVide from '@/components/etat-vide';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogTitle,
} from '@/components/ui/dialog';
import { EnTeteAdmin } from '@/layouts/admin-layout';
import { formatDateCourte, formatNote, pluriel } from '@/lib/format';
import {
    destroy as supprimerFiliere,
    store as creerFiliere,
} from '@/routes/admin/filieres';
import type { Cours, Option } from '@/types';

type CoursAdmin = Cours & { filiere_id: number; enseignant_id: number | null };

type Filiere = {
    id: number;
    nom: string;
    niveau: string;
    libelle: string;
    nb_cours: number;
};

type Props = {
    cours: CoursAdmin[];
    filieres: Filiere[];
    enseignants: { id: number; nom_complet: string }[];
    exigences: Option[];
    niveaux: string[];
};

export default function CoursAdmin({
    cours,
    filieres,
    enseignants,
    exigences,
    niveaux,
}: Props) {
    const [edition, setEdition] = useState<{ cours: CoursAdmin | null } | null>(
        null,
    );

    return (
        <>
            <Head title="Cours et filières" />

            <EnTeteAdmin
                titre="Cours et filières"
                description="Les fiches officielles sont publiques. Les enseignants complètent le contenu pédagogique depuis « Mes cours »."
                actions={
                    <Button
                        onClick={() => setEdition({ cours: null })}
                        className="min-h-11 px-5 font-bold"
                        disabled={filieres.length === 0}
                    >
                        <Plus aria-hidden /> Nouveau cours
                    </Button>
                }
            />

            <section
                aria-labelledby="liste-cours"
                className="flex flex-col gap-3"
            >
                <h2
                    id="liste-cours"
                    className="m-0 font-display text-[22px] font-bold"
                >
                    {pluriel(cours.length, 'cours', 'cours')}
                </h2>
                {cours.length === 0 ? (
                    <EtatVide icone={BookOpen} titre="Aucun cours" />
                ) : (
                    <div className="carte overflow-x-auto">
                        <table className="w-full min-w-190 border-collapse text-left text-sm">
                            <thead>
                                <tr className="border-b border-line text-xs tracking-[0.04em] text-plum uppercase">
                                    <th className="px-4 py-3 font-bold">UE</th>
                                    <th className="px-4 py-3 font-bold">
                                        Filière
                                    </th>
                                    <th className="px-4 py-3 font-bold">
                                        Enseignant
                                    </th>
                                    <th className="px-4 py-3 font-bold">
                                        Avis
                                    </th>
                                    <th className="px-4 py-3 font-bold">
                                        Mise à jour
                                    </th>
                                    <th className="px-4 py-3">
                                        <span className="sr-only">Actions</span>
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {cours.map((unCours) => (
                                    <tr
                                        key={unCours.id}
                                        className="border-b border-haze last:border-0"
                                    >
                                        <td className="px-4 py-3">
                                            <Link
                                                href={CoursController.show(
                                                    unCours.id,
                                                )}
                                                className="font-bold text-ink"
                                            >
                                                {unCours.code_ue} ·{' '}
                                                {unCours.intitule}
                                            </Link>
                                            <div className="text-xs text-plum">
                                                Semestre {unCours.semestre} ·
                                                exigence{' '}
                                                {unCours.exigence.label.toLowerCase()}
                                            </div>
                                        </td>
                                        <td className="px-4 py-3">
                                            {unCours.filiere?.nom} ·{' '}
                                            {unCours.filiere?.niveau}
                                        </td>
                                        <td className="px-4 py-3">
                                            {unCours.enseignant
                                                ?.nom_complet ?? (
                                                <span className="text-dusk">
                                                    À désigner
                                                </span>
                                            )}
                                        </td>
                                        <td className="px-4 py-3">
                                            {unCours.nb_avis}
                                            {unCours.moyenne != null && (
                                                <span className="text-plum">
                                                    {' '}
                                                    ·{' '}
                                                    {formatNote(
                                                        unCours.moyenne,
                                                    )}
                                                    /5
                                                </span>
                                            )}
                                        </td>
                                        <td className="px-4 py-3">
                                            {unCours.est_perime ? (
                                                <span className="flex items-center gap-1.5 font-semibold text-alert">
                                                    <AlertTriangle
                                                        className="size-4"
                                                        aria-hidden
                                                    />
                                                    {formatDateCourte(
                                                        unCours.date_maj,
                                                    )}
                                                </span>
                                            ) : (
                                                formatDateCourte(
                                                    unCours.date_maj,
                                                )
                                            )}
                                        </td>
                                        <td className="px-4 py-2">
                                            <div className="flex justify-end gap-1">
                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        setEdition({
                                                            cours: unCours,
                                                        })
                                                    }
                                                    aria-label={`Modifier ${unCours.code_ue}`}
                                                    className="flex size-11 cursor-pointer items-center justify-center rounded-lg text-plum hover:bg-haze"
                                                >
                                                    <Pencil className="size-4" />
                                                </button>
                                                <Link
                                                    href={CoursAdminController.destroy(
                                                        unCours.id,
                                                    )}
                                                    as="button"
                                                    preserveScroll
                                                    onBefore={() =>
                                                        window.confirm(
                                                            `Supprimer ${unCours.code_ue} et tous ses avis ?`,
                                                        )
                                                    }
                                                    aria-label={`Supprimer ${unCours.code_ue}`}
                                                    className="flex size-11 cursor-pointer items-center justify-center rounded-lg text-plum hover:bg-haze"
                                                >
                                                    <Trash2 className="size-4" />
                                                </Link>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </section>

            <section
                aria-labelledby="filieres"
                className="flex flex-wrap items-start gap-5"
            >
                <div className="carte flex flex-[999_1_420px] flex-col gap-2 p-6">
                    <h2
                        id="filieres"
                        className="m-0 mb-1 font-display text-xl font-bold"
                    >
                        Filières
                    </h2>
                    {filieres.map((filiere) => (
                        <div
                            key={filiere.id}
                            className="flex items-center justify-between gap-3 rounded-xl bg-mist px-4 py-2"
                        >
                            <span>
                                <strong>{filiere.libelle}</strong>
                                <span className="text-[13px] text-plum">
                                    {' '}
                                    ·{' '}
                                    {pluriel(
                                        filiere.nb_cours,
                                        'cours',
                                        'cours',
                                    )}
                                </span>
                            </span>
                            {filiere.nb_cours === 0 && (
                                <Link
                                    href={supprimerFiliere(filiere.id)}
                                    as="button"
                                    preserveScroll
                                    aria-label={`Supprimer ${filiere.libelle}`}
                                    className="flex size-11 cursor-pointer items-center justify-center rounded-lg text-plum hover:bg-haze"
                                >
                                    <Trash2 className="size-4" />
                                </Link>
                            )}
                        </div>
                    ))}
                </div>
                <Form
                    {...creerFiliere.form()}
                    resetOnSuccess
                    options={{ preserveScroll: true }}
                    className="carte flex flex-[1_1_300px] flex-col gap-4 p-6"
                >
                    {({ errors, processing }) => (
                        <>
                            <h2 className="m-0 font-display text-xl font-bold">
                                Nouvelle filière
                            </h2>
                            <Champ
                                label="Nom"
                                htmlFor="nom-filiere"
                                erreur={errors.nom}
                            >
                                <input
                                    id="nom-filiere"
                                    name="nom"
                                    required
                                    className="champ"
                                    placeholder="Mathématiques"
                                />
                            </Champ>
                            <Champ
                                label="Niveau"
                                htmlFor="niveau"
                                erreur={errors.niveau}
                            >
                                <select
                                    id="niveau"
                                    name="niveau"
                                    className="champ"
                                >
                                    {niveaux.map((niveau) => (
                                        <option key={niveau}>{niveau}</option>
                                    ))}
                                </select>
                            </Champ>
                            <Button
                                type="submit"
                                disabled={processing}
                                className="min-h-11 self-end px-5 font-bold"
                            >
                                Créer la filière
                            </Button>
                        </>
                    )}
                </Form>
            </section>

            <Dialog
                open={edition !== null}
                onOpenChange={(ouvert) => !ouvert && setEdition(null)}
            >
                <DialogContent className="max-h-[90vh] overflow-y-auto bg-white/85 backdrop-blur-2xl sm:max-w-2xl">
                    {edition && (
                        <FormulaireCours
                            cours={edition.cours}
                            filieres={filieres}
                            enseignants={enseignants}
                            exigences={exigences}
                            onTermine={() => setEdition(null)}
                        />
                    )}
                </DialogContent>
            </Dialog>
        </>
    );
}

function FormulaireCours({
    cours,
    filieres,
    enseignants,
    exigences,
    onTermine,
}: {
    cours: CoursAdmin | null;
    filieres: Filiere[];
    enseignants: Props['enseignants'];
    exigences: Option[];
    onTermine: () => void;
}) {
    const action = cours
        ? CoursAdminController.update.form(cours.id)
        : CoursAdminController.store.form();

    return (
        <>
            <DialogTitle className="font-display text-xl">
                {cours ? `Modifier ${cours.code_ue}` : 'Nouveau cours'}
            </DialogTitle>
            <DialogDescription className="text-plum">
                Informations officielles de l'UE.
            </DialogDescription>
            <Form
                {...action}
                options={{ preserveScroll: true }}
                onSuccess={onTermine}
                className="flex flex-col gap-4"
            >
                {({ errors, processing }) => (
                    <>
                        <div className="flex flex-wrap gap-3">
                            <Champ
                                label="Code UE"
                                htmlFor="code_ue"
                                erreur={errors.code_ue}
                                className="flex-[1_1_120px]"
                            >
                                <input
                                    id="code_ue"
                                    name="code_ue"
                                    required
                                    defaultValue={cours?.code_ue}
                                    className="champ"
                                />
                            </Champ>
                            <Champ
                                label="Intitulé"
                                htmlFor="intitule"
                                erreur={errors.intitule}
                                className="flex-[3_1_260px]"
                            >
                                <input
                                    id="intitule"
                                    name="intitule"
                                    required
                                    defaultValue={cours?.intitule}
                                    className="champ"
                                />
                            </Champ>
                        </div>
                        <div className="flex flex-wrap gap-3">
                            <Champ
                                label="Filière"
                                htmlFor="filiere_id"
                                erreur={errors.filiere_id}
                                className="flex-[2_1_200px]"
                            >
                                <select
                                    id="filiere_id"
                                    name="filiere_id"
                                    defaultValue={cours?.filiere_id}
                                    className="champ"
                                >
                                    {filieres.map((filiere) => (
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
                                label="Semestre"
                                htmlFor="semestre"
                                erreur={errors.semestre}
                                className="flex-[1_1_100px]"
                            >
                                <input
                                    id="semestre"
                                    name="semestre"
                                    type="number"
                                    min={1}
                                    max={10}
                                    required
                                    defaultValue={cours?.semestre ?? 1}
                                    className="champ"
                                />
                            </Champ>
                        </div>
                        <div className="flex flex-wrap gap-3">
                            <Champ
                                label="Enseignant"
                                htmlFor="enseignant_id"
                                erreur={errors.enseignant_id}
                                className="flex-[2_1_200px]"
                            >
                                <select
                                    id="enseignant_id"
                                    name="enseignant_id"
                                    defaultValue={cours?.enseignant_id ?? ''}
                                    className="champ"
                                >
                                    <option value="">À désigner</option>
                                    {enseignants.map((enseignant) => (
                                        <option
                                            key={enseignant.id}
                                            value={enseignant.id}
                                        >
                                            {enseignant.nom_complet}
                                        </option>
                                    ))}
                                </select>
                            </Champ>
                            <Champ
                                label="Exigence"
                                htmlFor="exigence"
                                erreur={errors.exigence}
                                className="flex-[1_1_140px]"
                            >
                                <select
                                    id="exigence"
                                    name="exigence"
                                    defaultValue={
                                        cours?.exigence.value ?? 'moyenne'
                                    }
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
                            label="Contenu"
                            htmlFor="contenu"
                            erreur={errors.contenu}
                        >
                            <textarea
                                id="contenu"
                                name="contenu"
                                rows={2}
                                defaultValue={cours?.contenu ?? ''}
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
                                rows={4}
                                defaultValue={cours?.chapitres.join('\n') ?? ''}
                                className="champ resize-y"
                            />
                        </Champ>
                        <Champ
                            label="Outils (séparés par des virgules)"
                            htmlFor="outils"
                            erreur={errors.outils}
                        >
                            <input
                                id="outils"
                                name="outils"
                                defaultValue={cours?.outils.join(', ') ?? ''}
                                className="champ"
                            />
                        </Champ>
                        <Champ
                            label="Méthode d'enseignement"
                            htmlFor="methode"
                            erreur={errors.methode}
                        >
                            <textarea
                                id="methode"
                                name="methode"
                                rows={2}
                                defaultValue={cours?.methode ?? ''}
                                className="champ resize-y"
                            />
                        </Champ>
                        <Champ
                            label="Évaluation"
                            htmlFor="evaluation"
                            erreur={errors.evaluation}
                        >
                            <textarea
                                id="evaluation"
                                name="evaluation"
                                rows={2}
                                defaultValue={cours?.evaluation ?? ''}
                                className="champ resize-y"
                            />
                        </Champ>
                        <div className="flex justify-end gap-2">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={onTermine}
                            >
                                Annuler
                            </Button>
                            <Button
                                type="submit"
                                disabled={processing}
                                className="font-bold"
                            >
                                Enregistrer
                            </Button>
                        </div>
                    </>
                )}
            </Form>
        </>
    );
}
