import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { forkJoin } from 'rxjs';
import { CamundaTask, DemandeDetailDTO, PageResponse, ScolariteService } from '../../services/scolarite.service';
import { SafePipe } from '../../pipes/safe.pipe';
import { HostListener } from '@angular/core';
import { Router } from '@angular/router';
import { KeycloakService } from 'keycloak-angular';
import { KeycloakProfile } from 'keycloak-js';


@Component({
  selector: 'app-scolarite-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule, SafePipe],
  templateUrl: './dashboard-scolarite.component.html',
  styleUrl: './dashboard-scolarite.component.css'
})
export class ScolariteDashboardComponent implements OnInit {

  showExportMenu = false;
  selectedDemandes: DemandeDetailDTO[] = [];
  selectAll = false;
  isLoggedIn = false;
  userProfile: KeycloakProfile | null = null;
  Math = Math;
  // Tri du tableau
  sortColumn: string = '';
  sortDirection: 'asc' | 'desc' = 'asc';

  // Recherche avancée
  searchHistory: string[] = [];

  // Système & Notifications
  systemStatus = {
    operational: true,
    lastUpdate: new Date(),
    message: 'Système opérationnel'
  };
  notificationCount = 4;
  // Statistiques
  stats = {
    total: 0,
    enAttente: 0,
    urgents: 0,
    validees: 0,
    rejetees: 0,
    dossiersIncomplets: 0,
    delaiMoyenTraitement: '0h'
  };

  // Liste des dossiers
  demandes: DemandeDetailDTO[] = [];
  currentPage = 0;
  pageSize = 6;
  totalPages = 0;
  totalElements = 0;
  viewMode: 'list' | 'grid' = 'list';
  // Variables pour le visualiseur de documents
  showDocumentViewer = false;
  currentDocumentUrl: string | null = null;
  currentDocumentName: string | null = null;

  // Loading states
  loading = false;
  actionLoading = false;
  private readonly ETUDIANT_SERVICE_URL = 'http://localhost:8888/ETUDIANT-SERVICE';
  private currentDocumentBlobUrl: string | null = null;

  // Filtres
  currentFilter: 'tous' | 'nouveaux' | 'urgents' | 'incomplets' | 'complets' | 'valides' = 'tous';
  searchTerm = '';

  // Dossier sélectionné pour le modal
  selectedDemande: DemandeDetailDTO | null = null;
  showModal = false;
  taskId: string = '';

  // Commentaire pour validation/rejet
  commentaire = '';
  showValidationDialog = false;
  showRejetDialog = false;
  showDemanderPiecesDialog = false;


  constructor(private scolariteService: ScolariteService, private router: Router, private keycloak: KeycloakService) { }

  async ngOnInit() {
    this.isLoggedIn = await this.keycloak.isLoggedIn();
    if (this.isLoggedIn) {
      try {
        this.userProfile = await this.keycloak.loadUserProfile();
      } catch (error) {
        console.error('Erreur chargement profil:', error);
      }
    }
    this.loadStatistiques();
    this.loadDemandes();
  }


  loadStatistiques() {
    this.scolariteService.getStatistiques().subscribe({
      next: (stats) => {
        this.stats = stats;
      },
      error: (error) => {
        console.error('Erreur lors du chargement des statistiques:', error);
      }
    });
  }

  loadDemandes() {
    this.loading = true;
    let observable;

    switch (this.currentFilter) {
      case 'nouveaux':
        observable = this.scolariteService.getDemandesEnAttente(this.currentPage, this.pageSize);
        break;
      case 'valides':
        observable = this.scolariteService.getDemandesValidees(this.currentPage, this.pageSize);
        break;
      case 'incomplets':
        observable = this.scolariteService.getDemandesIncompletes(this.currentPage, this.pageSize);
        break;
      case 'complets':
        observable = this.scolariteService.getDemandesCompletes(this.currentPage, this.pageSize);
        break;
      case 'urgents':
        observable = this.scolariteService.getDemandesUrgentes(this.currentPage, this.pageSize);
        break;
      default:
        observable = this.scolariteService.getAllDemandes(this.currentPage, this.pageSize);
    }

    observable.subscribe({
      next: (response: PageResponse<DemandeDetailDTO>) => {
        this.demandes = response.content;
        this.totalElements = response.totalElements;
        this.totalPages = response.totalPages;
        this.loading = false;
      },
      error: (error) => {
        console.error('Erreur lors du chargement des demandes:', error);
        this.loading = false;
      }
    });
  }

