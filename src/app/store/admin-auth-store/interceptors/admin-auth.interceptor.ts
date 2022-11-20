import { Injectable } from '@angular/core'
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpErrorResponse
} from '@angular/common/http'
import { catchError, EMPTY, first, mergeMap, Observable, of } from 'rxjs'
import { select, Store } from '@ngrx/store'
import { getAccessToken } from '../store/admin-auth.selectors'
import { loginFailed } from '../store/admin-auth.actions'

@Injectable()
export class AdminAuthInterceptor implements HttpInterceptor {

  constructor(
    private store$: Store,
  ) { }

  intercept(
    request: HttpRequest<unknown>,
    next: HttpHandler,
  ): Observable<HttpEvent<unknown>> {

    return this.store$.pipe(
      select(getAccessToken),
      first(),
      mergeMap(token => {
        const authReq = token
          ? request.clone({
              setHeaders: {
                Authorization: `Bearer ${token}`
              }
            })
          : request

        return next.handle(authReq).pipe(
          catchError((err) => {
            if (err instanceof HttpErrorResponse) {
              if (err.status === 401 ) {
                console.log('Redirect on Login Page or sign out')
                return EMPTY

              }
            }
            throw err
          })
        )
      })
    )
  }
}
