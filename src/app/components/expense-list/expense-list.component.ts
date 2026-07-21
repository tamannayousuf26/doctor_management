// @ts-nocheck
import {Component, OnInit, ViewChild} from '@angular/core';
import {MatTableDataSource} from "@angular/material/table";
import {MatPaginator} from "@angular/material/paginator";
import {MatSort} from "@angular/material/sort";
import {Router} from "@angular/router";
import {AlertMessageService} from "../../services/alert-message.service";
import {ExpenseService} from "../../services/expense.service";

enum ExpenseType {
    1 = {
        'type': 'Staff Salary',
        'color': 'badge-success'
    },

    2 = {
        'type': 'Room Rent',
        'color': 'badge-info'
    },
    3 = {
        'type': 'Bonus',
        'color': 'badge-primary'
    },
    4 = {
        'type': 'Other Expense',
        'color': 'badge-accent'
    },
}

export interface ExpenseTableElement {
    id: number;
    employee_id: string;
    type: string;
    voucher_no: string;
    amount: number;
    expense_date: string;
    remarks: string;
}

const ELEMENT_DATA: ExpenseTableElement[] = [];

@Component({
    selector: 'app-expense-list',
    templateUrl: './expense-list.component.html',
    styleUrls: ['./expense-list.component.scss']
})
export class ExpenseListComponent implements OnInit {

    displayedColumns: string[] = ["id", "employee_id", "type", "voucher_no", "amount", "expense_date", "remarks", "actions"];
    dataSource: MatTableDataSource<ExpenseTableElement>;
    itemList: ExpenseTableElement[];

    @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator | any;
    @ViewChild(MatSort, {static: true}) sort: MatSort | any;
    expenseType: any = ExpenseType;

    constructor(private _router: Router,
                private _alertMsg: AlertMessageService,
                private _expenseService: ExpenseService) {
        this.itemList = ELEMENT_DATA;
        this.dataSource = new MatTableDataSource(this.itemList);
    }


    ngOnInit(): void {
        this.getAllExpensesList();
    }

    getAllExpensesList() {
        this._expenseService.getExpenseListRequest().subscribe((resp: any) => {
            this.itemList = [];
            this.itemList = resp;
            this.dataSource = new MatTableDataSource(this.itemList);
            setTimeout(() => {
                this.dataSource.sort = this.sort;
                this.dataSource.paginator = this.paginator
            });
        });
    }

    onChangeExpenseType(e) {
        if (e == 99) {
            this.getAllExpensesList();
            return;
        }
        this._expenseService.getExpenseListByFilteringExpenseType(e).subscribe((resp) => {
            this.itemList = [];
            this.itemList = resp;
            this.dataSource = new MatTableDataSource(this.itemList);
            setTimeout(() => {
                this.dataSource.sort = this.sort;
                this.dataSource.paginator = this.paginator
            });
        });
    }

    editExpense(expenseId: any) {
        this._router.navigate(
            ['expense/create'],
            {queryParams: {expenseId: expenseId}}
        ).then();
    }

    deleteExpense(expenseId: any) {
        this._alertMsg.deleteItemAlert().then((res: any) => {
            if (res) {
                this._expenseService.deleteExpense(expenseId).subscribe((resp: any) => {
                    this.getAllExpensesList();
                    this._alertMsg.successfulSubmissionAlert('Delete Expense Successfully');
                });
            }
        });
    }

    applyFilter(e: any): void {
        const filterValue = e.value;
        this.dataSource.filter = filterValue.trim().toLowerCase();
    }
}
