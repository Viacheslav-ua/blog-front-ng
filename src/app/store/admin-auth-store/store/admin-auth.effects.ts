import { Injectable } from "@angular/core"
import { Actions, createEffect, ofType } from "@ngrx/effects"
import { select, Store } from "@ngrx/store"
import { catchError, delay, delayWhen, filter, first, map, of, switchMap, timer } from "rxjs"
import { AdminAuthService } from "../services/admin-auth.service"
import { login, loginFailed, loginSuccess } from "./admin-auth.actions"
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
    switchMap(() => this.adminAuthService.refresh().pipe(
      map(loginSuccessData => loginSuccess(loginSuccessData)),
    ))
  ))

  constructor(
    private actions$: Actions,
    private adminAuthService: AdminAuthService,
    private store: Store,
  ) { }


}
