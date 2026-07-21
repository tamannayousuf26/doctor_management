import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {EmployeeService} from "../../services/employee.service";
import {ClientService} from "../../services/client.service";
import {ActivatedRoute, Router} from "@angular/router";
import {AlertMessageService} from "../../services/alert-message.service";
import {AuthenticationService} from "../../services/authentication.service";

@Component({
    selector: 'app-client-create',
    templateUrl: './client-create.component.html',
    styleUrls: ['./client-create.component.scss']
})
export class ClientCreateComponent implements OnInit {

    url: any;
    clientFormGroup!: FormGroup;
    imageFile!: File;
    updateClientId: any = null;

    constructor(public formBuilder: FormBuilder,
                private _alertMsg: AlertMessageService,
                private _authService: AuthenticationService,
                private _activateRoute: ActivatedRoute,
                private _router: Router, private _clientService: ClientService) {
    }

    ngOnInit(): void {
        this.formInit();
        this.updateClient();
    }

    formInit() {
        this.clientFormGroup = this.formBuilder.group({
            name: ['', [Validators.required]],
            doctor_name: ['', [Validators.required]],
            phone: ['', [Validators.required]],
            address: ['', [Validators.required]],
            // photo: ['',],
        });
    }

    updateClient() {
        this._activateRoute.queryParams
            .subscribe(params => {
                    this.updateClientId = null;
                    this.updateClientId = params.clientId;
                    console.log(this.updateClientId);
                    if (this.updateClientId)
                        this.fetchClientData(this.updateClientId);
                }
            );
    }

    fetchClientData(id: any) {
        this._clientService.getClientById(id).subscribe((employee: any) => {
            console.log(employee);
            this.clientFormGroup.patchValue({
                name: employee.name,
                doctor_name: employee.doctor_name,
                phone: employee.phone,
                address: employee.address,
            });
        });
    }

    onSubmit() {
        if (this.clientFormGroup.valid) {
            if (this.updateClientId) {
                const formObj = this.clientFormGroup.value;
                formObj['id'] = this.updateClientId;
                console.log(formObj);
                this.updateClientHttpRequest(formObj);
            } else {
                const formData = this.createPostRequestFormData();
                this.createClientHttpRequest(formData);
            }
        }
    }

    updateClientHttpRequest(formData: any) {
        this._clientService.updateClientRequest(formData)
            .subscribe((resp: any) => {
                console.log(resp);
                this._router.navigateByUrl('/client-list').then();
                this._alertMsg.successfulSubmissionAlert('Client Updated Successfully');
            }, (error: any) => this._authService.httpRequestErrorHandler(error));
    }

    createClientHttpRequest(formData: FormData) {
        this._clientService.clientCreatePostRequest(formData)
            .subscribe((resp: any) => {
                console.log(resp);
                this._alertMsg.successfulSubmissionAlert('Client Created Successfully');
                this._router.navigateByUrl('/client-list').then();
            }, (error: any) => this._authService.httpRequestErrorHandler(error));
    }


    createPostRequestFormData(): FormData {
        const formData = new FormData();
        formData.append('name', this.clientFormGroup.value.name);
        formData.append('doctor_name', this.clientFormGroup.value.doctor_name);
        formData.append('phone', this.clientFormGroup.value.phone);
        formData.append('address', this.clientFormGroup.value.address);
        return formData;
    }

    cancel() {
        this._router.navigateByUrl('/client-list').then();
    }
}
