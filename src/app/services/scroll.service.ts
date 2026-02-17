import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class ScrollService {
    private scrollSubject = new BehaviorSubject<number>(0);
    public scroll$ = this.scrollSubject.asObservable();

    notifyScroll(position: number) {
        this.scrollSubject.next(position);
    }

    get currentScroll(): number {
        return this.scrollSubject.value;
    }
}
