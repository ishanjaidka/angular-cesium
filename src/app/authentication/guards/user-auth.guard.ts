import { inject } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivateChildFn, CanActivateFn, Router, RouterStateSnapshot } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { take } from 'rxjs';

export const userAuthGuard: CanActivateFn = async (route, state) => {
  const _authService = inject(AuthService);
  const router = inject(Router);

  const user = await _authService.getUser();

  if (!user) {
    return true;
  } else {
    return router.createUrlTree(['/dashboard']);
  }
};

export const canActivateChild: CanActivateChildFn = (route: ActivatedRouteSnapshot, state: RouterStateSnapshot) => userAuthGuard(route, state);
