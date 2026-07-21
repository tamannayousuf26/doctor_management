import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { ItemService } from "../../services/item.service";
import { OrderService } from "../../services/order.service";
import { ActivatedRoute, Router } from "@angular/router";
import { AlertMessageService } from "../../services/alert-message.service";
import { AuthenticationService } from "../../services/authentication.service";
import { Location } from "@angular/common";
@Component({
  selector: "app-order-status",
  templateUrl: "./order-status.component.html",
  styleUrls: ["./order-status.component.scss"],
})
export class OrderStatusComponent implements OnInit {
  orderId!: any;
  selectedStatusId!: any;
  statusOption: any[] = [
    {
      statusId: 0,
      statusName: "Received",
    },

    {
      statusId: 1,
      statusName: "In-progress",
    },
    {
      statusId: 2,
      statusName: "Redo",
    },
    {
      statusId: 3,
      statusName: "Trial",
    },
    {
      statusId: 4,
      statusName: "Delivered",
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
      this.orderId = params.get("orderID");
    });
    this.getSingleOrder(this.orderId);
  }

  getSingleOrder(id: any) {
    this._orderService.getOrderById(id).subscribe((order: any) => {
      console.log(order);
      this.orderId = order.id;
      this.selectedStatusId = order.status;
    });
  }

  onChangeStatusOption(e: any) {
    this.selectedStatusId = e;
  }

  onSubmit() {
    const putObj = {
      id: this.orderId,
      status: this.selectedStatusId,
    };
    this._orderService.changeOrderStatus(putObj).subscribe(
      (resp: any) => {
        this._alertMsg.successfulSubmissionAlert(
          "Order Status Changed Successfully"
        );
        this._router.navigateByUrl("/orders").then();
      },
      (error: any) => this._authService.httpRequestErrorHandler(error)
    );
  }

  goBack() {
    this._location.back();
  }
}
