import { Injectable } from "@angular/core"
import { Actions, createEffect, ofType } from "@ngrx/effects"
import { select, Store } from "@ngrx/store"
import { catchError, delay, delayWhen, filter, first, map, of, switchMap, tap, timer } from "rxjs"
import { AdminAuthService } from "../services/admin-auth.service"
import { initAdminAuth, login, loginFailed, loginSuccess, logoutSuccess } from "./admin-auth.actions"
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
      map(loginSuccessData => loginSuccess(loginSuccessData)),
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
    delayWhen((action: AuthData) => timer(
      action.exp*1000 - 60*1000 - Date.now()
    )),
    switchMap(() => this.store.pipe(
      select(isAuth),
      first(),
      filter(isAdminAuth => isAdminAuth),
    )),
    switchMap(() => this.adminAuthService.refresh()),
    map((loginSuccessData: AuthData) => loginSuccess(loginSuccessData)),
    )
  )

  saveAuthDataToLocalStorage$ = createEffect(() => this.actions$.pipe(
    ofType(loginSuccess),
    tap(loginSuccessData => {
      const { type, ...authData } = loginSuccessData
      localStorage.setItem('authData', JSON.stringify(authData))
    })
  ), { dispatch: false })

  extractLoginData$ = createEffect(() => this.actions$.pipe(
    ofType(initAdminAuth),
    map(() => {
      const authDataString = localStorage.getItem('authData')
      if (!authDataString) {
        return logoutSuccess()
      }

      const authData: AuthData = JSON.parse(authDataString)
      if ((authData.exp * 1000 - 10 * 1000 - Date.now()) < 0) {
        return logoutSuccess()
      }

      return loginSuccess(authData)
    })
  ))

  constructor(
    private actions$: Actions,
    private adminAuthService: AdminAuthService,
    private store: Store,
  ) { }


}
