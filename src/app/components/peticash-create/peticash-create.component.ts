import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {AlertMessageService} from "../../services/alert-message.service";
import {AuthenticationService} from "../../services/authentication.service";
import {ActivatedRoute, Router} from "@angular/router";
import {OrderService} from "../../services/order.service";
import {DateTimeService} from "../../services/date-time.service";
import {PeticashService} from "../../services/peticash.service";

@Component({
    selector: 'app-peticash-create',
    templateUrl: './peticash-create.component.html',
    styleUrls: ['./peticash-create.component.scss']
})
export class PeticashCreateComponent implements OnInit {

    peticashCreateForm: FormGroup | any;
    employeeList!: [];
    updatePeticashId: any = null;
    peticashStatusList: any = [
        {
            name: "Unpaid",
            value: 0,
        },
        {
            name: "Paid",
            value: 1,
        },
    ];

    constructor(public formBuilder: FormBuilder,
                private _alertMsg: AlertMessageService,
                private _authService: AuthenticationService,
                private _activateRoute: ActivatedRoute,
                private _orderService: OrderService,
                private _dateTimeService: DateTimeService,
                private _router: Router, private _peticashService: PeticashService) {
    }

    ngOnInit(): void {
        this.updatePart();
        this.formInit();
        this.getEmployeeList();
    }

    updatePart() {
        this._activateRoute.queryParams
            .subscribe(params => {
                    this.updatePeticashId = null;
                    this.updatePeticashId = params.peticashId;
                    if (this.updatePeticashId)
                        this.fetchPeticashData(this.updatePeticashId);
                }
            );
    }

    fetchPeticashData(id: any) {
        this._peticashService.getPeticashById(id).subscribe((item: any) => {
            console.log(item);
            this.peticashCreateForm.patchValue(item);
            this.peticashCreateForm.patchValue({
                payment_date: new Date(item.payment_date),
            });
            // this.dataSource = new MatTableDataSource(this.itemList);
        });
    }

    formInit() {
        this.peticashCreateForm = this.formBuilder.group({
            employee_id: ['', [Validators.required]],
            status: ['', [Validators.required]],
            voucher_no: ['', [Validators.required]],
            amount: ['', [Validators.required]],
            payment_date: ['', [Validators.required]],
            purpose: [''],
        });
    }

    getEmployeeList() {
        this._orderService.getEmployeeList().subscribe((resp: any) => {
            this.employeeList = [];
            this.employeeList = resp;
        });
    }

    submit() {
        let formData = this.peticashCreateForm.value;
        formData['payment_date'] = this._dateTimeService.getYearMonthDayFormat(this.peticashCreateForm.value.payment_date);
        if (this.peticashCreateForm.valid) {
            if (this.updatePeticashId) {
                formData['id'] = this.updatePeticashId;
                this.updatePeticash(formData);
            } else {
                this.createPeticash(formData);
            }
        }
    }

    createPeticash(formData: FormData) {
        this._peticashService.peticashCreatePostRequest(formData)
            .subscribe((resp: any) => {
                this._alertMsg.successfulSubmissionAlert('Peticash Created Successfully');
                this._router.navigateByUrl('/peticash/list').then();
            }, (error: any) => this._authService.httpRequestErrorHandler(error));
    }

    updatePeticash(formData: FormData) {
        this._peticashService.peticashUpdatePutRequest(formData)
            .subscribe((resp: any) => {
                this._alertMsg.successfulSubmissionAlert('Peticash Updated Successfully');
                this._router.navigateByUrl('/peticash/list').then();
            }, (error: any) => this._authService.httpRequestErrorHandler(error));
    }

    cancel() {
        this._router.navigateByUrl('/peticash/list').then();
    }

}
