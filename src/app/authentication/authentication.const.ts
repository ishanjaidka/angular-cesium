import { InjectionToken } from '@angular/core';
import { AuthenticationConfig } from '../models/AuthenticationConfig.model';

export const AUTH_CONFIG = new InjectionToken<AuthenticationConfig>('RDH.AUTHENTICATION.CONFIG');
export const AUTH_URL = new InjectionToken<string>('RDH.AUTH');
export const AUTH_CLIENT = new InjectionToken<string>('RDH.AUTH.URL');
export const AUTH_SECRET = new InjectionToken<string>('RDH.AUTH.SECRET');

export const getAddressFormValidity = (addressFormStatus: string) => {
    if (addressFormStatus === 'INVALID') {
        return true;
    }
    return false;
}
