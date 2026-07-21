import {Injectable} from '@angular/core';
import {Router} from "@angular/router";
import {HttpClient} from "@angular/common/http";
import {ApiConfig} from "../utility/apiConfig";

@Injectable({
    providedIn: 'root'
})
export class PurchaseService {
    constructor(private _router: Router,
                private http: HttpClient,) {
    }

    purchaseCreatePostRequest(formData: any) {
        return this.http.post(ApiConfig.baseUrl + ApiConfig.postPurchaseCreate, formData);
    }

    purchaseUpdatePutRequest(formData: any) {
        return this.http.put(ApiConfig.baseUrl + ApiConfig.putPurchaseUpdate, formData);
    }

    getPurchaseListRequest() {
        return this.http.get(ApiConfig.baseUrl + ApiConfig.getPurchaseList);
    }

    getPurchaseById(id: any) {
        return this.http.get(ApiConfig.baseUrl + ApiConfig.getPurchaseByPurchaseId + id);
    }

    deletePurchase(id: any) {
        return this.http.delete(ApiConfig.baseUrl + ApiConfig.deletePurchaseByPurchaseId + id);
    }
}
