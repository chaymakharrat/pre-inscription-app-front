import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../envirements/enviremetns';
import { AdminDashboardStats, WorkflowDistribution } from '../models/dashboard.model';
import { Enrollment } from '../models/enrollment.model';

@Injectable({
    providedIn: 'root'
})
export class AdminService {
    // Stats et demandes depuis INSCRIPTION-SERVICE
    private enrollmentApiUrl = `${environment.apiUrl}/INSCRIPTION-SERVICE/api/dashboard`;
    private demandesUrl = `${environment.apiUrl}/INSCRIPTION-SERVICE/api/demandes`;
    
    // Finalisation depuis WORKFLOW-SERVICE
    private workflowApiUrl = `${environment.apiUrl}/WORKFLOW-SERVICE/api/workflow`;

    constructor(private http: HttpClient) { }

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

    /**
     * Récupérer toutes les demandes
     */
    getAllDemandes(): Observable<Enrollment[]> {
        return this.http.get<Enrollment[]>(this.demandesUrl);
    }
}