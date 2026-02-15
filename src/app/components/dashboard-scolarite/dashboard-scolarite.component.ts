// src/app/components/scolarite-dashboard/scolarite-dashboard.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { forkJoin } from 'rxjs';
import { CamundaTask, DemandeDetailDTO, PageResponse, ScolariteService } from '../../services/scolarite.service';
import { SafePipe } from '../../pipes/safe.pipe';


@Component({
  selector: 'app-scolarite-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule, SafePipe],
  templateUrl: './dashboard-scolarite.component.html',
  styleUrl: './dashboard-scolarite.component.css'
})
export class ScolariteDashboardComponent implements OnInit {
  Math = Math;
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
  pageSize = 10;
  totalPages = 0;
  totalElements = 0;
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


  constructor(private scolariteService: ScolariteService) { }

  ngOnInit() {
    this.loadStatistiques();
    this.loadDemandes();
  }

  // Navigation dans le menu latéral
  goToAccueil() {
    this.setFilter('tous');
  }

  goToDossiers() {
    this.setFilter('tous');
  }

  openStatistiquesSection() {
    // Remonte en haut de la page (cartes de stats)
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  openNotificationsSection() {
    // À remplacer par un vrai centre de notifications plus tard
    alert('Centre de notifications à implémenter.');
  }

  openParametresSection() {
    // À remplacer par une vraie page de paramètres plus tard
    alert('Page paramètres à implémenter.');
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

  openDemandeDetail(demande: DemandeDetailDTO) {
    this.selectedDemande = demande;
    this.showModal = true;

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

  closeModal() {
    this.showModal = false;
    this.selectedDemande = null;
    this.commentaire = '';
    this.showValidationDialog = false;
    this.showRejetDialog = false;
    this.showDemanderPiecesDialog = false;
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

  validerDossier() {
    if (!this.selectedDemande || !this.taskId) return;

    this.actionLoading = true;
    this.scolariteService.completeTask(
      this.taskId,
      'ACCEPTE',
      this.commentaire || 'Dossier validé',
      'scolarite_admin'
    ).subscribe({
      next: () => {
        this.actionLoading = false;
        this.closeModal();
        this.loadDemandes();
        this.loadStatistiques();
        alert('✅ Dossier validé avec succès');
      },
      error: (error) => {
        this.actionLoading = false;
        console.error('Erreur validation:', error);
        alert('❌ Erreur lors de la validation');
      }
    });
  }

  rejeterDossier() {
    if (!this.selectedDemande || !this.taskId || !this.commentaire.trim()) {
      alert('⚠️ Veuillez saisir un motif de rejet');
      return;
    }

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
        alert('✅ Dossier rejeté');
      },
      error: (error) => {
        this.actionLoading = false;
        console.error('Erreur rejet:', error);
        alert('❌ Erreur lors du rejet');
      }
    });
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
    const colors = [
      'bg-blue-500',
      'bg-teal-500',
      'bg-purple-500',
      'bg-pink-500',
      'bg-indigo-500',
      'bg-green-500'
    ];
    return colors[index % colors.length];
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

  // downloadDocument(documentId: number) {
  //   // TODO: Implémenter le téléchargement via le service
  //   window.open(`http://localhost:8081/api/documents/download/${documentId}`, '_blank');
  // }

  // viewDocument(documentId: number) {
  //   this.downloadDocument(documentId);
  // }
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

}