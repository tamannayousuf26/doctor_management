import {Component, OnInit, ViewChild} from '@angular/core';
import {MatTableDataSource} from "@angular/material/table";
import {MatPaginator} from "@angular/material/paginator";
import {MatSort} from "@angular/material/sort";
import {Router} from "@angular/router";
import {AlertMessageService} from "../../services/alert-message.service";
import {IncomeService} from "../../services/income.service";

export interface IncomeTableElement {
    id: number;
    employee_id: string;
    client_id: string;
    type: string;
    total_amount: number;
    payment_date: string;
    remarks: string;
}


const ELEMENT_DATA: IncomeTableElement[] = [];

@Component({
    selector: 'app-income-list',
    templateUrl: './income-list.component.html',
    styleUrls: ['./income-list.component.scss']
})
export class IncomeListComponent implements OnInit {

    totalPayment: number = 0;
    totalDue:number = 0;
    displayedColumns: string[] = ["id", "employee_id", "client_id", "type", "total_amount", "payment_date", "remarks", "actions"];
    dataSource: MatTableDataSource<IncomeTableElement>;
    itemList: IncomeTableElement[];

    @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator | any;
    @ViewChild(MatSort, {static: true}) sort: MatSort | any;

    constructor(private _router: Router,
                private _alertMsg: AlertMessageService,
                private _incomeService: IncomeService) {
        this.itemList = ELEMENT_DATA;
        this.dataSource = new MatTableDataSource(this.itemList);
    }


    ngOnInit(): void {
        this.getAIncomesList();
    }

    getAIncomesList() {
        this._incomeService.getIncomeListRequest().subscribe((resp: any) => {
            this.itemList = [];
            this.itemList = resp;
            this.itemList.forEach((item)=>{
                if(item.type == "0"){
                    this.totalPayment += item.total_amount;
                }else{
                    this.totalDue += item.total_amount;
                }
            });
            this.dataSource = new MatTableDataSource(this.itemList);
            setTimeout(() => {
                this.dataSource.sort = this.sort;
                this.dataSource.paginator = this.paginator
            });
        });
    }

    editIncome(incomeId: any) {
        this._router.navigate(
            ['income/create'],
            {queryParams: {incomeId: incomeId}}
        ).then();
    }

    applyFilter(e: any): void {
        const filterValue = e.value;
        this.dataSource.filter = filterValue.trim().toLowerCase();
    }

}
