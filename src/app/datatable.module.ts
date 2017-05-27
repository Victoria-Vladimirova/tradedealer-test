import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {FormsModule} from "@angular/forms";

import {DataTableComponent}  from './datatable.component';
import {ContenteditableModel} from "./ContenteditableModel";

@NgModule({
    imports: [BrowserModule, FormsModule],
    declarations: [DataTableComponent, ContenteditableModel],
    bootstrap: [DataTableComponent]
})
export class DataTableModule {}
