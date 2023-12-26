import { WzzSubheaderComponent } from './wzz-subheader.component';
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
        TranslateModule
    ],
    declarations: [WzzSubheaderComponent],
    exports: [WzzSubheaderComponent]
})
export class WzzSubheaderComponentModule { }
