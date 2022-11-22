import { createReducer, on } from "@ngrx/store"
import { login, loginFailed, loginSuccess, logoutSuccess } from "./admin-auth.actions"

export const ADMIN_AUTH_FEATURE_NAME = 'admin-auth'

export interface AuthData {
  accessToken: string
  id: number
  iat: number
  exp: number
}

export interface AdminAuthState {
  loading: boolean
  loaded: boolean
  loadAuthData: boolean
  serverError: string
  authData?: AuthData | null
}

const initialState: AdminAuthState = {
  loading: false,
  loaded: true,
  loadAuthData: false,
  serverError: '',
}

export const adminAuthReducer = createReducer(
  initialState,
  on(login, state => ({
    ...state,
    loading: true,
  })),
  on(loginSuccess, (state, { authData }) => ({
    ...state,
    authData,
    loaded: true,
    loading: false,
    loadAuthData: true,
    serverError: '',
  })),
  on(loginFailed, (state, { serverError }) => ({
    ...state,
    authData: null,
    loadAuthData: true,
    loaded: true,
    loading: false,
    serverError,
  })),
  on(logoutSuccess, () => ({
    ...initialState,
    authData: null,
    loadAuthData: true,
  }))
)
