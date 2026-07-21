import {Injectable} from '@angular/core';
import {BehaviorSubject, from, map, Observable, tap} from "rxjs";
import {Router} from "@angular/router";
import {HttpClient} from "@angular/common/http";
import {StorageService} from "./storage.service";
import {ApiConfig} from "../utility/apiConfig";
import {AlertMessageService} from "./alert-message.service";

@Injectable({
    providedIn: 'root'
})
export class AuthenticationService {
    authState = new BehaviorSubject(false);
    isShowingSideNavBar: boolean = false;

    constructor(
        private _router: Router,
        private http: HttpClient,
        private _alertMsg: AlertMessageService,
        private storageService: StorageService
    ) {
        this.ifLoggedIn();
    }

    setSideNavBarValue(val: any) {
        this.isShowingSideNavBar = val;
    }

    getSideNavBarValue(): boolean {
        return this.isShowingSideNavBar;
    }

    ifLoggedIn() {
        /* this.storageService.get({key: 'user_info'}).then((response: any) => {
               if (response.value) {
                   this.authState.next(true);
                   this.setServerLocation();
                   this.getStorageInfo();
               }
           });*/
    }

    loginServiceMethod(loginForm: any): Observable<any> {
        return this.http.post(ApiConfig.baseUrl + ApiConfig.userLogin, loginForm).pipe(
            tap((resp: any) => {
                if (!resp.message) {
                    this.saveTOStorage(resp);
                } else {
                    this.authState.next(false);
                }
            })
        );
    }

    saveTOStorage(resp: any) {
        let value = JSON.stringify({
            id: resp.id,
            name: resp.name,
            username: resp.username,
            token: resp.token
        });
        this.storageService.setStorage('user_info', value);
        this.authState.next(true);
    }

    httpRequestErrorHandler(error: any) {
        if (error.status == 403) {
            this._alertMsg.unauthorizedRequestErrorAlert();
            this.logout();
        } else if (error.status == 401) {
            this._alertMsg.submittedCredentialErrorAlert();
        }

    }


    logout() {
        this.authState.next(false);
        this.storageService.clearStorage();
        window.location.assign('login');
    }

}
