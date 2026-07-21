import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { DatePipe } from "@angular/common";
import { CashSaleService } from "../../services/cash-sale.service";

@Component({
  selector: "app-cash-sale",
  templateUrl: "./cash-sale.component.html",
  styleUrls: ["./cash-sale.component.scss"],
  providers: [DatePipe],
})
export class CashSaleComponent implements OnInit {
  cashSaleForm: FormGroup;

  paymentMethods = [
    { value: "Cash", label: "Cash" },
    { value: "Bank", label: "Bank" },
    { value: "Online", label: "Online" },
  ];

  constructor(
    private fb: FormBuilder,
    private datePipe: DatePipe,
    private cashSaleService: CashSaleService,
  ) {
    this.cashSaleForm = this.fb.group({
      date: [new Date(), Validators.required],
      particular: ["", Validators.required],
      paymentMethod: ["Cash", Validators.required],
      amount: [null, [Validators.required, Validators.min(0.01)]],
      reference: [""],
    });
  }

  ngOnInit(): void {}

  onSubmit(): void {
    if (this.cashSaleForm.valid) {
      this.printReceipt();
    }
  }

  clearForm(): void {
    this.cashSaleForm.reset({
      date: new Date(),
      particular: "Cash Sale",
      paymentMethod: "Cash",
      amount: null,
      reference: "",
    });
  }

  private printReceipt(): void {
    const formValues = this.cashSaleForm.value;
    const formattedDate =
      this.datePipe.transform(formValues.date, "yyyy-MM-dd") || "";

    const cashSaleData = {
      date: formattedDate,
      amount: parseFloat(formValues.amount),
      payment_method: formValues.paymentMethod,
      particulars: formValues.particular,
      reference: formValues.reference,
    };

    // Open PDF in new tab - browser will show print/save dialog
    const reportUrl = this.cashSaleService.getReportUrl(cashSaleData);
    const printWindow = window.open(reportUrl, "_blank");

    // Trigger print dialog once PDF loads
    if (printWindow) {
      printWindow.onload = () => {
        printWindow.print();
      };
    }
  }
}
