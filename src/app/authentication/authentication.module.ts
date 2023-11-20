import { APP_INITIALIZER, ModuleWithProviders, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { AuthService } from './services/auth.service';
import { TokenStorageService } from './services/token-storage.service';
import { AuthenticationConfig } from '../models/AuthenticationConfig.model';
import { SharedModule } from '../shared/shared.module';
import { JwtInterceptor } from '@auth0/angular-jwt';
import { AuthenticationInterceptor } from './authentication.interceptor';
import { IdentityService } from './services/identity.service';
import { MAT_DATE_LOCALE } from '@angular/material/core';
import { LocaleDate } from '../shared/consts/web.const';
import { AUTH_CONFIG } from './authentication.const';
import { MaterialModule } from '../shared/material.module';
import { MatButtonModule } from '@angular/material/button';
import { LoadingInterceptor } from '../shared/interceptors/loading.interceptor';

export const initialiseAuth = (authService: AuthService) => {
  return () => authService.initialise();
}

export const jwtOptionsFactory = (tokenStorageService: TokenStorageService, authenticationConfig: AuthenticationConfig) => {
  return {
    tokenGetter: () => TokenStorageService.getAuthToken(),
    allowedDomains: authenticationConfig.whiteListDomains
  }
}

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    HttpClientModule,
    SharedModule,
    MaterialModule,
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: JwtInterceptor,
      multi: true
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthenticationInterceptor,
      multi: true
    },
    TokenStorageService,
    IdentityService,
    AuthService,
    { provide: MAT_DATE_LOCALE, useValue: LocaleDate },
  ]
})
export class AuthenticationModule {
  public static forRoot(config: () => AuthenticationConfig): ModuleWithProviders<AuthenticationModule> {
    // Currently the token is in local storage, ideally be in encrypted cookie :) !
    return {
      ngModule: AuthenticationModule,
      providers: [
        {
          provide: AUTH_CONFIG,
          useFactory: config
        },
        {
          provide: APP_INITIALIZER,
          useFactory: initialiseAuth,
          deps: [AuthService],
          multi: true
        }
      ]
    }
  }
}
