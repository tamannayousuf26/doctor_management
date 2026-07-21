import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {EmployeeService} from "../../services/employee.service";
import {ActivatedRoute, Router} from "@angular/router";
import {AlertMessageService} from "../../services/alert-message.service";
import {AuthenticationService} from "../../services/authentication.service";
import {MatTableDataSource} from "@angular/material/table";

@Component({
    selector: 'app-employee-create',
    templateUrl: './employee-create.component.html',
    styleUrls: ['./employee-create.component.scss']
})
export class EmployeeCreateComponent implements OnInit {
    url: any;
    employeeFormGroup!: FormGroup;
    imageFile!: File;
    updateEmployeeId: any = null;

    constructor(public formBuilder: FormBuilder,
                private _alertMsg: AlertMessageService,
                private _activateRoute: ActivatedRoute,
                private _authService: AuthenticationService,
                private _router: Router, private _employeeService: EmployeeService) {
    }

    ngOnInit(): void {
        this.formInit();
        this.updateEmployee();
    }

    updateEmployee() {
        this._activateRoute.queryParams
            .subscribe(params => {
                    this.updateEmployeeId = null;
                    this.updateEmployeeId = params.employeeId;
                    console.log(this.updateEmployeeId);
                    if (this.updateEmployeeId)
                        this.fetchEmployeeData(this.updateEmployeeId);
                }
            );
    }

    fetchEmployeeData(id: any) {
        this._employeeService.getEmployeeById(id).subscribe((employee: any) => {
            console.log(employee);
            this.employeeFormGroup.patchValue({
                name: employee.name,
                phone: employee.phone,
                address: employee.address,
                nid: employee.nid,
            });
        });
    }

    formInit() {
        this.employeeFormGroup = this.formBuilder.group({
            name: ['', [Validators.required]],
            phone: ['', [Validators.required]],
            address: ['', [Validators.required]],
            nid: [''],
        });
    }

    onSubmit() {
        if (this.employeeFormGroup.valid) {
            if (this.updateEmployeeId) {
                const formObj = this.employeeFormGroup.value;
                formObj['id'] = this.updateEmployeeId;
                console.log(formObj);
                this.updateEmployeeHttpRequest(formObj);
            } else {
                const formData = this.createPOSTRequestFormData();
                this.createEmployeeHttpRequest(formData);
            }

        }
    }

    updateEmployeeHttpRequest(formData: any) {
        this._employeeService.updateEmployeeRequest(formData)
            .subscribe((resp: any) => {
                console.log(resp);
                this._router.navigateByUrl('/employee-list').then();
                this._alertMsg.successfulSubmissionAlert('Employee Updated Successfully');
            }, (error: any) => this._authService.httpRequestErrorHandler(error));
    }

    createEmployeeHttpRequest(formData: FormData) {
        this._employeeService.employeeCreatePostRequest(formData)
            .subscribe((resp: any) => {
                console.log(resp);
                this._router.navigateByUrl('/employee-list').then();
                this._alertMsg.successfulSubmissionAlert('Employee Created Successfully');
            }, (error: any) => this._authService.httpRequestErrorHandler(error));

    }

    createPOSTRequestFormData(): FormData {
        const formData = new FormData();
        formData.append('nid', this.imageFile);
        formData.append('name', this.employeeFormGroup.value.name);
        formData.append('phone', this.employeeFormGroup.value.phone);
        formData.append('address', this.employeeFormGroup.value.address);
        return formData;
    }

    onFileSelected(event: any) {
        this.imageFile = event.target.files[0];
        if (this.imageFile) {
            console.log(this.imageFile.name);
            console.log(this.imageFile.size);
            const reader = new FileReader();
            reader.readAsDataURL(this.imageFile);

            reader.onload = (_event) => {
                this.url = reader.result;
            }
            this.employeeFormGroup.patchValue({
                nid: this.imageFile
            });
        }
    }

    cancel() {
        this._router.navigateByUrl('/employee-list').then();
    }

}
