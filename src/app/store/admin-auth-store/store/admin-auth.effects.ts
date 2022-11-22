import { Injectable } from "@angular/core"
import { Router } from "@angular/router"
import { Actions, createEffect, ofType } from "@ngrx/effects"
import { select, Store } from "@ngrx/store"
import { catchError, distinctUntilChanged, filter, first, fromEvent, map, of, skip, switchMap, tap, timer } from "rxjs"
import { AdminAuthService } from "../services/admin-auth.service"
import { initAdminAuth, login, loginFailed, loginSuccess, logoutSuccess, extractLoginData } from "./admin-auth.actions"
import { AuthData } from "./admin-auth.reducer"
import { isAuth } from "./admin-auth.selectors"

@Injectable()
export class AdminAuthEffects {

  login$ = createEffect(() => this.actions$.pipe(
    ofType(login),
    switchMap(action => this.adminAuthService.login({
      login: action.login,
      password: action.password,
    }).pipe(
      map((authData: AuthData) => loginSuccess({authData})),
      catchError(
        error => (of(loginFailed({
          serverError: error.message,
          })
        ))
      )
    ))
  ))

  refresh$ = createEffect(() => this.actions$.pipe(
    ofType(loginSuccess),
    switchMap((action) => timer(
      action.authData.exp*1000 - 60*1000 - Date.now()
    )),
    switchMap(() => this.store$.pipe(
      select(isAuth),
      first(),
      filter(isAdminAuth => isAdminAuth),
    )),
    switchMap(() => this.adminAuthService.refresh()),
    map(authData => loginSuccess({authData})),
    )
  )

  saveAuthDataToLocalStorage$ = createEffect(() => this.actions$.pipe(
    ofType(loginSuccess),
    tap(({ authData }) => {
      localStorage.setItem('authData', JSON.stringify(authData))
    })
  ), { dispatch: false })

  extractLoginData$ = createEffect(() => this.actions$.pipe(
    ofType(initAdminAuth, extractLoginData),
    map(() => {
      const authDataString = localStorage.getItem('authData')
      if (!authDataString) {
        return logoutSuccess()
      }

      const authData: AuthData = JSON.parse(authDataString)
      if ((authData.exp * 1000 - 10 * 1000 - Date.now()) < 0) {
        return logoutSuccess()
      }

      return loginSuccess({ authData })
    })
  ))

  listenStorageEffect$ = createEffect(() => this.actions$.pipe(
    ofType(initAdminAuth),
    switchMap(() => fromEvent(window, 'storage')),
    map(() => extractLoginData()),
  ))

  listenAuthorizeEffect$ = createEffect(() => this.actions$.pipe(
    ofType(initAdminAuth),
    switchMap(() => this.adminAuthService.isAuth$),
    distinctUntilChanged(),
    skip(1),
    tap(isAuthorized => {
      this.router.navigateByUrl(
        isAuthorized ? '/admin' : '/admin/auth/login'
      )
    })


  ), {dispatch: false})

  constructor(
    private actions$: Actions,
    private adminAuthService: AdminAuthService,
    private store$: Store,
    private router: Router,
  ) { }


}
