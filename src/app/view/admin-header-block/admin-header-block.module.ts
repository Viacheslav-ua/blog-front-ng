import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { MatToolbarModule } from '@angular/material/toolbar'
import { MatIconModule } from '@angular/material/icon'
import { MatButtonModule } from '@angular/material/button'
import { AdminHeaderBlockComponent } from './blocks/admin-header-block/admin-header-block.component'



@NgModule({
  declarations: [
    AdminHeaderBlockComponent,
  ],
  imports: [
    CommonModule,
    MatToolbarModule,
    MatIconModule,
    MatButtonModule,
  ],
  exports: [
    AdminHeaderBlockComponent,
  ]
})
export class AdminHeaderBlockModule { }
