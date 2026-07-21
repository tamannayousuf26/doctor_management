import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { HttpClient } from "@angular/common/http";
import { ApiConfig } from "../utility/apiConfig";

@Injectable({
  providedIn: "root",
})
export class OrderService {
  constructor(private _router: Router, private http: HttpClient) {}

  getOrderById(id: any) {
    return this.http.get(ApiConfig.baseUrl + "orders/" + id);
  }

  getEmployeeList() {
    return this.http.get(ApiConfig.baseUrl + ApiConfig.getEmployeeList);
  }

  getActiveEmployeeList() {
    return this.http.get(ApiConfig.baseUrl + ApiConfig.getActiveEmployeeList);
  }

  getClientList() {
    return this.http.get(ApiConfig.baseUrl + ApiConfig.getClientList);
  }

  getActiveClientList() {
    return this.http.get(ApiConfig.baseUrl + ApiConfig.getActiveClientList);
  }

  getItemList() {
    return this.http.get(ApiConfig.baseUrl + ApiConfig.getItemList);
  }
  getActiveItemList() {
    return this.http.get(ApiConfig.baseUrl + ApiConfig.getActiveItemList);
  }

  orderCreatePostRequest(formData: any) {
    return this.http.post(
      ApiConfig.baseUrl + ApiConfig.postOrderCreate,
      formData
    );
  }

  orderUpdatePutRequest(formData: any) {
    return this.http.put(
      ApiConfig.baseUrl + ApiConfig.putOrderUpdate,
      formData
    );
  }

  getOrderListRequest() {
    //return this.http.get(ApiConfig.baseUrl + ApiConfig.getOrderList);
    return this.http.get(ApiConfig.baseUrl + ApiConfig.getOrderListPagewise);
  }

  changeOrderStatus(formObj: any) {
    return this.http.put(
      ApiConfig.baseUrl + ApiConfig.putOrderStatusUpdate,
      formObj
    );
  }

  changePaymentStatus(formObj: any) {
    return this.http.put(
      ApiConfig.baseUrl + ApiConfig.putPaymentStatusUpdate,
      formObj
    );
  }

  deleteOrderById(id: any) {
    return this.http.delete(
      ApiConfig.baseUrl + ApiConfig.deleteOrder + "/" + id
    );
  }

  navigateToNextPage(url: any) {
    return this.http.get(url);
  }

  navigateToPreviousPage(url: any) {
    return this.http.get(url);
  }

  navigateToNumberPage(number: any) {
    return this.http.get(ApiConfig.baseUrl + ApiConfig.page + number);
  }

  searchQueryForOrder(queryWord: any) {
    return this.http.get(ApiConfig.baseUrl + ApiConfig.searchOrder + queryWord);
  }

  searchQueryForOrderWithPage(queryWord: any, pageNumber: number) {
    return this.http.get(
      ApiConfig.baseUrl +
        ApiConfig.searchOrder +
        queryWord +
        "?page=" +
        pageNumber
    );
  }

  markAllOrdersAsPaid(payload: any) {
    return this.http.put(ApiConfig.baseUrl + ApiConfig.markAllAsPaid, payload);
  }

  markSelectedOrdersAsPaid(payload: any) {
    return this.http.put(
      ApiConfig.baseUrl + ApiConfig.markSelectedAsPaid,
      payload
    );
  }
}
