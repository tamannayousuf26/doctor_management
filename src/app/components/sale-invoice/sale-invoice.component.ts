import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { MatDialog } from "@angular/material/dialog";
import { SelectionModel } from "@angular/cdk/collections";
import {
  SaleInvoiceService,
  SaleInvoiceFilters,
} from "../../services/sale-invoice.service";
import { ApiConfig } from "../../utility/apiConfig";
import { OrderService } from "../../services/order.service";
import { AlertMessageService } from "../../services/alert-message.service";
import { ShareLinkDialogComponent } from "./share-link-dialog/share-link-dialog.component";

@Component({
  selector: "app-sale-invoice",
  templateUrl: "./sale-invoice.component.html",
  styleUrls: ["./sale-invoice.component.scss"],
})
export class SaleInvoiceComponent implements OnInit {
  // Filter values
  selectedYear: number;
  selectedMonth: number | null = null;
  selectedDate: number | null = null;
  selectedPaymentStatus: number | null = null;
  searchText: string = "";

  // Data
  orders: any[] = [];
  summary: any = {
    total_orders: 0,
    total_amount: 0,
    total_paid: 0,
    total_unpaid: 0,
  };
  filtersApplied: any = {};
  apiConfig = ApiConfig;

  // Dropdown options
  years: number[] = [];
  months = [
    { value: 1, label: "January" },
    { value: 2, label: "February" },
    { value: 3, label: "March" },
    { value: 4, label: "April" },
    { value: 5, label: "May" },
    { value: 6, label: "June" },
    { value: 7, label: "July" },
    { value: 8, label: "August" },
    { value: 9, label: "September" },
    { value: 10, label: "October" },
    { value: 11, label: "November" },
    { value: 12, label: "December" },
  ];
  dates: number[] = Array.from({ length: 31 }, (_, i) => i + 1);
  paymentStatuses = [
    { value: null, label: "All" },
    { value: 0, label: "Unpaid" },
    { value: 1, label: "Paid" },
  ];

  loading = false;
  displayedColumns: string[] = [
    "select",
    "id",
    "order_no",
    "client",
    "doctor",
    "order_date",
    "patient_name",
    "delivery_date",
    "total_amount",
    "payment_status",
    "actions",
  ];
  selection = new SelectionModel<any>(true, []);

  constructor(
    private saleInvoiceService: SaleInvoiceService,
    private orderService: OrderService,
    private alertService: AlertMessageService,
    private router: Router,
    private dialog: MatDialog,
  ) {
    const now = new Date();
    this.selectedYear = now.getFullYear();
    this.selectedMonth = now.getMonth() + 1;
    for (let year = this.selectedYear; year >= 2023; year--) {
      this.years.push(year);
    }
  }

  ngOnInit(): void {
    this.loadSaleInvoices();
  }

  loadSaleInvoices(): void {
    this.loading = true;

    const filters: SaleInvoiceFilters = {
      year: this.selectedYear,
    };

    if (this.selectedMonth) {
      filters.month = this.selectedMonth;
    }
    if (this.selectedDate) {
      filters.date = this.selectedDate;
    }
    if (this.selectedPaymentStatus !== null) {
      filters.payment_status = this.selectedPaymentStatus;
    }
    if (this.searchText && this.searchText.trim()) {
      filters.search = this.searchText.trim();
    }

    this.saleInvoiceService.getSaleInvoices(filters).subscribe({
      next: (response: any) => {
        this.orders = response.orders || [];
        this.summary = response.summary || this.summary;
        this.filtersApplied = response.filters_applied || {};
        this.loading = false;
      },
      error: (error) => {
        console.error("Error loading sale invoices:", error);
        this.loading = false;
      },
    });
  }

  onFilterChange(): void {
    this.loadSaleInvoices();
  }

  clearFilters(): void {
    const currentYear = new Date().getFullYear();
    this.selectedYear = currentYear;
    this.selectedMonth = new Date().getMonth() + 1;
    this.selectedDate = null;
    this.selectedPaymentStatus = null;
    this.searchText = "";
    this.loadSaleInvoices();
  }

  getStatusClass(status: string): string {
    const statusMap: any = {
      Received: "status-received",
      "In Progress": "status-in-progress",
      Redo: "status-redo",
      Trial: "status-trial",
      Delivered: "status-delivered",
    };
    return statusMap[status] || "status-default";
  }

  getPaymentStatusClass(paymentStatus: number): string {
    return paymentStatus === 1 ? "payment-paid" : "payment-unpaid";
  }

  getPaymentStatusLabel(paymentStatus: number): string {
    return paymentStatus === 1 ? "Paid" : "Unpaid";
  }

  formatCurrency(amount: number): string {
    return (amount || 0).toFixed(2);
  }

  formatDate(dateString: string): string {
    if (!dateString) return "";
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  }

