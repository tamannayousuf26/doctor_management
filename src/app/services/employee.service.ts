import {Injectable} from '@angular/core';
import {Router} from "@angular/router";
import {HttpClient} from "@angular/common/http";
import {ApiConfig} from "../utility/apiConfig";

@Injectable({
    providedIn: 'root'
})
export class EmployeeService {

    constructor(private _router: Router,
                private http: HttpClient,) {
    }

    employeeCreatePostRequest(formData: any) {
        return this.http.post(ApiConfig.baseUrl + ApiConfig.postEmployeeCreate, formData);

    }

    getEmployeeById(id: any) {
        return this.http.get(ApiConfig.baseUrl + ApiConfig.getEmployeeById + id);
    }

    updateEmployeeRequest(formObj: any) {
        return this.http.put(ApiConfig.baseUrl + ApiConfig.putEmployeeUpdateRequest, formObj);
    }

    changeEmployeeStatus(data: { id: number; status: number }) {
        return this.http.put(ApiConfig.baseUrl + ApiConfig.putEmployeeStatusUpdate, data);
    }

}
