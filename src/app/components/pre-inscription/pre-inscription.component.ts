import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
// import { of, map, catchError } from 'rxjs';
import { CountryService } from '../../services/country.service';
import { DiplomaService } from '../../services/diploma.service';
import { EnrollmentService } from '../../services/enrollment.service';
import { PhoneValidationService } from '../../services/phone-validation.service';
import { AlertService } from '../../services/alert.service';
import { Country } from '../../models/country.model';
import { DiplomeEtudier, NiveauDiplomeSpecifique } from '../../models/diploma.model';
import { TypeDocument, Student, DemandeInscription } from '../../models/student.model';
import { StudentService } from '../../services/student.service';
import { forkJoin, switchMap, map, of, catchError, Observable, debounceTime } from 'rxjs';
import { StepperComponent } from '../shared/stepper/stepper.component';
import { InputComponent } from '../shared/input/input.component';
import { FileUploadComponent } from '../shared/file-upload/file-upload.component';
import { AutoSaveIndicatorComponent } from '../shared/auto-save-indicator/auto-save-indicator.component';
import { ActionButtonsComponent } from '../shared/action-buttons/action-buttons.component';
import { animate, style, transition, trigger } from '@angular/animations';

@Component({
  selector: 'app-pre-inscription',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    StepperComponent,
    FileUploadComponent,
    AutoSaveIndicatorComponent,
    ActionButtonsComponent,
    InputComponent
  ],
  templateUrl: './pre-inscription.component.html',
  styleUrl: './pre-inscription.component.css',
  animations: [
    trigger('fadeIn', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(10px)' }),
        animate('400ms ease-out', style({ opacity: 1, transform: 'translateY(0)' }))
      ])
    ])
  ]
})
export class PreInscriptionComponent implements OnInit {
  inscriptionForm!: FormGroup;
  countries: Country[] = [];
  diplomas: DiplomeEtudier[] = [];
  levels: NiveauDiplomeSpecifique[] = [];
  currentStep = 1;
  isSubmitting = false;
  isSaving = false;
  selectedFiles: Map<string, File> = new Map();
  idType: 'cin' | 'passport' = 'cin';

  lastDiplomas = ['BACCALAUREAT', 'LICENCE', 'MASTERE', 'INGENIEUR'];

  requiredDocuments = [
    { type: TypeDocument.CARTE_IDENTITE, label: "Carte d'identité ou Passeport", required: true },
    { type: TypeDocument.DIPLOME_BAC, label: "Diplôme du Baccalauréat", required: true },
    { type: TypeDocument.RELEVE_NOTES, label: "Relevé de notes", required: true },
    { type: TypeDocument.CERTIFICAT_NAISSANCE, label: "Certificat de naissance", required: true }
  ];

  extraDocuments: any[] = [];

  constructor(
    private fb: FormBuilder,
    private countryService: CountryService,
    private diplomaService: DiplomaService,
    private enrollmentService: EnrollmentService,
    private phoneValidationService: PhoneValidationService,
    private studentService: StudentService,
    private alertService: AlertService
  ) { }

  ngOnInit(): void {
    this.initForm();
    this.loadInitialData();
  }

