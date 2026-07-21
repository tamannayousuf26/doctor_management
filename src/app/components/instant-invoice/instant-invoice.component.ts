import { Component, OnInit } from "@angular/core";
import { DatePipe } from "@angular/common";
import { OrderService } from "../../services/order.service";

interface LineItem {
  description: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
}

interface InvoiceCase {
  caseNo: string;
  patientName: string;
  items: LineItem[];
}

@Component({
  selector: "app-instant-invoice",
  templateUrl: "./instant-invoice.component.html",
  styleUrls: ["./instant-invoice.component.scss"],
  providers: [DatePipe],
})
export class InstantInvoiceComponent implements OnInit {
  invoiceNumber: string = "";
  cases: InvoiceCase[] = [this.createEmptyCase()];

  // Bill To dropdown
  clientList: any[] = [];
  filteredClientList: any[] = [];
  clientFilterText: string = "";
  selectedClientId: any = "";
  selectedClientName: string = "";
  selectedClientAddress: string = "";
  invoiceDate: Date = new Date();

  get grandTotal(): number {
    return this.cases.reduce(
      (sum, c) =>
        sum + c.items.reduce((s, item) => s + (item.totalPrice || 0), 0),
      0,
    );
  }

  constructor(private datePipe: DatePipe, private orderService: OrderService) {}

  ngOnInit() {
    this.getClientList();
  }

  getClientList() {
    this.orderService.getActiveClientList().subscribe((resp: any) => {
      this.clientList = resp;
      this.filteredClientList = resp;
    });
  }

  onChangeClientOption(clientId: any) {
    const selected = this.clientList.find((item: any) => item.id == clientId);
    if (selected) {
      this.selectedClientName = selected.name;
      this.selectedClientAddress = selected.address || "";
    }
  }

  applyClientSearch(event: any) {
    this.clientFilterText = event.target.value;
    this.filterClientList();
  }

  filterClientList() {
    const searchText = this.clientFilterText.trim().toLowerCase();
    if (!searchText) {
      this.filteredClientList = this.clientList;
      return;
    }
    this.filteredClientList = this.clientList.filter((item: any) => {
      return (
        (item.name && item.name.toLowerCase().includes(searchText)) ||
        (item.doctor_name &&
          item.doctor_name.toLowerCase().includes(searchText)) ||
        (item.phone && item.phone.toLowerCase().includes(searchText))
      );
    });
  }

  clearClientSearch() {
    this.clientFilterText = "";
    this.filteredClientList = this.clientList;
  }

  createEmptyCase(): InvoiceCase {
    return { caseNo: "", patientName: "", items: [this.createEmptyItem()] };
  }

  createEmptyItem(): LineItem {
    return { description: "", quantity: 0, unitPrice: 0, totalPrice: 0 };
  }

  addCase() {
    this.cases.push(this.createEmptyCase());
  }

  removeCase(caseIndex: number) {
    this.cases.splice(caseIndex, 1);
  }

  addItem(caseIndex: number) {
    this.cases[caseIndex].items.push(this.createEmptyItem());
  }

  removeItem(caseIndex: number, itemIndex: number) {
    this.cases[caseIndex].items.splice(itemIndex, 1);
  }

  calculateRowTotal(item: LineItem) {
    item.totalPrice = (item.quantity || 0) * (item.unitPrice || 0);
  }

  isFormValid(): boolean {
    if (!this.invoiceNumber.trim()) return false;
    if (!this.selectedClientId) return false;
    for (const c of this.cases) {
      if (!c.caseNo.trim() || !c.patientName.trim()) return false;
      for (const item of c.items) {
        if (!item.description.trim() || !item.quantity || !item.unitPrice)
          return false;
      }
    }
    return true;
  }

  print() {
    if (!this.isFormValid()) return;

    const now = new Date();
    const printDate = this.datePipe.transform(now, "MMMM dd, yyyy") || "";
    const printDateTime =
      this.datePipe.transform(now, "MMMM dd, yyyy, hh:mm a") || "";

    const html = this.buildInvoiceHtml(
      this.invoiceNumber,
      printDate,
      printDateTime,
    );
    const printWindow = window.open("", "_blank");
    if (printWindow) {
      printWindow.document.write(html);
      printWindow.document.close();
      printWindow.onload = () => {
        printWindow.print();
      };
    }
  }

  private buildTableRows(): string {
    let html = "";
    for (const c of this.cases) {
      const rowCount = c.items.length;
      for (let i = 0; i < rowCount; i++) {
        const item = c.items[i];
        html += "<tr>";
        if (i === 0) {
          html += `<td style="font-weight: bold; vertical-align: middle;" rowspan="${rowCount}">${c.caseNo}</td>`;
          html += `<td style="text-align: left; vertical-align: middle;" rowspan="${rowCount}">${c.patientName}</td>`;
        }
        html += `<td style="text-align: left;">${item.description}</td>`;
        html += `<td>${item.quantity}</td>`;
        html += `<td>${item.unitPrice.toFixed(2)}</td>`;
        html += `<td style="font-weight: bold;">${item.totalPrice.toFixed(
          2,
        )}</td>`;
        html += "</tr>";
      }
    }
    return html;
  }

