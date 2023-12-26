import { PipesModule } from 'src/app/pipes/pipes.module';
import { RouterModule } from '@angular/router';
import { WzzFooterComponent } from './wzz-footer.component';
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
        RouterModule,
        TranslateModule,
        PipesModule
    ],
    declarations: [WzzFooterComponent],
    exports: [WzzFooterComponent]
})
export class WzzFooterComponentModule { }
