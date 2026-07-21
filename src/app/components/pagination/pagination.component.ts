import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';

@Component({
    selector: 'app-pagination',
    templateUrl: './pagination.component.html',
    styleUrls: ['./pagination.component.scss']
})
export class PaginationComponent implements OnInit {

    @Input() first: number = 1;
    @Input() last: number = 1;
    @Input() current: number = 1;

    @Output() nextBtn = new EventEmitter();
    @Output() prevBtn = new EventEmitter();
    @Output() numberBtn = new EventEmitter<number>();

    constructor() {
    }

    ngOnInit(): void {
    }

    getPageNumbers(): number[] {
        const pages: number[] = [];
        const totalPages = this.last;
        const currentPage = this.current;

        // Calculate range around current page
        let start = Math.max(this.first, currentPage - 2);
        let end = Math.min(totalPages, currentPage + 2);

        // Adjust if we're near the beginning
        if (currentPage <= 3) {
            start = this.first;
            end = Math.min(totalPages, 5);
        }

        // Adjust if we're near the end
        if (currentPage >= totalPages - 2) {
            start = Math.max(this.first, totalPages - 4);
            end = totalPages;
        }

        for (let i = start; i <= end; i++) {
            pages.push(i);
        }

        return pages;
    }

    nextBtnClick() {
        this.nextBtn.emit();
    }

    prevBtnClick() {
        this.prevBtn.emit();
    }

    numberBtnClick(val: number) {
        this.numberBtn.emit(val);
    }
}
