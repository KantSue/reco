import { Form, Head, Link } from '@inertiajs/react';
import {
    ArrowRight,
    CircleAlert,
    Eye,
    EyeOff,
    LockKeyhole,
    UserRound,
} from 'lucide-react';
import { useRef, useState } from 'react';
import { Spinner } from '@/components/ui/spinner';
import { cn } from '@/lib/utils';
import { index as cours } from '@/routes/cours';
import { store } from '@/routes/login';

type CompteDemo = {
    role: string;
    identifiant: string;
    motDePasse: string;
};

type Props = {
    status?: string;
    comptesDemo: CompteDemo[];
};

const champPilule =
    'flex h-13.5 items-center gap-3.5 rounded-full bg-plum/90 pr-1.5 pl-[22px] text-lavender shadow-[inset_0_1px_0_rgba(255,255,255,0.15)] backdrop-blur-md transition-[box-shadow,background-color] focus-within:bg-ink focus-within:shadow-[0_0_0_3px_#fff,0_0_0_5px_#838BCC]';

const saisie =
    'h-full min-w-0 flex-1 border-0 bg-transparent p-0 text-base font-medium tracking-[0.01em] text-white placeholder:text-white/55 focus:outline-none';

const erreurChamp = 'shadow-[0_0_0_2px_#fff,0_0_0_4px_#B0124F]';

