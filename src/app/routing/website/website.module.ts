import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { RouterModule } from '@angular/router'
import { AdminGuestGuard } from './guards/admin-guest.guard'
import { AdminAuthGuard } from './guards/admin-auth.guard'
import { StoreModule } from '@ngrx/store'
import { DEFAULT_ROUTER_FEATURENAME, routerReducer } from '@ngrx/router-store'
//  Lazy load pages diagram:
//  https://lucid.app/lucidchart/f96c8c3c-699b-46d8-8547-e18e11688ef2/edit?viewport_loc=-43%2C-304%2C1899%2C1049%2C0_0&invitationId=inv_7fdd3d2b-d0b7-44f9-a636-e7ca3cfd7b8b

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    StoreModule.forFeature(DEFAULT_ROUTER_FEATURENAME, routerReducer),
    RouterModule.forChild([
      {
        path: '',
        pathMatch: 'full',
        loadChildren: () => import('./routing/home/home.module')
        .then(module => module.HomeModule),
      },
      {
        path: 'admin/auth',
        loadChildren: () => import('./routing/admin-auth/admin-auth.module')
          .then(module => module.AdminAuthModule),
        canLoad: [AdminGuestGuard],
        canActivate: [AdminGuestGuard],
      },
      {
        path: 'admin',
        loadChildren: () => import('./routing/admin/admin.module')
          .then(module => module.AdminModule),
        canLoad: [AdminAuthGuard],
        canActivate: [AdminAuthGuard],
      },
      {
        path: '**',
        loadChildren: () => import('./routing/not-found/not-found.module')
        .then(module => module.NotFoundModule),
      },
    ])
  ],
  providers: [
    AdminGuestGuard,
    AdminAuthGuard,
  ],
})
export class WebsiteModule { }
