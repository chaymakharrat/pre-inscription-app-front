import { Component, OnInit, HostListener, AfterViewInit, OnDestroy } from '@angular/core';
import { Router, RouterModule, NavigationEnd } from '@angular/router';
import { CommonModule } from '@angular/common';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterModule, CommonModule],
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit, AfterViewInit, OnDestroy {
  // État de l'interface
  isMobileMenuOpen = false;
  isUserMenuOpen = false;

  // Navbar scroll behavior
  isNavbarHidden = false;
  isNavbarTransparent = false; // Démarre solid par défaut
  private lastScrollTop = 0;

  // Détection de la page actuelle
  isHomePage = false;

  // Données utilisateur
  isLoggedIn = false;

  constructor(private router: Router) { }

  ngOnInit(): void {
    this.checkAuthStatus();

    // Détecter la route actuelle au chargement
    this.checkCurrentRoute();

    // Écouter les changements de route
    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe(() => {
        this.checkCurrentRoute();
      });
  }

  ngAfterViewInit(): void {
    // Vérifier la position après le rendu
    setTimeout(() => {
      this.checkScrollPosition();
    }, 50);
  }

  ngOnDestroy(): void {
    // Cleanup if needed
  }

  /**
   * Vérifie quelle est la route actuelle
   */
  private checkCurrentRoute(): void {
    this.isHomePage = this.router.url === '/' || this.router.url === '/home';

    // Si on est sur la page d'accueil, vérifier le scroll
    if (this.isHomePage) {
      this.checkScrollPosition();
    } else {
      // Sur les autres pages, toujours solid
      this.isNavbarTransparent = false;
    }
  }

  /**
   * Vérifie la position du scroll et met à jour l'état de la navbar
   * (seulement sur la page d'accueil)
   */
  private checkScrollPosition(): void {
    if (!this.isHomePage) {
      this.isNavbarTransparent = false;
      return;
    }

    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    const videoSectionHeight = window.innerHeight;

    // Transparency logic (seulement sur la page d'accueil)
    if (scrollTop < videoSectionHeight - 100) {
      this.isNavbarTransparent = true; // Sur la vidéo
    } else {
      this.isNavbarTransparent = false; // Après la vidéo
    }
  }

  @HostListener('window:scroll')
  onScroll(): void {
    // Si on n'est pas sur la page d'accueil, garder solid
    if (!this.isHomePage) {
      this.isNavbarTransparent = false;
      return;
    }

    const scrollTop = window.pageYOffset;
    const videoSectionHeight = window.innerHeight;

    // Hide/Show logic
    if (scrollTop > this.lastScrollTop && scrollTop > 100) {
      this.isNavbarHidden = true;
    } else {
      this.isNavbarHidden = false;
    }

    // Transparency logic (seulement sur page d'accueil)
    if (scrollTop < videoSectionHeight - 100) {
      this.isNavbarTransparent = true; // Sur la vidéo
    } else {
      this.isNavbarTransparent = false; // Après la vidéo
    }

    this.lastScrollTop = scrollTop;
  }

  // Gestion des menus
  toggleMobileMenu(): void {
    this.isMobileMenuOpen = !this.isMobileMenuOpen;
    if (this.isMobileMenuOpen) {
      this.isUserMenuOpen = false;
    }
  }

  toggleUserMenu(): void {
    this.isUserMenuOpen = !this.isUserMenuOpen;
  }

  closeMobileMenu(): void {
    this.isMobileMenuOpen = false;
  }

  closeUserMenu(): void {
    this.isUserMenuOpen = false;
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: Event): void {
    const target = event.target as HTMLElement;

    if (this.isUserMenuOpen && !target.closest('#user-menu-button') && !target.closest('[role="menu"]')) {
      this.isUserMenuOpen = false;
    }

    if (this.isMobileMenuOpen && !target.closest('.md\\:hidden') && !target.closest('#mobile-menu')) {
      this.isMobileMenuOpen = false;
    }
  }

  @HostListener('window:resize')
  onWindowResize(): void {
    // Vérifier la position après redimensionnement
    this.checkScrollPosition();
  }

  checkAuthStatus(): void {
    // TODO: Implement auth logic
  }

  navigateToLogin(): void {
    this.router.navigate(['/login']);
    this.closeMobileMenu();
    this.closeUserMenu();
  }

  logout(): void {
    this.isLoggedIn = false;
    this.router.navigate(['/']);
    this.closeMobileMenu();
    this.closeUserMenu();
  }

  hasRole(role: string): boolean {
    return true;
  }

  getInitials(name: string): string {
    return name
      .split(' ')
      .map(word => word.charAt(0))
      .join('')
      .toUpperCase()
      .substring(0, 2);
  }
}