  editOrder(orderId: number): void {
    this.router
      .navigate(["orders/create"], { queryParams: { orderId: orderId } })
      .then();
  }

  deliverOrder(orderId: number): void {
    this.alertService
      .confirmStatusChangeAlert("Delivered")
      .then((confirmed: boolean) => {
        if (confirmed) {
          const formObj = { id: orderId, status: 4 };
          this.orderService.changeOrderStatus(formObj).subscribe({
            next: () => {
              this.alertService.successfulSubmissionAlert(
                "Order Status Changed Successfully",
              );
              this.loadSaleInvoices();
            },
            error: (error) => {
              console.error("Error delivering order:", error);
              this.alertService.submissionErrorAlert();
            },
          });
        }
      });
  }

  deleteOrder(orderId: number): void {
    this.alertService.deleteItemAlert().then((confirmed: boolean) => {
      if (confirmed) {
        this.orderService.deleteOrderById(orderId).subscribe({
          next: () => {
            this.alertService.successfulSubmissionAlert(
              "Order deleted successfully",
            );
            this.loadSaleInvoices();
          },
          error: (error) => {
            console.error("Error deleting order:", error);
            this.alertService.submissionErrorAlert();
          },
        });
      }
    });
  }

  changePaymentStatus(orderId: number): void {
    const order = this.orders.find((o) => o.id === orderId);
    if (!order) return;

    const currentPaymentStatus = order.payment_status;
    const newPaymentStatus = currentPaymentStatus === 0 ? 1 : 0;
    const newStatusText = newPaymentStatus === 1 ? "Paid" : "Unpaid";

    this.alertService
      .confirmStatusChangeAlert(newStatusText)
      .then((confirmed: boolean) => {
        if (confirmed) {
          const formObj = { id: orderId, payment_status: newPaymentStatus };
          this.orderService.changePaymentStatus(formObj).subscribe({
            next: () => {
              this.alertService.successToast(
                `Payment Status Changed to ${newStatusText}`,
              );
              this.loadSaleInvoices();
            },
            error: (error) => {
              console.error("Error updating payment status:", error);
              this.alertService.submissionErrorAlert();
            },
          });
        }
      });
  }

  printReport(): void {
    window.open(this.getReportUrl(), "_blank");
  }

  shareReport(): void {
    const link = this.getReportUrl();
    this.dialog.open(ShareLinkDialogComponent, {
      width: "500px",
      data: { link },
    });
  }

  private getReportUrl(): string {
    let url = `${ApiConfig.downloadPdfUrl}sale-invoices?year=${this.selectedYear}`;

    if (this.selectedMonth) {
      url += `&month=${this.selectedMonth}`;
    }
    if (this.selectedDate) {
      url += `&date=${this.selectedDate}`;
    }
    if (this.selectedPaymentStatus !== null) {
      url += `&payment_status=${this.selectedPaymentStatus}`;
    }
    if (this.searchText && this.searchText.trim()) {
      url += `&search=${encodeURIComponent(this.searchText.trim())}`;
    }

    return url;
  }

  /** Whether the number of selected elements matches the total number of rows. */
  isAllSelected(): boolean {
    const numSelected = this.selection.selected.length;
    const numRows = this.orders.length;
    return numSelected === numRows;
  }

  /** Selects all rows if they are not all selected; otherwise clear selection. */
  toggleAllRows(): void {
    if (this.isAllSelected()) {
      this.selection.clear();
      return;
    }
    this.selection.select(...this.orders);
  }

  /** The label for the checkbox on the passed row */
  checkboxLabel(row?: any): string {
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
      (total, order) =>
        total + parseFloat(order.total_amount?.toString() || "0"),
      0,
    );
  }

  /** Mark selected orders as paid */
  markSelectedAsPaid(): void {
    if (this.selection.selected.length === 0) {
      this.alertService.warningAlert("Please select at least one order");
      return;
    }

    const selectedIds = this.selection.selected.map((order) => order.id);
    const selectedCount = selectedIds.length;
    const totalAmount = this.getSelectedTotal();

    this.alertService
      .confirmStatusChangeAlert(
        `Paid for ${selectedCount} Selected Orders (Total: ${totalAmount.toFixed(
          2,
        )})`,
      )
      .then((confirmed: boolean) => {
        if (confirmed) {
          const payload = {
            order_ids: selectedIds,
          };
          this.orderService.markSelectedOrdersAsPaid(payload).subscribe({
            next: () => {
              this.alertService.successToast(
                `${selectedCount} orders marked as paid successfully`,
              );
              this.selection.clear();
              this.loadSaleInvoices();
            },
            error: (error) => {
              this.alertService.submissionErrorAlert();
              console.error("Error marking selected orders as paid:", error);
            },
          });
        }
      });
  }
}
