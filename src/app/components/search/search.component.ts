// @ts-nocheck
import { Component, OnInit, ViewChild } from "@angular/core";
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from "@angular/forms";
import { AlertMessageService } from "../../services/alert-message.service";
import { Router } from "@angular/router";
import { EmployeeService } from "../../services/employee.service";
import { OrderService } from "../../services/order.service";
import { SearchService } from "../../services/search.service";
import { MatTableDataSource } from "@angular/material/table";
import { MatPaginator } from "@angular/material/paginator";
import { MatSort } from "@angular/material/sort";
import { SelectionModel } from "@angular/cdk/collections";
import {
  OrderStatus,
  OrderTableElement,
  PaymentStatus,
} from "../order-list/order-list.component";
import { DateTimeService } from "../../services/date-time.service";
import { ApiConfig } from "../../utility/apiConfig";
import { DropdownOption } from "../searchable-dropdown/searchable-dropdown.component";

const ELEMENT_DATA: OrderTableElement[] = [];

@Component({
  selector: "app-search",
  templateUrl: "./search.component.html",
  styleUrls: ["./search.component.scss"],
})
export class SearchComponent implements OnInit {
  displayedColumns: string[] = [
    "select",
    "id",
    "order_no",
    "client_id",
    "order_date",
    "patient_name",
    "delivery_date",
    "employee_id",
    "total_amount",
    "status",
    "payment_status",
    "actions",
  ];
  dataSource: MatTableDataSource<OrderTableElement>;
  itemList: OrderTableElement[];
  apiConfig = ApiConfig;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator | any;
  @ViewChild(MatSort, { static: true }) sort: MatSort | any;

  searchFormGroup!: FormGroup;
  clientList!: [];
  clientDropdownOptions: DropdownOption[] = [];
  address!: any;
  selection = new SelectionModel<OrderTableElement>(true, []);

  constructor(
    public formBuilder: FormBuilder,
    private _alertMsg: AlertMessageService,
    private _dateTimeService: DateTimeService,
    private _searchService: SearchService,
    private _router: Router,
    private _orderService: OrderService
  ) {
    this.itemList = ELEMENT_DATA;
    this.dataSource = new MatTableDataSource(this.itemList);
  }

  ngOnInit(): void {
    this.formInit();
    this.getClientList();
  }

  formInit() {
    this.searchFormGroup = this.formBuilder.group({
      id: ["", [Validators.required]],
      startDate: ["", [Validators.required]],
      endDate: ["", [Validators.required]],
    });
  }

  getClientList() {
    this._orderService.getClientList().subscribe((resp: any) => {
      this.clientList = [];
      this.clientList = resp;
      this.clientDropdownOptions = resp.map((item: any) => ({
        id: item.id,
        name: item.name,
        secondaryText: item.doctor_name,
      }));
    });
  }

  onClientSelected(option: DropdownOption) {
    const selected = this.clientList.filter(
      (item: any) => item.id == option.id
    );
    if (selected.length > 0) {
      this.address = selected[0]["address"];
      this.searchFormGroup.patchValue({ id: option.id });
    }
  }

  onChangeClientOption(e: any) {
    const selected = this.clientList.filter((item: any) => item.id == e);
    this.address = selected[0]["address"];
  }

  /*    onSubmit() {
            let data = this.searchFormGroup.value;
            console.log(this._dateTimeService.getYearMonthDayFormat(data['startDate']));
            console.log(this._dateTimeService.getYearMonthDayFormat(data['endDate']));
        }*/

  onSubmit() {
    if (this.searchFormGroup.valid) {
      const id = this.searchFormGroup.value.id;
      const startDate = this._dateTimeService.getYearMonthDayFormat(
        this.searchFormGroup.value.startDate
      );
      const endDate = this._dateTimeService.getYearMonthDayFormat(
        this.searchFormGroup.value.endDate
      );
      const data = {
        id: id,
        startDate: startDate,
        endDate: endDate,
      };
      this._searchService.getClientOrderList(data).subscribe(
        (item: any) => {
          this.itemList = [];
          this.itemList = item;
          this.itemList.forEach((item: OrderTableElement) => {
            item.status = OrderStatus[item.status];
            item.payment_status = PaymentStatus[item.payment_status];
          });
          console.log(this.itemList);

          // Show success toast
          this._alertMsg.successToast(`Found ${this.itemList.length} orders`);

          // Clear selection when new search is performed
          this.selection.clear();

          setTimeout(() => {
            this.dataSource.sort = this.sort;
            this.dataSource = new MatTableDataSource(this.itemList);
          });
        },
        (error: any) => this._authService.httpRequestErrorHandler(error)
      );
    }
  }

