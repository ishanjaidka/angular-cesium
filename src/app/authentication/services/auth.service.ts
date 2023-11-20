import { Injectable } from '@angular/core';
import { JwtHelperService } from '@auth0/angular-jwt';
import { Observable, ReplaySubject, firstValueFrom } from 'rxjs';
import { map, take } from 'rxjs/operators';
import { ActivatedRoute, Router } from "@angular/router";
import { TokenService } from './token.service';
import { IdentityService } from './identity.service';
import { CurrentUser } from '../../models/CurrentUser.mode';
import { UserInfo } from '../../models/UserInfo.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private userSubject: ReplaySubject<CurrentUser | null> = new ReplaySubject<CurrentUser | null>(1);

  constructor(private _ts: TokenService, private _is: IdentityService, private _router: Router, private _route: ActivatedRoute,
    private _jwtHelper: JwtHelperService) {
  }

  async initialise() {
    const hasAuthToken = await this._ts.hasAuthToken();
    if (!hasAuthToken) {
      this.userSubject.next(null);
      return;
    }
    try {
      // const user = this.mapUserInfo(await this._is.getUserDetails());
      const user = await this.getCurrentUser('');
      this.userSubject.next(user);

    } catch (e) {
      console.error('Failed to retrieve user details.', e);
      this.userSubject.next(null);
    }
  }

  watchUser(): Observable<CurrentUser | null> {
    return this.userSubject;
  }

  setUser(user: CurrentUser | null) {
    this.userSubject.next(user);
  }

  getUserReplaySubject(): ReplaySubject<CurrentUser | null> {
    return this.userSubject;
  }

  getUser() {
    // is this the best way to do this?
    return firstValueFrom(this.userSubject.pipe(take(1)));
  }

  /**
   * Request to check if user has enabled 2-factor authentication
   * @param email user email
   * @param password user password
   * @returns promise
   */
  async twoFactorLogin(email: string, password: string) {
    return await this._is.twoFactorAuthentication(email, password);
  }

  async login2FactorEnabledUser(email: string, password: string, prepareResponse: any) {
    const response = await this._is.twoFactorEnabledlogin(email, password, prepareResponse);
    this._ts.persistToken(response);
    const user = this.mapUserInfo(this._jwtHelper.decodeToken(response.access_token) as UserInfo);
    this.userSubject.next(user);
  }

  async login(email: string, password: string) {
    // const res = await this._is.login(email, password);
    const res = {
      access_token: `eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiYWRtaW4iOnRydWUsImlhdCI6MTUxNjIzOTAyMn0.NHVaYe26MbtOYhSKkoKYdFVomg4i8ZJd8_-RU8VNbftc4TSMb4bXP3l3YlNWACwyXPGffz5aXHc6lty1Y2t4SWRqGteragsVdZufDn5BlnJl9pdR_kdVFUsra2rWKEofkZeIC4yWytE58sMIihvo9H1ScmmVwBcQP6XETqYd0aSHp1gOa9RdUPDvoXQ5oqygTqVtxaDr6wUFKrKItgBMzWIdNZ6y7O9E0DhEPTbE9rfBo6KTFsHAZnMg4k68CDp2woYIaXbmYTWcvbzIuHO7_37GT79XdIwkm95QJ7hYC9RiwrV7mesbY4PAahERJawntho0my942XheVLmGwLMBkQ`,
      expires_in: 1626239022,
      token_type: '',
      refresh_token: '',
    }
    // .then((res) => {
    // this._ts.persistToken(res);
    const user = await this.getCurrentUser(res.access_token);
    console.log('user', user);
    const redirectTo = this._route.snapshot.queryParams['redirectTo'];
    console.log('redirectTo', redirectTo);
    redirectTo ? this._router.navigateByUrl(redirectTo) : this._router.navigate(['/dashboard']);
    this.userSubject.next(user);
  }

  async pushAuthToken(authToken: any): Promise<CurrentUser> {
    this._ts.persistToken({ ...authToken });

    // const user = this.mapUserInfo(this._jwtHelper.decodeToken(authToken.access_token) as UserInfo);
    const user = await this.getCurrentUser(authToken.access_token);
    this.userSubject.next(user);
    return user;
  }

  async refreshToken(): Promise<boolean> {
    const hasRefreshed = this._ts.refreshToken();

    if (!hasRefreshed) return false;

    try {
      // const user = this.mapUserInfo(await this._is.getUserDetails());
      const user = await this.getCurrentUser('');
      this.userSubject.next(user);
      return true;
    } catch (e) {
      console.error('Failed to retrieve user details.', e);
      return false;
    }
  }

  logout() {
    this._ts.terminateToken();
    localStorage.removeItem('dna.auth');
  }


  private async getCurrentUser(access_token: string): Promise<CurrentUser> {
    try {
      let user: CurrentUser;
      if (access_token) {
        const demoUser = {
          id: '2',
          email_confirmed: true,
          email: 'ishan@gmail.com',
          given_name: 'ishan',
          family_name: 'jaidka',
          phone_number: '0426663926',
          two_factor_enabled: 'false',
          pending_phone_number: 'false',
          picture: '',
          role: 'Developer'
        }
        // user = this.mapUserInfo(this._jwtHelper.decodeToken(access_token) as UserInfo);
        user = this.mapUserInfo(demoUser as UserInfo);
      } else {
        user = this.mapUserInfo(await this._is.getUserDetails());
      }
      return {
        ...user
      };
    } catch (e) {
      console.error('Failed to retrieve user details.', e);
      this._ts.terminateToken();
      throw e;
    }
  }


  mapUserInfo(userInfo: UserInfo): CurrentUser {
    const user = {
      userId: userInfo.id,
      email: userInfo.email,
      firstName: userInfo.given_name,
      lastName: userInfo.family_name,
      imageUrl: userInfo.picture,
      phoneNumber: userInfo.phone_number,
      twoFactorEnabled: userInfo.two_factor_enabled,
      roles: Array.isArray(userInfo.role) ? userInfo.role : [userInfo.role],
      isEmailVerified: userInfo.email_confirmed.toString() === 'false' ? false : true
    };
    return user;
  }
}
