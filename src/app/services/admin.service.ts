import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../envirements/enviremetns';
import { AdminDashboardStats, WorkflowDistribution } from '../models/dashboard.model';
import { Enrollment } from '../models/enrollment.model';

// ✅ Interface pour la réponse paginée
export interface PageResponse<T> {
    content: T[];
    pageable: {
        pageNumber: number;
        pageSize: number;
        sort: {
            sorted: boolean;
            unsorted: boolean;
        };
        offset: number;
        paged: boolean;
        unpaged: boolean;
    };
    totalPages: number;
    totalElements: number;
    last: boolean;
    size: number;
    number: number;
    numberOfElements: number;
    first: boolean;
    empty: boolean;
}

@Injectable({
    providedIn: 'root'
})
export class AdminService {
    // Stats et demandes depuis ENROLLMENT-SERVICE
    private enrollmentApiUrl = `${environment.apiUrl}/INSCRIPTION-SERVICE/api/dashboard-admin`;
    // Finalisation depuis WORKFLOW-SERVICE
    private workflowApiUrl = `${environment.apiUrl}/WORKFLOW-SERVICE/api/workflow`;

    constructor(private http: HttpClient) { }

    // ========== MÉTHODES STATISTIQUES (PAS DE PAGINATION) ==========

    /**
     * Récupérer les statistiques
     */
    getStats(): Observable<AdminDashboardStats> {
        return this.http.get<AdminDashboardStats>(`${this.enrollmentApiUrl}/stats`);
    }

    /**
     * Récupérer la distribution par statut
     */
    getDistribution(): Observable<WorkflowDistribution[]> {
        return this.http.get<WorkflowDistribution[]>(`${this.enrollmentApiUrl}/distribution`);
    }

    // ========== MÉTHODES PAGINÉES (NOUVELLES) ==========

    /**
     * ✅ Récupérer toutes les demandes (paginé)
     */
    getAllDemandesPaginated(page: number = 0, size: number = 10, sort: string = 'dateCreation,desc'): Observable<PageResponse<Enrollment>> {
        const params = new HttpParams()
            .set('page', page.toString())
            .set('size', size.toString())
            .set('sort', sort);

        return this.http.get<PageResponse<Enrollment>>(`${this.enrollmentApiUrl}/demandes`, { params });
    }

    /**
     * ✅ Récupérer les demandes en attente (paginé)
     */
    getDemandesEnAttentePaginated(page: number = 0, size: number = 10, sort: string = 'dateCreation,desc'): Observable<PageResponse<Enrollment>> {
        const params = new HttpParams()
            .set('page', page.toString())
            .set('size', size.toString())
            .set('sort', sort);

        return this.http.get<PageResponse<Enrollment>>(`${this.enrollmentApiUrl}/demandes/en-attente`, { params });
    }

    /**
     * ✅ Récupérer les demandes avec paiement validé (paginé)
     */
    getDemandesPaymentValidPaginated(page: number = 0, size: number = 10, sort: string = 'dateCreation,desc'): Observable<PageResponse<Enrollment>> {
        const params = new HttpParams()
            .set('page', page.toString())
            .set('size', size.toString())
            .set('sort', sort);

        return this.http.get<PageResponse<Enrollment>>(`${this.enrollmentApiUrl}/demandes/payment-valid`, { params });
    }

    /**
     * ✅ Récupérer les demandes rejetées (paginé)
     */
    getDemandesRejeteesPaginated(page: number = 0, size: number = 10, sort: string = 'dateCreation,desc'): Observable<PageResponse<Enrollment>> {
        const params = new HttpParams()
            .set('page', page.toString())
            .set('size', size.toString())
            .set('sort', sort);

        return this.http.get<PageResponse<Enrollment>>(`${this.enrollmentApiUrl}/demandes/rejetees`, { params });
    }

    /**
     * ✅ Récupérer les inscrits définitifs (paginé)
     */
    getInscritsDefinitifsPaginated(page: number = 0, size: number = 10, sort: string = 'dateCreation,desc'): Observable<PageResponse<Enrollment>> {
        const params = new HttpParams()
            .set('page', page.toString())
            .set('size', size.toString())
            .set('sort', sort);

        return this.http.get<PageResponse<Enrollment>>(`${this.enrollmentApiUrl}/demandes/inscrits`, { params });
    }

    /**
     * ✅ Récupérer les demandes filtrées par statut exact (paginé)
     */
    getDemandesByStatutPaginated(status: string, page: number = 0, size: number = 10, sort: string = 'dateCreation,desc'): Observable<PageResponse<Enrollment>> {
        const params = new HttpParams()
            .set('page', page.toString())
            .set('size', size.toString())
            .set('sort', sort);

        return this.http.get<PageResponse<Enrollment>>(`${this.enrollmentApiUrl}/demandes/statut/${status}`, { params });
    }

    /**
     * ✅ Rechercher des demandes (paginé)
     */
    searchDemandesPaginated(query: string, page: number = 0, size: number = 10, sort: string = 'dateCreation,desc'): Observable<PageResponse<Enrollment>> {
        const params = new HttpParams()
            .set('query', query)
            .set('page', page.toString())
            .set('size', size.toString())
            .set('sort', sort);

        return this.http.get<PageResponse<Enrollment>>(`${this.enrollmentApiUrl}/demandes/search`, { params });
    }

    // ========== MÉTHODES WORKFLOW ==========

    /**
     * ✅ Finaliser une inscription via WORKFLOW-SERVICE
     * Cette méthode déclenche juste la tâche Camunda
     * Le FinalizeEnrollmentDelegate fait tout le travail
     */
    finalizeInscription(enrollmentId: number, loginUtilisateur: string = 'ADMIN'): Observable<any> {
        return this.http.post<any>(
            `${this.workflowApiUrl}/finalize/${enrollmentId}`,
            {},
            { params: { loginUtilisateur } }
        );
    }

    /**
     * Vérifier si une demande peut être finalisée
     */
    canFinalize(enrollmentId: number): Observable<{ canFinalize: boolean; reason?: string }> {
        return this.http.get<{ canFinalize: boolean; reason?: string }>(
            `${this.workflowApiUrl}/can-finalize/${enrollmentId}`
        );
    }

    /**
     * Debug : voir les tâches actives pour une demande
     */
    getActiveTasks(enrollmentId: number): Observable<any[]> {
        return this.http.get<any[]>(
            `${this.workflowApiUrl}/debug/tasks/${enrollmentId}`
        );
    }

    // ========== MÉTHODES DÉPRÉCIÉES (CONSERVÉES POUR COMPATIBILITÉ) ==========

    /**
     * ⚠️ DÉPRÉCIÉ : Utiliser getAllDemandesPaginated() à la place
     * Conservé pour compatibilité avec ancien code
     */
    getAllDemandes(): Observable<Enrollment[]> {
        console.warn('⚠️ getAllDemandes() est déprécié - Utiliser getAllDemandesPaginated()');
        return this.http.get<Enrollment[]>(this.enrollmentApiUrl);
    }
}