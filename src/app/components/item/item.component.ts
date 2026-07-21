import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {ItemService} from "../../services/item.service";
import {ActivatedRoute, Router} from "@angular/router";
import {AlertMessageService} from "../../services/alert-message.service";
import {AuthenticationService} from "../../services/authentication.service";
import {MatTableDataSource} from "@angular/material/table";

@Component({
    selector: 'app-item',
    templateUrl: './item.component.html',
    styleUrls: ['./item.component.scss']
})
export class ItemComponent implements OnInit {
    itemFormGroup!: FormGroup;
    updateItemId: any = null;

    constructor(public formBuilder: FormBuilder,
                private _alertMsg: AlertMessageService,
                private _authService: AuthenticationService,
                private _activateRoute: ActivatedRoute,
                private _router: Router, private _itemService: ItemService) {
    }

    ngOnInit(): void {
        this.formInit();
        this.updateItemPart();
    }

    formInit() {
        this.itemFormGroup = this.formBuilder.group({
            name: ['', [Validators.required]],
            price: ['', [Validators.required]],

        });
    }

    updateItemPart() {
        this._activateRoute.queryParams
            .subscribe(params => {
                    this.updateItemId = null;
                    this.updateItemId = params.itemId;
                    console.log(this.updateItemId);
                    if (this.updateItemId)
                        this.fetchItemData(this.updateItemId);
                }
            );
    }

    fetchItemData(id: any) {
        this._itemService.fetchItemsById(id).subscribe((item: any) => {
            console.log(item);
            this.itemFormGroup.patchValue(item);
        });
    }

    onSubmit() {
        if (this.itemFormGroup.valid) {
            if (this.updateItemId) {
                this.editItemRequest();
            } else {
                this.createItemRequest();
            }

        }
    }

    createItemRequest() {
        this._itemService.itemCreatePostRequest(this.itemFormGroup.value)
            .subscribe((resp: any) => {
                console.log(resp);
                this._router.navigateByUrl('/item-list').then();
                this._alertMsg.successfulSubmissionAlert('Item Created Successfully');
            }, (error: any) => this._authService.httpRequestErrorHandler(error));
    }

    editItemRequest() {
        let putReqData = this.itemFormGroup.value;
        putReqData['id'] = this.updateItemId;
        console.log(putReqData);
        this._itemService.itemUpdatePutRequest(this.itemFormGroup.value)
            .subscribe((resp: any) => {
                console.log(resp);
                this._router.navigateByUrl('/item-list').then();
                this._alertMsg.successfulSubmissionAlert('Item Updated Successfully');
            }, (error: any) => this._authService.httpRequestErrorHandler(error));
    }

    cancel() {
        this._router.navigateByUrl('/item-list').then();
    }

}
