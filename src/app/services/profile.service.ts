import {Injectable} from '@angular/core';
import {Router} from "@angular/router";
import {HttpClient} from "@angular/common/http";
import {ApiConfig} from "../utility/apiConfig";

@Injectable({
    providedIn: 'root'
})
export class ProfileService {
    constructor(private _router: Router,
                private http: HttpClient,) {
    }

    changePasswordPutRequest(formObj: any) {
        return this.http.put(ApiConfig.baseUrl + ApiConfig.putPasswordChange, formObj);
    }
}
