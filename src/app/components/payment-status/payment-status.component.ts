// @ts-nocheck
import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { OrderService } from "../../services/order.service";
import { AlertMessageService } from "../../services/alert-message.service";
import { AuthenticationService } from "../../services/authentication.service";
import { Location } from "@angular/common";

@Component({
  selector: "app-payment-status",
  templateUrl: "./payment-status.component.html",
  styleUrls: ["./payment-status.component.scss"],
})
export class PaymentStatusComponent implements OnInit {
  orderId!: any;
  orderData: any = null;
  selectedPaymentStatus!: number;
  isLoading: boolean = true;

  paymentStatusOptions: any[] = [
    {
      statusId: 0,
      statusName: "Unpaid",
    },
    {
      statusId: 1,
      statusName: "Paid",
    },
  ];

  constructor(
    private _orderService: OrderService,
    private _router: Router,
    private _alertMsg: AlertMessageService,
    private _authService: AuthenticationService,
    private _activatedRoute: ActivatedRoute,
    private _location: Location
  ) {}

  ngOnInit(): void {
    this.getOrderIdFromUrl();
  }

  getOrderIdFromUrl() {
    this._activatedRoute.paramMap.subscribe((params) => {
      this.orderId = params.get("orderId");
      if (this.orderId) {
        this.fetchOrderData(this.orderId);
      }
    });
  }

  fetchOrderData(id: any) {
    this.isLoading = true;
    this._orderService.getOrderById(id).subscribe(
      (order: any) => {
        this.orderData = order;
        this.orderId = order.id;
        this.selectedPaymentStatus = order.payment_status;
        this.isLoading = false;
      },
      (error: any) => {
        this.isLoading = false;
        this._authService.httpRequestErrorHandler(error);
      }
    );
  }

  onChangePaymentStatus(e: any) {
    this.selectedPaymentStatus = e;
  }

  onSubmit() {
    const putObj = {
      id: this.orderId,
      payment_status: this.selectedPaymentStatus,
    };
    this._orderService.changePaymentStatus(putObj).subscribe(
      (resp: any) => {
        this._alertMsg.successToast("Payment Status Changed Successfully");
        this._router.navigateByUrl("/orders").then();
      },
      (error: any) => this._authService.httpRequestErrorHandler(error)
    );
  }

  goBack() {
    this._location.back();
  }

  cancel() {
    this._router.navigateByUrl("/orders").then();
  }

  getFormattedDate(dateString: string): string {
    if (!dateString) return "-";
    return dateString.substring(0, 10);
  }
}
