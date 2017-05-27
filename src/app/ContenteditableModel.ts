import {Directive, ElementRef, Input, Output, EventEmitter, SimpleChanges} from "@angular/core";
import {OnChanges} from "@angular/core";

@Directive({
    selector: '[contenteditableModel]',
    host: {
        '(blur)': 'onBlur()',
        '(keydown)': 'onKeyDown($event)',
        '(click)': 'onClick($event)'
    }
})
export class ContenteditableModel implements OnChanges {
    @Input('contenteditableModel') model: any;
    @Input('data-id') dataId: string;
    @Input('data-field-name') dataFieldName: string;
    @Output('contenteditableModelChange') update = new EventEmitter();

    private oldValue: string;

    constructor(private elRef: ElementRef) {
    }

    ngOnChanges(changes: SimpleChanges) {
        if (changes.model) {
            this.elRef.nativeElement.textContent = this.model;
        }
    }

    onBlur() {
        const cell: HTMLElement = this.elRef.nativeElement;
        if (this.oldValue) {
            cell.textContent = this.oldValue;
            this.update.emit({id: this.dataId, fieldName: this.dataFieldName, fieldValue: this.oldValue});
            this.oldValue = null;
        }
    }

    onClick(event: MouseEvent) {
        this.oldValue = this.elRef.nativeElement.textContent;
    }

    onKeyDown(event: KeyboardEvent): void {
        const cell: HTMLElement = this.elRef.nativeElement;
        const value = cell.textContent;
        if (event.keyCode === 13) {
            event.preventDefault();
            this.update.emit({id: this.dataId, fieldName: this.dataFieldName, fieldValue: value});
            this.oldValue = null;
            cell.blur();
        } else if (event.keyCode === 27) {
            event.preventDefault();
            cell.blur();
        }
    }

}
