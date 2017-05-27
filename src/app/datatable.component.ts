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

    constructor(private personService: PersonService) {
        personService.persons.subscribe(persons => this.persons = persons);
        personService.totalCount.subscribe(totalCount => {
            this.totalPages = Math.ceil(totalCount / PAGESIZE);
            if (this.totalPages === 0) {
                this.currPage = -1;
            }
        });
        this.updateData();
    }

    onSort(column: string): void {
        if (this.sort.column !== column) {
            this.sort.column = column;
            this.sort.order = SortOrder.ASC;
        } else {
            this.sort.order = this.sort.order === SortOrder.ASC ? SortOrder.DESC : SortOrder.ASC;
        }

        this.updateData();
    }

    onSearch(): void {
        this.currPage = 0;
        this.updateData();
    }

    onReset(): void {
        this.searchString = null;
        this.currPage = 0;
        this.updateData();
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

    updateData(): void {
        this.personService.fetchPersons(this.sort, this.searchString, this.currPage * PAGESIZE, PAGESIZE);
        this.personService.countPersons(this.searchString);
    }

    setCurrPage(page: number): void {
        this.currPage = page;
        this.updateData();
    }

    onCellChange(data: any): void {
        this.personService.updatePerson(data.id, data.fieldName, data.fieldValue);
        this.updateData();
    }

}
