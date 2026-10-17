import { Head, Link } from '@inertiajs/react';
import { AlertTriangle } from 'lucide-react';
import CoursController from '@/actions/App/Http/Controllers/CoursController';
import { EnTeteAdmin } from '@/layouts/admin-layout';
import { formatDateCourte, formatNote } from '@/lib/format';

type LigneCours = {
    id: number;
    code_ue: string;
    intitule: string;
    filiere: string;
    nb_inscrits: number;
    nb_avis: number;
    nb_masques: number;
    moyenne: number | null;
    participation: number | null;
    est_perime: boolean;
    date_maj: string;
};

type Props = {
    totaux: {
        etudiants: number;
        avis: number;
        avis_publies: number;
        recommandations: number;
    };
    cours: LigneCours[];
};

export default function Statistiques({ totaux, cours }: Props) {
    return (
        <>
            <Head title="Statistiques" />

            <EnTeteAdmin
                titre="Statistiques"
                description="Vue d'ensemble par cours. Les moyennes sont affichées ici même sous 5 avis : ne les diffusez pas, pour préserver l'anonymat."
            />

            <div className="grid grid-cols-2 gap-3 sm:gap-4 xl:grid-cols-4">
                {[
                    ['Étudiants', totaux.etudiants, 'teinte-lilas'],
                    ['Avis déposés', totaux.avis, 'teinte-ciel'],
                    ['Avis publiés', totaux.avis_publies, 'teinte-iris'],
                    [
                        'Recommandations',
                        totaux.recommandations,
                        'teinte-dragee',
                    ],
                ].map(([titre, valeur, teinte]) => (
                    <div
                        key={titre}
                        className={`carte ${teinte} px-4 py-4 sm:px-5 sm:py-4.5`}
                    >
                        <div className="text-[13px] font-semibold text-plum">
                            {titre}
                        </div>
                        <div className="font-display text-[28px] font-extrabold sm:text-[34px]">
                            {valeur}
                        </div>
                    </div>
                ))}
            </div>

            <div className="carte overflow-x-auto">
                <table className="w-full min-w-205 border-collapse text-left text-sm">
                    <caption className="sr-only">
                        Statistiques par cours
                    </caption>
                    <thead>
                        <tr className="border-b border-line text-xs tracking-[0.04em] text-plum uppercase">
                            <th className="px-4 py-3 font-bold">Cours</th>
                            <th className="px-4 py-3 text-right font-bold">
                                Inscrits
                            </th>
                            <th className="px-4 py-3 text-right font-bold">
                                Avis publiés
                            </th>
                            <th className="px-4 py-3 font-bold">
                                Participation
                            </th>
                            <th className="px-4 py-3 text-right font-bold">
                                Moyenne
                            </th>
                            <th className="px-4 py-3 text-right font-bold">
                                Masqués
                            </th>
                            <th className="px-4 py-3 font-bold">Fiche</th>
                        </tr>
                    </thead>
                    <tbody>
                        {cours.map((ligne) => (
                            <tr
                                key={ligne.id}
                                className="border-b border-haze last:border-0"
                            >
                                <td className="px-4 py-3">
                                    <Link
                                        href={CoursController.show(ligne.id)}
                                        className="font-bold text-ink"
                                    >
                                        {ligne.code_ue} · {ligne.intitule}
                                    </Link>
                                    <div className="text-xs text-plum">
                                        {ligne.filiere}
                                    </div>
                                </td>
                                <td className="px-4 py-3 text-right tabular-nums">
                                    {ligne.nb_inscrits}
                                </td>
                                <td className="px-4 py-3 text-right tabular-nums">
                                    {ligne.nb_avis}
                                </td>
                                <td className="px-4 py-3">
                                    {ligne.participation === null ? (
                                        <span className="text-dusk">—</span>
                                    ) : (
                                        <div className="flex items-center gap-2">
                                            <div className="h-2 w-24 rounded-full bg-haze">
                                                <div
                                                    className="h-2 rounded-full bg-iris"
                                                    style={{
                                                        width: `${Math.min(100, ligne.participation)}%`,
                                                    }}
                                                />
                                            </div>
                                            <span className="tabular-nums">
                                                {ligne.participation} %
                                            </span>
                                        </div>
                                    )}
                                </td>
                                <td className="px-4 py-3 text-right tabular-nums">
                                    {ligne.moyenne === null ? (
                                        <span className="text-dusk">—</span>
                                    ) : (
                                        `${formatNote(ligne.moyenne)} / 5`
                                    )}
                                </td>
                                <td className="px-4 py-3 text-right tabular-nums">
                                    {ligne.nb_masques}
                                </td>
                                <td className="px-4 py-3">
                                    {ligne.est_perime ? (
                                        <span className="flex items-center gap-1.5 font-semibold text-alert">
                                            <AlertTriangle
                                                className="size-4"
                                                aria-hidden
                                            />
                                            À mettre à jour
                                        </span>
                                    ) : (
                                        formatDateCourte(ligne.date_maj)
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </>
    );
}
