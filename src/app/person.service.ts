import {Injectable} from '@angular/core';

import {Person} from './person';
import {PERSONS} from './mock-persons';

export enum SortOrder {
    ASC,
    DESC
}

export class Sort {
    constructor(public column: string, public order: SortOrder) {
        this.column = column;
        this.order = order;
    }
}

@Injectable()
export class PersonService {
    private static filterPersons(searchString: string): Person[] {
        searchString = searchString ? searchString.toLocaleLowerCase() : searchString;

        return PERSONS.filter((item: Person) => {
            return !searchString
                || item.id.toString().indexOf(searchString) !== -1
                || item.firstName.toLocaleLowerCase().indexOf(searchString) !== -1
                || item.lastName.toLocaleLowerCase().indexOf(searchString) !== -1
                || item.email.toLocaleLowerCase().indexOf(searchString) !== -1
                || item.phone.toLocaleLowerCase().indexOf(searchString) !== -1;
        });
    }

    static getPersons(sort: Sort, searchString: string, start: number, limit: number): Person[] {
        return PersonService.filterPersons(searchString).sort((a, b) => {
            const order: number = sort.order === SortOrder.ASC ? 1 : -1;
            if (a[sort.column] === b[sort.column]) {
                return 0;
            } else if (a[sort.column] > b[sort.column]) {
                return order;
            } else {
                return -order;
            }
        }).slice(start, start + limit);
    }

    static countPersons(searchString: string): number {
        return PersonService.filterPersons(searchString).length
    }

    static updatePerson(id: number, fieldName: string, fieldValue: string): void {
        PERSONS.filter(person => person.id === id).forEach(person => person[fieldName] = fieldValue);
    }
}
