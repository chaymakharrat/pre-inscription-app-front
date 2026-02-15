import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { Student } from '../models/student.model';
import { StudentService } from './student.service';

/**
 * Service qui garde en mémoire l'étudiant connecté.
 * Chargé automatiquement à la connexion (email Keycloak → GET /api/etudiants/email/{email}).
 */
@Injectable({
  providedIn: 'root'
})
export class CurrentStudentService {
  private readonly currentStudent$ = new BehaviorSubject<Student | null>(null);

  constructor(private studentService: StudentService) {}

  /** Observable de l'étudiant connecté (null si pas étudiant ou pas encore chargé). */
  get student(): Observable<Student | null> {
    return this.currentStudent$.asObservable();
  }

  /** Valeur actuelle (synchrone). */
  get value(): Student | null {
    return this.currentStudent$.value;
  }

  /**
   * Charge l'étudiant par email (appelé après connexion quand l'utilisateur a le rôle ETUDIANT).
   * Retourne l'observable pour pouvoir enchaîner ou gérer les erreurs.
   */
  loadByEmail(email: string): Observable<Student> {
    return this.studentService.getStudentByEmail(email).pipe(
      tap((s) => this.currentStudent$.next(s))
    );
  }

  /** Réinitialise l'étudiant (à appeler au logout). */
  clear(): void {
    this.currentStudent$.next(null);
  }

  /** Définit manuellement l'étudiant (optionnel). */
  set(student: Student | null): void {
    this.currentStudent$.next(student);
  }
}
