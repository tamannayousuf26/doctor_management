import {Injectable} from '@angular/core';
import {StorageService} from "./storage.service";
import {from, map, Observable, switchMap} from "rxjs";
import {HttpEvent, HttpHandler, HttpRequest} from "@angular/common/http";

@Injectable({
    providedIn: 'root'
})
export class AuthInterceptorService {
    currentUser: null | undefined;

    constructor(private _storageService: StorageService) {
    }

    intercept(
        req: HttpRequest<any>,
        next: HttpHandler
    ): Observable<HttpEvent<any>> {
        this.currentUser = JSON.parse(this._storageService.getStorage('user_info'));
        if (this.currentUser == null) {
            return next.handle(req);
        }
        const header = req.headers.append(
            'Authorization',
            `Bearer ${this.currentUser['token']}`
        );
        const modifiedReq = req.clone({
            headers: header,
        });
        return next.handle(modifiedReq);

    }
}
