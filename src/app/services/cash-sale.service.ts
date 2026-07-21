import { Injectable } from "@angular/core";
import { HttpClient, HttpParams } from "@angular/common/http";
import { Observable } from "rxjs";
import { ApiConfig } from "../utility/apiConfig";

export interface CashSaleData {
  date: string;
  amount: number;
  payment_method: string;
  particulars: string;
  reference: string;
}

@Injectable({
  providedIn: "root",
})
export class CashSaleService {
  constructor(private http: HttpClient) {}

  downloadCashSaleReport(data: CashSaleData): Observable<Blob> {
    const params = new HttpParams()
      .set("date", data.date)
      .set("amount", data.amount.toString())
      .set("payment_method", data.payment_method)
      .set("particulars", data.particulars);

    return this.http.get(`${ApiConfig.downloadPdfUrl}cash-sale`, {
      params,
      responseType: "blob",
    });
  }

  getReportUrl(data: CashSaleData): string {
    const params = new URLSearchParams({
      date: data.date,
      amount: data.amount.toString(),
      payment_method: data.payment_method,
      particulars: data.particulars,
      reference: data.reference || "",
    });

    return `${ApiConfig.downloadPdfUrl}cash-sale?${params.toString()}`;
  }
}