  /** Whether the number of selected elements matches the total number of rows. */
  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;
    return numSelected === numRows;
  }

  /** Selects all rows if they are not all selected; otherwise clear selection. */
  toggleAllRows() {
    if (this.isAllSelected()) {
      this.selection.clear();
      return;
    }

    this.selection.select(...this.dataSource.data);
  }

  /** The label for the checkbox on the passed row */
  checkboxLabel(row?: OrderTableElement): string {
    if (!row) {
      return `${this.isAllSelected() ? "deselect" : "select"} all`;
    }
    return `${this.selection.isSelected(row) ? "deselect" : "select"} row ${
      row.id
    }`;
  }

  /** Get the total amount of selected rows */
  getSelectedTotal(): number {
    return this.selection.selected.reduce(
      (total, order) => total + parseFloat(order.total_amount.toString()),
      0
    );
  }

  /** Mark selected orders as paid */
  markSelectedAsPaid() {
    if (this.selection.selected.length === 0) {
      this._alertMsg.warningAlert("Please select at least one order");
      return;
    }

    const selectedIds = this.selection.selected.map((order) => order.id);
    const selectedCount = selectedIds.length;
    const totalAmount = this.getSelectedTotal();

    // Show confirmation modal
    this._alertMsg
      .confirmStatusChangeAlert(
        `Paid for ${selectedCount} Selected Orders (Total: ${totalAmount.toFixed(
          2
        )})`
      )
      .then((confirmed: any) => {
        if (confirmed) {
          const payload = {
            order_ids: selectedIds,
          };
          this._orderService.markSelectedOrdersAsPaid(payload).subscribe(
            (resp: any) => {
              this._alertMsg.successToast(
                `${selectedCount} orders marked as paid successfully`
              );
              // Clear selection
              this.selection.clear();
              // Refresh the search results
              this.onSubmit();
            },
            (error: any) => {
              this._alertMsg.submissionErrorAlert();
              console.error("Error marking selected orders as paid:", error);
            }
          );
        }
      });
  }

  markAllAsPaid() {
    if (!this.searchFormGroup.valid) {
      this._alertMsg.warningAlert("Please complete the search form first");
      return;
    }

    // Count unpaid orders
    const unpaidCount = this.itemList.filter(
      (item) => item.payment_status.toLowerCase() === "unpaid"
    ).length;

    if (unpaidCount === 0) {
      this._alertMsg.warningAlert(
        "No unpaid orders found in the current results"
      );
      return;
    }

    // Show confirmation modal
    this._alertMsg
      .confirmStatusChangeAlert(`Mark All ${unpaidCount} Unpaid Orders as Paid`)
      .then((confirmed: any) => {
        if (confirmed) {
          const clientId = this.searchFormGroup.value.id;
          const startDate = this._dateTimeService.getYearMonthDayFormat(
            this.searchFormGroup.value.startDate
          );
          const endDate = this._dateTimeService.getYearMonthDayFormat(
            this.searchFormGroup.value.endDate
          );

          const payload = {
            client_id: clientId,
            start_date: startDate,
            end_date: endDate,
          };
          this._orderService.markAllOrdersAsPaid(payload).subscribe(
            (resp: any) => {
              this._alertMsg.successToast(
                `${unpaidCount} orders marked as paid successfully`
              );
              // Refresh the search results
              this.onSubmit();
            },
            (error: any) => {
              this._alertMsg.submissionErrorAlert();
              console.error("Error marking orders as paid:", error);
            }
          );
        }
      });
  }

  convertDateString(data: any): string {
    let list = data.split("/");
    return list[2] + "-" + list[0] + "-" + list[1];
  }

  changeStatusOrder(index) {
    this._router.navigate([`orders/status/${this.itemList[index].id}`]).then();
  }

  deleteOrder(orderId: any) {
    this._alertMsg.deleteItemAlert().then((res: any) => {
      if (res) {
        this._orderService.deleteOrderById(orderId).subscribe((resp: any) => {
          this.getOrderList();
          this._alertMsg.successfulSubmissionAlert("Delete Order Successfully");
        });
      }
    });
  }

  editOrder(orderId) {
    this._router
      .navigate(["orders/create"], { queryParams: { orderId: orderId } })
      .then();
  }

  applyFilter(e: any): void {
    const filterValue = e.value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  getStatusClass(status: string): string {
    const statusLower = status?.toLowerCase() || "";
    switch (statusLower) {
      case "received":
        return "status-received";
      case "in-progress":
        return "status-in-progress";
      case "redo":
        return "status-redo";
      case "trial":
        return "status-trial";
      case "delivered":
        return "status-delivered";
      default:
        return "status-default";
    }
  }

  getPaymentStatusClass(status: string): string {
    const statusLower = status?.toLowerCase() || "";
    switch (statusLower) {
      case "paid":
        return "payment-paid";
      case "unpaid":
        return "payment-unpaid";
      default:
        return "payment-default";
    }
  }
}
