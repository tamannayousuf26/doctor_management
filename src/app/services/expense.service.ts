import {Injectable} from '@angular/core';
import {Router} from "@angular/router";
import {HttpClient} from "@angular/common/http";
import {ApiConfig} from "../utility/apiConfig";

@Injectable({
    providedIn: 'root'
})
export class ExpenseService {
    constructor(private _router: Router,
                private http: HttpClient,) {
    }

    expenseCreatePostRequest(formData: any) {
        return this.http.post(ApiConfig.baseUrl + ApiConfig.postExpenseCreate, formData);
    }

    expenseUpdatePutRequest(formData: any) {
        return this.http.put(ApiConfig.baseUrl + ApiConfig.putExpenseUpdate, formData);
    }

    getExpenseListRequest() {
        return this.http.get(ApiConfig.baseUrl + ApiConfig.getExpenseList);
    }

    getExpenseById(id: any) {
        return this.http.get(ApiConfig.baseUrl + ApiConfig.getExpenseByExpenseId + id);
    }

    deleteExpense(id: any) {
        return this.http.delete(ApiConfig.baseUrl + ApiConfig.deleteExpenseByExpenseId + id);

    }

    getExpenseListByFilteringExpenseType(id: any) {
        return this.http.get(ApiConfig.baseUrl + ApiConfig.getExpenseListByType + id);
    }
}
