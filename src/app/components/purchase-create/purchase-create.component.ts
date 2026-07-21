import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {AlertMessageService} from "../../services/alert-message.service";
import {AuthenticationService} from "../../services/authentication.service";
import {ActivatedRoute, Router} from "@angular/router";
import {OrderService} from "../../services/order.service";
import {DateTimeService} from "../../services/date-time.service";
import {PurchaseService} from "../../services/purchase.service";

@Component({
    selector: 'app-purchase-create',
    templateUrl: './purchase-create.component.html',
    styleUrls: ['./purchase-create.component.scss']
})
export class PurchaseCreateComponent implements OnInit {

    purchaseCreateForm: FormGroup | any;
    employeeList!: [];
    updatePurchaseId: any = null;

    constructor(public formBuilder: FormBuilder,
                private _alertMsg: AlertMessageService,
                private _authService: AuthenticationService,
                private _activateRoute: ActivatedRoute,
                private _orderService: OrderService,
                private _dateTimeService: DateTimeService,
                private _router: Router, private _purchaseService: PurchaseService) {
    }

    ngOnInit(): void {
        this.updatePart();
        this.formInit();
        this.getEmployeeList();
    }

    updatePart() {
        this._activateRoute.queryParams
            .subscribe(params => {
                    this.updatePurchaseId = null;
                    this.updatePurchaseId = params.purchaseId;
                    if (this.updatePurchaseId)
                        this.fetchPurchaseData(this.updatePurchaseId);
                }
            );
    }

    fetchPurchaseData(id: any) {
        this._purchaseService.getPurchaseById(id).subscribe((item: any) => {
            this.purchaseCreateForm.patchValue(item);
            this.purchaseCreateForm.patchValue({
                purchase_date: new Date(item.purchase_date),
            });
            // this.dataSource = new MatTableDataSource(this.itemList);
        });
    }

    formInit() {
        this.purchaseCreateForm = this.formBuilder.group({
            employee_id: ['', [Validators.required]],
            name: ['', [Validators.required]],
            purchase_no: ['', [Validators.required]],
            amount: ['', [Validators.required]],
            purchase_date: ['', [Validators.required]],
            voucher_no: ['', [Validators.required]],
        });
    }

    getEmployeeList() {
        this._orderService.getEmployeeList().subscribe((resp: any) => {
            this.employeeList = [];
            this.employeeList = resp;
        });
    }

    submit() {
        let formData = this.purchaseCreateForm.value;
        formData['purchase_date'] = this._dateTimeService.getYearMonthDayFormat(this.purchaseCreateForm.value.purchase_date);
        if (this.purchaseCreateForm.valid) {
            if (this.updatePurchaseId) {
                formData['id'] = this.updatePurchaseId;
                this.updatePurchase(formData);
            } else {
                this.createPurchase(formData);
            }
        }
    }

    createPurchase(formData: FormData) {
        this._purchaseService.purchaseCreatePostRequest(formData)
            .subscribe((resp: any) => {
                this._alertMsg.successfulSubmissionAlert('Purchase Created Successfully');
                this._router.navigateByUrl('/purchase/list').then();
            }, (error: any) => this._authService.httpRequestErrorHandler(error));
    }

    updatePurchase(formData: FormData) {
        this._purchaseService.purchaseUpdatePutRequest(formData)
            .subscribe((resp: any) => {
                this._alertMsg.successfulSubmissionAlert('Purchase Updated Successfully');
                this._router.navigateByUrl('/purchase/list').then();
            }, (error: any) => this._authService.httpRequestErrorHandler(error));
    }

    cancel() {
        this._router.navigateByUrl('/purchase/list').then();
    }

}
