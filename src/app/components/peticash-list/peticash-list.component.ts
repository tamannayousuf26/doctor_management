import {Component, OnInit, ViewChild} from '@angular/core';
import {MatTableDataSource} from "@angular/material/table";
import {MatPaginator} from "@angular/material/paginator";
import {MatSort} from "@angular/material/sort";
import {Router} from "@angular/router";
import {AlertMessageService} from "../../services/alert-message.service";
import {ExpenseService} from "../../services/expense.service";
import {PeticashService} from "../../services/peticash.service";

export interface PeticashTableElement {
  id: number;
  employee_id: string;
  status: string;
  voucher_no: string;
  amount: number;
  payment_date: string;
  purpose: string;

}

const ELEMENT_DATA: PeticashTableElement[] = [];

@Component({
  selector: 'app-peticash-list',
  templateUrl: './peticash-list.component.html',
  styleUrls: ['./peticash-list.component.scss']
})
export class PeticashListComponent implements OnInit {


  displayedColumns: string[] = ["id", "employee_id", "status", "voucher_no", "amount", "payment_date", "purpose", "actions"];
  dataSource: MatTableDataSource<PeticashTableElement>;
  itemList: PeticashTableElement[];

  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator | any;
  @ViewChild(MatSort, {static: true}) sort: MatSort | any;

  constructor(private _router: Router,
              private _alertMsg: AlertMessageService,
              private _peticashService: PeticashService) {
    this.itemList = ELEMENT_DATA;
    this.dataSource = new MatTableDataSource(this.itemList);
  }

  ngOnInit(): void {
    this.getAllPeticashesList();
  }

  getAllPeticashesList() {
    this._peticashService.getPeticashListRequest().subscribe((resp: any) => {
      this.itemList = [];
      this.itemList = resp;
      this.dataSource = new MatTableDataSource(this.itemList);
      setTimeout(() => {
        this.dataSource.sort = this.sort;
        this.dataSource.paginator = this.paginator
      });
    });
  }

  onChangePeticashStatus(e: any) {
    if (e == 99) {
      this.getAllPeticashesList();
      return;
    }
    this._peticashService.getPeticashListByFilteringStatusType(e).subscribe((resp: any) => {
      this.itemList = [];
      this.itemList = resp;
      this.dataSource = new MatTableDataSource(this.itemList);
      setTimeout(() => {
        this.dataSource.sort = this.sort;
        this.dataSource.paginator = this.paginator
      });
    });
  }

  editPeticash(peticashId: any) {
    this._router.navigate(
        ['peticash/create'],
        {queryParams: {peticashId: peticashId}}
    ).then();
  }

  deletePeticash(peticashId: any) {
    this._alertMsg.deleteItemAlert().then((res: any) => {
      if (res) {
        this._peticashService.deletePeticash(peticashId).subscribe((resp: any) => {
          this.getAllPeticashesList();
          this._alertMsg.successfulSubmissionAlert('Delete Peticash Successfully');
        });
      }
    });
  }

  applyFilter(e: any): void {
    const filterValue = e.value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

}
