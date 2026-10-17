export type Role = 'etudiant' | 'ancien' | 'enseignant' | 'admin';

export type User = {
    id: number;
    identifiant: string;
    nom_complet: string;
    role: Role;
    role_label: string;
};

export type Auth = {
    user: User | null;
};
