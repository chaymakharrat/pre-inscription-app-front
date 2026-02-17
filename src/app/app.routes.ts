import { RouterLink, Routes } from '@angular/router';
import { PreInscriptionComponent } from './components/pre-inscription/pre-inscription.component';
import { authGuard } from './guards/auth.guard';
import { DashboardEnseigantResponsableComponent } from './components/dashboard-enseigant-responsable/dashboard-enseigant-responsable.component';
import { DashboardFinanceComponent } from './components/dashboard-finance/dashboard-finance.component';
import { ScolariteDashboardComponent } from './components/dashboard-scolarite/dashboard-scolarite.component';

import { HomeComponent } from './components/home/home.component';
import { DashboardAdminComponent } from './components/dashboard-admin/dashboard-admin.component';
import { StatistiquesComponent } from './components/statistiques/statistiques.component';
import { NotificationsComponent } from './components/notifications/notifications.component';
import { UsersManagementComponent } from './components/users-management-component/users-management-component.component';

export const routes: Routes = [
    { path: '', component: HomeComponent },
    { path: 'pre-inscription', component: PreInscriptionComponent, canActivate: [authGuard], data: { roles: ['ETUDIANT'] } },
    { path: 'dashboard-finance', component: DashboardFinanceComponent, canActivate: [authGuard], data: { roles: ['AGENT_FINANCE'] } },
    { path: 'dashboard-scolarite', component: ScolariteDashboardComponent, canActivate: [authGuard], data: { roles: ['AGENT_SCOLARITE'] } },
    { path: 'dashboard-enseignant-responsable', component: DashboardEnseigantResponsableComponent, canActivate: [authGuard], data: { roles: ['ENSEIGNANT_RESPONSABLE'] } },
    { path: 'dashboard-admin', component: DashboardAdminComponent, canActivate: [authGuard], data: { roles: ['ADMIN'] } },
    { path: 'statistiques', component: StatistiquesComponent },
    { path: 'notifications', component: NotificationsComponent },
    { path: 'admin/users', component: UsersManagementComponent, canActivate: [authGuard], data: { roles: ['ADMIN'] } },
    { path: '**', redirectTo: '' }
];
