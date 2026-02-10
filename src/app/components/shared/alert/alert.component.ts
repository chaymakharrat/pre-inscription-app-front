import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AlertService, Alert } from '../../../services/alert.service';
import { Observable } from 'rxjs';

@Component({
    selector: 'app-alert',
    standalone: true,
    imports: [CommonModule],
    template: `
    <div class="alert-container">
      <div *ngFor="let alert of alerts$ | async" 
           [class]="'alert-item ' + alert.type"
           (click)="removeAlert(alert.id)">
        <div class="alert-icon">
          <i [class]="getIcon(alert.type)"></i>
        </div>
        <div class="alert-content">
          {{ alert.message }}
        </div>
        <button class="close-btn">&times;</button>
      </div>
    </div>
  `,
    styles: [`
    .alert-container {
      position: fixed;
      top: 20px;
      right: 20px;
      z-index: 10000;
      display: flex;
      flex-direction: column;
      gap: 12px;
      max-width: 400px;
    }

    .alert-item {
      display: flex;
      align-items: center;
      padding: 16px;
      border-radius: 12px;
      background: rgba(255, 255, 255, 0.95);
      backdrop-filter: blur(10px);
      box-shadow: 0 8px 32px rgba(0, 0, 0, 0.12);
      border-left: 6px solid #ccc;
      cursor: pointer;
      animation: slideIn 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
      transition: all 0.2s;
    }

    .alert-item:hover {
      transform: translateY(-2px);
      box-shadow: 0 12px 40px rgba(0, 0, 0, 0.15);
    }

    .alert-item.success { border-left-color: #10b981; }
    .alert-item.error { border-left-color: #ef4444; }
    .alert-item.warning { border-left-color: #f59e0b; }
    .alert-item.info { border-left-color: #3b82f6; }

    .alert-icon {
      margin-right: 12px;
      font-size: 1.2rem;
    }

    .success .alert-icon { color: #10b981; }
    .error .alert-icon { color: #ef4444; }
    .warning .alert-icon { color: #f59e0b; }
    .info .alert-icon { color: #3b82f6; }

    .alert-content {
      flex-grow: 1;
      font-weight: 500;
      color: #1f2937;
      font-size: 0.95rem;
    }

    .close-btn {
      background: none;
      border: none;
      font-size: 1.2rem;
      color: #9ca3af;
      margin-left: 12px;
    }

    @keyframes slideIn {
      from { transform: translateX(100%); opacity: 0; }
      to { transform: translateX(0); opacity: 1; }
    }
  `]
})
export class AlertComponent implements OnInit {
    alerts$: Observable<Alert[]>;

    constructor(private alertService: AlertService) {
        this.alerts$ = this.alertService.alerts$;
    }

    ngOnInit(): void { }

    removeAlert(id: number) {
        this.alertService.removeAlert(id);
    }

    getIcon(type: string): string {
        switch (type) {
            case 'success': return 'fas fa-check-circle';
            case 'error': return 'fas fa-exclamation-circle';
            case 'warning': return 'fas fa-exclamation-triangle';
            default: return 'fas fa-info-circle';
        }
    }
}
