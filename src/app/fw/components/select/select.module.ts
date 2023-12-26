import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { TranslateModule } from '@ngx-translate/core';
import { SelectModalPage } from './select-modal.page';
import { SelectComponent } from './select.component';
import { SelectOptionComponent } from './select-option.component';
import { SearchComponent } from './search.component';
import { FormsModule } from '@angular/forms';
import { ScrollingModule } from '@angular/cdk/scrolling';

@NgModule({
    declarations: [
        SelectModalPage,
        SearchComponent,
        SelectComponent,
        SelectOptionComponent
    ],
    imports: [
        FormsModule,
        CommonModule,
        IonicModule,
        TranslateModule,
        ScrollingModule
    ],
    exports: [
        SelectModalPage,
        SearchComponent,
        SelectComponent,
        SelectOptionComponent
    ]
})
export class SelectComponentModule { }
