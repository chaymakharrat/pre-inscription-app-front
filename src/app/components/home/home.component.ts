import { Component, ViewChild, ElementRef, AfterViewInit, HostListener, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { trigger, transition, style, animate } from '@angular/animations';
import { Router } from '@angular/router';
import { PreInscriptionComponent } from '../pre-inscription/pre-inscription.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, PreInscriptionComponent],
  template: `
    <div class="w-full -mt-16 md:-mt-20">
      <!-- Landing Page Section -->
      <div class="relative h-screen overflow-hidden font-sans" #landingSection>
        <!-- Vidéo en arrière-plan -->
        <video 
          #backgroundVideo
          autoplay 
          loop 
          muted 
          playsinline
          class="absolute inset-0 min-w-full min-h-full object-cover"
          [style.transform]="videoTransform"
          style="width: 100%; height: 100%;"
        >
          <source src="assets/video_robot.mp4" type="video/mp4" />
        </video>

        <!-- Overlay gradient -->
        <div class="absolute inset-0" style="background: linear-gradient(180deg, rgba(105, 125, 170, 0.75) 0%, rgba(30,58,138,0.50) 40%, rgba(49,46,129,0.55) 70%, rgba(15,23,42,0.80) 100%);"></div>

        <!-- Floating Particles -->
        <div class="absolute inset-0 overflow-hidden pointer-events-none">
          <div class="particle" *ngFor="let i of [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20]"></div>
        </div>

        <!-- Contenu -->
        <div class="relative z-10 flex flex-col items-center justify-center h-full text-white px-4">
          <div [@fadeInUp] class="text-center max-w-4xl">
            <div class="mb-8">
            <p class="text-sm tracking-[0.3em] uppercase font-semibold text-blue-300 mb-2">
              ITECH UNIVERSITY
            </p>
            <div class="h-1 w-20 bg-gradient-to-r from-blue-400 to-transparent mx-auto"></div>
          </div>
            <!-- Titre principal -->
            <h1 class="text-5xl md:text-7xl font-bold mb-6 tracking-tight">
              Rejoignez l'Excellence
            </h1>
            
            <p class="text-xl md:text-2xl mb-8 text-gray-200">
              Commencez votre parcours universitaire à ITECH University
            </p>

            <!-- Statistiques -->
            <div class="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12 max-w-2xl mx-auto">
              <div class="stat-card backdrop-blur-md bg-white/10 rounded-xl p-6 border border-white/20 hover:bg-white/20 transition-all duration-300">
                <div class="text-4xl font-bold">{{studentsCount}}+</div>
                <div class="text-sm font-medium text-blue-200">Étudiants</div>
              </div>
              <div class="stat-card backdrop-blur-md bg-white/10 rounded-xl p-6 border border-white/20 hover:bg-white/20 transition-all duration-300">
                <div class="text-4xl font-bold">{{employabilityRate}}%</div>
                <div class="text-sm font-medium text-blue-200">Employabilité</div>
              </div>
              <div class="stat-card backdrop-blur-md bg-white/10 rounded-xl p-6 border border-white/20 hover:bg-white/20 transition-all duration-300">
                <div class="text-4xl font-bold">{{programsCount}}+</div>
                <div class="text-sm font-medium text-blue-200">Programmes</div>
              </div>
            </div>

            <!-- CTA -->
            <button
              (click)="scrollToForm()"
              class="cta-button bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white text-xl px-12 py-4 rounded-full font-semibold shadow-2xl transition-all duration-300 transform hover:scale-105 active:scale-95 flex items-center gap-3 mx-auto relative overflow-hidden"
            >
              <span class="relative z-10">Commencer ma pré-inscription</span>
            </button>

            <p class="mt-6 text-sm text-gray-300 flex items-center justify-center gap-2">
              <span class="flex h-2 w-2 relative">
                <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                <span class="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
              </span>
              ⏱️ Seulement 5 minutes pour compléter
            </p>
          </div>

          <!-- Scroll indicator Arrow -->
          <button
            (click)="scrollToForm()"
            [@bounce]
            class="absolute bottom-8 cursor-pointer hover:text-white transition-colors bg-transparent border-none p-2 text-white/50"
            type="button"
          >
            <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 14l-7 7m0 0l-7-7m7 7V3" />
            </svg>
          </button>
        </div>
      </div>

      <!-- Formulaire Section -->
      <div #formSection class="w-full">
        <app-pre-inscription></app-pre-inscription>
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
  ],
  styleUrl: './home.component.css'
})
export class HomeComponent implements AfterViewInit, OnInit {
  @ViewChild('formSection') formSection!: ElementRef;
  @ViewChild('backgroundVideo') backgroundVideo!: ElementRef<HTMLVideoElement>;
  @ViewChild('landingSection') landingSection!: ElementRef;

  // Parallax effect
  videoTransform = 'translateY(0px)';

  // Animated counters
  studentsCount = 0;
  employabilityRate = 0;
  programsCount = 0;
  private countersAnimated = false;

  constructor(private router: Router) { }

  ngOnInit() {
    // Start counter animations after a short delay
    setTimeout(() => this.animateCounters(), 500);
  }

  ngAfterViewInit() {
    // S'assurer que la vidéo est muette et forcer la lecture
    if (this.backgroundVideo?.nativeElement) {
      const video = this.backgroundVideo.nativeElement;
      video.muted = true;
      video.volume = 0;
      video.play().catch(() => {
        // Autoplay bloqué par le navigateur, on réessaie après interaction
        const tryPlay = () => {
          video.play();
          document.removeEventListener('click', tryPlay);
        };
        document.addEventListener('click', tryPlay);
      });
    }
  }

  @HostListener('window:scroll')
  onScroll() {
    const scrolled = window.pageYOffset;
    const parallaxSpeed = 0.5;

    // Parallax video effect
    this.videoTransform = `translateY(${scrolled * parallaxSpeed}px)`;

    // Trigger counter animation when landing section is in view
    if (!this.countersAnimated && this.landingSection) {
      const rect = this.landingSection.nativeElement.getBoundingClientRect();
      if (rect.top < window.innerHeight && rect.bottom > 0) {
        this.animateCounters();
        this.countersAnimated = true;
      }
    }
  }

  private animateCounters() {
    this.animateCounter('students', 5000, 2000);
    this.animateCounter('employability', 95, 2000);
    this.animateCounter('programs', 20, 1500);
  }

  private animateCounter(type: 'students' | 'employability' | 'programs', target: number, duration: number) {
    const start = 0;
    const increment = target / (duration / 16);
    let current = 0;

    const timer = setInterval(() => {
      current += increment;
      if (current >= target) {
        current = target;
        clearInterval(timer);
      }

      switch (type) {
        case 'students':
          this.studentsCount = Math.floor(current);
          break;
        case 'employability':
          this.employabilityRate = Math.floor(current);
          break;
        case 'programs':
          this.programsCount = Math.floor(current);
          break;
      }
    }, 16);
  }

  scrollToForm() {
    if (this.formSection) {
      this.formSection.nativeElement.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
    }
  }
}