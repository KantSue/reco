export type Exigence = {
    value: 'faible' | 'moyenne' | 'elevee';
    label: string;
    niveau: 1 | 2 | 3;
};

export type Option = {
    value: string;
    label: string;
};

export type Cours = {
    id: number;
    code_ue: string;
    intitule: string;
    semestre: number;
    contenu: string | null;
    chapitres: string[];
    chapitres_texte: string | null;
    outils: string[];
    outils_texte: string | null;
    methode: string | null;
    evaluation: string | null;
    exigence: Exigence;
    date_maj: string;
    est_perime: boolean;
    filiere?: { id: number; nom: string; niveau: string };
    enseignant?: { id: number; nom_complet: string } | null;
    nb_avis?: number;
    moyenne?: number | null;
};

export type Avis = {
    id: number;
    note: number;
    commentaire: string;
    date: string;
    modifie: boolean;
    est_le_mien: boolean;
    periode?: string;
    cours?: { id: number; code_ue: string; intitule: string };
    reponse?: { texte: string; date: string; enseignant: string | null } | null;
    statut?: { value: 'publie' | 'signale' | 'masque'; label: string };
    nb_signalements?: number;
    motifs?: string[];
};

export type SuiteDonnee = {
    id: number;
    texte: string;
    date: string;
};

export type Paginated<T> = {
    data: T[];
    current_page: number;
    last_page: number;
    total: number;
    prev_page_url: string | null;
    next_page_url: string | null;
};
