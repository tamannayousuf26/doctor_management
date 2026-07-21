// @ts-nocheck
import { Component, OnInit, ViewChild } from "@angular/core";
import { MatTableDataSource } from "@angular/material/table";
import { MatPaginator } from "@angular/material/paginator";
import { MatSort } from "@angular/material/sort";
import { Router } from "@angular/router";
import { OrderService } from "../../services/order.service";
import { ItemService } from "../../services/item.service";
import { AlertMessageService } from "../../services/alert-message.service";

export enum ItemStatus {
  Inactive = 0,
  Active = 1,
}

@Component({
  selector: "app-item-table",
  templateUrl: "./item-table.component.html",
  styleUrls: ["./item-table.component.scss"],
})
export class ItemTableComponent implements OnInit {
  displayedColumns: string[] = ["id", "name", "price", "status", "actions"];
  dataSource: MatTableDataSource<any>;
  itemList: any;
  searchText: string = "";
  selectedStatus: string = "all";

  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator | any;
  @ViewChild(MatSort, { static: true }) sort: MatSort | any;

  constructor(
    private _router: Router,
    private _orderService: OrderService,
    private _itemService: ItemService,
    private _alertMsg: AlertMessageService
  ) {
    this.itemList = [];
    this.dataSource = new MatTableDataSource(this.itemList);
  }

  ngOnInit(): void {
    this.getItemList();
  }

  getItemList() {
    this._orderService.getItemList().subscribe((resp: any) => {
      this.itemList = [];
      this.itemList = resp;
      this.dataSource = new MatTableDataSource(this.itemList);
      this.dataSource.filterPredicate = (data: any, filter: string) => {
        const filterObj = JSON.parse(filter);
        const searchStr = filterObj.search.toLowerCase();
        const statusFilter = filterObj.status;

        const matchesSearch =
          !searchStr ||
          data.id?.toString().includes(searchStr) ||
          data.name?.toLowerCase().includes(searchStr) ||
          data.price?.toString().includes(searchStr);

        const matchesStatus =
          statusFilter === "all" ||
          (statusFilter === "active" && (data.status === 1 || data.status === "1")) ||
          (statusFilter === "inactive" && (data.status === 0 || data.status === "0"));

        return matchesSearch && matchesStatus;
      };
      setTimeout(() => {
        this.dataSource.sort = this.sort;
        this.dataSource.paginator = this.paginator;
      });
    });
  }

  createItem() {
    this._router.navigateByUrl("/item-create").then(() => console.log(""));
  }

  editItem(itemId: any) {
    this._router
      .navigate(["item-create"], { queryParams: { itemId: itemId } })
      .then();
  }

  applyFilter(e: any): void {
    this.searchText = e.value.trim();
    this.applyFilters();
  }

  onStatusFilterChange(status: string): void {
    this.selectedStatus = status;
    this.applyFilters();
  }

  applyFilters(): void {
    const filterObj = {
      search: this.searchText,
      status: this.selectedStatus,
    };
    this.dataSource.filter = JSON.stringify(filterObj);
  }

  getStatusClass(status: any): string {
    return status === 1 || status === "1" ? "status-active" : "status-inactive";
  }

  getStatusText(status: any): string {
    return status === 1 || status === "1" ? "Active" : "Inactive";
  }

  changeItemStatus(item: any) {
    const currentStatus = item.status === 1 || item.status === "1" ? 1 : 0;
    const newStatus = currentStatus === 1 ? 0 : 1;
    const newStatusText = newStatus === 1 ? "Active" : "Inactive";

    this._alertMsg
      .confirmItemStatusChangeAlert(newStatusText, item.name)
      .then((confirmed: any) => {
        if (confirmed) {
          const payload = { id: item.id, status: newStatus };
          this._itemService.changeItemStatus(payload).subscribe(
            (resp: any) => {
              this._alertMsg.successToast("Status updated successfully");
              this.getItemList();
            },
            (error: any) => {
              this._alertMsg.submissionErrorAlert();
            }
          );
        }
      });
  }
}
