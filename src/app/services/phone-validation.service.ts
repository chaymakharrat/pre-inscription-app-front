import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { parsePhoneNumberFromString } from 'libphonenumber-js/max';

export interface PhoneValidationResponse {
    carrier: string;
    country: string;
    components: {
        area_code: string | null;
        country_code: number;
        extension: string | null;
        local_number: string;
    };
    formats: {
        e164: string;
        international: string;
        national: string;
    };
    geo_name: string | null;
    is_possible: boolean;
    is_valid: boolean;
    possible_types: string[];
    sanitized: string;
    timezone: string;
    type: string;
}

@Injectable({
    providedIn: 'root'
})
export class PhoneValidationService {
    private apiUrl = 'https://libphonenumberapi.com/api/phone-numbers';

    constructor() { }

    validatePhoneNumber(phoneNumber: string): Observable<PhoneValidationResponse> {
        try {
            // For international formats, ensure it starts with '+'
            const formattedNumber = phoneNumber.startsWith('+') ? phoneNumber : `+${phoneNumber}`;
            const phoneNumberObj = parsePhoneNumberFromString(formattedNumber);

            const isValid = phoneNumberObj ? phoneNumberObj.isValid() : false;
            const isPossible = phoneNumberObj ? phoneNumberObj.isPossible() : false;

            const mockResponse: PhoneValidationResponse = {
                carrier: 'Unknown', // Carrier detection requires additional metadata not in default bundle
                country: phoneNumberObj?.country || '',
                components: {
                    area_code: null,
                    country_code: phoneNumberObj?.countryCallingCode ? parseInt(phoneNumberObj.countryCallingCode.toString()) : 0,
                    extension: phoneNumberObj?.ext || null,
                    local_number: phoneNumberObj?.formatNational() || ''
                },
                formats: {
                    e164: phoneNumberObj?.format('E.164') || formattedNumber,
                    international: phoneNumberObj?.formatInternational() || formattedNumber,
                    national: phoneNumberObj?.formatNational() || formattedNumber
                },
                geo_name: null,
                is_possible: isPossible,
                is_valid: isValid,
                possible_types: [], // Library doesn't easily expose this list in one go
                sanitized: phoneNumber.replace(/\D/g, ''),
                timezone: '',
                type: phoneNumberObj?.getType() || 'unknown'
            };

            return of(mockResponse);
        } catch (error) {
            console.error('Local phone validation error:', error);
            return of({
                is_valid: false,
                is_possible: false
            } as any);
        }
    }
}
