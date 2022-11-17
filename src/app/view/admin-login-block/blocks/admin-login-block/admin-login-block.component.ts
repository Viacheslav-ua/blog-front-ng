import { Component, OnInit } from '@angular/core'
import { Store, select } from '@ngrx/store'
import { Observable } from 'rxjs'
import { login } from 'src/app/store/admin-auth-store/store/admin-auth.actions'
import {
  getLoaded,
  getLoading,
  getServerError,
} from 'src/app/store/admin-auth-store/store/admin-auth.selectors'

@Component({
  selector: 'app-admin-login-block',
  templateUrl: './admin-login-block.component.html',
  styleUrls: ['./admin-login-block.component.scss'],
})
export class AdminLoginBlockComponent implements OnInit {

  loading$: Observable<boolean> = this.store$.pipe(select(getLoading))
  loaded$: Observable<boolean> = this.store$.pipe(select(getLoaded))
  serverError$: Observable<string> = this.store$.pipe(select(getServerError))

  constructor(private store$: Store) { }



  ngOnInit(): void {
  }

  onLogin(loginPayload: {login: string, password: string}) {
    this.store$.dispatch(login(loginPayload))
  }

}
