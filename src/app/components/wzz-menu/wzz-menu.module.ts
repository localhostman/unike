import { PipesModule } from 'src/app/pipes/pipes.module';
import { RouterModule } from '@angular/router';
import { WzzMenuComponent } from './wzz-menu.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
    imports: [
        CommonModule,
        RouterModule,
        IonicModule,
        RouterModule,
        TranslateModule,
        PipesModule
    ],
    declarations: [WzzMenuComponent],
    exports: [WzzMenuComponent]
})
export class WzzMenuComponentModule { }
