import { Injectable, PLATFORM_ID, Inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { JwtToken } from '../../models/JwtToken.model';

const AuthStorageKey = 'dna.auth';

@Injectable({
  providedIn: 'root'
})
export class TokenStorageService {
  static isBrowser: Object;

  public static retrieveToken(): JwtToken {
    let token;
    if (this.isBrowser) {
      token = JSON.parse(localStorage.getItem(AuthStorageKey) || '{}');
    }
    return token;
  }

  public static getAuthToken() {
    const token = TokenStorageService.retrieveToken();
    return token?.access_token;
  }

  constructor(@Inject(PLATFORM_ID) platformId: Object) {
    TokenStorageService.isBrowser = isPlatformBrowser(platformId);
  }

  storeToken(token: JwtToken) {
    localStorage.setItem(AuthStorageKey, JSON.stringify(token));
  }

  // retrieveToken(): JwtToken {
  //   return TokenStorageService.retrieveToken();
  // }

  clearToken() {
    localStorage.removeItem(AuthStorageKey);
  }

  checkWindow() {
    return typeof window === 'undefined';
  }
}
