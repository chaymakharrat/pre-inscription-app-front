import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AdminService } from '../../services/admin.service';
import { AdminDashboardStats, WorkflowDistribution } from '../../models/dashboard.model';
import { Enrollment } from '../../models/enrollment.model';
import { AlertService } from '../../services/alert.service';
import { StepperComponent } from '../shared/stepper/stepper.component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-dashboard-admin',
  standalone: true,
  imports: [CommonModule, FormsModule, StepperComponent],
  templateUrl: './dashboard-admin.component.html',
  styleUrl: './dashboard-admin.component.css'
})
export class DashboardAdminComponent implements OnInit {
  stats: AdminDashboardStats = {
    totalInscriptions: 0,
    demandesEnAttente: 0,
    dossiersRejetes: 0,
    paiementsValides: 0,
    inscritsDefinitifs: 0
  };

  distribution: WorkflowDistribution[] = [];
  demandes: Enrollment[] = [];
  filteredDemandes: Enrollment[] = [];
  selectedDemande: Enrollment | null = null;

  // Filtres
  currentFilter: 'tous' | 'attente' | 'payment_valid' | 'rejetes' = 'tous';
  searchTerm: string = '';
  showDetailDrawer: boolean = false;
  loading: boolean = false;

  // For Stepper
  workflowSteps: any[] = [
    { id: 1, name: 'Dossier soumis', icon: '📝', status: 'completed' },
    { id: 2, name: 'Validation Scolarité', icon: '🏫', status: 'completed' },
    { id: 3, name: 'Validation Département', icon: '📂', status: 'completed' },
    { id: 4, name: 'Paiement', icon: '💳', status: 'active' },
    { id: 5, name: 'Inscrit', icon: '🎓', status: 'pending' }
  ];

  constructor(
    private adminService: AdminService,
    private alertService: AlertService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.refreshData();
  }

  refreshData() {
    this.loading = true;
    this.adminService.getStats().subscribe(s => this.stats = s);
    this.adminService.getDistribution().subscribe(d => this.distribution = d);
    this.adminService.getAllDemandes().subscribe(dem => {
      this.demandes = dem;
      this.applyFilter();
      this.loading = false;
    });
  }

  setFilter(f: any) {
    this.currentFilter = f;
    this.applyFilter();
  }

  applyFilter() {
    this.filteredDemandes = this.demandes.filter(d => {
      const nomComplet = (d.student?.nom || '') + ' ' + (d.student?.prenom || '');
      const matchSearch = nomComplet.toLowerCase().includes(this.searchTerm.toLowerCase())
        || d.id.toString().includes(this.searchTerm);

      let matchStatus = true;
      if (this.currentFilter === 'attente') {
        matchStatus = !!(d.statut && ['SOUMIS', 'EN_COURS_SCOLARITE', 'EN_COURS_DEPARTEMENT'].includes(d.statut));
      } else if (this.currentFilter === 'payment_valid') {
        matchStatus = d.statut === 'PAYMENT_VALID';
      } else if (this.currentFilter === 'rejetes') {
        matchStatus = !!d.statut?.startsWith('REJETE');
      }

      return matchSearch && matchStatus;
    });
  }

  openDetails(demande: any) {
    this.selectedDemande = demande;
    this.showDetailDrawer = true;
    this.updateWorkflowSteps(demande.statut);
  }

  updateWorkflowSteps(status: string) {
    // Logic to set statuses in workflowSteps based on the demand status
    const statuses = ['SOUMIS', 'EN_COURS_SCOLARITE', 'EN_COURS_DEPARTEMENT', 'PAYMENT_VALID', 'INSCRIT'];
    const currentIndex = status ? statuses.indexOf(status) : -1;

    this.workflowSteps = this.workflowSteps.map((step, idx) => {
      if (idx < currentIndex) return { ...step, status: 'completed' };
      if (idx === currentIndex) return { ...step, status: 'active' };
      return { ...step, status: 'pending' };
    });
  }

  finalize(demandeId: number) {
    if (confirm('Êtes-vous sûr de vouloir finaliser cette inscription ? Cela générera un matricule et un compte utilisateur.')) {
      this.adminService.finalizeInscription(demandeId).subscribe({
        next: () => {
          this.alertService.success('Inscription finalisée avec succès !');
          this.refreshData();
          this.showDetailDrawer = false;
        },
        error: (err) => this.alertService.error('Erreur lors de la finalisation')
      });
    }
  }

  getDistributionPercentage(count: number): number {
    const total = this.distribution.reduce((acc, curr) => acc + curr.count, 0);
    return total > 0 ? (count / total) * 100 : 0;
  }

  logout() {
    // Keycloak logout if needed, otherwise just redirect
    this.router.navigate(['/login']);
  }

  exportToExcel() {
    const data = this.demandes.map(d => ({
      ID: d.id,
      Etudiant: `${d.student?.nom} ${d.student?.prenom}`,
      Email: d.student?.email,
      Statut: d.statut,
      Diplome: d.diplomeDemande,
      Date: d.dateCreation
    }));

    const csvContent = "data:text/csv;charset=utf-8,"
      + ["ID,Etudiant,Email,Statut,Diplome,Date"].concat(data.map(row => Object.values(row).join(","))).join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "inscriptions_admin.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
}
