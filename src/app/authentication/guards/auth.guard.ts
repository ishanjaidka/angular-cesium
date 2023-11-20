import { ActivatedRouteSnapshot, CanActivateChildFn, CanActivateFn, Router, RouterStateSnapshot } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { inject } from '@angular/core';

export const authGuard: CanActivateFn = async (route, state) => {
  const _authService = inject(AuthService);
  const router = inject(Router);

  const user = await _authService.getUser();

  if (user != null) {
    return true;
  } else {
    router.navigate(['/auth/login'], { queryParams: { redirectTo: state.url } });
    return false;
  }
};

export const canActivateChild: CanActivateChildFn = (route: ActivatedRouteSnapshot, state: RouterStateSnapshot) => authGuard(route, state);
