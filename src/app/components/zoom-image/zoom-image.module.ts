import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { ZoomImageComponent } from './zoom-image.component';

@NgModule({
    declarations: [
        ZoomImageComponent
    ],
    imports: [
        CommonModule,
        RouterModule,
        IonicModule,
    ],
    exports: [
        ZoomImageComponent
    ]
})
export class ZoomImageComponentModule { }
