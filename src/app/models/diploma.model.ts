export interface DiplomeEtudier {
    id: number;
    nom: string;
    fraisInscription?: number;
    actif?: boolean;
    type: string;
    prerequis: string[];

}

export interface NiveauDiplomeSpecifique {
    id: number;
    niveau: number;
    diplome?: String;

}
export interface NiveauDiplome {
    id: number;
    niveau: number

}
