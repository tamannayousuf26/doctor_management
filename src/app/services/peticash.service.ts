import {Injectable} from '@angular/core';
import {Router} from "@angular/router";
import {HttpClient} from "@angular/common/http";
import {ApiConfig} from "../utility/apiConfig";

@Injectable({
    providedIn: 'root'
})
export class PeticashService {
    constructor(private _router: Router,
                private http: HttpClient,) {
    }

    peticashCreatePostRequest(formData: any) {
        return this.http.post(ApiConfig.baseUrl + ApiConfig.postPeticashCreate, formData);
    }

    peticashUpdatePutRequest(formData: any) {
        return this.http.put(ApiConfig.baseUrl + ApiConfig.putPeticashUpdate, formData);
    }

    getPeticashListRequest() {
        return this.http.get(ApiConfig.baseUrl + ApiConfig.getPeticashList);
    }

    getPeticashById(id: any) {
        return this.http.get(ApiConfig.baseUrl + ApiConfig.getPeticashByPeticashId + id);
    }

    deletePeticash(id: any) {
        return this.http.delete(ApiConfig.baseUrl + ApiConfig.deletePeticashByPeticashId + id);

    }

    getPeticashListByFilteringStatusType(id: any) {
        return this.http.get(ApiConfig.baseUrl + ApiConfig.getPeticashListByStatus + id);
    }
}
