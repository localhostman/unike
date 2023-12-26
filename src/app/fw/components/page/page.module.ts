import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { PageComponent } from './page.component';


@NgModule({
  imports: [
    CommonModule,
    IonicModule
  ],
  declarations: [PageComponent],
  exports: [PageComponent] 
})
export class PageComponentModule { }