  private buildInvoiceHtml(
    invoiceNumber: string,
    printDate: string,
    printDateTime: string,
  ): string {
    const tableRows = this.buildTableRows();
    const total = this.grandTotal.toFixed(2);

    return `<!DOCTYPE html>
<html lang="en">
<head>
  <title>Instant Invoice - ${invoiceNumber}</title>
  <meta charset="utf-8"/>
  <style>
    body {
      font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
      margin: 0;
      padding: 0;
    }
    .watermark {
      position: fixed;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      z-index: -1;
      opacity: 0.8;
      pointer-events: none;
    }
    table {
      border-collapse: collapse;
      width: 100%;
      text-align: center;
    }
    th, td {
      font-size: 15px;
      font-family: "Helvetica Neue" !important;
      padding: 2px 8px;
    }
    .bordertable td, .bordertable th {
      border: 1px solid black;
    }
    .storeWaterMark {
      text-align: center;
      font-size: 25px;
      color: #b8cee3;
    }

    /* Fixed page header - repeats on every printed page */
    .page-header {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      height: 20px;
      padding: 5px 0;
    }

    /* Spacer that repeats on each page to push content below fixed header */
    thead .spacer-row td {
      height: 35px;
      padding: 0;
      border: none !important;
    }

    /* Main content with margins to clear fixed header on page 1 */
    .content {
      margin-top: 35px;
    }

    @page {
      margin: 5mm 10mm 15mm 10mm;
    }
    @media print {
      body {
        margin: 0;
        -webkit-print-color-adjust: exact;
        print-color-adjust: exact;
      }
    }
  </style>
</head>
<body>

  <!-- Watermark centered on every page -->
  <img class="watermark" src="${
    window.location.origin
  }/assets/images/bg_vivadent.png" />

  <!-- Repeating page header (fixed position) -->
  <div class="page-header">
    <table>
      <tr>
        <td align="left" width="50%" style="padding: 0">
          <small style="font-size: 12px; color: #525659;">Download Time: <span style="font-family: Calibri, sans-serif; font-size: 12px;">${printDateTime}</span></small>
        </td>
        <td align="right" style="padding: 0">
          <span style="font-family: Calibri, sans-serif; font-size: 11px; color: #3f51b5;">Generated by: https://32vivadent.com</span>
        </td>
      </tr>
    </table>
  </div>

  <!-- Main content -->
  <div class="content">
    <!-- Company header -->
    <div style="text-align: center; padding-top: 0">
      <b style="font-size: 2.0rem; color: #218838"><u>VIVADENT DENTAL LABORATORY</u></b> <br />
      <span style="font-size: 0.8rem">
        No 43, Tingkat Atas, Jalan Pinang B 18/B, Seksyen 18, 40200 Shah Alam, Selangor, Malaysia <br/>
        Admin : 011 8888 6191 | Finance : 016 676 2891 | Technician: 016 444 1905 <br/>
        vivadentsdnbhd@gmail.com | www.32vivadent.com
      </span>
      <br /><br />
      <div style="border: 3px solid #8ab43e; width: 55%; border-radius: 8px; margin: auto; padding: 4px 0;">
        <b style="font-size: 1.6rem; padding: 20px; color: #258ab9">Invoice: ${invoiceNumber}</b>
      </div>
      <br/>
    </div>

    <!-- Metadata -->
    <table>
      <tr>
        <td align="left" width="50%" style="padding: 0">
          <p style="margin: 2px 0;"><b>Bill To:</b> ${
            this.selectedClientName
          }</p>
          ${
            this.selectedClientAddress
              ? `<p style="margin: 2px 0;"><b>Address:</b> ${this.selectedClientAddress}</p>`
              : ""
          }
        </td>
        <td align="right">
          <p style="margin: 2px 0;"><b>Pay To:</b> MD ABU BAKAR SIDDEK</p>
          <p style="margin: 2px 0;"><b>Account:</b> 1802051780 </p>
          <p style="margin: 2px 0;"><b>OCBC BANK</b></p>
        </td>
      </tr>
    </table>
     <table>
      <tr>
        <td align="left" width="50%" style="padding: 0">
          <p><b>Date:</b> ${
            this.invoiceDate
              ? this.datePipe.transform(this.invoiceDate, "MMMM dd, yyyy")
              : ""
          }</p>
        </td>
        <td align="right">
          <p><b>CURRENCY:</b> MALAYSIAN RINGGIT (RM)</p>
        </td>
      </tr>
    </table>

    <!-- Body table -->
    <table class="bordertable">
      <thead>
        <tr class="spacer-row"><td colspan="6"></td></tr>
        <tr style="background-color: #258ab9; color: #fff; font-weight: bolder;">
          <th style="width: 60px;">Case</th>
          <th style="width: 140px;">Patient Name</th>
          <th>Description</th>
          <th style="width: 70px;">Quantity</th>
          <th style="width: 110px;">Unit Price (RM)</th>
          <th style="width: 120px;">Total Price (RM)</th>
        </tr>
      </thead>
      <tbody>
        ${tableRows}
      </tbody>
      <tfoot>
        <tr style="background-color: #f1f3f3;">
          <td colspan="5" style="text-align: right; padding: 10px; font-weight: bold;">TOTAL</td>
          <td style="font-weight: bold; font-size: 18px; color: #218838;">RM ${total}</td>
        </tr>
      </tfoot>
    </table>

    <!-- Footer with payment terms -->
    <div style="margin-top: 10px;">
      <table style="width: 100%; margin-top: 10px;">
        <tr>
          <td align="center" style="padding: 5px 0;">
            <p style="font-size: 12px; margin: 0; color: #525659;">
              This document is computer generated. No signature required.
            </p>
          </td>
        </tr>
      </table>
    </div>

  </div>

</body>
</html>`;
  }
}
