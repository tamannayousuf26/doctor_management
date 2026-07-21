import {Injectable} from '@angular/core';
import {Router} from "@angular/router";
import {HttpClient} from "@angular/common/http";
import {ApiConfig} from "../utility/apiConfig";

@Injectable({
    providedIn: 'root'
})
export class TodayService {


    constructor(private _router: Router,
                private http: HttpClient,) {
    }

    getTodayOrderReceivedList(todayDate: any) {
        return this.http.get(ApiConfig.baseUrl + ApiConfig.getOrderTodayReceived + "/" + todayDate);
    }

    getDateWiseTodayOrderReceivedList(date: any) {
        return this.http.get(ApiConfig.baseUrl + ApiConfig.getOrderTodayReceived + '/' + date);
    }

    getTodayOrderDeliveredList(todayDate: any) {
        return this.http.get(ApiConfig.baseUrl + ApiConfig.getOrderTodayDelivered + "/" + todayDate);
    }

    getDateWiseTodayOrderDeliveredList(date: any) {
        return this.http.get(ApiConfig.baseUrl + ApiConfig.getOrderTodayDelivered + '/' + date);
    }


}
