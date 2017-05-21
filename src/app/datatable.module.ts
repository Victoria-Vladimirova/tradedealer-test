import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {FormsModule} from "@angular/forms";

import {DataTableComponent}  from './datatable.component';

@NgModule({
    imports: [BrowserModule, FormsModule],
    declarations: [DataTableComponent],
    bootstrap: [DataTableComponent]
})
export class DataTableModule {
}
