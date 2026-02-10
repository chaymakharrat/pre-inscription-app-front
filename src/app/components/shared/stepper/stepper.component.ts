import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

interface Step {
  id: number;
  name: string;
  icon: string;
}

@Component({
  selector: 'app-stepper',
  standalone: true,
  imports: [CommonModule],
  template: `
     <div class="w-full py-8">
      <div class="flex items-center justify-between max-w-3xl mx-auto px-4">
        <div *ngFor="let step of steps; let i = index" class="step-item">

          <!-- Step circle with gradient border -->
          <div class="step-node">
            <div
              [class]="'step-circle ' +
                (currentStep > step.id ? 'completed' :
                 currentStep === step.id ? 'active' : 'inactive')"
            >
              <ng-container *ngIf="currentStep > step.id; else showIcon">
                <svg class="checkmark" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7" />
                </svg>
              </ng-container>
              <ng-template #showIcon>
                <span class="step-emoji">{{ step.icon }}</span>
              </ng-template>
            </div>

            <!-- Step label -->
            <div [class]="'step-label ' + (currentStep === step.id ? 'label-active' : 'label-default')">
              {{ step.name }}
            </div>
          </div>

          <!-- Connector line -->
          <div *ngIf="i < steps.length - 1" class="connector">
            <div
              class="connector-fill"
              [style.width]="currentStep > step.id ? '100%' : '0%'"
            ></div>
          </div>

        </div>
      </div>

      <!-- Animated progress bar -->
      <div class="progress-section">
        <div class="progress-track">
          <div
            class="progress-fill"
            [style.width]="progressPercentage + '%'"
          ></div>
        </div>
        <div class="progress-label">{{ progressPercentage }}%</div>
      </div>
    </div>
  `,
  styles: [`
    /* ---- Wrapper ---- */
    .stepper-wrapper {
      width: 100%;
      padding: 2rem 1.5rem 1.5rem;
      background: #ffffff;
      border-radius: 1.25rem;
      border: 2px solid transparent;
      background-clip: padding-box;
      position: relative;
    }

    /* Gradient border via pseudo-element */
    .stepper-wrapper::before {
      content: '';
      position: absolute;
      inset: -2px;
      border-radius: calc(1.25rem + 2px);
      background: linear-gradient(135deg, #ffffff 0%, #d6e5f5 50%, #81F0EA 100%);
      z-index: -1;
    }

    /* ---- Steps row ---- */
    .steps-container {
      display: flex;
      align-items: flex-start;
      justify-content: space-between;
      max-width: 640px;
      margin: 0 auto;
    }

    .step-item {
      display: flex;
      flex: 1;
      align-items: center;
    }

    /* ---- Step node (circle + label) ---- */
    .step-node {
      display: flex;
      flex-direction: column;
      align-items: center;
      flex-shrink: 0;
    }

    /* Circle base */
    .step-circle {
      width: 56px;
      height: 56px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      position: relative;
      transition: transform 0.3s ease, box-shadow 0.3s ease;
      cursor: default;
    }

    /* Active: gradient border + white fill */
    .step-circle.active {
      background: #ffffff;
      box-shadow:
        0 0 0 2.5px transparent,
        0 4px 16px rgba(129, 240, 234, 0.35);
      /* Gradient border via outline trick */
      border: 3px solid transparent;
      background-clip: padding-box;
    }
    .step-circle.active::before {
      content: '';
      position: absolute;
      inset: -3px;
      border-radius: 50%;
      background: linear-gradient(135deg, #d6e5f5 0%, #81F0EA 100%);
      z-index: -1;
    }

    /* Completed: filled gradient */
    .step-circle.completed {
      background: linear-gradient(135deg, #d6e5f5 0%, #81F0EA 100%);
      border: none;
      box-shadow: 0 4px 14px rgba(129, 225, 240, 0.4);
      transform: scale(1.05);
    }

    /* Inactive */
    .step-circle.inactive {
      background: #f1f5f9;
      border: 2px solid #e2e8f0;
    }

    .step-emoji {
      font-size: 1.4rem;
      line-height: 1;
    }

    .checkmark {
      width: 26px;
      height: 26px;
      color: #1a7a75;
    }

    /* ---- Labels ---- */
    .step-label {
      margin-top: 0.6rem;
      font-size: 0.75rem;
      font-weight: 500;
      text-align: center;
      max-width: 90px;
      line-height: 1.3;
      transition: color 0.3s ease;
    }

    .label-active {
      color: #0ea5e9;
      font-weight: 600;
    }

    .label-default {
      color: #94a3b8;
    }

    /* ---- Connector ---- */
    .connector {
      flex: 1;
      height: 2px;
      margin: 0 0.75rem;
      margin-bottom: 1.6rem; /* vertically align with circle center */
      background: #e2e8f0;
      border-radius: 9999px;
      overflow: hidden;
      position: relative;
    }

    .connector-fill {
      height: 100%;
      background: linear-gradient(90deg, #d6e5f5 0%, #81F0EA 100%);
      border-radius: 9999px;
      transition: width 0.6s cubic-bezier(0.4, 0, 0.2, 1);
    }

    /* ---- Progress bar ---- */
    .progress-section {
      margin-top: 1.75rem;
      display: flex;
      align-items: center;
      gap: 0.75rem;
      max-width: 640px;
      margin-left: auto;
      margin-right: auto;
    }

    .progress-track {
      flex: 1;
      height: 6px;
      background: #e2e8f0;
      border-radius: 9999px;
      overflow: hidden;
    }

    .progress-fill {
      height: 100%;
      background: linear-gradient(90deg, #d6e5f5 0%, #81d8f0ff 100%);
      border-radius: 9999px;
      transition: width 0.7s cubic-bezier(0.4, 0, 0.2, 1);
    }

    .progress-label {
      font-size: 0.8rem;
      font-weight: 700;
      color: #0ea5e9;
      min-width: 36px;
      text-align: right;
    }
  `]
})
export class StepperComponent {
  @Input() currentStep: number = 1;

  steps: Step[] = [
    { id: 1, name: 'Informations personnelles', icon: '👤' },
    { id: 2, name: 'Informations académiques', icon: '🎓' },
    { id: 3, name: 'Documents requis', icon: '📄' },
  ];

  get progressPercentage(): number {
    return Math.round(((this.currentStep - 1) / (this.steps.length - 1)) * 100);
  }
}