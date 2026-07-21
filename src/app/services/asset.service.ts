import {Injectable} from '@angular/core';
import {Router} from "@angular/router";
import {HttpClient} from "@angular/common/http";
import {ApiConfig} from "../utility/apiConfig";

@Injectable({
    providedIn: 'root'
})
export class AssetService {

    constructor(private _router: Router,
                private http: HttpClient,) {
    }

    assetCreatePostRequest(formData: any) {
        return this.http.post(ApiConfig.baseUrl + ApiConfig.postAssetCreate, formData);
    }

    assetUpdatePutRequest(formData: any) {
        return this.http.put(ApiConfig.baseUrl + ApiConfig.putAssetUpdate, formData);
    }

    getAssetListRequest() {
        return this.http.get(ApiConfig.baseUrl + ApiConfig.getAssetList);
    }

    getAssetById(id: any) {
        return this.http.get(ApiConfig.baseUrl + ApiConfig.getAssetByAssetId + id);
    }
}
