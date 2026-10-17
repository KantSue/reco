import { Form } from '@inertiajs/react';
import { Flag } from 'lucide-react';
import { useState } from 'react';
import SignalementController from '@/actions/App/Http/Controllers/SignalementController';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';

const MOTIFS = [
    "Propos sur la personne de l'enseignant",
    'Insultes ou propos diffamatoires',
    'Hors sujet',
    'Contenu contesté',
];

export default function SignalerAvis({
    avisId,
    dejaSignale,
}: {
    avisId: number;
    dejaSignale: boolean;
}) {
    const [ouvert, setOuvert] = useState(false);

    if (dejaSignale) {
        return (
            <span className="flex items-center gap-1.5 px-2 py-2.5 text-[13px] font-semibold text-dusk">
                <Flag className="size-3.5" aria-hidden />
                Signalé
            </span>
        );
    }

    return (
        <Dialog open={ouvert} onOpenChange={setOuvert}>
            <DialogTrigger asChild>
                <button
                    type="button"
                    className="flex min-h-11 cursor-pointer items-center gap-1.5 rounded-lg px-2 text-[13px] font-semibold text-plum hover:bg-haze"
                >
                    <Flag className="size-3.5" aria-hidden />
                    Signaler
                </button>
            </DialogTrigger>
            <DialogContent className="bg-white/85 backdrop-blur-2xl sm:max-w-md">
                <DialogTitle className="font-display text-xl">
                    Signaler cet avis
                </DialogTitle>
                <DialogDescription className="text-plum">
                    L'administration examinera l'avis. Après 3 signalements, il
                    est masqué automatiquement en attendant sa décision.
                </DialogDescription>
                <Form
                    {...SignalementController.store.form(avisId)}
                    options={{ preserveScroll: true }}
                    onSuccess={() => setOuvert(false)}
                    className="flex flex-col gap-4"
                >
                    {({ processing }) => (
                        <>
                            <fieldset className="flex flex-col gap-2">
                                <legend className="mb-2 text-sm font-semibold">
                                    Motif
                                </legend>
                                {MOTIFS.map((motif, index) => (
                                    <label
                                        key={motif}
                                        className="flex cursor-pointer items-center gap-3 rounded-lg border border-line px-3 py-2.5 text-sm has-checked:border-iris has-checked:bg-mist"
                                    >
                                        <input
                                            type="radio"
                                            name="motif"
                                            value={motif}
                                            defaultChecked={index === 0}
                                            className="accent-plum"
                                        />
                                        {motif}
                                    </label>
                                ))}
                            </fieldset>
                            <DialogFooter>
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() => setOuvert(false)}
                                >
                                    Annuler
                                </Button>
                                <Button type="submit" disabled={processing}>
                                    Signaler
                                </Button>
                            </DialogFooter>
                        </>
                    )}
                </Form>
            </DialogContent>
        </Dialog>
    );
}
