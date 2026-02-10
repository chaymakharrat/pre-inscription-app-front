import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Country } from '../models/country.model';
import { environment } from '../envirements/enviremetns';

@Injectable({
    providedIn: 'root'
})
export class CountryService {
    private apiUrl = `${environment.apiUrl}/ETUDIANT-SERVICE/api/pays`;

    constructor(private http: HttpClient) { }

    getCountriesNoms(): Observable<string[]> {
        return this.http.get<string[]>(`${this.apiUrl}/noms`);
    }

    getCountriesWithIndicatifs(): Observable<Country[]> {
        return this.http.get<Country[]>(`${this.apiUrl}/noms-indicatifs`);
    }
}
