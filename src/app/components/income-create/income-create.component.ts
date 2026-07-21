import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { AlertMessageService } from "../../services/alert-message.service";
import { AuthenticationService } from "../../services/authentication.service";
import { OrderService } from "../../services/order.service";
import { MatTableDataSource } from "@angular/material/table";
import { IncomeService } from "../../services/income.service";
import { DateTimeService } from "../../services/date-time.service";

@Component({
  selector: "app-income-create",
  templateUrl: "./income-create.component.html",
  styleUrls: ["./income-create.component.scss"],
})
export class IncomeCreateComponent implements OnInit {
  incomeCreateForm: FormGroup | any;
  employeeList!: [];
  clientList: any[] = [];
  updateIncomeId: any = null;

  filterText: string = "";
  filteredData: any[] = [];

  constructor(
    public formBuilder: FormBuilder,
    private _alertMsg: AlertMessageService,
    private _authService: AuthenticationService,
    private _activateRoute: ActivatedRoute,
    private _orderService: OrderService,
    private _dateTimeService: DateTimeService,
    private _router: Router,
    private _incomeService: IncomeService
  ) {}

  ngOnInit(): void {
    this.updatePart();
    this.formInit();
    this.getEmployeeAndClientList();
  }

  updatePart() {
    this._activateRoute.queryParams.subscribe((params) => {
      this.updateIncomeId = null;
      this.updateIncomeId = params.incomeId;
      if (this.updateIncomeId) this.fetchIncomeData(this.updateIncomeId);
    });
  }

  fetchIncomeData(id: any) {
    this._incomeService.getIncomeById(id).subscribe((item: any) => {
      console.log(item);
      this.incomeCreateForm.patchValue(item);
      this.incomeCreateForm.patchValue({
        payment_date: new Date(item.payment_date),
      });
      // this.dataSource = new MatTableDataSource(this.itemList);
    });
  }

  formInit() {
    this.incomeCreateForm = this.formBuilder.group({
      employee_id: ["", [Validators.required]],
      client_id: ["", [Validators.required]],
      type: ["", [Validators.required]],
      total_amount: ["", [Validators.required]],
      payment_date: ["", [Validators.required]],
      remarks: [""],
    });
  }

  getEmployeeAndClientList() {
    this._orderService.getEmployeeList().subscribe((resp: any) => {
      this.employeeList = [];
      this.employeeList = resp;
    });

    this._orderService.getClientList().subscribe((resp: any) => {
      this.clientList = [];
      this.clientList = resp;
      this.filteredData = resp;
    });
  }

  submit() {
    let formData = this.incomeCreateForm.value;
    formData["payment_date"] = this._dateTimeService.getYearMonthDayFormat(
      this.incomeCreateForm.value.payment_date
    );
    if (this.incomeCreateForm.valid) {
      if (this.updateIncomeId) {
        formData["id"] = this.updateIncomeId;
        this.updateIncome(formData);
      } else {
        this.createIncome(formData);
      }
    }
  }

  createIncome(formData: FormData) {
    this._incomeService.incomeCreatePostRequest(formData).subscribe(
      (resp: any) => {
        this._alertMsg.successfulSubmissionAlert("Income Created Successfully");
        this._router.navigateByUrl("/income/list").then();
      },
      (error: any) => this._authService.httpRequestErrorHandler(error)
    );
  }

  updateIncome(formData: FormData) {
    this._incomeService.incomeUpdatePutRequest(formData).subscribe(
      (resp: any) => {
        this._alertMsg.successfulSubmissionAlert("Income Updated Successfully");
        this._router.navigateByUrl("/income/list").then();
      },
      (error: any) => this._authService.httpRequestErrorHandler(error)
    );
  }

  cancel() {
    this._router.navigateByUrl("/income/list").then();
  }

  applySearch(event: any) {
    this.filterText = event.target.value;
    this.findFilteredData();
  }

  findFilteredData() {
    this.filteredData = this.clientList.filter((item, index) => {
      return index == 0
        ? true
        : item.name
            .toLowerCase()
            .indexOf(this.filterText.trim().toLowerCase()) != -1 ||
            item.doctor_name
              .toLowerCase()
              .indexOf(this.filterText.trim().toLowerCase()) != -1;
    });
  }
}
