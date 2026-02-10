import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { DemandeInscription } from '../models/student.model';
import { environment } from '../envirements/enviremetns';

@Injectable({
    providedIn: 'root'
})
export class EnrollmentService {
    private apiUrl = `${environment.apiUrl}/INSCRIPTION-SERVICE/api/demandes`;

    constructor(private http: HttpClient) { }

    submitDemande(demande: DemandeInscription): Observable<DemandeInscription> {
        return this.http.get<any>(`${this.apiUrl}`); // Adjust as per real endpoint
    }

    // Real submit method
    postDemande(demande: DemandeInscription): Observable<DemandeInscription> {
        return this.http.post<DemandeInscription>(this.apiUrl, demande);
    }
}