export default function Login({ status, comptesDemo }: Props) {
    const [motDePasseVisible, setMotDePasseVisible] = useState(false);
    const identifiantRef = useRef<HTMLInputElement>(null);
    const motDePasseRef = useRef<HTMLInputElement>(null);

    function connecterAvec(compte: CompteDemo): void {
        if (!identifiantRef.current || !motDePasseRef.current) {
            return;
        }

        identifiantRef.current.value = compte.identifiant;
        motDePasseRef.current.value = compte.motDePasse;
        identifiantRef.current.form?.requestSubmit();
    }

    return (
        <>
            <Head title="Connexion" />

            <div className="mb-7 flex flex-col items-center gap-2.5 text-center">
                <img
                    src="/images/logo-reco.png"
                    alt="RECO"
                    width={83}
                    height={116}
                    className="mb-2 h-26 w-auto drop-shadow-[0_10px_18px_rgba(131,139,204,0.35)]"
                />
                <h1 className="m-0 font-display text-[26px] leading-tight font-bold tracking-[0.08em] uppercase">
                    Connexion
                </h1>
                <p className="m-0 max-w-[320px] text-[15px] text-plum">
                    Fiches de cours et avis anonymes de votre filière.
                </p>
            </div>

            {status && (
                <p className="mb-4 rounded-xl bg-white/60 px-4 py-3 text-center text-sm font-medium">
                    {status}
                </p>
            )}

            <Form
                {...store.form()}
                resetOnSuccess={['password']}
                className="flex flex-col"
            >
                {({ processing, errors }) => (
                    <>
                        {(errors.identifiant || errors.password) && (
                            <div
                                role="alert"
                                className="mb-4 flex items-start gap-3 rounded-xl border border-alert/25 bg-dragee/70 px-4 py-3 text-sm text-alert backdrop-blur-md"
                            >
                                <CircleAlert
                                    className="mt-0.5 size-4.5 shrink-0"
                                    aria-hidden
                                />
                                {errors.identifiant ?? errors.password}
                            </div>
                        )}

                        <div className="flex flex-col gap-4">
                            <label
                                className={cn(
                                    champPilule,
                                    errors.identifiant && erreurChamp,
                                )}
                            >
                                <UserRound
                                    className="size-5.5 shrink-0"
                                    aria-hidden
                                />
                                <span className="sr-only">Identifiant</span>
                                <input
                                    ref={identifiantRef}
                                    type="text"
                                    name="identifiant"
                                    required
                                    autoFocus
                                    autoComplete="username"
                                    placeholder="Identifiant"
                                    aria-invalid={!!errors.identifiant}
                                    className={saisie}
                                />
                            </label>

                            <div
                                className={cn(
                                    champPilule,
                                    errors.password && erreurChamp,
                                )}
                            >
                                <LockKeyhole
                                    className="size-5.5 shrink-0"
                                    aria-hidden
                                />
                                <label
                                    htmlFor="mot-de-passe"
                                    className="sr-only"
                                >
                                    Mot de passe
                                </label>
                                <input
                                    ref={motDePasseRef}
                                    id="mot-de-passe"
                                    type={
                                        motDePasseVisible ? 'text' : 'password'
                                    }
                                    name="password"
                                    required
                                    autoComplete="current-password"
                                    placeholder="Mot de passe"
                                    aria-invalid={!!errors.password}
                                    className={saisie}
                                />
                                <button
                                    type="button"
                                    onClick={() =>
                                        setMotDePasseVisible(
                                            (visible) => !visible,
                                        )
                                    }
                                    aria-label={
                                        motDePasseVisible
                                            ? 'Masquer le mot de passe'
                                            : 'Afficher le mot de passe'
                                    }
                                    aria-pressed={motDePasseVisible}
                                    className="flex size-11 shrink-0 cursor-pointer items-center justify-center rounded-full text-lavender hover:bg-white/10"
                                >
                                    {motDePasseVisible ? (
                                        <EyeOff className="size-5" />
                                    ) : (
                                        <Eye className="size-5" />
                                    )}
                                </button>
                            </div>
                        </div>

                        <label className="my-4 flex min-h-11 cursor-pointer items-center gap-2.5 text-sm font-medium">
                            <input
                                type="checkbox"
                                name="remember"
                                defaultChecked
                                className="size-4.5 cursor-pointer accent-iris"
                            />
                            Se souvenir de moi
                        </label>

                        <button
                            type="submit"
                            disabled={processing}
                            className="flex h-13.5 w-full cursor-pointer items-center justify-center gap-2.5 rounded-xl bg-ink text-[15px] font-bold tracking-[0.14em] text-white uppercase shadow-[0_14px_28px_-12px_rgba(35,36,79,0.7)] transition-colors hover:bg-plum disabled:cursor-progress"
                            data-test="login-button"
                        >
                            {processing ? (
                                <Spinner />
                            ) : (
                                <>
                                    <span>Se connecter</span>
                                    <ArrowRight
                                        className="size-4.5 text-lilac"
                                        aria-hidden
                                    />
                                </>
                            )}
                        </button>

                        <p className="mt-4 mb-0 text-sm text-plum">
                            Juste consulter ?{' '}
                            <Link
                                href={cours()}
                                className="font-semibold text-ink underline decoration-lilac decoration-[1.5px] underline-offset-[3px]"
                            >
                                Voir les cours sans compte
                            </Link>
                        </p>

                        {comptesDemo.length > 0 && (
                            <div className="mt-6 border-t border-white/70 pt-5">
                                <p className="m-0 mb-3 text-center text-xs font-semibold tracking-widest text-dusk uppercase">
                                    Comptes démo
                                </p>
                                <div className="grid grid-cols-2 gap-2">
                                    {comptesDemo.map((compte) => (
                                        <button
                                            key={compte.identifiant}
                                            type="button"
                                            disabled={processing}
                                            onClick={() =>
                                                connecterAvec(compte)
                                            }
                                            className="flex cursor-pointer flex-col items-start rounded-xl border border-white/70 bg-white/45 px-3 py-2 text-left transition-colors hover:bg-white/75 disabled:cursor-progress"
                                        >
                                            <span className="text-sm font-semibold text-ink">
                                                {compte.role}
                                            </span>
                                            <span className="text-xs text-dusk">
                                                {compte.identifiant}
                                            </span>
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}
                    </>
                )}
            </Form>
        </>
    );
}
