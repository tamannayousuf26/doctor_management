import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree} from '@angular/router';
import {Observable} from 'rxjs';
import {StorageService} from "../services/storage.service";

@Injectable({
    providedIn: 'root'
})
export class AuthGuard implements CanActivate {
    currentUser: null | undefined;

    constructor(private router: Router, private _storage: StorageService) {
    }

    canActivate(
        route: ActivatedRouteSnapshot,
        state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {

        this.currentUser = JSON.parse(this._storage.getStorage('user_info'));
        if (this.currentUser == null) {
            this.router.navigate(["login"]);
            return false;
        }
        return true;
    }

}
