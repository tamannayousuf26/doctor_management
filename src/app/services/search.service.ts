import {Injectable} from '@angular/core';
import {Router} from "@angular/router";
import {HttpClient} from "@angular/common/http";
import {ApiConfig} from "../utility/apiConfig";

@Injectable({
    providedIn: 'root'
})
export class SearchService {
    constructor(private _router: Router,
                private http: HttpClient,) {
    }

    getClientOrderList(formObj: any) {
        return this.http.get(ApiConfig.baseUrl + `orders/clients/${formObj.id}/start/${formObj.startDate}/end/${formObj.endDate}`);
    }
}
