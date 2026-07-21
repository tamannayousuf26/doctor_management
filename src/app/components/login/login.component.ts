import {Component, OnInit} from '@angular/core';
import {Router} from "@angular/router";
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {UserModel} from "../../models/user.model";
import {AuthenticationService} from "../../services/authentication.service";
import {AlertMessageService} from "../../services/alert-message.service";

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
    loginForm: FormGroup | any;
    user: UserModel = new UserModel();
    visibilityForPass: boolean = false;

    constructor(private _router: Router,
                private _alertMsg: AlertMessageService,
                private _authService: AuthenticationService) {
        this.initializeForm();
    }

    initializeForm() {
        this.loginForm = new FormGroup({
            username: new FormControl('', Validators.required),
            password: new FormControl('', Validators.required)
        });
    }

    ngOnInit(): void {
        /*  let isLoggedIn = JSON.parse(localStorage.getItem("currentUser") || '{}');

          if (Object.keys(isLoggedIn).length !== 0) {
              this._router.navigateByUrl('/home').then(r => console.log(""));
          }*/
    }

    toggleVisibility() {
        this.visibilityForPass = !this.visibilityForPass;

    }

    onSubmit() {

        if (this.loginForm.valid) {
            this._authService
                .loginServiceMethod(this.loginForm.value)
                .subscribe(
                    (resp: any) => {
                        if (!resp.message) {
                            window.location.assign('home' + '?login=true',);
                            // this._router.navigate(['home'], {state: {needCredentials: true}});
                        } else {
                            // this._messageService.showToastMessage(msg, false);
                        }
                    },
                    (error: any) => this._authService.httpRequestErrorHandler(error));
        }
    }
}
