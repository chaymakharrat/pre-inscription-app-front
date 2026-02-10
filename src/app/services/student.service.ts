import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map, catchError, of } from 'rxjs';
import { Student } from '../models/student.model';
import { environment } from '../envirements/enviremetns';

@Injectable({
    providedIn: 'root'
})
export class StudentService {
    private apiUrl = `${environment.apiUrl}/ETUDIANT-SERVICE/api/etudiants`;


    constructor(private http: HttpClient) { }

    createStudent(student: Student): Observable<Student> {
        return this.http.post<Student>(this.apiUrl, student);
    }

    uploadDocument(studentId: number, type: string, file: File): Observable<any> {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('type', type);
        formData.append('etudiantId', studentId.toString());
        return this.http.post(`${environment.apiUrl}/ETUDIANT-SERVICE/api/documents/upload`, formData);
    }

    checkEmailExists(email: string): Observable<boolean> {
        return this.http.get<any>(`${this.apiUrl}/email/${email}`).pipe(
            map(() => true),
            catchError(() => of(false))
        );
    }

    checkCinExists(cin: string): Observable<boolean> {
        return this.http.get<any>(`${this.apiUrl}/numCarteIdentite/${cin}`).pipe(
            map(() => true),
            catchError(() => of(false))
        );
    }

    checkPassportExists(numPassport: string, paysId: number): Observable<boolean> {
        return this.http.get<any>(`${this.apiUrl}/passportAndPays`, {
            params: { numPassport, paysId: paysId.toString() }
        }).pipe(
            map(() => true),
            catchError(() => of(false))
        );
    }
}
