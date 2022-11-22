import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, CanLoad, Route, Router, RouterStateSnapshot, UrlSegment, UrlTree } from '@angular/router';
import { first, map, Observable, of } from 'rxjs';
import { AdminAuthService } from 'src/app/store/admin-auth-store/services/admin-auth.service';
import { isAuth } from 'src/app/store/admin-auth-store/store/admin-auth.selectors';

@Injectable()
export class AdminAuthGuard implements CanActivate, CanLoad {
  constructor(
    private router: Router,
    private adminAuthService: AdminAuthService,
  ) { }

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    return this.getIsAuth()
  }
  canLoad(
    route: Route,
    segments: UrlSegment[]): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    return this.getIsAuth()
  }

  private getIsAuth(): Observable<boolean> {
    return this.adminAuthService.isAuth$.pipe(
      map(isAuth => {
        console.log('isAuth', isAuth);
        return isAuth
      }),
      first(),
      map(isAuth => {
        if (!isAuth) {
          this.router.navigateByUrl('admin/auth/login')
        }
        return isAuth
      }),

    )
  }
}
