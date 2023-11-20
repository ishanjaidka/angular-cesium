import { Injectable } from '@angular/core';
import { JwtHelperService } from '@auth0/angular-jwt';
import { Subscription, timer } from 'rxjs';
import { IdentityService } from './identity.service';
import { TokenStorageService } from './token-storage.service';
import { JwtToken } from '../../models/JwtToken.model';
import moment from 'moment';

@Injectable({
  providedIn: 'root'
})
export class TokenService {
  private refreshTimer!: Subscription;
  private refreshPromise!: Promise<boolean>;

  constructor(private _is: IdentityService, private _tss: TokenStorageService, private _jwtHelper: JwtHelperService) { }

  async hasAuthToken(): Promise<boolean> {
    let token = TokenStorageService.retrieveToken();

    if (!token) return false;
    try {
      if (this._jwtHelper.isTokenExpired(token.access_token, 15)) {
        token = await this._is.refreshToken(token.refresh_token);
        this._tss.storeToken(token);
      }
      this.setupRefreshTimer(token);

      return true;
    } catch (e) {
      console.error('Failed to refresh expired token.', e);
      return false;
    }
  }

  async persistToken(token: JwtToken) {
    this._tss.storeToken(token);
    this.setupRefreshTimer(token);
  }

  private setupRefreshTimer(token: JwtToken) {
    if (this.refreshTimer) {
      this.refreshTimer.unsubscribe();
    }
    const expiry = this._jwtHelper.getTokenExpirationDate(token.access_token);

    // refresh token 15 seconds before it expires to ensure user isn't impacted.
    const modifiedExpiry = moment(expiry).subtract(15, 's').toDate();
    this.refreshTimer = timer(modifiedExpiry).subscribe(x => this.refreshToken());
  }

  async refreshToken(): Promise<boolean> {
    if (this.refreshPromise) {
      return await this.refreshPromise;
    }

    const token = TokenStorageService.retrieveToken();

    if (!token) return false;

    this.refreshPromise = this.tryRefreshToken(token);

    const response = await this.refreshPromise;

    return response;
  }

  private async tryRefreshToken(token: JwtToken): Promise<boolean> {
    try {
      token = await this._is.refreshToken(token.refresh_token);
      this._tss.storeToken(token);
      this.setupRefreshTimer(token);
      return true
    } catch (e) {
      // Maybe it was refreshed in another process/browser window, if the token has changed maybe we have "refreshed" it.
      const currentToken = TokenStorageService.retrieveToken();

      if (currentToken && token.access_token !== currentToken.access_token) {
        return !this._jwtHelper.isTokenExpired(currentToken.access_token, 15);
      }

      console.error('Failed to refresh token, clearing out token', e);
      this._tss.clearToken();
      return false;
    }
  }

  terminateToken() {
    this._tss.clearToken();
    this.refreshTimer?.unsubscribe();
  }
}