  initForm(): void {
    this.inscriptionForm = this.fb.group({
      personalInfo: this.fb.group({
        nom: ['', Validators.required],
        prenom: ['', Validators.required],
        email: ['', [Validators.required, Validators.email]],
        phone: ['', {
          validators: [Validators.required],
          asyncValidators: [this.phoneAsyncValidator.bind(this)],
          updateOn: 'blur'
        }],
        indicatif: ['+216', Validators.required],
        gendre: ['HOMME', Validators.required],
        dateNaissance: ['', [Validators.required, this.ageValidator(18)]],
        pays: ['', Validators.required],
        adresse: ['', Validators.required],
        cin: ['', [Validators.pattern('^[0-9]{8}$')]],
        numPassport: ['']
      }),
      academicInfo: this.fb.group({
        dernierDiplome: ['', Validators.required],
        anneeDernierDiplome: [new Date().getFullYear(), [Validators.required, Validators.min(1900)]],
        diplomeVise: ['', Validators.required],
        niveauVise: ['', Validators.required],
        session: ['2024-2025', Validators.required]
      }),
      documents: this.fb.group({})
    });

    // Watch for changes in dernierDiplome to update extra documents
    this.inscriptionForm.get('academicInfo.dernierDiplome')?.valueChanges.subscribe(val => {
      this.updateExtraDocuments(val);
    });

    // Watch for changes in indicatif to re-validate phone
    this.inscriptionForm.get('personalInfo.indicatif')?.valueChanges.subscribe(() => {
      this.inscriptionForm.get('personalInfo.phone')?.updateValueAndValidity();
    });

    // Watch for changes in pays to update indicatif
    this.inscriptionForm.get('personalInfo.pays')?.valueChanges.subscribe(paysId => {
      const country = this.countries.find(c => c.id == paysId);
      if (country) {
        this.inscriptionForm.get('personalInfo.indicatif')?.setValue(country.indicatif);
      }
    });

    // Watch for changes in indicatif to update pays
    this.inscriptionForm.get('personalInfo.indicatif')?.valueChanges.subscribe(indicatif => {
      const country = this.countries.find(c => c.indicatif === indicatif);
      if (country && this.inscriptionForm.get('personalInfo.pays')?.value != country.id) {
        this.inscriptionForm.get('personalInfo.pays')?.setValue(country.id, { emitEvent: false });
      }
    });

    // Watch for changes in diplomeVise to load levels
    this.inscriptionForm.get('academicInfo.diplomeVise')?.valueChanges.subscribe(val => {
      if (val) {
        this.loadLevels(val);
      }
    });

    // Auto-save logic
    this.inscriptionForm.valueChanges.pipe(
      debounceTime(2000)
    ).subscribe(val => {
      this.autoSave(val);
    });

    this.restoreForm();
    // Set initial validators for CIN/Passport
    this.setIdType('cin');
  }

  get isCurrentStepValid(): boolean {
    if (this.currentStep === 1) {
      return this.personalInfo.valid;
    } else if (this.currentStep === 2) {
      return this.academicInfo.valid;
    } else if (this.currentStep === 3) {
      const allRequiredSelected = this.requiredDocuments.every(doc =>
        !doc.required || this.selectedFiles.has(doc.type)
      );
      const allExtraSelected = this.extraDocuments.every(doc =>
        !doc.required || this.selectedFiles.has(doc.type)
      );
      return allRequiredSelected && allExtraSelected;
    }
    return false;
  }

  private autoSave(data: any): void {
    if (this.inscriptionForm.pristine) return;
    this.isSaving = true;
    localStorage.setItem('pre_inscription_draft', JSON.stringify(data));
    setTimeout(() => {
      this.isSaving = false;
    }, 1000);
  }

  private restoreForm(): void {
    const saved = localStorage.getItem('pre_inscription_draft');
    if (saved) {
      const data = JSON.parse(saved);
      this.inscriptionForm.patchValue(data, { emitEvent: false });

      // Manually trigger updates for dependent fields if needed
      if (data.academicInfo?.diplomeVise) {
        this.loadLevels(data.academicInfo.diplomeVise);
      }
      if (data.personalInfo?.pays) {
        const country = this.countries.find(c => c.id == data.personalInfo.pays);
        if (country) {
          this.inscriptionForm.get('personalInfo.indicatif')?.setValue(country.indicatif, { emitEvent: false });
        }
      }
    }
  }

  setIdType(type: 'cin' | 'passport'): void {
    this.idType = type;
    const cinControl = this.inscriptionForm.get('personalInfo.cin');
    const passportControl = this.inscriptionForm.get('personalInfo.numPassport');

    if (type === 'cin') {
      cinControl?.setValidators([Validators.required, Validators.pattern('^[0-9]{8}$')]);
      passportControl?.clearValidators();
      passportControl?.reset();
    } else {
      passportControl?.setValidators([Validators.required]);
      cinControl?.clearValidators();
      cinControl?.reset();
    }
    cinControl?.updateValueAndValidity();
    passportControl?.updateValueAndValidity();
  }

  setGender(gendre: 'HOMME' | 'FEMME'): void {
    this.inscriptionForm.get('personalInfo.gendre')?.setValue(gendre);
  }

  get personalInfo() { return this.inscriptionForm.get('personalInfo') as FormGroup; }
  get academicInfo() { return this.inscriptionForm.get('academicInfo') as FormGroup; }

  getControl(group: string, name: string) {
    return this.inscriptionForm.get(`${group}.${name}`);
  }

