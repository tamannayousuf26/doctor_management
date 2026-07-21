import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {EmployeeService} from "../../services/employee.service";
import {ProfileService} from "../../services/profile.service";
import {AlertMessageService} from "../../services/alert-message.service";
import {AuthenticationService} from "../../services/authentication.service";
import {StorageService} from "../../services/storage.service";

@Component({
    selector: 'app-profile',
    templateUrl: './profile.component.html',
    styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {
    currentUser!: any;
    profileFormGroup!: FormGroup;
    visibilityForPass: boolean = false;
    visibilityForNewPass: boolean = false;
    visibilityForConfirmedPass: boolean = false;
    isDisabled: boolean = true;

    constructor(public formBuilder: FormBuilder,
                private _storage: StorageService,
                private _alertMsg: AlertMessageService,
                private _authService: AuthenticationService,
                private _profileService: ProfileService) {
    }

    ngOnInit(): void {
        this.formInit();
        this.getUserId();
    }

    getUserId() {
        this.currentUser = JSON.parse(this._storage.getStorage('user_info'));
        this.profileFormGroup.patchValue({
            username: this.currentUser.username,
        })
    }

    toggleVisibility(params: string) {
        if (params == 'password') {
            this.visibilityForPass = !this.visibilityForPass;
        } else if (params == 'new') {
            this.visibilityForNewPass = !this.visibilityForNewPass;
        } else if (params == 'confirmed') {
            this.visibilityForConfirmedPass = !this.visibilityForConfirmedPass;
        }

    }

    formInit() {
        this.profileFormGroup = this.formBuilder.group({
            username: ['', [Validators.required]],
            old_password: ['', [Validators.required]],
            password: ['', [Validators.required]],
            password_confirmation: ['', [Validators.required]],
        });
    }

    onSubmit() {
        if (this.profileFormGroup.valid) {
            console.log(this.profileFormGroup.value)
            this._profileService.changePasswordPutRequest(this.profileFormGroup.value)
                .subscribe((resp: any) => {
                    this._alertMsg.successfulSubmissionAlert('Password Changed Successfully');
                    this._authService.logout();
                }, (error: any) => this._authService.httpRequestErrorHandler(error));
        }
    }

}
