import { Form, Head, Link } from '@inertiajs/react';
import { BookCheck, Pencil, Plus, Search, Users } from 'lucide-react';
import { useState } from 'react';
import UtilisateurController from '@/actions/App/Http/Controllers/Admin/UtilisateurController';
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
import { cn } from '@/lib/utils';
import type { Option, Paginated, Role } from '@/types';

type Utilisateur = {
    id: number;
    identifiant: string;
    nom: string;
    prenom: string;
    email: string | null;
    role: Role;
    role_label: string;
    annee_diplome: number | null;
    actif: boolean;
    cours_suivis: number[];
};

type Props = {
    utilisateurs: Paginated<Utilisateur>;
    filtres: { q: string; role: string };
    roles: Option[];
    cours: { id: number; code_ue: string; intitule: string }[];
    anneeUniversitaire: string;
};

type Edition =
    | { type: 'compte'; utilisateur: Utilisateur | null }
    | { type: 'inscriptions'; utilisateur: Utilisateur }
    | null;

export default function Comptes({
    utilisateurs,
    filtres,
    roles,
    cours,
    anneeUniversitaire,
}: Props) {
    const [edition, setEdition] = useState<Edition>(null);
    const fermer = () => setEdition(null);

    return (
        <>
            <Head title="Comptes" />

            <EnTeteAdmin
                titre="Comptes"
                description="Les comptes sont créés par l'administration : étudiants, anciens, enseignants et administrateurs."
                actions={
                    <Button
                        onClick={() =>
                            setEdition({ type: 'compte', utilisateur: null })
                        }
                        className="min-h-11 px-5 font-bold"
                    >
                        <Plus aria-hidden /> Nouveau compte
                    </Button>
                }
            />

            <Form
                {...UtilisateurController.index.form()}
                role="search"
                className="carte flex flex-wrap gap-3 p-3"
            >
                <label className="flex min-h-12 flex-[999_1_240px] items-center gap-2 rounded-[10px] bg-mist px-3">
                    <Search className="size-4.5 text-plum" aria-hidden />
                    <span className="sr-only">Nom ou identifiant</span>
                    <input
                        type="search"
                        name="q"
                        defaultValue={filtres.q}
                        placeholder="Nom ou identifiant"
                        className="min-w-0 flex-1 border-0 bg-transparent outline-none"
                    />
                </label>
                <label className="flex-[1_1_160px]">
                    <span className="sr-only">Rôle</span>
                    <select
                        name="role"
                        defaultValue={filtres.role}
                        className="min-h-12 w-full rounded-[10px] border-0 bg-mist px-3"
                    >
                        <option value="">Tous les rôles</option>
                        {roles.map((role) => (
                            <option key={role.value} value={role.value}>
                                {role.label}
                            </option>
                        ))}
                    </select>
                </label>
                <button
                    type="submit"
                    className="min-h-12 flex-auto cursor-pointer rounded-[10px] bg-ink px-6 font-bold text-white hover:bg-plum sm:flex-none"
                >
                    Filtrer
                </button>
            </Form>

            {utilisateurs.data.length === 0 ? (
                <EtatVide icone={Users} titre="Aucun compte trouvé" />
            ) : (
                <div className="carte overflow-x-auto">
                    <table className="w-full min-w-170 border-collapse text-left text-sm">
                        <thead>
                            <tr className="border-b border-line text-xs tracking-[0.04em] text-plum uppercase">
                                <th className="px-4 py-3 font-bold">Nom</th>
                                <th className="px-4 py-3 font-bold">
                                    Identifiant
                                </th>
                                <th className="px-4 py-3 font-bold">Rôle</th>
                                <th className="px-4 py-3 font-bold">État</th>
                                <th className="px-4 py-3 text-right font-bold">
                                    <span className="sr-only">Actions</span>
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {utilisateurs.data.map((utilisateur) => (
                                <tr
                                    key={utilisateur.id}
                                    className="border-b border-haze last:border-0"
                                >
                                    <td className="px-4 py-3">
                                        <strong>
                                            {utilisateur.prenom}{' '}
                                            {utilisateur.nom}
                                        </strong>
                                        {utilisateur.email && (
                                            <div className="text-xs text-plum">
                                                {utilisateur.email}
                                            </div>
                                        )}
                                    </td>
                                    <td className="px-4 py-3 font-mono text-[13px]">
                                        {utilisateur.identifiant}
                                    </td>
                                    <td className="px-4 py-3">
                                        {utilisateur.role_label}
                                        {utilisateur.annee_diplome && (
                                            <span className="text-plum">
                                                {' '}
                                                · {utilisateur.annee_diplome}
                                            </span>
                                        )}
                                        {utilisateur.role === 'etudiant' && (
                                            <div className="text-xs text-plum">
                                                {
                                                    utilisateur.cours_suivis
                                                        .length
                                                }{' '}
                                                cours en {anneeUniversitaire}
                                            </div>
                                        )}
                                    </td>
                                    <td className="px-4 py-3">
                                        <span
                                            className={cn(
                                                'rounded-full px-2.5 py-1 text-xs font-bold',
                                                utilisateur.actif
                                                    ? 'bg-lavender text-ink'
                                                    : 'bg-haze text-dusk',
                                            )}
                                        >
                                            {utilisateur.actif
                                                ? 'Actif'
                                                : 'Désactivé'}
                                        </span>
                                    </td>
                                    <td className="px-4 py-2">
                                        <div className="flex justify-end gap-1">
                                            {utilisateur.role ===
                                                'etudiant' && (
                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        setEdition({
                                                            type: 'inscriptions',
                                                            utilisateur,
                                                        })
                                                    }
                                                    className="flex min-h-11 cursor-pointer items-center gap-1.5 rounded-lg px-2.5 font-semibold text-plum hover:bg-haze"
                                                >
                                                    <BookCheck
                                                        className="size-4"
                                                        aria-hidden
                                                    />{' '}
                                                    Cours suivis
                                                </button>
                                            )}
                                            <button
                                                type="button"
                                                onClick={() =>
                                                    setEdition({
                                                        type: 'compte',
                                                        utilisateur,
                                                    })
                                                }
                                                className="flex min-h-11 cursor-pointer items-center gap-1.5 rounded-lg px-2.5 font-semibold text-plum hover:bg-haze"
                                            >
                                                <Pencil
                                                    className="size-4"
                                                    aria-hidden
                                                />{' '}
                                                Modifier
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {utilisateurs.last_page > 1 && (
                <nav
                    aria-label="Pagination"
                    className="flex items-center justify-between gap-3 text-sm"
                >
                    {utilisateurs.prev_page_url ? (
                        <Link
                            href={utilisateurs.prev_page_url}
                            className="font-semibold"
                        >
                            ← Précédent
                        </Link>
                    ) : (
                        <span />
                    )}
                    <span className="text-plum">
                        Page {utilisateurs.current_page} sur{' '}
                        {utilisateurs.last_page} · {utilisateurs.total} comptes
                    </span>
                    {utilisateurs.next_page_url ? (
                        <Link
                            href={utilisateurs.next_page_url}
                            className="font-semibold"
                        >
                            Suivant →
                        </Link>
                    ) : (
                        <span />
                    )}
                </nav>
            )}

            <Dialog
                open={edition !== null}
                onOpenChange={(ouvert) => !ouvert && fermer()}
            >
                <DialogContent className="max-h-[90vh] overflow-y-auto bg-white/85 backdrop-blur-2xl sm:max-w-xl">
                    {edition?.type === 'compte' && (
                        <FormulaireCompte
                            utilisateur={edition.utilisateur}
                            roles={roles}
                            onTermine={fermer}
                        />
                    )}
                    {edition?.type === 'inscriptions' && (
                        <FormulaireInscriptions
                            utilisateur={edition.utilisateur}
                            cours={cours}
                            annee={anneeUniversitaire}
                            onTermine={fermer}
                        />
                    )}
                </DialogContent>
            </Dialog>
        </>
    );
}

function FormulaireCompte({
    utilisateur,
    roles,
    onTermine,
}: {
    utilisateur: Utilisateur | null;
    roles: Option[];
    onTermine: () => void;
}) {
    const [role, setRole] = useState<string>(utilisateur?.role ?? 'etudiant');
    const [actif, setActif] = useState(utilisateur?.actif ?? true);
    const action = utilisateur
        ? UtilisateurController.update.form(utilisateur.id)
        : UtilisateurController.store.form();

    return (
        <>
            <DialogTitle className="font-display text-xl">
                {utilisateur ? 'Modifier le compte' : 'Nouveau compte'}
            </DialogTitle>
            <DialogDescription className="text-plum">
                Les étudiants se connectent avec leur numéro d'étudiant, les
                autres comptes avec leur identifiant.
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
                                label="Prénom"
                                htmlFor="prenom"
                                erreur={errors.prenom}
                                className="flex-[1_1_180px]"
                            >
                                <input
                                    id="prenom"
                                    name="prenom"
                                    required
                                    defaultValue={utilisateur?.prenom}
                                    className="champ"
                                />
                            </Champ>
                            <Champ
                                label="Nom"
                                htmlFor="nom"
                                erreur={errors.nom}
                                className="flex-[1_1_180px]"
                            >
                                <input
                                    id="nom"
                                    name="nom"
                                    required
                                    defaultValue={utilisateur?.nom}
                                    className="champ"
                                />
                            </Champ>
                        </div>
                        <div className="flex flex-wrap gap-3">
                            <Champ
                                label="Rôle"
                                htmlFor="role"
                                erreur={errors.role}
                                className="flex-[1_1_180px]"
                            >
                                <select
                                    id="role"
                                    name="role"
                                    value={role}
                                    onChange={(event) =>
                                        setRole(event.target.value)
                                    }
                                    className="champ"
                                >
                                    {roles.map((option) => (
                                        <option
                                            key={option.value}
                                            value={option.value}
                                        >
                                            {option.label}
                                        </option>
                                    ))}
                                </select>
                            </Champ>
                            <Champ
                                label={
                                    role === 'etudiant'
                                        ? "Numéro d'étudiant"
                                        : 'Identifiant'
                                }
                                htmlFor="identifiant"
                                erreur={errors.identifiant}
                                className="flex-[1_1_180px]"
                            >
                                <input
                                    id="identifiant"
                                    name="identifiant"
                                    required
                                    defaultValue={utilisateur?.identifiant}
                                    className="champ"
                                />
                            </Champ>
                        </div>
                        {role === 'ancien' && (
                            <Champ
                                label="Année du diplôme"
                                htmlFor="annee_diplome"
                                erreur={errors.annee_diplome}
                            >
                                <input
                                    id="annee_diplome"
                                    name="annee_diplome"
                                    type="number"
                                    min={1950}
                                    max={2100}
                                    defaultValue={
                                        utilisateur?.annee_diplome ?? ''
                                    }
                                    className="champ"
                                />
                            </Champ>
                        )}
                        <Champ
                            label="E-mail (facultatif)"
                            htmlFor="email"
                            erreur={errors.email}
                        >
                            <input
                                id="email"
                                name="email"
                                type="email"
                                defaultValue={utilisateur?.email ?? ''}
                                className="champ"
                            />
                        </Champ>
                        <Champ
                            label={
                                utilisateur
                                    ? 'Nouveau mot de passe (laisser vide pour ne pas changer)'
                                    : 'Mot de passe provisoire'
                            }
                            htmlFor="mot_de_passe"
                            erreur={errors.mot_de_passe}
                        >
                            <input
                                id="mot_de_passe"
                                name="mot_de_passe"
                                type="text"
                                autoComplete="new-password"
                                required={!utilisateur}
                                minLength={8}
                                className="champ"
                            />
                        </Champ>
                        <input
                            type="hidden"
                            name="actif"
                            value={actif ? '1' : '0'}
                        />
                        <label className="flex min-h-11 cursor-pointer items-center gap-3 text-sm font-semibold">
                            <input
                                type="checkbox"
                                checked={actif}
                                onChange={(event) =>
                                    setActif(event.target.checked)
                                }
                                className="size-4.5 accent-plum"
                            />
                            Compte actif (peut se connecter)
                        </label>
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

function FormulaireInscriptions({
    utilisateur,
    cours,
    annee,
    onTermine,
}: {
    utilisateur: Utilisateur;
    cours: Props['cours'];
    annee: string;
    onTermine: () => void;
}) {
    return (
        <>
            <DialogTitle className="font-display text-xl">
                Cours suivis par {utilisateur.prenom} {utilisateur.nom}
            </DialogTitle>
            <DialogDescription className="text-plum">
                Année universitaire {annee}. Seuls les étudiants inscrits à un
                cours peuvent déposer un avis sur ce cours.
            </DialogDescription>
            <Form
                {...UtilisateurController.inscriptions.form(utilisateur.id)}
                options={{ preserveScroll: true }}
                onSuccess={onTermine}
                className="flex flex-col gap-4"
            >
                {({ processing }) => (
                    <>
                        <fieldset className="grid gap-2 sm:grid-cols-2">
                            <legend className="sr-only">Cours</legend>
                            {cours.map((unCours) => (
                                <label
                                    key={unCours.id}
                                    className="flex cursor-pointer items-center gap-2.5 rounded-lg border border-line px-3 py-2.5 text-sm has-checked:border-iris has-checked:bg-mist"
                                >
                                    <input
                                        type="checkbox"
                                        name="cours[]"
                                        value={unCours.id}
                                        defaultChecked={utilisateur.cours_suivis.includes(
                                            unCours.id,
                                        )}
                                        className="size-4 accent-plum"
                                    />
                                    <span>
                                        <strong>{unCours.code_ue}</strong> ·{' '}
                                        {unCours.intitule}
                                    </span>
                                </label>
                            ))}
                        </fieldset>
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
                                Enregistrer les inscriptions
                            </Button>
                        </div>
                    </>
                )}
            </Form>
        </>
    );
}
