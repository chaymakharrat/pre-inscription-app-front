import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { DiplomeEtudier, NiveauDiplomeSpecifique } from '../models/diploma.model';
import { environment } from '../envirements/enviremetns';

@Injectable({
    providedIn: 'root'
})
export class DiplomaService {
    // Note: Gateway routes to etudiant-service? Need to check gateway config again.
    private apiUrl = `${environment.apiUrl}/DEPARTEMENT-SERVICE/api/diplomes`;

    constructor(private http: HttpClient) { }

    getDiplomas(): Observable<DiplomeEtudier[]> {
        return this.http.get<DiplomeEtudier[]>(`${this.apiUrl}`);
    }

    getNiveauxByDiploma(diplomaId: number): Observable<NiveauDiplomeSpecifique[]> {
        return this.http.get<NiveauDiplomeSpecifique[]>(`${this.apiUrl}/${diplomaId}/niveaux`);
    }
}