  isFieldValid(group: string, name: string): boolean {
    const control = this.getControl(group, name);
    return !!(control && control.valid && control.value);
  }

  getFieldError(group: string, name: string): string | null {
    const control = this.getControl(group, name);
    if (!control || !control.touched || control.valid) return null;

    if (control.hasError('required')) return 'Ce champ est obligatoire';
    if (control.hasError('email')) return 'Email invalide';
    if (control.hasError('pattern')) return 'Format invalide';
    if (control.hasError('tooYoung')) return 'Age minimum 18 ans';
    if (control.hasError('invalidPhone')) return 'Numéro de téléphone invalide';
    if (control.hasError('countryMismatch')) return 'Le numéro ne correspond pas au pays';

    return 'Champ invalide';
  }

  private ageValidator(minAge: number) {
    return (control: AbstractControl): ValidationErrors | null => {
      if (!control.value) return null;
      const birthDate = new Date(control.value);
      const today = new Date();
      let age = today.getFullYear() - birthDate.getFullYear();
      const monthDiff = today.getMonth() - birthDate.getMonth();
      if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
        age--;
      }
      return age >= minAge ? null : { tooYoung: true, requiredAge: minAge };
    };
  }

  loadInitialData(): void {
    this.countryService.getCountriesWithIndicatifs().subscribe(data => {
      this.countries = data;
    });

    this.diplomaService.getDiplomas().subscribe(data => {
      this.diplomas = data;
    });
  }

  loadLevels(diplomaId: number): void {
    this.diplomaService.getNiveauxByDiploma(diplomaId).subscribe(data => {
      this.levels = data;
    });
  }

  phoneAsyncValidator(control: AbstractControl): any {
    const phone = control.value;
    const indicatif = this.inscriptionForm?.get('personalInfo.indicatif')?.value;

    if (!phone || !indicatif) return of(null);

    const fullNumber = indicatif + phone;

    return this.phoneValidationService.validatePhoneNumber(fullNumber).pipe(
      map((response: any) => {
        if (!response.is_valid) {
          return { invalidPhone: true };
        }

        // Optional: verify if it matches selected country
        // Indicatif is like +216, response.components.country_code is 216
        const countryCode = indicatif.replace('+', '');
        if (response.components.country_code.toString() !== countryCode) {
          return { countryMismatch: true };
        }

        return null;
      }),
      catchError((err: any) => {
        console.error('Phone validation API error:', err);
        return of({ validationError: true });
      })
    );
  }

  // Keeping the old one for reference or removing if not needed
  // phoneValidator(control: AbstractControl): ValidationErrors | null { ... }

  updateExtraDocuments(lastDiploma: string): void {
    this.extraDocuments = [];
    if (lastDiploma === 'LICENCE') {
      this.extraDocuments.push({ type: TypeDocument.DIPLOME_LICENCE, label: "Diplôme de Licence", required: true });
    } else if (lastDiploma === 'MASTERE') {
      this.extraDocuments.push({ type: TypeDocument.DIPLOME_MASTER, label: "Diplôme de Master", required: true });
    }
    // Update form group for documents dynamically if needed
  }

  nextStep(): void {
    if (this.currentStep < 3) {
      this.currentStep++;
    }
  }

  prevStep(): void {
    if (this.currentStep > 1) {
      this.currentStep--;
    }
  }

  onFileChange(file: File, type: string): void {
    if (file) {
      this.selectedFiles.set(type, file);
      console.log(`File buffered for ${type}`, file.name);
    }
  }

  onSubmit(): void {
    if (this.inscriptionForm.valid) {
      const formValue = this.inscriptionForm.value;
      this.isSubmitting = true;

      const email = formValue.personalInfo.email;
      const cin = formValue.personalInfo.cin;
      const passport = formValue.personalInfo.numPassport;
      const paysId = formValue.personalInfo.pays;

      // 1. Prepare existence checks
      const checks: { [key: string]: Observable<boolean> } = {
        email: this.studentService.checkEmailExists(email)
      };

      if (cin) {
        checks['cin'] = this.studentService.checkCinExists(cin);
      }
      if (passport && paysId) {
        checks['passport'] = this.studentService.checkPassportExists(passport, paysId);
      }

      console.log('Performing duplication checks...', Object.keys(checks));

      forkJoin(checks).pipe(
        switchMap(results => {
          if (results['email']) {
            this.alertService.error('Oups ! Cet email est déjà associé à un compte.');
            return of(null);
          }
          if (results['cin']) {
            this.alertService.error('Oups ! Ce numéro de CIN est déjà enregistré.');
            return of(null);
          }
          if (results['passport']) {
            this.alertService.error('Oups ! Ce passeport est déjà utilisé pour ce pays.');
            return of(null);
          }

          // 2. Prepare Student Data if no duplicates
          const studentData: Student = {
            nom: formValue.personalInfo.nom,
            prenom: formValue.personalInfo.prenom,
            email: formValue.personalInfo.email,
            phone: formValue.personalInfo.indicatif + formValue.personalInfo.phone,
            gendre: formValue.personalInfo.gendre,
            dateNaissance: formValue.personalInfo.dateNaissance,
            dernierDiplome: formValue.academicInfo.dernierDiplome,
            anneeDernierDiplome: formValue.academicInfo.anneeDernierDiplome,
            paysId: formValue.personalInfo.pays,
            numCarteIdentite: formValue.personalInfo.cin || undefined,
            numPassport: formValue.personalInfo.numPassport || undefined
          };

          console.log('Creating Student...', studentData);
          return this.studentService.createStudent(studentData);
        }),
        // Only proceed if student was created (not null from duplicate checks)
        switchMap(savedStudent => {
          if (!savedStudent) return of(null);

          console.log('Student created with ID:', savedStudent.id);
          const studentId = savedStudent.id!;

          // 3. Prepare Document Uploads
          const uploadObservables = Array.from(this.selectedFiles.entries()).map(([type, file]) =>
            this.studentService.uploadDocument(studentId, type, file)
          );

          if (uploadObservables.length === 0) {
            return of(savedStudent);
          }

          console.log(`Uploading ${uploadObservables.length} documents...`);
          return forkJoin(uploadObservables).pipe(
            map(() => savedStudent)
          );
        }),
        switchMap(student => {
          if (!student) return of(null);

          // 4. Create Enrollment Request
          const demande: DemandeInscription = {
            etudiantId: student.id!,
            nomDiplome: formValue.academicInfo.diplomeVise,
            dateCreation: new Date().toISOString(),
          };

          console.log('Creating Enrollment Request...', demande);
          return this.enrollmentService.postDemande(demande);
        })
      ).subscribe({
        next: (res) => {
          if (res) {
            this.isSubmitting = false;
            localStorage.removeItem('pre_inscription_draft'); // Added this line
            this.alertService.success('Inscription réussie ! Votre demande a été enregistrée.');
            this.resetForm();
          } else {
            this.isSubmitting = false;
          }
        },
        error: (err) => {
          this.isSubmitting = false;
          console.error('Submission failed:', err);
          this.alertService.error('Une erreur est survenue lors de l\'inscription. Veuillez réessayer.');
        }
      });
    } else {
      this.markFormGroupTouched(this.inscriptionForm);
      const invalidFields = this.getInvalidControls(this.inscriptionForm);
      console.error('Formulaire invalide. Champs concernés :', invalidFields);
      this.alertService.warning('Veuillez remplir correctement les champs obligatoires : ' + invalidFields.join(', '));
    }
  }

  private getInvalidControls(formGroup: FormGroup): string[] {
    const invalid = [];
    const controls = formGroup.controls;
    for (const name in controls) {
      if (controls[name].invalid) {
        if (controls[name] instanceof FormGroup) {
          invalid.push(...this.getInvalidControls(controls[name] as FormGroup).map(child => `${name}.${child}`));
        } else {
          invalid.push(name);
        }
      }
    }
    return invalid;
  }

  private resetForm(): void {
    this.inscriptionForm.reset({
      personalInfo: { gendre: 'HOMME', indicatif: '+216' },
      academicInfo: { anneeDernierDiplome: new Date().getFullYear(), session: '2024-2025' }
    });
    this.selectedFiles.clear();
    this.currentStep = 1;
  }

  private markFormGroupTouched(formGroup: FormGroup) {
    Object.values(formGroup.controls).forEach(control => {
      if (control instanceof FormGroup) {
        this.markFormGroupTouched(control);
      } else {
        control.markAsTouched();
      }
    });
  }
}
