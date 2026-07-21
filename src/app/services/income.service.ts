import {Injectable} from '@angular/core';
import {Router} from "@angular/router";
import {HttpClient} from "@angular/common/http";
import {ApiConfig} from "../utility/apiConfig";

@Injectable({
    providedIn: 'root'
})
export class IncomeService {

    constructor(private _router: Router,
                private http: HttpClient,) {
    }

    incomeCreatePostRequest(formData: any) {
        return this.http.post(ApiConfig.baseUrl + ApiConfig.postIncomeCreate, formData);
    }

    incomeUpdatePutRequest(formData: any) {
        return this.http.put(ApiConfig.baseUrl + ApiConfig.putIncomeUpdate, formData);
    }

    getIncomeListRequest() {
        return this.http.get(ApiConfig.baseUrl + ApiConfig.getIncomeList);
    }

    getIncomeById(id: any) {
        return this.http.get(ApiConfig.baseUrl + ApiConfig.getIncomeByIncomeId + id);
    }
}
