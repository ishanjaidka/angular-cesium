import { Injectable, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { MatSnackBar } from '@angular/material/snack-bar';
import { UserInfo } from '../../models/UserInfo.model';
import { JwtToken } from '../../models/JwtToken.model';
import { AUTH_CONFIG } from '../authentication.const';
import { AuthenticationConfig } from '../../models/AuthenticationConfig.model';
import { handleServerValidation } from '../../shared/validation.const';
import { firstValueFrom } from 'rxjs';
import URI from 'urijs';

@Injectable({
  providedIn: 'root'
})
export class IdentityService {

  constructor(@Inject(HttpClient) private http: HttpClient, @Inject(AUTH_CONFIG) private _config: AuthenticationConfig, private snack: MatSnackBar) {
  }

  async getUserDetails() {
    return await firstValueFrom(this.http.get<UserInfo>(`${this._config.authUrl}/connect/userinfo`));
  }

  async getUserDetails1(): Promise<UserInfo> {
    return this.http.get<any>(`${this._config.authUrl}/connect/userinfo`).toPromise();
  }

  /**
   * Returns if user is authenticated and has opted for 2-factor authentication
   * @param email user email
   * @param password user password
   * @returns user preparation to login
   */
  twoFactorAuthentication(email: string, password: string): Promise<any> {
    const headers = {
      'Content-Type': 'application/x-www-form-urlencoded'
    };
    const body = new URLSearchParams();
    body.set('client_id', this._config.authClient)
    body.set('client_secret', this._config.authSecret)
    body.set('grant_type', 'two_factor');
    body.set('username', email);
    body.set('password', password);
    try {
      return firstValueFrom(this.http.post<any>(`${this._config.authUrl}/v1/Accounts/Prepare`, body.toString(), { headers: headers }));
    } catch (err: any) {
      this.snack.open(handleServerValidation(err.message));
      return err;
    }
  }

  /**
   * Request send for 2-factor enabled user
   * @param email user email
   * @param password user password
   * @param prepareResonse response from getting above endpoint to get code
   * @returns Bearer Token
   */
  twoFactorEnabledlogin(email: string, password: string, prepareResonse: any): Promise<JwtToken> {
    const headers = {
      'Content-Type': 'application/x-www-form-urlencoded'
    };
    const bodyStr = URI('http://tempuri.org')
      .setQuery('client_id', this._config.authClient)
      .setQuery('client_secret', this._config.authSecret)
      .setQuery('grant_type', 'two_factor')
      .setQuery('username', email)
      .setQuery('password', password)
      .setQuery('token', prepareResonse?.token)
      .setQuery('code', prepareResonse?.code)
      .query();

    return firstValueFrom(this.http.post<JwtToken>(`${this._config.authUrl}/connect/token`, bodyStr, { headers: headers }));
  }


  login(email: string, password: string): Promise<JwtToken> {
    const headers = {
      'Content-Type': 'application/x-www-form-urlencoded'
    };

    const bodyStr = URI('http://tempuri.org')
      .setQuery('client_id', this._config.authClient)
      .setQuery('client_secret', this._config.authSecret)
      .setQuery('grant_type', 'password')
      .setQuery('username', email)
      .setQuery('password', password)
      .query();

    return firstValueFrom(this.http.post<JwtToken>(`${this._config.authUrl}/connect/token`, bodyStr, { headers: headers }));
  }

  refreshToken(refreshToken: string): Promise<JwtToken> {
    const headers = {
      'Content-Type': 'application/x-www-form-urlencoded'
    };

    const bodyStr = URI('http://tempuri.org')
      .setQuery('client_id', this._config.authClient)
      .setQuery('client_secret', this._config.authSecret)
      .setQuery('grant_type', 'refresh_token')
      .setQuery('refresh_token', refreshToken)
      .query();

    return firstValueFrom(this.http.post<JwtToken>(`${this._config.authUrl}/connect/token`, bodyStr, { headers: headers }));
  }
}

