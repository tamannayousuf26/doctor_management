import {Component, OnInit, ViewChild} from '@angular/core';
import {MatTableDataSource} from "@angular/material/table";
import {MatPaginator} from "@angular/material/paginator";
import {MatSort} from "@angular/material/sort";
import {Router} from "@angular/router";
import {AlertMessageService} from "../../services/alert-message.service";
import {AssetService} from "../../services/asset.service";

export interface AssetTableElement {
    id: number;
    buying_time: string;
    name: string;
    description: string;
    employee_id: string;
    amount: number;
}


const ELEMENT_DATA: AssetTableElement[] = [];

@Component({
    selector: 'app-asset-list',
    templateUrl: './asset-list.component.html',
    styleUrls: ['./asset-list.component.scss']
})
export class AssetListComponent implements OnInit {
    displayedColumns: string[] = ["id", "buying_time", "name", "description", "employee_id", "amount", "actions"];
    dataSource: MatTableDataSource<AssetTableElement>;
    itemList: AssetTableElement[];

    @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator | any;
    @ViewChild(MatSort, {static: true}) sort: MatSort | any;

    constructor(private _router: Router,
                private _alertMsg: AlertMessageService,
                private _assetService: AssetService) {
        this.itemList = ELEMENT_DATA;
        this.dataSource = new MatTableDataSource(this.itemList);
    }


    ngOnInit(): void {
        this.getAssetsList();
    }

    getAssetsList() {
        this._assetService.getAssetListRequest().subscribe((resp: any) => {
            this.itemList = [];
            this.itemList = resp;
            this.dataSource = new MatTableDataSource(this.itemList);
            setTimeout(() => {
                this.dataSource.sort = this.sort;
                this.dataSource.paginator = this.paginator
            });
        });
    }

    editAsset(assetId: any) {
        this._router.navigate(
            ['asset/create'],
            {queryParams: {assetId: assetId}}
        ).then();
    }

    applyFilter(e: any): void {
        const filterValue = e.value;
        this.dataSource.filter = filterValue.trim().toLowerCase();
    }
}
