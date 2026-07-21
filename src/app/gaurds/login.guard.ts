import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree} from '@angular/router';
import {Observable} from 'rxjs';
import {StorageService} from "../services/storage.service";

@Injectable({
    providedIn: 'root'
})
export class LoginGuard implements CanActivate {
    currentUser: null | undefined;

    constructor(private router: Router, private _storage: StorageService) {
    }

    canActivate(
        route: ActivatedRouteSnapshot,
        state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {

        this.currentUser = null;
        this.currentUser = JSON.parse(this._storage.getStorage('user_info'));
        if (this.currentUser != null) {
            window.location.assign('home');
            return false;

        }
        return true;
    }

}
