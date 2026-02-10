import { Routes } from '@angular/router';
import { PreInscriptionComponent } from './components/pre-inscription/pre-inscription.component';
import { authGuard } from './guards/auth.guard';
import { DashboardEnseigantResponsableComponent } from './components/dashboard-enseigant-responsable/dashboard-enseigant-responsable.component';
import { DashboardFinanceComponent } from './components/dashboard-finance/dashboard-finance.component';
import { DashboardScolariteComponent } from './components/dashboard-scolarite/dashboard-scolarite.component';

import { LandingPageComponent } from './components/landing-page/landing-page.component';
import { HomeComponent } from './components/home/home.component';

export const routes: Routes = [
    { path: 'landing-page', component: LandingPageComponent },
    { path: '', component: HomeComponent },
    { path: 'pre-inscription', component: PreInscriptionComponent, canActivate: [authGuard], data: { roles: ['ETUDIANT'] } },
    { path: 'dashboard-finance', component: DashboardFinanceComponent, canActivate: [authGuard], data: { roles: ['AGENT_FINANCE'] } },
    { path: 'dashboard-scolarite', component: DashboardScolariteComponent, canActivate: [authGuard], data: { roles: ['AGENT_SCOLARITE'] } },
    { path: 'dashboard-enseignant-responsable', component: DashboardEnseigantResponsableComponent, canActivate: [authGuard], data: { roles: ['ENSEIGNANT_RESPONSABLE'] } },
    { path: '**', redirectTo: '' }
];
