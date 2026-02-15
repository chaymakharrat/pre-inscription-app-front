import { Student } from "./student.model";

export interface Enrollment {
    id: number;
    studentId: number;
    student?: Student; // Populated later
    diplomeDemande: string;
    dateCreation: string;
    dateSoumission: string;
    statut?: string;
    priorite?: 'HAUTE' | 'MOYENNE' | 'BASSE' | 'NOUVEAU';
    documentsValides: number;
    totalDocuments: number;
    commentaireScolarite?: string;
}

export interface EnrollmentAction {
    enrollmentId: number;
    studentId: number;
    decision: 'ACCEPTE' | 'REJETE';
    commentaire: string;
}


export interface DashboardStats {
    enAttente: number;
    valides: number;
    rejetes: number;
    tauxValidation: number;
    delaiMoyen: string;
}
