import { TestBed } from '@angular/core/testing';
import { AUTH_URL, AUTH_CLIENT, AUTH_SECRET } from '../identity.const';
import { IdentityService } from './identity.service';
import { HttpClient } from '@angular/common/http';

const http = jasmine.createSpyObj('HttpClient', [''])

describe('IdentityService', () => {
  beforeEach(() => TestBed.configureTestingModule({
    providers: [
      { provide: AUTH_URL, useValue: '' },
      { provide: AUTH_CLIENT, useValue: '' },
      { provide: AUTH_SECRET, useValue: '' },
      { provide: HttpClient, useValue: http }
    ]}));

  it('should be created', () => {
    const service: IdentityService = TestBed.get(IdentityService);
    expect(service).toBeTruthy();
  });
});
