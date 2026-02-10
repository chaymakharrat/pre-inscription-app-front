import { Component, Input, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { trigger, transition, style, animate } from '@angular/animations';

@Component({
  selector: 'app-auto-save-indicator',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div *ngIf="isSaving || showSaved"
         [@slideInRight]
         class="fixed bottom-6 right-6 bg-white shadow-2xl rounded-2xl px-5 py-4 flex items-center gap-4 border border-gray-100 z-[100] min-w-[240px]"
    >
      <ng-container *ngIf="isSaving; else savedTpl">
        <div class="relative flex items-center justify-center">
          <svg class="animate-spin h-6 w-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
        </div>
        <div>
          <span class="text-sm font-bold text-gray-800 block">Désynchronisation...</span>
          <span class="text-xs text-gray-500">Sauvegarde sur le serveur</span>
        </div>
      </ng-container>

      <ng-template #savedTpl>
        <div class="h-6 w-6 bg-green-100 rounded-full flex items-center justify-center">
          <svg [@scaleIn] class="h-4 w-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <div>
          <span class="text-sm font-bold text-gray-800 block">Données sécurisées</span>
          <span class="text-xs text-green-600 font-medium">Sauvegardé automatiquement</span>
        </div>
      </ng-template>
    </div>
  `,
  animations: [
    trigger('slideInRight', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateX(30px)' }),
        animate('300ms ease-out', style({ opacity: 1, transform: 'translateX(0)' }))
      ]),
      transition(':leave', [
        animate('300ms ease-in', style({ opacity: 0, transform: 'translateX(30px)' }))
      ])
    ]),
    trigger('scaleIn', [
      transition(':enter', [
        style({ scale: 0 }),
        animate('300ms cubic-bezier(0.34, 1.56, 0.64, 1)', style({ scale: 1 }))
      ])
    ])
  ]
})
export class AutoSaveIndicatorComponent implements OnChanges {
  @Input() isSaving: boolean = false;
  showSaved = false;
  private timer: any;

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['isSaving'] && !changes['isSaving'].currentValue && changes['isSaving'].previousValue === true) {
      this.showSaved = true;
      if (this.timer) clearTimeout(this.timer);
      this.timer = setTimeout(() => this.showSaved = false, 3000);
    }
  }
}
