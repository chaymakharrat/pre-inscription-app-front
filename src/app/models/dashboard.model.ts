export interface AdminDashboardStats {
    totalInscriptions: number;
    demandesEnAttente: number;
    dossiersRejetes: number;
    paiementsValides: number;
    inscritsDefinitifs: number;
}

export interface WorkflowDistribution {
    status: string;
    count: number;
}
