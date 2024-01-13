import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { PageComponent } from './page.component';
import { RouterModule } from '@angular/router';


@NgModule({
  imports: [
    CommonModule,
    IonicModule,
    RouterModule
  ],
  declarations: [PageComponent],
  exports: [PageComponent] 
})
export class PageComponentModule { }
