import {Component, OnInit, ViewChild} from '@angular/core';
import {MatTableDataSource} from "@angular/material/table";
import {MatPaginator} from "@angular/material/paginator";
import {MatSort} from "@angular/material/sort";
import {Router} from "@angular/router";
import {AlertMessageService} from "../../services/alert-message.service";
import {PurchaseService} from "../../services/purchase.service";

export interface PurchaseTableElement {
    id: number;
    employee_id: string;
    name: string;
    purchase_no: string;
    amount: number;
    purchase_date: string;
    voucher_no: string;
}


const ELEMENT_DATA: PurchaseTableElement[] = [];

@Component({
    selector: 'app-purchase-list',
    templateUrl: './purchase-list.component.html',
    styleUrls: ['./purchase-list.component.scss']
})
export class PurchaseListComponent implements OnInit {
    displayedColumns: string[] = ["id", "employee_id", "name", "purchase_no", "amount", "purchase_date", "voucher_no", "actions"];
    dataSource: MatTableDataSource<PurchaseTableElement>;
    itemList: PurchaseTableElement[];

    @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator | any;
    @ViewChild(MatSort, {static: true}) sort: MatSort | any;

    constructor(private _router: Router,
                private _alertMsg: AlertMessageService,
                private _purchaseService: PurchaseService) {
        this.itemList = ELEMENT_DATA;
        this.dataSource = new MatTableDataSource(this.itemList);
    }


    ngOnInit(): void {
        this.getAllPurchaseList();
    }

    getAllPurchaseList() {
        this._purchaseService.getPurchaseListRequest().subscribe((resp: any) => {
            this.itemList = [];
            this.itemList = resp;
            this.dataSource = new MatTableDataSource(this.itemList);
            setTimeout(() => {
                this.dataSource.sort = this.sort;
                this.dataSource.paginator = this.paginator
            });
        });
    }

    editPurchase(purchaseId: any) {
        this._router.navigate(
            ['purchase/create'],
            {queryParams: {purchaseId: purchaseId}}
        ).then();
    }

    deletePurchase(purchaseId: any) {
        this._alertMsg.deleteItemAlert().then((res: any) => {
            if (res) {
                this._purchaseService.deletePurchase(purchaseId).subscribe((resp: any) => {
                    this.getAllPurchaseList();
                    this._alertMsg.successfulSubmissionAlert('Delete Purchase Successfully');
                });
            }
        });
    }

    applyFilter(e: any): void {
        const filterValue = e.value;
        this.dataSource.filter = filterValue.trim().toLowerCase();
    }

}
