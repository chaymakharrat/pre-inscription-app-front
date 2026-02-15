import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../envirements/enviremetns';

export interface DemandeDetailDTO {
    id: number;
    numeroDossier: string;
    etudiantId: number;
    nomDiplome: string;
    statutActuel: string;
    dateCreation: string;
    processInstanceId: string;
    etudiant: EtudiantInfoDTO;
    documents: DocumentStatusDTO[];
    historique: HistoriqueStatusDTO[];
    enAttenteDepuis: number;
    priorite: string;
    taskId?: string; // ID de la tâche Camunda
}

export interface EtudiantInfoDTO {
    id: number;
    nom: string;
    prenom: string;
    matricule: string;
    email: string;
    telephone: string;
    dateNaissance: string;
    numCarteIdentite: string;
    numPassport: string;
    paysNom: string;
}

export interface DocumentStatusDTO {
    documentId: number;
    type: string;
    nomFichier: string;
    statut: string;
    isValidated: boolean;
    commentaireValidation: string;
}

export interface HistoriqueStatusDTO {
    id: number;
    statut: string;
    commentaire: string;
    loginUtilisateur: string;
    dateStatus: string;
}

export interface PageResponse<T> {
    content: T[];
    totalElements: number;
    totalPages: number;
    size: number;
    number: number;
    first: boolean;
    last: boolean;
    numberOfElements: number;
}

export interface CamundaTask {
    id: string;
    name: string;
    assignee: string;
    created: string;
    processInstanceId: string;
}

@Injectable({
    providedIn: 'root'
})
export class ScolariteService {
    private enrollmentApiUrl = `${environment.apiUrl}/INSCRIPTION-SERVICE/api/scolarite`;
    private workflowApiUrl = `${environment.workflowServiceUrl}/api/workflow`;

    constructor(private http: HttpClient) { }

    /**
     * Récupérer les demandes en attente avec pagination
     */
    getDemandesEnAttente(page: number = 0, size: number = 10, sort: string = 'dateCreation,desc'): Observable<PageResponse<DemandeDetailDTO>> {
        const params = new HttpParams()
            .set('page', page.toString())
            .set('size', size.toString())
            .set('sort', sort);

        return this.http.get<PageResponse<DemandeDetailDTO>>(
            `${this.enrollmentApiUrl}/demandes/en-attente`,
            { params }
        );
    }

    /**
     * Récupérer les demandes validées
     */
    getDemandesValidees(page: number = 0, size: number = 10): Observable<PageResponse<DemandeDetailDTO>> {
        const params = new HttpParams()
            .set('page', page.toString())
            .set('size', size.toString());

        return this.http.get<PageResponse<DemandeDetailDTO>>(
            `${this.enrollmentApiUrl}/demandes/validees`,
            { params }
        );
    }

    /**
     * Récupérer les demandes rejetées
     */
    getDemandesRejetees(page: number = 0, size: number = 10): Observable<PageResponse<DemandeDetailDTO>> {
        const params = new HttpParams()
            .set('page', page.toString())
            .set('size', size.toString());

        return this.http.get<PageResponse<DemandeDetailDTO>>(
            `${this.enrollmentApiUrl}/demandes/rejetees`,
            { params }
        );
    }

    /**
     * Récupérer toutes les demandes
     */
    getAllDemandes(page: number = 0, size: number = 10): Observable<PageResponse<DemandeDetailDTO>> {
        const params = new HttpParams()
            .set('page', page.toString())
            .set('size', size.toString());

        return this.http.get<PageResponse<DemandeDetailDTO>>(
            `${this.enrollmentApiUrl}/demandes`,
            { params }
        );
    }

    /**
     * Rechercher par diplôme
     */
    searchByDiplome(nomDiplome: string, page: number = 0, size: number = 10): Observable<PageResponse<DemandeDetailDTO>> {
        const params = new HttpParams()
            .set('page', page.toString())
            .set('size', size.toString());

        return this.http.get<PageResponse<DemandeDetailDTO>>(
            `${this.enrollmentApiUrl}/demandes/diplome/${nomDiplome}`,
            { params }
        );
    }

    /**
     * Récupérer les dossiers incomplets
     */
    getDemandesIncompletes(page: number = 0, size: number = 10): Observable<PageResponse<DemandeDetailDTO>> {
        const params = new HttpParams()
            .set('page', page.toString())
            .set('size', size.toString());

        return this.http.get<PageResponse<DemandeDetailDTO>>(
            `${this.enrollmentApiUrl}/demandes/incomplets`,
            { params }
        );
    }

    /**
     * Récupérer les dossiers complets (prêts à valider)
     */
    getDemandesCompletes(page: number = 0, size: number = 10): Observable<PageResponse<DemandeDetailDTO>> {
        const params = new HttpParams()
            .set('page', page.toString())
            .set('size', size.toString());

        return this.http.get<PageResponse<DemandeDetailDTO>>(
            `${this.enrollmentApiUrl}/demandes/complets`,
            { params }
        );
    }

    /**
     * Récupérer les dossiers urgents (> 4 jours)
     */
    getDemandesUrgentes(page: number = 0, size: number = 10): Observable<PageResponse<DemandeDetailDTO>> {
        const params = new HttpParams()
            .set('page', page.toString())
            .set('size', size.toString());

        return this.http.get<PageResponse<DemandeDetailDTO>>(
            `${this.enrollmentApiUrl}/demandes/urgents`,
            { params }
        );
    }

    /**
     * Récupérer le détail d'une demande
     */
    getDemandeDetail(id: number): Observable<DemandeDetailDTO> {
        return this.http.get<DemandeDetailDTO>(
            `${this.enrollmentApiUrl}/demandes/${id}`
        );
    }

    /**
     * Récupérer les statistiques
     */
    getStatistiques(): Observable<any> {
        return this.http.get(`${this.enrollmentApiUrl}/statistiques`);
    }

    /**
     * Récupérer les tâches Camunda pour une demande
     */
    getTasksForEnrollment(enrollmentId: number): Observable<CamundaTask[]> {
        return this.http.get<CamundaTask[]>(
            `${this.workflowApiUrl}/tasks/enrollment/${enrollmentId}`
        );
    }

    /**
     * Compléter une tâche Camunda (VALIDER ou REJETER)
     * C'est appelé quand on clique sur ✓ ou ✗
     */
    completeTask(taskId: string, decision: 'ACCEPTE' | 'REJETE', commentaire: string, loginUtilisateur: string): Observable<any> {
        return this.http.post(
            `${this.workflowApiUrl}/tasks/${taskId}/complete`,
            {
                decision,
                commentaire,
                loginUtilisateur
            }
        );
    }

    /**
     * Valider un dossier (méthode de compatibilité)
     */
    validerDossier(demandeId: number, taskId: string, commentaire: string): Observable<any> {
        return this.completeTask(taskId, 'ACCEPTE', commentaire, 'scolarite_admin');
    }

    /**
     * Rejeter un dossier (méthode de compatibilité)
     */
    rejeterDossier(demandeId: number, taskId: string, commentaire: string): Observable<any> {
        return this.completeTask(taskId, 'REJETE', commentaire, 'scolarite_admin');
    }

    /**
     * Récupérer un fichier en tant que Blob (pour l'affichage ou le téléchargement)
     * L'intercepteur HTTP se chargera d'ajouter le token Bearer
     */
    getFileBlob(url: string): Observable<Blob> {
        return this.http.get(url, { responseType: 'blob' });
    }
}
