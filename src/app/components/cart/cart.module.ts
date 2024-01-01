import { CartComponent } from './cart.component';
import { PipesModule } from '../../pipes/pipes.module';
import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        IonicModule,
        TranslateModule,
        RouterModule,
        PipesModule
    ],
    declarations: [CartComponent],
    exports: [CartComponent]
})
export class CartComponentModule { }
