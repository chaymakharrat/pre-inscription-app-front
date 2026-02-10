import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { trigger, transition, style, animate, state } from '@angular/animations';
import { Router } from '@angular/router';

@Component({
  selector: 'app-landing-page',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="relative h-screen overflow-hidden font-sans">
      <!-- Vidéo en arrière-plan -->
      <video 
        autoPlay 
        loop 
        muted 
        playsInline
        class="absolute inset-0 w-full h-full object-cover"
      >
        <source src="/assets/video_computer.mp4" type="video/mp4" />
      </video>

      <!-- Overlay gradient -->
      <div class="absolute inset-0 bg-gradient-to-b from-blue-900/70 via-blue-900/50 to-blue-900/70"></div>

      <!-- Contenu -->
      <div class="relative z-10 flex flex-col items-center justify-center h-full text-white px-4">
        <div [@fadeInUp] class="text-center max-w-4xl">
          <!-- Logo -->
          <img 
            src="assets/logo.png" 
            alt="ITECH University" 
            class="h-24 mx-auto mb-8"
          />

          <!-- Titre principal -->
          <h1 class="text-5xl md:text-7xl font-bold mb-6 tracking-tight">
            Rejoignez l'Excellence
          </h1>
          
          <p class="text-xl md:text-2xl mb-8 text-gray-200">
            Commencez votre parcours universitaire à ITECH University
          </p>

          <!-- Statistiques -->
          <div class="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12 max-w-2xl mx-auto">
            <div class="backdrop-blur-md bg-white/10 rounded-xl p-6 border border-white/20 hover:bg-white/20 transition-all">
              <div class="text-4xl font-bold">5000+</div>
              <div class="text-sm font-medium text-blue-200">Étudiants</div>
            </div>
            <div class="backdrop-blur-md bg-white/10 rounded-xl p-6 border border-white/20 hover:bg-white/20 transition-all">
              <div class="text-4xl font-bold">95%</div>
              <div class="text-sm font-medium text-blue-200">Employabilité</div>
            </div>
            <div class="backdrop-blur-md bg-white/10 rounded-xl p-6 border border-white/20 hover:bg-white/20 transition-all">
              <div class="text-4xl font-bold">20+</div>
              <div class="text-sm font-medium text-blue-200">Programmes</div>
            </div>
          </div>

          <!-- CTA -->
          <button
            (click)="navigateToPreInscription()"
            class="bg-blue-600 hover:bg-blue-700 text-white text-xl px-12 py-4 rounded-full font-semibold shadow-2xl transition-all transform hover:scale-105 active:scale-95 flex items-center gap-3 mx-auto"
          >
            Commencer ma pré-inscription
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </button>

          <p class="mt-6 text-sm text-gray-300 flex items-center justify-center gap-2">
            <span class="flex h-2 w-2 relative">
              <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
              <span class="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
            </span>
            ⏱️ Seulement 5 minutes pour compléter
          </p>
        </div>

        <!-- Scroll indicator -->
        <div
          [@bounce]
          class="absolute bottom-8 cursor-pointer"
        >
          <svg class="w-8 h-8 text-white/50 hover:text-white transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 14l-7 7m0 0l-7-7m7 7V3" />
          </svg>
        </div>
      </div>
    </div>
  `,
  animations: [
    trigger('fadeInUp', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(30px)' }),
        animate('800ms ease-out', style({ opacity: 1, transform: 'translateY(0)' }))
      ])
    ]),
    trigger('bounce', [
      transition('* => *', [
        animate('1.5s ease-in-out', style({ transform: 'translateY(10px)' })),
        animate('1.5s ease-in-out', style({ transform: 'translateY(0)' }))
      ])
    ])
  ]
})
export class LandingPageComponent {
  constructor(private router: Router) { }

  navigateToPreInscription() {
    this.router.navigate(['/pre-inscription']);
  }
}
