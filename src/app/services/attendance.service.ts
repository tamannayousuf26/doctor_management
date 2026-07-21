import {Injectable} from '@angular/core';
import {Observable, tap} from "rxjs";
import {ApiConfig} from "../utility/apiConfig";
import {Router} from "@angular/router";
import {HttpClient} from "@angular/common/http";

@Injectable({
    providedIn: 'root'
})
export class AttendanceService {

    constructor(private _router: Router, private http: HttpClient) {
    }

    getEmployeeList(): Observable<any> {
        return this.http.get(ApiConfig.baseUrl + ApiConfig.getEmployeeList);
    }

    postAttendance(postData: any) {
        return this.http.post(ApiConfig.baseUrl + ApiConfig.postEmployeeAttendance, postData);
    }

    getAttendanceList() {

        return this.http.get(ApiConfig.baseUrl + ApiConfig.getAttendanceList);
    }
}
