import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { SharedModule } from './shared/shared.module';
import { AuthenticationModule } from './authentication/authentication.module';
import { AuthenticationConfig } from './models/AuthenticationConfig.model';
import { JwtModule } from '@auth0/angular-jwt';
import { TokenStorageService } from './authentication/services/token-storage.service';
import { Configurations } from './models/Configurations.model';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { LoadingInterceptor } from './shared/interceptors/loading.interceptor';
import { TranslateModule } from '@ngx-translate/core';

declare var window: { config: Configurations, authConfigs: AuthenticationConfig };

const config: Configurations = window.config;

const authConfigs: AuthenticationConfig = window.authConfigs;

export const getConfigs = (): Configurations => {
  return {
    phoneNumber: config.phoneNumber,
    emailAddress: config.emailAddress,
    title: config.title,
    footer: config.footer,
  };
};

export const getAuthenticationConfig = (): AuthenticationConfig => {
  return {
    authUrl: authConfigs.authUrl,
    authClient: authConfigs.authClient,
    authSecret: authConfigs.authSecret,
    whiteListDomains: authConfigs.whiteListDomains
  };
}

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    TranslateModule.forRoot(),
    SharedModule,
    JwtModule.forRoot({
      config: {
        tokenGetter: TokenStorageService.getAuthToken,
        allowedDomains: authConfigs.whiteListDomains
      }
    }),
    AuthenticationModule.forRoot(getAuthenticationConfig),
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS, useClass: LoadingInterceptor, multi: true
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}
