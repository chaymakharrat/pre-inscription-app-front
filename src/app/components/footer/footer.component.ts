import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [CommonModule],
  template: `
    <!-- Footer amélioré (Thème Clair) -->
    <footer class="relative bg-gradient-to-br from-white via-blue-50 to-white text-slate-800 border-t border-blue-100">
      
      <!-- Effet de lumière en arrière-plan -->
      <div class="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-blue-400/10 via-transparent to-transparent pointer-events-none"></div>
      
      <div class="relative max-w-7xl mx-auto px-6 py-16">
        
        <!-- Grille principale -->
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          
          <!-- Colonne 1: À propos -->
          <div class="space-y-6">
            <!-- Logo (Utiliser une version sombre ou texte pour l'instant si l'image n'est pas adaptée) -->
             <div class="flex items-center gap-2 mb-4">
                <span class="text-2xl font-bold bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">
                  ITECH UNIVERSITY
                </span>
             </div>
            
            <p class="text-slate-600 text-sm leading-relaxed">
              iTech University forme les leaders de demain grâce à des programmes innovants, 
              un encadrement d'excellence et une ouverture à l'international.
            </p>
            
            <!-- Réseaux sociaux -->
            <div class="flex gap-4">
              <a href="#" class="group">
                <div class="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center 
                            hover:bg-blue-600 transition-all duration-300 group-hover:scale-110 shadow-sm border border-blue-100 group-hover:border-blue-600">
                  <svg class="w-5 h-5 text-blue-600 group-hover:text-white transition-colors" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                  </svg>
                </div>
              </a>
              
              <a href="#" class="group">
                <div class="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center 
                            hover:bg-blue-400 transition-all duration-300 group-hover:scale-110 shadow-sm border border-blue-100 group-hover:border-blue-400">
                  <svg class="w-5 h-5 text-blue-600 group-hover:text-white transition-colors" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                  </svg>
                </div>
              </a>
              
              <a href="#" class="group">
                <div class="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center 
                            hover:bg-blue-700 transition-all duration-300 group-hover:scale-110 shadow-sm border border-blue-100 group-hover:border-blue-700">
                  <svg class="w-5 h-5 text-blue-600 group-hover:text-white transition-colors" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                  </svg>
                </div>
              </a>
              
              <a href="#" class="group">
                <div class="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center 
                            hover:bg-pink-600 transition-all duration-300 group-hover:scale-110 shadow-sm border border-blue-100 group-hover:border-pink-600">
                  <svg class="w-5 h-5 text-blue-600 group-hover:text-white transition-colors" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/>
                  </svg>
                </div>
              </a>
            </div>
          </div>
          
          <!-- Colonne 2: Plan du site -->
          <div>
            <h3 class="text-lg font-bold mb-6 text-slate-800">Plan du site</h3>
            <ul class="space-y-3">
              <li><a href="#" class="text-slate-600 hover:text-blue-600 transition-colors duration-200 hover:translate-x-1 inline-block">Accueil</a></li>
              <li><a href="#" class="text-slate-600 hover:text-blue-600 transition-colors duration-200 hover:translate-x-1 inline-block">Université</a></li>
              <li><a href="#" class="text-slate-600 hover:text-blue-600 transition-colors duration-200 hover:translate-x-1 inline-block">Admission</a></li>
              <li><a href="#" class="text-slate-600 hover:text-blue-600 transition-colors duration-200 hover:translate-x-1 inline-block">Programmes</a></li>
              <li><a href="#" class="text-slate-600 hover:text-blue-600 transition-colors duration-200 hover:translate-x-1 inline-block">Vie Estudiantine</a></li>
              <li><a href="#" class="text-slate-600 hover:text-blue-600 transition-colors duration-200 hover:translate-x-1 inline-block">Contact</a></li>
              <li><a href="#" class="text-slate-600 hover:text-blue-600 transition-colors duration-200 hover:translate-x-1 inline-block">Pré-inscription</a></li>
            </ul>
          </div>
          
          <!-- Colonne 3: Liens utiles -->
          <div>
            <h3 class="text-lg font-bold mb-6 text-slate-800">Liens utiles</h3>
            <ul class="space-y-3">
              <li><a href="#" class="text-slate-600 hover:text-blue-600 transition-colors duration-200 hover:translate-x-1 inline-block">Nous trouver</a></li>
              <li><a href="#" class="text-slate-600 hover:text-blue-600 transition-colors duration-200 hover:translate-x-1 inline-block">Politique de confidentialité</a></li>
              <li><a href="#" class="text-slate-600 hover:text-blue-600 transition-colors duration-200 hover:translate-x-1 inline-block">Conditions générales</a></li>
            </ul>
          </div>
          
          <!-- Colonne 4: Contact -->
          <div>
            <h3 class="text-lg font-bold mb-6 text-slate-800">Localisation</h3>
            <div class="space-y-4">
              
              <!-- Adresse -->
              <div class="flex items-start gap-3 group">
                <div class="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center flex-shrink-0 group-hover:bg-blue-100 transition-colors">
                  <svg class="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/>
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/>
                  </svg>
                </div>
                <div>
                  <p class="text-sm text-slate-500 mb-1">Adresse</p>
                  <p class="text-slate-700">Ceinture Bourguiba, Gremda<br/>Kaied Mohamed, Sfax</p>
                </div>
              </div>
              
              <!-- Téléphone -->
              <div class="flex items-start gap-3 group">
                <div class="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center flex-shrink-0 group-hover:bg-blue-100 transition-colors">
                  <svg class="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"/>
                  </svg>
                </div>
                <div>
                  <p class="text-sm text-slate-500 mb-1">Téléphone</p>
                  <a href="tel:+21628640000" class="text-slate-700 hover:text-blue-600 transition-colors">
                    +216 28 640 000
                  </a>
                </div>
              </div>
              
              <!-- Email -->
              <div class="flex items-start gap-3 group">
                <div class="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center flex-shrink-0 group-hover:bg-blue-100 transition-colors">
                  <svg class="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
                  </svg>
                </div>
                <div>
                  <p class="text-sm text-slate-500 mb-1">Email</p>
                  <a href="mailto:contact&#64;itech-university.tn" class="text-slate-700 hover:text-blue-600 transition-colors">
                    contact&#64;itech-university.tn
                  </a>
                </div>
              </div>
              
              <!-- Bouton Contact -->
              <button class="w-full mt-4 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-6 py-3 rounded-lg font-semibold transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/30 flex items-center justify-center gap-2 transform hover:-translate-y-0.5">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"/>
                </svg>
                Nous contacter
              </button>
              
            </div>
          </div>
          
        </div>
        
        <!-- Séparateur -->
        <div class="border-t border-slate-200 my-8"></div>
        
        <!-- Bottom bar -->
        <div class="flex flex-col md:flex-row justify-between items-center gap-4">
          <p class="text-slate-500 text-sm">
            © 2024 iTech University. Tous droits réservés.
          </p>
          
          <div class="flex gap-6 text-sm">
            <a href="#" class="text-slate-500 hover:text-blue-600 transition-colors">Mentions légales</a>
            <a href="#" class="text-slate-500 hover:text-blue-600 transition-colors">Cookies</a>
            <a href="#" class="text-slate-500 hover:text-blue-600 transition-colors">Plan du site</a>
          </div>
        </div>
        
      </div>
    </footer>
  `,
  styles: []
})
export class FooterComponent { }