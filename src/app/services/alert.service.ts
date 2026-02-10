import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

export type AlertType = 'success' | 'error' | 'info' | 'warning';

export interface Alert {
    type: AlertType;
    message: string;
    id: number;
}

@Injectable({
    providedIn: 'root'
})
export class AlertService {
    private alertsSubject = new BehaviorSubject<Alert[]>([]);
    public alerts$: Observable<Alert[]> = this.alertsSubject.asObservable();
    private alertId = 0;

    showAlert(message: string, type: AlertType = 'info', duration: number = 5000) {
        const id = this.alertId++;
        const currentAlerts = this.alertsSubject.value;
        this.alertsSubject.next([...currentAlerts, { id, type, message }]);

        if (duration > 0) {
            setTimeout(() => {
                this.removeAlert(id);
            }, duration);
        }
    }

    success(message: string, duration?: number) {
        this.showAlert(message, 'success', duration);
    }

    error(message: string, duration?: number) {
        this.showAlert(message, 'error', duration);
    }

    info(message: string, duration?: number) {
        this.showAlert(message, 'info', duration);
    }

    warning(message: string, duration?: number) {
        this.showAlert(message, 'warning', duration);
    }

    removeAlert(id: number) {
        const currentAlerts = this.alertsSubject.value;
        this.alertsSubject.next(currentAlerts.filter(a => a.id !== id));
    }
}
