import {Injectable} from '@angular/core';
import {Router} from "@angular/router";
import {HttpClient} from "@angular/common/http";
import {ApiConfig} from "../utility/apiConfig";

@Injectable({
    providedIn: 'root'
})
export class ItemService {

    constructor(private _router: Router,
                private http: HttpClient,) {
    }

    itemCreatePostRequest(formData: any) {
        return this.http.post(ApiConfig.baseUrl + ApiConfig.postItemCreate, formData);
    }

    itemUpdatePutRequest(formObj: any) {
        return this.http.put(ApiConfig.baseUrl + ApiConfig.putItemUpdate, formObj);

    }

    fetchItemsById(id: any) {
        return this.http.get(ApiConfig.baseUrl + ApiConfig.getItemByItemId + id);
    }

    changeItemStatus(data: { id: number; status: number }) {
        return this.http.put(ApiConfig.baseUrl + ApiConfig.putItemStatusUpdate, data);
    }
}
