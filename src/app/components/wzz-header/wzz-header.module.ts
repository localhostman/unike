import { PipesModule } from 'src/app/pipes/pipes.module';
import { RouterModule } from '@angular/router';
import { WzzHeaderComponent } from './wzz-header.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        RouterModule,
        IonicModule,
        TranslateModule,        
        PipesModule
    ],
    declarations: [WzzHeaderComponent],
    exports: [WzzHeaderComponent]
})
export class WzzHeaderComponentModule { }
