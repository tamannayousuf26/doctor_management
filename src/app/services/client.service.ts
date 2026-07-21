import {Injectable} from '@angular/core';
import {Router} from "@angular/router";
import {HttpClient} from "@angular/common/http";
import {ApiConfig} from "../utility/apiConfig";

@Injectable({
    providedIn: 'root'
})
export class ClientService {

    constructor(private _router: Router,
                private http: HttpClient,) {
    }

    clientCreatePostRequest(formData: any) {
        return this.http.post(ApiConfig.baseUrl + ApiConfig.postClientCreate, formData);
    }

    getClientById(id: any) {
        return this.http.get(ApiConfig.baseUrl + ApiConfig.getClientById + id);
    }

    updateClientRequest(formObj: any) {
        return this.http.put(ApiConfig.baseUrl + ApiConfig.putClientDataUpdateRequest, formObj);
    }

    changeClientStatus(data: { id: number; status: number }) {
        return this.http.put(ApiConfig.baseUrl + ApiConfig.putClientStatusUpdate, data);
    }
}
