import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {AlertMessageService} from "../../services/alert-message.service";
import {AuthenticationService} from "../../services/authentication.service";
import {ActivatedRoute, Router} from "@angular/router";
import {OrderService} from "../../services/order.service";
import {DateTimeService} from "../../services/date-time.service";
import {ExpenseService} from "../../services/expense.service";

@Component({
    selector: 'app-expense-create',
    templateUrl: './expense-create.component.html',
    styleUrls: ['./expense-create.component.scss']
})
export class ExpenseCreateComponent implements OnInit {

    expenseCreateForm: FormGroup | any;
    employeeList!: [];
    updateExpenseId: any = null;
    expenseTypeList: any = [
        {
            name: "Staff Salary",
            value: 1,
        },
        {
            name: "Room Rent",
            value: 2,
        },
        {
            name: "Bonus",
            value: 3,
        },
        {
            name: "Other Expense",
            value: 4,
        },
    ];

    constructor(public formBuilder: FormBuilder,
                private _alertMsg: AlertMessageService,
                private _authService: AuthenticationService,
                private _activateRoute: ActivatedRoute,
                private _orderService: OrderService,
                private _dateTimeService: DateTimeService,
                private _router: Router, private _expenseService: ExpenseService) {
    }

    ngOnInit(): void {
        this.updatePart();
        this.formInit();
        this.getEmployeeList();
    }

    updatePart() {
        this._activateRoute.queryParams
            .subscribe(params => {
                    this.updateExpenseId = null;
                    this.updateExpenseId = params.expenseId;
                    if (this.updateExpenseId)
                        this.fetchExpenseData(this.updateExpenseId);
                }
            );
    }

    fetchExpenseData(id: any) {
        this._expenseService.getExpenseById(id).subscribe((item: any) => {
            console.log(item);
            this.expenseCreateForm.patchValue(item);
            this.expenseCreateForm.patchValue({
                expense_date: new Date(item.expense_date),
            });
            // this.dataSource = new MatTableDataSource(this.itemList);
        });
    }

    formInit() {
        this.expenseCreateForm = this.formBuilder.group({
            employee_id: ['', [Validators.required]],
            type: ['', [Validators.required]],
            voucher_no: ['', [Validators.required]],
            amount: ['', [Validators.required]],
            expense_date: ['', [Validators.required]],
            remarks: [''],
        });
    }

    getEmployeeList() {
        this._orderService.getEmployeeList().subscribe((resp: any) => {
            this.employeeList = [];
            this.employeeList = resp;
        });
    }

    submit() {
        let formData = this.expenseCreateForm.value;
        formData['expense_date'] = this._dateTimeService.getYearMonthDayFormat(this.expenseCreateForm.value.expense_date);
        if (this.expenseCreateForm.valid) {
            if (this.updateExpenseId) {
                formData['id'] = this.updateExpenseId;
                this.updateExpense(formData);
            } else {
                this.createExpense(formData);
            }
        }
    }

    createExpense(formData: FormData) {
        this._expenseService.expenseCreatePostRequest(formData)
            .subscribe((resp: any) => {
                this._alertMsg.successfulSubmissionAlert('Expense Created Successfully');
                this._router.navigateByUrl('/expense/list').then();
            }, (error: any) => this._authService.httpRequestErrorHandler(error));
    }

    updateExpense(formData: FormData) {
        this._expenseService.expenseUpdatePutRequest(formData)
            .subscribe((resp: any) => {
                this._alertMsg.successfulSubmissionAlert('Expense Updated Successfully');
                this._router.navigateByUrl('/expense/list').then();
            }, (error: any) => this._authService.httpRequestErrorHandler(error));
    }

    cancel() {
        this._router.navigateByUrl('/expense/list').then();
    }

}
