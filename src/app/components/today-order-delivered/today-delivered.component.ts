// @ts-nocheck
import { Component, OnInit, ViewChild, ElementRef } from "@angular/core";
import { MatSort } from "@angular/material/sort";
import { MatPaginator } from "@angular/material/paginator";
import { MatTableDataSource } from "@angular/material/table";
import { Router } from "@angular/router";
import { ApiConfig } from "../../utility/apiConfig";
import { AlertMessageService } from "../../services/alert-message.service";
import { TodayService } from "../../services/today.service";
import { OrderTableElement } from "../order-list/order-list.component";
import { OrderStatus, PaymentStatus } from "../order-list/order-list.component";
import { MatDatepickerInputEvent } from "@angular/material/datepicker";
import { DateTimeService } from "../../services/date-time.service";

const ELEMENT_DATA: OrderTableElement[] = [];

@Component({
  selector: "app-today-order-delivered",
  templateUrl: "./today-delivered.component.html",
  styleUrls: ["./today-delivered.component.scss"],
})
export class TodayDeliveredComponent implements OnInit {
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
  totalAmount: number = 0;
  apiConfig = ApiConfig;
  dateTimeString: any;
  selectedDate: Date = new Date();

  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator | any;
  @ViewChild(MatSort, { static: true }) sort: MatSort | any;
  @ViewChild("searchInput") searchInput: ElementRef;

  constructor(
    private _router: Router,
    private _alertMsg: AlertMessageService,
    private _dateTimeService: DateTimeService,
    private _todayDelivered: TodayService
  ) {
    this.itemList = ELEMENT_DATA;
    this.dataSource = new MatTableDataSource(this.itemList);
  }

  ngOnInit(): void {
    this.getTodayOrderDeliveredList();
  }

  addEvent(event: MatDatepickerInputEvent<Date>) {
    this.dateTimeString = this._dateTimeService.getYearMonthDayFormat(
      event.value
    );
    this.clearSearch();
    this._todayDelivered
      .getDateWiseTodayOrderDeliveredList(this.dateTimeString)
      .subscribe((resp) => this.dataSyncWithLocalVariable(resp));
  }

  clearSearch(): void {
    if (this.searchInput) {
      this.searchInput.nativeElement.value = "";
    }
    this.dataSource.filter = "";
  }

  getTodayOrderDeliveredList() {
    this._todayDelivered
      .getTodayOrderDeliveredList(new Date().toISOString().substring(0, 10))
      .subscribe((resp: any) => {
        this.dataSyncWithLocalVariable(resp);
      });
  }

  dataSyncWithLocalVariable(resp: any) {
    this.itemList = [];
    this.itemList = resp;
    this.totalAmount = 0;
    this.itemList.forEach((item: OrderTableElement) => {
      item.status = OrderStatus[item.status];
      item.payment_status = PaymentStatus[item.payment_status];
      if (item.status === "delivered") {
        this.totalAmount += Number(item.total_amount);
      }
    });
    this.dataSource = new MatTableDataSource(this.itemList);
    this.dataSource.filterPredicate = (data: any, filter: string) => {
      const searchStr = filter.toLowerCase();
      return (
        data.order_no?.toLowerCase().includes(searchStr) ||
        data.client?.name?.toLowerCase().includes(searchStr) ||
        data.client?.doctor_name?.toLowerCase().includes(searchStr)
      );
    };
    setTimeout(() => {
      this.dataSource.sort = this.sort;
      this.dataSource.paginator = this.paginator;
    });
  }

  applyFilter(e: any): void {
    const filterValue = e.value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
    this.updateTotalAmount();
  }

  updateTotalAmount(): void {
    this.totalAmount = 0;
    const filteredData = this.dataSource.filteredData;
    filteredData.forEach((item: OrderTableElement) => {
      if (item.status === "delivered") {
        this.totalAmount += Number(item.total_amount);
      }
    });
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

  getReportDownloadUrl(): string {
    const dateStr =
      this.dateTimeString || new Date().toISOString().substring(0, 10);
    return `${this.apiConfig.downloadPdfUrl}orders/delivered/${dateStr}`;
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
