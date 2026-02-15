// src/app/pipes/safe.pipe.ts
import { Pipe, PipeTransform } from '@angular/core';
import { DomSanitizer, SafeResourceUrl, SafeUrl } from '@angular/platform-browser';

@Pipe({
    name: 'safe',
    standalone: true
})
export class SafePipe implements PipeTransform {

    constructor(private sanitizer: DomSanitizer) { }

    transform(url: string | null, type: string): SafeResourceUrl | SafeUrl | null {
        if (!url) {
            return null;
        }

        switch (type) {
            case 'resourceUrl':
                return this.sanitizer.bypassSecurityTrustResourceUrl(url);
            case 'url':
                return this.sanitizer.bypassSecurityTrustUrl(url);
            default:
                console.warn(`SafePipe: Type '${type}' non reconnu.`);
                return null;
        }
    }
}