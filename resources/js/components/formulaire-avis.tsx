import { Form } from '@inertiajs/react';
import { ShieldCheck } from 'lucide-react';
import { useState } from 'react';
import AvisController from '@/actions/App/Http/Controllers/AvisController';
import InputError from '@/components/input-error';
import NoteSelecteur from '@/components/note-selecteur';
import { Button } from '@/components/ui/button';

const LONGUEUR_MAX = 1000;

export default function FormulaireAvis({
    coursId,
    avisExistant,
    onAnnuler,
}: {
    coursId: number;
    avisExistant?: { id: number; note: number; commentaire: string } | null;
    onAnnuler?: () => void;
}) {
    const [longueur, setLongueur] = useState(
        avisExistant?.commentaire.length ?? 0,
    );
    const action = avisExistant
        ? AvisController.update.form(avisExistant.id)
        : AvisController.store.form(coursId);

    return (
        <Form
            {...action}
            options={{ preserveScroll: true }}
            className="flex flex-col gap-4"
            onSuccess={() => onAnnuler?.()}
        >
            {({ errors, processing }) => (
                <>
                    <NoteSelecteur
                        valeurInitiale={avisExistant?.note}
                        invalide={!!errors.note}
                    />
                    <InputError message={errors.note} />

                    <div className="flex flex-col gap-1.5">
                        <label
                            htmlFor="commentaire"
                            className="text-sm font-semibold"
                        >
                            Votre commentaire
                        </label>
                        <textarea
                            id="commentaire"
                            name="commentaire"
                            rows={4}
                            required
                            minLength={10}
                            maxLength={LONGUEUR_MAX}
                            defaultValue={avisExistant?.commentaire}
                            onChange={(event) =>
                                setLongueur(event.target.value.length)
                            }
                            aria-invalid={!!errors.commentaire}
                            aria-describedby="commentaire-aide"
                            placeholder="Clarté, exigence, utilité, conseils pour réussir…"
                            className="champ resize-y"
                        />
                        <div
                            id="commentaire-aide"
                            className="flex justify-between gap-3 text-xs text-plum"
                        >
                            <span>
                                Parlez du cours et de la pédagogie, jamais de la
                                vie privée de l'enseignant.
                            </span>
                            <span className="shrink-0">
                                {longueur} / {LONGUEUR_MAX}
                            </span>
                        </div>
                        <InputError message={errors.commentaire} />
                    </div>

                    <p className="m-0 flex items-start gap-2 rounded-lg bg-mist px-3 py-2.5 text-[13px] text-plum">
                        <ShieldCheck
                            className="mt-px size-4 shrink-0 text-iris"
                            aria-hidden
                        />
                        Votre nom n'apparaît jamais : ni pour les étudiants, ni
                        pour l'enseignant, ni pour l'administration.
                    </p>

                    <div className="flex flex-wrap justify-end gap-2">
                        {onAnnuler && (
                            <Button
                                type="button"
                                variant="outline"
                                onClick={onAnnuler}
                            >
                                Annuler
                            </Button>
                        )}
                        <Button
                            type="submit"
                            disabled={processing}
                            className="min-h-11 px-5 font-bold"
                        >
                            {avisExistant
                                ? 'Enregistrer mon avis'
                                : 'Publier mon avis'}
                        </Button>
                    </div>
                </>
            )}
        </Form>
    );
}
