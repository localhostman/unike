import { PipesModule } from './../../pipes/pipes.module';
import { RouterModule } from '@angular/router';
import { ProductComponent } from './product.component';
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
    declarations: [ProductComponent],
    exports: [ProductComponent]
})
export class ProductComponentModule { }
