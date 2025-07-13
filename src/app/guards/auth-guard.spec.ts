import { TestBed } from '@angular/core/testing';
import { CanActivateFn, Router } from '@angular/router';

import { AuthGuard } from './auth-guard';
import { AuthService } from '../services/auth'; // Adjust the path if needed

describe('authGuard', () => {
  let authServiceSpy: jasmine.SpyObj<any>;
  let routerSpy: jasmine.SpyObj<any>;
  const executeGuard: CanActivateFn = (route, state) =>
    TestBed.runInInjectionContext(() =>
      new AuthGuard(
        TestBed.inject(AuthService),
        TestBed.inject(Router)
      ).canActivate(route, state)
    );
    

    authServiceSpy = jasmine.createSpyObj('AuthService', ['isAuthenticated']);
    routerSpy = jasmine.createSpyObj('Router', ['navigate']);

    TestBed.configureTestingModule({
      providers: [
        { provide: AuthService, useValue: authServiceSpy },
        { provide: Router, useValue: routerSpy }
      ]
    });
  
  

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });
});
