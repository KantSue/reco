import { Form, Head } from '@inertiajs/react';
import CompteController from '@/actions/App/Http/Controllers/CompteController';
import Champ from '@/components/champ';
import PasswordInput from '@/components/password-input';
import { Button } from '@/components/ui/button';

type Props = {
    compte: {
        identifiant: string;
        nom_complet: string;
        email: string | null;
        role: string;
    };
};

export default function Compte({ compte }: Props) {
    return (
        <>
            <Head title="Mon compte" />

            <main className="mx-auto flex max-w-200 flex-col gap-6 px-4 pt-8 pb-16 sm:px-6">
                <h1 className="m-0 font-display text-[38px] leading-tight font-bold">
                    Mon compte
                </h1>

                <section
                    aria-labelledby="infos"
                    className="carte flex flex-col gap-3 p-6"
                >
                    <h2
                        id="infos"
                        className="m-0 font-display text-xl font-bold"
                    >
                        Informations
                    </h2>
                    <dl className="m-0 grid gap-x-6 gap-y-2 sm:grid-cols-[160px_1fr]">
                        <dt className="font-semibold text-plum">Nom</dt>
                        <dd className="m-0">{compte.nom_complet}</dd>
                        <dt className="font-semibold text-plum">Identifiant</dt>
                        <dd className="m-0">{compte.identifiant}</dd>
                        <dt className="font-semibold text-plum">Rôle</dt>
                        <dd className="m-0">{compte.role}</dd>
                        {compte.email && (
                            <>
                                <dt className="font-semibold text-plum">
                                    E-mail
                                </dt>
                                <dd className="m-0">{compte.email}</dd>
                            </>
                        )}
                    </dl>
                    <p className="m-0 text-sm text-plum">
                        Une information est incorrecte ? Contactez la scolarité.
                    </p>
                </section>

                <Form
                    {...CompteController.update.form()}
                    options={{ preserveScroll: true }}
                    resetOnError={[
                        'password',
                        'password_confirmation',
                        'current_password',
                    ]}
                    resetOnSuccess
                    className="carte flex flex-col gap-4 p-6"
                >
                    {({ errors, processing }) => (
                        <>
                            <h2 className="m-0 font-display text-xl font-bold">
                                Changer mon mot de passe
                            </h2>
                            <Champ
                                label="Mot de passe actuel"
                                htmlFor="current_password"
                                erreur={errors.current_password}
                            >
                                <PasswordInput
                                    id="current_password"
                                    name="current_password"
                                    autoComplete="current-password"
                                    className="champ h-auto"
                                />
                            </Champ>
                            <Champ
                                label="Nouveau mot de passe"
                                htmlFor="password"
                                erreur={errors.password}
                            >
                                <PasswordInput
                                    id="password"
                                    name="password"
                                    autoComplete="new-password"
                                    className="champ h-auto"
                                />
                            </Champ>
                            <Champ
                                label="Confirmer le nouveau mot de passe"
                                htmlFor="password_confirmation"
                                erreur={errors.password_confirmation}
                            >
                                <PasswordInput
                                    id="password_confirmation"
                                    name="password_confirmation"
                                    autoComplete="new-password"
                                    className="champ h-auto"
                                />
                            </Champ>
                            <div className="flex justify-end">
                                <Button
                                    type="submit"
                                    disabled={processing}
                                    className="min-h-11 px-6 font-bold"
                                >
                                    Enregistrer
                                </Button>
                            </div>
                        </>
                    )}
                </Form>
            </main>
        </>
    );
}
