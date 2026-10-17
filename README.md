# RECO

> Les avis des étudiants, avant de choisir vos cours.

Choisir un cours sans savoir à quoi s'attendre, c'est stressant. **RECO** est une plateforme universitaire où les étudiants consultent les fiches des cours et partagent des avis anonymes. Les enseignants mettent à jour leurs cours et répondent aux retours, et l'administration modère les avis pour améliorer la qualité de l'enseignement.

## Fonctionnalités

**Étudiants**
- Recherche de cours par nom, code UE ou enseignant, avec filtres par filière et niveau
- Fiches détaillées : contenu, chapitres, outils, méthode, évaluation et niveau d'exigence
- Avis anonymes avec note sur 5, déposés pendant les périodes d'évaluation
- Signalement des avis inappropriés
- Recommandation des enseignants

**Enseignants**
- Mise à jour des fiches de leurs cours
- Réponse publique aux avis

**Anciens étudiants**
- Partage de conseils et de retours d'expérience par filière

**Administration**
- File de modération : un avis signalé 3 fois est masqué automatiquement en attendant une décision
- Gestion des périodes d'évaluation, des comptes, des cours et des filières
- Publication de la « suite donnée » aux avis
- Statistiques de participation et moyennes par cours

**Respect de l'anonymat**
- L'auteur d'un avis n'est jamais visible, même pour l'administration
- La moyenne d'un cours ne s'affiche publiquement qu'à partir de 5 avis

## Stack technique

| Côté | Technologies |
| --- | --- |
| Back-end | PHP 8.3+, Laravel 13, Laravel Fortify (authentification) |
| Front-end | React 19, TypeScript, Inertia.js 3, Tailwind CSS 4 |
| Base de données | MySQL |
| Qualité | PHPUnit, Laravel Pint, PHPStan |

L'interface est responsive (barre latérale sur ordinateur, menu tiroir sur mobile) et suit un style glassmorphisme aux couleurs pastel.

## Installation

Prérequis : PHP 8.3+, Composer, Node.js 20+ et MySQL.

```bash
git clone https://github.com/KantSue/reco.git
cd reco

composer install
npm install

cp .env.example .env
php artisan key:generate
```

Dans `.env`, configure la base de données :

```env
DB_CONNECTION=mysql
DB_DATABASE=reco
DB_USERNAME=root
DB_PASSWORD=
```

Crée les tables et les données de démonstration, puis lance l'application :

```bash
php artisan migrate --seed
composer run dev
```

L'application est disponible sur [http://localhost:8000](http://localhost:8000).

## Comptes de démonstration

Tous les comptes utilisent le mot de passe **`Test1234`**. En local, des boutons sur la page de connexion permettent de se connecter en un clic.

| Rôle | Identifiant |
| --- | --- |
| Étudiant | `ETU2026001` |
| Enseignant | `h.rasoanaivo` |
| Ancien étudiant | `ancien.andry` |
| Administrateur | `admin` |

## Tests

```bash
php artisan test
```

## Auteur

Projet réalisé par **Kanto** — [GitHub](https://github.com/KantSue)
