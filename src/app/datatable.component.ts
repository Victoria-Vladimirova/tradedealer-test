import {Component} from '@angular/core';

import {PersonService, Sort, SortOrder} from './person.service';
import {Person} from "./person";

const PAGESIZE = 10;

@Component({
    selector: 'my-app',
    providers: [PersonService],
    templateUrl: 'app/datatable.html',
    styleUrls: ['app/datatable.component.css']
})
export class DataTableComponent {

    persons: Person[] = [];

    sort = new Sort('id', SortOrder.ASC);

    searchString: string = null;

    totalPages: number = 0;

    currPage: number = 0;

    editedField: any = {
        id: null,
        fieldName: null,
        fieldValue: null
    };

    constructor() {
        this.updatePersons();
    }

    onSort(column: string): void {
        if (this.sort.column !== column) {
            this.sort.column = column;
            this.sort.order = SortOrder.ASC;
        } else {
            this.sort.order = this.sort.order === SortOrder.ASC ? SortOrder.DESC : SortOrder.ASC;
        }

        this.updatePersons();
    }

    onSearch(): void {
        this.currPage = 0;
        this.updatePersons();
    }

    onReset(): void {
        this.searchString = null;
        this.currPage = 0;
        this.updatePersons();
    }

    onEditedKeyDown(event: KeyboardEvent): void {
        const cell: HTMLElement = <HTMLElement> event.target;
        if (event.keyCode === 13) {
            event.preventDefault();
            PersonService.updatePerson(this.editedField.id, this.editedField.fieldName, cell.innerText);
            this.editedField = {};
            cell.blur();
        } else if (event.keyCode === 27) {
            event.preventDefault();
            cell.blur();
        }
    }

    onExitCell(event: Event): void {
        const cell: HTMLElement = <HTMLElement> event.target;
        if (this.editedField.id) {
            cell.innerText = this.editedField.fieldValue;
            this.editedField = {};
        }
    }

    sortSignClass(column: string): string {
        if (this.sort.column === column) {
            if (this.sort.order === SortOrder.ASC) {
                return 'sort-asc';
            } else {
                return 'sort-desc';
            }
        } else {
            return 'sort';
        }
    }

    updatePersons(): void {
        this.persons = PersonService.getPersons(this.sort, this.searchString, this.currPage * PAGESIZE, PAGESIZE);
        this.totalPages = Math.ceil(PersonService.countPersons(this.searchString) / PAGESIZE);
        if (this.totalPages === 0) {
            this.currPage = -1;
        }
    }

    setCurrPage(page: number): void {
        this.currPage = page;
        this.updatePersons();
    }

    setEditedField(id: number, fieldName: string, fieldValue: string): void {
        this.editedField = {id, fieldName, fieldValue};
    }
}
