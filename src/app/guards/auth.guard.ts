import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { KeycloakService } from 'keycloak-angular';

export const authGuard: CanActivateFn = async (route, state) => {
  const keycloak = inject(KeycloakService);
  const router = inject(Router);

  try {
    // 1️⃣ Vérifie si l'utilisateur est connecté
    const loggedIn = await keycloak.isLoggedIn();

    if (!loggedIn) {
      console.log('🔒 Non connecté, redirection vers Keycloak...');

      // ✅ CORRECTION: Utilise state.url au lieu de window.location.href
      // Cela permet de revenir à la page demandée après le login
      await keycloak.login({
        redirectUri: window.location.origin + state.url
      });
      return false;
    }

    // 2️⃣ Vérifie les rôles si présents dans la route
    const requiredRoles = route.data?.['roles'] as string[];

    if (!requiredRoles || requiredRoles.length === 0) {
      console.log('✅ Accès autorisé (pas de rôle requis)');
      return true;
    }

    // 3️⃣ Vérifie que l'utilisateur a AU MOINS UN des rôles requis
    // ✅ CORRECTION: .some() au lieu de .every()
    // .every() = l'utilisateur doit avoir TOUS les rôles
    // .some() = l'utilisateur doit avoir AU MOINS UN rôle
    const hasRequiredRole = requiredRoles.some((role: string) =>
      keycloak.isUserInRole(role)
    );

    if (!hasRequiredRole) {
      const userRoles = keycloak.getUserRoles();
      console.warn('⛔ Accès refusé');
      console.log('Rôles requis:', requiredRoles);
      console.log('Vos rôles:', userRoles);

      // Redirige vers une page d'accueil ou une page d'erreur
      router.navigate(['/unauthorized']);
      return false;
    }

    console.log('✅ Accès autorisé');
    return true;

  } catch (error) {
    console.error('❌ Erreur dans authGuard:', error);
    router.navigate(['/error']);
    return false;
  }
};