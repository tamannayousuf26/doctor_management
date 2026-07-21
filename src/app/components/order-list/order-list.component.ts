// @ts-nocheck
import {
  Component,
  OnInit,
  OnDestroy,
  ViewChild,
  ElementRef,
} from "@angular/core";
import { MatTableDataSource } from "@angular/material/table";
import { Router } from "@angular/router";
import { OrderService } from "../../services/order.service";
import { ApiConfig } from "../../utility/apiConfig";
import { AlertMessageService } from "../../services/alert-message.service";
import { debounceTime, distinctUntilChanged } from "rxjs/operators";
import { Subject, Subscription } from "rxjs";

export interface OrderTableElement {
  id: number;
  order_no: string;
  client_id: string;
  order_date: string;
  patient_name: string;
  delivery_date: string;
  employee_id: string;
  total_amount: number;
  status: number;
  payment_status: number;
  doctor_name: string;
}

export enum OrderStatus {
  0 = "Received",
  1 = "In-progress",
  2 = "redo",
  3 = "trial",
  4 = "delivered",
}

export enum PaymentStatus {
  0 = "Unpaid",
  1 = "Paid",
}

const ELEMENT_DATA: OrderTableElement[] = [];

@Component({
  selector: "app-order-list",
  templateUrl: "./order-list.component.html",
  styleUrls: ["./order-list.component.scss"],
})
export class OrderListComponent implements OnInit, OnDestroy {
  displayedColumns: string[] = [
    "id",
    "order_no",
    "client_id",
    "doctor_name",
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

  first = 1;
  last: number = 1;
  current: number = 1;
  nextPageUrl = null;
  prevPageUrl = null;
  searchKey = "";
  showPagination = false;

  // Search subject for debouncing
  private searchSubject = new Subject<string>();
  private searchSubscription: Subscription;

  @ViewChild("searchInput") searchInput: ElementRef;

  constructor(
    private _router: Router,
    private _alertMsg: AlertMessageService,
    private _orderService: OrderService
  ) {
    this.itemList = ELEMENT_DATA;
    this.dataSource = new MatTableDataSource(this.itemList);
  }

  ngOnInit(): void {
    this.getOrderList();
    this.setupSearchSubscription();
  }

  ngOnDestroy(): void {
    if (this.searchSubscription) {
      this.searchSubscription.unsubscribe();
    }
  }

  setupSearchSubscription(): void {
    this.searchSubscription = this.searchSubject
      .pipe(debounceTime(500), distinctUntilChanged())
      .subscribe((searchTerm) => {
        if (searchTerm.length > 0) {
          this.current = null;
          this._orderService
            .searchQueryForOrder(searchTerm)
            .subscribe((resp) => this.getDataSyncWithLocalVariable(resp));
        } else {
          this.current = null;
          this.getOrderList();
        }
      });
  }

  getOrderList() {
    this._orderService.getOrderListRequest().subscribe((resp: any) => {
      this.getDataSyncWithLocalVariable(resp);
    });
  }

  onSearchInput(event: any): void {
    this.searchKey = event.target.value;
    this.searchSubject.next(this.searchKey);
  }

  clearSearch(): void {
    this.searchKey = "";
    if (this.searchInput) {
      this.searchInput.nativeElement.value = "";
    }
    this.searchSubject.next("");
  }

  getDataSyncWithLocalVariable(resp: any) {
    this.itemList = [];
    this.itemList = resp.data;
    this.current = resp.current_page || 1;
    this.last = resp.last_page || 1;
    this.nextPageUrl = resp.next_page_url;
    this.prevPageUrl = resp.prev_page_url;
    this.showPagination = this.last > 1;
    this.itemList.forEach((item: OrderTableElement) => {
      item.status = OrderStatus[item.status];
      item.payment_status = PaymentStatus[item.payment_status];
    });
    this.dataSource = new MatTableDataSource(this.itemList);
  }

  nextBtnClick() {
    if (this.nextPageUrl) {
      this._orderService
        .navigateToNextPage(this.nextPageUrl)
        .subscribe((resp) => this.getDataSyncWithLocalVariable(resp));
    }
  }

  prevBtnClick() {
    if (this.prevPageUrl) {
      this._orderService
        .navigateToPreviousPage(this.prevPageUrl)
        .subscribe((resp) => this.getDataSyncWithLocalVariable(resp));
    }
  }

  numberBtnClick(e: number) {
    if (this.searchKey && this.searchKey.length > 0) {
      // If there's a search query, use search with pagination
      this._orderService
        .searchQueryForOrderWithPage(this.searchKey, e)
        .subscribe((resp) => this.getDataSyncWithLocalVariable(resp));
    } else {
      // Otherwise use regular pagination
      this._orderService
        .navigateToNumberPage(e)
        .subscribe((resp) => this.getDataSyncWithLocalVariable(resp));
    }
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

  createOrder() {
    this._router.navigate(["orders/create"]).then();
  }

  changeStatusOrder(orderId) {
    this._router.navigate([`orders/status/${orderId}`]).then();
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

  editOrder(orderId) {
    this._router
      .navigate(["orders/create"], { queryParams: { orderId: orderId } })
      .then();
  }

  changePaymentStatus(orderId) {
    // Find the current order to get its payment status
    const order = this.itemList.find((item) => item.id === orderId);
    if (!order) return;

    // Determine the current payment status (convert string back to number)
    const currentPaymentStatus =
      order.payment_status.toLowerCase() === "paid" ? 1 : 0;

    // Determine new payment status and message
    const newPaymentStatus = currentPaymentStatus === 0 ? 1 : 0;
    const newStatusText = newPaymentStatus === 1 ? "Paid" : "Unpaid";
    const currentStatusText = currentPaymentStatus === 1 ? "Paid" : "Unpaid";

    // Show confirmation modal with dynamic message
    this._alertMsg
      .confirmStatusChangeAlert(newStatusText)
      .then((confirmed: any) => {
        if (confirmed) {
          const putObj = {
            id: orderId,
            payment_status: newPaymentStatus,
          };

          this._orderService.changePaymentStatus(putObj).subscribe(
            (resp: any) => {
              this._alertMsg.successToast(
                `Payment Status Changed to ${newStatusText}`
              );
              // Refresh the list to show updated status
              this.getOrderList();
            },
            (error: any) => {
              this._alertMsg.submissionErrorAlert();
              console.error("Error updating payment status:", error);
            }
          );
        }
      });
  }

  deliverOrder(orderId) {
    this._alertMsg
      .confirmStatusChangeAlert("Delivered")
      .then((confirmed: any) => {
        if (confirmed) {
          const putObj = {
            id: orderId,
            status: 4,
          };
          this._orderService.changeOrderStatus(putObj).subscribe(
            (resp: any) => {
              this._alertMsg.successfulSubmissionAlert(
                "Order Status Changed Successfully"
              );
              this.getOrderList();
            },
            (error: any) => this._authService.httpRequestErrorHandler(error)
          );
        }
      });
  }
}
