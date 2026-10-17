<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;

/**
 * Données de démonstration reprises de 2_donnees_test.sql.
 * Mot de passe de tous les comptes : Test1234.
 */
class DonneesDemonstrationSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $this->utilisateurs();
        $this->filieresEtCours();
        $this->inscriptions();
        $this->periodesEtAvis();
        $this->recommandationsEtRetours();
    }

    private function utilisateurs(): void
    {
        $motDePasse = Hash::make('Test1234');

        $comptes = [
            [1, 'admin', 'Rakoto', 'Michel', 'admin@univ.test', 'admin', null],
            [2, 'h.rasoanaivo', 'Rasoanaivo', 'Hery', 'h.rasoanaivo@univ.test', 'enseignant', null],
            [3, 'v.randrianarisoa', 'Randrianarisoa', 'Voahirana', 'v.randrianarisoa@univ.test', 'enseignant', null],
            [4, 't.andriamanana', 'Andriamanana', 'Tiana', 't.andriamanana@univ.test', 'enseignant', null],
            [5, 'f.rakotomalala', 'Rakotomalala', 'Fanja', 'f.rakotomalala@univ.test', 'enseignant', null],
            [6, 'ETU2026001', 'Rabe', 'Kanto', 'etu2026001@univ.test', 'etudiant', null],
            [7, 'ETU2026002', 'Razafy', 'Lauren', 'etu2026002@univ.test', 'etudiant', null],
            [8, 'ETU2026003', 'Rasolo', 'Daniella', 'etu2026003@univ.test', 'etudiant', null],
            [9, 'ETU2026004', 'Ravelo', 'Fifaliantsoa', 'etu2026004@univ.test', 'etudiant', null],
            [10, 'ETU2026005', 'Rakotobe', 'Mamy', 'etu2026005@univ.test', 'etudiant', null],
            [11, 'ETU2026006', 'Andrianjafy', 'Nirina', 'etu2026006@univ.test', 'etudiant', null],
            [12, 'ETU2025010', 'Rajaonarison', 'Tsiry', 'etu2025010@univ.test', 'etudiant', null],
            [13, 'ETU2025011', 'Ramanantsoa', 'Lova', 'etu2025011@univ.test', 'etudiant', null],
            [14, 'ETU2026020', 'Rasoamanana', 'Haingo', 'etu2026020@univ.test', 'etudiant', null],
            [15, 'ETU2026021', 'Rabemananjara', 'Toky', 'etu2026021@univ.test', 'etudiant', null],
            [16, 'ancien.andry', 'Randria', 'Andry', 'andry.randria@mail.test', 'ancien', 2024],
            [17, 'ancien.sitraka', 'Rakotondrabe', 'Sitraka', 'sitraka.rk@mail.test', 'ancien', 2023],
        ];

        DB::table('utilisateur')->insert(array_map(fn (array $compte): array => [
            'id' => $compte[0],
            'identifiant' => $compte[1],
            'mot_de_passe_hash' => $motDePasse,
            'nom' => $compte[2],
            'prenom' => $compte[3],
            'email' => $compte[4],
            'role' => $compte[5],
            'annee_diplome' => $compte[6],
            'actif' => true,
            'date_creation' => '2026-09-01 08:00:00',
        ], $comptes));
    }

    private function filieresEtCours(): void
    {
        DB::table('filiere')->insert([
            ['id' => 1, 'nom' => 'Informatique', 'niveau' => 'L1'],
            ['id' => 2, 'nom' => 'Informatique', 'niveau' => 'L2'],
            ['id' => 3, 'nom' => 'Gestion', 'niveau' => 'L1'],
        ]);

        DB::table('cours')->insert([
            [
                'id' => 1, 'code_ue' => 'INF101', 'intitule' => 'Algorithmique', 'filiere_id' => 1, 'enseignant_id' => 2, 'semestre' => 1,
                'contenu' => 'Bases de la programmation : variables, conditions, boucles, tableaux, fonctions.',
                'chapitres' => "Variables et types\nConditions\nBoucles\nTableaux\nFonctions\nTris simples",
                'outils' => 'Python 3, papier-crayon',
                'methode' => 'Cours magistral de 2 h puis TD de 2 h par semaine. Exercice noté chaque semaine.',
                'evaluation' => 'Exercices hebdomadaires notés (40 %), examen final écrit (60 %)',
                'exigence' => 'elevee', 'date_maj' => '2026-09-01 08:00:00',
            ],
            [
                'id' => 2, 'code_ue' => 'INF102', 'intitule' => 'Introduction aux bases de données', 'filiere_id' => 1, 'enseignant_id' => 3, 'semestre' => 1,
                'contenu' => 'Modélisation des données et premières requêtes SQL.',
                'chapitres' => "Notion de base de données\nModèle entité-association\nModèle relationnel\nSQL : SELECT\nSQL : INSERT, UPDATE, DELETE",
                'outils' => 'MySQL, phpMyAdmin, XAMPP',
                'methode' => 'Cours suivi de TP sur machine. Projet de groupe en fin de semestre.',
                'evaluation' => 'Projet de groupe (40 %), examen final (60 %)',
                'exigence' => 'moyenne', 'date_maj' => '2026-09-03 10:00:00',
            ],
            [
                'id' => 3, 'code_ue' => 'INF103', 'intitule' => 'Outils numériques et bureautique', 'filiere_id' => 1, 'enseignant_id' => 2, 'semestre' => 1,
                'contenu' => 'Traitement de texte, tableur, présentation et recherche documentaire.',
                'chapitres' => "Word avancé\nExcel : formules\nExcel : graphiques\nPowerPoint\nRecherche d'information",
                'outils' => 'Microsoft Office ou LibreOffice',
                'methode' => 'TP uniquement, évaluation par un dossier rendu en fin de semestre.',
                'evaluation' => 'Dossier rendu en fin de semestre (100 %)',
                'exigence' => 'faible', 'date_maj' => '2025-09-10 09:00:00',
            ],
            [
                'id' => 4, 'code_ue' => 'LAN101', 'intitule' => 'Anglais technique', 'filiere_id' => 1, 'enseignant_id' => 4, 'semestre' => 1,
                'contenu' => 'Vocabulaire informatique, lecture de documentation, présentation orale.',
                'chapitres' => "Vocabulary\nReading documentation\nWriting emails\nOral presentation",
                'outils' => 'Documents fournis, vidéos',
                'methode' => "Travail en petits groupes, beaucoup d'oral.",
                'evaluation' => 'Présentation orale (50 %), contrôle écrit (50 %)',
                'exigence' => 'faible', 'date_maj' => '2026-09-05 14:00:00',
            ],
            [
                'id' => 5, 'code_ue' => 'INF201', 'intitule' => 'Programmation web PHP', 'filiere_id' => 2, 'enseignant_id' => 2, 'semestre' => 3,
                'contenu' => 'Création de sites dynamiques avec PHP et MySQL.',
                'chapitres' => "HTML/CSS rappels\nPHP : bases\nFormulaires\nSessions\nPDO et MySQL\nSécurité",
                'outils' => 'VS Code, XAMPP, Git',
                'methode' => 'Cours et TP chaque semaine, mini-projet noté à rendre en 3 étapes.',
                'evaluation' => 'Mini-projet en 3 étapes (50 %), examen final (50 %)',
                'exigence' => 'elevee', 'date_maj' => '2026-09-02 08:00:00',
            ],
            [
                'id' => 6, 'code_ue' => 'INF202', 'intitule' => 'Conception UML', 'filiere_id' => 2, 'enseignant_id' => 3, 'semestre' => 3,
                'contenu' => "Analyse et conception d'un système avec UML.",
                'chapitres' => "Cas d'utilisation\nClasses\nSéquence\nActivité\nÉtats-transitions",
                'outils' => 'PlantUML, draw.io',
                'methode' => 'Études de cas en groupe, examen écrit final.',
                'evaluation' => 'Études de cas (30 %), examen écrit final (70 %)',
                'exigence' => 'moyenne', 'date_maj' => '2026-09-04 08:00:00',
            ],
            [
                'id' => 7, 'code_ue' => 'GES101', 'intitule' => 'Comptabilité générale', 'filiere_id' => 3, 'enseignant_id' => 5, 'semestre' => 1,
                'contenu' => 'Principes de la comptabilité et tenue des comptes.',
                'chapitres' => "Le bilan\nLe compte de résultat\nLes écritures\nLe plan comptable",
                'outils' => 'Calculatrice, Excel',
                'methode' => 'Cours magistral et exercices corrigés en classe.',
                'evaluation' => 'Contrôle continu (40 %), examen final (60 %)',
                'exigence' => 'moyenne', 'date_maj' => '2026-09-06 09:00:00',
            ],
            [
                'id' => 8, 'code_ue' => 'GES102', 'intitule' => "Économie d'entreprise", 'filiere_id' => 3, 'enseignant_id' => 5, 'semestre' => 1,
                'contenu' => "Fonctionnement et environnement de l'entreprise.",
                'chapitres' => "L'entreprise\nLe marché\nLes fonctions de l'entreprise\nÉtudes de cas",
                'outils' => 'Supports PDF',
                'methode' => 'Cours magistral, exposés en groupe.',
                'evaluation' => 'Exposé en groupe (40 %), examen final (60 %)',
                'exigence' => 'faible', 'date_maj' => '2026-09-06 11:00:00',
            ],
        ]);
    }

    private function inscriptions(): void
    {
        $inscriptions = [];
        $repartition = [
            [[6, 7, 8, 9, 10, 11], [1, 2, 3, 4]],
            [[12, 13], [5, 6]],
            [[14, 15], [7, 8]],
        ];

        foreach ($repartition as [$etudiants, $cours]) {
            foreach ($etudiants as $etudiantId) {
                foreach ($cours as $coursId) {
                    $inscriptions[] = ['etudiant_id' => $etudiantId, 'cours_id' => $coursId, 'annee_universitaire' => '2026-2027'];
                }
            }
        }

        DB::table('inscription_cours')->insert($inscriptions);
    }

    private function periodesEtAvis(): void
    {
        DB::table('periode_evaluation')->insert([
            ['id' => 1, 'libelle' => 'Mi-semestre S1 2026-2027', 'date_debut' => '2026-10-12', 'date_fin' => '2026-10-25'],
            ['id' => 2, 'libelle' => 'Fin de semestre S1 2026-2027', 'date_debut' => '2027-02-01', 'date_fin' => '2027-02-14'],
        ]);

        $avis = [
            [1, 1, 6, 5, 'Cours difficile mais très bien expliqué. Les TD aident beaucoup à comprendre.', 'publie', 0, '2026-10-12 18:20:00'],
            [2, 1, 7, 4, 'Exigeant : il faut travailler chaque semaine, sinon on est vite perdu.', 'publie', 0, '2026-10-12 20:05:00'],
            [3, 1, 8, 2, "Le rythme est trop rapide pour ceux qui n'ont jamais programmé.", 'publie', 0, '2026-10-13 09:40:00'],
            [4, 1, 9, 4, "Les exercices notés chaque semaine obligent à rester régulier, c'est utile.", 'publie', 0, '2026-10-13 12:15:00'],
            [5, 1, 10, 3, 'Bon contenu, mais il manque des corrigés écrits après les TD.', 'publie', 0, '2026-10-14 17:30:00'],
            [6, 1, 11, 5, 'Un des cours les plus enrichissants du semestre.', 'publie', 0, '2026-10-15 08:10:00'],
            [7, 2, 6, 4, 'Les TP sur machine rendent le SQL concret.', 'publie', 0, '2026-10-13 19:00:00'],
            [8, 2, 7, 3, "Le plan affiché ne correspond pas tout à fait à ce qu'on voit en classe.", 'publie', 0, '2026-10-14 10:25:00'],
            [9, 2, 8, 1, 'Cours nul, la prof ne sert à rien.', 'signale', 3, '2026-10-14 22:45:00'],
            [10, 4, 9, 5, "Ambiance détendue, on progresse à l'oral sans stress.", 'publie', 0, '2026-10-15 11:00:00'],
            [11, 5, 12, 4, 'Très concret, on construit un vrai site. Demande beaucoup de travail personnel.', 'publie', 0, '2026-10-13 21:10:00'],
            [12, 5, 13, 2, "Le mini-projet arrive trop tôt, avant d'avoir vu les sessions.", 'publie', 0, '2026-10-14 16:35:00'],
            [13, 7, 14, 3, "Clair mais très théorique, plus d'exemples réels aideraient.", 'publie', 0, '2026-10-15 13:50:00'],
            [14, 8, 15, 1, 'Propos injurieux supprimés par la modération.', 'masque', 3, '2026-10-15 23:30:00'],
        ];

        DB::table('avis')->insert(array_map(fn (array $ligne): array => [
            'id' => $ligne[0],
            'cours_id' => $ligne[1],
            'auteur_id' => $ligne[2],
            'periode_id' => 1,
            'note' => $ligne[3],
            'commentaire' => $ligne[4],
            'statut' => $ligne[5],
            'nb_signalements' => $ligne[6],
            'date_creation' => $ligne[7],
        ], $avis));

        DB::table('signalement')->insert([
            ['avis_id' => 9, 'utilisateur_id' => 6, 'motif' => "Propos insultant envers l'enseignante", 'date_creation' => '2026-10-15 08:00:00'],
            ['avis_id' => 9, 'utilisateur_id' => 9, 'motif' => 'Pas constructif', 'date_creation' => '2026-10-15 09:30:00'],
            ['avis_id' => 9, 'utilisateur_id' => 3, 'motif' => 'Attaque personnelle', 'date_creation' => '2026-10-15 10:00:00'],
            ['avis_id' => 14, 'utilisateur_id' => 14, 'motif' => 'Insultes', 'date_creation' => '2026-10-16 07:45:00'],
            ['avis_id' => 14, 'utilisateur_id' => 13, 'motif' => 'Insultes', 'date_creation' => '2026-10-16 08:10:00'],
            ['avis_id' => 14, 'utilisateur_id' => 5, 'motif' => 'Propos diffamatoires', 'date_creation' => '2026-10-16 08:30:00'],
        ]);

        DB::table('reponse')->insert([
            ['avis_id' => 3, 'enseignant_id' => 2, 'texte' => "Merci pour ce retour. J'ajoute une séance de soutien le jeudi pour les débutants.", 'date_creation' => '2026-10-14 08:00:00'],
            ['avis_id' => 5, 'enseignant_id' => 2, 'texte' => 'Bonne remarque : les corrigés seront déposés après chaque TD à partir de la semaine prochaine.', 'date_creation' => '2026-10-15 09:00:00'],
            ['avis_id' => 12, 'enseignant_id' => 2, 'texte' => "Le calendrier du mini-projet sera décalé d'une semaine.", 'date_creation' => '2026-10-15 18:00:00'],
        ]);
    }

    private function recommandationsEtRetours(): void
    {
        DB::table('recommandation')->insert([
            ['enseignant_id' => 2, 'auteur_id' => 6, 'commentaire' => 'Explique avec patience et prend le temps de répondre aux questions.', 'date_creation' => '2026-10-15 19:00:00'],
            ['enseignant_id' => 2, 'auteur_id' => 11, 'commentaire' => 'Ses TD sont vraiment bien préparés.', 'date_creation' => '2026-10-16 08:30:00'],
            ['enseignant_id' => 2, 'auteur_id' => 12, 'commentaire' => 'Donne des exemples concrets tirés de vrais projets.', 'date_creation' => '2026-10-16 10:00:00'],
            ['enseignant_id' => 3, 'auteur_id' => 13, 'commentaire' => 'Très claire pour expliquer les diagrammes UML.', 'date_creation' => '2026-10-16 11:15:00'],
            ['enseignant_id' => 4, 'auteur_id' => 9, 'commentaire' => "Met tout le monde à l'aise pour parler en anglais.", 'date_creation' => '2026-10-16 12:40:00'],
        ]);

        DB::table('retour_ancien')->insert([
            ['auteur_id' => 16, 'filiere_id' => 1, 'texte' => "En L1, ne lâchez pas l'algorithmique : tout le reste de la licence repose dessus. Faites les exercices chaque semaine.", 'date_creation' => '2026-10-01 10:00:00'],
            ['auteur_id' => 16, 'filiere_id' => 2, 'texte' => "Le cours de PHP m'a permis de trouver mon premier stage. Mettez votre mini-projet sur GitHub.", 'date_creation' => '2026-10-01 10:20:00'],
            ['auteur_id' => 17, 'filiere_id' => 3, 'texte' => "La comptabilité paraît abstraite au début, mais c'est la matière la plus utile en entreprise.", 'date_creation' => '2026-10-02 15:00:00'],
        ]);

        DB::table('suite_donnee')->insert([
            ['cours_id' => 1, 'admin_id' => 1, 'texte' => 'Suite aux avis de mi-semestre, une séance de soutien hebdomadaire est ajoutée et les corrigés de TD seront publiés.', 'date_creation' => '2026-10-16 14:00:00'],
            ['cours_id' => 2, 'admin_id' => 1, 'texte' => 'Le plan du cours affiché sur la plateforme a été mis à jour pour correspondre au déroulé réel.', 'date_creation' => '2026-10-16 14:30:00'],
        ]);
    }
}
