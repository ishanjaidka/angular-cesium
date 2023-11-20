import { TestBed } from '@angular/core/testing';
import { JwtHelperService } from '@auth0/angular-jwt';
import { IdentityService } from './identity.service';
import { TokenStorageService } from './token-storage.service';
import { TokenService } from './token.service';

const identityService = jasmine.createSpyObj('IdentityService', [''])
const tokenStorageService = jasmine.createSpyObj('TokenStorageService', ['retrieveToken'])
const jwtHelper = jasmine.createSpyObj('JwtHelperService', [''])

describe('TokenService', () => {
  beforeEach(() => TestBed.configureTestingModule({
    providers: [
      { provide: IdentityService, useValue: identityService },
      { provide: TokenStorageService, useValue: tokenStorageService },
      { provide: JwtHelperService, useValue: jwtHelper }
    ]}));

  it('should be created', () => {
    const service: TokenService = TestBed.get(TokenService);
    expect(service).toBeTruthy();
  });
});
