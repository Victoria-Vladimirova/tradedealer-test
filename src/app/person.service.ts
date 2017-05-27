import {Injectable} from '@angular/core';
import {BehaviorSubject} from 'rxjs/BehaviorSubject';
import {Observable} from "rxjs/Observable";
import 'rxjs/add/operator/map';

import {Person} from './person';
import PERSONS from './mock-persons';

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

    private _persons: BehaviorSubject<Person[]>;

    private _totalCount: BehaviorSubject<number>;

    constructor() {
        this._persons = new BehaviorSubject<Person[]>(this.clone(PERSONS));
        this._totalCount = new BehaviorSubject<number>(PERSONS.length);
    }

    get persons(): Observable<Person[]> {
        return this._persons.asObservable();
    }

    get totalCount(): Observable<number> {
        return this._totalCount.asObservable();
    }

    fetchPersons(sort: Sort, searchString: string, start: number, limit: number): void {
        const result = this.filterPersons(searchString).sort((a, b) => {
            const order: number = sort.order === SortOrder.ASC ? 1 : -1;
            if (a[sort.column] === b[sort.column]) {
                return 0;
            } else if (a[sort.column] > b[sort.column]) {
                return order;
            } else {
                return -order;
            }
        }).slice(start, start + limit);

        this._persons.next(result);
    }

    countPersons(searchString: string): void {
        const result = this.filterPersons(searchString).length;

        this._totalCount.next(result);
    }

    updatePerson(id: number, fieldName: string, fieldValue: string): void {
        PERSONS.filter((person: Person) => person.id === id)
            .forEach(((person: Person) => person[fieldName] = fieldValue));
    }

    private filterPersons(searchString: string): Person[] {
        searchString = searchString ? searchString.toLocaleLowerCase() : searchString;

        return this.clone(PERSONS).filter((item: Person) => {
            return !searchString
                || item.id.toString().indexOf(searchString) !== -1
                || item.firstName.toLocaleLowerCase().indexOf(searchString) !== -1
                || item.lastName.toLocaleLowerCase().indexOf(searchString) !== -1
                || item.email.toLocaleLowerCase().indexOf(searchString) !== -1
                || item.phone.toLocaleLowerCase().indexOf(searchString) !== -1;
        });
    }

    // клонирование списка, чтобы при каждом запросе отдавался новый объект (имитируем получение данных с сервера)
    private clone(persons: Person[]): Person[] {
        return [...persons].map(person => ({...person}));
    }
}
