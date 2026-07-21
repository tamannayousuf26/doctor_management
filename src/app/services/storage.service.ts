import {Injectable} from '@angular/core';
import {Router} from "@angular/router";

@Injectable({
    providedIn: 'root'
})
export class StorageService {
    token: string | any;
    url: string | any;

    constructor() {
    }

    setStorage(key: any, value: any) {
        localStorage.setItem(key, value);
    }

    getStorage(key: any): any {
        return localStorage.getItem(key);
    }

    clearStorage() {
        localStorage.clear();
    }
}