  // Export simple de la liste affichée en CSV
  exportCsv() {
    if (!this.demandes || this.demandes.length === 0) {
      alert('Aucun dossier à exporter.');
      return;
    }

    const header = [
      'NumeroDossier',
      'Nom',
      'Prenom',
      'Email',
      'Diplome',
      'Statut',
      'Priorite',
      'DocumentsValides',
      'DocumentsTotal'
    ];

    const rows = this.demandes.map(d => {
      const docsValides = d.documents.filter(doc => doc.statut === 'SOUMIS').length;
      return [
        d.numeroDossier,
        d.etudiant.nom,
        d.etudiant.prenom,
        d.etudiant.email,
        d.nomDiplome,
        d.statutActuel,
        d.priorite,
        docsValides,
        d.documents.length
      ].join(';');
    });

    const csvContent = [header.join(';'), ...rows].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'dossiers-scolarite.csv';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  setFilter(filter: 'tous' | 'nouveaux' | 'urgents' | 'incomplets' | 'complets' | 'valides') {
    this.currentFilter = filter;
    this.currentPage = 0;
    this.loadDemandes();
  }

  onSearch() {
    this.currentPage = 0;
    if (this.searchTerm.trim()) {
      this.scolariteService.searchByDiplome(this.searchTerm, this.currentPage, this.pageSize).subscribe({
        next: (response) => {
          this.demandes = response.content;
          this.totalElements = response.totalElements;
          this.totalPages = response.totalPages;
        },
        error: (error) => console.error('Erreur recherche:', error)
      });
    } else {
      this.loadDemandes();
    }
  }

  goToPage(page: number) {
    if (page >= 0 && page < this.totalPages) {
      this.currentPage = page;
      this.loadDemandes();
    }
  }

  // openDemandeDetail(demande: DemandeDetailDTO) {
  //   this.selectedDemande = demande;
  //   this.showModal = true;

  //   // Récupérer le taskId de Camunda
  //   this.scolariteService.getTasksForEnrollment(demande.id).subscribe({
  //     next: (tasks: CamundaTask[]) => {
  //       if (tasks && tasks.length > 0) {
  //         this.taskId = tasks[0].id;
  //       }
  //     },
  //     error: (error) => console.error('Erreur récupération task:', error)
  //   });
  // }
  activeTab: 'documents' | 'action' = 'documents'; // Onglet actif du modal
  openDemandeDetail(demande: DemandeDetailDTO, initialTab: 'documents' | 'action' = 'documents', actionType?: 'validation' | 'rejet' | 'pieces') {
    this.selectedDemande = demande;
    this.showModal = true;
    this.activeTab = initialTab;
    this.commentaire = '';

    // Configurer l'état initial selon l'action demandée
    this.showValidationDialog = actionType === 'validation';
    this.showRejetDialog = actionType === 'rejet';
    this.showDemanderPiecesDialog = actionType === 'pieces';

    // Récupérer le taskId de Camunda
    this.scolariteService.getTasksForEnrollment(demande.id).subscribe({
      next: (tasks: CamundaTask[]) => {
        if (tasks && tasks.length > 0) {
          this.taskId = tasks[0].id;
        }
      },
      error: (error) => console.error('Erreur récupération task:', error)
    });
  }

  // closeModal() {
  //   this.showModal = false;
  //   this.selectedDemande = null;
  //   this.commentaire = '';
  //   this.showValidationDialog = false;
  //   this.showRejetDialog = false;
  //   this.showDemanderPiecesDialog = false;
  // }
  closeModal() {
    this.showModal = false;
    this.selectedDemande = null;
    this.commentaire = '';
    this.showValidationDialog = false;
    this.showRejetDialog = false;
    this.showDemanderPiecesDialog = false;
    this.activeTab = 'documents';         // ← Reset onglet
  }

  openValidationDialog() {
    this.showValidationDialog = true;
    this.showRejetDialog = false;
  }

  openRejetDialog() {
    this.showRejetDialog = true;
    this.showValidationDialog = false;
  }

  openDemanderPiecesDialog() {
    this.showDemanderPiecesDialog = true;
  }

  // validerDossier() {
  //   if (!this.selectedDemande || !this.taskId) return;

  //   this.actionLoading = true;
  //   this.scolariteService.completeTask(
  //     this.taskId,
  //     'ACCEPTE',
  //     this.commentaire || 'Dossier validé',
  //     'scolarite_admin'
  //   ).subscribe({
  //     next: () => {
  //       this.actionLoading = false;
  //       this.closeModal();
  //       this.loadDemandes();
  //       this.loadStatistiques();
  //       alert('✅ Dossier validé avec succès');
  //     },
  //     error: (error) => {
  //       this.actionLoading = false;
  //       console.error('Erreur validation:', error);
  //       alert('❌ Erreur lors de la validation');
  //     }
  //   });
  // }
  validerDossier() {
    if (!this.selectedDemande || !this.taskId) return;

    this.actionLoading = true;
    this.scolariteService.completeTask(
      this.taskId,
      'ACCEPTE',
      this.commentaire || 'Dossier validé par scolarité',
      'scolarite_admin'
    ).subscribe({
      next: () => {
        this.actionLoading = false;
        this.closeModal();
        this.loadDemandes();
        this.loadStatistiques();
        // ✅ Toast au lieu de alert()
        this.showNotification('Dossier validé avec succès', 'success');
      },
      error: (error) => {
        this.actionLoading = false;
        console.error('Erreur validation:', error);
        this.showNotification('Erreur lors de la validation', 'error');
      }
    });
  }
  // ── NOTIFICATION TOAST (remplace alert) ─────────────────────

  toastVisible = false;
  toastMessage = '';
  toastType: 'success' | 'error' = 'success';

  showNotification(message: string, type: 'success' | 'error'): void {
    this.toastMessage = message;
    this.toastType = type;
    this.toastVisible = true;
    setTimeout(() => this.toastVisible = false, 3500);
  }

  // rejeterDossier() {
  //   if (!this.selectedDemande || !this.taskId || !this.commentaire.trim()) {
  //     alert('⚠️ Veuillez saisir un motif de rejet');
  //     return;
  //   }

  //   this.actionLoading = true;
  //   this.scolariteService.completeTask(
  //     this.taskId,
  //     'REJETE',
  //     this.commentaire,
  //     'scolarite_admin'
  //   ).subscribe({
  //     next: () => {
  //       this.actionLoading = false;
  //       this.closeModal();
  //       this.loadDemandes();
  //       this.loadStatistiques();
  //       alert('✅ Dossier rejeté');
  //     },
  //     error: (error) => {
  //       this.actionLoading = false;
  //       console.error('Erreur rejet:', error);
  //       alert('❌ Erreur lors du rejet');
  //     }
  //   });
  // }
  // ── MODIFIER rejeterDossier() — plus de alert() ──────────────

  rejeterDossier() {
    if (!this.selectedDemande || !this.taskId || !this.commentaire.trim()) return;

    this.actionLoading = true;
    this.scolariteService.completeTask(
      this.taskId,
      'REJETE',
      this.commentaire,
      'scolarite_admin'
    ).subscribe({
      next: () => {
        this.actionLoading = false;
        this.closeModal();
        this.loadDemandes();
        this.loadStatistiques();
        this.showNotification('Dossier rejeté', 'success');
      },
      error: (error) => {
        this.actionLoading = false;
        console.error('Erreur rejet:', error);
        this.showNotification('Erreur lors du rejet', 'error');
      }
    });
  }
  // Ajouter cette méthode pour fermer le menu en cliquant ailleurs
  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent): void {
    const target = event.target as HTMLElement;
    if (!target.closest('.export-menu-container')) {
      this.showExportMenu = false;
    }
  }

  demanderPieces() {
    if (!this.commentaire.trim()) {
      alert('⚠️ Veuillez préciser les pièces demandées');
      return;
    }

    // TODO: Implémenter l'envoi d'email ou notification à l'étudiant
    alert('📧 Demande de pièces envoyée à l\'étudiant');
    this.closeModal();
  }

  getDocumentStatusClass(statut: string): string {
    switch (statut) {
      case 'SOUMIS': return 'bg-green-100 text-green-700';
      case 'MANQUANTE': return 'bg-red-100 text-red-700';
      case 'REJETE': return 'bg-red-100 text-red-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  }

  getDateStatusClass(priorite: string): string {
    switch (priorite) {
      case 'HAUTE': return 'text-red-600';
      case 'MOYENNE': return 'text-orange-600';
      default: return 'text-gray-600';
    }
  }

  getPrioriteLabel(priorite: string): string {
    switch (priorite) {
      case 'HAUTE': return 'Urgent';
      case 'MOYENNE': return 'En attente';
      case 'BASSE': return 'Nouveau';
      default: return '';
    }
  }

  getInitials(nom: string, prenom: string): string {
    return (nom.charAt(0) + prenom.charAt(0)).toUpperCase();
  }

  getAvatarColor(index: number): string {
    const gradients = [
      'linear-gradient(135deg, #6366f1 0%, #a855f7 100%)', // Indigo-Purple
      'linear-gradient(135deg, #3b82f6 0%, #2dd4bf 100%)', // Blue-Teal
      'linear-gradient(135deg, #f59e0b 0%, #ef4444 100%)', // Amber-Red
      'linear-gradient(135deg, #10b981 0%, #3b82f6 100%)', // Emerald-Blue
      'linear-gradient(135deg, #ec4899 0%, #8b5cf6 100%)', // Pink-Violet
      'linear-gradient(135deg, #06b6d4 0%, #3b82f6 100%)'  // Cyan-Blue
    ];
    return gradients[index % gradients.length];
  }

  formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit' });
  }

  formatTime(heures: number): string {
    if (heures < 1) {
      return 'Il y a ' + Math.round(heures * 60) + ' min';
    } else if (heures < 24) {
      return 'Il y a ' + Math.round(heures) + 'h';
    } else {
      const jours = Math.floor(heures / 24);
      return 'Il y a ' + jours + 'j';
    }
  }
  /**
 * ✅ MODIFIÉ : Utiliser l'endpoint /view pour la visualisation inline
 * Cet endpoint retourne le document avec Content-Disposition: inline
 * ce qui permet l'affichage dans l'iframe
 */
  viewDocument(documentId: number, documentName: string) {
    console.log('👁️ Opening document viewer:', documentId, documentName);
    const url = `${this.ETUDIANT_SERVICE_URL}/api/documents/view/${documentId}`;

    this.scolariteService.getFileBlob(url).subscribe({
      next: (blob) => {
        // Nettoyer l'ancienne URL si elle existe
        if (this.currentDocumentBlobUrl) {
          URL.revokeObjectURL(this.currentDocumentBlobUrl);
        }

        // Créer une URL locale pour le Blob
        this.currentDocumentBlobUrl = URL.createObjectURL(blob);
        this.currentDocumentUrl = this.currentDocumentBlobUrl;
        this.currentDocumentName = documentName;
        this.showDocumentViewer = true;
      },
      error: (err) => {
        console.error('❌ Erreur lors de la récupération du document:', err);
        alert('Impossible de charger le document. Vérifiez votre connexion ou vos droits.');
      }
    });
  }

  /**
   * Fermer le visualiseur de documents
   */
  closeDocumentViewer() {
    console.log('❌ Closing document viewer');
    this.showDocumentViewer = false;

    // Révoquer l'URL pour libérer la mémoire
    if (this.currentDocumentBlobUrl) {
      URL.revokeObjectURL(this.currentDocumentBlobUrl);
      this.currentDocumentBlobUrl = null;
    }

    this.currentDocumentUrl = null;
    this.currentDocumentName = null;
  }

  /**
   * ✅ MODIFIÉ : Utiliser l'endpoint /download pour forcer le téléchargement
   * Cet endpoint retourne le document avec Content-Disposition: attachment
   */
  downloadDocument(documentId: number) {
    // ✅ IMPORTANT : Utiliser /download pour forcer le téléchargement
    const downloadUrl = `${this.ETUDIANT_SERVICE_URL}/api/documents/download/${documentId}`;
    console.log('⬇️ Downloading document:', downloadUrl);
    window.open(downloadUrl, '_blank');
  }

  // Helper methods for template
  getDocumentsSoumisCount(documents: any[]): number {
    if (!documents) return 0;
    return documents.filter(d => d.statut === 'SOUMIS').length;
  }

  hasMissingDocuments(documents: any[]): boolean {
    if (!documents) return false;
    return documents.some(d => d.statut === 'MANQUANTE');
  }

  areAllDocumentsSubmitted(documents: any[]): boolean {
    if (!documents || documents.length === 0) return false;
    return documents.every(d => d.statut === 'SOUMIS');
  }

  getCompletionPercentage(documents: any[]): number {
    if (!documents || documents.length === 0) return 0;
    return (this.getDocumentsSoumisCount(documents) / documents.length) * 100;
  }
  // ========== NOUVELLES MÉTHODES À AJOUTER ==========

  /**
   * Basculer le menu d'export
   */
  toggleExportMenu(): void {
    this.showExportMenu = !this.showExportMenu;
  }

  /**
   * Export Excel amélioré
   */
  exportExcel(): void {
    if (!this.demandes || this.demandes.length === 0) {
      alert('Aucun dossier à exporter.');
      return;
    }

    // TODO: Implémenter avec une librairie comme xlsx
    console.log('Export Excel:', this.demandes.length, 'dossiers');
    alert('📊 Export Excel à implémenter avec la librairie xlsx');
    this.showExportMenu = false;
  }

  /**
   * Export PDF
   */
  exportPdf(): void {
    if (!this.demandes || this.demandes.length === 0) {
      alert('Aucun dossier à exporter.');
      return;
    }

    // TODO: Implémenter avec jsPDF ou pdfmake
    console.log('Export PDF:', this.demandes.length, 'dossiers');
    alert('📄 Export PDF à implémenter avec jsPDF');
    this.showExportMenu = false;
  }

  /**
   * Sélectionner/Désélectionner tous les dossiers
   */
  toggleSelectAll(): void {
    this.selectAll = !this.selectAll;
    if (this.selectAll) {
      this.selectedDemandes = [...this.demandes];
    } else {
      this.selectedDemandes = [];
    }
  }

  /**
   * Sélectionner/Désélectionner un dossier
   */
  toggleSelectDemande(demande: DemandeDetailDTO): void {
    const index = this.selectedDemandes.findIndex(d => d.id === demande.id);
    if (index > -1) {
      this.selectedDemandes.splice(index, 1);
    } else {
      this.selectedDemandes.push(demande);
    }
    this.selectAll = this.selectedDemandes.length === this.demandes.length;
  }

  /**
   * Vérifier si un dossier est sélectionné
   */
  isDossierSelected(demande: DemandeDetailDTO): boolean {
    return this.selectedDemandes.some(d => d.id === demande.id);
  }

  /**
   * Valider plusieurs dossiers en masse
   */
  validerDossiersEnMasse(): void {
    if (this.selectedDemandes.length === 0) {
      alert('⚠️ Aucun dossier sélectionné');
      return;
    }

    // Vérifier que tous les dossiers sont complets
    const incomplets = this.selectedDemandes.filter(d =>
      !this.areAllDocumentsSubmitted(d.documents)
    );

    if (incomplets.length > 0) {
      alert(`❌ ${incomplets.length} dossier(s) incomplet(s) ne peuvent pas être validés`);
      return;
    }

    if (!confirm(`Valider ${this.selectedDemandes.length} dossier(s) ?`)) {
      return;
    }

    this.actionLoading = true;

    // Créer les observables de validation
    const validations = this.selectedDemandes.map(demande => {
      return this.scolariteService.completeTask(
        demande.taskId || '',
        'ACCEPTE',
        'Validation groupée',
        'scolarite_admin'
      );
    });

    // Exécuter en parallèle
    forkJoin(validations).subscribe({
      next: () => {
        this.actionLoading = false;
        alert(`✅ ${this.selectedDemandes.length} dossier(s) validé(s) avec succès`);
        this.selectedDemandes = [];
        this.selectAll = false;
        this.loadDemandes();
        this.loadStatistiques();
      },
      error: (error) => {
        this.actionLoading = false;
        console.error('Erreur validation groupée:', error);
        alert('❌ Erreur lors de la validation groupée');
      }
    });
  }

  /**
   * Rejeter plusieurs dossiers en masse
   */
  rejeterDossiersEnMasse(): void {
    if (this.selectedDemandes.length === 0) {
      alert('⚠️ Aucun dossier sélectionné');
      return;
    }

    const motif = prompt(`Motif de rejet pour ${this.selectedDemandes.length} dossier(s):`);

    if (!motif || !motif.trim()) {
      alert('⚠️ Motif de rejet requis');
      return;
    }

    this.actionLoading = true;

    const rejets = this.selectedDemandes.map(demande => {
      return this.scolariteService.completeTask(
        demande.taskId || '',
        'REJETE',
        motif,
        'scolarite_admin'
      );
    });

    forkJoin(rejets).subscribe({
      next: () => {
        this.actionLoading = false;
        alert(`✅ ${this.selectedDemandes.length} dossier(s) rejeté(s)`);
        this.selectedDemandes = [];
        this.selectAll = false;
        this.loadDemandes();
        this.loadStatistiques();
      },
      error: (error) => {
        this.actionLoading = false;
        console.error('Erreur rejet groupé:', error);
        alert('❌ Erreur lors du rejet groupé');
      }
    });
  }

  /**
   * Trier le tableau par colonne
   */
  sortByColumn(column: string): void {
    if (this.sortColumn === column) {
      this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortColumn = column;
      this.sortDirection = 'asc';
    }

    this.demandes.sort((a, b) => {
      let valueA: any;
      let valueB: any;

      switch (column) {
        case 'numero':
          valueA = a.numeroDossier;
          valueB = b.numeroDossier;
          break;
        case 'nom':
          valueA = a.etudiant.nom;
          valueB = b.etudiant.nom;
          break;
        case 'formation':
          valueA = a.nomDiplome;
          valueB = b.nomDiplome;
          break;
        case 'date':
          valueA = new Date(a.dateCreation).getTime();
          valueB = new Date(b.dateCreation).getTime();
          break;
        case 'progression':
          valueA = this.getCompletionPercentage(a.documents);
          valueB = this.getCompletionPercentage(b.documents);
          break;
        default:
          return 0;
      }

      if (valueA < valueB) {
        return this.sortDirection === 'asc' ? -1 : 1;
      }
      if (valueA > valueB) {
        return this.sortDirection === 'asc' ? 1 : -1;
      }
      return 0;
    });
  }

  /**
   * Effacer la recherche
   */
  clearSearch(): void {
    this.searchTerm = '';
    this.loadDemandes();
  }

  /**
   * Obtenir la classe CSS pour l'icône de tri
   */
  getSortIconClass(column: string): string {
    if (this.sortColumn !== column) {
      return 'text-gray-400';
    }
    return this.sortDirection === 'asc'
      ? 'text-blue-600'
      : 'text-blue-600 transform rotate-180';
  }
  logout(): void {
    this.keycloak.logout();
  }

  hasRole(role: string): boolean {
    return this.keycloak.isUserInRole(role);
  }

  getDisplayRole(): string {
    if (this.hasRole('ADMIN')) return 'Administrateur';
    if (this.hasRole('AGENT_SCOLARITE')) return 'AGENT_SCOLARITE';
    return 'Agent Scolarité';
  }
  getProfileInitials(): string {
    if (!this.userProfile) return 'IT';
    const first = this.userProfile.firstName?.charAt(0) || '';
    const last = this.userProfile.lastName?.charAt(0) || '';
    return (first + last).toUpperCase() || 'IT';
  }

  getPagesArray(): number[] {
    return Array.from({ length: this.totalPages }, (_, i) => i);
  }
  // ── NOUVELLE MÉTHODE : stepper workflow ─────────────────────

  /**
   * Détermine si une étape du workflow est terminée
   * selon le statut actuel du dossier
   */
  isStepDone(step: string): boolean {
    if (!this.selectedDemande) return false;
    const statut = this.selectedDemande.statutActuel || '';

    const order = [
      'SOUMIS',
      'SCOLARITE_VALIDEE',    // correspond à 'SCOLARITE'
      'DEPARTEMENT_VALIDE',   // correspond à 'DEPARTEMENT'
      'PAYMENT_VALID',
      'INSCRIT'
    ];

    const stepMap: Record<string, string> = {
      'SCOLARITE': 'SCOLARITE_VALIDEE',
      'DEPARTEMENT': 'DEPARTEMENT_VALIDE',
      'PAIEMENT': 'PAYMENT_VALID',
      'INSCRIT': 'INSCRIT'
    };

    const targetStatus = stepMap[step];
    if (!targetStatus) return false;

    const currentIndex = order.indexOf(statut);
    const targetIndex = order.indexOf(targetStatus);

    return currentIndex >= targetIndex && currentIndex !== -1;
  }

  /**
   * Détermine si une étape est l'étape courante (active)
   */
  isStepActive(step: string): boolean {
    if (!this.selectedDemande) return false;
    const statut = this.selectedDemande.statutActuel || '';

    const stepMap: Record<string, string[]> = {
      'SCOLARITE': ['SOUMIS', 'EN_COURS_SCOLARITE'],
      'DEPARTEMENT': ['SCOLARITE_VALIDEE'],
      'PAIEMENT': ['DEPARTEMENT_VALIDE'],
      'INSCRIT': ['PAYMENT_VALID'],
    };

    return stepMap[step]?.includes(statut) ?? false;
  }

}